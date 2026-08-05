"use client";

import { useMemo, useState } from "react";
import { Check, Lock } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Diagonal bølge: øvre venstre → nedre høyre (7-kolonners rutenett).
const dayDelay = (i: number) => 0.25 + ((i % 7) + Math.floor(i / 7)) * 0.03;

const gridVariants: Variants = {
  hidden: {},
  show: {},
};

function makeDayVariants(reduce: boolean): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: (c: { i: number; glow: boolean }) => ({
        opacity: 1,
        transition: { delay: dayDelay(c.i) - 0.25, duration: 0.25 },
      }),
    };
  }
  return {
    hidden: { opacity: 0, scale: 0.6, y: 10 },
    show: (c: { i: number; glow: boolean }) => {
      const transition = {
        delay: dayDelay(c.i),
        duration: 0.45,
        ease: EASE,
      };
      if (c.glow) {
        // Svært svak, éngangs glød når mørke dager dukker opp (ingen loop).
        return {
          opacity: 1,
          scale: 1,
          y: 0,
          boxShadow: [
            "0 0 0 0 rgba(58,47,40,0)",
            "0 0 16px 2px rgba(58,47,40,0.4)",
            "0 1px 2px 0 rgba(36,28,24,0.1)",
          ],
          transition: {
            ...transition,
            boxShadow: {
              delay: dayDelay(c.i) + 0.1,
              duration: 1,
              times: [0, 0.5, 1],
            },
          },
        };
      }
      return { opacity: 1, scale: 1, y: 0, transition };
    },
  };
}

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  PRISING-KALENDER (ILLUSTRASJON)
 * ───────────────────────────────────────────────────────────────────────────
 *  Interaktiv illustrasjon av dynamisk prising. Klikk hvilken som helst dag for
 *  å se hva den kan gi (estimert nattpris ut fra verdinivå). De ledige (hvite)
 *  dagene kan i tillegg «holdes av» av eieren selv – en demo av at man kan
 *  reservere egne dager. Ingenting lagres eller sendes; «Illustrasjon»-merket
 *  beholdes tydelig slik at det ikke forveksles med et ekte bookingsystem.
 * ───────────────────────────────────────────────────────────────────────────
 */

const weekdayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const pricingDays = Array.from({ length: 30 }, (_, i) => i + 1);
const highValueDays = new Set([6, 7, 13, 14, 20, 21, 23, 27, 28]);
const lowValueDays = new Set([3, 4, 10, 11, 17, 18, 24, 25]);

const nok = (value: number) =>
  new Intl.NumberFormat("nb-NO").format(value) + " kr";

type DayInfo = {
  tier: string;
  hint: string;
  amount: number;
};

// Estimert nattpris ut fra verdinivå. Illustrative tall med litt variasjon per
// dag, slik at det føles ekte uten å være et faktisk prissystem.
function dayInfo(day: number): DayInfo {
  if (highValueDays.has(day)) {
    return {
      tier: "Høy verdi",
      hint: "helg / arrangement",
      amount: 1950 + (day % 3) * 90,
    };
  }
  if (lowValueDays.has(day)) {
    return {
      tier: "Lavere verdi",
      hint: "rolig periode",
      amount: 850 + (day % 3) * 45,
    };
  }
  return {
    tier: "Vanlig dag",
    hint: "ordinær pris",
    amount: 1250 + (day % 3) * 65,
  };
}

export default function PricingCalendar() {
  const reduce = useReducedMotion() ?? false;
  const dayVariants = useMemo(() => makeDayVariants(reduce), [reduce]);

  // Dager eieren har «holdt av» selv (kun i denne illustrasjonen).
  const [reserved, setReserved] = useState<Set<number>>(new Set());
  // Hvilken dag som er valgt/inspiseres (viser hva den kan gi).
  const [selected, setSelected] = useState<number | null>(null);

  const toggleReserved = (day: number) => {
    setReserved((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const selectedInfo = selected != null ? dayInfo(selected) : null;
  const selectedSelectable =
    selected != null &&
    !highValueDays.has(selected) &&
    !lowValueDays.has(selected);
  const selectedReserved = selected != null && reserved.has(selected);

  return (
    <div className="rounded-[1.75rem] border border-sand-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">Juni 2026</p>
        <span className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink-500">
          Eksempeldata
        </span>
      </div>

      <motion.div
        className="grid grid-cols-7 gap-1.5"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="pb-1 text-center text-[11px] font-medium text-ink-500"
          >
            {label}
          </div>
        ))}
        {pricingDays.map((day, idx) => {
          const high = highValueDays.has(day);
          const low = lowValueDays.has(day);
          const isReserved = reserved.has(day);
          const isSelected = selected === day;
          const info = dayInfo(day);

          // Fargenivå etter verdi; holdt-av-dager vises som brune med hake.
          const base = isReserved
            ? "bg-brand-600 text-sand-50"
            : high
              ? "bg-brand-600 text-sand-50 shadow-sm"
              : low
                ? "bg-sand-100 text-ink-500"
                : "border border-sand-200 bg-white text-ink-700 hover:border-brand-400 hover:bg-sand-50";

          return (
            <motion.button
              key={day}
              type="button"
              custom={{ i: idx, glow: high }}
              variants={dayVariants}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              onClick={() => setSelected((v) => (v === day ? null : day))}
              aria-pressed={isSelected}
              aria-label={`${day}. juni – ${info.tier}, estimert ${nok(
                info.amount,
              )} per natt${isReserved ? ", holdt av deg" : ""}`}
              className={`relative flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 ${base} ${
                isSelected ? "ring-2 ring-inset ring-ink-900/40" : ""
              }`}
            >
              {isReserved ? (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={
                    reduce
                      ? { duration: 0.2 }
                      : { type: "spring", stiffness: 400, damping: 16 }
                  }
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                </motion.span>
              ) : (
                day
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Info-panel: hva den valgte dagen kan gi + evt. hold av-knapp */}
      <AnimatePresence mode="wait" initial={false}>
        {selectedInfo ? (
          <motion.div
            key={`info-${selected}`}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-4 rounded-xl border border-sand-200 bg-sand-50 p-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-900">
                  {selected} juni · {selectedInfo.tier}
                </p>
                <p className="text-[11px] text-ink-500">{selectedInfo.hint}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-lg font-medium tracking-[-0.01em] text-brand-600">
                  {nok(selectedInfo.amount)}
                </p>
                <p className="text-[11px] text-ink-500">estimert per natt</p>
              </div>
            </div>

            {selectedSelectable && (
              <button
                type="button"
                onClick={() => toggleReserved(selected!)}
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  selectedReserved
                    ? "bg-brand-600 text-sand-50 hover:bg-brand-700"
                    : "border border-sand-200 bg-white text-ink-900 hover:border-brand-400"
                }`}
              >
                <Lock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                {selectedReserved
                  ? "Frigi dagen"
                  : "Hold av dagen til egen bruk"}
              </button>
            )}
          </motion.div>
        ) : (
          <motion.p
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mt-4 text-[11px] leading-relaxed text-ink-500"
          >
            Klikk en dag for å se hva den kan gi. Ledige (hvite) dager kan du
            også holde av til egen bruk.
          </motion.p>
        )}
      </AnimatePresence>

      {reserved.size > 0 && (
        <p className="mt-2.5 text-[11px] leading-relaxed text-ink-500">
          <span className="font-semibold text-ink-700">
            {reserved.size} {reserved.size === 1 ? "dag holdt av" : "dager holdt av"}
          </span>{" "}
          til egen bruk.
        </p>
      )}
    </div>
  );
}
