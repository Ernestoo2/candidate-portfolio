'use client'

import { useState, useEffect } from 'react'
import { FaSearch, FaHistory } from 'react-icons/fa'

interface SearchBarProps {
  onSearch: (username: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [username, setUsername] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    // Update search history
    const newHistory = [username, ...searchHistory.filter(item => item !== username)]
      .slice(0, 5)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))

    onSearch(username)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
        >
          <FaSearch className="w-5 h-5" />
        </button>
      </form>

      {searchHistory.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaHistory className="w-4 h-4" />
            <span>Recent searches:</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            {searchHistory.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setUsername(item)
                  onSearch(item)
                }}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 