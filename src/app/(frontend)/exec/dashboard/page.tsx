import { cookies } from 'next/headers'
import { verifyExecDashboardCookie, COOKIE_NAME } from '@/lib/exec-dashboard-auth'
import { LoginForm } from '@/components/exec-dashboard/LoginForm'
import { ExecDashboard } from '@/components/exec-dashboard/ExecDashboard'

export default async function ExecDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  const authenticated = verifyExecDashboardCookie(token)

  if (!authenticated) {
    return <LoginForm />
  }

  return <ExecDashboard />
}
