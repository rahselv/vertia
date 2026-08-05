"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FileBarChart, Info, X } from "lucide-react";

type Booking = {
  guest: string;
  dates: string;
  nights: number;
  amount: number;
};

const bookings: Booking[] = [
  { guest: "Oslo", dates: "1.–6. juni", nights: 5, amount: 9200 },
  { guest: "Bergen", dates: "8.–10. juni", nights: 2, amount: 4200 },
  { guest: "Tromsø", dates: "12.–16. juni", nights: 4, amount: 9200 },
  { guest: "Trondheim", dates: "18.–22. juni", nights: 4, amount: 8100 },
  { guest: "Stavanger", dates: "24.–30. juni", nights: 6, amount: 7500 },
];

// Illustrativt søylediagram: utbetaling siste seks måneder. Jun er fremhevet.
// Beløpene er skalert til høyden, med juni lik faktisk utbetaling (30 800).
const payoutBars: {
  month: string;
  height: number;
  amount: number;
  current?: boolean;
}[] = [
  { month: "Jan", height: 52, amount: 16700 },
  { month: "Feb", height: 44, amount: 14200 },
  { month: "Mar", height: 63, amount: 20200 },
  { month: "Apr", height: 71, amount: 22800 },
  { month: "Mai", height: 80, amount: 25600 },
  { month: "Jun", height: 96, amount: 30800, current: true },
];

const grossIncome = bookings.reduce((sum, b) => sum + b.amount, 0); // 38 200
const cleaningCost = 3200;
const vertiaFee = 3000; // provisjon
const totalCosts = cleaningCost + vertiaFee; // 6 200
export const netPayout = grossIncome - totalCosts; // 30 800
const bookedNights = bookings.reduce((sum, b) => sum + b.nights, 0); // 21
const occupancy = Math.round((bookedNights / 30) * 100); // 70 %
const avgNightlyRate = Math.round(grossIncome / bookedNights); // ~1 819

const nok = (value: number) =>
  new Intl.NumberFormat("nb-NO").format(value) + " kr";

export default function SampleReportModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Hvilken måned i søylediagrammet som vises (hover/klikk).
  const [activeBar, setActiveBar] = useState<string | null>(null);
  // Hvilket nøkkeltall som har en åpen forklaring (Bruttoinntekt / Kostnader).
  const [activeInfo, setActiveInfo] = useState<"gross" | "costs" | null>(null);

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
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-soft"
      >
        <FileBarChart className="h-4 w-4" strokeWidth={2} />
        Se full eierrapport her
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-900/50 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Månedlig eierrapport"
          >
            <div
              className="my-auto w-full max-w-2xl animate-fade-up overflow-hidden rounded-[2rem] bg-sand-50 shadow-soft"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Topp */}
              <div className="relative bg-brand-600 px-7 py-7 text-sand-50 sm:px-9">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Lukk"
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-sand-50/10 text-sand-50/90 transition hover:bg-sand-50/20 hover:text-sand-50"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
                <h2
                  className="font-display text-2xl font-medium leading-tight tracking-[-0.02em] !text-sand-50 sm:text-3xl"
                  style={{ color: "#FBF8F3" }}
                >
                  Månedlig eierrapport
                </h2>
                <p className="mt-1.5 text-sm text-sand-50/70">
                  Fjellveien 12 · 2 soverom · Vertia-forvaltning
                </p>
              </div>

              <div className="px-7 py-7 sm:px-9 sm:py-8">
                {/* Oppsummering. Bruttoinntekt og Kostnader er klikkbare og
                    viser en kort forklaring over kortet. */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="relative">
                    {activeInfo === "gross" && (
                      <div
                        role="tooltip"
                        className="absolute bottom-full left-0 right-0 z-10 mb-2 rounded-xl bg-ink-900 px-3.5 py-2.5 text-xs leading-relaxed text-sand-50 shadow-soft"
                      >
                        Bruttoinntekt er summen gjestene har betalt for oppholdene
                        denne måneden, før vask, forbruk og provisjon trekkes fra.
                        <span className="absolute left-6 top-full -mt-1 h-2 w-2 rotate-45 bg-ink-900" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveInfo((v) => (v === "gross" ? null : "gross"))
                      }
                      aria-expanded={activeInfo === "gross"}
                      className={`flex w-full flex-col rounded-2xl border bg-white p-4 text-left shadow-soft transition hover:border-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                        activeInfo === "gross" ? "border-brand-500" : "border-sand-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
                        Bruttoinntekt
                        <Info className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                      </span>
                      <span className="mt-1 font-display text-xl font-medium text-ink-900">
                        {nok(grossIncome)}
                      </span>
                    </button>
                  </div>
                  <div className="relative">
                    {activeInfo === "costs" && (
                      <div
                        role="tooltip"
                        className="absolute bottom-full left-0 right-0 z-10 mb-2 rounded-xl bg-ink-900 px-3.5 py-2.5 text-xs leading-relaxed text-sand-50 shadow-soft"
                      >
                        Kostnader er det som trekkes fra bruttoinntekten: vask
                        mellom opphold og Vertias provisjon.
                        <span className="absolute left-6 top-full -mt-1 h-2 w-2 rotate-45 bg-ink-900" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveInfo((v) => (v === "costs" ? null : "costs"))
                      }
                      aria-expanded={activeInfo === "costs"}
                      className={`flex w-full flex-col rounded-2xl border bg-white p-4 text-left shadow-soft transition hover:border-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                        activeInfo === "costs" ? "border-brand-500" : "border-sand-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
                        Kostnader
                        <Info className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                      </span>
                      <span className="mt-1 font-display text-xl font-medium text-ink-900">
                        −{nok(totalCosts)}
                      </span>
                    </button>
                  </div>
                  <div className="rounded-2xl bg-brand-600 p-4 text-sand-50 shadow-card">
                    <p className="text-xs font-medium text-sand-50/70">
                      Din utbetaling
                    </p>
                    <p className="mt-1 font-display text-xl font-medium">
                      {nok(netPayout)}
                    </p>
                  </div>
                </div>

                {/* Søylediagram: utbetaling siste seks måneder */}
                <div className="mt-8 rounded-2xl border border-sand-200 bg-white p-5 shadow-soft sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Utbetaling siste seks måneder
                    </p>
                    <p className="text-xs text-ink-500">
                      Trykk på en søyle for tall
                    </p>
                  </div>
                  <div className="mt-5 flex h-36 items-stretch gap-3 sm:gap-4">
                    {payoutBars.map(({ month, height, amount, current }) => {
                      const active = activeBar === month;
                      return (
                        <button
                          key={month}
                          type="button"
                          onClick={() =>
                            setActiveBar((v) => (v === month ? null : month))
                          }
                          onMouseEnter={() => setActiveBar(month)}
                          onMouseLeave={() =>
                            setActiveBar((v) => (v === month ? null : v))
                          }
                          onFocus={() => setActiveBar(month)}
                          aria-label={`${month}: ${nok(amount)}`}
                          aria-pressed={active}
                          className="group flex h-full flex-1 flex-col items-center gap-2.5 focus:outline-none"
                        >
                          {/* Tall-boble over søylen når den er aktiv */}
                          <span
                            className={`rounded-md bg-ink-900 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-sand-50 shadow-soft transition-opacity ${
                              active ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {nok(amount)}
                          </span>
                          {/* Fleksibel track gir søylen en konkret høyde å regne %-en mot */}
                          <span className="flex w-full flex-1 items-end">
                            <span
                              className={`w-full rounded-t-xl transition-colors ${
                                current
                                  ? "bg-brand-600"
                                  : active
                                    ? "bg-brand-400"
                                    : "bg-sand-200 group-hover:bg-brand-100"
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              current || active ? "text-ink-900" : "text-ink-500"
                            }`}
                          >
                            {month}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bookinger */}
                <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink-700">
                  Bookinger
                </h3>
                <div className="mt-3 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-soft">
                  {bookings.map((b, i) => (
                    <div
                      key={b.dates}
                      className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
                        i !== 0 ? "border-t border-sand-200" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900">
                          {b.dates}
                        </p>
                        <p className="text-xs text-ink-500">
                          {b.nights} netter
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-ink-900">
                        {nok(b.amount)}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-sand-200 bg-sand-50 px-5 py-3.5">
                    <p className="text-sm font-semibold text-ink-700">
                      Sum bruttoinntekt
                    </p>
                    <p className="text-sm font-bold text-ink-900">
                      {nok(grossIncome)}
                    </p>
                  </div>
                </div>

                {/* Kostnader */}
                <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink-700">
                  Kostnader
                </h3>
                <div className="mt-3 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-soft">
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <p className="text-sm text-ink-700">Vask mellom opphold</p>
                    <p className="text-sm font-medium text-ink-900">
                      −{nok(cleaningCost)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-sand-200 px-5 py-3.5">
                    <p className="text-sm text-ink-700">Provisjon (Vertia)</p>
                    <p className="text-sm font-medium text-ink-900">
                      −{nok(vertiaFee)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-sand-200 bg-sand-50 px-5 py-3.5">
                    <p className="text-sm font-semibold text-ink-700">
                      Sum kostnader
                    </p>
                    <p className="text-sm font-bold text-ink-900">
                      −{nok(totalCosts)}
                    </p>
                  </div>
                </div>

                {/* Belegg / snittpris */}
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-sand-200 bg-sand-100 p-4">
                    <p className="text-xs font-medium text-ink-500">Belegg</p>
                    <p className="mt-1 font-display text-xl font-medium text-ink-900">
                      {occupancy} %
                    </p>
                    <p className="text-xs text-ink-500">{bookedNights} av 30 netter</p>
                  </div>
                  <div className="rounded-2xl border border-sand-200 bg-sand-100 p-4">
                    <p className="text-xs font-medium text-ink-500">Snittpris</p>
                    <p className="mt-1 font-display text-xl font-medium text-ink-900">
                      {nok(avgNightlyRate)}
                    </p>
                    <p className="text-xs text-ink-500">per natt</p>
                  </div>
                  <div className="rounded-2xl border border-sand-200 bg-sand-100 p-4">
                    <p className="text-xs font-medium text-ink-500">Bookinger</p>
                    <p className="mt-1 font-display text-xl font-medium text-ink-900">
                      {bookings.length}
                    </p>
                    <p className="text-xs text-ink-500">denne måneden</p>
                  </div>
                </div>

                <p className="mt-7 text-xs leading-relaxed text-ink-500">
                  Tallene i denne rapporten er illustrative og brukt for å vise
                  hvordan en månedlig eierrapport fra Vertia ser ut. Din faktiske
                  rapport bygger på reelle bookinger og kostnader for din bolig.
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
