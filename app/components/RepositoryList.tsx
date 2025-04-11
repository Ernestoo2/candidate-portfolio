"use client";
import LoadingState from "./LoadingState";
import { useEffect, useState } from "react";
import { FaCodeBranch, FaStar } from "react-icons/fa";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

interface RepositoryListProps {
  username: string;
}

type SortOption = "stars" | "name" | "updated";

export default function RepositoryList({ username }: RepositoryListProps) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [languages, setLanguages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        const cachedData = localStorage.getItem(`repos-${username}`);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Cache for 5 minutes
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setRepos(data);
            updateLanguages(data);
            return;
          }
        }

        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        const data = await response.json();
        setRepos(data);
        updateLanguages(data);

        // Cache the result
        localStorage.setItem(
          `repos-${username}`,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          }),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch repositories",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  useEffect(() => {
    // Filter and sort repositories
    let filtered = [...repos];

    // Apply language filter
    if (selectedLanguage !== "all") {
      filtered = filtered.filter((repo) => repo.language === selectedLanguage);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Limit to top 10 repositories
    setFilteredRepos(filtered.slice(0, 10));
  }, [repos, sortBy, selectedLanguage]);

  const updateLanguages = (repositories: Repository[]) => {
    const langs = new Set(
      repositories
        .map((repo) => repo.language)
        .filter((lang): lang is string => lang !== null),
    );
    setLanguages(langs);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Repositories
        </h3>

        <div className="flex flex-wrap gap-2">
          <select
            title="select language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            <option value="all">All Languages</option>
            {Array.from(languages).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <select
            title="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            <option value="stars">Most Stars</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {repo.name}
                </a>
                {repo.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {repo.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              {repo.language && (
                <span className="text-gray-600 dark:text-gray-400">
                  {repo.language}
                </span>
              )}

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaStar className="w-4 h-4" />
                <span>{repo.stargazers_count}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaCodeBranch className="w-4 h-4" />
                <span>{repo.forks_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
