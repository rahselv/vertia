"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

const badges = ["Ingen binding", "Faste, lokale renholdere", "Transparent månedsrapport"];

// Fint, redaksjonelt korn som legger en hårfin tekstur over bildet – aldri synlig
// som «effekt», bare en anelse dybde slik dyre trykksaker har.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Lett parallax: bildet beveger seg saktere enn resten når man scroller.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "14%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.07]);

  // Koreografert, rolig inn-stagger for innholdet.
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Varmt, atmosfærisk interiørbilde i gyllent lys, med lett parallax. */}
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/vertia-forsidebilde.png"
          alt="Varm, rolig stue i gyllent lys med sofa, lenestol, sideboard og planter"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </motion.div>

      {/* Flat, jevn espresso-scrim som holder den hvite teksten lesbar uten
          gradient eller glow – ett rolig lag, ikke et effekt-triks. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-ink-900/50"
      />
      {/* Hårfint korn. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      <div className="container-page py-28 sm:py-32 lg:py-36">
        {/* ── VENSTRE: ren, redaksjonell copy – ingen kalkulator ───── */}
        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="max-w-3xl"
        >
          <motion.p variants={item} className="eyebrow-light">
            Airbnb-forvaltning for bolig- og hytteeiere
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-8 font-display text-white [text-wrap:balance]"
          >
            <span className="block text-[2.9rem] font-medium leading-[0.96] tracking-[-0.045em] sm:text-[3.75rem] md:text-[4.4rem] lg:text-[4.9rem]">
              Tjen penger på boligen
              <br className="hidden sm:block" /> når den står stille.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/85"
          >
            Vi drifter korttidsutleien av hytta eller boligen din — gjester,
            koder, vask og rapport. Du får en månedlig utbetaling.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#kalkulator"
              className="btn-on-image group w-full sm:w-auto"
            >
              Få gratis inntektsestimat
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.25}
              />
            </a>
            <a
              href="#slik-fungerer-det"
              className="inline-flex w-full items-center justify-center gap-2 rounded-none border border-white/60 bg-transparent px-8 py-4 text-base font-medium text-white transition-colors duration-200 hover:bg-white hover:text-brand-700 sm:w-auto"
            >
              Slik fungerer det
            </a>
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80"
          >
            {badges.map((badge, i) => (
              <li key={badge} className="flex items-center gap-5">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="h-4 w-px bg-white/30"
                  />
                )}
                <span className="tracking-[0.01em]">{badge}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Elegant scroll-cue – diskret, til venstre under copyen, kun på desktop. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-7 hidden lg:block">
        <div className="container-page">
          <div className="flex flex-col items-start gap-2.5">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/55">
              Bla ned
            </span>
            <span aria-hidden className="relative h-10 w-px overflow-hidden bg-white/20">
              {!reduceMotion && (
                <motion.span
                  className="absolute inset-x-0 top-0 h-4 bg-white/80"
                  animate={{ y: [-16, 40] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: [0.5, 0, 0.5, 1],
                  }}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
