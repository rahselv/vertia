const faqs = [
  {
    question: "Hva koster det?",
    answer:
      "Vi tar en fast provisjon av leieinntekten: 15, 20 eller 25 prosent avhengig av pakke. Ingen faste månedsavgifter: vi tjener kun når boligen din tjener. Oppstartspakken fra 5 000 kr per bolig kommer i tillegg, og du får alltid en konkret totalpris før du bestemmer deg.",
  },
  {
    question: "Hva med skatt og MVA?",
    answer:
      "Inntekt fra korttidsutleie er normalt skattepliktig, og reglene avhenger av om du leier ut egen bolig eller en separat enhet. Vi er ikke regnskapsførere, men vi gir deg en ryddig månedsrapport som gjør det enkelt for deg eller regnskapsføreren din å rapportere riktig.",
  },
  {
    question: "Kan jeg bruke boligen selv?",
    answer:
      "Ja. Du sperrer av datoene du vil ha til egen bruk i «eier-blokk»-kalenderen, så leier vi ikke ut i de periodene. Boligen er fortsatt din, og vi drifter bare utleien rundt din egen bruk.",
  },
  {
    question: "Hvordan håndteres nøkler og innsjekk?",
    answer:
      "Vi installerer en Igloohome Smart Keybox 3 (eller Yale Doorman kodelås der det passer). Gjestene får en engangskode som kun virker under sitt opphold, og du slipper å møte opp eller levere nøkler.",
  },
  {
    question: "Er korttidsutleie lovlig?",
    answer:
      "Ja, men det finnes regler. Blant annet rundt antall utleiedøgn i egen bolig, og eventuelle vedtekter i sameier og borettslag. Vi hjelper deg å sjekke hva som gjelder for nettopp din bolig før vi starter.",
  },
  {
    question: "Hvor raskt kan jeg være i gang?",
    answer:
      "Som regel er annonsen klar og publisert innen 1 til 2 uker etter at vi har vært innom og klargjort boligen. Vi sier alltid fra om noe påvirker tidslinjen.",
  },
];

/**
 * Ofte stilte spørsmål. To kolonner med sticky tittel til venstre.
 * Bruker native <details>, så spørsmålene virker også uten JS.
 */
export default function FaqV2() {
  return (
    <section
      className="section"
      id="faq"
      style={{ background: "var(--sand-50)" }}
    >
      <div className="wrap faq-grid">
        <div className="sticky rv">
          <h2 className="sec-title">
            Ofte stilte <em>spørsmål</em>
          </h2>
        </div>

        <div className="faq rv" style={{ transitionDelay: ".1s" }}>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
