"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Pakker innhold i en diskret fade-in med lett opp-glid når det scrolles inn.
 * Respekterer brukerens «redusert bevegelse»-innstilling.
 *
 * To ting her er viktigere enn de ser ut:
 *
 * 1. Vi rendrer ALLTID en motion.div. Tidligere returnerte komponenten et
 *    vanlig <div> når `useReducedMotion()` var sann. Den kroken er alltid usann
 *    under SSR, så serveren sendte en motion.div med `opacity: 0`, mens en
 *    klient med redusert bevegelse ville rendret et vanlig <div>. React
 *    reparerer ikke den slags attributt-avvik under hydrering – den beholder
 *    serverens markup. Resultatet var at alt innhold pakket i Reveal ble
 *    liggende usynlig for godt hos alle med «Reduser bevegelse» påslått.
 *    Nå styrer vi animasjonen med `transition` i stedet for å bytte element.
 *
 * 2. `animate`-fallbacken. Blir `whileInView` aldri utløst – IntersectionObserver
 *    som ikke fyrer, en observer som strupes – vises innholdet likevel etter
 *    1,5 s. Innhold skal aldri kunne bli hengende usynlig.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [failsafe, setFailsafe] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setFailsafe(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={failsafe ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
