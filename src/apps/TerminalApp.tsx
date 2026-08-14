import { useState, ReactNode } from "react";

type TerminalMode = "main" | "webdev" | "portfolio" | "jlc" | "gamedev" | "adventure_catalyst" | "traffic_jam"| "appdev" | "rooted" | "scary_burger";

type TerminalHistoryEntry = {
  id: string;
  lines: string[];
  mode?: TerminalMode;
};

const INITIAL_PROMPT = "C:/Portfolio> michaelbabboni@Portfolio % cd /webdev /gamedev /appdev";
const WEBDEV_PROMPT = "C:/Portfolio> michaelbabboni@Portfolio/webdev % .portfolio .jlc";
const GAMEDEV_PROMPT = "C:/Portfolio> michaelbabboni@Portfolio/gamedev % .adventure_catalyst .traffic_jam";
const APPDEV_PROMPT = "C:/Portfolio> michaelbabboni@Portfolio/appdev % .rooted .scary_burger";


const PORTFOLIO_LINES = [
  "Portfolio Website",
  " Stack: React, TypeScript, Vite, Tailwind",
  " Timeline: May 2026 - present",
  " GitHub: https://github.com/skullmbones/Portfolio-Website",
  " Website: www.michaelbabboni.com",
  " Summary: A polished portfolio experience with playful terminal navigation and a custom desktop feel.",
];

const JLC_LINES = [
  "Content Strategy Website",
  " Stack: Next.js, Supabase, Framer Motion",
  " Timeline: 8 weeks",
  " GitHub: https://github.com/example/content-strategy-website",
  " Website: contentstrategy.app",
  " Summary: A community-first social platform built around collaboration, identity, and simple interaction.",
];

const ADVENTURE_CATALYST_LINES = [
  "Adventure Catalyst",
  " Stack: FabricAPI, Java, Minecraft Modding",
  " Timeline: October 2025 - present",
  " Website: https://adventurecatalyst.net/",
  " Summary: A Minecraft mod that introduces new gameplay mechanics, items, and adventures to enhance the player's experience.",
];

const TRAFFIC_JAM_LINES = [
  "Traffic Jam",
  " Stack: Unity, C#",   
  " Timeline: September 2025",
  " Itch.io: https://skullmbones.itch.io/traffic-jam",
  " Summary: A game jam game where players navigate through traffic by avoiding obstacles on beat."
];

const ROOTED_LINES = [
  "Rooted",
  " Stack: React, Node.js, PostreSQL, Supabase, REST API",
  " Timeline: January 2026 - May 2026",
  " Github: https://github.com/christianmonsalve850/Rooted",
  " Website: https://rooted-blush.vercel.app/"
];

const SCARY_BURGER_LINES = [
  "Scary Burger",
  " Stack: Java, Javafx, Android Studio, Scene Builder",
  " Timeline: March 2025 - May 2025",
  " GitHub: https://github.com/skullmbones/Scary-Burger-Android-App",
  " Summary: A mobile app that allows users to order food from a fictional restaurant, featuring a spooky theme and interactive UI elements."
];

function TerminalApp() {
  const [mode, setMode] = useState<TerminalMode>("main");
  const [command, setCommand] = useState<string>(INITIAL_PROMPT);
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([]);

  const pushHistoryEntry = (nextMode: TerminalMode) => {
    let lines: string[] = [];
    switch (nextMode) {
      case "portfolio":
        lines = PORTFOLIO_LINES;
        break;
      case "jlc":
        lines = JLC_LINES;
        break;
      case "adventure_catalyst":
        lines = ADVENTURE_CATALYST_LINES;
        break;
      case "traffic_jam":
        lines = TRAFFIC_JAM_LINES;
        break;
      case "rooted":
        lines = ROOTED_LINES;
        break;
      case "scary_burger":
        // placeholder for future lines; keep empty to avoid adding
        lines = SCARY_BURGER_LINES;
        break;
      default:
        lines = [];
    }

    if (!lines.length) return;

    setHistory((prev) => [
      ...prev,
      { id: `${nextMode}-${Date.now()}-${Math.random()}`, lines, mode: nextMode },
    ]);
  };

  const openMode = (nextMode: TerminalMode) => {
    setMode(nextMode);

    if (nextMode === "main") setCommand(INITIAL_PROMPT);
    else if (nextMode === "webdev") setCommand(WEBDEV_PROMPT);
    else if (nextMode === "gamedev") setCommand(GAMEDEV_PROMPT);
    else if (nextMode === "appdev") setCommand(APPDEV_PROMPT);
    else setCommand(`C:/Portfolio> michaelbabboni@Portfolio/${nextMode}`);
  };

  const PARENT_MAP: Record<string, TerminalMode | undefined> = {
    portfolio: "webdev",
    jlc: "webdev",
    adventure_catalyst: "gamedev",
    traffic_jam: "gamedev",
    rooted: "appdev",
    scary_burger: "appdev",
  };

  const PROJECT_TITLES: Partial<Record<TerminalMode, string>> = {
  portfolio: "Portfolio Website",
  jlc: "Content Strategy Website",
  adventure_catalyst: "Adventure Catalyst",
  traffic_jam: "Traffic Jam",
  rooted: "Rooted",
  scary_burger: "Scary Burger",
};

  const handleSelect = (nextMode: TerminalMode) => {
    // Toggle top-level modes
    if (nextMode === "webdev" || nextMode === "gamedev" || nextMode === "appdev") {
      if (mode === nextMode) {
        openMode("main");
      } else {
        openMode(nextMode);
      }
      return;
    }

    // Nested subcommands: map to a parent and behave like webdev's .portfolio/.jlc
    const parent = PARENT_MAP[nextMode];
    if (parent) {
      setMode(nextMode);
      pushHistoryEntry(nextMode);
      setCommand(`C:/Portfolio> michaelbabboni@Portfolio/${parent} % .${nextMode}`);
      return;
    }

    openMode(nextMode);
  };

  const renderCommandLine = () => {
    const parts = command.split(/(\/webdev|\/gamedev|\/appdev|\.portfolio|\.jlc|\.adventure_catalyst|\.traffic_jam|\.rooted|\.scary_burger)/g);

    return (
      <span className="terminal-command">
        {parts.map((part, index) => {
          if (["/webdev", "/gamedev", "/appdev"].includes(part)) {
            const optionMode = part.slice(1) as TerminalMode;
            const isActive = mode === optionMode;
            return (
              <button
                key={`${part}-${index}`}
                type="button"
                className={`terminal-command-link ${optionMode} ${isActive ? "terminal-command-link-active" : ""}`}
                onClick={() => handleSelect(optionMode)}
              >
                {part}
              </button>
            );
          }

          if (
            part === ".portfolio" ||
            part === ".jlc" ||
            part === ".adventure_catalyst" ||
            part === ".traffic_jam" ||
            part === ".rooted" ||
            part === ".scary_burger"
          ) {
            const map: Record<string, TerminalMode> = {
              ".portfolio": "portfolio",
              ".jlc": "jlc",
              ".adventure_catalyst": "adventure_catalyst",
              ".traffic_jam": "traffic_jam",
              ".rooted": "rooted",
              ".scary_burger": "scary_burger",
            };
            const subtopicMode = map[part];
            const isActiveSub = mode === subtopicMode;
            return (
              <button
                key={`${part}-${index}`}
                type="button"
                className={`terminal-command-link ${subtopicMode} ${isActiveSub ? "terminal-command-link-active" : ""}`}
                onClick={() => handleSelect(subtopicMode)}
              >
                {part}
              </button>
            );
          }

          return <span key={`${part}-${index}`}>{part}</span>;
        })}
      </span>
    );
  };

  const ensureUrl = (text: string) => {
    // If already has protocol, return as-is
    if (/^https?:\/\//i.test(text)) return text;
    // Add https:// for plain domains like www.example.com or example.app
    return `https://${text}`;
  };

  const renderLine = (line: string, key: string, entryMode?: TerminalMode): ReactNode => {
    // Convert known prefixes into links
    const githubMatch = line.match(/GitHub:\s*(.+)$/i);
    if (githubMatch) {
      const url = ensureUrl(githubMatch[1].trim());
      return (
        <p key={key}>
          <strong>GitHub:</strong>{" "}
          <a className="terminal-url" href={url} target="_blank" rel="noopener noreferrer">
            {githubMatch[1].trim()}
          </a>
        </p>
      );
    }

    const websiteMatch = line.match(/Website:\s*(.+)$/i);
    if (websiteMatch) {
      const urlText = websiteMatch[1].trim();
      const url = ensureUrl(urlText);
      return (
        <p key={key}>
          <strong>Website:</strong>{" "}
          <a className="terminal-url" href={url} target="_blank" rel="noopener noreferrer">
            {urlText}
          </a>
        </p>
      );
    }

    // Generic URL recognition inside the line
    const urlRegex = /(https?:\/\/[\w\-._~:\/?#\[\]@!$&'()*+,;=%]+)/g;
    if (urlRegex.test(line)) {
      const parts = line.split(urlRegex).map((part, i) => {
        if (urlRegex.test(part)) {
          return (
            <a key={`${key}-url-${i}`} className="terminal-url" href={part} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          );
        }
        return <span key={`${key}-text-${i}`}>{part}</span>;
      });
      return <p key={key}>{parts}</p>;
    }

    // Highlight the project title
    if (
      entryMode &&
      PROJECT_TITLES[entryMode] &&
      line.trim() === PROJECT_TITLES[entryMode]
    ) {
      return (
        <p key={key} className={`project-title ${entryMode}`}>
          {line}
        </p>
      );
    }

    return <p key={key}>{line}</p>;
  };

  return (
    <div className="terminal-content">
      <div className="terminal-input-row">{renderCommandLine()}</div>

      <div className="terminal-output">
        {[...history].reverse().map((entry) => (
          <div key={entry.id} className="terminal-history-entry">
            {entry.lines.map((line, index) => renderLine(line, `${entry.id}-${index}`, entry.mode))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TerminalApp;
