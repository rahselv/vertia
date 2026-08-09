"use client";

import { useState } from "react";
import ArrowIcon from "./ArrowIcon";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { submitToFormspree } from "@/lib/formspree";
import type { SelectedAddress } from "@/lib/address/types";

/**
 * Inntektsestimat-skjemaet i v2.
 *
 * Designet har et rent tekstfelt for adresse. Vi beholder i stedet
 * AddressAutocomplete med oppslag mot Kartverket via /api/address-search –
 * ekte funksjonalitet foran designtro kopi. Feltet arver `.lf`-stilene fra
 * v2-CSS-en fordi label og input ligger som etterkommere av `.lf`; vi sender
 * inn en tom `inputClassName` for å slå av Tailwind-standarden i komponenten.
 *
 * Innsending går til Formspree, som i v1.
 */
export default function CalculatorV2() {
  const [address, setAddress] = useState("");
  const [municipality, setMunicipality] = useState<string | undefined>();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  function handleAddressSelect(selected: SelectedAddress) {
    setAddress(selected.displayAddress);
    setMunicipality(selected.municipalityName);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim().includes("@")) return;

    setStatus("submitting");
    try {
      await submitToFormspree({
        email,
        address,
        municipality,
        _subject: "Estimatforespørsel fra vertia.no",
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      className="section"
      id="kalkulator"
      style={{ background: "var(--sand-100)" }}
    >
      <div className="wrap calc-grid">
        <div className="calc-copy rv">
          <h2 className="sec-title">
            Hva kan boligen din <em>tjene?</em>
          </h2>
          <p className="sec-lead">
            Legg igjen adresse og e-post, så regner vi på nettopp din bolig og
            sender deg et konkret inntektsestimat.
          </p>
        </div>

        {status === "success" ? (
          <div className="calc rv" style={{ transitionDelay: ".15s" }}>
            <div className="calc-top">
              <h3>Takk, estimatet er på vei</h3>
              <span>Innen 24 timer</span>
            </div>
            <p className="form-ok" role="status">
              Vi har mottatt adressen din og sender deg et konkret
              inntektsestimat innen 24 timer.
            </p>
          </div>
        ) : (
          <form
            className="calc rv"
            style={{ transitionDelay: ".15s" }}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="calc-top">
              <h3>Få et konkret estimat</h3>
              <span>Innen 24 timer</span>
            </div>

            <div className="lf">
              <AddressAutocomplete
                id="est-addr"
                label="Adresse"
                value={address}
                onChange={setAddress}
                onSelect={handleAddressSelect}
                placeholder="F.eks. Storgata 1, 0155 Oslo"
                inputClassName=""
              />

              <label htmlFor="est-email">E-post</label>
              <input
                id="est-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="navn@epost.no"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 30 }}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sender …" : "Få estimat"}
              <ArrowIcon />
            </button>

            {status === "error" && (
              <p className="form-err" role="alert">
                Noe gikk galt ved innsending. Prøv igjen, eller send oss en
                e-post på post@vertia.no.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
