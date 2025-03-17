/**
 * Truncates a path from the middle, always preserving the last segment (filename) if possible.
 * If there's not enough space, truncates the last segment itself.
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
  fullPath: string;
} {
  // If the path fits within maxWidth, return it as is
  if (path.length <= maxWidth) {
    return {
      displayPath: path,
      hiddenSegments: [],
      tooltip: path,
      fullPath: path,
    };
  }

  // Split the path into segments
  const segments = path.split("/");
  const fileName = segments[segments.length - 1];
  const folders = segments.slice(0, segments.length - 1);
  const ellipsis = "...";
  const separator = "/";

  // Store the full path for tooltip
  const fullPath = path;

  // If there are no folders, just truncate the filename
  if (folders.length === 0) {
    const truncated = fileName.slice(0, maxWidth - ellipsis.length) + ellipsis;
    return {
      displayPath: truncated,
      hiddenSegments: [],
      tooltip: fullPath,
      fullPath: path,
    };
  }

  // Calculate space needed for minimum display (first folder + ellipsis + filename)
  const minDisplay = `${folders[0]}${separator}${ellipsis}${separator}${fileName}`;

  // If even the minimum display doesn't fit, we need to truncate the filename
  if (minDisplay.length > maxWidth) {
    // Calculate available space after ellipsis and one separator
    const availableSpace = maxWidth - (ellipsis.length + separator.length);
    const truncatedFilename = fileName.slice(0, availableSpace - 3) + ellipsis;

    return {
      displayPath: `${ellipsis}${separator}${truncatedFilename}`,
      hiddenSegments: folders,
      tooltip: fullPath,
      fullPath: path,
    };
  }

  // At this point, we know we can at least show first folder + ... + filename
  // Try to include as many folders from the beginning as possible
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

  // If we've added all folders, no need for ellipsis
  if (hiddenSegments.length === 0) {
    return {
      displayPath: path,
      hiddenSegments: [],
      tooltip: fullPath,
      fullPath: path,
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
    fullPath: path,
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
 *   -> { displayPath: ".../VeryLongProm...", hiddenSegments: ["repo", "src", "components", "editor", "PromptEditor"] }
 */

/**
 * Splits a path into segments for responsive display
 * @param path The path to split
 * @returns Object containing segments and whether the path has multiple parts
 */
export function splitPathForResponsiveDisplay(path: string) {
  const parts = path.split("/");
  const hasParts = parts.length > 1;

  // Default segments
  const segments = [
    { text: path, type: "full" },
    { text: "", type: "middle" },
    { text: "", type: "filename" },
  ];

  if (hasParts) {
    const repoOrFirstFolder = parts[0];
    const filename = parts[parts.length - 1];
    const middlePath = parts.slice(1, -1).join("/");

    segments[0] = { text: repoOrFirstFolder, type: "repo" };
    segments[1] = { text: middlePath, type: "middle" };
    segments[2] = { text: filename, type: "filename" };
  }

  return { segments, hasParts };
}

/**
 * Returns CSS styles for responsive truncation
 * @returns Object with CSS and class names
 */
export function getResponsiveTruncationStyles() {
  return {
    containerClass: "responsive-truncation",
    textClass: "responsive-truncation-text",
    css: `
      .responsive-truncation {
        display: flex;
        align-items: center;
        overflow: hidden;
      }
      
      .responsive-truncation-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .responsive-truncation-path {
        display: flex;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
      }
      
      .responsive-truncation-path-segment {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .responsive-truncation-path-segment.first {
        flex-shrink: 0;
        max-width: 100px;
      }
      
      .responsive-truncation-path-segment.middle {
        flex-shrink: 1;
        min-width: 20px;
      }
      
      .responsive-truncation-path-segment.filename {
        flex-shrink: 0;
        max-width: 150px;
      }
      
      @media (max-width: 640px) {
        .responsive-truncation-path-segment.first {
          max-width: 80px;
        }
        
        .responsive-truncation-path-segment.filename {
          max-width: 120px;
        }
      }
    `,
  };
}
