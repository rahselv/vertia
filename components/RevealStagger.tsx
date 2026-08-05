"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Gjenbrukbar «staggered reveal»: kort glir inn ett etter ett, annenhver fra
 * venstre og høyre, med svak blur, scale og rotasjon. Respekterer
 * prefers-reduced-motion (da kun en rask, enkel fade).
 *
 *   <StaggerGrid className="grid ...">
 *     {items.map((it, i) => (
 *       <StaggerItem key={it.id} index={i}> ...kort... </StaggerItem>
 *     ))}
 *   </StaggerGrid>
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

export function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const direction = index % 2 === 0 ? -1 : 1;

  const variants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
      }
    : {
        hidden: {
          opacity: 0,
          x: 120 * direction,
          y: 24,
          scale: 0.94,
          rotate: direction * 1.6,
          filter: "blur(9px)",
        },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          transition: { duration: 0.75, ease: EASE },
        },
      };

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
