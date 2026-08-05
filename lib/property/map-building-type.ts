/**
 * ───────────────────────────────────────────────────────────────────────────
 *  BYGNINGSTYPE → BOLIGTYPE-MAPPING
 * ───────────────────────────────────────────────────────────────────────────
 *  Oversetter offisielle bygningstyper (Matrikkelen / NS 3457-kodeverk) til
 *  kalkulatorens fire boligtyper. To innganger:
 *    1) Numerisk bygningstype-kode (mest presist).
 *    2) Fritekst bygningsbeskrivelse (fallback via nøkkelord).
 *
 *  Vi gjetter ALDRI ukritisk – finner vi ingen trygg match, returneres null,
 *  og oppslaget faller til «unknown» slik at brukeren bekrefter manuelt.
 * ───────────────────────────────────────────────────────────────────────────
 */

import type { LookupConfidence, PropertyLookupType } from "@/lib/address/types";
import { normalize } from "@/lib/address/normalize";

export interface MappedBuilding {
  propertyType: PropertyLookupType;
  confidence: LookupConfidence;
  label: string;
}

/**
 * NS 3457 bygningstype-koder → boligtype.
 * Blokk/leilighetsbygg (141–146) og terrassehus (135) → leilighet.
 * Enebolig (111–113) → enebolig. Rekke/kjede/tomannsbolig → rekkehus.
 * Fritidsbygg (161–163) → hytte.
 */
const CODE_MAP: Record<number, MappedBuilding> = {
  111: { propertyType: "detached_house", confidence: "high", label: "Enebolig" },
  112: {
    propertyType: "detached_house",
    confidence: "high",
    label: "Enebolig med hybel/sokkelleilighet",
  },
  113: { propertyType: "detached_house", confidence: "medium", label: "Våningshus" },
  121: {
    propertyType: "row_house",
    confidence: "medium",
    label: "Tomannsbolig, vertikaldelt",
  },
  122: {
    propertyType: "row_house",
    confidence: "medium",
    label: "Tomannsbolig, horisontaldelt",
  },
  123: {
    propertyType: "row_house",
    confidence: "medium",
    label: "Våningshus tomannsbolig, vertikaldelt",
  },
  124: {
    propertyType: "row_house",
    confidence: "medium",
    label: "Våningshus tomannsbolig, horisontaldelt",
  },
  131: { propertyType: "row_house", confidence: "high", label: "Rekkehus" },
  133: {
    propertyType: "row_house",
    confidence: "high",
    label: "Kjedehus inkl. atriumhus",
  },
  135: { propertyType: "apartment", confidence: "medium", label: "Terrassehus" },
  136: {
    propertyType: "row_house",
    confidence: "medium",
    label: "Andre småhus med 3 boliger eller flere",
  },
  141: {
    propertyType: "apartment",
    confidence: "high",
    label: "Store frittliggende boligbygg på 2 etasjer",
  },
  142: {
    propertyType: "apartment",
    confidence: "high",
    label: "Store frittliggende boligbygg på 3 og 4 etasjer",
  },
  143: {
    propertyType: "apartment",
    confidence: "high",
    label: "Store frittliggende boligbygg på 5 etasjer eller mer",
  },
  144: {
    propertyType: "apartment",
    confidence: "high",
    label: "Store sammenbygde boligbygg på 2 etasjer",
  },
  145: {
    propertyType: "apartment",
    confidence: "high",
    label: "Store sammenbygde boligbygg på 3 og 4 etasjer",
  },
  146: {
    propertyType: "apartment",
    confidence: "high",
    label: "Store sammenbygde boligbygg på 5 etasjer eller mer",
  },
  161: {
    propertyType: "cabin",
    confidence: "high",
    label: "Fritidsbygg (hytte, sommerhus o.l.)",
  },
  162: {
    propertyType: "cabin",
    confidence: "high",
    label: "Helårsbolig benyttet som fritidsbolig",
  },
  163: {
    propertyType: "cabin",
    confidence: "high",
    label: "Våningshus benyttet som fritidsbolig",
  },
};

/** Slår opp en numerisk bygningstype-kode. Ukjent kode → null. */
export function mapBuildingCodeToType(
  code: number | null | undefined,
): MappedBuilding | null {
  if (code == null || Number.isNaN(code)) return null;
  return CODE_MAP[code] ?? null;
}

/**
 * Fallback: nøkkelord i en fritekst bygningsbeskrivelse. Rekkefølgen er bevisst
 * – hytte og leilighet sjekkes før enebolig slik at «våningshus benyttet som
 * fritidsbolig» klassifiseres som hytte, ikke enebolig.
 */
const KEYWORD_RULES: { propertyType: PropertyLookupType; words: string[] }[] = [
  {
    propertyType: "cabin",
    words: ["fritidsbolig", "fritidsbygg", "hytte", "seterhus", "feriebolig", "sommerhus"],
  },
  {
    propertyType: "apartment",
    words: [
      "boligblokk",
      "bygård",
      "blokk",
      "terrassehus",
      "leilighet",
      "flere boenheter",
      "bofellesskap",
    ],
  },
  {
    propertyType: "row_house",
    words: ["rekkehus", "kjedehus", "atriumhus", "sammenbygd", "tomannsbolig"],
  },
  {
    propertyType: "detached_house",
    words: ["enebolig", "frittliggende enebolig", "våningshus"],
  },
];

/** Slår opp fra fritekst beskrivelse. Ingen match → null. */
export function mapBuildingLabelToType(
  label: string | null | undefined,
): MappedBuilding | null {
  if (!label) return null;
  const n = normalize(label);
  for (const rule of KEYWORD_RULES) {
    if (rule.words.some((w) => n.includes(w))) {
      return { propertyType: rule.propertyType, confidence: "medium", label };
    }
  }
  return null;
}
