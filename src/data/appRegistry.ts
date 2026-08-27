export const appRegistry = [
  {
    id: "about" as const,
    title: "System Information",
    icon: "⊞",
  },
  {
    id: "terminal" as const,
    title: "Terminal",
    icon: ">_",
  },
  {
    id: "music" as const,
    title: "Music",
    icon: "♫",
  },
  {
    id: "docs" as const,
    title: "Documents",
    icon: "▤",
  },
  {
    id: "email" as const,
    title: "Email",
    icon: "✉",
  },
  {
    id: "trash" as const,
    title: "Recycle Bin",
    icon: "♲",
  },
] as const;

export const desktopLinks = [
  {
    id: "github" as const,
    title: "GitHub",
    iconSrc: "/img/github-black.png",
    url: "https://github.com/skullmbones",
  },
  {
    id: "linkedin" as const,
    title: "LinkedIn",
    iconSrc: "/img/linked-logo.png",
    url: "https://www.linkedin.com/in/michael-babboni-34567231a/",
  },
] as const;
