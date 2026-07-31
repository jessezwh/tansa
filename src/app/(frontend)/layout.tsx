import React from 'react'
import './styles.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // pick weights you need
})

// REBRAND: Update title and favicon
export const metadata = {
  title: "Taiwanese and New Zealand Students' Association",
  icons: {
    icon: '/brand/favicon.png',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        {/* Preload custom fonts to reduce FOUT when navigating between pages */}
        <link
          rel="preload"
          href="/fonts/display.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/body-regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/body-medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/body-bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`antialiased ${dmSans.className}`} suppressHydrationWarning>
        <main>
          <div className="bg-brand-bg min-h-screen flex flex-col">
            <Header />
            {children}
            <Footer />
          </div>
        </main>
      </body>
    </html>
  )
}
