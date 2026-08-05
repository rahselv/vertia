import { Camera, KeyRound, Sparkles, Wand2, type LucideIcon } from "lucide-react";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  OPPSTARTSPAKKEN – DELT DATA
 * ───────────────────────────────────────────────────────────────────────────
 *  Ett sted for hva oppstartspakken inneholder og hva den koster. Gjenbrukes av
 *  både pris-seksjonen (åpent kort) og «Les mer»-modalen, slik at tallene og
 *  innholdet aldri kommer ut av synk.
 * ───────────────────────────────────────────────────────────────────────────
 */

export type StartupItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const startupItems: StartupItem[] = [
  {
    icon: KeyRound,
    title: "Smart nøkkelboks og smartlås",
    description:
      "Hver gjest får sin egen engangskode, slik at innsjekk blir nøkkelfri og rolig. Løsningen fungerer også helt uten internett, så ingen blir stående utenfor.",
  },
  {
    icon: Camera,
    title: "Profesjonelle foto",
    description:
      "Lyse, varme bilder som viser boligen fra sin beste side og får annonsen til å skille seg ut. Gode foto er det første gjestene legger merke til.",
  },
  {
    icon: Wand2,
    title: "Annonseoppsett",
    description:
      "Vi setter opp en komplett annonse på Airbnb og andre kanaler, med tekst og prising klart fra start. Du trenger ikke skrive eller stille inn noe selv.",
  },
  {
    icon: Sparkles,
    title: "Klargjøring og styling",
    description:
      "Rolige tips til å gjøre boligen gjesteklar, fra små detaljer til hvordan rommene best kommer til sin rett før fotografen kommer.",
  },
];

/** Prisetiketten for oppstart per bolig. */
export const startupPriceLabel = "5 000 kr per bolig";
