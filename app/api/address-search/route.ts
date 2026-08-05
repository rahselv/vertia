import { NextResponse } from "next/server";
import type { AddressSearchResponse, SelectedAddress } from "@/lib/address/types";
import { buildDisplayAddress, toTitleCase } from "@/lib/address/normalize";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  GET /api/address-search?q=...
 * ───────────────────────────────────────────────────────────────────────────
 *  Serverside-proxy mot Kartverkets/Geonorges offisielle adresse-API. Vi kaller
 *  ALDRI den eksterne tjenesten direkte fra UI. Ruten validerer input, setter
 *  timeout, håndterer feil rolig og returnerer et stabilt JSON-format.
 *
 *  Kilde: https://ws.geonorge.no/adresser/v1/sok  (åpent, ingen nøkkel kreves)
 * ───────────────────────────────────────────────────────────────────────────
 */

const GEONORGE_URL = "https://ws.geonorge.no/adresser/v1/sok";
const MIN_QUERY_LENGTH = 3;
const MAX_QUERY_LENGTH = 150;
const RESULTS_PER_PAGE = 8;
const UPSTREAM_TIMEOUT_MS = 5000;

/** Rå adresse-oppføring fra Geonorge (kun feltene vi bruker). */
interface GeonorgeAddress {
  adressenavn?: string;
  adressetekst?: string;
  nummer?: number;
  bokstav?: string;
  postnummer?: string;
  poststed?: string;
  kommunenavn?: string;
  kommunenummer?: string;
  adressekode?: number;
  representasjonspunkt?: { lat?: number; lon?: number };
}

const empty: AddressSearchResponse = { results: [] };

function toSelectedAddress(raw: GeonorgeAddress): SelectedAddress | null {
  const lat = raw.representasjonspunkt?.lat;
  const lon = raw.representasjonspunkt?.lon;
  if (typeof lat !== "number" || typeof lon !== "number") return null;
  if (!raw.postnummer || !raw.poststed) return null;

  const houseNumber = raw.nummer != null ? String(raw.nummer) : "";
  const houseLetter = raw.bokstav?.trim() || undefined;
  const addressName = raw.adressenavn ?? "";
  const addressText =
    raw.adressetekst ??
    `${addressName} ${houseNumber}${houseLetter ?? ""}`.trim();
  const municipalityName = toTitleCase(raw.kommunenavn ?? "");
  const postalPlace = toTitleCase(raw.poststed);

  return {
    displayAddress: buildDisplayAddress(addressText, raw.postnummer, raw.poststed),
    addressName,
    houseNumber,
    houseLetter,
    postalCode: raw.postnummer,
    postalPlace,
    municipalityName,
    municipalityNumber: raw.kommunenummer,
    latitude: lat,
    longitude: lon,
    addressId:
      raw.kommunenummer && raw.adressekode != null
        ? `${raw.kommunenummer}-${raw.adressekode}-${houseNumber}${houseLetter ?? ""}`
        : undefined,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  // Ikke søk på for kort/tomt input; ikke send for lange strenger videre.
  if (query.length < MIN_QUERY_LENGTH) return NextResponse.json(empty);
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(empty, { status: 400 });
  }

  // Wildcard-søk: query encodes, «*» beholdes ukodet slik Geonorge forventer.
  const upstream = `${GEONORGE_URL}?sok=${encodeURIComponent(query)}*&treffPerSide=${RESULTS_PER_PAGE}&asciiKompatibel=true`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const res = await fetch(upstream, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      // Ikke eksponer intern feil – rolig, tomt svar.
      return NextResponse.json(empty, { status: 502 });
    }
    const data: unknown = await res.json();
    const list = (data as { adresser?: GeonorgeAddress[] })?.adresser ?? [];
    const results = list
      .map(toSelectedAddress)
      .filter((a): a is SelectedAddress => a !== null)
      .slice(0, RESULTS_PER_PAGE);
    return NextResponse.json({ results } satisfies AddressSearchResponse);
  } catch {
    return NextResponse.json(empty, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
