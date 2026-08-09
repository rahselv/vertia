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
 *  To ting å være klar over:
 *  - Bildene er ubehandlede, 2048 px brede, til sammen 14,5 MB. l1/05.jpg og
 *    l1/06.jpg er alene på 2,8 og 2,5 MB. De bør konverteres til WebP eller
 *    gå gjennom next/image før lansering.
 *  - Alt-tekstene genereres av Showcase-komponenten som «bolig – rom, bilde
 *    x av y». Det er nøytralt og korrekt, men beskriver ikke motivet. Skriv
 *    ekte alt-tekster når de ekte bildene kommer inn.
 * ───────────────────────────────────────────────────────────────────────────
 */

export type Room = {
  name: string;
  images: string[];
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
        name: "Kjøkken",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, kjøkken 1/3 (demobilde)
          "/images/fremvisning/l1/01.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, kjøkken 2/3 (demobilde)
          "/images/fremvisning/l1/02.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, kjøkken 3/3 (demobilde)
          "/images/fremvisning/l1/03.jpg",
        ],
      },
      {
        name: "Entré",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, entré 1/1 (demobilde)
          "/images/fremvisning/l1/04.jpg",
        ],
      },
      {
        name: "Soverom",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, soverom 1/2 (demobilde)
          "/images/fremvisning/l1/05.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, soverom 2/2 (demobilde)
          "/images/fremvisning/l1/06.jpg",
        ],
      },
      {
        name: "Bad",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, bad 1/2 (demobilde)
          "/images/fremvisning/l1/07.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, bad 2/2 (demobilde)
          "/images/fremvisning/l1/08.jpg",
        ],
      },
      {
        name: "Balkong",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, balkong 1/2 (demobilde)
          "/images/fremvisning/l1/09.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig A, balkong 2/2 (demobilde)
          "/images/fremvisning/l1/10.jpg",
        ],
      },
    ],
  },
  {
    id: "a2",
    label: "Bolig B",
    rooms: [
      {
        name: "Stue",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, stue 1/2 (demobilde)
          "/images/fremvisning/l2/01.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, stue 2/2 (demobilde)
          "/images/fremvisning/l2/02.jpg",
        ],
      },
      {
        name: "Kjøkken",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, kjøkken 1/3 (demobilde)
          "/images/fremvisning/l2/03.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, kjøkken 2/3 (demobilde)
          "/images/fremvisning/l2/04.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, kjøkken 3/3 (demobilde)
          "/images/fremvisning/l2/05.jpg",
        ],
      },
      {
        name: "Soverom",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, soverom 1/1 (demobilde)
          "/images/fremvisning/l2/06.jpg",
        ],
      },
      {
        name: "Bad",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, bad 1/3 (demobilde)
          "/images/fremvisning/l2/08.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, bad 2/3 (demobilde)
          "/images/fremvisning/l2/07.jpg",
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, bad 3/3 (demobilde)
          "/images/fremvisning/l2/09.jpg",
        ],
      },
      {
        name: "Balkong",
        images: [
          // TODO: erstatt med foto av ekte bolig før lansering – Bolig B, balkong 1/1 (demobilde)
          "/images/fremvisning/l2/10.jpg",
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
