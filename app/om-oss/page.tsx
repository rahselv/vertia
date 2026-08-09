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
        {/* Egen padding i stedet for .section. Den globale verdien
            (py-40 sm:py-56 lg:py-64) er ment som luft MELLOM seksjoner, og gir
            160–256 px. Her er dette sidens første og eneste seksjon, så den
            luften havnet rett under headeren og etterlot nesten en halv skjerm
            tom før innholdet startet. Samme i bunnen, mot footeren. */}
        <section className="pb-24 pt-14 sm:pb-32 sm:pt-20">
          <div className="container-page">
            <div className="mx-auto max-w-2xl">
              <Reveal>
                <p className="eyebrow mb-4">Om oss</p>
                {/* Overskriften fra den nedlagte nedre seksjonen er nå sidens
                    h1. Siden skal ha nøyaktig én. */}
                <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-ink-900 sm:text-4xl md:text-[2.75rem]">
                  Menneskene bak Vertia
                </h1>
              </Reveal>


              <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-14">
                {team.map((person, i) => (
                  <Reveal key={person.name} delay={i * 0.08}>
                    <article>
                      {/* rounded-[50%], ikke rounded-full: borderRadius i
                          tailwind.config.ts kapper alle tokens til maks 4 px
                          for den skarpkantede retningen, også `full`. Da ble
                          portrettene firkantede med 4 px hjørner. En vilkårlig
                          verdi går utenom temaet og gir en ekte sirkel. */}
                      <div className="relative h-[150px] w-[150px] overflow-hidden rounded-[50%] bg-sand-200 sm:h-[180px] sm:w-[180px]">
                        <Image
                          src={person.image}
                          alt={person.alt}
                          fill
                          sizes="180px"
                          className="object-cover"
                          style={{ transform: `scale(${person.zoom})` }}
                        />
                      </div>
                      {/* h2, ikke h3: da den egne «Menneskene bak Vertia»-
                          overskriften ble sidens h1, ville h3 hoppet over et
                          nivå. */}
                      <h2 className="mt-6 font-sans text-lg font-semibold tracking-[0.01em] text-ink-900">
                        {person.name}
                      </h2>
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
                <p className="mt-16 text-center font-display text-lg italic text-ink-500">
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
