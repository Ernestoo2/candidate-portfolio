"use client";
import React from "react";
import CandidateCard from "./CandidateCard";
import { useEffect, useState } from "react";
import { FaFileExport } from "react-icons/fa";
import { Candidate, ExperienceLevel } from "../types/candidate";

type SortField = "name" | "experienceLevel";

export default function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterExperience, setFilterExperience] = useState<
    ExperienceLevel | ""
  >("");
  const [filterTechStack, setFilterTechStack] = useState<string>("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Load candidates from localStorage
  useEffect(() => {
    const storedCandidates = JSON.parse(
      localStorage.getItem("candidates") || "[]",
    );
    setCandidates(storedCandidates);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...candidates];

    // Apply filters
    if (filterRole) {
      filtered = filtered.filter((c) =>
        c.role.toLowerCase().includes(filterRole.toLowerCase()),
      );
    }

    if (filterExperience) {
      filtered = filtered.filter((c) => c.experienceLevel === filterExperience);
    }

    if (filterTechStack) {
      filtered = filtered.filter((c) =>
        c.techStack.some((tech) =>
          tech.toLowerCase().includes(filterTechStack.toLowerCase()),
        ),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.fullName.localeCompare(b.fullName);
      } else {
        const experienceOrder = { Junior: 1, Mid: 2, Senior: 3 };
        return experienceOrder[a.experienceLevel] - experienceOrder[b.experienceLevel];
      }
    });

    setFilteredCandidates(filtered);
  }, [candidates, filterRole, filterExperience, filterTechStack, sortBy]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayedCandidates = filteredCandidates.slice(0, page * itemsPerPage);

  const handleDelete = (id: string) => {
    const updatedCandidates = candidates.filter((c) => c.id !== id);
    setCandidates(updatedCandidates);
    localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
  };

  const handleEdit = (candidate: Candidate) => {
    // TODO: Implement edit functionality
    console.log("Edit candidate:", candidate);
  };

  // Calculate experience level summary
  const experienceSummary = candidates.reduce(
    (acc, curr) => {
      acc[curr.experienceLevel] = (acc[curr.experienceLevel] || 0) + 1;
      return acc;
    },
    {} as Record<ExperienceLevel, number>,
  );

  const handleExport = () => {
    const csv = [
      [
        "Full Name",
        "Role",
        "Experience Level",
        "Tech Stack",
        "LinkedIn",
        "GitHub",
      ],
      ...candidates.map((c) => [
        c.fullName,
        c.role,
        c.experienceLevel,
        c.techStack.join(", "),
        c.linkedinUrl,
        c.githubUrl,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(experienceSummary).map(([level, count]) => (
          <div
            key={level}
            className="p-6 border rounded-lg shadow-sm bg-card border-border"
          >
            <h4 className="text-sm font-medium text-muted-foreground">
              {level} Developers
            </h4>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {count}
            </p>
          </div>
        ))}
      </div>

      {/* Filters and Sorting */}
      <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Filter by Role
            </label>
            <input
              type="text"
              placeholder="Search roles..."
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Experience Level
            </label>
            <select
            title="filter"
              value={filterExperience}
              onChange={(e) =>
                setFilterExperience(e.target.value as ExperienceLevel | "")
              }
              className="w-full input-field"
            >
              <option value="">All Levels</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Tech Stack
            </label>
            <input
              type="text"
              placeholder="Search technologies..."
              value={filterTechStack}
              onChange={(e) => setFilterTechStack(e.target.value)}
              className="w-full input-field"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="w-full input-field"
            >
              <option value="name">Name</option>
              <option value="experienceLevel">Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="fixed flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg bottom-6 right-6 btn-primary"
      >
        <FaFileExport />
        <span>Export CSV</span>
      </button>
    </div>
  );
}
