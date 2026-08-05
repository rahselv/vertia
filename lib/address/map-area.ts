/**
 * ───────────────────────────────────────────────────────────────────────────
 *  KOMMUNE → OMRÅDE-MAPPING
 * ───────────────────────────────────────────────────────────────────────────
 *  Oversetter offisielt kommunenavn fra valgt adresse til ett av kalkulatorens
 *  EKSISTERENDE områdevalg. Vi legger ikke til nye områder – alt som ikke
 *  matcher faller til «annet» (Annet område).
 * ───────────────────────────────────────────────────────────────────────────
 */

import type { AreaKey } from "@/lib/calculatorConfig";
import { normalize } from "./normalize";

/** Normaliserte kommunenavn → eksisterende AreaKey. */
const MUNICIPALITY_TO_AREA: Record<string, AreaKey> = {
  oslo: "oslo",
  bærum: "baerum",
  asker: "asker",
  trysil: "trysil",
  hemsedal: "hemsedal",
};

/**
 * Finner riktig område fra kommunenavn. Ukjente kommuner → «annet».
 * Case-insensitiv og robust mot mellomrom via normalize().
 */
export function mapMunicipalityToArea(municipalityName: string): AreaKey {
  return MUNICIPALITY_TO_AREA[normalize(municipalityName)] ?? "annet";
}
