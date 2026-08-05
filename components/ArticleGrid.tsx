"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Artikkel } from "@/lib/artikler";
import {
  makeReveal,
  makeImageReveal,
  type RevealDirection,
} from "@/components/motion/variants";

// Mønster som gjentas: artikkel 1 fra venstre, 2 nedenfra, 3 fra høyre …
const pattern: RevealDirection[] = ["left", "bottom", "right"];

/**
 * «Innsikt for utleiere»-grid. Kortene er DIREKTE motion-barn av
 * stagger-forelderen (samme komponent), så «hidden»/«visible» propagerer
 * pålitelig. Hvert kort glir inn ett etter ett, med internt bilde-reveal og
 * diskret hover. Ingen tekst, bilde eller rekkefølge er endret.
 */
export default function ArticleGrid({ artikler }: { artikler: Artikkel[] }) {
  const reduce = useReducedMotion() ?? false;
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 640px)");
    const sync = () => setMobile(small.matches);
    sync();
    small.addEventListener("change", sync);
    return () => small.removeEventListener("change", sync);
  }, []);

  return (
    <div className="grid gap-8 overflow-x-clip sm:grid-cols-2 lg:grid-cols-3">
      {artikler.map((artikkel, i) => {
        // Hvert kort selv-trigger scroll-inn (robust) med per-index delay.
        const cardVariants = makeReveal(pattern[i % 3], {
          reduce,
          mobile,
          hover: true,
          delay: (i % 3) * 0.15,
        });
        const imageVariants = makeImageReveal(reduce, true);

        return (
          <motion.article
            key={artikkel.slug}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={reduce ? undefined : "hover"}
            className="group h-full overflow-hidden rounded-3xl bg-sand-50 shadow-card ring-1 ring-brand-600/10 transition-shadow duration-300 hover:shadow-soft hover:ring-brand-600/20"
          >
            <Link
              href={`/artikler/${artikkel.slug}`}
              className="flex h-full flex-col"
              aria-label={`Les hele artikkelen: ${artikkel.tittel}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  variants={imageVariants}
                  src={artikkel.bilde}
                  alt={artikkel.bildeAlt}
                  loading={i < 3 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <h2 className="font-display text-xl font-medium leading-snug tracking-[-0.02em] text-ink-900 transition-transform duration-300 group-hover:-translate-y-0.5">
                  {artikkel.tittel}
                </h2>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-500">
                  {artikkel.ingress}
                </p>

                <p className="mt-7 text-xs uppercase tracking-[0.14em] text-ink-500/70">
                  Sist oppdatert {artikkel.sistOppdatert}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700">
                  Les hele artikkelen
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
