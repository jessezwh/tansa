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

function buildReferralEmailHtml(params: {
  firstName: string
  referralCode: string
  siteUrl?: string
}): string {
  const { firstName, referralCode, siteUrl = 'https://tansa.co.nz' } = params

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TANSA! - Here's your referral code</title>
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
              <p style="margin:0 0 24px; color:${EMAIL_COLORS.text}; font-size: 16px; line-height: 1.5;">Welcome to TANSA! Here’s your referral code — share it with friends so they can sign up and you both earn points.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background-color:${EMAIL_COLORS.blue}; color:${EMAIL_COLORS.white}; padding: 16px 24px; border-radius: 8px; font-size: 20px; font-weight: bold; letter-spacing: 0.1em;">${referralCode}</td>
                </tr>
              </table>
              <p style="margin:0; color:${EMAIL_COLORS.textMuted}; font-size: 14px; line-height: 1.5;">Save this email to find your code anytime. You can also check the success page after signing up.</p>
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
 * Sends the member their referral code by email so they have a persistent copy.
 * Call after creating the registration (e.g. in Stripe webhook).
 * No-op if RESEND_API_KEY is not set (e.g. local dev without email).
 */
export async function sendReferralCodeEmail(params: {
  to: string
  firstName: string
  referralCode: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn('Resend: RESEND_API_KEY not set, skipping referral email')
    return { ok: false, error: 'RESEND_API_KEY not set' }
  }

  const resend = new Resend(RESEND_API_KEY)
  const html = buildReferralEmailHtml({
    firstName: params.firstName,
    referralCode: params.referralCode,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  })

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: 'Your TANSA referral code',
      html,
    })
    if (error) {
      console.error('Resend referral email failed:', error)
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (err) {
    console.error('Resend referral email error:', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
