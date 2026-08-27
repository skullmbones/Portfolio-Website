const SYSTEM_PROPERTIES = [
  ["Registered owner", "Michael Babboni"],
  ["Education", "Rutgers University–New Brunswick"],
  ["Major", "Computer Science"],
  ["Location", "North Jersey / New York City"],
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
        Available for new opportunities
      </div>
    </div>
  );
}

export default AboutApp;
