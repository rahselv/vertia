"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { apartments, walkPositions } from "./showcaseData";

/** Hvor mye bildet kan panoreres, i prosent. Fra designet. */
const PAN_X = 33.4;
const PAN_Y = 26;

type PanController = {
  reset: () => void;
  apply: () => void;
};

/**
 * Fremvisningen – «Boligen vises i verdensklasse».
 *
 * Portert fra designets script. Tre lag med interaksjon:
 *   1. Bytte bolig og rom via knapper, og bilde via pilene.
 *   2. Crossfade mellom to <img> som ligger oppå hverandre.
 *   3. Se-deg-rundt: bildet er større enn scenen og panoreres ved dra, med
 *      utjevning så bevegelsen ikke føles rykkete.
 *
 * Bilde og transform styres med refs og direkte DOM-skriving, ikke state.
 * Panoreringen oppdaterer hver frame, og state ville gitt en full re-render
 * per frame.
 *
 * Mobil: `.fv-stage` har `touch-action: pan-y` i CSS, så vertikal sidescroll
 * fortsetter å virke mens vannrett dra panorerer bildet. Nettleseren sender
 * `pointercancel` når den overtar for scroll, og vi avslutter draget da.
 */
export default function ShowcaseV2() {
  const [aptIdx, setAptIdx] = useState(0);
  const [roomIdx, setRoomIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const imgARef = useRef<HTMLImageElement>(null);
  const imgBRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<"a" | "b">("a");
  const panRef = useRef<PanController | null>(null);

  const apartment = apartments[aptIdx];
  const room = apartment.rooms[roomIdx];
  const multiple = room.images.length > 1;
  const nextRoom = apartment.rooms[(roomIdx + 1) % apartment.rooms.length];
  const walkPos = walkPositions[roomIdx % walkPositions.length];

  // ── Crossfade ────────────────────────────────────────────────────────────
  const showImage = useCallback((src: string, alt: string) => {
    const a = imgARef.current;
    const b = imgBRef.current;
    if (!a || !b) return;

    const isA = frontRef.current === "a";
    const front = isA ? a : b;
    const back = isA ? b : a;

    const reveal = () => {
      back.style.opacity = "1";
      front.style.opacity = "0";
      frontRef.current = isA ? "b" : "a";
    };

    back.onload = () => {
      back.onload = null;
      panRef.current?.apply();
      reveal();
    };
    back.alt = alt;
    back.src = src;

    // Ligger bildet i cachen fyrer ikke load på nytt; da viser vi det direkte.
    if (back.complete && back.naturalWidth) {
      back.onload = null;
      panRef.current?.apply();
      reveal();
    }
  }, []);

  // ── Panorering ───────────────────────────────────────────────────────────
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // px/py er der vi er nå, tx/ty der vi skal. Differansen spises opp litt
    // per frame, som gir den myke etterbevegelsen.
    let px = 0.5;
    let py = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    let frame = 0;
    let drag: { x: number; y: number } | null = null;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    const apply = () => {
      const transform = `translate(${(-(px * PAN_X)).toFixed(3)}%,${(-(
        py * PAN_Y
      )).toFixed(3)}%)`;
      stage.querySelectorAll("img").forEach((img) => {
        if (img.style.transform !== transform) img.style.transform = transform;
      });
    };

    const step = () => {
      px += (tx - px) * 0.16;
      py += (ty - py) * 0.16;
      apply();
      const settled =
        Math.abs(tx - px) < 0.0005 && Math.abs(ty - py) < 0.0005 && !drag;
      frame = settled ? 0 : requestAnimationFrame(step);
    };

    // Loopen kjører bare når noe faktisk beveger seg – ellers står den stille.
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    apply();

    const onDown = (e: PointerEvent) => {
      // Knappene oppå bildet skal kunne trykkes uten å starte et dra.
      if ((e.target as HTMLElement).closest(".fv-nav,.fv-walk")) return;
      drag = { x: e.clientX, y: e.clientY };
      stage.classList.add("dragging");
      stage.setPointerCapture(e.pointerId);
      setHintVisible(false);
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      tx = clamp(tx - ((e.clientX - drag.x) / stage.clientWidth) * 1.5);
      ty = clamp(ty - ((e.clientY - drag.y) / stage.clientHeight) * 1.2);
      drag = { x: e.clientX, y: e.clientY };
      kick();
    };

    // pointercancel kommer bl.a. når nettleseren overtar for vertikal scroll
    // på telefon. Da skal draget avsluttes, ikke henge igjen.
    const onUp = () => {
      drag = null;
      stage.classList.remove("dragging");
      kick();
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);

    panRef.current = {
      reset: () => {
        tx = 0.5;
        ty = 0.5;
        kick();
      },
      apply,
    };

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      panRef.current = null;
    };
  }, []);

  // ── Bytt bilde når bolig, rom eller indeks endres ────────────────────────
  useEffect(() => {
    panRef.current?.reset();
    showImage(
      room.images[imgIdx],
      `${apartment.label} – ${room.name}, bilde ${imgIdx + 1} av ${
        room.images.length
      }`,
    );

    // Forhåndslast neste bilde i rommet og første bilde i neste rom, så
    // overgangen blir umiddelbar.
    const preloadNext = new Image();
    preloadNext.src = room.images[(imgIdx + 1) % room.images.length];
    const preloadRoom = new Image();
    preloadRoom.src = nextRoom.images[0];
  }, [apartment, room, imgIdx, nextRoom, showImage]);

  // ── «Gå videre»: zoom framover, så inn i neste rom ───────────────────────
  const walk = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const visible = Array.from(stage.querySelectorAll("img")).find(
      (img) => img.style.opacity !== "0",
    );
    if (visible?.animate) {
      const base = visible.style.transform || "translate(-16.7%,-13%)";
      visible.animate(
        [
          { transform: `${base} scale(1)` },
          { transform: `${base} scale(1.17)` },
        ],
        { duration: 560, easing: "cubic-bezier(.45,0,.6,1)" },
      );
    }

    // Bytter rom midt i zoomen, så bevegelsen føles sammenhengende.
    window.setTimeout(() => {
      setRoomIdx((i) => (i + 1) % apartment.rooms.length);
      setImgIdx(0);
    }, 240);
  };

  const step = (delta: number) => {
    setImgIdx((i) => (i + delta + room.images.length) % room.images.length);
  };

  return (
    <section
      className="section"
      id="fremvisning"
      style={{ background: "var(--sand-50)" }}
    >
      <div className="wrap" style={{ maxWidth: 1180 }}>
        <div className="rv" style={{ textAlign: "center" }}>
          <h2
            className="sec-title"
            style={{
              margin: "0 auto",
              maxWidth: "none",
              fontSize: "clamp(2.2rem,4vw,3.4rem)",
            }}
          >
            Boligen vises i verdensklasse
          </h2>
          <p className="fv-sub">
            La kundene gå gjennom boligen før de booker
          </p>
        </div>

        <div className="fv rv" style={{ transitionDelay: ".12s" }}>
          <div className="fv-apts" role="group" aria-label="Velg bolig">
            {apartments.map((apt, i) => (
              <Fragment key={apt.id}>
                {/* Prikken mellom boligvalgene, som i designet. */}
                {i > 0 && <span aria-hidden="true" />}
                <button
                  type="button"
                  className={i === aptIdx ? "on" : undefined}
                  aria-pressed={i === aptIdx}
                  onClick={() => {
                    if (i === aptIdx) return;
                    setAptIdx(i);
                    setRoomIdx(0);
                    setImgIdx(0);
                  }}
                >
                  {apt.label}
                </button>
              </Fragment>
            ))}
          </div>

          <div className="fv-stage" ref={stageRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgARef} alt="" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgBRef} alt="" decoding="async" style={{ opacity: 0 }} />

            <button
              type="button"
              className="fv-nav prev"
              aria-label="Forrige bilde"
              hidden={!multiple}
              onClick={() => step(-1)}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>

            <button
              type="button"
              className="fv-nav next"
              aria-label="Neste bilde"
              hidden={!multiple}
              onClick={() => step(1)}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <span className="fv-count" hidden={!multiple}>
              {imgIdx + 1} / {room.images.length}
            </span>

            <button
              type="button"
              className="fv-walk"
              onClick={walk}
              style={{ left: `${walkPos.x}%`, top: `${walkPos.y}%` }}
            >
              <span className="fvw-ring">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.1}
                  aria-hidden="true"
                >
                  <path d="M12 19V5M6 11l6-6 6 6" />
                </svg>
              </span>
              <span className="fvw-lbl">
                Gå til {nextRoom.name.toLowerCase()}
              </span>
            </button>

            {hintVisible && (
              <span className="fv-hint">Dra for å se deg rundt</span>
            )}
          </div>

          <div className="fv-rooms" role="group" aria-label="Velg rom">
            {apartment.rooms.map((r, i) => (
              <button
                key={r.name}
                type="button"
                className={i === roomIdx ? "on" : undefined}
                aria-pressed={i === roomIdx}
                onClick={() => {
                  if (i === roomIdx && imgIdx === 0) return;
                  setRoomIdx(i);
                  setImgIdx(0);
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
