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
  // `.js-reveal` settes i designet på <body>, av et script som kjører før
  // første maling. Hos oss settes den på <html>, IKKE på wrapper-diven: React
  // eier wrapperen, og en klasse lagt på den før hydrering gir «Prop className
  // did not match» – hvorpå React kan fjerne klassen igjen. <html> er derimot
  // et element React tåler at andre skriver til.
  if (sel === ".js-reveal" || sel.startsWith(".js-reveal ")) {
    return sel.replace(/^\.js-reveal\s*/, `.js-reveal ${SCOPE} `).trim();
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

/* ── Tettere rytme ──────────────────────────────────────────────────────────
   Designet er tegnet luftig: seksjoner på opptil 190 px topp og bunn, og
   seksjonstitler opp mot 5,2 rem. På en side med tolv seksjoner ble summen for
   mye – man scroller mye og leser lite, og overskriftene dominerer innholdet.

   Verdiene under strammer inn jevnt over hele siden og beholder den
   redaksjonelle stilen: samme skriftsnitt, samme proporsjoner mellom tittel og
   ingress, bare mindre. Dette er et bevisst avvik fra designfila. */
${SCOPE} .section{padding:clamp(64px,7vw,108px) 0}
${SCOPE} .sec-head{margin-bottom:clamp(36px,3.6vw,56px)}
${SCOPE} .sec-title{font-size:clamp(2rem,3.8vw,3.2rem)}
${SCOPE} .sec-lead{font-size:1rem}

/* Hero: mindre tittel og langt kortere avstand ned til knappene og badgene.
   Designet skjøv dem 130 px og 150 px ned, som ga en nesten tom skjerm. */
${SCOPE} .hero h1{font-size:clamp(2rem,3.4vw,3.2rem)}
${SCOPE} .hero-cta{margin-top:clamp(36px,4.5vw,64px)}
${SCOPE} .hero-badges{margin-top:clamp(36px,5vw,72px)}
${SCOPE} .hero .wrap{padding-top:96px;padding-bottom:56px}

/* Manifest, kontakt og fotmerket var de tre største typografiske flatene. */
${SCOPE} .manif h2{font-size:clamp(1.6rem,2.6vw,2.4rem)}
${SCOPE} .manif .sub{margin-top:26px;font-size:1rem}
${SCOPE} .manif-stats{margin-top:clamp(40px,4vw,60px)}
${SCOPE} .cta h2{font-size:clamp(1.9rem,3.4vw,2.8rem)}
${SCOPE} .cta .ld{margin-top:22px;font-size:1rem}
${SCOPE} .cta-form{margin-top:34px}
${SCOPE} .ft-brand{font-size:clamp(3.2rem,10vw,8rem);margin:clamp(36px,4.5vw,60px) 0 clamp(20px,2vw,32px)}
${SCOPE} .ft{padding-top:clamp(48px,5vw,68px)}

/* Steg, priser, boliger og fremvisning: mindre luft mellom elementene. */
${SCOPE} .stepx{padding:clamp(30px,3.2vw,50px) 0}
${SCOPE} .stepx h3{font-size:clamp(1.4rem,2vw,1.9rem)}
${SCOPE} .tiers{margin-top:clamp(32px,3.4vw,48px)}
${SCOPE} .tier{padding:clamp(26px,2.8vw,36px)}
${SCOPE} .tier .pct{font-size:clamp(2.6rem,3.8vw,3.6rem);margin-top:20px}
${SCOPE} .fv{margin-top:clamp(26px,2.8vw,38px)}
${SCOPE} .fv-sub{font-size:1rem;margin-top:16px}
${SCOPE} .faq summary{font-size:clamp(1.1rem,1.5vw,1.3rem)}
${SCOPE} .calc{padding:clamp(24px,2.8vw,38px)}
${SCOPE} .prop h3,${SCOPE} .post h3{font-size:clamp(1.25rem,1.7vw,1.5rem)}

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

/* ── Mobil: egen, strammere skala ───────────────────────────────────────────
   Designet er tegnet for desktop og skalerer ned via vw-baserte clamp-verdier.
   På telefon ble resultatet at heroen fylte hele skjermen og overskriftene tok
   mesteparten av plassen. Under 640 px settes derfor faste, mindre verdier i
   stedet for å la vw bestemme. Mobil prioriteres foran desktop der de to
   trekker i hver sin retning. */
@media(max-width:640px){
  /* Heroen skal ikke fylle viewporten. Man skal se at det finnes noe under. */
  ${SCOPE} .hero{min-height:78svh}
  ${SCOPE} .hero .wrap{padding-top:82px;padding-bottom:38px}
  ${SCOPE} .hero h1{font-size:1.75rem;line-height:1.18}
  ${SCOPE} .hero-kicker{font-size:.6rem;letter-spacing:.22em;margin-bottom:18px}
  ${SCOPE} .hero-cta{margin-top:26px;gap:10px;grid-template-columns:1fr}
  ${SCOPE} .hero-cta .btn{width:100%;padding:12px 18px;font-size:.85rem}

  /* Punktene på én linje med prikk mellom, ikke stablet. Designet brukte en
     loddrett strek med 22 px luft på hver side, som ble altfor bredt her. */
  ${SCOPE} .hero-badges{margin-top:24px;flex-wrap:nowrap;justify-content:center;gap:0;font-size:.7rem}
  ${SCOPE} .hero-badges li{white-space:nowrap}
  ${SCOPE} .hero-badges li+li::before{content:"·";width:auto;height:auto;background:none;margin:0 7px;color:rgba(255,255,255,.55)}

  ${SCOPE} .hdr-in{height:60px}
  ${SCOPE} .btn{padding:13px 22px;font-size:.85rem}

  /* Seksjonsluft og overskrifter kraftig ned. */
  ${SCOPE} .section{padding:44px 0}
  ${SCOPE} .chan-band{padding:26px 0}
  ${SCOPE} .sec-head{margin-bottom:24px}
  ${SCOPE} .sec-title{font-size:1.6rem}
  ${SCOPE} .sec-lead{font-size:.95rem}
  ${SCOPE} .manif h2{font-size:1.45rem}
  ${SCOPE} .manif .sub{margin-top:18px;font-size:.95rem}
  ${SCOPE} .manif-stats{margin-top:30px}
  ${SCOPE} .manif-stats b{font-size:1.6rem}
  ${SCOPE} .cta h2{font-size:1.6rem}
  ${SCOPE} .cta .ld{font-size:.95rem}
  ${SCOPE} .stepx{padding:26px 0;gap:20px}
  ${SCOPE} .stepx h3{font-size:1.25rem}
  ${SCOPE} .faq summary{font-size:1rem;padding:18px 0}
  ${SCOPE} .fv-sub{font-size:.95rem}
  ${SCOPE} .calc{padding:22px}
  ${SCOPE} .calc-top h3{font-size:1.2rem}
  ${SCOPE} .prop h3,${SCOPE} .post h3{font-size:1.1rem}
  ${SCOPE} .startpk{padding:24px 22px}
  ${SCOPE} .startpk h3{font-size:1.35rem}
  ${SCOPE} .ft{padding-top:40px;gap:30px}
  ${SCOPE} .ft-brand{font-size:2.8rem;margin:26px 0 14px}

  /* Prispakkene lå åpne under hverandre og ble en veldig lang kolonne. På
     telefon er de nå swipebare kort med snap – samme språk som kortkarusellene
     ellers på siden, og uten JS. */
  ${SCOPE} .tiers{display:flex;border:0;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:4px;scrollbar-width:none}
  ${SCOPE} .tiers::-webkit-scrollbar{display:none}
  ${SCOPE} .tier{flex:0 0 84%;scroll-snap-align:center;border:1px solid var(--sand-300);padding:26px 24px}
  ${SCOPE} .tier:last-child{border-bottom:1px solid var(--sand-300)}
  ${SCOPE} .tier.on{border-color:var(--brand-600)}
  ${SCOPE} .tier .pct{font-size:2.6rem;margin-top:16px}
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

   Selve forstørrelsen settes ikke lenger her, men per bilde i showcaseData
   (standard 108 %), fordi noen motiver tåler mindre zoom enn andre. */
${SCOPE} .fv-stage{aspect-ratio:3/2}
@media(max-width:640px){${SCOPE} .fv-stage{aspect-ratio:3/2}}

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
