const logos = [
  { key: "airbnb", node: <span className="mq-airbnb">airbnb</span> },
  {
    key: "booking",
    node: (
      <span className="mq-booking">
        Booking<i>.com</i>
      </span>
    ),
  },
  { key: "vrbo", node: <span className="mq-vrbo">Vrbo</span> },
  {
    key: "finn",
    node: (
      <span className="mq-finn">
        FINN<i>.no</i>
      </span>
    ),
  },
];

/**
 * Kanalstripen under heroen.
 *
 * Ren CSS-animasjon: `.mq-track` flyttes -50 %, og de to identiske listene gjør
 * løkken sømløs. Ingen JS, og `prefers-reduced-motion` stopper den i CSS.
 *
 * Logoene er ordmerker i merkefargene, slik designet gjorde det. Ikonene fra
 * v1-versjonen (Airbnb-buen og FINN-merket) er ikke med – v2 bruker rene
 * ordmerker.
 */
function LogoRow() {
  // Fire logoer to ganger, så listen er bred nok til å fylle skjermen.
  return (
    <>
      {[0, 1].map((round) =>
        logos.map((logo) => (
          <li key={`${round}-${logo.key}`}>{logo.node}</li>
        )),
      )}
    </>
  );
}

export default function ChannelsV2() {
  return (
    <section className="chan-band">
      <div className="wrap rv">
        <p className="mq-lead">
          I samarbeid med markedsplassene som treffer best
        </p>
      </div>

      <div
        className="mq rv"
        style={{ transitionDelay: ".12s" }}
        aria-label="Airbnb, Booking.com, Vrbo og FINN.no"
      >
        <div className="mq-track">
          <ul>
            <LogoRow />
          </ul>
          <ul aria-hidden="true">
            <LogoRow />
          </ul>
        </div>
      </div>
    </section>
  );
}
