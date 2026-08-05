import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactModalProvider from "@/components/ContactModalProvider";
import RevealText from "@/components/motion/RevealText";
import ArticleGrid from "@/components/ArticleGrid";
import { artikler } from "@/lib/artikler";

export const metadata: Metadata = {
  title: "Artikler – Innsikt for utleiere | Vertia",
  description:
    "Rolige, etterrettelige artikler om korttidsutleie: skatt, regler, forsikring, prising og hvordan du gjør boligen eller hytta klar for gjester.",
};

export default function ArtiklerPage() {
  return (
    <ContactModalProvider>
      <Header solid />
      <main className="bg-sand-100">
        {/* Redaksjonell topp */}
        <section className="section pb-12 sm:pb-16">
          <div className="container-page">
            <div className="max-w-2xl">
              <RevealText as="p" className="eyebrow mb-4">
                Artikler
              </RevealText>
              <RevealText as="h1" className="section-title" delay={0.08}>
                Innsikt for utleiere
              </RevealText>
              <RevealText as="p" className="section-lead" delay={0.16}>
                Rolige, etterrettelige tekster om det som faktisk betyr noe når
                du leier ut boligen eller hytta: skatt, regler, forsikring,
                prising og klargjøring.
              </RevealText>
            </div>
          </div>
        </section>

        {/* Kortgrid */}
        <section className="pb-24 sm:pb-32">
          <div className="container-page">
            <ArticleGrid artikler={artikler} />
          </div>
        </section>
      </main>
      <Footer />
    </ContactModalProvider>
  );
}
