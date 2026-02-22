'use client'
import React, { useState, ChangeEvent, MouseEvent } from 'react'
import { Send, Mail, Instagram, Facebook, Linkedin } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getPageTheme, isFooterInverted } from '@/lib/page-themes'

const Footer = () => {
  const pathname = usePathname()
  const [email, setEmail] = useState<string>('')
  const [subbed, setSubbed] = useState<boolean>(false)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      console.log('No email was submitted.')
    } else if (!emailRegex.test(email)) {
      console.log(email, 'is an invalid email.')
    } else {
      await handleAddEmail(email)
    }
  }

  const handleAddEmail = async (email: string) => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.status === 201) {
        console.log(data.email, 'has been successfully subscribed to the newsletter!')
        setSubbed(true)
      }
    } catch (error) {
      console.error('Error during subscription:', error)
    }
  }

  return (
    <footer className="bg-brand-bg p-6 mt-auto footer-themed" data-page-theme={getPageTheme(pathname)} {...(isFooterInverted(pathname) ? { 'data-footer-inverted': '' } : {})}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-4">
          {/* Left links group - stacks on mobile, row on md+ */}
          <div className="flex flex-col md:flex-row md:space-x-12 gap-8 md:gap-0">
            {/* About Us Section */}
            <div>
              <h3 className="font-bold text-xl mb-4">About Us</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="hover:underline">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="/sponsors" className="hover:underline">
                    Our Sponsors
                  </a>
                </li>
              </ul>
            </div>

            {/* Events Section */}
            <div>
              <h3 className="font-bold text-xl mb-4">Events</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/events" className="hover:underline">
                    Upcoming Events
                  </a>
                </li>
                <li>
                  <a href="/events" className="hover:underline">
                    Past Events
                  </a>
                </li>
              </ul>
            </div>

            {/* Sponsor Section */}
            <div>
              <h3 className="font-bold text-xl mb-4">Sponsor</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/sponsors" className="hover:underline">
                    Sponsorship Perks
                  </a>
                </li>
                <li>
                  <a href="mailto:tansa.ausa@gmail.com" className="hover:underline">
                    Become a Sponsor
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section (right aligned on md+) */}
          <div className="w-full md:w-1/3">
            {!subbed ? (
              <div className="">
                <h3 className="font-bold text-xl mb-4">Subscribe to our newsletter!</h3>
                <div className="flex mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Your email address"
                    className="bg-white px-4 py-2 w-full rounded-l text-foreground"
                    aria-label="Insert your email here!"
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-accent-light text-foreground px-2 rounded-r hover:bg-accent-light-hover"
                    aria-label="Subscribe to our newsletter!"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <h3 className="font-bold text-xl mb-4">Thank you for subscribing!</h3>
              </div>
            )}

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4 py-2">
              <a href="https://www.facebook.com/TANSA.UoA" className="hover:text-accent-light" aria-label="Facebook Icon" target='_blank'>
                <Facebook size={24} />
              </a>
              <a href="mailto:tansa.ausa@gmail.com" className="hover:text-accent-light" aria-label="Email Icon">
                <Mail size={24} />
              </a>
              <a href="https://instagram.com/tansa.uoa" className="hover:text-accent-light" aria-label="Instagram Icon" target='_blank'>
                <Instagram size={24} />
              </a>
              <a href="https://www.linkedin.com/company/taiwanese-newzealand-students-association" className="hover:text-accent-light" aria-label="LinkedIn Icon" target='_blank'>
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-current/30 pt-4">
          <p className="font-bold">© 2025 TANSA + WDCC</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
