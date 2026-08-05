import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactModalProvider from "@/components/ContactModalProvider";
import ArticleViews from "@/components/ArticleViews";
import { artikler, getArtikkel } from "@/lib/artikler";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return artikler.map((artikkel) => ({ slug: artikkel.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Params;
}): Metadata {
  const artikkel = getArtikkel(params.slug);
  if (!artikkel) {
    return { title: "Artikkel ikke funnet | Vertia" };
  }
  return {
    title: `${artikkel.tittel} | Vertia`,
    description: artikkel.ingress,
    openGraph: {
      title: artikkel.tittel,
      description: artikkel.ingress,
      images: [artikkel.bilde],
      locale: "nb_NO",
      type: "article",
    },
  };
}

export default function ArtikkelPage({ params }: { params: Params }) {
  const artikkel = getArtikkel(params.slug);

  if (!artikkel) {
    notFound();
  }

  return (
    <ContactModalProvider>
      <Header solid />
      <main className="bg-sand-50">
        <article className="section">
          <div className="container-page">
            <div className="mx-auto max-w-2xl">
              {/* Diskret tilbake-lenke */}
              <Link
                href="/artikler"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-brand-600"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                Tilbake til artikler
              </Link>

              {/* Tittel */}
              <Reveal className="mt-8">
                <p className="eyebrow mb-4">Artikkel</p>
                <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-ink-900 sm:text-4xl md:text-[2.75rem]">
                  {artikkel.tittel}
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.14em] text-ink-500/70">
                  <span>Sist oppdatert {artikkel.sistOppdatert}</span>
                  <span aria-hidden className="text-ink-500/40">
                    ·
                  </span>
                  <ArticleViews slug={artikkel.slug} base={artikkel.visninger} />
                </div>
              </Reveal>
            </div>

            {/* Forsidebilde i full bredde av lesekolonnen */}
            <Reveal className="mx-auto mt-10 max-w-3xl">
              <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-ink-900/5">
                <div className="relative aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={artikkel.bilde}
                    alt={artikkel.bildeAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* Brødtekst */}
            <div className="mx-auto mt-12 max-w-2xl">
              {artikkel.brodtekst.map((avsnitt, i) => (
                <p
                  key={i}
                  className="mb-6 text-[1.075rem] leading-[1.85] text-ink-700 last:mb-0"
                >
                  {avsnitt.lead ? (
                    <>
                      <strong className="font-display text-[1.05em] font-medium tracking-[-0.01em] text-ink-900">
                        {avsnitt.lead}
                      </strong>{" "}
                      {avsnitt.tekst}
                    </>
                  ) : (
                    avsnitt.tekst
                  )}
                </p>
              ))}

              {/* Disclaimer */}
              <div className="mt-14 border-t border-sand-200 pt-6">
                <p className="text-sm leading-relaxed text-ink-500/80">
                  Innholdet er generell informasjon, ikke juridisk, økonomisk
                  eller skattemessig rådgivning. Kontakt relevante myndigheter
                  eller en kvalifisert rådgiver før du tar beslutninger.
                </p>
              </div>

              {/* Diskret tilbake nederst */}
              <div className="mt-10">
                <Link
                  href="/artikler"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                  Tilbake til alle artikler
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </ContactModalProvider>
  );
}
