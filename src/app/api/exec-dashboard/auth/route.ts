import { NextRequest, NextResponse } from 'next/server'
import { isExecDashboardPasswordValid } from '@/lib/exec-dashboard'
import { setExecDashboardCookie } from '@/lib/exec-dashboard-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!isExecDashboardPasswordValid(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ authenticated: true })
    setExecDashboardCookie(response)
    return response
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
