# New Claude Chat Bootstrap (Paste This)

Use this in a brand-new Claude chat to continue execution without losing context.

```md
You are continuing the Simplify.is build from a prepared handoff snapshot dated 2026-05-07.

First read these files in order:
1) docs/2026-05-07/02_PROJECT_SOURCE_OF_TRUTH_AND_SPECS.md
2) docs/2026-05-07/01_AGENTS_MASTER_HANDOFF.md
3) docs/2026-05-07/03_NOTION_AND_8_WEEK_EXECUTION_PLAN.md

Then do the following in order:

A) Reconcile truth vs code
- Validate each listed "done" item in code.
- Identify mismatches where docs say done but code is incomplete.
- Identify unresolved contradictions and pick one canonical direction per conflict.

B) Produce a strict execution board
- Buckets: P0 (ship blockers), P1 (this week), P2 (next).
- For each task: path(s), exact API/schema/component touched, acceptance test.

C) Start implementation with no shortcuts
- Prioritize P0 security/integration blockers first:
  - CSRF real wiring
  - MFA resend endpoint
  - rate limiter migration from memory to Redis/Upstash
  - signed URL expiry policy verification
  - remove/migrate any remaining onboarding/user-state mocks

D) Verify every implemented task
- Run lint/type checks and relevant tests.
- Report only objective completion with file-by-file evidence.

Important constraints:
- Do not trust older docs if they conflict with source-of-truth hierarchy.
- Raise explicit questions only when a decision cannot be inferred from latest docs.
- Keep outputs concise and execution-focused.
```

## Optional Prompt Add-on (If You Want Weekly Focus)

```md
For this session, only execute "Week 3 + Day 1 carry-over" from docs/2026-05-07/03_NOTION_AND_8_WEEK_EXECUTION_PLAN.md.
Defer Week 4+ tasks unless they are required dependencies.
```

## Notes

- This bootstrap expects the new chat to work directly in the existing `simplify-is` repo.
- Notion live API status was not available in this environment at handoff time (no local Notion token configured), so repo-synced tracker docs are the baseline.
