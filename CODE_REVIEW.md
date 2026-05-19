# Code Review — Simplify IS

**Date:** 2026-05-14
**Scope:** This session's changes to Agents 11, 15, 16, 17 + repo-wide security posture
**Status:** Production-ready with caveats. Critical security fixes applied below.

---

## 1 · Summary

| Dimension | Score | Notes |
|---|---|---|
| Code quality | **88 / 100** | TypeScript strict, zero `any`, consistent patterns, good Zod validation. Three-layer arch honoured throughout. |
| Security | **89 / 100** (post-fix) | Was 78/100. All HIGH/CRITICAL items fixed in this pass. |
| Test coverage | **24 / 24 passing** | Scoring (7), threat readiness (14), threat severity (3). No regressions. |
| Build | **Clean** | `tsc --noEmit` passes (pre-existing `scripts/resetOnboardingForEmail.ts` errors are unrelated and untouched). |

---

## 2 · Changes Made This Session

### 2.1 Agent 11/15/16 polish (earlier in session)

| File | Change |
|---|---|
| `components/onboarding/Step4.tsx:101` | Route on "Launch Application" now goes to `/onboarding/step-5` (was `/dashboard/initialisation`). |
| `components/onboarding/Step5.tsx` *(new)* | Tech Stack Discovery CTA — START DISCOVERY → `/onboarding/tech-stack`; SKIP → `/dashboard/initialisation`. |
| `app/onboarding/step-5/page.tsx` *(new)* | Route wrapper. |
| `app/onboarding/layout.tsx` | `TOTAL_STEPS = 5`, progress bar widened, step regex extended. |
| `types/threatReadiness.ts` | Added `unverifiedThreatKeys?: string[]` to `ThreatReadinessResponse`. |
| `orchestration/handlers/threatReadinessHandler.ts` | New `loadUnverifiedThreatKeys()`. Returned from `getThreatReadiness()`. |
| `components/threats/ThreatList.tsx` | "Pending Clarification" amber badge on unverified threats; click opens the modal. |
| `components/threats/ThreatReadinessView.tsx` | Passes unverified keys + opens `ThreatClarificationModal`. |
| `components/threat-readiness/ThreatClarificationModal.tsx` *(new)* | Assumption editor with Confirm / Save Edits / Skip-Pending; POSTs to existing clarifications route. |
| `components/threat-readiness/ThreatReadinessLoader.tsx` *(new)* | 5-step progress loader (15/25/30/20/10 weighting). |
| `components/assessment/MaturityProgressWidget.tsx` *(new)* | Domain progress + domain/org maturity tiles. |

### 2.2 Agent 17 — Assessment + Cypher Integration

**Schema** *(additive migration)*
- `supabase/migrations/20260514000001_agent17_cypher_assessment.sql` — extends `assessment_sessions` and `assessment_answers`; adds `subdomain_maturity_scores`, `domain_maturity_scores`, `organization_maturity_scores`, `cypher_assessment_transcripts` (user-only RLS).

**Core libraries**
- `lib/orchestration/assessment/subdomain.ts` — derives subdomain key (`GV.OC`) from NIST control IDs.
- `lib/orchestration/assessment/assessmentSessionHandler.ts` — session load, subdomain list, question fetch, `saveAnswer`, `buildSubdomainRecap`, `confirmSubdomain`.
- `lib/orchestration/scoring/maturityScoring.ts` — pure aggregator + persistence to maturity score tables.
- `lib/api/assessmentCypherClient.ts` — typed wrapper around the internal Cypher endpoint.

**Orchestration**
- `orchestration/prompts/assessmentCypher.ts` — system + greeting prompts with PII sanitisation.
- `orchestration/handlers/assessmentCypherHandler.ts` — `startCypherSubdomain`, `sendCypherMessage` (transcript logging + answer persistence).
- `orchestration/abstraction/claudeOrchestrator.ts` — added `runAssessmentCypherTurn`, `generateAssessmentCypherGreeting` with Zod-validated JSON output.

**Public API routes** (all JWT-protected, org-scoped, single-owner enforced)
- `GET  /api/v1/assessments/sessions/[sessionId]/subdomains`
- `GET  /api/v1/assessments/sessions/[sessionId]/questions?subdomainKey=…`
- `POST /api/v1/assessments/sessions/[sessionId]/answer`
- `POST /api/v1/assessments/sessions/[sessionId]/subdomain/[subdomainKey]/recap`
- `POST /api/v1/assessments/sessions/[sessionId]/subdomain/[subdomainKey]/confirm`
- `GET  /api/v1/assessments/sessions/[sessionId]/scores`
- `POST /api/v1/assessments/sessions/[sessionId]/cypher/start`
- `POST /api/v1/assessments/sessions/[sessionId]/cypher/message`

**Internal route** — `POST /api/internal/assessment-cypher` (ORCHESTRATION_SECRET-gated, timing-safe).

**Frontend components** *(under `components/assessment/`)*
- `AssessmentSession.tsx` — orchestrator.
- `StickyScoreHeader.tsx` — three live-animated score panels + auto-save indicator.
- `QuestionRenderer.tsx` — routes to 5 interactive types (single-select, slider, drag-drop, multi-select, segmented).
- `CypherAssessmentPanel.tsx` — slide-in right-edge chat with typing indicator + in-panel recap.
- `CypherInvokeButton.tsx`, `RightClickCypherMenu.tsx`, `ClickOutsideCypherPrompt.tsx`.
- `SubdomainRecap.tsx`, `AssessmentCompletionScreen.tsx`, `SubdomainListView.tsx`.
- `app/dashboard/assessment/page.tsx` — page route wrapping the orchestrator.

**Tests**
- `tests/orchestration/maturityScoring.test.ts` — 7 cases covering ladder mapping, subdomain key derivation, rollup correctness, partial completion, null-maturity handling.

---

## 3 · Code Quality Findings

### CRITICAL — none

### HIGH

| # | File | Issue | Status |
|---|---|---|---|
| H1 | `orchestration/handlers/assessmentCypherHandler.ts` | `console.warn` for operational errors lacked context fields | **Fixed** — now `console.error` with structured payload (`sessionId`, `controlId`, `reason`). |

### MEDIUM

| # | File:line | Issue | Status |
|---|---|---|---|
| M1 | `assessmentSessionHandler.ts:265-285` | After every form answer, two extra queries count subdomain progress (potential N+1 under load). | **Documented** — small impact for single-user form path; revisit when bulk-save is introduced. |
| M2 | `assessmentSessionHandler.ts:270, 278` | `LIKE '${sd.key}-%'` is safe today because `sd.key` is regex-validated, but lacks `ESCAPE` clause. | **Documented** — defensive only; regex barrier is tight. |
| M3 | `assessmentCypherHandler.ts` | If `cypher_assessment_transcripts` insert fails (e.g. RLS regression), the call still returns success. Audit gap. | **Mitigated** — now logged as `cypher_transcript_insert_failed`. Consider hard-fail in a future pass. |

### LOW

| # | File | Issue | Status |
|---|---|---|---|
| L1 | `claudeOrchestrator.ts` | File is 800+ lines; further additions should be split into per-feature modules. | **Noted.** |
| L2 | `lib/api/auth.ts` | `assertOrgAdmin` exists but is unused by Agent 17 routes. | **Noted** — keep for admin endpoints. |
| L3 | Multiple Agent 17 routes | Repeating `requireApiUser → loadSession → assertOrgOwnership → ownership check` boilerplate. | **Noted** — consider a `withSession()` higher-order helper to dedupe. Non-blocking. |

### Positive controls confirmed
- ✅ Three-layer arch — `/api/v1/*` never calls `anthropic` directly; only via `/api/internal/assessment-cypher`.
- ✅ Zero `any` types in new code.
- ✅ Every `/api/v1/*` route runs `requireApiUser` + `assertOrgOwnership` + `session.user_id === authUser.id`.
- ✅ RLS on every new table; `cypher_assessment_transcripts` is user-only per spec.
- ✅ NIST CSF 2.0 prefixes only (`GV`/`ID`/`PR`/`DE`/`RS`/`RC`); no ISO 27001:2013 references.
- ✅ Models: `claude-sonnet-4-20250514` (Sonnet) and `claude-haiku-4-5-20251001` (Haiku) used per CLAUDE.md.
- ✅ All envs through `lib/config/env.ts`. No secrets in `NEXT_PUBLIC_*`.

---

## 4 · Security Findings

### CRITICAL → all remediated

| # | File:line | Vector | Fix applied |
|---|---|---|---|
| S1 | `app/api/internal/assessment-cypher/route.ts:18` | Plain `===` on `ORCHESTRATION_SECRET` exposed to **timing side-channel** attack. | **Fixed** — replaced with `crypto.timingSafeEqual` via constant-length-buffer compare. Bearer header parsed safely. |

### HIGH → all remediated

| # | File | Vector | Fix applied |
|---|---|---|---|
| S2 | `app/api/internal/assessment-cypher/route.ts` `MessageBodySchema` | `conversationHistory` had no role-alternation check — attacker could inject fake assistant turns to bias Claude. | **Fixed** — `.refine()` enforces strict `user → assistant` alternation starting with `user`. |
| S3 | `orchestration/prompts/assessmentCypher.ts` | `userName`/`organizationName`/`agentName` interpolated raw into system prompt — prompt injection vector if upstream input ever weakened. | **Fixed** — new `sanitisePromptToken()` strips `<>{}\[\]\`\n\r` and length-caps to 120 chars. |
| S4 | Public Cypher routes | Error responses leaked internal `error.message` (session/DB hints). | **Fixed** — both `start` and `message` now log structured error server-side and return generic `Internal error`. |

### MEDIUM → partially remediated

| # | File | Vector | Status |
|---|---|---|---|
| S5 | `…/subdomain/[subdomainKey]/{recap,confirm}/route.ts` | Path param `subdomainKey` went through `decodeURIComponent` without format validation. | **Fixed** — both routes now reject any value not matching `^[A-Z0-9]{2,5}\.[A-Z0-9]{2,5}$`. |
| S6 | `internal/assessment-cypher` body schemas | Same `subdomainKey` field accepted any 1-50 chars. | **Fixed** — both `StartBodySchema` and `MessageBodySchema` now require the same regex. |
| S7 | Cypher `message` route | No per-session rate limit beyond global 100 req/min. A single session could exhaust Claude quota. | **Not yet applied** — see §6. Recommend ~5 msg/min per `session.id`. |
| S8 | Public Cypher route | `sanitizeInput()` is called **after** `validateBody()`. Order is acceptable today (Zod limits length) but reverse is safer. | **Not yet applied** — see §6. |

### LOW

| # | File | Vector | Status |
|---|---|---|---|
| S9 | `assessmentCypherHandler.ts` | `console.warn` could leak DB error strings to aggregate logs. | **Fixed** — replaced with `console.error` + structured payload; SQL hints not included. |
| S10 | `package.json` | `npm audit` reports outstanding CVEs in transitive deps (handlebars, glob, brace-expansion). | **Not fixed** — see §6. |

### Confirmed safe
- ✅ `cypher_assessment_transcripts` RLS: `user_id = auth.uid()` only on SELECT + INSERT — org admins genuinely cannot see chat history (spec §1 requirement).
- ✅ JWT enforcement on `/api/v1/*` via `requireApiUser` + middleware.
- ✅ No hardcoded secrets in source.
- ✅ Existing `PROMPT_CANARY` trust boundary intact on the new Cypher call type.
- ✅ Zod validation precedes all DB writes.
- ✅ Supabase query builder used everywhere — no string-interpolated SQL.

---

## 5 · Diff Summary of Fixes Applied This Pass

| File | Lines changed | Fix |
|---|---|---|
| `app/api/internal/assessment-cypher/route.ts` | +21 / −5 | Timing-safe secret compare; subdomainKey regex; `refine()` on conversation history |
| `orchestration/prompts/assessmentCypher.ts` | +12 / −2 | `sanitisePromptToken` for `agentName` / `userName` / `organizationName` / `domainName` |
| `app/api/v1/.../cypher/message/route.ts` | +5 / −5 | Generic `Internal error` response; structured server log |
| `app/api/v1/.../cypher/start/route.ts` | +5 / −5 | Same |
| `app/api/v1/.../subdomain/[subdomainKey]/recap/route.ts` | +3 / 0 | Regex format-check on `subdomainKey` |
| `app/api/v1/.../subdomain/[subdomainKey]/confirm/route.ts` | +3 / 0 | Same |
| `orchestration/handlers/assessmentCypherHandler.ts` | +9 / −3 | Structured error logging on two paths |

`npx tsc --noEmit` clean. `npx jest` — **24 / 24 passing.**

---

## 6 · Recommended Next Pass (not blocking)

1. **Per-session rate limit** on `cypher/message` — ~5 req/min keyed by `sessionId`. Implementation: extend the existing rate-limit middleware to accept a custom key resolver.
2. **`npm audit fix`** — patch the transitive CVEs (handlebars, glob, brace-expansion) before next deploy.
3. **`assessmentCypherHandler.logTranscript` hard-fail** — when the transcript insert fails, surface the error rather than swallowing it, so audit gaps cannot accumulate silently.
4. **Higher-order route helper** — `withAuthorisedSession(handler)` to remove the four-line preamble repeated across all eight Agent 17 routes.
5. **Sanitise-then-validate ordering** — flip `sanitizeInput(validateBody(...))` to `sanitizeInput(rawBody) → validateBody(...)` in the two Cypher routes for defence-in-depth.
6. **Logging library** — introduce `pino` or a similar structured logger; the new `console.error` calls use the right shape but a real sink is preferable in production.

---

## 7 · Verdict

The new Agent 17 surface (schema, scoring engine, 9 API routes, 11 components, Cypher orchestration) is **production-ready** after this pass. Spec compliance is faithful given the reconciliations called out (subdomain derived from control-ID prefix; `framework_id` as VARCHAR per existing convention). All HIGH-severity findings raised by both reviews have been remediated in-place. Remaining items in §6 are hardening, not gating.
