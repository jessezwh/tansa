'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Sponsor } from '@/payload-types'
import { ExternalLink, ChevronDown } from 'lucide-react'

type SponsorsListProps = {
  sponsors: Sponsor[]
}

type PopupPosition = 'left' | 'center' | 'right'

// Maps top-level tab names to their sub-location values (as stored in the DB)
const LOCATION_GROUPS: Record<string, string[]> = {
  CBD: ['High St & Lorne St, CBD', 'Queen St, CBD', 'Chancery Square, CBD', 'Additional CBD'],
  'Wider Auckland': ['Central Auckland', 'North Shore', 'East', 'Stall / Popup'],
  Online: ['Online'],
}

// Display name overrides for sub-locations
const LOCATION_DISPLAY_NAMES: Record<string, string> = {
  'Central Auckland': 'Non-CBD Central (e.g. Newmarket)',
}

const TAB_KEYS = Object.keys(LOCATION_GROUPS)

const CATEGORY_ORDER = ['Food and drink', 'Accessories and gifts', 'Entertainment']

function getTabForLocation(location: string | null | undefined): string {
  if (!location) return 'Wider Auckland'
  for (const [tab, locations] of Object.entries(LOCATION_GROUPS)) {
    if (locations.includes(location)) return tab
  }
  return 'Wider Auckland'
}

export default function SponsorsList({ sponsors }: SponsorsListProps) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0])
  const [activeCategory, setActiveCategory] = useState('All')
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [openPopupId, setOpenPopupId] = useState<number | null>(null)
  const [popupPosition, setPopupPosition] = useState<PopupPosition>('center')
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Derive unique categories from all sponsors, sorted by priority then alphabetically
  const categories = [
    'All',
    ...Array.from(
      new Set(
        sponsors
          .map((s) => s.category)
          .filter((c): c is string => !!c),
      ),
    ).sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a)
      const bi = CATEGORY_ORDER.indexOf(b)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.localeCompare(b)
    }),
  ]

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Sponsors filtered by search + category
  const filteredSponsors = sponsors.filter((sponsor) => {
    const matchesSearch = sponsor.name?.toLowerCase().includes(search.toLowerCase()) ?? false
    const matchesCategory =
      activeCategory === 'All' || sponsor.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Build: tab → sublocation → sponsors[]
  const grouped: Record<string, Record<string, Sponsor[]>> = {}
  for (const [tab, locations] of Object.entries(LOCATION_GROUPS)) {
    grouped[tab] = {}
    for (const loc of locations) {
      const inLocation = filteredSponsors.filter((s) => s.location === loc)
      if (inLocation.length > 0) grouped[tab][loc] = inLocation
    }
    // Catch sponsors whose location isn't in any group — put them under Wider Auckland
    if (tab === 'Wider Auckland') {
      const unmapped = filteredSponsors.filter(
        (s) =>
          getTabForLocation(s.location) === 'Wider Auckland' &&
          !LOCATION_GROUPS['Wider Auckland'].includes(s.location ?? ''),
      )
      if (unmapped.length > 0) grouped[tab]['Other'] = unmapped
    }
  }

  // Tabs that have at least one sponsor after filtering
  const visibleTabs = TAB_KEYS.filter(
    (tab) => Object.keys(grouped[tab] ?? {}).length > 0,
  )

  // If the active tab becomes empty after a filter change, switch to the first visible tab
  useEffect(() => {
    if (!visibleTabs.includes(activeTab) && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0])
    }
  }, [activeTab, visibleTabs])

  // Close popup when tab or category changes
  useEffect(() => {
    setOpenPopupId(null)
  }, [activeTab, activeCategory])

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

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = buttonElement.getBoundingClientRect()
      const buttonCenter = buttonRect.left + buttonRect.width / 2
      const containerLeft = containerRect.left
      const containerRight = containerRect.right

      const popupHalfWidth = 120
      const spaceOnLeft = buttonCenter - containerLeft
      const spaceOnRight = containerRight - buttonCenter

      if (spaceOnLeft < popupHalfWidth) {
        setPopupPosition('left')
      } else if (spaceOnRight < popupHalfWidth) {
        setPopupPosition('right')
      } else {
        setPopupPosition('center')
      }
    }

    setOpenPopupId(id)
  }

  const renderCard = ({ id, name, logo, instagram, sponsorshipDetails }: Sponsor) => {
    const imageSrc =
      logo && typeof logo !== 'number' && logo.url
        ? logo.url
        : '/sponsors/images/default.png'
    const imageAlt = name || 'Sponsor Logo'
    const isPopupOpen = openPopupId === id

    return (
      <div key={id} className="flex flex-col items-center w-[100px]">
        <div className="relative group">
          {/* Touch devices: tap to toggle popup */}
          <button
            className="[@media(hover:hover)]:hidden relative bg-white rounded-lg shadow-sm flex items-center justify-center w-[100px] h-[100px] cursor-pointer"
            onClick={(e) => handleMobileTap(id, !!sponsorshipDetails, e.currentTarget)}
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

          {/* Hover-capable devices: link to Instagram, hover for popup */}
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
                <div className="absolute top-1 right-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 bg-brand-bg rounded p-0.5">
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

          {/* Hover popup */}
          {sponsorshipDetails && (
            <div className="hidden [@media(hover:hover)]:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-60 bg-white text-black p-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center text-sm z-10 pointer-events-none">
              <p>{sponsorshipDetails}</p>
            </div>
          )}

          {/* Touch tap popup */}
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

        <h3 className="mt-2 font-bold text-xs text-white text-center w-[100px] truncate">
          {name}
        </h3>
      </div>
    )
  }

  const activeGrouped = grouped[activeTab] ?? {}

  return (
    <div className="mt-15">
      <div className="max-w-6xl mx-auto px-4 pb-4">
        {/* Hint text */}
        <p className="text-white/70 text-xl mb-4 text-center font-neue-haas font-bold">
          <span className="[@media(hover:hover)]:hidden">Tap a sponsor to see details</span>
          <span className="hidden [@media(hover:hover)]:inline">Hover over a sponsor to see details</span>
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search sponsors..."
          className="w-full p-3 rounded border border-gray-300 mb-4 bg-white font-bold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search sponsors"
        />

        {/* Category filter — dropdown on mobile, chips on desktop */}
        <div ref={dropdownRef} className="relative flex justify-center mb-4 md:hidden">
          <button
            onClick={() => setCategoryDropdownOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border bg-white text-brand-green border-white"
          >
            {activeCategory}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-150 ${categoryDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {categoryDropdownOpen && (
            <div className="absolute top-full mt-1 bg-white rounded-lg shadow-lg z-20 min-w-[180px] py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    setCategoryDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-bold ${
                    cat === activeCategory ? 'text-brand-green' : 'text-black hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-bold border transition-colors duration-150 ${
                activeCategory === cat
                  ? 'bg-white text-brand-green border-white'
                  : 'bg-transparent text-white border-white/50 hover:border-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex justify-center md:justify-start gap-1 border-b border-white/20 mb-6">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold transition-colors duration-150 border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-white text-white'
                  : 'border-transparent text-white/50 hover:text-white/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sponsor cards */}
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 pb-8">
        {visibleTabs.length === 0 ? (
          <p className="text-white/70 text-center font-neue-haas font-bold">No sponsors found.</p>
        ) : Object.keys(activeGrouped).length === 0 ? (
          <p className="text-white/70 text-center font-neue-haas font-bold">No sponsors in this area.</p>
        ) : (
          Object.entries(activeGrouped).map(([location, locationSponsors]) => (
            <div key={location} className="mb-8">
              <h2 className="text-white font-bold text-lg mb-4 font-neue-haas text-center md:text-left">
                {LOCATION_DISPLAY_NAMES[location] ?? location}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {locationSponsors.map((sponsor) => renderCard(sponsor))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
