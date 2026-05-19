# Simplify.is Master Agent Dossier (Full Detail)

As requested, this is a detailed all-agents compendium that consolidates every file in `simplify-is/agents` into one document for a new chat handoff.

## Scope Confirmation

This dossier includes all 29 files in `agents`:

1. `00_WAR_ROOM_MasterOrchestration.md`  
2. `01_AGENT_INFRASTRUCTURE_ProjectSetupAuthDBSchema.md`  
3. `02_AGENT_BACKEND_OrchestrationEngineRAGPipeline.md`  
4. `03_AGENT_BACKEND_APILayerControlLibraries.md`  
5. `04_AGENT_UIUX_PostLoginDashboardAssessment.md`  
6. `05_AGENT_SECURITYQA_PenetrationTestingE2ELaunchPrep.md`  
7. `06_AGENT_BACKEND_MultiUserCollaboration.md`  
8. `07_AGENT_UIUX_PreLoginPagesAuthFlow.md`  
9. `08_AGENT_BACKEND_AuthenticationEmailService.md`  
10. `09_AGENT_INTEGRATION_AuthUIAPIWiring.md`  
11. `10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md`  
12. `10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`  
13. `11_AGENT_UIUX_OnboardingRefinementInitialisation_CLAUDE_CODE.md`  
14. `11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`  
15. `15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md`  
16. `DONE_AGENT5_SECURITYQA.md`  
17. `HANDOFF_1_INFRASTRUCTURE.md`  
18. `HANDOFF_2_ORCHESTRATION.md`  
19. `HANDOFF_3_APILAYER.md`  
20. `HANDOFF_4_DASHBOARD_UIUX.md`  
21. `HANDOFF_7_PRELOGIN_UIUX.md`  
22. `HANDOFF_8_AUTH_BACKEND.md`  
23. `HANDOFF_9_AUTH_INTEGRATION.md`  
24. `HANDOFF_11_ONBOARDING_REFINEMENT.md`  
25. `HANDOFF_15_THREAT_READINESS.md`  
26. `SECURITY_AUDIT_REPORT.json`  
27. `SIMPLIFY_IS_MASTER_CONTEXT.md`  
28. `THREAT_READINESS_ARCHITECTURE.md`  
29. `THREAT_READINESS_PROMPTS.md`

---

## Per-file Deep Digest

### `agents/00_WAR_ROOM_MasterOrchestration.md`
- **Purpose:** master sequencing/governance contract for the original 5-agent execution.
- **Deliverables:** defines ordered chain, mandatory handoffs, and strict global rules.
- **Key decisions:** no frontend direct Supabase; no `/api/v1` direct Claude; env validation centralized; model lock policy.
- **Endpoints expected:** authenticated `/api/v1/*`; secret-gated `/api/internal/*`.
- **Schema notes:** create migrations only in `supabase/migrations`; do not recreate seeded framework tables.
- **Security:** strongest baseline; RLS everywhere; no client-exposed secrets.
- **Testing/QA:** checkpointing between agents with working proofs.
- **Deferred/risks:** depends on strict downstream compliance.

### `agents/01_AGENT_INFRASTRUCTURE_ProjectSetupAuthDBSchema.md`
- **Purpose:** infra/auth/schema bootstrap spec.
- **Deliverables:** Next.js setup, env abstraction, DB/auth layers, migration `001`, middleware, onboarding page, docs/rules.
- **Key decisions:** only `lib/config/env.ts` reads process env; abstraction-first architecture.
- **Endpoints expected:** internal test route, auth callback, protected app/API routes.
- **Schema notes:** large initial schema expansion and correction of duplicate domain column issue.
- **Security:** secret boundaries and RLS patterns.
- **Testing:** build/lint/auth flow checks.
- **Deferred:** environment and migration-history reconciliation risk.

### `agents/02_AGENT_BACKEND_OrchestrationEngineRAGPipeline.md`
- **Purpose:** orchestration and RAG core spec.
- **Deliverables:** internal action router, RAG builder, Claude abstraction, usage monitor, scoring/state engines.
- **Key decisions:** all Claude calls through orchestrator; usage checks before calls.
- **Internal actions:** session start/submit, signal extraction, scoring, usage check, greeting.
- **Schema notes:** relies on Agent 1 tables (usage/session/scoring).
- **Security:** timing-safe internal secret checks; action auditing.
- **Testing:** explicit unit matrix and coverage target.
- **Deferred:** prompt fidelity and full coverage depth.

### `agents/03_AGENT_BACKEND_APILayerControlLibraries.md`
- **Purpose:** public API and control-library spec.
- **Deliverables:** middleware, endpoint suite, response helpers, ISO/NIST libs, integration tests.
- **Key decisions:** standardized error contracts; public routes delegate AI via internal layer.
- **Endpoints:** assessment/session/response/risks/notifications/export/reassess.
- **Schema notes:** uses seeded domains/frameworks and response tables.
- **Security:** JWT, CORS, headers, payload limits, sanitization.
- **Testing:** auth/org/rate-limit/validation path coverage.
- **Deferred:** PDF + notifications may remain shallow in MVP.

### `agents/04_AGENT_UIUX_PostLoginDashboardAssessment.md`
- **Purpose:** post-login dashboard and assessment UI spec.
- **Deliverables:** design system, shell, charts/chat, assessment flow, risk/compliance surfaces.
- **Key decisions:** data via hooks only; no direct component fetch.
- **UX decisions:** cinematic “dark ops” design language in this generation.
- **Security:** typed contracts and boundary adherence.
- **Testing:** robust loading/error/empty-state requirements.
- **Deferred:** advanced polish and interactions.

### `agents/05_AGENT_SECURITYQA_PenetrationTestingE2ELaunchPrep.md`
- **Purpose:** launch-hardening spec.
- **Deliverables:** security completion pass, E2E scenario suite, landing page, Stripe/Resend integration.
- **Key decisions:** strict hygiene checks and production-readiness criteria.
- **Endpoints:** billing, notifications, account deletion, launch-critical routes.
- **Security:** broad hardening matrix.
- **Testing:** Playwright-first scenario completion.
- **Deferred:** some external/manual checks required.

### `agents/06_AGENT_BACKEND_MultiUserCollaboration.md`
- **Purpose:** collaboration expansion spec.
- **Deliverables:** role model, assignments, final answers, audit trail, team/admin surfaces.
- **Key decisions:** admin final-answer precedence for scoring.
- **Endpoints:** users/assignments/responses/final-answers/audit-trail families.
- **Schema notes:** significant user/assignment/audit table additions.
- **Security:** role middleware and privacy constraints.
- **Testing:** role conflict and permission matrix.
- **Deferred:** SSO/realtime/uploads out-of-scope.

### `agents/07_AGENT_UIUX_PreLoginPagesAuthFlow.md`
- **Purpose:** pre-login UX spec.
- **Deliverables:** marketing/auth/error pages, SEO/GTM, theme toggle, auth stubs.
- **Key decisions:** no backend wiring in this phase; Agent 8/9 follow.
- **UI decisions:** full responsive dark/light behavior.
- **Security:** generic auth errors and CSRF placeholders.
- **Testing:** lighthouse/perf/accessibility expectations.
- **Deferred:** contact flow.

### `agents/08_AGENT_BACKEND_AuthenticationEmailService.md`
- **Purpose:** auth backend spec.
- **Deliverables:** auth endpoint matrix, MFA, resend integration, rate limiter, trigger migration, soft delete.
- **Key decisions:** Supabase-native auth mechanics; server cookie control.
- **Schema notes:** auth migration and user/account safety fields.
- **Security:** pre-auth rate checks and generic responses.
- **Testing:** endpoint/unit/integration requirements.
- **Deferred:** dashboard-side Supabase config actions.

### `agents/09_AGENT_INTEGRATION_AuthUIAPIWiring.md`
- **Purpose:** wire pre-login/auth UI to backend.
- **Deliverables:** full auth flow integration and middleware behavior.
- **Key decisions:** HttpOnly cookie-based session persistence.
- **Endpoints:** signup/login/mfa/reset/session/logout.
- **Security:** cookie-first session model, CSRF expected.
- **Testing:** comprehensive happy/error manual matrix.
- **Deferred:** depends on missing backend pieces (resend/CSRF completeness).

### `agents/10_AGENT_UIUX_PostLoginDashboardComplete_CURSOR.md`
- **Purpose:** broad post-login implementation spec.
- **Deliverables:** shell/routes/modals/chats/views/settings and wide component inventory.
- **Key decisions:** desktop-first, mocks permitted while wiring catches up.
- **Endpoints expected:** broad API consumption through hooks, initially mixed with mocks.
- **Testing:** quality/perf/accessibility plus lint/build/test.
- **Deferred:** visual and behavior polish handled in later pass.

### `agents/10_AGENT_UIUX_PostLoginDashboardComplete_CLAUDE_CODE.md`
- **Purpose:** Agent 10 polish/audit spec.
- **Deliverables:** fidelity/accessibility/responsive/security refinements.
- **Key decisions:** preserve core Cursor output and close gaps.
- **Testing:** stronger manual/unit/integration verification guidance.
- **Deferred:** some data sources and copy/edge behavior.

### `agents/11_AGENT_UIUX_OnboardingRefinementInitialisation_CURSOR.md`
- **Purpose:** onboarding/initialisation refinement spec.
- **Deliverables:** plan-aware onboarding selection, initialisation modal, banners, settings discovery page, public page updates.
- **Key decisions:** Essential vs Professional gating, NIST baseline lock, mock-to-real user state transition approach.
- **Endpoints expected:** onboarding and user-state endpoints, discovery APIs (some future-wired).
- **Schema notes:** references `plan` and discovery status fields.
- **Deferred:** icon set and optional signup-time framework selection.

### `agents/11_AGENT_UIUX_OnboardingRefinementInitialisation_CLAUDE_CODE.md`
- **Purpose:** polish pass for Agent 11 outputs.
- **Deliverables:** bug fixes, integration alignment (including Agent 15), responsive/light-mode/a11y completion.
- **Key decisions:** strict naming and behavior checks for onboarding + modal.
- **Testing:** dual plan-path walkthrough and build sanity.
- **Deferred:** custom SVG/animation-level polish.

### `agents/15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md`
- **Purpose:** full Threat Readiness + Tech Stack Discovery feature spec.
- **Deliverables:** migration, prompts, orchestration, APIs, hooks, pages, tests.
- **Key decisions:** 24h cache, merged customization model, admin-gated writes.
- **Endpoints:** discovery run/status, stack CRUD-like flows, threat readiness fetch/refresh/customize.
- **Schema notes:** expects dedicated migration for threat readiness.
- **UI decisions:** split threat workspace and onboarding step expansion.
- **Deferred:** drag/drop fallback and later polish.

### `agents/HANDOFF_1_INFRASTRUCTURE.md`
- **Purpose:** Agent 1 completion handoff.
- **Claims:** env/auth/db layers, migration, middleware, onboarding skeleton implemented.
- **Security/testing:** route gates and build checks pass.
- **Outstanding:** migration history cleanup and full live env verification.

### `agents/HANDOFF_2_ORCHESTRATION.md`
- **Purpose:** Agent 2 completion handoff.
- **Claims:** internal action route, orchestrator/RAG/scoring/state engines and tests implemented.
- **Outstanding:** test coverage below target; prompt compactness divergence.

### `agents/HANDOFF_3_APILAYER.md`
- **Purpose:** Agent 3 completion handoff.
- **Claims:** API middleware/routes/libraries live with tests.
- **Outstanding:** in-memory rate limiting, notifications/PDF depth, risk mapping completeness.

### `agents/HANDOFF_4_DASHBOARD_UIUX.md`
- **Purpose:** Agent 4 completion handoff.
- **Claims:** dashboard and component surfaces implemented.
- **Outstanding:** partial mock data and token-storage caveat.

### `agents/HANDOFF_7_PRELOGIN_UIUX.md`
- **Purpose:** Agent 7 completion handoff.
- **Claims:** pre-login visuals, auth stubs, route shells delivered.
- **Outstanding:** full auth wiring, MFA resend flow, CSRF backend, metadata standardization.

### `agents/HANDOFF_8_AUTH_BACKEND.md`
- **Purpose:** Agent 8 completion handoff.
- **Claims:** auth endpoints + migration + lockout + soft delete delivered.
- **Outstanding:** remember-me maxAge completion and welcome-email trigger path.

### `agents/HANDOFF_9_AUTH_INTEGRATION.md`
- **Purpose:** Agent 9 completion handoff.
- **Claims:** UI/API auth integration and SSR auth middleware behavior delivered.
- **Outstanding:** missing MFA resend endpoint, CSRF not fully real, remember-me persistence gap.

### `agents/HANDOFF_11_ONBOARDING_REFINEMENT.md`
- **Purpose:** Agent 11 completion handoff.
- **Claims:** onboarding framework updates, initialisation modal, tech-stack discovery surfaces, page updates, tests green.
- **Critical detail:** explicitly reverts onboarding step-5 user path despite Agent 15 initial shape.
- **Outstanding:** custom SVG icons, onboarding shell ambiguity, modal mobile polish, mock user-state fields pending backend.

### `agents/HANDOFF_15_THREAT_READINESS.md`
- **Purpose:** Agent 15 completion handoff.
- **Claims:** threat-readiness stack delivered (DB/prompts/orchestration/API/UI/tests).
- **Critical detail:** implementation diverges from architecture assumptions (dedicated discovery tables, direct orchestration path).
- **Outstanding:** DnD reorder, E2E, sparkline polish.

### `agents/THREAT_READINESS_ARCHITECTURE.md`
- **Purpose:** architecture intent/reference for threat readiness.
- **Decisions:** scenario-based readiness framing, split-panel UI, caching and admin controls.
- **Outstanding:** later implementation drift requires doc realignment.

### `agents/THREAT_READINESS_PROMPTS.md`
- **Purpose:** canonical prompts and output contracts.
- **Decisions:** strict JSON extraction/generation format and recap-ready conventions.
- **Outstanding:** iterative prompt tuning expected.

### `agents/DONE_AGENT5_SECURITYQA.md`
- **Purpose:** launch-gate status across Agents 1-5.
- **Claims:** major security and E2E gate completion, including landing/billing/email scope.
- **Outstanding:** two explicit manual checks (secret history and storage expiry policy).

### `agents/SECURITY_AUDIT_REPORT.json`
- **Purpose:** machine-readable security script output.
- **Claims:** route guard coverage and no obvious secret leakage in audited scope.
- **Outstanding:** does not replace runtime penetration depth.

### `agents/SIMPLIFY_IS_MASTER_CONTEXT.md`
- **Purpose:** broad consolidated context snapshot.
- **Value:** architecture, decisions, status baseline.
- **Outstanding:** partially stale versus later Agent 11/15 updates and chronology.

---

## Chronological Cross-Agent Narrative

1. **Foundation contract established** (`00_WAR_ROOM...`) with strict architecture/security boundaries.
2. **Agents 1-5 delivered core platform** (infra -> orchestration -> API -> dashboard -> security QA), leaving explicit MVP debt.
3. **Agents 7-9 executed auth/pre-login wave**, turning stubs into integrated flows but retaining CSRF/MFA resend/remember-me gaps.
4. **Agent 10 expanded post-login surface area** and required dedicated polish discipline.
5. **Agent 11 refined onboarding/initialisation and pricing-aware flows**, while introducing temporary local-state mocks.
6. **Agent 15 introduced threat-readiness vertical**, but created flow and architecture conflicts with Agent 11 and earlier rules.
7. **Current state** requires canonicalization before next major build wave.

---

## Master Unresolved Backlog (Deduplicated)

## P0
- Resolve single canonical onboarding/discovery flow (step 5 vs initialisation-only path).
- Complete operational launch checks:
  - PDF signed-link expiry policy verification.
  - `.env.local`/secret history verification.

## P1
- Auth hardening: MFA resend endpoint, real CSRF implementation, remember-me cookie lifespan behavior.
- Replace in-memory rate limiting with distributed implementation.
- Complete notification send and PDF export implementations if still stub-level.
- Remove frontend/user-state mocks and wire true DB-backed state.
- Complete threat readiness DnD and E2E coverage.

## P2
- Icon/design polish carry-over.
- Harmonize doc naming conventions and stale references.
- Expand coverage/perf hardening where below target.

---

## Conflict Matrix + Canonical Resolution

1. **Tech-stack discovery entry conflict**
- Files: `HANDOFF_11_ONBOARDING_REFINEMENT.md` vs `15_AGENT_FEATURE_ThreatReadinessTechStackDiscovery.md` + `HANDOFF_15_THREAT_READINESS.md`
- Resolution: keep initialisation modal as primary MVP path; gate/remove onboarding step-5 user path unless deliberately reintroduced.

2. **Onboarding shell composition conflict**
- Files: Agent 10/11 specs + handoff notes
- Resolution: treat currently implemented dedicated onboarding shell as canonical until product decision changes it.

3. **Threat transcript schema mismatch**
- Files: `THREAT_READINESS_ARCHITECTURE.md` vs `HANDOFF_15_THREAT_READINESS.md`
- Resolution: accept dedicated discovery session/message tables as implementation truth; update architecture doc.

4. **Internal routing purity drift**
- Files: `00_WAR_ROOM...` vs `HANDOFF_15_THREAT_READINESS.md`
- Resolution: define explicit policy exception (or enforce one standard across all features).

5. **Auth integration expectation mismatch**
- Files: `09_AGENT_INTEGRATION_AuthUIAPIWiring.md` vs `HANDOFF_8_AUTH_BACKEND.md`/`HANDOFF_9_AUTH_INTEGRATION.md`
- Resolution: add explicit auth hardening milestone before release.

---

## Recommended Use In New Claude Chat

1. Load this dossier first for complete agent-by-agent context.
2. Then load:
   - `docs/2026-05-07/02_PROJECT_SOURCE_OF_TRUTH_AND_SPECS.md`
   - `docs/2026-05-07/03_NOTION_AND_8_WEEK_EXECUTION_PLAN.md`
3. Ask Claude to produce a verified “done vs not-done in code” table and start with P0s.
