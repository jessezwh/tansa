'use client'
import { useState } from 'react'
import EventCard from './EventCard'
import { deriveSlug } from '@/lib/utils'

interface EventsGridProps {
  events: Array<{
    title: string
    date: string
    photos: string[]
  }>
  initialLoad?: number // Support progressive loading
}

export default function EventsGrid({ events, initialLoad = 8 }: EventsGridProps) {
  const [displayCount, setDisplayCount] = useState(initialLoad)

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 8, events.length))
  }

  const displayedEvents = events.slice(0, displayCount)
  const hasMore = displayCount < events.length

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedEvents.map(({ title, date, photos }, index) => (
          <EventCard
            key={title}
            title={title}
            date={date}
            photoUrls={photos}
            slug={deriveSlug(title)}
            priority={index < 4} // Prioritize first 4 images (above fold)
          />
        ))}

      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-white text-brand-blue px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            Load More ({events.length - displayCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
