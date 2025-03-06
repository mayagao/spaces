"use client";

import { useState, useEffect } from "react";
import {
  XIcon,
  SearchIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FileIcon,
  FileDirectoryIcon,
} from "@primer/octicons-react";
import {
  fetchRepoContents,
  type GitHubFile,
  type GitHubRepo,
} from "../../../../services/githubService";

interface FileTreeProps {
  repo: GitHubRepo;
  onBack: () => void;
  onClose: () => void;
  onAddFiles: (files: GitHubFile[]) => void;
}

export function FileTree({ repo, onBack, onClose, onAddFiles }: FileTreeProps) {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<GitHubFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRepoSize, setTotalRepoSize] = useState(0);

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

  // Get all selected files (flattened)
  const getAllSelectedFiles = (files: GitHubFile[]): GitHubFile[] => {
    let selected: GitHubFile[] = [];

    for (const file of files) {
      if (file.selected) {
        selected.push(file);
      }

      if (file.children && file.children.length > 0) {
        selected = [...selected, ...getAllSelectedFiles(file.children)];
      }
    }

    return selected;
  };

  // Handle adding selected files
  const handleAddFiles = () => {
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
                        className="text-right text-xs text-gray-400 pr-2"
                        title={`${formatBytesSize(
                          getDirectorySize(file)
                        )} (${formatFileSize(
                          getDirectorySize(file)
                        )} of repository)`}
                      >
                        {formatFileSize(getDirectorySize(file))}
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
                      className="text-right text-xs text-gray-400 pr-2"
                      title={`${formatBytesSize(file.size)} (${formatFileSize(
                        file.size
                      )} of repository)`}
                    >
                      {formatFileSize(file.size)}
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[512px] mx-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <ChevronRightIcon size={16} className="transform rotate-180" />
          </button>
          <h2 className="text-lg font-semibold flex items-center">
            <RepoIcon size={16} className="mr-2" />
            {repo.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <XIcon size={16} />
        </button>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
        <div className="w-16 text-right pr-2">Size</div>
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

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          onClick={onBack}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
        >
          Back
        </button>
        <button
          onClick={handleAddFiles}
          disabled={selectedFiles.length === 0}
          className={`px-4 py-1.5 rounded-md text-sm text-white ${
            selectedFiles.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Add {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
        </button>
      </div>
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
