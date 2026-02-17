import { CollectionConfig } from 'payload'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'email',
      'firstName',
      'lastName',
      'upi',
      'phoneNumber',
      'universityId',
      'areaOfStudy',
      'yearLevel',
      'gender',
      'ethnicity',
      'paymentStatus',
      'referralCode',
      'referralPoints',
      'signedUpBy',
      'createdAt',
    ],
    description: 'Member registrations with payment confirmation',
  },
  access: {
    read: ({ req }) => !!req.user,    // Admin only - contains personal data
    create: () => true,                // Stripe webhook needs this
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Last Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      label: 'Gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Non-binary', value: 'non-binary' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'prefer-not-to-say' },
      ],
    },
    {
      name: 'ethnicity',
      type: 'select',
      required: true,
      label: 'Ethnicity',
      options: [
        { label: 'Taiwanese', value: 'taiwanese' },
        { label: 'Chinese', value: 'chinese' },
        { label: 'East Asian', value: 'east-asian' },
        { label: 'Southeast Asian', value: 'southeast-asian' },
        { label: 'South Asian', value: 'south-asian' },
        { label: 'Māori', value: 'maori' },
        { label: 'Pasifika', value: 'pasifika' },
        { label: 'NZ European / Pākehā', value: 'nz-european' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'universityId',
      type: 'text',
      required: true,
      label: 'University ID',
      admin: {
        description: 'UoA ID or AUT Student Number',
      },
    },
    {
      name: 'upi',
      type: 'text',
      required: true,
      label: 'UPI/Network Login',
      admin: {
        description: 'UoA UPI or AUT Network Login',
      },
    },
    {
      name: 'areaOfStudy',
      type: 'select',
      required: true,
      label: 'Area of Study',
      options: [
        { label: 'Arts', value: 'arts' },
        { label: 'Business', value: 'business' },
        { label: 'Creative Arts and Industries', value: 'creative-arts-industries' },
        { label: 'Education and Social Work', value: 'education-social-work' },
        { label: 'Engineering', value: 'engineering' },
        { label: 'Law', value: 'law' },
        { label: 'Medical and Health Sciences', value: 'medical-health-sciences' },
        { label: 'Science', value: 'science' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'yearLevel',
      type: 'select',
      required: true,
      label: 'Year Level',
      options: [
        { label: 'First Year', value: 'first-year' },
        { label: 'Second Year', value: 'second-year' },
        { label: 'Third Year', value: 'third-year' },
        { label: 'Fourth Year', value: 'fourth-year' },
        { label: 'Postgraduate', value: 'postgraduate' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      label: 'Payment Status',
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'stripePaymentId',
      type: 'text',
      label: 'Stripe Payment Intent ID',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Payment Amount (NZD)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    // Referral System Fields
    {
      name: 'referralCode',
      type: 'text',
      unique: true,
      label: 'Referral Code',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Unique code for this member to share (e.g., TANSA-AX7Y)',
      },
    },
    {
      name: 'referralPoints',
      type: 'number',
      defaultValue: 0,
      label: 'Referral Points',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Points earned from referrals',
      },
    },
    {
      name: 'referredBy',
      type: 'text',
      label: 'Referred By Code',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Referral code used during signup (if any)',
      },
    },
    {
      name: 'signedUpBy',
      type: 'relationship',
      relationTo: 'exec',
      label: 'Signed Up By',
      admin: {
        position: 'sidebar',
        description: 'Committee member who signed up this member (null = Online)',
      },
    },
  ],
}
