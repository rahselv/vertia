import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";
import PropertyCarousel from "@/components/PropertyCarousel";
import Statement from "@/components/Statement";
import GettingStarted from "@/components/GettingStarted";
import Channels from "@/components/Channels";
import WhatsIncluded from "@/components/WhatsIncluded";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import BloggTeaser from "@/components/BloggTeaser";
import ContactCta from "@/components/ContactCta";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactModalProvider from "@/components/ContactModalProvider";

export default function Home() {
  return (
    <ContactModalProvider>
      <Header />
      <main>
        <Hero />
        <Reveal>
          <Calculator />
        </Reveal>
        <Reveal>
          <PropertyCarousel />
        </Reveal>
        <Statement />
        <Reveal>
          <GettingStarted />
        </Reveal>
        <Reveal>
          <Channels />
        </Reveal>
        <Reveal>
          <WhatsIncluded />
        </Reveal>
        <Reveal>
          <Pricing />
        </Reveal>
        <Reveal>
          <BloggTeaser />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
        <Reveal>
          <ContactCta />
        </Reveal>
      </main>
      <Footer />
    </ContactModalProvider>
  );
}
