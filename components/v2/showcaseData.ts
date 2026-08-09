/**
 * ───────────────────────────────────────────────────────────────────────────
 *  BILDER TIL FREMVISNINGEN
 * ───────────────────────────────────────────────────────────────────────────
 *  Designet brukte 20 kuraterte foto fra design-referanse/vertia/img/l1/ og
 *  /l2/. De er IKKE tatt i bruk – vi vet ikke om vi har rett til å publisere
 *  dem, og alt-tekstene i designet var generiske.
 *
 *  Hvert bilde står derfor som en nøytral plassholder med en TODO som sier
 *  hvilket rom og hvilken fil i designet det tilsvarer. Bytt `PLACEHOLDER` med
 *  stien til det ekte fotoet, og skriv en beskrivende `alt`.
 *
 *  Så lenge alle plassholderne er samme fil, vil bytte av bilde inne i et rom
 *  se ut som om ingenting skjer. Det er forventet, ikke en feil i mekanikken.
 * ───────────────────────────────────────────────────────────────────────────
 */

const PLACEHOLDER = "/images/placeholder/rom-16x10.svg";

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
          // TODO: ekte foto – Bolig A, kjøkken 1/3 (designet: img/l1/01.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig A, kjøkken 2/3 (designet: img/l1/02.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig A, kjøkken 3/3 (designet: img/l1/03.jpg)
          PLACEHOLDER,
        ],
      },
      {
        name: "Entré",
        images: [
          // TODO: ekte foto – Bolig A, entré 1/1 (designet: img/l1/04.jpg)
          PLACEHOLDER,
        ],
      },
      {
        name: "Soverom",
        images: [
          // TODO: ekte foto – Bolig A, soverom 1/2 (designet: img/l1/05.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig A, soverom 2/2 (designet: img/l1/06.jpg)
          PLACEHOLDER,
        ],
      },
      {
        name: "Bad",
        images: [
          // TODO: ekte foto – Bolig A, bad 1/2 (designet: img/l1/07.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig A, bad 2/2 (designet: img/l1/08.jpg)
          PLACEHOLDER,
        ],
      },
      {
        name: "Balkong",
        images: [
          // TODO: ekte foto – Bolig A, balkong 1/2 (designet: img/l1/09.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig A, balkong 2/2 (designet: img/l1/10.jpg)
          PLACEHOLDER,
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
          // TODO: ekte foto – Bolig B, stue 1/2 (designet: img/l2/01.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig B, stue 2/2 (designet: img/l2/02.jpg)
          PLACEHOLDER,
        ],
      },
      {
        name: "Kjøkken",
        images: [
          // TODO: ekte foto – Bolig B, kjøkken 1/3 (designet: img/l2/03.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig B, kjøkken 2/3 (designet: img/l2/04.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig B, kjøkken 3/3 (designet: img/l2/05.jpg)
          PLACEHOLDER,
        ],
      },
      {
        name: "Soverom",
        images: [
          // TODO: ekte foto – Bolig B, soverom 1/1 (designet: img/l2/06.jpg)
          PLACEHOLDER,
        ],
      },
      {
        name: "Bad",
        images: [
          // TODO: ekte foto – Bolig B, bad 1/3 (designet: img/l2/08.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig B, bad 2/3 (designet: img/l2/07.jpg)
          PLACEHOLDER,
          // TODO: ekte foto – Bolig B, bad 3/3 (designet: img/l2/09.jpg)
          PLACEHOLDER,
        ],
      },
      {
        name: "Balkong",
        images: [
          // TODO: ekte foto – Bolig B, balkong 1/1 (designet: img/l2/10.jpg)
          PLACEHOLDER,
        ],
      },
    ],
  },
];

/**
 * Hvor «gå videre»-punktet står i bildet, per romindeks. Verdiene er i prosent
 * av scenen og hentet rett fra designet, der de er plassert etter motivet i de
 * opprinnelige fotoene. Når de ekte bildene kommer inn, bør posisjonene
 * justeres så punktet peker mot en dør eller en åpning.
 */
export const walkPositions = [
  { x: 50, y: 64 },
  { x: 63, y: 58 },
  { x: 40, y: 61 },
  { x: 58, y: 63 },
  { x: 46, y: 59 },
];
