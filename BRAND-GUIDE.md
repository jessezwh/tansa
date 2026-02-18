# TANSA Brand & Style Guide

This document outlines all brand assets, colors, fonts, and their usage locations throughout the codebase. Use this as a reference when updating the brand.

---

## Quick Reference: What to Update for Rebrand

| Item | Location | Action |
|------|----------|--------|
| Brand Colors (CSS) | `src/app/(frontend)/styles.css` lines 7-10 | Update HSL values |
| Brand Colors (JS) | `src/lib/brand.ts` | Update hex values (keep in sync with CSS) |
| Heading Font | `/public/fonts/draplink.otf` | Replace file |
| Body Font | `src/app/(frontend)/layout.tsx` line 5 | Change Google Font import |
| Main Logo | `/public/TANSA-LOGO.svg` | Replace file |
| Favicon | `/public/favicon.png` | Replace file |
| Bear Assets | `/public/bears/*.svg` | Replace files (keep filenames) |

---

## Colors

### Brand Colors (Primary)

**CSS Variables** - Defined in `src/app/(frontend)/styles.css` lines 7-10:

```css
--color-tansa-blue: #8ab4c8;
--color-tansa-cream: #fff5e6;
--color-tansa-primary-text: #fff5e6;
--color-tansa-secondary-text: #8ab4c8;
```

**JavaScript Hex Values** - Defined in `src/lib/brand.ts`:

```typescript
export const BRAND_COLORS = {
  primary: '#8ab4c8',      // tansa-blue
  secondary: '#fff5e6',    // tansa-cream  
  primaryDark: '#0f172a',  // dark accent
}
```

**Note:** When updating colors, update both files and keep them in sync.

#### `tansa-blue` Usage

| Location | Page/Section | Usage |
|----------|--------------|-------|
| `Header.tsx` | All pages (global) | Background color of navigation bar |
| `Footer.tsx` | All pages (global) | Background color |
| `page.tsx` (home) | Home page | Hero section background |
| `about/page.tsx` | About Us page | Hero section background |
| `events/page.tsx` | Events listing page | Hero section background |
| `sponsors/page.tsx` | Sponsors page | Hero section background |
| `contact/page.tsx` | Contact page | Hero section background |
| `sign-up/page.tsx` | Registration page | Hero section background |
| `leaderboard/page.tsx` | Referral leaderboard page | Hero section background, avatar backgrounds, text accents |
| `success/page.tsx` | Payment success page | Hero section background |
| `MemberCard.tsx` | About Us page (team section) | Member name text color |
| `TeamSection.tsx` | About Us page (team section) | Section title text color |
| `EventCard.tsx` | Home page carousel, Events page | Event title text color |
| `EventsCarousel.tsx` | Home page | Active pagination dot |
| `CSVUpload.tsx` | Admin only | Upload button background |

#### `tansa-cream` Usage

| Location | Page/Section | Usage |
|----------|--------------|-------|
| `TeamSection.tsx` | About Us page | Section background color |
| `contact/page.tsx` | Contact page | Main content area background |
| `success/page.tsx` | Payment success page | Referral code card background |
| `leaderboard/page.tsx` | Referral leaderboard page | Lookup result card background |
| `styles.css` | All pages (mobile nav) | Hamburger menu lines (default state) |

---

### Status Colors

Defined in `src/app/(frontend)/styles.css`:

```css
--color-success: hsl(142, 71%, 45%);
--color-success-light: hsl(142, 76%, 95%);
--color-error: hsl(0, 84%, 60%);
--color-error-light: hsl(0, 86%, 97%);
--color-warning: hsl(45, 93%, 47%);
```

#### Usage

| Color | Location | Page/Section | Usage |
|-------|----------|--------------|-------|
| `success` | `success/page.tsx` | Payment success page | Success icon, title, copy checkmark |
| `success` | `CSVUpload.tsx` | Admin only | Success message text |
| `error` | `success/page.tsx` | Payment failure page | Error icon, title |
| `error` | `leaderboard/page.tsx` | Referral leaderboard page | Lookup error message |
| `error` | `CSVUpload.tsx` | Admin only | Error message text |
| `error` | `ErrorBoundary.tsx` | Any page (error fallback) | Error box styling (bg, border, text, button) |

---

### UI Colors

Defined in `src/app/(frontend)/styles.css`:

```css
--color-skeleton: hsl(220, 14%, 90%);
--color-skeleton-dark: hsl(220, 13%, 80%);
--color-muted-text: hsl(220, 9%, 46%);
--color-accent-light: hsl(45, 100%, 88%);
--color-accent-light-hover: hsl(45, 100%, 80%);
```

#### `skeleton` / `skeleton-dark` Usage (Loading States)

| Location | Page/Section | Usage |
|----------|--------------|-------|
| `MemberCard.tsx` | About Us page (team section) | Image placeholder background, loading gradient |
| `EventCard.tsx` | Home page carousel, Events page | Image placeholder, loading spinner background |
| `EventSkeleton.tsx` | Events page (loading state) | All skeleton placeholder elements |
| `TeamSkeleton.tsx` | About Us page (loading state) | All skeleton placeholder elements |
| `EventsCarousel.tsx` | Home page | Carousel background, pagination dots |
| `leaderboard/page.tsx` | Referral leaderboard page | Empty avatar backgrounds, list item backgrounds |

#### `muted-text` Usage

| Location | Page/Section | Usage |
|----------|--------------|-------|
| `leaderboard/page.tsx` | Referral leaderboard page | Points text, empty state text, description text |
| `success/page.tsx` | Payment success/failure page | Loading state text, message text, share instructions |
| `EventCard.tsx` | Home page carousel, Events page | Event date text |
| `EventsCarousel.tsx` | Home page | "No images" message, disabled button icons |
| `EventsGalleryClient.tsx` | Individual event page gallery | "No photos" message |
| `contact/page.tsx` | Contact page | "Get in Touch" heading |
| `CSVUpload.tsx` | Admin only | File input text |
| `RegistrationHeading.tsx` | Registration page | Form section subtitle text |
| `SponsorsList.tsx` | Sponsors page | "No sponsors" message |

#### `accent-light` Usage

| Location | Page/Section | Usage |
|----------|--------------|-------|
| `Footer.tsx` | All pages (global footer) | Newsletter submit button background |
| `Footer.tsx` | All pages (global footer) | Social media icon hover color |

---

### Leaderboard Podium Colors

Defined in `src/app/(frontend)/styles.css`:

```css
--color-podium-gold: hsl(48, 96%, 53%);
--color-podium-gold-text: hsl(45, 92%, 30%);
--color-podium-silver: hsl(210, 14%, 76%);
--color-podium-silver-text: hsl(215, 14%, 40%);
--color-podium-bronze: hsl(30, 75%, 47%);
--color-podium-bronze-text: hsl(25, 75%, 30%);
```

#### Usage

All in `leaderboard/page.tsx`:
- 1st place podium block background and text
- 2nd place podium block background and text
- 3rd place podium block background and text
- Trophy icon color (uses gold)

---

## Fonts

### Heading Font: Draplink

**File:** `/public/fonts/draplink.otf`

**CSS Definition** in `src/app/(frontend)/styles.css`:
```css
@font-face {
  font-family: 'draplink';
  src: url('/fonts/draplink.otf') format('opentype');
}
```

**Tailwind Class:** `font-draplink`

#### Usage Locations

| Location | Page/Section | Element |
|----------|--------------|---------|
| `page.tsx` (home) | Home page | Hero heading, carousel section header |
| `about/page.tsx` | About Us page | "Meet our Team!" heading |
| `events/page.tsx` | Events listing page | "Events" heading |
| `events/[slug]/page.tsx` | Individual event page | Event title |
| `sponsors/page.tsx` | Sponsors page | "Sponsors" heading |
| `contact/page.tsx` | Contact page | "Contact Us" heading |
| `sign-up/page.tsx` | Registration page | "Join Us" heading |
| `leaderboard/page.tsx` | Referral leaderboard page | "Referral Leaderboard" heading |
| `success/page.tsx` | Payment success page | "Join Us" heading |
| `MemberCard.tsx` | About Us page (team section) | Member name, position, degree text |
| `TeamSection.tsx` | About Us page (team section) | Category section titles |
| `EventCard.tsx` | Home page, Events page | Event titles |
| `InstagramWidget.tsx` | Home page | "Our Instagram!" heading |

### Body Font: DM Sans

**Source:** Google Fonts (via `next/font`)

**Definition** in `src/app/(frontend)/layout.tsx`:
```typescript
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})
```

**Usage:** Applied to `<body>` element globally - all text defaults to this font unless overridden by `font-draplink`.

---

## Brand Assets

### Main Logo

**File:** `/public/TANSA-LOGO.svg`

**Size:** ~1.4MB (consider optimizing if replacing)

#### Usage Locations

| Location | Page/Section | Context |
|----------|--------------|---------|
| `Header.tsx` line 45 | All pages (desktop nav) | Desktop navigation logo |
| `Header.tsx` line 64 | All pages (mobile nav) | Mobile navigation logo (collapsed) |
| `Header.tsx` line 149 | All pages (mobile nav) | Mobile menu open state logo |

### Favicon

**File:** `/public/favicon.png`

**Size:** ~11KB

**Usage:** `src/app/(frontend)/layout.tsx` line 15 - site icon in browser tab

---

## Bear/Mascot Assets

All located in `/public/bears/`

### `homeBear.svg`

| Location | Page/Section | Context |
|----------|--------------|---------|
| `page.tsx` (home) line 65 | Home page | Hero section, positioned bottom-right |

### `hooray 1.svg`

| Location | Page/Section | Context |
|----------|--------------|---------|
| `sign-up/page.tsx` line 20 | Registration page | Hero section, bottom-right |
| `success/page.tsx` line 98 | Payment success page | Hero section, bottom-right |
| `leaderboard/page.tsx` line 163 | Referral leaderboard page | Hero section, bottom-right (semi-transparent) |
| `events/page.tsx` line 55 | Events listing page | Hero section, bottom-right |

### `lying_on_stomach.svg`

| Location | Page/Section | Context |
|----------|--------------|---------|
| `about/page.tsx` line 63 | About Us page | Hero section, bottom-right |

### `running-pointing.svg`

| Location | Page/Section | Context |
|----------|--------------|---------|
| `sponsors/page.tsx` line 22 | Sponsors page | Hero section, bottom-right |
| `contact/page.tsx` line 15 | Contact page | Hero section, bottom-right |

---

## Other Assets

### LinkTree Icon

**File:** `/public/icons/linktree.svg`

**Usage:** `Header.tsx` line 112 - social links in header

### Placeholder Image

**File:** `/public/placeholder.svg`

**Usage:** Fallback image for missing content in:
- `MemberCard.tsx`
- `PhotoModal.tsx`
- `EventsGalleryClient.tsx`
- `EventCard.tsx`

---

## Third-Party Brand Colors (Intentionally Not Centralized)

These colors represent external platform brands and should remain as-is:

| Platform | Color | Location | Page/Section |
|----------|-------|----------|--------------|
| Instagram | `text-pink-500` | `contact/page.tsx` | Contact page (social links) |
| LinkedIn | `text-blue-700` | `contact/page.tsx` | Contact page (social links) |
| Facebook | `text-blue-600` | `contact/page.tsx` | Contact page (social links) |

---

## Special Configurations

### JavaScript Brand Colors

**Location:** `src/lib/brand.ts`

For JavaScript contexts that can't use CSS variables (like Stripe), brand colors are defined as hex values:

```typescript
export const BRAND_COLORS = {
  primary: '#8ab4c8',      // tansa-blue
  secondary: '#fff5e6',    // tansa-cream
  primaryDark: '#0f172a',  // dark accent (for Stripe buttons)
}
```

**Important:** Keep these hex values in sync with the HSL values in `styles.css`.

### Stripe Payment Form

The Stripe appearance configuration imports from `src/lib/brand.ts`:

```typescript
import { STRIPE_APPEARANCE } from '@/lib/brand'
```

To change Stripe's accent color, update `BRAND_COLORS.primaryDark` in `brand.ts`.

---

## Notes for Designers

1. **Color Format:** Brand colors are in hex format. Other UI colors (status, skeleton, etc.) use HSL - the pattern is `hsl(hue, saturation%, lightness%)`.

2. **Bear Assets:** Keep the same filenames when replacing to avoid code changes. All bears are SVG format.

3. **Logo Size:** The current logo is quite large (1.4MB). Consider optimizing the replacement SVG.

4. **Font Weights:** DM Sans uses weights 400 (regular), 500 (medium), and 700 (bold).

5. **Responsive Considerations:** Bears are positioned differently on mobile vs desktop - check each page after replacing.
