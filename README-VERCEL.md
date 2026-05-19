# Simplify IS — Vercel showcase

Static marketing and auth UI preview for [simplify.is](https://simplify.is). Post-login app surfaces are removed. Login/sign-up CTAs open a **coming soon** modal with a waitlist form.

## Waitlist → your inbox (Resend)

Submissions call `POST /api/v1/waitlist` and email **`VIK_ALERT_EMAIL`** via [Resend](https://resend.com).

### Local setup

1. Copy env (or reuse keys from `vik-so-dev/.env.local`):

```bash
cp .env.example .env.local
# Edit .env.local — set RESEND_API_KEY, RESEND_FROM_EMAIL, VIK_ALERT_EMAIL
```

2. Run the app and smoke-test email:

```bash
npm run dev
# in another terminal (uses http://localhost:3000 by default):
WAITLIST_TEST_URL=http://localhost:3001/api/v1/waitlist npm run test:waitlist-email
# or if dev is on 3000:
npm run test:waitlist-email
```

You should receive an email at `vik@simplify.is` with subject like  
`Simplify IS waitlist — Waitlist Test @ Simplify IS Smoke Test`.

### Vercel (production)

In **Vercel → Project → Settings → Environment Variables**, add for **Production** (and Preview if you want):

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://simplify.is` |
| `RESEND_API_KEY` | `re_…` (from [Resend API Keys](https://resend.com/api-keys)) |
| `RESEND_FROM_EMAIL` | `noreply@vik.so` (must be a verified sender/domain in Resend) |
| `VIK_ALERT_EMAIL` | `vik@simplify.is` |

Redeploy after saving. Without these, the form returns *“Waitlist is temporarily unavailable”*.

**Note:** `simplify-is/.env.local` currently has empty `RESEND_*` vars. The showcase repo can use the same keys as `vik-so-dev` (`noreply@vik.so` is already verified there).

## Deploy

```bash
npm ci
npm run build
```

## Routes

- Marketing: `/`, `/how-it-works`, `/frameworks`, `/pricing`, `/maturity-model`, `/meet-cypher`, `/terms`, `/privacy`
- Coming soon: `/login`, `/signup` (full-page waitlist; nav CTAs use modal)
