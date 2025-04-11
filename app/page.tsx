'use client'

import { useState } from 'react'
import CandidateForm from './components/CandidateForm'
import CandidateList from './components/CandidateList'

export default function Home() {
  const [view, setView] = useState<'form' | 'list'>('list')

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-card-foreground">
              Candidate Portfolio Dashboard
            </h1>
            <button
              onClick={() => setView(view === 'list' ? 'form' : 'list')}
              className="btn-primary px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {view === 'list' ? 'Add Candidate' : 'View Dashboard'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          {view === 'form' ? <CandidateForm /> : <CandidateList />}
        </div>
      </main>
    </div>
  )
}
