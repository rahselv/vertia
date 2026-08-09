import Link from "next/link";

/**
 * Footer for v2. Fire kolonner, deretter det store «Vertia»-ordmerket i sand,
 * og til slutt en tynn bunnlinje.
 *
 * «Om oss» peker til /om-oss (egen side), ikke til modalen designet la opp til.
 */
export default function FooterV2() {
  return (
    <footer>
      <div className="wrap">
        <div className="ft">
          <div>
            <p className="fd">Korttidsutleie uten stress.</p>
          </div>

          <nav aria-label="Selskap">
            <h4>Selskap</h4>
            <ul>
              <li>
                <Link href="/om-oss">Om oss</Link>
              </li>
              <li>
                <a href="#kontakt">Kontakt oss</a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Ressurser">
            <h4>Ressurser</h4>
            <ul>
              <li>
                <Link href="/artikler">Blogg</Link>
              </li>
              <li>
                <a href="#faq">Ofte stilte spørsmål</a>
              </li>
            </ul>
          </nav>

          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>
                <a href="mailto:post@vertia.no">post@vertia.no</a>
              </li>
              <li>
                <a href="tel:+4793077305">+47 930 77 305</a>
              </li>
              <li>
                <span>Oslo, Norge</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="ft-brand" aria-hidden="true">
        Vertia
      </p>

      <div className="wrap">
        <div className="ft-bot">
          <p style={{ margin: 0 }}>© 2026 Vertia</p>
          <p style={{ margin: 0, display: "flex", gap: 28 }}>
            <Link href="/personvern">Personvern</Link>
            <Link href="/vilkar">Vilkår og betingelser</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
