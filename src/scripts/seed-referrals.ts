/**
 * Seed script to generate test registrations with referral data
 * 
 * Run locally (with proxy running):
 *   export $(cat .env | xargs) && npx tsx src/scripts/seed-referrals.ts
 * 
 * Or on Fly:
 *   fly ssh console -a tansa-web -C "npx tsx src/scripts/seed-referrals.ts"
 */

import { getPayload } from 'payload'
import config from '../payload.config'

const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)]
  }
  return `TANSA-${code}`
}

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Sophia', 'Elijah',
  'Isabella', 'Lucas', 'Mia', 'Mason', 'Charlotte', 'Ethan', 'Amelia',
  'James', 'Harper', 'Benjamin', 'Evelyn', 'Jack', 'Luna', 'Henry', 'Chloe',
  'Alexander', 'Penelope', 'Sebastian', 'Layla', 'Daniel', 'Riley', 'Michael'
]

const lastNames = [
  'Chen', 'Wang', 'Lin', 'Liu', 'Zhang', 'Lee', 'Wu', 'Yang', 'Huang', 'Zhou',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Kim', 'Park', 'Nguyen', 'Tran', 'Patel', 'Singh', 'Kumar', 'Ali', 'Taylor'
]

async function seedReferrals() {
  console.log('Starting referral seed...')
  
  const payload = await getPayload({ config })
  
  // Number of test registrations to create
  const count = 20
  const registrations: any[] = []
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const email = `test${i + 1}_${Date.now()}@example.com`
    
    // Random referral points (0-15, weighted towards lower)
    const points = Math.floor(Math.random() * Math.random() * 16)
    
    try {
      const registration = await payload.create({
        collection: 'registrations',
        data: {
          firstName,
          lastName,
          email,
          phoneNumber: `02${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          gender: ['male', 'female', 'non-binary', 'other'][Math.floor(Math.random() * 4)] as any,
          ethnicity: ['taiwanese', 'chinese', 'east-asian', 'nz-european', 'other'][Math.floor(Math.random() * 5)] as any,
          universityId: Math.floor(Math.random() * 900000000 + 100000000).toString(),
          upi: `${firstName.toLowerCase().slice(0, 3)}${Math.floor(Math.random() * 1000)}`,
          areaOfStudy: ['arts', 'business', 'engineering', 'science', 'law'][Math.floor(Math.random() * 5)] as any,
          yearLevel: ['first-year', 'second-year', 'third-year', 'fourth-year', 'postgraduate'][Math.floor(Math.random() * 5)] as any,
          paymentStatus: 'completed',
          stripePaymentId: `pi_test_${Date.now()}_${i}`,
          amount: 7,
          referralCode: generateCode(),
          referralPoints: points,
          referredBy: null,
          signedUpBy: null,
        },
      })
      
      registrations.push(registration)
      console.log(`Created: ${firstName} ${lastName} - ${points} points - ${registration.referralCode}`)
    } catch (err: any) {
      console.error(`Failed to create registration ${i}:`, err.message)
    }
  }
  
  console.log(`\nCreated ${registrations.length} test registrations`)
  console.log('\nTop 5 by points:')
  registrations
    .sort((a, b) => (b.referralPoints || 0) - (a.referralPoints || 0))
    .slice(0, 5)
    .forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.firstName} ${r.lastName}: ${r.referralPoints} pts (${r.referralCode})`)
    })
  
  process.exit(0)
}

seedReferrals().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
