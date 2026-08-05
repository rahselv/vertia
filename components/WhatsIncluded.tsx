import DynamicPricingReveal from "./DynamicPricingReveal";
import ServiceCards from "./ServiceCards";
import RevealText from "./motion/RevealText";

export default function WhatsIncluded() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <RevealText as="p" className="eyebrow mb-4">
              Hva som inngår
            </RevealText>
            <RevealText
              as="h2"
              className="section-title max-w-xl"
              delay={0.08}
            >
              Alt er inkludert i én tjeneste
            </RevealText>
          </div>
          <RevealText
            as="p"
            className="text-lg leading-relaxed text-ink-500 lg:col-span-5 lg:pb-2"
            delay={0.16}
          >
            Du forholder deg til oss. Vi forholder oss til resten.
          </RevealText>
        </div>

        <ServiceCards />

        {/* Illustrasjon: dynamisk prising etter etterspørsel per dag. */}
        <DynamicPricingReveal />
      </div>
    </section>
  );
}
