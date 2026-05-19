"""Structured tasks for the 20-week social & funnel calendar (source: docs/Social Plan 8 May 2026.md)."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import List

WEEK1_MONDAY = date(2026, 5, 11)


def phase_for_week(w: int) -> str:
    if w <= 4:
        return "Foundation"
    if w <= 10:
        return "Vision"
    if w <= 16:
        return "Pre-Launch"
    return "Launch"


def week_start(w: int) -> date:
    return WEEK1_MONDAY + timedelta(days=(w - 1) * 7)


@dataclass(frozen=True)
class SocialTask:
    week: int
    day_offset: int  # 0=Mon … 6=Sun
    channel: str
    title: str
    depends: str


def _t(
    week: int,
    day_offset: int,
    channel: str,
    title: str,
    depends: str = "",
) -> SocialTask:
    return SocialTask(
        week=week,
        day_offset=day_offset,
        channel=channel,
        title=title,
        depends=depends,
    )


# --- Week content (titles match or closely paraphrase the source plan) ---

W_DATA: List[dict] = [
    {
        "w": 1,
        "articles": [
            "The Hidden Cost of Compliance Reporting: Why Your Best Security Leaders Spend 40% of Their Time on Slides",
            "Why ISO 27001, NIST CSF, and PCI DSS All Tell You the Same Thing—and Why That's Actually Good News",
        ],
        "dl": "The Compliance Reporting Time Audit",
        "li": [
            "LinkedIn carousel: 5 Hours a Week — compliance reporting cost (data + breakdown)",
            "LinkedIn carousel: ISO 27001 vs NIST CSF vs PCI DSS — one diagram maps them all",
            "LinkedIn text: CISO story — 60-hour week, 22 on reporting",
            "LinkedIn carousel: 2026 vCISO costs $5K–$20K/mo — what the money buys",
        ],
        "reddit": [
            ("r/cybersecurity", "Honest question to GRC folks: reporting vs doing security work?"),
            ("r/CISO", "Most painful part of monthly board prep?"),
        ],
        "x_thread": "Thread: How heads of security at small companies spend their week — what surprised me",
    },
    {
        "w": 2,
        "articles": [
            "The vCISO Trap: Why Small Companies Pay $10K/Month for Advice They Can't Implement",
            "The 12 Frameworks Every Small Org Will Touch in 2026 (And Which Ones Actually Matter)",
        ],
        "dl": "Framework Selection Decision Tree",
        "li": [
            "LinkedIn carousel: vCISO math — what $5K–$20K/mo actually gets you",
            "LinkedIn carousel: 12 frameworks — which actually matters?",
            "LinkedIn text: Sarah (composite) head of security at 150-person fintech — the impossible Tuesday",
            "LinkedIn carousel: Hidden map — ISO 27001, NIST CSF, SOC 2, PCI overlap",
        ],
        "reddit": [
            ("r/cybersecurity", "Replacing vCISO with internal capability + tooling — what worked?"),
            ("r/SaaS", "Building for orgs that need compliance but can't afford vCISO — what am I not asking?"),
        ],
        "x_thread": "Thread: Asked 12 heads of security what they'd automate first",
    },
    {
        "w": 3,
        "articles": [
            "Continuous Compliance vs. Point-in-Time Audits: Why the Industry Is Shifting",
            "How to Run a NIST CSF Self-Assessment Without Hiring a Consultant",
        ],
        "dl": "NIST CSF Self-Assessment Workbook",
        "li": [
            "LinkedIn carousel: Audit-ready vs always-ready — 7 signs you're stuck in the past",
            "LinkedIn carousel: NIST CSF maturity in 5 levels (small org examples)",
            "LinkedIn text: 91% want continuous compliance in 5 years — 11% have it — what's blocking",
            "LinkedIn carousel: What I'd ask my AI security partner first each morning",
        ],
        "reddit": [
            ("r/ISO27001", "Self-assessment workbook for NIST CSF — free, no email"),
            ("r/cybersecurity", "Continuous compliance vs annual audits — what's working?"),
        ],
        "x_thread": "Thread: Continuous compliance shift — why most teams aren't ready",
    },
    {
        "w": 4,
        "articles": [
            "The Reporting Treadmill: Why Quarterly Board Updates Are Killing Your Security Strategy",
            "The Data Your Board Actually Wants to See (And the Slide That's Wasting Their Time)",
        ],
        "dl": "Board-Ready Security Report Template",
        "li": [
            "LinkedIn carousel: What boards want vs what they get",
            "LinkedIn carousel: 5 metrics for every security board report (+ 3 to drop)",
            "LinkedIn text: Asked a board member what they wished the CISO would say — story hook",
            "LinkedIn carousel: Anatomy of a useless security slide (and fix)",
        ],
        "reddit": [
            ("r/CISO", "One-page security update template — comparing approaches"),
            ("r/cybersecurity", "Board prep: distill 200 controls into 5 numbers?"),
        ],
        "x_thread": "Build-in-public: Sketching a compliance dashboard for non-technical boards",
    },
    {
        "w": 5,
        "articles": [
            "What If Your Security Operations Lived in Slack? (A Thought Experiment)",
            "The Always-On CISO: What 24/7 Security Leadership Could Look Like",
        ],
        "dl": "AI Security Use Case Catalogue",
        "li": [
            "LinkedIn carousel: 10 weekly CISO tasks AI could handle by end of 2026",
            "LinkedIn carousel: Slack-native CISO — vision board",
            "LinkedIn text: Ask ISO 27001 posture in Slack — real answer in 4 seconds — we're closer than you think",
            "LinkedIn carousel: Before AI vs after AI — the CISO's calendar",
        ],
        "reddit": [
            ("r/cybersecurity", "AI agent that knew your environment perfectly — what would you ask first?"),
            ("r/devsecops", "AI-first security workflow — integration that matters most?"),
        ],
        "x_thread": "Thread: Slack-native compliance system — sketched UI",
    },
    {
        "w": 6,
        "articles": [
            "Industry Benchmarking for Security: Why You're Flying Blind Without It",
            "How Anonymized Peer Data Could Change How Small Orgs Think About Risk",
        ],
        "dl": "Security Maturity Self-Benchmark",
        "li": [
            "LinkedIn carousel: You don't know if security is good — only better than yesterday",
            "LinkedIn carousel: What if small orgs could compare to peers anonymously?",
            "LinkedIn text: Banks have benchmarking — small orgs fly blind — that's changing",
            "LinkedIn carousel: 5 metrics that compare across industries (+ 5 that don't)",
        ],
        "reddit": [
            ("r/cybersecurity", "Anonymous security maturity benchmarking — would you contribute data?"),
        ],
        "x_thread": "Thread: Security benchmarking broken for small orgs — what would fix it",
    },
    {
        "w": 7,
        "articles": [
            "The AI Risk Management Framework: What ISO 42001 Actually Asks of Your Organization",
            "Tech Stack Discovery: Why Your AI Security Partner Needs to Know What You Actually Run",
        ],
        "dl": "ISO 42001 Readiness Checklist",
        "li": [
            "LinkedIn carousel: ISO 42001 in 7 slides — orgs using AI",
            "LinkedIn carousel: EU AI Act phase 2 — Aug 2, 2026 readiness",
            "LinkedIn text: ChatGPT at work → EU AI Act may apply — why",
            "LinkedIn carousel: Tech stack = security perimeter — most orgs can't list it",
        ],
        "reddit": [
            ("r/AI_compliance", "ISO 42001 readiness — what is your org doing?"),
            ("r/cybersecurity", "AI in stack = AI in risk register — how are you handling?"),
        ],
        "x_thread": "Thread: EU AI Act + ISO 42001 — small orgs starting point",
    },
    {
        "w": 8,
        "articles": [
            "Continuous Control Monitoring: From Buzzword to Reality for Small Orgs",
            "Why Your CFO Should Care About Your Security Maturity Score",
        ],
        "dl": "CFO Briefing Pack: Security as a Business Metric",
        "li": [
            "LinkedIn carousel: Translate security maturity into CFO language",
            "LinkedIn carousel: Continuous control monitoring — 90-day starter for small orgs",
            "LinkedIn text: CFO doesn't care about NIST CSF — three things they care about — map to them",
            "LinkedIn carousel: Security investments that pay for themselves (with math)",
        ],
        "reddit": [
            ("r/CISO", "How are you presenting security spend to finance this quarter?"),
            ("r/cybersecurity", "CCM at small scale — first control you'd monitor continuously?"),
        ],
        "x_thread": "Build-in-public: Research project coming — will share soon (anticipation for book)",
        "skip_extra_x": True,
    },
    {
        "w": 9,
        "articles": [
            "AI and the Future of Security Leadership: Book excerpt",
            "Why I Decided to Write About AI and Security Leadership",
        ],
        "dl": "Book Reader Exclusive: 30-page pre-release sample",
        "li": [
            "LinkedIn long-form: 6 months research → writing a book — core thesis",
            "LinkedIn carousel: Book sneak peek — 7 ways AI will redefine CISO by 2027",
            "LinkedIn text: Personal story — why the book",
            "LinkedIn carousel: What I learned talking to 50 heads of security",
        ],
        "reddit": [
            ("r/CISO", "Writing a book on AI + security leadership — chapter outline — what would you add?"),
            ("r/cybersecurity", "Same topic — seeking missing chapters from practitioners"),
        ],
        "x_thread": "Thread: Writing a book — why now and what's in it",
    },
    {
        "w": 10,
        "articles": [
            "The 6-Hour CISO: How AI Could Compress Your Week",
            "From Compliance Officer to Compliance Architect: The Role Shift Coming in 2027",
        ],
        "dl": "The AI-Augmented Security Leader's Roadmap",
        "li": [
            "LinkedIn carousel: 10 hours/week reclaimed — what CISOs do with AI productivity",
            "LinkedIn carousel: Your job description is about to change — what's coming",
            "LinkedIn text: 39% CISOs say AI sped reporting (Splunk 2026) — the other 61%",
            "LinkedIn carousel: Three career paths for the AI-augmented security leader",
        ],
        "reddit": [
            ("r/CISO", "If you reclaimed 10h/week from reporting — where would you invest it?"),
            ("r/cybersecurity", "Compliance architect vs compliance officer — seeing the shift?"),
        ],
        "x_thread": "Thread: 6-hour week vision — what leaves the calendar first",
    },
    {
        "w": 11,
        "articles": [
            "What I Wish I Knew Before Starting My ISO 27001 Journey",
            "The Three Questions Every Board Will Ask About AI in 2026 (And Your Answers)",
        ],
        "dl": "AI Board Briefing Template",
        "li": [
            "LinkedIn carousel: 3 questions your board will ask about AI in 2026",
            "LinkedIn carousel: ISO 27001 in 90 days — realistic roadmap",
            "LinkedIn text: Reflection — book writing surprises",
            "LinkedIn carousel: Talk AI risk with the board without FUD",
        ],
        "reddit": [
            ("r/SaaS", "Found 3 design partners for AI security tool — your early-adopter approach?"),
            ("r/cybersecurity", "Building something interesting — heads of security at small orgs, DM to chat"),
        ],
        "x_thread": "Build-in-public: First 3 design partners — what I'm learning",
    },
    # Week 12 handled in SPECIAL
    {
        "w": 13,
        "articles": [
            "The 5 Reader Questions I Keep Getting (And My Answers)",
            "Behind the Book: The Interview Series (Part 1)",
        ],
        "dl": "",
        "li": [
            "LinkedIn carousel: Reader quotes / testimonials",
            "LinkedIn carousel: What I wrote vs what's happened since",
            "LinkedIn text: Reader question that changed my thinking",
        ],
        "reddit": [
            ("r/CISO", "Book readers — what's the chapter you want next?"),
            ("r/cybersecurity", "Behind the book — what surprised you in AI + security leadership?"),
        ],
        "x_thread": "Thread: 5 reader questions — short answers",
        "skip_dl": True,
    },
    {
        "w": 14,
        "articles": [
            "The Book's Most Controversial Claim: AI Makes Security Leaders MORE Important",
            "What Readers Are Saying",
        ],
        "dl": "",
        "li": [
            "LinkedIn carousel: The one section every reader highlights",
            "LinkedIn long post: Industry response + reflections",
            "LinkedIn carousel: Q&A from book readers",
        ],
        "reddit": [
            ("r/cybersecurity", "Controversial take: AI elevates CISO role — agree or disagree?"),
            ("r/CISO", "What would change your mind on AI + leadership?"),
        ],
        "x_thread": "Thread: Most controversial claim from the book — debate welcome",
        "skip_dl": True,
    },
    {
        "w": 15,
        "articles": [
            "From Book to Building: Connecting With Readers Who Want to Co-Create What Comes Next",
        ],
        "dl": "",
        "li": [
            "LinkedIn carousel: Question every reader asks — how do I actually do this?",
            "LinkedIn carousel: From theory to tools — practitioner's path",
        ],
        "reddit": [
            ("r/SaaS", "Readers asking for tools to make AI+security real — lessons from convos?"),
            ("r/cybersecurity", "Co-creation — what would you want in a product loop?"),
        ],
        "x_thread": "Thread: Book → building — inviting co-creators",
        "one_article": True,
        "skip_dl": True,
    },
    {
        "w": 16,
        "articles": [
            "Industry Update: What's Changed Since the Book Launched",
            "The Co-Creation Cohort: An Invitation",
        ],
        "dl": "",
        "li": [
            "LinkedIn carousel: Top 5 articles ranked by reader saves",
            "LinkedIn carousel: Year in AI + security recap",
        ],
        "reddit": [
            ("r/CISO", "Co-creation cohort — what would make you say yes?"),
            ("r/cybersecurity", "Since the book dropped — what changed in your priorities?"),
        ],
        "x_thread": "Thread: Co-creation cohort invite — vague but signal",
        "skip_dl": True,
    },
]


def _expand_standard(d: dict) -> List[SocialTask]:
    w = d["w"]
    tasks: List[SocialTask] = []

    articles: List[str] = list(d["articles"])
    if d.get("one_article"):
        tasks.append(_t(w, 0, "Vik.so", f"Article: {articles[0]}"))
    else:
        tasks.append(_t(w, 0, "Vik.so", f"Article: {articles[0]}"))
        tasks.append(_t(w, 1, "Vik.so", f"Article: {articles[1]}"))

    if not d.get("skip_dl"):
        tasks.append(_t(w, 2, "Vik.so / Downloadable", f"Publish downloadable: {d['dl']}"))

    li_list: List[str] = list(d["li"])
    # Map LI to Thu–Sun + overflow if 5 items
    li_days = [3, 4, 5, 6]
    for i, title in enumerate(li_list[:4]):
        tasks.append(_t(w, li_days[i], "LinkedIn", title))
    if len(li_list) > 4:
        for j, title in enumerate(li_list[4:], start=0):
            tasks.append(_t(w, min(6, 3 + j), "LinkedIn", title))

    reddit = d["reddit"]
    tasks.append(_t(w, 1, "Reddit", f"Post — {reddit[0][0]}: {reddit[0][1]}"))
    if len(reddit) > 1:
        tasks.append(_t(w, 3, "Reddit", f"Post — {reddit[1][0]}: {reddit[1][1]}"))

    xt = d["x_thread"]
    tasks.append(_t(w, 4, "X/Twitter", xt))

    if not d.get("skip_extra_x"):
        tasks.append(
            _t(
                w,
                6,
                "X/Twitter",
                "Daily replies & engagement — security / AI / founder threads (ongoing all week)",
                depends="Allocate ~15–25 min/day",
            )
        )

    tasks.append(
        _t(
            w,
            6,
            "Reddit",
            "Daily comment engagement — target subs (ongoing all week)",
            depends="Non-promotional; add value in threads",
        )
    )

    tasks.append(
        _t(
            w,
            6,
            "Measurement",
            "Sunday metrics sweep — Vik.so / LinkedIn / Reddit / X (see source plan)",
            depends="Source: Social Plan §What to Measure",
        )
    )
    return tasks


def _week12_book_launch() -> List[SocialTask]:
    w = 12
    tasks: List[SocialTask] = []

    tasks.append(_t(w, 0, "Vik.so", "Article: The Book Is Here — AI and Leadership in Security"))
    tasks.append(_t(w, 1, "Vik.so", "Article: 5 Ideas From the Book That Will Change How You Think About Your Role"))
    tasks.append(_t(w, 2, "Vik.so / Downloadable", "Publish: Book Companion — First Chapter Free (email magnet)"))
    tasks.append(_t(w, 2, "Email", "Blast: Book launch to Vik.so list", depends="List + ESP ready"))

    tasks += [
        _t(w, 3, "LinkedIn", "Long-form launch post — personal story + book + lessons"),
        _t(w, 3, "LinkedIn", "Carousel: 5 big ideas from the new book"),
        _t(w, 4, "LinkedIn", "Carousel: Book excerpt — CISO of 2027"),
        _t(w, 5, "LinkedIn", "Text: If you've followed 12 weeks — this book is for you + link"),
        _t(w, 5, "LinkedIn", "Carousel: 100 heads of security shaped this book"),
    ]

    for sub in ("r/CISO", "r/cybersecurity", "r/governance"):
        tasks.append(_t(w, 4, "Reddit", f"AMA — book on AI + security leadership ({sub})"))

    tasks.append(_t(w, 6, "X/Twitter", "Launch thread — why book, what's in it, who it's for"))
    tasks.append(
        _t(w, 6, "X/Twitter", "Daily replies & engagement (launch week — stay present)", depends="High volume ok if authentic")
    )
    tasks.append(_t(w, 6, "Reddit", "Daily comment engagement — all target subs"))
    tasks.append(
        _t(w, 6, "Measurement", "Sunday metrics sweep — launch week pulse", depends="Spike expected; watch signups/DMs")
    )
    return tasks


def _weeks_17_20() -> List[SocialTask]:
    tasks: List[SocialTask] = []

    tasks += [
        _t(17, 0, "Vik.so", "Post: I've been building something — co-creation cohort is now open (no product name)"),
        _t(17, 2, "LinkedIn", "Thought leadership: What I've learned building in stealth — 5 lessons"),
        _t(17, 4, "X/Twitter", "Thread: Stealth lessons + invitation to cohort (tone: builder)"),
        _t(17, 6, "Measurement", "Sunday metrics sweep"),
    ]

    tasks += [
        _t(18, 0, "Reddit", "Post: Simplify IS — first 50 testers — offer: 3 months free, feedback, 40% off forever"),
        _t(18, 1, "X/Twitter", "Thread: Soft beta open — journey + offer + link"),
        _t(18, 2, "Email", "Blast: Early access open — cohort/project link", depends="Landing page live"),
        _t(18, 4, "LinkedIn", "Optional: stay thought-leadership only OR begin careful product mention per your firewall plan"),
        _t(18, 6, "Measurement", "Sunday metrics sweep — beta fills"),
    ]

    tasks += [
        _t(
            19,
            1,
            "LinkedIn",
            "Conversion push — product mentions if firewall down; else keep funnel via email/Reddit/X only",
            depends="Career transition timing vs employer policy",
        ),
        _t(19, 3, "Email", "Conversion sequence / reminder to list", depends="Beta capacity"),
        _t(19, 6, "Measurement", "Sunday metrics sweep"),
    ]

    tasks += [
        _t(20, 0, "Vik.so", "Public launch narrative — ecosystem: book + product + community", depends="Launch checklist"),
        _t(20, 1, "LinkedIn", "Public launch — full announcement (per policy)"),
        _t(20, 2, "Reddit", "Public launch — communities"),
        _t(20, 3, "X/Twitter", "Public launch — threads + RTs from champions"),
        _t(20, 4, "Email", "Public launch blast"),
        _t(20, 6, "Measurement", "Sunday metrics sweep — launch retrospective"),
    ]
    return tasks


def all_social_tasks() -> List[SocialTask]:
    out: List[SocialTask] = []
    for d in W_DATA:
        if d["w"] == 12:
            continue
        out += _expand_standard(d)
    out += _week12_book_launch()
    out += _weeks_17_20()
    # Sort by week, then day, then channel for stable ordering
    ch_order = {
        "Vik.so": 0,
        "Vik.so / Downloadable": 1,
        "LinkedIn": 2,
        "Reddit": 3,
        "X/Twitter": 4,
        "Email": 5,
        "Measurement": 6,
    }
    out.sort(key=lambda t: (t.week, t.day_offset, ch_order.get(t.channel, 99), t.title[:40]))
    return out


def due_date(t: SocialTask) -> date:
    return week_start(t.week) + timedelta(days=t.day_offset)
