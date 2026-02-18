'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Trophy, User } from 'lucide-react'
import Image from 'next/image'

type LeaderboardEntry = {
  rank: number
  firstName: string
  lastName: string
  points: number
}

type LookupResult = {
  found: boolean
  firstName: string
  lastName: string
  points: number
  rank: number
} | null

// Podium position component
function PodiumSpot({
  entry,
  position,
  isEmpty,
}: {
  entry?: LeaderboardEntry
  position: 1 | 2 | 3
  isEmpty: boolean
}) {
  const positionConfig = {
    1: {
      height: 'h-32',
      bgColor: 'bg-podium-gold',
      textColor: 'text-podium-gold-text',
      label: '1st',
      order: 'order-2',
      marginTop: 'mt-0',
    },
    2: {
      height: 'h-24',
      bgColor: 'bg-podium-silver',
      textColor: 'text-podium-silver-text',
      label: '2nd',
      order: 'order-1',
      marginTop: 'mt-8',
    },
    3: {
      height: 'h-20',
      bgColor: 'bg-podium-bronze',
      textColor: 'text-podium-bronze-text',
      label: '3rd',
      order: 'order-3',
      marginTop: 'mt-12',
    },
  }

  const config = positionConfig[position]

  return (
    <div className={`flex flex-col items-center ${config.order} ${config.marginTop}`}>
      {/* Avatar/Name area */}
      <div className="mb-2 text-center">
        {isEmpty ? (
          <>
            <div className="w-16 h-16 rounded-full bg-skeleton flex items-center justify-center mx-auto mb-1">
              <User className="w-8 h-8 text-muted-text" />
            </div>
            <p className="text-sm text-muted-text">---</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-tansa-blue flex items-center justify-center mx-auto mb-1">
              <span className="text-white text-xl font-bold">
                {entry?.firstName?.charAt(0)}
                {entry?.lastName?.charAt(0)}
              </span>
            </div>
            <p className="text-sm font-semibold text-tansa-blue">
              {entry?.firstName} {entry?.lastName}
            </p>
            <p className="text-xs text-muted-text">{entry?.points} points</p>
          </>
        )}
      </div>

      {/* Podium block */}
      <div
        className={`${config.height} w-24 ${config.bgColor} rounded-t-lg flex items-center justify-center`}
      >
        <span className={`text-2xl font-bold ${config.textColor}`}>{config.label}</span>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [lookupCode, setLookupCode] = useState('')
  const [lookupResult, setLookupResult] = useState<LookupResult>(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || [])
      })
      .catch((err) => console.error('Failed to fetch leaderboard:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleLookup = async () => {
    if (!lookupCode.trim()) return

    setLookupLoading(true)
    setLookupError('')
    setLookupResult(null)

    try {
      const res = await fetch(`/api/leaderboard?code=${encodeURIComponent(lookupCode.trim())}`)
      const data = await res.json()

      if (res.ok) {
        setLookupResult(data)
      } else {
        setLookupError(data.error || 'Code not found')
      }
    } catch {
      setLookupError('Failed to look up code')
    } finally {
      setLookupLoading(false)
    }
  }

  // Get top 3 for podium
  const top3 = [entries[0], entries[1], entries[2]]
  const hasAnyEntries = entries.length > 0

  // Get positions 4-15 for list
  const restOfList = entries.slice(3)

  return (
    <main className="min-h-screen">
      {/* Hero Header */}
      <div className="bg-tansa-blue relative h-[300px] flex items-center justify-center flex-col text-center space-y-4 rounded-b-4x overflow-clip">
        <Trophy className="w-16 h-16 text-podium-gold mb-2" />
        <h1 className="text-5xl md:text-7xl font-bold text-white font-draplink z-10">
          Referral Leaderboard
        </h1>
        <p className="text-lg md:text-xl text-white/90 z-10">
          Refer friends and climb the ranks!
        </p>
        {/* Bear image */}
        <div className="absolute right-0 bottom-[-190px] select-none opacity-50">
          <Image
            src="/bears/hooray 1.svg"
            alt="Bear"
            width={350}
            height={350}
            className="object-contain"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-tansa-blue" />
          </div>
        ) : (
          <>
            {/* Podium Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-tansa-blue">Top Referrers</CardTitle>
              </CardHeader>
              <CardContent>
                {!hasAnyEntries ? (
                  // Empty state
                  <div className="text-center py-8">
                    <div className="flex justify-center items-end gap-4 mb-6">
                      <PodiumSpot position={2} isEmpty={true} />
                      <PodiumSpot position={1} isEmpty={true} />
                      <PodiumSpot position={3} isEmpty={true} />
                    </div>
                    <p className="text-muted-text text-lg">The race hasn&apos;t started yet...</p>
                    <p className="text-muted-text/70">Be the first to refer a friend!</p>
                  </div>
                ) : (
                  // Podium with entries (handles partial states)
                  <div className="flex justify-center items-end gap-4 mb-4">
                    <PodiumSpot position={2} entry={top3[1]} isEmpty={!top3[1]} />
                    <PodiumSpot position={1} entry={top3[0]} isEmpty={!top3[0]} />
                    <PodiumSpot position={3} entry={top3[2]} isEmpty={!top3[2]} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rest of Leaderboard (4-15) */}
            {restOfList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-tansa-blue">Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {restOfList.map((entry) => (
                      <div
                        key={entry.rank}
                        className="flex items-center justify-between p-3 bg-skeleton/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-tansa-blue text-white flex items-center justify-center text-sm font-bold">
                            {entry.rank}
                          </span>
                          <span className="font-medium">
                            {entry.firstName} {entry.lastName}
                          </span>
                        </div>
                        <span className="text-tansa-blue font-semibold">
                          {entry.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Score Lookup Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-tansa-blue">Check Your Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-text">
                  Don&apos;t see yourself on the leaderboard? Enter your referral code to check your
                  score and ranking.
                </p>

                <div className="flex gap-2">
                  <Input
                    placeholder="TANSA-XXXX"
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
                    className="font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  />
                  <Button onClick={handleLookup} disabled={lookupLoading}>
                    {lookupLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {lookupError && (
                  <p className="text-sm text-error">{lookupError}</p>
                )}

                {lookupResult && (
                  <div className="bg-tansa-cream rounded-lg p-4 text-center">
                    <p className="font-semibold text-tansa-blue text-lg">
                      {lookupResult.firstName} {lookupResult.lastName}
                    </p>
                    <p className="text-2xl font-bold text-tansa-blue">
                      {lookupResult.points} points
                    </p>
                    <p className="text-muted-text">
                      Rank #{lookupResult.rank}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
