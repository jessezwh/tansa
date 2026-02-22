/**
 * Maps routes to their theme color names.
 * Used by Header and Footer to set per-page accent colors.
 */
const PAGE_THEMES: Record<string, string> = {
  '/': 'pink',
  '/about': 'orange',
  '/events': 'blue',
  '/sponsors': 'green',
  '/contact': 'brown',
  '/leaderboard': 'pink',
}

const INVERTED_FOOTER_PAGES = new Set(['/leaderboard', '/about', '/sign-up'])

export function getPageTheme(pathname: string): string {
  if (PAGE_THEMES[pathname]) return PAGE_THEMES[pathname]
  if (pathname.startsWith('/events/')) return 'blue'
  return 'pink'
}

export function isFooterInverted(pathname: string): boolean {
  return INVERTED_FOOTER_PAGES.has(pathname)
}
