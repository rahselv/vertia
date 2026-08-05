/**
 * Vertia-logo – rent ordmerke (server component, ingen "use client").
 *
 * Den runde V-badgen er fjernet helt. Logoen er nå utelukkende ordet "Vertia"
 * satt i den elegante serif-display-fonten (--font-display), rolig og redaksjonelt
 * med stram, behagelig tracking. Ingen sirkel, ingen ikon.
 *
 * Tre varianter beholdes for kompatibilitet med Header/Footer, men alle rendrer
 * samme ordmerke:
 *  - full  : mørk varm espresso ("text-ink-900" / brand-700) på lyse flater.
 *  - white : lys krem ("text-sand-50") for mørk/transparent header over hero.
 *  - mark  : kompakt – kun "Vertia" (ingen badge).
 */

type LogoVariant = "full" | "mark" | "white";

type LogoProps = {
  /** Visuell høyde-referanse i px. Tekststørrelsen skaleres ut fra denne. */
  size?: number;
  variant?: LogoVariant;
  className?: string;
};

const INK_900 = "#241E18"; // varm mørk brun, ink-900
const BRAND_700 = "#241C17"; // varm espresso, brand-700
const SAND_50 = "#FAF6EE"; // varm krem, sand-50

const DISPLAY_STACK =
  "var(--font-display), 'Playfair Display', Georgia, 'Times New Roman', serif";

export default function Logo({
  size = 36,
  variant = "full",
  className,
}: LogoProps) {
  const label = "Vertia";

  // Lys/krem for mørk bakgrunn, ellers mørk varm.
  const color = variant === "white" ? SAND_50 : INK_900;

  // "mark" er en litt mer kompakt setting; ellers normal redaksjonell tracking.
  const isMark = variant === "mark";

  // Tekststørrelse skaleres rimelig ut fra size-proppen.
  const fontSize = Math.round(size * (isMark ? 0.92 : 0.86));

  return (
    <span
      role="img"
      aria-label={label}
      className={className}
      style={{
        display: "inline-block",
        fontFamily: DISPLAY_STACK,
        fontWeight: 500,
        fontSize: `${fontSize}px`,
        lineHeight: 1,
        letterSpacing: isMark ? "-0.01em" : "0.005em",
        color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
