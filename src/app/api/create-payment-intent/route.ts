import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    // Create a PaymentIntent without metadata (will be added before payment)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'nzd',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id, // Return the ID for updating later
    })
  } catch (err) {
    console.error('Error creating payment intent:', err)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
