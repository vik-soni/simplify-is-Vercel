# Demo test accounts (simplify.is)

Both demo accounts are live on simplify.is.

---

## Account 1 — `wdata@demo.com` (full seeded data)

| Field | Value |
|--------|--------|
| **Password** | `123` |
| **Organisation** | Demo With Data Pty Ltd |
| **Frameworks** | All 9 enabled on Dashboard |
| **Orientation** | **Always replays all 5 onboarding steps on every login** (`always_replay_onboarding` + `wdata@demo.com` in `lib/onboarding/replayOnboarding.ts`) |

**Seeded data** (similar to `vsoni@outlook.com`, expanded to all frameworks):

- 346 assessment answers across all 9 frameworks (~78% of consolidated controls)
- Maturity scores: `organization_maturity_scores`, `domain_maturity_scores`, `subdomain_maturity_scores` (9 frameworks)
- 36 monthly score snapshots (4 months × 9 frameworks)
- Threat Readiness cache + tech stack profile (refresh: `node scripts/seedWdataThreatAndTech.mjs`)
- 5 organisation risks from `top_risks` templates
- Legacy `framework_scores` rows per framework

**All 9 framework slugs** (`selected_frameworks`):

- `nist_csf_2_0`
- `iso_27001_2022`
- `pci_dss_4_0`
- `apra_cps_234`
- `apra_cps_230`
- `asd_essential_eight`
- `iso_42001`
- `auva_iss`
- `nist_ai_rmf`

---

## Account 2 — `wodata@demo.com` (blank for manual testing)

| Field | Value |
|--------|--------|
| **Password** | `123` |
| **Organisation** | Demo Without Data Pty Ltd |
| **Frameworks** | All 9 enabled |
| **Orientation** | Same reset as Account 1 |
| **Data** | No assessment answers, maturity scores, threat cache, or tech stack — empty dashboards for manual assessment testing |

Same nine framework slugs as Account 1.

---

## Orientation / initialisation screens

### Server-side (on every login) — Account 1 only

- Login resets `onboarding_completed_at` and sends you to `/onboarding/step-1` through step 5.
- Completing step 4 no longer skips step 5 for this account (layout ignores completion when replay is enabled).

### Client-side (initialisation modal on Industry dashboard)

- Stored in browser `localStorage`.
- Use **incognito** or clear site data for that origin so the initialisation overlay shows again.

---

## Re-run provisioning

From repo root:

```bash
cd simplify-is && npx tsx scripts/provisionDemoAccounts.ts
```

Single account:

```bash
cd simplify-is && npx tsx scripts/provisionDemoAccounts.ts wdata@demo.com
```

**Script:** `simplify-is/scripts/provisionDemoAccounts.ts`

---

## Usage notes

- Login at [https://simplify.is](https://simplify.is) (or local dev) with either account.
- Use **Account 1** (`wdata@demo.com`) for dashboard/UI review with populated data.
- Use **Account 2** (`wodata@demo.com`) to complete assessments manually and verify backfill against the pre-seeded account.

**Reference account:** `vsoni@outlook.com` — original seeded review account; see also `scripts/seed_feedback_08may.mjs` and `scripts/resetOnboardingForEmail.ts`.
