'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight, MoveRight, PawPrint, Menu, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [loadingPath, setLoadingPath] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/events', label: 'Events' },
    { href: '/sponsors', label: 'Sponsors' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/contact', label: 'Contact' },
  ]

  const handleClick = (href: string) => {
    if (pathname !== href) {
      setLoadingPath(href)
      router.push(href)
      setMenuOpen(false)
    }
  }

  // Reset loading state when route changes
  useEffect(() => {
    setLoadingPath(null)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 px-6 py-4 lg:py-3 bg-brand-bg">
      <div className="flex items-center justify-between w-full">
        {/*Left Side Element*/}
        <Link href="/" className="flex-1">
          {/*Desktop Logo*/}
          <div className="hidden lg:flex items-center space-x-6 group">
            <div className="h-16 w-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/TANSA-LOGO.svg"
                width={500}
                height={500}
                alt="tansa bear logo"
                className="transition-all duration-300 group-hover:rotate-6"
              />
            </div>

            <div className="text-white select-none">
              <h1 className="font-bold text-lg text-brand-pink leading-tight transition-colors duration-300 group-hover:text-white">
                Taiwanese and New Zealand
              </h1>
              <h2 className="text-lg text-brand-pink leading-tight transition-colors duration-300 group-hover:text-white">
                Students' Association
              </h2>
            </div>
          </div>
          {/*Mobile Logo*/}
          <div className="lg:hidden flex items-center space-x-2">
            <Image src="/TANSA-LOGO.svg" alt="TANSA bear logo" width={40} height={40} className="shrink-0" />
            <h1 className="text-sm font-semibold text-brand-pink whitespace-nowrap">
              Taiwanese and New Zealand
              <br />
              Students&apos; Association
            </h1>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center justify-center space-x-10 text-brand-pink whitespace-nowrap">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => handleClick(item.href)}
                  disabled={loadingPath === item.href}
                  className={`relative px-2 py-1 font-bold group flex items-center transition-colors duration-200 ${
                    pathname === item.href ? 'text-brand-pink' : 'hover:text-white'
                  } ${loadingPath === item.href ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <span className="flex items-center relative">
                    <span className="transition-transform duration-200 group-hover:-translate-x-4 ml-1 mr-2">
                      {item.label}
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 absolute transition-all duration-200 right-[-24px] group-hover:right-0 ${
                        loadingPath === item.href
                          ? 'opacity-100 animate-pulse'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Side Elements*/}
        <div className="flex items-center flex-1 justify-end">
          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="https://linktr.ee/tansa.ausa"
              target="_blank"
              className="text-white transition-all duration-300 hover:scale-110"
            >
              <Image src="/icons/linktree.svg" width={20} height={20} alt="LinkTree" />
            </Link>

            <Link
              href="/sign-up"
              className="bg-brand-pink text-white px-3 py-2 rounded-full font-bold transition-transform duration-200 group-hover:-translate-x-6 flex items-center group relative min-w-[110px]"
            >
              <span className="inline-block h-4 w-4 relative">
                <PawPrint className="absolute h-4 w-4 left-0 top-0 transition-transform duration-200 group-hover:-translate-x-6 opacity-100 group-hover:opacity-0" />
              </span>
              <span className="mx-2 flex items-center relative">
                <span className="transition-transform duration-200 group-hover:-translate-x-4 ml-1 mr-2">
                  Join TANSA!
                </span>
                <ArrowRight className="h-4 w-4 absolute transition-all duration-200 opacity-0 group-hover:opacity-100 right-[-24px] group-hover:right-0" />
              </span>
            </Link>
          </div>
          {/* Mobile Hamburger */}
          <div className="lg:hidden ml-2 z-50">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`group flex flex-col gap-1.5 w-8 h-8 justify-center items-center focus:outline-none ${
                menuOpen ? 'open' : ''
              }`}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Nav Links - overlay below navbar */}
      {menuOpen && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-brand-bg shadow-lg z-40 px-6 pb-6 pt-4">
          <ul className="flex flex-col items-start space-y-4 text-lg text-brand-pink font-semibold">
            {navItems
              .filter((item) => item.href !== '/')
              .map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => handleClick(item.href)}
                    className="text-lg text-brand-pink"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header
