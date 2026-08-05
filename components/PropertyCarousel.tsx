import {
  Scan,
  BedDouble,
  Snowflake,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type Spec = { icon: LucideIcon; label: string };

type Example = {
  src: string;
  place: string;
  title: string;
  priceEstimate: string;
  specs: Spec[];
};

// Tre kuraterte EKSEMPEL-kort som viser hvordan boliger hos Vertia kan se ut.
// Ingen ekte annonser og ingen ratings her; de ekte annonsene legges ut når de
// er klare.
const examples: Example[] = [
  {
    src: "https://images.unsplash.com/photo-1595521624992-48a59aef95e3?auto=format&fit=crop&w=1280&q=80",
    place: "Norefjell",
    title: "Hytte ved løypenettet",
    priceEstimate: "Estimert 2 100–2 800 kr / natt",
    specs: [
      { icon: BedDouble, label: "3 soverom" },
      { icon: Snowflake, label: "Ski in/out-område" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1280&q=80",
    place: "Oslo",
    title: "Lys 2-roms nær sentrum",
    priceEstimate: "Estimert 1 500–1 900 kr / natt",
    specs: [
      { icon: Scan, label: "45 m²" },
      { icon: BedDouble, label: "1 soverom" },
    ],
  },
  {
    src: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1280&q=80",
    place: "Blefjell",
    title: "Familiehytte med utsikt",
    priceEstimate: "Estimert 1 800–2 400 kr / natt",
    specs: [
      { icon: Scan, label: "80 m²" },
      { icon: BedDouble, label: "3 soverom" },
    ],
  },
];

export default function PropertyCarousel() {
  return (
    <section className="section bg-sand-50">
      <div className="container-page">
        {/* Redaksjonell intro: eyebrow, serif-tittel og ingress. */}
        <div className="max-w-2xl">
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink-500">
            Boliger hos Vertia
          </p>
          <h2 className="section-title">Annonser kommer snart</h2>
          <p className="section-lead mt-5 max-w-xl">
            Boligene vi drifter legges ut her etter hvert. Slik ser en bolig hos
            Vertia ut:
          </p>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((ex) => (
            <div
              key={ex.title}
              className="flex flex-col overflow-hidden rounded-[1.5rem] bg-white text-left shadow-soft ring-1 ring-ink-900/[0.06]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ex.src}
                  alt={ex.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* Tydelig «Eksempel»-merke øverst til venstre. */}
                <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-sand-50/90 px-3 py-1 text-xs font-semibold text-ink-900 shadow-soft backdrop-blur-sm">
                  Eksempel
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-500">
                  {ex.place}
                </p>

                <h3 className="font-display text-2xl leading-snug tracking-[-0.01em] text-ink-900">
                  {ex.title}
                </h3>

                <p className="mt-4 font-display text-xl tracking-[-0.01em] text-ink-900">
                  {ex.priceEstimate}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink-900/[0.08] pt-5 text-sm text-ink-500">
                  {ex.specs.map(({ icon: Icon, label }, i) => (
                    <span key={label} className="inline-flex items-center gap-x-2">
                      {i > 0 && (
                        <span aria-hidden="true" className="text-ink-500/40">
                          &middot;
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Icon
                          className="h-4 w-4 text-ink-500/70"
                          aria-hidden="true"
                        />
                        {label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Åpen salgsannonse mot boligeiere, rett under eksempelkortene. */}
        <div className="mt-12 rounded-[2rem] border border-sand-200 bg-white p-8 shadow-card sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-xl">
              <p className="eyebrow mb-3">Plass til flere</p>
              <h3 className="font-display text-[1.9rem] font-medium leading-[1.15] tracking-[-0.02em] text-ink-900 sm:text-[2.3rem]">
                Vil du ha boligen din her?
              </h3>
              <p className="mt-4 leading-relaxed text-ink-500">
                Vi tar hånd om alt: annonse, prising, gjester, nøkler, vask og
                månedsrapport. Du får et estimat på hva boligen din kan tjene før
                du bestemmer deg for noe.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
              <a href="#kalkulator" className="btn-primary group">
                Få gratis inntektsestimat
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.25}
                />
              </a>
              <p className="text-sm text-ink-500">
                Uforpliktende · ingen binding
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
