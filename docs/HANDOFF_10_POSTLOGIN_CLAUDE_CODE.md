# HANDOFF 10 — Post-Login UI/UX Claude Code Polish Pass

_Last refresh: 2026-04-22 — full-site stitch_output fidelity pass (pre- and post-login)._

## Build Status
- `npm run lint`: PASS (0 warnings, 0 errors)
- `npm run build`: PASS (all routes compile, no TS errors)
- `npm test -- --runInBand`: PASS (6 suites, 19 tests)

## Scope Of This Pass
Site-wide visual fidelity pass against every reference in `/stitch_output/`, dark mode and light mode, pre-login and post-login. The goal: the running app must look like the stitch PNGs — theme, colour, typography, elevation, spacing — across marketing, auth, onboarding, and the dashboard hero.

## Root-Cause Fixes

### 1. Base surface token alignment
Stitch has **two** base surfaces:
- Post-login / auth / onboarding → `#141311`
- Marketing / Earthy Sentinel landing → `#1A1917`

The repo previously used `#1A1917` globally, flattening post-login surfaces too warm. Fixed:
- `--surface: #141311` and `--surface-dim: #141311` now the default in `:root`.
- `body.marketing` overrides `--surface` to `#1A1917` for pre-login shells (`MarketingShell` and `AuthShell` both attach the class on mount).
- `--bg-deep-warm: #1A1917` kept as a dedicated token for any component that needs the warmer charcoal.

### 2. Light-mode palette rebuilt from stitch `*_light_mode` refs
Light tokens now match stitch exactly:
- `--surface: #FDFCF0` (cream, not the old beige `#F5F0E8`)
- `--surface-container-low: #F9F6F0`
- `--surface-container: #F4F1E8`
- `--surface-container-high: #ECE9E1`
- `--surface-container-highest: #E6E2D6`
- `--surface-bright: #FFFBF7`
- `--surface-container-lowest: #FFFFFF`
- `--surface-dim: #E6E2D6`
- `--on-surface: #211F1D`
- `--on-surface-variant: #594139`
- `--outline: #85736E`
- `--outline-variant: #D8C2BB`
- `--color-secondary: #4A463F`

Light-mode glass surfaces (`glass-nav`, `glass-surface-dark`) now use `rgba(253, 252, 240, 0.92)` — a warm cream translucence — rather than the old washed-beige value. Light-mode ghost borders tightened to `rgba(133, 115, 110, 0.25)` to match stitch.

### 3. Stitch colour tokens added
- `--color-primary-container: #f2632d`
- `--on-primary: #5c1900`
- `--on-primary-fixed: #390c00`
- `--on-primary-fixed-variant: #822700`
- `--on-primary-container: #511500`

All exposed as Tailwind utilities (`bg-primary-container`, `text-on-primary-fixed`, etc.) so components can use the stitch class names verbatim.

### 4. Canonical font aliases
`tailwind.config.ts` now exposes the Earthen Brutalism aliases the stitch HTML uses directly:
- `font-headline` → Raleway
- `font-body` → Montserrat
- `font-label` → Josefin Sans
- `font-mono` → Geist Mono (mapped to JetBrains Mono via next/font variable)

Existing aliases (`font-raleway`, `font-montserrat`, `font-josefin`, `font-geist`) retained for in-repo callers.

### 5. Typography / elevation utilities
- Added `.editorial-shadow` (→ `0 20px 40px rgba(0,0,0,0.4)`), the exact onboarding card shadow from stitch. `OnboardingCard` now uses it.
- Added `.input-underline` for the animated bottom-border underline stitch uses across form fields.
- `cypher-pulse` kept; respected by global `prefers-reduced-motion` block.

## Component-Level Changes

### Onboarding
- `OnboardingCard` — bg moved from `surface-container-low` to `surface-container-high` (stitch elevation tier), now uses the new `editorial-shadow` utility instead of an inline `shadow-[...]`.
- All five onboarding surfaces (Steps 1–4 + Initialisation Complete) verified in place: eyebrow + divider, italic primary accent on key headline words, bottom-border-only inputs, four workforce dials, 2×3 framework grid with `COMING SOON` pill, hexagonal SVG emblem + three-tile hand-off row.

### Post-Login Layout
- `components/layout/Footer.tsx` — top border promoted from inner wrapper to the `<footer>` itself so the warm `#141311` canvas under the footer reads as a single uninterrupted surface, per stitch hero.
- `DashboardLayout`, `Header`, `LeftSidebar`, `NotificationPopover`, `UserProfileDropdown` — already on-spec from the previous pass; re-verified against stitch hero HTML.

### Industry Dashboard (visual north star)
- No structural changes required; the prior pass already delivers radar + metrics split, consent banner, bento (High Priority Drift / Strategic Maturity Gap), ember glow, legend, Ask Cypher FAB.
- With `--surface` fixed to `#141311`, the entire canvas now matches the PNG tonality.

### Marketing + Auth
- `MarketingShell` and `AuthShell` both attach `body.marketing`, so the base surface correctly flips to `#1A1917`, matching the stitch landing reference.
- `how-it-works` page: `Initialize` → `Initialise` (final AU-English holdout).
- All marketing CTAs keep their hard-coded `text-[#1A1917]` for dark text on the burnt-orange primary button — matches stitch visually and keeps contrast intent clear.

## Stitch-Output Coverage

| Screen / Surface | Stitch Ref | Repo Route / Component | Dark | Light |
| --- | --- | --- | :-: | :-: |
| Landing hero | `Page 1 - Landing Page - web dark` + `landing_page_light_mode_*` | `app/(marketing)/page.tsx` | ✓ | ✓ |
| How It Works | `Page 2` + `how_it_works_*` | `app/(marketing)/how-it-works/page.tsx` | ✓ | ✓ |
| Frameworks | `Page 3` + `frameworks_*` | `app/(marketing)/frameworks/page.tsx` | ✓ | ✓ |
| Pricing | `Page 4` + `pricing_*` | `app/(marketing)/pricing/page.tsx` | ✓ | ✓ |
| Maturity Model | `Page 5` + `maturity_model_*` | `app/(marketing)/maturity-model/page.tsx` | ✓ | ✓ |
| Meet Cypher | `Page 6` + `cypher_intro_*` | `app/(marketing)/meet-cypher/page.tsx` | ✓ | ✓ |
| Terms of Service | `Page 7` + `terms_of_service_*` | `app/(marketing)/terms/page.tsx` | ✓ | ✓ |
| Privacy Policy | `Page 8` + `privacy_policy_*` | `app/(marketing)/privacy/page.tsx` | ✓ | ✓ |
| Login | `Page 9` + `login_*` | `app/(auth)/login/page.tsx` | ✓ | ✓ |
| Login MFA | `Page 10` + `mfa_verification_*` | `app/(auth)/login/mfa/page.tsx` | ✓ | ✓ |
| Signup | `Page 11` + `unified_*_signup_*` | `app/(auth)/signup/page.tsx` | ✓ | ✓ |
| Signup Email Verify | `Page 12` + `verification_*` | `app/(auth)/signup/verify/page.tsx` | ✓ | ✓ |
| 404 | `Page 13` | `app/not-found.tsx` | ✓ | ✓ |
| Onboarding Step 1 | `Onboarding screen 1` | `/onboarding/step-1` | ✓ | ✓ |
| Onboarding Step 2 | `Onboarding screen 2` | `/onboarding/step-2` | ✓ | ✓ |
| Onboarding Step 3 | `Onboarding screen 3` | `/onboarding/step-3` | ✓ | ✓ |
| Onboarding Step 4 | `Onboarding screen 4` | `/onboarding/step-4` | ✓ | ✓ |
| Initialisation Complete | `Onboarding screen 5 - completed` | `/dashboard/initialisation` | ✓ | ✓ |
| Dashboard Hero (Industry View) | `Dashboard - hero page` | `/dashboard/industry` | ✓ | ✓ |

Responsive variants (tablet + mobile, dark + light) covered via Tailwind breakpoints; mobile-specific stitch references (`*_mobile`, `*_tablet`) informed spacing/typography for those breakpoints.

## Deliberate Deviations From Stitch (Kept On Purpose)
- **Dashboard radar:** 6-axis NIST CSF 2.0 (GV / ID / PR / DE / RS / RC) instead of stitch's 5-axis NIST 1.x (per `CLAUDE.md` rule 12).
- **Sidebar taxonomy:** "Dashboards / Assessment / Maturity Roadmap / Progress & Milestones / Organisation Settings" (per `CURSOR` spec) rather than stitch's simpler "Dashboard / Assessment / History / Compliance / Settings".
- **Onboarding Step 4:** six orientation tiles to mirror the canonical sidebar, not stitch's five-tile layout.
- **Initialisation copy:** "Your environment is _initialised._" (AU English) vs stitch's "initialized".
- **Peer benchmark polygon:** full dashed outline polygon rather than stitch's single centre dot — per Checklist 6 in the spec.

## Known Gaps / Deferred For Follow-Up
- **D3 interactivity:** radar is SVG; hover tooltips, axis-level peer/delta, morph-from-centre animation still to come once real data lands (Agent 14).
- **Industry hero bottom row:** Security Briefing + sparkline + delta-since-last-assessment deferred; current `High Priority Drift` + `Strategic Maturity Gap` pair matches stitch but not the spec's "Your Strengths / Strategic Priority / Security Briefing / Your Progress" quartet.
- **Cypher chat streaming:** typing indicator, quick-reply pills and SSE streaming deferred until API contracts land.
- **MFA full enrolment:** QR screen + recovery-code download deferred.
- **Framework / Risk / Roadmap / Progress / Organisation Settings:** structural scaffolds only; content passes after Agent 14 wires APIs.
- **Lighthouse / bundle analysis:** not run this pass.
- **Legacy `/admin/*` routes:** still present alongside the new `/organisation/*` routes; to be rationalised in cleanup PR 4 or Agent 14.

## Notes For Agent 14 (API Wiring)
- All new UI reads via `lib/api/hooks/usePostLogin.ts` (mock hooks in `lib/mock-data.ts`). Swapping to real fetchers requires no component-side change — data shapes are stable.
- Onboarding steps persist nothing to Supabase yet; transient `sessionStorage` keys (`onboarding.agentName`) are placeholders for the eventual `POST /api/v1/onboarding/*` calls.

## Outstanding Decisions For Vik
- Confirm Cypher's welcome greeting wording on Industry Dashboard.
- Supply the 20 template risks for Risk View Stage 1.
- Supply 5–8 assessment questions per domain per framework (ISO / NIST / APRA).
- Confirm the 30-day cooldown copy for framework toggle in Preferences.
- Confirm notification type catalogue.
- Supply Security Briefing feed source contract from the research agent.
- Decide whether Initialisation screen should render inside `DashboardLayout` or as a chrome-less hand-off page (currently uses `DashboardLayout` per spec).

## Assets Referenced
- `stitch_output/` — all PNGs, HTML, DESIGN.md, both dark and light variants across web / tablet / mobile.
- `agents/10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`
- `agents/10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md`
- `HANDOFF_10_POSTLOGIN_CURSOR.md`

*— End of Agent 10 (Claude Code) polish-pass handoff —*
