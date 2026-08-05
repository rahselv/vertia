"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ContactButton from "@/components/ContactButton";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/#slik-fungerer-det", label: "Slik fungerer det" },
  { href: "/#kalkulator", label: "Inntektsestimat" },
  { href: "/#priser", label: "Priser" },
  { href: "/artikler", label: "Artikler" },
  { href: "/#faq", label: "Ofte stilte spørsmål" },
];

/**
 * Header.
 *
 * Standard (forsiden): transparent og scroll-aware – flyter hvit over det mørke
 * heroen øverst, og fader inn en solid sand/blur-bar når man scroller.
 *
 * `solid`: tvinger headeren til den solide tilstanden ALLTID – brukes på lyse
 * sider (f.eks. artiklene) der den transparente, hvite varianten ville blitt
 * usynlig. Default `false` bevarer forsidens oppførsel uendret.
 */
export default function Header({ solid = false }: { solid?: boolean }) {
  // Øverst er headeren transparent og flyter over heroen. Etter en liten
  // scroll fader en diskret krem-bar inn med bunn-border.
  const [scrolled, setScrolled] = useState(false);
  // Mobilmeny (hamburger) – kun under md.
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  // Lås body-scroll mens mobilmenyen er åpen.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // På lyse sider er headeren alltid i sin solide tilstand. Åpen mobilmeny
  // tvinger også solid stil (lys bar) så lenker/ikon blir lesbare.
  const isSolid = solid || scrolled || menuOpen;

  return (
    <header
      className={`${
        solid ? "sticky top-0" : "fixed inset-x-0 top-0"
      } z-40 border-b motion-safe:transition-[background-color,border-color,backdrop-filter] motion-safe:duration-500 motion-safe:ease-out ${
        isSolid
          ? "border-sand-200/70 bg-sand-50/85 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a
          href={solid ? "/" : "#top"}
          className="flex items-center"
          aria-label="Vertia – til forsiden"
        >
          <Logo variant={isSolid ? "full" : "white"} size={34} />
        </a>

        <nav
          className={`hidden items-center gap-7 text-sm font-medium md:flex motion-safe:transition-colors motion-safe:duration-500 ${
            isSolid ? "text-ink-700" : "text-white/90"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                isSolid ? "hover:text-brand-600" : "hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ContactButton
            variant="kontakt"
            className={
              isSolid
                ? "btn-primary !px-5 !py-2.5 text-sm"
                : "inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            }
          >
            Kontakt oss
          </ContactButton>

          {/* Hamburger – kun mobil */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={menuOpen}
            aria-controls="mobil-meny"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden ${
              isSolid
                ? "text-ink-700 hover:bg-sand-100"
                : "text-white hover:bg-white/15"
            }`}
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobil nedtrekksmeny */}
      {menuOpen && (
        <nav
          id="mobil-meny"
          className="border-t border-sand-200 bg-sand-50/95 backdrop-blur md:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-[0.95rem] font-medium text-ink-700 transition-colors hover:text-brand-600"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
