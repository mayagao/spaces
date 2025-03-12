import { truncateMiddle } from "./truncateMiddle";

/**
 * Interface for file reference display data
 */
export interface FileReferenceDisplay {
  primaryColumn: string;
  secondaryColumn?: string;
  secondLine?: string;
  hiddenSegments: string[];
}

/**
 * Option 1: Show only filename in first column, repo+path in second column
 *
 * @param repoName Repository name
 * @param filePath Full file path
 * @param maxWidth Maximum width for truncation
 */
export function getOption1Display(
  repoName: string,
  filePath: string,
  maxWidth: number
): FileReferenceDisplay {
  // Split the path to get the filename
  const segments = filePath.split("/");
  const fileName = segments[segments.length - 1];
  const pathWithoutFile = segments.slice(0, segments.length - 1).join("/");

  // For the second column, combine repo name and path without filename
  const secondaryContent = `${repoName}/${pathWithoutFile}`;

  // Truncate the secondary column if needed
  const { displayPath, hiddenSegments } = truncateMiddle(
    secondaryContent,
    maxWidth
  );

  return {
    primaryColumn: fileName,
    secondaryColumn: displayPath,
    hiddenSegments,
  };
}

/**
 * Option 2: Show full path in first column, repo name in second column
 *
 * @param repoName Repository name
 * @param filePath Full file path
 * @param maxWidth Maximum width for truncation
 */
export function getOption2Display(
  repoName: string,
  filePath: string,
  maxWidth: number
): FileReferenceDisplay {
  // Truncate the file path if needed
  const { displayPath, hiddenSegments } = truncateMiddle(filePath, maxWidth);

  return {
    primaryColumn: displayPath,
    secondaryColumn: repoName,
    hiddenSegments,
  };
}

/**
 * Option 3: Show filename in first line, repo+path in second line
 * No second column
 *
 * @param repoName Repository name
 * @param filePath Full file path
 * @param maxWidth Maximum width for truncation
 */
export function getOption3Display(
  repoName: string,
  filePath: string,
  maxWidth: number
): FileReferenceDisplay {
  // Split the path to get the filename
  const segments = filePath.split("/");
  const fileName = segments[segments.length - 1];
  const pathWithoutFile = segments.slice(0, segments.length - 1).join("/");

  // For the second line, combine repo name and path without filename
  const secondLineContent = `${repoName}/${pathWithoutFile}`;

  // Truncate the second line if needed
  const { displayPath, hiddenSegments } = truncateMiddle(
    secondLineContent,
    maxWidth
  );

  return {
    primaryColumn: fileName,
    secondLine: displayPath,
    hiddenSegments,
  };
}

/**
 * Get display data based on selected option
 *
 * @param option Display option (1, 2, or 3)
 * @param repoName Repository name
 * @param filePath Full file path
 * @param maxWidth Maximum width for truncation
 */
export function getFileReferenceDisplay(
  option: 1 | 2 | 3,
  repoName: string,
  filePath: string,
  maxWidth: number
): FileReferenceDisplay {
  switch (option) {
    case 1:
      return getOption1Display(repoName, filePath, maxWidth);
    case 2:
      return getOption2Display(repoName, filePath, maxWidth);
    case 3:
      return getOption3Display(repoName, filePath, maxWidth);
    default:
      return getOption1Display(repoName, filePath, maxWidth);
  }
}
