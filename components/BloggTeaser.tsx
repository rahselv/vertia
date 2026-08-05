"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import RevealText from "@/components/motion/RevealText";
import { EASE } from "@/components/motion/variants";
import { getAlleArtikler } from "@/lib/artikler";

/**
 * «Innsikt for utleiere»-teaser på forsiden.
 *
 * Client-komponent. Viser alle artiklene fra `lib/artikler.ts` i en horisontal,
 * scroll-snap-karusell som kan dras/scrolles sidelengs. To diskrete, runde
 * ‹ / ›-pilknapper (oppe til høyre, ved «Se alle artikler») scroller kortene
 * rolig sidelengs, og dimmes ved start/slutt. Hvert kort beholder det varme
 * utseendet: foto, dempet «Sist oppdatert»-dato og serif-tittel (`font-display`).
 * Står på hvit flate for å bevare den vekslende krem/sand/hvit-rytmen.
 */
export default function BloggTeaser() {
  const artikler = getAlleArtikler();
  const reduce = useReducedMotion() ?? false;

  // Karusell-kort avdekkes ETT OG ETT idet de kommer i viewport (once): de
  // synlige animeres første gang, og kort som scrolles/pilklikkes inn glir inn
  // (opacity 0→1, x 30→0, ~350ms) uten at introen restartes.
  const cardVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
        hover: {},
      }
    : {
        hidden: { opacity: 0, x: 30 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.35, ease: EASE },
        },
        // Løft via framer (ikke CSS-transform), så det ikke kolliderer med
        // slide-inn-transformen som ligger inline etter introen.
        hover: { y: -6, transition: { duration: 0.35, ease: EASE } },
      };

  const trackRef = useRef<HTMLDivElement>(null);
  const [kanVenstre, setKanVenstre] = useState(false);
  const [kanHoyre, setKanHoyre] = useState(true);

  const oppdaterPiler = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maks = el.scrollWidth - el.clientWidth;
    setKanVenstre(el.scrollLeft > 8);
    setKanHoyre(el.scrollLeft < maks - 8);
  }, []);

  useEffect(() => {
    oppdaterPiler();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", oppdaterPiler, { passive: true });
    window.addEventListener("resize", oppdaterPiler);
    return () => {
      el.removeEventListener("scroll", oppdaterPiler);
      window.removeEventListener("resize", oppdaterPiler);
    };
  }, [oppdaterPiler]);

  const scroll = useCallback((retning: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const kort = el.querySelector<HTMLElement>("[data-kort]");
    const steg = kort
      ? kort.offsetWidth + 32 // kortbredde + gap (gap-8)
      : Math.round(el.clientWidth * 0.8);
    const reduser =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: steg * retning,
      behavior: reduser ? "auto" : "smooth",
    });
  }, []);

  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <RevealText as="p" className="eyebrow mb-4">
              Fra bloggen
            </RevealText>
            <RevealText as="h2" className="section-title" delay={0.08}>
              Innsikt for utleiere
            </RevealText>
            <RevealText
              as="p"
              className="mt-5 text-[1.05rem] leading-relaxed text-ink-500"
              delay={0.16}
            >
              Rolige, ettertenksomme tekster om det som faktisk betyr noe når du
              leier ut. Skatt, regler, forsikring, prising og klargjøring.
            </RevealText>
          </div>

          <div className="flex flex-none items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                disabled={!kanVenstre}
                aria-label="Forrige artikler"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/15 bg-white text-ink-900 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none disabled:hover:translate-y-0"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                disabled={!kanHoyre}
                aria-label="Neste artikler"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/15 bg-white text-ink-900 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none disabled:hover:translate-y-0"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <Link
              href="/artikler"
              className="group inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-900/30 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Se alle artikler
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {artikler.map((artikkel) => (
            <motion.article
              key={artikkel.slug}
              data-kort
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={reduce ? undefined : "hover"}
              viewport={{ once: true, amount: 0.3 }}
              className="group h-auto w-[80%] flex-none snap-start overflow-hidden rounded-3xl bg-sand-50 shadow-card ring-1 ring-ink-900/5 transition-shadow duration-300 hover:shadow-soft sm:w-[46%] lg:w-[31%]"
            >
              <Link
                  href={`/artikler/${artikkel.slug}`}
                  className="flex h-full flex-col focus-visible:outline-none"
                  aria-label={`Les hele artikkelen: ${artikkel.tittel}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artikkel.bilde}
                      alt={artikkel.bildeAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-xs uppercase tracking-[0.16em] text-ink-500/80">
                      Sist oppdatert {artikkel.sistOppdatert}
                    </p>
                    <h3 className="mt-3 font-display text-xl font-medium leading-snug tracking-[-0.01em] text-ink-900 transition-colors duration-300 group-hover:text-brand-700">
                      {artikkel.tittel}
                    </h3>
                    <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-500">
                      {artikkel.ingress}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
      </div>
    </section>
  );
}
