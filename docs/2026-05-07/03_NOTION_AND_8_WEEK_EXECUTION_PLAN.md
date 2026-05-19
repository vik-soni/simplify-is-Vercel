# Simplify.is Notion + 8-Week Execution Plan (As of 2026-05-08)

This file consolidates all available Notion-linked planning and the `8 Week plan update.md` into one execution document for “what’s next”.

## 1) Notion Sources and IDs Found

- Tracker page id: `34f9e9b1def78173830ad188dd2055fa`
- Tracker database id: `34f9e9b1-def7-81be-b4be-e216ce227944`
- Parent guide id: `3179e9b1-def7-81a1-87c1-f462b297ce28`
- Referenced bridge page: [notion.so/34e9e9b1def78151a70cecfad3c069fd](https://notion.so/34e9e9b1def78151a70cecfad3c069fd)

Source docs:
- `docs/CLAUDE_CODE_ACTION_LIST.md`
- `docs/CLAUDE_CODE_NOTION_TRACKING_INSTRUCTIONS.md`
- `docs/SOURCE_OF_TRUTH.md`
- `docs/PRODUCT_REVIEW_NEXT_EVOLUTION.md`

## 2) Live Notion Fetch Status (Important)

- **2026-05-08:** Tracker updated via API (`scripts/notion_sync_8week_may2026.py`). Set `NOTION_API_KEY` and run the script to repeat.
- **Row count:** 110 tasks (two retro rows added for Agent 11 + Agent 15 May 2026 deliverables).
- **Information architecture alignment:** Tasks that referred to the **Risk View** tab were renamed to **Threat Readiness** (the Risk View nav item is removed; Threat Readiness is the replacement). Rows marked **Done** where the Threat Readiness vertical slice + live APIs superseded the old Risk View wiring tasks. The Week 5 right-click row is now titled `Wire right-click on Threat Readiness (Cypher context menu; Week 5 scope)` and remains **Not started** until Cypher rail work ships.
- **Feedback cross-check:** `docs/Feedback - 08May.md` is fully checked off for QA/UX; the Notion database still tracks *engineering backlog* items separately (e.g. `usePostLogin` mock stripping is still Notion-open until hooks call real APIs).

If you want live status in a future run, add `NOTION_API_KEY` to the environment and run `python3 scripts/notion_sync_8week_may2026.py` or `signal-social-agent/scripts/dump_tracker_state.py`.

## 3) Immediate Tactical Work (From `8 Week plan update.md`)

Day 1 tasks explicitly listed:

- Fix Risk View Stage 1 no-button bug.
- Fix `INDUSTRY_METRICS_V2` leftover label.
- Fix footer routes (`/legal/*` -> `/terms`, `/privacy`, remove `/cookies`).
- Delete dev auth endpoints:
  - `/api/v1/auth/dev-confirm`
  - `/api/v1/auth/dev-set-password`
- Re-enable email verification gate in `/api/v1/auth/login`.
- Create `assessment_questions` table + seed migration scaffolding.
- Replace `AssessmentQuestionFlow.tsx` stub with real question reader.
- Wire `/api/v1/assessment/answer` to real Supabase persistence.
- Generate first-pass questions: 6 questions x 3 starter domains.

Day 1 notes captured:
- `ContactUsModal.tsx` token mismatch (`text-error` vs configured token set).
- `/api/v1/risks/answer` still placeholder/TBD.
- Seeded domains currently NIST CSF-only subset; ISO/APRA not seeded yet.

## 4) Notion-Tracked Progress Snapshot (Repo-Synced)

From `CLAUDE_CODE_ACTION_LIST.md`:
- 14 parallel-safe tasks were completed and marked Done in Notion in the 2026-04-29 session.
- Reported tracker distribution at that time:
  - Total tasks: 108
  - Vik-owned open: 30
  - Claude done before session: 9
  - Claude done in session: 14
  - Claude open and parallel-safe: 40
  - Claude open but blocked on Vik: 15

## 5) Week-by-Week “What’s Next” (Merged)

## Week 3 priority
- Seed top risks for new organisations.
- Implement real scoring (`scoreControl.ts`) including domain/framework aggregation.
- Expand and refine assessment content coverage.

## Week 4 priority
- Replace mocks with live API wiring for framework/risk/industry/progress views.
- Implement visualizations (NIST radar, ISO stacked bar).
- Add robust observability (Sentry + structured logs).

## Week 5 priority
- Deliver Cypher workspace interactions:
  - context menu
  - right-click wiring across key views
  - streaming responses
  - persistent cross-page state
- Complete onboarding tightening and design-token consistency migration.

## Week 6 priority
- PDF export pipeline and endpoint wiring.
- Integration + Playwright E2E coverage for full user journey.
- MFA completion, performance optimization, and quality passes.

## Week 7 priority
- Performance and RLS isolation re-validation.
- Security audit rerun and remediation.
- Final product polish.

## Week 8 priority
- Staging deployment and smoke tests.
- Beta tester onboarding assets and runbook.
- Feedback channel setup.

## 6) Blocked-on-Vik Items (High Leverage)

- Domain briefs and content review loops (ISO/NIST question generation).
- Cypher voice examples and constitutional principles.
- Staging domain and release readiness decisions.
- Final tester pack and operations runbook.

These items directly unblock multiple engineering/QA tasks in Weeks 3-8.

## 7) Recommended Next-Step Sequence (Practical)

1. Close all Day 1 tactical fixes from `8 Week plan update.md`.
2. Remove remaining security blockers (rate limit, CSRF, MFA resend, secrets verification).
3. Replace remaining frontend/user-state mocks with DB-backed state.
4. Execute Week 3 scoring + risk seeding.
5. Move immediately into Week 4 live-wiring and observability.

## 8) Use in New Claude Chat

- Ask Claude to treat this file as current execution backlog.
- Have Claude cross-check each item against code and mark:
  - already done
  - in progress
  - missing
  - blocked (with reason)
