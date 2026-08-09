import ArrowIcon from "./ArrowIcon";

const badges = [
  "Ingen binding",
  "Faste, lokale renholdere",
  "Transparent månedsrapport",
];

/**
 * Hero for v2. Sentrert redaksjonell komposisjon, til forskjell fra v1 som var
 * venstrestilt. Bildet ligger som et vanlig <img> bak en gradient-scrim og et
 * hårfint korn.
 *
 * Vi bruker <img> og ikke next/image her fordi bildet dekker hele viewporten via
 * CSS (`object-fit:cover` på 100 % høyde), og `fetchPriority="high"` gir oss den
 * tidlige lastingen som betyr noe for LCP.
 */
export default function HeroV2() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/vertia-forsidebilde.png"
          alt="Varm, rolig stue i gyllent lys med sofa, lenestol, sideboard og planter"
          fetchPriority="high"
        />
      </div>
      <div className="hero-scrim" />
      <div className="grain" aria-hidden="true" />

      <div className="wrap">
        <p className="hero-kicker rv">
          Airbnb-forvaltning for bolig- og hytteeiere
        </p>

        <h1 className="rv" style={{ transitionDelay: ".1s" }}>
          Tjen penger på boligen når den <em>står stille</em>
        </h1>

        <div className="hero-cta rv" style={{ transitionDelay: ".2s" }}>
          <a href="#kalkulator" className="btn btn-on-image">
            Få gratis inntektsestimat <ArrowIcon />
          </a>
          <a href="#slik-fungerer-det" className="btn btn-outline-light">
            Slik fungerer det
          </a>
        </div>

        <ul className="hero-badges rv" style={{ transitionDelay: ".3s" }}>
          {badges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
