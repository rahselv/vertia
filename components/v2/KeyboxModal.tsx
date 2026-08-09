"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

const points = [
  "Virker uten strøm og internett, avgjørende på hytta",
  "Ingen inngrep i døren din",
  "Unik engangskode per gjest, laget automatisk fra bookingen",
  "Reservenøkkel oppbevares forsvarlig hos Vertia, med kvittering",
];

/**
 * «Les om låsen vi bruker»-modalen fra steg 3.
 *
 * Modalen rendres i en portal, ikke der knappen står. Grunnen er at `.rv`-
 * elementene har `transform: translateY(...)` før de avdekkes, og en transform
 * på en forelder gjør at `position: fixed` på overlayet ville festet seg til
 * steget i stedet for viewporten.
 *
 * Portal-verten får klassen `vertia-v2`, ellers havner modalen utenfor scopet
 * vårt og mister all styling.
 */
export default function KeyboxModal() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.createElement("div");
    el.className = "vertia-v2";
    document.body.appendChild(el);
    setHost(el);
    return () => el.remove();
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    // Vent ut fade-outen (.28s i CSS) før vi tar elementet ut av DOM.
    window.setTimeout(() => setMounted(false), 280);
  }, []);

  // Fade inn først etter at elementet faktisk er i DOM, ellers hopper den rett
  // til synlig uten overgang.
  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mounted, close]);

  return (
    <>
      <button type="button" className="kb-btn" onClick={() => setMounted(true)}>
        Les om låsen vi bruker
      </button>

      {host &&
        mounted &&
        createPortal(
          <div
            className={visible ? "kb-overlay open" : "kb-overlay"}
            role="dialog"
            aria-modal="true"
            aria-labelledby="kb-title"
          >
            <div className="kb-backdrop" onClick={close} />
            <div className="kb-panel">
              <button
                type="button"
                className="kb-x"
                onClick={close}
                aria-label="Lukk"
              >
                ×
              </button>

              <div className="kb-grid">
                {/* Produktbildet er en utklippet PNG med gjennomsiktig
                    bakgrunn og nesten kvadratisk. Ruta er 4:5, og bildet
                    skaleres med `contain` mot sandflaten så ingenting av
                    produktet beskjæres. */}
                <div className="kb-photo" style={{ aspectRatio: "4/5" }}>
                  <Image
                    src="/images/keybox.png"
                    width={1571}
                    height={1475}
                    sizes="(min-width: 620px) 260px, 90vw"
                    alt="Igloohome Smart Keybox 3, sett forfra og bakfra"
                  />
                </div>

                <div>
                  <p className="kb-label">Standard på alle enheter</p>
                  <h3 className="kb-title" id="kb-title">
                    Igloohome Smart Keybox 3
                  </h3>
                  <p className="kb-body">
                    En låst boks med nøkkelen inni, montert ved døren. Koden
                    lages for hvert enkelt opphold, og slutter å virke ved
                    utsjekk.
                  </p>
                  <ul className="kb-list">
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="kb-chip">
                <p className="kb-code" style={{ marginTop: 0 }}>
                  4 8 3 1 9 2
                </p>
                <p className="kb-valid">
                  Gyldig fre 14. aug kl. 16 til søn 16. aug kl. 11
                </p>
              </div>
            </div>
          </div>,
          host,
        )}
    </>
  );
}
