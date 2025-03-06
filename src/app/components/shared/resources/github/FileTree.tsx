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
  RepoIcon,
  ChevronLeftIcon,
} from "@primer/octicons-react";
import {
  fetchRepoContents,
  type GitHubFile,
  type GitHubRepo,
} from "../../../../services/githubService";
import {
  MAX_RESOURCE_SIZE_BYTES,
  calculateTotalResourceSize,
} from "../utils/resourceSizeUtils";
import { Resource } from "../ResourceItem";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FileTreeProps {
  repo: GitHubRepo;
  onBack: () => void;
  onClose: () => void;
  onAddFiles: (files: GitHubFile[]) => void;
  currentResources: Resource[]; // Current resources to calculate remaining space
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
  const [availableSpace, setAvailableSpace] = useState(MAX_RESOURCE_SIZE_BYTES);
  const [limitExceeded, setLimitExceeded] = useState(false);

  // Convert Resource to GitHubFile for internal use
  const convertToGitHubFiles = (resources: Resource[]): GitHubFile[] => {
    return resources.map((resource) => ({
      path: resource.id,
      name: resource.name,
      type: resource.type === "directory" ? "dir" : "file",
      size: resource.fileSize,
      selected: false,
    }));
  };

  // Convert GitHubFile to Resource for external use
  const convertToResources = (files: GitHubFile[]): Resource[] => {
    return files.map((file) => ({
      id: file.path,
      name: file.name,
      type: file.type === "dir" ? "directory" : "file",
      fileSize: file.size,
      source: repo.full_name,
    }));
  };

  // Calculate remaining space based on current resources
  useEffect(() => {
    // Use the utility function to convert Resource to GitHubFile
    const gitHubFiles = convertToGitHubFiles(currentResources);
    // Then convert back to Resource for the calculation function
    const resourcesForCalculation = convertToResources(gitHubFiles);
    const currentUsage = calculateTotalResourceSize(resourcesForCalculation);
    const remaining = MAX_RESOURCE_SIZE_BYTES - currentUsage;
    setAvailableSpace(remaining);

    // Check if limit would be exceeded
    setLimitExceeded(remaining <= 0);
  }, [currentResources, repo.full_name]);

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

        console.log("Raw GitHub API Response:", data);

        // Filter out configuration files
        const filteredData = filterOutConfigFiles(data);
        console.log("Filtered File Tree:", filteredData);

        setFiles(filteredData);

        // Calculate total repository size
        const totalSize = calculateTotalSize(filteredData);
        console.log("Total Repository Size:", formatBytesSize(totalSize));
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
        const updatedDir = {
          ...dir,
          children: filteredChildren,
          estimatedSize: dirSize,
        };

        // Update the files array with the new directory
        updatedFiles = updateFileTreeWithChildren(
          updatedFiles,
          dir.path,
          [updatedDir],
          false
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
            false
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

        console.log(`Directory Contents (${file.path}):`, children);

        // Filter out configuration files
        const filteredChildren = filterOutConfigFiles(children);
        console.log(
          `Filtered Directory Contents (${file.path}):`,
          filteredChildren
        );

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
    const result = files.map((file) => {
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

    if (markAsExpanded) {
      setFiles(result);
    }

    return result;
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
    // Helper function to check if a folder is entirely selected
    const isEntireFolderSelected = (folder: GitHubFile): boolean => {
      if (!folder.children) return folder.selected || false;
      return (
        (folder.selected || false) &&
        folder.children.every((child) =>
          child.type === "dir"
            ? isEntireFolderSelected(child)
            : child.selected || false
        )
      );
    };

    return files.map((file) => {
      if (file.path === path) {
        const newSelected = !file.selected;
        const result = {
          ...file,
          selected: newSelected,
          partialSelected: false,
        };

        if (file.children && file.children.length > 0) {
          // If it's a directory, select/deselect all children recursively
          result.children = file.children.map((child) => {
            const updatedChild = {
              ...child,
              selected: newSelected,
              partialSelected: false,
            };
            if (child.children) {
              return {
                ...updatedChild,
                children: toggleFileSelection(child.children, child.path),
              };
            }
            return updatedChild;
          });
        }

        return result;
      } else if (file.children && file.children.length > 0) {
        // Recursively update children
        const updatedChildren = toggleFileSelection(file.children, path);
        const allSelected = updatedChildren.every((child) =>
          child.type === "dir"
            ? isEntireFolderSelected(child)
            : child.selected || false
        );
        const someSelected = updatedChildren.some(
          (child) => child.selected || false || child.partialSelected || false
        );

        return {
          ...file,
          children: updatedChildren,
          selected: allSelected,
          partialSelected: !allSelected && someSelected,
        };
      }
      return file;
    });
  };

  // Get all selected files (flattened), grouping complete folders
  const getAllSelectedFiles = (files: GitHubFile[]): GitHubFile[] => {
    const result: GitHubFile[] = [];

    // Simple recursive function to collect selected items
    const collectSelected = (items: GitHubFile[]): void => {
      for (const item of items) {
        // If this is a selected folder, add it as a single item without children
        if (item.type === "dir" && item.selected) {
          result.push({
            ...item,
            children: undefined, // Remove children as we're treating it as one unit
          });
        }
        // If this is a selected file, add it
        else if (item.type === "file" && item.selected) {
          result.push(item);
        }
        // If this is a non-selected folder but has children, check its children
        else if (item.type === "dir" && item.children) {
          collectSelected(item.children);
        }
      }
    };

    collectSelected(files);
    return result;
  };

  // Handle adding selected files
  const handleAddFiles = () => {
    if (limitExceeded) {
      return; // Prevent adding if limit exceeded
    }
    onAddFiles(selectedFiles);
  };

  // Add this new function to handle select all
  const handleSelectAll = () => {
    const allSelected = files.every((file) => file.selected);
    const updatedFiles = files.map((file) => ({
      ...file,
      selected: !allSelected,
      partialSelected: false,
      ...(file.children && {
        children: toggleAllInDirectory(file.children, !allSelected),
      }),
    }));
    setFiles(updatedFiles);
    const allSelectedFiles = getAllSelectedFiles(updatedFiles);
    setSelectedFiles(allSelectedFiles);
  };

  // Helper function to toggle all files in a directory
  const toggleAllInDirectory = (
    files: GitHubFile[],
    selected: boolean
  ): GitHubFile[] => {
    return files.map((file) => ({
      ...file,
      selected,
      partialSelected: false,
      ...(file.children && {
        children: toggleAllInDirectory(file.children, selected),
      }),
    }));
  };

  // Render file tree recursively
  const renderFileTree = (files: GitHubFile[]) => {
    return (
      <ul className="">
        {files.map((file) => (
          <li key={file.path}>
            <div className="flex items-center">
              {file.type === "dir" ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(file);
                      }}
                      className="px-1 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {expandedPaths.has(file.path) ? (
                        <ChevronDownIcon size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRightIcon size={16} className="text-gray-400" />
                      )}
                    </button>
                    <div
                      className="py-2 flex items-center justify-between flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded py-0.5 pl-0.5 pr-2 cursor-pointer"
                      onClick={() => toggleSelection(file)}
                    >
                      <div className="flex items-center">
                        <div className="relative ml-1 flex items-center">
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
                        <div className="flex items-center ml-1 text-sm">
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
                        <span>{formatFileSize(getDirectorySize(file))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div
                    className="py-2 flex items-center justify-between flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded py-0.5 pl-0.5 pr-2 cursor-pointer"
                    onClick={() => toggleSelection(file)}
                  >
                    <div className="flex items-center">
                      <div className="w-7" />{" "}
                      {/* Spacer to align with folder items */}
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={file.selected}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          onChange={() => toggleSelection(file)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex items-center ml-1 text-sm">
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

  // This function is used in the UI to show the percentage of selected files
  const getSelectedPercentage = (): number => {
    return Math.min(100, (selectedSize / MAX_RESOURCE_SIZE_BYTES) * 100);
  };

  // Calculate total usage percentage (current resources + selected files)
  const getTotalUsagePercentage = (): number => {
    // Calculate size of current resources
    const currentUsage = calculateTotalResourceSize(currentResources);
    // Add size of newly selected files
    const totalUsage = currentUsage + selectedSize;
    // Calculate percentage based on total available space
    return Math.min(100, (totalUsage / MAX_RESOURCE_SIZE_BYTES) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[600px] max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="h-[48px] flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <div className="flex items-center">
            <RepoIcon
              size={16}
              className="mr-2 text-gray-500 dark:text-gray-300"
            />
            <span className="font-semibold text-sm">{repo.full_name}</span>
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
          <Input
            type="text"
            className="pl-10"
            placeholder="Find a file or folder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
        <a
          onClick={handleSelectAll}
          className="text-sm hover:text-blue-600 cursor-pointer text-gray-500"
        >
          {files.every((file) => file.selected) ? "Deselect all" : "Select all"}
        </a>
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
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} selections`
                  : ""}
              </span>
              <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-300 bg-green-500"
                  style={{ width: `${getTotalUsagePercentage()}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {getTotalUsagePercentage().toFixed(1)}% used
              </span>
            </div>
          </div>

          {/* Add button */}
          <Button
            onClick={handleAddFiles}
            disabled={selectedFiles.length === 0 || limitExceeded}
            className={`px-4 py-1.5 rounded-md text-sm text-white ${
              selectedFiles.length === 0 || limitExceeded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-800"
            }`}
            title={
              limitExceeded
                ? "Remove some files to get under the limit"
                : selectedFiles.length === 0
                ? "Select files to add"
                : "Add selected files"
            }
          >
            Add
          </Button>
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
