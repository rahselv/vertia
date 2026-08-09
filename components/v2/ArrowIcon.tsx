/**
 * Pilen som følger knappene i v2-designet. Egen komponent fordi den gjentas et
 * dusin steder, og fordi `.btn:hover svg` i CSS-en forventer nøyaktig ett
 * <svg>-barn i knappen for å kunne skyve den til høyre ved hover.
 */
export default function ArrowIcon({
  size = 16,
  strokeWidth = 2.25,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
