# Utleie-site

Landingsside for korttidsutleie-forvaltning (Airbnb-forvaltning / co-host).
Bygget med **Next.js + TypeScript + Tailwind**, klar for deploy på **Vercel**.

Skrevet for ikke-utviklere – under finner du det du trenger for å komme i gang
og gjøre de vanligste endringene selv.

---

## Kjøre siden lokalt på maskinen din

1. Installer **Node.js** (versjon 18 eller nyere) fra [nodejs.no/last-ned](https://nodejs.org).
2. Åpne en terminal i denne mappen og kjør:

   ```bash
   npm install      # laster ned alt siden trenger (kun første gang)
   npm run dev      # starter siden lokalt
   ```

3. Åpne **http://localhost:3000** i nettleseren.

Endrer du en fil og lagrer, oppdateres siden automatisk.

---

## Det du oftest vil endre

| Hva | Hvor |
| --- | --- |
| Firmanavn, logo, e-post, telefon | `lib/siteConfig.ts` |
| Tall i kalkulatoren (døgnpris, belegg, provisjon) | `lib/calculatorConfig.ts` |
| Tekster i seksjonene | filene i `components/`-mappen |
| Spørsmål og svar (FAQ) | `components/Faq.tsx` |
| Hvor skjemaet sender henvendelser | `app/api/lead/route.ts` |

### Bytte logo
Legg en logofil (f.eks. `logo.svg`) i `public/`-mappen, og sett
`logoSrc: "/logo.svg"` i `lib/siteConfig.ts`.

### Justere kalkulatoren
Alle forutsetninger ligger samlet øverst i `lib/calculatorConfig.ts`, godt
forklart. Du kan trygt endre døgnpriser, beleggsfaktor og provisjon der – resten
av siden følger automatisk.

### Koble skjemaet til e-post
Skjemaet fungerer allerede ende-til-ende, men lagrer foreløpig bare til
serverloggen. I `app/api/lead/route.ts` står det en steg-for-steg-forklaring på
hvordan du kobler det til **Formspree** eller **e-post** når du er klar.

---

## Legge siden ut på nett (Vercel)

1. Lag en gratis konto på [vercel.com](https://vercel.com).
2. Last opp prosjektet (via GitHub eller Vercel sin egen import).
3. Vercel oppdager automatisk at det er Next.js og publiserer siden.

Ingen ekstra oppsett er nødvendig.

---

## Godt å vite

- **Samtykke:** Avkrysningsboksen i skjemaet er bevisst **ikke** forhåndskrysset,
  slik markedsføringsloven § 15 krever. Ikke endre dette.
- **Estimat, ikke garanti:** Kalkulatoren viser anslag. Teksten som sier dette
  bør bli stående.
