"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { startupItems as items } from "@/lib/startupPackage";

export default function StartupPackageModal() {
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
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-brand-600 underline decoration-sand-300 underline-offset-4 transition-colors duration-300 hover:text-brand-700 hover:decoration-brand-400"
      >
        Les mer om oppstartpakken
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-900/50 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Hva oppstartpakken inneholder"
          >
            <div
              className="my-auto w-full max-w-2xl animate-fade-up overflow-hidden rounded-[2rem] bg-sand-50 shadow-soft"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Topp */}
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
                  Oppstart per bolig
                </span>
                <h2 className="mt-4 font-display text-2xl font-medium leading-tight tracking-[-0.02em] sm:text-3xl">
                  Oppstartpakken
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-sand-50/75">
                  Alt som skal til for å gjøre boligen klar for utleie, gjort
                  ferdig av oss. Du slipper å sette deg inn i noe, og kan lene
                  deg tilbake mens vi rigger alt på plass.
                </p>
              </div>

              <div className="px-7 py-7 sm:px-9 sm:py-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map(({ icon: Icon, title, description }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-sand-200 bg-white p-5 shadow-soft"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-brand-600">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <h3 className="mt-4 font-display text-base font-medium text-ink-900">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pris */}
                <div className="mt-6 rounded-2xl bg-brand-600 px-6 py-5 text-sand-50 shadow-card">
                  <p className="text-xs font-medium uppercase tracking-wide text-sand-50/70">
                    Pris
                  </p>
                  <p className="mt-1 font-display text-2xl font-medium tracking-[-0.02em]">
                    5 000 kr per bolig
                  </p>
                </div>

                <p className="mt-5 text-xs leading-relaxed text-ink-500">
                  Endelig pris avhenger av boligen og hva den trenger for å bli
                  gjesteklar. Vi gir deg et tydelig tilbud før vi setter i gang,
                  uten skjulte kostnader.
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
