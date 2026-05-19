# Round 2 Agent Loop — prompts per phase

Drive from the `claude` CLI. One phase per session, verify before moving on.

## Phase 1 — Pre-login chrome
> Read `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.0.3 + §R2.0.4. Make the edits to `components/layout/Footer.tsx`, `components/marketing/TopNav.tsx`, `components/marketing/MarketingShell.tsx`, and `app/(marketing)/page.tsx` (Compliance Intelligence section only). Then run `npm run build`. Stop and report. Do not touch any other page in this phase.

## Phase 2 — Frameworks Coming-Soon expansion
> Read `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.0.5. Add the six Coming-Soon tiles to `app/(marketing)/frameworks/page.tsx` with one-line bodies. Match the existing Ready-tile structure. Then run `npm run build`. Stop and report.

## Phase 3 — Pre-login copy audit
> Read every marketing page (`home`, `how-it-works`, `frameworks`, `meet-cypher`, `pricing`, `privacy`, `terms`). For each, list every line of copy that reads as Stitch-export filler, contains unsupported numbers, or references capabilities we don't ship. Do not edit yet — give me the list first. We'll approve per page, then edit.

## Phase 4 — Onboarding Steps 1–4
> Read `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.1.1 through §R2.1.5. Wire `components/onboarding/OnboardingStateProvider.tsx` into `app/onboarding/layout.tsx`. Then update `Step1.tsx` (default-name hint + store wiring), `Step2.tsx` (store wiring + prefill from `GET /api/v1/auth/session`), `Step3.tsx` (circle-checkbox pattern + store wiring), `Step4.tsx` (rebuild tile grid to mirror sidebar + `{agent-name}` substitution). Then run `npm run build` and walk /onboarding/step-1 → step-4 → back → step-1. Stop and report.

## Phase 5 — Authenticated chrome (footer, 404, dropdown, sidebar)
> Read `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.2 + §R2.6. Update authenticated `Footer`, `app/not-found.tsx`, `UserProfileDropdown`, and `Sidebar`. Reuse existing modals in `components/modals/`. Then run `npm run build`. Stop and report.

## Phase 6 — Industry Dashboard
> Read `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.3.1 through §R2.3.5. Update `app/dashboard/industry/page.tsx` and the radar component — zero-state, numeric vertex labels, rename/restructure Industry Metrics rail, heading hierarchy sweep, subtitle fix. Then run `npm run build` and load `/dashboard/industry` in the browser. Stop and report.

## Phase 7 — Framework View + Risk View
> Read `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.3.6 + §R2.3.7. Implement per-framework top-left visualisation on `app/dashboard/framework/page.tsx` (NIST radar / ISO bars / APRA bars). Fix the Risk View Stage 1 `No`-path bug in `app/dashboard/risk/page.tsx`. Add placeholder comments noting pending Claude AI transcripts. Then run `npm run build`. Stop and report.

## Phase 8 — Assessment
> Read `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.4.1 through §R2.4.4. Rebuild `app/assessment/page.tsx` landing tiles (zero-state, conditional CTAs, greyed review button with tooltip, visual uplift). Fix `app/assessment/[framework]/page.tsx` header strings and Next-button advance (stub `POST /api/v1/assessment/answer` if needed). Then run `npm run build` and walk a full assessment start → answer → next. Stop and report.

## Phase 9 — Progress & Milestones
> Read `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.5.1 and master §13. Build out the three tabs. Placeholder comment for pending transcripts. Then run `npm run build`. Stop and report.

## Phase 10 — Verification
> Run through `docs/UI_UX_FEEDBACK_REMEDIATION.md` §R2.7 checklist. For each unchecked item, verify or fix. Report any remaining open items.
