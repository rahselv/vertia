# Vertia – Designprinsipper (Heimby-inspirert)

Dette er den autoritative designreferansen for Vertia. Les denne filen **hver
gang** du gjør en UI-endring, og følg den til punkt og prikke.

> Retningen er en **varm, redaksjonell, minimalistisk skandinavisk** stil:
> elegante **serif-overskrifter** på varm lys palett med mørke espresso-flater
> som aksent. **Ingen navy/blå.** Tenk high-end eiendom, redaksjonelt magasin,
> Aesop/Heimby – varmt, rolig, dyrt og veldig enkelt.

## Stil
Varm, jordnær, minimalistisk, dyr. Mye luft, store full-bleed bilder i gyllent
lys, rolige overflater. Mer «merkevare og stemning», mindre «nettside».

## Farger (varm jord-palett – ALDRI blå/navy)
- Bakgrunner: **varm beige / krem / sand** (`sand`-tokenene). Alt skal puste.
- Mørk anker: **varm espresso/brun** (`brand`-tokenene + `ink`), brukt til mørke
  seksjoner (hero-topp/footer), tekst og knapper. Aldri svart, aldri navy.
- Tekst: varm mørk brun (`ink-900`/`ink-700`), sekundær i varm gråbrun (`ink-500`).
- **Aldri rene grå eller kalde toner** – alt skal være varmt.
- Token-verdier (definert i `tailwind.config.ts`):
  - `sand`: 50 `#FAF6EE`, 100 `#F1EBDF`, 200 `#E5DBC9`, 300 `#D6C8B2`
  - `brand` (varm espresso/taupe, erstatter den gamle navyen): 50 `#F0EAE2`,
    100 `#DFD3C6`, 400 `#8C7B6C`, 500 `#5C4E44`, 600 `#3A2F28`, 700 `#241C17`
  - `ink`: 500 `#7A6E62`, 700 `#4A4039`, 900 `#241E18`

## Typografi (serif overskrifter + sans brødtekst)
- **Overskrifter i en elegant serif** (display-fonten `--font-display`, f.eks.
  **Playfair Display** / Fraunces): redaksjonelt, rolig, med stram tracking og
  god leding. Stor kontrast i størrelse mellom h1 og brødtekst.
- **Brødtekst, labels, knapper og UI i ren sans** (Inter). Eyebrows i liten,
  sperret sans-versal, dempet varm farge.
- Bruk `font-display` på overskrifter/store tall, `font-sans` på alt annet.
  Aldri kursiv-aksent på enkeltord.
- **Ingen dekorative bindestreker/hårstreker** ved eyebrows.
- Unngå em/en-dash («–»/«—») og bindestreker som dramatisk skilletegn i copy.

## Knapper
- Primær: **rolig pille-knapp** – på lyse flater: espresso/brun fyll med krem
  tekst. På bilder/mørke flater: **hvit pille** med mørk tekst. Store radius,
  myk skygge, diskret hover-løft.
- Sekundær: diskret, transparent med tynn kant.

## Bilder
- **ALLTID** store, varme, atmosfæriske foto i gyllent/naturlig lys (lyse
  skandinaviske interiører, hytte, natur). Gjerne **full-bleed** hero og
  seksjoner. Varm, dempet fargetemperatur – sammenhengende serie, ingen gjenbruk.
- Aldri tomme ikon-sirkler som eneste visuelle element.

## Komponenter
- Store **border-radius** (rounded-2xl/3xl). Myke, varme skygger.
- **Overlappende lyse kort** oppå full-bleed bilder (à la Heimby «Vår metode»).
- **Accordion** for innholdstunge seksjoner (metode/tjenester), rolig + / −.
- **Hover som løfter** kortene diskret.

## Bevegelse
- Subtile fade/slide-in ved scroll (framer-motion). Respekter reduced-motion.
- Diskret og elegant – aldri leketøyaktig.

## Rytme
- Sjenerøs, **lik vertikal avstand** mellom seksjoner. Mye whitespace.
- Rolig veksling mellom varme nøytraler (krem/sand/hvit) og enkelte mørke
  espresso-flater (hero, stat-band, fremhevet pris-kort) – aldri to like på rad,
  aldri flatt eller kaldt.
- **Footer er LYS** (varm krem/sand med mørk tekst), ikke mørk.
