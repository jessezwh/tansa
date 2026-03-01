import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isExecDashboardAuthenticated } from '@/lib/exec-dashboard-auth'

export async function GET(request: NextRequest) {
  if (!isExecDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    const [execResult, regsResult] = await Promise.all([
      payload.find({
        collection: 'exec',
        limit: 200,
        sort: 'name',
      }),
      payload.find({
        collection: 'registrations',
        where: { paymentStatus: { equals: 'completed' } },
        limit: 10000,
        select: { signedUpBy: true },
      }),
    ])

    const countByExecId: Record<number, number> = {}
    for (const doc of execResult.docs) {
      countByExecId[doc.id] = 0
    }
    for (const reg of regsResult.docs) {
      const id =
        reg.signedUpBy == null
          ? null
          : typeof reg.signedUpBy === 'object'
            ? reg.signedUpBy.id
            : reg.signedUpBy
      if (id != null && id in countByExecId) {
        countByExecId[id] += 1
      }
    }

    const leaderboard = execResult.docs
      .map((exec) => ({
        id: exec.id,
        name: exec.name,
        position: exec.position,
        signupCount: countByExecId[exec.id] ?? 0,
      }))
      .sort((a, b) => b.signupCount - a.signupCount)

    return NextResponse.json({ leaderboard })
  } catch (err) {
    console.error('Exec dashboard leaderboard error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 },
    )
  }
}
