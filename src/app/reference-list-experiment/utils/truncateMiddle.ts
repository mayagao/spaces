/**
 * Truncates a path from the middle, preserving complete folder names and the filename.
 * Format: "folder1/.../filename.type" or "folder1/folder2/.../filename.type"
 *
 * @param path The full path string to truncate
 * @param maxWidth Maximum width (in characters) allowed
 * @param prioritizeEnd Boolean flag (default true) to indicate if we should prioritize showing the end part (filename)
 * @returns An object containing the truncated string and the hidden segments (if any)
 */
export function truncateMiddle(
  path: string,
  maxWidth: number,
  prioritizeEnd: boolean = true
): {
  displayPath: string;
  hiddenSegments: string[];
  tooltip: string;
} {
  // If the path fits within maxWidth, return it as is
  if (path.length <= maxWidth) {
    return { displayPath: path, hiddenSegments: [], tooltip: path };
  }

  // Split the path into segments
  const segments = path.split("/");
  const fileName = segments[segments.length - 1];
  const folders = segments.slice(0, segments.length - 1);

  // Store the full path for tooltip
  const fullPath = path;

  // If there are no folders, just return the filename (possibly truncated)
  if (folders.length === 0) {
    if (fileName.length <= maxWidth) {
      return { displayPath: fileName, hiddenSegments: [], tooltip: fullPath };
    } else {
      // If filename is too long, truncate it (this is a rare edge case)
      const ellipsis = "...";
      const truncated =
        fileName.slice(0, maxWidth - ellipsis.length) + ellipsis;
      return { displayPath: truncated, hiddenSegments: [], tooltip: fullPath };
    }
  }

  const ellipsis = "...";
  const separator = "/";

  // Calculate the minimum display with just first folder + ellipsis + filename
  const minDisplay = `${folders[0]}${separator}${ellipsis}${separator}${fileName}`;

  // If even the minimum display doesn't fit, we need to make hard choices
  if (minDisplay.length > maxWidth) {
    if (prioritizeEnd) {
      // Prioritize showing the filename
      const minWithFilename = `${ellipsis}${separator}${fileName}`;

      if (minWithFilename.length <= maxWidth) {
        return {
          displayPath: minWithFilename,
          hiddenSegments: folders,
          tooltip: fullPath,
        };
      } else {
        // Last resort: truncate the filename
        const availableSpace = maxWidth - (ellipsis.length + separator.length);
        const truncatedFilename = fileName.slice(0, availableSpace - 3) + "...";
        return {
          displayPath: `${ellipsis}${separator}${truncatedFilename}`,
          hiddenSegments: folders,
          tooltip: fullPath,
        };
      }
    } else {
      // Prioritize showing the beginning of the path
      const minWithFirstFolder = `${folders[0]}${separator}${ellipsis}`;

      if (minWithFirstFolder.length <= maxWidth) {
        return {
          displayPath: minWithFirstFolder,
          hiddenSegments: [...folders.slice(1), fileName],
          tooltip: fullPath,
        };
      } else {
        // Last resort: truncate the first folder
        const availableSpace = maxWidth - (ellipsis.length + separator.length);
        const truncatedFolder = folders[0].slice(0, availableSpace - 3) + "...";
        return {
          displayPath: `${truncatedFolder}${separator}${ellipsis}`,
          hiddenSegments: [...folders.slice(1), fileName],
          tooltip: fullPath,
        };
      }
    }
  }

  // At this point, we know we can at least show first folder + ... + filename
  // Try to include as many folders from the beginning and end as possible

  // Start with first folder and filename
  let displaySegments = [folders[0]];
  let hiddenSegments = [...folders.slice(1, -1)];
  let currentDisplay = `${displaySegments.join(
    separator
  )}${separator}${ellipsis}${separator}${fileName}`;

  // Try to add more folders from the beginning
  let frontIndex = 1;
  while (frontIndex < folders.length && hiddenSegments.length > 0) {
    const nextSegment = folders[frontIndex];
    const newDisplay = `${[...displaySegments, nextSegment].join(
      separator
    )}${separator}${ellipsis}${separator}${fileName}`;

    if (newDisplay.length <= maxWidth) {
      displaySegments.push(nextSegment);
      hiddenSegments.shift();
      currentDisplay = newDisplay;
      frontIndex++;
    } else {
      break;
    }
  }

  // Try to add more folders from the end
  let backIndex = folders.length - 2; // Start from the second-to-last folder
  while (backIndex >= frontIndex && hiddenSegments.length > 0) {
    const nextSegment = folders[backIndex];
    const newDisplay = `${displaySegments.join(
      separator
    )}${separator}${ellipsis}${separator}${[nextSegment, fileName].join(
      separator
    )}`;

    if (newDisplay.length <= maxWidth) {
      // Insert at the end of displaySegments but before the filename
      displaySegments = [...displaySegments, nextSegment];
      hiddenSegments.pop();
      currentDisplay = newDisplay;
      backIndex--;
    } else {
      break;
    }
  }

  // If we've added all folders, no need for ellipsis
  if (hiddenSegments.length === 0) {
    return {
      displayPath: path,
      hiddenSegments: [],
      tooltip: fullPath,
    };
  }

  // Construct the final display path with ellipsis
  const finalDisplay = `${displaySegments.join(
    separator
  )}${separator}${ellipsis}${separator}${fileName}`;

  return {
    displayPath: finalDisplay,
    hiddenSegments: hiddenSegments,
    tooltip: fullPath,
  };
}

/**
 * Examples:
 * truncateMiddle("repo/src/components/editor/PromptEditor/PromptCanvas.tsx", 40)
 *   -> { displayPath: "repo/src/.../PromptCanvas.tsx", hiddenSegments: ["components", "editor", "PromptEditor"] }
 *
 * truncateMiddle("repo/src/components/editor/PromptEditor/PromptCanvas.tsx", 25)
 *   -> { displayPath: "repo/.../PromptCanvas.tsx", hiddenSegments: ["src", "components", "editor", "PromptEditor"] }
 *
 * truncateMiddle("repo/src/components/editor/PromptEditor/VeryLongPromptCanvasFileName.tsx", 20)
 *   -> { displayPath: ".../VeryLongPromptCanvasFileName.tsx", hiddenSegments: ["repo", "src", "components", "editor", "PromptEditor"] }
 */
