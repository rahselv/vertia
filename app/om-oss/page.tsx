import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactModalProvider from "@/components/ContactModalProvider";
import ContactButton from "@/components/ContactButton";

export const metadata: Metadata = {
  title: "Om oss | Vertia",
  description:
    "Bak Vertia står et team med god erfaring fra eiendomsmarkedet. Vi drifter korttidsutleie for boligeiere som vil ha inntekten uten det praktiske.",
};

const avsnitt: string[] = [
  "Bak Vertia står et team med god erfaring fra eiendomsmarkedet. Vi har jobbet med utleie, drift og forvaltning av bolig i mange år, og kjenner både mulighetene og fallgruvene ved korttidsutleie fra innsiden.",
  "Vi startet Vertia fordi vi så at mange boligeiere sitter på en bolig som kunne tjent penger når den står stille, men som lar være fordi det virker for tidkrevende og komplisert. Det ville vi gjøre noe med.",
  "Ideen er enkel: du beholder boligen, kontrollen og inntekten, mens vi tar oss av det praktiske. Foto, annonse, prising, gjestekommunikasjon, nøkkelfri innsjekk og vask. Du bestemmer selv hvilke dager boligen er tilgjengelig, og kan alltid holde av dagene du vil bruke den selv.",
  "Vi er opptatt av å være ryddige og etterrettelige. Ingen skjulte kostnader, tydelige rapporter og en fast kontaktperson som hjelper deg hele veien. Målet er at utleien skal føles trygg og rolig, ikke som enda en jobb.",
];

export default function OmOssPage() {
  return (
    <ContactModalProvider>
      <Header solid />
      <main className="bg-sand-50">
        <section className="section">
          <div className="container-page">
            <div className="mx-auto max-w-2xl">
              <Reveal>
                <p className="eyebrow mb-4">Om oss</p>
                <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-ink-900 sm:text-4xl md:text-[2.75rem]">
                  Teamet bak Vertia
                </h1>
              </Reveal>

              <div className="mt-10 space-y-6">
                {avsnitt.map((tekst, i) => (
                  <Reveal key={i}>
                    <p className="text-[1.075rem] leading-[1.85] text-ink-700">
                      {tekst}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal className="mt-12 rounded-3xl border border-sand-200 bg-white p-8 shadow-soft sm:p-10">
                <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-ink-900">
                  Vil du vite hva boligen din kan tjene?
                </h2>
                <p className="mt-3 leading-relaxed text-ink-500">
                  Ta en uforpliktende prat med oss, så gir vi deg et konkret
                  inntektsanslag for akkurat din bolig.
                </p>
                <ContactButton variant="kontakt" className="btn-primary mt-6">
                  Kontakt oss
                </ContactButton>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ContactModalProvider>
  );
}
