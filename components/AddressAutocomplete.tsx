"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { MapPin } from "lucide-react";
import type { AddressSearchResponse, SelectedAddress } from "@/lib/address/types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  ADRESSE-AUTOFULLFØRING
 * ───────────────────────────────────────────────────────────────────────────
 *  Kontrollert tekstfelt med forslag fra Kartverkets/Geonorges åpne adresse-API
 *  (via vår egen proxy `/api/address-search`). Slår opp når brukeren har skrevet
 *  minst tre tegn, med debounce. Håndterer tomme svar og feil rolig – ingen
 *  feilmeldinger dyttes på brukeren, listen skjules bare.
 *
 *  Ved valg fyller vi inn hele adressen og lar forelderen autofylle OMRÅDE fra
 *  poststed/kommune. Boligtype hentes ALDRI herfra.
 * ───────────────────────────────────────────────────────────────────────────
 */

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 250;

type Props = {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: SelectedAddress) => void;
  placeholder?: string;
  inputClassName?: string;
  invalid?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  /** Kalles ved Enter når ingen forslag er markert (f.eks. for å åpne kalkulatoren). */
  onEnter?: () => void;
};

export default function AddressAutocomplete({
  id,
  label,
  value,
  onChange,
  onSelect,
  placeholder,
  inputClassName,
  invalid = false,
  inputRef,
  onEnter,
}: Props) {
  const [suggestions, setSuggestions] = useState<SelectedAddress[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Settes til den valgte visningsadressen, slik at vi ikke slår opp på nytt
  // umiddelbart etter et valg (input === valgt tekst).
  const justSelectedRef = useRef<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Debouncet oppslag mot vår adresse-proxy.
  useEffect(() => {
    const query = value.trim();

    if (justSelectedRef.current === value) {
      // Nettopp valgt en adresse – ikke søk på nytt.
      return;
    }
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(
          `/api/address-search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("bad_response");
        const data = (await res.json()) as AddressSearchResponse;
        setSuggestions(data.results);
        setActiveIndex(-1);
        setOpen(data.results.length > 0);
      } catch {
        // Rolig håndtering: skjul listen, ikke vis feil.
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  // Lukk forslagslisten ved klikk utenfor.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelect = (address: SelectedAddress) => {
    justSelectedRef.current = address.displayAddress;
    onChange(address.displayAddress);
    onSelect(address);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (open && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        return;
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
    }
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink-900">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          justSelectedRef.current = null;
          onChange(e.target.value);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
        }
        aria-invalid={invalid}
        className={
          inputClassName ??
          `w-full rounded-xl border bg-sand-50 px-4 py-3 text-ink-900 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
            invalid ? "border-brand-500" : "border-sand-200"
          }`
        }
      />

      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-sand-200 bg-white py-1.5 shadow-soft ring-1 ring-ink-900/5"
        >
          {suggestions.map((address, i) => (
            <li key={`${address.addressId ?? address.displayAddress}-${i}`} role="none">
              <button
                type="button"
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  // Hindre at input mister fokus før klikket rekker å registreres.
                  e.preventDefault();
                  handleSelect(address);
                }}
                className={`flex w-full items-start gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                  i === activeIndex ? "bg-sand-100" : "hover:bg-sand-50"
                }`}
              >
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="text-ink-900">{address.displayAddress}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && value.trim().length >= MIN_QUERY_LENGTH && !open && (
        <p className="mt-2 text-xs text-ink-500">Søker etter adresser …</p>
      )}
    </div>
  );
}
