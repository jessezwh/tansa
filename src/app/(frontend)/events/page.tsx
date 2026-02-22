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
        <div className="max-w-6xl h-48 lg:h-72 mx-auto flex items-center justify-between relative overflow-visible">
          <div className="relative z-20 pl-4 lg:pl-0">
            <div className="font-draplink font-bold text-brand-blue leading-none text-5xl lg:text-8xl">
              <h1>PAST</h1>
              <h1>EVENTS</h1>
            </div>
          </div>

          {/* Bear image */}
          <div className="absolute right-2 -bottom-25 lg:-bottom-42 select-none z-10 w-55 lg:w-100">
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
