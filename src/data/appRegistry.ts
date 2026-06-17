export type AppId = "terminal" | "projects" | "music" | "about" | "resume";

export const appRegistry = [
    {
    id: "about",
    title: "About Me",
    icon: "👤",
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: "⌨️",
  },
  {
    id: "music",
    title: "Music",
    icon: "🎵",
  },
  {
    id: "docs",
    title: "Documents",
    icon: "📄",
  },
] as const;