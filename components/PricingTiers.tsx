"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ContactButton from "@/components/ContactButton";
import { startupPriceLabel } from "@/lib/startupPackage";
import { makeReveal, type RevealDirection } from "@/components/motion/variants";

type Pkg = {
  name: string;
  commission: string;
  description: string;
  features: string[];
  popular: boolean;
};

// Intro: Basis fra venstre, Full nedenfra, Premium fra høyre.
const introDirections: RevealDirection[] = ["left", "bottom", "right"];

export default function PricingTiers({ packages }: { packages: Pkg[] }) {
  // Hvilken pakke som er hovret. null = standardtilstand (Full er brun).
  const [hovered, setHovered] = useState<string | null>(null);
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
    // Stagger-forelder: intro glir kortene inn. Intro styrer transform/opacity
    // (på ytre motion.div); hover styrer FARGE via className (på indre kort) –
    // de deler ikke element, så de kolliderer ikke.
    <div className="mx-auto mt-12 grid max-w-5xl items-center gap-6 overflow-x-clip lg:grid-cols-3">
      {packages.map((pkg, index) => {
        // Standard: den populære (Full) er mørk. Ved hover blir den hovrede
        // mørk, og alle andre – inkludert Full – lyse.
        const dark = hovered ? hovered === pkg.name : pkg.popular;
        // Hvert kort selv-trigger scroll-inn (robust) med per-index delay.
        const introVariants = makeReveal(introDirections[index] ?? "bottom", {
          reduce,
          mobile,
          delay: index * 0.18,
        });

        return (
          <motion.div
            key={pkg.name}
            variants={introVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            onMouseEnter={() => setHovered(pkg.name)}
            onMouseLeave={() => setHovered(null)}
            className="h-full"
          >
            <div
              className={`relative flex h-full flex-col items-center text-center rounded-[2rem] p-8 transition-all duration-300 ease-out sm:p-9 ${
                pkg.popular ? "lg:py-11" : ""
              } ${
                dark
                  ? "bg-brand-600 text-sand-50 shadow-soft lg:scale-[1.04]"
                  : "border border-sand-200 bg-sand-50 text-ink-900 shadow-card hover:-translate-y-1 hover:shadow-soft"
              }`}
            >
              {pkg.popular && (
                <span
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] shadow-card transition-colors duration-300 ${
                    dark ? "bg-sand-50 text-brand-600" : "bg-brand-600 text-sand-50"
                  }`}
                >
                  Mest valgt
                </span>
              )}

              <p
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                  dark ? "text-sand-100/80" : "text-brand-600"
                }`}
              >
                {pkg.name}
              </p>

              <div className="mt-5">
                <span className="font-display text-5xl font-medium leading-none tracking-[-0.02em]">
                  {pkg.commission}
                </span>
                <p
                  className={`mt-2.5 text-sm transition-colors duration-300 ${
                    dark ? "text-sand-100/70" : "text-ink-500"
                  }`}
                >
                  av brutto leieinntekt
                </p>
              </div>

              <p
                className={`mt-5 text-sm leading-relaxed transition-colors duration-300 ${
                  dark ? "text-sand-100/85" : "text-ink-500"
                }`}
              >
                {pkg.description}
              </p>

              <div
                className={`mt-7 h-px w-full transition-colors duration-300 ${
                  dark ? "bg-sand-50/15" : "bg-sand-200"
                }`}
              />

              <ul className="mt-7 w-full flex-1 text-sm">
                {pkg.features.map((feature, i) => (
                  <li
                    key={feature}
                    className={`py-3 first:pt-0 last:pb-0 transition-colors duration-300 ${
                      i === 0
                        ? ""
                        : dark
                          ? "border-t border-sand-50/10"
                          : "border-t border-sand-200"
                    } ${dark ? "text-sand-100/90" : "text-ink-700"}`}
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Minner om at oppstart alltid kommer i tillegg til nivået */}
              <p
                className={`mt-6 text-xs transition-colors duration-300 ${
                  dark ? "text-sand-100/70" : "text-ink-500"
                }`}
              >
                + oppstart per bolig ({startupPriceLabel})
              </p>

              <ContactButton
                className={`mt-5 w-full ${dark ? "btn-on-image" : "btn-primary"}`}
              >
                Få et tilbud
              </ContactButton>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
