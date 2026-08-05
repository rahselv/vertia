const faqs = [
  {
    question: "Hva koster det?",
    answer:
      "Vi tar en fast provisjon av leieinntekten — 15, 20 eller 25 prosent avhengig av pakke. Ingen faste månedsavgifter: vi tjener kun når boligen din tjener. Oppstartspakken på 5 000 kr per bolig kommer i tillegg, og du får alltid en konkret totalpris før du bestemmer deg.",
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
      "Vi installerer en Igloohome Smart Keybox 3 (eller Yale Doorman kodelås der det passer). Gjestene får en engangskode som kun virker under sitt opphold — du slipper å møte opp eller levere nøkler.",
  },
  {
    question: "Er korttidsutleie lovlig?",
    answer:
      "Ja, men det finnes regler. Blant annet rundt antall utleiedøgn i egen bolig, og eventuelle vedtekter i sameier og borettslag. Vi hjelper deg å sjekke hva som gjelder for nettopp din bolig før vi starter.",
  },
  {
    question: "Hvor raskt kan jeg være i gang?",
    answer:
      "Som regel er annonsen klar og publisert innen 1–2 uker etter at vi har vært innom og klargjort boligen. Vi sier alltid fra om noe påvirker tidslinjen.",
  },
];

import { ChevronDown } from "lucide-react";

export default function Faq() {
  return (
    <section id="faq" className="section bg-sand-100">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">Spørsmål og svar</p>
          <h2 className="section-title">Ofte stilte spørsmål</h2>
        </div>

        <div className="mx-auto mt-14 max-w-3xl border-t border-ink-900/10">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group border-b border-ink-900/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-base font-medium text-ink-900 transition-colors duration-200 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-4 focus-visible:ring-offset-sand-100">
                {faq.question}
                <ChevronDown
                  aria-hidden
                  strokeWidth={2}
                  className="h-5 w-5 flex-none text-ink-500 transition-transform duration-300 ease-out group-hover:text-brand-700 group-open:rotate-180"
                />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-ink-700">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
