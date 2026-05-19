"""Create the Simplify IS '20-Week Social & Funnel Calendar' page in Notion.

Places a sibling page under the same parent as the 8-Week Beta Build Tracker:
  Simplify IS — Comprehensive Guide (3179e9b1-def7-81a1-87c1-f462b297ce28)

Matches design patterns in docs/CLAUDE_CODE_NOTION_TRACKING_INSTRUCTIONS.md:
  - Title emoji, callouts, numbered sections, sister-doc links
  - Inline database as single source of truth for tick-off execution

Requires:
  export NOTION_API_KEY='ntn_…'
  python3 scripts/build_notion_social_calendar.py

After run: in Notion, add a Calendar or Board view grouped by Week or Channel,
and drag page order so this sits just under the MVP build tracker if desired (API does not control sibling order).
"""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

import requests

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from social_plan_notion_data import all_social_tasks, due_date, phase_for_week

# ── Config ───────────────────────────────────────────────────────────────────

NOTION_API_KEY = os.getenv("NOTION_API_KEY", "").strip()
if not NOTION_API_KEY:
    sys.exit(
        "Set NOTION_API_KEY in the environment (never commit secrets).\n"
        "Example: export NOTION_API_KEY='ntn_…' && python3 scripts/build_notion_social_calendar.py"
    )

PARENT_PAGE_ID = "3179e9b1-def7-81a1-87c1-f462b297ce28"
BASE = "https://api.notion.com/v1"
HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

PAGE_TITLE = "📣 20-Week Social & Funnel Calendar — May–Sep 2026"
PAGE_ICON = "📣"

ANCHOR_CALLOUT = (
    "Anchored to Week 1 = Mon 11 May 2026 through Week 20 (~late Sep 2026). "
    "This is the multi-channel audience and funnel plan (Vik.so, LinkedIn, Reddit, X, email)—not the engineering MVP tracker. "
    "Sister doc in repo: docs/Social Plan 8 May 2026.md (full prompts + metrics). "
    "Easier read: docs/Social_Plan_Reader_Summary.md. "
    "Last refreshed from script: May 2026."
)

WHAT_CALLOUT = (
    "What we are doing. Running a ~20-week, multi-channel programme so that by Simplify IS launch the market already understands "
    "the problem (reporting drag, vCISO economics, AI scope without playbooks) and the vision (an AI partner that knows the business). "
    "Vik.so carries research-grade SEO and email capture; LinkedIn carries carousels plus long-form authority; Reddit carries honest "
    "questions, AMAs, and tester recruitment; X carries builder-level candor and launch energy; email carries owned moments once the list exists."
)

WHY_CALLOUT = (
    "Why now. The 2026 datapoints in the source plan align positioning: underpriced versus vCISO alternatives, exploding AI-on-CISO remit, "
    "compliance cost pain, and the continuous-compliance aspiration gap. The work sequences category creation ahead of incumbents and builds "
    "a measurable pipeline (subscribers, saves and DMs, Reddit conversations, beta signups) instead of hoping launch week carries everything."
)

HOW_CALLOUT = (
    "How. Four phases—Foundation (weeks 1–4), Vision (5–10), Pre-launch (11–16 including book), Launch (17–20). Channel firewall stays strict "
    "on Vik.so and LinkedIn (no Simplify IS naming); candor and beta language concentrate on Reddit and X. Dependencies: content throughput, "
    "carousel craft, ESP and landing pages, book logistics mid-plan, and—late—real product readiness from the engineering tracker so beta and "
    "public promises match reality."
)

PLATFORM_LINES = [
    ("Vik.so — ", "SEO plus email list; outcome = qualified subscribers via useful downloadables; depends on capture UX and asset depth, not shipping code."),
    ("LinkedIn — ", "Reach plus credibility; carousel-first; outcome = saves, comments, DMs; depends on heavy personal editing to avoid AI-tone penalties."),
    ("Reddit — ", "Validation plus early adopters; outcome about 20–30 serious testers per strategy doc; depends on sub rules and daily thoughtful comments."),
    ("X / Twitter — ", "Builder network plus launch surface; outcome = relationships and beta announcements; depends on consistent but sustainable cadence."),
    ("Email — ", "Owned blasts for book, cohort, and product; outcome = conversion spikes; depends on list health and one primary CTA per send."),
    ("Measurement — ", "Weekly Sunday sweep per source plan; outcome = catch fatigue or channel breakage early."),
]

SISTER_DOCS = [
    "docs/Social Plan 8 May 2026.md — operator detail, prompts, weekly metrics",
    "docs/Social_Plan_Reader_Summary.md — readable synopsis",
    "docs/CLAUDE_CODE_NOTION_TRACKING_INSTRUCTIONS.md — Notion house style",
    "🎯 8-Week Beta Build Tracker — engineering sibling page (same parent)",
]

WEEK_OPTIONS = [{"name": f"Week {i}", "color": "gray"} for i in range(1, 21)]
PHASE_OPTIONS = [
    {"name": "Foundation", "color": "blue"},
    {"name": "Vision", "color": "purple"},
    {"name": "Pre-Launch", "color": "orange"},
    {"name": "Launch", "color": "red"},
]
CHANNEL_OPTIONS = [
    {"name": "Vik.so", "color": "blue"},
    {"name": "Vik.so / Downloadable", "color": "blue"},
    {"name": "LinkedIn", "color": "brown"},
    {"name": "Reddit", "color": "orange"},
    {"name": "X/Twitter", "color": "purple"},
    {"name": "Email", "color": "yellow"},
    {"name": "Measurement", "color": "gray"},
]

# ── Block helpers (match build_notion_tracker.py style) ───────────────────────


def rt(text, bold=False, italic=False):
    obj = {"type": "text", "text": {"content": text}}
    ann = {}
    if bold:
        ann["bold"] = True
    if italic:
        ann["italic"] = True
    if ann:
        obj["annotations"] = ann
    return obj


def h2(text):
    return {"type": "heading_2", "heading_2": {"rich_text": [rt(text)]}}


def p(*parts):
    return {"type": "paragraph", "paragraph": {"rich_text": list(parts)}}


def bl(*parts):
    return {"type": "bulleted_list_item", "bulleted_list_item": {"rich_text": list(parts)}}


def div():
    return {"type": "divider", "divider": {}}


def callout(text, emoji="💡", color="gray_background"):
    return {
        "type": "callout",
        "callout": {"rich_text": [rt(text)], "icon": {"type": "emoji", "emoji": emoji}, "color": color},
    }


def post(path, payload):
    r = requests.post(f"{BASE}{path}", headers=HEADERS, json=payload, timeout=120)
    if not r.ok:
        print(f"ERROR POST {path}: {r.status_code}")
        print(r.text[:2000])
        sys.exit(1)
    return r.json()


def make_opening_blocks():
    how_to = (
        "HOW TO USE THIS PAGE\n\n"
        "• Primary view: Social Calendar database — sort by Due, tick Status to Done when shipped.\n"
        "• Add a Calendar view in Notion for true day-by-day visual scheduling (Notion UI — API does not inject views).\n"
        "• Sunday: complete the Measurement row for that week plus skim channel metrics in the source plan.\n"
        "• Dependencies live in the Dependencies column and in the summary above.\n\n"
        "Never delete rows—archive or mark Done so history stays honest."
    )
    views_note = (
        "Notion API limitation: create Calendar (by Due) and Board (by Channel or Week) views manually once; "
        "this script only creates the inline database and rows."
    )
    sister_line = [bl(rt("Sister documents:", bold=True))]
    for s in SISTER_DOCS:
        sister_line.append(bl(rt(s)))

    blocks = [
        callout(ANCHOR_CALLOUT, emoji="📌", color="blue_background"),
        h2("0 · Summary — what, why, how"),
        callout(WHAT_CALLOUT, emoji="❓", color="gray_background"),
        callout(WHY_CALLOUT, emoji="⚡", color="gray_background"),
        callout(HOW_CALLOUT, emoji="🛠", color="gray_background"),
        div(),
        h2("1 · Platform outcomes & dependencies"),
        p(
            rt(
                "Each line states the channel intent, the outcome, and what must be true operationally.",
                italic=True,
            )
        ),
    ]
    for head, body in PLATFORM_LINES:
        blocks.append(bl(rt(head, bold=True), rt(body)))
    blocks.extend(
        [
            div(),
            *sister_line,
            div(),
            callout(how_to, emoji="🗓", color="yellow_background"),
            callout(views_note, emoji="ℹ️", color="gray_background"),
            div(),
            h2("2 · Social Calendar (tick-off database)"),
            p(
                rt(
                    "All deliverables from the May 2026 social plan are turned into rows below: "
                    "articles, downloadables, posts, AMAs, ongoing engagement habits, and measurement.",
                )
            ),
        ]
    )
    return blocks


# ── Main ──────────────────────────────────────────────────────────────────────


def main():
    print("→ Creating Social & Funnel page under Simplify IS parent…")
    page = post(
        "/pages",
        {
            "parent": {"type": "page_id", "page_id": PARENT_PAGE_ID},
            "icon": {"type": "emoji", "emoji": PAGE_ICON},
            "properties": {"title": {"title": [{"type": "text", "text": {"content": PAGE_TITLE}}]}},
            "children": make_opening_blocks(),
        },
    )
    page_id = page["id"]
    print(f"  ✅ Page: {page_id}\n  URL: {page.get('url')}")

    db_props = {
        "Task": {"title": {}},
        "Status": {"status": {}},
        "Due": {"date": {}},
        "Week": {"select": {"options": WEEK_OPTIONS}},
        "Phase": {"select": {"options": PHASE_OPTIONS}},
        "Channel": {"select": {"options": CHANNEL_OPTIONS}},
        "Dependencies": {"rich_text": {}},
    }

    print("→ Creating inline Social Calendar database…")
    db = post(
        "/databases",
        {
            "parent": {"type": "page_id", "page_id": page_id},
            "is_inline": True,
            "title": [{"type": "text", "text": {"content": "Social Calendar"}}],
            "properties": db_props,
        },
    )
    db_id = db["id"]
    print(f"  ✅ Database: {db_id}")

    tasks = all_social_tasks()
    print(f"→ Inserting {len(tasks)} rows…")
    for idx, t in enumerate(tasks, 1):
        d = due_date(t)
        props = {
            "Task": {"title": [{"type": "text", "text": {"content": t.title[:1990]}}]},
            "Status": {"status": {"name": "Not started"}},
            "Due": {"date": {"start": d.isoformat()}},
            "Week": {"select": {"name": f"Week {t.week}"}},
            "Phase": {"select": {"name": phase_for_week(t.week)}},
            "Channel": {"select": {"name": t.channel}},
        }
        if t.depends:
            props["Dependencies"] = {"rich_text": [{"type": "text", "text": {"content": t.depends[:1990]}}]}
        post("/pages", {"parent": {"database_id": db_id}, "properties": props})
        if idx % 25 == 0:
            print(f"  · {idx}/{len(tasks)}")
        time.sleep(0.04)

    print(f"  ✅ Done. Open the page URL above and add Calendar/Board views.")


if __name__ == "__main__":
    main()
