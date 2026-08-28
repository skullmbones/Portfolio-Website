const SYSTEM_PROPERTIES = [
  ["Owner", "Michael Babboni"],
  ["Education", "Rutgers University–New Brunswick"],
  ["Degree", "Bachelor of Computer Science, May 2026"],
  ["Location", "North Jersey / New York City"],
  ["Current Job", "Host/Server at Franklin Steakhouse and Tavern"]
] as const;

function AboutApp() {
  return (
    <div className="app-content about-app">
      <header className="about-system-summary">
        <div className="about-owner-photo-frame" aria-hidden="true">
          <img
            src="/img/headshot2026.png"
            alt=""
            className="about-owner-photo"
            draggable="false"
          />
        </div>
        <div className="about-system-identity">
          <p className="about-machine-name">User</p>
          <h2>Michael Babboni</h2>
        </div>
      </header>

      <fieldset className="about-group">
        <legend>System properties</legend>
        <dl className="about-properties">
          {SYSTEM_PROPERTIES.map(([label, value]) => (
            <div className="about-property" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </fieldset>

      <div className="about-status" role="status">
        <span aria-hidden="true" />
        Actively looking for new opportunities.
      </div>
    </div>
  );
}

export default AboutApp;
