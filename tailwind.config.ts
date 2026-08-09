import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vertia-palett (eksakt fra redesign-pakken / .claude/design-system.md):
        // varm krem/sand + dyp brun espresso. Aldri navy/blå, aldri kaldt.
        sand: {
          50: "#FBF8F3", // --surface (lyseste kort/flate)
          100: "#F7F3ED", // --page (varm hovedbakgrunn)
          200: "#EFE8DE", // --surface-strong (varm kant/flate)
          300: "#DED2BF",
        },
        brand: {
          50: "#F0EAE2",
          100: "#DFD3C6",
          400: "#8C7B6C", // varm taupe
          500: "#4A382C", // varm brun (medium)
          600: "#35261D", // --brown (primær, mørk brun)
          700: "#211712", // --brown-deep (mørkeste)
        },
        ink: {
          500: "#746B63", // --muted (sekundærtekst)
          700: "#473B31",
          900: "#211A15", // --ink (hovedtekst)
        },
        // Aksentfarge fra landingsside v2 (terrakotta/kobber). Finnes ikke i
        // v1-designet. Brukes til eyebrows, «Mest valgt»-merket, FAQ-plusset,
        // uthevet søyle i rapporten og lenke-hover.
        accent: {
          400: "#CE9067", // --acc-lt (på mørke flater)
          500: "#A65A38", // --acc
        },
        // --cream. Ligger nær sand-50 (#FBF8F3), men er en egen tone som v2
        // bruker for tekst og flater oppå espresso.
        cream: "#FAF6EE",
      },
      fontFamily: {
        // Brødtekst og UI i Inter (sans).
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Overskrifter i elegant serif (Playfair Display).
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        // Sikkerhetsnett: evt. `font-serif`-klasser rendres som samme
        // display-serif (IKKE Times).
        serif: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        // Skandinavisk redaksjonell retning: skarpe kanter. Ingen radius over
        // 4px noe sted – alle tokens (inkl. `full`) kappes til maks 4px.
        DEFAULT: "4px",
        sm: "2px",
        md: "4px",
        lg: "4px",
        xl: "4px",
        "2xl": "4px",
        "3xl": "4px",
        full: "4px",
      },
      maxWidth: {
        content: "75rem",
        // v2 sin --maxw (1360px). Bredere enn v1 sin container.
        "content-wide": "85rem",
      },
      boxShadow: {
        // Flat redaksjonell flate – ingen skygger, ingen dybde-triks.
        soft: "none",
        card: "none",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
