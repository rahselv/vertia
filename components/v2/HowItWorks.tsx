import KeyboxModal from "./KeyboxModal";

/** Fiktive illustrasjonstall til eksempel-rapporten, som i designet. */
const bars = [
  { month: "Jan", height: 50, amount: "kr 16 700" },
  { month: "Feb", height: 43, amount: "kr 14 200" },
  { month: "Mar", height: 64, amount: "kr 20 200" },
  { month: "Apr", height: 72, amount: "kr 22 800" },
  { month: "Mai", height: 84, amount: "kr 25 600" },
  { month: "Jun", height: 100, amount: "kr 30 800", highlight: true },
];

/**
 * «Slik fungerer det» – fire vekslende steg med bilde.
 *
 * Merk: designet skriver «fem enkle steg» i ingressen, men viser bare fire.
 * v1 hadde fem (steget om eier-blokk-kalenderen falt ut i v2). Vi skriver
 * «fire» så teksten stemmer med det som faktisk står på siden.
 */
export default function HowItWorksV2() {
  return (
    <section
      className="section"
      id="slik-fungerer-det"
      style={{ background: "var(--sand-50)" }}
    >
      <div className="wrap">
        <div className="sec-head sec-row rv">
          <div>
            {/* Uten <em>: designet setter kursiv på em i overskrifter, og
                «penger på konto» skal stå rett. */}
            <h2 className="sec-title">Fra første prat til penger på konto</h2>
          </div>
          <p className="sec-lead">
            Vi gjør jobben i fire enkle steg. Du beholder boligen, kontrollen og
            inntekten.
          </p>
        </div>

        <div className="stepsx">
          <div className="stepx rv">
            <div>
              <h3>Vi kontakter deg</h3>
              <p>
                En kort, uforpliktende prat om boligen din, beliggenhet og hva
                du ønsker deg av utleien.
              </p>
            </div>
            <div className="sx-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/service/02-gjestekommunikasjon.png"
                alt="Telefon med gjestedialog i varmt lys på et stuebord"
                loading="lazy"
              />
            </div>
          </div>

          <div className="stepx flip rv">
            <div>
              <h3>Vi gjør klar</h3>
              <p>
                Foto, annonse, prising og oppsett. Vi klargjør alt slik at
                boligen fremstår på sitt beste.
              </p>
            </div>
            <div className="sx-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/service/01-profesjonell-annonse.png"
                alt="Lys, stylet stue klar for fotografering"
                loading="lazy"
              />
            </div>
          </div>

          <div className="stepx rv">
            <div>
              <h3>Nøkkelfri tilgang</h3>
              <p>
                Vi installerer en smart nøkkelboks med engangskode per gjest. Du
                leverer bare nøkkelen én gang.
              </p>
              <KeyboxModal />
            </div>
            <div className="sx-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/service/03-nokkelfri-innsjekk.png"
                alt="Kodelås på en varm tredør inn til boligen"
                loading="lazy"
              />
            </div>
          </div>

          <div className="stepx flip rv">
            <div>
              <h3>Rapport og utbetaling</h3>
              <p>
                Full månedlig rapport og pengene rett på konto. Du har alltid
                full oversikt.
              </p>
            </div>

            <div className="report">
              <div className="rh">
                <h3>Månedlig eierrapport</h3>
              </div>
              <div className="rb">
                <div className="bars" aria-label="Utbetaling siste seks måneder">
                  {bars.map((bar) => (
                    <div
                      key={bar.month}
                      className={bar.highlight ? "hi" : undefined}
                      style={{ height: `${bar.height}%` }}
                      title={bar.amount}
                    >
                      <span>{bar.month}</span>
                    </div>
                  ))}
                </div>

                <dl>
                  <div>
                    <dt>Netter booket</dt>
                    <dd>21 av 30</dd>
                  </div>
                  <div>
                    <dt>Bruttoinntekt</dt>
                    <dd>kr 38 200</dd>
                  </div>
                  <div>
                    <dt>Kostnader (vask, provisjon)</dt>
                    <dd>− kr 7 400</dd>
                  </div>
                </dl>

                <div className="sum">
                  <b>Din utbetaling</b>
                  <span>kr 30 800</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
