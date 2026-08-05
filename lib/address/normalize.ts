/**
 * ───────────────────────────────────────────────────────────────────────────
 *  NORMALISERING AV ADRESSETEKST
 * ───────────────────────────────────────────────────────────────────────────
 *  Små, rene hjelpefunksjoner. Geonorge returnerer f.eks. kommunenavn og
 *  poststed i STORE BOKSTAVER – vi normaliserer for sammenligning og gjør pen
 *  visning med Title Case.
 * ───────────────────────────────────────────────────────────────────────────
 */

/** Trim + små bokstaver (norsk locale) for trygg sammenligning. */
export const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase("nb-NO");

/**
 * Gjør «OSLO» → «Oslo» og «NORDRE FOLLO» → «Nordre Follo».
 * Håndterer mellomrom, bindestrek og skråstrek som ordskiller.
 */
export function toTitleCase(value: string): string {
  return value
    .toLocaleLowerCase("nb-NO")
    .replace(/(^|[\s\-/])(\p{L})/gu, (_m, sep: string, ch: string) =>
      sep + ch.toLocaleUpperCase("nb-NO"),
    );
}

/**
 * Bygger visningsadressen, f.eks. «Birgitte Hammers vei 16, 1167 Oslo».
 */
export function buildDisplayAddress(
  addressText: string,
  postalCode: string,
  postalPlace: string,
): string {
  const place = `${postalCode} ${toTitleCase(postalPlace)}`.trim();
  return place ? `${addressText}, ${place}` : addressText;
}
