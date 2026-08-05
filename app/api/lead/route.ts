import { NextResponse } from "next/server";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  API-ROUTE FOR LEAD-SKJEMAET
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Skjemaet sender data hit. Akkurat nå logger vi bare innsendingen til
 *  serverkonsollen (placeholder), slik at alt fungerer ende-til-ende.
 *
 *  SLIK KOBLER DU PÅ EKTE MOTTAK SENERE (velg én):
 *
 *  A) Formspree – enklest:
 *     1. Opprett et skjema på formspree.io og kopier endepunkt-URL-en.
 *     2. Bytt ut log-blokken under med:
 *          await fetch("https://formspree.io/f/DITT_ID", {
 *            method: "POST",
 *            headers: { "Content-Type": "application/json" },
 *            body: JSON.stringify(data),
 *          });
 *
 *  B) E-post via en tjeneste som Resend:
 *     1. npm install resend, opprett API-nøkkel.
 *     2. Send e-post med leadens innhold til din egen adresse.
 *
 *  Tips: legg hemmelige nøkler i en .env.local-fil, ikke direkte i koden.
 * ───────────────────────────────────────────────────────────────────────────
 */

interface LeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  area?: string;
  propertyType?: string;
  address?: string;
  consent?: string;
}

export async function POST(request: Request) {
  let data: LeadPayload;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ugyldig forespørsel." },
      { status: 400 },
    );
  }

  // Enkel validering av påkrevde felter.
  if (!data.name || !data.phone || !data.email) {
    return NextResponse.json(
      { ok: false, error: "Mangler navn, telefon eller e-post." },
      { status: 422 },
    );
  }

  // Samtykke MÅ være gitt (markedsføringsloven § 15).
  // Avkrysningsboksen sender "on" når den er huket av.
  if (!data.consent) {
    return NextResponse.json(
      { ok: false, error: "Samtykke til kontakt er påkrevd." },
      { status: 422 },
    );
  }

  // PLACEHOLDER: her havner leaden. Bytt ut med Formspree/e-post senere.
  console.log("Ny lead mottatt:", {
    name: data.name,
    phone: data.phone,
    email: data.email,
    area: data.area,
    propertyType: data.propertyType,
    address: data.address,
    consent: data.consent,
  });

  return NextResponse.json({ ok: true });
}
