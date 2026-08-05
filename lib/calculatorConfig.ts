/**
 * ───────────────────────────────────────────────────────────────────────────
 *  INNTEKTSKALKULATOR – FORUTSETNINGER (MARKEDSBASERT, 2026)
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  ALT du trenger for å justere kalkulatoren ligger i dette ene objektet.
 *  Du trenger IKKE røre noe annet i koden for å endre tallene.
 *
 *  Begreper:
 *   - ADR (Average Daily Rate) = gjennomsnittlig døgnpris gjesten betaler.
 *   - belegg (occupancy)       = andel av tilgjengelige netter som blir booket.
 *   - provisjon                = vår andel av bruttoinntekten (0.20 = 20 %).
 *
 *  Formel:
 *   bruttoinntekt = ADR × belegg × antall netter
 *   nettoinntekt  = bruttoinntekt × (1 − provisjon)        // 0,8 ved 20 %
 *
 *  Tallene under er markedsbaserte estimater for korttidsutleie tidlig 2026
 *  (kilde: AirDNA / AirROI / Investropa, Oslo-marked). Juster fritt.
 * ───────────────────────────────────────────────────────────────────────────
 */

export type AreaKey =
  | "oslo"
  | "baerum"
  | "asker"
  | "trysil"
  | "hemsedal"
  | "annet";

export type PropertyType = "leilighet" | "enebolig" | "rekkehus" | "hytte";

/** Prisgruppe som boligtypene faller inn under. */
type PricingGroup = "leilighet" | "hus" | "hytte";

interface MarketBasis {
  adr: number;
  occupancy: number;
}

export const calculatorConfig = {
  /** Vår provisjon av bruttoinntekt. 0.20 = 20 %. */
  defaultCommission: 0.2,

  /** Standardverdi og grenser for "antall netter per år"-slideren. */
  nights: {
    min: 30,
    max: 90,
    step: 5,
    default: 60,
  },

  /**
   * Døgnprisen justeres litt etter antall soverom. Markedstallene under gjelder
   * referansestørrelsen (referenceCount). Standard er satt likt referansen, slik
   * at standardestimatet treffer markedstallene eksakt.
   */
  bedrooms: {
    min: 1,
    max: 6,
    default: 2,
    referenceCount: 2,
    pricePerBedroom: 200,
  },

  /** Etiketter for områdene i nedtrekksmenyen. */
  areaLabel: {
    oslo: "Oslo",
    baerum: "Bærum",
    asker: "Asker",
    trysil: "Trysil",
    hemsedal: "Hemsedal",
    annet: "Annet område",
  } satisfies Record<AreaKey, string>,

  /** Etiketter for boligtypene. */
  propertyTypeLabel: {
    leilighet: "Leilighet",
    enebolig: "Enebolig",
    rekkehus: "Rekkehus",
    hytte: "Hytte",
  } satisfies Record<PropertyType, string>,

  /** Hver boligtype hører til én prisgruppe. */
  propertyGroup: {
    leilighet: "leilighet",
    enebolig: "hus",
    rekkehus: "hus",
    hytte: "hytte",
  } satisfies Record<PropertyType, PricingGroup>,

  /**
   * Markedsbaserte ADR (kr) og belegg (andel) per område og prisgruppe.
   * Hovedtall (2026):
   *   Oslo leilighet           1500 kr / 55 %
   *   Oslo enebolig/rekkehus   1800 kr / 50 %
   *   Bærum/Asker              1600 kr / 48 %
   *   Hytte (fjell)            2000 kr / 35 %
   */
  market: {
    oslo: {
      leilighet: { adr: 1500, occupancy: 0.55 },
      hus: { adr: 1800, occupancy: 0.5 },
      hytte: { adr: 1700, occupancy: 0.45 },
    },
    baerum: {
      leilighet: { adr: 1600, occupancy: 0.48 },
      hus: { adr: 1600, occupancy: 0.48 },
      hytte: { adr: 1700, occupancy: 0.42 },
    },
    asker: {
      leilighet: { adr: 1600, occupancy: 0.48 },
      hus: { adr: 1600, occupancy: 0.48 },
      hytte: { adr: 1700, occupancy: 0.42 },
    },
    trysil: {
      leilighet: { adr: 1500, occupancy: 0.4 },
      hus: { adr: 1800, occupancy: 0.38 },
      hytte: { adr: 2000, occupancy: 0.35 },
    },
    hemsedal: {
      leilighet: { adr: 1500, occupancy: 0.4 },
      hus: { adr: 1800, occupancy: 0.38 },
      hytte: { adr: 2000, occupancy: 0.35 },
    },
    annet: {
      leilighet: { adr: 1400, occupancy: 0.45 },
      hus: { adr: 1500, occupancy: 0.45 },
      hytte: { adr: 1700, occupancy: 0.38 },
    },
  } satisfies Record<AreaKey, Record<PricingGroup, MarketBasis>>,
} as const;

/** Soveromsalternativene som vises i kalkulatoren. */
export const bedroomOptions = [1, 2, 3, 4, 5, 6] as const;

export interface CalculatorInput {
  area: AreaKey;
  propertyType: PropertyType;
  bedrooms: number;
  nights: number;
}

export interface CalculatorResult {
  adr: number;
  occupancy: number;
  commission: number;
  grossIncome: number;
  netIncome: number;
}

/**
 * Selve utregningen – en ren funksjon som er lett å teste og gjenbruke.
 * Returnerer både brutto og netto, samt tallene som ble brukt.
 */
export function calculateIncome(input: CalculatorInput): CalculatorResult {
  const group = calculatorConfig.propertyGroup[input.propertyType];
  const basis = calculatorConfig.market[input.area][group];

  const bedroomAdjustment =
    (input.bedrooms - calculatorConfig.bedrooms.referenceCount) *
    calculatorConfig.bedrooms.pricePerBedroom;

  // Døgnpris = markedsbasert ADR + liten justering for antall soverom.
  const adr = Math.round(basis.adr + bedroomAdjustment);
  const occupancy = basis.occupancy;
  const commission = calculatorConfig.defaultCommission;

  // bruttoinntekt = ADR × belegg × netter
  const grossIncome = Math.round(adr * occupancy * input.nights);
  // nettoinntekt = brutto × (1 − provisjon)
  const netIncome = Math.round(grossIncome * (1 - commission));

  return { adr, occupancy, commission, grossIncome, netIncome };
}

/** Formaterer et tall som norske kroner, f.eks. 245 000 kr. */
export function formatNok(value: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(value);
}
