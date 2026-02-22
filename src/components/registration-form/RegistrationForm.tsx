'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Loader2,
  Palette,
  Briefcase,
  Music,
  GraduationCap,
  Cog,
  Scale,
  Stethoscope,
  FlaskConical,
  MoreHorizontal,
  Minus,
  Tally1,
  Tally2,
  Tally3,
  Tally4,
  Mars,
  Venus,
  NonBinary,
  Globe,
  Users,
} from 'lucide-react'
import RegistrationTextInput from './RegistrationTextInput'
import RegistrationDropdown from './RegistrationDropdown'
import RegistrationHeading from './RegistrationHeading'
import { STRIPE_APPEARANCE } from '@/lib/brand'

type ExecMember = {
  id: number
  name: string
  position: string
}

// production key
// Use env var if available (for local dev), otherwise fallback to production key
// const STRIPE_PUBLISHABLE_KEY =
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
//   'pk_live_51RoeLtRxcM1qFmfCrdgLuCY9mUOb52aPngRqdeW9HeTl1bj2WPKDuUGpYFlCq0LzMd0OJ1UY5PFnIjTVTxxnWd5100V8FwIKvD'

// sandbox key
const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51SmgeERsJ3sFHxypIRfpoNFR1kV4sFKqYcUQ6T6lj8eGcicUsaXgDlukPzOn6RRmwDhBqGcjd8wN9XoNku1QeYhC00LoU7CNI5'

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

const ethnicityOptions = [
  { value: 'taiwanese', label: 'Taiwanese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'east-asian', label: 'Other East Asian' },
  { value: 'southeast-asian', label: 'South-East Asian' },
  { value: 'south-asian', label: 'South Asian' },
  { value: 'nz-european', label: 'NZ European / Other European' },
  { value: 'maori', label: 'Māori' },
  { value: 'pasifika', label: 'Pasifika / Pacific Peoples' },
  { value: 'other', label: 'Other' },
]

const genderOptions = [
  { value: 'male', label: 'Male', icon: Mars },
  { value: 'female', label: 'Female', icon: Venus },
  { value: 'non-binary', label: 'Non-binary', icon: NonBinary },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: Minus },
]

const areaOfStudyOptions = [
  { value: 'arts', label: 'Arts', icon: Palette },
  { value: 'business', label: 'Business', icon: Briefcase },
  { value: 'creative-arts-industries', label: 'Creative Arts and Industries', icon: Music },
  { value: 'education-social-work', label: 'Education and Social Work', icon: GraduationCap },
  { value: 'engineering', label: 'Engineering', icon: Cog },
  { value: 'law', label: 'Law', icon: Scale },
  { value: 'medical-health-sciences', label: 'Medical and Health Sciences', icon: Stethoscope },
  { value: 'science', label: 'Science', icon: FlaskConical },
  { value: 'other', label: 'Other', icon: MoreHorizontal },
]

const yearLevelOptions = [
  { value: 'first-year', label: 'First Year', icon: Tally1 },
  { value: 'second-year', label: 'Second Year', icon: Tally2 },
  { value: 'third-year', label: 'Third Year', icon: Tally3 },
  { value: 'fourth-year', label: 'Fourth Year', icon: Tally4 },
  { value: 'postgraduate', label: 'Postgraduate', icon: GraduationCap },
]

function CheckoutForm({
  clientSecret,
  paymentIntentId,
  formData,
  onFormChange,
  execMembers,
}: {
  clientSecret: string
  paymentIntentId: string
  formData: any
  onFormChange: (field: string, value: string) => void
  execMembers: ExecMember[]
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Build committee member options for dropdown
  const signedUpByOptions = [
    { value: 'online', label: 'None / Online', icon: Globe },
    ...execMembers.map((member) => ({
      value: String(member.id),
      label: `${member.name} - ${member.position}`,
      icon: Users,
    })),
  ]

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phoneNumber &&
      formData.gender &&
      formData.ethnicity &&
      formData.universityId &&
      formData.upi &&
      formData.areaOfStudy &&
      formData.yearLevel &&
      formData.signedUpBy
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) return

    // Validate form
    if (!isFormValid()) {
      setMessage('Please fill in all required fields.')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Update payment intent with form data BEFORE confirming
      const updateRes = await fetch('/api/update-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, formData }),
      })

      if (!updateRes.ok) {
        const errorData = await updateRes.json()
        throw new Error(errorData.error || 'Failed to update payment details')
      }

      // Now confirm the payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          receipt_email: formData.email,
        },
      })

      if (error) {
        setMessage(error.message || 'An unexpected error occurred.')
        setIsLoading(false)
      }
      // Note: If payment succeeds, user will be redirected to success page
      // The webhook will handle creating the registration record
    } catch (err: any) {
      setMessage(err.message || 'An unexpected error occurred.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <RegistrationHeading label="Personal Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegistrationTextInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => onFormChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            required
          />

          <RegistrationTextInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => onFormChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            required
          />

          <RegistrationTextInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => onFormChange('phoneNumber', e.target.value)}
            placeholder="Enter your phone number"
            required
          />

          <RegistrationTextInput
            label="Email"
            value={formData.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            placeholder="Enter your email"
            type="email"
            required
          />

          <RegistrationDropdown
            label="Gender"
            value={formData.gender}
            onValueChange={(value) => onFormChange('gender', value)}
            placeholder="Select your gender"
            options={genderOptions}
            required
          />

          <RegistrationDropdown
            label="Ethnicity"
            value={formData.ethnicity}
            onValueChange={(value) => onFormChange('ethnicity', value)}
            placeholder="Select your ethnicity"
            options={ethnicityOptions}
            required
          />
        </div>
      </div>

      {/* University Information Section */}
      <div className="space-y-4">
        <RegistrationHeading
          label="University Information"
          subtitle="If you are not a university student or recent alumni, you unfortunately cannot register for TANSA."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegistrationTextInput
            label="UoA ID or AUT Student Number"
            value={formData.universityId}
            subtitle="For example, 123456789 (UoA) and 12345678 (AUT)."
            onChange={(e) => onFormChange('universityId', e.target.value)}
            placeholder="Student ID"
            required
          />
          <RegistrationTextInput
            label="UoA UPI or AUT Network Login"
            value={formData.upi}
            subtitle="For example, setn738 (UoA) and ses7129 (AUT)."
            onChange={(e) => onFormChange('upi', e.target.value)}
            placeholder="UPI / Login"
            required
          />

          <RegistrationDropdown
            label="Area of Study"
            value={formData.areaOfStudy}
            onValueChange={(value) => onFormChange('areaOfStudy', value)}
            placeholder="Select your area of study"
            options={areaOfStudyOptions}
            required
          />

          <RegistrationDropdown
            label="Year Level"
            value={formData.yearLevel}
            onValueChange={(value) => onFormChange('yearLevel', value)}
            placeholder="Select your year level"
            options={yearLevelOptions}
            required
          />
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="space-y-4">
        <RegistrationHeading
          label="Additional Information"
          subtitle="Be in to win AirPods when you use a friend's referral code!"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <RegistrationTextInput
            label="Referral Code"
            value={formData.referralCode}
            subtitle="Enter a friend's referral code (e.g., TANSA-AB12)"
            onChange={(e) => onFormChange('referralCode', e.target.value.toUpperCase())}
            placeholder="TANSA-XXXX"
          />

          <RegistrationDropdown
            label="Signed Up By"
            value={formData.signedUpBy}
            onValueChange={(value) => onFormChange('signedUpBy', value)}
            placeholder="Select committee member"
            subtitle="Which committee member helped you sign up?"
            options={signedUpByOptions}
            required
          />
        </div>
      </div>

      {/* Payment Section - Always visible */}
      <div className="space-y-4">
        <RegistrationHeading label="Payment Details" />
        <div className="border rounded-md p-3">
          <PaymentElement />
        </div>
      </div>

      {message && (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-brand-blue text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Registration - $7.00'
        )}
      </Button>
    </form>
  )
}

export function StripeCheckoutForm() {
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [execMembers, setExecMembers] = useState<ExecMember[]>([])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    ethnicity: '',
    universityId: '',
    upi: '',
    areaOfStudy: '',
    yearLevel: '',
    referralCode: '',
    signedUpBy: '',
  })

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Fetch exec members and create payment intent on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Fetch exec members for dropdown
        const execRes = await fetch('/api/exec-members')
        if (execRes.ok) {
          const execData = await execRes.json()
          setExecMembers(execData.members || [])
        }

        // Create payment intent
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 700 }), // $7.00
        })

        if (!res.ok) {
          throw new Error('Failed to create payment intent')
        }

        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }

        setClientSecret(data.clientSecret)
        setPaymentIntentId(data.paymentIntentId)
      } catch (err: any) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, []) // Empty dependency array = runs once on mount

  // Stripe appearance imported from centralized brand config
  const appearance = STRIPE_APPEARANCE

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading payment form...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading payment form: {error}</AlertDescription>
      </Alert>
    )
  }

  if (!clientSecret) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Could not initialize payment. Please refresh the page.</AlertDescription>
      </Alert>
    )
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        clientSecret={clientSecret}
        paymentIntentId={paymentIntentId}
        formData={formData}
        onFormChange={handleFormChange}
        execMembers={execMembers}
      />
    </Elements>
  )
}
