'use client'

import React from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { Candidate } from '../types/candidate'

interface CandidateCardProps {
  candidate: Candidate
  onEdit: (candidate: Candidate) => void
  onDelete: (id: string) => void
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onEdit, onDelete }) => {
  const getExperienceColor = (experience: string) => {
    switch (experience.toLowerCase()) {
      case 'senior':
        return 'badge-success'
      case 'mid':
        return 'badge-primary'
      case 'junior':
        return 'badge-warning'
      default:
        return 'badge-secondary'
    }
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {candidate.fullName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{candidate.role}</p>
        </div>
        <span className={`badge ${getExperienceColor(candidate.experienceLevel)}`}>
          {candidate.experienceLevel}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {candidate.techStack.map((tech) => (
            <span key={tech} className="badge badge-secondary">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <a
          href={candidate.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <FaLinkedin size={20} />
        </a>
        <a
          href={candidate.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
        >
          <FaGithub size={20} />
        </a>
      </div>

      {(onEdit || onDelete) && (
        <div className="mt-4 flex justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(candidate)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(candidate.id)}
              className="text-sm text-destructive hover:text-destructive/80 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CandidateCard 