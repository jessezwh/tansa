import EventsCarousel from '@/components/EventsCarousel'
import InstagramWidget from '@/components/InstagramWidget'
import Image from 'next/image'
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Media } from '@/payload-types'

export default async function HomePage() {
  // Fetch recent events with cover images for the carousel
  let carouselImages: { id: string; src: string; alt: string; title: string; description?: string }[] = []

  try {
    const payload = await getPayload({ config })
    const eventsData = await payload.find({
      collection: 'events',
      limit: 10,
      sort: '-date',
      where: {
        coverImage: {
          exists: true,
        },
      },
    })

    // Transform events into carousel format
    carouselImages = eventsData.docs
      .filter((event) => event.coverImage)
      .map((event) => {
        const media = event.coverImage as Media
        return {
          id: String(event.id),
          src: media.url || '',
          alt: event.title,
          title: event.title,
          description: event.description || undefined,
        }
      })
      .filter((img) => img.src) // Only include images with valid URLs
  } catch (error) {
    // Database unavailable - carousel will show "No images to display"
    console.error('Failed to fetch events for carousel:', error)
  }
  return (
    <div className="relative bg-brand-bg">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-end px-4 pb-0 overflow-hidden">
        {/* Text content - stacked from top */}
        <div className="flex flex-col items-center text-center flex-1 justify-center gap-6">
          {/* Hello text */}
          <h2 className="font-neue-haas font-semibold text-brand-blue text-[clamp(1.25rem,3vw,2rem)]">
            Hello! We are
          </h2>
          
          {/* TANSA text SVG */}
          <div className="w-[45%] min-w-[280px]">
            <Image
              src="/tansa-text.svg"
              alt="TANSA"
              width={500}
              height={100}
              className="w-full h-auto"
              priority
            />
          </div>
          
          {/* Stars SVG */}
          <div className="w-[20%] min-w-[120px]">
            <Image
              src="/stars.svg"
              alt="Stars"
              width={200}
              height={50}
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Bottom section: 20 - Bear - 26 */}
        <div className="flex items-end justify-center w-full">
          {/* 20 - slightly tucked behind bear */}
          <div className="w-[15%] min-w-[80px] -mr-[3%] z-0">
            <Image
              src="/20.svg"
              alt="20"
              width={200}
              height={200}
              className="w-full h-auto"
            />
          </div>
          
          {/* Peek Bear - flush with bottom */}
          <div className="w-[30%] min-w-[180px] z-10">
            <Image
              src="/bears/peek bear.svg"
              alt="TANSA Bear peeking"
              width={400}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>
          
          {/* 26 - slightly tucked behind bear */}
          <div className="w-[15%] min-w-[80px] -ml-[3%] z-0">
            <Image
              src="/26.svg"
              alt="26"
              width={200}
              height={200}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <div className="bg-brand-bg pt-12 sm:pt-16 lg:pt-20">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-7xl px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-pink mb-6 font-draplink">
              Recent Events
            </h2>
            <EventsCarousel images={carouselImages} />
          </div>
        </div>
        <InstagramWidget />
      </div>
    </div>
  )
}
