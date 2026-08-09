"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  apartments,
  walkPositions,
  type ShowcaseImage,
} from "./showcaseData";

/**
 * Standard forstørrelse i scenen, i prosent. Designet hadde 150 % x 136 %, men
 * da så man bare en flik av rommet. Størrelsen settes nå per bilde i
 * showcaseData, med denne som standard; CSS-en styrer den ikke lenger.
 */
const DEFAULT_ZOOM = 108;

/**
 * Stiler og pan-faktorer for ett bilde.
 *
 * Panoreringen er (zoom − 100) / zoom: et bilde forstørret til 108 % kan
 * flyttes 7,4 % av sin egen bredde før kanten slipper rammen.
 *
 * `contain` settes bare når bildet eksplisitt ber om det. Tidligere utledet vi
 * det av at bildet var stående, men da krympet bl.a. badbildene i stedet for å
 * fylle rammen slik resten gjør.
 */
function fitProps(image: ShowcaseImage) {
  const zoom = image.zoom ?? DEFAULT_ZOOM;
  // I prosent, ikke brøk: transformen skriver translate3d(...%).
  const pan = (((zoom - 100) / zoom) * 100).toFixed(3);
  const contain = image.fit === "contain";

  return {
    "data-kx": contain ? 0 : pan,
    "data-ky": contain ? 0 : pan,
    fitStyle: contain
      ? ({ width: "100%", height: "100%", objectFit: "contain" } as const)
      : ({ width: `${zoom}%`, height: `${zoom}%` } as const),
  };
}

/**
 * Scenen er maks 1180 px bred, og bildet litt bredere enn den igjen (zoom).
 *
 * På telefon oppgir vi bevisst en mindre bredde enn bildet faktisk dekker.
 * Nettleseren ganger opp med skjermens pikselforhold, så en ærlig 115vw ville
 * gitt 1920 px-varianten på en 3x-telefon. Da må mobilen dekode og komponere
 * en 1920x1280 bitmap for hver frame mens man panorerer, og det er en stor del
 * av tregheten. 70vw lander på 828 px-varianten. Litt mykere på de skarpeste
 * skjermene, men merkbart jevnere bevegelse – og dette er demofoto.
 */
const SIZES =
  "(min-width: 1240px) 1300px, (min-width: 640px) 100vw, 70vw";

/**
 * Demofotoene er dekorative og delvis utenfor synsfeltet til enhver tid, så vi
 * senker kvaliteten litt under Next sin standard på 75. Det merkes ikke, og
 * kutter en god del vekt på mobildata.
 */
const QUALITY = 70;

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
  const panRef = useRef<PanController | null>(null);

  const apartment = apartments[aptIdx];
  const room = apartment.rooms[roomIdx];
  const multiple = room.images.length > 1;
  const nextRoom = apartment.rooms[(roomIdx + 1) % apartment.rooms.length];
  const walkPos = walkPositions[roomIdx % walkPositions.length];

  const current = room.images[imgIdx];
  const alt = `${apartment.label} – ${room.name}, bilde ${imgIdx + 1} av ${
    room.images.length
  }`;

  // ── Crossfade ────────────────────────────────────────────────────────────
  // Det forrige bildet blir liggende bak til det nye har lastet, og fades så
  // bort. Det nye bildet er selv sin egen forhåndslasting: det ligger i DOM og
  // henter seg selv mens det gamle fortsatt vises.
  //
  // Designet gjorde dette imperativt ved å skrive .src på to <img>. Vi går via
  // state fordi next/image eier src-attributtet og genererer srcset selv.
  const [previous, setPrevious] = useState<typeof current | null>(null);
  const [loaded, setLoaded] = useState(false);
  const currentRef = useRef(current);
  const imgRef = useRef<HTMLImageElement>(null);

  /**
   * Skifte av bilde. Må gjøres i ÉN effekt.
   *
   * Dette lå tidligere i to: én som sjekket `img.complete` og satte loaded,
   * og én som satte forrige bilde og nullstilte loaded. Effekter kjører i
   * deklarasjonsrekkefølge, så et bilde som allerede lå i nettleserens cache
   * ble først markert ferdig og deretter satt tilbake til «ikke lastet» – og
   * siden `onLoad` aldri fyrer for et ferdig bilde, ble det stående usynlig
   * bak det forrige. Rombytter så da ut som om ingenting skjedde.
   *
   * Nabobildene forhåndslastes, så nettopp cache-tilfellet er det vanlige.
   */
  useEffect(() => {
    if (currentRef.current.src !== current.src) {
      setPrevious(currentRef.current);
      currentRef.current = current;
      panRef.current?.reset();
    }

    const el = imgRef.current;

    const show = () => {
      panRef.current?.apply();
      setLoaded(true);
    };

    // Uten ref har vi ingen måte å vite når bildet er klart. Da viser vi det
    // heller med én gang enn å risikere at det blir stående usynlig.
    if (!el) {
      show();
      return;
    }

    if (el.complete && el.naturalWidth) {
      show();
      return;
    }

    setLoaded(false);

    // Native lytter, ikke Reacts onLoad. onLoad fyrte ikke for bildene her –
    // de ble ferdig lastet (complete = true, naturalWidth > 0) mens
    // opacity ble stående på 0, så et rombytte så ut som om ingenting skjedde.
    el.addEventListener("load", show);
    el.addEventListener("error", show);

    // Siste skanse: bildet skal aldri kunne bli hengende usynlig.
    const failsafe = window.setTimeout(show, 3000);

    return () => {
      el.removeEventListener("load", show);
      el.removeEventListener("error", show);
      window.clearTimeout(failsafe);
    };
  }, [current]);

  /**
   * Nabobildene lastes i bakgrunnen mens brukeren ser på det aktive: neste og
   * forrige bilde i rommet, og første bilde i rommet før og etter. Da er
   * bildet som regel ferdig hentet i det man klikker, og rombyttet blir en ren
   * crossfade i stedet for å vente på nettverket.
   *
   * De rendres i scenen med full størrelse og opacity 0. Størrelsen er ikke
   * pynt: `sizes` velger srcset-variant ut fra elementets layoutbredde, så et
   * lite skjult element ville forhåndslastet feil – og for liten – variant.
   */
  const neighbours = useMemo(() => {
    const list: ShowcaseImage[] = [];
    const images = room.images;
    if (images.length > 1) {
      list.push(images[(imgIdx + 1) % images.length]);
      list.push(images[(imgIdx - 1 + images.length) % images.length]);
    }
    const rooms = apartment.rooms;
    list.push(rooms[(roomIdx + 1) % rooms.length].images[0]);
    list.push(rooms[(roomIdx - 1 + rooms.length) % rooms.length].images[0]);

    return list.filter(
      (image, i, all) =>
        image.src !== current.src &&
        all.findIndex((other) => other.src === image.src) === i,
    );
  }, [apartment, room, roomIdx, imgIdx, current]);

  // Rydd bort det gamle bildet når overgangen (.55s i CSS) er ferdig.
  useEffect(() => {
    if (!loaded || !previous) return;
    const timer = window.setTimeout(() => setPrevious(null), 600);
    return () => window.clearTimeout(timer);
  }, [loaded, previous]);

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

    // Nodene og pan-faktorene deres caches. Å kjøre querySelectorAll og
    // parse dataset på nytt for hver frame kostet unødvendig arbeid midt i
    // en dra-bevegelse.
    let targets: { el: HTMLImageElement; kx: number; ky: number }[] = [];
    const collect = () => {
      targets = Array.from(stage.querySelectorAll("img")).map((el) => ({
        el,
        kx: Number(el.dataset.kx ?? 0),
        ky: Number(el.dataset.ky ?? 0),
      }));
    };
    collect();

    // React bytter ut bildene ved rom- og bildeskifte; da må cachen fornyes.
    const observer = new MutationObserver(collect);
    observer.observe(stage, { childList: true });

    const apply = () => {
      for (const t of targets) {
        // translate3d framfor translate: da holder bildet seg på sitt eget
        // GPU-lag og hver frame blir en ren sammensetning, ikke en ommaling.
        const transform = `translate3d(${(-(px * t.kx)).toFixed(3)}%,${(-(
          py * t.ky
        )).toFixed(3)}%,0)`;
        if (t.el.style.transform !== transform) t.el.style.transform = transform;
      }
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

    // `panning` styrer overleggene og henger igjen litt etter at fingeren
    // slipper, så knappen ikke blinker mellom to draq. `dragging` følger
    // fingeren nøyaktig og styrer markør og will-change.
    let settle = 0;

    const onDown = (e: PointerEvent) => {
      // Knappene oppå bildet skal kunne trykkes uten å starte et dra.
      if ((e.target as HTMLElement).closest(".fv-nav,.fv-walk")) return;
      drag = { x: e.clientX, y: e.clientY };
      window.clearTimeout(settle);
      stage.classList.add("dragging", "panning");
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
      // Kort forsinkelse før overleggene kommer tilbake.
      window.clearTimeout(settle);
      settle = window.setTimeout(() => stage.classList.remove("panning"), 400);
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
      window.clearTimeout(settle);
      observer.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      panRef.current = null;
    };
  }, []);

  // ── «Gå videre»: zoom framover, så inn i neste rom ───────────────────────
  const walk = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const visible = Array.from(stage.querySelectorAll("img")).find(
      (img) => img.style.opacity !== "0",
    );
    if (visible?.animate) {
      // Reserveverdien er midtstillingen: halvparten av PAN_X/PAN_Y.
      const base = visible.style.transform || "translate(-7.6%,-4.5%)";
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
            }}
          >
            Boligen vises frem på en ny måte
          </h2>
          <p className="fv-sub">
            La kundene gå gjennom boligen før de booker
          </p>
        </div>

        <div className="fv rv" style={{ transitionDelay: ".12s" }}>
          <div className="fv-apts" role="group" aria-label="Velg bolig">
            {apartments.map((apt, i) => (
              <Fragment key={apt.id}>
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
            {previous && (
              <Image
                key={`${previous.src}-ut`}
                src={previous.src}
                width={previous.width}
                height={previous.height}
                sizes={SIZES}
                quality={QUALITY}
                alt=""
                aria-hidden="true"
                data-kx={fitProps(previous)["data-kx"]}
                data-ky={fitProps(previous)["data-ky"]}
                style={fitProps(previous).fitStyle}
              />
            )}
            <Image
              key={current.src}
              ref={imgRef}
              src={current.src}
              width={current.width}
              height={current.height}
              sizes={SIZES}
              quality={QUALITY}
              alt={alt}
              // Det aktive bildet er sidens innhold her og ikke noe som skal
              // vente pa lat lasting.
              loading="eager"
              data-kx={fitProps(current)["data-kx"]}
              data-ky={fitProps(current)["data-ky"]}
              style={{ ...fitProps(current).fitStyle, opacity: loaded ? 1 : 0 }}
            />

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

          {/* Forhåndslastingene ligger UTENFOR scenen. Lå de inni, ville de
              blitt med i pan-løkken og fått hver sin transform per frame – fem
              store lag å komponere i stedet for to. Beholderen har høyde 0,
              men full bredde, som er det srcset trenger for å velge variant. */}
          <div className="fv-preload" aria-hidden="true">
            {neighbours.map((image) => (
              <Image
                key={`forhandslast-${image.src}`}
                src={image.src}
                width={image.width}
                height={image.height}
                sizes={SIZES}
                quality={QUALITY}
                alt=""
                // Lat lasting ville gjort forhåndslastingen meningsløs.
                loading="eager"
              />
            ))}
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
