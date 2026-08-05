"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Wallet, Share2, Headphones, User, type LucideIcon } from "lucide-react";

// Rolige, ærlige nøkkeltall med diskret ikon, stort serif-tall og dempet etikett.
const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Wallet, value: "0 kr", label: "faste månedsavgifter" },
  { icon: Share2, value: "4", label: "salgskanaler" },
  { icon: Headphones, value: "Rask respons", label: "alle dager" },
  { icon: User, value: "1", label: "fast kontaktperson" },
];

export default function Statement() {
  const reduceMotion = useReducedMotion();

  const reveal: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const viewport = { once: true, margin: "-90px" } as const;

  return (
    <section
      className="section bg-brand-600 text-sand-50"
      aria-labelledby="statement-heading"
    >
      <div className="container-page">
        <div className="grid items-center gap-x-16 gap-y-14 lg:grid-cols-2">
          {/* VENSTRE: rolig manifest i serif med dempet undertekst. */}
          <motion.div
            variants={reveal}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={viewport}
            className="max-w-xl"
          >
            <p className="eyebrow text-sand-200/80">Vertia-løftet</p>

            <h2
              id="statement-heading"
              className="mt-6 font-display text-[2.1rem] font-medium leading-[1.08] tracking-[-0.025em] text-sand-50 sm:text-[2.8rem] md:text-[3.2rem]"
            >
              Utleie skal kjennes som ro, ikke som enda en jobb.
            </h2>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-sand-200/75">
              Vi tar hånd om alt det praktiske, slik at du kan nyte fordelene
              uten å ta av din egen tid.
            </p>
          </motion.div>

          {/* HØYRE: 4 diskrete stat-kort med hårfine lyse kanter mot espresso. */}
          <motion.dl
            variants={reveal}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={viewport}
            custom={1}
            className="grid grid-cols-2 gap-5 sm:gap-6"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-[1.75rem] bg-sand-50/[0.04] p-7 ring-1 ring-inset ring-sand-50/10 transition-colors duration-300 hover:bg-sand-50/[0.06] sm:p-8"
                >
                  <Icon
                    className="h-6 w-6 text-sand-200/70"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <dt className="mt-7 font-display text-4xl font-medium leading-tight tracking-tight text-sand-50 sm:text-5xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-sm leading-snug text-sand-200/70">
                    {stat.label}
                  </dd>
                </div>
              );
            })}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
