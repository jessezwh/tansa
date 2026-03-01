import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isExecDashboardAuthenticated } from '@/lib/exec-dashboard-auth'

export async function GET(request: NextRequest) {
  if (!isExecDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const term = q.toLowerCase()

  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'registrations',
      where: {
        and: [
          { paymentStatus: { equals: 'completed' } },
          {
            or: [
              { firstName: { contains: term, options: 'i' } },
              { lastName: { contains: term, options: 'i' } },
              { email: { contains: term, options: 'i' } },
            ],
          },
        ],
      },
      limit: 50,
      sort: '-createdAt',
    })

    const results = result.docs.map((doc) => ({
      id: doc.id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      upi: doc.upi,
      universityId: doc.universityId,
      createdAt: doc.createdAt,
      referralCode: doc.referralCode ?? null,
      areaOfStudy: doc.areaOfStudy ?? null,
      yearLevel: doc.yearLevel ?? null,
    }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error('Exec dashboard search error:', err)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 },
    )
  }
}
