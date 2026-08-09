/**
 * ───────────────────────────────────────────────────────────────────────────
 *  BILDER TIL FREMVISNINGEN
 * ───────────────────────────────────────────────────────────────────────────
 *  De 20 kuraterte fotoene fra designet, kopiert fra
 *  design-referanse/vertia/img/l1/ og /l2/ til public/images/fremvisning/.
 *
 *  Dette er demobilder, ikke boliger Vertia faktisk drifter. Hver oppføring har
 *  en TODO om at den må erstattes med foto av en ekte bolig før lansering.
 *
 *  Filene her er ubehandlede originaler – opptil 6000 px brede og 2,8 MB. De
 *  serveres ALDRI direkte: Showcase rendrer dem med next/image, som skalerer
 *  ned til den bredden skjermen faktisk trenger og leverer WebP til nettlesere
 *  som støtter det. Originalene beholdes fordi de er kilden optimalisereren
 *  jobber mot; bytter du et bilde, legg inn originalen og oppdater width/height.
 *
 *  Alt-tekstene genereres av Showcase som «bolig – rom, bilde x av y». Det er
 *  nøytralt og korrekt, men beskriver ikke motivet. Skriv ekte alt-tekster når
 *  de ekte bildene kommer inn.
 * ───────────────────────────────────────────────────────────────────────────
 */

/** Kildebildet. Bredde og høyde er de faktiske pikselmålene, som next/image
 *  trenger for å regne ut riktige srcset-bredder og unngå layouthopp. */
export type ShowcaseImage = {
  src: string;
  width: number;
  height: number;
};

export type Room = {
  name: string;
  images: ShowcaseImage[];
};

export type Apartment = {
  id: string;
  label: string;
  rooms: Room[];
};

export const apartments: Apartment[] = [
  {
    id: "a1",
    label: "Bolig A",
    rooms: [
      {
        name: "Stue",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, stue 1/2 (demobilde)
          { src: "/images/fremvisning/l2/01.jpg", width: 2048, height: 1365 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, stue 2/2 (demobilde)
          { src: "/images/fremvisning/l2/02.jpg", width: 2048, height: 1365 },
        ],
      },
      {
        name: "Kjøkken",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, kjøkken 1/3 (demobilde)
          { src: "/images/fremvisning/l2/03.jpg", width: 2048, height: 1366 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, kjøkken 2/3 (demobilde)
          { src: "/images/fremvisning/l2/04.jpg", width: 2048, height: 1365 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, kjøkken 3/3 (demobilde)
          { src: "/images/fremvisning/l2/05.jpg", width: 2048, height: 1365 },
        ],
      },
      {
        name: "Soverom",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, soverom 1/1 (demobilde)
          { src: "/images/fremvisning/l2/06.jpg", width: 2048, height: 1365 },
        ],
      },
      {
        name: "Bad",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, bad 1/3 (demobilde)
          { src: "/images/fremvisning/l2/08.jpg", width: 2048, height: 1365 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, bad 2/3 (demobilde)
          { src: "/images/fremvisning/l2/07.jpg", width: 1365, height: 2048 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, bad 3/3 (demobilde)
          { src: "/images/fremvisning/l2/09.jpg", width: 1365, height: 2048 },
        ],
      },
      {
        name: "Balkong",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, balkong 1/1 (demobilde)
          { src: "/images/fremvisning/l2/10.jpg", width: 2048, height: 1365 },
        ],
      },
    ],
  },
  {
    id: "a2",
    label: "Bolig B",
    rooms: [
      {
        name: "Kjøkken",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, kjøkken 1/3 (demobilde)
          { src: "/images/fremvisning/l1/01.jpg", width: 2048, height: 1365 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, kjøkken 2/3 (demobilde)
          { src: "/images/fremvisning/l1/02.jpg", width: 2048, height: 1365 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, kjøkken 3/3 (demobilde)
          { src: "/images/fremvisning/l1/03.jpg", width: 2048, height: 1365 },
        ],
      },
      {
        name: "Entré",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, entré 1/1 (demobilde)
          { src: "/images/fremvisning/l1/04.jpg", width: 2048, height: 1365 },
        ],
      },
      {
        name: "Soverom",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, soverom 1/2 (demobilde)
          { src: "/images/fremvisning/l1/05.jpg", width: 6000, height: 4000 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, soverom 2/2 (demobilde)
          { src: "/images/fremvisning/l1/06.jpg", width: 6000, height: 4000 },
        ],
      },
      {
        name: "Bad",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, bad 1/2 (demobilde)
          { src: "/images/fremvisning/l1/07.jpg", width: 1365, height: 2048 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, bad 2/2 (demobilde)
          { src: "/images/fremvisning/l1/08.jpg", width: 1365, height: 2048 },
        ],
      },
      {
        name: "Balkong",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, balkong 1/2 (demobilde)
          { src: "/images/fremvisning/l1/09.jpg", width: 2048, height: 1365 },
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, balkong 2/2 (demobilde)
          { src: "/images/fremvisning/l1/10.jpg", width: 2048, height: 1365 },
        ],
      },
    ],
  },
];

/**
 * Hvor «gå videre»-punktet står i bildet, per romindeks. Verdiene er i prosent
 * av scenen og hentet rett fra designet, der de er plassert etter motivet i
 * nettopp disse fotoene. De stemmer altså så lenge demobildene står – men må
 * justeres når bildene byttes ut, så punktet fortsatt peker mot en dør eller
 * en åpning.
 */
export const walkPositions = [
  { x: 50, y: 64 },
  { x: 63, y: 58 },
  { x: 40, y: 61 },
  { x: 58, y: 63 },
  { x: 46, y: 59 },
];
