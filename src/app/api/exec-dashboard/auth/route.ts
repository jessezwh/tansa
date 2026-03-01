import { NextRequest, NextResponse } from 'next/server'
import { isExecDashboardPasswordValid } from '@/config/exec-dashboard'
import { setExecDashboardCookie } from '@/lib/exec-dashboard-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!isExecDashboardPasswordValid(password)) {
      return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    setExecDashboardCookie(response)
    return response
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
  }
}
