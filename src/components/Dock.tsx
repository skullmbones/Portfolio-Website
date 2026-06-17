import Clock from "./Clock";
import { appRegistry } from "../data/appRegistry";
import "../styles/Dock.css";

function Dock() {
  return (
    <main className="dock">
        <div className="dock-container">
            <nav className="dock-apps">
            {appRegistry.map((app) => (
            <button key={app.title}>{app.icon}</button>
            ))}
            </nav>
        <Clock />
        </div>
    </main>
  );
}

export default Dock;