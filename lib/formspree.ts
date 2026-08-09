/**
 * Formspree-endepunktet skjemaene sender til.
 *
 * Samme endepunkt som components/Calculator.tsx (v1) har brukt hele tiden –
 * lagt i en delt fil så v2-skjemaene ikke duplisererer ID-en.
 */
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mkolabzy";

type SubmitPayload = Record<string, string | undefined>;

/** Sender et skjema til Formspree. Kaster ved ikke-2xx, så kalleren kan vise feil. */
export async function submitToFormspree(payload: SubmitPayload) {
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Innsending feilet");
}
