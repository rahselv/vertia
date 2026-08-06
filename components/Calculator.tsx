"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  bedroomOptions,
  calculateIncome,
  calculatorConfig,
  formatNok,
  type AreaKey,
  type PropertyType,
} from "@/lib/calculatorConfig";
import { useContactModal } from "@/components/ContactModalProvider";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { mapMunicipalityToArea } from "@/lib/address/map-area";
import type { SelectedAddress } from "@/lib/address/types";

// Lead-skjemaet sender til samme Formspree-endepunkt som kontaktskjemaet.
const ESTIMATE_ENDPOINT = "https://formspree.io/f/mkolabzy";

const areaEntries = Object.entries(calculatorConfig.areaLabel) as [
  AreaKey,
  string,
][];

const propertyEntries = Object.entries(calculatorConfig.propertyTypeLabel) as [
  PropertyType,
  string,
][];

type CalculatorVariant = "section" | "hero";

export default function Calculator({
  variant = "section",
}: {
  variant?: CalculatorVariant;
}) {
  const { open } = useContactModal();
  const [area, setArea] = useState<AreaKey>("oslo");
  const [propertyType, setPropertyType] = useState<PropertyType>("leilighet");
  const [bedrooms, setBedrooms] = useState<number>(
    calculatorConfig.bedrooms.default,
  );
  const [nights, setNights] = useState<number>(calculatorConfig.nights.default);
  const [address, setAddress] = useState<string>("");

  // Seksjon-varianten er et lead-skjema: adresse + e-post. Vi viser ingen
  // beregnede tall i frontend – eieren får et konkret estimat fra oss.
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleEstimateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(ESTIMATE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          address,
          _subject: "Estimatforespørsel fra vertia.no",
        }),
      });
      if (!res.ok) throw new Error("Innsending feilet");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Lagrer adressen lokalt i nettleseren slik at den kan sendes med
  // tilbudsforespørselen lenger nede.
  function handleAddressChange(value: string) {
    setAddress(value);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("vertia_address", value);
    }
  }

  // Når en adresse velges fra Kartverket-forslagene: lagre adressen og autofyll
  // OMRÅDE fra kommunen. Boligtype forblir et manuelt valg (kan ikke utledes).
  function handleAddressSelect(selected: SelectedAddress) {
    handleAddressChange(selected.displayAddress);
    setArea(mapMunicipalityToArea(selected.municipalityName));
  }

  // Regner ut på nytt automatisk hver gang en verdi endres (live).
  const result = useMemo(
    () => calculateIncome({ area, propertyType, bedrooms, nights }),
    [area, propertyType, bedrooms, nights],
  );

  const commissionPct = Math.round(result.commission * 100);
  // Anslått månedlig utbetaling – ren presentasjon av nettoinntekten.
  const monthlyPayout = Math.round(result.netIncome / 12);

  // ── Adressefelt (valgfritt) – gjenbrukes av begge variantene ──────────────
  const addressField = (
    <AddressAutocomplete
      id="calc-address"
      label={
        <>
          Adresse <span className="font-normal text-ink-700">(valgfritt)</span>
        </>
      }
      value={address}
      onChange={handleAddressChange}
      onSelect={handleAddressSelect}
      placeholder="F.eks. Storgata 1, 0155 Oslo"
    />
  );

  // ── Feltkontrollene for det interaktive estimatet ─────────────────────────
  const fields = (
    <>
      {/* Område */}
      <div>
        <label
          htmlFor="calc-area"
          className="mb-2 block text-sm font-semibold text-ink-900"
        >
          Område
        </label>
        <select
          id="calc-area"
          value={area}
          onChange={(e) => setArea(e.target.value as AreaKey)}
          className="w-full rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-ink-900 transition focus:border-brand-500"
        >
          {areaEntries.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Boligtype */}
      <div>
        <span className="mb-2 block text-sm font-semibold text-ink-900">
          Boligtype
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {propertyEntries.map(([key, label]) => {
            const active = propertyType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPropertyType(key)}
                aria-pressed={active}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-sand-200 bg-sand-50 text-ink-700 hover:border-brand-500"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Soverom */}
      <div>
        <label
          htmlFor="bedrooms"
          className="mb-2 block text-sm font-semibold text-ink-900"
        >
          Antall soverom
        </label>
        <select
          id="bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(Number(e.target.value))}
          className="w-full rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-ink-900 transition focus:border-brand-500"
        >
          {bedroomOptions.map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "soverom" : "soverom"}
            </option>
          ))}
        </select>
      </div>

      {/* Netter per år */}
      <div>
        <label
          htmlFor="nights"
          className="mb-2 flex items-center justify-between text-sm font-semibold text-ink-900"
        >
          <span>Netter tilgjengelig for utleie per år</span>
          <span className="text-brand-600">{nights} netter</span>
        </label>
        <input
          id="nights"
          type="range"
          min={calculatorConfig.nights.min}
          max={calculatorConfig.nights.max}
          step={calculatorConfig.nights.step}
          value={nights}
          onChange={(e) => setNights(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-700">
          <span>{calculatorConfig.nights.min}</span>
          <span>{calculatorConfig.nights.max}</span>
        </div>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────
  //  HERO-VARIANT: kun det interaktive kortet, lyst og kompakt, til høyre i
  //  heroen. Ingen seksjons-wrapper eller monumental overskrift.
  // ─────────────────────────────────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <div
        id="kalkulator"
        className="rounded-3xl border border-white/60 bg-sand-50/95 p-6 shadow-soft ring-1 ring-ink-900/5 backdrop-blur-sm sm:p-8"
      >
        <div className="mb-6">
          <p className="eyebrow mb-2.5">Inntektsestimat</p>
          <h2 className="font-display text-[1.6rem] font-medium leading-[1.1] tracking-[-0.02em] text-ink-900 sm:text-[1.85rem]">
            Hva kan boligen din tjene?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Juster valgene, så oppdateres tallene mens du endrer.
          </p>
        </div>

        <div className="space-y-5">
          {addressField}
          {fields}
        </div>

        {/* Live-resultat: brutto, netto og månedlig utbetaling */}
        <div className="mt-7 overflow-hidden rounded-2xl border border-sand-200 bg-white">
          <div className="flex items-center justify-between px-5 py-3.5 text-sm">
            <span className="text-ink-500">Estimert bruttoinntekt / år</span>
            <span className="font-semibold tracking-tight text-ink-900">
              {formatNok(result.grossIncome)}
            </span>
          </div>
          <div className="flex items-end justify-between gap-4 bg-brand-600 px-5 py-5 text-sand-50">
            <div>
              <p className="text-xs font-medium text-sand-50/75">
                Din netto etter provisjon ({commissionPct} %)
              </p>
              <p className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-[2.45rem]">
                {formatNok(result.netIncome)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium text-sand-50/75">
                Utbetaling / mnd
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                {formatNok(monthlyPayout)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => open()}
          className="btn-primary group mt-5 w-full"
        >
          Få et tilbud
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2.25}
          />
        </button>

        <p className="mt-4 text-center text-xs leading-relaxed text-ink-500">
          Estimat, ikke garanti. Snittpris {formatNok(result.adr)}/døgn ·{" "}
          {Math.round(result.occupancy * 100)} % belegg. Vi gir et mer presist
          anslag etter en kort prat.
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  SEKSJON-VARIANT (standard): kalkulatoren er GATET bak adressen. Først
  //  vises kun overskrift, undertekst, ett adressefelt og en «Beregn inntekt»-
  //  pille. Når adressen er fylt inn og knappen trykkes, åpner den fulle
  //  to-kolonne-kalkulatoren seg med en myk innfading.
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section id="kalkulator" className="section bg-sand-50">
      <div className="container-page">
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">Inntektsestimat</p>
            <h2 className="section-title max-w-xl">Hva kan boligen din tjene?</h2>
          </div>
          <p className="text-lg leading-relaxed text-ink-500 lg:col-span-5 lg:pb-2">
            Legg igjen adresse og e-post, så regner vi på nettopp din bolig og
            sender deg et konkret inntektsestimat.
          </p>
        </div>

        <div className="mt-16 max-w-xl border border-sand-200 bg-white p-7 sm:p-9">
          {status === "success" ? (
            <div className="py-6 text-center" role="status" aria-live="polite">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-sand-50">
                <ArrowRight className="h-6 w-6 -rotate-45" strokeWidth={2.25} />
              </span>
              <h3 className="mt-5 font-display text-xl font-medium text-ink-900">
                Takk – estimatet er på vei
              </h3>
              <p className="mt-2 text-ink-500">
                Vi har mottatt adressen din og sender deg et konkret
                inntektsestimat innen 24 timer.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleEstimateSubmit}
              className="space-y-5"
              noValidate
            >
              <AddressAutocomplete
                id="calc-address"
                label="Adresse"
                value={address}
                onChange={handleAddressChange}
                onSelect={handleAddressSelect}
                placeholder="F.eks. Storgata 1, 0155 Oslo"
              />

              <div>
                <label
                  htmlFor="calc-email"
                  className="mb-2 block text-sm font-semibold text-ink-900"
                >
                  E-post
                </label>
                <input
                  id="calc-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@epost.no"
                  className="w-full rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-ink-900 transition focus:border-brand-500"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600" role="alert">
                  Noe gikk galt under sendingen. Prøv igjen, eller ta kontakt på
                  e-post.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary group w-full disabled:opacity-60"
              >
                {status === "submitting" ? "Sender …" : "Få estimat"}
                {status !== "submitting" && (
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.25}
                  />
                )}
              </button>

              <p className="text-center text-sm text-ink-500">
                Du får et konkret estimat fra oss innen 24 timer.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
