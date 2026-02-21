import Image from 'next/image'
import { Suspense } from 'react'
import { getEvents } from '@/libs/server'
import EventsGrid from '@/components/events/EventsGrid'
import EventCardSkeleton from '@/components/events/EventSkeleton'

async function EventsContent() {
  const events: EventItem[] = await getEvents()

  const groupedEvents = new Map<string, { date: string; photos: string[] }>()

  for (const event of events) {
    if (!groupedEvents.has(event.title)) {
      groupedEvents.set(event.title, {
        date: event.date,
        photos: [],
      })
    }
    const urls = event.photos?.map((photo) => photo.url) ?? []
    groupedEvents.get(event.title)!.photos.push(...urls)
  }

  const sortedEvents = Array.from(groupedEvents.entries())
    .map(([title, data]) => ({ title, ...data }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return <EventsGrid events={sortedEvents} />
}

function EventsLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default function PastEventsPage() {
  return (
    <div className="bg-brand-blue">
      {/* Hero Section */}
      <div className="bg-brand-bg">
  <div className="max-w-6xl h-[200px] md:h-[300px] mx-auto flex items-center justify-between py-8 md:py-16 relative overflow-visible">
          {/* Left text */}
          <div className="font-draplink font-bold text-brand-blue leading-none text-5xl sm:text-6xl md:text-7xl lg:text-8xl relative z-10 pl-4 lg:pl-0">
            <h1>PAST</h1>
            <h1>EVENTS</h1>
          </div>
          {/* Bear image */}
          <div className="absolute right-0 bottom-[-100px] md:bottom-[-160px] select-none z-0 w-[220px] md:w-[380px]">
            <Image
              src="/bears/snowboard_bear.svg"
              alt="Bear"
              width={450}
              height={450}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="py-12">
        <Suspense fallback={<EventsLoading />}>
          <EventsContent />
        </Suspense>
      </div>
    </div>
  )
}
