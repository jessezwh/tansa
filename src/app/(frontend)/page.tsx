import EventsCarousel from '@/components/EventsCarousel'
import InstagramWidget from '@/components/InstagramWidget'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { PawPrint } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Media } from '@/payload-types'

export default async function HomePage() {
  // Fetch recent events with cover images for the carousel
  let carouselImages: {
    id: string
    src: string
    alt: string
    title: string
    description?: string
    href: string
  }[] = []

  const eventTitleToSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

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

    // Transform events into carousel format (each links to its event page)
    carouselImages = eventsData.docs
      .filter((event) => event.coverImage)
      .map((event) => {
        const media = event.coverImage as Media
        const slug = eventTitleToSlug(event.title)
        return {
          id: String(event.id),
          src: media.url || '',
          alt: event.title,
          title: event.title,
          description: event.description || undefined,
          href: `/events/${slug}`,
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
      <section className="relative min-h-[85vh] lg:min-h-[calc(100vh-80px)] flex flex-col items-center justify-end px-4 pb-0 overflow-hidden">
        {/* Text content - stacked from top */}
        <div className="flex flex-col items-center text-center flex-1 justify-end pb-14 lg:pb-4">
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
          
          {/* Stars SVG - green on mobile, orange on desktop */}
          <svg className="w-[20vw] lg:w-[10vw] mt-7 lg:mt-9 h-auto" viewBox="0 0 181 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#stars-clip)">
              <path d="M0 30.7C12.15 30.7 26.22 47 26.22 61.4C26.22 47.33 40.29 30.7 52.45 30.7C40.29 30.7 26.22 14.39 26.22 0C26.22 14.07 12.15 30.7 0 30.7Z" className="fill-brand-green lg:fill-brand-orange"/>
              <path d="M64.28 30.7C76.43 30.7 90.5 47 90.5 61.4C90.5 47.33 104.57 30.7 116.72 30.7C104.57 30.7 90.5 14.39 90.5 0C90.5 14.07 76.43 30.7 64.28 30.7Z" className="fill-brand-green lg:fill-brand-orange"/>
              <path d="M128.55 30.7C140.71 30.7 154.78 47 154.78 61.4C154.78 47.33 168.85 30.7 181 30.7C168.85 30.7 154.78 14.39 154.78 0C154.78 14.07 140.71 30.7 128.55 30.7Z" className="fill-brand-green lg:fill-brand-orange"/>
            </g>
            <defs>
              <clipPath id="stars-clip">
                <rect width="181" height="61.08" fill="white"/>
              </clipPath>
            </defs>
          </svg>

          {/* Mobile Join TANSA button */}
          <Link
            href="/sign-up"
            className="lg:hidden inline-flex items-center bg-brand-orange text-white px-8 py-4 mt-12 rounded-full font-bold text-2xl"
          >
            <PawPrint className="h-7 w-7 mr-3" />
            Join TANSA!
          </Link>
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
            <Image src="/bears/peek_bear.svg" alt="TANSA Bear peeking" width={400} height={300} className="w-full h-auto" priority />
          </div>
          <div className="w-[28vw] -ml-[11vw] z-0">
            <Image src="/26.svg" alt="26" width={200} height={200} className="w-full h-auto" />
          </div>
        </div>

        {/* Mobile: 2026 above bear, stacked */}
        <div className="flex lg:hidden flex-col items-center w-full">
          <div className="w-[125%] -mb-[8vh] z-0">
            <Image src="/2026.svg" alt="2026" width={400} height={200} className="w-full h-auto" />
          </div>
          <div className="w-[75vw] z-10">
            <Image src="/bears/peek_bear.svg" alt="TANSA Bear peeking" width={400} height={300} className="w-full h-auto" priority />
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
