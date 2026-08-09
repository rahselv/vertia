import type { Metadata } from "next";
import Image from "next/image";
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

/**
 * Menneskene bak Vertia. Hentet fra «Om oss»-modalen i landingsside-v2-designet,
 * men tilpasset full side: større portretter og mer luft enn i modalen.
 *
 * Portrettene er zoomet ulikt (`zoom`) fordi utsnittet i de to filene er
 * forskjellig – uten det havner ansiktene ulikt i den runde masken. Samme grep
 * som `--z` i designet.
 */
const team = [
  {
    name: "Rahil",
    role: "Eiendom & strategi",
    bio: "Rahil har erfaring med Airbnb, korttidsutleie og salg av eiendom, og kjenner den operative siden av utleie – fra booking og gjesteopplevelse til den daglige driften av boliger.",
    image: "/images/om/om-rahil.png",
    alt: "Portrett av Rahil Soliman",
    zoom: 1.28,
  },
  {
    name: "Emir",
    role: "Utleie & drift",
    bio: "Emir er utdannet innen eiendomsmegling og har jobbet flere år som eiendomsmeglerfullmektig. Han har erfaring med salg av eiendom, utleie og Airbnb.",
    image: "/images/om/om-emir.png",
    alt: "Portrett av Emir Midtbø Denizci",
    zoom: 1.06,
  },
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

              {/* ── Menneskene bak Vertia ──────────────────────────────── */}
              <Reveal className="mt-20">
                <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink-900 sm:text-3xl">
                  Menneskene bak Vertia
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-ink-500">
                  Vertia er bygget på praktisk erfaring fra utleie og eiendom. Vi
                  kjenner utfordringene utleiere møter, fordi vi har jobbet med
                  dem selv.
                </p>
              </Reveal>

              <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-14">
                {team.map((person, i) => (
                  <Reveal key={person.name} delay={i * 0.08}>
                    <article>
                      <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full bg-sand-200 sm:h-[180px] sm:w-[180px]">
                        <Image
                          src={person.image}
                          alt={person.alt}
                          fill
                          sizes="180px"
                          className="object-cover"
                          style={{ transform: `scale(${person.zoom})` }}
                        />
                      </div>
                      <h3 className="mt-6 font-sans text-lg font-semibold tracking-[0.01em] text-ink-900">
                        {person.name}
                      </h3>
                      <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent-500">
                        {person.role}
                      </p>
                      <p className="mt-3.5 text-[0.95rem] leading-[1.7] text-ink-700">
                        {person.bio}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <p className="mt-14 border-t border-sand-200 pt-8 text-center font-display text-lg italic text-ink-500">
                  Eiendomserfaring møter praktisk utleie.
                </p>
              </Reveal>

              <Reveal className="mt-20 rounded-3xl border border-sand-200 bg-white p-8 shadow-soft sm:p-10">
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
