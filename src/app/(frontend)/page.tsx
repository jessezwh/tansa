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
      <section className="relative min-h-[78vh] lg:min-h-[calc(100vh-80px)] flex flex-col items-center justify-end px-4 pb-0 overflow-hidden">
        {/* Text content - stacked from top */}
        <div className="flex flex-col items-center text-center flex-1 justify-end pb-15 lg:pb-4">
          {/* Hello text */}
          <h2 className="font-neue-haas font-medium text-brand-blue text-3xl lg:text-[clamp(2.19rem,5.25vw,3.5rem)]">
            Hello! We are
          </h2>
          
          {/* TANSA text SVG */}
          <div className="w-[90vw] lg:w-[40vw] mt-5">
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
          <div className="w-[20vw] lg:w-[10vw] mt-6 lg:mt-9">
            <Image
              src="/stars.svg"
              alt="Stars"
              width={200}
              height={50}
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Scroll indicator - desktop only */}
        <div className="hidden lg:flex absolute bottom-4 right-6 z-20 flex-col items-center text-black animate-gentle-bounce">
          <p className="text-[10px] sm:text-xs font-medium font-neue-haas">Scroll Down</p>
          <div className="text-lg sm:text-xl">↓</div>
        </div>

        {/* Desktop: 20 - Bear - 26 side by side */}
        <div className="hidden lg:flex items-end justify-center w-full">
          <div className="w-[28vw] -mr-[11vw] z-0">
            <Image src="/20.svg" alt="20" width={200} height={200} className="w-full h-auto" />
          </div>
          <div className="w-[35vw] z-10">
            <Image src="/bears/peek bear.svg" alt="TANSA Bear peeking" width={400} height={300} className="w-full h-auto" priority />
          </div>
          <div className="w-[28vw] -ml-[11vw] z-0">
            <Image src="/26.svg" alt="26" width={200} height={200} className="w-full h-auto" />
          </div>
        </div>

        {/* Mobile: 2026 above bear, stacked */}
        <div className="flex lg:hidden flex-col items-center w-full">
          <div className="w-[125%] -mb-[6vh] z-0">
            <Image src="/2026.svg" alt="2026" width={400} height={200} className="w-full h-auto" />
          </div>
          <div className="w-[75vw] z-10">
            <Image src="/bears/peek bear.svg" alt="TANSA Bear peeking" width={400} height={300} className="w-full h-auto" priority />
          </div>
        </div>
      </section>

      <div className="bg-brand-pink pt-12 sm:pt-16 lg:pt-20">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-7xl px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 font-neue-haas">
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
