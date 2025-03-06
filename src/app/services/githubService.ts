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

// API key will be provided by the user
let apiKey = "";

export const setGitHubApiKey = (key: string) => {
  apiKey = key;
};

// Fetch user repositories
export const fetchUserRepos = async (
  username: string = "mayagao"
): Promise<GitHubRepo[]> => {
  try {
    // For development, return mock data if no API key is provided
    if (!apiKey) {
      return mockRepos;
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
    return data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      full_name: repo.full_name,
    }));
  } catch (error) {
    console.error("Error fetching repositories:", error);
    console.error("Error fetching repositories:", error);
    return mockRepos; // Fallback to mock data
  }
};

// Fetch repository contents (files and folders)
export const fetchRepoContents = async (
  repoFullName: string,
  path: string = ""
): Promise<GitHubFile[]> => {
  try {
    // For development, return mock data if no API key is provided
    if (!apiKey) {
      return mockFileTree;
    }

    const url = `https://api.github.com/repos/${repoFullName}/contents/${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response into our GitHubFile format
    return Array.isArray(data)
      ? data.map((item) => ({
          path: item.path,
          type: item.type === "dir" ? "dir" : "file",
          name: item.name,
          size: item.size,
          selected: false,
          children: item.type === "dir" ? [] : undefined,
        }))
      : [];
  } catch (error) {
    console.error("Error fetching repository contents:", error);
    return mockFileTree; // Fallback to mock data
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
