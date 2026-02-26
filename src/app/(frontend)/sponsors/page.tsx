// app/sponsors/page.tsx
import React from 'react'
import Image from 'next/image'
import { getSponsors } from '@/libs/server'
import SponsorsList from '@/components/SponsorsList'

export default async function SponsorsPage() {
  const sponsors = await getSponsors()

  return (
    <div className="bg-brand-green">
      {/* Hero Section */}
      <div className="bg-brand-bg">
        <div className="max-w-6xl h-48 lg:h-72 mx-auto flex items-center justify-between relative overflow-y-clip overflow-x-clip lg:overflow-x-visible">
          <div className="relative z-20 pl-4 lg:pl-0">
            <div className="font-draplink font-bold text-brand-green leading-none text-5xl lg:text-8xl">
            <h1>OUR</h1>
            <h1>SPONSORS</h1>
            </div>
          </div>

          {/* Bear image */}
          <div className="absolute -right-12 lg:right-2 -bottom-20 lg:-bottom-42 select-none z-10 w-55 lg:w-100">
            <Image
              src="/bears/noodles_bear.svg"
              alt="Bear eating ramen"
              width={450}
              height={450}
              quality={50}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Sponsors list with search */}
      <SponsorsList sponsors={sponsors} />

      {/* Map Section */}
      <div className="flex justify-center m-15 mx-auto">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1xX0X1w1pNLM0xoZjKMIOh_6y0CxNEiY&ehbc=2E312F"
          width="640"
          height="480"
          title="Sponsors Map"
          className="border-0"
          loading="lazy"
        />
      </div>
    </div>
  )
}
