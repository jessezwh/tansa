import { getPayload } from 'payload'
import config from '@/payload.config'

// Characters that are easy to read (excludes ambiguous: 0/O, 1/I/L)
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/**
 * Generates a random 4-character code
 */
function generateRandomCode(): string {
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)]
  }
  return code
}

/**
 * Generates a unique referral code in format TANSA-XXXX
 * Checks database for uniqueness before returning
 */
export async function generateUniqueReferralCode(): Promise<string> {
  const payload = await getPayload({ config })
  
  let attempts = 0
  const maxAttempts = 10
  
  while (attempts < maxAttempts) {
    const code = `TANSA-${generateRandomCode()}`
    
    // Check if code already exists (case-insensitive)
    const existing = await payload.find({
      collection: 'registrations',
      where: {
        referralCode: {
          equals: code,
        },
      },
      limit: 1,
    })
    
    if (existing.docs.length === 0) {
      return code
    }
    
    attempts++
  }
  
  // Fallback: add timestamp suffix if we somehow can't generate unique code
  return `TANSA-${generateRandomCode()}${Date.now().toString(36).slice(-2).toUpperCase()}`
}

/**
 * Validates referral code format (TANSA-XXXX)
 */
export function isValidReferralCodeFormat(code: string): boolean {
  if (!code) return false
  const normalized = code.toUpperCase().trim()
  return /^TANSA-[A-Z0-9]{4}$/.test(normalized)
}

/**
 * Normalizes a referral code (uppercase, trimmed)
 */
export function normalizeReferralCode(code: string): string {
  return code.toUpperCase().trim()
}

/**
 * Checks if a referral code exists in the database
 * Returns the registration if found, null otherwise
 */
export async function findRegistrationByReferralCode(code: string) {
  if (!isValidReferralCodeFormat(code)) {
    return null
  }
  
  const payload = await getPayload({ config })
  const normalized = normalizeReferralCode(code)
  
  const result = await payload.find({
    collection: 'registrations',
    where: {
      referralCode: {
        equals: normalized,
      },
    },
    limit: 1,
  })
  
  return result.docs.length > 0 ? result.docs[0] : null
}

/**
 * Awards a referral point to a registration
 */
export async function awardReferralPoint(registrationId: number | string): Promise<void> {
  const payload = await getPayload({ config })
  
  const registration = await payload.findByID({
    collection: 'registrations',
    id: registrationId,
  })
  
  if (registration) {
    await payload.update({
      collection: 'registrations',
      id: registrationId,
      data: {
        referralPoints: (registration.referralPoints || 0) + 1,
      },
    })
  }
}
