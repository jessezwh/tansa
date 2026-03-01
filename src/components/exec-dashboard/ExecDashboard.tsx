'use client'

import { useState, useEffect, useCallback } from 'react'

type Stats = { total: number; today: number } | null
type LeaderboardEntry = { id: number; name: string; position: string; signupCount: number }
type SearchResult = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  upi?: string | null
  universityId?: string | null
  createdAt: string
  referralCode?: string | null
  areaOfStudy?: string | null
  yearLevel?: string | null
}

function fetchJson<T>(url: string): Promise<T> {
  return fetch(url, { credentials: 'include' }).then((r) => {
    if (r.status === 401) throw new Error('Unauthorized')
    if (!r.ok) throw new Error(r.statusText)
    return r.json()
  })
}

export function ExecDashboard() {
  const [stats, setStats] = useState<Stats>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStatsAndLeaderboard = useCallback(async () => {
    setError(null)
    try {
      const [statsRes, leaderboardRes] = await Promise.all([
        fetchJson<{ total: number; today: number }>('/api/exec-dashboard/stats'),
        fetchJson<{ leaderboard: LeaderboardEntry[] }>('/api/exec-dashboard/leaderboard'),
      ])
      setStats(statsRes)
      setLeaderboard(leaderboardRes.leaderboard)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStatsAndLeaderboard()
  }, [loadStatsAndLeaderboard])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q.length < 2) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    setSearchResults(null)
    try {
      const res = await fetchJson<{ results: SearchResult[] }>(
        `/api/exec-dashboard/search?q=${encodeURIComponent(q)}`,
      )
      setSearchResults(res.results)
    } catch {
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-NZ', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return iso
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600">Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">O-Week signup dashboard</h1>

      {/* Stats + Refresh */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-sm">
            <p className="text-sm text-gray-600">Total members</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total ?? '–'}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-sm">
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.today ?? '–'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true)
            loadStatsAndLeaderboard()
          }}
          className="px-4 py-2 bg-brand-blue text-white rounded font-medium hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {/* Leaderboard */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Who signed you up (points)</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2 font-semibold text-gray-700">Name</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Position</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Signups</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr key={row.id} className="border-b border-gray-100">
                  <td className="px-4 py-2 text-gray-900">{row.name}</td>
                  <td className="px-4 py-2 text-gray-600">{row.position}</td>
                  <td className="px-4 py-2 font-medium text-gray-900">{row.signupCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Search */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Look up member (card pickup)</h2>
        <p className="text-sm text-gray-600 mb-3">
          Search by first name, last name, or email (min 2 characters).
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Name or email…"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-gray-900"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="px-4 py-2 bg-brand-blue text-white rounded font-medium disabled:opacity-50"
          >
            {searchLoading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {searchResults !== null && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {searchResults.length === 0 ? (
              <p className="px-4 py-6 text-gray-600">No matches.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {searchResults.map((r) => (
                  <li key={r.id} className="px-4 py-4">
                    <p className="font-medium text-gray-900">
                      {r.firstName} {r.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{r.email}</p>
                    <p className="text-sm text-gray-600">
                      UPI: {r.upi ?? '–'} · University ID: {r.universityId ?? '–'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Signed up: {formatDate(r.createdAt)}
                      {r.referralCode ? ` · Code: ${r.referralCode}` : ''}
                    </p>
                    {(r.areaOfStudy || r.yearLevel) && (
                      <p className="text-sm text-gray-500">
                        {[r.areaOfStudy, r.yearLevel].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
