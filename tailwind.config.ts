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
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      maxWidth: {
        content: "75rem",
      },
      boxShadow: {
        // Varme, myke skygger (espresso-tonet, aldri kald grå/svart).
        soft: "0 18px 50px -20px rgba(58, 47, 40, 0.28)",
        card: "0 10px 30px -16px rgba(58, 47, 40, 0.22)",
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
