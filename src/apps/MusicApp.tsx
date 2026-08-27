function MusicApp() {
  const genres = [
    { title: "Synthwave", detail: "Neon drives", color: "violet" },
    { title: "Lo-Fi Hip Hop", detail: "Focus mode", color: "blue" },
    { title: "Progressive Rock", detail: "Deep cuts", color: "orange" },
    { title: "Ambient", detail: "Slow signals", color: "green" },
  ];

  return (
    <div className="app-content music-app">
      <div className="music-hero">
        <div className="music-art" aria-hidden="true">
          <span>♫</span>
        </div>
        <div className="music-intro">
          <p className="music-eyebrow">Personal library</p>
          <h2>Music Player</h2>
          <p>A few sounds that keep the workstation running.</p>
          <div className="music-equalizer" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <i key={index} style={{ height: `${8 + ((index * 7) % 20)}px` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="music-library-heading">
        <span>Collection</span>
        <span>{genres.length} genres</span>
      </div>
      <div className="music-grid">
        {genres.map((genre, index) => (
          <article className="music-card" key={genre.title}>
            <span className={`music-card-art ${genre.color}`} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <strong>{genre.title}</strong>
              <small>{genre.detail}</small>
            </span>
            <span className="music-card-arrow" aria-hidden="true">›</span>
          </article>
        ))}
      </div>
    </div>
  );
}

export default MusicApp;
