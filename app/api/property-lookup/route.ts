import { NextResponse } from "next/server";
import type { LookupConfidence, PropertyLookupResponse } from "@/lib/address/types";
import { mapBuildingCodeToType } from "@/lib/property/map-building-type";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  GET /api/property-lookup?lat=..&lon=..&addressId=..
 * ───────────────────────────────────────────────────────────────────────────
 *  Forsøker å finne offisiell boligtype for en adresse via nærmeste
 *  bygningspunkt i Matrikkelen (Kartverket). Dette er et BEST-EFFORT-oppslag:
 *  finner vi ikke et trygt resultat – eller er kilden utilgjengelig – returnerer
 *  vi «unknown», og UI lar brukeren bekrefte boligtypen manuelt.
 *
 *  Kilde: Matrikkelen – Bygningspunkt (Geonorge WFS, åpen, ingen nøkkel).
 *
 *  BEGRENSNING: Bygningstype-attributtet er ikke alltid åpent eksponert for alle
 *  bygg, og en gateadresse kan peke til et bygg med flere boenheter. Vi tolker
 *  derfor konservativt (bl.a. «medium» confidence ved usikkerhet) og faller til
 *  «unknown» framfor å gjette.
 * ───────────────────────────────────────────────────────────────────────────
 */

const WFS_URL =
  "https://wfs.geonorge.no/skwms1/wfs.matrikkelen-bygningspunkt";
const UPSTREAM_TIMEOUT_MS = 4500;
// ~55 m søkerute rundt punktet (grader). Bredt nok til å treffe bygget,
// smalt nok til å unngå nabobygg i tett bebyggelse.
const BBOX_DELTA = 0.0005;

const UNKNOWN: PropertyLookupResponse = {
  propertyType: "unknown",
  confidence: "low",
};

const confidenceRank: Record<LookupConfidence, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function parseCoord(value: string | null, max: number): number | null {
  if (value == null || value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || Math.abs(n) > max) return null;
  return n;
}

async function lookupBuildingType(
  lat: number,
  lon: number,
): Promise<PropertyLookupResponse> {
  const bbox = [
    lat - BBOX_DELTA,
    lon - BBOX_DELTA,
    lat + BBOX_DELTA,
    lon + BBOX_DELTA,
    "urn:ogc:def:crs:EPSG::4326",
  ].join(",");

  const url =
    `${WFS_URL}?service=WFS&version=2.0.0&request=GetFeature` +
    `&typeNames=app:Bygning&count=20&srsName=urn:ogc:def:crs:EPSG::4326` +
    `&bbox=${encodeURIComponent(bbox)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/gml+xml, text/xml, */*" },
    });
    if (!res.ok) return UNKNOWN;
    const body = await res.text();

    // Plukk ut alle «bygningstype»-koder i responsen (GML/XML), og velg det
    // tryggeste boligtype-treffet. Vi stopper på første «high».
    const matches = body.matchAll(/bygningstype[^>]*>\s*(\d{2,3})\s*</gi);
    let best: PropertyLookupResponse | null = null;
    for (const m of matches) {
      const code = Number(m[1]);
      const mapped = mapBuildingCodeToType(code);
      if (!mapped) continue;
      const candidate: PropertyLookupResponse = {
        propertyType: mapped.propertyType,
        confidence: mapped.confidence,
        source: "Matrikkelen – Bygningspunkt (Kartverket)",
        buildingTypeCode: String(code),
        buildingTypeLabel: mapped.label,
      };
      if (!best || confidenceRank[candidate.confidence] > confidenceRank[best.confidence]) {
        best = candidate;
      }
      if (candidate.confidence === "high") break;
    }
    return best ?? UNKNOWN;
  } catch {
    return UNKNOWN;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseCoord(searchParams.get("lat"), 90);
  const lon = parseCoord(searchParams.get("lon"), 180);

  // Ugyldige koordinater: svar rolig med «unknown» (ingen teknisk feil ut).
  if (lat === null || lon === null) {
    return NextResponse.json(UNKNOWN, { status: 400 });
  }

  const result = await lookupBuildingType(lat, lon);
  return NextResponse.json(result);
}
