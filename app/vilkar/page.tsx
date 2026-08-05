import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactModalProvider from "@/components/ContactModalProvider";

export const metadata: Metadata = {
  title: "Vilkår og betingelser | Vertia",
  description:
    "Vilkårene for bruk av Vertias nettside og tjenester: hva vi tilbyr, hva som forventes av deg som eier, priser, ansvar og oppsigelse.",
};

const SIST_OPPDATERT = "juni 2026";

const seksjoner: { tittel: string; avsnitt: string[] }[] = [
  {
    tittel: "Om vilkårene",
    avsnitt: [
      "Disse vilkårene gjelder for bruk av Vertias nettside og for tjenestene vi leverer til deg som boligeier. Ved å ta i bruk tjenesten aksepterer du vilkårene slik de fremgår her.",
      "Den endelige avtalen mellom deg og Vertia inngås skriftlig før vi setter i gang, og angir konkret hva som er avtalt for din bolig.",
    ],
  },
  {
    tittel: "Tjenesten",
    avsnitt: [
      "Vertia hjelper boligeiere med korttidsutleie: klargjøring, annonsering, prising, gjestekommunikasjon og praktisk drift, avhengig av hvilket nivå du velger. Omfanget følger av pakken og den skriftlige avtalen.",
      "Du beholder eierskapet til boligen og bestemmer selv hvilke dager den er tilgjengelig for utleie.",
    ],
  },
  {
    tittel: "Inntektsanslag og illustrasjoner",
    avsnitt: [
      "Inntektsanslag, kalkulatorer og eksempelrapporter på nettsiden er veiledende illustrasjoner. Faktisk inntekt avhenger av boligen, beliggenheten, sesong, etterspørsel og hvordan boligen driftes, og kan ikke garanteres.",
    ],
  },
  {
    tittel: "Priser og betaling",
    avsnitt: [
      "Prisene fremgår av nettsiden og den skriftlige avtalen. Løpende forvaltning prises som en andel av brutto leieinntekt, og oppstart per bolig kommer i tillegg til valgt nivå.",
      "Endelig pris for oppstart avhenger av boligen og hva den trenger for å bli gjesteklar. Du får et tydelig tilbud før vi setter i gang, uten skjulte kostnader.",
    ],
  },
  {
    tittel: "Ditt ansvar som eier",
    avsnitt: [
      "Du er ansvarlig for at du har rett til å leie ut boligen, og at utleien er i tråd med sameie-, borettslags- og eventuelle andre regler som gjelder for boligen din. Du er også ansvarlig for at boligen har nødvendig forsikring for korttidsutleie.",
    ],
  },
  {
    tittel: "Ansvar",
    avsnitt: [
      "Vertia leverer tjenesten med normal faglig aktsomhet. Vi er ikke ansvarlige for indirekte tap, tapt fortjeneste eller forhold utenfor vår kontroll. Ansvaret vårt er uansett begrenset til det du har betalt for tjenesten i den aktuelle perioden.",
    ],
  },
  {
    tittel: "Oppsigelse",
    avsnitt: [
      "Både du og Vertia kan avslutte samarbeidet i tråd med det som er avtalt skriftlig. Bookinger som allerede er bekreftet, fullføres på vanlig måte med mindre noe annet avtales.",
    ],
  },
  {
    tittel: "Endringer",
    avsnitt: [
      `Vi kan oppdatere disse vilkårene ved behov. Gjeldende versjon er sist oppdatert ${SIST_OPPDATERT}.`,
    ],
  },
];

export default function VilkarPage() {
  return (
    <ContactModalProvider>
      <Header solid />
      <main className="bg-sand-50">
        <section className="section">
          <div className="container-page">
            <div className="mx-auto max-w-2xl">
              <Reveal>
                <p className="eyebrow mb-4">Vilkår</p>
                <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-ink-900 sm:text-4xl">
                  Vilkår og betingelser
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
                        className="mt-4 text-[1.05rem] leading-[1.85] text-ink-700"
                      >
                        {tekst}
                      </p>
                    ))}
                  </Reveal>
                ))}
              </div>

              <div className="mt-14 border-t border-sand-200 pt-6">
                <p className="text-sm leading-relaxed text-ink-500/80">
                  Vilkårene er ment som generell informasjon om tjenesten. Den
                  konkrete avtalen for din bolig inngås skriftlig før oppstart.
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
