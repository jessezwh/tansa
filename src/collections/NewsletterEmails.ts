import type { CollectionConfig } from 'payload'

export const NewsletterEmails: CollectionConfig = {
  slug: 'newsletter-emails',
  access: {
    read: ({ req }) => !!req.user,    // Admin only - contains personal emails
    create: () => true,                // Public signup form needs this
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Members',
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
      label: 'Email Address',
    },
  ],
}
