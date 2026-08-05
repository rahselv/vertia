"use client";

import { useState } from "react";

export type MiniBar = {
  month: string;
  value: number;
  amount: number;
  highlight?: boolean;
};

const nok = (value: number) =>
  new Intl.NumberFormat("nb-NO").format(value) + " kr";

/**
 * Liten interaktiv søylegraf i eksempel-rapporten på forsiden. Hver søyle kan
 * klikkes/hovres og viser da beløpet for den måneden i en boble over søylen.
 */
export default function ReportMiniChart({ bars }: { bars: MiniBar[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex h-24 items-stretch justify-between gap-2.5">
      {bars.map((bar) => {
        const isActive = active === bar.month;
        return (
          <button
            key={bar.month}
            type="button"
            onClick={() =>
              setActive((v) => (v === bar.month ? null : bar.month))
            }
            onMouseEnter={() => setActive(bar.month)}
            onMouseLeave={() => setActive((v) => (v === bar.month ? null : v))}
            onFocus={() => setActive(bar.month)}
            aria-label={`${bar.month}: ${nok(bar.amount)}`}
            aria-pressed={isActive}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5 focus:outline-none"
          >
            {/* Tall-boble over søylen når den er aktiv */}
            <span
              className={`rounded-md bg-ink-900 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white shadow-soft transition-opacity ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              {nok(bar.amount)}
            </span>
            <span className="flex w-full flex-1 items-end">
              <span
                className={`w-full rounded-t-md transition-colors ${
                  bar.highlight
                    ? "bg-brand-600"
                    : isActive
                      ? "bg-brand-400"
                      : "bg-brand-100 group-hover:bg-brand-200"
                }`}
                style={{ height: `${bar.value}%` }}
              />
            </span>
            <span
              className={`text-[11px] ${
                bar.highlight || isActive
                  ? "font-semibold text-brand-600"
                  : "text-ink-500"
              }`}
            >
              {bar.month}
            </span>
          </button>
        );
      })}
    </div>
  );
}
