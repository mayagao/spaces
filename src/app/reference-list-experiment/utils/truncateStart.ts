/**
 * Truncates a path from the start, always showing in the format ".../folder/file.ext"
 */
export function truncateStart(
  path: string,
  maxWidth: number,
  charWidthFactor: number = 1
): {
  displayPath: string;
  hiddenSegments: string[];
  tooltip: string;
  fullPath: string;
} {
  // Split the path into segments
  const segments = path.split("/");

  // If it's just a filename with no path, return it as is
  if (segments.length <= 1) {
    return {
      displayPath: path,
      hiddenSegments: [],
      tooltip: path,
      fullPath: path,
    };
  }

  // Always start with ".../", then show as many end segments as possible
  const prefix = ".../";

  // Get the last segment (filename)
  const fileName = segments[segments.length - 1];

  // Try to include parent folders
  let result = fileName;
  let i = segments.length - 2; // Start with the parent folder

  // Keep adding parent folders as long as they fit
  while (
    i >= 0 &&
    prefix.length + result.length + segments[i].length + 1 <= maxWidth
  ) {
    result = `${segments[i]}/${result}`;
    i--;
  }

  // Add the prefix
  result = `${prefix}${result}`;

  return {
    displayPath: result,
    hiddenSegments: segments.slice(0, i + 1),
    tooltip: path,
    fullPath: path,
  };
}

/**
 * Examples:
 * truncateStart("src/components/prompt/CodeLensView.tsx", 40)
 *   -> { displayPath: ".../prompt/CodeLensView.tsx", hiddenSegments: ["src", "components"] }
 *
 * truncateStart("src/lib/parser/parseTypeScript.ts", 30)
 *   -> { displayPath: ".../parser/parseTypeScript.ts", hiddenSegments: ["src", "lib"] }
 *
 * truncateStart("src/hooks/usePromptVariables.ts", 30)
 *   -> { displayPath: ".../hooks/usePromptVariables.ts", hiddenSegments: ["src"] }
 */
