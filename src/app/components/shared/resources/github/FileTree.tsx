"use client";

import { useState, useEffect } from "react";
import {
  XIcon,
  SearchIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FileIcon,
  FileDirectoryIcon,
  AlertIcon,
} from "@primer/octicons-react";
import {
  fetchRepoContents,
  type GitHubFile,
  type GitHubRepo,
} from "../../../../services/githubService";
import {
  MAX_RESOURCE_SIZE_BYTES,
  calculateTotalResourceSize,
  formatBytes,
} from "../utils/resourceSizeUtils";

interface FileTreeProps {
  repo: GitHubRepo;
  onBack: () => void;
  onClose: () => void;
  onAddFiles: (files: GitHubFile[]) => void;
  currentResources: any[]; // Current resources to calculate remaining space
}

export function FileTree({
  repo,
  onBack,
  onClose,
  onAddFiles,
  currentResources = [],
}: FileTreeProps) {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<GitHubFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRepoSize, setTotalRepoSize] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [remainingSpace, setRemainingSpace] = useState(MAX_RESOURCE_SIZE_BYTES);
  const [limitExceeded, setLimitExceeded] = useState(false);

  // Calculate remaining space based on current resources
  useEffect(() => {
    const currentUsage = calculateTotalResourceSize(currentResources);
    const remaining = MAX_RESOURCE_SIZE_BYTES - currentUsage;
    setRemainingSpace(remaining);
  }, [currentResources]);

  // Format file size as percentage of total repo size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes || !totalRepoSize) return "<1%";
    const percentage = (bytes / totalRepoSize) * 100;
    return percentage < 1 ? "<1%" : `${Math.round(percentage)}%`;
  };

  // Format file size in human-readable format (KB, MB, etc.)
  const formatBytesSize = (bytes?: number): string => {
    if (!bytes) return "<1KB";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
  };

  // Calculate directory size (sum of all files in the directory)
  const getDirectorySize = (dir: GitHubFile): number => {
    // If children are loaded, calculate based on them
    if (dir.children && dir.children.length > 0) {
      return dir.children.reduce((total, file) => {
        if (file.type === "file" && file.size) {
          return total + file.size;
        } else if (file.type === "dir") {
          return total + getDirectorySize(file);
        }
        return total;
      }, 0);
    }

    // If directory has no children yet (not expanded), estimate size
    // This will be updated when the directory is expanded
    return dir.estimatedSize || 0;
  };

  // Calculate total repository size including all files (even in collapsed directories)
  const calculateTotalSize = (files: GitHubFile[]): number => {
    return files.reduce((total, file) => {
      if (file.type === "file" && file.size) {
        return total + file.size;
      } else if (
        file.type === "dir" &&
        file.children &&
        file.children.length > 0
      ) {
        // Recursively calculate size for all directories with children
        return total + calculateTotalSize(file.children);
      } else if (file.type === "dir") {
        // For unexpanded directories, use the cached size from getDirectorySize
        return total + getDirectorySize(file);
      }
      return total;
    }, 0);
  };

  // Filter out package-lock.json, configuration files, and other unwanted files
  const filterOutConfigFiles = (files: GitHubFile[]): GitHubFile[] => {
    const filesToFilter = [
      // Package management files
      "package-lock.json",
      "yarn.lock",
      "npm-shrinkwrap.json",
      "pnpm-lock.yaml",

      // System files
      ".DS_Store",
      "Thumbs.db",

      // Git files
      ".gitignore",
      ".gitattributes",
      ".gitmodules",

      // Editor config files
      ".editorconfig",
      ".vscode",
      ".idea",

      // Linting and formatting
      ".eslintrc",
      ".eslintrc.js",
      ".eslintrc.json",
      ".eslintrc.yml",
      ".eslintignore",
      ".prettierrc",
      ".prettierrc.js",
      ".prettierrc.json",
      ".prettierrc.yml",
      ".prettierignore",

      // Build and CI config
      ".travis.yml",
      ".github",
      ".gitlab-ci.yml",
      ".circleci",
      "Jenkinsfile",

      // Misc config files
      ".env.example",
      ".babelrc",
      "tsconfig.json",
      "jest.config.js",
      "webpack.config.js",
      "rollup.config.js",
    ];

    return files.filter((file) => {
      // Check if the file name exactly matches any in our filter list
      if (filesToFilter.includes(file.name)) {
        return false;
      }

      // Check for files with extensions like .config.js or .rc
      if (/\.(config|rc)(\.js|\.json|\.yml|\.yaml)?$/.test(file.name)) {
        return false;
      }

      return true;
    });
  };

  // Reset selected files when repo changes
  useEffect(() => {
    setSelectedFiles([]);
    setFiles([]);
    setExpandedPaths(new Set());
  }, [repo.full_name]);

  // Fetch root level files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRepoContents(repo.full_name);

        // Filter out configuration files
        const filteredData = filterOutConfigFiles(data);
        setFiles(filteredData);

        // Calculate total repository size
        const totalSize = calculateTotalSize(filteredData);
        setTotalRepoSize(totalSize);

        // Prefetch first level directory contents for better size calculations
        prefetchFirstLevelDirectories(filteredData);
      } catch (err) {
        setError("Failed to load repository contents");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [repo.full_name]);

  // Prefetch first level directories to get their sizes
  const prefetchFirstLevelDirectories = async (
    files: GitHubFile[],
    depth = 0,
    maxDepth = 2
  ) => {
    // Create a copy of files to work with
    let updatedFiles = [...files];

    // Get all directories without children
    const dirsToFetch = files.filter(
      (file) =>
        file.type === "dir" && (!file.children || file.children.length === 0)
    );

    // Process each directory
    for (const dir of dirsToFetch) {
      try {
        // Fetch contents of the directory
        const children = await fetchRepoContents(repo.full_name, dir.path);

        // Filter out configuration files
        const filteredChildren = filterOutConfigFiles(children);

        // Calculate directory size
        const dirSize = filteredChildren.reduce((total, file) => {
          return total + (file.size || 0);
        }, 0);

        // Update the directory with estimated size and children
        const dirWithChildren = {
          ...dir,
          children: filteredChildren,
          estimatedSize: dirSize,
        };

        // Update the files array with the new directory
        updatedFiles = updateFileTreeWithChildren(
          updatedFiles,
          dir.path,
          filteredChildren,
          false // Don't mark as expanded
        );

        // Continue prefetching deeper if needed
        if (depth < maxDepth && filteredChildren.length > 0) {
          const deeperUpdatedFiles = await prefetchFirstLevelDirectories(
            filteredChildren,
            depth + 1,
            maxDepth
          );

          // Update the current directory's children with the deeper updated files
          updatedFiles = updateFileTreeWithChildren(
            updatedFiles,
            dir.path,
            deeperUpdatedFiles,
            false // Don't mark as expanded
          );
        }
      } catch (error) {
        console.error(`Error prefetching ${dir.path}:`, error);
      }
    }

    // Only set state at the top level to avoid infinite loops
    if (depth === 0) {
      setFiles(updatedFiles);

      // Recalculate total size
      const totalSize = calculateTotalSize(updatedFiles);
      setTotalRepoSize(totalSize);
    }

    return updatedFiles;
  };

  // Recalculate total size whenever expanded paths change
  useEffect(() => {
    if (files.length > 0) {
      const totalSize = calculateTotalSize(files);
      setTotalRepoSize(totalSize);
    }
  }, [expandedPaths, files]);

  // Toggle folder expansion
  const toggleExpand = async (file: GitHubFile) => {
    if (file.type !== "dir") return;

    // Toggle expanded state
    const newExpandedPaths = new Set(expandedPaths);
    if (newExpandedPaths.has(file.path)) {
      newExpandedPaths.delete(file.path);
      setExpandedPaths(newExpandedPaths);
      return;
    }

    // If expanding and no children yet, fetch them
    if (!file.children || file.children.length === 0) {
      try {
        setIsLoading(true);
        const children = await fetchRepoContents(repo.full_name, file.path);

        // Filter out configuration files
        const filteredChildren = filterOutConfigFiles(children);

        // Update the file tree with the new children
        const updatedFiles = updateFileTreeWithChildren(
          files,
          file.path,
          filteredChildren
        );
        setFiles(updatedFiles);
      } catch (error) {
        console.error(`Error fetching directory contents: ${error}`);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Mark as expanded
    newExpandedPaths.add(file.path);
    setExpandedPaths(newExpandedPaths);
  };

  // Update file tree with children for a specific path
  const updateFileTreeWithChildren = (
    files: GitHubFile[],
    path: string,
    children: GitHubFile[],
    markAsExpanded = true
  ): GitHubFile[] => {
    return files.map((file) => {
      if (file.path === path) {
        // Calculate total size of children for consistency
        const dirSize = children.reduce((total, child) => {
          if (child.type === "file" && child.size) {
            return total + child.size;
          }
          return total;
        }, 0);

        return {
          ...file,
          children,
          estimatedSize: dirSize, // Store size for consistency
        };
      } else if (file.type === "dir" && file.children) {
        return {
          ...file,
          children: updateFileTreeWithChildren(
            file.children,
            path,
            children,
            markAsExpanded
          ),
        };
      }
      return file;
    });
  };

  // Calculate total size of selected files
  const calculateSelectedSize = (files: GitHubFile[]): number => {
    return files.reduce((total, file) => {
      if (file.type === "file" && file.size) {
        return total + file.size;
      } else if (file.type === "dir" && file.estimatedSize) {
        return total + file.estimatedSize;
      }
      return total + (file.type === "file" ? 1024 : 10 * 1024); // Default estimates
    }, 0);
  };

  // Update selected size when selected files change
  useEffect(() => {
    const newSelectedSize = calculateSelectedSize(selectedFiles);
    setSelectedSize(newSelectedSize);

    // Calculate total size with current resources plus selected files
    const currentUsage = calculateTotalResourceSize(currentResources);
    const totalUsage = currentUsage + newSelectedSize;

    // Check if total usage exceeds the limit
    setLimitExceeded(totalUsage > MAX_RESOURCE_SIZE_BYTES);
  }, [selectedFiles, currentResources]);

  // Toggle file/folder selection
  const toggleSelection = (file: GitHubFile) => {
    const updatedFiles = toggleFileSelection(files, file.path);
    setFiles(updatedFiles);

    // Update selected files list
    const allSelected = getAllSelectedFiles(updatedFiles);
    setSelectedFiles(allSelected);
  };

  // Toggle selection for a file and its children
  const toggleFileSelection = (
    files: GitHubFile[],
    path: string
  ): GitHubFile[] => {
    return files.map((file) => {
      if (file.path === path) {
        const newSelected = !file.selected;

        if (file.children && file.children.length > 0) {
          // If it's a directory, select/deselect all children
          const updatedChildren = file.children.map((child) => ({
            ...child,
            selected: newSelected,
            partialSelected: false,
            children: child.children
              ? child.children.map((grandchild) => ({
                  ...grandchild,
                  selected: newSelected,
                  partialSelected: false,
                }))
              : undefined,
          }));

          return {
            ...file,
            selected: newSelected,
            partialSelected: false,
            children: updatedChildren,
          };
        } else {
          // If it's a file, just toggle its selection
          return { ...file, selected: newSelected };
        }
      } else if (file.children && file.children.length > 0) {
        // Recursively update children
        const updatedChildren = toggleFileSelection(file.children, path);

        // Calculate selection state based on children
        const selectedCount = updatedChildren.filter(
          (child) => child.selected || child.partialSelected
        ).length;

        const isPartiallySelected =
          selectedCount > 0 && selectedCount < updatedChildren.length;
        const isFullySelected = selectedCount === updatedChildren.length;

        return {
          ...file,
          children: updatedChildren,
          selected: isFullySelected,
          partialSelected: isPartiallySelected,
        };
      }
      return file;
    });
  };

  // Get all selected files (flattened), grouping complete folders
  const getAllSelectedFiles = (files: GitHubFile[]): GitHubFile[] => {
    let selected: GitHubFile[] = [];

    const isEntireFolderSelected = (folder: GitHubFile): boolean => {
      if (!folder.children) return false;
      return folder.children.every((child) =>
        child.type === "file"
          ? child.selected
          : child.selected || (child.children && isEntireFolderSelected(child))
      );
    };

    const processDirectory = (dir: GitHubFile): GitHubFile[] => {
      // If the entire directory is selected, return it as one unit
      if (dir.selected && isEntireFolderSelected(dir)) {
        return [
          {
            ...dir,
            children: undefined, // Remove children as we're treating it as one unit
          },
        ];
      }

      // Otherwise, process children individually
      let results: GitHubFile[] = [];
      if (dir.children) {
        for (const child of dir.children) {
          if (child.type === "dir") {
            if (child.selected && isEntireFolderSelected(child)) {
              // If this subdirectory is fully selected, add it as one unit
              results.push({
                ...child,
                children: undefined,
              });
            } else if (child.children) {
              // Otherwise process its children
              results = [...results, ...processDirectory(child)];
            }
          } else if (child.selected) {
            // Add individual selected files
            results.push(child);
          }
        }
      }
      return results;
    };

    for (const file of files) {
      if (file.type === "dir") {
        selected = [...selected, ...processDirectory(file)];
      } else if (file.selected) {
        selected.push(file);
      }
    }

    return selected;
  };

  // Handle adding selected files
  const handleAddFiles = () => {
    if (limitExceeded) {
      return; // Prevent adding if limit exceeded
    }
    onAddFiles(selectedFiles);
  };

  // Render file tree recursively
  const renderFileTree = (files: GitHubFile[]) => {
    return (
      <ul className="space-y-1">
        {files.map((file) => (
          <li key={file.path}>
            <div className="flex items-center py-1">
              {file.type === "dir" ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(file);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {expandedPaths.has(file.path) ? (
                        <ChevronDownIcon size={16} className="text-gray-500" />
                      ) : (
                        <ChevronRightIcon size={16} className="text-gray-500" />
                      )}
                    </button>
                    <div
                      className="flex items-center justify-between flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded py-0.5 pl-0.5 pr-2 cursor-pointer"
                      onClick={() => toggleSelection(file)}
                    >
                      <div className="flex items-center">
                        <div className="relative ml-1">
                          <input
                            type="checkbox"
                            checked={!!(file.selected || file.partialSelected)}
                            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                              file.partialSelected ? "opacity-0" : ""
                            }`}
                            onChange={() => toggleSelection(file)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          {file.partialSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-600 rounded pointer-events-none">
                              <div className="w-2 h-0.5 bg-white"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center ml-1">
                          <FileDirectoryIcon
                            size={16}
                            className={`ml-1 mr-2 ${
                              file.selected || file.partialSelected
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          />
                          <span
                            className={
                              file.selected || file.partialSelected
                                ? "text-blue-600"
                                : ""
                            }
                          >
                            {file.name}
                          </span>
                        </div>
                      </div>

                      {/* Directory size */}
                      <div
                        className="text-right text-xs text-gray-400 pr-2 flex items-center gap-2"
                        title={`${formatBytesSize(getDirectorySize(file))}`}
                      >
                        <span>{formatBytesSize(getDirectorySize(file))}</span>
                        <span className="text-gray-300">|</span>
                        <span>{formatFileSize(getDirectorySize(file))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div
                    className="flex items-center justify-between flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded py-0.5 pl-0.5 pr-2 cursor-pointer"
                    onClick={() => toggleSelection(file)}
                  >
                    <div className="flex items-center">
                      <div className="w-8" />{" "}
                      {/* Spacer to align with folder items */}
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={file.selected}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={() => toggleSelection(file)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex items-center ml-1">
                        <FileIcon
                          size={16}
                          className={`ml-1 mr-2 ${
                            file.selected ? "text-blue-600" : "text-gray-500"
                          }`}
                        />
                        <span className={file.selected ? "text-blue-600" : ""}>
                          {file.name}
                        </span>
                      </div>
                    </div>

                    {/* File size */}
                    <div
                      className="text-right text-xs text-gray-400 pr-2 flex items-center gap-2"
                      title={`${formatBytesSize(file.size)}`}
                    >
                      <span>{formatBytesSize(file.size)}</span>
                      <span className="text-gray-300">|</span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {file.type === "dir" &&
              expandedPaths.has(file.path) &&
              file.children && (
                <div className="ml-6">{renderFileTree(file.children)}</div>
              )}
          </li>
        ))}
      </ul>
    );
  };

  // Calculate percentage used of total limit
  const getUsagePercentage = (): number => {
    return Math.min(100, (selectedSize / MAX_RESOURCE_SIZE_BYTES) * 100);
  };

  // Calculate total usage percentage (current resources + selected files)
  const getTotalUsagePercentage = (): number => {
    const currentUsage = calculateTotalResourceSize(currentResources);
    const totalUsage = currentUsage + selectedSize;
    return Math.min(100, (totalUsage / MAX_RESOURCE_SIZE_BYTES) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[600px] max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <div className="flex items-center">
            <RepoIcon
              size={16}
              className="mr-2 text-gray-700 dark:text-gray-300"
            />
            <span className="font-medium">{repo.full_name}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <XIcon size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Find a file..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between text-xs font-medium text-gray-500">
        <div className="flex-1">Name</div>
        <div className="w-40 text-right pr-2">Size</div>
      </div>

      <div className="h-[400px] overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Loading files...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          renderFileTree(files)
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          {/* Usage indicator */}
          <div className="flex items-center gap-2">
            {limitExceeded && (
              <span className="text-xs text-red-500 flex items-center">
                <AlertIcon size={12} className="mr-1" />
                Limit exceeded
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {formatBytesSize(selectedSize)} selected
              </span>
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    limitExceeded
                      ? "bg-red-500"
                      : getTotalUsagePercentage() > 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${getTotalUsagePercentage()}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {getTotalUsagePercentage().toFixed(1)}% of 5MB
              </span>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={handleAddFiles}
            disabled={selectedFiles.length === 0 || limitExceeded}
            className={`px-4 py-1.5 rounded-md text-sm text-white ${
              selectedFiles.length === 0 || limitExceeded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            title={
              limitExceeded
                ? "Remove some files to get under the limit"
                : selectedFiles.length === 0
                ? "Select files to add"
                : "Add selected files"
            }
          >
            Add {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
          </button>
        </div>
      </div>

      {limitExceeded && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/20">
          <div className="text-xs text-red-500 flex items-center justify-center">
            <AlertIcon size={12} className="mr-1" />
            Remove some files to get under the limit
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for the repo icon
function RepoIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
      ></path>
    </svg>
  );
}

function ChevronLeftIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z"
      ></path>
    </svg>
  );
}
