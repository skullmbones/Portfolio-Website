function Desktop({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="desktop">
      <main className="desktop-area">
        <h1>Desktop!</h1>
        <button onClick={onLogout}>Logout</button>
      </main>
    </div>
  );
}

export default Desktop;