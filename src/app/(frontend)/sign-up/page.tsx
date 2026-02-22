import { StripeCheckoutForm } from '@/components/registration-form/RegistrationForm'
import { CardContent } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <main className="min-h-screen select-none">
      {/* Hero Section */}
      <div className="bg-brand-pink">
        <div className="max-w-6xl h-48 lg:h-72 mx-auto flex items-center justify-center relative overflow-clip">
          {/* Bear image */}
          <div className="absolute -left-5 -bottom-25 lg:-bottom-50 select-none z-10 w-45 lg:w-75">
            <Image
              src="/bears/waving_bear.svg"
              alt="Bear waving hello"
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
          <div className="absolute -right-5 -bottom-25 lg:-bottom-50 select-none z-10 w-45 lg:w-75">
            <Image
              src="/bears/waving_bear.svg"
              alt="Bear waving hello"
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
