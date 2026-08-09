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
