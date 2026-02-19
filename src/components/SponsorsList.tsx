'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Sponsor } from '@/payload-types'
import { ExternalLink } from 'lucide-react'

type SponsorsListProps = {
  sponsors: Sponsor[]
}

type PopupPosition = 'left' | 'center' | 'right'

export default function SponsorsList({ sponsors }: SponsorsListProps) {
  const [search, setSearch] = useState('')
  const [openPopupId, setOpenPopupId] = useState<number | null>(null)
  const [popupPosition, setPopupPosition] = useState<PopupPosition>('center')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.name?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleMobileTap = (
    id: number,
    hasDetails: boolean,
    buttonElement: HTMLButtonElement,
  ) => {
    if (!hasDetails) return

    if (openPopupId === id) {
      setOpenPopupId(null)
      return
    }

    // Calculate position based on button location relative to container
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = buttonElement.getBoundingClientRect()
      const buttonCenter = buttonRect.left + buttonRect.width / 2
      const containerLeft = containerRect.left
      const containerRight = containerRect.right
      const containerWidth = containerRect.width

      // Popup is 240px wide (w-60), so we need 120px on each side of center
      const popupHalfWidth = 120
      const spaceOnLeft = buttonCenter - containerLeft
      const spaceOnRight = containerRight - buttonCenter

      if (spaceOnLeft < popupHalfWidth) {
        setPopupPosition('left') // Align popup to left edge of card
      } else if (spaceOnRight < popupHalfWidth) {
        setPopupPosition('right') // Align popup to right edge of card
      } else {
        setPopupPosition('center') // Center popup on card
      }
    }

    setOpenPopupId(id)
  }

  return (
    <div className="mt-15">
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <input
          type="text"
          placeholder="Search sponsors..."
          className="w-full p-3 rounded border border-gray-300 mb-8 bg-white font-bold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search sponsors"
        />
      </div>

      <div
        ref={containerRef}
        className="flex flex-wrap justify-center max-w-7xl w-full gap-4 mx-auto px-4"
      >
        {filteredSponsors.length === 0 ? (
          <div className="w-full text-center text-muted-text">No sponsors found.</div>
        ) : (
          filteredSponsors.map(({ id, name, logo, instagram, sponsorshipDetails }) => {
            const imageSrc =
              logo && typeof logo !== 'number' && logo.url
                ? logo.url
                : '/sponsors/images/default.png'
            const imageAlt = name || 'Sponsor Logo'
            const isPopupOpen = openPopupId === id

            return (
              <div key={id} className="flex flex-col items-center w-[100px]">
                {/* Card with image */}
                <div className="relative group">
                  {/* Touch devices: tap to toggle popup */}
                  <button
                    className="[@media(hover:hover)]:hidden relative bg-white rounded-lg shadow-sm flex items-center justify-center w-[100px] h-[100px] cursor-pointer"
                    onClick={(e) =>
                      handleMobileTap(id, !!sponsorshipDetails, e.currentTarget)
                    }
                    aria-label={`View details for ${name}`}
                  >
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      width={100}
                      height={100}
                      className="object-contain max-w-[80px] max-h-[80px]"
                    />
                  </button>

                  {/* Hover-capable devices: link directly to Instagram, hover for popup */}
                  <div className="hidden [@media(hover:hover)]:block">
                    {instagram ? (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative bg-white rounded-lg shadow-sm flex items-center justify-center w-[100px] h-[100px] transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer group/card"
                      >
                        <Image
                          src={imageSrc}
                          alt={imageAlt}
                          width={100}
                          height={100}
                          className="object-contain max-w-[80px] max-h-[80px]"
                        />
                        {/* External link icon - always visible on desktop */}
                        <div className="absolute top-1 right-1 bg-brand-bg rounded p-0.5">
                          <ExternalLink className="w-3.5 h-3.5 text-brand-green" />
                        </div>
                      </a>
                    ) : (
                      <div className="relative bg-white rounded-lg shadow-sm flex items-center justify-center w-[100px] h-[100px]">
                        <Image
                          src={imageSrc}
                          alt={imageAlt}
                          width={100}
                          height={100}
                          className="object-contain max-w-[80px] max-h-[80px]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Hover-capable devices: hover popup - no link, just info */}
                  {sponsorshipDetails && (
                    <div className="hidden [@media(hover:hover)]:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-60 bg-white text-black p-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center text-sm z-10 pointer-events-none">
                      <p>{sponsorshipDetails}</p>
                    </div>
                  )}

                  {/* Touch devices: tap popup */}
                  {sponsorshipDetails && isPopupOpen && (
                    <div
                      className={`[@media(hover:hover)]:hidden absolute bottom-full mb-3 w-60 bg-white text-black p-3 rounded shadow-lg text-center text-sm z-10 ${
                        popupPosition === 'left'
                          ? 'left-0'
                          : popupPosition === 'right'
                            ? 'right-0'
                            : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      <p className="mb-2">{sponsorshipDetails}</p>
                      {instagram && (
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-brand-green font-bold hover:underline"
                        >
                          More Info!
                        </a>
                      )}
                      {/* Triangle arrow indicator - always points to center of card (50px from edge) */}
                      <div
                        className={`absolute w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white ${
                          popupPosition === 'left'
                            ? 'left-[50px] -translate-x-1/2'
                            : popupPosition === 'right'
                              ? 'right-[50px] translate-x-1/2'
                              : 'left-1/2 -translate-x-1/2'
                        }`}
                        style={{ top: '100%' }}
                      />
                    </div>
                  )}
                </div>

                {/* Sponsor name below card - both mobile and desktop */}
                <h3 className="mt-2 font-bold text-xs text-white text-center w-[100px] truncate">
                  {name}
                </h3>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
