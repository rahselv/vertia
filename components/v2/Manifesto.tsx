const stats = [
  { value: "0 kr", label: "faste månedsavgifter" },
  { value: "4", label: "salgskanaler" },
  { value: "1", label: "fast kontaktperson" },
  { value: "Alle dager", label: "rask respons" },
];

/** «Vertia-løftet» – mørk espresso-flate med fire nøkkeltall. */
export default function ManifestoV2() {
  return (
    <section className="section manif">
      <div className="wrap">
        {/* Størrelsen settes i CSS (.manif h2), ikke her, så innstrammingen av
            typografien kan styres ett sted. */}
        <h2
          className="rv"
          style={{
            transitionDelay: ".1s",
            maxWidth: "none",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          Utleie skal kjennes som <em>ro,</em> ikke som enda en jobb
        </h2>

        <p
          className="sub rv"
          style={{
            transitionDelay: ".2s",
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Vi tar hånd om alt det praktiske, slik at du kan nyte fordelene uten å
          ta av din egen tid.
        </p>

        <div className="manif-stats rv" style={{ transitionDelay: ".3s" }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
