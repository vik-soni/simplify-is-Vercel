# Simplify IS — Page-by-Page Review & Next-Evolution Report

**Date:** 2026-04-26
**Reviewer:** Claude Code (deep review against `SPEC.md`, `SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md`, `UI_UX_FEEDBACK_REMEDIATION.md`)
**Branch reviewed:** `feat/round2-ui-feedback`
**Notion bridge page (referenced by user):** [34e9e9b1def78151a70cecfad3c069fd](https://notion.so/34e9e9b1def78151a70cecfad3c069fd) — *not accessible without auth from this environment; if you paste its content into a file or chat, this report can be folded back against it.*

---

## 0. Executive summary

Simplify IS has the **shell of a world-class GRC product** but most surfaces are still scaffolding. The marketing pages have been twice-edited (Round 1, Round 2) and are close to ready, but key fluff and inconsistencies remain. The post-login surfaces are a different story — every dashboard, the assessment flow, the roadmap, and the progress page are running on `lib/mock-data.ts` with placeholder strings (`"Filtered action list placeholder"`, `"Chart placeholder"`, `"Period comparison visual placeholder"`). The Cypher experience itself — the moat — is still a floating button + modal bolt-on rather than the conversational core of the product.

The single highest-leverage next move is **collapsing the assessment, framework view, risk view, and roadmap into one Cypher-led workspace** — not five static pages with a chat button. Everything else in this report supports that direction.

### What's working
- Top-nav, marketing-page rhythm, design tokens (Material 3 + editorial type pairing), `not-found.tsx`, sidebar collapse logic, audit-trail page, team-invite flow.
- Spec discipline: SPEC.md / Master Decisions / Round 2 brief are unusually rigorous; ship-ready copy already drafted in many places.
- Security posture: parameterised queries, RLS, server-side JWT validation, env isolation — all per `CLAUDE.md`.

### Top 10 issues to fix before "best-in-class" claim
1. **Footer is broken pre-login and inconsistent post-login** — links to `/legal/terms`, `/legal/privacy`, `/legal/cookies` (none exist; pages live at `/terms`, `/privacy`, no cookies page). Tagline is generic ("Simplifying governance. Securing the future."). `components/layout/Footer.tsx:20-36`.
2. **Risk View Stage 1 is a no-op** — both `Yes` and `No` advance to Stage 2 (`components/dashboard/RiskWorkspace.tsx:22-23`). Already flagged in R2.3.7; still shipped.
3. **Industry Dashboard has the leftover `INDUSTRY_METRICS_V2` micro-label in orange** (`components/dashboard/IndustryDashboard.tsx:113`). R2.3.3 said remove the V2; not done.
4. **Framework View is identical for all three frameworks** — single `FrameworkView.tsx:23-44` panel; no per-framework viz (NIST radar / ISO bars / APRA bars) per R2.3.6.
5. **Progress & Milestones is three placeholder strings** (`components/progress/ProgressTabs.tsx:18-22`).
6. **Maturity Roadmap is three counts + "Filtered action list placeholder"** (`components/maturity/MaturityRoadmap.tsx:27`).
7. **Assessment landing CTA logic is wrong** — every tile shows `Resume Assessment` / `Re-assess`; never starts in a true `Not Started` state (`components/assessment/AssessmentLanding.tsx:23`). R2.4.1 flagged it.
8. **Assessment question screen is hardcoded** — single fake question, no backend wiring; `Next` does nothing (`components/assessment/AssessmentQuestionFlow.tsx`). R2.4.2 flagged it.
9. **Two billing pages with hardcoded data, neither real** — `app/billing/page.tsx` (top-level) and `components/organisation/SettingsScreens.tsx:35-44` (under Org Settings). One should win, the other should redirect.
10. **Org Settings sub-pages are 63 lines total for Users / Preferences / Billing / Audit** combined (`components/organisation/SettingsScreens.tsx`). All four are stubs.

---

## 1. Global chrome — applies to every page

### 1.1 TopNav (`components/marketing/TopNav.tsx`)
**State:** Three-column grid centring the nav; logo / links / CTA. ✓ Centred. ✓ Mobile hamburger. ✓ Active state via `pathname`. ✓ Analytics events.

**Gaps:**
- No `Meet Cypher` or `Maturity Model` link in the top nav even though both pages exist (`(marketing)/meet-cypher`, `(marketing)/maturity-model`). Discoverability of the product's hero asset (Cypher) is gated behind a CTA on the home page.
- No `Login` link rendered on `sm` viewports (line 51: `hidden sm:inline-flex`) — fine for mobile, but the only mobile path to login is via `Get Started` → signup form (which has a "Sign In" link at the bottom). Add login to the mobile dropdown.

**Next-evolution:**
- Add a fourth top-nav link `Cypher` (or `Meet Cypher`) — the product is named after the agent, hide-and-seek doesn't help.
- Consider a thin `Status` pill ("All systems operational") sourced from a `/api/v1/status` endpoint — a real GRC product builds trust by showing it.

### 1.2 Footer pre-login (`components/layout/Footer.tsx`)
**State:** Single-row footer, 4 links, generic tagline.

**Issues — verbatim:**
- Line 20 → `href="/legal/terms"` (real path is `/terms`).
- Line 26 → `href="/legal/privacy"` (real path is `/privacy`).
- Line 32 → `href="/legal/cookies"` (no page exists). R2.0.3 said *remove* Cookie Settings entirely.
- Line 38 → `href="/contact"` (no page; should open the `ContactUsModal` per R1 §0.2 + R2.0.1).
- Line 14-16: tagline `"Simplifying governance. Securing the future."` — generic; doesn't mention Cypher, AI, or assessment.

**Missing entirely:**
- No "© 2026 Simplify.IS" line (R2.0.3 / R2.2.2 mandated this).
- No social proof anchor (security/AU privacy badges, ISO certification, SOC 2 in-progress).
- No status link, no docs link, no security.txt link, no "responsible disclosure" link — every B2B security buyer looks for these.

**Next-evolution footer (3 columns + bottom row):**
```
Product            Trust              Resources
- How it works     - Privacy          - Security & disclosure
- Frameworks       - Terms            - Status
- Maturity model   - Data residency   - Changelog
- Pricing          - DPA / SOC 2      - Contact
- Meet Cypher
                                              © 2026 Simplify.IS · ABN xx
```

### 1.3 Authenticated Header (`components/layout/Header.tsx`)
**State:** Page title via `titleFromPath()`, notification bell, profile dropdown.

**Issues:**
- No breadcrumbs — `Framework View > NIST CSF 2.0 > GV.OC-01` should be the breadcrumb on the framework view, not just the page title.
- No global search. A GRC tool with 93 ISO controls + 106 NIST subcategories needs `⌘K` search for control IDs and risks.
- No org switcher (multi-org is post-MVP, but the affordance should be there as a hidden hook).
- `titleFromPath` is a brittle string switch; will rot.

**Next-evolution:**
- `⌘K` global search across controls / risks / pages / users / domains.
- Breadcrumb on every post-login page, generated from a route registry.
- Persistent "Last assessment: 12 days ago · Next due: 23 May" pill in the header — keeps cadence visible.

### 1.4 Authenticated Sidebar (`components/layout/LeftSidebar.tsx`)
**State:** ✓ Sidebar + Org Settings (admin-only) + Sign Out + status indicator. Reads `useAuth().isAdmin`.

**Gaps:**
- No collapse-to-icons mode. Per `UI_UX_EXPORT.md §2.4` original design was 240px ↔ 60px collapsible. Now fixed at 72px (mobile slide-in only).
- The "Online · Status" pill at the bottom links to `/dashboard/industry` — that's the wrong target; it should link to a real status page or open a system-status popover.
- No "What's new" affordance — no place to surface feature releases, framework updates, or Cypher improvements.

### 1.5 User profile dropdown (`components/layout/UserProfileDropdown.tsx`)
**State:** ✓ Wired to `EditProfileModal`, `ChangePasswordModal`, `MFASettingsModal`, Org link, Sign Out. R2.2.4 satisfied.

**Gaps:**
- No "switch theme" item even though the `DarkLightToggle` component exists for marketing pages.
- No "API keys" or "Personal access tokens" — needed once the Power BI / BI integration shipped (SPEC §31 backlog).

### 1.6 Error pages (`app/403`, `app/404`, `app/503`, `app/not-found.tsx`)

**Two implementations exist:**
- `app/not-found.tsx` is the Next.js 14 catch-all and is **production-quality** (giant 404, contextual tiles, real footer, reduced-motion-friendly). Lines 1-157.
- `app/404/page.tsx`, `app/403/page.tsx`, `app/503/page.tsx` use `components/error/ErrorPage.tsx`, a 38-line generic fallback. They render a tiny card with `code` + `title` + `description` + one CTA. Visually inconsistent with the polished `not-found.tsx`.

**Fix:** Either delete `app/404/page.tsx` (Next.js auto-routes to `not-found.tsx`) or upgrade `ErrorPage` to match the polish of `not-found.tsx` and re-skin 403/503 the same way. R2.2.3 hinted at this.

### 1.7 Cypher chat shell (`components/cypher/FloatingCypherButton` + `CypherChatModal`)
**State:** Floating action button bottom-right of every authenticated page; opens a modal.

**Issue:** This is the product's moat shown as an afterthought. In best-in-class agent-native SaaS (Linear MCP, Vercel v0, Notion AI), the agent is **the workspace**, not a button. Every dashboard tile, every control, every risk, every score should be `right-click → ask Cypher`, with a side-rail Cypher panel that holds context across pages. See §8 for the vision.

---

## 2. Pre-login (marketing) — page-by-page

> **Branch context:** Round 2 brief (`UI_UX_FEEDBACK_REMEDIATION.md`) is *partially* shipped. Some fixes landed (per recent commits `9327a06`, `06ac365`, `51e74fc`); others are still open in code. This section reports the state as currently shipped on this branch.

### 2.1 Home (`app/(marketing)/page.tsx`)

**Current state (top → bottom):** Hero ("Meet Cypher") → product preview mockup → Why Cypher (3 tiles: Consistent Objectivity / Unified Knowledge / Maturity That Compounds) → Unwavering Intelligence + APRA chat preview → Compliance Intelligence (Global Standards + Regional Compliance, with `Browse Modules` CTAs) → footer CTA.

**What's good:**
- Hero copy is specific to Cypher. Not Stitch filler.
- Compliance Intelligence tiles point to `/frameworks` (correct, per R1 §1.3).
- The chat preview mockup grounds the "AI consultant" claim.

**What needs to change:**
- **Hero CTA on line 50 says "Meet Cypher" but routes to `/signup`.** Either swap copy to `Get Started` or route to `/meet-cypher`. Currently misleading.
- **No social proof anywhere.** No customer logos, no testimonial-with-attribution, no "X assessments completed", no "trusted by N AU orgs". A best-in-class GRC home page (Drata, Vanta, Secureframe, ZenGRC) has at minimum two of: customer logos, TrustPilot/G2 score, named-CISO testimonial, "founders' last 3 incidents prevented" stat.
- **No video / live demo.** The product is conversational. Show 30 seconds of Cypher running through an APRA CPS 234 question.
- **No comparison vs hiring a consultant.** Pricing page has it (`Legacy Approach` vs `Simplify IS`) — that comparison belongs on the home page too. Pricing follows differentiation.
- **No FAQ / objection-handling section.** "Is my data used to train AI?" "What if Cypher is wrong?" "How does this compare to GPT-4?" "ISO certified yourselves?" These all need answers above the fold.
- **No security badges for Simplify IS itself.** AU privacy compliance, SOC 2 (in-progress is fine), pen-test cadence.

**Next-evolution home page structure:**
```
1. Hero — "Meet Cypher" with 30s loop video of an assessment turn
2. Trust strip — 6-8 logos / "Trusted by ASX-listed Tech and APRA-regulated FIs"
3. The pain — "Hiring a consultant: $60-120k/yr · 6-week assessments · misses 40% of CSF 2.0"
4. The product — current "Why Cypher" 3 tiles, refined
5. Live demo — embedded chat playback (auto-loop)
6. Frameworks covered — current "Compliance Intelligence", refined to show ALL frameworks
7. Customer story — single quote with face + role + org
8. Pricing teaser — "Starts at $290/mo · No-strings 7-day trial · Cancel anytime"
9. FAQ — 6-8 questions
10. Final CTA + secondary "Book a 15-min demo"
```

### 2.2 Frameworks (`app/(marketing)/frameworks/page.tsx`)

**Current state:** Hero → engine status sample → Production Ready (ISO 27001, NIST CSF 2.0, APRA CPS 234) → On the Roadmap (6 coming-soon tiles) → Automation explainer → CTA.

**What's good:**
- All three "Ready" frameworks have score-style stats per R1 §2.1.
- Coming-soon tiles include the full R2 set (Essential Eight, SOC 2, APRA CPS 230, PCI DSS 4.0, HIPAA, NIST AI RMF).
- "Get Started" + "Contact Me" CTAs at bottom (per R1 §2.2).

**What needs to change:**
- **Unsourced metric** on the engine-status panel: `"Active monitoring across 14 cloud environments with 99.4% control coverage."` Either source it (footnote or explainer hover) or remove. A security buyer will see a fabricated number and bounce.
- **Coming-soon tiles need timeline indicators.** "Q3 2026", "End of 2026", or just "Targeting H2" — vague "Coming Soon" is meaningless.
- **No "request a framework" affordance.** If a buyer needs ISO 22301 or SOC 2 *now*, they should be able to flag interest in 2 clicks — drives roadmap signal *and* lead capture.
- **"Contact Me" copy is awkward.** R1 §2.2 said it; rename to `Talk to founder` or `Book 15 min` for personality (Vik's MSSP background is the moat — lean into it).

**Next-evolution:**
- Each Ready tile expands inline (or links to a sub-page) with: framework summary · how Cypher assesses it · sample question · downloadable rubric.
- A "Framework comparison" mini-table: ISO vs NIST vs APRA — what they cover, where they overlap. Saves 30 mins of research for every buyer.

### 2.3 How It Works (`app/(marketing)/how-it-works/page.tsx`)

**Current state:** Hero → 3 numbered steps (Initialise → Dialogue → Monitor, third is `Coming Soon`) → 4-card bento (Cypher Engine / Strategic Alignment / Immutable Evidence / start-trial CTA) → final CTA.

**What's good:**
- Step 2 mockup shows real-feel chat with progress indicator.
- "Strategic Alignment" + "Immutable Evidence" tiles tie back to evidence-trail / audit-readiness — the right value props.

**What needs to change:**
- **Step 3 is "Coming Soon"** — a marketing page should not present a not-yet-shipped step *as a step*. Move "continuous monitoring" off the numbered list into a separate "What's next" rail; otherwise the impression is the product is 2/3 of an MVP.
- **Quote on line 95 is unattributed** ("No checkboxes, just intelligence...feels more like a strategy meeting than an audit") — either attribute it or remove. Unattributed pull-quotes look like wishful thinking.
- **"Start Trial" button on line 255** — pricing page says 7-day trial is Essentials-only, but this page doesn't say that, so the CTA is ambiguous.
- **No estimated time** for each step. "Initialise: 10 minutes. Dialogue: 60-90 minutes per framework. Monitor: ongoing." Setting expectations here saves ten support tickets.
- **No example output.** Show what a finished assessment looks like (PDF preview, dashboard screenshot) — buyers want to see the deliverable.

### 2.4 Pricing (`app/(marketing)/pricing/page.tsx`)

**Current state:** Hero with founder pricing → Legacy vs Simplify comparison → 3 coming-soon feature cards → 3-tier grid (Essentials $290, Professional $590, Enterprise custom) → 7 add-on modules → 3 value props → final CTA.

**What's good:**
- Comparison is on-page (the right place for it).
- Tier differentiation is clear.
- Add-on modules surface roadmap intent without diluting current pricing.

**What needs to change:**
- **`Typical Retainer Ranges: $60k – $120k / Year`** is unsourced. Cite Robert Walters / Hays AU salary survey for "Senior GRC consultant day rate" or remove the specific dollar figure.
- **`Select Professional` button on line 213 is a `<button>` not a link.** Currently a no-op. Either wire it to `/signup?tier=professional` or to a Stripe checkout session.
- **Enterprise tier `Join Waiting List` button (line 244) contradicts "coming soon" labelling** elsewhere.
- **No annual discount.** A standard "Save 20% billed annually" toggle is missing — high-leverage commitment lever.
- **Essentials says `Single User`; home page says "every user in your organisation"** — pick one and align.
- **No risk-reversal copy.** "30-day money-back guarantee" or "Cancel anytime, no contract" should be a tile or a one-line repeated under each CTA.
- **No FAQ on pricing.** "Are add-ons billed separately or rolled in?" "What happens to data on cancellation?" "Can I change tiers mid-month?"

**Next-evolution:** Add an annual/monthly toggle, link Stripe checkout to the buttons, surface a one-line "How we landed on these prices" trust note (founder's voice).

### 2.5 Meet Cypher (`app/(marketing)/meet-cypher/page.tsx`)

**Current state:** All-caps hero → full chat-mockup conversation → 3 persona-traits (Framework-Native / Your Data Stays Yours / Evidence-Backed) → "Designed for Leaders" rail → CTA.

**What's good:**
- The chat mockup is the most product-honest thing on the marketing site.
- 3 trait headings are now on-spec per R1 §5.1 (good).

**What needs to change:**
- **Tagline `"Always On, Always Accurate"`** — "Accurate" is a claim that begs the question "to what?". Soften to "Always On, Framework-Grounded" or attach a footnote explaining the RAG architecture.
- **No comparison to ChatGPT / generic LLM.** Every prospect is going to ask "why not just use GPT-4?". Pre-empt it.
- **No mention of training data freshness.** "Cypher knows ISO 27001:2022 (the current version)" is a positive — say it.
- **No limitations.** The Master Decisions doc says Cypher is conversational consultant, not legal advice. State that on the page.

**Next-evolution:** Add an "Ask Cypher anything (read-only demo)" widget that lets unauthenticated visitors throw 3 questions at a sandbox version of Cypher. Highest-converting pattern in agent-native SaaS (Linear's command-K, v0's hero box).

### 2.6 Maturity Model (`app/(marketing)/maturity-model/page.tsx`)

**Current state:** Hero with sample assessment grid → CMMI 5-level breakdown → "How Cypher Calculates Maturity" 4-card panel → Coming Soon section → CTA.

**What's good:**
- CMMI grounding is the right reference — it's the closest thing to a maturity standard.

**What needs to change:**
- **`94.2% Compliance alignment for Level 4 entities`** is unsourced and confusing. What is "compliance alignment"? To what? Either explain it or remove.
- **"Real-Time Signals", "Evidence Chain", "Algorithmic Audit" presented as current capabilities** but the Coming Soon section later in the page lists "real-time signal capture" as not-yet-shipped. Mismatch.
- **No worked example.** Show one control's actual maturity score derivation: "Q1 → 'Yes, reviewed in last 12 months' (5pts). Q2 → 'Some evidence' (3pts). Domain weight 1.2. Score: 4.1." That kills the "is this just an opinion?" objection.
- **`"We don't just assess status; we engineer architectural resilience"`** — "engineer" overclaims. Soften.

### 2.7 Privacy (`app/(marketing)/privacy/page.tsx`)

**Current state:** Sidebar nav + sectioned content. Scrollspy active state should be live per R1 §6.1.

**What's good:**
- Tone is appropriately formal.
- Single-tenant vault explanation is product-accurate.

**What needs to change:**
- **No GDPR mention.** Even if the AU market is the focus, GDPR statement-of-position is now table stakes for B2B SaaS.
- **No DPA reference.** Buyers will ask for one — point to where they get it.
- **No explicit "we don't sell data" sentence.** Implied, but should be one declarative line.
- **Verify Privacy Act citation** is accurate (Privacy Act 1988 (Cth)) and current, including any 2025 amendments.

### 2.8 Terms (`app/(marketing)/terms/page.tsx`)

**Current state:** Sidebar nav + sectioned content. **Some sections are stubbed with `null` content** (Acceptance, Access Tier, Cypher AI, Data Retention sections per the audit). This is a legal liability — a contract page with empty sections.

**What needs to change (priority order):**
1. Get a lawyer to draft each section. Until that's done, ship a placeholder banner: "Terms v1 — final legal review in progress. Use of the platform is governed by [link to current SaaS standard]."
2. Add Acceptable Use clauses (no scanning competitor security posture, no using Cypher to draft regulatory advice for resale).
3. Disclaim Cypher's outputs ("informational only; you remain responsible for your security decisions").
4. Define "Cypher" formally — what it is, where it runs, what data it processes.

---

## 3. Auth pages

### 3.1 Login (`components/auth/LoginForm.tsx`)

**Current state:** Email + password + remember-me + forgot-password link + disabled SSO + signup link. Strong auth banner / error state. MFA-aware redirect handling.

**What's good:**
- Tracking events on attempt / success / error.
- Rate-limit handling for 423 status.
- Server-side error messages surfaced (not client-guessed).
- Dedicated MFA branch with `factor_id` + `access_token` URL handover.

**What needs to change:**
- **No "show password" toggle.** Standard table-stakes UX.
- **No captcha / bot mitigation visible.** Even invisible reCAPTCHA / Turnstile should be referenced in the auth banner ("Protected by Cloudflare Turnstile").
- **Verification bypass comment on line 47** (`// TEMP: verification bypass`) — flag this for removal before any prod-traffic launch.
- **`Resend verification email` link is gated on `resendEmail` state that's never set** (line 17 declares it, never used). Dead code.

### 3.2 Signup (`components/auth/SignupForm.tsx`)

**Current state:** Full Name, Email, Password (with strength meter), Confirm Password, Org Name, Job Title, Team Size, Industry. Triple section divider (Identity / Security / Organisation). Password strength bar with weak/medium/strong logic.

**What's good:**
- Inline strength meter (line 9-19) is genuine UX, not theatre.
- Section dividers reduce cognitive load on a 9-field form.
- Industry dropdown matches use case (security-relevant categories).

**What needs to change:**
- **Industry list mismatch:** Signup has 9 generic industries (line 285-294). Onboarding Step 2 has 16 (`Step2.tsx:9-26`) including "Insurance", "Energy & Utilities", "Telecommunications", etc. The two should share a single source of truth in `/lib/constants/industries.ts`.
- **No "Did you mean?" email suggestion.** A user typing `vik@gmial.com` should get a hint.
- **No ToS / Privacy checkbox.** B2B SaaS signup should require explicit accept of Terms + Privacy Policy with version-stamped consent. Line 322's "Already provisioned?" copy assumes consent has happened elsewhere; it hasn't.
- **No SSO/Google option.** SSO is a future state per the disabled login button — but enterprise buyers expect at least Google Workspace SSO at signup.
- **Verification bypass comment line 124** (`// TEMP: verification bypassed`) — production blocker.
- **Password requirements not visible *before* typing.** Users should see "At least 8 chars · upper / lower / number / symbol" up front, not learn it from the strength meter.

### 3.3 MFA, password reset, verification (`app/(auth)/login/mfa`, `forgot-password`, `reset-password`, `verify`)

I haven't read each file individually for this report, but the route presence is correct. **Action:** confirm each renders identical visual treatment as the login/signup forms (same section dividers, same gradient submit, same error banner). Inconsistency across auth pages = trust erosion.

**Master Decisions §15.4 / §15.5** specifies modal-based password change and MFA management *post-login*. That's wired in `UserProfileDropdown.tsx`. The pre-login `forgot-password` flow needs the same care.

---

## 4. Onboarding

### 4.1 Step 1 — Agent name (`components/onboarding/Step1.tsx`)

**Current state:** Single text input (max 10 chars), defaults to "Cypher" if blank. Sessionstorage-backed.

**Issue:** R2.1.1 explicitly required a hint: *"Leave this blank and your consultant will be called Cypher. You can rename them anytime in Organisation Settings."* — **not in the file**. Lines 33-36 only say `"This is how you can address me; every user in your organisation will see this name."` Add the hint.

**Other:** Eyebrow says `"Initialisation"` and CTA says `"Initialise Identity"` — Round 2 R2.0.2 brief explicitly called out Stitch-template language ("monolithic", "sentinel", "permanency"); "Initialise" / "Initialisation" sit close to that family. Consider plain English ("Set up Cypher" / "Continue").

### 4.2 Step 2 — Organisation profile (`components/onboarding/Step2.tsx`)

**Current state:** Org name + Industry dropdown + Country dropdown + Workforce tile picker. Validation gates Continue.

**Issues:**
- **No backfill from signup.** R2.1.2 required pre-filling `orgName` from the signup-captured `organisation_name`. Field is empty on mount (line 59).
- **No state-back persistence between steps.** Going Back from Step 3 → Step 2 will re-render with empty values (no `OnboardingStateProvider` reads). R2.1.3 explicitly required a shared provider — `components/onboarding/OnboardingStateProvider.tsx` exists but isn't used here.
- **Workforce tile descriptors are Stitch-style:** `"Lean agility protocols."`, `"Departmental isolation."`, `"Global multi-tenant."`, `"Complex audit rigor."` — replace with plain English ("Up to 50 employees · single team", "51–500 · functional teams", etc.).
- **Hero copy line 81-83:** `"Calibrate your security posture and resource allocation by defining your organisation's scope within the framework."` — overweight prose; reduce to "Tell Cypher about your organisation."

### 4.3 Step 3 — Frameworks (`components/onboarding/Step3.tsx`)

**Current state:** 6-tile grid. ISO + NIST preselected & locked. APRA toggleable. SOC 2 / PCI DSS / HIPAA shown as Coming Soon.

**Issues:**
- **No always-visible circle checkbox** (R2.1.4). Currently a `CheckCircle2` only renders when `isSelected` is true (line 132-138). Empty-state circle missing.
- **Description for SOC 2 says `"Attestation for service organisations focusing on security and availability."`** — fine, but ensure consistency with the marketing pages' coming-soon descriptions.
- **`Banknote` icon for SOC 2 (line 58)** — strange choice; SOC 2 isn't financial. Use `FileCheck` or `BadgeCheck`.

### 4.4 Step 4 — Portal orientation (`components/onboarding/Step4.tsx`)

**Current state:** 6-tile grid: Dashboard, Assessment, Maturity Roadmap, Progress & Milestones, **Team**, **Admin Settings**.

**Issue:** R2.1.5 explicitly said the orientation grid must mirror the actual sidebar:
- Real sidebar: Dashboards, Assessment, Maturity Roadmap, Progress & Milestones, Organisation Settings (admin-only).
- Step 4 has `Team` (no such standalone tab) and `Admin Settings` (lives under the dropdown, not the sidebar).

The fifth/sixth tiles need to merge into a single `Organisation Settings` tile, admin-only, hidden from non-admin invitees.

**Other issues:**
- **`Lock` icon + `"Secure Session Established · Auth: 256-bit"`** (line 106-108) is theatre — neither informative to a CISO nor accurate (256-bit refers to what? AES? TLS? key length?). Remove.
- Tile copy uses `"Cypher"` literally; R2.1.5 required substituting the dynamic agent name. Currently hard-coded to "Cypher" on line 34.

### 4.5 Initialisation screen (`components/onboarding/InitialisationScreen.tsx`)

**Current state:** Hexagonal badge → "Your environment is initialised." → 3 tiles (Explore Mission Control, Begin Assessment, Map Industry Risks).

**Issues:**
- **`"Mission Control"`** (line 28) — Stitch-vintage copy. Use "Industry Dashboard" (matches the actual page name).
- **`"Map Industry Risks"`** routes to `/dashboard/risk` — fine, but the Risk View Stage 1 is *broken* (see §5.3). Don't drive new users there.
- **Tile sequence labels `01 / 02 / 03`** — designer's flourish that doesn't aid the user; consider removing.
- **`HexagonalBadge`** is decorative SVG; fine but doesn't reinforce a brand concept (the brand is Cypher, not a hexagon).

---

## 5. Post-login core: Dashboards

### 5.1 Industry Dashboard (`components/dashboard/IndustryDashboard.tsx`)

**Current state:** Consent banner → MaturityRadar (lhs) + Organisation Metrics + Industry Update rail (rhs) → High Priority Drift card + Strategic Maturity Gap card.

**What's good:**
- Real radar component (`MaturityRadar`) with peer overlay.
- Consent banner for benchmarking (data sovereignty cue, on-brand).
- Severity-coloured drift cards.

**Issues:**
- **`INDUSTRY_METRICS_V2`** label still in the file (line 113) — R2.3.3 said remove the V2 and rename to "Industry Metrics".
- **Zero-state behaviour not clearly handled.** R2.3.1 required that with no completed assessment, every metric shows `—` and the user-polygon is hidden. Component reads from `data.radar` and renders both polygons unconditionally.
- **Mock data** drives this entirely. `lib/mock-data.ts` lines 19-101 has 15+ fabricated values: maturityScore 2.8, peer 34th percentile, 4 fake industry-update headlines (`"Sovereign cloud expansion announced for East Coast infrastructure."` is invented), 2 hard-coded drifts, 3 strategic gaps. Until the backend ships, **first-time users see fabricated data on their first dashboard view** — credibility hit.
- **Personal metrics on the Industry page.** R2.3.3 explicitly said move personal info (Strategic Maturity Gap, High Priority Drift) off Industry View onto Framework / Risk views. Both still rendered here (lines 25-28).

**Next-evolution Industry Dashboard:**
- Single peer-comparison narrative: "Your maturity vs Technology / 51-500 FTE peers".
- Radar + 4 peer-comparison tiles (Maturity Score / Benchmark Gap / Strongest Domain / Weakest Domain) + Industry Update rail.
- *Move* drift + gap cards to Framework View.

### 5.2 Framework View (`components/dashboard/FrameworkView.tsx`)

**Current state:** 49 lines total. Tabs (ISO / NIST / APRA) + flat control list + selected-control card with hardcoded `"Coverage: 45%"` (line 42).

**Issues:**
- **All three tabs render identically.** R2.3.6 required per-framework viz: NIST radar / ISO stacked bars / APRA stacked bars.
- **No control tree.** R2.3.6 spec called for tree + detail split.
- **No download report action** (R2.3.6).
- **Hardcoded `Coverage: 45%`** on line 42 — placeholder.
- **"Discuss this control with Cypher 🤖 from the floating chat launcher"** (line 43) — pushing the user out to a separate chat is the wrong UX. The control panel itself should have an inline Cypher prompt.

This file is **a stub** — the equivalent of saying "Framework view will go here later". Real GRC products live or die on the framework view; it's the page where buyers spend 80% of their time.

**Next-evolution:** Hierarchical control tree (Domain → Control → Sub-control) + inline Cypher chat per control + evidence rail + maturity slider.

### 5.3 Risk View (`components/dashboard/RiskWorkspace.tsx`)

**Current state:** Stage 1 (single risk Q&A) → Stage 2 (selected risks list).

**Critical bug:**
```tsx
<Button onClick={() => setStage(2)}>Yes, this applies to me</Button>
<Button variant="ghost" onClick={() => setStage(2)}>No, not applicable</Button>
```
Both buttons advance to Stage 2. R2.3.7 explicitly flagged this; not fixed. `No` should record `applies: false` and advance *within* Stage 1 to the next risk in the library.

**Other issues:**
- **Stage 2 is a flat list.** Spec required three priority groups: Actively Tracking / Concerned but Managing / Aware but Low Priority.
- **No scoring / mitigation action.** Master Decisions §10.3 specified controls-mapping per risk + mitigation conversation with Cypher. Currently `"Select a risk to see related controls and discuss mitigation with Cypher 🤖."` (line 43) — placeholder.

### 5.4 Initialisation page (`app/dashboard/initialisation/page.tsx`)

Just renders `InitialisationScreen`; covered in §4.5.

---

## 6. Post-login core: Assessment

### 6.1 Assessment landing (`components/assessment/AssessmentLanding.tsx`)

**Current state:** Title + 1-line subtitle + grid of framework cards with status, metric, CTA.

**Issues:**
- **No tile uplift.** R2.4.4 specified: framework icon, status pill, maturity bar, paragraph description, animated entry. Current implementation is plain text + button (lines 17-28).
- **CTA logic doesn't default to Not Started.** Line 23: `item.status === "Not Started" ? "Start Assessment" : item.status === "Completed" ? "Re-assess" : "Resume Assessment"`. The data shape doesn't actually distinguish; whatever `data` returns drives copy.
- **Greyed `Review with {agent} 🤖`** missing the explanatory tooltip from R2.4.1.

### 6.2 Assessment question flow (`components/assessment/AssessmentQuestionFlow.tsx`)

**Current state:** 44 lines. Hardcoded question, hardcoded options, `Next` button does nothing.

**Issues:**
- **Single hardcoded question** (line 23): `"Does your organisation have a documented policy governing access controls?"`.
- **`Next` button has no `onClick`** — R2.4.2 explicitly said find and fix this.
- **No progress indicator** beyond `Question 3 of 7`.
- **No domain-context panel.** Assessment should show: which domain, why this question matters, what control(s) it maps to.

This is the **most critical surface in the product** and it's a 44-line stub. Every other page is downstream of assessment data; without a real assessment flow, every dashboard is a placeholder.

### 6.3 Assessment session (`app/assessment/[sessionId]/page.tsx`)

I haven't read this; given the question-flow stub, expect parity (i.e., not yet wired).

**Next-evolution assessment flow** (the headline rebuild):
- Cypher leads. Question shown is generated by Cypher in real time, not a static list.
- Right rail: domain progress + chat history + flagged questions + estimated time remaining.
- Inline "discuss with Cypher" expands a chat below the question, doesn't open a separate modal.
- Each answer is signal-extracted by Cypher and shown as `Signal captured` confirmation.
- Soft-clarification on contradictions ("You said X about access reviews earlier; this answer suggests Y. Did I misunderstand?").
- Persistent draft state — close the tab mid-question, return tomorrow, resume exactly where you were.

---

## 7. Post-login core: Progress & Roadmap

### 7.1 Progress & Milestones (`components/progress/ProgressTabs.tsx`)

**Current state:** 3 tabs (Timeline / Comparison / Milestones). Each renders one of:
- Timeline: `Chart placeholder: {data.points...}` (line 18).
- Comparison: `Period comparison visual placeholder.` (line 21).
- Milestones: `Milestones feed placeholder (wins, challenges, key events).` (line 22).

This is shipped placeholder text. Fix or remove the tabs until the real ones land.

**Next-evolution Progress page:**
- Timeline = D3 line chart with multiple framework trajectories + key event markers + hover tooltips.
- Comparison = bar/spider comparison between two snapshots (last week vs today, last quarter vs today).
- Milestones = chronological feed of completed assessments, framework certifications, score thresholds crossed, and Cypher-flagged "moments worth noting".

### 7.2 Maturity Roadmap (`components/maturity/MaturityRoadmap.tsx`)

**Current state:** 3 expandable tiles (Maintain / Uplift / Industry Shifts) with counts. Expansion shows: `"Filtered action list placeholder. Inline row expansion and actions are ready for API wiring."` (line 27).

**Issue:** Same shape as Progress — three tabs, placeholder text. Master Decisions §11 had a deeper spec.

**Next-evolution roadmap:**
- Maintain = "what's working — keep doing X, due for re-attestation by Y date".
- Uplift = prioritised action list with effort estimate + maturity-impact estimate per action ("This 2-day fix raises your CSF.GV.OC-01 from 1.2 → 3.0").
- Industry Shifts = Cypher-curated changes in the framework or peer landscape that affect this org specifically.

---

## 8. Admin & Organisation pages

### 8.1 Admin Team (`app/admin/team/page.tsx`)

**State:** ✓ Real implementation. Reads from `/api/users`, supports invite/edit/deactivate, role + status badges, last-login + expiry columns. Empty state. RBAC redirect for non-admins.

**Issues:**
- **Visual inconsistency.** Uses `bg-bg-deep`, `accent-primary`, `text-text-primary` (legacy tokens). Rest of post-login app uses `bg-surface`, `primary`, `on-surface` (Material 3 tokens). Side-by-side, this page looks like a different app.
- **No bulk actions.** Selecting multiple members for role change / deactivation is missing.
- **No SSO column** even though SSO is on the roadmap.
- **`Activity` icon links to `/admin/team/[userId]?tab=activity`** — confirm the per-user page renders activity at all (haven't read).

### 8.2 Admin Invite (`app/admin/team/invite/page.tsx`)

**State:** ✓ Solid — email + name + role (radio with descriptions) + optional expiry.

**Issues:**
- **No domain restriction.** If a user invites `random@gmail.com` to an `acme.com` org, that should at least warn ("Invitee email domain doesn't match your organisation's").
- **No expiry default of 90 days for assessor accounts.** Best-practice security UX.
- **No invite-link preview.** Show what the invitee will receive: subject line, body, expiry.
- **Visual inconsistency** — same legacy tokens as 8.1.

### 8.3 Admin Audit Trail (`app/admin/audit-trail/page.tsx`)

**State:** ✓ Real, well-built. Filterable by framework + date range. Action labels mapped to human strings. Pagination cap at 500 entries.

**Issues:**
- **No CSV / PDF export.** Auditors will ask for it. Master Decisions §15.7 implied export is needed.
- **No actor filter** — can filter by framework + date but not by user. With 50+ assessors, that's a big gap.
- **No search** — fuzzy text across `metadata`.
- **Visual inconsistency** (same legacy tokens).
- **`Detail` column truncates with `max-w-[200px] truncate`** but no expand affordance — click should open a metadata viewer.

### 8.4 Admin Assignments (`app/admin/assignments/page.tsx`)

**State:** ✓ Real CRUD on domain assignments — member × framework × domain × due-date.

**Issues:**
- **Same visual inconsistency** (legacy tokens).
- **No bulk-assign** ("Assign all NIST GV controls to Sarah").
- **No re-assignment workflow** (current flow: delete + re-create. Should support reassign + history retention).
- **No notification copy preview** — what does the assignee see in their inbox?

### 8.5 Assessor Assignments (`app/assessor/assignments/page.tsx`)

**State:** ✓ Real, lightweight. Pending / In Progress / Completed grouping with summary tiles.

**Issues:**
- **No "ask my admin" affordance** — if an assignment is unclear, the assessor can't message the admin from this page.
- **No "I cannot complete this — please reassign" action** — an assessor should be able to surface friction without going outside the app.
- **Same visual inconsistency.**

### 8.6 Organisation Settings — all four sub-pages (`components/organisation/SettingsScreens.tsx`)

This is **63 lines for Users + Preferences + Billing + Audit combined.** They are scaffolds:
- `UsersScreen` — table of mock users; no add/remove, no role edit.
- `PreferencesScreen` — single "Organisation Name" input, hard-coded session-timeout text, `Save` button has no handler.
- `BillingScreen` — single line: `"Current plan: Simplify IS Core · Renewal: 30/04/2026"`. No invoices, no card management, no plan switch, no usage display.
- `AuditScreen` — list of 5 mocked entries. No filters, no export.

**Critical:** the *real* Audit Trail at `/admin/audit-trail` exists with filters, real API, etc. — but `/organisation/audit` (linked from the sidebar) goes here to a *mock* version. Two audit pages with different fidelity = trust hit.

**Recommended consolidation:**
- Delete the SettingsScreens stubs.
- Have `/organisation/audit` redirect to `/admin/audit-trail`.
- Have `/organisation/users` redirect to `/admin/team`.
- Build real `/organisation/billing` and `/organisation/preferences` from scratch (or merge into Stripe-customer-portal embed for billing).

### 8.7 Top-level Billing (`app/billing/page.tsx`)

**State:** 43 lines. Hardcoded `status = "active"`, "Manage Subscription" button → Stripe Checkout (good), "Cancel subscription" button (no handler), "Invoice list appears once Stripe events are connected in production" (placeholder).

**Issue:** Two billing pages (this + `/organisation/billing` via SettingsScreens) — pick one. Best path: keep `/organisation/billing`, redirect `/billing` to it.

**Next-evolution billing:**
- Embed Stripe Customer Portal (`/api/v1/billing/portal` → `customer.portal.url`).
- Show: current plan, next-renewal date, last invoice, payment method (last 4), seat usage if seat-billed, "manage in Stripe" button.

---

## 9. Cross-cutting: data & truth

### 9.1 Mock data is shipped to production-shaped users

`lib/mock-data.ts` exports `MOCK_INDUSTRY_DASHBOARD`, `MOCK_FRAMEWORKS`, `MOCK_RISKS`, `MOCK_NOTIFICATIONS`, `MOCK_USERS`. The flag `USING_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"` defaults to `true`. The first-time user sees fabricated values: `maturityScore: 2.8`, `peerPercentile: 34`, made-up news headlines ("Sovereign cloud expansion announced..."), Vik's name as the org owner, three named team members ("Sarah Chen", "Ben Johnson"). These are not zero-state placeholders — they're plausible but invented.

**Priority fix:** zero-state for every consumer of this mock data should treat mocks as fallback that renders empty / `—` instead of plausible numbers. Then flip `USE_MOCKS=false` on prod and remove the flag.

### 9.2 Cypher is treated as a feature, not the product

Across every authenticated page, Cypher is a floating button. The product positioning ("Meet Cypher: The AI Security Consultant") is at odds with the IA. Fix: add a persistent Cypher rail that follows the user across dashboards / framework / risk / assessment, holds context, and is the way the user *operates* the tool.

### 9.3 Visual two-system split

Two design-token systems coexist:
- **Material 3 + editorial type pairing** — used in marketing, onboarding, dashboards, sidebar (`bg-surface`, `surface-container-high`, `primary`, `on-surface`, `secondary`, fonts Raleway / Montserrat / Geist / Josefin).
- **Legacy slate / accent** — used in admin, organisation settings stubs, top-level billing (`bg-bg-deep`, `bg-bg-surface`, `accent-primary`, `text-text-primary`, font-heading).

Pick the M3 pairing. Migrate admin/team, admin/audit-trail, admin/assignments, assessor/assignments, billing into it. Inconsistent chrome reads as "two products glued together".

### 9.4 Australian English compliance

R2 brief mandates Australian English globally. Spot-check:
- ✓ "Organisation" used throughout.
- ✗ Login form: `"Continue your security assessment."` (fine but check `verify`, `forgot-password`, `reset-password`).
- ✗ Industry Dashboard: `"Real-time governance comparison across the six NIST CSF 2.0 domains."` ✓ but `"Real-Time Signals"` capitalisation in maturity-model — verify consistency.

Run a global string sweep before launch.

---

## 10. Best-in-class benchmark

The reference set:
| Capability | Drata | Vanta | Secureframe | Simplify IS today |
|---|---|---|---|---|
| Conversational assessment | ✗ | ✗ | ✗ | **Differentiator (Cypher)** — but UX not yet realised |
| Framework coverage | 14+ | 25+ | 25+ | 3 ready, 6 roadmap |
| Auto-evidence collection | ✓ | ✓ | ✓ | Roadmap |
| Continuous monitoring | ✓ | ✓ | ✓ | Roadmap |
| Vendor risk module | ✓ | ✓ | ✓ | ✗ |
| Custom framework support | ✓ | ✓ | ✓ | ✗ |
| Marketplace integrations | 100+ | 200+ | 100+ | 0 |
| AU-localised (APRA) | ✗ | ✗ | ✗ | **Differentiator** |
| Pricing transparency | Hidden | Hidden | Hidden | **Differentiator** |

**Strategic posture:** Don't try to out-feature Drata. Win on (a) the Cypher conversation, (b) APRA / AU-first, (c) transparent pricing. Make those three things undeniably the best in the world.

---

## 11. Proposed next-evolution roadmap (by priority)

**P0 — must-fix before any user touches prod:**
1. Footer routes (`/legal/*` → real paths) + tagline + "© 2026 Simplify.IS".
2. Risk View Stage 1 No-button bug (`RiskWorkspace.tsx:22-23`).
3. Remove `INDUSTRY_METRICS_V2` label.
4. Industry Dashboard zero-state real (no fabricated radar / metrics / drift / gap).
5. Wire Assessment `Next` button + question flow.
6. Footer + Sidebar visual parity for Admin / Org pages (consolidate to one token system).
7. Terms page sections that are `null` content — get drafted or hidden.

**P1 — round out the surfaces in the roadmap:**
1. Framework View per-framework viz + control tree + detail rail.
2. Progress page real Timeline / Comparison / Milestones.
3. Maturity Roadmap real action lists (Maintain / Uplift / Shifts).
4. Organisation Settings: collapse stubs into real pages (or redirect to Admin equivalents).
5. Billing: single source of truth, Stripe Customer Portal embed.
6. Onboarding Step 1 hint, Step 2 backfill, Step 3 always-visible checkbox, Step 4 mirror sidebar.
7. ContactUsModal email field + auth-context pre-fill.

**P2 — make it best-in-class:**
1. Cypher as persistent rail across all pages (not a modal).
2. Cypher-led question generation (no static question library).
3. Signal extraction live in chat ("Signal captured" UI).
4. Contradiction detection live in chat.
5. Global ⌘K search across controls / risks / pages / users.
6. Status page + breadcrumbs + "what's new" feed.
7. Read-only "Ask Cypher" widget on the Meet Cypher marketing page.
8. Drag-and-drop CSV import for legacy assessments to bootstrap day-one value.

**P3 — moat-building:**
1. Vendor risk module (third-party assessments).
2. Custom-framework support (orgs can author their own controls).
3. Power BI / Looker integration endpoint (already in MVP scope per SPEC §31).
4. Mobile assessment mode (10-min daily check-ins for an admin).
5. SSO (Google + Microsoft + SAML for enterprise).
6. Public Cypher API (security teams want to script assessments).

---

## 12. Appendix — files referenced

- `app/(marketing)/page.tsx` (home)
- `app/(marketing)/frameworks/page.tsx`
- `app/(marketing)/how-it-works/page.tsx`
- `app/(marketing)/pricing/page.tsx`
- `app/(marketing)/meet-cypher/page.tsx`
- `app/(marketing)/maturity-model/page.tsx`
- `app/(marketing)/privacy/page.tsx`
- `app/(marketing)/terms/page.tsx`
- `app/(auth)/login/page.tsx` + `components/auth/LoginForm.tsx`
- `app/(auth)/signup/page.tsx` + `components/auth/SignupForm.tsx`
- `app/onboarding/step-{1..4}/page.tsx` + `components/onboarding/Step{1..4}.tsx`
- `components/onboarding/InitialisationScreen.tsx`
- `components/dashboard/IndustryDashboard.tsx`
- `components/dashboard/FrameworkView.tsx`
- `components/dashboard/RiskWorkspace.tsx`
- `components/assessment/AssessmentLanding.tsx`
- `components/assessment/AssessmentQuestionFlow.tsx`
- `components/progress/ProgressTabs.tsx`
- `components/maturity/MaturityRoadmap.tsx`
- `app/admin/team/page.tsx`
- `app/admin/team/invite/page.tsx`
- `app/admin/audit-trail/page.tsx`
- `app/admin/assignments/page.tsx`
- `app/assessor/assignments/page.tsx`
- `app/organisation/{users,billing,preferences,audit}/page.tsx` + `components/organisation/SettingsScreens.tsx`
- `app/billing/page.tsx`
- `app/{403,404,503}/page.tsx` + `components/error/ErrorPage.tsx`
- `app/not-found.tsx`
- `components/marketing/TopNav.tsx`
- `components/layout/{Footer,Header,DashboardLayout,LeftSidebar,UserProfileDropdown}.tsx`
- `lib/mock-data.ts`
- `docs/SPEC.md`
- `docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md`
- `docs/UI_UX_FEEDBACK_REMEDIATION.md` (Round 1 + Round 2 brief)

— end of report —
