# Site & Assessment Audit Reference

**Date:** 19 May 2026  
**Scope:** Post-login assessment flow (consolidated questions, answer persistence, Cypher context) and site-wide internal link / navigation audit.  
**Project:** simplify-is  

This document consolidates two investigation outputs from the same session for future reference.

---

## Table of contents

1. [Assessment flow — what was broken and what was fixed](#1-assessment-flow--what-was-broken-and-what-was-fixed)
2. [Cypher during assessment — gaps and fixes](#2-cypher-during-assessment--gaps-and-fixes)
3. [Agent 19 implementation summary (prior work)](#3-agent-19-implementation-summary-prior-work)
4. [Site-wide link & navigation audit](#4-site-wide-link--navigation-audit)
5. [Recommended fix order](#5-recommended-fix-order)
6. [Manual verification checklist](#6-manual-verification-checklist)
7. [Key files reference](#7-key-files-reference)

---

## 1. Assessment flow — what was broken and what was fixed

### Symptoms reported

- Starting any framework assessment (NIST, ISO, etc.) showed a few questions.
- Choosing an answer and clicking Next did not register; an error appeared.
- Flow did not reliably use **consolidated questions** or persist answers correctly.

### Root causes

There were **two disconnected assessment paths** in the codebase:

| Path | UI entry | Questions source | Save API |
|------|----------|------------------|----------|
| **Legacy** | `/assessment/{frameworkSlug}` → `AssessmentQuestionFlow` | Old `assessment_questions` table (~18 NIST seed rows) | `POST /api/v1/assessment/answer` with **upsert** |
| **Consolidated (correct)** | `/assessment/session/{sessionId}` → `AssessmentSession` | `consolidated_questions` (all controls per framework) | `POST /api/v1/assessments/sessions/{id}/answer` |

Post-login, the hub often sent users to the **legacy** path. That failed because:

1. **Upsert broke** — Agent 18 removed the unique constraint on `(user_id, question_key)`, but the legacy answer API still used `ON CONFLICT`, which Postgres rejects without a matching unique index → *"Failed to persist answer"*.
2. **Foreign key blocked consolidated keys** — `assessment_answers.question_key` referenced `assessment_questions`. Consolidated keys look like `NIST_CSF_2.0:GV.OC-01`, which are **not** in the legacy catalogue → insert failed at the database.
3. **Hub links did not start a real session** — Links went to `/assessment?framework=...` (landing only) or `/assessment/{slug}` using the legacy flow without session bootstrap.

### What was implemented to fix it

| Change | Location / detail |
|--------|-------------------|
| **Migration** | `supabase/migrations/20260520000001_assessment_answers_question_key_fk.sql` — drops `question_key` FK to legacy `assessment_questions` |
| **Session bootstrap API** | `POST /api/v1/assessments/organizations/{orgId}/framework-sessions` — creates `assessment_sessions` row, returns UUID |
| **UI routing** | `FrameworkAssessmentStarter` → redirects to `/assessment/session/{uuid}?framework={canonicalId}` |
| **Hub links** | `AssessmentHub` → `/assessment/{frameworkSlug}` |
| **Assessment page** | `/assessment?framework=...` uses `FrameworkAssessmentStarter` |
| **Legacy APIs updated** | `GET/POST /api/v1/assessment/questions` and `answer` use consolidated questions + insert (not upsert) |
| **Error visibility** | `AssessmentSession` shows real API error message when save fails |

### Correct user path (after fixes)

1. Log in → **Assessment** → pick a framework (e.g. NIST CSF 2.0).
2. Land on subdomain / question UI (`AssessmentSession`), not the old single-card “Question X of 6” NIST-only flow.
3. Select an answer → advances without error; refresh shows persisted answer.

### Apply migration (required)

```bash
cd simplify-is
# Full push (if migration chain is healthy):
npx supabase db push

# Or apply only the FK fix:
psql $DATABASE_URL -f supabase/migrations/20260520000001_assessment_answers_question_key_fk.sql
```

Also ensure earlier Agent 19 migration is applied if using signals/confidence:

`supabase/migrations/20260519000001_agent19_assessment_flow.sql`

### Dev server

```bash
cd simplify-is && npm run dev
```

Typically **http://localhost:3001** if port 3000 is used by another project.

### Demo accounts (reference)

See `docs/Demo account.md`:

- **wdata@demo.com** / `123` — seeded data, always-replay onboarding  
- **wodata@demo.com** / `123` — blank org, all 9 frameworks, for manual testing  

---

## 2. Cypher during assessment — gaps and fixes

### What was wrong

- **Legacy flow** — “Unsure — discuss with Cypher” only flagged the question; it did **not** open Cypher.
- **Session flow** — Cypher received subdomain + all questions, but **not the control the user is on**.
- **Stale chat** — Reopening Cypher reused old messages; greeting was not refreshed for the current context.
- **ISO / short subdomain keys** — Validation required `XX.XX` (2+ chars per segment); keys like `A.8` failed for ISO 27001.

### What was fixed

| Fix | Detail |
|-----|--------|
| **Current control in context** | `currentControlId` passed from UI → `/api/v1/assessments/sessions/.../cypher/start` and `.../message` → internal handler → system prompt includes current control, prompt, options, existing answer |
| **Fresh Cypher panel** | On each open: clear messages, recap, greeting; fetch new greeting for current question |
| **Relaxed subdomain regex** | Allows `A.8`, `GV.OC`, etc. |

### What still needs product work (not done in session)

- **True question-sync UI** — Highlighting Cypher-suggested answers on the exact card in real time (partial via `questionsToPopulate`; not full bidirectional sync).
- **Cross-subdomain memory** — Cypher scopes to active subdomain only (by design).
- **Legacy `AssessmentQuestionFlow`** — No Cypher sidebar; use consolidated session flow for Cypher.

### Cypher API chain

```
AssessmentSession (UI)
  → POST /api/v1/assessments/sessions/{id}/cypher/start|message
  → lib/api/assessmentCypherClient.ts
  → POST /api/internal/assessment-cypher
  → orchestration/handlers/assessmentCypherHandler.ts
  → orchestration/prompts/assessmentCypher.ts
```

---

## 3. Agent 19 implementation summary (prior work)

Agent spec: `agents/AGENT_19_ASSESSMENT_FLOW_ORCHESTRATION.md`

### Backend delivered

- Migration: `operational_signals`, `signal_notifications`, `notification_preferences`, `assessment_answers` extensions
- Libraries: `maturityTranslation.ts`, `confidenceCalculation.ts`, `conflictDetection.ts`, `signalIngestion.ts`, `orgConfidenceReport.ts`
- Enhanced cross-framework propagation + conflict detection in `saveAnswer`
- APIs: signals ingest, confidence, pending-signals, confirm-propagation, cascade, diverge, notification preferences

### UI delivered (partial vs full spec)

- `AssessmentHub`, `ConflictResolutionModal`, `PrefillAnswerCard`
- `AssessmentLanding` uses hub; `AssessmentSession` shows conflict modal

### Not built in that pass

- `AssessmentStickyHeader` with live confidence
- `ScoringExplainerModal`, full “Improve Confidence” flow wired to live APIs
- Notification bell in global nav
- Email digest sender job
- Hub still uses mock `useAssessmentStatus` for tile metrics

### Tests

- `tests/orchestration/agent19AssessmentFlow.test.ts`
- Updated `tests/orchestration/answerScoring.test.ts` for new propagation signature

---

## 4. Site-wide link & navigation audit

**Method:** Static trace of `app/` routes (52 pages, 83 API handlers), all internal `href` / `router` usage, middleware matcher, and framework slug maps.

### Executive summary

| Severity | Count | Theme |
|----------|-------|--------|
| **P0 — 404 / dead end** | 2 | Missing pages users are sent to |
| **P1 — Wrong or partial flow** | 8 | Assessment, threats, assignments, session URLs |
| **P2 — Dual / legacy paths** | 4 | Two assessment stacks, mock dashboards |
| **P3 — Auth gap** | 3 | Routes outside middleware |
| **P4 — UX / misleading** | 5 | Dead buttons, ignored query params |

---

### P0 — Confirmed broken links (404)

#### `/contact` — no page

- **Source:** `app/onboarding/layout.tsx` footer → `/contact`
- **Reality:** Only `app/api/v1/contact/route.ts` (POST API). No `app/contact/page.tsx`
- **Fix:** Add contact page, or link to `mailto:hello@simplify.is` (see `components/layout/Footer.tsx`)

#### `/onboarding/tech-stack` — no page

- **Source:** `components/onboarding/Step5.tsx` — “Start Discovery” → `router.push("/onboarding/tech-stack")`
- **Reality:** No route. Use `/organisation/tech-stack/discovery` or `/dashboard/tech-stack-discovery`
- **Fix:** Change Step 5 navigation to discovery route or open `TechStackDiscoveryModal` (as on initialisation screen)

---

### P1 — Functional issues (link exists, behavior wrong)

#### Assessment

| Issue | Detail |
|--------|--------|
| Hub “Improve Confidence” / “Review with Cypher” | `AssessmentHub.tsx` — buttons have **no href or handler** |
| UUID at `/assessment/{uuid}` | `AssessmentSession` with **`frameworkName` hardcoded `NIST_CSF_2.0`** if not using `/assessment/session/{uuid}?framework=...` |
| **`control` query ignored** | Threat links: `/assessment?framework=…&control=…` — starter does not open that control |
| **`domain` query ignored** | Assessor: `/assessment?framework=…&domain=…` — never read |
| Legacy `AssessmentQuestionFlow` | Orphaned; not mounted from routes |
| DB FK | Without migration `20260520000001_...`, session saves still fail |

**Working path after session fixes:**

`Assessment` → `/assessment/{frameworkSlug}` → `FrameworkAssessmentStarter` → POST `framework-sessions` → `/assessment/session/{uuid}?framework=…` → `AssessmentSession`

#### Threat readiness → assessment

- **Sources:** `ThreatDetailContent.tsx`, `ControlDetailContent.tsx`
- `framework` param: usually OK (labels like `"ISO 27001:2022"` normalize via `normalizeAssessmentFrameworkId`)
- `control` param: **not used**

#### Assessor assignments

- **Source:** `app/assessor/assignments/page.tsx`
- `framework`: partial (`iso27001`, `nist_csf` only in assignments API)
- `domain`: **ignored**

#### Admin redirects

- `router.replace("/dashboard")` → OK via `app/dashboard/page.tsx` redirect to `/dashboard/industry`

---

### P2 — Dual stacks and mock-backed UI

#### Two assessment API families

| Legacy (singular) | Consolidated (plural) |
|-------------------|------------------------|
| `GET /api/v1/assessment/questions` | `GET .../sessions/{id}/questions` |
| `POST /api/v1/assessment/answer` | `POST .../sessions/{id}/answer` |
| Orphan `AssessmentQuestionFlow` | `AssessmentSession` |

#### Deprecated API

- `POST /api/v1/assessments/sessions/{sessionId}/responses` → **410 Gone**

#### Mock-backed pages (links work; data may be fake)

| Route | Hook / issue |
|-------|----------------|
| `/assessment` hub | `useAssessmentStatus` mock |
| `/dashboard/framework` | `useFrameworkView` mock |
| `/maturity-roadmap` | mock |
| `/progress` | mock |

---

### P3 — Auth / middleware gaps

**Protected by middleware matcher:**

`/dashboard/*`, `/assessment/*`, `/onboarding/*`, `/maturity-roadmap/*`, `/progress/*`, `/organisation/*`, `/api/v1/*`, `/api/internal/*`

**Not protected at edge (HTML may load before client redirect):**

| Prefix | Client guard |
|--------|----------------|
| `/admin/*` | Redirect if `!isAdmin` |
| `/assessor/*` | Redirect if `!user` |
| `/billing` | None |

**Legacy APIs outside `/api/v1/` matcher:**

`/api/users`, `/api/assignments`, `/api/audit-trail`, `/api/responses`, `/api/final-answers`

---

### P4 — Misleading UX

| Item | Detail |
|------|--------|
| 404 “Contact us” card | `app/not-found.tsx` — links to `/`, not contact |
| Assessment hub secondary CTAs | No navigation |
| Email templates | Some use `/dashboard` (redirects OK) |

---

### Framework slug consistency (9 frameworks)

Canonical IDs: `lib/frameworks/assessmentFrameworks.ts`

| Slug (onboarding / hub) | Canonical ID |
|-------------------------|--------------|
| `nist_csf_2_0` | `NIST_CSF_2.0` |
| `iso_27001_2022` | `ISO_27001_2022` |
| `pci_dss_4_0` | `PCI_DSS` |
| `apra_cps_230` | `APRA_CPS_230` |
| `apra_cps_234` | `APRA_CPS_234` |
| `asd_essential_eight` | `ASD_E8` |
| `iso_42001` | `ISO42001` |
| `auva_iss` | `AU_VAISS` |
| `nist_ai_rmf` | `NIST_AI_RMF` |

---

### Post-login sidebar (spot check)

| Link | Route | Status |
|------|-------|--------|
| Industry View | `/dashboard/industry` | OK |
| Framework View | `/dashboard/framework` | OK (mock data) |
| Tech Stack | `/dashboard/tech-stack-discovery` | OK |
| Threat Readiness | `/dashboard/threats` | OK |
| Assessment | `/assessment` | OK |
| Maturity Roadmap | `/maturity-roadmap` | OK (mock) |
| Progress | `/progress` | OK (mock) |
| Organisation settings | `/organisation/*` | OK (admin, middleware) |

### Marketing / auth (spot check)

`/`, `/how-it-works`, `/frameworks`, `/pricing`, `/meet-cypher`, `/maturity-model`, `/privacy`, `/terms`, `/login`, `/signup` — **OK**

---

## 5. Recommended fix order

1. Apply migration `20260520000001_assessment_answers_question_key_fk.sql` (and `20260519000001_agent19_assessment_flow.sql` if needed).
2. **P0:** Fix `/onboarding/tech-stack` → discovery route; fix or remove `/contact`.
3. **P1 assessment:** Wire hub Cypher / Improve Confidence; redirect `/assessment/{uuid}` → `/assessment/session/{uuid}` with framework from session; honor `control` (and optionally `domain`) query params.
4. **P2:** Wire `useAssessmentStatus` and framework view to real org APIs.
5. **P3:** Add `/admin`, `/assessor`, `/billing` to middleware matcher.

---

## 6. Manual verification checklist

- [ ] Log in → Assessment → each of 9 frameworks → answer saves, no red error
- [ ] Onboarding step 5 → Start Discovery → tech stack discovery (not 404)
- [ ] Footer Contact on onboarding → valid destination
- [ ] Threat readiness → framework reference link → correct framework assessment
- [ ] `/assessment/session/{uuid}?framework=ISO_27001_2022` → ISO context, not NIST
- [ ] Invoke Cypher on a question → greeting references current control
- [ ] Logged out → `/admin/team` → login redirect (after P3 middleware fix)

---

## 7. Key files reference

### Assessment flow

| File | Role |
|------|------|
| `components/assessment/FrameworkAssessmentStarter.tsx` | Creates session, redirects to consolidated flow |
| `components/assessment/AssessmentSession.tsx` | Main assessment UI + save + Cypher |
| `components/assessment/AssessmentHub.tsx` | Framework tiles from landing |
| `components/assessment/AssessmentLanding.tsx` | Assessment index |
| `components/assessment/AssessmentQuestionFlow.tsx` | Legacy flow (orphaned) |
| `lib/orchestration/assessment/assessmentSessionHandler.ts` | saveAnswer, sessions, propagation |
| `lib/orchestration/assessment/consolidatedQuestions.ts` | Load consolidated questions |
| `app/api/v1/assessments/organizations/[orgId]/framework-sessions/route.ts` | Session bootstrap |
| `app/api/v1/assessments/sessions/[sessionId]/answer/route.ts` | Save answer |
| `app/assessment/[sessionId]/page.tsx` | Slug or UUID route |
| `app/assessment/session/[sessionId]/page.tsx` | Canonical session route |

### Cypher

| File | Role |
|------|------|
| `orchestration/handlers/assessmentCypherHandler.ts` | Context + save cypher answers |
| `orchestration/prompts/assessmentCypher.ts` | System prompt |
| `app/api/internal/assessment-cypher/route.ts` | Internal Claude endpoint |

### Migrations

| File | Role |
|------|------|
| `supabase/migrations/20260520000001_assessment_answers_question_key_fk.sql` | Drop FK for consolidated keys |
| `supabase/migrations/20260519000001_agent19_assessment_flow.sql` | Signals, confidence columns |

### Related docs

| Doc | Topic |
|-----|--------|
| `docs/Demo account.md` | Demo credentials |
| `agents/AGENT_19_ASSESSMENT_FLOW_ORCHESTRATION.md` | Full Agent 19 spec |
| `docs/SIMPLIFY_IS_SESSION_SUMMARY_COMPLETE.md` | Broader session history |

---

*Generated for internal reference. Update this file when P0/P1 audit items are resolved.*
