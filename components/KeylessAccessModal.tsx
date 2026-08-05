"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { KeyRound, Lock, ShieldCheck, X, type LucideIcon } from "lucide-react";

type Detail = {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
};

const details: Detail[] = [
  {
    icon: KeyRound,
    label: "Standard på hytter og boliger",
    title: "Igloohome Smart Keybox 3",
    text: "En låst boks med nøkkelen inni, montert ved døren. Koden til boksen lages for hvert opphold, og boksen trenger verken strøm eller internett for å virke. Ingen inngrep i døren din.",
  },
  {
    icon: Lock,
    label: "Oppgradering for boliger",
    title: "Yale Doorman kodelås",
    text: "For deg som vil ha kodelåsen i selve døren. Gjesten taster seg rett inn, og døren låser seg selv bak dem. Vi vurderer sammen med deg om døren passer.",
  },
  {
    icon: ShieldCheck,
    label: "Din nøkkel",
    title: "Reservenøkkel og kvittering",
    text: "En reservenøkkel oppbevares forsvarlig hos Vertia, og du får kvittering på den. Sier du opp avtalen, får du alt tilbake.",
  },
];

/**
 * Lettvekts «les mer»-modal for nøkkelfri tilgang. Lukket som standard og
 * rendres i en portal, så den tar ingen plass i tjenestekortet.
 */
export default function KeylessAccessModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="mt-4 self-start rounded-full text-sm font-semibold text-brand-600 underline decoration-sand-300 underline-offset-4 transition-colors duration-300 hover:text-brand-700 hover:decoration-brand-400"
      >
        Les mer om nøkkelfri tilgang
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-900/50 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Nøkkelfri tilgang"
          >
            <div
              className="my-auto w-full max-w-xl animate-fade-up overflow-hidden rounded-[2rem] bg-sand-50 shadow-soft"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-brand-600 px-7 py-7 text-sand-50 sm:px-9 sm:py-8">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Lukk"
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-sand-50/10 text-sand-50/90 transition hover:bg-sand-50/20 hover:text-sand-50"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
                <span className="inline-flex rounded-full bg-sand-50/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sand-50/80">
                  Trygg tilgang
                </span>
                <h2 className="mt-4 font-display text-2xl font-medium leading-tight tracking-[-0.02em] sm:text-3xl">
                  Du leverer nøkkelen én gang
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-sand-50/75">
                  Resten er koder. Hver gjest får sin egen engangskode som
                  virker fra innsjekk til utsjekk, og slutter å virke etterpå.
                </p>
              </div>

              <div className="space-y-3 px-7 py-7 sm:px-9 sm:py-8">
                {details.map(({ icon: Icon, label, title, text }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-sand-200 bg-white p-5 shadow-soft"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand-100 text-brand-600">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                          {label}
                        </p>
                        <h3 className="mt-1 font-display text-base font-medium text-ink-900">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3.5 text-sm leading-relaxed text-ink-500">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
