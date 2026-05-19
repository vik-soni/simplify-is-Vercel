# 8-Week Beta Build — Claude Code Action List

_Generated: 2026-04-29 by Claude Code._

Source: Notion "8-Week Beta Build Tracker (28 Apr to 27 Jun 2026)" — page id `34f9e9b1def78173830ad188dd2055fa`, database id `34f9e9b1-def7-81be-b4be-e216ce227944`.

## This session — what just shipped

Claude completed and **set to Done in Notion** the following 14 parallel-safe tasks during the 29 Apr 2026 session:

- ✅ **[Week 1 / Infra]** Add .env.local to .gitignore + add detect-secrets pre-commit hook
- ✅ **[Week 2 / Engineering]** Build POST /api/v1/onboarding/consultant-name
- ✅ **[Week 2 / Engineering]** Build POST /api/v1/onboarding/frameworks
- ✅ **[Week 2 / Engineering]** Wire onboarding UI Steps 1–4 to real /onboarding/* endpoints
- ✅ **[Week 2 / Engineering]** Add organizations columns: onboarding_step, onboarding_completed_at, industry, countries (jsonb), workforce_scale, selected_frameworks (jsonb)
- ✅ **[Week 2 / Engineering]** Build POST /api/v1/onboarding/complete
- ✅ **[Week 2 / Engineering]** Build GET /api/v1/onboarding/state
- ✅ **[Week 2 / Engineering]** Build POST /api/v1/onboarding/organisation
- ✅ **[Week 3 / Infra]** Verify Stripe webhook signature validation
- ✅ **[Week 3 / Infra]** Add /api/health endpoint (Supabase + Anthropic + Stripe reachability)
- ✅ **[Week 7 / Content]** Australian English sweep (global string check)
- ✅ **[Week 7 / Design]** Polish error pages (403/404/503) — match not-found.tsx quality
- ✅ **[Week 7 / Infra]** Add prompt canary in Cypher's system prompt
- ✅ **[Week 7 / Infra]** Pin @anthropic-ai/sdk + @supabase/supabase-js to exact versions

### Files added or changed

| Area | Path |
|------|------|
| Secrets hygiene | `.pre-commit-config.yaml`, `.secrets.baseline` |
| Pinned versions | `package.json` (anthropic-sdk, supabase-js, supabase/ssr) |
| Health endpoint | `app/api/health/route.ts` |
| Prompt canary | `orchestration/abstraction/claudeOrchestrator.ts` |
| Stripe sig check | `app/api/v1/billing/webhook/route.ts` (returns 400 on bad sig) |
| Error pages | `components/error/ErrorPage.tsx`, `app/403/`, `app/404/`, `app/503/` |
| Onboarding migration | `supabase/migrations/20260429000001_onboarding_columns.sql` |
| Onboarding API helper | `lib/api/onboarding.ts` |
| Onboarding endpoints | `app/api/v1/onboarding/{state,organisation,consultant-name,frameworks,complete}/route.ts` |
| Onboarding UI wiring | `components/onboarding/Step{1,2,3,4}.tsx` |

### Manual activation steps (Vik must run once)

1. **Run the migration** in Supabase: `npx supabase db push --project-ref [ref]` (will create the new `organizations` columns and constraint).
2. **Activate the secrets pre-commit hook** locally: `pre-commit install` (after `pip install pre-commit detect-secrets` if not already on PATH). The baseline `.secrets.baseline` is checked in.
3. **Smoke-test the onboarding flow** end-to-end with a fresh signup once the migration is applied: Step 1 (consultant name) → Step 2 (org details) → Step 3 (frameworks) → Step 4 (Launch).
4. **Probe `/api/health`** in staging to confirm Supabase + Anthropic green and Stripe `skipped` if not configured.

---

## Summary

- Total tracker tasks: **108**
- Vik-owned open: **30**
- Claude Code already Done before session: **9**
- Claude Code completed this session: **14**
- Claude Code still open & parallel-safe: **40**
- Claude Code still open & blocked on Vik: **15**

---

## A. CLAUDE — STILL TO DO (parallel-safe, no Vik blocker)

### Week 3

| Track | Task |
|-------|------|
| Engineering | Seed top_risks → organisation_risks for new org (7 risks) |
| Engineering | Implement orchestration/scoring/scoreControl.ts (real CMMI) |
| Engineering | Implement domain-level scoring (only when ALL controls in domain complete) |
| Engineering | Implement framework-level scoring (weighted average of domains) |

### Week 4

| Track | Task |
|-------|------|
| Engineering | Implement NIST radar visualisation (Framework View) |
| Engineering | Implement ISO stacked-bar visualisation (Framework View) |
| Engineering | Wire useFrameworkView to live API |
| Engineering | Drop NEXT_PUBLIC_USE_MOCKS flag |
| Engineering | Implement Risk View Stage 2 priority groups + per-risk control mapping |
| Engineering | Implement Maturity Roadmap real action lists (Maintain / Uplift / Industry Shifts) |
| Engineering | Wire useRiskWorkspace to live API |
| Engineering | Implement Progress & Milestones (Timeline / Comparison / Milestones) |
| Engineering | Wire useMaturityRoadmap to live API |
| Engineering | Wire useIndustryDashboard to live API (drop mockResult) |
| Engineering | Wire useProgressMilestones to live API |
| Infra | Add Sentry + structured logging (every API route + Claude call) |

### Week 5

| Track | Task |
|-------|------|
| Engineering | Build CypherContextMenu component (right-click handler + popup) |
| Engineering | Implement streaming responses (SSE from /api/internal/* → CypherRail) |
| Engineering | Wire right-click on Framework View controls |
| Engineering | Mobile fallback: keep FloatingCypherButton on mobile breakpoints |
| Engineering | Inline 'Signal captured' UI confirmation in chat |
| Engineering | Convert FloatingCypherButton + CypherChatModal → CypherRail (desktop) |
| Engineering | Wire right-click on Risk View risks |
| Engineering | Add inline 'Discuss with Cypher' expandable below each assessment question |
| Engineering | Wire right-click on Industry Dashboard maturity scores |
| Engineering | Onboarding tightening (Step 1 hint, Step 2 signup backfill, Step 3 always-visible checkbox, Step 4 sidebar mirror) |
| Engineering | Implement cross-page state for CypherRail (Zustand or React Context) |
| Design | Migration: consolidate /admin/* and /organisation/* design tokens to M3 |

### Week 6

| Track | Task |
|-------|------|
| Engineering | Build PDF export — internal checklist mode (Puppeteer or react-pdf) |
| QA | Playwright E2E: signup → onboarding → assessment 5 questions → domain complete → score → dashboard → Cypher interaction → PDF |
| QA | Lighthouse pass on every authenticated page |
| Engineering | MFA full enrolment flow (QR + recovery codes) |
| Engineering | Bundle analysis + lazy-load heavy components |
| QA | Run third autonomous test batch (refined principles) |
| Engineering | Wire PDF export to /api/v1/assessments/sessions/[id]/export |
| QA | Integration tests: session create → response submit → score update → dashboard refresh |

### Week 7

| Track | Task |
|-------|------|
| QA | Performance re-test (300 concurrent simulated users) |
| QA | Cross-tenant RLS isolation re-test (manual) |
| Infra | Run security audit script + fix anything new |
| Design | Audit-trail page polish |

---

## B. CLAUDE — BLOCKED ON VIK

| Week | Track | Task | Blocker |
|------|-------|------|---------|
| Week 2 | Content | Generate first-pass questions for ISO domains 11–17 | Needs Vik briefs (Weeks 1-2) |
| Week 2 | Content | Generate first-pass questions for ISO domains 18–21 | Needs Vik briefs (Weeks 1-2) |
| Week 2 | Content | Generate first-pass questions for ISO domains 4–10 | Needs Vik briefs (Weeks 1-2) |
| Week 2 | Decision | Audit-readiness design doc — Claude Code drafts from Vik's answers | Needs Vik 8 framing answers |
| Week 3 | Content | Seed assessment_questions table with all 126 ISO questions | Needs Vik briefs/review |
| Week 3 | Content | Generate first-pass questions for first 10 NIST groupings | Needs Vik NIST briefs |
| Week 3 | Engineering | Refine 9 Cypher orchestration prompts using Vik's voice examples | Needs Vik voice rules |
| Week 4 | Content | Generate + review remaining NIST questions | Needs Vik NIST briefs |
| Week 4 | Content | Seed assessment_questions table with all NIST questions | Needs Vik NIST briefs |
| Week 4 | QA | Build autonomous test agent harness (separate Anthropic API agent probing Cypher) | Needs Vik 8 principles |
| Week 4 | QA | Run first batch (50 simulated assessments) through autonomous tester | Needs harness + Vik principles |
| Week 5 | QA | Run second batch (50 simulated assessments — adversarial focus) | Needs first batch |
| Week 8 | Infra | Deploy to staging (full env var sweep) | Needs Vik staging domain |
| Week 8 | QA | Final autonomous test batch on staging (sanity check) | Needs prior batches |
| Week 8 | QA | Smoke test on staging (signup → assessment → score → PDF → Cypher) | Needs Vik staging domain |

---

## C. VIK — TO DO (unblocks Section B)

### Week 1

- [ ] [Infra] Rotate SUPABASE_SERVICE_KEY in Supabase + Vercel
- [ ] [Decision] Audit-readiness — answer the 8 framing questions
- [ ] [Infra] Rotate ORCHESTRATION_SECRET in Vercel
- [ ] [Content] Pick 3 starter domains (Access Control, Incident Mgmt, Vendor Risk) and write briefs
- [ ] [Infra] Rotate ANTHROPIC_API_KEY in Anthropic + Vercel

### Week 2

- [ ] [Content] Vik reviews + iterates ISO domains 11–17 questions
- [ ] [Content] Vik reviews + iterates ISO domains 4–10 questions
- [ ] [Content] Write briefs for ISO domains 11–17 (7 domains)
- [ ] [Decision] Vik reviews audit-readiness doc, refines voice + judgement
- [ ] [Content] Write briefs for ISO domains 18–21 (4 domains)
- [ ] [Content] Write briefs for ISO domains 4–10 (7 domains)

### Week 3

- [ ] [Content] Final ISO question polish across all 21 domains
- [ ] [Content] Write briefs for first 10 NIST CSF 2.0 functions/categories
- [ ] [Content] Vik writes Cypher voice + signal extraction rules (5–6 worked examples)

### Week 4

- [ ] [QA] Define 8 constitutional principles for Cypher evaluation
- [ ] [Content] Finish remaining NIST domain briefs
- [ ] [QA] Vik reviews autonomous test report + flags improvements

### Week 5

- [ ] [QA] Vik QAs Cypher voice + interaction quality (test conversations)

### Week 6

- [ ] [QA] Light-mode QA pass on dashboards
- [ ] [QA] Vik reviews third batch + locks Cypher voice
- [ ] [QA] Vik runs the E2E manually (the 'be a customer' pass)

### Week 7

- [ ] [QA] Vik QA — full test as a brand-new user (fresh email, no shortcuts)
- [ ] [Decision] Final Vik review of audit-readiness doc

### Week 8

- [ ] [Content] Write tester welcome packet (what to test, what to ignore, how to give feedback)
- [ ] [QA] Vik smoke-tests staging as a fresh user
- [ ] [Infra] Set up feedback channel (email alias or Notion form)
- [ ] [Decision] Hand over staging link + welcome packet to testers
- [ ] [Decision] Document the 'if it breaks while I'm away' runbook
- [ ] [Infra] Configure private staging domain
- [ ] [Decision] Create two beta tester accounts

---

## D. NOTION sync status

All 14 tasks in "This session" were marked **Done** in Notion via the API at the time of generation. If you re-run the tracker query you should see Status = Done on all 14.

**2026-05-08 sync** (`scripts/notion_sync_8week_may2026.py`): Renamed Risk View–worded rows to **Threat Readiness**, marked **Done** on the Stage 1 bug (superseded by IA), onboarding tightening, and the two Threat Readiness API/detail tasks that replaced `useRiskWorkspace` / Risk View Stage 2. Added two retro rows for Agent 15 + Agent 11 May 2026. Tracker: **110** rows, **31** Done (see `docs/2026-05-07/03_NOTION_AND_8_WEEK_EXECUTION_PLAN.md` §2). `docs/Feedback - 08May.md` UX/QA items are not 1:1 with Notion engineering tasks; remaining open rows include live `usePostLogin` wiring, scoring engine, and autonomous harness.
