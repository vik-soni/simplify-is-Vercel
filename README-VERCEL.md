# Simplify IS — Vercel showcase

Static marketing and auth UI preview for [simplify.is](https://simplify.is). Post-login app surfaces, APIs, and database integrations are removed. Login and sign-up submit actions are intentionally no-ops.

## Deploy

```bash
npm ci
npm run build
```

Set `NEXT_PUBLIC_APP_URL` in Vercel to your production URL (e.g. `https://simplify.is`).

## Routes

- Marketing: `/`, `/how-it-works`, `/frameworks`, `/pricing`, `/maturity-model`, `/meet-cypher`, `/terms`, `/privacy`
- Auth (display only): `/login`, `/signup`
