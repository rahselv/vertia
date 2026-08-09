import RevealController from "@/components/v2/RevealController";
import HeaderV2 from "@/components/v2/Header";
import HeroV2 from "@/components/v2/Hero";
import CalculatorV2 from "@/components/v2/Calculator";
import HowItWorksV2 from "@/components/v2/HowItWorks";
import ManifestoV2 from "@/components/v2/Manifesto";
import PricingV2 from "@/components/v2/Pricing";
import FaqV2 from "@/components/v2/Faq";
import ContactCtaV2 from "@/components/v2/ContactCta";
import FooterV2 from "@/components/v2/Footer";

// Midlertidig fra v1 – erstattes av v2-versjoner i etappe 3 (marquee).
import Channels from "@/components/Channels";
import PropertyCarousel from "@/components/PropertyCarousel";
import BloggTeaser from "@/components/BloggTeaser";

/**
 * Forsiden – landingsside v2.
 *
 * Seksjonene som er portet til v2 ligger inne i `.vertia-v2`-wrappere. Alt
 * design fra vertia-v2.css er scopet til den klassen, så seksjonene som ennå
 * ikke er portet må ligge UTENFOR wrapperen – ellers ville v2-reglene for
 * `.section`, `.btn-primary` og `h1–h3` overstyrt v1-stilene deres.
 *
 * v1-komponentene er bare koblet fra etter hvert som de erstattes; filene blir
 * liggende til v2 er verifisert.
 */
export default function Home() {
  return (
    <>
      <RevealController />

      <div className="vertia-v2">
        <HeaderV2 />
      </div>

      <main>
        <div className="vertia-v2">
          <HeroV2 />
        </div>

        {/* Etappe 3 erstatter disse to med v2-versjoner. */}
        <Channels />
        <PropertyCarousel />

        <div className="vertia-v2">
          <CalculatorV2 />
          <HowItWorksV2 />
          {/* Etappe 4: fremvisningen kommer her. */}
          <ManifestoV2 />
          <PricingV2 />
        </div>

        {/* Etappe 3 erstatter denne med v2-versjon. */}
        <BloggTeaser />

        <div className="vertia-v2">
          <FaqV2 />
          <ContactCtaV2 />
        </div>
      </main>

      <div className="vertia-v2">
        <FooterV2 />
      </div>
    </>
  );
}
