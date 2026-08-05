import type { Variants } from "framer-motion";

/**
 * Felles bevegelsessystem for Vertia.
 *
 * Ett sammenhengende, premium scroll-inn-språk brukt på tvers av seksjonene:
 * kort glir inn ett etter ett (stagger), annenhver/mønstret fra venstre, høyre
 * og nedenfra, med rolig blur, scale og opacity. Alt kjører kun på transform,
 * opacity og en forsiktig blur (ingen layout-egenskaper), og respekterer
 * `prefers-reduced-motion` samt mobil (kortere x, mindre blur).
 *
 * KRITISK bruk: de animerte kortene MÅ være DIREKTE `motion`-barn av
 * `staggerContainer`-forelderen, i SAMME «use client»-komponent. Da propagerer
 * «hidden»/«visible»-tilstanden pålitelig ned. Ikke deleger det animerte kortet
 * til en nested subkomponent, og ikke sett `whileInView`/`animate` på hvert kort.
 */

// Dempet, eksklusiv easing – rolig start, mykt landet.
export const EASE = [0.22, 1, 0.36, 1] as const;

export type RevealDirection = "left" | "right" | "bottom";

/** Forelder som staggrer sine direkte motion-barn inn. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.18 },
  },
};

type RevealOptions = {
  reduce?: boolean;
  mobile?: boolean;
  /** Legg til en `hover`-variant (diskret løft) for kort. */
  hover?: boolean;
  /** Per-kort forsinkelse (sekunder) for sekvensiell «ett etter ett»-stagger. */
  delay?: number;
};

/**
 * Retningsbestemt kort-reveal. `left`/`right` glir inn sidelengs, `bottom`
 * nedenfra. Følger kortets hovedanimasjon; interne elementer får egne små
 * delays (se `contentItem`/`imageReveal`) uavhengig av stagger-timing.
 */
export function makeReveal(
  direction: RevealDirection,
  { reduce = false, mobile = false, hover = false, delay = 0 }: RevealOptions = {},
): Variants {
  if (reduce) {
    const v: Variants = {
      hidden: { opacity: 0, y: 8 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: EASE, delay },
      },
    };
    if (hover) v.hover = {};
    return v;
  }

  // Mobil: kortere sidelengs bevegelse og mildere blur, aldri horisontal scroll.
  const x = mobile ? 42 : 90;
  const blur = mobile ? 4 : 8;

  const from =
    direction === "bottom"
      ? { y: mobile ? 56 : 75, scale: 0.95 }
      : { x: direction === "left" ? -x : x, y: 20, scale: 0.96 };

  const duration = direction === "bottom" ? 0.78 : 0.75;

  const v: Variants = {
    hidden: { opacity: 0, ...from, filter: `blur(${blur}px)` },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration, ease: EASE, delay },
    },
  };

  if (hover) {
    v.hover = {
      y: -8,
      scale: 1.012,
      transition: { duration: 0.35, ease: EASE },
    };
  }

  return v;
}

/** Bilde som avdekkes: rolig scale-ned fra 1.08, med valgfri hover-zoom. */
export function makeImageReveal(reduce = false, hover = false): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
      ...(hover ? { hover: {} } : {}),
    };
  }
  return {
    hidden: { opacity: 0, scale: 1.08 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.85, ease: EASE } },
    ...(hover ? { hover: { scale: 1.04, transition: { duration: 0.4, ease: EASE } } } : {}),
  };
}

/**
 * Internt kort-innhold (ikon → overskrift → beskrivelse). Egne, økende delays
 * gir en rolig sekvens som følger etter kortet og bildet – uten å være avhengig
 * av `staggerChildren` gjennom mellomliggende wrappere.
 */
export function makeContentItem(reduce: boolean, delay: number): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.45, ease: EASE, delay } },
    };
  }
  return {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay } },
  };
}

/** Ikon: som `contentItem`, men med en liten diskret hover-heving. */
export function makeIconItem(reduce: boolean, delay: number): Variants {
  const base = makeContentItem(reduce, delay);
  return {
    ...base,
    hover: reduce ? {} : { y: -3, transition: { duration: 0.35, ease: EASE } },
  };
}

/** Overskriftslinjer: overtekst → hovedoverskrift → introtekst, fade-up. */
export function makeHeadingReveal(reduce: boolean, delay = 0): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0, y: 8 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay } },
    };
  }
  return {
    hidden: { opacity: 0, y: 28, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.65, ease: EASE, delay },
    },
  };
}
