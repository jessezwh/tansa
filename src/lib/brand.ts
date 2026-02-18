/**
 * Brand Configuration
 * 
 * Single source of truth for brand colors that need to be used in JavaScript
 * (e.g., Stripe, third-party libraries that don't support CSS variables)
 * 
 * IMPORTANT: Keep these in sync with styles.css color definitions
 * 
 * To convert HSL to Hex:
 * - Use a tool like https://htmlcolorcodes.com/hsl-to-hex/
 * - Or browser DevTools color picker
 */

export const BRAND_COLORS = {
  // Primary brand color (tansa-blue)
  // HSL: hsl(203, 37%, 65%) 
  primary: '#8ab4c8',
  
  // Secondary brand color (tansa-cream)
  // HSL: hsl(36, 100%, 95%)
  secondary: '#fff5e6',
  
  // For dark backgrounds/text
  // Current: slate-900 equivalent
  primaryDark: '#0f172a',
}

/**
 * Stripe-specific configuration
 * Uses brand colors for payment form styling
 */
export const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: BRAND_COLORS.primaryDark,
  },
}
