# UI/UX Feedback Remediation Brief

**Source:** Vik's walkthrough of the six marketing pages (home, frameworks, how-it-works, pricing, meet-cypher, privacy, terms).
**Audience:** Claude Code agent executing the fixes.
**Goal:** Remediate every issue below, page by page, without regressing other areas. All changes must hold to `CLAUDE.md` architecture rules (no direct Supabase / Claude calls from components, env via `lib/config/env.ts`, etc.).

---

## 0. Global issues (apply everywhere)

### 0.1 Header nav is visually off-centre
**File:** `components/marketing/TopNav.tsx`

**Symptom:** The three primary nav links (`How It Works`, `Frameworks`, `Pricing`) sit visually left-of-centre between the `Simplify IS` logo on the left and the `Login` / `Get Started` buttons on the right. Every page body is properly centred, so the nav misalignment is noticeable on every route.

**Fix:**
- Use a three-column grid (or flex with left/centre/right absolute groupings) so the **centre nav group is truly centred to the viewport**, independent of the width of the logo block or CTA block.
- Recommended structure:
  ```tsx
  <nav className="grid grid-cols-3 items-center ...">
    <div className="justify-self-start">{/* Logo */}</div>
    <div className="justify-self-center flex gap-8">{/* How It Works | Frameworks | Pricing */}</div>
    <div className="justify-self-end flex gap-3">{/* Login | Get Started */}</div>
  </nav>
  ```
- Validate the header at `sm`, `md`, `lg`, `xl`, `2xl` breakpoints. The centre group must stay centred to the viewport at every width, not centred between the two edge groups.
- Mobile: keep existing hamburger behaviour, do not regress.

### 0.2 New global component — `ContactUsModal`
**New file:** `components/modals/ContactUsModal.tsx`

A reusable overlay modal that replaces every `Book a Demo` CTA across the marketing site. Colour scheme and tone must match the existing marketing surfaces (same gradients, typography, border treatment as `MarketingShell` and the existing dashboard modals in `components/modals/`).

**Fields:**
1. `name` — required, text
2. `country` — required, text (free-text for now; dropdown can come later)
3. `message` — required, textarea — instruct the user to include preferred contact method (email preferred)

**UX:**
- Opens as a centred overlay with a subtle backdrop blur (match existing modal patterns in `components/modals/ChangePasswordModal.tsx`).
- Close affordances: `X` button top-right, `Esc` key, backdrop click.
- Submit button state machine: `idle → submitting → success | error`.
- On success, show an inline confirmation ("Thanks — we'll be in touch shortly.") and auto-close after ~2s.
- On error, show an inline error message; do not close the modal.
- Form validation client-side (required fields, min message length 10 chars). Server-side validation mandatory in the API route.

**Submission backend:**
- **New API route:** `app/api/v1/contact/route.ts` (POST).
- Validates payload with a zod schema (follow the existing `/api/v1/` conventions).
- Sends an email to Simplify's inbox (use the existing Resend integration — `RESEND_API_KEY`, `RESEND_FROM_EMAIL`). Recipient inbox: use `VIK_ALERT_EMAIL` from `lib/config/env.ts`.
- Rate-limit per IP (reuse existing rate-limit utility — 5 submissions / hour / IP is fine).
- No auth required (this is a public marketing form) — but still JWT-validate-optional pattern so we can track logged-in submitters if present.
- Log the submission to a `contact_submissions` table (Supabase). Schema:
  ```sql
  create table public.contact_submissions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    country text not null,
    message text not null,
    submitter_ip text,
    submitter_user_id uuid references auth.users(id),
    created_at timestamptz not null default now()
  );
  alter table public.contact_submissions enable row level security;
  -- RLS: service role only (no anon select/insert — inserts happen via service key from API route)
  ```
- Add migration under `supabase/migrations/`.

**Where it's wired:**
- Every `Book a Demo` button on the marketing site opens this modal (see per-page sections below for the exact buttons).
- Export a small hook `useContactUsModal()` or use an existing modal provider pattern to let any page open it without prop drilling.

---

## 1. Home page (`app/(marketing)/page.tsx`)

### 1.1 Header nav off-centre
Covered globally in §0.1.

### 1.2 Compliance Intelligence — missing tile imagery
**Section:** "Compliance Intelligence" block with two tiles:
1. Global Standards
2. Regional Compliance

**Symptom:** Both tiles have the grey/orange decorative blocks but no icon/illustration above the titles. They look visually incomplete compared to the other tile sections on the page.

**Fix:**
- Add an appropriate icon / illustration above each tile title, matching the visual treatment used elsewhere on the home page (same icon container style, same sizing).
  - **Global Standards** → globe / world icon (e.g., `Globe` from lucide-react).
  - **Regional Compliance** → map / regional icon (e.g., `MapPinned` or `Map` from lucide-react).
- Keep the orange/grey decorative blocks — add the icon on top of them so they read as intentional backdrops, not placeholders.

### 1.3 Compliance Intelligence — replace `Request Access` with `Browse Modules`
**Symptom:** Both tiles currently link to a `Request Access` CTA that routes to the login screen. This is the wrong intent for a visitor exploring compliance coverage.

**Fix:**
- Rename both CTAs from `Request Access` → `Browse Modules`.
- Both buttons should link to the Frameworks page (`/frameworks`).
- From there users can explore and hit the existing `Get Started` / login flow naturally.

---

## 2. Frameworks page (`app/(marketing)/frameworks/page.tsx`)

### 2.1 Rationalise the framework tile set
**Target tile list (in this order):**

**Ready-to-use (available now):**
1. ISO/IEC 27001:2022 — status: **Ready**
2. NIST CSF 2.0 — status: **Ready**
3. APRA CPS 234 — status: **Ready** *(this was listed as "Register for early access" — promote it to Ready so it matches the other two)*

**Coming soon (show tile but mark as Coming Soon, no CTA):**
4. PCI DSS 4.0 — Coming Soon
5. SOC 2 — Coming Soon
6. HIPAA — Coming Soon

**Remove:** Any `Register for early access` CTA under APRA CPS 234.

**Visual treatment for Coming Soon tiles:**
- Slightly desaturated / dimmed styling.
- Replace the primary CTA with a `Coming Soon` label (non-interactive or a muted-styled button).
- Keep the tile clickable only if it leads somewhere useful (e.g., a short description); otherwise keep it informational only.

### 2.2 End-of-page CTA section — "Future Proof Your Security Posture"
**Symptom:** The section currently has a `Book a Demo` button.

**Fix:**
- Keep a `Get Started` button (primary) — routes to the existing signup flow.
- Add a secondary button: `Contact Me` — opens the `ContactUsModal` from §0.2.
- Remove the `Book a Demo` label entirely.

---

## 3. How It Works page (`app/(marketing)/how-it-works/page.tsx`)

### 3.1 "Ready to start your first consultation" CTAs
**Buttons:**
1. `Get Started` → **keep as-is** (routes to signup).
2. `Book a Demo` → **change to `Contact Us`** → opens the `ContactUsModal` from §0.2.

No other changes on this page.

---

## 4. Pricing page (`app/(marketing)/pricing/page.tsx`)

### 4.1 Add-on modules list — availability statuses
**Available now:**
- APRA CPS 234 — **Available as add-on**

**Coming soon (all of the following):**
- Essential Eight — Coming Soon
- SOC 2 — Coming Soon
- APRA CPS 230 — Coming Soon
- PCI DSS 4.0 — Coming Soon
- HIPAA — Coming Soon
- NIST AI RMF — Coming Soon

**Visual treatment:** Mirror §2.1 — Coming Soon modules should be visually muted with a `Coming Soon` badge in place of the add-to-cart / toggle affordance.

### 4.2 Three-tile plan row — middle tile rewrite
**Current:** Three tiles below the add-ons. The middle tile currently references "monolithic records" / "built for permanency" language that doesn't land.

**Fix:**
- Rewrite the middle tile's heading and body copy so it speaks to the actual value prop of this tier. Drop "monolithic records" entirely.
- Keep the left and right tiles as they are (Scale / standard build for permanency and TRIAL tile on the left; Essential in the middle position was the callout — confirm layout in code before rewriting).
- Propose replacement copy (use whichever fits the tier this tile represents):
  - **Heading option A:** "Built for evidence that lasts" — body: "Every assessment, decision, and control mapping is captured as an auditable record — ready for your next auditor, not just your next board meeting."
  - **Heading option B:** "Assessment continuity, guaranteed" — body: "Pick up where you left off, year after year. Your maturity trajectory, mapped across frameworks, preserved across renewals."
  - Pick the one that matches the tier's actual positioning and adjust to the surrounding tone.

### 4.3 End-of-page CTA — "Elevate your security posture today"
**Buttons:**
1. `Get Started` → **keep as-is** (routes to payment / signup).
2. `Book a Demo` → **change to `Contact Us`** → opens the `ContactUsModal` from §0.2.

---

## 5. Meet Cypher page (`app/(marketing)/meet-cypher/page.tsx`)

### 5.1 Three-tile section — rewrite headings, copy, and icons
**Current tiles:**
1. Architectural Integrity
2. Private Sovereignty
3. Predictive Forensic

**Symptom:** The headings feel like placeholder / high-level marketing text and don't tie to what Cypher actually does.

**Fix — rewrite all three tiles (heading + one-line body + icon).** Target tone: specific, grounded in what the product does, matching the rest of Cypher's positioning on this page.

**Proposed replacements (tune to match surrounding copy):**

1. **Heading:** "Framework-Native Reasoning"
   **Body:** "Cypher reasons directly in ISO 27001:2022 and NIST CSF 2.0 control language — not generic security prose translated after the fact."
   **Icon:** `Layers` or `Blocks` (lucide-react)

2. **Heading:** "Your Data Stays Yours"
   **Body:** "Every assessment runs in a tenant-isolated vault. No cross-customer training, no silent data reuse, auditable on request."
   **Icon:** `ShieldCheck` or `Lock` (lucide-react)

3. **Heading:** "Evidence-Backed Recommendations"
   **Body:** "Every finding cites the exact control, clause, and conversation turn it came from — so your next audit starts with the trail already laid."
   **Icon:** `FileSearch` or `ClipboardCheck` (lucide-react)

The agent executing this may propose alternative wording if the surrounding page copy suggests a sharper angle — just keep each heading ≤ 4 words and each body ≤ 22 words.

---

## 6. Privacy Policy (`app/(marketing)/privacy/page.tsx`)

### 6.1 Left-hand nav active-state is broken
**Symptom:** The left nav lists:
1. Data Collection
2. How We Use Data
3. Data Isolation & Retention
4. Your Rights
5. Changes to this Privacy Policy

Clicking a nav item scrolls to the right section (that part works). **The bug:** the active highlight never moves — `Data Collection` stays highlighted (orange / grey-with-orange-bar styling) regardless of which section the user scrolls to or clicks into.

**Fix:**
- Wire the nav active-state to the currently-visible section using an **IntersectionObserver** on each section heading.
- The observer should set the active section ID and the nav renders the matching item with the existing active styling.
- On click: update the active ID immediately (don't wait for scroll) and scroll to the section using `scrollIntoView({ behavior: 'smooth', block: 'start' })`.
- Respect `prefers-reduced-motion` — fall back to `behavior: 'auto'` if set.
- Make sure the URL hash updates (`history.replaceState`) so deep links work.
- All section headings must have stable IDs (`id="data-collection"`, etc.).

### 6.2 Content review
Claude should re-read the privacy policy prose and flag anything that's obviously template filler, references the wrong company name, has TODOs, or contradicts our real practices (single-tenant vault, Supabase-hosted, Claude API usage). Make surgical edits only — no rewrite for the sake of it.

---

## 7. Terms of Service (`app/(marketing)/terms/page.tsx`)

### 7.1 Left-hand nav active-state is broken (same bug as §6.1)
**Nav items:**
1. Acceptance
2. Access Tier
3. Cypher AI
4. Data Retention
5. Liability

**Fix:** Identical remedy to §6.1 — IntersectionObserver-driven active state, click-to-scroll, URL hash sync, reduced-motion fallback. Extract the logic into a shared hook (e.g., `hooks/useScrollSpyNav.ts`) and reuse it on both Privacy and Terms pages so we don't duplicate the fix.

### 7.2 End-of-page `Contact Support` button routes to signup
**Symptom:** The "Contact Support" CTA at the bottom of Terms currently routes to the signup page, which is wrong.

**Fix:**
- Hook `Contact Support` to the `ContactUsModal` from §0.2. Same modal, same submission flow.

---

## 8. Implementation order (suggested)

To minimise rework and let Vik verify in logical chunks:

1. **§0.2** — Build `ContactUsModal` + the `app/api/v1/contact/route.ts` route + Supabase migration. This unblocks every CTA fix below.
2. **§0.1** — Fix the header nav centring (global, visible on every page).
3. **§6.1 / §7.1** — Build `useScrollSpyNav` hook, apply to Privacy and Terms.
4. **§1** — Home page fixes (tile imagery + CTA rename).
5. **§2** — Frameworks page fixes (tile rationalisation + CTA swap).
6. **§3** — How It Works CTA swap.
7. **§4** — Pricing add-on statuses + middle tile rewrite + CTA swap.
8. **§5** — Meet Cypher three-tile rewrite.
9. **§6.2** — Privacy policy content review.

After each chunk: run `npm run dev`, load the affected page in the browser, verify visually at multiple breakpoints, check console for errors. Do NOT claim a chunk is complete on type-check / build alone — type-check verifies correctness, not feature correctness.

---

## 9. Acceptance checklist

**Global**
- [ ] Header nav (`How It Works` / `Frameworks` / `Pricing`) is centred to the viewport on every marketing page at all breakpoints.
- [ ] `ContactUsModal` opens, validates, submits, shows success + error states, closes on success.
- [ ] Contact submission emails Simplify's inbox via Resend.
- [ ] Contact submission row is persisted to `contact_submissions` table with RLS enabled.
- [ ] Contact submission rate-limited per IP.

**Home**
- [ ] Global Standards and Regional Compliance tiles each have a meaningful icon/illustration above their titles.
- [ ] Both tile CTAs read `Browse Modules` and route to `/frameworks`.

**Frameworks**
- [ ] Ready tiles: ISO 27001:2022, NIST CSF 2.0, APRA CPS 234.
- [ ] Coming Soon tiles: PCI DSS 4.0, SOC 2, HIPAA — with Coming Soon styling and no active CTA.
- [ ] No `Register for early access` copy anywhere on the page.
- [ ] End-of-page CTA: `Get Started` + `Contact Me` (opens modal). No `Book a Demo`.

**How It Works**
- [ ] `Get Started` unchanged.
- [ ] `Book a Demo` replaced with `Contact Us` that opens the modal.

**Pricing**
- [ ] Add-ons: APRA CPS 234 available; Essential Eight, SOC 2, APRA CPS 230, PCI DSS 4.0, HIPAA, NIST AI RMF all marked Coming Soon.
- [ ] Middle tile in the three-tile row rewritten; no references to "monolithic records".
- [ ] End-of-page: `Get Started` unchanged, `Book a Demo` replaced with `Contact Us` (opens modal).

**Meet Cypher**
- [ ] All three tiles have new headings, new bodies, and appropriate icons.
- [ ] No placeholder-feeling copy remains.

**Privacy**
- [ ] Scroll-spy active highlight moves as the user scrolls or clicks.
- [ ] URL hash updates on navigation.
- [ ] Content review pass completed, any template artefacts removed or corrected.

**Terms**
- [ ] Scroll-spy active highlight moves as the user scrolls or clicks (same hook as Privacy).
- [ ] `Contact Support` button opens the `ContactUsModal` instead of routing to signup.

**Non-negotiables (from `CLAUDE.md`)**
- [ ] No direct Supabase calls from components — all go through `lib/db/` abstractions or the new `/api/v1/contact` route.
- [ ] No `process.env` access outside `lib/config/env.ts`.
- [ ] `contact_submissions` table has RLS enabled.
- [ ] `/api/v1/contact` validates input with zod and handles errors explicitly.
- [ ] No `any` types introduced.
- [ ] New migration committed under `supabase/migrations/`.

---

# ROUND 2 FEEDBACK (April 2026 walkthrough — pre-login additions + post-login)

**Source:** Vik's second pass after Round 1 merged. Covers the Contact Us modal field set, pre-login copy review, header/footer consistency, the onboarding flow, the first-time dashboard zero-state, Framework View per-framework detail, Assessment landing logic, 404 styling, and missing sidebar entries.
**Audience:** Claude Code agent(s) executing the fixes.
**Pairing doc:** The locked UI/UX decisions remain in `SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md`. Where Round 2 tightens a locked decision, this doc is the source of truth and the master doc's Section 28 records the deltas.

---

## R2.0 Global (pre- and post-login)

### R2.0.1 `ContactUsModal` — add validated email field
**File:** `components/modals/ContactUsModal.tsx` + `app/api/v1/contact/route.ts`.

**Change:** The current modal asks for `name`, `country`, `message`. Add an **email** field (required) positioned between `name` and `country`. Strict email validation — RFC-5322 pattern, rejected on blur with inline hint "Enter a valid email address so we can reply."

- Update the zod schema in the API route to require `email: z.string().email().max(320)`.
- Persist `email` to `contact_submissions` (new column — ship a follow-up migration, or fold into the existing R1 migration if it hasn't shipped yet).
- When a logged-in user opens the modal (post-login Contact shortcut), pre-fill `name` + `email` from the session user and render them as read-only fields — only `country` + `message` are editable. The API route must re-verify the pre-filled values against the session rather than trusting the client.

### R2.0.2 Pre-login copy audit — strip every Stitch / template placeholder line
**Scope:** Every marketing page — home, how-it-works, frameworks, meet-cypher, pricing, privacy, terms.

Read every headline, subhead, tile body, metric, footer line, and CTA label. Flag anything that:
- Came verbatim from the original Google Stitch export.
- Uses filler language ("monolithic", "sentinel", "permanency" in contexts where it doesn't tie to the product).
- Refers to frameworks, modules, or capabilities we don't actually ship.
- Has numbers with no provenance (e.g., "73%" of something without a cited source).

**Action:** Replace every flagged line with copy that ties to what Simplify IS actually does (ISO 27001:2022 + NIST CSF 2.0 + APRA CPS 234 assessments, Cypher conversational consultant, maturity measurement, risk register, remediation roadmap). Australian English. Sentences from the master decisions doc are the reference tone. Keep the edits surgical — do not rewrite whole sections for the sake of it.

### R2.0.3 Header + footer consistency across pre-login
**Files:** `components/marketing/TopNav.tsx`, `components/layout/Footer.tsx`, `components/marketing/MarketingShell.tsx`.

- Header nav (`How It Works` | `Frameworks` | `Pricing`) must render identically on every pre-login page — same text, same order, same active-state treatment.
- Footer copyright line: **"© 2026 Simplify.IS"** verbatim. Remove any "© 2024 Simplify", any "built upon the monolithic architecture" fragment, any page-specific copyright variants.
- Footer link columns must render identically on every page — same sections, same order, same labels.
- Any footer link that currently 404s pre-login (Terms, Privacy, Contact) must resolve to the real page / modal.
- Remove the `Cookie Settings` link entirely (no page exists; revisit when we do).

### R2.0.4 Home — Compliance Intelligence tile alignment
**File:** `app/(marketing)/page.tsx` (Compliance Intelligence section).

**Symptom:** `Global Standards` and `Regional Compliance` tiles both have a `Browse Modules` CTA, but the Regional Compliance button sits slightly higher than the Global Standards button — the tiles' vertical rhythm drifts.

**Fix:** Use equal-height flex/grid rows so both tiles stretch to the same height and both buttons align to the same baseline. Validate at every marketing breakpoint (`sm → 2xl`). Use CSS Grid with `grid-template-rows: auto 1fr auto` inside each tile (or `h-full` flex-column with `mt-auto` on the CTA wrapper) so the CTA is pinned to the bottom irrespective of body copy length.

### R2.0.5 Frameworks page — expand the "Coming Soon" set
**File:** `app/(marketing)/frameworks/page.tsx`.

**Current state after R1:** Ready tiles are ISO 27001:2022, NIST CSF 2.0, APRA CPS 234. Coming Soon tiles are PCI DSS 4.0, SOC 2, HIPAA.

**Round 2 change:** The Coming Soon set on the frameworks page must match the add-on list on the pricing page. Add these tiles (keep them styled as Coming Soon — same treatment as R1 §2.1):
- Essential Eight
- SOC 2
- APRA CPS 230
- PCI DSS 4.0
- HIPAA
- NIST AI RMF

Each Coming Soon tile needs a one-line body explaining what the framework is, so a visitor understands what they're waiting for (e.g., "Australian Signals Directorate's eight prioritised mitigation strategies for cyber threats"). Tone matches the Ready tiles. No CTA on Coming Soon tiles.

---

## R2.1 Post-login — Login & Onboarding

### R2.1.1 Onboarding Step 1 — default-name hint
**File:** `components/onboarding/Step1.tsx`.

**Symptom:** The input asks for a consultant name without telling the user the name defaults to "Cypher" if left blank.

**Fix:** Add a secondary line under the input (secondary text colour, Montserrat 400, 13px):

> "Leave this blank and your consultant will be called **Cypher**. You can rename them anytime in Organisation Settings."

Reference master decisions §6.3 — backend behaviour (blank → "Cypher") is already locked; this is the missing UI hint.

### R2.1.2 Onboarding Step 2 — backfill organisation name from signup
**Files:**
- `app/api/v1/auth/signup/route.ts` — confirm we're capturing `organisation_name` at signup (it's collected in `components/auth/SignupForm.tsx`; verify it's persisted to either `auth.users.raw_user_meta_data.organisation_name` or directly to a staged field on the user row).
- `components/onboarding/Step2.tsx` — on mount, hydrate the `Organisation Legal Name` input with the value captured at signup.
- Add a `GET /api/v1/onboarding/prefill` endpoint (or fold into `GET /api/v1/auth/session`) that returns `{ organisation_name, full_name, job_title }` drawn from the signup record.

**UX:** The field is still editable — users can correct typos or provide a proper legal name — but it's pre-populated so they don't re-type. If nothing was captured at signup, the field renders empty (today's behaviour).

**Backend task — parked for the next agent:** persist the signup-time `organisation_name`, `full_name`, `job_title` to a staged location, and wire `/api/v1/onboarding/*` endpoints to read/write onboarding state durably (step index, answers, completion flag). This unblocks R2.1.3 as well.

### R2.1.3 Onboarding — persist progress across Back / Continue
**Files:** `components/onboarding/Step1.tsx` through `Step4.tsx` + new onboarding state endpoint.

**Symptom:** Moving forward and back through steps drops the user's inputs — hitting Back from Step 3 clears the Step 2 organisation fields; hitting Back from Step 2 clears the Step 1 agent name.

**Fix — two layers:**
1. **Client layer (ship now):** a shared onboarding state provider (React context or Zustand store) that holds `agentName`, `organisation`, `frameworks` across the four steps. Hydrate from `sessionStorage` on mount so an accidental refresh mid-flow doesn't reset the user. Back / Continue navigate without losing state.
2. **Backend layer (parked task):** every step submit writes to Supabase (`users.agent_name`, `organizations.*`, `organizations.selected_frameworks`, `organizations.onboarding_step`). On mount, each step loads its own values from the DB. This gives durability beyond the session cookie — user can close the tab, return tomorrow, resume at the same step with all prior inputs pre-filled.

Master decisions §6.4 already specifies "Previous inputs persist (load from DB on mount)" as a locked requirement — this just calls out the backend as an explicit follow-up.

### R2.1.4 Onboarding Step 3 — visible selection affordance on framework tiles
**File:** `components/onboarding/Step3.tsx`.

**Symptom:** Clicking an APRA CPS 234 tile toggles selection (✓ appears / disappears) but there's no always-visible circle showing the tile is selectable; users don't realise it's tickable until they click.

**Fix:** Every selectable tile renders a **circle checkbox** in the top-right corner at all times:
- Unselected: empty 20×20px circle, 1.5px stroke in `outline` colour, transparent fill.
- Hover (enabled, unselected): circle stroke brightens to `on-surface`.
- Selected: circle fills with `primary` (#EB5E28 light / #FFB59C dark); white tick inside (Lucide `Check`, 14×14px).
- Disabled ("Coming Soon"): no checkbox rendered; `COMING SOON` pill takes that slot instead.

Tile border / glow treatment from master §6.5 stays — the checkbox is additive, not a replacement. Applies to ISO, NIST, APRA tiles on Step 3. Selection logic (ISO + NIST forced-on, APRA toggleable) is unchanged.

### R2.1.5 Onboarding Step 4 — portal-orientation tiles must mirror the real sidebar
**File:** `components/onboarding/Step4.tsx`.

**Symptom:** Portal-orientation grid currently renders six tiles (Dashboard, Assessment, Maturity Roadmap, Progress & Milestones, Team, Admin Settings). Two of those don't match the shipped sidebar — there is no standalone Team tab, and Admin Settings lives under the user-avatar dropdown rather than the sidebar.

**Fix:** Rebuild the grid to mirror the actual sidebar (master §4.1). Render exactly:
1. **Dashboards** — Industry / Framework / Risk views (LayoutGrid icon)
2. **Assessment** — Collaborate with `{agent-name} 🤖` to complete deep-dive assessments (ClipboardCheck)
3. **Maturity Roadmap** — Ongoing obligations, uplift actions, industry shifts (Route)
4. **Progress & Milestones** — Review historic maturity trends and celebrate wins (TrendingUp)
5. **Organisation Settings** — Invite team, manage billing, preferences, audit (Building2) — **admin-only**; skip this tile for non-admin invitees

Every reference to `Cypher` in the tile copy must swap to the dynamic agent name (placeholder `{agent-name}` resolved from `users.agent_name`). This is the same substitution used elsewhere in the app.

Tile copy stays short (1–2 sentences). Tiles are informational — clicking them does not navigate; only `Launch Application` proceeds.

---

## R2.2 Post-login — Footer + 404 + Contact shortcut

### R2.2.1 Logged-in footer — `Contact` link must open a pre-filled modal, not 404
**Files:** `components/layout/Footer.tsx` (or wherever the authenticated-layout footer lives) + `components/modals/ContactUsModal.tsx`.

**Fix:**
- Reuse `ContactUsModal` from R1 §0.2 (extended with the email field from R2.0.1).
- When opened from an authenticated context, pre-fill `name` + `email` from the session (read-only). The user only types their message; country optional when pre-filled from profile.
- Submission flow is identical to the pre-login path (`/api/v1/contact`), but the API stores the submitter's `user_id` so the email that lands in Vik's inbox identifies the logged-in user and their organisation.

### R2.2.2 Logged-in footer — copy + link clean-up
- Copyright line: **"© 2026 Simplify.IS"** — remove the "built upon the monolithic architecture" fragment and any sibling marketing sentence.
- Links row: `Terms of Service` → `/terms`, `Privacy Policy` → `/privacy`, `Contact` → opens the authenticated Contact modal (R2.2.1).
- **Remove** `Cookie Settings` link entirely.
- These three links must point to the same pages the pre-login footer points to (master §5, §R2.0.3).

### R2.2.3 404 page — alignment + copy review
**File:** find the `not-found.tsx` (app router) — likely `app/not-found.tsx` or similar.

**Symptoms:**
- The three tiles (`Registry Audit`, `Access Protocol`, `Sentinel Status`) don't vertically align — the middle tile drops slightly.
- The tile copy is Stitch-style filler — none of it ties to what Simplify IS does.

**Fix:**
- Use a CSS Grid or equal-height flex row so all three tiles share the same top / bottom baseline regardless of copy length.
- Rewrite the three tiles (or reduce to one) so the 404 talks about what the user can actually do here: "Return to Dashboard", "Review Frameworks", "Contact us". Icons matching each action. Australian English, calm, not in-character Stitch prose.
- Ensure the footer on this page carries the same "© 2026 Simplify.IS" line from R2.2.2 — not the monolithic-architecture sentence.

### R2.2.4 User-avatar dropdown — wire the actions
**Files:** `components/header/UserProfileDropdown.tsx` (or equivalent) + the modal components in `components/modals/`.

**Symptom:** Clicking `Edit Profile`, `Change Password`, `MFA Settings`, `Organisation Settings` inside the avatar dropdown does nothing (the menu blinks closed, no modal / route opens).

**Fix:** Wire each item to its existing destination:
- `Edit Profile` → open `EditProfileModal` (master §15.3).
- `Change Password` → open `ChangePasswordModal` (master §15.4).
- `MFA Settings` → open `MfaSettingsModal` (master §15.5).
- `Organisation Settings` → navigate to `/organisation/users` (admin only — hide the item entirely when `user.role !== 'admin'`, master §4.9).
- `Logout` → existing signOut flow → redirect to `/`.

The modals already exist per master §15 — the hookup is the missing piece.

---

## R2.3 Post-login — Dashboards

### R2.3.1 Industry Dashboard — zero-state must show zeros / placeholders, not fabricated numbers
**File:** `app/dashboard/industry/page.tsx` + any sub-components feeding the radar, metric tiles, and insight cards.

**Symptom:** A first-time user with no completed assessment currently sees numeric scores (e.g., `2.8 / 5.0`) and a peer percentile, as if they'd been assessed — this is misleading and erodes trust.

**Fix:**
- Replace any computed-looking metric with `—` (em dash) when no assessment has completed for that org.
- Radar chart: render **only the industry-benchmark polygon**; user polygon hidden until at least one assessment exists (master §8.9 already locks this pattern — this is the bug-fix reminder).
- Strengths / Strategic Priority / Your Progress tiles: replace with empty-state copy + CTA `Start your first assessment →` (master §8.9).
- Peer Percentile / Benchmark Gap tiles: render "—" with a small helper line "Complete an assessment to unlock this comparison."

### R2.3.2 Industry Dashboard — numeric labels on radar vertices
- Each of the six NIST axes (GV / ID / PR / DE / RS / RC) must render its **score as a numeric label** adjacent to the vertex, for both polygons (user's own score and peer average) when data exists.
- Label colour matches polygon colour (primary for user, outline for peer).
- Hide labels on the user polygon in zero-state (no user polygon drawn).
- Labels render in Geist Mono 11px, positioned outside the polygon edge by ~8px, anchored to avoid overlap at adjacent vertices (use a radial offset per axis).

### R2.3.3 Industry Dashboard — rename "Industry Metrics V2" and redesign the panel around peer comparison
**Symptom:** The right-hand rail on Industry View is labelled `Industry Metrics V2` in orange at a small size (why "V2"? — leftover from an iteration). Its content leans on personal metrics (strategic maturity gap, high-priority drifts) that belong on framework / risk pages, not on the "you vs. peers" dashboard.

**Fix:**
- **Rename** the rail heading to `Industry Metrics` — plain. Same heading treatment (Raleway 700, 20px, on-surface) as the other section headings on the page. No "V2", no orange micro-label.
- **Restructure** the panel so every tile is comparative (you vs. peers in your industry + size band):
  1. **Maturity Score** — your overall score + band (e.g., "2.8 / 5.0 · Top 34% of similar Technology orgs") — master §8.4.
  2. **Benchmark Gap** — "-0.4 behind peers" (red if negative, green if positive).
  3. **Strongest Domain vs. Peers** — the domain where you most exceed peer average, with the delta.
  4. **Weakest Domain vs. Peers** — the domain where you most trail peer average, with the delta.
  5. **Peer Progress** — an industry trend line: "Technology orgs gained +0.3 average maturity over the last 6 months" (placeholder content OK for MVP, sourced from the research agent).
- Move anything personal (high-priority drifts, strategic maturity gap) **off Industry View** and onto Framework View / Risk View where it belongs.

### R2.3.4 Industry Dashboard — heading hierarchy consistency
- `Maturity Radar`, `Industry Metrics`, `Your Strengths`, `Strategic Priority`, `Security Briefing`, `Your Progress` — every section heading uses the same treatment: Raleway 700, 20px, on-surface, no colour accents, no size swaps, no Geist Mono micro-labels pretending to be headings.
- Uppercase mono micro-labels (e.g., `INDUSTRY UPDATES`) are fine as sub-eyebrows **above** a heading, but they do not replace the heading.

### R2.3.5 Maturity Radar — subtitle on one line
- Current: "Real-time governance compliance across 6 NIST CSF 2.0 domains" currently wraps mid-phrase ("6 NIST" / "CSF 2.0 domains"). Force this to one line via `white-space: nowrap` or a wider container, or tighten the phrasing to "Real-time maturity across NIST CSF 2.0 domains" so it fits without a break.

### R2.3.6 Framework View — three distinct dashboards, one per framework
**File:** `app/dashboard/framework/page.tsx` (+ framework-specific sub-components).

**Symptom:** Framework View currently shows a single view regardless of the active framework tab. All three tabs (ISO 27001:2022, NIST CSF 2.0, APRA CPS 234) feel identical, with only a tree + a single control's detail on the right.

**Fix — per master §9.3:**
- **NIST CSF 2.0 tab:** compact D3 radar (user's polygon only, no peer benchmark) + six-function summary + tree + detail panel.
- **ISO 27001:2022 tab:** D3 stacked horizontal bars per ISO domain (% Compliant / % Non-Conformity / % Opportunity for Improvement) + tree + detail panel.
- **APRA CPS 234 tab:** D3 stacked horizontal bars per domain (% Level 2 / Level 3 / Level 4) + tree + detail panel.
- Each tab uses the same shell (tabs row, top summary cards, tree + detail split) but the top-left visualisation changes per framework.
- Each tab must expose a **"Download Report"** action in the top-right of the tab — PDF export placeholder acceptable for MVP (wire to Stripe-gated endpoint once the PDF engine is in).

**Pending input from Vik:** Claude AI discussion transcripts re: per-framework dashboard polish. Leave a `// PLACEHOLDER: pending Vik's Claude AI transcripts for framework-specific polish (R2.3.6)` comment at the top of each framework dashboard component so the next agent knows to revisit.

### R2.3.7 Risk View — entry flow bug + UX deepening
**Symptoms:**
- The Stage 1 "Does this risk apply?" prompt currently routes the user to Stage 2 regardless of answer (Yes or No both navigate forward to a populated risk list).
- Stage 2 renders a long flat risk list without the priority grouping described in master §10.3.

**Fix (bug):** "No" on Stage 1 must record `applies: false` and advance to the next Stage-1 risk (master §10.2), not jump to Stage 2. Only after all risks reviewed (or after a minimum N accepted) does Stage 2 open.

**Fix (UX):** Stage 2 must render per master §10.3 — three priority sections (Actively Tracking / Concerned but Managing / Aware but Low Priority), collapsible, with the 70/30 detail split.

**Pending input from Vik:** Claude AI transcripts on Risk View polish — same placeholder comment pattern as R2.3.6.

---

## R2.4 Post-login — Assessment

### R2.4.1 Assessment Landing — not-started state and CTA logic
**File:** `app/assessment/page.tsx`.

**Symptom:** A first-time user sees tile buttons `Resume Assessment` / `Re-assess`, plus populated completion percentages (72% ISO, 45% APRA, 0 / 5 NIST) — only NIST is correctly set to zero. The ISO and APRA tiles claim progress that doesn't exist.

**Fix:**
- Every tile defaults to `Status: Not Started`, `Maturity: — / 5.0` (or `Compliance: —%` for ISO), `Progress: 0%` until the user has actually answered a question for that framework.
- Single CTA per not-started tile: **`Start Assessment`**. Do not render `Resume Assessment` or `Re-assess` buttons until relevant.
- Render a greyed / disabled `Review with {agent-name} 🤖` button alongside, with a tooltip: **"You haven't flagged anything for review yet. Mark a question as 'Unsure — discuss with {agent-name}' during assessment to come back to it here."**
- Once the user flags a question, the grey state lifts and the button activates.

### R2.4.2 Assessment — selecting an answer + Next does nothing
**Files:** `app/assessment/[framework]/page.tsx` + state store + `POST /api/v1/assessment/answer`.

**Symptom:** On the in-assessment screen (NIST path tested), choosing an answer and clicking `Next` does not advance to the next question. No network call fires (or the call fires but the UI doesn't advance).

**Diagnosis checklist:**
1. Confirm the answer is being written to client state.
2. Confirm `Next` calls `POST /api/v1/assessment/answer` with the correct payload.
3. Confirm the server route exists and returns success.
4. Confirm the success handler advances the `currentQuestionIndex` (or navigates to the next question via router push).

**Fix:** Trace through and fix the broken link in the chain. If the backend route doesn't exist yet, stub it for now to return `{ ok: true }` and wire client-side advance off that response — the real scoring can land in the follow-up agent. Mark the stub with `// PLACEHOLDER: backend scoring pending (R2.4.2)`.

### R2.4.3 Assessment — header strings leaking slugs
**Symptom:** The in-assessment header renders raw slugs: `ISO_27001:2022assessment`, `quotient three of seven govorn gv01 gvoc01`.

**Fix:**
- Header format: `ISO 27001:2022 Assessment` (space-separated, titlecase, no underscore).
- Question label: `Question 3 of 7 · Govern · GV.OC-01` — substitute the domain's display name and the control's canonical ID. Never render the DB slug verbatim.
- Pull display names from the control catalogue (`ft_iso_controls` / `ft_nist_controls`) — these already have human-readable fields.

### R2.4.4 Assessment Landing — tile visual uplift
**File:** `app/assessment/page.tsx`.

**Symptom:** The landing tiles feel flat — plain cards with a title, a status line, and a button. Compared to the Industry Dashboard (the visual north star) they look half-finished.

**Fix:**
- Each tile gets: framework icon (Lucide, primary tint), status pill (`Not Started` grey / `In Progress` amber / `Completed` green), maturity-or-compliance bar with numeric label, summary sentence ("3 questions pending Sarah 🤖 review" when flagged), and the CTA row from R2.4.1.
- Add a 1–2 sentence paragraph above the buttons describing what the framework covers (keep it short — not a replay of the frameworks marketing page).
- Background surface matches `surface-container-high`, ambient shadow for elevation, no 1px borders (per design system §3.5).
- Entry animation: stagger fade-up on mount (respect reduced-motion).

---

## R2.5 Post-login — Progress & Milestones

### R2.5.1 Progress page — visual uplift + interaction polish
**File:** `app/progress/page.tsx` (+ timeline / comparison / milestones components per master §13).

**Symptom:** The page lands as a static list with no visual rhythm — feels incomplete compared to Industry Dashboard.

**Fix:** Build out the three tabs from master §13 (Timeline, Comparison, Milestones). Each tab needs its own visual language — D3 timeline, bar comparison, milestone ribbon — not a flat table. Add hover tooltips, click-through to the relevant control / domain, and empty-state copy for orgs with no historical data yet.

**Pending input from Vik:** Claude AI transcripts with the deeper Progress & Milestones discussion. Leave the `// PLACEHOLDER: pending Vik's Claude AI transcripts for Progress page polish (R2.5.1)` comment at the top of the page component.

---

## R2.6 Post-login — Sidebar

### R2.6.1 Missing `Organisation` entry in the sidebar
**File:** `components/layout/Sidebar.tsx` (or equivalent).

**Symptom:** The sidebar currently renders Dashboards, Assessment, Maturity Roadmap, Progress & Milestones — no `Organisation Settings` entry. Users can't invite team members or access the Audit / Billing / Preferences sub-pages except via the avatar dropdown.

**Fix:** Render the `Organisation Settings` top-level entry from master §4.1 (icon: `Building2`, collapsible, sub-items: Users, Preferences, Billing, Audit). Admin-only — hidden from the DOM entirely when `user.role !== 'admin'` (master §4.9). Active-state behaviour and auto-expand / auto-collapse rules per master §4.5, §4.8.

---

## R2.7 Acceptance checklist (Round 2)

**Pre-login additions**
- [ ] `ContactUsModal` adds a validated email field; submissions persist email; logged-in users see name + email pre-filled read-only.
- [ ] Every marketing page's headlines, tile copy, and CTA labels reviewed; no Stitch / template placeholder strings remain.
- [ ] Header nav and footer render identically across every pre-login page; footer copyright reads "© 2026 Simplify.IS".
- [ ] Home Compliance Intelligence tiles share equal height; `Browse Modules` buttons baseline-aligned at every breakpoint.
- [ ] Frameworks page Coming Soon set includes Essential Eight, SOC 2, APRA CPS 230, PCI DSS 4.0, HIPAA, NIST AI RMF — each with a one-line body; no CTA on Coming Soon tiles.
- [ ] `Cookie Settings` link removed from every footer.

**Onboarding**
- [ ] Step 1 shows the "defaults to Cypher" hint under the input.
- [ ] Step 2 Organisation Legal Name pre-fills from signup-captured value (fall back to empty if not captured).
- [ ] Step 1–4 retain all inputs when navigating Back and Continue (session-backed; backend persistence queued as follow-up task).
- [ ] Step 3 framework tiles render a visible empty circle checkbox at rest; tick appears inside the circle when selected.
- [ ] Step 4 portal-orientation tiles mirror the actual sidebar (Dashboards, Assessment, Maturity Roadmap, Progress & Milestones, Organisation Settings admin-only); agent name substituted dynamically.

**Post-login chrome**
- [ ] Authenticated `Contact` footer link opens the `ContactUsModal` with name + email pre-filled read-only.
- [ ] Footer copyright reads "© 2026 Simplify.IS"; no monolithic-architecture line; Cookie Settings removed; Terms / Privacy / Contact links resolve.
- [ ] 404 page tiles align to the same baseline; copy tied to Simplify IS actions (Return to Dashboard / Review Frameworks / Contact us).
- [ ] Avatar dropdown wires `Edit Profile`, `Change Password`, `MFA Settings`, `Organisation Settings` to their existing modals / routes.
- [ ] Sidebar renders `Organisation Settings` top-level entry (admin-only) with Users / Preferences / Billing / Audit sub-items.

**Dashboards**
- [ ] Industry View zero-state hides user-polygon and renders `—` for every metric; CTA points to `Start your first assessment`.
- [ ] Radar vertices render numeric score labels for both polygons when data exists.
- [ ] Right-hand rail heading is `Industry Metrics` (no V2); contents are peer-comparative only.
- [ ] Section headings across Industry View use the same Raleway 700 / 20px treatment — no stray sizes / colours / Geist Mono headings.
- [ ] Maturity Radar subtitle renders on one line.
- [ ] Framework View renders a distinct top-left visualisation per tab (NIST radar, ISO bars, APRA bars) + a Download Report action.
- [ ] Risk View Stage 1 `No` records applies=false and advances within Stage 1; Stage 2 renders three priority sections per master §10.3.

**Assessment**
- [ ] Assessment landing tiles default to `Not Started` + zeros until a question is answered; single `Start Assessment` CTA; greyed `Review with {agent-name} 🤖` button with explanatory tooltip.
- [ ] Selecting an answer + `Next` advances to the next question; answer persists to the backend (stub acceptable for scoring).
- [ ] In-assessment header renders humanised strings (`ISO 27001:2022 Assessment`, `Question 3 of 7 · Govern · GV.OC-01`) — no raw slugs.
- [ ] Landing tiles uplifted with icons, status pills, numeric progress bars, and summary sentence.

**Progress**
- [ ] Timeline / Comparison / Milestones tabs render per master §13, with empty states for no-history orgs; placeholder comment notes pending Claude AI transcripts.

**Non-negotiables (carry forward)**
- [ ] No placeholder strings / Lorem / Stitch exports anywhere in shipped code.
- [ ] Australian English across every new / edited string.
- [ ] WCAG AA across dark and light; reduced-motion respected on every new animation.
- [ ] No `process.env` reads outside `lib/config/env.ts`; no direct Supabase calls from components; no `any`.
