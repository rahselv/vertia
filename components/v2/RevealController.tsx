"use client";

import { useEffect } from "react";

/**
 * Scroll-avdekking for v2.
 *
 * Designet løser dette med en IntersectionObserver som legger `.in` på hvert
 * `.rv`-element, og en `js-reveal`-klasse som først da slår på start-tilstanden
 * (opacity 0 + translateY). Rekkefølgen er viktig: uten JS er alt innhold
 * synlig som vanlig, og vi risikerer aldri en blank side hvis noe feiler.
 *
 * Vi beholder den modellen i stedet for framer-motion her, fordi overgangene
 * allerede ligger ferdig i vertia-v2.css. `prefers-reduced-motion` håndteres
 * også der.
 */
export default function RevealController() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const roots = Array.from(
      document.querySelectorAll<HTMLElement>(".vertia-v2"),
    );
    roots.forEach((el) => el.classList.add("js-reveal"));

    const show = (el: Element) => el.classList.add("in");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    document
      .querySelectorAll(".vertia-v2 .rv")
      .forEach((el) => io.observe(el));

    // Sikkerhetsventil: blir observeren strupet (bakgrunnsfane, treg enhet),
    // vises alt uansett etter 1,8 s. Bedre enn usynlig innhold.
    const timer = window.setTimeout(() => {
      document.querySelectorAll(".vertia-v2 .rv:not(.in)").forEach(show);
    }, 1800);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      roots.forEach((el) => el.classList.remove("js-reveal"));
    };
  }, []);

  return null;
}
