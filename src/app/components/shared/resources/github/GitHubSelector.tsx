"use client";

import { useState, useEffect } from "react";
import { RepoList } from "./RepoList";
import { FileTree } from "./FileTree";
import {
  setGitHubApiKey,
  type GitHubRepo,
  type GitHubFile,
} from "../../../../services/githubService";
import { Resource } from "../ResourceItem";

interface GitHubSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResources: (resources: Resource[]) => void;
  currentResources: Resource[];
}

export function GitHubSelector({
  isOpen,
  onClose,
  onAddResources,
  currentResources = [],
}: GitHubSelectorProps) {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [view, setView] = useState<"repos" | "files">("repos");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<GitHubFile[]>([]);

  // Set GitHub API key from environment variable
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GITHUB_API_KEY;
    if (!apiKey) {
      console.warn("GitHub API key not found in environment variables");
      return;
    }
    setGitHubApiKey(apiKey);
  }, []);

  if (!isOpen) return null;

  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setView("files");
    // Clear any previously selected files when switching repos
    if (selectedFiles?.length > 0) {
      setSelectedFiles([]);
    }
  };

  const handleBackToRepos = () => {
    setView("repos");
    // Clear selected files when going back to repo list
    if (selectedFiles?.length > 0) {
      setSelectedFiles([]);
    }
  };

  const handleAddFiles = (files: GitHubFile[]) => {
    // Check if a file is a code file based on extension
    const isCodeFile = (filename: string): boolean => {
      const extension = filename.split(".").pop()?.toLowerCase();
      return (
        !!extension &&
        [
          "js",
          "jsx",
          "ts",
          "tsx",
          "html",
          "css",
          "json",
          "go",
          "py",
          "java",
          "c",
          "cpp",
          "rb",
        ].includes(extension)
      );
    };

    // Convert GitHub files to resources
    const resources: Resource[] = files.map((file) => {
      // Determine file type based on extension
      let type: Resource["type"] = "file";

      if (file.type === "dir") {
        type = "directory";
      } else {
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (extension) {
          if (
            ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)
          ) {
            type = "image";
          } else if (isCodeFile(file.name)) {
            type = "code";
          } else if (["txt", "md"].includes(extension)) {
            type = "text";
          }
        }
      }

      // Estimate file size based on GitHub file size
      const fileSize = file.size || (file.type === "file" ? 1024 : 10 * 1024); // Default estimates

      return {
        id: `github-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type,
        source: `${selectedRepo?.full_name || "GitHub"}`,
        url: `https://github.com/${selectedRepo?.full_name}/blob/main/${file.path}`,
        fileSize: fileSize, // Add file size to resource
      };
    });

    onAddResources(resources);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/25 z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[70]">
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2">
          {view === "repos" ? (
            <RepoList onSelectRepo={handleSelectRepo} onClose={onClose} />
          ) : (
            <FileTree
              repo={selectedRepo!}
              onBack={handleBackToRepos}
              onClose={onClose}
              onAddFiles={handleAddFiles}
              currentResources={currentResources}
            />
          )}
        </div>
      </div>
    </>
  );
}
