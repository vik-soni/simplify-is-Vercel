#!/usr/bin/env python3
"""Sync Agents 16–18 progress to Notion 8-Week Beta Build Tracker (May 2026).

Requires NOTION_API_KEY (load from notion_integration/.env or export).

Usage:
  export NOTION_API_KEY='ntn_...'
  python3 scripts/notion_sync_may15_2026.py
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
        "Set NOTION_API_KEY (e.g. from notion_integration/.env).\n"
        "export NOTION_API_KEY='ntn_…' && python3 scripts/notion_sync_may15_2026.py",
        file=sys.stderr,
    )
    sys.exit(1)

HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

NEW_DONE_ROWS: list[dict[str, str]] = [
    {
        "Task": "Agent 16: Industry threat multipliers + clarification + export + 70/30 UI (May 2026)",
        "Week": "Week 5",
        "Owner": "Claude Code",
        "Track": "Engineering",
        "Notes": "20260509000001_agent16 · threatSeverity.ts · ThreatClarificationModal · CSV export · vercel crons",
    },
    {
        "Task": "Agent 17: Cypher assessment integration + maturity score tables (May 2026)",
        "Week": "Week 5",
        "Owner": "Claude Code",
        "Track": "Engineering",
        "Notes": "20260514000001_agent17 · assessmentCypherHandler · subdomain recap/confirm APIs",
    },
    {
        "Task": "Agent 18: Assessment data wiring + consolidated questions + snapshots (May 2026)",
        "Week": "Week 6",
        "Owner": "Claude Code",
        "Track": "Engineering",
        "Notes": "20260515000001_agent18 · generate_consolidated_questions.ts · 898 controls · 16k mappings",
    },
    {
        "Task": "Nine framework executive dashboards + framework-charts (May 2026)",
        "Week": "Week 5",
        "Owner": "Claude Code",
        "Track": "Design",
        "Notes": "FrameworkExecutiveDashboard · docs/framework-dashboards/ · Feedback §21",
    },
    {
        "Task": "Website feedback tracker 08May — all 12 workstreams complete",
        "Week": "Week 4",
        "Owner": "Claude Code",
        "Track": "Design",
        "Notes": "docs/Feedback - 08May.md — onboarding, threat readiness, frameworks, layout, org settings",
    },
]

MARK_DONE: list[str] = [
    "Wire usePostLogin to live assessment + threat APIs (remove mock warning)",
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
    by_title = {row_title(r): r for r in rows if row_title(r)}

    print("\n--- Mark Done ---")
    for title in MARK_DONE:
        row = by_title.get(title)
        if not row:
            print(f"  SKIP (not found): {title!r}")
            continue
        _patch(
            f"/pages/{row['id']}",
            {"properties": {"Status": {"status": {"name": "Done"}}}},
        )
        print(f"  Done: {title[:85]}")

    print("\n--- New rows ---")
    existing = set(by_title.keys())
    for rowdef in NEW_DONE_ROWS:
        if rowdef["Task"] in existing:
            print(f"  SKIP (exists): {rowdef['Task'][:70]}…")
            continue
        _post(
            "/pages",
            {"parent": {"database_id": db_id}, "properties": build_new_row_properties(rowdef)},
        )
        print(f"  Created: {rowdef['Task'][:80]}…")

    print(
        "\nOK — tracker: "
        f"https://www.notion.so/{TRACKER_PAGE_ID.replace('-', '')}"
    )


if __name__ == "__main__":
    main()
