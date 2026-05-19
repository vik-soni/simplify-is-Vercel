# Simplify.is Source of Truth + Specs Consolidation (As of 2026-05-07)

This file consolidates the `docs` folder into one canonical briefing for a fresh Claude context.

## 1) Canonical Document Hierarchy

Use this precedence order when conflicts appear:

1. `docs/SOURCE_OF_TRUTH.md` (current-state operational truth)
2. `docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md` + `docs/UI_UX_FEEDBACK_REMEDIATION.md` (locked UI/UX decisions + implementation details)
3. `docs/CLAUDE_CODE_ACTION_LIST.md` + `docs/8 Week plan update.md` (execution status and tactical fixes)
4. `docs/CLAUDE_CODE_NOTION_TRACKING_INSTRUCTIONS.md` (8-week planning system and database model)
5. `docs/SPEC.md` and older master/session docs (foundational but partially superseded)

## 2) Product/Architecture Baseline

- Product goal: AI-powered compliance/risk platform with guided assessment, scoring, dashboarding, and assistant-led workflow.
- Core technical stack: Next.js app + Supabase data/auth + Claude orchestration + API layer for controlled interactions.
- Functional pillars:
  - Onboarding and organisation setup
  - Assessment question flow and answer persistence
  - Scoring and maturity/risk views
  - Post-login dashboards and progress surfaces
  - Threat readiness and tech stack discovery extensions
  - Export/reporting, QA harness, and production hardening

## 3) Current Reality (Done vs Incomplete)

## Done / mostly done
- Major UI surfaces are implemented and significantly refined.
- Onboarding has endpoint coverage and flow-level integration.
- Auth scaffolding is in place, with MFA path partially represented.
- Threat readiness capability exists with architecture and prompts.

## Incomplete / deferred
- Security hardening has explicit carry-over tasks (rate limiting, CSRF, secrets checks, signed URL policy).
- Some onboarding/user state remains client-mocked.
- Live API wiring and visualization depth remain incomplete in certain dashboards.
- Test automation depth and full e2e/constitutional loops are still maturing.

## 4) Cross-Doc Conflicts You Must Handle In-Chat

- Pricing strategy differs by document generation date (single-tier launch vs multi-tier framing).
- Framework count in scope differs (2 vs expanded set).
- Onboarding step model and shell composition differ across waves.
- Historical docs may show older design tokens and layout assumptions.
- Some diagnostics report earlier empty/stub state that later handoffs supersede.

Operational rule: default to latest explicit state in `SOURCE_OF_TRUTH.md`, then confirm against latest wave handoffs.

## 5) Spec-Level Intent That Still Matters

- Assistant behavior quality and consistency remain central product moat.
- Assessment outputs must be explainable and auditable.
- Multi-tenant data isolation and security posture are non-negotiable.
- UX should remain decisive, calm, and operator-focused, not “generic SaaS”.

## 6) Docs Reviewed (Complete Set in `docs`)

- `SPEC.md`
- `SOURCE_OF_TRUTH.md`
- `SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md`
- `UI_UX_FEEDBACK_REMEDIATION.md`
- `PRODUCT_REVIEW_NEXT_EVOLUTION.md`
- `8 Week plan update.md`
- `CLAUDE_CODE_NOTION_TRACKING_INSTRUCTIONS.md`
- `CLAUDE_CODE_ACTION_LIST.md`
- `HANDOFF_11_ROUND2_BACKEND.md`
- `HANDOFF_10_POSTLOGIN_CURSOR.md`
- `HANDOFF_10_POSTLOGIN_CLAUDE_CODE.md`
- `SIMPLIFY_IS_MASTER_CONTEXT.md`
- `SIMPLIFY_IS_HANDOFF - agents and Part 1-4.md`
- `Part 5 - new features and roadmap.md`
- `CHAT_CONTINUITY_SUMMARY.md`
- `SIMPLIFY_IS_SESSION_SUMMARY_COMPLETE.md`
- `SIMPLIFY_IS_FRAMEWORKS_AND_TESTING_HARNESS.md`
- `SESSION_SUMMARY_THREAT_READINESS.md`
- `CYPHER_ENGINE_STATE_CHECK.md`
- `SIGNAL_SECURITY_VAULT_INSTRUCTIONS.md` (external/adjacent stream; keep scoped carefully)
- `HANDOFF_7B_VISUAL_REBUILD.md`
- `CLAUDE_CODE_REBUILD_FROM_DESIGNS.md`
- `Agent7_FULL_SESSION.md`
- `CHAT_CONTEXT_Agent7_UIUXPlanning.md`
- `UI_UX_EXPORT.md`

## 7) How to Use This File in a New Claude Chat

- Treat this as the governing “context map”.
- Then load:
  1) `01_AGENTS_MASTER_HANDOFF.md` for execution history/debt
  2) `03_NOTION_AND_8_WEEK_EXECUTION_PLAN.md` for immediate delivery sequencing
  3) `04_CLAUDE_NEW_CHAT_BOOTSTRAP.md` for the exact kickoff prompt
