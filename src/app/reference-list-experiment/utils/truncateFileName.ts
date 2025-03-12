/**
 * Truncates a filepath, prioritizing the full filename.type and showing as much path from the end as possible:
 * For "src/components/editor/PromptEditor/PromptCanvas.tsx":
 * 1. Try "editor/PromptEditor/.../PromptCanvas.tsx"
 * 2. Try "PromptEditor/.../PromptCanvas.tsx"
 * 3. Try ".../PromptCanvas.tsx"
 * 4. Last resort: ".../Prom...tsx"
 */
export function truncateFileName(fileName: string, maxLength: number): string {
  if (fileName.length <= maxLength) return fileName;

  // Split into directory path and filename
  const parts = fileName.split("/");
  const lastPart = parts.pop() || "";
  const ellipsis = "...";

  // First check if we can show just .../filename
  const minDisplay = `${ellipsis}/${lastPart}`;

  // If we can't even show the full filename with ../, we need to truncate the filename
  if (minDisplay.length > maxLength) {
    // Split the filename into name and extension
    const lastDotIndex = lastPart.lastIndexOf(".");
    const hasExtension = lastDotIndex > 0;
    const extension = hasExtension ? lastPart.slice(lastDotIndex) : "";
    const baseName = hasExtension ? lastPart.slice(0, lastDotIndex) : lastPart;

    // Try to keep at least one character of the filename plus extension
    if (
      hasExtension &&
      extension.length + 5 + ellipsis.length * 2 <= maxLength
    ) {
      const availableForBase =
        maxLength - (extension.length + ellipsis.length * 2 + 1);
      const truncatedBase = baseName.slice(0, Math.max(1, availableForBase));
      return `${ellipsis}/${truncatedBase}${ellipsis}${extension}`;
    }

    // Absolute last resort: truncate everything
    return fileName.slice(0, maxLength - ellipsis.length) + ellipsis;
  }

  // At this point we know we can show at least .../filename
  // Try to show as many directory levels as possible from the end
  for (let numFolders = parts.length - 1; numFolders >= 0; numFolders--) {
    const pathParts = parts.slice(numFolders);
    const display = `${pathParts.join("/")}${ellipsis}/${lastPart}`;

    if (display.length <= maxLength) {
      return display;
    }
  }

  // If we can't fit any folders, return just .../filename
  return minDisplay;
}

/**
 * Examples:
 * truncateFileName("src/components/editor/PromptEditor/PromptCanvas.tsx", 50) -> "editor/PromptEditor/.../PromptCanvas.tsx"
 * truncateFileName("src/components/editor/PromptEditor/PromptCanvas.tsx", 35) -> "PromptEditor/.../PromptCanvas.tsx"
 * truncateFileName("src/components/editor/PromptEditor/PromptCanvas.tsx", 25) -> ".../PromptCanvas.tsx"
 * truncateFileName("src/components/editor/PromptEditor/VeryLongPromptCanvas.tsx", 20) -> ".../Ver...tsx"
 */
