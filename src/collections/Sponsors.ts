import type { CollectionConfig } from 'payload'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'

type Sponsor = {
  name?: string
}

/**
 * Normalize a string for fuzzy matching:
 * - Lowercase
 * - Remove punctuation and special characters
 * - Remove extra whitespace
 * - Trim
 */
function normalizeForMatching(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
}

/**
 * Remove file extension from filename
 */
function removeExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'sponsorshipDetails'],
    group: 'Collections',
  },
  fields: [
    {
      name: 'uploadType',
      type: 'radio',
      label: 'How would you like to add sponsors?',
      options: [
        {
          label: 'Add Single Sponsor',
          value: 'single',
        },
        {
          label: 'Upload CSV',
          value: 'csv',
        },
      ],
      defaultValue: 'single',
      admin: {
        style: {
          marginBottom: '2rem',
        },
        condition: (data, { operation }) => {
          if (operation === 'update') return false
          return true
        },
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      unique: true,
      admin: {
        condition: (data) => data?.uploadType === 'single',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      required: false,
      admin: {
        condition: (data) => data?.uploadType === 'single',
      },
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram Handle',
      required: false,
      admin: {
        condition: (data) => data?.uploadType === 'single',
      },
    },
    {
      name: 'sponsorshipDetails',
      type: 'text',
      label: 'Sponsorship Details',
      required: true,
      admin: {
        condition: (data) => data?.uploadType === 'single',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'logos',
      label: 'Sponsor Logo',
      required: false,
      admin: {
        description: 'Upload the sponsor logo',
        condition: (data) => data?.uploadType === 'single',
      },
    },
    {
      name: 'csvFile',
      type: 'upload',
      relationTo: 'sponsor-csv-uploads',
      label: 'Upload CSV File',
      required: true,
      admin: {
        description: 'Upload a CSV file to add multiple sponsors at once.',
        condition: (data) => data?.uploadType === 'csv',
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data.csvFile) {
          try {
            const csvUpload = await req.payload.findByID({
              collection: 'sponsor-csv-uploads',
              id: data.csvFile,
            })

            if (!csvUpload || !csvUpload.filename) {
              throw new Error('CSV file not found in uploads or filename is missing')
            }

            const filePath = path.join(process.cwd(), 'media', csvUpload.filename)

            if (!fs.existsSync(filePath)) {
              throw new Error(`CSV file not found at path: ${filePath}`)
            }

            const sponsors: any[] = []

            await new Promise((resolve, reject) => {
              fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                  if (row['Name'] && row['Location'] && row['Sponsorship Details']) {
                    sponsors.push({
                      name: row['Name'],
                      location: row['Location'],
                      instagram: row['Instagram'] || null,
                      sponsorshipDetails: row['Sponsorship Details'],
                      logo: null,
                    })
                  }
                })
                .on('end', () => resolve(sponsors))
                .on('error', (error) => {
                  console.error('CSV Processing Error:', error)
                  reject(error)
                })
            })

            if (sponsors.length === 0) {
              throw new Error('No valid sponsors found in the CSV file')
            }

            // Fetch all logos to match against sponsor names
            const allLogos = await req.payload.find({
              collection: 'logos',
              limit: 500, // Should be enough for most cases
            })

            // Create a map of normalized filename -> logo ID for fast lookup
            const logoMap = new Map<string, number>()
            for (const logo of allLogos.docs) {
              if (logo.filename) {
                const normalizedName = normalizeForMatching(removeExtension(logo.filename))
                logoMap.set(normalizedName, logo.id as number)
              }
            }

            let matchedCount = 0
            for (const sponsor of sponsors) {
              try {
                // Try to find a matching logo by normalized sponsor name
                const normalizedSponsorName = normalizeForMatching(sponsor.name)
                const matchedLogoId = logoMap.get(normalizedSponsorName)

                if (matchedLogoId) {
                  sponsor.logo = matchedLogoId
                  matchedCount++
                }

                await req.payload.create({
                  collection: 'sponsors',
                  data: sponsor,
                })
              } catch (error) {
                console.error('Error creating sponsor:', error)
              }
            }

            console.log(`CSV Import: Created ${sponsors.length} sponsors, matched ${matchedCount} logos`)

            return {
              __redirect: '/admin/collections/sponsors',
            }
          } catch (error) {
            console.error('Error in CSV processing:', error)
            throw error
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') {
          return {
            ...doc,
            __redirect: '/admin/collections/sponsors',
          }
        }
        return doc
      },
    ],
  },
}
