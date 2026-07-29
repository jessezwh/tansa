import { Resend } from 'resend'

// Brand colors aligned with styles.css (email-safe hex)
const EMAIL_COLORS = {
  bg: '#F0F3F3', // brand-bg
  pink: '#ED2E88', // brand-pink
  blue: '#4A9BAD', // brand-blue
  white: '#ffffff',
  text: '#1a1a1a',
  textMuted: '#4a5568',
} as const

function buildSignupConfirmationHtml(params: {
  firstName: string
  siteUrl?: string
}): string {
  const { firstName, siteUrl = 'https://tansa.co.nz' } = params

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TANSA!</title>
</head>
<body style="margin:0; padding:0; background-color:${EMAIL_COLORS.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${EMAIL_COLORS.bg}; padding: 24px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 480px;">
          <!-- Header -->
          <tr>
            <td style="background-color:${EMAIL_COLORS.pink}; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
              <span style="color:${EMAIL_COLORS.white}; font-size: 24px; font-weight: bold; letter-spacing: 0.05em;">TANSA</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:${EMAIL_COLORS.white}; padding: 32px 24px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              <p style="margin:0 0 16px; color:${EMAIL_COLORS.text}; font-size: 16px; line-height: 1.5;">Hi ${firstName},</p>
              <p style="margin:0 0 16px; color:${EMAIL_COLORS.text}; font-size: 16px; line-height: 1.5;">Welcome to TANSA! Your membership registration is confirmed.</p>
              <p style="margin:0; color:${EMAIL_COLORS.textMuted}; font-size: 14px; line-height: 1.5;">Make sure to pick up your membership card at our next event. We look forward to seeing you there!</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 16px 0 0; color:${EMAIL_COLORS.textMuted}; font-size: 12px;">
              Taiwanese and New Zealand Students' Association
              ${siteUrl ? ` · <a href="${siteUrl}" style="color:${EMAIL_COLORS.blue}; text-decoration: none;">${siteUrl}</a>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TANSA <onboarding@resend.dev>'

/**
 * Sends a signup confirmation email after successful payment.
 * Called fire-and-forget from the Stripe webhook.
 * No-op if RESEND_API_KEY is not set (e.g. local dev without email).
 *
 * NOTE: During O-Week, email volume will exceed Resend's free tier (100/day).
 * Upgrade the Resend subscription to a paid plan for the month of O-Week,
 * then downgrade — the free tier is sufficient for the rest of the year.
 */
export async function sendSignupConfirmationEmail(params: {
  to: string
  firstName: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn('Resend: RESEND_API_KEY not set, skipping confirmation email')
    return { ok: false, error: 'RESEND_API_KEY not set' }
  }

  const resend = new Resend(RESEND_API_KEY)
  const html = buildSignupConfirmationHtml({
    firstName: params.firstName,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  })

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: 'Welcome to TANSA!',
      html,
    })
    if (error) {
      console.error('Resend confirmation email failed:', error)
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (err) {
    console.error('Resend confirmation email error:', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
