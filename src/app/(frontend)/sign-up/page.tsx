import { StripeCheckoutForm } from '@/components/registration-form/RegistrationForm'
import { CardContent } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <main className="min-h-screen select-none">
      {/* Hero Section */}
      <div className="bg-brand-pink">
        <div className="max-w-6xl h-48 lg:h-72 mx-auto flex items-center justify-center relative overflow-visible">
          {/* Bear image */}
          <div className="absolute left-1 lg:left-32 -bottom-6 lg:-bottom-14 select-none z-10 w-16 lg:w-40">
            <Image
              src="/bears/sitting_bear.svg"
              alt="Bear sitting"
              width={400}
              height={400}
              className="object-contain w-full h-auto"
              priority
            />
          </div>

          <div className="relative text-center z-20 pl-4 lg:pl-0 lg:mt-4">
            <h1 className="text-7xl lg:text-9xl font-bold text-white font-draplink z-10 relative">
              JOIN US
            </h1>
            <p className="text-xs lg:text-xl text-white z-10 relative px-4">
              Join TANSA this year and get access to exclusive events,
              <br />amazing sponsor perks, and a vibrant community!
            </p>
          </div>

          {/* Bear image */}
          <div className="absolute -right-2 lg:right-6 -bottom-4 lg:-bottom-13 select-none z-10 w-25 lg:w-70">
            <Image
              src="/bears/sleeping_bear.svg"
              alt="Bear sleeping"
              width={400}
              height={400}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-3xl p-6 flex gap-8">
          <div className="flex-1 w-full">
            <CardContent className="p-10 bg-white rounded-2xl">
              <StripeCheckoutForm />
            </CardContent>
          </div>
        </div>
      </div>
    </main>
  )
}

export default page
