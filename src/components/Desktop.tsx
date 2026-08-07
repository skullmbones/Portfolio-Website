import { useState, useEffect } from "react";
import Dock from "./Dock";
import Window from "./Window";
import AboutApp from "../apps/AboutApp";
import TerminalApp from "../apps/TerminalApp";
import MusicApp from "../apps/MusicApp";
import DocumentsApp from "../apps/DocumentsApp";
import "../styles/Desktop.css";

export type AppId = "about" | "terminal" | "music" | "docs";

interface OpenWindow {
  id: AppId;
  title: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

type WindowState = Record<AppId, OpenWindow | undefined>;

function Desktop({ onLogout }: { onLogout: () => void }) {
  const [openWindows, setOpenWindows] = useState<WindowState>({
    about: undefined,
    terminal: undefined,
    music: undefined,
    docs: undefined,
  });

  // Load window state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("windowState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        const validatedState = {
          about: parsed.about?.position && parsed.about?.size ? { ...parsed.about } : undefined,
          terminal: parsed.terminal?.position && parsed.terminal?.size ? { ...parsed.terminal } : undefined,
          music: parsed.music?.position && parsed.music?.size ? { ...parsed.music } : undefined,
          docs: parsed.docs?.position && parsed.docs?.size ? { ...parsed.docs } : undefined,
        };
        
        setOpenWindows(validatedState);
      } catch (e) {
        console.error("Failed to load window state:", e);
        localStorage.removeItem("windowState");
      }
    }
  }, []);

  // Save window state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("windowState", JSON.stringify(openWindows));
  }, [openWindows]);

  // Adjust windows when viewport is resized
  useEffect(() => {
    const handleWindowResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      setOpenWindows((prev) => {
        let updated = false;
        const newState = { ...prev };

        (Object.keys(appConfig) as AppId[]).forEach((appId) => {
          const w = prev[appId];
          if (!w) return;

          let newX = w.position.x;
          let newY = w.position.y;
          let newWidth = w.size.width;
          let newHeight = w.size.height;

          // Ensure window doesn't go off right edge
          if (newX + newWidth > screenWidth) {
            newX = Math.max(0, screenWidth - newWidth);
          }

          // Ensure window doesn't go off bottom edge
          if (newY + newHeight > screenHeight) {
            newY = Math.max(0, screenHeight - newHeight);
          }

          // Ensure window is not off-screen on left
          if (newX < 0) {
            newX = 0;
          }

          // Ensure window is not off-screen on top
          if (newY < 0) {
            newY = 0;
          }

          // If position or size changed, update it
          if (newX !== w.position.x || newY !== w.position.y) {
            newState[appId] = {
              ...w,
              position: { x: newX, y: newY },
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

  const appConfig: Record<
    AppId,
    { title: string; component: React.ReactNode }
  > = {
    about: { title: "About Me", component: <AboutApp /> },
    terminal: { title: "Terminal", component: <TerminalApp /> },
    music: { title: "Music Player", component: <MusicApp /> },
    docs: { title: "Documents", component: <DocumentsApp /> },
  };

  const getDefaultPosition = (appId: AppId): { x: number; y: number } => {
    const index = (Object.keys(appConfig) as AppId[]).indexOf(appId);
    return {
      x: 80 + index * 40,
      y: 80 + index * 40,
    };
  };

  const getDefaultSize = (): { width: number; height: number } => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    return {
      width: Math.max(600, screenWidth * 0.6),
      height: Math.max(400, screenHeight * 0.7),
    };
  };

  const handleAppClick = (appId: AppId) => {
    setOpenWindows((prev) => {
      const existing = prev[appId];

      if (existing) {
        if (existing.isMinimized) {
          return {
            ...prev,
            [appId]: { ...existing, isMinimized: false },
          };
        }
        return {
          ...prev,
          [appId]: { ...existing, isMinimized: true },
        };
      }

      return {
        ...prev,
        [appId]: {
          id: appId,
          title: appConfig[appId].title,
          isMinimized: false,
          position: getDefaultPosition(appId),
          size: getDefaultSize(),
        },
      };
    });
  };

  const handleCloseWindow = (appId: AppId) => {
    setOpenWindows((prev) => ({
      ...prev,
      [appId]: undefined,
    }));
  };

  const handleMinimizeWindow = (appId: AppId) => {
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

  const minimizedApps = (Object.keys(appConfig) as AppId[]).filter(
    (id) => openWindows[id]?.isMinimized
  );

  return (
    <div className="desktop">
      <main className="desktop-area">
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
        <div className="windows-container">
          {(Object.keys(appConfig) as AppId[]).map(
            (appId) =>
              openWindows[appId] && (
                <Window
                  key={appId}
                  id={appId}
                  title={openWindows[appId]!.title}
                  onClose={() => handleCloseWindow(appId)}
                  onMinimize={() => handleMinimizeWindow(appId)}
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
                  {appConfig[appId].component}
                </Window>
              )
          )}
        </div>
        <div className="dock">
          <Dock onAppClick={handleAppClick} minimizedApps={minimizedApps} />
        </div>
      </main>
    </div>
  );
}

export default Desktop;