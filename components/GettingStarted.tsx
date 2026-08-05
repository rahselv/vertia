import {
  PhoneCall,
  Camera,
  KeyRound,
  CalendarDays,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";
import SampleReportModal from "./SampleReportModal";
import ReportMiniChart, { type MiniBar } from "./ReportMiniChart";

const steps: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Vi kontakter deg",
    description:
      "En kort, uforpliktende prat om boligen din, beliggenhet og hva du ønsker deg av utleien.",
    Icon: PhoneCall,
  },
  {
    title: "Vi gjør klar",
    description:
      "Foto, annonse, prising og oppsett. Vi klargjør alt slik at boligen fremstår på sitt beste.",
    Icon: Camera,
  },
  {
    title: "Nøkkelfri tilgang",
    description:
      "Vi installerer en smart nøkkelboks med engangskode per gjest. Du leverer bare nøkkelen én gang.",
    Icon: KeyRound,
  },
  {
    title: "Du bestemmer tilgjengelige dager",
    description:
      "Du bestemmer selv hvilke dager boligen er tilgjengelig for utleie, og kan holde av dagene du vil bruke den selv.",
    Icon: CalendarDays,
  },
  {
    title: "Du får rapport og utbetaling",
    description:
      "Full månedlig rapport og pengene rett på konto. Du har alltid full oversikt.",
    Icon: FileBarChart,
  },
];

// Fiktive illustrasjonstall for søylegrafen i eksempel-rapporten.
const reportBars: MiniBar[] = [
  { month: "Jan", value: 44, amount: 16700 },
  { month: "Feb", value: 38, amount: 14200 },
  { month: "Mar", value: 56, amount: 20200 },
  { month: "Apr", value: 63, amount: 22800 },
  { month: "Mai", value: 74, amount: 25600 },
  { month: "Jun", value: 88, amount: 30800, highlight: true },
];

export default function GettingStarted() {
  return (
    <section id="slik-fungerer-det" className="section bg-sand-50">
      <div className="container-page">
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">Slik kommer du i gang</p>
            <h2 className="section-title font-display max-w-xl tracking-tight">
              Fra første prat til penger på konto
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-ink-500 lg:col-span-5 lg:pb-2">
            Vi gjør jobben i fem enkle steg. Du beholder boligen, kontrollen og
            inntekten.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Rolig tidslinje */}
          <ol className="relative mx-auto w-full max-w-xl">
            <span
              aria-hidden
              className="absolute left-[27px] top-5 bottom-5 w-px bg-sand-300"
            />
            {steps.map(({ title, description, Icon }, index) => (
              <li key={title} className="relative flex gap-6 pb-12 last:pb-0">
                <span className="relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-sand-200 bg-white text-brand-500 shadow-soft">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-sand-50">
                    {index + 1}
                  </span>
                </span>
                <div className="pt-2.5">
                  <h3 className="font-display text-xl font-medium tracking-tight text-ink-900">
                    {title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-500">{description}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Varmt bilde + fremhevet månedsrapport */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-ink-900/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1100&q=80"
                alt="Lunt, varmt skandinavisk stuerom med skinnsofa og planter i gyllent lys"
                loading="lazy"
                className="h-72 w-full object-cover sm:h-80"
              />
            </div>

            {/* Eksempel på den månedlige eierrapporten (fiktive illustrasjonstall). */}
            <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-soft">
              <div className="flex items-center justify-between gap-3 bg-brand-600 px-6 py-5 text-white sm:px-7">
                <div className="flex items-center gap-3.5">
                  <div>
                    <h3
                      className="font-display text-base font-medium leading-tight tracking-tight !text-white sm:text-lg"
                      style={{ color: "#FFFFFF" }}
                    >
                      Månedlig eierrapport
                    </h3>
                  </div>
                </div>
                <span className="shrink-0 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/60">
                  Eksempeldata
                </span>
              </div>

              <div className="p-6 sm:p-7">
                {/* Liten interaktiv søylegraf over utbetaling de siste
                    månedene. Trykk på en søyle for beløpet. */}
                <ReportMiniChart bars={reportBars} />
                <p className="mt-2.5 text-xs text-ink-500">
                  Utbetaling siste seks måneder · trykk på en søyle for beløp
                </p>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Netter booket</dt>
                    <dd className="font-medium text-ink-900">21 av 30</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Bruttoinntekt</dt>
                    <dd className="font-medium text-ink-900">kr 38 200</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Kostnader (vask, provisjon)</dt>
                    <dd className="font-medium text-ink-900">− kr 7 400</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-sand-50 px-5 py-4">
                  <span className="text-sm font-semibold text-ink-900">
                    Din utbetaling
                  </span>
                  <span className="font-display text-2xl font-medium tracking-tight text-brand-600">
                    kr 30 800
                  </span>
                </div>

                <div className="mt-4">
                  <SampleReportModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
