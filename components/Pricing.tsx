import PricingTiers from "@/components/PricingTiers";
import RevealText from "@/components/motion/RevealText";
import { startupItems } from "@/lib/startupPackage";

const packages = [
  {
    name: "Basis",
    commission: "15 %",
    description: "Det viktigste for å komme i gang med utleien.",
    features: [
      "Profesjonell annonse",
      "Dynamisk prising",
      "Gjestekommunikasjon",
      "Månedlig eierrapport",
    ],
    popular: false,
  },
  {
    name: "Full",
    commission: "20 %",
    description: "Vår mest komplette tjeneste. Vi tar oss av alt det praktiske.",
    features: [
      "Alt i Basis",
      "1 kontaktperson som hjelper deg hele veien",
      "Vask-koordinering",
      "Nøkkelfri innsjekk",
      "Småvedlikehold",
      "Månedlig eierrapport",
    ],
    popular: true,
  },
  {
    name: "Premium",
    commission: "25 %",
    description: "Maks synlighet og inntrykk for boliger som skal skinne.",
    features: [
      "Alt i Full",
      "1 kontaktperson som hjelper deg hele veien",
      "Prioritert respons til dine gjester",
      "Sesongklargjøring av boligen",
      "Månedlig eierrapport",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="priser" className="section bg-sand-100">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <RevealText as="p" className="eyebrow mb-4">
            Pakker og priser
          </RevealText>
          <RevealText as="h2" className="section-title" delay={0.08}>
            Velg den pakken som passer deg
          </RevealText>
          <RevealText
            as="p"
            className="section-lead mx-auto max-w-xl"
            delay={0.16}
          >
            Kommisjon, ingen skjulte kostnader.
          </RevealText>
        </div>

        {/* ── Oppstartspakken: alltid i tillegg, kompakt stripe øverst ─────── */}
        <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-[2rem] bg-brand-600 text-sand-50 shadow-soft">
          <div className="p-7 sm:p-9">
            {/* Topplinje: pakke-info til venstre, pris til høyre */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full bg-sand-50/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sand-50/80">
                  Oppstart per bolig
                </span>
                <h3 className="mt-3 font-display text-xl font-medium leading-tight tracking-[-0.02em] text-sand-50 sm:text-2xl">
                  Oppstartspakken
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-100/80">
                  Alt som skal til for å gjøre boligen klar for utleie, gjort
                  ferdig av oss.
                </p>
              </div>
              <div className="flex items-baseline gap-1.5 sm:shrink-0 sm:flex-col sm:items-end sm:gap-0.5 sm:text-right">
                <span className="font-display text-2xl font-medium tracking-[-0.02em] text-sand-50 sm:text-3xl">
                  5 000 kr
                </span>
                <span className="text-sm text-sand-100/70">per bolig</span>
              </div>
            </div>

            <div className="my-7 h-px w-full bg-sand-50/15" />

            {/* De 5 punktene: sentrert rad, ufullstendige rader midtstilles
                (ingen ensom hengende oppføring på noe breakpoint) */}
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-7">
              {startupItems.map(({ icon: Icon, title }) => (
                <li
                  key={title}
                  className="flex w-[calc(50%-0.75rem)] flex-col items-center gap-3 text-center sm:w-[calc(33.333%-1rem)] lg:w-auto lg:flex-1"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand-50/10 text-sand-50">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-sm font-medium leading-snug text-sand-50">
                    {title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Tydelig: oppstart kommer i tillegg til valgt nivå ────────────── */}
        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center">
          <p className="rounded-full bg-brand-600 px-6 py-3 text-center text-sm font-medium text-sand-50 shadow-card">
            Oppstart per bolig kommer i tillegg til valgt nivå.
          </p>
        </div>

        {/* ── De tre nivåene: Basis, Full, Premium – alle vist åpent ───────── */}
        <PricingTiers packages={packages} />
      </div>
    </section>
  );
}
