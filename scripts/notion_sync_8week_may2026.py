#!/usr/bin/env python3
"""Sync May 2026 progress to the Notion 8-Week Beta Build Tracker.

Sources:
  - agents/HANDOFF_15_THREAT_READINESS.md, HANDOFF_11_ONBOARDING_REFINEMENT.md
  - docs/Feedback - 08May.md (all sections marked complete)
  - IA change: Risk View tab removed → Threat Readiness tab (Agent 15)

Requires: NOTION_API_KEY in environment (integration with Build Tracker access).

Usage:
  export NOTION_API_KEY='ntn_...'
  python3 scripts/notion_sync_8week_may2026.py
"""
from __future__ import annotations

import os
import sys
from typing import Any

import requests

TRACKER_PAGE_ID = "34f9e9b1-def7-8173-830a-d188dd2055fa"
BASE = "https://api.notion.com/v1"

NOTION_API_KEY = os.environ.get("NOTION_API_KEY", "").strip()
if not NOTION_API_KEY:
    print(
        "Set NOTION_API_KEY to update Notion (never commit tokens).\n"
        "Example: export NOTION_API_KEY='ntn_…' && python3 scripts/notion_sync_8week_may2026.py",
        file=sys.stderr,
    )
    sys.exit(1)

HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

# Exact titles as returned by Notion (see dump_tracker_state.py).
RENAMES: dict[str, str] = {
    "Wire useRiskWorkspace to live API": (
        "Threat Readiness: wire live APIs (/api/v1/threat-readiness/*, tech-stack) — replaces Risk View tab"
    ),
    "Implement Risk View Stage 2 priority groups + per-risk control mapping": (
        "Threat Readiness: priority groups, detail pane, key-control mapping — replaces Risk View Stage 2"
    ),
    "Wire right-click on Risk View risks": (
        "Wire right-click on Threat Readiness (Cypher context menu; Week 5 scope)"
    ),
}

# Mark Done (use final title after renames for rows that were renamed).
MARK_DONE: list[str] = [
    # In progress → closed (legacy bug; tab removed / Threat Readiness IA)
    "Fix Risk View Stage 1 No-button bug (RiskWorkspace.tsx:22)",
    # Agent 11 shipped (pulled from Week 5)
    "Onboarding tightening (Step 1 hint, Step 2 signup backfill, Step 3 always-visible checkbox, Step 4 sidebar mirror)",
    # Renamed rows — Agent 15 end-to-end
    "Threat Readiness: wire live APIs (/api/v1/threat-readiness/*, tech-stack) — replaces Risk View tab",
    "Threat Readiness: priority groups, detail pane, key-control mapping — replaces Risk View Stage 2",
]

# New database rows (retroactive deliverables).
NEW_DONE_ROWS: list[dict[str, Any]] = [
    {
        "Task": "Deliver Tech Stack Discovery + Threat Readiness vertical slice (Agent 15, May 2026)",
        "Week": "Week 4",
        "Owner": "Claude Code",
        "Track": "Engineering",
        "Notes": "HANDOFF_15 — DB migration, orchestration, API routes, UI tab, tests. See simplify-is/agents/HANDOFF_15_THREAT_READINESS.md",
    },
    {
        "Task": "Deliver onboarding refinement + Initialisation + frameworks/pricing marketing (Agent 11, May 2026)",
        "Week": "Week 4",
        "Owner": "Claude Code",
        "Track": "Design",
        "Notes": "HANDOFF_11 — Step 1–4, Initialisation modal, /frameworks /pricing, banners. See agents/HANDOFF_11_ONBOARDING_REFINEMENT.md",
    },
]


def _get(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    r = requests.get(f"{BASE}{path}", headers=HEADERS, params=params, timeout=30)
    if not r.ok:
        print(f"GET {path} → {r.status_code}\n{r.text[:800]}", file=sys.stderr)
        sys.exit(1)
    return r.json()


def _post(path: str, payload: dict[str, Any]) -> dict[str, Any]:
    r = requests.post(f"{BASE}{path}", headers=HEADERS, json=payload, timeout=30)
    if not r.ok:
        print(f"POST {path} → {r.status_code}\n{r.text[:800]}", file=sys.stderr)
        sys.exit(1)
    return r.json()


def _patch(path: str, payload: dict[str, Any]) -> dict[str, Any]:
    r = requests.patch(f"{BASE}{path}", headers=HEADERS, json=payload, timeout=30)
    if not r.ok:
        print(f"PATCH {path} → {r.status_code}\n{r.text[:800]}", file=sys.stderr)
        sys.exit(1)
    return r.json()


def find_inline_database(page_id: str) -> str:
    cursor: str | None = None
    while True:
        params: dict[str, Any] = {"page_size": 100}
        if cursor:
            params["start_cursor"] = cursor
        data = _get(f"/blocks/{page_id}/children", params)
        for block in data.get("results", []):
            if block.get("type") == "child_database":
                return block["id"]
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
    print("No inline database under tracker page.", file=sys.stderr)
    sys.exit(1)


def fetch_all_rows(database_id: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    cursor: str | None = None
    while True:
        payload: dict[str, Any] = {"page_size": 100}
        if cursor:
            payload["start_cursor"] = cursor
        data = _post(f"/databases/{database_id}/query", payload)
        rows.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
    return rows


def row_title(row: dict[str, Any]) -> str:
    props = row.get("properties", {})
    title_prop = props.get("Task") or {}
    items = title_prop.get("title", [])
    return "".join(seg.get("plain_text", "") for seg in items).strip()


def title_prop(content: str) -> dict[str, Any]:
    return {"title": [{"type": "text", "text": {"content": content[:2000]}}]}


def build_new_row_properties(row: dict[str, str]) -> dict[str, Any]:
    """Map our shorthand to Notion property schema (status + selects)."""
    return {
        "Task": title_prop(row["Task"]),
        "Status": {"status": {"name": "Done"}},
        "Week": {"select": {"name": row["Week"]}},
        "Owner": {"select": {"name": row["Owner"]}},
        "Track": {"select": {"name": row["Track"]}},
        "Notes": {
            "rich_text": [{"type": "text", "text": {"content": row.get("Notes", "")[:2000]}}]
        },
    }


def main() -> None:
    db_id = find_inline_database(TRACKER_PAGE_ID)
    print(f"Database: {db_id}")

    rows = fetch_all_rows(db_id)
    by_title: dict[str, dict[str, Any]] = {}
    for r in rows:
        t = row_title(r)
        if t:
            by_title[t] = r

    print("\n--- Renames ---")
    for old, new in RENAMES.items():
        row = by_title.get(old)
        if not row:
            print(f"  SKIP (not found): {old!r}")
            continue
        _patch(f"/pages/{row['id']}", {"properties": {"Task": title_prop(new)}})
        del by_title[old]
        by_title[new] = row
        print(f"  Renamed: {old[:60]}… → {new[:60]}…")

    print("\n--- Mark Done ---")
    for title in MARK_DONE:
        row = by_title.get(title)
        if not row:
            # Re-fetch if title was only in Notion before rename round
            row = next((r for r in rows if row_title(r) == title), None)
        if not row:
            print(f"  SKIP (not found): {title!r}")
            continue
        _patch(
            f"/pages/{row['id']}",
            {"properties": {"Status": {"status": {"name": "Done"}}}},
        )
        print(f"  Done: {title[:85]}{'…' if len(title) > 85 else ''}")

    print("\n--- New rows ---")
    existing_titles = set(by_title.keys()) | {row_title(r) for r in rows}
    for rowdef in NEW_DONE_ROWS:
        if rowdef["Task"] in existing_titles:
            print(f"  SKIP (already exists): {rowdef['Task'][:60]}…")
            continue
        _post(
            "/pages",
            {"parent": {"database_id": db_id}, "properties": build_new_row_properties(rowdef)},
        )
        print(f"  Created: {rowdef['Task'][:80]}…")

    print(
        "\nOK — open tracker: "
        f"https://www.notion.so/{TRACKER_PAGE_ID.replace('-', '')}"
    )


if __name__ == "__main__":
    main()
