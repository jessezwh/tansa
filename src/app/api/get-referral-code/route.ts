import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const paymentIntent = request.nextUrl.searchParams.get('payment_intent')

    if (!paymentIntent) {
      return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find registration by Stripe payment intent ID
    const result = await payload.find({
      collection: 'registrations',
      where: {
        stripePaymentId: {
          equals: paymentIntent,
        },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    const registration = result.docs[0]

    return NextResponse.json({
      referralCode: registration.referralCode,
      firstName: registration.firstName,
    })
  } catch (error) {
    console.error('Error fetching referral code:', error)
    return NextResponse.json({ error: 'Failed to fetch referral code' }, { status: 500 })
  }
}
