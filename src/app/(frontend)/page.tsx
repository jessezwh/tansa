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
    <div className="relative bg-tansa-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <section className="relative grid min-h-[50vh] sm:min-h-[60vh] lg:h-[calc(100vh-80px)] grid-cols-2 items-center gap-6 py-6 sm:py-8 md:py-10 overflow-hidden">
          <div className="z-10 font-newkansas text-tansa-cream ">
            <div className="flex items-baseline gap-3">
              <h2 className="font-bold leading-none text-[clamp(2.25rem,6vw,8rem)]">Hello!</h2>
              <h3 className="font-semibold leading-none text-[clamp(1.25rem,3vw,3rem)]">We are</h3>
            </div>
            <h1 className="mt-2 font-extrabold leading-none text-[clamp(2.75rem,8vw,9rem)]">
              TANSA!
            </h1>
            <p className="mt-4 text-[clamp(1rem,2.2vw,1.5rem)] font-medium leading-snug">
              The largest socio-cultural club at the
              <br className="hidden sm:block" />
              <span className="sm:whitespace-nowrap"> University of Auckland and AUT.</span>
            </p>
          </div>
          <div className="absolute bottom-0 right-0 z-10 w-[clamp(220px,40vw,600px)]">
            <div className="relative aspect-[617/624]">
              <Image
                src="/bears/homeBear.svg"
                alt="Tansa Bear"
                fill
                priority
                sizes="(min-width:1024px) 600px, 40vw"
                className="object-contain object-bottom pointer-events-none"
              />
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:block">
            <div className="flex flex-col items-center text-tansa-cream animate-bounce">
              <p className="text-xs sm:text-sm font-medium">Scroll Down</p>
              <div className="text-xl sm:text-2xl">↓</div>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-tansa-cream pt-12 sm:pt-16 lg:pt-20">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-7xl px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-tansa-blue mb-6 font-newkansas">
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
