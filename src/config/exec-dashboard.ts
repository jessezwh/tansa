/**
 * Exec O-Week dashboard config.
 * Password from env so it can be set per environment without committing secrets.
 */

export const EXEC_DASHBOARD_PASSWORD =
  process.env.EXEC_DASHBOARD_PASSWORD ?? ''

export function isExecDashboardPasswordValid(input: string): boolean {
  if (!EXEC_DASHBOARD_PASSWORD) return false
  return input === EXEC_DASHBOARD_PASSWORD
}
