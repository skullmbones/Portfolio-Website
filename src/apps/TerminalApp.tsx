import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

type DirectoryPath = "~" | "~/webdev" | "~/gamedev" | "~/appdev";
type ProjectId =
  | "portfolio"
  | "jlc"
  | "adventure_catalyst"
  | "traffic_jam"
  | "rooted"
  | "scary_burger";
type OutputKind = "default" | "muted" | "error" | "success" | "directory" | "title";

type OutputLine = {
  text: string;
  kind?: OutputKind;
  label?: string;
  url?: string;
  projectId?: ProjectId;
};

type ProjectLink = {
  label: string;
  text: string;
  url: string;
};

type Project = {
  id: ProjectId;
  fileName: string;
  title: string;
  directory: DirectoryPath;
  details: Array<{ label: string; value: string }>;
  links: ProjectLink[];
  summary?: string;
};

type TranscriptEntry = {
  id: number;
  cwd: DirectoryPath;
  command: string;
  output: OutputLine[];
};

const PROJECTS: Record<ProjectId, Project> = {
  portfolio: {
    id: "portfolio",
    fileName: "portfolio.txt",
    title: "Portfolio Website",
    directory: "~/webdev",
    details: [
      { label: "Stack", value: "React, TypeScript, Vite, Tailwind" },
      { label: "Timeline", value: "May 2026 - present" },
    ],
    links: [
      {
        label: "GitHub",
        text: "github.com/skullmbones/Portfolio-Website",
        url: "https://github.com/skullmbones/Portfolio-Website",
      },
      {
        label: "Website",
        text: "www.michaelbabboni.com",
        url: "https://www.michaelbabboni.com",
      },
    ],
    summary:
      "A polished portfolio experience with terminal navigation and a custom desktop feel.",
  },
  jlc: {
    id: "jlc",
    fileName: "jlc.txt",
    title: "Content Strategy Website",
    directory: "~/webdev",
    details: [
      { label: "Stack", value: "Next.js, Supabase, Framer Motion" },
      { label: "Timeline", value: "8 weeks" },
    ],
    links: [
      {
        label: "GitHub",
        text: "github.com/example/content-strategy-website",
        url: "https://github.com/example/content-strategy-website",
      },
      {
        label: "Website",
        text: "contentstrategy.app",
        url: "https://contentstrategy.app",
      },
    ],
    summary:
      "A community-first social platform built around collaboration, identity, and simple interaction.",
  },
  adventure_catalyst: {
    id: "adventure_catalyst",
    fileName: "adventure_catalyst.txt",
    title: "Adventure Catalyst",
    directory: "~/gamedev",
    details: [
      { label: "Stack", value: "Fabric API, Java, Minecraft Modding" },
      { label: "Timeline", value: "October 2025 - present" },
    ],
    links: [
      {
        label: "Website",
        text: "adventurecatalyst.net",
        url: "https://adventurecatalyst.net/",
      },
    ],
    summary:
      "A Minecraft mod that introduces new gameplay mechanics, items, and adventures.",
  },
  traffic_jam: {
    id: "traffic_jam",
    fileName: "traffic_jam.txt",
    title: "Traffic Jam",
    directory: "~/gamedev",
    details: [
      { label: "Stack", value: "Unity, C#" },
      { label: "Timeline", value: "September 2025" },
    ],
    links: [
      {
        label: "Itch.io",
        text: "skullmbones.itch.io/traffic-jam",
        url: "https://skullmbones.itch.io/traffic-jam",
      },
    ],
    summary:
      "A rythym-based game jam project where players navigate traffic by avoiding obstacles on beat.",
  },
  rooted: {
    id: "rooted",
    fileName: "rooted.txt",
    title: "Rooted",
    directory: "~/appdev",
    details: [
      { label: "Stack", value: "React, Node.js, PostgreSQL, Supabase, REST API" },
      { label: "Timeline", value: "January 2026 - May 2026" },
    ],
    links: [
      {
        label: "GitHub",
        text: "github.com/christianmonsalve850/Rooted",
        url: "https://github.com/christianmonsalve850/Rooted",
      },
      {
        label: "Website",
        text: "rooted-blush.vercel.app",
        url: "https://rooted-blush.vercel.app/",
      },
    ],
  },
  scary_burger: {
    id: "scary_burger",
    fileName: "scary_burger.txt",
    title: "Scary Burger",
    directory: "~/appdev",
    details: [
      { label: "Stack", value: "Java, JavaFX, Android Studio, Scene Builder" },
      { label: "Timeline", value: "March 2025 - May 2025" },
    ],
    links: [
      {
        label: "GitHub",
        text: "github.com/skullmbones/Scary-Burger-Android-App",
        url: "https://github.com/skullmbones/Scary-Burger-Android-App",
      },
    ],
    summary:
      "A mobile ordering app for a fictional restaurant with a spooky theme and interactive UI.",
  },
};

const DIRECTORIES: Record<
  DirectoryPath,
  { directories: string[]; projects: ProjectId[] }
> = {
  "~": {
    directories: ["webdev", "gamedev", "appdev"],
    projects: [],
  },
  "~/webdev": {
    directories: [],
    projects: ["portfolio", "jlc"],
  },
  "~/gamedev": {
    directories: [],
    projects: ["adventure_catalyst", "traffic_jam"],
  },
  "~/appdev": {
    directories: [],
    projects: ["rooted", "scary_burger"],
  },
};

const COMMANDS = [
  "help",
  "dir",
  "cd",
  "type",
  "open",
  "tree",
  "pwd",
  "whoami",
  "history",
  "date",
  "echo",
  "cls",
];

const HELP_LINES: OutputLine[] = [
  { text: "PORTFOLIO TERMINAL COMMANDS", kind: "title" },
  { text: "" },
  { text: "  DIR [path]          List folders and project files" },
  { text: "  CD <folder>         Change folder (CD .. moves up)" },
  { text: "  TYPE <file>         Print a project's details" },
  { text: "  OPEN <file> [link]  Open its website, GitHub, or Itch.io page" },
  { text: "  TREE                Print the portfolio directory tree" },
  { text: "  PWD                 Print the current directory" },
  { text: "  WHOAMI              Print profile information" },
  { text: "  HISTORY             Print command history" },
  { text: "  DATE                Print the current date and time" },
  { text: "  ECHO <text>         Print text" },
  { text: "  CLS                 Clear the terminal" },
  { text: "" },
  { text: "Aliases: LS, CAT, START, CLEAR" },
  { text: 'Try: DIR  →  CD webdev  →  TYPE portfolio.txt', kind: "muted" },
];

const TREE_LINES: OutputLine[] = [
  { text: "C:\\Portfolio", kind: "directory" },
  { text: "├── webdev\\", kind: "directory" },
  { text: "│   ├── portfolio.txt" },
  { text: "│   └── jlc.txt" },
  { text: "├── gamedev\\", kind: "directory" },
  { text: "│   ├── adventure_catalyst.txt" },
  { text: "│   └── traffic_jam.txt" },
  { text: "└── appdev\\", kind: "directory" },
  { text: "    ├── rooted.txt" },
  { text: "    └── scary_burger.txt" },
];

const isDirectoryPath = (value: string): value is DirectoryPath =>
  Object.prototype.hasOwnProperty.call(DIRECTORIES, value);

const stripWrappingQuotes = (value: string) =>
  value.replace(/^("|')|("|')$/g, "");

const tokenize = (value: string) =>
  (value.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? []).map(
    stripWrappingQuotes
  );

const pathSegments = (path: DirectoryPath) =>
  path === "~" ? [] : path.slice(2).split("/");

const displayPath = (path: DirectoryPath) => {
  const suffix = pathSegments(path).join("\\");
  return suffix ? `C:\\Portfolio\\${suffix}` : "C:\\Portfolio";
};

const promptFor = (path: DirectoryPath) => `${displayPath(path)}>`;

const resolveDirectory = (
  currentPath: DirectoryPath,
  requestedPath: string
): DirectoryPath | null => {
  const rawPath = stripWrappingQuotes(requestedPath.trim());
  if (!rawPath || rawPath === "~") return "~";

  let normalized = rawPath.replace(/\\/g, "/");
  const isAbsolute = /^(~|\/|c:\/)/i.test(normalized);
  normalized = normalized.replace(/^c:\/portfolio/i, "~");

  const segments = isAbsolute ? [] : pathSegments(currentPath);
  const requestedSegments = normalized
    .replace(/^~\/?/, "")
    .replace(/^\/+/, "")
    .split("/");

  for (const rawSegment of requestedSegments) {
    const segment = rawSegment.trim().toLowerCase();
    if (!segment || segment === "." || segment === "portfolio") continue;
    if (segment === "..") {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }

  const resolved = segments.length ? `~/${segments.join("/")}` : "~";
  return isDirectoryPath(resolved) ? resolved : null;
};

const normalizeProjectName = (value: string) =>
  value
    .toLowerCase()
    .replace(/^\./, "")
    .replace(/\.(txt|project)$/i, "")
    .replace(/-/g, "_");

const resolveProject = (
  currentPath: DirectoryPath,
  requestedFile: string
): Project | null => {
  const normalized = stripWrappingQuotes(requestedFile.trim()).replace(/\\/g, "/");
  const lastSeparator = normalized.lastIndexOf("/");
  const file = normalized.slice(lastSeparator + 1);
  if (!file) return null;

  const directoryRequest =
    lastSeparator >= 0 ? normalized.slice(0, lastSeparator) || "/" : "";
  const directory = directoryRequest
    ? resolveDirectory(currentPath, directoryRequest)
    : currentPath;
  if (!directory) return null;

  const projectId = normalizeProjectName(file) as ProjectId;
  const project = PROJECTS[projectId];
  return project?.directory === directory ? project : null;
};

const projectOutput = (project: Project): OutputLine[] => [
  { text: project.title, kind: "title", projectId: project.id },
  ...project.details.map(({ label, value }) => ({ text: `${label}: ${value}` })),
  ...project.links.map((link) => ({
    text: link.text,
    label: link.label,
    url: link.url,
  })),
  ...(project.summary ? [{ text: `Summary: ${project.summary}` }] : []),
];

const directoryOutput = (path: DirectoryPath): OutputLine[] => {
  const contents = DIRECTORIES[path];
  const folderLines = contents.directories.map((directory) => ({
    text: `<DIR>          ${directory}`,
    kind: "directory" as const,
  }));
  const fileLines = contents.projects.map((projectId) => ({
    text: `               ${PROJECTS[projectId].fileName}`,
  }));

  return [
    { text: ` Directory of ${displayPath(path)}`, kind: "muted" },
    { text: "" },
    ...folderLines,
    ...fileLines,
    { text: "" },
    {
      text: ` ${contents.projects.length} File(s)    ${contents.directories.length} Dir(s)`,
      kind: "muted",
    },
  ];
};

function TerminalApp() {
  const [cwd, setCwd] = useState<DirectoryPath>("~");
  const [input, setInput] = useState("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nextEntryId = useRef(1);
  const draftInput = useRef("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [transcript, cwd]);

  const appendEntry = (
    command: string,
    output: OutputLine[],
    executionPath = cwd
  ) => {
    const entry: TranscriptEntry = {
      id: nextEntryId.current,
      cwd: executionPath,
      command,
      output,
    };
    nextEntryId.current += 1;
    setTranscript((previous) => [...previous.slice(-199), entry]);
  };

  const executeCommand = (rawCommand: string) => {
    const tokens = tokenize(rawCommand);
    const command = tokens[0]?.toLowerCase();
    const args = tokens.slice(1);
    const nextCommandHistory = [...commandHistory, rawCommand].slice(-100);

    setCommandHistory(nextCommandHistory);
    setHistoryIndex(null);
    draftInput.current = "";

    if (command === "cls" || command === "clear") {
      setTranscript([]);
      return;
    }

    let output: OutputLine[] = [];

    switch (command) {
      case "help":
        output = HELP_LINES;
        break;

      case "dir":
      case "ls": {
        const requestedPath = args.join(" ");
        const targetPath = requestedPath
          ? resolveDirectory(cwd, requestedPath)
          : cwd;
        output = targetPath
          ? directoryOutput(targetPath)
          : [{ text: `The system cannot find the path specified: ${requestedPath}`, kind: "error" }];
        break;
      }

      case "cd":
      case "chdir": {
        if (!args.length) {
          output = [{ text: displayPath(cwd) }];
          break;
        }
        const requestedPath = args.join(" ");
        const targetPath = resolveDirectory(cwd, requestedPath);
        if (targetPath) {
          setCwd(targetPath);
        } else {
          output = [
            {
              text: `The system cannot find the path specified: ${requestedPath}`,
              kind: "error",
            },
          ];
        }
        break;
      }

      case "type":
      case "cat": {
        if (!args.length) {
          output = [{ text: "Usage: TYPE <project-file>", kind: "error" }];
          break;
        }
        const requestedFile = args.join(" ");
        const project = resolveProject(cwd, requestedFile);
        output = project
          ? projectOutput(project)
          : [
              { text: `File not found: ${requestedFile}`, kind: "error" },
              { text: "Run DIR to list files in the current folder.", kind: "muted" },
            ];
        break;
      }

      case "open":
      case "start": {
        if (!args.length) {
          output = [{ text: "Usage: OPEN <project-file> [website|github|itch.io]", kind: "error" }];
          break;
        }
        const project = resolveProject(cwd, args[0]);
        const linkType = args[1]?.toLowerCase();
        const selectedLink = project?.links.find((link) =>
          linkType ? link.label.toLowerCase().startsWith(linkType) : true
        );

        if (!project) {
          output = [{ text: `File not found: ${args[0]}`, kind: "error" }];
        } else if (!selectedLink) {
          output = [
            {
              text: `Link not found. Available: ${project.links
                .map((link) => link.label.toLowerCase())
                .join(", ")}`,
              kind: "error",
            },
          ];
        } else {
          const openedWindow = window.open(selectedLink.url, "_blank", "noopener,noreferrer");
          if (openedWindow) openedWindow.opener = null;
          output = [
            { text: `Opening ${project.title}...`, kind: "success" },
            {
              text: selectedLink.text,
              label: selectedLink.label,
              url: selectedLink.url,
            },
          ];
        }
        break;
      }

      case "tree":
        output = TREE_LINES;
        break;

      case "pwd":
        output = [{ text: displayPath(cwd) }];
        break;

      case "whoami":
        output = [
          { text: "michaelbabboni", kind: "title" },
          { text: "Full-stack developer" },
          { text: "TypeScript · React · Node.js" },
        ];
        break;

      case "history":
        output = nextCommandHistory.map((item, index) => ({
          text: `${String(index + 1).padStart(3, " ")}  ${item}`,
        }));
        break;

      case "date":
      case "time":
        output = [{ text: new Date().toString() }];
        break;

      case "echo":
        output = [{ text: args.join(" ") }];
        break;

      default:
        output = [
          {
            text: `'${tokens[0]}' is not recognized as an internal command.`,
            kind: "error",
          },
          { text: "Type HELP for available commands.", kind: "muted" },
        ];
    }

    appendEntry(rawCommand, output);
  };

  const runCommand = (command: string) => {
    setInput("");
    executeCommand(command);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim();
    if (!command) return;
    runCommand(command);
  };

  const quickCommands =
    cwd === "~"
      ? [
          ...DIRECTORIES[cwd].directories.map((directory) => ({
            label: `cd ${directory}`,
            command: `cd ${directory}`,
            accent: directory,
          })),
          { label: "tree", command: "tree", accent: "tree" },
        ]
      : [
          { label: "cd ..", command: "cd ..", accent: "back" },
          ...DIRECTORIES[cwd].projects.map((projectId) => ({
            label: `type ${PROJECTS[projectId].fileName}`,
            command: `type ${PROJECTS[projectId].fileName}`,
            accent: projectId,
          })),
        ];

  const completionCandidates = () => {
    const firstSpace = input.indexOf(" ");
    if (firstSpace === -1) return COMMANDS;

    const activeCommand = input.slice(0, firstSpace).toLowerCase();
    const contents = DIRECTORIES[cwd];
    if (activeCommand === "cd" || activeCommand === "chdir") {
      return cwd === "~"
        ? contents.directories
        : ["..", "\\", ...contents.directories];
    }
    if (activeCommand === "type" || activeCommand === "cat") {
      return contents.projects.map((projectId) => PROJECTS[projectId].fileName);
    }
    if (activeCommand === "open" || activeCommand === "start") {
      return contents.projects.map((projectId) => PROJECTS[projectId].fileName);
    }
    if (activeCommand === "dir" || activeCommand === "ls") {
      return [
        ...contents.directories,
        ...contents.projects.map((projectId) => PROJECTS[projectId].fileName),
      ];
    }
    return [];
  };

  const completeInput = () => {
    const lastSpace = input.lastIndexOf(" ");
    const prefix = input.slice(lastSpace + 1);
    const beforePrefix = input.slice(0, lastSpace + 1);
    const match = completionCandidates().find((candidate) =>
      candidate.toLowerCase().startsWith(prefix.toLowerCase())
    );
    if (!match) return;
    const isCommandCompletion = lastSpace === -1;
    setInput(`${beforePrefix}${match}${isCommandCompletion ? " " : ""}`);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) return;
      if (historyIndex === null) draftInput.current = input;
      const nextIndex =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      if (historyIndex >= commandHistory.length - 1) {
        setHistoryIndex(null);
        setInput(draftInput.current);
      } else {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      completeInput();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setTranscript([]);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "c") {
      event.preventDefault();
      appendEntry(`${input}^C`, []);
      setInput("");
      setHistoryIndex(null);
    }
  };

  const handleTerminalClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a, input, button") || window.getSelection()?.toString()) return;
    inputRef.current?.focus();
  };

  const renderLine = (line: OutputLine, key: string): ReactNode => {
    const className = [
      "terminal-line",
      line.kind ? `terminal-line-${line.kind}` : "",
      line.projectId ? `project-title ${line.projectId}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    if (line.url) {
      return (
        <p key={key} className={className}>
          {line.label ? <strong>{line.label}: </strong> : null}
          <a
            className="terminal-url"
            href={line.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${line.text} (opens in a new tab)`}
          >
            {line.text}
          </a>
        </p>
      );
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const exactUrlRegex = /^https?:\/\/[^\s]+$/;
    const parts = line.text.split(urlRegex);

    return (
      <p key={key} className={className}>
        {parts.map((part, index) =>
          exactUrlRegex.test(part) ? (
            <a
              key={`${key}-url-${index}`}
              className="terminal-url"
              href={part}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </a>
          ) : (
            <span key={`${key}-text-${index}`}>{part || "\u00a0"}</span>
          )
        )}
      </p>
    );
  };

  return (
    <div className="terminal-content" onClick={handleTerminalClick}>
      <div
        className="terminal-output"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="terminal-banner">
          <p>michaelbabboniOS Terminal [Version 2.0]</p>
          <p>Type HELP for available commands.</p>
        </div>

        {transcript.map((entry) => (
          <div key={entry.id} className="terminal-history-entry">
            <div className="terminal-executed-command">
              <span className="terminal-prompt">{promptFor(entry.cwd)}</span>
              <span>{entry.command}</span>
            </div>
            {entry.output.length ? (
              <div className="terminal-entry-output">
                {entry.output.map((line, index) =>
                  renderLine(line, `${entry.id}-${index}`)
                )}
              </div>
            ) : null}
          </div>
        ))}
        <div ref={endRef} aria-hidden="true" />
      </div>

      <nav className="terminal-quick-nav" aria-label="Quick terminal navigation">
        <span className="terminal-quick-nav-label">quick nav:</span>
        {quickCommands.map((item) => (
          <button
            key={item.command}
            type="button"
            className={`terminal-shortcut ${item.accent}`}
            onClick={() => runCommand(item.command)}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className="terminal-shortcut help"
          onClick={() => runCommand("help")}
        >
          help
        </button>
      </nav>

      <form className="terminal-input-row" onSubmit={handleSubmit}>
        <label className="terminal-input-label" htmlFor="terminal-command-input">
          Terminal command
        </label>
        <span className="terminal-prompt" aria-hidden="true">
          {promptFor(cwd)}
        </span>
        <input
          ref={inputRef}
          id="terminal-command-input"
          className="terminal-command-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label={`Command at ${displayPath(cwd)}`}
          autoFocus
        />
      </form>
    </div>
  );
}

export default TerminalApp;
