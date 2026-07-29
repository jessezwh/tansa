'use client'

import { JSX, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

type Status = 'loading' | 'success' | 'error'

const STATUS_CONFIG: Record<
  Status,
  {
    icon: JSX.Element
    title: string
    description: string
    color: string
    message: string
  }
> = {
  loading: {
    icon: <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-muted-text" />,
    title: 'Processing...',
    description: 'Please wait while we confirm your payment',
    color: 'text-muted-text',
    message: 'We're verifying your payment details...',
  },
  success: {
    icon: <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />,
    title: 'Welcome to TANSA!',
    description: 'Your registration is complete',
    color: 'text-success',
    message: 'Payment successful! Make sure to pick up your membership card.',
  },
  error: {
    icon: <XCircle className="h-12 w-12 mx-auto mb-4 text-error" />,
    title: 'Payment Failed',
    description: 'There was an issue with your payment',
    color: 'text-error',
    message: 'Something went wrong with your payment.',
  },
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status')

    if (redirectStatus === 'succeeded') {
      setStatus('success')
    } else if (redirectStatus) {
      setStatus('error')
    }
  }, [searchParams])

  const { icon, title, description, color, message } = STATUS_CONFIG[status]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-brand-pink mb-10">
        <div className="max-w-6xl h-48 lg:h-72 mx-auto flex items-center justify-center relative overflow-x-clip lg:overflow-x-visible">
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

      {/* Status Card */}
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              {icon}
              <CardTitle className={color}>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <p className="text-muted-text">{message}</p>

              {status === 'success' && (
                <Button asChild className="w-full">
                  <Link href="/">Go to Home</Link>
                </Button>
              )}

              {status === 'error' && (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">Try Again</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
