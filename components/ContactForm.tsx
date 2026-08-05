"use client";

import { useState } from "react";
import Link from "next/link";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mkolabzy";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data: Record<string, FormDataEntryValue> = Object.fromEntries(
      new FormData(form).entries(),
    );

    // Ta med adressen fra kalkulatoren hvis den finnes (gjør leaden mer nyttig).
    const savedAddress =
      typeof window !== "undefined"
        ? sessionStorage.getItem("vertia_address")
        : null;
    if (savedAddress) data.address = savedAddress;

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Forespørselen feilet");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-8 text-center" role="status" aria-live="polite">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
            <path
              d="m5 13 4 4 10-10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="mt-5 text-xl font-semibold text-ink-900">
          Takk – vi tar kontakt snart
        </h3>
        <p className="mt-2 text-ink-700">
          Vi har mottatt henvendelsen din og svarer deg innen 24 timer.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-secondary mt-6"
        >
          Send en ny henvendelse
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Navn" name="name" type="text" autoComplete="name" required />

      <Field
        label="E-post"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <Field
        label="Telefon"
        name="phone"
        type="tel"
        autoComplete="tel"
        required
      />

      {/* Samtykke – IKKE forhåndskrysset. Påkrevd etter markedsføringsloven § 15. */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-sand-50 p-4 text-sm leading-relaxed text-ink-700">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-5 w-5 flex-none rounded border-sand-200 accent-brand-600"
        />
        <span>
          Jeg samtykker til å bli kontaktet om tjenesten. Se hvordan vi behandler
          opplysningene i{" "}
          <Link
            href="/personvern"
            className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
          >
            personvernerklæringen
          </Link>
          .
        </span>
      </label>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          Noe gikk galt under sendingen. Prøv igjen, eller ta kontakt på e-post.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Sender …" : "Send henvendelse"}
      </button>

      <p className="text-center text-xs text-ink-700">
        Vi svarer på henvendelsen din innen 24 timer.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-ink-900"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-ink-900 transition focus:border-brand-500"
      />
    </div>
  );
}
