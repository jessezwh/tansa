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

- [x] **B2. Clean up registration form**
  - Removed referral code input field from `RegistrationForm.tsx`
  - Kept "Signed Up By" exec member dropdown — still used for exec dashboard tracking

- [x] **B3. Simplify the success page**
  - Removed referral code display, copy button, and leaderboard link
  - Now shows a plain "Welcome to TANSA! / payment confirmed" card
  - Confirmation email (`src/lib/signup-email.ts`) still sends after payment via Stripe webhook

---

## C. Dead Code & Cruft Removal

- [ ] **C1. Resolve uncommitted working tree changes**
  - Review and commit or revert:
    - Deleted `src/components/CSVUpload.tsx` — determine if this was intentional
    - Modified `src/components/exec-dashboard/LoginForm.tsx`
    - Modified `package.json`
    - Modified `src/payload-types.ts`
  - The untracked `2026 Sponsors - Website Sponsors.csv` should be gitignored or removed
  - The untracked migration files (`src/migrations/20260408_045642.json`, `.ts`) — determine if needed

- [ ] **C2. Fix the startup migration prompt**
  - Running `pnpm dev` prompts to delete a collection — likely schema drift between Payload config and database
  - Identify which collection is being flagged and why
  - Resolve by either updating the Payload config or running/fixing the migration

- [ ] **C3. Audit and remove unused npm dependencies**
  - After archiving referral/leaderboard, check if any packages can be removed (e.g. `resend` if referral emails were its only use)
  - Look for any other unused dependencies

- [ ] **C4. Clean up untracked/orphaned files**
  - Review `src/migrations/20260408_045642.json` — is this a drizzle snapshot or orphaned?
  - Check for any other files that shouldn't be in the repo

---

## D. Code Quality & Consistency

- [ ] **D1. Standardize API route patterns**
  - Review all routes in `src/app/api/` for consistent:
    - Error handling (try/catch, error responses)
    - Response format (consistent JSON shape)
    - Auth patterns (cookie validation)
    - HTTP status codes

- [ ] **D2. Review photo gallery code quality**
  - `src/components/events/EventsGalleryClient.tsx` — flagged as potentially containing hasty fixes
  - Read through, verify code quality, clean up any inconsistencies
  - Check the justified layout algorithm for correctness and clarity

- [ ] **D3. Audit component exports and imports**
  - Verify no orphaned or redundant components after feature archival
  - Check for inconsistent export patterns (default vs named)
  - Remove any unused imports

- [ ] **D4. Review `page-themes.ts` clarity**
  - Ensure the page theming system is straightforward — future devs will need to understand how page colors work

---

## E. Theming & Rebranding Prep

- [ ] **E1. Audit hardcoded brand references**
  - Search for hardcoded color hex values (e.g. `#ED2E88`, `#4A9BAD`)
  - Search for year references (`2026`, `26`)
  - Search for club-specific text that might change
  - Document every location that needs updating for a rebrand

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

- [ ] **E4. Review Payload CMS admin UX for non-technical users**
  - Ensure collection fields have helpful `description` text in Payload configs
  - Verify the admin panel is intuitive for managing execs, sponsors, events
  - Add any missing field descriptions or admin labels

---

## F. Infrastructure & Config

- [ ] **F1. Review deployment configuration**
  - `Dockerfile`: multi-stage build with Node 20.16 + pnpm 10 — verify it's clean and up to date
  - `fly.toml`: shared-cpu-1x, 512MB RAM, Sydney region — confirm this is still appropriate
  - Document any deployment steps not captured in config

- [ ] **F2. Update `.env.example`**
  - Ensure all required env vars are listed after cleanup
  - Remove any referral/leaderboard-specific env vars if applicable (e.g. `RESEND_API_KEY` if no longer used)
  - Add comments explaining what each var is for

- [ ] **F3. Review the `start` script**
  - `"echo y | payload migrate && next start"` auto-approves migrations
  - Verify this is safe and intentional — could silently run destructive migrations
  - Consider if there's a safer pattern

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
