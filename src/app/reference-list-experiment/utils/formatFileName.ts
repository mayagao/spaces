export type DisplayMode =
  | "default"
  | "truncate-middle"
  | "full-path"
  | "file-name-only";

export interface FormattedFileName {
  name: string;
  directoryPath?: string;
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  const ellipsis = "...";
  const charsToShow = maxLength - ellipsis.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return text.slice(0, frontChars) + ellipsis + text.slice(-backChars);
};

export function formatFileName(
  name: string,
  displayMode: DisplayMode
): FormattedFileName {
  switch (displayMode) {
    case "truncate-middle": {
      if (!name.includes("/")) return { name };
      const parts = name.split("/");
      const fileName = parts.pop() || "";
      const dir = parts.join("/");
      if (dir.length > 20) {
        return { name: `${dir.slice(0, 10)}...${dir.slice(-10)}/${fileName}` };
      }
      return { name };
    }
    case "full-path":
      return { name };
    case "file-name-only": {
      if (!name.includes("/")) return { name };
      const parts = name.split("/");
      const fileName = parts.pop() || "";
      const dir = parts.join("/");
      return {
        name: truncateText(fileName, 30), // Truncate filename if > 30 chars
        directoryPath: truncateText(dir, 40), // Truncate directory path if > 40 chars
      };
    }
    default:
      if (!name.includes("/")) return { name };
      const parts = name.split("/");
      const fileName = parts.pop() || "";
      const dir = parts.join("/");
      if (dir.length > 30) {
        return { name: `.../${fileName}` };
      }
      return { name };
  }
}
