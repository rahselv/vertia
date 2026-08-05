import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactModalProvider from "@/components/ContactModalProvider";

export const metadata: Metadata = {
  title: "Personvern | Vertia",
  description:
    "Slik behandler Vertia personopplysninger: hva vi samler inn, hvorfor, hvor lenge vi lagrer det, og hvilke rettigheter du har.",
};

const SIST_OPPDATERT = "juni 2026";

const seksjoner: { tittel: string; avsnitt: string[] }[] = [
  {
    tittel: "Behandlingsansvarlig",
    avsnitt: [
      "Vertia AS er behandlingsansvarlig for personopplysningene som samles inn gjennom denne nettsiden. Har du spørsmål om personvern, kan du kontakte oss på post@vertia.no.",
    ],
  },
  {
    tittel: "Hvilke opplysninger vi samler inn",
    avsnitt: [
      "Når du sender inn kontaktskjemaet eller ber om et inntektsanslag, lagrer vi opplysningene du oppgir: navn, telefonnummer, e-postadresse, område, boligtype og eventuell adresse på boligen.",
      "Adressesøket i inntektskalkulatoren gjøres mot Kartverkets åpne adresse-API. Adressen du eventuelt velger, brukes kun til å gi deg et mer treffsikkert anslag, og sendes bare videre til oss dersom du selv velger å sende inn skjemaet.",
      "Vi samler ikke inn sensitive personopplysninger, og vi bruker ikke skjulte sporingsverktøy for å bygge profiler om deg.",
    ],
  },
  {
    tittel: "Hva vi bruker opplysningene til",
    avsnitt: [
      "Vi bruker opplysningene til å kontakte deg om tjenesten, gi deg et konkret inntektsanslag og følge opp henvendelsen din. Vi bruker dem ikke til noe annet, og vi selger dem aldri videre.",
      "Behandlingsgrunnlaget er ditt samtykke, som du gir når du krysser av og sender inn skjemaet, samt vår berettigede interesse i å svare på henvendelser vi mottar.",
    ],
  },
  {
    tittel: "Hvor lenge vi lagrer opplysningene",
    avsnitt: [
      "Vi lagrer opplysningene så lenge det er nødvendig for å følge opp henvendelsen din og et eventuelt kundeforhold. Ønsker du at vi sletter opplysningene tidligere, gjør vi det så snart vi kan.",
    ],
  },
  {
    tittel: "Deling med andre",
    avsnitt: [
      "Vi deler kun opplysninger med underleverandører som hjelper oss med å drive tjenesten, for eksempel leverandør av e-post og lagring. Disse behandler opplysningene på våre vegne og etter databehandleravtale, og kan ikke bruke dem til egne formål.",
    ],
  },
  {
    tittel: "Dine rettigheter",
    avsnitt: [
      "Du har rett til innsyn i opplysningene vi har om deg, til å få dem rettet eller slettet, og til å trekke tilbake et samtykke du har gitt. Du kan også klage til Datatilsynet dersom du mener vi behandler opplysningene dine i strid med regelverket.",
      "Ta kontakt på post@vertia.no, så hjelper vi deg med å utøve rettighetene dine.",
    ],
  },
  {
    tittel: "Endringer",
    avsnitt: [
      `Vi kan oppdatere denne personvernerklæringen ved behov. Gjeldende versjon er sist oppdatert ${SIST_OPPDATERT}.`,
    ],
  },
];

export default function PersonvernPage() {
  return (
    <ContactModalProvider>
      <Header solid />
      <main className="bg-sand-50">
        <section className="section">
          <div className="container-page">
            <div className="mx-auto max-w-2xl">
              <Reveal>
                <p className="eyebrow mb-4">Personvern</p>
                <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-ink-900 sm:text-4xl">
                  Personvernerklæring
                </h1>
                <p className="mt-5 text-xs uppercase tracking-[0.14em] text-ink-500/70">
                  Sist oppdatert {SIST_OPPDATERT}
                </p>
              </Reveal>

              <div className="mt-12 space-y-12">
                {seksjoner.map(({ tittel, avsnitt }) => (
                  <Reveal key={tittel}>
                    <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-ink-900">
                      {tittel}
                    </h2>
                    {avsnitt.map((tekst, i) => (
                      <p
                        key={i}
                        className="mt-4 text-[1.05rem] leading-[1.85] text-ink-700 first:mt-4"
                      >
                        {tekst}
                      </p>
                    ))}
                  </Reveal>
                ))}
              </div>

              <div className="mt-14 border-t border-sand-200 pt-6">
                <p className="text-sm leading-relaxed text-ink-500/80">
                  Denne erklæringen er ment som generell informasjon om hvordan vi
                  behandler personopplysninger. Har du spørsmål, er du alltid
                  velkommen til å ta kontakt.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ContactModalProvider>
  );
}
