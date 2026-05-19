# Remediation Pack — CODE_REVIEW_FULL.md

Companion to `CODE_REVIEW_FULL.md`. Two fixes were already applied as new files (the sandbox blocked editing existing files mid-session); the rest are listed here as paste-ready code blocks.

## Files already written this pass

| File | Covers |
|---|---|
| `supabase/migrations/20260514000002_codereview_fixes.sql` | **C5** `audit_log` cascade · **C6** `risk_control_mappings` RLS + UNIQUE · **H4** `org_audit_trail` admin-only INSERT · **H5** `audit_log` secret sanitisation via `sanitize_audit_payload()` + rewritten `write_audit_log()` · **M4** idempotent `is_org_member`/`is_org_admin` helpers · **M6** missing FK indexes · **M10** `cypher_assessment_transcripts` session-ownership INSERT check |
| `lib/api/secrets.ts` | **H7** timing-safe `constantTimeEquals` + `isAuthorizedInternalRequest` helpers |

Apply the SQL via:

```bash
npx supabase db push --project-ref <ref>
```

Run-order safety: the new migration is purely additive and idempotent. It rewrites `write_audit_log()` and `is_org_member`/`is_org_admin` via `CREATE OR REPLACE`, so re-running the original migrations would re-clobber these. If that happens, re-run `20260514000002_codereview_fixes.sql` (last writer wins).

---

## C1 — Wire `assertOrgAdmin` on admin-only routes

`assertOrgAdmin` exists in `lib/api/auth.ts` but is called from zero `/api/v1/*` routes. The following routes mutate org-wide state and must require admin role.

### `app/api/v1/threat-readiness/[organizationId]/refresh/route.ts`

Find the `requireOrgMember` (or `assertOrgOwnership`) line and add an admin check next to it.

```ts
// at the top:
import { assertOrgAdmin } from "@/lib/api/auth";

// inside the try block, after the auth user is loaded:
await assertOrgAdmin(organizationId, authUser.id);
```

The route currently uses `requireOrgMember(request, organizationId)` from `@/lib/api/threatReadiness`. Replace that call with a member-then-admin pair, OR introduce a `requireOrgAdmin` in the same module:

```ts
// lib/api/threatReadiness.ts — add alongside requireOrgMember
import { assertOrgAdmin } from "@/lib/api/auth";

export async function requireOrgAdmin(
  request: Request,
  organizationId: string,
): Promise<{ id: string }> {
  const user = await requireOrgMember(request, organizationId);
  await assertOrgAdmin(organizationId, user.id);
  return user;
}
```

Then in the route:

```ts
import { requireOrgAdmin } from "@/lib/api/threatReadiness";
// ...
await requireOrgAdmin(request, organizationId);
```

Map the `ROLE_FORBIDDEN` error to a 403 in `handleApiError` (it likely already routes `ORG_FORBIDDEN` → 403; treat `ROLE_FORBIDDEN` the same).

### Apply the same admin gate to

| Route | Why admin |
|---|---|
| `app/api/v1/threat-readiness/[organizationId]/refresh/route.ts` | Forces a Claude regeneration (cost) |
| `app/api/v1/threat-readiness/[organizationId]/order/route.ts` | Reorders threats org-wide |
| `app/api/v1/threat-readiness/[organizationId]/threats/[threatKey]/route.ts` | Renames / hides threats org-wide |
| `app/api/v1/threat-readiness/[organizationId]/clarifications/[threatKey]/route.ts` | Marks clarifications verified/pending org-wide |
| `app/api/v1/tech-stack/[organizationId]/route.ts` (PUT/PATCH only) | Mutates org tech stack profile |
| `app/api/v1/onboarding/organisation/route.ts` | Mutates org-level fields |
| `app/api/v1/onboarding/frameworks/route.ts` | Mutates org framework selection |
| `app/api/v1/organisation/frameworks/route.ts` | Same |
| `app/api/v1/notifications/preferences/route.ts` | If editing org-level prefs (not user-level), admin only |

Keep `assertOrgOwnership` (member check) on read-only routes (`GET /threat-readiness/[organizationId]`, `GET /threat-readiness/[organizationId]/export`).

---

## C2 — Replace in-memory rate limiter

`middleware.ts:12` uses an in-process `Map`. Vercel serverless instances each hold their own copy, so the cap is effectively unenforced in production. Two paths:

### Option A — Upstash (recommended for serverless)

```bash
npm install @upstash/ratelimit @upstash/redis
```

Add to `lib/config/env.ts`:

```ts
UPSTASH_REDIS_REST_URL: z.string().url(),
UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
```

Create `lib/api/rateLimit.ts`:

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { config } from "@/lib/config/env";

const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN,
});

export const perMinuteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: false,
  prefix: "simplify:rl:min",
});

export const perHourLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "1 h"),
  analytics: false,
  prefix: "simplify:rl:hour",
});
```

In `middleware.ts`, replace the `rateLimitStore` / `timestamps` block with:

```ts
import { perHourLimiter, perMinuteLimiter } from "@/lib/api/rateLimit";

// inside the protected-API branch, after authenticatedUserId is set:
const minute = await perMinuteLimiter.limit(authenticatedUserId);
if (!minute.success) {
  void logAudit("RATE_LIMIT_MINUTE", { userId: authenticatedUserId, pathname });
  return applySecurityHeaders(
    NextResponse.json(
      { error: "Rate limit exceeded", code: "RATE_LIMITED", status: 429, retryAfter: minute.reset - Date.now() },
      { status: 429, headers: { "Retry-After": String(Math.ceil((minute.reset - Date.now()) / 1000)) } },
    ),
  );
}
const hour = await perHourLimiter.limit(authenticatedUserId);
if (!hour.success) {
  void logAudit("RATE_LIMIT_HOUR", { userId: authenticatedUserId, pathname });
  return applySecurityHeaders(
    NextResponse.json(
      { error: "Rate limit exceeded", code: "RATE_LIMITED", status: 429, retryAfter: hour.reset - Date.now() },
      { status: 429, headers: { "Retry-After": String(Math.ceil((hour.reset - Date.now()) / 1000)) } },
    ),
  );
}
```

Delete the now-unused `rateLimitStore`, `getRetryAfterSeconds`, `MINUTE_LIMIT`, `HOUR_LIMIT`.

### Option B — Postgres-backed (uses existing `auth_rate_limits` table)

If you don't want a Redis dep, extend `auth_rate_limits` to track API calls and roll a Postgres `SELECT count(*) … WHERE ts > NOW() - INTERVAL '1 minute'` in middleware. Lower throughput than Redis; OK for an MVP. Sketch:

```ts
// lib/api/rateLimit.ts
import { createAdminSupabaseClient } from "@/lib/db/admin";

export async function checkApiRateLimit(userId: string, pathname: string) {
  const db = createAdminSupabaseClient();
  const now = new Date().toISOString();
  await db.from("auth_rate_limits" as never).insert({
    identifier: userId,
    operation: "api",
    pathname,
    created_at: now,
  } as never);

  const { count: minuteCount } = await db
    .from("auth_rate_limits" as never)
    .select("*", { count: "exact", head: true })
    .eq("identifier", userId)
    .eq("operation", "api")
    .gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if ((minuteCount ?? 0) > 100) return { ok: false, window: "minute" as const };

  const { count: hourCount } = await db
    .from("auth_rate_limits" as never)
    .select("*", { count: "exact", head: true })
    .eq("identifier", userId)
    .eq("operation", "api")
    .gte("created_at", new Date(Date.now() - 3_600_000).toISOString());
  if ((hourCount ?? 0) > 1000) return { ok: false, window: "hour" as const };

  return { ok: true as const };
}
```

Schedule a daily cleanup cron to delete rows older than 1 day.

---

## C3 — Next.js upgrade

In `package.json`:

```diff
-    "next": "14.2.35",
+    "next": "14.2.36",
```

Then:

```bash
npm install
npm run build  # smoke
npx tsc --noEmit
npx jest
```

Do **not** run `npm audit fix --force` — it proposes `next@16.2.6` which is a major version that will break the App Router contract.

The same audit flags `@anthropic-ai/sdk` 0.80.0 with two MODERATE CVEs (memory-tool path validation, default file permissions). Both relate to the Memory Tool feature which simplify-is doesn't use; upgrade is optional but quick:

```diff
-    "@anthropic-ai/sdk": "0.80.0",
+    "@anthropic-ai/sdk": "0.96.0",
```

Re-run `tsc` and `jest` afterwards — the SDK's `Anthropic.Messages.MessageParam` and `anthropic.messages.create` surfaces are stable across 0.80 → 0.96, but verify.

---

## C4 — Exempt Stripe webhook from middleware JWT

`middleware.ts:24-29`:

```diff
 function isProtectedApi(pathname: string): boolean {
   // Auth endpoints must remain reachable pre-login; their own handlers perform
   // explicit token checks where required (e.g. MFA verify, logout, reset confirm).
   if (pathname.startsWith("/api/v1/auth/")) return false;
+  // Stripe webhook authenticates via signature header (constructEvent); JWT
+  // would block external callers.
+  if (pathname === "/api/v1/billing/webhook") return false;
+  // Public contact form has its own IP-based rate limit; JWT would block
+  // logged-out submitters.
+  if (pathname === "/api/v1/contact") return false;
   return pathname === "/api/v1" || pathname.startsWith("/api/v1/");
 }
```

Verify post-merge: send a test Stripe event, confirm 200 and that the row update in `users.subscription_status` happens.

---

## H1 — `process.env` reads outside `lib/config/env.ts`

Add to the Zod schema in `lib/config/env.ts`:

```ts
// server-only schema additions
TEST_HARNESS_SECRET: z.string().optional(),
TEST_HARNESS_BYPASS: z.string().optional(),
NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
NPM_PACKAGE_VERSION: z.string().optional(),
```

…and the matching `process.env.*` mapping in the same file.

Then patch:

### `middleware.ts:37-38, 85`

```diff
-  const secret = process.env.TEST_HARNESS_SECRET;
-  const bypass = process.env.TEST_HARNESS_BYPASS;
+  const { TEST_HARNESS_SECRET: secret, TEST_HARNESS_BYPASS: bypass } = envConfig;
```

```diff
-  if (process.env.NODE_ENV !== "production") {
+  if (envConfig.NODE_ENV !== "production") {
```

### `orchestration/monitoring/usageMonitor.ts:18-19`

```diff
-  const expected = process.env.TEST_HARNESS_SECRET;
-  const provided = process.env.TEST_HARNESS_BYPASS;
+  const { TEST_HARNESS_SECRET: expected, TEST_HARNESS_BYPASS: provided } = config;
```

…with `import { config } from "@/lib/config/env";` at the top if not already there.

### `app/api/health/route.ts:132`

```diff
-    version: process.env.npm_package_version ?? "0.1.0",
+    version: envConfig.NPM_PACKAGE_VERSION ?? "0.1.0",
```

### `lib/api/hooks/usePostLogin.ts:21`

`NODE_ENV` is read on the client. Use a build-time replacement via `clientConfig`:

```ts
// lib/config/env.ts — clientConfig section
NEXT_PUBLIC_NODE_ENV: z
  .enum(["development", "test", "production"])
  .default(process.env.NODE_ENV === "production" ? "production" : "development"),
```

Then:

```diff
-if (typeof window !== "undefined" && !USING_MOCKS && process.env.NODE_ENV !== "production") {
+if (typeof window !== "undefined" && !USING_MOCKS && clientConfig.NEXT_PUBLIC_NODE_ENV !== "production") {
```

Leave `lib/mock-data.ts:4` (`NEXT_PUBLIC_USE_MOCKS`) — that's already routed through a public env value, and migrating it is cosmetic.

---

## H2 — CSP: drop `'unsafe-eval'`, plan nonce migration

`middleware.ts:50-53`. The pragmatic two-step is:

```diff
   response.headers.set(
     "Content-Security-Policy",
-    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.supabase.co;",
+    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.stripe.com; frame-src 'self' https://js.stripe.com; base-uri 'self'; form-action 'self'; object-src 'none';",
   );
```

This drops `'unsafe-eval'` (Next 14 dev mode needs it but production doesn't), tightens connect-src for Stripe, adds `base-uri`/`form-action`/`object-src` hardening. Test in dev (some HMR features rely on `unsafe-eval`; if dev breaks, gate the directive on `envConfig.NODE_ENV`).

Phase two — switch to per-request nonces:

```ts
import { randomBytes } from "crypto";
const nonce = randomBytes(16).toString("base64");
response.headers.set(
  "Content-Security-Policy",
  `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' 'nonce-${nonce}'; ...`,
);
response.headers.set("x-nonce", nonce);
```

…and read the nonce in layouts/scripts via `headers().get("x-nonce")`. This is a 1-2 day effort; the directive drop above is the immediate win.

---

## H3 — Remove deprecated `X-XSS-Protection`

`middleware.ts:49`:

```diff
-  response.headers.set("X-XSS-Protection", "1; mode=block");
+  // X-XSS-Protection is deprecated and can introduce vulnerabilities on legacy
+  // browsers; modern browsers ignore it. Explicitly disabled.
+  response.headers.set("X-XSS-Protection", "0");
```

---

## H6 — Delete the dead stub at `/api/internal/test`

```bash
rm app/api/internal/test/route.ts
```

If you want a real health probe gated by the orchestration secret, add a `runtime` check or expose the existing `/api/health/route.ts` instead.

---

## H7 — Timing-safe internal-secret comparison in middleware

`middleware.ts:119-127`. After the new `lib/api/secrets.ts` is in place:

```diff
+import { isAuthorizedInternalRequest } from "@/lib/api/secrets";
...
-  if (isInternalApi(pathname)) {
-    const secret = request.headers.get("x-orchestration-secret");
-    if (secret !== envConfig.ORCHESTRATION_SECRET) {
-      return applySecurityHeaders(
-        NextResponse.json({ error: "Forbidden", code: "FORBIDDEN", status: 403 }, { status: 403 }),
-      );
-    }
-    return applySecurityHeaders(response);
-  }
+  if (isInternalApi(pathname)) {
+    if (!isAuthorizedInternalRequest(request.headers, envConfig.ORCHESTRATION_SECRET)) {
+      return applySecurityHeaders(
+        NextResponse.json({ error: "Forbidden", code: "FORBIDDEN", status: 403 }, { status: 403 }),
+      );
+    }
+    return applySecurityHeaders(response);
+  }
```

Apply the same in:

- `app/api/internal/threat-refresh/route.ts` — replace `authorizeCron` body with `isAuthorizedInternalRequest(request.headers, envConfig.ORCHESTRATION_SECRET)`.
- `app/api/internal/route.ts` — same.

`app/api/internal/assessment-cypher/route.ts` already uses timing-safe compare (this session); migrate it to the shared helper for consistency:

```diff
-import { timingSafeEqual } from "crypto";
...
-function constantTimeEquals(candidate: string, secret: string): boolean { ... }
-function authorize(request: NextRequest): boolean { ... }
+import { isAuthorizedInternalRequest } from "@/lib/api/secrets";

 export async function POST(request: NextRequest) {
-  if (!authorize(request)) {
+  if (!isAuthorizedInternalRequest(request.headers, envConfig.ORCHESTRATION_SECRET)) {
     return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
   }
```

---

## H8 — `logAudit` failures should surface

`middleware.ts:66-75`:

```diff
 async function logAudit(action: string, details: Record<string, unknown>) {
   const db = createAdminSupabaseClient();
-  await db.from("audit_log" as never).insert(
-    {
-      table_name: "middleware",
-      action,
-      changed_data: details,
-    } as never,
-  );
+  try {
+    const { error } = await db.from("audit_log" as never).insert({
+      table_name: "middleware",
+      action,
+      changed_data: details,
+    } as never);
+    if (error) {
+      console.error("middleware_audit_log_failed", { action, reason: error.message });
+    }
+  } catch (err: unknown) {
+    console.error("middleware_audit_log_failed", {
+      action,
+      reason: err instanceof Error ? err.message : "unknown",
+    });
+  }
 }
```

Then turn the two `void logAudit(...)` calls into `await logAudit(...)` — the cost is one DB write before returning the rate-limit response.

---

## H9 — Verify admin gates on remaining mutating routes

This was unverified due to the sandbox issue. Spot-check each of these and apply C1's pattern where appropriate:

- `app/api/v1/notifications/send/route.ts` — admin-only if it sends org-wide.
- `app/api/v1/assessments/organizations/[orgId]/reassess/route.ts` — admin-only (forces re-assessment).
- `app/api/v1/assessments/organizations/[orgId]/risks/route.ts` — admin-only if mutating org risk catalogue.
- `app/api/v1/account/route.ts` — user-scoped (no admin), but confirm it only mutates `auth.uid()`'s row.

---

## M1 — Don't leak Stripe signature internals

`app/api/v1/billing/webhook/route.ts:24-27`:

```diff
     } catch (sigError: unknown) {
-      const message = sigError instanceof Error ? sigError.message : "Invalid signature";
-      return apiError(`Stripe signature verification failed: ${message}`, ERROR_CODES.FORBIDDEN, 400);
+      console.error("stripe_webhook_signature_failed", {
+        reason: sigError instanceof Error ? sigError.message : "unknown",
+      });
+      return apiError("Forbidden", ERROR_CODES.FORBIDDEN, 403);
     }
```

Also tighten the catch-all at the bottom of the same file the same way.

---

## M2 — Contact-form IP source

`app/api/v1/contact/route.ts:28-35`. On Vercel, the real client IP is available via `request.ip` or the platform-injected `x-real-ip`. Don't trust the first segment of `x-forwarded-for` unconditionally — it's user-controlled if your upstream proxy doesn't strip it.

```ts
function getClientIp(request: NextRequest): string {
  // Vercel's `x-real-ip` is injected by their edge and not user-controllable.
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  // Fall back to the right-most forwarded entry only if you trust your proxy
  // count. Document the trusted proxy count if you change this.
  return "unknown";
}
```

---

## M7 — Add `headers()` to `next.config.mjs`

Middleware doesn't run on static assets (Next pre-rendered HTML, `/_next/static/*`). Mirror the headers there too:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
```

Leave CSP out of the static `headers()` — it lives in middleware where the nonce is per-request.

---

## M8 — Pin Node engine

`package.json`:

```diff
   "private": true,
+  "engines": {
+    "node": ">=20.0.0 <23.0.0"
+  },
   "scripts": {
```

---

## M9 — `vercel.json` hardening

```diff
 {
+  "regions": ["syd1"],
   "crons": [
     {
       "path": "/api/internal/threat-refresh",
       "schedule": "0 2 * * 2,5"
     }
   ]
 }
```

(Pick the region that matches your customer base. `syd1` if AU-only.)

---

## L2 — License field

`package.json`:

```diff
   "private": true,
+  "license": "UNLICENSED",
```

---

## L3 — Untracked files in working tree

Run from repo root and decide each:

```bash
git status --short
```

Either `git add` (intentional new files from this session: agents/* SQL introspections, `scripts/resetOnboardingForEmail.ts`, `tests/orchestration/threatSeverity.test.ts`, etc.) or add to `.gitignore` (`stitch_output/`, `test-results/`, anything platform-generated).

---

## Verification checklist

After applying:

```bash
npm install          # for Next + Upstash deps
npm run build        # smoke
npx tsc --noEmit     # type
npx jest             # 24+ tests should still pass
npm audit            # 0 high / 0 critical
```

Manual sanity:

- Hit `POST /api/v1/threat-readiness/<orgId>/refresh` as a non-admin member → expect 403.
- Send a test Stripe webhook → expect 200 and subscription update.
- Hit any `/api/v1/*` route 101 times in a minute as one user → expect 429 from the 101st.
- DELETE an organisation in dev → confirm `audit_log` rows survive with `organization_id = NULL`.
- Right-click the assessment screen → confirm "Chat with Cypher" menu (no regression from Agent 17 work).

---

## Effort summary

| Block | Files touched | Est. time |
|---|---|---|
| C1 admin wiring | ~8 routes | 1 hour |
| C2 rate limit | middleware + new helper | 2-4 hours |
| C3 Next upgrade | package.json | 30 min + smoke |
| C4 webhook exempt | middleware (5 lines) | 5 min |
| H1 env discipline | 5 files | 30 min |
| H2 CSP tighten | middleware | 30 min |
| H3 X-XSS removal | middleware | 2 min |
| H6 delete stub | rm file | 1 min |
| H7 timing-safe | middleware + 3 internal routes | 15 min |
| H8 logAudit await | middleware | 5 min |
| H9 verify | 4 routes | 30 min |
| M1 webhook error | 1 file | 5 min |
| M2 contact IP | 1 file | 10 min |
| M7 next.config | 1 file | 5 min |
| M8/M9/L2 hygiene | 2 files | 10 min |
| **Total** | | **~6-8 hours** |

The 6 CRITICALs are 4-6 hours alone; the rest is mostly minutes-each.
