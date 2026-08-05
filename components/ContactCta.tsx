import ContactButton from "@/components/ContactButton";

export default function ContactCta() {
  return (
    <section id="kontakt" className="section bg-sand-50">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-700 px-7 py-16 shadow-soft sm:px-12 sm:py-24">
          {/* Varmt skandinavisk interiør i gyllent lys som diskret full-bleed bakgrunn. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?auto=format&fit=crop&w=1600&q=80"
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          {/* Varm espresso-overlay som holder teksten rolig og lesbar. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-brand-700/95 via-brand-700/90 to-brand-600/90"
          />
          {/* Hårfint korn for samme redaksjonelle tekstur som i hero. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "180px 180px",
            }}
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="eyebrow-light">Få et konkret tilbud</p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-sand-50 sm:text-5xl">
              La oss regne på akkurat din bolig
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-sand-100/85">
              Legg igjen kontaktinfo, så tar vi en uforpliktende prat og gir deg
              et konkret inntektsanslag.
            </p>
            <div className="mt-9">
              <ContactButton className="btn-on-image">
                Få et tilbud
              </ContactButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
