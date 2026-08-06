"use client";

import { useEffect, useState } from "react";
import {
  Megaphone,
  MessageSquare,
  KeyRound,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  makeReveal,
  makeImageReveal,
  makeContentItem,
  makeIconItem,
} from "@/components/motion/variants";
import KeylessAccessModal from "./KeylessAccessModal";

type ServiceItem = {
  title: string;
  description: string;
  Icon: LucideIcon;
  image: string;
  imageAlt: string;
  /** Viser «Les mer»-lenken som åpner detaljene om nøkkelfri tilgang. */
  keyless?: boolean;
};

// «Dynamisk prising» er bevisst utelatt her – den har sin egen seksjon under.
const items: ServiceItem[] = [
  {
    title: "Profesjonell annonse",
    description: "Bilder, tekst og oppsett på Airbnb og andre plattformer.",
    Icon: Megaphone,
    image: "/images/service/01-profesjonell-annonse.png",
    imageAlt: "Lyst, varmt skandinavisk stuerom klart for annonsefoto.",
  },
  {
    title: "Gjestekommunikasjon",
    description: "Vi svarer gjestene raskt, før, under og etter oppholdet.",
    Icon: MessageSquare,
    image: "/images/service/02-gjestekommunikasjon.png",
    imageAlt: "Rolig hjemmedetalj som signaliserer god vertskommunikasjon.",
  },
  {
    title: "Nøkkelfri innsjekk",
    description:
      "Vi installerer en smart nøkkelboks med engangskode til hver gjest. Koden virker kun under oppholdet, og løsningen fungerer også på hytter uten internett. Yale Doorman kan tilbys som oppgradering for boliger der døren passer.",
    Icon: KeyRound,
    image: "/images/service/03-nokkelfri-innsjekk.png",
    imageAlt: "Inngangsparti med smart, nøkkelfri innsjekk.",
    keyless: true,
  },
  {
    title: "Vask-koordinering",
    description: "Vask mellom hvert opphold med godkjent renholder.",
    Icon: Sparkles,
    image: "/images/service/04-vask-koordinering.png",
    imageAlt: "Nyvasket, ryddig rom klart for neste gjest.",
  },
];

export default function ServiceCards() {
  const reduce = useReducedMotion() ?? false;
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 640px)");
    const sync = () => setMobile(small.matches);
    sync();
    small.addEventListener("change", sync);
    return () => small.removeEventListener("change", sync);
  }, []);

  return (
    // Hvert kort selv-trigger sin egen scroll-inn (robust: ikke avhengig av
    // variant-arv fra forelder). Per-index delay gir «ett etter ett»-stagger.
    <ul className="mt-16 flex flex-wrap justify-center gap-5 overflow-x-clip">
      {items.map((item, index) => {
        // Vekslende retning: kort 1 fra venstre, kort 2 fra høyre, osv.
        const direction = index % 2 === 0 ? "left" : "right";
        const cardVariants = makeReveal(direction, {
          reduce,
          mobile,
          hover: false,
          delay: index * 0.15,
        });
        const imageVariants = makeImageReveal(reduce, false);
        const iconVariants = makeIconItem(reduce, 0.15);
        const titleVariants = makeContentItem(reduce, 0.22);
        const descVariants = makeContentItem(reduce, 0.29);

        return (
          <motion.li
            key={item.title}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="group list-none w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
          >
            <div className="flex h-full flex-col overflow-hidden border border-sand-200 bg-sand-50 transition-colors duration-200 ease-out group-hover:border-sand-300">
              {/* Bilde: overflow-hidden wrapper, imageReveal (scale 1.08→1) +
                  diskret hover-zoom. Alt via framer, ingen CSS-transform-kollisjon. */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  variants={imageVariants}
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-7">
                <motion.span
                  variants={iconVariants}
                  className="flex h-12 w-12 items-center justify-center bg-brand-600 text-sand-50"
                >
                  <item.Icon className="h-6 w-6" strokeWidth={1.75} />
                </motion.span>
                <motion.h3
                  variants={titleVariants}
                  className="mt-5 font-display text-lg font-medium tracking-[-0.01em] text-ink-900"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  variants={descVariants}
                  className="mt-2 text-sm leading-relaxed text-ink-500"
                >
                  {item.description}
                </motion.p>

                {/* Kun på «Nøkkelfri innsjekk»: lenke til detaljene, plassert
                    nederst i kortet så kortene beholder lik høyde. */}
                {item.keyless && (
                  <motion.div variants={descVariants} className="mt-auto flex">
                    <KeylessAccessModal />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
