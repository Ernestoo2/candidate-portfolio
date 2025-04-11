export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior'

export interface Candidate {
  id: string
  fullName: string
  role: string
  linkedinUrl: string
  githubUrl: string
  experienceLevel: ExperienceLevel
  techStack: string[]
  dateAdded: string
}

export interface CandidateFormData {
  fullName: string
  role: string
  linkedinUrl: string
  githubUrl: string
  experienceLevel: ExperienceLevel
  techStack: string[]
} 