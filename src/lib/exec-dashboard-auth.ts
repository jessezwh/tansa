import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'exec_dashboard'
const COOKIE_PAYLOAD = 'exec_dashboard_verified'
const MAX_AGE = 12 * 60 * 60 // 12 hours

function getSigningSecret(): string {
  const secret = process.env.PAYLOAD_SECRET || process.env.EXEC_DASHBOARD_PASSWORD
  return secret || 'exec-dashboard-fallback'
}

function signToken(): string {
  return createHmac('sha256', getSigningSecret()).update(COOKIE_PAYLOAD).digest('base64url')
}

export function setExecDashboardCookie(response: NextResponse): void {
  const token = signToken()
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function clearExecDashboardCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
}

export function isExecDashboardAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value
  return verifyExecDashboardCookie(token)
}

/** For use in RSC (e.g. page) when you have the raw cookie value from cookies(). */
export function verifyExecDashboardCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue || cookieValue.length === 0) return false
  return cookieValue === signToken()
}

export { COOKIE_NAME }
