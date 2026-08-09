import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
// Landingsside v2. Alle selektorer er scopet til `.vertia-v2`, så importen her
// har ingen effekt før et element faktisk får den klassen.
// Generert av scripts/scope-v2-css.mjs – ikke rediger app/vertia-v2.css direkte.
import "./vertia-v2.css";
import { siteConfig } from "@/lib/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Elegant serif til overskrifter – redaksjonelt, rolig, premium.
// Kursiv er nødvendig for v2-designet, som bruker <em> gjennomgående i
// overskrifter, priser og labels. Uten den ville nettleseren skråstilt den
// vanlige varianten syntetisk.
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `${siteConfig.companyName} – vi drifter korttidsutleien din`,
  description:
    "Vi drifter korttidsutleien av boligen eller hytta di – annonsering, gjester, vask og rapport. Du gjør ingenting og får en månedlig utbetaling. Få et gratis inntektsestimat.",
  openGraph: {
    title: `${siteConfig.companyName} – vi drifter korttidsutleien din`,
    description:
      "Korttidsutleie uten stress. Vi tar oss av alt – du får en månedlig utbetaling.",
    locale: "nb_NO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
