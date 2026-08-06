{/* PLASSHOLDER: bytt ut med ekte medieomtale, logoer og sitater før lansering. */}

import { Quote } from "lucide-react";

// Tydelig generiske plassholder-publikasjoner – IKKE ekte endorsements.
// Bytt ut med reelle mediehus før lansering.
const publications: string[] = [
  "PUBLIKASJON",
  "Norsk Næringsliv",
  "Bolig & Hjem",
  "Eiendom Idag",
  "Hytteliv",
];

// Plassholder-sitater, nøytralt formulert. Bytt ut med ekte omtale.
const features: { quote: string; source: string; date?: string }[] = [
  {
    quote:
      "En gjennomført, skandinavisk tilnærming til korttidsutleie – der eieren beholder roen og gjesten merker omtanken.",
    source: "Publikasjon",
    date: "2026",
  },
  {
    quote:
      "Detaljnivået skiller dem fra mengden i et marked fullt av løfter. Her er løftet faktisk innfridd.",
    source: "Norsk Næringsliv",
    date: "2026",
  },
  {
    quote:
      "Utleie gjort nesten umerkelig enkelt. Vertia tar hånd om det praktiske med en sjelden ro.",
    source: "Bolig & Hjem",
    date: "2026",
  },
];

export default function Trust() {
  return (
    <section className="section bg-sand-50">
      <div className="container-page">
        {/* Asymmetrisk, venstrestilt redaksjonell seksjonsintro. */}
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">I media</p>
            <h2 className="section-title max-w-xl">Vertia i media</h2>
          </div>
          <p className="text-lg leading-relaxed text-ink-500 lg:col-span-5 lg:pb-2">
            Et utvalg av hvordan arbeidet vårt blir omtalt – fortalt med samme ro
            som vi driver utleien.
          </p>
        </div>

        {/* «Omtalt i»-stripe med dempede serif-wordmarks på en rolig sandband. */}
        <div className="mt-16 overflow-hidden border border-sand-200 bg-white px-6 py-9 sm:px-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-ink-500">
            Omtalt i
          </p>
          <ul className="mt-7 flex flex-wrap items-center gap-x-10 gap-y-5 sm:gap-x-14">
            {publications.map((name) => (
              <li
                key={name}
                className="font-serif text-xl font-medium tracking-tight text-brand-600/70 transition-colors duration-200 hover:text-brand-600 sm:text-2xl"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* Redaksjonelle presse-sitat-kort. */}
        <div className="mt-12 grid gap-6 sm:gap-7 lg:grid-cols-3">
          {features.map(({ quote, source, date }) => (
            <figure
              key={source}
              className="card-lift flex h-full flex-col rounded-[1.75rem] bg-white p-8 shadow-card ring-1 ring-ink-900/5 sm:p-9"
            >
              <Quote
                aria-hidden
                className="h-8 w-8 flex-none text-brand-600/30"
                strokeWidth={1.5}
              />
              <blockquote className="mt-5 font-serif text-xl font-medium leading-snug tracking-tight text-ink-900 sm:text-[1.45rem]">
                {quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-ink-900/10 pt-5">
                <span className="font-serif text-base font-medium text-brand-600">
                  {source}
                </span>
                {date && (
                  <>
                    <span aria-hidden className="h-3.5 w-px bg-ink-900/15" />
                    <span className="text-sm text-ink-500">{date}</span>
                  </>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
