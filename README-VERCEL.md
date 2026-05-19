# Simplify IS — Vercel showcase

Static marketing and auth UI preview for [simplify.is](https://simplify.is). Post-login app surfaces, APIs, and database integrations are removed. Login and sign-up submit actions are intentionally no-ops.

## Deploy

```bash
npm ci
npm run build
```

Set these in Vercel:

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://simplify.is` |
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender (e.g. `notifications@simplify.is`) |
| `VIK_ALERT_EMAIL` | `vik@simplify.is` |

Login and sign-up CTAs open a **coming soon** modal with a waitlist form. Submissions email `VIK_ALERT_EMAIL`.

## Routes

- Marketing: `/`, `/how-it-works`, `/frameworks`, `/pricing`, `/maturity-model`, `/meet-cypher`, `/terms`, `/privacy`
- Auth (display only): `/login`, `/signup`
