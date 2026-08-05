/**
 * Redaksjonelt artikkelinnhold for Vertia.
 *
 * Hvert avsnitt i `brodtekst` kan ha en valgfri `lead` – en kort ledetekst som
 * rendres som en uthevet run-in mini-overskrift i brødteksten. Når `lead` er satt
 * er det fulle, ordrette avsnittet `lead + " " + tekst`. Teksten er gjengitt
 * verbatim; ingenting er omskrevet, kuttet eller oppsummert.
 *
 * Forsidebildene er en kuratert, sammenhengende serie i samme varme nordiske
 * stemning som resten av siden – hvert bilde er unikt og verifisert (HTTP 200).
 */

export type Avsnitt = {
  /** Valgfri run-in ledetekst – rendres som uthevet mini-overskrift. */
  lead?: string;
  tekst: string;
};

export type Artikkel = {
  slug: string;
  tittel: string;
  ingress: string;
  /** Fast tekst – ikke automatisk/`Date`. */
  sistOppdatert: string;
  /** Basetall for visninger (illustrativt). Økes med 1 per åpning i nettleser. */
  visninger: number;
  bilde: string;
  bildeAlt: string;
  brodtekst: Avsnitt[];
};

const SIST_OPPDATERT = "juni 2026";

export const artikler: Artikkel[] = [
  {
    slug: "skatt-pa-korttidsutleie",
    visninger: 450,
    tittel: "Skatt på korttidsutleie: hva, hvor mye og når",
    ingress:
      "Korttidsutleie skattlegges annerledes enn langtidsutleie. Her er hovedreglene for egen bolig, sekundærbolig og hytte, og når MVA slår inn.",
    sistOppdatert: SIST_OPPDATERT,
    bilde:
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1200&q=80",
    bildeAlt:
      "Skatteskjema, penn og en kopp kaffe på et varmt, mørkt skrivebord.",
    brodtekst: [
      {
        tekst:
          "Sist oppdatert juni 2026. Generell oversikt, ikke skatterådgivning. Sjekk alltid med Skatteetaten eller en regnskapsfører.",
      },
      {
        tekst:
          "Korttidsutleie skattlegges annerledes enn langtidsutleie. Når du leier ut boligen din i korte perioder, typisk under 30 dager per leieforhold, slik Airbnb som regel er, behandler Skatteetaten det som korttidsutleie. Det viktigste skillet er at langtidsutleie av egen bolig kan være helt skattefritt, mens korttidsutleie nesten alltid er skattepliktig.",
      },
      {
        lead: "Egen bolig: sjablongregelen.",
        tekst:
          "Leier du ut deler av boligen du selv bor i, eller hele boligen i korte perioder, gjelder en sjablong: de første 10 000 kronene i året er skattefrie, og av det overskytende regnes 85 % som skattepliktig inntekt. Tjener du 60 000 kroner, trekker du fra 10 000, og 85 % av de resterende 50 000, altså 42 500 kroner, er skattepliktig. Dette skattlegges som kapitalinntekt.",
      },
      {
        lead: "Sekundærbolig og rene utleieobjekter.",
        tekst:
          "Leier du ut en bolig du ikke selv bor i, gjelder ikke sjablongregelen. Da er hele overskuddet skattepliktig, men du får til gjengjeld trekke fra faktiske kostnader: vask, strøm, forsikring, vedlikehold, møbler, og honorar til en forvalter. Her skattlegges netto, ikke brutto.",
      },
      {
        lead: "Fritidsbolig og hytte.",
        tekst:
          "For hytter du også bruker selv, gjelder en egen sjablong som ligner på egen bolig: 10 000 kroner skattefritt, og 85 % av det overskytende er skattepliktig. Bruker du hytta utelukkende til utleie, kan den bli behandlet som et rent utleieobjekt med fradrag for kostnader.",
      },
      {
        lead: "Når MVA slår inn.",
        tekst:
          "Overstiger utleieinntekten 50 000 kroner i en tolvmånedersperiode, kan du bli pliktig til å registrere deg i Merverdiavgiftsregisteret. Dette overser mange. Reglene rundt romutleie og MVA er kompliserte, sjekk dette konkret før du passerer beløpet.",
      },
      {
        lead: "Når du betaler.",
        tekst:
          "Utleieinntekt føres i skattemeldingen året etter inntektsåret. Tjener du i 2026, fører du det våren 2027. Ta vare på all dokumentasjon gjennom året, så blir skattemeldingen enkel.",
      },
      {
        tekst:
          "Vertia gir deg en samlet månedsrapport med alle inntekter og kostnader, så dokumentasjonen er klar når skattemeldingen skal fylles ut. Vi er ikke skatterådgivere, men vi gjør tallene oversiktlige.",
      },
    ],
  },
  {
    slug: "hva-kan-hytta-tjene",
    visninger: 612,
    tittel: "Så mye kan en hytte faktisk tjene på korttidsutleie",
    ingress:
      "De fleste hytteeiere undervurderer hva hytta gir når den står tom, og overvurderer hvor mye jobb det er. Her er et realistisk bilde.",
    sistOppdatert: SIST_OPPDATERT,
    bilde:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
    bildeAlt:
      "Trehytte i furuskog ved vann, rolig og naturlig nordisk stemning.",
    brodtekst: [
      {
        tekst:
          "De fleste hytteeiere undervurderer hva hytta kan gi når den står tom, og overvurderer hvor mye jobb det er å gjøre noe med det. Her er et realistisk bilde.",
      },
      {
        lead: "Det handler om netter, ikke drømmer.",
        tekst:
          "En hytte tjener ikke penger på antall netter den finnes, men på antall netter den faktisk er booket. En fjellhytte med god beliggenhet kan ha en døgnpris på 1 800 til 2 500 kroner i sesong, men belegget over året ligger gjerne på 30 til 40 %. Det er kombinasjonen som avgjør inntekten, ikke toppdøgnprisen alene.",
      },
      {
        lead: "Et realistisk regnestykke.",
        tekst:
          "Si at hytta di leies ut til 2 000 kroner natta, og du gjør den tilgjengelig 150 netter i året med 35 % belegg. Det gir rundt 52 netter booket, og en bruttoinntekt på omtrent 105 000 kroner. Etter kostnader til vask, forbruksvarer og forvaltning sitter du igjen med en betydelig sum for netter hytta ellers ville stått tom.",
      },
      {
        lead: "Sesong er alt.",
        tekst:
          "Påske, vinterferie, helger og lokale arrangementer er gull. Stille uker midt i mai gir lite. Den som priser flatt gjennom året, taper penger i toppsesong og står tom i lavsesong. Dynamisk prising, der prisen følger etterspørselen dag for dag, er ofte forskjellen på en hytte som går rundt og en som gir reell avkastning.",
      },
      {
        lead: "Du beholder hytta til egen bruk.",
        tekst:
          "Det viktigste for mange: du kan sperre av påsken, sommerukene og helgene du selv vil bruke. Resten av året jobber hytta for deg.",
      },
      {
        tekst:
          "Tallene over er illustrative anslag basert på markedsdata, ikke en garanti. Faktisk inntekt avhenger av beliggenhet, standard, sesong og etterspørsel.",
      },
      {
        tekst:
          "Vil du vite hva akkurat din hytte kan tjene? Bruk inntektsestimatet på forsiden, eller ta en kort prat med oss.",
      },
    ],
  },
  {
    slug: "er-korttidsutleie-lovlig",
    visninger: 337,
    tittel: "Er korttidsutleie lovlig i din bolig?",
    ingress:
      "For de fleste eneboliger og hytter, ja, men borettslag og sameier har egne grenser du må kjenne til.",
    sistOppdatert: SIST_OPPDATERT,
    bilde:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    bildeAlt:
      "Rolig trebolig badet i varmt, gyllent morgenlys mellom trærne.",
    brodtekst: [
      {
        tekst:
          "Kort svar: for de fleste eneboliger og hytter, ja, men det finnes viktige unntak du må kjenne til.",
      },
      {
        lead: "Enebolig og hytte: stort sett fritt.",
        tekst:
          "Eier du en enebolig, et rekkehus eller en fritidsbolig, står du i utgangspunktet fritt til å leie ut korttid. Det finnes ingen lovbestemt grense på antall døgn, slik det gjør i enkelte fellesskap. Dette er hovedgrunnen til at korttidsutleie er enklest nettopp her.",
      },
      {
        lead: "Borettslag: 30-dagersgrensen.",
        tekst:
          "Bor du i et borettslag, gjelder strengere regler. Hovedregelen er at du kan leie ut egen bolig korttid i inntil 30 døgn i året uten styrets samtykke. Utover det kreves som regel godkjenning. Sjekk vedtektene før du gjør noe.",
      },
      {
        lead: "Sameie: maks 90 dager.",
        tekst:
          "I et eierseksjonssameie er hovedregelen at korttidsutleie av egen seksjon er tillatt i inntil 90 døgn per år. Dette er en grense fastsatt i eierseksjonsloven. Vedtektene kan i visse tilfeller justere dette, så les alltid vedtektene og eventuelle vedtak fra sameiermøtet.",
      },
      {
        lead: "Hvorfor dette er verdt å sjekke.",
        tekst:
          "Å bryte reglene i et borettslag eller sameie kan føre til pålegg og i verste fall salgspålegg. For en enebolig- eller hytteeier er dette sjelden et problem, men det er alltid lurt å være sikker.",
      },
      {
        tekst:
          "Vertia jobber bevisst med eneboliger og hytter nettopp fordi reglene er enklest der. Er du usikker på hva som gjelder for din bolig, hjelper vi deg å finne ut av det før vi setter i gang.",
      },
    ],
  },
  {
    slug: "gjor-hytta-klar-for-utleie",
    visninger: 528,
    tittel: "Slik gjør du hytta klar for utleie: en praktisk sjekkliste",
    ingress:
      "En hytte som er klar for gjester, tjener mer og får bedre anmeldelser. Her er det som faktisk teller, i prioritert rekkefølge.",
    sistOppdatert: SIST_OPPDATERT,
    bilde:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
    bildeAlt:
      "Lyst, ryddig stueinteriør med varmt tregulv og dagslys, klart for gjester.",
    brodtekst: [
      {
        tekst:
          "En hytte som er klar for gjester, tjener mer og får bedre anmeldelser. Her er det som faktisk teller, i prioritert rekkefølge.",
      },
      {
        lead: "Trygg og enkel adkomst.",
        tekst:
          "Gjester ankommer ofte sent og i mørket. En smart nøkkelboks med engangskode betyr at de slipper inn uten at du må møte opp, og fungerer også på hytter uten internett. Dette er den enkeltendringen som sparer deg mest mas.",
      },
      {
        lead: "Rent og nøytralt.",
        tekst:
          "Personlige eiendeler, papirer og familiebilder bør vekk eller låses inn. Gjester vil føle at hytta er deres for noen dager. Et nøytralt, ryddig uttrykk gir bedre bilder og bedre anmeldelser.",
      },
      {
        lead: "Det praktiske som forsvinner i stresset.",
        tekst:
          "Nok sengetøy og håndklær, fungerende oppvarming, grunnleggende kjøkkenutstyr, og tydelig informasjon om wifi, søppel og husregler. Det er detaljene gjester legger merke til.",
      },
      {
        lead: "Gode bilder.",
        tekst:
          "Lyse, ryddige bilder i dagslys er det som avgjør om noen klikker på annonsen din i det hele tatt. Dette er ikke stedet å ta noen raske mobilbilder.",
      },
      {
        lead: "Forsikring på plass.",
        tekst:
          "Sjekk at boligforsikringen din dekker korttidsutleie. Mange standardpoliser gjør det ikke uten videre.",
      },
      {
        tekst:
          "Vertia tar seg av det praktiske for deg: nøkkelboks, klargjøring, profesjonelle bilder og annonse. Du leverer nøkkelen én gang.",
      },
    ],
  },
  {
    slug: "dynamisk-prising-forklart",
    visninger: 691,
    tittel: "Dynamisk prising forklart: derfor bør prisen endres dag for dag",
    ingress:
      "Å sette én fast pris er den dyreste vanen i korttidsutleie. Slik fungerer dynamisk prising, og hvorfor det monner.",
    sistOppdatert: SIST_OPPDATERT,
    bilde:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
    bildeAlt:
      "Åpen månedskalender og en kopp kaffe på et rolig skrivebord i varmt lys.",
    brodtekst: [
      {
        tekst:
          "De fleste som leier ut selv, setter én pris og lar den stå. Det er den dyreste vanen i korttidsutleie.",
      },
      {
        lead: "Etterspørselen svinger, det bør prisen også.",
        tekst:
          "En fredag i vinterferien og en tirsdag i november er ikke verdt det samme. Setter du samme pris hele året, gjør du to feil samtidig: du tar for lite betalt når alle vil leie, og du står tom når du kunne fylt plassen med en lavere pris.",
      },
      {
        lead: "Hva som driver prisen opp.",
        tekst:
          "Helger, høysesong, ferieuker og lokale arrangementer som et stort idrettsarrangement, en konsert eller en festival i nærheten, sender etterspørselen i været. Da bør prisen opp, ofte betydelig.",
      },
      {
        lead: "Hva som driver den ned.",
        tekst:
          "Stille hverdager og lavsesong. Her er poenget ikke å tjene mest per natt, men å unngå tomme netter. En lavere pris som fyller kalenderen slår en høy pris på en tom seng.",
      },
      {
        lead: "Resultatet over et år.",
        tekst:
          "Riktig prising handler ikke om å være dyrest eller billigst, men om å treffe markedet hver enkelt dag. Over et helt år er forskjellen mellom flat og dynamisk prising ofte tosifret i prosent av inntekten.",
      },
      {
        tekst:
          "Vertia justerer prisen for deg automatisk etter sesong, ukedag og lokale hendelser, og du bestemmer fortsatt selv hvilke datoer du vil holde av til egen bruk.",
      },
    ],
  },
  {
    slug: "forsikring-ved-korttidsutleie",
    visninger: 384,
    tittel:
      "Forsikring ved korttidsutleie: det vanlig boligforsikring ikke dekker",
    ingress:
      "Forsikring er punktet flest hopper over, og det som kan koste mest hvis noe går galt. Her er det du må avklare før første gjest.",
    sistOppdatert: SIST_OPPDATERT,
    bilde:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    bildeAlt:
      "Lun, hjemmekoselig stue med varmt tregulv, planter og mykt dagslys.",
    brodtekst: [
      {
        tekst:
          "Dette er det punktet flest hopper over, og det som kan koste mest hvis noe går galt.",
      },
      {
        lead: "Vanlig boligforsikring er ofte ikke nok.",
        tekst:
          "En standard hus- eller hytteforsikring er laget for at du selv bor der, ikke for at fremmede gjester kommer og går. Mange poliser dekker ikke skade som oppstår i forbindelse med utleie, og noen kan i verste fall bli ugyldige hvis selskapet ikke er informert om at du driver korttidsutleie.",
      },
      {
        lead: "Hva du må avklare.",
        tekst:
          "Ring forsikringsselskapet ditt og spør konkret om korttidsutleie er dekket, og under hvilke vilkår. Noen selskaper tilbyr et tillegg for utleie. Andre krever at du tegner en egen utleieforsikring. Poenget er at du må vite det før første gjest, ikke etter.",
      },
      {
        lead: "Plattformenes egen dekning er et supplement, ikke en erstatning.",
        tekst:
          "Utleieplattformer tilbyr ofte en form for vertsgaranti eller skadedekning, men disse har begrensninger og dekker ikke alt. De erstatter ikke en ordentlig forsikring på boligen.",
      },
      {
        lead: "Hvorfor dette gir ro.",
        tekst:
          "Når forsikringen er på plass, slipper du å ligge våken og lure. Du vet at både boligen og du selv er dekket hvis noe uforutsett skjer.",
      },
      {
        tekst:
          "Vertia hjelper deg å få forsikringsforholdene avklart før første gjest, slik at du er trygg under hele utleien.",
      },
    ],
  },
];

/** Henter en artikkel basert på slug. Returnerer `undefined` om den ikke finnes. */
export function getArtikkel(slug: string): Artikkel | undefined {
  return artikler.find((artikkel) => artikkel.slug === slug);
}

/** Alle artikler – nyttig for oversikt og `generateStaticParams`. */
export function getAlleArtikler(): Artikkel[] {
  return artikler;
}
