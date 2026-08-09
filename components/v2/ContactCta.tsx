"use client";

import { useState } from "react";
import Link from "next/link";
import ArrowIcon from "./ArrowIcon";
import { submitToFormspree } from "@/lib/formspree";

/**
 * Kontakt-seksjonen nederst.
 *
 * Holdt bevisst liten. Den sto tidligere med overskriften «La oss regne på
 * akkurat din bolig» og et stort skjema, altså samme løfte og samme handling
 * som inntektsestimatet lenger oppe. To konkurrerende hovedhandlinger på samme
 * side gjør begge svakere, så denne er nå en ren kontaktvei: kort overskrift,
 * e-post og telefon, samtykke.
 *
 * Estimatskjemaet er sidens hovedkonvertering og står urørt.
 *
 * Innsendingen går til Formspree, som resten av siden. Designet hadde et
 * demo-skjema som bare byttet ut sin egen HTML.
 */
export default function ContactCtaV2() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Skjemaet har noValidate (designet stiller sin egen validering), så
    // `required` alene stopper ikke innsending. Vi sjekker eksplisitt.
    if (!email.trim().includes("@") || !consent) return;

    setStatus("submitting");
    try {
      await submitToFormspree({
        email,
        phone,
        consent: "ja",
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
          Ta kontakt
        </h2>
        <p className="ld rv" style={{ transitionDelay: ".2s" }}>
          Har du et spørsmål, eller vil du bare ta en prat? Legg igjen
          kontaktinfo, så hører du fra oss.
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

            {/* Samtykke – IKKE forhåndskrysset. Påkrevd etter
                markedsføringsloven § 15. Designet hadde ingen slik boks, men
                v1 hadde, og den skal ikke falle bort i redesignet. */}
            <label className="consent">
              <input
                type="checkbox"
                name="consent"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                Jeg samtykker til å bli kontaktet om tjenesten. Se hvordan vi
                behandler opplysningene i{" "}
                <Link href="/personvern">personvernerklæringen</Link>.
              </span>
            </label>
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
