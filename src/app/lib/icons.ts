import * as Icons from "@primer/octicons-react";

// List of available icons for spaces
export const SPACE_ICONS = [
  "star",
  "apps",
  "beaker",
  "book",
  "bookmark",
  "briefcase",
  "bug",
  "code",
  "cpu",
  "database",
  "desktop-download",
  "device-desktop",
  "file-code",
  "gear",
  "git-branch",
  "globe",
  "graph",
  "heart",
  "home",
  "light-bulb",
  "link",
  "lock",
  "paintbrush",
  "paper-airplane",
  "pencil",
  "project",
  "rocket",
  "search",
  "shield",
  "terminal",
  "tools",
  "zap",
] as const;

export type SpaceIcon = (typeof SPACE_ICONS)[number];

// Get a random icon from the list
export function getRandomIcon(): SpaceIcon {
  const randomIndex = Math.floor(Math.random() * SPACE_ICONS.length);
  return SPACE_ICONS[randomIndex];
}

// Convert icon name to PascalCase and append 'Icon'
export function getIconComponent(iconName: SpaceIcon) {
  const pascalCase =
    iconName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") + "Icon";

  return Icons[pascalCase as keyof typeof Icons];
}
