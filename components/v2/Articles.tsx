"use client";

import Link from "next/link";
import ArrowIcon from "./ArrowIcon";
import DragMarquee from "./DragMarquee";
import { getAlleArtikler } from "@/lib/artikler";

/**
 * «Innsikt for utleiere».
 *
 * Designet hardkodet tre artikler med absolutte vertia.no-URL-er. Her hentes de
 * fra lib/artikler.ts og lenkes internt med next/link, så listen alltid stemmer
 * med det som faktisk ligger under /artikler.
 *
 * Kortene i de to klonede settene får `tabIndex={-1}` i tillegg til
 * aria-hidden. Uten det ville tastaturnavigasjon gått gjennom hver artikkel tre
 * ganger, inn i innhold som er skjult for skjermlesere.
 */
export default function ArticlesV2() {
  const artikler = getAlleArtikler();

  return (
    <section
      className="section"
      id="artikler"
      style={{ background: "var(--sand-100)" }}
    >
      <div className="wrap">
        <div className="sec-head sec-row rv">
          <div>
            <h2 className="sec-title">
              Innsikt for <em>utleiere</em>
            </h2>
          </div>
          <div>
            <p className="sec-lead">
              Rolige, ettertenksomme tekster om det som faktisk betyr noe når du
              leier ut.
            </p>
            <p style={{ margin: "22px 0 0" }}>
              <Link className="lnk" href="/artikler">
                Se alle artikler <ArrowIcon size={14} strokeWidth={2} />
              </Link>
            </p>
          </div>
        </div>

        <DragMarquee
          wrapClassName="posts-mq"
          trackClassName="posts"
          renderSet={(clone) =>
            artikler.map((artikkel) => (
              <article
                className="post"
                key={artikkel.slug}
                aria-hidden={clone || undefined}
              >
                <Link
                  href={`/artikler/${artikkel.slug}`}
                  tabIndex={clone ? -1 : undefined}
                >
                  <div className="ph">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artikkel.bilde}
                      alt={artikkel.bildeAlt}
                      loading="lazy"
                    />
                  </div>
                  <div className="bd">
                    <time>Sist oppdatert {artikkel.sistOppdatert}</time>
                    <h3>{artikkel.tittel}</h3>
                    <p>{artikkel.ingress}</p>
                    <span className="more">Les artikkelen</span>
                  </div>
                </Link>
              </article>
            ))
          }
        />
      </div>
    </section>
  );
}
