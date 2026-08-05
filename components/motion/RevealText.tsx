"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { makeHeadingReveal } from "@/components/motion/variants";

type Tag = "p" | "h1" | "h2" | "h3" | "span" | "div";

/**
 * Én overskriftslinje som fader opp ved scroll (headingReveal). Brukes til å la
 * overtekst → hovedoverskrift → introtekst komme sekvensielt FØR kortene i en
 * seksjon. Selvstendig (egen `whileInView`), så den fungerer uansett hvor dypt
 * den er nestet. Respekterer redusert bevegelse.
 */
export default function RevealText({
  as = "div",
  delay = 0,
  className,
  children,
}: {
  as?: Tag;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion() ?? false;
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      variants={makeHeadingReveal(reduce, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {children}
    </MotionTag>
  );
}
