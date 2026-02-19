'use client'

import { JSX, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, XCircle, Copy, Check } from 'lucide-react'
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
    message: 'We’re verifying your payment details...',
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
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status')
    const paymentIntent = searchParams.get('payment_intent')

    if (redirectStatus === 'succeeded') {
      setStatus('success')

      // Fetch the referral code for this payment
      if (paymentIntent) {
        fetch(`/api/get-referral-code?payment_intent=${paymentIntent}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.referralCode) {
              setReferralCode(data.referralCode)
            }
          })
          .catch((err) => console.error('Failed to fetch referral code:', err))
      }
    } else if (redirectStatus) {
      setStatus('error')
    }
  }, [searchParams])

  const handleCopyCode = async () => {
    if (referralCode) {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const { icon, title, description, color, message } = STATUS_CONFIG[status]

  return (
    <main className="min-h-screen">
      {/* Hero Header */}
      <div className="bg-brand-bg relative h-[300px] flex items-center justify-center flex-col text-center space-y-4 rounded-b-4x overflow-clip">
        <h1 className="text-6xl md:text-8xl font-bold text-white font-draplink z-10">Join Us</h1>
        <p className="text-lg md:text-2xl text-white z-10">
          Join TANSA this year and get access to
          <br /> exclusive events, deals, and a vibrant community!
        </p>
        {/* Bear image */}
        <div className="absolute right-0 bottom-[-190px] select-none">
          <Image
            src="/bears/hooray 1.svg"
            alt="Bear"
            width={450}
            height={450}
            className="object-contain"
          />
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
                <div className="space-y-4">
                  {/* Referral Code Section */}
                  {referralCode && (
                    <div className="bg-brand-bg rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium text-tansa-blue">Your Referral Code</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-tansa-blue font-mono tracking-wider">
                          {referralCode}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyCode}
                          className="h-8 px-2"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-text">
                        Share this code with friends! You both earn points when they sign up.
                      </p>
                    </div>
                  )}

                  <Button asChild className="w-full">
                    <Link href="/">Go to Home</Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/leaderboard">View Leaderboard</Link>
                  </Button>
                </div>
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
