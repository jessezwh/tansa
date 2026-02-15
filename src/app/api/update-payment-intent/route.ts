import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isValidReferralCodeFormat, normalizeReferralCode } from '@/lib/referral'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, formData } = await request.json()

    const payload = await getPayload({ config })

    // Check if email already exists in registrations
    const existingRegistration = await payload.find({
      collection: 'registrations',
      where: {
        email: {
          equals: formData?.email,
        },
      },
      limit: 1,
    })

    if (existingRegistration.docs.length > 0) {
      // No need to cancel intent - let user fix their email and retry
      return NextResponse.json(
        {
          error:
            'This email is already registered. Please use a different email or contact us if you need help.',
        },
        { status: 400 },
      )
    }

    // Validate referral code if provided
    let validatedReferralCode = ''
    if (formData?.referralCode && formData.referralCode.trim() !== '') {
      const referralCode = normalizeReferralCode(formData.referralCode)

      // Check format
      if (!isValidReferralCodeFormat(referralCode)) {
        return NextResponse.json(
          {
            error: 'Invalid referral code format. Please use format TANSA-XXXX.',
          },
          { status: 400 },
        )
      }

      // Check if referral code exists in database
      const referrer = await payload.find({
        collection: 'registrations',
        where: {
          referralCode: {
            equals: referralCode,
          },
        },
        limit: 1,
      })

      if (referrer.docs.length === 0) {
        return NextResponse.json(
          {
            error: 'Invalid referral code. Please check the code and try again.',
          },
          { status: 400 },
        )
      }

      validatedReferralCode = referralCode
    }

    // Process signedUpBy - convert 'online' to empty string for storage
    const signedUpBy = formData?.signedUpBy === 'online' ? '' : formData?.signedUpBy || ''

    // Update the PaymentIntent with the form data as metadata
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        type: 'signup',
        firstName: formData?.firstName || '',
        lastName: formData?.lastName || '',
        email: formData?.email || '',
        phoneNumber: formData?.phoneNumber || '',
        gender: formData?.gender || '',
        ethnicity: formData?.ethnicity || '',
        universityId: formData?.universityId || '',
        upi: formData?.upi || '',
        areaOfStudy: formData?.areaOfStudy || '',
        yearLevel: formData?.yearLevel || '',
        referralCode: validatedReferralCode,
        signedUpBy: signedUpBy,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error updating payment intent:', err)
    return NextResponse.json({ error: 'Failed to update payment intent' }, { status: 500 })
  }
}
