import { CollectionConfig } from 'payload'

export const Exec: CollectionConfig = {
  slug: 'exec',
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      label: 'Position',
    },
    {
      name: 'degree',
      type: 'text',
      required: true,
      label: 'Degree',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        'Presidents',
        'Admin / Advisory',
        'Activities',
        'Public Relations Officer',
        'Marketing',
        'Design / Photography',
        'AESIR',
        'Interns'
      ],
      label: 'Category',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media', // Links to existing media collection
      required: false,
      label: 'Profile Image',
    },
  ],
}
