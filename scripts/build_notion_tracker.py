"""Create the Simplify IS '8-Week Beta Build Tracker' Notion page.

Executes per docs/CLAUDE_CODE_NOTION_TRACKING_INSTRUCTIONS.md:
  - Child page under parent 3179e9b1-def7-81a1-87c1-f462b297ce28
  - Intro callout + how-to-use callout
  - Inline Build Tracker database (9 properties, Blocks self-relation)
  - ~95 task rows populated across Weeks 1-8
  - Dependency linking via Blocks relation (pass 2)
  - 8 H2 week sections + autonomous testing harness section
"""

import os
import sys
import time
import json
import requests

# ── Config ────────────────────────────────────────────────────────────────────

NOTION_API_KEY = os.getenv("NOTION_API_KEY", "")
if not NOTION_API_KEY:
    sys.exit(
        "Set NOTION_API_KEY in the environment (never commit secrets). "
        "Example: export NOTION_API_KEY='…' && python scripts/build_notion_tracker.py"
    )
PARENT_PAGE_ID = "3179e9b1-def7-81a1-87c1-f462b297ce28"
BASE = "https://api.notion.com/v1"
HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

PAGE_TITLE = "🎯 8-Week Beta Build Tracker — 28 Apr to 27 Jun 2026"
PAGE_ICON = "🎯"

INTRO_CALLOUT = (
    "This page tracks every task between 28 April 2026 and 27 June 2026. "
    "Beta launch target: Friday 27 June 2026 — staging URL handed to two non-security tech-exec testers before Vik travels. "
    "Maintained by Vik + Claude Code. Update statuses as work moves; do not delete rows once Done."
)

SISTER_DOCS = [
    "docs/SOURCE_OF_TRUTH.md — current state of the build",
    "docs/PRODUCT_REVIEW_NEXT_EVOLUTION.md — page-by-page audit (26 Apr 2026)",
    "docs/SIMPLIFY_IS_UIUX_MASTER_DECISIONS.md — every locked UI/UX decision",
    "simplify-is-roadmap-print.pdf — strategic 24-month roadmap",
]

# ── Block builders ───────────────────────────────────────────────────────────

def rt(text, bold=False, italic=False, code=False, color=None):
    obj = {"type": "text", "text": {"content": text}}
    ann = {}
    if bold: ann["bold"] = True
    if italic: ann["italic"] = True
    if code: ann["code"] = True
    if color: ann["color"] = color
    if ann: obj["annotations"] = ann
    return obj

def h1(text):  return {"type":"heading_1","heading_1":{"rich_text":[rt(text, bold=True)]}}
def h2(text):  return {"type":"heading_2","heading_2":{"rich_text":[rt(text)]}}
def h3(text):  return {"type":"heading_3","heading_3":{"rich_text":[rt(text)]}}
def p(*parts): return {"type":"paragraph","paragraph":{"rich_text":list(parts)}}
def bl(*parts):return {"type":"bulleted_list_item","bulleted_list_item":{"rich_text":list(parts)}}
def nl(*parts):return {"type":"numbered_list_item","numbered_list_item":{"rich_text":list(parts)}}
def div():     return {"type":"divider","divider":{}}
def callout(text, emoji="💡", color="gray_background"):
    return {"type":"callout","callout":{
        "rich_text":[rt(text)], "icon":{"type":"emoji","emoji":emoji}, "color":color
    }}
def callout_rich(rich, emoji="💡", color="gray_background"):
    return {"type":"callout","callout":{
        "rich_text":rich, "icon":{"type":"emoji","emoji":emoji}, "color":color
    }}

# ── Notion API helpers ───────────────────────────────────────────────────────

def post(path, payload):
    r = requests.post(f"{BASE}{path}", headers=HEADERS, json=payload)
    if not r.ok:
        print(f"ERROR POST {path}: {r.status_code}")
        print(r.text[:1000])
        sys.exit(1)
    return r.json()

def patch(path, payload):
    r = requests.patch(f"{BASE}{path}", headers=HEADERS, json=payload)
    if not r.ok:
        print(f"ERROR PATCH {path}: {r.status_code}")
        print(r.text[:1000])
        sys.exit(1)
    return r.json()

# ── Step 1: create the page ──────────────────────────────────────────────────

def make_intro_blocks():
    intro_rich = [rt(INTRO_CALLOUT)]
    sister_lines = [bl(rt("Sister documents (do not duplicate, link):", bold=True))]
    sister_lines += [bl(rt(s)) for s in SISTER_DOCS]
    sister_lines.append(bl(rt("Last refreshed: 28 Apr 2026.", italic=True)))

    how_to = (
        "HOW TO USE THIS PAGE — WEEKLY RHYTHM\n\n"
        "Every Monday morning:\n"
        "  1. Open View A (This Week). Update its filter to the current week.\n"
        "  2. Scan View B (Blocks Next Week). Anything red here is your priority.\n"
        "  3. Scan View C (Parallel-safe Backlog). If Claude Code is ahead, pull one forward.\n\n"
        "During the week:\n"
        "  • Move tasks: Not started → In progress → In review → Done.\n"
        "  • If something blocks, set Status = Blocked AND link the blocking row in 'Blocks'.\n"
        "  • Add Notes if the context changes (one line, no essays).\n\n"
        "Every Friday evening:\n"
        "  • Anything still Not started in this week's view → either Done by Sunday, or it slips. "
        "Update the Week column to next week and add a note explaining why.\n"
        "  • Check the deliverable in the week section against what's actually shipped. Be honest.\n\n"
        "Never:\n"
        "  • Delete rows. Move them to Done or to a future week.\n"
        "  • Mark Done unless it's verified working — In review is the right state for 'I think it's done'."
    )

    views_note = (
        "Notion API limitation: the three views (This Week / Blocks Next Week / Parallel-safe Backlog) "
        "must be added manually inside Notion the first time. Configurations are documented in "
        "docs/CLAUDE_CODE_NOTION_TRACKING_INSTRUCTIONS.md §2.3."
    )

    return [
        callout(INTRO_CALLOUT, emoji="🎯", color="blue_background"),
        *sister_lines,
        div(),
        callout(how_to, emoji="🗓", color="yellow_background"),
        callout(views_note, emoji="ℹ️", color="gray_background"),
        div(),
        h2("0 · Build Tracker"),
        p(rt("The single source of truth for every task between 28 Apr and 27 Jun 2026. "
             "Filter by Week, group by Owner, link Blocks for dependencies.")),
    ]

print("→ Creating page under Simplify IS parent…")
page = post("/pages", {
    "parent": {"type": "page_id", "page_id": PARENT_PAGE_ID},
    "icon": {"type": "emoji", "emoji": PAGE_ICON},
    "properties": {
        "title": {"title": [{"type":"text","text":{"content": PAGE_TITLE}}]}
    },
    "children": make_intro_blocks(),
})
PAGE_ID = page["id"]
print(f"  ✅ Page created: {PAGE_ID}")
print(f"  URL: {page.get('url')}")

# ── Step 2: create the inline database (without self-relation; we patch it after) ─

DB_PROPS = {
    "Task":          {"title": {}},
    "Status":        {"status": {}},  # Notion auto-provides default Not started/In progress/Done. We add custom in pass 2 if needed.
    "Week":          {"select": {"options": [
        {"name":"Week 1","color":"gray"},
        {"name":"Week 2","color":"brown"},
        {"name":"Week 3","color":"orange"},
        {"name":"Week 4","color":"yellow"},
        {"name":"Week 5","color":"green"},
        {"name":"Week 6","color":"blue"},
        {"name":"Week 7","color":"purple"},
        {"name":"Week 8","color":"red"},
    ]}},
    "Owner":         {"select": {"options": [
        {"name":"Vik","color":"orange"},
        {"name":"Claude Code","color":"blue"},
    ]}},
    "Track":         {"select": {"options": [
        {"name":"Content","color":"purple"},
        {"name":"Engineering","color":"blue"},
        {"name":"QA","color":"green"},
        {"name":"Design","color":"pink"},
        {"name":"Infra","color":"gray"},
        {"name":"Decision","color":"yellow"},
    ]}},
    "Critical path": {"checkbox": {}},
    "Parallel-safe": {"checkbox": {}},
    "Notes":         {"rich_text": {}},
}

print("→ Creating Build Tracker database…")
db = post("/databases", {
    "parent": {"type": "page_id", "page_id": PAGE_ID},
    "is_inline": True,
    "title": [{"type":"text","text":{"content":"Build Tracker"}}],
    "properties": DB_PROPS,
})
DB_ID = db["id"]
print(f"  ✅ Database created: {DB_ID}")

# Add self-referential Blocks relation (must be added after the DB exists)
print("→ Adding 'Blocks' self-relation…")
patch(f"/databases/{DB_ID}", {
    "properties": {
        "Blocks": {
            "relation": {
                "database_id": DB_ID,
                "type": "dual_property",
                "dual_property": {}  # auto-generates "Blocks" + reciprocal "Related to … (Blocks)" — we'll rename
            }
        }
    }
})
print("  ✅ Blocks relation added.")

# ── Step 3: dataset ──────────────────────────────────────────────────────────

# Each task: (Title, Week, Owner, Track, Critical, Parallel, [Blocks-by-title], Notes)
TASKS = [
    # ── Week 1 ───────────────────────────────────────────────────────────────
    ("Rotate ANTHROPIC_API_KEY in Anthropic + Vercel", "Week 1", "Vik", "Infra", True, False, [], "Was committed to .env.local. Rotate first."),
    ("Rotate SUPABASE_SERVICE_KEY in Supabase + Vercel", "Week 1", "Vik", "Infra", True, False, [], "Same exposure."),
    ("Rotate ORCHESTRATION_SECRET in Vercel", "Week 1", "Vik", "Infra", True, False, [], "Min 32 chars."),
    ("Add .env.local to .gitignore + add detect-secrets pre-commit hook", "Week 1", "Claude Code", "Infra", True, True,
     ["Rotate ANTHROPIC_API_KEY in Anthropic + Vercel",
      "Rotate SUPABASE_SERVICE_KEY in Supabase + Vercel",
      "Rotate ORCHESTRATION_SECRET in Vercel"], "One-time hardening."),
    ("Audit-readiness — answer the 8 framing questions", "Week 1", "Vik", "Decision", True, False, [], "30–45 min. Drives the design doc next week."),
    ("Pick 3 starter domains (Access Control, Incident Mgmt, Vendor Risk) and write briefs", "Week 1", "Vik", "Content", True, False, [], "~15 min × 3 = 45 min."),
    ("Generate first-pass 6 questions × 3 starter domains", "Week 1", "Claude Code", "Content", True, False,
     ["Pick 3 starter domains (Access Control, Incident Mgmt, Vendor Risk) and write briefs"], "Vik reviews same session."),
    ("Wire /api/v1/assessment/answer to real Supabase persistence", "Week 1", "Claude Code", "Engineering", True, True, [], "Replaces the stub returning {ok:true,stubbed:true}."),
    ("Replace AssessmentQuestionFlow.tsx (44-line stub) with real question reader", "Week 1", "Claude Code", "Engineering", True, True,
     ["Wire /api/v1/assessment/answer to real Supabase persistence"], "Reads from assessment_questions table."),
    ("Create assessment_questions table + seed migration scaffolding", "Week 1", "Claude Code", "Engineering", True, True, [], "Schema needs to match Vik's question structure."),
    ("Re-enable email verification gate in /api/v1/auth/login", "Week 1", "Claude Code", "Infra", True, True, [], "Removes TEMP bypass."),
    ("Delete /api/v1/auth/dev-confirm + /api/v1/auth/dev-set-password", "Week 1", "Claude Code", "Infra", True, True,
     ["Re-enable email verification gate in /api/v1/auth/login"], "Sweep TEMP routes before launch."),
    ("Fix footer routes (/legal/* → /terms, /privacy, drop /cookies)", "Week 1", "Claude Code", "Engineering", False, True, [], "P0 from Product Review §1.2."),
    ("Fix INDUSTRY_METRICS_V2 leftover label", "Week 1", "Claude Code", "Engineering", False, True, [], "R2.3.3 — flagged but still shipped."),
    ("Fix Risk View Stage 1 No-button bug (RiskWorkspace.tsx:22)", "Week 1", "Claude Code", "Engineering", False, True, [], "Both Yes/No advance to Stage 2 — broken."),

    # ── Week 2 ───────────────────────────────────────────────────────────────
    ("Write briefs for ISO domains 4–10 (7 domains)", "Week 2", "Vik", "Content", True, False, [], "Tue/Wed/Thu evenings."),
    ("Generate first-pass questions for ISO domains 4–10", "Week 2", "Claude Code", "Content", True, False,
     ["Write briefs for ISO domains 4–10 (7 domains)"], "Bulk pass — review same session."),
    ("Vik reviews + iterates ISO domains 4–10 questions", "Week 2", "Vik", "Content", True, False,
     ["Generate first-pass questions for ISO domains 4–10"], "Annotate, request rewrites."),
    ("Write briefs for ISO domains 11–17 (7 domains)", "Week 2", "Vik", "Content", True, False, [], "Weekend session."),
    ("Generate first-pass questions for ISO domains 11–17", "Week 2", "Claude Code", "Content", True, False,
     ["Write briefs for ISO domains 11–17 (7 domains)"], ""),
    ("Vik reviews + iterates ISO domains 11–17 questions", "Week 2", "Vik", "Content", True, False,
     ["Generate first-pass questions for ISO domains 11–17"], ""),
    ("Write briefs for ISO domains 18–21 (4 domains)", "Week 2", "Vik", "Content", True, False, [], "Sunday evening."),
    ("Generate first-pass questions for ISO domains 18–21", "Week 2", "Claude Code", "Content", True, False,
     ["Write briefs for ISO domains 18–21 (4 domains)"], ""),
    ("Build POST /api/v1/onboarding/consultant-name", "Week 2", "Claude Code", "Engineering", True, True, [], "Persists users.agent_name."),
    ("Build POST /api/v1/onboarding/organisation", "Week 2", "Claude Code", "Engineering", True, True, [], "Persists organisations.* (create-or-update)."),
    ("Build POST /api/v1/onboarding/frameworks", "Week 2", "Claude Code", "Engineering", True, True, [], "Persists organisations.selected_frameworks."),
    ("Build POST /api/v1/onboarding/complete", "Week 2", "Claude Code", "Engineering", True, True, [], "Sets onboarding_completed_at."),
    ("Build GET /api/v1/onboarding/state", "Week 2", "Claude Code", "Engineering", True, True, [], "Hydrates UI on mount."),
    ("Add organizations columns: onboarding_step, onboarding_completed_at, industry, countries (jsonb), workforce_scale, selected_frameworks (jsonb)",
     "Week 2", "Claude Code", "Engineering", True, True, [], "Migration."),
    ("Wire onboarding UI Steps 1–4 to real /onboarding/* endpoints", "Week 2", "Claude Code", "Engineering", True, False,
     ["Build POST /api/v1/onboarding/consultant-name",
      "Build POST /api/v1/onboarding/organisation",
      "Build POST /api/v1/onboarding/frameworks",
      "Build POST /api/v1/onboarding/complete",
      "Build GET /api/v1/onboarding/state"], "Drops sessionStorage-only state."),
    ("Audit-readiness design doc — Claude Code drafts from Vik's answers", "Week 2", "Claude Code", "Decision", True, False,
     ["Audit-readiness — answer the 8 framing questions"], "Drafts from Week 1 answers."),
    ("Vik reviews audit-readiness doc, refines voice + judgement", "Week 2", "Vik", "Decision", True, False,
     ["Audit-readiness design doc — Claude Code drafts from Vik's answers"], "Editing pass, not writing."),

    # ── Week 3 ───────────────────────────────────────────────────────────────
    ("Final ISO question polish across all 21 domains", "Week 3", "Vik", "Content", True, False,
     ["Vik reviews + iterates ISO domains 18–21 questions" if False else "Generate first-pass questions for ISO domains 18–21"],
     "Coherence pass — does the corpus feel like one consultant?"),
    ("Seed assessment_questions table with all 126 ISO questions", "Week 3", "Claude Code", "Content", True, False,
     ["Final ISO question polish across all 21 domains"], "Production data."),
    ("Write briefs for first 10 NIST CSF 2.0 functions/categories", "Week 3", "Vik", "Content", True, False, [], "NIST is structured differently — 6 functions × subcategories."),
    ("Generate first-pass questions for first 10 NIST groupings", "Week 3", "Claude Code", "Content", True, False,
     ["Write briefs for first 10 NIST CSF 2.0 functions/categories"], ""),
    ("Implement orchestration/scoring/scoreControl.ts (real CMMI)", "Week 3", "Claude Code", "Engineering", True, True, [],
     "SIGNAL_WEIGHTS = {high:1.0, med:0.7, low:0.4, planned:0.0}; OVERDUE_PENALTY = 0.20."),
    ("Implement domain-level scoring (only when ALL controls in domain complete)", "Week 3", "Claude Code", "Engineering", True, False,
     ["Implement orchestration/scoring/scoreControl.ts (real CMMI)"], "Per spec. Never per-answer."),
    ("Implement framework-level scoring (weighted average of domains)", "Week 3", "Claude Code", "Engineering", True, False,
     ["Implement domain-level scoring (only when ALL controls in domain complete)"], ""),
    ("Seed top_risks → organisation_risks for new org (7 risks)", "Week 3", "Claude Code", "Engineering", True, True, [], "Auto-seed on org creation."),
    ("Vik writes Cypher voice + signal extraction rules (5–6 worked examples)", "Week 3", "Vik", "Content", True, False, [], "Persona, contradiction handling, N.A. probing."),
    ("Refine 9 Cypher orchestration prompts using Vik's voice examples", "Week 3", "Claude Code", "Engineering", True, False,
     ["Vik writes Cypher voice + signal extraction rules (5–6 worked examples)"], "Prompts in /orchestration/prompts/."),
    ("Add /api/health endpoint (Supabase + Anthropic + Stripe reachability)", "Week 3", "Claude Code", "Infra", False, True, [], "Vercel cron pings every 5 min."),
    ("Verify Stripe webhook signature validation", "Week 3", "Claude Code", "Infra", False, True, [], "P0 from §5.1."),

    # ── Week 4 ───────────────────────────────────────────────────────────────
    ("Finish remaining NIST domain briefs", "Week 4", "Vik", "Content", True, False,
     ["Generate first-pass questions for first 10 NIST groupings"], ""),
    ("Generate + review remaining NIST questions", "Week 4", "Claude Code", "Content", True, False,
     ["Finish remaining NIST domain briefs"], ""),
    ("Seed assessment_questions table with all NIST questions", "Week 4", "Claude Code", "Content", True, False,
     ["Generate + review remaining NIST questions"], ""),
    ("Wire useIndustryDashboard to live API (drop mockResult)", "Week 4", "Claude Code", "Engineering", True, False,
     ["Implement framework-level scoring (weighted average of domains)"], ""),
    ("Wire useFrameworkView to live API", "Week 4", "Claude Code", "Engineering", True, False,
     ["Implement framework-level scoring (weighted average of domains)"], ""),
    ("Wire useRiskWorkspace to live API", "Week 4", "Claude Code", "Engineering", True, False,
     ["Seed top_risks → organisation_risks for new org (7 risks)"], ""),
    ("Wire useMaturityRoadmap to live API", "Week 4", "Claude Code", "Engineering", True, False,
     ["Implement framework-level scoring (weighted average of domains)"], ""),
    ("Wire useProgressMilestones to live API", "Week 4", "Claude Code", "Engineering", True, False,
     ["Implement framework-level scoring (weighted average of domains)"], ""),
    ("Implement NIST radar visualisation (Framework View)", "Week 4", "Claude Code", "Engineering", True, False,
     ["Wire useFrameworkView to live API"], "Per Vik's spec — NIST radar required."),
    ("Implement ISO stacked-bar visualisation (Framework View)", "Week 4", "Claude Code", "Engineering", True, False,
     ["Wire useFrameworkView to live API"], "Per Vik's spec — ISO bars required."),
    ("Implement Risk View Stage 2 priority groups + per-risk control mapping", "Week 4", "Claude Code", "Engineering", True, False,
     ["Wire useRiskWorkspace to live API"], "Master Decisions §28.5.c."),
    ("Implement Maturity Roadmap real action lists (Maintain / Uplift / Industry Shifts)", "Week 4", "Claude Code", "Engineering", True, False,
     ["Wire useMaturityRoadmap to live API"], "Replaces 'Filtered action list placeholder'."),
    ("Implement Progress & Milestones (Timeline / Comparison / Milestones)", "Week 4", "Claude Code", "Engineering", True, False,
     ["Wire useProgressMilestones to live API"], "Replaces 3 placeholder strings."),
    ("Build autonomous test agent harness (separate Anthropic API agent probing Cypher)", "Week 4", "Claude Code", "QA", True, True, [], "Constitutional AI / AutoResearch pattern. See §5."),
    ("Define 8 constitutional principles for Cypher evaluation", "Week 4", "Vik", "QA", True, False, [],
     "E.g. 'cite org knowledge naturally', 'detect contradictions with humility', 'never confuse ISO with NIST IDs'."),
    ("Run first batch (50 simulated assessments) through autonomous tester", "Week 4", "Claude Code", "QA", True, False,
     ["Build autonomous test agent harness (separate Anthropic API agent probing Cypher)",
      "Define 8 constitutional principles for Cypher evaluation"], "Adversarial + happy-path mix."),
    ("Vik reviews autonomous test report + flags improvements", "Week 4", "Vik", "QA", True, False,
     ["Run first batch (50 simulated assessments) through autonomous tester"], "Plain-English summary."),
    ("Drop NEXT_PUBLIC_USE_MOCKS flag", "Week 4", "Claude Code", "Engineering", False, False,
     ["Wire useIndustryDashboard to live API (drop mockResult)",
      "Wire useFrameworkView to live API",
      "Wire useRiskWorkspace to live API",
      "Wire useMaturityRoadmap to live API",
      "Wire useProgressMilestones to live API"], "Once all hooks are live."),
    ("Add Sentry + structured logging (every API route + Claude call)", "Week 4", "Claude Code", "Infra", False, True, [], "BetterStack/Logtail for structured logs."),

    # ── Week 5 ───────────────────────────────────────────────────────────────
    ("Convert FloatingCypherButton + CypherChatModal → CypherRail (desktop)", "Week 5", "Claude Code", "Engineering", True, False,
     ["Run first batch (50 simulated assessments) through autonomous tester"], "Persistent right-side panel."),
    ("Implement cross-page state for CypherRail (Zustand or React Context)", "Week 5", "Claude Code", "Engineering", True, False,
     ["Convert FloatingCypherButton + CypherChatModal → CypherRail (desktop)"],
     "'Awareness' not 'omniscience' — track current page + last-clicked element."),
    ("Build CypherContextMenu component (right-click handler + popup)", "Week 5", "Claude Code", "Engineering", True, True, [], "Generic — reused across element types."),
    ("Wire right-click on Industry Dashboard maturity scores", "Week 5", "Claude Code", "Engineering", True, False,
     ["Build CypherContextMenu component (right-click handler + popup)",
      "Implement cross-page state for CypherRail (Zustand or React Context)"], "Pre-loads context: score, domain, current maturity."),
    ("Wire right-click on Framework View controls", "Week 5", "Claude Code", "Engineering", True, False,
     ["Build CypherContextMenu component (right-click handler + popup)",
      "Implement cross-page state for CypherRail (Zustand or React Context)"], "Pre-loads context: control_id, framework, answer history."),
    ("Wire right-click on Risk View risks", "Week 5", "Claude Code", "Engineering", True, False,
     ["Build CypherContextMenu component (right-click handler + popup)",
      "Implement cross-page state for CypherRail (Zustand or React Context)"], "Pre-loads context: risk_id, mitigations, mapped controls."),
    ("Add inline 'Discuss with Cypher' expandable below each assessment question", "Week 5", "Claude Code", "Engineering", True, False,
     ["Convert FloatingCypherButton + CypherChatModal → CypherRail (desktop)"], "Single source of truth — same conversation as the rail."),
    ("Implement streaming responses (SSE from /api/internal/* → CypherRail)", "Week 5", "Claude Code", "Engineering", True, False,
     ["Convert FloatingCypherButton + CypherChatModal → CypherRail (desktop)"], "Token-by-token rendering."),
    ("Mobile fallback: keep FloatingCypherButton on mobile breakpoints", "Week 5", "Claude Code", "Engineering", False, True, [], "Don't try to fit a rail on mobile."),
    ("Inline 'Signal captured' UI confirmation in chat", "Week 5", "Claude Code", "Engineering", True, False,
     ["Add inline 'Discuss with Cypher' expandable below each assessment question"], "Visible signal extraction."),
    ("Vik QAs Cypher voice + interaction quality (test conversations)", "Week 5", "Vik", "QA", True, False,
     ["Inline 'Signal captured' UI confirmation in chat"], "2–3 hours of structured probing."),
    ("Run second batch (50 simulated assessments — adversarial focus)", "Week 5", "Claude Code", "QA", True, False,
     ["Inline 'Signal captured' UI confirmation in chat"], "Should show measurable improvement vs first batch."),
    ("Migration: consolidate /admin/* and /organisation/* design tokens to M3", "Week 5", "Claude Code", "Design", False, True, [], "Product Review §9.3 — visual two-system split."),
    ("Onboarding tightening (Step 1 hint, Step 2 signup backfill, Step 3 always-visible checkbox, Step 4 sidebar mirror)", "Week 5", "Claude Code", "Engineering", False, True,
     ["Wire onboarding UI Steps 1–4 to real /onboarding/* endpoints"], "Round 2 carry-over."),

    # ── Week 6 ───────────────────────────────────────────────────────────────
    ("Build PDF export — internal checklist mode (Puppeteer or react-pdf)", "Week 6", "Claude Code", "Engineering", True, False,
     ["Implement framework-level scoring (weighted average of domains)"], "Executive summary deferred post-beta."),
    ("Wire PDF export to /api/v1/assessments/sessions/[id]/export", "Week 6", "Claude Code", "Engineering", True, False,
     ["Build PDF export — internal checklist mode (Puppeteer or react-pdf)"], "7-day Supabase Storage signed link."),
    ("Integration tests: session create → response submit → score update → dashboard refresh", "Week 6", "Claude Code", "QA", True, False,
     ["Wire useIndustryDashboard to live API (drop mockResult)"], "Jest + supertest."),
    ("Playwright E2E: signup → onboarding → assessment 5 questions → domain complete → score → dashboard → Cypher interaction → PDF",
     "Week 6", "Claude Code", "QA", True, False,
     ["Wire PDF export to /api/v1/assessments/sessions/[id]/export"], "The headline E2E test."),
    ("Vik runs the E2E manually (the 'be a customer' pass)", "Week 6", "Vik", "QA", True, False,
     ["Playwright E2E: signup → onboarding → assessment 5 questions → domain complete → score → dashboard → Cypher interaction → PDF"], "Two full passes — desktop + tablet."),
    ("Run third autonomous test batch (refined principles)", "Week 6", "Claude Code", "QA", True, False,
     ["Run second batch (50 simulated assessments — adversarial focus)"], "Compare to first/second batch."),
    ("Vik reviews third batch + locks Cypher voice", "Week 6", "Vik", "QA", True, False,
     ["Run third autonomous test batch (refined principles)"], "Final voice sign-off."),
    ("Lighthouse pass on every authenticated page", "Week 6", "Claude Code", "QA", False, True, [], "≥90 across the board."),
    ("Bundle analysis + lazy-load heavy components", "Week 6", "Claude Code", "Engineering", False, True, [], "D3 / framer-motion / recharts lazy."),
    ("Light-mode QA pass on dashboards", "Week 6", "Vik", "QA", False, False,
     ["Vik runs the E2E manually (the 'be a customer' pass)"], "If post-login dark-only, skip."),
    ("MFA full enrolment flow (QR + recovery codes)", "Week 6", "Claude Code", "Engineering", False, True, [], "Currently MFA is verify-only."),

    # ── Week 7 ───────────────────────────────────────────────────────────────
    ("Run security audit script + fix anything new", "Week 7", "Claude Code", "Infra", True, False, [], "npm run security:audit."),
    ("Cross-tenant RLS isolation re-test (manual)", "Week 7", "Claude Code", "QA", True, False,
     ["Run security audit script + fix anything new"], "Two test orgs, verify nothing leaks."),
    ("Australian English sweep (global string check)", "Week 7", "Claude Code", "Content", False, True, [], "Per Master Decisions."),
    ("Polish error pages (403/404/503) — match not-found.tsx quality", "Week 7", "Claude Code", "Design", False, True, [], "Product Review §1.6."),
    ("Add prompt canary in Cypher's system prompt", "Week 7", "Claude Code", "Infra", False, True, [], "Tagged sentence that should never appear in user output — alarms on prompt-injection."),
    ("Pin @anthropic-ai/sdk + @supabase/supabase-js to exact versions", "Week 7", "Claude Code", "Infra", False, True, [], "Supply-chain hardening."),
    ("Vik QA — full test as a brand-new user (fresh email, no shortcuts)", "Week 7", "Vik", "QA", True, False, [], "Catches anything seeded data hides."),
    ("Audit-trail page polish", "Week 7", "Claude Code", "Design", False, True, [], "Migrated to M3 in Week 5; polish here."),
    ("Performance re-test (300 concurrent simulated users)", "Week 7", "Claude Code", "QA", False, True, [], "Cheap load test before staging."),
    ("Final Vik review of audit-readiness doc", "Week 7", "Vik", "Decision", False, False,
     ["Vik reviews audit-readiness doc, refines voice + judgement"], "Lock for beta."),

    # ── Week 8 ───────────────────────────────────────────────────────────────
    ("Configure private staging domain", "Week 8", "Vik", "Infra", True, False, [], "Not searchable."),
    ("Deploy to staging (full env var sweep)", "Week 8", "Claude Code", "Infra", True, False,
     ["Configure private staging domain", "Run security audit script + fix anything new"], "Production-shaped."),
    ("Smoke test on staging (signup → assessment → score → PDF → Cypher)", "Week 8", "Claude Code", "QA", True, False,
     ["Deploy to staging (full env var sweep)"], "Same as E2E but on real infra."),
    ("Vik smoke-tests staging as a fresh user", "Week 8", "Vik", "QA", True, False,
     ["Smoke test on staging (signup → assessment → score → PDF → Cypher)"], "One more pair of eyes."),
    ("Create two beta tester accounts", "Week 8", "Vik", "Decision", True, False,
     ["Vik smoke-tests staging as a fresh user"], "Real names, real orgs."),
    ("Write tester welcome packet (what to test, what to ignore, how to give feedback)", "Week 8", "Vik", "Content", True, False, [], "Plain-language. ~1 page."),
    ("Set up feedback channel (email alias or Notion form)", "Week 8", "Vik", "Infra", True, False, [], "Single inbox, not scattered."),
    ("Hand over staging link + welcome packet to testers", "Week 8", "Vik", "Decision", True, False,
     ["Create two beta tester accounts", "Write tester welcome packet (what to test, what to ignore, how to give feedback)"], "Friday 27 Jun."),
    ("Final autonomous test batch on staging (sanity check)", "Week 8", "Claude Code", "QA", False, False,
     ["Deploy to staging (full env var sweep)"], "Last signal that nothing regressed."),
    ("Document the 'if it breaks while I'm away' runbook", "Week 8", "Vik", "Decision", False, False, [], "Short list — common failure modes + Claude Code triage instructions."),
]

print(f"→ Inserting {len(TASKS)} tasks (pass 1: no relations)…")

# Map: title → page_id
title_to_id = {}
ambiguous_blocks = []  # tasks where we guessed at the dependency

def make_status_select(name):
    # Status options are managed by Notion automatically when first used.
    return {"name": name}

for idx, (title, week, owner, track, crit, par, _blocks, notes) in enumerate(TASKS, 1):
    payload = {
        "parent": {"database_id": DB_ID},
        "properties": {
            "Task":          {"title":[{"type":"text","text":{"content": title}}]},
            "Status":        {"status": {"name":"Not started"}},
            "Week":          {"select": {"name": week}},
            "Owner":         {"select": {"name": owner}},
            "Track":         {"select": {"name": track}},
            "Critical path": {"checkbox": crit},
            "Parallel-safe": {"checkbox": par},
        },
    }
    if notes:
        payload["properties"]["Notes"] = {"rich_text":[{"type":"text","text":{"content": notes}}]}
    r = post("/pages", payload)
    title_to_id[title] = r["id"]
    if idx % 10 == 0:
        print(f"  · inserted {idx}/{len(TASKS)}")
    time.sleep(0.05)  # gentle pacing

print(f"  ✅ Inserted {len(title_to_id)} task rows.")

# ── Step 4: link Blocks dependencies ─────────────────────────────────────────

print("→ Linking Blocks dependencies (pass 2)…")
linked = 0
unresolved = []
for title, week, owner, track, crit, par, blocks, notes in TASKS:
    if not blocks:
        continue
    related_ids = []
    for bt in blocks:
        if bt in title_to_id:
            related_ids.append({"id": title_to_id[bt]})
        else:
            unresolved.append((title, bt))
    if not related_ids:
        continue
    patch(f"/pages/{title_to_id[title]}", {
        "properties": {
            "Blocks": {"relation": related_ids}
        }
    })
    linked += 1
    time.sleep(0.05)

print(f"  ✅ Linked {linked} rows with Blocks relations.")
if unresolved:
    print(f"  ⚠️  {len(unresolved)} unresolved block-by titles:")
    for t, bt in unresolved:
        print(f"     - {t!r} blocked by missing {bt!r}")

# ── Step 5: append week sections + autonomous testing harness section ────────

WEEKS = [
    ("Week 1 (28 Apr – 4 May) — Theme: Unblock + first content",
     "Secrets rotated, email verification gate live in code, audit-readiness questions drafted, three domain briefs written, assessment flow stub replaced with a real-question reader.",
     ["Vik can only commit Tue/Wed of this week (~6 hrs). Anything beyond that slips into Week 2."]),
    ("Week 2 (5–11 May) — Theme: Question corpus sprint + onboarding persistence",
     "All 21 ISO domains have briefs written; ~75% of ISO questions generated and reviewed; onboarding persists to Supabase (Steps 1–4).",
     ["Vik must hit 6–8 hrs this week — if briefs slip, the whole question generation pipeline stalls.",
      "Tightest week of the project for Vik."]),
    ("Week 3 (12–18 May) — Theme: Finish question corpus + scoring engine",
     "All 126 ISO questions locked. NIST briefing started. Real scoreControl.ts shipped. Risk library (7 risks) seeded. Cypher voice rules drafted.",
     ["Scoring algorithm is non-trivial — scoreControl.ts has been a skeleton for weeks.",
      "If it goes deeper than expected, NIST work spills into Week 4."]),
    ("Week 4 (19–25 May) — Theme: Real data wiring + autonomous testing setup",
     "All usePostLogin hooks live (no mocks). Industry Dashboard reads real scores. Autonomous test agent harness running and producing first batch of results. NIST corpus 50% done.",
     ["This is the highest Claude Code output week.",
      "If real-data wiring uncovers schema bugs, autonomous testing slips.",
      "Autonomous testing must start by Wed 21 May or Week 5 UI work loses its safety net."]),
    ("Week 5 (26 May – 1 Jun) — Theme: Cypher as the workspace (Option C)",
     "Persistent Cypher right-rail across all authenticated pages (desktop). Right-click → Ask Cypher on core elements. Inline Cypher chat in assessment flow. Streaming responses. Mobile defers to floating button.",
     ["Most architecturally complex week.",
      "State management for the persistent rail (cross-page context) is the highest-risk task.",
      "If the rail's state hydration breaks, fall back to a non-persistent rail and ship right-click + inline only."]),
    ("Week 6 (2–8 Jun) — Theme: PDF export + integration tests + Cypher polish",
     "Internal-checklist PDF generated from real session data. End-to-end integration tests pass. Playwright E2E covers signup → assessment → score → Cypher interaction → PDF. Third autonomous test batch shows further improvement.",
     ["PDF generation has a history of being underestimated.",
      "If Puppeteer/react-pdf misbehaves on Vercel, allocate Week 7 buffer."]),
    ("Week 7 (9–15 Jun) — Theme: Pre-launch hardening + content polish",
     "Production logging fully wired. Security audit re-run with zero criticals. Error pages polished. All copy QA'd in Australian English. Autonomous testing passes its acceptance criteria.",
     ["Buffer week.",
      "If Weeks 5–6 slipped, this absorbs the slip.",
      "If everything's on track, use it for polish, not new features."]),
    ("Week 8 (16–22 Jun) — Theme: Staging deploy + tester handoff",
     "Staging URL live on private domain. Two beta tester accounts created. Welcome packet sent. Vik travels with confidence.",
     ["First production-shaped deploy.",
      "Allow 2 days for the unexpected (env var mismatches, Vercel build quirks, Supabase RLS edge cases)."]),
]

def week_blocks():
    out = [div(), h2("1 · Week-by-week narrative")]
    for i, (header, deliverable, risks) in enumerate(WEEKS, 1):
        out.append(h3(header))
        out.append(p(rt("Theme + deliverable. ", bold=True), rt(deliverable)))
        out.append(p(rt("Risk flags:", bold=True)))
        for r in risks:
            out.append(bl(rt(r)))
    return out

# Autonomous testing harness section
HARNESS_INTRO = (
    "Reference: Andrej Karpathy's AutoResearch — agents probing other agents, generating test data, "
    "scoring outputs against a constitution, iterating. Build in Week 4."
)
HARNESS_BUILD = [
    "Loads N org archetypes (e.g. healthcare startup, mid-size financial services, SaaS scale-up). Five archetypes is enough to start.",
    "For each archetype, spins up a simulated user agent using a separate Anthropic API key (or the same key with a budget cap).",
    "The simulated user signs up, runs through onboarding, starts an assessment, and answers Cypher's questions in character — sometimes correctly, sometimes evasively, sometimes contradicting earlier answers.",
    "Cypher's responses (every message, every signal extracted, every score change) are logged to a structured JSONL file (test-runs/{timestamp}/transcript.jsonl).",
    "After each session, a judge agent evaluates the transcript against the 8 constitutional principles (defined by Vik in Week 4).",
    "The judge produces a per-principle score (0–10) and a plain-English summary of where Cypher fell short.",
    "A consolidated report is written to test-runs/{timestamp}/report.md — what improved, what regressed, specific failure modes to fix.",
]
HARNESS_FEEDBACK = [
    "Vik reviews the report after each batch.",
    "Failure modes get logged as new tasks in the Week 5 / Week 6 backlog (in this same database).",
    "Cypher prompts get refined based on the worst-performing principles.",
    "Judge's evaluation criteria get tightened too — first batch teaches you what 'good' looks like.",
]
HARNESS_DEFER = [
    "Real-time monitoring of production Cypher conversations against the same principles.",
    "Public dashboard showing Cypher's quality score over time.",
    "Letting users see the principles Cypher is being evaluated against (transparency play).",
]

def harness_blocks():
    out = [div(), h2("2 · Autonomous testing harness — Week 4 reference")]
    out.append(callout(HARNESS_INTRO, emoji="🧪", color="purple_background"))
    out.append(h3("2.1 What you are building (scripts/qa/autonomousTest.ts)"))
    for s in HARNESS_BUILD:
        out.append(bl(rt(s)))
    out.append(h3("2.2 Cost ceiling"))
    out.append(p(rt("Vik's budget guidance: ", italic=False), rt("$100–150 of Anthropic API spend", bold=True),
                 rt(" for the full Phase 1 validation (~150 simulated assessments across the three batches). "
                    "Hard cap the script — no surprises.")))
    out.append(h3("2.3 What gets fed back"))
    for s in HARNESS_FEEDBACK:
        out.append(bl(rt(s)))
    out.append(p(rt("This is the Constitutional AI improvement loop in miniature, and it scales without adding human review hours.", italic=True)))
    out.append(h3("2.4 What to defer post-beta"))
    for s in HARNESS_DEFER:
        out.append(bl(rt(s)))
    return out

def acceptance_blocks():
    out = [div(), h2("3 · Acceptance — what 'page is done' means")]
    out.append(p(rt("When Vik opens this page, he should answer in 30 seconds:")))
    for q in [
        "What am I doing this week?",
        "What is Claude Code doing this week?",
        "What's blocked?",
        "What blocks next week?",
        "What's parallel-safe?",
    ]:
        out.append(bl(rt(q)))
    return out

print("→ Appending week sections + harness + acceptance blocks…")
trailing = week_blocks() + harness_blocks() + acceptance_blocks()

# Notion limit: 100 blocks per request — chunk if needed
CHUNK = 90
appended = 0
while appended < len(trailing):
    chunk = trailing[appended:appended + CHUNK]
    patch(f"/blocks/{PAGE_ID}/children", {"children": chunk})
    appended += len(chunk)
    print(f"  · appended {appended}/{len(trailing)} blocks")

print("\n────────────────────────────────────────")
print(f"✅ DONE")
print(f"Page URL: {page.get('url')}")
print(f"Page ID:  {PAGE_ID}")
print(f"DB ID:    {DB_ID}")
print(f"Tasks:    {len(title_to_id)}")
print(f"Linked:   {linked}")
if unresolved:
    print(f"⚠️  Unresolved blocked-by titles: {len(unresolved)}")
    for t, bt in unresolved:
        print(f"     - {t} blocked by missing {bt}")

# Per-week sanity counts
from collections import Counter
vik_counts = Counter()
cc_counts = Counter()
for (_t, w, o, *_rest) in TASKS:
    if o == "Vik":
        vik_counts[w] += 1
    else:
        cc_counts[w] += 1
print("\nPer-week task load (Vik / Claude Code):")
for w in [f"Week {i}" for i in range(1, 9)]:
    print(f"  {w}: Vik={vik_counts[w]:>2}  Claude Code={cc_counts[w]:>2}")
