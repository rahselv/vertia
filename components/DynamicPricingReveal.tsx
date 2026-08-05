"use client";

import { useMemo } from "react";
import { LineChart } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import PricingCalendar from "./PricingCalendar";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Motion-wrapper rundt «Dynamisk prising, dag for dag». Venstre tekstblokk og
 * høyre kalenderkort glir inn fra hver sin side og møtes nær midten. Rendres fra
 * server-komponenten WhatsIncluded – kun animasjon, ingen innholdsendring.
 */
function makeSectionVariants(reduce: boolean): Variants {
  return {
    hidden: {},
    show: {
      transition: reduce
        ? { staggerChildren: 0.06 }
        : { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };
}

function makeLeftVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { duration: 0.4, ease: EASE, staggerChildren: 0.05 },
      },
    };
  }
  return {
    hidden: { opacity: 0, x: -100, filter: "blur(6px)" },
    show: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: EASE,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };
}

function makeItemVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
    };
  }
  return {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
}

function makeRightVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.45, ease: EASE } },
    };
  }
  return {
    hidden: { opacity: 0, x: 100, scale: 0.96, rotate: 1.5 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.85, ease: EASE },
    },
  };
}

export default function DynamicPricingReveal() {
  const reduce = useReducedMotion() ?? false;

  const sectionVariants = useMemo(() => makeSectionVariants(reduce), [reduce]);
  const leftVariants = useMemo(() => makeLeftVariants(reduce), [reduce]);
  const itemVariants = useMemo(() => makeItemVariants(reduce), [reduce]);
  const rightVariants = useMemo(() => makeRightVariants(reduce), [reduce]);

  return (
    <motion.div
      className="mt-6 overflow-hidden rounded-[2rem] border border-sand-200 bg-sand-50 shadow-card"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <motion.div variants={leftVariants} style={{ willChange: "transform" }}>
          <motion.span
            variants={itemVariants}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-sand-50"
          >
            <LineChart className="h-6 w-6" strokeWidth={1.75} />
          </motion.span>
          <motion.h3
            variants={itemVariants}
            className="mt-5 font-display text-2xl font-medium leading-tight tracking-[-0.02em] text-ink-900 sm:text-3xl"
          >
            Dynamisk prising, dag for dag
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-md leading-relaxed text-ink-500"
          >
            Vi ser hvilke dager som gir mest, og priser deretter. Helger,
            høysesong og lokale arrangementer prises opp, mens stille perioder
            prises ned for å holde belegget oppe.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-ink-700"
          >
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-[5px] bg-brand-600" />
              Høy verdi (helg / arrangement)
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-[5px] border border-sand-200 bg-white" />
              Vanlig dag (ordinær pris)
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-[5px] bg-sand-100" />
              Lavere verdi
            </span>
          </motion.div>
        </motion.div>

        {/* Interaktiv måneds-kalender (illustrasjon) */}
        <motion.div variants={rightVariants} style={{ willChange: "transform" }}>
          <PricingCalendar />
        </motion.div>
      </div>
    </motion.div>
  );
}
