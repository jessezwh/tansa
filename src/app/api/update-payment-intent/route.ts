import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, formData } = await request.json()

    // Check if email already exists in registrations
    const payload = await getPayload({ config })
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
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error updating payment intent:', err)
    return NextResponse.json({ error: 'Failed to update payment intent' }, { status: 500 })
  }
}
