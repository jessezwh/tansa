// src/app/(frontend)/events/[slug]/page.tsx
export const revalidate = 3600

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getEventBySlug, getEvents } from '@/libs/server'
import { notFound } from 'next/navigation'
import EventGalleryClient from '@/components/events/EventsGalleryClient'

interface EventGalleryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const events = await getEvents()
  return events.map((e) => ({
    slug: e.slug ?? deriveSlug(e.title),
  }))
}

function deriveSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default async function EventGalleryPage({ params }: EventGalleryPageProps) {
  const { slug } = await params

  // Try fast path: fetch only the single event by its stored slug
  let event = await getEventBySlug(slug)

  // Fallback for existing events that predate the slug field
  if (!event) {
    const allEvents = await getEvents()
    event = allEvents.find((e) => deriveSlug(e.title) === slug) ?? null
  }

  if (!event) notFound()

  const photos = event.photos?.map((p) => p.url).filter(Boolean) ?? []
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-brand-blue h-[300px]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            href="/events"
            className="inline-flex items-center text-white hover:text-white/80 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Past Events
          </Link>
          <div className="text-white">
            <h1 className="text-6xl lg:text-7xl font-bold font-neue-haas mb-2">{event.title}</h1>
            <p className="text-lg opacity-90">{formattedDate}</p>
            <p className="text-sm opacity-75 mt-2">{photos.length} photos</p>
          </div>
        </div>
      </div>

      {/* Client-side gallery with original layout */}
      <EventGalleryClient title={event.title} date={formattedDate} photos={photos} />
    </div>
  )
}
