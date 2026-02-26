import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    afterDelete: [
      async ({ req, doc }) => {
        const { payload } = req as any
        if (!payload) return

        const mediaIds = new Set<number>()
        const eventDoc = doc as any

        const cover = eventDoc?.coverImage
        if (cover !== undefined && cover !== null) {
          if (typeof cover === 'number') {
            mediaIds.add(cover)
          } else if (typeof cover === 'string') {
            const parsed = Number(cover)
            if (!Number.isNaN(parsed)) mediaIds.add(parsed)
          } else if (typeof cover === 'object' && cover.id != null) {
            const parsed = Number(cover.id)
            if (!Number.isNaN(parsed)) mediaIds.add(parsed)
          }
        }

        const photos = eventDoc?.photos as any[]
        if (Array.isArray(photos)) {
          for (const photo of photos) {
            if (!photo && photo !== 0) continue
            if (typeof photo === 'number') {
              mediaIds.add(photo)
            } else if (typeof photo === 'string') {
              const parsed = Number(photo)
              if (!Number.isNaN(parsed)) mediaIds.add(parsed)
            } else if (typeof photo === 'object' && photo.id != null) {
              const parsed = Number(photo.id)
              if (!Number.isNaN(parsed)) mediaIds.add(parsed)
            }
          }
        }

        if (!mediaIds.size) return

        for (const mediaId of mediaIds) {
          // Fire-and-forget to avoid blocking the event delete request
          payload
            .delete({
              collection: 'media',
              id: mediaId,
            })
            .catch((err: unknown) => {
              payload.logger?.error?.(
                `Failed to clean up media ${mediaId} after event delete`,
                err,
              )
            })
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Event Title',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Event Date',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Event Description',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Cover Image',
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true, // Enables multiple image uploads
      required: false,
      label: 'Event Photos',
    },
  ],
}
