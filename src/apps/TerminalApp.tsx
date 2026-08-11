import { useState } from "react";

type TerminalMode = "main" | "webdev" | "portfolio" | "friend" | "gamedev" | "appdev";

type TerminalHistoryEntry = {
  id: string;
  lines: string[];
};

function TerminalApp() {
  const [mode, setMode] = useState<TerminalMode>("main");
  const [command, setCommand] = useState("C:/Portfolio> michaelbabboni@Portfolio % /webdev /gamedev /appdev");
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([]);

  const pushHistoryEntry = (nextMode: TerminalMode) => {
    const lines =
      nextMode === "portfolio"
        ? [
            "Project: Nova Studio",
            "Stack: React, TypeScript, Vite, Tailwind",
            "Timeline: 6 weeks",
            "GitHub: github.com/example/nova-studio",
            "Website: novastudio.dev",
            "Summary: A polished portfolio experience with playful terminal navigation and a custom desktop feel.",
          ]
        : nextMode === "friend"
          ? [
              "Project: Circle House",
              "Stack: Next.js, Supabase, Framer Motion",
              "Timeline: 8 weeks",
              "GitHub: github.com/example/circle-house",
              "Website: circlehouse.app",
              "Summary: A community-first social platform built around collaboration, identity, and simple interaction.",
            ]
          : [];

    if (!lines.length) {
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `${nextMode}-${Date.now()}-${Math.random()}`,
        lines,
      },
    ]);
  };

  const handleSelect = (nextMode: TerminalMode) => {
    if (nextMode === "webdev" || nextMode === "gamedev" || nextMode === "appdev") {
      if (mode === nextMode) {
        setMode("main");
        setCommand("C:/Portfolio> michaelbabboni@Portfolio % /webdev /gamedev /appdev");
      } else {
        setMode(nextMode);
        if (nextMode === "webdev") {
          setCommand("C:/Portfolio> michaelbabboni@Portfolio/webdev % .portfolio .friend");
        } else {
          setCommand(`C:/Portfolio> michaelbabboni@Portfolio/${nextMode}`);
        }
      }
      return;
    }

    if (nextMode === "portfolio" || nextMode === "friend") {
      setMode(nextMode);
      pushHistoryEntry(nextMode);
      setCommand(
        nextMode === "portfolio"
          ? "C:/Portfolio> michaelbabboni@Portfolio/webdev % .portfolio"
          : "C:/Portfolio> michaelbabboni@Portfolio/webdev % .friend"
      );
      return;
    }

    setMode(nextMode);
    if (nextMode === "main") {
      setCommand("C:/Portfolio> michaelbabboni@Portfolio % /webdev /gamedev /appdev");
    } else {
      setCommand(`C:/Portfolio> michaelbabboni@Portfolio/${nextMode}`);
    }
  };

  const renderCommandLine = () => {
    const parts = command.split(/(\/webdev|\/gamedev|\/appdev|\.portfolio|\.friend)/g);

    return (
      <span className="terminal-command">
        {parts.map((part, index) => {
          if (part === "/webdev" || part === "/gamedev" || part === "/appdev") {
            const optionMode = part.slice(1) as TerminalMode;
            const isBackButton = mode === optionMode;
            return (
              <button
                key={`${part}-${index}`}
                type="button"
                className={`terminal-command-link${isBackButton ? " terminal-command-link-back" : ""}`}
                onClick={() => handleSelect(optionMode)}
              >
                {part}
              </button>
            );
          }

          if (part === ".portfolio" || part === ".friend") {
            const subtopicMode = part === ".portfolio" ? "portfolio" : "friend";
            return (
              <button
                key={`${part}-${index}`}
                type="button"
                className="terminal-command-link"
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

  return (
    <div className="terminal-content">
      <div className="terminal-input-row">
        {renderCommandLine()}
      </div>

      <div className="terminal-output">
        {[...history].reverse().map((entry) => (
          <div key={entry.id} className="terminal-history-entry">
            {entry.lines.map((line, index) => (
              <p key={`${entry.id}-${index}`}>{line}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TerminalApp;
