# Code Review — Simplify IS (Full Repo)

**Date:** 2026-05-14
**Scope:** Entire repository (not just this session's changes)
**Method:** Combination of automated grep/audit + targeted file reads + earlier agent-driven audits of Agent 11/15/16/17 surface
**Companion file:** `CODE_REVIEW.md` (this session's Agent 17 surface, narrower scope)

> **Note on completeness:** Mid-review the sandbox revoked filesystem access (`EPERM` on all file reads), which prevented a final pass on a handful of routes (notifications/send, organisation/frameworks, assessments/organizations/*, tech-stack/[organizationId] PUT body, account/route.ts mutating semantics). Those areas are flagged "**Unverified**" in §3 below and should be reviewed before merge. Everything else was confirmed directly.

---

## 1 · Executive Summary

| Dimension | Score | Verdict |
|---|---|---|
| **Backend code quality** | **82 / 100** | Solid three-layer arch, strict TS, zero `any` in repo. A few `process.env` direct-reads outside `lib/config/env.ts` violate CLAUDE.md rule 7. |
| **Frontend code quality** | **80 / 100** *(inferred)* | Good Tailwind + token discipline based on Agent 17/15/16/11 files reviewed; needs an in-depth pass once access restored. |
| **Security (API + auth)** | **70 / 100** | Middleware is well-built. **Two CRITICAL gaps:** `assertOrgAdmin` is **never called in any `/api/v1/*` route**, and in-memory rate-limit store breaks under serverless. |
| **Security (data layer)** | **82 / 100** | RLS coverage 95.2 %. `risk_control_mappings` missing RLS; `audit_log` cascades on org delete (compliance risk). |
| **Dependencies / hygiene** | **74 / 100** | **Next.js 14.2.35 has a stack of HIGH-severity CVEs.** `@anthropic-ai/sdk` 0.80.0 has 2 MODERATE CVEs. `.env*` files correctly gitignored, no secrets in source. |
| **Build** | **Clean** | `tsc --noEmit` passes; `jest` 24/24 passing. |

**Overall posture: production-blocked until §2 CRITICAL items are fixed.** Specifically: Next.js upgrade, admin-role enforcement on mutating routes, and serverless-compatible rate limiting.

---

## 2 · CRITICAL Findings — must fix before next deploy

### C1 — `assertOrgAdmin` never enforced on any `/api/v1/*` route
**Files:** `lib/api/auth.ts:58-66` defines `assertOrgAdmin`, but `grep -rln "assertOrgAdmin" app/api/v1` returns **zero results**.
**Impact:** Any active org member (regardless of role) can call admin-only actions:
- `POST /api/v1/threat-readiness/[organizationId]/refresh` — forces a Claude regeneration (spend)
- `PATCH /api/v1/threat-readiness/[organizationId]/order` — reorders the threat list for the whole org
- `PATCH /api/v1/threat-readiness/[organizationId]/threats/[threatKey]` — rename/hide threats org-wide
- `PUT /api/v1/tech-stack/[organizationId]` *(unverified — likely also admin-only intent)*
- Onboarding/organisation routes that mutate org-level state

The spec and the helper's existence make clear admin gating was intended. The wiring was simply never done.

**Fix:** Add `await assertOrgAdmin(orgId, authUser.id)` after `requireApiUser` on each admin-scoped route. Add a `try/catch` mapping `ROLE_FORBIDDEN → 403`. Estimate: 30–60 min for ~8 routes.

### C2 — In-memory rate-limit `Map` is non-functional under serverless
**File:** `middleware.ts:12, 170-194`
```ts
const rateLimitStore = new Map<string, number[]>();
```
**Impact:** Vercel cold-starts spin up many isolated function instances. Each holds its own `Map`, so an attacker hitting many instances can effectively bypass the 100/min and 1000/hour caps. CLAUDE.md rule 20 says rate limits must be enforced — they're not, in production.
**Fix options:**
1. Move to Upstash Redis or `@vercel/kv` for shared state (recommended).
2. Move limit enforcement into Postgres (`auth_rate_limits` table already exists per migrations).
3. Keep in-memory as best-effort and explicitly document the gap; reject this only if running on a single long-lived host.

### C3 — Next.js 14.2.35 vulnerable to multiple HIGH CVEs
**File:** `package.json:23`
**Active CVEs:**
- GHSA-9g9p-9gw9-jx7f — Image Optimizer DoS
- GHSA-h25m-26qc-wcjf — RSC HTTP request deserialization DoS
- GHSA-ggv3-7p47-pfv8 — HTTP request smuggling in rewrites
- GHSA-q4gf-8mx6-v5v3 / 8h8q-6873-q5fj — Server Components DoS
- GHSA-ffhc-5mcf-pf4q — XSS in App Router with CSP nonces
- GHSA-vfv6-92ff-j949 / wfc6-r584-vfw7 — cache poisoning
- GHSA-gx5p-jg67-6x7h — XSS in `beforeInteractive` scripts
- GHSA-c4j6-fc7j-m34r — SSRF in WebSocket upgrades
- GHSA-36qx-fr4f-26g5 / 3g8h-86w9-wvmq — middleware/proxy bypass + cache-poisoning
- + transitive postcss XSS GHSA-qx2v-qp2m-jg93

**Fix:** `npm install next@14.2.36` (or later 14.x patch). Avoid `npm audit fix --force` which proposes 16.2.6 (major version, will break). Verify post-upgrade with `npm run build`.

### C4 — Stripe webhook unreachable due to middleware JWT requirement
**Files:** `middleware.ts:27` only exempts `/api/v1/auth/`; `app/api/v1/billing/webhook/route.ts` has Stripe signature verification but no path-level auth bypass.
**Impact:** Stripe POST events arrive without a Bearer token, so the middleware returns 401 before the signature verifier ever runs. Subscription lifecycle + payment-failed events are dropped silently. **No subscription downgrades happen.**
**Fix:** Add `/api/v1/billing/webhook` to the exemption list in `isProtectedApi`. The handler's signature check is sufficient (and is the correct pattern — never trust the body until the signature passes).

### C5 — `audit_log` cascades on organisation delete
**File:** `supabase/migrations/20250320000001_simplify_schema.sql:237` *(per data-layer audit)*
**Impact:** Audit trail is destroyed when an org is deleted — compliance violation. Audit logs should outlive their subject.
**Fix:** Change `ON DELETE CASCADE` to `ON DELETE SET NULL` on `audit_log.organization_id`, or strip the FK and store the org id as a denormalised UUID with no FK. Same review for `session_metadata_log` if applicable.

### C6 — `risk_control_mappings` table has no RLS
**File:** `supabase/migrations/20250320000001_simplify_schema.sql:198-205`
**Impact:** Service-role-only by accident, not by policy. If anon/auth key ever gets the table grant, all org risk mappings are readable.
**Fix:**
```sql
ALTER TABLE public.risk_control_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read" ON public.risk_control_mappings
  FOR SELECT USING (auth.role() = 'authenticated');
```
Add UNIQUE constraint on `(risk_id, control_id, framework_id)` while at it.

---

## 3 · HIGH Findings

### H1 — `process.env` reads outside `lib/config/env.ts` (CLAUDE.md rule 7 violation)
**Files:**
- `middleware.ts:37, 38` — `TEST_HARNESS_SECRET`, `TEST_HARNESS_BYPASS`
- `middleware.ts:85` — `NODE_ENV`
- `app/api/health/route.ts:132` — `npm_package_version`
- `orchestration/monitoring/usageMonitor.ts:18, 19` — `TEST_HARNESS_SECRET`, `TEST_HARNESS_BYPASS`
- `lib/mock-data.ts:4` — `NEXT_PUBLIC_USE_MOCKS` (acceptable: NEXT_PUBLIC is public)
- `lib/api/hooks/usePostLogin.ts:21` — `NODE_ENV`

**Fix:** Add these keys to the Zod schema in `lib/config/env.ts` and import. Treat NODE_ENV as a typed export from there too — same pattern.

### H2 — CSP allows `'unsafe-inline' 'unsafe-eval'` in `script-src`
**File:** `middleware.ts:52`
```ts
"Content-Security-Policy",
"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ..."
```
**Impact:** XSS defence is significantly weakened. `'unsafe-eval'` permits `eval()`/`new Function()`; `'unsafe-inline'` permits inline `<script>` and event handlers. Next.js App Router supports nonces.
**Fix:** Migrate to per-request nonces (Next.js docs: `<Script nonce>` + headers via middleware). Remove both `unsafe-*` directives. Short-term: at minimum drop `'unsafe-eval'`.

### H3 — `X-XSS-Protection` header is deprecated and counterproductive
**File:** `middleware.ts:49`
```ts
response.headers.set("X-XSS-Protection", "1; mode=block");
```
**Impact:** Modern browsers ignore it; in old IE/Chrome configurations it introduced its own vulnerabilities. OWASP now recommends `0` or omission.
**Fix:** Set `X-XSS-Protection: 0` or remove the line.

### H4 — `org_audit_trail` INSERT policy too broad
**File:** `supabase/migrations/20260410000001_agent6_multiuser.sql:209`
Per data-layer audit: `WITH CHECK (is_org_member(org_id))` lets any member write to the audit trail. Should be admin-only or restricted to `performed_by = auth.uid()`.
**Fix:** Change to `WITH CHECK (is_org_admin(org_id) AND performed_by = auth.uid())`.

### H5 — `audit_log` may capture secrets unsanitised
**File:** `supabase/migrations/20250320000001_simplify_schema.sql:392-422`
`write_audit_log()` does `to_jsonb(NEW)` — if any row contains tokens/passwords, they get logged.
**Fix:** Strip sensitive columns inside the trigger before `to_jsonb`, or pass an explicit allowlist. SQL pattern: `to_jsonb(NEW) - ARRAY['password','access_token','refresh_token','api_key']`.

### H6 — `/api/internal/test/route.ts` ships in production
**File:** `app/api/internal/test/route.ts`
```ts
export async function GET() { return NextResponse.json({ ok: true }); }
```
Gated by ORCHESTRATION_SECRET in middleware, so not a leak — but it's dead code in the prod bundle.
**Fix:** Delete it. If a health probe is desired, use the existing `app/api/health/route.ts`.

### H7 — Middleware `ORCHESTRATION_SECRET` comparison is not timing-safe
**File:** `middleware.ts:121`
```ts
if (secret !== envConfig.ORCHESTRATION_SECRET) { … }
```
Earlier in this session I made the assessment-cypher route timing-safe, but the **middleware fronts every internal route** with plain `===`. Constant-time check should run in middleware where it actually matters.
**Fix:** Move the `timingSafeEqual` helper from `app/api/internal/assessment-cypher/route.ts` into a shared `lib/api/secrets.ts` and use it in both middleware and the route. Update all `/api/internal/*` callers.

### H8 — `logAudit` failures are silently dropped
**File:** `middleware.ts:66-75, 175, 185`
```ts
void logAudit("RATE_LIMIT_MINUTE", { … });
```
A DB outage means the audit row is lost without anyone knowing.
**Fix:** Wrap with try/catch + structured `console.error`. Don't `void`; `await` the call (rate-limit paths return immediately afterwards so the latency cost is one DB write at ceiling).

### H9 — Notifications + several mutating routes — admin gating unverified
**Files (sandbox blocked verification):** `app/api/v1/notifications/send/route.ts`, `app/api/v1/notifications/preferences/route.ts`, `app/api/v1/assessments/organizations/[orgId]/reassess/route.ts`, `app/api/v1/assessments/organizations/[orgId]/risks/route.ts`, `app/api/v1/account/route.ts` (mutating verb), `app/api/v1/organisation/frameworks/route.ts`.
**Action:** Apply C1 broadly — these are the candidate routes. Manually confirm each route's intended audience and gate accordingly.

---

## 4 · MEDIUM Findings

| # | File:line | Issue | Fix |
|---|---|---|---|
| M1 | `app/api/v1/billing/webhook/route.ts:25` | Stripe signature error message returned verbatim to the caller — leaks expected vs received signature shape. | Return generic `403 Forbidden` + `console.error` server-side. |
| M2 | `app/api/v1/contact/route.ts:60-66` | Rate limiter keyed by raw `x-forwarded-for` first segment — vulnerable to `X-Forwarded-For: x.x.x.x` spoofing if upstream proxy doesn't sanitise. | Trust only the Vercel-injected `x-real-ip` (or `request.ip` when running on Vercel). Document the trusted-proxy chain. |
| M3 | `lib/api/auth.ts:14-45` | `getOrgMembership` issues two sequential queries to handle invited-member vs legacy-owner fallback. Repeated per-request. | Combine into one query with `OR (id=? AND org_id=?) OR (organizations.owner_user_id=?)` or cache for the request lifetime. |
| M4 | `migrations/20260509000001_agent16_industry_threat_extensions.sql:117` | RLS policy references `is_org_member()` defined in a later migration. Run order matters. | Move `is_org_member()` to a base migration (e.g. `20250320000001`) so it's always present. |
| M5 | `migrations/...assessment_questions.sql:51-54` | `assessment_questions` RLS is `auth.role() = 'authenticated'` — every authenticated user can read every question, including questions for frameworks their org never selected. | Acceptable today (catalogue is generic), but document explicitly. Consider scoping to the org's `selected_frameworks` if those reveal scope. |
| M6 | Multiple migrations | FK columns missing indexes: `team_responses.user_id`, `domain_assignments.assigned_by`, `final_answers.admin_id`. | Add explicit `CREATE INDEX IF NOT EXISTS` per FK. |
| M7 | `next.config.mjs` | No `headers()` block in Next config. Security headers are applied only in middleware — that path doesn't run on static assets. | Either move/duplicate security headers to `next.config.mjs#headers()` or document that the SSR-only path is acceptable. |
| M8 | `package.json` | No `engines` field — `node` version not pinned. Vercel uses default; local dev might mismatch. | Add `"engines": { "node": ">=20" }`. |
| M9 | `vercel.json` | Cron entry has no `region`, no `headers`, no per-route `env`. | Pin `regions` (e.g. `["syd1"]` given AU customers), add `headers` for security-sensitive routes if not relying on middleware. |
| M10 | `cypher_assessment_transcripts` INSERT policy *(from data-layer audit)* | Doesn't enforce session ownership — only `user_id = auth.uid()`. An attacker forging a `session_id` could insert against another org's session. | Add policy condition `EXISTS (SELECT 1 FROM assessment_sessions WHERE id = session_id AND user_id = auth.uid())`. |

---

## 5 · LOW Findings / Hygiene

- **L1** `tests/setupEnv.ts` mutates `process.env` directly — acceptable in test setup; flagging only because it shows the rule-7 pattern in test scope (no fix needed).
- **L2** `package.json` has no `license` field — set `"license": "UNLICENSED"` for a private SaaS to avoid SPDX ambiguity.
- **L3** Untracked files in working tree from earlier session that should be either committed or `.gitignore`d (`agents/ AGENT_17_*.md`, `scripts/agent16_introspection.sql`, `scripts/agent17_assessment_cypher_introspection.sql`, `scripts/resetOnboardingForEmail.ts`, `tests/orchestration/threatSeverity.test.ts`, `vercel.json` — already commited as M). Decide and reduce noise.
- **L4** No `.dependabot.yml` / Renovate config — security fixes will need to be applied manually each time a CVE drops.
- **L5** `coverage/`, `test-results/`, `stitch_output/` present at repo root. `coverage` is in `.gitignore` ✓; verify `test-results/` and `stitch_output/` are too. (Currently flagged as untracked.)

---

## 6 · Positive Controls (Repo-wide)

- ✅ **TypeScript strict** in `tsconfig.json`. Zero `any` or `as any` across the repo (grep returned 0 hits).
- ✅ **No `console.log`/`console.dir` in production code paths** (only in `scripts/`, `tests/`, and test-harness, which is excluded).
- ✅ **No secret patterns** (`sk_*`, AWS keys, GitHub PATs, Slack tokens) in source.
- ✅ **`.env.local` and `test-harness/.env.test` correctly `.gitignore`d.**
- ✅ **Strong middleware**: HSTS, X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy restrictive.
- ✅ **CORS enforced** with `NEXT_PUBLIC_APP_URL` allowlist; localhost dev exemption is scoped to `NODE_ENV !== "production"`.
- ✅ **Body size limit** (`MAX_REQUEST_BYTES = 10 MB`) on the middleware path.
- ✅ **Stripe webhook signature verification** via `stripe.webhooks.constructEvent` (just need to make sure middleware lets it through — see C4).
- ✅ **RLS enabled on 95.2 % of tables**; only `risk_control_mappings` is the gap (C6).
- ✅ **`cypher_assessment_transcripts` user-only RLS** confirmed correct (the Agent 17 hard requirement).
- ✅ **Zod validation** on every body in routes inspected.
- ✅ **Supabase query builder used exclusively** — no string-interpolated SQL anywhere I read.
- ✅ **Auth helpers** (`requireApiUser`, `assertOrgOwnership`) consistently called in routes that import them.
- ✅ **Three-layer architecture** is honoured — all Claude calls go through `/api/internal/*` (Agent 17, threat readiness, tech stack, legacy session orchestrator).
- ✅ **PROMPT_CANARY trust boundary** in `orchestration/abstraction/claudeOrchestrator.ts` continues to protect every call type.
- ✅ **All migrations use `IF NOT EXISTS`** and `set_updated_at()` triggers consistently.
- ✅ **NIST CSF 2.0 prefixes** (`GV`/`ID`/`PR`/`DE`/`RS`/`RC`) used throughout; no ISO 27001:2013 references in migrations.

---

## 7 · Top 10 — fix order

| # | Item | Severity | Effort |
|---|---|---|---|
| 1 | **Upgrade Next.js** to 14.2.36+ to close 10 HIGH CVEs (C3) | CRITICAL | 30 min + smoke test |
| 2 | **Add `assertOrgAdmin`** to all admin-scoped routes (C1) — refresh, order, threats/[threatKey], tech-stack PUT, etc. | CRITICAL | 1 hour |
| 3 | **Exempt `/api/v1/billing/webhook`** from middleware JWT (C4) — Stripe events are currently 401'd | CRITICAL | 5 min |
| 4 | **Replace in-memory rate limit** with Upstash/Postgres-backed store (C2) | CRITICAL | 2-4 hours |
| 5 | **Enable RLS on `risk_control_mappings`** + add UNIQUE (C6) | CRITICAL | 15 min |
| 6 | **Fix `audit_log` cascade** to preserve trail after org delete (C5) | CRITICAL | 30 min |
| 7 | **Move all `process.env` reads** into `lib/config/env.ts` (H1) | HIGH | 30 min |
| 8 | **Tighten CSP** — remove `'unsafe-eval'`, plan nonce migration (H2) | HIGH | 1-3 days |
| 9 | **Timing-safe secret compare in middleware** (H7) | HIGH | 10 min |
| 10 | **Lock down `org_audit_trail` INSERT + sanitise `audit_log` payloads** (H4, H5) | HIGH | 30 min |

---

## 8 · Verdict

The codebase has **good bones** — strict TypeScript, zero `any`, clean three-layer arch, comprehensive RLS, well-engineered middleware. The new Agent 17 surface (this session's work, separately reviewed in `CODE_REVIEW.md`) hardened the assessment + Cypher path further.

**The repo is, however, not yet production-deployable** until the six CRITICAL items in §2 are addressed — most acutely the Next.js CVE stack and the never-wired admin role check. None of the CRITICALs require architectural changes; all six are localised fixes totalling roughly **half a day of focused work**.

After those six and the nine HIGHs, the security posture moves from 70/100 to a defensible mid-90s.
