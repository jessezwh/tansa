import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const execMembers = await payload.find({
      collection: 'exec',
      limit: 100, // Should be more than enough for committee members
      sort: 'name',
    })

    // Return simplified data for the dropdown
    const members = execMembers.docs.map((member) => ({
      id: member.id,
      name: member.name,
      position: member.position,
    }))

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Error fetching exec members:', error)
    return NextResponse.json({ error: 'Failed to fetch exec members' }, { status: 500 })
  }
}
