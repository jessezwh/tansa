// REBRAND: Update Stripe appearance colors to match new brand
// Brand colors live in src/app/(frontend)/styles.css as CSS custom properties.
// This file only contains configuration for third-party libraries that can't use CSS variables.

export const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#0f172a', // slate-900; matches --brand-dark in styles.css
  },
}
