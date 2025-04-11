'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaMapMarkerAlt, FaUsers, FaLink } from 'react-icons/fa'
import LoadingState from './LoadingState'

interface GitHubUser {
  avatar_url: string
  name: string | null
  login: string
  location: string | null
  bio: string | null
  followers: number
  following: number
  html_url: string
}

interface UserProfileProps {
  username: string
}

export default function UserProfile({ username }: UserProfileProps) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check cache first
        const cachedData = localStorage.getItem(`user-${username}`)
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          // Cache for 5 minutes
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setUser(data)
            setIsLoading(false)
            return
          }
        }

        const response = await fetch(`https://api.github.com/users/${username}`)
        if (!response.ok) {
          throw new Error('User not found')
        }

        const data = await response.json()
        setUser(data)

        // Cache the result
        localStorage.setItem(
          `user-${username}`,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [username])

  if (isLoading) return <LoadingState />
  if (error) return <div className="text-red-500 text-center">{error}</div>
  if (!user) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative w-32 h-32">
          <Image
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.name || user.login}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">@{user.login}</p>

          {user.bio && (
            <p className="mt-2 text-gray-700 dark:text-gray-300">{user.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
            {user.location && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt />
                <span>{user.location}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FaUsers />
              <span>{user.followers} followers · {user.following} following</span>
            </div>

            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FaLink />
              <span>View Profile</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 