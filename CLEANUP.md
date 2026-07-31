# TANSA Website Cleanup Plan

> Persistent task list for cleaning up the codebase and preparing for yearly handover.
> Each task is self-contained and can be picked up independently by a developer or agent.
> Check off tasks as they're completed.

## Decisions

- **Leaderboard + Referral system**: Archive (don't delete) — was a one-off O-Week promotion, unlikely to be reused but good to keep accessible
- **Exec dashboard + CSV sponsor upload**: Keep — reusable yearly tools
- **Priority order**: Code cleanup → Feature archival → Code quality → Rebranding prep → Infrastructure

---

## A. Code Organization & Structure

- [x] **A1. Merge `src/lib/` and `src/libs/` into a single `src/lib/` directory**
  - `libs/` contains: `payloadclient.ts`, `server.ts`, `utils.ts`
  - `lib/` contains: `brand.ts`, `exec-dashboard-auth.ts`, `google-sheets.ts`, `page-themes.ts`, `referral-email.ts`, `referral.ts`
  - Move all `libs/` files into `lib/`, update all imports across the codebase, delete `libs/`

- [x] **A2. Move `src/config/exec-dashboard.ts` into `src/lib/`**
  - `config/` only has this single file; `lib/` already has `exec-dashboard-auth.ts` — they belong together
  - Update imports, remove empty `config/` directory

- [x] **A3. Simplify `src/lib/brand.ts`**
  - `BRAND_COLORS` duplicates color values already defined in `styles.css`
  - Only `STRIPE_APPEARANCE` is actively consumed (by the registration form)
  - Reduce to just `STRIPE_APPEARANCE` and a comment pointing to `styles.css` as the source of truth for colors

---

## B. Feature Archival (Leaderboard & Referral)

- [x] **B1. Archive referral system and leaderboard code**
  - Created branch `archive/referral-leaderboard` to preserve the code, then removed from `main`:
    - Pages: `src/app/(frontend)/leaderboard/` (removed), `src/app/(frontend)/success/` (simplified, not removed)
    - API routes: `src/app/api/leaderboard/`, `src/app/api/get-referral-code/` (removed)
    - Lib: `src/lib/referral.ts`, `src/lib/referral-email.ts` (removed; email repurposed as `signup-email.ts`)
  - Removed referral-related code from Stripe webhook and update-payment-intent route
  - `src/app/api/exec-dashboard/leaderboard/` kept — it tracks signups by exec member (still relevant)
  - Referral fields remain in the DB schema; just removed from active code paths
  - **Remaining cleanup**: `src/scripts/seed-referrals.ts` is now dead code (referral seed script) — delete in C4
  - **Remaining cleanup**: Referral fields still in `Registrations.ts` collection config (`referralCode`, `referralPoints`, `referredBy`) and `defaultColumns` — remove from config (DB columns can stay)

- [x] **B2. Clean up registration form**
  - Removed referral code input field from `RegistrationForm.tsx`
  - Kept "Signed Up By" exec member dropdown — still used for exec dashboard tracking

- [x] **B3. Simplify the success page**
  - Removed referral code display, copy button, and leaderboard link
  - Now shows a plain "Welcome to TANSA! / payment confirmed" card
  - Confirmation email (`src/lib/signup-email.ts`) still sends after payment via Stripe webhook

---

## C. Dead Code & Cruft Removal

- [x] **C1. Resolve uncommitted working tree changes**
  - Previous agent committed: CSVUpload deletion, LoginForm fix, package.json, payload-types changes
  - Added `*.csv` to `.gitignore` (the `2026 Sponsors` CSV is data, not code)
  - Migration files (`20260408_045642.json`, `.ts`) are needed — they're referenced by `migrations/index.ts` but were never committed. Will be committed with this batch.
  - Fixed smart quote TypeScript error in `success/page.tsx` (introduced by previous agent)

- [x] **C2. Fix the startup migration prompt**
  - **Root cause**: Schema drift between the Payload config and the live database. In dev mode, Payload uses `db.push` (Drizzle schema push), which compares the *current Payload config* directly against the *live DB schema* — migration files are not involved in dev mode (they're only used in production via `payload migrate`).
  - The mismatch was caused by referral fields (`referralCode`, `referralPoints`, `referredBy`) existing in the DB but being removed from the Payload config during the referral archival (B1/G4). Payload detected the orphaned columns and prompted to drop them.
  - **Fix**: The prompt resolved after the schema push was accepted during a dev session, syncing the DB to match the updated config. No longer prompts on `pnpm dev`.

- [x] **C3. Audit and remove unused npm dependencies**
  - Removed: `@payloadcms/payload-cloud` (template leftover, never imported), `lucide` (only `lucide-react` is used), `xlsx` (unused after CSV upload refactor), `tsx` (no scripts remain after seed-referrals deletion)
  - Kept: `resend` (signup confirmation emails), `csv-parser` (sponsor CSV import), `googleapis` (Google Sheets sync), `graphql` (Payload peer dep)
  - **`src/lib/signup-email.ts`** — already simplified in prior cleanup (no referral content remaining)

- [x] **C4. Clean up untracked/orphaned files**
  - `src/migrations/20260408_045642.json` is a drizzle schema snapshot — needed, will be committed
  - Deleted `src/scripts/seed-referrals.ts` and removed empty `src/scripts/` directory

---

## D. Code Quality & Consistency

- [ ] **D1. Standardize API route patterns**
  - Audited all 9 API routes. Main inconsistencies:
    - Auth endpoint uses `{ ok: boolean }`, update-payment-intent uses `{ success: true }`, others return data directly
    - Newsletter returns 201 on create, others return 200
    - Stripe webhook returns non-200 on internal errors (could trigger Stripe retries — Stripe re-sends webhooks for non-2xx responses)
  - **Status**: Deferred — these are cosmetic inconsistencies with no user-facing impact. Standardizing response shapes risks introducing bugs in working code for zero functional benefit. The Stripe webhook retry behavior is the only one with potential operational impact, but hasn't caused issues in practice.
  - **When to do this**: Best paired with other work that already touches API routes, so changes get tested naturally. Most likely triggers: (1) yearly reset implementation (G2) if it adds/modifies routes, (2) a Payload version upgrade that forces route changes, or (3) any new feature that adds API endpoints. Avoid doing this as a standalone refactor.

- [x] **D2. Review photo gallery code quality**
  - Gallery layout algorithm is well-structured (justified layout with simulated aspect ratios — reasonable when CMS doesn't provide real dimensions)
  - Fixed: removed redundant `containerWidth <= 0` condition (duplicate of `< 640` branch)
  - Fixed: blob URL memory leak in download function (missing `URL.revokeObjectURL`)
  - Fixed: removed unused `url` parameter from `getImageDimensions()`
  - Fixed: removed artificial 500ms delay in `EventsGrid.loadMore()` (bootleg loading simulation)
  - Fixed: extracted `deriveSlug()` to `src/lib/utils.ts` (was duplicated in EventsGrid and event detail page)
  - Fixed: deduplicated overlay JSX in `EventsCarousel.tsx`
  - Fixed: simplified nav arrow condition in carousel (removed dead `images.length === 0` branch)
  - Removed stale file-path comments from component headers

- [x] **D3. Audit component exports and imports**
  - All components are actively used — no orphaned components found
  - Removed unused `EventCardSkeleton` import from `EventsGrid.tsx` (was only used for the removed loading state)
  - Cleaned up debug `console.log` statements in `Footer.tsx` (newsletter subscription)
  - Export patterns are consistent within categories (UI = named, feature components = default)

- [x] **D4. Review `page-themes.ts` clarity**
  - Removed dead `/leaderboard` entry from `PAGE_THEMES` and `INVERTED_FOOTER_PAGES`
  - The system is clean and self-explanatory: route → color name mapping, with a fallback to 'pink'

---

## E. Theming & Rebranding Prep

- [ ] **E1. Audit hardcoded brand references**
  - Search for hardcoded color hex values (e.g. `#ED2E88`, `#4A9BAD`)
  - Search for year references (`2026`, `26`)
  - Search for club-specific text that might change
  - Document every location that needs updating for a rebrand
  - Known: `src/lib/signup-email.ts` has hardcoded `EMAIL_COLORS` with brand hex values (needed for email HTML, can't use CSS vars)

- [ ] **E2. Centralize rebrandable assets**
  - Bear SVGs are in `public/bears/` (good)
  - Logos are scattered in `public/` root (`TANSA-LOGO.svg`, `tansa-text.svg`, `20.svg`, `26.svg`, etc.)
  - Consider organizing into `public/brand/` with clear naming
  - Favicon (`favicon2026.png`) needs a clear replacement path

- [ ] **E3. Create a rebranding checklist**
  - Document the exact steps for a yearly rebrand:
    1. Colors: update `src/app/(frontend)/styles.css` custom properties + `src/lib/brand.ts` Stripe colors
    2. Assets: replace SVGs in `public/bears/` and `public/brand/`
    3. Fonts: replace files in `public/fonts/`, update `@font-face` in layout or CSS
    4. Favicon: replace and update references
    5. Year-specific text: update any hardcoded year strings
  - This checklist should live in `CLEANUP.md` or a separate `REBRANDING.md`

- [x] **E4. Review Payload CMS admin UX for non-technical users**
  - Admin panel collections now grouped: Content (Events, Media), Sponsors (Sponsors, Logos, SponsorCSVUploads), Members (Registrations, Exec, NewsletterEmails), Admin (Users)
  - Instagram field on Sponsors now required
  - SponsorCSVUploads and Sponsors CSV upload field already have admin descriptions explaining usage

---

## F. Infrastructure & Config

- [ ] **F1. Review deployment configuration**
  - `Dockerfile`: multi-stage build with Node 20.16 + pnpm 10 — verify it's clean and up to date
  - `fly.toml`: shared-cpu-1x, 512MB RAM, Sydney region — confirm this is still appropriate
  - Document any deployment steps not captured in config

- [x] **F2. Update `.env.example`**
  - Added Google Sheets env vars (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`) with comments
  - Added `NEXT_PUBLIC_SITE_URL` (used in confirmation emails)
  - `RESEND_API_KEY` and `RESEND_FROM_EMAIL` already present with O-Week volume note

- [ ] **F3. Review the `start` script**
  - `"echo y | payload migrate && next start"` auto-approves migrations
  - Verify this is safe and intentional — could silently run destructive migrations
  - Consider if there's a safer pattern

---

## G. Yearly Reset Process

> Each year the club "resets": new exec team, new sponsors, registrations cleared before O-Week, some events kept/pruned. This section covers building a reliable process for that transition.

**Collections and their yearly behavior:**
| Collection | Reset? | Notes |
|---|---|---|
| Registrations | Clear all | Membership resets yearly. Export to CSV/Google Sheets first. |
| Exec | Replace all | Entirely new exec team each year. |
| Sponsors | Replace most | Some sponsors may carry over, but most change. |
| Events | Prune | Keep a few key events so the page isn't empty; remove the rest. |
| Media | Prune | Remove media orphaned by deleted events. |
| Logos | Prune | Remove logos orphaned by deleted sponsors. |
| Newsletter Emails | Keep or clear | Decision needed — do subscribers carry over? |
| Users (admin) | Update | Hand over admin credentials to new exec. |

- [ ] **G1. Decide on yearly reset approach** *(decision deferred — does not block C/D/E cleanup)*

  The key architectural question: should the yearly reset (and brand/theme changes) be fully manageable through the Payload admin UI, or require some CLI/dev work?

  **Context from discussion:**
  - The club is non-technical; CLI access is high friction in future years
  - Moving brand assets (SVGs, colors) into a Payload Global is feasible and performant (assets served from S3/CDN, colors injected as CSS vars in layout, Next.js caches the queries)
  - Fonts are the one tricky area — may be kept as static files in `public/fonts/`
  - Full Payload approach = more upfront work but zero CLI for future years
  - Hybrid approach = reset script now, brand-in-Payload later

  **Options under consideration:**
  - **Option A**: Payload admin export + manual delete (no custom code, but tedious)
  - **Option B**: CLI reset script (`pnpm yearly-reset`) — one command, handles orphaned media
  - **Option C**: Admin UI reset action + Brand Settings global in Payload — most accessible, most implementation effort
  - **Hybrid**: Option B now, move brand into Payload later

  **Newsletter subscribers**: Clear each year (confirmed).

- [ ] **G2. Implement chosen reset approach** *(blocked on G1)*

- [x] **G3. Extend Payload import/export plugin**
  - Extended to all content collections: `users`, `registrations`, `exec`, `sponsors`, `events`, `logos`, `newsletter_emails`
  - Enables admin-panel export of any collection's data before yearly reset

- [x] **G4. Remove referral fields from Registrations collection config**
  - `referralCode`, `referralPoints`, `referredBy` fields still in `src/collections/Registrations.ts`
  - Remove from the `fields` array and from `defaultColumns`
  - DB columns can remain (no migration needed) — they'll just be unused
  - This simplifies the admin view and reduces confusion for future maintainers

- [ ] **G5. Document the yearly handover process** *(blocked on G1/G2)*
  - Write a step-by-step handover checklist covering:
    1. Export/backup current year's data
    2. Reset collections (via chosen method)
    3. Update brand assets (cross-ref with E3 rebranding checklist)
    4. Update admin credentials
    5. Update env vars if any services change (Stripe, Resend, Google Sheets, etc.)
    6. Update `.env` on Fly.io
    7. Deploy

---

## Verification Checklist (after all tasks)

- [ ] `pnpm dev` starts without migration prompts or errors
- [ ] Home page loads correctly
- [ ] About page shows exec team
- [ ] Events page and individual event galleries work
- [ ] Sponsors page displays with filtering
- [ ] Sign-up flow works end-to-end (Stripe test mode)
- [ ] Exec dashboard login and functionality works
- [ ] Payload admin panel CRUD works for all collections
- [ ] No console errors or broken imports
- [ ] All routes return expected responses
