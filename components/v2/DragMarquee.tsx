"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";

type Props = {
  /** Klasse på ytterelementet (overflow: hidden). F.eks. `props-mq`. */
  wrapClassName: string;
  /** Klasse på sporet som flyttes. F.eks. `props`. */
  trackClassName: string;
  /**
   * Rendrer ett sett med kort. Kalles tre ganger: én gang ekte, to ganger som
   * kopi. Kopiene får `clone = true` så de kan merkes aria-hidden og tas ut av
   * tab-rekkefølgen – de finnes kun for å gjøre løkken sømløs.
   */
  renderSet: (clone: boolean) => ReactNode;
};

/**
 * Kortkarusellen fra v2-designet: driver rolig sidelengs av seg selv, pauser
 * ved hover, og kan dras med mus eller finger med etterslep.
 *
 * Portert fra `marquee()` i designets script. Ett avvik: designet klonet
 * DOM-nodene med `cloneNode`, mens vi rendrer tre sett i JSX. Det er grunnen
 * til at `setW` fortsatt regnes ut som `scrollWidth / 3`.
 *
 * Sporet flyttes med `transform` utenfor React sin render-syklus. Å gå via
 * state her ville gitt en re-render per animasjonsbilde.
 */
export default function DragMarquee({
  wrapClassName,
  trackClassName,
  renderSet,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let off = 0;
    let paused = false;
    let vel = 0;
    let setWidth = 0;
    let moved = 0;
    let visible = false;
    let sleeping = false;
    let drag: { x: number; off: number } | null = null;
    let frame = 0;
    let last = performance.now();

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const measure = () => {
      setWidth = track.scrollWidth / 3;
    };
    measure();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Sov når karusellen er utenfor skjermen, så vi ikke brenner rAF på den.
      if (!visible) {
        sleeping = true;
        return;
      }

      if (!drag) {
        if (Math.abs(vel) > 0.1) {
          off += vel;
          vel *= 0.94; // etterslep etter at fingeren slipper
        } else if (!paused && !reduce) {
          off += 32 * dt; // rolig drift, 32 px/s
        }
      }

      if (setWidth > 0) {
        off = ((off % setWidth) + setWidth) % setWidth;
        track.style.transform = `translateX(${(-off).toFixed(1)}px)`;
      }

      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!sleeping) return;
      sleeping = false;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) wake();
      },
      { rootMargin: "80px" },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, off };
      moved = 0;
      vel = 0;
      wrap.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const next = drag.off - (e.clientX - drag.x);
      moved += Math.abs(next - off);
      vel = next - off;
      off = next;
    };
    const onUp = () => {
      drag = null;
    };
    // Har brukeren dratt, skal slippet ikke telle som et klikk på kortet under.
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Pause-ved-hover bindes bare på enheter som faktisk kan hovre. På touch
    // fyrer iOS Safari `mouseenter` ved tapp uten å fyre `mouseleave` igjen, og
    // karusellen ville da blitt stående permanent i pause. Designet hadde denne
    // feilen.
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      wrap.addEventListener("mouseenter", onEnter);
      wrap.addEventListener("mouseleave", onLeave);
    }
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    wrap.addEventListener("click", onClick, true);

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      if (canHover) {
        wrap.removeEventListener("mouseenter", onEnter);
        wrap.removeEventListener("mouseleave", onLeave);
      }
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <div className={`${wrapClassName} rv`} ref={wrapRef}>
      <div className={trackClassName} ref={trackRef}>
        {[0, 1, 2].map((copy) => (
          <Fragment key={copy}>{renderSet(copy > 0)}</Fragment>
        ))}
      </div>
    </div>
  );
}
