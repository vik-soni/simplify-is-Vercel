# Framework View — executive dashboards

Per-framework “executive snapshot” widgets for post-login **Framework View** live in `components/dashboard/FrameworkExecutiveDashboard.tsx` (client). The **Framework View** shell is `components/dashboard/FrameworkView.tsx`. Every framework includes **Month / Quarter / Year** controls, an SVG **trend** panel, a **narrative** strip, and **Cypher** prompt examples.

- **`components/dashboard/framework-charts/FrameworkTrendChart.tsx`** — line + area chart, no extra dependencies; series length varies by range.
- **`components/dashboard/framework-charts/dashboardTrendData.ts`** — dummy time series and narratives (replace with API snapshots).

## Documentation

- **Research & iteration log:** [RESEARCH.md](./RESEARCH.md) — desk notes per standard, widget intent, and documented review cycles.
- **Product checklist:** `docs/Feedback - 08May.md` §21.

## QA

- Framework View shows **all nine** product frameworks as tabs for every signed-in user (not limited to onboarding selections). Use **`vsoni@outlook.com`** for seeded review data where applicable (`scripts/seed_feedback_08may.mjs`).

## Data

Until domain scores are API-backed, dashboards use **dummy data** with shapes intended to map cleanly to future Supabase-backed props.
