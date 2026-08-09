"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

/**
 * Header for landingsside v2.
 *
 * Transparent over heroen, fader til en solid krem-bar etter litt scroll.
 *
 * Designet har ingen mobilmeny — nav-en er `display:none` under 960px uten noe
 * alternativ, så man satt igjen med kun «Kontakt oss» på telefon. Vi beholder
 * hamburgeren fra v1. Stilene til den ligger i additions-blokka i
 * scripts/scope-v2-css.mjs.
 */
const navLinks = [
  { href: "#slik-fungerer-det", label: "Slik fungerer det" },
  { href: "#kalkulator", label: "Inntektsestimat" },
  { href: "#priser", label: "Priser" },
  { href: "/artikler", label: "Artikler" },
  { href: "/om-oss", label: "Om oss" },
  { href: "#faq", label: "Spørsmål" },
];

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  // Ankere på samme side rutes ikke gjennom Next – da mister vi smooth scroll.
  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick}>
      {label}
    </Link>
  );
}

export default function HeaderV2() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lås body-scroll mens mobilmenyen er åpen.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Åpen meny tvinger solid stil, ellers blir de mørke lenkene uleselige mot
  // det transparente headeren over heroen.
  const solid = scrolled || menuOpen;

  return (
    <header className={solid ? "hdr solid" : "hdr"} id="hdr">
      <div className="hdr-in">
        <a href="#top" className="brand" aria-label="Vertia, til forsiden">
          Vertia
        </a>

        <nav>
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="hdr-right">
          <a href="#kontakt" className="btn btn-primary">
            Kontakt oss
          </a>
          <button
            type="button"
            className="hdr-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={menuOpen}
            aria-controls="mobil-meny"
          >
            {menuOpen ? (
              <X width={20} height={20} strokeWidth={2} />
            ) : (
              <Menu width={20} height={20} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="hdr-mob" id="mobil-meny" aria-label="Hovedmeny">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  onClick={() => setMenuOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
