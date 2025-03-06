"use client";

import { useState, useEffect } from "react";
import { XIcon, SearchIcon, RepoIcon } from "@primer/octicons-react";
import {
  fetchUserRepos,
  type GitHubRepo,
} from "../../../../services/githubService";

interface RepoListProps {
  onSelectRepo: (repo: GitHubRepo) => void;
  onClose: () => void;
}

export function RepoList({ onSelectRepo, onClose }: RepoListProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch repositories on component mount
  useEffect(() => {
    const loadRepos = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserRepos("mayagao");
        setRepos(data);
        setFilteredRepos(data);

        // Keep showing loading state if no repositories were returned
        // This likely means there's no API key configured
        if (data.length === 0) {
          setIsLoading(true); // Keep loading state active
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to load repositories");
        console.error(err);
        setIsLoading(false);
      }
    };

    loadRepos();
  }, []);

  // Filter repositories based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRepos(repos);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        (repo.description && repo.description.toLowerCase().includes(query))
    );
    setFilteredRepos(filtered);
  }, [searchQuery, repos]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[600px] mx-auto">
      <div className="h-[48px] flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className=" font-semibold text-sm">Select a repository</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <XIcon size={16} />
        </button>
      </div>

      {/* Search input */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for repositories"
            className="w-full pl-10 text-sm pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Repository list */}
      <div className="h-[400px] overflow-y-auto px-3 py-2">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mb-4"></div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Loading repositories from GitHub...
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 max-w-xs text-center">
              This may take a moment if connecting to the GitHub API for the
              first time
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-red-500 mb-2">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            {searchQuery ? (
              <div className="text-center text-gray-500">
                <div className="mb-2">
                  No repositories found matching "{searchQuery}"
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="text-gray-500">No repositories available</div>
            )}
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredRepos.map((repo) => (
              <RepoListItem
                key={repo.id}
                repo={repo}
                onSelect={() => onSelectRepo(repo)}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 text-sm text-gray-500 border-t border-gray-200 dark:border-gray-700">
        Select a repository to get started
      </div>
    </div>
  );
}

interface RepoListItemProps {
  repo: GitHubRepo;
  onSelect: () => void;
}

function RepoListItem({ repo, onSelect }: RepoListItemProps) {
  return (
    <li
      className="hover:bg-gray-50 rounded-md dark:hover:bg-gray-800 cursor-pointer"
      onClick={onSelect}
    >
      <div className="px-3 py-2 flex items-center">
        <div className="flex-shrink-0">
          <RepoIcon size={16} className="text-gray-500" />
        </div>
        <div className="ml-2 flex-1 text-sm">
          <div className="truncate w-[540px]">
            <span className="font-medium mr-1">{repo.name}</span>
            {repo.description && (
              <span className="text-sm text-gray-500 ">{repo.description}</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
