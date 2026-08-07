import Clock from "./Clock";
import { appRegistry } from "../data/appRegistry";
import type { AppId } from "./Desktop";
import "../styles/Dock.css";

interface DockProps {
  onAppClick: (appId: AppId) => void;
  minimizedApps: AppId[];
}

function Dock({ onAppClick, minimizedApps }: DockProps) {
  return (
    <main className="dock">
      <div className="dock-container">
        <nav className="dock-apps">
          {appRegistry.map((app) => (
            <div key={app.id} className="dock-app-wrapper">
              <button
                onClick={() => onAppClick(app.id)}
                title={app.title}
                className={
                  minimizedApps.includes(app.id) ? "minimized" : ""
                }
              >
                {app.icon}
              </button>
              {minimizedApps.includes(app.id) && (
                <div className="minimized-indicator" />
              )}
            </div>
          ))}
        </nav>
        <Clock />
      </div>
    </main>
  );
}

export default Dock;