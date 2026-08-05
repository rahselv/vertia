/**
 * ───────────────────────────────────────────────────────────────────────────
 *  ADRESSE- OG BYGNINGSTYPER
 * ───────────────────────────────────────────────────────────────────────────
 *  Delte, gjenbrukbare typer for adresse-autocomplete og automatisk oppslag av
 *  boligtype. Holdes adskilt fra UI slik at API-ruter, mapping og komponenter
 *  bruker samme kontrakt.
 * ───────────────────────────────────────────────────────────────────────────
 */

/** Normalisert adresse som lagres når brukeren velger et forslag. */
export interface SelectedAddress {
  displayAddress: string;
  addressName: string;
  houseNumber: string;
  houseLetter?: string;
  postalCode: string;
  postalPlace: string;
  municipalityName: string;
  municipalityNumber?: string;
  latitude: number;
  longitude: number;
  addressId?: string;
}

/** Stabilt svarformat fra /api/address-search. */
export interface AddressSearchResponse {
  results: SelectedAddress[];
}

/** Boligtyper slik bygningsoppslaget klassifiserer dem (kildenøytralt). */
export type PropertyLookupType =
  | "apartment"
  | "detached_house"
  | "row_house"
  | "cabin"
  | "unknown";

export type LookupConfidence = "high" | "medium" | "low";

/** Stabilt svarformat fra /api/property-lookup. */
export interface PropertyLookupResponse {
  propertyType: PropertyLookupType;
  confidence: LookupConfidence;
  source?: string;
  buildingTypeCode?: string;
  buildingTypeLabel?: string;
}

/** Om boligtypen er satt automatisk, manuelt av bruker, eller ukjent. */
export type PropertyTypeSource = "automatic" | "manual" | "unknown";
