import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

/**
 * «Hvor vi annonserer»-stripe. Kanalene tegnes som inline-SVG-/wordmark-logoer
 * i sine EKTE merkefarger, slik at de ser gjenkjennelige og levende ut – men
 * fortsatt rolig og jevnt fordelt på den varme flaten. Diskret hover løfter.
 */

/* Airbnb – ikonisk «bélo»-bue + wordmark i Airbnb-korall (#FF385C). */
function AirbnbLogo() {
  return (
    <span className="flex items-center gap-2 leading-none text-[#FF385C]">
      <svg
        viewBox="0 0 24 24"
        className="h-[1.45rem] w-[1.45rem] flex-none"
        fill="currentColor"
        aria-hidden
      >
        <path d="M22.515 14.476c-.044-.105-.066-.158-.1-.236l-.146-.32c-1.49-3.234-3.087-6.516-4.766-9.755l-.064-.123c-.166-.317-.337-.645-.514-.973A4.41 4.41 0 0 0 12 .6a3.79 3.79 0 0 0-3.434 2.083c-.18.33-.35.658-.515.975l-.064.123C6.308 7.02 4.71 10.302 3.22 13.536l-.143.315c-.034.078-.058.135-.102.24l-.026.06c-.43 1.01-.85 2.12-.59 3.4a4.06 4.06 0 0 0 1.553 2.5 4.04 4.04 0 0 0 2.4.788c.246 0 .553-.034.872-.103.42-.096.857-.257 1.302-.487.55-.282 1.124-.69 1.772-1.262.05.05.1.087.135.124l.585.502c.86.74 1.65 1.135 2.4 1.135.74 0 1.527-.394 2.396-1.135l.582-.5c.038-.038.088-.075.135-.125.65.573 1.224.98 1.772 1.262.445.23.882.39 1.302.487.32.07.625.103.872.103.85 0 1.66-.27 2.4-.788a4.06 4.06 0 0 0 1.553-2.5c.26-1.28-.16-2.39-.59-3.4zM12 16.5c-1.04-1.31-1.71-2.46-1.94-3.43-.1-.42-.12-.79-.07-1.12.04-.29.14-.55.28-.78.32-.49.87-.79 1.73-.79s1.4.3 1.73.79c.14.23.24.49.28.78.05.33.03.7-.07 1.12-.23.97-.9 2.12-1.94 3.43z" />
      </svg>
      <span className="text-[1.55rem] font-semibold tracking-[-0.03em]">
        airbnb
      </span>
    </span>
  );
}

/* Booking.com – «Booking» i Booking-blå (#003580), «.com» litt lysere blå. */
function BookingLogo() {
  return (
    <span className="text-[1.5rem] font-bold leading-none tracking-[-0.02em] text-[#003580]">
      Booking
      <span className="font-medium text-[#009FE3]">.com</span>
    </span>
  );
}

/* Vrbo – kompakt geometrisk wordmark i Vrbo-blå (#1668E3). */
function VrboLogo() {
  return (
    <span className="text-[1.6rem] font-bold leading-none tracking-[-0.02em] text-[#1668E3]">
      Vrbo
    </span>
  );
}

/* FINN.no – det ikoniske blå merket (avrundet kvadrat med én kvart-sirkel /
   spiss hjørne) etterfulgt av «FINN»-wordmark i FINN-blå (#0063FB), diskret
   «.no» dempet etter. */
function FinnLogo() {
  return (
    <span className="flex items-center gap-2 leading-none text-[#0063FB]">
      <svg
        viewBox="0 0 24 24"
        className="h-[1.45rem] w-[1.45rem] flex-none"
        fill="currentColor"
        aria-hidden
      >
        {/* Merke med tre avrundede hjørner og ett spisst (øvre venstre) – FINN
            sitt gjenkjennelige ikon. */}
        <path d="M0 0h18a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V0z" />
      </svg>
      <span className="text-[1.55rem] font-extrabold uppercase tracking-[-0.01em]">
        FINN
        <span className="font-semibold lowercase text-[#0063FB]/55">.no</span>
      </span>
    </span>
  );
}

const channels: { name: string; logo: ReactNode }[] = [
  { name: "Airbnb", logo: <AirbnbLogo /> },
  { name: "Booking.com", logo: <BookingLogo /> },
  { name: "Vrbo", logo: <VrboLogo /> },
  { name: "FINN.no", logo: <FinnLogo /> },
];

export default function Channels() {
  return (
    <section className="section bg-sand-100">
      <div className="container-page">
        <Reveal className="max-w-xl">
          <p className="eyebrow mb-4">Hvor vi annonserer</p>
          <p className="section-lead text-balance">
            Vi publiserer boligen din på kanalene som gir flest bookinger.
          </p>
        </Reveal>

        {/* Rolig, jevnt fordelt logo-stripe på en varm flate med hårfine
            kolonneskiller. Ekte merkefarger per logo, diskret hover-løft. */}
        <Reveal delay={0.1}>
          <ul className="mt-16 grid grid-cols-2 overflow-hidden border border-sand-200 bg-sand-50 sm:grid-cols-4">
            {channels.map((channel, index) => (
              <li
                key={channel.name}
                aria-label={channel.name}
                className={[
                  "flex h-28 items-center justify-center px-6 opacity-90 transition-opacity duration-200 hover:opacity-100 sm:h-32",
                  // Hårfine, varme skiller: topp-kant på nederste rad (mobil),
                  // venstre-kant mellom kolonner (desktop).
                  index >= 2 ? "border-t border-sand-200 sm:border-t-0" : "",
                  index % 2 === 1 ? "border-l border-sand-200" : "",
                  "sm:border-l sm:border-sand-200",
                  index % 4 === 0 ? "sm:border-l-0" : "",
                ].join(" ")}
              >
                {channel.logo}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
