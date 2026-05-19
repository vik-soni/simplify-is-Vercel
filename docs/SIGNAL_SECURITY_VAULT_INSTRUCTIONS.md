# SIGNAL Security Intelligence Vault — Claude Code Execution Instructions

## Overview

This file is a complete, executable instruction set for Claude Code. Run this from the root of your `signal-social-agent` directory. It will:

1. Audit your Notion workspace and match its design language
2. Create a daily AI & Security intelligence briefing page in Notion wired into your command center
3. Build a full Obsidian security knowledge vault (Karpathy LLM Wiki pattern)
4. Extend the Signal agent dashboard with a Research Control Panel
5. Add nightly automated research jobs + manual keyword research triggers
6. Wire everything together so it runs from one interface

---

## PHASE 0 — Prerequisites & Environment Check

Before starting, verify the following are available:

```bash
# Check Python environment
python3 --version  # Need 3.10+
pip show anthropic perplexityai notion-client tweepy fastapi uvicorn

# Check environment variables present in .env
grep -E "ANTHROPIC_API_KEY|PERPLEXITY_API_KEY|NOTION_API_KEY|NOTION_PARENT_PAGE_ID" .env
```

Install any missing dependencies:

```bash
pip install notion-client feedparser arxiv requests schedule python-dotenv anthropic perplexity-sdk
```

Add the following to your `.env` if not already present:

```
NOTION_API_KEY=your_key_here
NOTION_PARENT_PAGE_ID=your_parent_page_id
NOTION_COMMAND_CENTER_ID=your_command_center_page_id
OBSIDIAN_VAULT_PATH=/path/to/your/obsidian/vault
RESEARCH_BRIEFING_HOUR=0        # midnight local time for research run
BRIEFING_COMPILE_HOUR=6         # 6am for Notion page update
RESEARCH_TOPICS=AI security,cybersecurity,LLM threats,zero trust,AI governance
```

---

## PHASE 1 — Notion Workspace Audit

### Task 1.1 — Audit existing Notion structure

Create the file `agents/notion_audit.py`:

```python
"""
Notion Workspace Auditor
Reads existing pages to extract design patterns, color schemes,
naming conventions, and block structures for style matching.
"""

import os
from notion_client import Client
from config.settings import NOTION_API_KEY, NOTION_PARENT_PAGE_ID

notion = Client(auth=NOTION_API_KEY)

def audit_workspace():
    """Audit Notion workspace and return design patterns."""
    patterns = {
        "colors": [],
        "emoji_prefixes": [],
        "section_headers": [],
        "block_types": [],
        "naming_conventions": []
    }
    
    try:
        # Get all pages under parent
        results = notion.blocks.children.list(block_id=NOTION_PARENT_PAGE_ID)
        blocks = results.get("results", [])
        
        for block in blocks:
            block_type = block.get("type", "")
            patterns["block_types"].append(block_type)
            
            # Extract heading text and emoji patterns
            if block_type in ["heading_1", "heading_2", "heading_3"]:
                rich_text = block.get(block_type, {}).get("rich_text", [])
                for rt in rich_text:
                    text = rt.get("plain_text", "")
                    # Check for emoji prefix pattern
                    if text and len(text) > 0:
                        first_char = text[0]
                        if ord(first_char) > 127:  # likely emoji
                            patterns["emoji_prefixes"].append(first_char)
                        patterns["section_headers"].append(text)
                
                # Extract color
                color = block.get(block_type, {}).get("color", "default")
                if color not in patterns["colors"]:
                    patterns["colors"].append(color)
        
        # Try to get command center page for structure reference
        if os.getenv("NOTION_COMMAND_CENTER_ID"):
            cc_blocks = notion.blocks.children.list(
                block_id=os.getenv("NOTION_COMMAND_CENTER_ID")
            )
            for block in cc_blocks.get("results", []):
                bt = block.get("type", "")
                if bt not in patterns["block_types"]:
                    patterns["block_types"].append(bt)
        
        print("✅ Notion workspace audit complete")
        print(f"   Found colors: {patterns['colors']}")
        print(f"   Found emoji prefixes: {patterns['emoji_prefixes'][:5]}")
        print(f"   Block types used: {set(patterns['block_types'])}")
        
    except Exception as e:
        print(f"⚠️  Audit partial: {e}")
        # Use sensible defaults if audit fails
        patterns["colors"] = ["default"]
        patterns["emoji_prefixes"] = ["🔐", "🤖", "📊", "⚡", "🧠"]
    
    return patterns


def get_command_center_id():
    """Find the command center page ID."""
    cc_id = os.getenv("NOTION_COMMAND_CENTER_ID")
    if cc_id:
        return cc_id
    
    # Try to find it by searching for "command center" in page titles
    try:
        results = notion.search(query="command center", filter={"property": "object", "value": "page"})
        pages = results.get("results", [])
        if pages:
            return pages[0]["id"]
    except Exception:
        pass
    
    return None


if __name__ == "__main__":
    patterns = audit_workspace()
    cc_id = get_command_center_id()
    print(f"\nCommand Center ID: {cc_id}")
```

---

## PHASE 2 — Notion Briefing Page Builder

### Task 2.1 — Create the briefing page module

Create the file `agents/notion_briefing.py`:

```python
"""
Notion Daily Security Intelligence Briefing
Creates and updates the daily AI & Security briefing page.
Matches existing Notion workspace design language.
Structure:
  - Active Stories (ongoing narratives with timelines)
  - Breaking / Urgent (time-sensitive, 48hr window)
  - Deep Dives (research, concepts, vault updates)
  - This Week's Vault Updates
"""

import os
import json
from datetime import datetime, timedelta
from notion_client import Client
from database.db import get_conn
from config.settings import NOTION_API_KEY

notion = Client(auth=NOTION_API_KEY)

BRIEFING_PAGE_TITLE = "🔐 AI & Security Intelligence Brief"
BRIEFING_DB_KEY = "notion_briefing_page_id"


def get_or_create_briefing_page(workspace_patterns: dict) -> str:
    """Get existing briefing page ID or create a new one."""
    # Check if we stored the page ID previously
    with get_conn() as conn:
        row = conn.execute(
            "SELECT content FROM brain_entries WHERE category='reference' AND title=?",
            (BRIEFING_DB_KEY,)
        ).fetchone()
        if row:
            return row["content"]
    
    # Create a new page
    parent_id = os.getenv("NOTION_PARENT_PAGE_ID")
    
    # Pick dominant color from audit (default to default)
    heading_color = workspace_patterns.get("colors", ["default"])[0]
    if heading_color not in ["default", "gray", "brown", "orange", "yellow", 
                              "green", "blue", "purple", "pink", "red"]:
        heading_color = "default"
    
    page = notion.pages.create(
        parent={"page_id": parent_id},
        properties={
            "title": {
                "title": [{"text": {"content": BRIEFING_PAGE_TITLE}}]
            }
        },
        children=_build_initial_page_structure(heading_color)
    )
    
    page_id = page["id"]
    
    # Store for future use
    with get_conn() as conn:
        conn.execute(
            """INSERT OR REPLACE INTO brain_entries 
               (category, title, content, tags) VALUES (?, ?, ?, ?)""",
            ("reference", BRIEFING_DB_KEY, page_id, "notion,briefing,system")
        )
    
    print(f"✅ Briefing page created: {page_id}")
    return page_id


def _build_initial_page_structure(color: str = "default") -> list:
    """Build the initial page block structure."""
    today = datetime.now().strftime("%A, %B %d, %Y")
    return [
        _divider(),
        _heading1(f"📡 Daily Brief — {today}", color),
        _callout("🔄 Last updated: setting up...", "gray_background"),
        _divider(),
        _heading2("🔥 Active Stories", color),
        _paragraph("Ongoing developments across AI & Security — updated daily with timeline context."),
        _divider(),
        _heading2("⚡ Breaking & Urgent", color),
        _paragraph("Time-sensitive threats, zero-days, critical advisories. Cleared after 48 hours unless escalated to Active Stories."),
        _divider(),
        _heading2("🧠 Deep Dives", color),
        _paragraph("Research papers, emerging frameworks, and one concept connecting past fundamentals to today."),
        _divider(),
        _heading2("📚 Vault Updates This Week", color),
        _paragraph("What was added or updated in your Obsidian security knowledge base."),
        _divider(),
    ]


def update_briefing_page(page_id: str, briefing_data: dict):
    """
    Full update of the briefing page with new research data.
    
    briefing_data structure:
    {
        "active_stories": [
            {
                "title": str,
                "status": str,  # e.g. "Day 5: New developments"
                "summary": str,
                "timeline": [{"date": str, "event": str}],
                "source_urls": [str]
            }
        ],
        "breaking": [
            {
                "title": str,
                "severity": str,  # HIGH / MEDIUM / LOW
                "summary": str,
                "source_url": str,
                "expires_at": str  # ISO datetime
            }
        ],
        "deep_dives": [
            {
                "title": str,
                "concept": str,
                "summary": str,
                "timeless_connection": str,
                "source_urls": [str]
            }
        ],
        "vault_updates": [
            {"page": str, "action": str, "domain": str}
        ]
    }
    """
    today = datetime.now().strftime("%A, %B %d, %Y")
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    # Clear existing content and rebuild
    # Get all existing blocks
    existing = notion.blocks.children.list(block_id=page_id)
    for block in existing.get("results", []):
        try:
            notion.blocks.delete(block_id=block["id"])
        except Exception:
            pass
    
    # Rebuild with fresh content
    new_blocks = [
        _divider(),
        _heading1(f"📡 Daily Brief — {today}"),
        _callout(f"🔄 Last updated: {now} AEST", "gray_background"),
        _divider(),
    ]
    
    # ACTIVE STORIES
    new_blocks.append(_heading2("🔥 Active Stories"))
    new_blocks.append(_paragraph("Ongoing developments — scroll through or expand to read the full timeline."))
    
    if briefing_data.get("active_stories"):
        for story in briefing_data["active_stories"]:
            new_blocks.extend(_build_active_story(story))
    else:
        new_blocks.append(_paragraph("No active stories being tracked yet. Research will populate this section."))
    
    new_blocks.append(_divider())
    
    # BREAKING / URGENT
    new_blocks.append(_heading2("⚡ Breaking & Urgent"))
    
    breaking = briefing_data.get("breaking", [])
    active_breaking = [b for b in breaking 
                      if datetime.fromisoformat(b.get("expires_at", datetime.now().isoformat())) > datetime.now()]
    
    if active_breaking:
        for item in active_breaking:
            new_blocks.extend(_build_breaking_item(item))
    else:
        new_blocks.append(_callout("✅ No urgent items at this time.", "green_background"))
    
    new_blocks.append(_divider())
    
    # DEEP DIVES
    new_blocks.append(_heading2("🧠 Deep Dives"))
    
    if briefing_data.get("deep_dives"):
        for dive in briefing_data["deep_dives"]:
            new_blocks.extend(_build_deep_dive(dive))
    else:
        new_blocks.append(_paragraph("Research topics will appear here after the first automated run."))
    
    new_blocks.append(_divider())
    
    # VAULT UPDATES
    new_blocks.append(_heading2("📚 Vault Updates This Week"))
    
    if briefing_data.get("vault_updates"):
        for update in briefing_data["vault_updates"]:
            new_blocks.append(_bullet(
                f"**{update['domain']}** — {update['page']} ({update['action']})"
            ))
    else:
        new_blocks.append(_paragraph("Vault sync will populate this after first research run."))
    
    new_blocks.append(_divider())
    
    # Append all blocks
    notion.blocks.children.append(block_id=page_id, children=new_blocks)
    print(f"✅ Briefing page updated at {now}")


def wire_to_command_center(briefing_page_id: str, cc_id: str):
    """Add a link to the briefing page in the command center."""
    if not cc_id:
        print("⚠️  No command center ID found, skipping wire-up")
        return
    
    try:
        notion.blocks.children.append(
            block_id=cc_id,
            children=[
                _heading3("🔐 Security Intelligence"),
                {
                    "type": "link_to_page",
                    "link_to_page": {"page_id": briefing_page_id}
                }
            ]
        )
        print("✅ Wired into command center")
    except Exception as e:
        print(f"⚠️  Command center wire-up failed: {e}")


# ── Block builder helpers ──────────────────────────────────────────────────

def _build_active_story(story: dict) -> list:
    blocks = []
    status = story.get("status", "")
    title = story.get("title", "Untitled Story")
    
    # Collapsible toggle block for each story
    toggle_children = []
    
    # Timeline entries
    timeline = story.get("timeline", [])
    if timeline:
        for entry in timeline[-5:]:  # last 5 entries
            toggle_children.append(_bullet(f"**{entry['date']}** — {entry['event']}"))
    
    # Summary
    summary = story.get("summary", "")
    if summary:
        toggle_children.append(_paragraph(summary))
    
    # Sources
    sources = story.get("source_urls", [])
    if sources:
        toggle_children.append(_paragraph(f"Sources: {' | '.join(sources[:3])}"))
    
    blocks.append({
        "type": "toggle",
        "toggle": {
            "rich_text": [{"type": "text", "text": {"content": f"📌 {title} — {status}"}}],
            "color": "default",
            "children": toggle_children if toggle_children else [_paragraph("No details yet.")]
        }
    })
    
    return blocks


def _build_breaking_item(item: dict) -> list:
    severity = item.get("severity", "MEDIUM")
    color_map = {"HIGH": "red_background", "MEDIUM": "orange_background", "LOW": "yellow_background"}
    color = color_map.get(severity, "orange_background")
    
    blocks = [
        _callout(
            f"[{severity}] {item['title']}\n\n{item['summary']}\n\nSource: {item.get('source_url', 'N/A')}",
            color
        )
    ]
    return blocks


def _build_deep_dive(dive: dict) -> list:
    blocks = []
    blocks.append(_heading3(f"💡 {dive['title']}"))
    blocks.append(_paragraph(dive.get("summary", "")))
    
    timeless = dive.get("timeless_connection", "")
    if timeless:
        blocks.append(_callout(f"🕰️ Timeless connection: {timeless}", "blue_background"))
    
    sources = dive.get("source_urls", [])
    if sources:
        blocks.append(_paragraph(f"Sources: {' | '.join(sources[:3])}"))
    
    return blocks


def _heading1(text: str, color: str = "default") -> dict:
    return {"type": "heading_1", "heading_1": {"rich_text": [{"type": "text", "text": {"content": text}}], "color": color}}

def _heading2(text: str, color: str = "default") -> dict:
    return {"type": "heading_2", "heading_2": {"rich_text": [{"type": "text", "text": {"content": text}}], "color": color}}

def _heading3(text: str, color: str = "default") -> dict:
    return {"type": "heading_3", "heading_3": {"rich_text": [{"type": "text", "text": {"content": text}}], "color": color}}

def _paragraph(text: str) -> dict:
    return {"type": "paragraph", "paragraph": {"rich_text": [{"type": "text", "text": {"content": text}}]}}

def _bullet(text: str) -> dict:
    return {"type": "bulleted_list_item", "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": text}}]}}

def _callout(text: str, color: str = "gray_background") -> dict:
    return {"type": "callout", "callout": {"rich_text": [{"type": "text", "text": {"content": text}}], "color": color, "icon": {"type": "emoji", "emoji": "💬"}}}

def _divider() -> dict:
    return {"type": "divider", "divider": {}}
```

---

## PHASE 3 — Obsidian Vault Skeleton

### Task 3.1 — Create vault builder script

Create the file `agents/vault_builder.py`:

```python
"""
Obsidian Security Knowledge Vault Builder
Creates the initial vault structure following Karpathy's LLM Wiki pattern.
Fourteen security domains with foundational concepts pre-seeded.
"""

import os
from pathlib import Path
from datetime import datetime

VAULT_PATH = Path(os.getenv("OBSIDIAN_VAULT_PATH", "./obsidian-vault"))

DOMAINS = {
    "00-Fundamentals": {
        "emoji": "🏛️",
        "description": "Core concepts, CIA triad, defence in depth, security principles — the timeless bedrock.",
        "concepts": [
            "CIA Triad (Confidentiality, Integrity, Availability)",
            "Defence in Depth",
            "Principle of Least Privilege",
            "Zero Trust Architecture",
            "Attack Surface",
            "Threat Modelling",
            "Risk Assessment Fundamentals",
            "Security Controls (Preventive, Detective, Corrective)",
        ]
    },
    "01-Cryptography": {
        "emoji": "🔑",
        "description": "Encryption algorithms, key management, PKI — from Caesar cipher to post-quantum.",
        "concepts": [
            "Symmetric vs Asymmetric Encryption",
            "AES, DES, 3DES History and Evolution",
            "RSA, ECC Fundamentals",
            "Hash Functions (MD5, SHA family)",
            "Public Key Infrastructure (PKI)",
            "Digital Signatures and Certificates",
            "TLS/SSL Protocol Evolution",
            "Post-Quantum Cryptography (NIST PQC)",
            "Key Management Best Practices",
        ]
    },
    "02-Network-Security": {
        "emoji": "🌐",
        "description": "Firewalls, VPNs, IDS/IPS, protocols, perimeter and beyond.",
        "concepts": [
            "OSI Model and TCP/IP Stack",
            "Firewall Types and Generations",
            "IDS vs IPS",
            "VPN Technologies (IPSec, SSL/TLS)",
            "DNS Security (DNSSEC, DNS over HTTPS)",
            "DDoS Attack Types and Mitigations",
            "Network Segmentation and VLANs",
            "Zero Trust Network Access (ZTNA)",
            "SASE (Secure Access Service Edge)",
        ]
    },
    "03-Application-Security": {
        "emoji": "💻",
        "description": "OWASP, secure SDLC, web app vulnerabilities, code review.",
        "concepts": [
            "OWASP Top 10 (Web)",
            "SQL Injection",
            "Cross-Site Scripting (XSS)",
            "CSRF and Clickjacking",
            "Secure Software Development Lifecycle (SDLC)",
            "Static and Dynamic Analysis (SAST/DAST)",
            "API Security Best Practices",
            "Input Validation and Output Encoding",
            "Supply Chain Security",
        ]
    },
    "04-Identity-and-Access": {
        "emoji": "🪪",
        "description": "IAM, authentication, authorisation, SSO, MFA, PAM.",
        "concepts": [
            "Authentication vs Authorisation",
            "Multi-Factor Authentication (MFA)",
            "Single Sign-On (SSO) and SAML",
            "OAuth 2.0 and OpenID Connect",
            "Privileged Access Management (PAM)",
            "Role-Based Access Control (RBAC)",
            "Attribute-Based Access Control (ABAC)",
            "Identity Governance and Administration (IGA)",
            "Passwordless Authentication",
        ]
    },
    "05-Cloud-Security": {
        "emoji": "☁️",
        "description": "AWS/Azure/GCP security, shared responsibility, CSPM, CWPP.",
        "concepts": [
            "Shared Responsibility Model",
            "Cloud Security Posture Management (CSPM)",
            "Cloud Workload Protection (CWPP)",
            "Infrastructure as Code Security",
            "Container and Kubernetes Security",
            "Serverless Security",
            "Cloud IAM and Service Accounts",
            "Data Residency and Sovereignty",
            "Cloud-Native SIEM and SOAR",
        ]
    },
    "06-AI-and-ML-Security": {
        "emoji": "🤖",
        "description": "LLM threats, prompt injection, model poisoning, AI governance, OWASP LLM Top 10.",
        "concepts": [
            "OWASP Top 10 for LLMs (2025)",
            "Prompt Injection (Direct and Indirect)",
            "Data and Model Poisoning",
            "Training Data Extraction Attacks",
            "Model Inversion and Membership Inference",
            "AI Supply Chain Risks",
            "Agentic AI Security Risks",
            "Hallucination and Misinformation Risks",
            "Adversarial Machine Learning",
            "RAG Security and Vector Database Attacks",
        ]
    },
    "07-Governance-Risk-Compliance": {
        "emoji": "📋",
        "description": "NIST, ISO 27001, GDPR, risk frameworks, audit, policy.",
        "concepts": [
            "NIST Cybersecurity Framework 2.0",
            "ISO/IEC 27001 and 27002",
            "GDPR and Data Privacy Regulations",
            "SOC 2 Type I and II",
            "PCI DSS",
            "Risk Management Frameworks",
            "Security Policy Development",
            "Third-Party Risk Management",
            "EU AI Act and AI Governance",
            "NIST AI Risk Management Framework",
        ]
    },
    "08-Threat-Intelligence": {
        "emoji": "🕵️",
        "description": "CTI, threat actors, IOCs, MITRE ATT&CK, dark web monitoring.",
        "concepts": [
            "MITRE ATT&CK Framework",
            "Indicators of Compromise (IOC)",
            "Tactical, Operational, Strategic Intel",
            "Threat Actor Profiling (APT Groups)",
            "Dark Web Monitoring",
            "STIX/TAXII Standards",
            "Threat Hunting Fundamentals",
            "Intelligence Sharing (ISACs)",
            "Cyber Kill Chain",
        ]
    },
    "09-Security-Operations": {
        "emoji": "🖥️",
        "description": "SOC, SIEM, SOAR, incident response, forensics, monitoring.",
        "concepts": [
            "SOC Tier Model (Tier 1/2/3)",
            "SIEM Architecture and Use Cases",
            "SOAR Playbooks and Automation",
            "Incident Response Lifecycle",
            "Digital Forensics and Evidence Handling",
            "Log Management and Analysis",
            "Endpoint Detection and Response (EDR)",
            "UEBA (User and Entity Behaviour Analytics)",
            "Mean Time to Detect/Respond (MTTD/MTTR)",
        ]
    },
    "10-Endpoint-and-Device": {
        "emoji": "📱",
        "description": "Endpoint security, MDM, IoT, OT/ICS, hardware attacks.",
        "concepts": [
            "Endpoint Protection Platforms (EPP)",
            "Mobile Device Management (MDM)",
            "IoT Security Challenges",
            "OT/ICS Security (SCADA, Modbus)",
            "Hardware Security Modules (HSM)",
            "Supply Chain Hardware Attacks",
            "Firmware Security",
            "Trusted Platform Module (TPM)",
            "BYOD Security Policies",
        ]
    },
    "11-Physical-Security": {
        "emoji": "🏢",
        "description": "Data centre security, access control, social engineering, CCTV.",
        "concepts": [
            "Physical Access Controls",
            "Data Centre Security Standards",
            "Social Engineering and Pretexting",
            "Tailgating and Piggybacking",
            "Security Guards and Patrols",
            "Environmental Controls (HVAC, Fire)",
            "Visitor Management Systems",
            "Clean Desk Policy",
        ]
    },
    "12-Offensive-Security": {
        "emoji": "⚔️",
        "description": "Penetration testing, red teaming, bug bounty, vulnerability research.",
        "concepts": [
            "Penetration Testing Methodology (PTES)",
            "OWASP Testing Guide",
            "Red Team vs Blue Team vs Purple Team",
            "Bug Bounty Programmes",
            "Exploit Development Fundamentals",
            "Social Engineering Attacks",
            "OSINT Techniques",
            "Wireless Security Testing",
            "CVE and Vulnerability Disclosure",
        ]
    },
    "13-Emerging-and-Future": {
        "emoji": "🚀",
        "description": "Post-quantum, autonomous AI agents, space security, quantum computing threats.",
        "concepts": [
            "Post-Quantum Cryptography Timeline",
            "Autonomous AI Agents and Security",
            "Quantum Computing Threat to RSA",
            "Space and Satellite Security",
            "Brain-Computer Interface Security",
            "Synthetic Media and Deepfake Threats",
            "5G and 6G Security",
            "Homomorphic Encryption",
            "Confidential Computing",
        ]
    },
}


def build_vault():
    """Build the full Obsidian vault structure."""
    VAULT_PATH.mkdir(parents=True, exist_ok=True)
    
    # Create directory structure
    dirs = ["raw", "raw/assets", "wiki", "wiki/concepts", "wiki/entities", 
            "wiki/sources", "wiki/synthesis", "output"]
    
    for domain_key in DOMAINS:
        dirs.append(f"wiki/domains/{domain_key}")
    
    for d in dirs:
        (VAULT_PATH / d).mkdir(parents=True, exist_ok=True)
    
    print(f"✅ Directory structure created at {VAULT_PATH}")
    
    # Create CLAUDE.md — the schema file
    _write_claude_md()
    
    # Create index.md
    _write_index()
    
    # Create log.md
    _write_log()
    
    # Create domain foundation files
    for domain_key, domain_data in DOMAINS.items():
        _write_domain_foundation(domain_key, domain_data)
    
    # Create overview synthesis page
    _write_overview()
    
    print(f"✅ Obsidian vault built with {len(DOMAINS)} security domains")
    print(f"   Location: {VAULT_PATH}")


def _write_claude_md():
    content = """# Security Intelligence Vault — Schema (CLAUDE.md)

## Purpose
This vault is a living encyclopedia of cybersecurity and AI security knowledge.
It follows the Karpathy LLM Wiki pattern: raw sources in → LLM compiles → structured wiki grows.

## Core Principle
- Timeless fundamentals NEVER get deleted — they get enriched
- New research ALWAYS links back to foundational concepts
- Every claim has a source tag: [extracted], [inferred], or [ambiguous]

## Directory Structure
- `raw/` — immutable source documents. Never modify. Drop new sources here.
- `wiki/domains/` — fourteen security domain pages (LLM-maintained)
- `wiki/concepts/` — atomic concept pages (one concept per file)
- `wiki/entities/` — people, organisations, tools, frameworks
- `wiki/sources/` — one summary page per ingested source
- `wiki/synthesis/` — cross-domain analysis, comparisons, timelines
- `output/` — generated reports, briefings, research outputs

## Frontmatter Schema (all wiki pages)
```yaml
---
title: 
domain: # e.g. AI-and-ML-Security
type: # concept | entity | source | synthesis | domain-overview
status: # active | evergreen | deprecated
last_updated: 
source_count: 
confidence: # high | medium | low
tags: []
related: []
---
```

## Operations

### Ingest (when new source added to raw/)
1. Read source document
2. Extract key concepts, entities, claims
3. Write/update summary in wiki/sources/
4. Update relevant domain pages
5. Create/update concept pages for new concepts
6. Add cross-links using [[wikilinks]]
7. Append to log.md: `## [DATE] ingest | Source Title`

### Query (when asked a question)
1. Read index.md to identify relevant pages
2. Read relevant domain and concept pages
3. Synthesise answer with citations to wiki pages
4. If answer is novel — file it as a new synthesis page
5. Update index.md if new page created

### Lint (weekly health check)
1. Find orphan pages (no inbound links)
2. Find concepts mentioned but lacking own page
3. Find contradictions between pages
4. Suggest new research topics based on gaps
5. Flag pages where confidence = low and source_count < 2
6. Append to log.md: `## [DATE] lint | Health Check`

## Style Rules
- Write at intermediate technical level (assume security practitioner)
- Use plain English first, then technical terms
- Always explain WHY something matters, not just WHAT it is
- When fundamentals from 10+ years ago still apply — say so explicitly
- Cross-link aggressively with [[wikilinks]]
- Never remove historical content — mark it [historical] if superseded
"""
    (VAULT_PATH / "CLAUDE.md").write_text(content)


def _write_index():
    today = datetime.now().strftime("%Y-%m-%d")
    content = f"""# Security Intelligence Vault — Index

*Last updated: {today}*
*Total domains: {len(DOMAINS)}*

## Domains

"""
    for key, data in DOMAINS.items():
        content += f"- [[wiki/domains/{key}/overview]] — {data['emoji']} {data['description']}\n"
    
    content += """
## Active Research Threads
*(Populated by automated research runs)*

## Recently Updated Pages
*(Populated automatically)*

## Sources Ingested
*(Populated as sources are added)*
"""
    (VAULT_PATH / "wiki" / "index.md").write_text(content)


def _write_log():
    today = datetime.now().strftime("%Y-%m-%d")
    content = f"""# Vault Operation Log

## [{today}] init | Vault Skeleton Created
- Built {len(DOMAINS)} security domain directories
- Pre-seeded foundational concepts for each domain
- CLAUDE.md schema established
- Index and log files created

---
"""
    (VAULT_PATH / "wiki" / "log.md").write_text(content)


def _write_domain_foundation(domain_key: str, domain_data: dict):
    today = datetime.now().strftime("%Y-%m-%d")
    emoji = domain_data["emoji"]
    description = domain_data["description"]
    concepts = domain_data["concepts"]
    
    concept_links = "\n".join([f"- [[wiki/concepts/{c.split('(')[0].strip().replace(' ', '-').lower()}]] — {c}" 
                                for c in concepts])
    
    content = f"""---
title: {emoji} {domain_key.replace('-', ' ')}
domain: {domain_key}
type: domain-overview
status: evergreen
last_updated: {today}
source_count: 0
confidence: high
tags: [domain-overview, foundational]
related: []
---

# {emoji} {domain_key.replace('-', ' ')}

> {description}

## Core Concepts

{concept_links}

## Foundational Principles

*(Research runs will populate this section with synthesised knowledge)*

## Historical Context

*(Concepts that have been true for 10+ years and remain relevant)*

## Current Developments

*(Updated by nightly research runs — what's changing in this domain)*

## Key Frameworks and Standards

*(Populated as sources are ingested)*

## Related Domains

*(Cross-links to other domains will be added as connections are discovered)*

---
*This page is LLM-maintained. Foundational concepts are protected — marked [evergreen].*
*New research enriches rather than replaces existing knowledge.*
"""
    overview_path = VAULT_PATH / "wiki" / "domains" / domain_key / "overview.md"
    overview_path.write_text(content)


def _write_overview():
    content = """---
title: 🔐 Security Intelligence Vault Overview
type: synthesis
status: evergreen
tags: [overview, meta]
---

# 🔐 Security Intelligence Vault

This vault is a living, compounding knowledge base for everything cybersecurity and AI security.

## Design Philosophy

1. **Timeless + Current**: Fundamentals from 20 years ago sit alongside today's zero-days
2. **Compiled, not retrieved**: The LLM builds knowledge on top of knowledge — no re-discovering from scratch
3. **Provenance tracked**: Every claim is tagged [extracted], [inferred], or [ambiguous]
4. **Cross-linked aggressively**: Nothing is an island — every concept connects to others
5. **Research-driven**: Daily automated research enriches the vault continuously

## How to Use This Vault

- **For a topic**: Start at the domain overview, follow concept links
- **For breaking news**: Check the daily Notion briefing first, then drill into vault for context
- **For fundamentals**: Every domain has an [evergreen] section — these are the things that never change
- **For research history**: Check log.md for what was added and when

## The Fourteen Domains

| Domain | Focus |
|--------|-------|
| 🏛️ Fundamentals | CIA triad, defence in depth, principles |
| 🔑 Cryptography | Encryption, PKI, post-quantum |
| 🌐 Network Security | Firewalls, VPNs, protocols |
| 💻 Application Security | OWASP, SDLC, web vulnerabilities |
| 🪪 Identity & Access | IAM, MFA, zero trust |
| ☁️ Cloud Security | AWS/Azure/GCP, CSPM, containers |
| 🤖 AI & ML Security | LLM threats, prompt injection, governance |
| 📋 GRC | NIST, ISO 27001, compliance |
| 🕵️ Threat Intelligence | MITRE ATT&CK, CTI, threat actors |
| 🖥️ Security Operations | SOC, SIEM, incident response |
| 📱 Endpoint & Device | EDR, MDM, IoT, OT/ICS |
| 🏢 Physical Security | Access control, social engineering |
| ⚔️ Offensive Security | Pen testing, red team, bug bounty |
| 🚀 Emerging & Future | Post-quantum, autonomous AI, space |
"""
    (VAULT_PATH / "wiki" / "synthesis" / "vault-overview.md").write_text(content)


if __name__ == "__main__":
    build_vault()
    print("\n🏛️  Vault is ready. Open the folder in Obsidian to see your knowledge base.")
```

---

## PHASE 4 — Nightly Research Engine

### Task 4.1 — Create the research engine

Create the file `agents/security_research_engine.py`:

```python
"""
Security Research Engine
Nightly job that:
1. Queries Perplexity for latest AI & security news
2. Pulls from RSS feeds (CISA, OWASP, ArXiv, security blogs)
3. Extracts structured knowledge via Claude
4. Updates Obsidian vault pages
5. Compiles data for Notion briefing update
6. Tracks ongoing stories across multiple days
"""

import os
import json
import feedparser
from datetime import datetime, timedelta
from pathlib import Path
from anthropic import Anthropic
from database.db import get_conn
from config.settings import ANTHROPIC_API_KEY, PERPLEXITY_API_KEY

client = Anthropic(api_key=ANTHROPIC_API_KEY)
VAULT_PATH = Path(os.getenv("OBSIDIAN_VAULT_PATH", "./obsidian-vault"))

RSS_FEEDS = {
    "CISA Advisories": "https://www.cisa.gov/news.xml",
    "OWASP": "https://owasp.org/feed.xml",
    "Krebs on Security": "https://krebsonsecurity.com/feed/",
    "The Hacker News": "https://feeds.feedburner.com/TheHackersNews",
    "Schneier on Security": "https://www.schneier.com/feed/atom",
    "ArXiv AI Security": "https://arxiv.org/rss/cs.CR",
    "Dark Reading": "https://www.darkreading.com/rss.xml",
    "Bleeping Computer": "https://www.bleepingcomputer.com/feed/",
    "SANS Internet Storm Center": "https://isc.sans.edu/rssfeed_full.xml",
    "Google Project Zero": "https://googleprojectzero.blogspot.com/feeds/posts/default",
}

DEFAULT_TOPICS = [
    "AI security latest developments",
    "cybersecurity threats this week",
    "LLM vulnerabilities and attacks",
    "zero trust security updates",
    "AI governance regulations",
    "new CVEs critical vulnerabilities",
    "threat intelligence recent APT activity",
]


def run_nightly_research(custom_topic: str = None) -> dict:
    """
    Main research orchestration function.
    Returns structured briefing_data for Notion update.
    """
    print(f"\n🔍 Research run started: {datetime.now().isoformat()}")
    
    topics = [custom_topic] if custom_topic else DEFAULT_TOPICS
    
    all_findings = []
    
    # 1. RSS feed pull
    print("📡 Pulling RSS feeds...")
    rss_findings = _pull_rss_feeds()
    all_findings.extend(rss_findings)
    
    # 2. Perplexity research
    print("🔎 Running Perplexity research...")
    for topic in topics:
        findings = _research_topic_perplexity(topic)
        all_findings.extend(findings)
    
    # 3. Extract structured knowledge via Claude
    print("🧠 Extracting knowledge via Claude...")
    structured = _extract_knowledge(all_findings)
    
    # 4. Update vault
    print("📚 Updating Obsidian vault...")
    vault_updates = _update_vault(structured)
    
    # 5. Track ongoing stories
    print("📌 Tracking ongoing stories...")
    active_stories = _track_stories(structured)
    
    # 6. Log the run
    _log_research_run(topics, len(all_findings), len(vault_updates))
    
    # 7. Compile briefing data
    briefing_data = {
        "active_stories": active_stories,
        "breaking": _extract_breaking(structured),
        "deep_dives": _extract_deep_dives(structured),
        "vault_updates": vault_updates,
    }
    
    print(f"✅ Research run complete. {len(all_findings)} items processed.")
    return briefing_data


def _pull_rss_feeds() -> list:
    """Pull and parse RSS feeds."""
    findings = []
    for source_name, url in RSS_FEEDS.items():
        try:
            feed = feedparser.parse(url)
            cutoff = datetime.now() - timedelta(hours=48)
            
            for entry in feed.entries[:10]:  # max 10 per feed
                pub_date = entry.get("published_parsed")
                if pub_date:
                    pub_dt = datetime(*pub_date[:6])
                    if pub_dt < cutoff:
                        continue
                
                findings.append({
                    "source": source_name,
                    "title": entry.get("title", ""),
                    "summary": entry.get("summary", "")[:500],
                    "url": entry.get("link", ""),
                    "published": entry.get("published", ""),
                    "type": "rss"
                })
        except Exception as e:
            print(f"  ⚠️  RSS feed failed ({source_name}): {e}")
    
    print(f"  Found {len(findings)} items from RSS feeds")
    return findings


def _research_topic_perplexity(topic: str) -> list:
    """Query Perplexity for a topic."""
    try:
        import requests
        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "sonar",
            "messages": [
                {"role": "system", "content": "You are a security research assistant. Return recent, factual developments only. Focus on the last 48 hours."},
                {"role": "user", "content": f"What are the latest developments regarding: {topic}? Include specific incidents, CVEs, research papers, or announcements from the last 48 hours."}
            ],
            "search_recency_filter": "day"
        }
        
        response = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            citations = data.get("citations", [])
            
            return [{
                "source": "Perplexity",
                "title": topic,
                "summary": content[:1000],
                "url": citations[0] if citations else "",
                "citations": citations,
                "type": "perplexity"
            }]
    except Exception as e:
        print(f"  ⚠️  Perplexity failed for '{topic}': {e}")
    
    return []


def _extract_knowledge(findings: list) -> dict:
    """Use Claude to extract structured knowledge from raw findings."""
    if not findings:
        return {"stories": [], "breaking": [], "concepts": [], "deep_dives": []}
    
    findings_text = "\n\n".join([
        f"SOURCE: {f['source']}\nTITLE: {f['title']}\nSUMMARY: {f['summary']}\nURL: {f.get('url','')}"
        for f in findings[:30]  # cap to avoid token overflow
    ])
    
    prompt = f"""You are analysing security research findings for a daily intelligence brief.
    
Given these raw findings from the last 48 hours:

{findings_text}

Extract and structure the following as JSON:

{{
  "stories": [
    {{
      "title": "story headline",
      "domain": "which security domain (e.g. AI-and-ML-Security)",
      "summary": "2-3 sentence summary",
      "significance": "HIGH|MEDIUM|LOW",
      "is_ongoing": true/false,
      "source_urls": ["url1", "url2"],
      "key_concepts": ["concept1", "concept2"]
    }}
  ],
  "breaking": [
    {{
      "title": "urgent item",
      "severity": "HIGH|MEDIUM|LOW",
      "summary": "what happened and why it matters",
      "source_url": "url",
      "cve_id": "CVE-XXXX-XXXXX or null"
    }}
  ],
  "deep_dives": [
    {{
      "title": "research topic",
      "concept": "core concept being explored",
      "summary": "detailed summary",
      "timeless_connection": "how this connects to a foundational security principle",
      "source_urls": ["url1"]
    }}
  ],
  "vault_concepts": [
    {{
      "concept": "concept name",
      "domain": "security domain",
      "definition": "one paragraph definition",
      "related_concepts": ["concept1", "concept2"]
    }}
  ]
}}

Return ONLY valid JSON. No markdown, no preamble."""

    try:
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        text = response.content[0].text.strip()
        # Clean any accidental markdown
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print(f"  ⚠️  Knowledge extraction failed: {e}")
        return {"stories": [], "breaking": [], "concepts": [], "deep_dives": []}


def _track_stories(structured: dict) -> list:
    """Track ongoing stories across days — add timeline entries."""
    stories = structured.get("stories", [])
    tracked = []
    
    with get_conn() as conn:
        for story in stories:
            if not story.get("is_ongoing") and story.get("significance") not in ["HIGH"]:
                continue
            
            title = story["title"]
            today = datetime.now().strftime("%Y-%m-%d")
            
            # Check if story exists
            existing = conn.execute(
                "SELECT content FROM brain_entries WHERE category='reference' AND title LIKE ?",
                (f"story::{title[:50]}%",)
            ).fetchone()
            
            if existing:
                story_data = json.loads(existing["content"])
                # Add today's entry to timeline if not already there
                timeline = story_data.get("timeline", [])
                if not any(t["date"] == today for t in timeline):
                    timeline.append({"date": today, "event": story["summary"][:200]})
                story_data["timeline"] = timeline[-14:]  # keep 2 weeks
                story_data["status"] = f"Day {len(timeline)}: {story['summary'][:80]}..."
                story_data["summary"] = story["summary"]
                
                conn.execute(
                    "UPDATE brain_entries SET content=? WHERE category='reference' AND title LIKE ?",
                    (json.dumps(story_data), f"story::{title[:50]}%")
                )
                tracked.append(story_data)
            else:
                # New story
                story_data = {
                    "title": title,
                    "domain": story.get("domain", ""),
                    "status": f"Breaking: {story['summary'][:80]}...",
                    "summary": story["summary"],
                    "timeline": [{"date": today, "event": story["summary"][:200]}],
                    "source_urls": story.get("source_urls", []),
                    "started": today
                }
                conn.execute(
                    """INSERT INTO brain_entries (category, title, content, tags) VALUES (?,?,?,?)""",
                    ("reference", f"story::{title[:50]}", json.dumps(story_data), "story,active")
                )
                tracked.append(story_data)
    
    return tracked[:10]  # Top 10 stories in brief


def _update_vault(structured: dict) -> list:
    """Write new concepts and updates to Obsidian vault."""
    updates = []
    today = datetime.now().strftime("%Y-%m-%d")
    
    concepts = structured.get("vault_concepts", [])
    for concept_data in concepts:
        concept = concept_data.get("concept", "")
        domain = concept_data.get("domain", "00-Fundamentals")
        definition = concept_data.get("definition", "")
        
        if not concept or not definition:
            continue
        
        # Sanitise filename
        filename = concept.lower().replace(" ", "-").replace("/", "-")[:50] + ".md"
        concept_path = VAULT_PATH / "wiki" / "concepts" / filename
        
        if concept_path.exists():
            # Update existing page
            existing = concept_path.read_text()
            if "last_updated:" in existing:
                existing = existing.replace(
                    existing[existing.find("last_updated:"):existing.find("\n", existing.find("last_updated:"))],
                    f"last_updated: {today}"
                )
            concept_path.write_text(existing + f"\n\n## Update {today}\n{definition}")
            updates.append({"page": concept, "action": "updated", "domain": domain})
        else:
            # Create new concept page
            related = "\n".join([f"- [[wiki/concepts/{r.lower().replace(' ','-')}]]" 
                                  for r in concept_data.get("related_concepts", [])[:5]])
            content = f"""---
title: {concept}
domain: {domain}
type: concept
status: active
last_updated: {today}
source_count: 1
confidence: medium
tags: [{domain.lower()}, concept]
related: []
---

# {concept}

{definition}

## Related Concepts

{related if related else "*(Cross-links will be added as vault grows)*"}

---
*[extracted] — Added by automated research on {today}*
"""
            concept_path.write_text(content)
            updates.append({"page": concept, "action": "created", "domain": domain})
    
    return updates


def _extract_breaking(structured: dict) -> list:
    """Extract breaking items with expiry timestamps."""
    breaking = structured.get("breaking", [])
    result = []
    expires = (datetime.now() + timedelta(hours=48)).isoformat()
    
    for item in breaking:
        result.append({
            "title": item.get("title", ""),
            "severity": item.get("severity", "MEDIUM"),
            "summary": item.get("summary", ""),
            "source_url": item.get("source_url", ""),
            "expires_at": expires
        })
    
    return result


def _extract_deep_dives(structured: dict) -> list:
    return structured.get("deep_dives", [])


def _log_research_run(topics: list, items_found: int, vault_updates: int):
    """Log the research run to vault log and agent_runs table."""
    today = datetime.now().strftime("%Y-%m-%d")
    log_path = VAULT_PATH / "wiki" / "log.md"
    
    if log_path.exists():
        existing = log_path.read_text()
        new_entry = f"\n## [{today}] research | Topics: {', '.join(topics[:3])}\n"
        new_entry += f"- Items found: {items_found}\n"
        new_entry += f"- Vault updates: {vault_updates}\n---\n"
        log_path.write_text(existing + new_entry)
    
    with get_conn() as conn:
        conn.execute(
            """INSERT INTO agent_runs (run_type, status, details) VALUES (?,?,?)""",
            ("security_research", "completed", 
             json.dumps({"topics": topics, "items": items_found, "vault_updates": vault_updates}))
        )


if __name__ == "__main__":
    result = run_nightly_research()
    print(json.dumps(result, indent=2))
```

---

## PHASE 5 — Dashboard Extension

### Task 5.1 — Add new API routes to dashboard/server.py

Append the following routes to `dashboard/server.py`:

```python
# ── RESEARCH CONTROL PANEL ROUTES ─────────────────────────────────────────

from agents.security_research_engine import run_nightly_research
from agents.notion_audit import audit_workspace, get_command_center_id
from agents.notion_briefing import (
    get_or_create_briefing_page, 
    update_briefing_page,
    wire_to_command_center
)
from agents.vault_builder import build_vault
import os

@app.post("/api/research/run")
async def trigger_research(background_tasks: BackgroundTasks):
    """Manually trigger the full nightly research run."""
    background_tasks.add_task(_run_research_job)
    return {"status": "started", "message": "Research job running in background"}


@app.post("/api/research/custom")
async def trigger_custom_research(body: dict, background_tasks: BackgroundTasks):
    """Trigger research on a specific keyword or topic."""
    topic = body.get("topic", "").strip()
    if not topic:
        return {"error": "Topic required"}, 400
    background_tasks.add_task(_run_research_job, topic)
    return {"status": "started", "topic": topic, "message": f"Researching '{topic}'..."}


@app.get("/api/research/status")
async def research_status():
    """Get status of last research run and next scheduled run."""
    with get_conn() as conn:
        last_run = conn.execute(
            "SELECT * FROM agent_runs WHERE run_type='security_research' ORDER BY created_at DESC LIMIT 1"
        ).fetchone()
        
        active_stories = conn.execute(
            "SELECT COUNT(*) as count FROM brain_entries WHERE category='reference' AND title LIKE 'story::%'"
        ).fetchone()
    
    return {
        "last_run": dict(last_run) if last_run else None,
        "active_stories": active_stories["count"] if active_stories else 0,
        "next_run": "Tonight at midnight (scheduled)",
        "vault_path": os.getenv("OBSIDIAN_VAULT_PATH", "Not configured")
    }


@app.get("/api/research/stories")
async def get_active_stories():
    """Get all currently tracked ongoing stories."""
    import json
    with get_conn() as conn:
        stories = conn.execute(
            "SELECT title, content FROM brain_entries WHERE category='reference' AND title LIKE 'story::%' ORDER BY updated_at DESC"
        ).fetchall()
    
    result = []
    for s in stories:
        try:
            data = json.loads(s["content"])
            result.append(data)
        except Exception:
            pass
    
    return {"stories": result}


@app.post("/api/vault/setup")
async def setup_vault(background_tasks: BackgroundTasks):
    """Build the initial Obsidian vault skeleton."""
    background_tasks.add_task(build_vault)
    return {"status": "started", "message": "Building Obsidian vault..."}


@app.post("/api/notion/setup-briefing")
async def setup_notion_briefing(background_tasks: BackgroundTasks):
    """Audit Notion and create the intelligence briefing page."""
    background_tasks.add_task(_setup_notion_briefing)
    return {"status": "started", "message": "Setting up Notion briefing page..."}


async def _run_research_job(custom_topic: str = None):
    """Background task: run research and update Notion."""
    try:
        briefing_data = run_nightly_research(custom_topic)
        
        # Update Notion briefing page
        patterns = audit_workspace()
        page_id = get_or_create_briefing_page(patterns)
        update_briefing_page(page_id, briefing_data)
        
        print("✅ Research job and Notion update complete")
    except Exception as e:
        print(f"❌ Research job failed: {e}")


async def _setup_notion_briefing():
    """Background task: full Notion setup."""
    try:
        patterns = audit_workspace()
        page_id = get_or_create_briefing_page(patterns)
        cc_id = get_command_center_id()
        if cc_id:
            wire_to_command_center(page_id, cc_id)
        print(f"✅ Notion briefing page ready: {page_id}")
    except Exception as e:
        print(f"❌ Notion setup failed: {e}")
```

### Task 5.2 — Update dashboard/index.html

Find the navigation section in `dashboard/index.html` and add a new nav item for "Research". Then add the Research Control Panel page component.

Locate the section that renders navigation items (look for existing nav items like "Overview", "X Post Drafts", etc.) and add:

```javascript
// Add to navigation items array:
{ id: 'research', label: '🔍 Research', icon: '🔍' }
```

Then add this page component before the closing of the pages/components section:

```javascript
// Research Control Panel Page
function ResearchPage() {
  const [status, setStatus] = React.useState(null);
  const [customTopic, setCustomTopic] = React.useState('');
  const [stories, setStories] = React.useState([]);
  const [running, setRunning] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    fetchStatus();
    fetchStories();
  }, []);

  const fetchStatus = async () => {
    const data = await GET('/api/research/status');
    setStatus(data);
  };

  const fetchStories = async () => {
    const data = await GET('/api/research/stories');
    setStories(data.stories || []);
  };

  const runResearch = async () => {
    setRunning(true);
    setMessage('Running full research job...');
    await POST('/api/research/run', {});
    setTimeout(() => { setRunning(false); fetchStatus(); fetchStories(); setMessage('Research job started. Check back shortly.'); }, 2000);
  };

  const runCustom = async () => {
    if (!customTopic.trim()) return;
    setRunning(true);
    setMessage(`Researching: "${customTopic}"...`);
    await POST('/api/research/custom', { topic: customTopic });
    setCustomTopic('');
    setTimeout(() => { setRunning(false); fetchStatus(); setMessage('Custom research job started.'); }, 2000);
  };

  const setupVault = async () => {
    setMessage('Building Obsidian vault...');
    await POST('/api/vault/setup', {});
    setMessage('Vault setup started. Check your Obsidian vault path.');
  };

  const setupNotion = async () => {
    setMessage('Setting up Notion briefing page...');
    await POST('/api/notion/setup-briefing', {});
    setMessage('Notion setup started. Check your Notion workspace.');
  };

  return (
    <div className="page">
      <h1>🔍 Research Control Panel</h1>
      
      {message && <div className="alert alert-info">{message}</div>}

      {/* Status Bar */}
      <div className="card">
        <h2>📊 Status</h2>
        {status ? (
          <div>
            <p><strong>Last Run:</strong> {status.last_run ? status.last_run.created_at : 'Never'}</p>
            <p><strong>Active Stories:</strong> {status.active_stories}</p>
            <p><strong>Next Scheduled:</strong> {status.next_run}</p>
            <p><strong>Vault:</strong> {status.vault_path}</p>
          </div>
        ) : <p>Loading...</p>}
      </div>

      {/* Run Controls */}
      <div className="card">
        <h2>⚡ Run Research</h2>
        <button className="btn btn-primary" onClick={runResearch} disabled={running}>
          {running ? '⏳ Running...' : '🚀 Run Full Nightly Research Now'}
        </button>
        <p className="hint">Pulls from all sources: CISA, OWASP, RSS feeds, Perplexity. Updates vault + Notion brief.</p>
      </div>

      {/* Custom Research */}
      <div className="card">
        <h2>🎯 Custom Research Topic</h2>
        <p>Enter a keyword or topic you want researched immediately:</p>
        <div className="input-row">
          <input
            type="text"
            value={customTopic}
            onChange={e => setCustomTopic(e.target.value)}
            placeholder="e.g. supply chain attack on npm, Claude agent security, post-quantum NIST..."
            className="input-full"
            onKeyDown={e => e.key === 'Enter' && runCustom()}
          />
          <button className="btn btn-secondary" onClick={runCustom} disabled={running || !customTopic.trim()}>
            Research This
          </button>
        </div>
      </div>

      {/* Setup Section */}
      <div className="card">
        <h2>🛠️ First Time Setup</h2>
        <div className="button-row">
          <button className="btn btn-outline" onClick={setupVault}>
            📚 Build Obsidian Vault
          </button>
          <button className="btn btn-outline" onClick={setupNotion}>
            📋 Setup Notion Briefing Page
          </button>
        </div>
        <p className="hint">Run these once on first setup. Vault will be created at OBSIDIAN_VAULT_PATH. Notion page will be wired into your command center.</p>
      </div>

      {/* Active Stories */}
      <div className="card">
        <h2>📌 Active Stories Being Tracked ({stories.length})</h2>
        {stories.length === 0 ? (
          <p>No ongoing stories yet. Run research to start tracking developments.</p>
        ) : stories.map((story, i) => (
          <div key={i} className="story-item">
            <h3>{story.title}</h3>
            <p className="story-status">{story.status}</p>
            <p>{story.summary}</p>
            <p className="story-meta">
              Domain: {story.domain} | Started: {story.started} | Updates: {story.timeline?.length || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## PHASE 6 — Scheduler Extension

### Task 6.1 — Add research schedule to run.py

In `run.py`, find the scheduler setup section and add:

```python
from agents.security_research_engine import run_nightly_research
from agents.notion_briefing import get_or_create_briefing_page, update_briefing_page
from agents.notion_audit import audit_workspace

def _scheduled_research_and_brief():
    """Run nightly research and update Notion brief."""
    try:
        print("🔍 Scheduled research starting...")
        briefing_data = run_nightly_research()
        patterns = audit_workspace()
        page_id = get_or_create_briefing_page(patterns)
        update_briefing_page(page_id, briefing_data)
        print("✅ Scheduled research and Notion brief complete")
    except Exception as e:
        print(f"❌ Scheduled research failed: {e}")

# Add these to your existing scheduler setup:
# Research runs at midnight
schedule.every().day.at("00:00").do(_scheduled_research_and_brief)

# Optional: second run at noon to catch breaking news
schedule.every().day.at("12:00").do(_scheduled_research_and_brief)

# Weekly vault lint on Sunday morning
# schedule.every().sunday.at("06:00").do(run_vault_lint)
```

---

## PHASE 7 — Database Migration

### Task 7.1 — Add new table for story tracking

In `database/init_db.py`, add the following table if it doesn't already exist:

```python
# Run this migration:
conn.execute("""
    CREATE TABLE IF NOT EXISTS research_stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        story_key TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        domain TEXT,
        status TEXT,
        summary TEXT,
        timeline TEXT,  -- JSON array
        source_urls TEXT,  -- JSON array
        significance TEXT DEFAULT 'MEDIUM',
        started_at TEXT,
        last_updated TEXT,
        is_active INTEGER DEFAULT 1
    )
""")

conn.execute("""
    CREATE TABLE IF NOT EXISTS vault_sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_name TEXT NOT NULL,
        domain TEXT,
        action TEXT,  -- created | updated | deprecated
        synced_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
""")
```

---

## PHASE 8 — Setup & First Run Sequence

Run these in order from the `signal-social-agent` root directory:

```bash
# 1. Install new dependencies
pip install notion-client feedparser arxiv

# 2. Update .env with Obsidian vault path and Notion IDs
# Edit .env and add:
#   OBSIDIAN_VAULT_PATH=/path/to/your/obsidian/vault/security-intelligence
#   NOTION_COMMAND_CENTER_ID=<your command center page ID>

# 3. Run database migration
python database/init_db.py

# 4. Build Obsidian vault skeleton
python agents/vault_builder.py

# 5. Audit Notion and create briefing page
python -c "
from agents.notion_audit import audit_workspace, get_command_center_id
from agents.notion_briefing import get_or_create_briefing_page, wire_to_command_center
patterns = audit_workspace()
page_id = get_or_create_briefing_page(patterns)
cc_id = get_command_center_id()
if cc_id:
    wire_to_command_center(page_id, cc_id)
print('Setup complete. Briefing page:', page_id)
"

# 6. Run first research job manually to test
python agents/security_research_engine.py

# 7. Start Signal agent (scheduler will handle nightly runs)
python run.py
```

---

## PHASE 9 — CLAUDE.md for Obsidian Vault Operations

This file lives at the root of your Obsidian vault and tells Claude Code how to work with the vault when you open it there. Save this separately as `<vault-path>/CLAUDE.md` (it is also created automatically by Phase 3 above).

Key instructions for Claude Code when working in the vault:

```
When I ask you to research a topic:
1. Check wiki/index.md first — does this already exist?
2. Search raw/ for any existing sources
3. Research the topic
4. Create or update the relevant wiki/domains/ and wiki/concepts/ pages
5. Cross-link with [[wikilinks]] to related concepts
6. Append to wiki/log.md
7. Update wiki/index.md if new pages were created

When I ask about a security concept:
1. Read the relevant domain overview
2. Find related concept pages
3. Synthesise an answer with citations to vault pages
4. If the answer reveals a gap — create a new concept page

When running a vault health check (lint):
1. List all pages in wiki/
2. Find pages with no inbound [[wikilinks]]
3. Find concepts mentioned in pages but lacking their own page
4. Check for outdated claims (look for dates older than 6 months in active content)
5. Suggest 3-5 research topics based on identified gaps
6. Append findings to wiki/log.md
```

---

## Summary of What Gets Built

| Component | What it does |
|-----------|-------------|
| `agents/vault_builder.py` | Creates Obsidian vault with 14 security domains |
| `agents/security_research_engine.py` | Nightly research: RSS + Perplexity → structured knowledge |
| `agents/notion_audit.py` | Reads your existing Notion design patterns |
| `agents/notion_briefing.py` | Creates and updates the daily Notion intelligence page |
| `dashboard/server.py` (extended) | New API routes for research control |
| `dashboard/index.html` (extended) | Research Control Panel UI |
| `run.py` (extended) | Midnight + noon research schedule |
| `database/init_db.py` (extended) | Story tracking and vault sync tables |

---

## Troubleshooting

**Notion API errors:** Verify your integration has access to the pages. In Notion, share each top-level page with your integration.

**Perplexity quota:** The engine caps at 7 topics per nightly run. Adjust `DEFAULT_TOPICS` in the engine to reduce API calls.

**Vault path not found:** Set `OBSIDIAN_VAULT_PATH` in `.env` to the full absolute path of your Obsidian vault folder (or desired location).

**RSS feeds failing:** Some feeds may block automated access. Remove failing feeds from `RSS_FEEDS` dict in the engine.

**Dashboard 404 on new routes:** Restart `run.py` after adding new routes to `dashboard/server.py`.

---

*Built for signal-social-agent | Karpathy LLM Wiki pattern | CISSP domain taxonomy | OWASP AI security coverage*
*Version 1.0 — Ready for Claude Code execution*
