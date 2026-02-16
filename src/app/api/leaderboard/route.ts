import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { normalizeReferralCode, isValidReferralCodeFormat } from '@/lib/referral'

// GET - Fetch leaderboard data
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Check if this is a score lookup request
    const code = request.nextUrl.searchParams.get('code')

    if (code) {
      // Score lookup by referral code
      const normalizedCode = normalizeReferralCode(code)

      if (!isValidReferralCodeFormat(normalizedCode)) {
        return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
      }

      // Find the registration
      const result = await payload.find({
        collection: 'registrations',
        where: {
          referralCode: {
            equals: normalizedCode,
          },
        },
        limit: 1,
      })

      if (result.docs.length === 0) {
        return NextResponse.json({ error: 'Code not found' }, { status: 404 })
      }

      const registration = result.docs[0]

      // Calculate their rank
      const higherRanked = await payload.count({
        collection: 'registrations',
        where: {
          referralPoints: {
            greater_than: registration.referralPoints || 0,
          },
        },
      })

      return NextResponse.json({
        found: true,
        firstName: registration.firstName,
        lastName: registration.lastName,
        points: registration.referralPoints || 0,
        rank: higherRanked.totalDocs + 1,
      })
    }

    // Default: fetch top 15 for leaderboard
    const leaderboard = await payload.find({
      collection: 'registrations',
      where: {
        referralPoints: {
          greater_than: 0,
        },
      },
      sort: '-referralPoints',
      limit: 15,
    })

    const entries = leaderboard.docs.map((doc, index) => ({
      rank: index + 1,
      firstName: doc.firstName,
      lastName: doc.lastName,
      points: doc.referralPoints || 0,
    }))

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
