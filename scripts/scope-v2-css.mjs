/**
 * Scoper design-referansens vertia-v2.css til én wrapper-klasse.
 *
 * Kilde:  design-referanse/vertia/vertia-v2.css   (rør aldri denne – den er fasit)
 * Utdata: app/vertia-v2.css                       (generert, ikke rediger for hånd)
 *
 * Hvorfor: designfila har globale selektorer (`body`, `a`, `img`, `h1,h2,h3`,
 * `*`) og gjenbruker klassenavn vi allerede har i globals.css (`.section`,
 * `.btn-primary`, `.btn-on-image`). Uten scoping ville den endret utseendet på
 * artikkelsidene, /om-oss, /personvern og /vilkar. Hver selektor prefikses
 * derfor med `.vertia-v2`, så CSS-en først slår inn når noe faktisk ligger inne
 * i wrapperen.
 *
 * Kjør:  node scripts/scope-v2-css.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "design-referanse/vertia/vertia-v2.css");
const OUT = join(ROOT, "app/vertia-v2.css");

const SCOPE = ".vertia-v2";

/** Selektorer som håndteres spesielt fordi de ellers ville lekket ut av wrapperen. */
const SPECIAL = new Map([
  // Tailwind sin preflight setter allerede box-sizing; vi speiler regelen inne i wrapperen.
  ["*", `${SCOPE}, ${SCOPE} *`],
  // `body`-reglene (bakgrunn, farge, font) hører hjemme på selve wrapperen.
  ["body", SCOPE],
  // Variablene bor på wrapperen, ikke på :root, så de ikke kan kollidere senere.
  [":root", SCOPE],
  // scroll-behavior/scroll-padding ligger allerede identisk i app/globals.css.
  ["html", null],
]);

/** Deler en selektorliste på komma, uten å kutte inni (), [] eller "". */
function splitSelectors(list) {
  const out = [];
  let depth = 0;
  let quote = null;
  let buf = "";
  for (const ch of list) {
    if (quote) {
      buf += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
      continue;
    }
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      out.push(buf.trim());
      buf = "";
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function scopeSelector(sel) {
  if (SPECIAL.has(sel)) return SPECIAL.get(sel);
  // `.js-reveal` settes i designet på <body>. Hos oss er den en klasse på selve
  // wrapperen, så den skal feste seg på scopet – ikke bli en etterkommer av det.
  if (sel === ".js-reveal" || sel.startsWith(".js-reveal ")) {
    return `${SCOPE}${sel}`;
  }
  return `${SCOPE} ${sel}`;
}

/** Finner indeksen til `}` som lukker `{` på startIdx. */
function matchBrace(css, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error("Ubalansert { } i kilde-CSS");
}

function processBlock(css) {
  const out = [];
  let i = 0;

  while (i < css.length) {
    // Hopp over whitespace først, ellers havner en kommentar som står mellom to
    // regler inni neste regels selektor (`.vertia-v2 /* … */ .ovl{…}`).
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;

    // Behold kommentarer som de er.
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2);
      const stop = end === -1 ? css.length : end + 2;
      out.push(css.slice(i, stop));
      i = stop;
      continue;
    }

    const brace = css.indexOf("{", i);
    if (brace === -1) break;

    const prelude = css.slice(i, brace).trim();
    const close = matchBrace(css, brace);
    const body = css.slice(brace + 1, close);

    if (/^@keyframes/i.test(prelude)) {
      // Keyframe-steg (0%, from, to) er ikke selektorer – la blokka stå urørt.
      out.push(`${prelude}{${body}}`);
    } else if (/^@(media|supports|container)/i.test(prelude)) {
      const inner = processBlock(body).trim();
      // Media-blokker som ble tomme (f.eks. fordi `html`-regelen ble droppet)
      // skrives ikke ut.
      if (inner) out.push(`${prelude}{${inner}}`);
    } else if (prelude.startsWith("@")) {
      out.push(`${prelude}{${body}}`);
    } else {
      // Sikkerhetsnett: en kommentar skal aldri kunne bli en del av en selektor.
      if (prelude.includes("/*")) {
        throw new Error(`Kommentar havnet i selektor: ${prelude}`);
      }
      const scoped = splitSelectors(prelude)
        .map(scopeSelector)
        .filter((s) => s !== null);
      if (scoped.length) out.push(`${scoped.join(",")}{${body}}`);
    }

    i = close + 1;
  }

  return out.join("\n");
}

let css = readFileSync(SRC, "utf8");
let scoped = processBlock(css);

/**
 * Fontstakkene i designfila peker rett på "Playfair Display" / Inter og forutsetter
 * et <link> til Google Fonts. Vi laster begge via next/font i app/layout.tsx, så
 * variablene rewires til de CSS-variablene next/font genererer. Da slipper vi et
 * eksternt fontkall, og fontene lastes med `display: swap` som før.
 */
const REWIRES = [
  ['--serif:"Playfair Display",Georgia,serif', '--serif:var(--font-display),"Playfair Display",Georgia,serif'],
  ["--sans:Inter,system-ui,sans-serif", "--sans:var(--font-inter),Inter,system-ui,sans-serif"],
];
for (const [from, to] of REWIRES) {
  if (!scoped.includes(from)) {
    throw new Error(`Fant ikke fontstakken som skulle rewires: ${from}`);
  }
  scoped = scoped.replaceAll(from, to);
}

/**
 * Designet injiserer korn-teksturen med JS (document.querySelectorAll('.grain')).
 * Vi legger den rett i CSS-en i stedet – samme data-URI, men uten JS-avhengighet.
 * Identisk med korn-teksturen som allerede brukes i components/Hero.tsx.
 */
const ADDITIONS = `
/* ── Prosjekt-tillegg (ikke fra designfila) ──────────────────────────────── */

/* Korn-tekstur: settes med JS i designet, statisk her. */
${SCOPE} .grain{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* Mobilmeny. Designet har ingen: nav-en er display:none under 960px uten noe
   alternativ, så på mobil sto man igjen med kun «Kontakt oss». Vi beholder
   hamburgeren fra v1. Stilene ligger her fordi de ikke finnes i designfila. */
${SCOPE} .hdr-right{display:flex;align-items:center;gap:6px}
${SCOPE} .hdr-burger{display:flex;align-items:center;justify-content:center;width:42px;height:42px;border:0;border-radius:50%;background:none;color:#fff;cursor:pointer;transition:color .3s,background-color .3s}
${SCOPE} .hdr-burger:hover{background:rgba(255,255,255,.16)}
${SCOPE} .hdr.solid .hdr-burger{color:var(--ink-900)}
${SCOPE} .hdr.solid .hdr-burger:hover{background:var(--sand-200)}
@media(min-width:960px){${SCOPE} .hdr-burger,${SCOPE} .hdr-mob{display:none}}
${SCOPE} .hdr-mob{background:rgba(251,248,243,.97);backdrop-filter:blur(10px);border-top:1px solid var(--sand-200)}
${SCOPE} .hdr-mob ul{max-width:var(--maxw);margin:0 auto;padding:6px var(--edge) 14px;list-style:none;display:flex;flex-direction:column}
${SCOPE} .hdr-mob a{display:block;padding:13px 0;font-size:.95rem;font-weight:500;color:var(--ink-700);border-bottom:1px solid var(--sand-200)}
${SCOPE} .hdr-mob li:last-child a{border-bottom:0}
${SCOPE} .hdr-mob a:hover{color:var(--acc)}

/* Kanal-logoer. Designet la disse som inline style-attributter på hver <span>;
   her er de klasser, så markupen holder seg lesbar. Merkefargene er uendret. */
${SCOPE} .mq-airbnb{font:600 1.6rem/1 var(--sans);letter-spacing:-.03em;color:#FF385C}
${SCOPE} .mq-booking{font:700 1.45rem/1 var(--sans);letter-spacing:-.02em;color:#003580}
${SCOPE} .mq-booking i{font-style:normal;font-weight:500;color:#009FE3}
${SCOPE} .mq-vrbo{font:700 1.55rem/1 var(--sans);letter-spacing:-.02em;color:#1668E3}
${SCOPE} .mq-finn{font:800 1.5rem/1 var(--sans);color:#0063FB}
${SCOPE} .mq-finn i{font-style:normal;font-weight:600;color:rgba(0,99,251,.55)}

/* ── Mobil ──────────────────────────────────────────────────────────────────
   Designet ble tegnet for desktop. Justeringene under gjelder kun små skjermer
   og berører ikke desktop-utseendet. */

/* Fingervennlige treffflater. Designets padding (6–9px) gir under 30px høyde,
   godt under de 44px som er tommelfingerregelen på touch. */
@media(pointer:coarse){
  ${SCOPE} .fv-rooms button{padding:13px 6px}
  ${SCOPE} .fv-apts button{padding:11px 6px}
  ${SCOPE} .faq summary{padding:26px 0}
}

/* Knappene i heroen strekker seg over hele bredden på smale skjermer i stedet
   for å stå som to smale kolonner. */
@media(max-width:560px){
  ${SCOPE} .hero-cta .btn{width:100%}
}

/* Skillestrekene mellom hero-badgene tar for mye plass når listen brytes over
   flere linjer på telefon. */
@media(max-width:560px){
  ${SCOPE} .hero-badges{flex-direction:column;gap:10px}
  ${SCOPE} .hero-badges li+li::before{display:none}
}

/* «Gå videre»-etiketten kan bli bredere enn scenen på de smaleste telefonene. */
@media(max-width:420px){
  ${SCOPE} .fvw-lbl{font-size:.7rem;padding:6px 11px}
}

/* ── Fremvisningen: rammen og zoomen ────────────────────────────────────────
   Designet hadde 16:10-ramme (4:3 på mobil) og forstørret bildene til
   150 % x 136 %. Fotoene er 3:2, så cover beskar topp og bunn FØR panoreringen
   begynte, og forstørrelsen gjorde at man bare så rundt halve motivet om
   gangen. Resultatet var en utsnittsflik, ikke et rom.

   Rammen følger nå fotoenes eget format, 3:2, også på mobil der designets 4:3
   beskar enda hardere. Da matcher bildeboksens sideforhold motivet, og cover
   beskjærer ingenting – forstørrelsen alene bestemmer hvor mye som er synlig.

   108 % gir nok slark til å se seg rundt uten at motivet forsvinner.
   PAN_X/PAN_Y i Showcase.tsx = (108 − 100) / 108 = 7.4. Endrer du det ene,
   endre det andre. */
${SCOPE} .fv-stage{aspect-ratio:3/2}
@media(max-width:640px){${SCOPE} .fv-stage{aspect-ratio:3/2}}
${SCOPE} .fv-stage img{width:108%;height:108%}

/* Punktlista i nøkkelboks-modalen står uten strek foran punktene. Designet
   tegnet en liten vannrett strek med ::before; her er det ren tekst. */
${SCOPE} .kb-list li::before{display:none}
${SCOPE} .kb-list li{gap:0}

/* Produktbildet er en utklippet PNG, ikke et fotomotiv. Designet la opp til
   object-fit: cover, som ville beskåret et nesten kvadratisk produkt i en
   4:5-rute. Med contain og litt luft vises hele produktet mot sandflaten. */
${SCOPE} .kb-photo{padding:20px}
${SCOPE} .kb-photo img{object-fit:contain;aspect-ratio:auto}

/* Samtykke. Designet har ingen slik boks, men v1 hadde en påkrevd – den er
   nødvendig etter markedsføringsloven § 15 og skal ikke falle bort i redesignet. */
${SCOPE} .consent{display:flex;align-items:flex-start;gap:12px;margin:26px 0 0;max-width:46rem;font-size:.88rem;line-height:1.6;cursor:pointer}
${SCOPE} .consent input{flex:none;width:19px;height:19px;margin-top:2px;accent-color:var(--acc)}
${SCOPE} .cta .consent{color:rgba(250,246,238,.75);flex:1 0 100%}
${SCOPE} .cta .consent a{color:var(--cream);text-decoration:underline;text-underline-offset:3px}
${SCOPE} .cta .consent a:hover{color:#fff}

/* Bekreftelse etter innsendt skjema. Designet bytter ut skjemaet med inline
   stiler i JS; vi gjør det med klasser i stedet. */
${SCOPE} .form-ok{margin:26px 0 0;line-height:1.7;color:var(--ink-500)}
${SCOPE} .form-err{margin:18px 0 0;font-size:.88rem;line-height:1.6;color:var(--acc)}
${SCOPE} .cta .form-ok{color:rgba(250,246,238,.8);font-size:1.1rem;margin-top:52px}
${SCOPE} .cta .form-ok strong{color:var(--cream)}
${SCOPE} .cta .form-err{color:var(--acc-lt)}
`;

const HEADER = `/**
 * GENERERT FIL – IKKE REDIGER FOR HÅND.
 *
 * Kilde:   design-referanse/vertia/vertia-v2.css
 * Generer: node scripts/scope-v2-css.mjs
 *
 * Hver selektor er prefikset med \`${SCOPE}\` slik at designet ikke lekker inn i
 * eksisterende sider. CSS-en slår først inn på innhold som ligger inne i et
 * element med klassen \`${SCOPE.slice(1)}\`.
 *
 * Skal noe endres: endre kilden eller legg til en override i ADDITIONS-blokka
 * nederst i scripts/scope-v2-css.mjs, og kjør scriptet på nytt.
 */
`;

writeFileSync(OUT, `${HEADER}${scoped}\n${ADDITIONS}`);

const rules = (scoped.match(/\{/g) || []).length;
console.log(`✓ Skrev app/vertia-v2.css (${rules} blokker, alle scopet til ${SCOPE})`);
