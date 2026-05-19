# Simplify IS — Master UI/UX Decisions Reference
## Complete Consolidated Specification for Claude Code
### Version: April 2026 | All Decisions Locked | Single Source of Truth

---

## HOW TO USE THIS DOCUMENT

This file captures **every UI/UX decision** made during the Agent 10 planning phase for Simplify IS. It covers pre-login pages (reference only — already built), and all post-login experiences (the build target). Use this as the primary reference document when completing the Claude Code polish pass on top of Cursor's initial build.

**Structure:**
1. Product vision, non-negotiables, tone
2. Tech stack (locked — do not revisit)
3. Design system (Earthen Brutalism — colours, typography, elevation)
4. Left sidebar menu architecture (canonical navigation)
5. Header architecture (including user profile + notifications)
6. Onboarding flow (4 steps)
7. Initialisation Screen (first-login entry picker)
8. Industry Dashboard (the visual north star)
9. Framework View
10. Risk View (2 stages)
11. Assessment (2 paths)
12. Maturity Roadmap
13. Progress & Milestones
14. Organisation Settings (admin only)
15. User Profile Modals
16. Cypher Chat Modal
17. Empty states, error states, responsive behaviour
18. Australian English rules + copy standards
19. Accessibility standards
20. Security + architectural rules

---

## 1. PRODUCT VISION & NON-NEGOTIABLES

**What we are building:**
Simplify IS is a commercial SaaS AI-driven security assessment platform. Users interact conversationally with **Cypher** (their AI Security Consultant) to complete structured ISO 27001:2022, NIST CSF 2.0, and APRA CPS 234 assessments. The platform learns about each organisation over time, detects contradictions, and continuously surfaces maturity gaps.

**Target market:** Australia first (APRA, ASD Essential Eight), then global. Security managers, CISOs, GRC professionals at SMBs.

**Two non-negotiables — every decision:**
1. **World-class product quality** — best AI-driven security assessment tool ever built. No shortcuts.
2. **Security first, always** — enterprise-grade from day one. Zero critical findings when pen-tested.

**Voice/tone:**
- Warm, human, consultant-like
- Australian English throughout
- Formal but accessible (target audience: security leadership, CISOs)
- Never patronising
- Never uses the word "Maturity" in conversation with users (uses plain language)

---

## 2. TECHNICAL STACK (ALL LOCKED)

| Layer | Technology |
|-------|-----------|
| Base Template | github.com/Razikus/supabase-nextjs-template (adapt, do not rewrite) |
| Frontend + API | Next.js 14 App Router, TypeScript strict, Tailwind CSS |
| Database + Auth | Supabase (Postgres, RLS, Storage) |
| AI Primary | Claude API `claude-sonnet-4-20250514` |
| AI RAG Resolver | Claude API `claude-haiku-4-5-20251001` (semantic control ID mapping only) |
| Visualisation | D3.js v7 (radar, timeline, bars) + Recharts (sparklines) |
| Animations | Framer Motion |
| Email | Resend |
| Payments | Stripe |
| Deployment | Vercel (MVP), AWS migration post-launch |

**Key locked decision:** Fine-tuned LLaMA REMOVED from inference path entirely. All AI goes through Claude API + Supabase RAG.

**Three-layer architecture (never violate):**
```
INTERNET → /api/v1/* (JWT auth, rate limit) → /api/internal/* (ORCHESTRATION_SECRET) → Supabase + Claude API
```

---

## 3. DESIGN SYSTEM — EARTHEN BRUTALISM

### 3.1 Philosophy
"The Digital Curator" — treat the interface as a physical archive, not a screen. Permanent, architectural, authoritative. Elements feel carved from stone. Glassmorphism simulates light filtering through a dark sanctuary. No cheap trends.

### 3.2 Dark Mode Tokens (Primary)
```css
--background:                 #141311
--surface-container-low:      #1C1B19
--surface-container:          #211F1D
--surface-container-high:     #2B2A28
--surface-container-highest:  #363432
--surface-bright:             #3A3937
--on-surface:                 #E6E2DE
--primary:                    #FFB59C
--on-primary:                 #5C1900
--secondary:                  #CDC6BA
--outline:                    #A88A80
--inverse-primary:            #AB3600

/* Semantic */
--success:                    #10B981
--warning:                    #F59E0B
--danger:                     #EF4444

/* Glows */
--glow-brand:    0 0 20px rgba(235,94,40,0.15)
--glow-cyan:     0 0 20px rgba(0,212,255,0.15)
--glow-violet:   0 0 20px rgba(124,58,237,0.15)
```

### 3.3 Light Mode Tokens
```css
--background:                 #FFFCF2
--surface-container-low:      #FBF8EF
--surface-container:          #F5F2E9
--surface-container-high:     #F0EDE2
--surface-container-highest:  #E6E2D5
--surface-bright:             #FFFCF2
--on-surface:                 #1A1917
--primary:                    #EB5E28
--on-primary:                 #FFFFFF
--secondary:                  #4F4B42
--outline:                    #85746E
--inverse-primary:            #EB5E28
```

### 3.4 Typography
Triple-typeface approach (custom-commissioned feel):

| Role | Font | Usage | Settings |
|------|------|-------|----------|
| Display & Headlines | **Raleway** (700, 800, 900) | Large editorial moments, hero text | Tight tracking -0.02em |
| Subheadings & Labels | **Josefin Sans** (300–700) | Labels, metadata, nav items | Uppercase, tracking +0.1em |
| Body & Utility | **Montserrat** (300–600) | Long-form reading, body copy | Line-height 1.6 |
| Code / Mono | **Geist Mono** (400, 700) | IDs, scores, metadata | Small all-caps |

**Signature pattern:** Oversized faded background numbers (01, 02, 03) as section labels.

### 3.5 Elevation & Depth

**The "No-Line" Rule:** 1px solid borders for sectioning are **strictly prohibited**. Structural boundaries defined through background colour shifts only.

**Surface Hierarchy (layers):**
```
Layer 0 — base:         surface-base (#141311)
Layer 1 — inset:        surface-container-low (#1C1B19)
Layer 2 — elevated:     surface-container-high (#2B2A28)
Layer 3 — active:       surface-bright (#3A3937)
```

**Ambient shadows (floating elements only):**
```css
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
```

**Ghost Border (only when accessibility requires):**
```css
border: 1px solid rgba(168, 138, 128, 0.15);
/* NEVER use 100% opaque, high-contrast borders */
```

**Glass effect (nav, modals, popovers):**
```css
background: rgba(20,19,17,0.80);  /* dark */
background: rgba(255,252,242,0.85); /* light */
backdrop-filter: blur(12px);
```

**Primary CTA glow:**
```css
box-shadow: 0 0 20px rgba(235,94,40,0.15);
```

### 3.6 Animation Principles
- All transitions: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Scroll-triggered fade-ins on section entry
- Button micro-interactions: hover glow, active scale
- Score animations: count-up + green/red flash, ALWAYS paired with Cypher message
- Domain complete overlay: score animation + Cypher message + subtle confetti
- Respect `prefers-reduced-motion` on ALL animations (disable transforms, fade only)
- Target 60fps — no jank

### 3.7 Do's and Don'ts
**Do:**
- Use overlapping elements (break container lines for editorial look)
- Lean into Warm Stone (`#CCC5B9` dark / `#4F4B42` light) for secondary text
- Use Geist Mono in small all-caps for metadata
- Allow dead space — don't fill every column
- Use surface colour shifts (not borders) to separate regions

**Don't:**
- Use standard 12-column grids everywhere (asymmetry is the signature)
- Use pure black (#000000) — always `#141311` (warmth retained)
- Use sharp 90° corners — rounded DEFAULT (0.25rem) or md (0.375rem)
- Use 1px solid borders for sectioning — ghost border only as fallback

---

## 4. LEFT SIDEBAR MENU ARCHITECTURE

### 4.1 Final Menu Structure (Locked)
```
┌─────────────────────┐
│ Simplify IS (logo)  │ ← clickable: logged-in → /dashboard/industry
│                     │                  not logged-in → /
├─────────────────────┤
│                     │
│ ◇ DASHBOARDS  ▾     │ ← collapsible parent
│   │ Industry    ▮   │ ← sub-items (indented, orange bar when active)
│   │ Framework       │
│   │ Risk            │
│                     │
│ ◈ ASSESSMENT        │ ← top-level, no subs
│                     │
│ ◆ MATURITY ROADMAP  │ ← top-level, no subs
│                     │
│ ◐ PROGRESS &        │ ← top-level, no subs
│   MILESTONES        │
│                     │
│ ◑ ORGANISATION      │ ← ADMIN ONLY, collapsible
│   SETTINGS    ▾     │
│   │ Users           │
│   │ Preferences     │
│   │ Billing         │
│   │ Audit           │
│                     │
└─────────────────────┘
```

### 4.2 Dimensions
- **Desktop:** Width 260px, fixed left, full viewport height minus header + footer
- **Tablet:** Width 220px
- **Mobile:** Slide-out drawer (280px wide) with overlay

### 4.3 Styling
- Background: `surface-container-low` (no visible right border — use surface shift)
- Each top-level item: 48px tall, 16px left padding
- Icon (20×20px stroke 1.5px, Lucide) + Label (Josefin Sans uppercase, tracking +0.08em, 13px)
- Sub-items: indented +20px, 40px tall, smaller font (12px)

### 4.4 Icons (Lucide)
- Dashboards → `LayoutGrid`
- Assessment → `ClipboardCheck`
- Maturity Roadmap → `Route` or `Map`
- Progress & Milestones → `TrendingUp`
- Organisation Settings → `Building2`

### 4.5 Active State
- **3px vertical bar on left edge** in `primary` colour (#EB5E28 light / #FFB59C dark)
- Text transitions to `on-surface` (brighter)
- Background subtly shifts to `surface-container-high`
- Transition: 200ms ease
- Same 3px bar pattern for sub-items (aligned to sub-item's left padding, not parent's)

### 4.6 Hover State (Inactive)
- Background → `surface-container` (subtle lift)
- Text slightly brighter

### 4.7 Collapsible Behaviour

**Dashboards (expanded by default):**
- Chevron `▾` right of label when expanded; `▸` when collapsed
- Click parent label → toggle expand/collapse
- When expanded → sub-items visible

**Organisation Settings:**
- Identical pattern to Dashboards

### 4.8 Auto-Expand/Collapse Rules (CRITICAL)

- Click any Dashboards sub-item (Industry/Framework/Risk) → Dashboards stays expanded; Organisation Settings (if expanded) collapses
- Click Assessment / Maturity Roadmap / Progress & Milestones → BOTH Dashboards AND Organisation Settings auto-collapse
- Click any Organisation Settings sub-item → Org Settings stays expanded; Dashboards collapses
- Click top-level "Dashboards" label while collapsed → expands AND navigates to `/dashboard/industry` (default)
- Click top-level "Organisation Settings" label while collapsed → expands AND navigates to `/organisation/users` (default)

### 4.9 Admin-Only Visibility
- "Organisation Settings" entry **completely hidden from rendered DOM** when `user.role !== 'admin'` (not just CSS-hidden)
- Direct URL to `/organisation/*` as non-admin → redirect to `/dashboard/industry` (if authenticated) or `/404`

---

## 5. HEADER ARCHITECTURE

### 5.1 Dimensions
- Desktop: 64px height
- Tablet: 56px height
- Mobile: 52px height
- Sticky top, full-width, glassmorphic

### 5.2 Styling
```css
/* Dark mode */
background: rgba(20,19,17,0.80);
/* Light mode */
background: rgba(255,252,242,0.85);
backdrop-filter: blur(12px);
/* No visible border — soft gradient fade on bottom edge:
   transparent → outline-colour-at-10% → transparent */
```

### 5.3 Contents (Left to Right)

**1. Logo — "Simplify IS"**
- Raleway 800, wordmark
- Clickable:
  - Authenticated → `/dashboard/industry`
  - Not authenticated → `/` (marketing home)

**2. Spacer (flex-grow)**

**3. Notification Bell**
- Icon button, 40×40px
- Badge top-right of bell (primary bg, white number, only visible if count > 0)
- Click → opens `NotificationPopover`
  - Absolute-positioned, 360px wide, max-height 480px, scrollable
  - Header: "Mark all read" link
  - Each entry: icon + title + short description + timestamp + unread dot

**4. User Avatar**
- Avatar image (or initials circle if none), 40×40px
- Click → opens `UserProfileDropdown`
  - Absolute-positioned, 240px wide
  - Items top-to-bottom:
    - Avatar + full name + email (read-only header)
    - Divider (ghost)
    - "Edit Profile"
    - "Change Password"
    - "MFA Settings"
    - Divider
    - "Logout" → signOut → redirect to `/`

### 5.4 Accessibility
- All icon buttons have aria-labels
- Dropdowns keyboard-navigable (Arrow keys, Esc)
- Focus traps when dropdowns open
- Skip-to-content link in header

---

## 6. ONBOARDING FLOW

### 6.1 Trigger & Routing
- **Trigger:** First authenticated login AND user is org admin AND `organizations.onboarding_completed_at IS NULL`
- **No skip mechanism.** User can close window; progress persists.
- **Invited team members (non-admin):** Never see onboarding; go straight to `/dashboard/industry`
- Routes:
  - `/onboarding/step-1` — Name Your AI Consultant
  - `/onboarding/step-2` — Set Up Your Organisation
  - `/onboarding/step-3` — Choose Your Frameworks
  - `/onboarding/step-4` — Your Workspace is Ready

### 6.2 Onboarding Shell (Different from Dashboard)
- **Minimal header:** Logo (left) + "Step N of 4" + 4-segment progress bar (right)
- **No left sidebar**
- **No user profile dropdown**
- **Centered card:** max-width 720px, rounded 12px, padding 48px
- **Background:** `surface-container-low` (subtly textured dark)
- **Same footer as canonical** (minimal text)

### 6.3 Step 1 — Name Your AI Consultant

**Card contents:**
```
INITIALISATION                    ──────
(Geist Mono, uppercase, primary, 11px, tracking +0.15em)

Name Your AI Consultant
(Raleway 800, 40px, on-surface, tight tracking)

This is how you'll address your consultant. Every user in your 
organisation will see this name.
(Montserrat 400, 16px, secondary, line-height 1.6)

CONSULTANT'S NAME                            MAX 10 CHARS
(Josefin Sans 500, uppercase, 12px, tracking +0.1em)
┌────────────────────────────────────────────────────┐
│ e.g. Cypher                                        │
└────────────────────────────────────────────────────┘
(surface-container-low, bottom ghost border only)

┌──────────────────────────────────────────┐
│  INITIALISE IDENTITY           →         │
└──────────────────────────────────────────┘
(Primary button, full-width, 56px tall, glow)

🔒  SECURITY PROTOCOL VERIFIED
(Geist Mono, uppercase, 11px, outline colour, centred below)
```

**Rules:**
- Input max: 10 characters (hard limit)
- Allowed characters: letters, numbers, space, hyphen, underscore, apostrophe
- Emoji/special characters rejected with inline hint
- If blank on submit → defaults to "Cypher" silently
- Button disabled/spinner on submit
- POST `/api/v1/onboarding/consultant-name` with `{ consultantName }`
- Backend stores in `users.agent_name`
- On success → navigate to Step 2

**CRITICAL — Emoji Indicator:**
- Throughout the app, the agent name renders with a trailing robot emoji 🤖
- Example: User enters "Sarah" → displayed as **"Sarah 🤖"**
- Chat button: **"Ask Sarah 🤖"**
- Chat header: "Sarah 🤖"
- Review button: "Review with Sarah 🤖"
- Input fields and display areas must accommodate full name (10 chars) + emoji + surrounding text (reserve ~15–20 char width)

### 6.4 Step 2 — Set Up Your Organisation

**Card contents:**
```
ORGANISATIONAL IDENTITY           ──────

Set Up Your {accent}Organisation{/accent}
(Raleway 800, 40px; second half in primary italic)

Calibrate your security posture and resource allocation by 
defining your organisation's scope within the framework.
(Montserrat 400, 16px, secondary, max-width 560px, centred)

ORGANISATION LEGAL NAME
┌─────────────────────────────────────────────────────┐
│ e.g. Aether Dynamics Corp                           │
└─────────────────────────────────────────────────────┘

INDUSTRY SECTOR               HEADQUARTERS COUNTRY
┌─────────────────────┐       ┌─────────────────────┐
│ Select Industry  ▾  │       │ Select Countries ▾  │
└─────────────────────┘       └─────────────────────┘
(50/50 column, 24px gap)

WORKFORCE SCALE
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Small    │ │ Medium   │ │ Large    │ │ Enterprise│
│ 1–50 FTE │ │ 51–250   │ │ 251–1000 │ │ 1000+ FTE │
│ Lean     │ │ Dept.    │ │ Global   │ │ Complex   │
│ agility  │ │ isolation│ │ multi-   │ │ audit     │
│ protocols│ │          │ │ tenant   │ │ rigour    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
(4-column grid, each tile ~160×140px, 16px gap)

──────────────────────────────────────────────────

[← BACK]                    [CONTINUE SETUP  →]
```

**Fields (all required):**

1. **Organisation Legal Name** — text input, 2–100 characters
2. **Industry Sector** — closed dropdown:
   - Financial Services (Banking, Insurance, Superannuation)
   - Healthcare
   - Technology / Software
   - SaaS / Professional Services
   - Government / Public Sector
   - Manufacturing
   - Retail / E-commerce
   - Education
   - Construction
   - Telecommunications
   - Media / Entertainment
   - Energy / Utilities
   - Hospitality / Travel
   - Real Estate
   - Legal Services
   - Other
3. **Headquarters Countries** — autocomplete multi-select (type-ahead filter). At least one required. Options (curated list of ~45):
   ```
   Australia, New Zealand, United Kingdom, Ireland, United States, Canada,
   Germany, France, Netherlands, Belgium, Luxembourg, Switzerland, Austria,
   Sweden, Norway, Denmark, Finland, Italy, Spain, Portugal, Poland,
   Czech Republic, Japan, South Korea, Singapore, Hong Kong, Taiwan, India,
   United Arab Emirates, Saudi Arabia, Qatar, Israel, South Africa, Brazil,
   Mexico, Argentina, Chile, Colombia, Malaysia, Thailand, Indonesia,
   Philippines, Vietnam, Turkey, Other
   ```
   Alphabetical order.
4. **Workforce Scale** — 4 tile dials (NOT radio buttons). Larger touch target.
   - Small: 1–50 FTE, "Lean agility protocols"
   - Medium: 51–250 FTE, "Departmental isolation"
   - Large: 251–1000 FTE, "Global multi-tenant"
   - Enterprise: 1000+ FTE, "Complex audit rigour"

**Validation:**
- All 4 fields required
- "Continue Setup" disabled until all valid
- No inline errors on blur — just keep button disabled
- If server error on submit → banner at top of card: "We couldn't save your organisation details. Please try again."

**Layout:** 2-column row for Industry + Country (50/50)

**Submit:**
- POST `/api/v1/onboarding/organisation` with `{ name, industry, countries: string[], workforceScale: 'small'|'medium'|'large'|'enterprise' }`
- Store in `organizations` table
- On success → Step 3

**Back button:** Returns to Step 1. Previous inputs persist (load from DB on mount).

### 6.5 Step 3 — Choose Your Frameworks

**Card contents:**
```
INITIALISATION                    ──────

Choose Your Frameworks
(Raleway 800, 40px)

Identify the regulatory standards {agent-name} 🤖 should 
prioritise for your initial assessment.
(Montserrat 400, 16px, secondary; agent-name substituted dynamically)

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [shield-icon]│ │ [shield-icon]│ │ [bank-icon]  │
│              │ │              │ │              │
│ ISO 27001:   │ │ NIST CSF     │ │ APRA CPS 234 │
│ 2022         │ │ 2.0          │ │              │
│              │ │              │ │              │
│ International│ │ Framework    │ │ Australian   │
│ standard for │ │ for managing │ │ Prudential   │
│ information  │ │ cybersecurity│ │ Regulation   │
│ security     │ │ risk and     │ │ Authority    │
│ management   │ │ improving    │ │ standard for │
│ systems      │ │ infra.       │ │ info sec.    │
│ (ISMS).      │ │ resilience.  │ │              │
│              │ │              │ │              │
│ [GLOBAL]     │ │ [ESSENTIALS] │ │ [AUSTRALIA]  │
└──────────────┘ └──────────────┘ └──────────────┘
 selected         selected         unselected

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [icon]       │ │ [icon]       │ │ [icon]       │
│ SOC 2 Type II│ │ PCI DSS v4.0 │ │ HIPAA        │
│              │ │              │ │              │
│ [short desc] │ │ [short desc] │ │ [short desc] │
│              │ │              │ │              │
│ [COMING SOON]│ │ [COMING SOON]│ │ [COMING SOON]│
└──────────────┘ └──────────────┘ └──────────────┘
 disabled         disabled         disabled

ⓘ  You can modify your framework selection and add more frameworks 
   in Organisation Settings. Changes can be made once every 30 days.
(secondary, 13px, centred)

                             [CONFIRM SELECTION  →]
```

**Framework Selection Logic (CRITICAL):**
- **Defaults pre-selected:** ISO 27001:2022 + NIST CSF 2.0 (cannot be deselected — they're the baseline)
- **APRA CPS 234:** Optional, toggleable on/off
- **SOC 2 / PCI DSS / HIPAA:** Disabled, "COMING SOON" pill
- **ISO + NIST = included in basic plan (no extra cost)**
- **APRA CPS 234 = paid add-on** (pricing info NOT shown here — just selection)

**Tile states:**
- Selected: primary 2px border + subtle primary glow + ✓ checkmark top-right
- Unselected: ghost border, no glow
- Disabled: greyed out, opacity 0.5, "COMING SOON" pill top-right, cursor not-allowed
- Hover (enabled): subtle lift to `surface-bright`

**Impact of Framework Selection:**
- Frameworks selected = tabs on Framework View dashboard
- Select ISO + NIST only → 2 tabs
- Select ISO + NIST + APRA → 3 tabs
- Each tab shows controls + maturity specific to that framework

**Submit:**
- POST `/api/v1/onboarding/frameworks` with `{ selected: ['iso_27001_2022', 'nist_csf_2_0', ...] }`
- Backend writes to `organizations.selected_frameworks` (JSONB array)
- On success → Step 4

### 6.6 Step 4 — Your Workspace is Ready (Portal Orientation)

**Card contents (larger card, max-width 960px):**
```
ORIENTATION                       ──────

Your Workspace is Ready
(Raleway 800, 40px)

Use the sidebar to navigate between assessment and governance 
modules.
(Montserrat 400, 16px, secondary)

┌─────────────────┐ ┌─────────────────┐
│ [LayoutGrid]    │ │ [ClipboardCheck]│
│                 │ │                 │
│ Dashboards      │ │ Assessment      │
│                 │ │                 │
│ View your real- │ │ Collaborate with│
│ time maturity   │ │ {agent-name} 🤖 │
│ across Industry,│ │ to complete     │
│ Framework, and  │ │ deep-dive       │
│ Risk views.     │ │ security        │
│                 │ │ assessments.    │
└─────────────────┘ └─────────────────┘

┌─────────────────┐ ┌─────────────────┐
│ [Route]         │ │ [TrendingUp]    │
│                 │ │                 │
│ Maturity        │ │ Progress &      │
│ Roadmap         │ │ Milestones      │
│                 │ │                 │
│ Track ongoing   │ │ Review historic │
│ obligations and │ │ maturity trends │
│ uplift actions. │ │ and celebrate   │
│                 │ │ wins.           │
└─────────────────┘ └─────────────────┘

┌─────────────────┐
│ [Building2]     │
│                 │
│ Organisation    │
│ Settings        │
│                 │
│ Manage team,    │
│ preferences,    │
│ billing, audit. │
└─────────────────┘

          [LAUNCH APPLICATION  →]

🔒  SECURE SESSION ESTABLISHED  ·  AUTH: 256-BIT
```

**Tile structure:**
- **5 tiles matching left sidebar exactly:** Dashboards, Assessment, Maturity Roadmap, Progress & Milestones, Organisation Settings
- Layout: 2×2 grid with 5th tile centred below, OR 3+2 layout (use cleanest fit per reference)
- 24px gap between tiles
- Each tile: Icon + Title + Conceptual description (1-2 sentences, plain language)
- Tiles are **informational, not navigational** — hovering shows subtle glow but clicking does not navigate
- Only "Launch Application" proceeds

**Launch Application:**
- POST `/api/v1/onboarding/complete` → backend sets `organizations.onboarding_completed_at`
- On success → navigate to `/dashboard/initialisation` (NOT directly to industry dashboard)

---

## 7. INITIALISATION SCREEN (First-Login Entry Picker)

**Route:** `/dashboard/initialisation`

**Trigger:** Immediately after onboarding Step 4 launch. **Appears exactly once** for first-time admin only.

**Persistence:** Set `users.has_seen_initialisation = true` on any tile click. Subsequent visits redirect to `/dashboard/industry`.

**Layout:** Uses **canonical DashboardLayout** (sidebar, header, footer all present). Content panel shows a centred hero.

**Content:**
```
                    [hexagonal icon - orange accent]
                    
                    INITIALISATION COMPLETE
                    (Geist Mono, uppercase, primary, 12px)
                    
                    Your environment is 
                    initialised.
                    (Raleway 800, 56px, "initialised." in primary italic)
                    
                    I am ready to begin the consultation. Where would 
                    you like to start?
                    (Montserrat 400, 18px, secondary)

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     01 /    │    │     02 /    │    │     03 /    │
│   DASHBOARD │    │   CONSULT   │    │INTELLIGENCE │
│ [grid icon] │    │ [shield]    │    │ [map]       │
│             │    │             │    │             │
│ Explore     │    │ Begin       │    │ Map Industry│
│ Mission     │    │ Assessment  │    │ Risks       │
│ Control     │    │             │    │             │
│             │    │ Start a deep│    │ Review and  │
│ Jump to your│    │ dive        │    │ prioritise  │
│ Dashboard to│    │ consultation│    │ common      │
│ see your    │    │ for your    │    │ threat      │
│ current     │    │ selected    │    │ vectors from│
│ maturity    │    │ frameworks. │    │ our global  │
│ baseline.   │    │          →  │    │ risk library│
└─────────────┘    └─────────────┘    └─────────────┘
 (default)          (primary/active)   (default)
```

**Tile behaviour:**
- 3 tiles equal width, single row desktop. Stack to 1-column on mobile.
- **Centre tile ("Begin Assessment") visually elevated:** primary border, glow, arrow icon
- Each tile clickable:
  - "Explore Mission Control" → `/dashboard/industry`
  - "Begin Assessment" → `/assessment`
  - "Map Industry Risks" → `/dashboard/risk`
- On click: PATCH `/api/v1/users/me { hasSeenInitialisation: true }` → navigate

**Purpose:** Prevents users landing on empty dashboard with zeros. Guided entry point.

---

## 8. INDUSTRY DASHBOARD ⭐ (VISUAL NORTH STAR)

**Route:** `/dashboard/industry`

**This is the canonical visual template.** All other screens inherit its vocabulary (typography, spacing, elevation, colour application).

**Reference PNG:** `/Users/vik/Documents/Code/simplify-is/stitch_output/Dashboard - hero page/`

### 8.1 Core Concept
**You vs. Your Peers.** Industry View shows YOUR maturity compared against anonymised industry benchmarks. NOT a personal dashboard — focused on comparative/competitive intelligence.

### 8.2 Layout (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────┐
│ Page title: "Industry View"  (Raleway 800, 32px, on-surface)   │
│ Subtitle: "You vs. your peers — real-time maturity comparison   │
│           based on NIST CSF 2.0."                               │
│                                                                 │
│                                         [toggle] Share data ⓘ   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────┐  ┌───────────────────────┐  │
│  │                               │  │ MATURITY SCORE        │  │
│  │   [D3 RADAR CHART]            │  │                       │  │
│  │   6 axes: GV, ID, PR,         │  │    2.8 / 5.0          │  │
│  │   DE, RS, RC                  │  │    (big number, 64px) │  │
│  │                               │  │                       │  │
│  │   Two polygons overlaid:      │  │ PEER PERCENTILE       │  │
│  │   · Your maturity (primary)   │  │ Top 34% of similar    │  │
│  │   · Industry avg (outline)    │  │ Technology orgs       │  │
│  │                               │  │                       │  │
│  │   Interactive: hover axis     │  │ BENCHMARK GAP         │  │
│  │   shows tooltip with scores   │  │ -0.4 behind peers     │  │
│  │                               │  │                       │  │
│  │                               │  └───────────────────────┘  │
│  └───────────────────────────────┘                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐│
│  │ YOUR STRENGTHS       │  │ STRATEGIC PRIORITY               ││
│  │                      │  │                                  ││
│  │ Detect (DE)          │  │ Top 3 controls trailing peers:   ││
│  │ 3.8 — +0.6 vs peers  │  │                                  ││
│  │                      │  │ • Governance (GV.OC-01)          ││
│  │ Protect (PR)         │  │   You: 2.1  Industry: 3.5        ││
│  │ 3.4 — +0.2 vs peers  │  │                                  ││
│  │                      │  │ • Access Control (GV.AA-01)      ││
│  │                      │  │   You: 2.3  Industry: 3.2        ││
│  │                      │  │                                  ││
│  │                      │  │ • Incident Response (RS.AN-01)   ││
│  │                      │  │   You: 1.8  Industry: 2.9        ││
│  │                      │  │                                  ││
│  │                      │  │ [GENERATE REMEDIATION PLAN →]    ││
│  └──────────────────────┘  └──────────────────────────────────┘│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐│
│  │ SECURITY BRIEFING    │  │ YOUR PROGRESS                    ││
│  │                      │  │                                  ││
│  │ "AI Security Trend:  │  │ [sparkline showing ALL past      ││
│  │ 73% of SaaS orgs now │  │  assessments]                    ││
│  │ require AI           │  │                                  ││
│  │ governance controls" │  │ Last assessment: 3 days ago      ││
│  │                      │  │ Maturity: 2.8 (↑ 0.2 since last) ││
│  │ [READ MORE →]        │  │                                  ││
│  │                      │  │ [VIEW FULL HISTORY →]            ││
│  └──────────────────────┘  └──────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

[Floating Cypher button bottom-right: "Ask Sarah 🤖"]
```

### 8.3 Consent Toggle (Top Right of Page)
- **Position:** Above the radar chart, right side of the page
- **Label:** "Share anonymised maturity data"
- **Info icon ⓘ** with tooltip:
  > "Your anonymised security maturity insights help us build more accurate industry benchmarks. Your organisation name, controls, and specific data remain completely private."
- **Default state: ON** (opted-in)
- **Behaviour:** Click toggles state → `PATCH /api/v1/users/me { shareAnonymisedData: boolean }`
- **Visual:** ON = primary bg with knob right; OFF = outline bg with knob left

### 8.4 Top Section — Radar + Metrics Panel

**D3 Radar Chart (Left, 60% width):**
- 6 axes, each labelled with NIST function name: Govern, Identify, Protect, Detect, Respond, Recover
- **Two polygons:**
  - "Your Maturity" — primary colour fill 30%, stroke primary 100%
  - "Industry Benchmark" — outline colour fill 15%, stroke outline 60%, dashed stroke
- **Interactive:**
  - Hover axis label → tooltip shows your score, peer score, delta
- Legend below chart with coloured swatches + labels
- **Animated entrance:** polygon morphs from centre outward on mount (800ms ease)
- Respect reduced-motion: skip morph, fade in

**Metrics Panel (Right, 40% width):**
- Three vertically-stacked tiles (each ~120px tall):
  1. **Maturity Score** — huge number (64px), colour-coded:
     - Red if <2.0, Amber 2.0–3.5, Green >3.5
  2. **Peer Percentile** — "Top 34% of similar Technology orgs" (dynamically uses user's industry)
  3. **Benchmark Gap** — "-0.4 behind peers" (red if negative, green if positive, neutral if zero)

### 8.5 Middle Row — Strengths + Strategic Priority

**Two tiles side-by-side (50/50, 24px gap)**

**Your Strengths Tile:**
- Shows top 2 domains where user exceeds peer average
- Each entry: domain name + score + delta from peers
- Green ↑ arrow + "vs peers" label

**Strategic Priority Tile:**
- Top 3 controls where user trails peers (gap widest)
- Each entry: control ID + name + your score + industry score
- **Button:** "Generate Remediation Plan" → future Cypher-driven uplift plan (stub for now with toast "Coming soon")

### 8.6 Bottom Row — Security Briefing + Your Progress

**Security Briefing Tile:**
- Rotating advisory from research feed (sourced from Vik's separate research agent)
- Static placeholder acceptable for MVP
- Title + 2–3 sentence advisory + "Read More →" link (stub)

**Your Progress Tile:**
- Sparkline (Recharts) showing ALL past assessment scores over time
- x-axis = date, y-axis = overall maturity
- Text below: "Last assessment: {relative time}" + "Maturity: X (↑ Y since last)"
- CTA: "View Full History →" → Progress & Milestones

### 8.7 Floating Cypher Chat Button
- **Position:** Fixed bottom-right of content panel, 32px from edge
- **Size:** 64×64px circle
- **Background:** Primary gradient (#EB5E28 → #C44A1A)
- **Content:** Agent emoji 🤖
- **Drop shadow:** Ambient, subtle
- **Pulse animation:** 2s loop, scale 1.0 → 1.03 (gentle breathing)
- Respects reduced-motion
- **Hover tooltip (left-aligned):** "Ask {agent-name} 🤖"
- Click → opens Cypher chat modal (Section 16)

### 8.8 Loading State
- Skeleton loaders on mount: radar = grey circle with centre dot, metrics = grey rectangles
- Fetch `GET /api/v1/dashboard/industry` → fade in actual content on response

### 8.9 Empty State (No Assessments Yet)
- Radar shows only the **industry-average polygon** (no user polygon)
- Metrics panel shows "—" instead of scores
- Strengths/Priority tiles: "Complete your first assessment to unlock insights. [Start Assessment →]"
- Progress sparkline: "No assessments yet. [Start your first →]"
- **Cypher chat auto-opens with welcome greeting** (warm, human, consultant-like — orients them to the dashboard, invites conversation)

---

## 9. FRAMEWORK VIEW

**Route:** `/dashboard/framework`

### 9.1 Top Tabs
- One tab per framework the org selected (from `organizations.selected_frameworks`)
- **Default active:** first framework selected at onboarding
- **Tab style:** Pills in a row, primary colour when active
- Example: `[ISO 27001:2022]  [NIST CSF 2.0]  [APRA CPS 234]`

### 9.2 Layout: 30/70 Vertical Split

```
┌─────────────────────────────────────────────────────────────────┐
│ Framework tabs: [ISO 27001:2022] [NIST CSF 2.0] [APRA CPS 234] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TOP 30% — Overview + Summary                                   │
│                                                                 │
│  ┌─────────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │ [framework- │  │ WHAT   │  │ WHAT   │  │ WHAT'S │           │
│  │  specific   │  │ IMPROVED│  │ NEEDS  │  │ BEEN   │           │
│  │  viz]       │  │ ↑      │  │ FOCUS  │  │ IGNORED│           │
│  │ 40% width   │  │ 3      │  │ ↓      │  │ →      │           │
│  │             │  │ ctrls  │  │ 5 ctrls│  │ 2 ctrls│           │
│  └─────────────┘  └────────┘  └────────┘  └────────┘           │
│                      (60% width — 3 cards side by side)         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BOTTOM 70% — Tree + Detail Panel                               │
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐│
│  │ TREE (70% of bottom)     │  │ DETAIL PANEL (30% of bottom) ││
│  │                          │  │                              ││
│  │ [Filter: All|Not Started │  │ GV.OC-01                     ││
│  │  |In Progress|Completed] │  │ Organisational Context       ││
│  │ [Search input]           │  │                              ││
│  │                          │  │ MATURITY: 2.1 / 5.0          ││
│  │ ▾ Governance (GV)        │  │ COVERAGE: 45%                ││
│  │   · GV.OC-01  ▮ 2.1      │  │ ▓▓░░░░░░                     ││
│  │   · GV.OC-02    3.4      │  │                              ││
│  │                          │  │ Control description...       ││
│  │ ▸ Identify (ID)          │  │                              ││
│  │ ▸ Protect (PR)           │  │ Related controls:            ││
│  │ ▸ Detect (DE)            │  │ • ISO A.5.1                  ││
│  │ ▸ Respond (RS)           │  │ • APRA 6.1                   ││
│  │ ▸ Recover (RC)           │  │                              ││
│  │                          │  │ Evidence: [none yet]         ││
│  │                          │  │                              ││
│  │                          │  │ [DISCUSS WITH SARAH 🤖 →]    ││
│  └──────────────────────────┘  └──────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Framework-Specific Visualisations (CRITICAL — Different per framework type)

**NIST CSF 2.0 (Maturity-based):**
- Compact D3 radar chart (same style as Industry View, but **only user's polygon — no peer benchmark**)
- 6 axes for 6 functions
- Maturity scale 0–5

**ISO 27001:2022 (Compliance-based):**
- D3 stacked horizontal bars
- One bar per ISO domain (9 domains)
- Each bar 3 segments: % Compliant (green), % Non-Conformity (red), % Opportunity for Improvement (amber)
- Bar width = proportion

**APRA CPS 234 (Level-based):**
- D3 stacked horizontal bars
- One bar per domain
- Each bar 3 segments: % at Level 2, % at Level 3, % at Level 4
- Colour gradient: Level 2 = muted, Level 3 = mid, Level 4 = primary

**Why different visuals:**
- NIST measures maturity (1–5)
- ISO measures compliance (yes/no + findings)
- APRA uses maturity levels (2, 3, 4)
- Visual distinction helps users understand what they're looking at
- Board-ready reports look sophisticated
- Unified design system underneath (same header, sidebar, palette, typography)

### 9.4 Three Summary Cards

**Top 30% includes 3 side-by-side cards:**

**What Improved:**
- Green ↑ arrow
- Count: "3 controls"
- Top improver: "Access Control (+0.4)"

**What Needs Focus:**
- Red ↓ arrow
- Count: "5 controls"
- Most critical: "Incident Response (-0.2)"

**What's Been Ignored:**
- Grey → flat arrow
- Count: "2 controls"
- Oldest: "Asset Management (No change, 90 days)"

**Card behaviour:**
- Default: 1-line headline (count, arrow, colour)
- Hover: expands to show top 3 details
- Click: filters the tree below to show only those controls

### 9.5 Tree Structure (Bottom Left, 70%)

**Features:**
- Each domain = expandable row
- **Default state:** first domain expanded
- Expanded rows show child controls with:
  - Control ID (Geist Mono)
  - Short name
  - Maturity score (NIST) or compliance status icon (ISO/APRA)
  - Active selection indicator (orange left bar) if clicked
- Hovering a row: subtle surface shift
- Clicking a control row → selects it, detail panel updates instantly (NO modal, NO navigation)
- Multiple domains can be expanded at once
- User can scroll through tree

**Filter row (above tree):**
- Pill buttons: `[All | Not Started | In Progress | Completed]`
- Search input (filters by control ID or name)

### 9.6 Detail Panel (Bottom Right, 30%)

**Fixed width column, scrolls independently of tree.**

Contents for selected control:
- Control ID (Geist Mono, uppercase, large)
- Control name (Raleway, 20px)
- **Maturity** (NIST) or **Status** (ISO/APRA) — big number or status pill
- **Coverage Badge** — percentage + horizontal bar visual (e.g., "45% ▓▓░░░░░░") with tooltip explaining coverage
- Description (full control text from `ft_iso_controls` / `ft_nist_controls`)
- Related controls (clickable — click navigates to that control in its own framework tab)
- Evidence list (if any uploaded)
- N.A. justification (if marked N.A.)
- Last updated timestamp + who updated
- CTA: `[DISCUSS WITH {AGENT-NAME} 🤖 →]` — opens Cypher chat with control pre-loaded as context

### 9.7 Control Coverage (New Concept — Applies Everywhere Controls Shown)
- Captured by Cypher during assessment conversation
- Stored in `control_responses` table
- Example: Control "MFA Enabled" → Coverage 45% = "45% of critical systems have MFA"
- **Visual treatment wherever controls appear:**
  - Maturity score (number) + Coverage percentage (bar/pie)
  - Both inform "control health"
- Shows in Framework View detail panel AND Risk View detail panel

---

## 10. RISK VIEW (2 Stages)

**Route:** `/dashboard/risk`

**On mount:** Fetch `GET /api/v1/dashboard/risk`.
- If `selectedRisks.length === 0` → Show Stage 1
- Otherwise → Show Stage 2

### 10.1 Risk View Core Concept
- NOT a control-driven risk view
- Risk-first thinking: "Here's my risk, here's the mitigating controls and their maturity"
- 20 template risks (stored in Supabase — Vik will upload later)
- Plus custom risks (user-defined)
- Interactive, board-ready (not Excel-like)
- Eventually becomes full risk register

### 10.2 Stage 1 — Risk Selection (Sequential, One-at-a-Time)

**NOT a grid. Tinder-like single-risk-at-a-time flow.**

**Card layout (centred, max-width 640px):**
```
RISK LIBRARY                                        Risk 3 of 20
(Geist Mono, primary, uppercase)        (Geist Mono, secondary)

[progress bar: 3 of 20 segments filled]

────────────────────────────────────────────────────

Customer Data Breach
(Raleway 800, 32px)

Unauthorised access to personally identifiable information (PII) 
or sensitive customer data through technical vulnerabilities, 
social engineering, or insider threats.
(Montserrat 400, 16px, secondary, line-height 1.6)

Does this risk apply to your organisation?

┌─────────────────────────────┐  ┌─────────────────────────┐
│ YES, THIS APPLIES TO ME  →  │  │ NO, NOT APPLICABLE      │
│ (primary button)            │  │ (ghost button)          │
└─────────────────────────────┘  └─────────────────────────┘
```

**After YES clicked (in-card transition):**
```
How are you tracking this risk?

┌─────────────────────┐
│ 🔴 Actively Tracking│ ← high priority
└─────────────────────┘
┌─────────────────────┐
│ 🟡 Concerned but     │ ← medium priority
│    Managing          │
└─────────────────────┘
┌─────────────────────┐
│ ⚪ Aware but Low     │ ← low priority
│    Priority          │
└─────────────────────┘
```

**Priority selected → auto-advance to next risk (400ms transition)**

**"No" path:** No priority selector; auto-advance immediately.

**Progress persistence:**
- Every choice POSTs immediately to `/api/v1/risks/selection` with `{ riskId, applies, priority }`
- If user closes window mid-flow → resume at next unanswered risk

**Completion screen (after risk 20/20):**
```
All 20 risks reviewed.

You selected 12 risks as applicable.
· 3 Actively Tracking
· 6 Concerned but Managing
· 3 Aware but Low Priority

We're mapping these to your selected frameworks now...
[spinner]

[CONTINUE TO RISK DASHBOARD →]
```

- Backend runs risk-to-control mapping via Claude in background
- Once done (or after 3s max) → button activates → navigate to Stage 2

### 10.3 Stage 2 — Risk Dashboard (70/30 Split)

**Left (70%) — Three priority sections (collapsible with chevron):**

```
🔴 ACTIVELY TRACKING (3)
  ┌──────────────────────────────────────────────┐
  │ [▮] Customer Data Breach                     │
  │     Mitigation: LOW (controls avg 2.1)       │
  │     5 related controls                       │
  └──────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────┐
  │     Ransomware Attack                        │
  │     Mitigation: MEDIUM (controls avg 2.9)    │
  │     8 related controls                       │
  └──────────────────────────────────────────────┘
  ...

🟡 CONCERNED BUT MANAGING (6)
  ...

⚪ AWARE BUT LOW PRIORITY (3)
  ...

──────────────────────────────────────────────────
[+ ADD CUSTOM RISK]   [↻ REVIEW RISK LIBRARY AGAIN]
```

**Each risk card:**
- Risk title
- Mitigation strength indicator (LOW/MEDIUM/HIGH based on avg control maturity)
- Related controls count
- Active risk: orange left bar

**Right (30%) — Detail panel (same pattern as Framework View):**
```
Customer Data Breach
PRIORITY: 🔴 Actively Tracking

MITIGATION STRENGTH
▓▓░░░░░░  Low (avg control maturity 2.1 / 5.0)
Action recommended — controls are not providing sufficient 
protection.

RELATED CONTROLS (5)
· GV.AA-01 — Access Control — 2.3 / 5.0 · Coverage 45%
· PR.DS-01 — Data Security — 2.1 / 5.0 · Coverage 60%
· DE.CM-01 — Continuous Monitoring — 1.8 / 5.0 · 30%
· RS.AN-01 — Analysis — 2.4 / 5.0 · 50%
· RC.RP-01 — Recovery Planning — 2.0 / 5.0 · 40%

(Each control row clickable → jumps to Framework View at that control)

[DISCUSS WITH SARAH 🤖 →]

[▸ PROVIDE LIKELIHOOD & IMPACT RATING]  (expands to small form)
```

**Likelihood & Impact form (optional, expandable):**

Helper text:
> "This is optional. Based on your organisation's own risk management framework, provide your assessment of likelihood and impact. This helps us re-rank the risk dashboard more accurately."

- Likelihood: radio (Very Likely / Possible / Unlikely)
- Impact: radio (Critical / Moderate / Minor)
- Button: "Save Rating" → POST `/api/v1/risks/rating`

**Once provided:** Dashboard re-ranks risks by combined score (likelihood × impact). Enables "High likelihood + High impact = Your worst nightmares" visual.

### 10.4 Add Custom Risk
- Modal: textarea (200 chars max) for risk description
- On submit → POST `/api/v1/risks/custom`
- Backend calls Claude to map custom risk to relevant controls
- **Confirmation flow:** Claude responds: "So you're concerned about [X]? I've mapped these controls as relevant: [list]. Does that match your intent?"
- User confirms or edits
- Once confirmed → custom risk appears in selected priority section

### 10.5 Key Design Principles
- Should NOT feel like a compliance dashboard nobody cares about
- Interactive, something users want to come back to
- Gives talking points for board/senior leadership
- Shows where security concerns are materially
- Cypher reorders risks based on assessment signals: "Your worst nightmares first"

---

## 11. ASSESSMENT (2 Paths)

**Routes:**
- `/assessment` — Landing screen (framework tiles)
- `/assessment/{framework}` — Active assessment

### 11.1 Landing Screen

**Content:**
```
Assessment
(Raleway 800, 32px)

Choose a framework to begin or resume your assessment.
(Montserrat, secondary)

┌─────────────────────────────────────┐
│ ISO 27001:2022                      │
│ ─────────────────────────────────── │
│ Status: In Progress                 │
│ Last activity: 3 days ago           │
│                                     │
│ Compliance: 72%                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░          │
│                                     │
│ 3 questions pending Sarah 🤖 review │
│                                     │
│ [RESUME ASSESSMENT]  [REVIEW WITH   │
│                       SARAH 🤖]     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ NIST CSF 2.0                        │
│ ─────────────────────────────────── │
│ Status: Not Started                 │
│ Maturity: — / 5.0                   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░            │
│                                     │
│ [START ASSESSMENT]                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ APRA CPS 234                        │
│ ─────────────────────────────────── │
│ Status: Completed                   │
│ Last activity: 2 weeks ago          │
│                                     │
│ Maturity distribution:              │
│ Level 4: 45% · Level 3: 40% · Lv 2: 15%│
│                                     │
│ [RE-ASSESS]  [REVIEW WITH SARAH 🤖] │
└─────────────────────────────────────┘

ⓘ Already completed an assessment? You can always update a 
  specific control by chatting with Sarah 🤖. Just describe 
  what's changed, and I'll find the right control and update 
  your score.
```

**Tile button logic:**
- Status = **Not Started** → one button: "Start Assessment"
- Status = **In Progress** → two buttons: "Resume Assessment" + "Review with {agent-name} 🤖" (second only if marked questions exist)
- Status = **Completed** → two buttons: "Re-assess" + "Review with {agent-name} 🤖" (second only if marked questions exist)

**Button label MUST use the dynamic agent name.** If user named Cypher as "Sarah" → "Review with Sarah 🤖".

### 11.2 Path 1 — Direct Questions

**Route:** `/assessment/nist_csf_2_0`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ NIST CSF 2.0 Assessment                              × Exit     │
├─────────────────────────────────────────────────────────────────┤
│ Domain progress:                                                │
│ [█████░░░░░] Govern 5/10   Identify 0/8   Protect 0/22 ...      │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│ DOMAIN TREE  │   QUESTION 3 of 7  (Govern > GV.OC-01)           │
│              │                                                  │
│ ▾ Govern     │   Does your organisation have a documented       │
│   · Q1 ✓     │   policy governing access controls?              │
│   · Q2 ✓     │                                                  │
│   · Q3 ▮     │   ┌───────────────────────────────────────┐     │
│   · Q4       │   │ Yes, and it's been reviewed in the    │     │
│   · Q5       │   │ last 12 months                         │     │
│   · Q6       │   └───────────────────────────────────────┘     │
│   · Q7       │                                                  │
│              │   ┌───────────────────────────────────────┐     │
│ ▸ Identify   │   │ Yes, but it hasn't been reviewed      │     │
│              │   │ recently                               │     │
│ ▸ Protect    │   └───────────────────────────────────────┘     │
│              │                                                  │
│ ▸ Detect     │   ┌───────────────────────────────────────┐     │
│              │   │ We have informal practices, no        │     │
│ ▸ Respond    │   │ documented policy                      │     │
│              │   └───────────────────────────────────────┘     │
│ ▸ Recover    │                                                  │
│              │   ┌───────────────────────────────────────┐     │
│              │   │ No, we don't have access control      │     │
│              │   │ policies                               │     │
│              │   └───────────────────────────────────────┘     │
│              │                                                  │
│              │   ── or type your own answer ──                  │
│              │   ┌───────────────────────────────────────┐     │
│              │   │ [textarea — your own answer]           │     │
│              │   └───────────────────────────────────────┘     │
│              │                                                  │
│              │   ┌──────────────┐ ┌───────────────┐            │
│              │   │ SKIP FOR NOW │ │ UNSURE —      │            │
│              │   │              │ │ DISCUSS WITH  │            │
│              │   │              │ │ SARAH 🤖      │            │
│              │   └──────────────┘ └───────────────┘            │
│              │                                                  │
│              │   ┌─────────────┐              ┌──────────────┐ │
│              │   │ ← PREVIOUS  │              │ NEXT →       │ │
│              │   └─────────────┘              └──────────────┘ │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

**Per question:**
- Control ID + control name shown small above question
- Question text (Raleway 600, large)
- 3–5 multiple-choice options (pulled from DB)
- "Type your own answer" textarea below options
- Two secondary actions:
  - "Skip for now" → mark question as `skipped`, proceed
  - "Unsure — discuss with {agent-name}" → mark question as `flagged_for_cypher`, proceed (queued for Path 2)
- Previous / Next navigation

**Questions per domain:** 5–8 questions (sweet spot, not 1, not 20). Claude Code will write these later and store in Supabase.

**Assessment flow:**
- Sequential domain-by-domain (NIST: Govern → Identify → Protect → Detect → Respond → Recover)
- When all questions in a domain are answered (or skipped/flagged) → domain score computed
- Domain-complete overlay: score animation + Cypher message + subtle confetti
- User proceeds to next domain or returns to assessment landing

**Progress persistence:** Every answer POSTs immediately to `/api/v1/assessment/answer`.

**Exit:** "Exit" button top-right → confirmation modal → return to Assessment Landing.

### 11.3 Path 2 — Review with Cypher (Flagged Questions)

**Entered via:** "Review with {agent-name} 🤖" button on assessment tile

**Layout:** **Full content panel takeover** (NOT modal — different from general Cypher chat). Same visual language, but takes over the content area.

**Flow:**
- Cypher loads user's flagged/unsure questions one at a time
- For each question:
  - Cypher explains what it means in plain language
  - Asks follow-up questions
  - Captures context
  - Synthesises an answer based on conversation
- At end of each question:
  - Summary card: "Based on our conversation, I'm scoring this control at 2.4 / 5. Does that sound right?"
  - User: Accept / Edit / Rediscuss
- After all flagged questions answered → return to Assessment Landing

**Why two paths:**
- Structured questions = fast (choose option)
- Uncertain questions = expert explanation (Cypher)
- No pop-up interruption (clean separation)
- Full context captured (what they actually do, not guessing)

**"Exit Review" top-right:** Returns to Assessment Landing.

---

## 12. MATURITY ROADMAP

**Route:** `/maturity-roadmap`

### 12.1 Concept
**NOT called "Compliance Center"** — deliberately renamed to "Maturity Roadmap" because it's about ongoing obligations + uplift goals + industry responses, not strictly compliance.

**Captures:**
- **Maintenance actions** — keeping current maturity (cadence-based tasks: access reviews, pen tests, policy reviews)
- **Improvement actions** — uplift toward ambitious goals (close maturity gaps)
- **Industry shifts** — new threats, regulatory changes, emerging practices

**Signals come from:**
- Cypher's captured conversation signals
- Self-assessment answers
- Control maturity deltas
- Explicit user-stated goals

### 12.2 Layout

```
Maturity Roadmap
(Raleway 800, 32px)

Your ongoing obligations, uplift actions, and response to 
industry shifts.
(Montserrat, secondary)

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ MAINTAIN         │  │ UPLIFT           │  │ INDUSTRY SHIFTS  │
│                  │  │                  │  │                  │
│ 🔴 12 ongoing    │  │ 🟡 47 actions    │  │ 🔵 3 regulatory  │
│    obligations   │  │    to reach 4.0  │  │    changes to    │
│                  │  │    maturity      │  │    address       │
│                  │  │                  │  │                  │
│ [▾ EXPAND]       │  │ [▾ EXPAND]       │  │ [▾ EXPAND]       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### 12.3 Tile Behaviour (Hybrid Approach)

- **Default state:** All 3 tiles collapsed, showing headline count + metric
- **Click Expand (or tile body):** Only ONE tile expanded at a time
- Clicking another tile auto-collapses current + expands clicked
- **Expand animation:** 300ms height auto-expand, content fades in

### 12.4 Expanded Content

```
🔴 MAINTAIN (12)                                      [▴ COLLAPSE]
────────────────────────────────────────────────────────────────
Filter:  [Framework ▾]  [Domain ▾]  [Priority ▾]  [Due Date ▾]

┌────────────────────────────────────────────────────────────────┐
│ 🔴  Test incident response plan     Due: 3 days  MFA (RS.AN-01)│
│     [▾ Expand for details]                                     │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ 🟡  Review access control list      Due: 2 weeks  (GV.AA-01)   │
└────────────────────────────────────────────────────────────────┘
...
```

### 12.5 Action Row (Progressive Disclosure)

**Default (1 line):**
- Priority dot (colour-coded)
- Action title
- Due date (relative, e.g., "3 days" or "overdue 2 days" in danger colour)
- Related control ID
- Chevron for inline expand

**On hover or click chevron (inline expansion, no modal):**
```
┌────────────────────────────────────────────────────────────────┐
│ 🔴  Test incident response plan     Due: 3 days  (RS.AN-01)    │
│                                                                │
│     Description: Conduct a tabletop exercise to verify your    │
│     incident response plan's effectiveness across key scenarios│
│                                                                │
│     Related framework: NIST CSF 2.0                            │
│     Last completed: 6 months ago                               │
│                                                                │
│     [✓ MARK COMPLETE]  [→ VIEW CONTROL]  [DISCUSS WITH SARAH]  │
└────────────────────────────────────────────────────────────────┘
```

### 12.6 Filters (Top of Each Expanded Section)
- Framework: multi-select (or "All")
- Domain: multi-select
- Priority: multi-select (High / Medium / Low)
- Due Date: select (All / Overdue / This Week / This Month / Later)

### 12.7 Uplift Section Specifics
Top banner: "Your target: 4.0 maturity. Current: 2.8. 47 actions will close this gap." + progress bar visualising 2.8 → 4.0.

### 12.8 Industry Shifts Section Specifics
Each item:
- Short description
- "Why this matters to you" line (references specific controls)
- Dismiss button (user can dismiss if not applicable)

### 12.9 Data Source
`GET /api/v1/maturity-roadmap?section=maintain|uplift|shifts` — returns paginated action items.

---

## 13. PROGRESS & MILESTONES

**Route:** `/progress`

**Naming decision:** Renamed from "History" because it's more meaningful — shows progress trajectory + celebrated achievements, not just a historical log.

### 13.1 Three Tabs
- **Timeline** — month-by-month maturity progression
- **Comparison** — overlay two periods side-by-side
- **Milestones** — wins, challenges, key events, celebrations

**Framework sub-tabs** (second row): `[ISO 27001:2022]  [NIST CSF 2.0]  [APRA CPS 234]`

### 13.2 Timeline Tab

**Framework-specific visualisation:**
- **NIST:** Line chart. x = date (monthly snapshots), y = maturity 0–5. One line per function (GV, ID, PR, DE, RS, RC) in distinct colours. Legend at top.
- **ISO:** Stacked area chart. x = date, y = 0–100%. Three stacks: Compliant (green), Non-Conformity (red), Opportunity (amber).
- **APRA:** Stacked bar chart. x = date, y = 0–100%. Three stacks: Level 4, Level 3, Level 2 (colour gradient).

**Time range selector (top-right):** Last 30 days / Last 90 days / Last 12 months / Custom

**Below chart:** Snapshot table — date, overall score/compliance, change from previous snapshot.

### 13.3 Comparison Tab

- Two date pickers: "Period A" and "Period B" (e.g., "Q1 2026" vs "Q2 2026")
- **Overlay visualisation:**
  - NIST: Two radar polygons on same chart (Period A vs Period B) + delta summary
  - ISO/APRA: Side-by-side stacked bars, one set per period
- **Delta summary panel:** List of domains with biggest improvements + biggest drops

### 13.4 Milestones Tab

**Vertical feed, chronological, newest first.**

**Time range filter (top):** This Week / This Month / This Quarter / This Year / All Time

**Feed item types (4 combined categories):**
- 🟢 **Wins** (green left bar): "Reached 3.0+ in Governance — 15/03/2026"
- 🔴 **Challenges** (red left bar): "Incident Response dropped 0.3 points — 10/03/2026"
- 📌 **Key Events** (grey left bar): "APRA CPS 234 framework enabled — 05/03/2026"
- 🎉 **Celebrations** (gold left bar): "Biggest monthly improvement: +0.6 in Detect — 01/03/2026"

**Card behaviour:**
- Click card → expands inline for full context
- Shows contributing factors, related controls, narrative

**Purpose:**
- Executive summary — what happened, what's good, what needs attention, what to celebrate
- Board-report ready
- Sourced from: Cypher signals, control assessments, score changes, user actions

### 13.5 Data Source
```
GET /api/v1/progress/timeline?framework=...&range=...
GET /api/v1/progress/comparison?framework=...&periodA=...&periodB=...
GET /api/v1/progress/milestones?range=...
```

---

## 14. ORGANISATION SETTINGS (Admin Only)

**Routes:**
- `/organisation/users` (default when Organisation Settings clicked)
- `/organisation/preferences`
- `/organisation/billing`
- `/organisation/audit`

**Access control:**
- All routes + sidebar entries hidden from non-admin users
- Direct URL as non-admin → redirect to `/dashboard/industry` (if authenticated) or `/404`

### 14.1 Users Sub-Page

**Layout:**
```
Users
(Raleway 800, 32px)

Manage your team, roles, and assignments.
(Montserrat, secondary)

                                              [+ INVITE USER]

┌────────────────────────────────────────────────────────────────┐
│ Name             Email               Role       Status   Actions│
├────────────────────────────────────────────────────────────────┤
│ Vik Soni         vik@simplify.is    Admin      Active   ⋮      │
│ Sarah Chen       sarah@acme.com     Assessor   Active   ⋮      │
│ Ben Johnson      ben@acme.com       Viewer     Pending  ⋮      │
│ ...                                                             │
└────────────────────────────────────────────────────────────────┘
```

**Columns:** Name · Email · Role · Status · Actions

**Filters:**
- Role (All / Admin / Assessor / Viewer)
- Status (Active / Pending / Disabled)
- Search: name or email

**Row actions (⋮):**
- Edit role
- Resend invite (if pending)
- Deactivate user
- Assign domains (opens side panel)

**Invite User Modal:**
- Email (required)
- Role (Admin / Assessor / Viewer)
- Message (optional, included in email)
- Button: "Send Invitation"
- POST `/api/v1/organisation/users/invite`

**Three roles:**
- **Admin:** Full access, invites users, selects final answers, sees audit trail, full Organisation Settings
- **Assessor:** Assigned domains only, sees others' answers anonymised, no Organisation Settings
- **Viewer:** Read-only dashboard + Cypher AI, no Organisation Settings

### 14.2 Preferences Sub-Page

**Sections (accordion or stacked cards):**

**A. Organisation Details (editable)**
- Organisation Name (editable post-onboarding — can be changed)
- Industry (editable)
- Countries of operation (editable)
- Workforce size (editable)

**B. Selected Frameworks**
- Toggle per framework (ISO / NIST / APRA on/off; SOC 2 / PCI / HIPAA coming soon)
- **30-day cooldown enforced** on framework toggles
- Lock notice: "Frameworks can be changed once every 30 days. Last change: {date}. Next change available: {date}."
- Disabled toggle during cooldown

**C. Session Settings**
- Session timeout slider: 15 min – 60 min (default: 15 min)
- Auto-save checkbox (default: ON)

**D. Notification Defaults**
- Email toggles per event type: Assessment due, Milestone reached, Weekly digest
- In-app toggles same options

**E. Data Export**
- Default export format (PDF / JSON / BI-API)
- Auto-export schedule (None / Monthly / Quarterly)

**Behaviour:** All changes auto-save on blur/toggle with toast: "Preferences updated"

### 14.3 Billing Sub-Page

**Sections:**
- **Current Plan:** Name, price, status, renewal date
- **Frameworks Included:** List
- **Add-ons:** APRA CPS 234 (if purchased), usage-based line items
- **Payment Method:** Card on file (last 4 digits), change button
- **Invoices:** Table — date, amount, status, download PDF
- **Upgrade/Downgrade:** CTA to Stripe customer portal (external)

### 14.4 Audit Sub-Page

**Purpose:** Track user CONTRIBUTION to organisational maturity (NOT account changes).

**Shows:**
- Who answered which control
- What they answered
- Impact on maturity score
- Previous answer (if revised)

**Layout:**
```
Audit Log
(Raleway 800, 32px)

Who contributed what to your organisation's maturity — filtered 
for transparency.
(Montserrat, secondary)

Filter:  [Framework ▾]  [Date Range ▾]

┌────────────────────────────────────────────────────────────────┐
│ 2 hours ago                                                    │
│ Sarah Chen  ·  GV.OC-01 (Organisational Context)  ·  NIST      │
│ Answered: "MFA enabled on 85% of critical systems"             │
│ Impact: Control maturity 2.1 → 2.4                             │
│ Previous: "MFA on 60% of critical systems" (2 months ago)      │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ 3 hours ago                                                    │
│ Ben Johnson  ·  A.5.15 (Access Control)  ·  ISO                │
│ Answered: ...                                                  │
└────────────────────────────────────────────────────────────────┘
```

**Behaviour:**
- Chronological list, newest first
- Filters: Framework + Date Range (simple, not complex sorting)
- Scroll-paginated (load more as user scrolls)

**NOT audit tracking:** user password changes, MFA toggles, login events (those are security events, not contribution events).

---

## 15. USER PROFILE MODALS

### 15.1 Architecture
- **Location:** Top-right avatar dropdown in header
- **All post-login users see this** (Admin, Assessor, Viewer)
- **Distinct from Organisation Settings** (which is admin-only, about org config)

### 15.2 Avatar Dropdown Menu
Small dropdown (240px wide), items:
- User info header (avatar + full name + email — read-only)
- Divider
- Edit Profile
- Change Password
- MFA Settings
- Divider
- Logout

### 15.3 Edit Profile Modal

**Trigger:** Click "Edit Profile" in dropdown
**Format:** Modal overlay (NOT dedicated page)
**Size:** 480px wide, rounded 12px, centred

**Fields:**
- **Avatar uploader** — drop zone or click to upload, shows current image in circle, PNG/JPG/WebP max 2MB
- **Full Name** (editable)
- **Position / Job Title** (editable)
- **Organisation Name** (editable — updates org record, admin-only for this field)
- **Email** (read-only, tooltip: "Email is your login credential and cannot be changed here.")

**Buttons:** Cancel (close modal) + Save Changes (primary)

**Behaviour:**
- Save → PATCH `/api/v1/users/me` → toast "Profile updated" → close modal
- Cancel → close without saving

### 15.4 Change Password Modal

**Trigger:** "Change Password" in dropdown
**Size:** 480px wide

**Fields:**
- **Current Password** (required)
- **New Password** (required, strength meter below: Weak / Fair / Good / Strong with coloured bar)
- **Confirm New Password** (required, must match)

**Validation:**
- New password min 12 chars, at least one uppercase, one lowercase, one number, one special char
- Inline errors on blur
- Submit button disabled until all valid

**Buttons:** Cancel + Change Password

**Submit:**
- POST `/api/v1/users/me/password`
- On success: close modal + toast "Password updated. You'll stay signed in on this device." + log out of all other devices (backend)

### 15.5 MFA Settings Modal

**Trigger:** "MFA Settings" in dropdown

**Modal contents conditional on state:**

**If MFA not enabled (non-admin, MVP):**
- Title: "Multi-Factor Authentication"
- Status: "Not Enabled"
- Message: "Add a second layer of security. We recommend using an authenticator app like Authy or Google Authenticator."
- Button: "Enable MFA" → starts setup flow

**If MFA enabled:**
- Status: "Active — Authenticator App"
- Button: "Regenerate Recovery Codes" → warning modal first → new codes displayed ONCE, PDF download
- Button: "Disable MFA" → confirmation modal, requires current password

**For admins:** MFA is optional in MVP (enforced in future). Same modal.

**Setup flow (when "Enable MFA" clicked):**
1. Modal shows QR code + manual secret
2. User scans, enters 6-digit TOTP code
3. On success → shows 10 recovery codes in Geist Mono, "Download PDF" + "I've Saved Them" buttons
4. Mark MFA enabled

---

## 16. CYPHER CHAT MODAL

### 16.1 Core Concept
**Cypher is the hero of the app** — should be present but not dominating. Subtle access from everywhere, takes focus when engaged.

### 16.2 Trigger Points
- **Floating button** bottom-right of content panel (on all dashboards)
- **"Discuss with {agent-name} 🤖" CTAs** throughout the app (Framework View detail panel, Risk View detail panel, action items in Maturity Roadmap, etc.)

### 16.3 Visual Design — Modal with Dark Overlay

```
[Dashboard content here, dimmed with rgba(0,0,0,0.3) overlay]

                          ┌────────────────────────────────────┐
                          │ Sarah 🤖                       ✕   │
                          │ Your AI Security Consultant        │
                          ├────────────────────────────────────┤
                          │                                    │
                          │ Welcome back, Vik. Your maturity   │
                          │ improved 0.2 points this week in   │
                          │ Detect. Want to keep momentum      │
                          │ going?                             │
                          │                                    │
                          │ [Sarah message bubble — primary-   │
                          │  tinted bg, left-aligned]          │
                          │                                    │
                          │ Yes, where should we start?        │
                          │                                    │
                          │ [User message bubble — neutral bg, │
                          │  right-aligned]                    │
                          │                                    │
                          │ Let's look at your Protect domain. │
                          │ You have a gap in access control   │
                          │ that's worth 0.3 points...         │
                          │                                    │
                          ├────────────────────────────────────┤
                          │ Quick replies:                     │
                          │ [👍 Yes]  [🔄 Different topic]     │
                          ├────────────────────────────────────┤
                          │ ┌──────────────────────────┐  ┌──┐ │
                          │ │ Type your message...     │  │→ │ │
                          │ └──────────────────────────┘  └──┘ │
                          └────────────────────────────────────┘
```

### 16.4 Positioning

- **Slides in from right edge of viewport**
- **Desktop:** 36% of viewport width (min 440px, max 560px)
- **Tablet:** 50% width
- **Mobile:** 100% (full screen)

**Overlay:**
- Background behind: `rgba(0,0,0,0.3)` — dims dashboard, signals "focus here"
- Overlay contents are **non-interactive** while chat is open
- Click overlay OR press Esc → close chat

### 16.5 Header
- Agent name + emoji (e.g., "Sarah 🤖") in Raleway 20px
- Sub-text: "Your AI Security Consultant" in Montserrat 13px, secondary
- Close button (X) on far right

### 16.6 Message Area
- Scrollable, padded 20px
- **Agent messages:** Left-aligned, primary colour 10% bg, rounded 12px (flatter on top-left corner — "origin"), Montserrat 15px
- **User messages:** Right-aligned, `surface-container-high` bg, rounded 12px (flatter on top-right corner)
- **Typing indicator:** 3 bouncing dots when Cypher generating
- **Timestamps on hover** (subtle, secondary colour)
- **NO lists or bullets** — Cypher speaks in natural language, not formatted content

### 16.7 Quick Replies
- Appear below latest agent message when contextually relevant
- Pills in ghost style
- Click → fills input with text OR sends directly

### 16.8 Input
- Textarea, auto-grows up to 4 lines
- Send button (arrow icon) on right; disabled when empty
- Enter sends; Shift+Enter new line
- Paste-safe (sanitises input, strips HTML)

### 16.9 Open State Behaviour
- Smooth slide-in animation (300ms ease-out)
- Input auto-focuses on open
- **Fresh open (no prior conversation):** Context-aware greeting based on current route/state
- **Returning open:** Resume where left off

### 16.10 Context Pre-Loading

- **Opened from floating button:** general context
- **Opened via "Discuss with {agent-name}" from control detail:** control pre-loaded as context; Cypher opens with "Let's talk about {control-name}. What would you like to discuss?"
- **Path 2 (Review flagged questions):** Same concept, but in full-panel mode (not modal)

### 16.11 API Wiring
- POST `/api/v1/cypher/message` with `{ conversationId, message, context }`
- Returns SSE (server-sent events) stream of assistant response
- Claude streaming via SSE
- All messages stored in `chat_transcripts` table

### 16.12 Cypher Persona Rules (NEVER Dilute)

- **Default name:** "Cypher" (user-renameable at onboarding, stored forever in `users.agent_name`)
- **Always rendered with 🤖 emoji** in UI display contexts
- **One question at a time.** No exceptions.
- **Never uses lists, bullets, or headers** in conversation
- **Vocabulary:** Start simple, detect sophistication dynamically, adjust mid-conversation
- **Does NOT congratulate after every answer** — keeps natural rhythm
- **Does NOT use the word "Maturity"** with users — uses plain language
- **Off-topic:** Brief answer + redirect
- **Burning issue:** Pause, handle, resume
- **"I don't know":** Rephrase → example → max 2 probes → mark TBC → move on
- **N.A. controls:** Always probe for justification, store reasoning, re-validate on reassessment
- **Contradiction:** Soft human-like inquiry, never accusatory, three options for user
- **Score:** Never revealed mid-group, always paired with Cypher message on update

---

## 17. EMPTY STATES, ERROR STATES, RESPONSIVE BEHAVIOUR

### 17.1 Empty States Pattern

For any screen where data may not yet exist:

1. **Skeleton loaders on mount** (grey rectangles, shimmer effect)
2. **If data arrives empty:** friendly empty state with illustration or large neutral icon, 1-sentence explanation, primary CTA
3. **Cypher chat does NOT auto-open on empty states** (avoid overwhelming). Instead, helper text near CTA: "Need help? Ask {agent-name} 🤖"

### 17.2 Specific Empty States

**Industry Dashboard (no assessments):**
- Radar shows peer-only polygon
- Metrics show "—" instead of scores
- Strengths/Priority tiles: "Complete your first assessment to unlock insights. [Start Assessment →]"
- Progress sparkline: "No assessments yet. [Start your first →]"

**Framework View (no answers):**
- Tree present but all scores are "—"
- Right panel: "Select a control to see its detail, or start an assessment."

**Risk View (no risks selected):**
- Automatically shows Stage 1 (risk library review flow)

**Assessment Landing (fresh org):**
- All tiles show "Status: Not Started" with "Start Assessment" buttons

**Maturity Roadmap (no actions yet):**
- Three tiles show "0 items"
- Helper text: "Complete an assessment to populate your roadmap"

**Progress & Milestones (no history):**
- "Your timeline will populate after your first assessment." + CTA back to Assessment

**Audit Log (no events):**
- "Contribution events will appear here."

### 17.3 Error States

- **Generic:** "Something went wrong. Please try again." — no internal details leaked
- **Inline errors:** danger colour, 13px, below the failing field
- **Banner errors:** top of card/page, danger bg + white text
- **Toast errors:** temporary, top-right, 4s duration
- **Never reveal:** whether email exists, internal error codes, stack traces

### 17.4 Responsive Breakpoints

| Breakpoint | Width | Notes |
|-----------|-------|-------|
| Mobile | 375–480px | Single column, bottom sheet nav |
| Tablet | 768–1024px | 2-column where applicable, sidebar collapsed |
| Desktop | 1280–1920px | Full layout, expanded nav |

### 17.5 Desktop-First Priority

- **Desktop is primary focus.** Optimise for security leadership who use laptops/desktops
- Tablet + mobile are secondary (Teams/Slack bot will handle mobile needs)
- Don't let mobile dictate desktop design
- All modals become full-screen or bottom-sheet on mobile

### 17.6 Reduced Motion
- Respect `prefers-reduced-motion` on ALL animations
- Disable transforms, fade only
- WCAG requirement

---

## 18. AUSTRALIAN ENGLISH RULES

**Every label, tooltip, error, placeholder, helper text, button, heading — MUST be Australian English.**

### 18.1 Spelling Map
```
organize → organise
organization → organisation
authorize → authorise
authorization → authorisation
recognize → recognise
prioritize → prioritise
optimize → optimise
realize → realise
customize → customise
analyze → analyse
initialize → initialise
color → colour
center → centre
favor → favour
honor → honour
labor → labour
favour → favour
license (as noun) → licence
defense → defence
offense → offence
program (software) → program  [OK as-is]
program (schedule/event) → programme
```

### 18.2 Date Format
**DD/MM/YYYY** — not MM/DD/YYYY, not "March 15, 2026"

Example: `15/03/2026`

### 18.3 Time Format
12-hour with AM/PM — consistent throughout.

Example: `2:30 PM`

### 18.4 Currency
`$` symbol for AUD by default. Explicitly prefix `USD $` for non-AU currencies.

### 18.5 Tone Standards
- Formal but accessible
- Plain language (not jargon-heavy)
- Direct (Australian style)
- Warm (human, consultant-like)
- No patronising tone
- No American marketing-speak

---

## 19. ACCESSIBILITY STANDARDS (WCAG AA Minimum)

### 19.1 ARIA Requirements
- All icon buttons have `aria-label`
- Dropdowns keyboard-navigable (Arrow keys, Enter, Esc)
- Focus traps in modals
- Skip-to-content link in header
- `aria-live="polite"` for dynamic score changes, toasts

### 19.2 Keyboard Navigation
- Tab / Shift+Tab through all interactive elements
- Arrow keys in menus
- Enter to activate
- Esc to close modals/popovers
- No keyboard traps (except modals)

### 19.3 Focus States
- All focusable elements have `focus-visible` outline (2px solid primary)
- Never remove focus outline without replacement

### 19.4 Contrast Ratios
- WCAG AA in BOTH dark and light mode
- Test all text against backgrounds
- Use browser tools to verify

### 19.5 Forms
- All inputs have associated labels
- Required fields: `aria-required="true"`
- Errors announced via `aria-live="polite"`
- Password strength announced as it changes

### 19.6 Reduced Motion
- All animations respect `prefers-reduced-motion`
- Disable transforms (opacity fades OK)

### 19.7 Screen Reader Tested
- Industry Dashboard
- Assessment flow
- Form submissions
- Modal dialogs

---

## 20. SECURITY + ARCHITECTURAL RULES

### 20.1 Three-Layer Architecture (Never Violate)

```
INTERNET
  ↓ HTTPS only
API LAYER (/api/v1/*)
- JWT auth on EVERY route
- Rate limit: 100/min, 1000/hr per user
  ↓ ORCHESTRATION_SECRET required
ORCHESTRATION (/api/internal/*)
- ALL Claude API calls here ONLY
- ALL RAG context building
- ALL database writes
  ↓
SUPABASE + Claude API
```

### 20.2 Environment Variables

| Variable | Where | Rule |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + API | Safe for client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend only | Safe for client |
| `SUPABASE_SERVICE_KEY` | Orchestration ONLY | NEVER client-side |
| `ANTHROPIC_API_KEY` | Orchestration ONLY | NEVER client-side |
| `ORCHESTRATION_SECRET` | Internal auth | Min 32 chars, NEVER client-side |

### 20.3 Never-Break Rules

- No direct Supabase calls from React components
- No direct Claude API calls from `/api/v1/*` routes
- All SQL: parameterised queries only
- RLS on ALL data tables
- `/api/internal/*` returns 403 without valid ORCHESTRATION_SECRET
- TypeScript strict mode — zero `any` types
- Env vars only from `/lib/config/env.ts`
- All Supabase calls through `/lib/db/` abstractions
- All auth calls through `/lib/auth/` abstractions
- No `console.log` in production
- No TODO comments in merged code
- Error handling on every async function
- Generic error messages (no PII leakage)

### 20.4 Security Testing Requirements (Pre-Launch)
- Cross-tenant isolation tested (RLS)
- XSS: `<script>alert(1)</script>` stored escaped, not executed
- SQLi: parameterized query blocks `'; DROP TABLE users; --`
- CORS restricted to production domain
- Security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- Request size limit: 11MB returns 413
- No secrets in git history
- No PII in console.log
- Claude API call count tracked and enforced

### 20.5 Passwords
- Never in query strings
- Never in localStorage or sessionStorage
- Never in logs
- Never in page source comments
- All auth flows: generic error messages (don't reveal if email exists)

---

## 21. PERFORMANCE TARGETS

- **Lighthouse Performance ≥ 90**
- **Lighthouse Accessibility ≥ 95**
- **Lighthouse Best Practices ≥ 90**
- **Lighthouse SEO ≥ 90**
- **CLS (Cumulative Layout Shift) ≤ 0.1**
- **LCP (Largest Contentful Paint) < 2.5s on fast 3G**
- **All animations 60fps** (no jank)

### 21.1 Implementation

- Code-split heavy components via `next/dynamic`:
  - D3 charts (radar, timeline, bars)
  - Framer Motion
  - Recharts
- Image optimisation via `next/image`
- Fonts via `next/font` (Raleway, Montserrat, Josefin Sans, Geist Mono)
  - Subset to Latin
  - Preload only display font (Raleway)
- Lazy-load Cypher chat modal (not rendered until first open)
- React Query cache for all data fetching

---

## 22. COMPONENT INVENTORY (What Must Exist)

### 22.1 Layout
- `DashboardLayout`
- `Header`
- `LeftSidebar`
- `Footer`
- `NotificationPopover`
- `UserProfileDropdown`

### 22.2 Onboarding
- `OnboardingShell` (minimal layout wrapper)
- `Step1ConsultantName`
- `Step2Organisation`
- `Step3Frameworks`
- `Step4WorkspaceReady`
- `WorkforceScaleDials` (4-tile radio group)

### 22.3 Dashboard
- `InitialisationScreen` (3-tile entry picker)
- `IndustryDashboard`
- `IndustryRadar` (D3)
- `IndustryMetricsPanel`
- `StrengthsTile`
- `StrategicPriorityTile`
- `SecurityBriefingTile`
- `ProgressSparklineTile`
- `ConsentToggle`
- `FrameworkView`
- `FrameworkTabs`
- `FrameworkOverviewViz` (polymorphic: NIST radar vs ISO/APRA bars)
- `FrameworkSummaryCards`
- `ControlTree`
- `ControlDetailPanel`
- `CoverageBadge`
- `RiskView` (container)
- `RiskSelectionFlow` (Stage 1)
- `RiskDashboard` (Stage 2)
- `RiskDetailPanel`

### 22.4 Assessment
- `AssessmentLanding`
- `AssessmentTile`
- `AssessmentQuestionFlow` (Path 1)
- `AssessmentCypherReview` (Path 2, full-panel)

### 22.5 Maturity Roadmap
- `MaturityRoadmap`
- `RoadmapSummaryCard` (3 collapsible tiles)
- `ActionItem` (single row, progressive disclosure)

### 22.6 Progress
- `ProgressTabs`
- `TimelineChart` (polymorphic per framework)
- `ComparisonChart` (overlay visualisation)
- `MilestonesFeed`

### 22.7 Organisation
- `UsersTable`
- `InviteUserModal`
- `PreferencesForm`
- `BillingPanel`
- `AuditLog`

### 22.8 Modals
- `EditProfileModal`
- `ChangePasswordModal`
- `MFASettingsModal`
- `AddCustomRiskModal`
- `ConfirmationModal` (generic)

### 22.9 Cypher
- `CypherChatModal` (slide-in right panel)
- `CypherMessage` (agent or user bubble)
- `CypherInput`
- `FloatingCypherButton`

### 22.10 Shared UI (Extend Existing)
- `Dropdown` (generic)
- `Modal` (generic container)
- `Toggle` (switch)
- `Tabs` (tab strip)
- `Tile` (generic card with variants)

---

## 23. ROUTES (Next.js App Router)

```
/dashboard
  /industry          → Industry Dashboard
  /framework         → Framework View
  /risk              → Risk View
  /initialisation    → First-login entry picker

/assessment          → Assessment Landing
  /[framework]       → Active assessment

/maturity-roadmap    → Maturity Roadmap
/progress            → Progress & Milestones

/organisation        (admin only)
  /users             → Users
  /preferences       → Preferences
  /billing           → Billing
  /audit             → Audit Log

/onboarding          (first-login admin only)
  /step-1            → Name Your AI Consultant
  /step-2            → Set Up Your Organisation
  /step-3            → Choose Your Frameworks
  /step-4            → Your Workspace is Ready
```

**Layout usage:**
- All `/dashboard`, `/assessment`, `/maturity-roadmap`, `/progress`, `/organisation` routes → `DashboardLayout`
- `/onboarding/*` → `OnboardingShell`
- `/dashboard/initialisation` → `DashboardLayout`

---

## 24. DATA + API CONTRACTS (Stubs — Wire Later)

For Claude Code polish, mock data acceptable. For Agent 14 (API wiring), replace with real endpoints.

### 24.1 React Query Hooks
```
useCurrentUser()
useIndustryDashboard()
useFrameworkView(framework)
useControlDetail(framework, controlId)
useRiskSelection()
useRiskDashboard()
useAssessmentStatus()
useAssessmentQuestion(framework, domain, index)
useMaturityRoadmap(section)
useProgressTimeline(framework, range)
useProgressComparison(framework, periodA, periodB)
useProgressMilestones(range)
useOrganisationUsers()
useOrganisationPreferences()
useAuditLog(filters)
useCypherConversation()
useNotifications()
```

Each hook returns: `{ data, isLoading, error, refetch }`

### 24.2 Onboarding Endpoints
```
POST /api/v1/onboarding/consultant-name
POST /api/v1/onboarding/organisation
POST /api/v1/onboarding/frameworks
POST /api/v1/onboarding/complete
```

### 24.3 User Endpoints
```
GET    /api/v1/users/me
PATCH  /api/v1/users/me
POST   /api/v1/users/me/password
POST   /api/v1/users/me/mfa/enable
POST   /api/v1/users/me/mfa/regenerate-codes
POST   /api/v1/users/me/mfa/disable
```

### 24.4 Dashboard Endpoints
```
GET /api/v1/dashboard/industry
GET /api/v1/dashboard/framework?framework=...
GET /api/v1/dashboard/risk
```

### 24.5 Assessment Endpoints
```
GET  /api/v1/assessment/status
POST /api/v1/assessment/answer
POST /api/v1/assessment/session/start
GET  /api/v1/assessment/session/{id}
PUT  /api/v1/assessment/session/{id}/responses/{rid}
```

### 24.6 Risk Endpoints
```
POST /api/v1/risks/selection
POST /api/v1/risks/rating
POST /api/v1/risks/custom
GET  /api/v1/risks/library
```

### 24.7 Maturity Roadmap
```
GET /api/v1/maturity-roadmap?section=maintain|uplift|shifts
POST /api/v1/maturity-roadmap/action/{id}/complete
```

### 24.8 Progress
```
GET /api/v1/progress/timeline?framework=...&range=...
GET /api/v1/progress/comparison?framework=...&periodA=...&periodB=...
GET /api/v1/progress/milestones?range=...
```

### 24.9 Organisation
```
GET  /api/v1/organisation/users
POST /api/v1/organisation/users/invite
PATCH /api/v1/organisation/users/{id}
DELETE /api/v1/organisation/users/{id}
GET  /api/v1/organisation/preferences
PATCH /api/v1/organisation/preferences
GET  /api/v1/organisation/audit?framework=...&range=...
```

### 24.10 Cypher
```
POST /api/v1/cypher/message  (SSE streaming)
GET  /api/v1/cypher/conversation/{id}
```

### 24.11 Notifications
```
GET    /api/v1/notifications
POST   /api/v1/notifications/mark-read
POST   /api/v1/notifications/mark-all-read
```

---

## 25. FINAL DESIGN PRINCIPLES TO REMEMBER

1. **Industry Dashboard is the visual north star.** Match the PNG reference pixel-perfect. All other screens inherit its vocabulary.

2. **Dashboard Layout is canonical.** Left sidebar + header + content panel + footer. Every post-login screen inherits it. The only thing that changes is the content panel.

3. **Agent name with emoji 🤖 everywhere.** Display format: "{name} 🤖". User enters max 10 chars; UI reserves space for ~15–20 chars total.

4. **Australian English throughout.** No exceptions. Every label, error, placeholder.

5. **Desktop first.** Tablet and mobile are secondary. Don't let mobile dictate desktop design.

6. **No lists or bullets in Cypher chat messages.** Cypher speaks in natural language.

7. **Score animations pair with Cypher messages.** Never silent score changes.

8. **Session timeout default: 15 min** (user-configurable 15–60 min in Preferences).

9. **Three-layer architecture inviolable.** Never break it for convenience.

10. **Admin-only visibility for Organisation Settings** — completely hidden from DOM, not just CSS-hidden.

11. **30-day cooldown on framework selection changes** in Preferences.

12. **Empty states thoughtful everywhere** — no zeros implying "you have nothing." Skeleton placeholders with CTAs.

13. **Cypher chat: right slide-in modal with dark overlay (rgba(0,0,0,0.3)).** Desktop 36% width, mobile full-screen.

14. **Risk View: 2-stage flow.** Stage 1 = sequential selection (Tinder-like). Stage 2 = prioritised dashboard.

15. **Framework View uses different visuals per framework** (NIST = radar, ISO = compliance bars, APRA = level bars). Unified design system underneath.

16. **Maturity Roadmap has 3 sections** (Maintain / Uplift / Industry Shifts) — only one expanded at a time.

17. **Progress & Milestones has 3 tabs** (Timeline / Comparison / Milestones) + framework sub-tabs.

18. **Audit tracks contribution to maturity** (who answered what), NOT account changes.

19. **User Profile (top-right) vs Organisation Settings (left, admin only)** — clear separation.

20. **The entire post-login experience feels unified** — it's the Industry Dashboard template with different content panels. Users should feel like they're "navigating within one app," not moving between different pages.

---

## 26. OUTSTANDING VIK TASKS (For Real Data Wiring Later)

- [ ] Provide 20 template risks (will upload to Supabase later)
- [ ] Generate/upload 5–8 assessment questions per domain per framework (ISO, NIST, APRA) — Claude Code will author these, store in Supabase
- [ ] Security Briefing / Industry Advisory feed source (from Vik's research agent)
- [ ] Exact notification types list (Assessment due / Domain completed / Cypher insight / Framework change / etc.)
- [ ] Final Cypher welcome greeting wording on Industry Dashboard (warm, human, consultant-like)
- [ ] 30-day cooldown UX copy for framework toggle in Preferences
- [ ] Future: framework-agnostic "Simplify IS Domains" (post-MVP)
- [ ] Future: Executive board-report PDF export (post-MVP)

---

## 27. CRITICAL REMINDERS

- **Don't break existing Agents 1–9 work.** Extend, don't rewrite.
- **Cursor's build is the foundation.** Claude Code polishes on top.
- **Every state must be graceful:** loading, empty, error, success.
- **Every interaction polished:** hover, focus, active, disabled.
- **Every form accessible:** keyboard-navigable, labelled, error-announced.
- **Every animation respects reduced-motion.**
- **No TODO / console.log / placeholder logic in merged code.**
- **Match PNG references pixel-perfect** where provided.
- **Australian English scanned and verified** across entire codebase.
- **WCAG AA compliance** in both dark and light modes.

**When this pass is complete, the post-login experience should be MVP-ready. Agent 14 will wire APIs; subsequent agents add features. Your work is the foundation everything else rests on.**

---

*This master decisions document consolidates every UI/UX decision locked during Agent 10 planning sessions. Use as the single source of truth when running Claude Code polish pass on top of Cursor's initial build.*

*Last updated: April 2026*

---

## 28. ROUND 2 FEEDBACK DELTAS (April 2026)

Round 2 is Vik's second pass after the initial polish agents merged. Where a locked decision needed tightening or a sibling decision was added, the delta is captured here so the prior sections stay intact and this section lists the diffs. The full fix-level spec (file paths, code guidance, acceptance criteria) lives in `docs/UI_UX_FEEDBACK_REMEDIATION.md` under the `ROUND 2 FEEDBACK` heading — treat this section as the decisions layer and that doc as the implementation brief.

### 28.1 Pre-login additions

- **§28.1.a — Contact Us modal gains an `email` field (validated).** Required, positioned between `name` and `country`, RFC-5322 validation on blur. `contact_submissions` schema gets an `email` column. Logged-in users open the same modal from the authenticated footer with `name` + `email` pre-filled read-only (server re-verifies). Overrides the R1 3-field spec in §0.2 of the remediation brief.
- **§28.1.b — Frameworks "Coming Soon" tile set expands.** Ready tiles unchanged (ISO 27001:2022, NIST CSF 2.0, APRA CPS 234). Coming Soon set becomes: Essential Eight, SOC 2, APRA CPS 230, PCI DSS 4.0, HIPAA, NIST AI RMF (matches the Pricing add-ons list exactly). Each tile carries a one-line body describing the framework; no CTA while Coming Soon.
- **§28.1.c — Home Compliance Intelligence tiles share equal height.** Both `Browse Modules` CTAs baseline-aligned at every breakpoint — flex-column tiles with `mt-auto` on the CTA wrapper, or CSS Grid `grid-template-rows: auto 1fr auto`.
- **§28.1.d — Header / footer consistency across every pre-login page.** Nav renders identically (links, order, active treatment). Footer copyright locks to **"© 2026 Simplify.IS"** — no legacy "© 2024" lines, no "monolithic architecture" fragment. `Cookie Settings` link removed everywhere (no page exists; revisit when we do). Terms / Privacy / Contact must not 404.
- **§28.1.e — Copy audit (pre-login).** Every headline, tile body, metric, CTA label, and footer line reviewed for Stitch-export filler, unsupported numbers, and references to capabilities we don't ship. Replace with copy tied to ISO 27001:2022 + NIST CSF 2.0 + APRA CPS 234 assessments, Cypher conversational consultant, maturity measurement, risk register, remediation roadmap. Australian English throughout.

### 28.2 Onboarding tightening (supersedes wording only — flow unchanged)

- **§28.2.a — Step 1 default-name hint.** Under the input, render: "Leave this blank and your consultant will be called **Cypher**. You can rename them anytime in Organisation Settings." (Secondary text, Montserrat 400, 13px.) The blank-default behaviour from §6.3 is already locked; this is the missing UI affordance.
- **§28.2.b — Step 2 backfill.** `Organisation Legal Name` pre-fills from the value collected at signup (`SignupForm.tsx`). If signup captured nothing, the field renders empty. Editable (users can correct). Requires backend wiring — see §28.6.
- **§28.2.c — Step 3 selection affordance.** Every selectable framework tile renders a **circle checkbox** top-right at rest: empty 20×20px circle (1.5px stroke, `outline`) when unselected, `primary`-filled circle with a white `Check` inside when selected. Disabled (Coming Soon) tiles don't render the circle — the `COMING SOON` pill takes that slot. Tile border + glow treatment in §6.5 stays as-is; this is additive.
- **§28.2.d — Step 4 portal-orientation tiles mirror the real sidebar.** Render exactly: Dashboards, Assessment, Maturity Roadmap, Progress & Milestones, Organisation Settings (admin-only — hidden for invitees). Drop the `Team` tile (there is no standalone Team sidebar entry) and drop the separate `Admin Settings` tile (lives under `Organisation Settings` now, not a separate avatar-dropdown destination). Every `Cypher` reference in tile copy swaps to the dynamic `{agent-name}` — same substitution pattern as the rest of the app.
- **§28.2.e — Back / Continue retains state across all four steps.** Client-side: shared onboarding state provider (context or Zustand) with `sessionStorage` hydration so a refresh mid-flow doesn't reset the user. Backend: queued (§28.6) — durable `organizations.onboarding_step` + staged answers so the user can close the tab and resume tomorrow with everything pre-filled.

### 28.3 Post-login chrome

- **§28.3.a — Authenticated footer Contact link opens the pre-filled modal.** Reuses `ContactUsModal` (now email-bearing per §28.1.a). Pre-fills `name` + `email` from the session, read-only; user types only the message. API route stores the submitter's `user_id` alongside the submission so Vik's inbox email identifies the organisation.
- **§28.3.b — Authenticated footer copy + links.** Copyright line: "© 2026 Simplify.IS". Remove the "built upon the monolithic architecture" sentence. Links row: Terms of Service → `/terms`, Privacy Policy → `/privacy`, Contact → opens modal. Remove `Cookie Settings`.
- **§28.3.c — 404 page alignment + copy.** Equal-height tile grid so the three tiles share top / bottom baseline regardless of copy length. Rewrite tile copy to tie to Simplify IS actions (Return to Dashboard / Review Frameworks / Contact us) — no Stitch-prose `Registry Audit` / `Access Protocol` / `Sentinel Status` filler. Footer on 404 carries the same "© 2026 Simplify.IS" line.
- **§28.3.d — User-avatar dropdown actions wired.** `Edit Profile`, `Change Password`, `MFA Settings` open their respective modals (§15.3–§15.5). `Organisation Settings` navigates to `/organisation/users`, admin-only (hidden for non-admins per §4.9). Logout flow unchanged. Modals already exist — this is a hook-up bug, not a build task.

### 28.4 Industry Dashboard corrections (supersede §8 where noted)

- **§28.4.a — Zero-state hides the user polygon and replaces every metric with `—`.** Already locked in §8.9; re-emphasised because the shipped build leaks fabricated numbers (2.8 / 5.0, percentile, benchmark gap) for orgs with no completed assessment.
- **§28.4.b — Radar vertices render numeric score labels.** Both polygons (user and peer) label their score at each of the six vertices. Geist Mono 11px, radial offset ~8px outside the polygon edge, colour matches the polygon. User-polygon labels suppressed in zero-state.
- **§28.4.c — Right rail renamed.** `Industry Metrics V2` → `Industry Metrics` (plain, no version suffix, no orange micro-label). Raleway 700 / 20px treatment consistent with the other section headings.
- **§28.4.d — Right-rail content must be peer-comparative only.** Tiles: Maturity Score + peer percentile band, Benchmark Gap, Strongest Domain vs Peers, Weakest Domain vs Peers, Peer Progress (industry trend). Remove `High Priority Drifts` and `Strategic Maturity Gap` from Industry View — those are personal metrics and belong on Framework View / Risk View. Industry View is "you vs. peers", nothing else.
- **§28.4.e — Heading hierarchy uniform.** Every section heading on Industry View uses the same Raleway 700 / 20px / on-surface treatment. No stray colour accents on section headings, no Geist Mono text pretending to be a heading, no size swaps. Uppercase mono eyebrows above a heading are fine; they don't replace the heading.
- **§28.4.f — Maturity Radar subtitle on one line.** Current copy wraps awkwardly mid-phrase. Either `white-space: nowrap` with a wider container, or tighten to: "Real-time maturity across NIST CSF 2.0 domains".

### 28.5 Framework View + Risk View (supersede §9 / §10 where noted)

- **§28.5.a — Each framework tab gets its own top-left visualisation per §9.3.** NIST tab = radar (user polygon only). ISO tab = stacked compliance bars. APRA tab = stacked level bars. Confirmed requirement — the shipped build currently renders the same view across all three tabs.
- **§28.5.b — Download Report action in top-right of every framework tab.** PDF export placeholder acceptable for MVP; wire to the Stripe-gated endpoint once the PDF engine lands.
- **§28.5.c — Risk View Stage 1 `No` must record and advance within Stage 1.** Current build sends both Yes and No to Stage 2. Fix: `No` posts `applies: false`, advances to the next unanswered risk. Stage 2 only opens once all risks reviewed (master §10.2).
- **§28.5.d — Placeholders pending Vik's Claude AI transcripts.** Framework View and Risk View are slated for deeper polish based on Vik's separate Claude AI discussions. Each relevant page component carries a `// PLACEHOLDER: pending Vik's Claude AI transcripts` comment so the next agent knows to revisit — but doesn't block shipping the structural fix above.

### 28.6 Assessment corrections (supersede §11.1 where noted)

- **§28.6.a — Not-started landing tiles show zeros.** Until an answer is recorded for that framework: Status = `Not Started`, Maturity = `— / 5.0` (NIST) or Compliance = `—%` (ISO), progress bar empty. Single CTA: `Start Assessment`.
- **§28.6.b — Greyed `Review with {agent-name} 🤖` button on not-started tiles.** Tooltip: "You haven't flagged anything for review yet. Mark a question as 'Unsure — discuss with {agent-name}' during assessment to come back to it here." Button activates once the user flags at least one question.
- **§28.6.c — `Resume Assessment` / `Re-assess` only render when their state applies.** Not Started = `Start Assessment` only. In Progress = `Resume Assessment` (+ review when flags exist). Completed = `Re-assess` (+ review when flags exist).
- **§28.6.d — Humanise the in-assessment header.** `ISO 27001:2022 Assessment` (not `ISO_27001:2022assessment`). Question label: `Question 3 of 7 · Govern · GV.OC-01` — never leak raw DB slugs. Pull human names from `ft_iso_controls` / `ft_nist_controls`.
- **§28.6.e — Selecting an answer + Next must advance.** Current build is stuck. Client store writes the answer, `POST /api/v1/assessment/answer` persists, success handler advances `currentQuestionIndex`. If the server route isn't built yet, stub it to return `{ ok: true }` so the client advances, and mark the stub as pending (see §28.8).
- **§28.6.f — Landing tile visual uplift.** Each tile gets framework icon, status pill, maturity / compliance bar with numeric label, 1–2 sentence framework summary, summary line about flagged questions when applicable, and the conditional CTA row above. `surface-container-high` background, ambient shadow, no 1px borders, stagger fade-up on mount (respect reduced-motion).

### 28.7 Sidebar + Progress page

- **§28.7.a — Sidebar must render the `Organisation Settings` top-level entry.** Current build omits it entirely; team invites / billing / audit are unreachable from the sidebar. Implementation per §4.1 — collapsible, `Building2` icon, sub-items Users / Preferences / Billing / Audit, admin-only (hidden from DOM for non-admins per §4.9).
- **§28.7.b — Progress & Milestones page build out.** Three tabs per §13 (Timeline, Comparison, Milestones), each with its own visual language (D3 timeline, bar comparison, milestone ribbon). Empty states for orgs with no history. Placeholder comment notes pending Claude AI transcripts.

### 28.8 Backend tasks queued for the follow-up agent

Pull these into the next agent's task list — they're blockers for the durable onboarding + assessment flows above:

- **Durable onboarding state.** Add `organizations.onboarding_step INT`, `organizations.onboarding_completed_at TIMESTAMPTZ`, plus staged fields for the values collected across steps (`users.agent_name`, `organizations.name`, `organizations.industry`, `organizations.countries JSONB`, `organizations.workforce_scale`, `organizations.selected_frameworks JSONB`). Every step's submit writes through; every step's mount reads. Step 2 also reads the signup-captured organisation name (staged on `auth.users.raw_user_meta_data` or mirrored into `users.organisation_name_staged`).
- **`/api/v1/onboarding/*` endpoints.** Per §24.2 — implement the four step endpoints plus `GET /api/v1/onboarding/state` for the hydrate-on-mount flow.
- **`POST /api/v1/assessment/answer`.** Persist one answer at a time to `assessment_answers`. Returns `{ ok: true, nextQuestionId }`. Until the scoring engine is in, `nextQuestionId` can be computed by index only.
- **`contact_submissions` schema update.** Add `email TEXT NOT NULL` column. New migration under `supabase/migrations/`.
- **Signup → onboarding state bridge.** Ensure `SignupForm.tsx`'s `organisation_name` and `full_name` are captured to a location Step 2 can read (see first bullet). If it's already written to `auth.users.raw_user_meta_data`, expose it via `GET /api/v1/onboarding/state`; otherwise stage it on `users` at signup.

---

*Round 2 deltas logged: April 2026. When Round 3 lands, append §29 rather than rewriting §28 — keeps the history readable.*

*End of master decisions document.*
