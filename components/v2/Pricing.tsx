"use client";

import { useState } from "react";
import ArrowIcon from "./ArrowIcon";

/**
 * Innholdet i oppstartspakken. Kortformene er hentet fra v2-designet; den
 * utfyllende beskrivelsen av hvert punkt ligger i lib/startupPackage.ts, som
 * fortsatt brukes av v1-komponentene.
 */
const startupItems = [
  "Smart tilgang",
  "Profesjonelle foto",
  "Annonseoppsett",
  "Klargjøring & styling",
];

type Tier = {
  name: string;
  percent: string;
  description: string;
  features: string[];
  popular?: boolean;
};

/**
 * Designet listet «3D-visning av boligen» i alle tre pakkene, også i Full som
 * ellers bare sier «Alt i Basis». Det var en duplikatfeil – den står nå kun i
 * Premium.
 */
const tiers: Tier[] = [
  {
    name: "Basis",
    percent: "15",
    description: "Det viktigste for å komme i gang med utleien.",
    features: [
      "Profesjonell annonse",
      "Dynamisk prising",
      "Gjestekommunikasjon",
      "1 kontaktperson hele veien",
      "Månedlig eierrapport",
    ],
  },
  {
    name: "Full",
    percent: "20",
    description: "Vår mest komplette tjeneste. Vi tar oss av alt det praktiske.",
    features: [
      "Alt i Basis",
      "Vask-koordinering",
      "Nøkkelfri innsjekk",
      "Småvedlikehold",
    ],
    popular: true,
  },
  {
    name: "Premium",
    percent: "25",
    description: "Maks synlighet og inntrykk for boliger som skal skinne.",
    features: [
      "Alt i Full",
      "3D-visning av boligen",
      "Prioritert respons til dine gjester",
      "Sesongklargjøring av boligen",
    ],
  },
];

const popularName = tiers.find((t) => t.popular)?.name ?? null;

export default function PricingV2() {
  // Standard: den populære pakken er mørk. Hovrer man et annet kort, flyttes
  // den mørke tilstanden dit – som i designet.
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? popularName;

  return (
    <section
      className="section"
      id="priser"
      style={{ background: "var(--sand-50)" }}
    >
      <div className="wrap">
        <div className="sec-head sec-row rv">
          <div>
            <h2 className="sec-title">
              Velg den pakken som <em>passer deg</em>
            </h2>
          </div>
          <p className="sec-lead">Kommisjon, ingen skjulte kostnader.</p>
        </div>

        {/* ── Oppstartspakken ─────────────────────────────────────────────── */}
        <div className="startpk rv">
          <div className="sp-top">
            <div>
              <h3 style={{ marginTop: 0 }}>Alt klart før første gjest</h3>
              <p className="d">
                Vi gjør boligen klar for utleie – fra tilgang og foto til annonse
                og styling.
              </p>
            </div>
            <div className="pris">
              <b>fra 5 000 kr</b>
              <span>engangsbeløp per bolig</span>
            </div>
          </div>

          <hr className="sp-div" />

          <ul className="sp-items">
            {startupItems.map((item, i) => (
              <li key={item}>
                <em>{String(i + 1).padStart(2, "0")}</em>
                {item}
              </li>
            ))}
          </ul>

          <div className="sp-cta">
            <a href="#kontakt" className="lnk-light">
              Kom i gang <ArrowIcon size={15} strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* ── De tre nivåene ──────────────────────────────────────────────── */}
        <div className="tiers rv">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={active === tier.name ? "tier on" : "tier"}
              onMouseEnter={() => setHovered(tier.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {tier.popular && <span className="tag">Mest valgt</span>}
              <p className="nm">{tier.name}</p>
              <p className="pct">
                {tier.percent}
                <i> %</i>
              </p>
              <p className="of">av brutto leieinntekt</p>
              <p className="ds">{tier.description}</p>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a href="#kontakt" className="btn">
                Få et tilbud
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
