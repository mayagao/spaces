"use client";

// GitHub API service for fetching repositories and file trees

// Types
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  full_name: string;
}

export interface GitHubFile {
  path: string;
  type: "file" | "dir";
  name: string;
  size?: number;
  children?: GitHubFile[];
  selected?: boolean;
  partialSelected?: boolean;
  estimatedSize?: number; // Estimated size for directories before expansion
}

// Get API key from environment variables
const getApiKey = (): string => {
  const key = process.env.NEXT_PUBLIC_GITHUB_API_KEY || "";

  // Debug info about the key (without revealing the full key)
  if (key) {
    const keyStart = key.substring(0, 4);
    const keyLength = key.length;
    console.log(
      `GitHub API key found: ${keyStart}... (${keyLength} characters)`
    );
  } else {
    console.warn("No GitHub API key found in environment variables");
  }

  return key;
};

// API key will be provided by the user or from environment
let apiKey = getApiKey();

export const setGitHubApiKey = (key: string) => {
  if (key) {
    const keyStart = key.substring(0, 4);
    const keyLength = key.length;
    console.log(
      `Setting GitHub API key: ${keyStart}... (${keyLength} characters)`
    );
    apiKey = key;
  } else {
    console.log(
      "No key provided to setGitHubApiKey, using environment variable"
    );
    apiKey = getApiKey();
  }
};

// Fetch user repositories
export const fetchUserRepos = async (
  username: string = "mayagao"
): Promise<GitHubRepo[]> => {
  try {
    // For development, return empty array if no API key is provided
    if (!apiKey) {
      console.warn("GitHub API key is missing");
      return []; // Return empty array instead of throwing error
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: {
          Authorization: `token ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.map(
      (repo: {
        id: number;
        name: string;
        description: string | null;
        full_name: string;
      }) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        full_name: repo.full_name,
      })
    );
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error; // Re-throw other errors
  }
};

// Cache for repository contents
const repoContentsCache: {
  [key: string]: { data: GitHubFile[]; timestamp: number };
} = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch repository contents using Git Tree API (faster than Contents API)
export const fetchRepoContents = async (
  owner: string,
  repo: string,
  path: string = ""
): Promise<GitHubFile[]> => {
  try {
    // Check cache first
    const cacheKey = `${owner}/${repo}/${path}`;
    const cached = repoContentsCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Using cached data for ${cacheKey}`);
      return cached.data;
    }

    if (!apiKey) {
      console.warn("GitHub API key is missing");
      return [];
    }

    // First get the default branch
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `token ${apiKey}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch;

    // Get the entire tree in one request
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    console.log(`Fetching repo tree from: ${treeUrl}`);

    const response = await fetch(treeUrl, {
      headers: {
        Authorization: `token ${apiKey}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error (${response.status}): ${errorText}`);
      throw new Error(
        `GitHub API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.tree) {
      console.error("Unexpected API response format:", data);
      return [];
    }

    // Convert flat tree into hierarchical structure
    const root: { [key: string]: GitHubFile } = {};
    const dirs: { [key: string]: GitHubFile } = {};

    // First pass: create all file and directory objects
    data.tree.forEach((item: any) => {
      if (!item || typeof item.path !== "string") {
        console.warn("Skipping invalid tree item:", item);
        return;
      }

      const parts = item.path.split("/");
      const name = parts[parts.length - 1];
      // In Git Tree API, blob = file, tree = directory
      const isDir = item.type === "tree";

      // Create parent directories if they don't exist
      if (parts.length > 1) {
        const parentPath = parts.slice(0, -1).join("/");
        if (!dirs[parentPath]) {
          dirs[parentPath] = {
            path: parentPath,
            type: "dir",
            name: parts[parts.length - 2],
            selected: false,
            children: [],
          };
        }
      }

      const file: GitHubFile = {
        path: item.path,
        type: isDir ? "dir" : "file",
        name,
        size: item.size || 0,
        selected: false,
        children: isDir ? [] : undefined,
      };

      if (isDir) {
        dirs[item.path] = file;
      }

      // Store in root if it's a top-level item or matches the requested path
      if (
        (!path && parts.length === 1) ||
        (path && item.path.startsWith(path))
      ) {
        root[item.path] = file;
      }
    });

    // Second pass: build the tree structure
    Object.values(dirs).forEach((dir) => {
      const parts = dir.path.split("/");
      if (parts.length > 1) {
        const parentPath = parts.slice(0, -1).join("/");
        const parent = dirs[parentPath];
        if (parent?.children) {
          // Only add if not already present
          if (!parent.children.some((c) => c.path === dir.path)) {
            parent.children.push(dir);
          }
        }
      }
    });

    // Add files to their parent directories
    data.tree.forEach((item: any) => {
      if (item.type === "blob") {
        const parts = item.path.split("/");
        if (parts.length > 1) {
          const parentPath = parts.slice(0, -1).join("/");
          const parent = dirs[parentPath];
          if (parent?.children) {
            const file: GitHubFile = {
              path: item.path,
              type: "file",
              name: parts[parts.length - 1],
              size: item.size || 0,
              selected: false,
            };
            // Only add if not already present
            if (!parent.children.some((c) => c.path === file.path)) {
              parent.children.push(file);
            }
          }
        }
      }
    });

    // Get the final result based on the requested path
    let result: GitHubFile[];
    if (path) {
      // If path is specified, return its children
      result = dirs[path]?.children || [];
    } else {
      // For root level, combine top-level directories and files
      result = Object.values(root)
        .filter(Boolean)
        .sort((a, b) => {
          // Sort directories first, then files
          if (a.type === "dir" && b.type === "file") return -1;
          if (a.type === "file" && b.type === "dir") return 1;
          return a.name.localeCompare(b.name);
        });
    }

    console.log(
      `Filtered File Tree: (${result.length})`,
      result.map((item) => ({
        path: item.path,
        type: item.type,
        size: item.size,
        childCount: item.children?.length,
      }))
    );

    // Cache the result
    repoContentsCache[cacheKey] = {
      data: result,
      timestamp: Date.now(),
    };

    return result;
  } catch (error) {
    console.error("Error fetching repository contents:", error);
    throw error;
  }
};

// Mock data for development
const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "copilot-api",
    full_name: "user/copilot-api",
    description: "The engineering system of AI at GitHub",
  },
  {
    id: 2,
    name: "blackbird",
    full_name: "user/blackbird",
    description: "GitHub's high flying blazingly fast code search engine",
  },
  {
    id: 3,
    name: "sparkles",
    full_name: "user/sparkles",
    description: "Sparkles the Service™",
  },
  {
    id: 4,
    name: "docsql",
    full_name: "user/docsql",
    description: "A docsQL instance for the GitHub Docs content",
  },
  {
    id: 5,
    name: "feature-management-client-go",
    full_name: "user/feature-management-client-go",
    description: "go based clients for interacting with feature flags",
  },
  {
    id: 6,
    name: "codeql-dca-main",
    full_name: "user/codeql-dca-main",
    description: "No description",
  },
  {
    id: 7,
    name: "github",
    full_name: "user/github",
    description: "You are looking at it",
  },
];

// Mock file tree for development
const mockFileTree: GitHubFile[] = [
  {
    path: ".github",
    name: ".github",
    type: "dir",
    selected: false,
    children: [],
  },
  {
    path: ".devcontainer",
    name: ".devcontainer",
    type: "dir",
    selected: false,
    children: [],
  },
  {
    path: "cmd",
    name: "cmd",
    type: "dir",
    selected: false,
    children: [],
  },
  {
    path: "magefiles",
    name: "magefiles",
    type: "dir",
    selected: false,
    children: [],
  },
  {
    path: "docs",
    name: "docs",
    type: "dir",
    selected: false,
    children: [],
  },
  {
    path: "pkg",
    name: "pkg",
    type: "dir",
    selected: false,
    children: [
      {
        path: "pkg/abuse",
        name: "abuse",
        type: "dir",
        selected: false,
        children: [],
      },
    ],
  },
  {
    path: "README.md",
    name: "README.md",
    type: "file",
    size: 8432,
    selected: false,
  },
  {
    path: "LICENSE",
    name: "LICENSE",
    type: "file",
    size: 1073,
    selected: false,
  },
  {
    path: "package.json",
    name: "package.json",
    type: "file",
    size: 2048,
    selected: false,
  },
  {
    path: "package-lock.json",
    name: "package-lock.json",
    type: "file",
    size: 250000, // Realistically large but not overwhelming
    selected: false,
  },
  {
    path: "tsconfig.json",
    name: "tsconfig.json",
    type: "file",
    size: 512,
    selected: false,
  },
  {
    path: ".gitignore",
    name: ".gitignore",
    type: "file",
    size: 374,
    selected: false,
  },
];
