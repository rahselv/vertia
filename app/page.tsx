import RevealController, {
  revealBootstrap,
} from "@/components/v2/RevealController";
import HeaderV2 from "@/components/v2/Header";
import HeroV2 from "@/components/v2/Hero";
import ChannelsV2 from "@/components/v2/Channels";
import PropertiesV2 from "@/components/v2/Properties";
import CalculatorV2 from "@/components/v2/Calculator";
import HowItWorksV2 from "@/components/v2/HowItWorks";
import ShowcaseV2 from "@/components/v2/Showcase";
import ManifestoV2 from "@/components/v2/Manifesto";
import PricingV2 from "@/components/v2/Pricing";
import ArticlesV2 from "@/components/v2/Articles";
import FaqV2 from "@/components/v2/Faq";
import ContactCtaV2 from "@/components/v2/ContactCta";
import FooterV2 from "@/components/v2/Footer";

/**
 * Forsiden – landingsside v2.
 *
 * Hele siden ligger i én `.vertia-v2`-wrapper. Alt design fra vertia-v2.css er
 * scopet til den klassen, så resten av nettstedet (artikler, /om-oss,
 * /personvern, /vilkar) er upåvirket og bruker fortsatt v1-stilene.
 *
 * v1-komponentene for de erstattede seksjonene ligger fortsatt i components/,
 * bare koblet fra her.
 */
export default function Home() {
  return (
    <>
      <RevealController />

      <div className="vertia-v2">
        {/* Må stå først i wrapperen og kjøre synkront – se revealBootstrap. */}
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />

        <HeaderV2 />

        <main>
          <HeroV2 />
          <ChannelsV2 />
          <PropertiesV2 />
          <CalculatorV2 />
          <HowItWorksV2 />
          <ShowcaseV2 />
          <ManifestoV2 />
          <PricingV2 />
          <ArticlesV2 />
          <FaqV2 />
          <ContactCtaV2 />
        </main>

        <FooterV2 />
      </div>
    </>
  );
}
