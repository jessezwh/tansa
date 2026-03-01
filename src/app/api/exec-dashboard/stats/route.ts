import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isExecDashboardAuthenticated } from '@/lib/exec-dashboard-auth'

const TZ = 'Pacific/Auckland'

function isTodayInAuckland(isoDateStr: string): boolean {
  const d = new Date(isoDateStr)
  const dateStr = d.toLocaleDateString('en-CA', { timeZone: TZ })
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: TZ })
  return dateStr === todayStr
}

export async function GET(request: NextRequest) {
  if (!isExecDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    const [totalResult, recentResult] = await Promise.all([
      payload.count({
        collection: 'registrations',
        where: { paymentStatus: { equals: 'completed' } },
      }),
      payload.find({
        collection: 'registrations',
        where: {
          paymentStatus: { equals: 'completed' },
          createdAt: {
            greater_than_equal: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          },
        },
        limit: 5000,
        select: { createdAt: true },
      }),
    ])

    const today = recentResult.docs.filter((doc) =>
      isTodayInAuckland(doc.createdAt),
    ).length

    return NextResponse.json({ total: totalResult.totalDocs, today })
  } catch (err) {
    console.error('Exec dashboard stats error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 },
    )
  }
}
