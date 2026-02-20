'use client'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, PawPrint } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { getPageTheme } from '@/lib/page-themes'

const navItems = [
  { href: '/', label: 'Home', theme: 'pink' },
  { href: '/about', label: 'About Us', theme: 'orange' },
  { href: '/events', label: 'Events', theme: 'blue' },
  { href: '/sponsors', label: 'Sponsors', theme: 'green' },
  { href: '/leaderboard', label: 'Leaderboard', theme: 'pink' },
  { href: '/contact', label: 'Contact', theme: 'brown' },
]

function InlineLogo({ className, id = 'desktop' }: { className?: string; id?: string }) {
  const maskId = `logo-mask-${id}`
  return (
    <svg className={className} viewBox="0 0 586.8 586.8" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <defs>
        <mask id={maskId} x="20.2" y="66.3" width="506.2" height="502" maskUnits="userSpaceOnUse">
          <circle fill="#fff" cx="296.6" cy="296.1" r="229.8"/>
        </mask>
      </defs>
      <circle className="logo-circle" cx="296.6" cy="295.1" r="229.8"/>
      <g mask={`url(#${maskId})`}>
        <g>
          <ellipse fill="#141414" cx="222.2" cy="378.3" rx="189.4" ry="202.5" transform="translate(-193.1 519.8) rotate(-78.4)"/>
          <ellipse fill="#fff" cx="143.4" cy="355.3" rx="42.9" ry="57.4" transform="translate(-233.5 424.3) rotate(-78.4)"/>
          <path fill="#141414" d="M194.3,365.7c-5,24.2-40,33-58.4,27.4-4.3-1.3-6.9-3.2-7.9-3.9-15.3-11.4-11.2-37.1-10.9-38.5,2.2-12.3,10.3-30,24.8-33.2,1.9-.4,5-.9,9.6,0,18.6,3.2,47.8,23.9,42.8,48.2Z"/>
          <path fill="#fff" d="M177.3,362.3c-10-2-24,7.2-26,17.1,2-10-7.2-24-17.1-26,10,2,24-7.2,26-17.1-2,10,7.2,24,17.1,26Z"/>
          <ellipse fill="#fff" cx="303.7" cy="388.2" rx="42.9" ry="57.4" transform="translate(-137.7 607.5) rotate(-78.4)"/>
          <path fill="#141414" d="M354.5,398.6c-5,24.2-40,33-58.4,27.4-4.3-1.3-6.9-3.2-7.9-3.9-15.3-11.4-11.2-37.1-10.9-38.5,2.2-12.3,10.3-30,24.8-33.2,1.9-.4,5-.9,9.6,0,18.6,3.2,47.8,23.9,42.8,48.2Z"/>
          <path fill="#fff" d="M337.6,395.2c-10-2-24,7.2-26,17.1,2-10-7.2-24-17.1-26,10,2,24-7.2,26-17.1-2,10,7.2,24,17.1,26Z"/>
          <rect fill="#fff" x="194.2" y="411.1" width="38.8" height="17.9" rx="8.9" ry="8.9" transform="translate(88.9 -34.4) rotate(11.6)"/>
          <ellipse fill="#141414" cx="391" cy="264.2" rx="68.3" ry="87.2" transform="translate(-80.6 279.3) rotate(-35.9)"/>
          <path fill="#fff" d="M374.7,248.1c17.8-12,37.9-13.1,49.8-6.7,12.5,6.7,19.3,19.1,19.3,19.2.3.6.6,1.1.7,1.4,1.5,3,7.6,15.7,4.2,31.5-5.1,24-27.3,34-29.7,35.1-2.4-8.4-5.6-17.6-9.9-27.2-10.3-23.1-23.3-40.7-34.4-53.2Z"/>
          <ellipse fill="#141414" cx="111.6" cy="206.8" rx="87.2" ry="68.3" transform="translate(-90.3 86.7) rotate(-30.9)"/>
          <path fill="#fff" d="M133,198.4c-11.6-18-29.7-27-43.1-25.8-14.1,1.2-25.3,10-25.3,10-.5.4-.9.8-1.2,1-2.6,2.1-13.2,11.4-16.3,27.3-4.8,24,11.7,42.1,13.4,43.9,5.5-6.8,12.1-14,19.8-21.1,18.6-17.2,37.5-28.2,52.6-35.3Z"/>
        </g>
      </g>
    </svg>
  )
}

function InlineLinktree({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="24" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect className="linktree-fill" x="15.1352" width="7.06313" height="23.2074"/>
      <rect className="linktree-fill" x="15.1352" y="30.2725" width="7.06313" height="15.1353"/>
      <rect className="linktree-fill" x="37.3337" y="15.1357" width="7.06313" height="37.3337" transform="rotate(90 37.3337 15.1357)"/>
      <rect className="linktree-fill" x="34.7499" y="29.0654" width="7.06313" height="37.3337" transform="rotate(134.779 34.7499 29.0654)"/>
      <rect className="linktree-fill" width="7.06313" height="37.3337" transform="matrix(0.704376 0.709827 0.709827 -0.704376 3.27435 29.0654)"/>
    </svg>
  )
}

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [loadingPath, setLoadingPath] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  const handleClick = (href: string) => {
    if (pathname !== href) {
      headerRef.current?.setAttribute('data-page-theme', getPageTheme(href))
      setLoadingPath(href)
      router.push(href)
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    setLoadingPath(null)
  }, [pathname])

  return (
    <header ref={headerRef} className="sticky top-0 z-40 px-6 py-4 lg:py-3 bg-brand-bg" data-page-theme={getPageTheme(loadingPath || pathname)}>
      <div className="flex items-center justify-between w-full">
        {/*Left Side Element*/}
        <Link href="/" className="flex-1">
          {/*Desktop Logo*/}
          <div className="hidden lg:flex items-center space-x-4 group">
            <div className="h-16 w-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <InlineLogo className="w-full h-full transition-all duration-300 group-hover:rotate-6" />
            </div>
            <svg className="h-8 w-auto" viewBox="0 0 717 157" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M88.75 48.13C89.66 83.32 92.76 112.95 95.74 155.38H34.16C37.13 112.95 40.24 83.32 41.14 48.13C27.43 48.52 13.71 49.42 0 50.72V1.55H129.89V50.72C116.18 49.42 102.47 48.52 88.75 48.13Z" className="nav-themed-fill"/>
              <path d="M284.37 1.55H335.6C342.59 25.1 355.78 54.73 370.66 78.4C370.66 54.73 369.5 31.18 367.56 1.55H424.61C420.34 61.07 420.6 95.87 424.61 155.38H374.67C365.75 131.83 354.88 104.67 338.32 76.46C338.32 100.65 339.48 124.85 341.42 155.38H284.37C288.38 95.87 288.64 61.07 284.37 1.55Z" className="nav-themed-fill"/>
              <path d="M440.27 98.71C446.61 100.01 477.4 106.35 498.23 106.35C509.74 106.35 518.28 104.41 518.28 98.84C518.28 93.28 512.46 90.43 503.92 90.43C496.29 90.43 486.19 91.73 476.1 91.73C455.92 91.73 435.87 86.29 435.87 52.79C435.87 11 469.63 0 504.82 0C540.01 0 541.96 3.11 556.57 6.21V57.83C550.24 56.54 520.35 50.2 500.17 50.2C489.17 50.2 480.89 52.14 480.89 57.7C480.89 66.76 487.88 68.96 497.71 68.96C505.99 68.96 516.34 67.4 526.43 67.4C545.58 67.4 563.3 72.71 563.3 103.63C563.3 134.55 528.63 156.42 492.79 156.42C474.16 156.42 455.01 153.31 440.4 150.21V98.58L440.27 98.71Z" className="nav-themed-fill"/>
              <path d="M682.85 1.55H606.25C599.92 53.82 584.91 104.41 571.84 155.38H630.45C631.1 145.68 631.74 136.75 632.65 127.95C636.92 126.92 640.8 126.4 644.55 126.4C648.17 126.4 651.92 126.79 656.19 127.95C657.1 136.49 657.75 145.81 658.39 155.38H717C703.93 104.41 688.93 53.82 682.59 1.55H682.85ZM644.55 91.47C644.55 79.18 630.19 64.69 617.77 64.69C630.06 64.69 644.55 50.33 644.55 37.91C644.55 50.2 658.91 64.69 671.33 64.69C659.04 64.69 644.55 79.05 644.55 91.47Z" className="nav-themed-fill"/>
              <path d="M238.7 1.55H162.11C155.77 53.82 140.76 104.41 127.69 155.38H186.3C186.95 145.68 187.6 136.75 188.5 127.95C192.77 126.92 196.65 126.4 200.4 126.4C204.16 126.4 207.78 126.79 212.05 127.95C212.95 136.49 213.6 145.81 214.25 155.38H272.85C259.79 104.41 244.78 53.82 238.44 1.55H238.7ZM200.4 91.47C200.4 79.18 186.04 64.69 173.62 64.69C185.91 64.69 200.4 50.33 200.4 37.91C200.4 50.2 214.76 64.69 227.18 64.69C214.89 64.69 200.4 79.05 200.4 91.47Z" className="nav-themed-fill"/>
            </svg>
          </div>
          {/*Mobile Logo*/}
          <div className="lg:hidden flex items-center space-x-2">
            <InlineLogo id="mobile" className="w-10 h-10 shrink-0" />
            <div className="text-sm nav-themed-text whitespace-nowrap">
              <p className="font-bold leading-tight">Taiwanese and New Zealand</p>
              <p className="font-normal leading-tight">Students&apos; Association</p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center justify-center space-x-10 whitespace-nowrap">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => handleClick(item.href)}
                  disabled={loadingPath === item.href}
                  data-theme={item.theme || undefined}
                  className={`nav-link relative px-2 py-1 font-bold group flex items-center transition-colors duration-200 ${
                    pathname === item.href ? 'nav-themed-text' : 'nav-themed-text hover:!text-white'
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
              className="transition-all duration-300 hover:scale-110"
            >
              <InlineLinktree />
            </Link>

            <Link
              href="/sign-up"
              className="nav-join-btn text-white px-3 py-2 rounded-full font-bold transition-all duration-200 group-hover:-translate-x-6 flex items-center group relative min-w-[110px]"
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
        <div className="lg:hidden absolute left-0 right-0 top-full bg-brand-bg shadow-lg z-40 px-6 pb-6 pt-4 nav-themed-text">
          <hr className="mb-4 border-current/20" />
          <ul className="flex flex-col items-stretch space-y-4 text-lg nav-themed-text font-semibold">
            {navItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => handleClick(item.href)}
                    className="text-lg nav-themed-text w-full text-left py-1"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
          </ul>
          <hr className="mt-5 border-current/20" />
          <div className="flex items-center justify-between mt-4">
            <Link
              href="/sign-up"
              onClick={() => setMenuOpen(false)}
              className="nav-join-btn inline-flex items-center text-white px-3 py-2 rounded-full font-bold"
            >
              <span className="inline-block h-4 w-4 relative">
                <PawPrint className="absolute h-4 w-4 left-0 top-0" />
              </span>
              <span className="mx-2">Join TANSA!</span>
            </Link>
            <Link
              href="https://linktr.ee/tansa.ausa"
              target="_blank"
              onClick={() => setMenuOpen(false)}
            >
              <InlineLinktree />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
