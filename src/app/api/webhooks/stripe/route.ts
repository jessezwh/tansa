import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateUniqueReferralCode, awardReferralPoint } from '@/lib/referral'
import { sendReferralCodeEmail } from '@/lib/referral-email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Extract user data from metadata
      const metadata = paymentIntent.metadata

      if (metadata && metadata.firstName && metadata.email) {
        try {
          const payload = await getPayload({ config })

          // Generate unique referral code for the new member
          const newMemberReferralCode = await generateUniqueReferralCode()

          // Check if this member was referred by someone
          const referredByCode = metadata.referralCode || ''
          let newMemberPoints = 0

          // If referred, award points to both parties
          if (referredByCode) {
            // Find the referrer
            const referrerResult = await payload.find({
              collection: 'registrations',
              where: {
                referralCode: {
                  equals: referredByCode,
                },
              },
              limit: 1,
            })

            if (referrerResult.docs.length > 0) {
              // Award point to referrer
              await awardReferralPoint(referrerResult.docs[0].id)
              // New member also gets a point for being referred
              newMemberPoints = 1
            }
          }

          // Process signedUpBy - convert to number or null
          const signedUpById = metadata.signedUpBy ? parseInt(metadata.signedUpBy, 10) : null

          // Create registration record
          const registration = await payload.create({
            collection: 'registrations',
            data: {
              firstName: metadata.firstName,
              lastName: metadata.lastName,
              email: metadata.email,
              phoneNumber: metadata.phoneNumber,
              gender: metadata.gender as any,
              ethnicity: metadata.ethnicity as any,
              universityId: metadata.universityId,
              upi: metadata.upi,
              areaOfStudy: metadata.areaOfStudy as any,
              yearLevel: metadata.yearLevel as any,
              paymentStatus: 'completed',
              stripePaymentId: paymentIntent.id,
              amount: paymentIntent.amount / 100, // Convert cents to dollars
              // Referral system fields
              referralCode: newMemberReferralCode,
              referralPoints: newMemberPoints,
              referredBy: referredByCode || null,
              signedUpBy: signedUpById || null,
            },
          })

          console.log('Registration created successfully:', registration.id, 'with referral code:', newMemberReferralCode)

          // Send referral code by email so the member has a persistent copy (fire-and-forget)
          sendReferralCodeEmail({
            to: metadata.email,
            firstName: metadata.firstName,
            referralCode: newMemberReferralCode,
          })
            .then((result) => {
              if (!result.ok) console.error('Referral email failed:', result.error)
            })
            .catch((err) => {
              console.error('Referral email error:', err)
            })
        } catch (err) {
          console.error('Error creating registration:', err)
          // Don't return error to Stripe - log it instead
        }
      } else {
        console.warn('Payment intent missing required metadata:', paymentIntent.id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
