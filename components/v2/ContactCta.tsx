"use client";

import { useState } from "react";
import ArrowIcon from "./ArrowIcon";
import { submitToFormspree } from "@/lib/formspree";

/**
 * Kontakt-seksjonen nederst. I v1 var dette en knapp som åpnet en modal
 * (ContactModalProvider); i v2 ligger skjemaet rett i seksjonen.
 *
 * Designet hadde et demo-skjema som bare byttet ut sin egen HTML. Her går
 * innsendingen til Formspree, som i resten av siden.
 */
export default function ContactCtaV2() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim().includes("@")) return;

    setStatus("submitting");
    try {
      await submitToFormspree({
        email,
        phone,
        _subject: "Tilbudsforespørsel fra vertia.no",
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section cta" id="kontakt">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="bgimg"
        src="/vertia-forsidebilde.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="ov" />
      <div className="grain" aria-hidden="true" />

      <div className="wrap in">
        <h2 className="rv" style={{ transitionDelay: ".1s" }}>
          La oss regne på <em>akkurat din</em> bolig
        </h2>
        <p className="ld rv" style={{ transitionDelay: ".2s" }}>
          Legg igjen kontaktinfo, så hører du fra oss innen kort tid.
        </p>

        {status === "success" ? (
          <p className="form-ok rv in" role="status">
            <strong>Takk!</strong> Vi har mottatt henvendelsen din og tar kontakt
            innen 24 timer.
          </p>
        ) : (
          <form
            className="cta-form rv"
            style={{ transitionDelay: ".3s" }}
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="email"
              name="email"
              required
              placeholder="navn@epost.no"
              aria-label="E-postadresse"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefon (valgfritt)"
              aria-label="Telefonnummer"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-on-image"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sender …" : "Få et tilbud"}
              <ArrowIcon />
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="form-err" role="alert">
            Noe gikk galt ved innsending. Prøv igjen, eller send oss en e-post på
            post@vertia.no.
          </p>
        )}

        <p className="alt rv" style={{ transitionDelay: ".4s" }}>
          Eller ta kontakt direkte:{" "}
          <a href="mailto:post@vertia.no">post@vertia.no</a>
          <span style={{ display: "inline-block", width: 18 }} />
          <a href="tel:+4793077305">+47 930 77 305</a>
        </p>
      </div>
    </section>
  );
}
