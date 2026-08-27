import Clock from "./Clock";
import { appRegistry } from "../data/appRegistry";
import type { AppId } from "./Desktop";
import "../styles/Dock.css";

interface DockProps {
  onAppClick: (appId: AppId) => void;
  minimizedApps: AppId[];
  openApps: AppId[];
  isAboutMenuOpen: boolean;
}

function Dock({
  onAppClick,
  minimizedApps,
  openApps,
  isAboutMenuOpen,
}: DockProps) {
  const aboutApp = appRegistry.find((app) => app.id === "about");
  const centeredApps = appRegistry.filter(
    (app) => app.id !== "about" && app.id !== "trash"
  );

  return (
    <footer className="dock" aria-label="Taskbar">
      <div className="dock-container">
        {aboutApp && (
          <div className="dock-start">
            <div className="dock-app-wrapper">
              <button
                type="button"
                onClick={() => onAppClick(aboutApp.id)}
                title={aboutApp.title}
                aria-label={`Toggle ${aboutApp.title}`}
                aria-expanded={isAboutMenuOpen}
                aria-controls="about-menu"
                className={`dock-app-button dock-start-button${
                  isAboutMenuOpen ? " active" : ""
                }`}
                data-app-id={aboutApp.id}
              >
                <span className="dock-app-icon" aria-hidden="true">
                  <img
                    className="dock-start-icon-image"
                    src="/img/favicon.webp"
                    alt=""
                    draggable="false"
                  />
                </span>
              </button>
              {isAboutMenuOpen && (
                <span className="dock-app-indicator" aria-hidden="true" />
              )}
            </div>
          </div>
        )}
        <nav className="dock-apps">
          {centeredApps.map((app) => (
            <div key={app.id} className="dock-app-wrapper">
              <button
                type="button"
                onClick={() => onAppClick(app.id)}
                title={app.title}
                aria-label={`${app.title}${
                  openApps.includes(app.id) ? ", running" : ""
                }`}
                className={`dock-app-button${
                  openApps.includes(app.id) ? " active" : ""
                }${
                  minimizedApps.includes(app.id) ? " minimized" : ""
                }`}
                data-app-id={app.id}
              >
                <span className="dock-app-icon" aria-hidden="true">
                  {app.icon}
                </span>
              </button>
              {openApps.includes(app.id) && (
                <span
                  className={`dock-app-indicator${
                    minimizedApps.includes(app.id) ? " minimized" : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </nav>
        <Clock />
      </div>
    </footer>
  );
}

export default Dock;
