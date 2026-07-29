import { unstable_cache } from 'next/cache'
import { payloadClient } from './payloadclient'
import { Sponsor } from '@/payload-types'

// Get media/all photos
export async function getMediaPhotos(): Promise<MediaItem[]> {
  const client = await payloadClient()

  const mediaPhotos = await client.find({
    collection: 'media',
    limit: 100,
  })

  return mediaPhotos.docs as MediaItem[]
}

// Get events (cached — gallery content is static; invalidated by afterChange hook on Events)
export const getEvents = unstable_cache(
  async (): Promise<EventItem[]> => {
    const client = await payloadClient()
    const events = await client.find({
      collection: 'events',
      limit: 20,
    })
    return events.docs as EventItem[]
  },
  ['events'],
  { revalidate: 3600, tags: ['events'] },
)

// Get a single event by its slug field (cached per slug)
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  return unstable_cache(
    async (s: string) => {
      const client = await payloadClient()
      const result = await client.find({
        collection: 'events',
        where: { slug: { equals: s } },
        limit: 1,
      })
      return (result.docs[0] as EventItem) ?? null
    },
    ['event-by-slug', slug],
    { revalidate: 3600, tags: ['events'] },
  )(slug)
}

// Get exec members
export async function getExecMembers(): Promise<ExecMember[]> {
  const client = await payloadClient()

  const execMembers = await client.find({
    collection: 'exec',
    limit: 100,
  })

  return execMembers.docs as ExecMember[]
}

// Get sponsors from Payload
export async function getSponsors(): Promise<Sponsor[]> {
  const client = await payloadClient()

  const sponsors = await client.find({
    collection: 'sponsors',
    limit: 100,
  })

  return sponsors.docs as Sponsor[]
}
