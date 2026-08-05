import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Elegant serif til overskrifter – redaksjonelt, rolig, premium.
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
