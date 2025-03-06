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
      } catch (err) {
        setError("Failed to load repositories");
        console.error(err);
      } finally {
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
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[512px] mx-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Select a repository</h2>
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
            className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Repository list */}
      <div className="h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading repositories...
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No repositories found
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
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

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm text-left">
          Show all repositories outside of github
        </button>
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
      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
      onClick={onSelect}
    >
      <div className="p-3 flex items-start">
        <div className="flex-shrink-0 mt-1">
          <RepoIcon size={16} className="text-gray-500" />
        </div>
        <div className="ml-3 flex-1">
          <div className="font-medium">{repo.name}</div>
          {repo.description && (
            <div className="text-sm text-gray-500 truncate">
              {repo.description}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
