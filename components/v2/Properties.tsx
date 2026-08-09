"use client";

import DragMarquee from "./DragMarquee";

/**
 * Illustrative eksempelboliger – ingen ekte annonser ennå.
 *
 * Bildene hotlinkes fra Unsplash, som i både designet og v1-versjonen av denne
 * seksjonen. De byttes ut når de første ekte boligene er klare.
 */
const properties = [
  {
    place: "Norefjell",
    title: "Hytte ved løypenettet",
    src: "https://images.unsplash.com/photo-1517320964276-a002fa203177?auto=format&fit=crop&w=1400&q=85",
    alt: "Hytte ved løypenettet",
    description:
      "Skiene på rett utenfor døra og peisen tent når dere kommer inn. Romslig familiehytte med alt du trenger for en helg i løypene.",
    price: "Estimert 2 100–2 800 kr / natt",
    specs: ["3 soverom", "Ski in/out-område"],
  },
  {
    place: "Oslo",
    title: "Lys 2-roms nær sentrum",
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    alt: "Lys 2-roms nær sentrum",
    description:
      "Rolig gate, fem minutter fra kollektiv og kafeer. Lys og luftig leilighet med alt gjester trenger for både helgetur og jobbopphold.",
    price: "Estimert 1 500–1 900 kr / natt",
    specs: ["45 m²", "1 soverom"],
  },
  {
    place: "Blefjell",
    title: "Familiehytte med utsikt",
    src: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1400&q=85",
    alt: "Familiehytte med utsikt",
    description:
      "Panoramautsikt over fjellet fra stuevinduet. God plass til to familier, stor terrasse og turene starter rett fra trappa.",
    price: "Estimert 1 800–2 400 kr / natt",
    specs: ["80 m²", "3 soverom"],
  },
];

export default function PropertiesV2() {
  return (
    <section
      className="section"
      id="boliger"
      style={{ background: "var(--sand-50)" }}
    >
      <div className="wrap">
        <div className="sec-head rv" style={{ textAlign: "center" }}>
          <h2
            className="sec-title"
            style={{
              margin: "0 auto",
              fontSize: "clamp(2rem,3.6vw,3.2rem)",
              maxWidth: "none",
            }}
          >
            Annonser <em>kommer snart</em>
          </h2>
        </div>

        <DragMarquee
          wrapClassName="props-mq"
          trackClassName="props"
          renderSet={(clone) =>
            properties.map((property) => (
              <article
                className="prop"
                key={property.title}
                aria-hidden={clone || undefined}
              >
                <div className="ph">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={property.src} alt={property.alt} loading="lazy" />
                </div>
                <div className="bd">
                  <p className="plc">
                    <span>{property.place}</span>
                  </p>
                  <h3>{property.title}</h3>
                  <p className="ad">{property.description}</p>
                  <p className="pris">{property.price}</p>
                  <p className="specs">
                    {property.specs.map((spec) => (
                      <span key={spec}>{spec}</span>
                    ))}
                  </p>
                </div>
              </article>
            ))
          }
        />
      </div>
    </section>
  );
}
