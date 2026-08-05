const companyLinks = [{ label: "Om oss", href: "/om-oss" }];

const resourceLinks = [
  { label: "Blogg", href: "/artikler" },
  { label: "Ofte stilte spørsmål", href: "/#faq" },
];

const contactLinks = [
  { label: "post@vertia.no", href: "mailto:post@vertia.no" },
  { label: "+47 930 77 305", href: "tel:+4793077305" },
  { label: "Oslo, Norge", href: null },
];

const linkClass = "text-ink-700 transition-colors hover:text-ink-900";
const headingClass =
  "text-xs font-semibold uppercase tracking-[0.18em] text-ink-500";

export default function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-sand-50 text-ink-900">
      <div className="container-page py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Merkevare */}
          <div className="lg:pr-8">
            <p className="font-display text-3xl tracking-tight text-ink-900">
              Vertia
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-500">
              Vi drifter korttidsutleien din, slik at du kan nyte fordelene uten
              å ta av din egen tid.
            </p>
          </div>

          {/* Selskap */}
          <nav aria-label="Selskap">
            <h2 className={headingClass}>Selskap</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ressurser */}
          <nav aria-label="Ressurser">
            <h2 className={headingClass}>Ressurser</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontakt */}
          <div>
            <h2 className={headingClass}>Kontakt</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  ) : (
                    <span className="text-ink-700">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-sand-200 pt-7 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Vertia</p>
          <p className="flex items-center gap-4">
            <a href="/personvern" className={linkClass}>
              Personvern
            </a>
            <span aria-hidden className="text-ink-500/60">
              ·
            </span>
            <a href="/vilkar" className={linkClass}>
              Vilkår og betingelser
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
