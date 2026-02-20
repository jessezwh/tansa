'use client'

import { useEffect } from 'react'

const InstagramWidget: React.FC = () => {
  useEffect(() => {
    const scriptId = 'EmbedSocialHashtagScript'

    // Remove any existing script to force fresh initialization
    const existingScript = document.getElementById(scriptId)
    if (existingScript) {
      existingScript.remove()
    }

    // Small delay to ensure DOM is ready after navigation
    const timer = setTimeout(() => {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://embedsocial.com/cdn/ht.js'
      script.async = true
      document.head.appendChild(script)
    }, 100)

    // Cleanup on unmount
    return () => {
      clearTimeout(timer)
      const s = document.getElementById(scriptId)
      if (s) s.remove()
    }
  }, [])

  return (
    <div className="pt-14 sm:pt-16 pb-10">
      <div className="w-full max-w-7xl mx-auto px-4 mb-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-pink font-neue-haas">
          Our Instagram!
        </h2>
      </div>
      {/* Embed widget */}
      <div className="flex flex-col items-center justify-center w-full">
        <div
          className="embedsocial-hashtag w-full max-w-7xl"
          data-ref="636cc88bfcebf34c012ce78822b9d909e8f36d5e"
        />
      </div>
    </div>
  )
}

export default InstagramWidget
