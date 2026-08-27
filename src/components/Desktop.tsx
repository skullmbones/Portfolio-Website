import { useState, useEffect } from "react";
import Dock from "./Dock";
import Window from "./Window";
import AboutApp from "../apps/AboutApp";
import TerminalApp from "../apps/TerminalApp";
import MusicApp from "../apps/MusicApp";
import DocumentsApp from "../apps/DocumentsApp";
import EmailApp from "../apps/EmailApp";
import TrashApp from "../apps/TrashApp";
import { appRegistry, desktopLinks } from "../data/appRegistry";
import "../styles/Desktop.css";

export type AppId =
  | "about"
  | "terminal"
  | "music"
  | "docs"
  | "email"
  | "trash";

interface OpenWindow {
  id: AppId;
  title: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

type WindowState = Record<AppId, OpenWindow | undefined>;
const TASKBAR_HEIGHT = 58;
const WINDOW_MARGIN = 12;
const APP_CONFIG: Record<
  AppId,
  { title: string; component: React.ReactNode }
> = {
  about: { title: "System Information", component: <AboutApp /> },
  terminal: { title: "Terminal", component: <TerminalApp /> },
  music: { title: "Music Player", component: <MusicApp /> },
  docs: { title: "Documents", component: <DocumentsApp /> },
  email: { title: "New Message", component: <EmailApp /> },
  trash: { title: "Recycle Bin", component: <TrashApp /> },
};

const emptyWindowState = (): WindowState => ({
  about: undefined,
  terminal: undefined,
  music: undefined,
  docs: undefined,
  email: undefined,
  trash: undefined,
});

const isStoredWindow = (value: unknown): value is OpenWindow => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<OpenWindow>;
  return Boolean(candidate.position && candidate.size && candidate.id);
};

const loadWindowState = (): WindowState => {
  if (typeof window === "undefined") return emptyWindowState();

  const saved = localStorage.getItem("windowState");
  if (!saved) return emptyWindowState();

  try {
    const parsed = JSON.parse(saved) as Partial<WindowState>;
    return {
      about: undefined,
      terminal: isStoredWindow(parsed.terminal) ? parsed.terminal : undefined,
      music: isStoredWindow(parsed.music) ? parsed.music : undefined,
      docs: isStoredWindow(parsed.docs) ? parsed.docs : undefined,
      email: isStoredWindow(parsed.email) ? parsed.email : undefined,
      trash: isStoredWindow(parsed.trash) ? parsed.trash : undefined,
    };
  } catch (error) {
    console.error("Failed to load window state:", error);
    return emptyWindowState();
  }
};

function Desktop({ onLogout }: { onLogout: () => void }) {
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [openWindows, setOpenWindows] = useState<WindowState>(loadWindowState);

  // Save window state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("windowState", JSON.stringify(openWindows));
  }, [openWindows]);

  useEffect(() => {
    if (!isAboutMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAboutMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAboutMenuOpen]);

  // Adjust windows when viewport is resized
  useEffect(() => {
    const handleWindowResize = () => {
      const screenWidth = window.innerWidth;
      const workspaceHeight = window.innerHeight - TASKBAR_HEIGHT;

      setOpenWindows((prev) => {
        let updated = false;
        const newState = { ...prev };

        (Object.keys(APP_CONFIG) as AppId[]).forEach((appId) => {
          const w = prev[appId];
          if (!w) return;

          const maxWidth = Math.max(260, screenWidth - WINDOW_MARGIN * 2);
          const maxHeight = Math.max(180, workspaceHeight - WINDOW_MARGIN * 2);
          const newWidth = Math.min(w.size.width, maxWidth);
          const newHeight = Math.min(w.size.height, maxHeight);
          const newX = Math.max(
            WINDOW_MARGIN,
            Math.min(w.position.x, screenWidth - newWidth - WINDOW_MARGIN)
          );
          const newY = Math.max(
            WINDOW_MARGIN,
            Math.min(w.position.y, workspaceHeight - newHeight - WINDOW_MARGIN)
          );

          if (
            newX !== w.position.x ||
            newY !== w.position.y ||
            newWidth !== w.size.width ||
            newHeight !== w.size.height
          ) {
            newState[appId] = {
              ...w,
              position: { x: newX, y: newY },
              size: { width: newWidth, height: newHeight },
            };
            updated = true;
          }
        });

        return updated ? newState : prev;
      });
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const getDefaultPosition = (
    appId: AppId,
    size: { width: number; height: number }
  ): { x: number; y: number } => {
    const index = (Object.keys(APP_CONFIG) as AppId[]).indexOf(appId);
    const workspaceHeight = window.innerHeight - TASKBAR_HEIGHT;
    const offset = appId === "trash" ? 0 : index * 24;
    return {
      x: Math.max(
        WINDOW_MARGIN,
        Math.min(
          Math.round((window.innerWidth - size.width) / 2) + offset,
          window.innerWidth - size.width - WINDOW_MARGIN
        )
      ),
      y: Math.max(
        WINDOW_MARGIN,
        Math.min(
          Math.round((workspaceHeight - size.height) / 2) + offset,
          workspaceHeight - size.height - WINDOW_MARGIN
        )
      ),
    };
  };

  const getDefaultSize = (appId: AppId): { width: number; height: number } => {
    const screenWidth = window.innerWidth;
    const workspaceHeight = window.innerHeight - TASKBAR_HEIGHT;
    const maxWidth = Math.max(260, screenWidth - WINDOW_MARGIN * 2);
    const maxHeight = Math.max(180, workspaceHeight - WINDOW_MARGIN * 2);

    if (appId === "trash") {
      return {
        width: Math.round(Math.min(560, maxWidth)),
        height: Math.round(Math.min(600, maxHeight)),
      };
    }

    return {
      width: Math.round(Math.min(Math.max(560, screenWidth * 0.64), maxWidth)),
      height: Math.round(
        Math.min(Math.max(380, workspaceHeight * 0.72), maxHeight)
      ),
    };
  };

  const handleAppClick = (appId: AppId) => {
    if (appId === "about") {
      setIsAboutMenuOpen((isOpen) => !isOpen);
      setActiveAppId(null);
      return;
    }

    setIsAboutMenuOpen(false);
    const existingWindow = openWindows[appId];
    if (existingWindow && !existingWindow.isMinimized && activeAppId === appId) {
      setActiveAppId(null);
    } else {
      setActiveAppId(appId);
    }

    setOpenWindows((prev) => {
      const existing = prev[appId];

      if (existing) {
        if (existing.isMinimized) {
          return {
            ...prev,
            [appId]: { ...existing, isMinimized: false },
          };
        }
        if (activeAppId !== appId) {
          return prev;
        }
        return {
          ...prev,
          [appId]: { ...existing, isMinimized: true },
        };
      }

      const size = getDefaultSize(appId);
      return {
        ...prev,
        [appId]: {
          id: appId,
          title: APP_CONFIG[appId].title,
          isMinimized: false,
          position: getDefaultPosition(appId, size),
          size,
        },
      };
    });
  };

  const openApp = (appId: AppId) => {
    if (appId === "about") {
      setIsAboutMenuOpen(true);
      setActiveAppId(null);
      return;
    }

    setIsAboutMenuOpen(false);
    setActiveAppId(appId);
    setOpenWindows((prev) => {
      const existing = prev[appId];

      if (existing) {
        return existing.isMinimized
          ? {
              ...prev,
              [appId]: { ...existing, isMinimized: false },
            }
          : prev;
      }

      const size = getDefaultSize(appId);
      return {
        ...prev,
        [appId]: {
          id: appId,
          title: APP_CONFIG[appId].title,
          isMinimized: false,
          position: getDefaultPosition(appId, size),
          size,
        },
      };
    });
  };

  const handleCloseWindow = (appId: AppId) => {
    setActiveAppId((activeId) => (activeId === appId ? null : activeId));
    setOpenWindows((prev) => ({
      ...prev,
      [appId]: undefined,
    }));
  };

  const handleMinimizeWindow = (appId: AppId) => {
    setActiveAppId((activeId) => (activeId === appId ? null : activeId));
    setOpenWindows((prev) => {
      const window = prev[appId];
      if (!window) return prev;
      return {
        ...prev,
        [appId]: { ...window, isMinimized: true },
      };
    });
  };

  const handlePositionChange = (
    appId: AppId,
    x: number,
    y: number
  ) => {
    setOpenWindows((prev) => {
      const window = prev[appId];
      if (!window) return prev;
      return {
        ...prev,
        [appId]: { ...window, position: { x, y } },
      };
    });
  };

  const handleSizeChange = (
    appId: AppId,
    width: number,
    height: number
  ) => {
    setOpenWindows((prev) => {
      const window = prev[appId];
      if (!window) return prev;
      return {
        ...prev,
        [appId]: { ...window, size: { width, height } },
      };
    });
  };

  const minimizedApps = (Object.keys(APP_CONFIG) as AppId[]).filter(
    (id) => openWindows[id]?.isMinimized
  );
  const openApps = (Object.keys(APP_CONFIG) as AppId[]).filter(
    (id) => Boolean(openWindows[id])
  );
  const trashApp = appRegistry.find((app) => app.id === "trash");

  return (
    <div className="desktop">
      <main className="desktop-area">
        <nav className="desktop-shortcuts" aria-label="Desktop applications">
          {appRegistry
            .filter((app) => app.id !== "about" && app.id !== "trash")
            .map((app) => (
              <button
                key={app.id}
                type="button"
                className="desktop-shortcut"
                data-app-id={app.id}
                onClick={() => openApp(app.id)}
                title={`Open ${app.title}`}
                aria-label={`Open ${app.title}`}
              >
                <span className="desktop-shortcut-icon" aria-hidden="true">
                  {app.icon}
                </span>
                <span className="desktop-shortcut-label">{app.title}</span>
              </button>
            ))}
          {desktopLinks.map((link) => (
            <a
              key={link.id}
              className="desktop-shortcut desktop-link-shortcut"
              data-app-id={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              title={`Open ${link.title}`}
              aria-label={`Open ${link.title} in a new tab`}
            >
              <span className="desktop-shortcut-icon" aria-hidden="true">
                <img src={link.iconSrc} alt="" draggable="false" />
              </span>
              <span className="desktop-shortcut-label">{link.title}</span>
            </a>
          ))}
        </nav>
        {trashApp && (
          <button
            type="button"
            className="desktop-shortcut desktop-trash-shortcut"
            data-app-id={trashApp.id}
            onClick={() => openApp(trashApp.id)}
            title={`Open ${trashApp.title}`}
            aria-label={`Open ${trashApp.title}`}
          >
            <span className="desktop-shortcut-icon" aria-hidden="true">
              <span className="trash-can-art">♲</span>
            </span>
            <span className="desktop-shortcut-label">{trashApp.title}</span>
          </button>
        )}
        {isAboutMenuOpen && (
          <>
            <button
              type="button"
              className="about-menu-backdrop"
              onClick={() => setIsAboutMenuOpen(false)}
              aria-label="Close System Information"
              tabIndex={-1}
            />
            <section
              id="about-menu"
              className="about-menu"
              role="dialog"
              aria-modal="true"
              aria-labelledby="about-menu-title"
            >
              <div className="about-menu-titlebar">
                <span id="about-menu-title">System Information</span>
                <button
                  type="button"
                  onClick={() => setIsAboutMenuOpen(false)}
                  aria-label="Close System Information"
                >
                  ×
                </button>
              </div>
              <div className="about-menu-content">
                <AboutApp />
              </div>
              <div className="about-menu-footer">
                <button
                  type="button"
                  className="about-menu-logout"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </section>
          </>
        )}
        <div className="windows-container">
          {(Object.keys(APP_CONFIG) as AppId[]).map(
            (appId) =>
              appId !== "about" && openWindows[appId] && (
                <Window
                  key={appId}
                  id={appId}
                  title={openWindows[appId]!.title}
                  onClose={() => handleCloseWindow(appId)}
                  onMinimize={() => handleMinimizeWindow(appId)}
                  onFocus={() => setActiveAppId(appId)}
                  isActive={activeAppId === appId}
                  isMinimized={openWindows[appId]!.isMinimized}
                  position={openWindows[appId]!.position}
                  size={openWindows[appId]!.size}
                  onPositionChange={(x, y) =>
                    handlePositionChange(appId, x, y)
                  }
                  onSizeChange={(width, height) =>
                    handleSizeChange(appId, width, height)
                  }
                >
                  {APP_CONFIG[appId].component}
                </Window>
              )
          )}
        </div>
        <Dock
          onAppClick={handleAppClick}
          minimizedApps={minimizedApps}
          openApps={openApps}
          isAboutMenuOpen={isAboutMenuOpen}
        />
      </main>
    </div>
  );
}

export default Desktop;
