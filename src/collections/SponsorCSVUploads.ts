import type { CollectionConfig } from 'payload'

export const SponsorCSVUploads: CollectionConfig = {
  slug: 'csv-uploads',
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['text/csv'],
    bulkUpload: false,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Sponsors',
    description: 'Stores CSV files used for bulk sponsor import. Use the Sponsors collection to trigger an import.',
  },
  fields: [],
}
