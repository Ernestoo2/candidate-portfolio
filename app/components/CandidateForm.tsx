'use client'

import { useState } from 'react'
import { ExperienceLevel, CandidateFormData, Candidate } from '../types/candidate'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const TECH_STACK_OPTIONS = [
  'React',
  'Node.js',
  'Docker',
  'TypeScript',
  'Python',
  'Java',
  'AWS',
  'MongoDB',
  'SQL'
]

export default function CandidateForm() {
  const [formData, setFormData] = useState<CandidateFormData>({
    fullName: '',
    role: '',
    linkedinUrl: '',
    githubUrl: '',
    experienceLevel: 'Mid',
    techStack: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new candidate with unique ID and date
    const newCandidate: Candidate = {
      ...formData,
      id: crypto.randomUUID(),
      dateAdded: new Date().toISOString()
    }

    // Get existing candidates from localStorage
    const existingCandidates = JSON.parse(localStorage.getItem('candidates') || '[]')
    
    // Add new candidate
    const updatedCandidates = [...existingCandidates, newCandidate]
    
    // Save to localStorage
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates))

    // Reset form
    setFormData({
      fullName: '',
      role: '',
      linkedinUrl: '',
      githubUrl: '',
      experienceLevel: 'Mid',
      techStack: []
    })

    // Trigger any parent component updates if needed
    // onSubmit?.(newCandidate)
  }

  const handleTechStackChange = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">Add New Candidate</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-foreground">
            Job Role / Position
          </label>
          <input
            type="text"
            id="role"
            required
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-foreground">
            LinkedIn URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-border bg-muted px-3 text-muted-foreground">
              <FaLinkedin />
            </span>
            <input
              type="url"
              id="linkedinUrl"
              required
              value={formData.linkedinUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              className="input-field rounded-l-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-foreground">
            GitHub URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-border bg-muted px-3 text-muted-foreground">
              <FaGithub />
            </span>
            <input
              type="url"
              id="githubUrl"
              required
              value={formData.githubUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
              className="input-field rounded-l-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-foreground">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            value={formData.experienceLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value as ExperienceLevel }))}
            className="input-field"
          >
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tech Stack
          </label>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK_OPTIONS.map(tech => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechStackChange(tech)}
                className={`badge ${
                  formData.techStack.includes(tech)
                    ? 'badge-primary'
                    : 'badge-secondary'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary w-full mt-6"
      >
        Add Candidate
      </button>
    </form>
  )
} 