import Dock from "./Dock";
import "../styles/Desktop.css";

function Desktop({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="desktop">
      <main className="desktop-area">
        <button onClick={onLogout}>Logout</button>
        <div className="dock">
        <Dock />
        </div>
      </main>
    </div>
  );
}

export default Desktop;