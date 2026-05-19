# Simplify IS — UI/UX Component & Design System Export

> **Purpose:** Take this to Google Stitch (or any design tool) to redesign visuals.
> Return an updated MD with changes and I'll implement them.

---

## 1. Design Tokens (Current)

### Colors

| Token             | Hex       | Usage                          |
|-------------------|-----------|--------------------------------|
| `bg-deep`         | `#0A0F1E` | Page background                |
| `bg-surface`      | `#111827` | Cards, panels, sidebar         |
| `bg-elevated`     | `#1A2234` | Hover states, nested surfaces  |
| `accent-primary`  | `#00D4FF` | Primary actions, links, glows  |
| `accent-secondary`| `#7C3AED` | ISO badge, secondary accent    |
| `success`         | `#10B981` | Positive deltas, completions   |
| `warning`         | `#F59E0B` | Overdue warnings, caution      |
| `danger`          | `#EF4444` | Errors, critical alerts        |
| `text-primary`    | `#F9FAFB` | Headings, body text            |
| `text-muted`      | `#9CA3AF` | Secondary text, labels         |
| `border`          | `#1E293B` | Card borders, dividers         |

### Glows

| Token        | Value                               |
|--------------|-------------------------------------|
| `glow-cyan`  | `0 0 20px rgba(0, 212, 255, 0.15)`  |
| `glow-violet`| `0 0 20px rgba(124, 58, 237, 0.15)` |

### Typography

| Role     | Font Family       | CSS Variable           |
|----------|-------------------|------------------------|
| Heading  | DM Serif Display  | `--font-dm-serif`      |
| Body     | DM Sans           | `--font-dm-sans`       |
| Mono     | JetBrains Mono    | `--font-jetbrains-mono`|

### Radius

| Element | Value  |
|---------|--------|
| Card    | `12px` (rounded-xl) |
| Button  | `12px` (rounded-xl) |
| Input   | `12px` (rounded-xl) |
| Badge   | `6px`  (rounded-md)  |

---

## 2. Screens & Layouts

### 2.1 Marketing / Landing Page (`/`)

**Layout:** Single column, max-width 6xl, centered  
**Sections (top to bottom):**

1. **Hero** — badge "Security Intelligence Platform", large heading, subtitle, CTA button "Start Free Trial", link "See how it works ↓"
2. **Mock dashboard card** — 4-column grid: Maturity (large number), Controls Assessed (%), Overdue Reviews, Critical Gaps
3. **Pain points** — 3-column card grid: Time, Cost, Expertise (each with icon + text)
4. **How it works** — 3-step card grid with icons
5. **Frameworks** — 2-column cards: ISO 27001:2022, NIST CSF 2.0 (each with badge "included in base plan")
6. **Pricing** — single card, "Coming soon"
7. **Footer** — border-top, company info + links

### 2.2 Auth Pages (`/login`, `/signup`, `/verify`)

**Layout:** Centered column, max-width `md`, vertically centered (min-h-screen)

**Login:**
- Heading: "Log in to Simplify IS"
- Subtitle: "Continue your security assessment."
- Email input (placeholder: "Email")
- Password input (placeholder: "Password")
- Error text (red-400)
- Submit button: "Sign in" / "Signing in..."
- Link: "New here? Create an account"

**Signup:**
- Heading: "Create your account"
- Subtitle: "We'll email a verification link after signup."
- Email input
- Password input (min 8 chars)
- Submit button: "Sign up" / "Creating account..."
- Link: "Already have an account? Log in"

**Verify:**
- Heading: "Check your email"
- Text: verification link instructions

**Current style:** Dark bg, `bg-slate-900` inputs, `border-slate-600`, `text-slate-100`, `placeholder:text-slate-400`, cyan-400 buttons

### 2.3 Onboarding (`/onboarding`)

**Layout:** Centered column, max-width 2xl, vertically centered  
**5-step wizard:**

| Step | Field                | Type     |
|------|----------------------|----------|
| 1    | Organization name    | Text input |
| 1    | Your name (optional) | Text input |
| 2    | Industry             | Select dropdown (9 options) |
| 3    | Organization size    | Select (small / medium / enterprise) |
| 4    | Country              | Text input (default: "Australia") |
| 5    | Initial frameworks   | Checkboxes: ISO 27001, NIST CSF |

- Progress: "Step X of 5" subtitle
- Navigation: Back button (steps 2-5), Next button (steps 1-4), Finish setup (step 5)
- Error display below fields
- Buttons: cyan-400 bg, slate-950 text

### 2.4 Dashboard Layout (`/dashboard`)

**Layout:** Full-height, flex row

**Left sidebar (240px, collapsible to 60px):**
- App title: "Simplify IS" (hidden when collapsed)
- Framework badges: ISO, NIST
- Nav items (icon + label): Dashboard, Assessment, History, Compliance, Settings
- Nav style: left border accent on hover, bg-elevated on hover

**Top header bar (h-14):**
- Breadcrumb: "Dashboard > ISO 27001"
- Right side: Maturity badge, notification bell, user name

**Main content area (p-4):**
- Tab bar: "Industry view" | "Framework view" | "Risk view"

### 2.5 Dashboard — Industry View

**Components (top to bottom):**

1. **ScoreCards** — 2-column grid (ISO 27001 + NIST CSF)
   - Each card contains:
     - Framework badge (top-left)
     - "Last assessed X days ago" (top-right)
     - Large score number (mono, 5xl) — shows "--" if no data
     - Delta indicator (arrow up/down/stable + value)
     - Maturity label
     - Sparkline chart (mini line chart)
     - Progress bar (domains completed %)

2. **Empty state** (when no assessments) — centered card:
   - "No assessments yet"
   - "Start your first assessment to see maturity scores here."
   - CTA button: "Start Assessment"

3. **RadarChart** (when data exists) — D3 SVG radar/spider chart
   - Concentric circles (1-5 scale)
   - Previous scores: gray line
   - Current scores: cyan filled area
   - Domain labels around perimeter

4. **DomainCards** — 3-column grid
   - Each card:
     - Domain name (heading)
     - Score (mono, 4xl) — "--" if null
     - Controls progress: "X of Y controls assessed" + progress bar
     - Delta indicator
     - Action button: "Start" / "Continue Assessment" / "Reassess"
     - Glow effect: red (<2), amber (<3.5), cyan (≥3.5)

5. **ScoreTimeline** — D3 line chart in a card
   - Two lines: ISO (cyan) and NIST (violet)
   - Clickable data points
   - Time range sliders
   - "Viewing state from [date]" banner when historical point selected

### 2.6 Dashboard — Framework View (Compliance Calendar)

**Sections (collapsible cards):**
- **Overdue** (red heading) — list of overdue controls
- **Due this month** (amber heading)
- **Due in 1-3 months** (muted heading)
- Each item: control name, days overdue/remaining, framework badge, "Review Now" button
- Empty state: "All controls up to date — great work" with check icon

### 2.7 Dashboard — Risk View

**Two states:**

**Not enabled:**
- Centered card: heading, description, "Enable Risk Assessment" button

**Enabled:**
- 3-column grid of risk template cards (e.g. "Third-party breach", "Ransomware")
- Each: name, description, "Add to my profile" button
- Custom risk textarea input
- Selected risks shown as cards below

### 2.8 Assessment — Cypher Chat (Slide-in Overlay)

**Container:** Fixed panel, right side, max-width 820px, full height, z-50  
**Backdrop:** Fixed black/50 overlay (click to close)

**Panel structure:**
- **Header:** Cypher avatar (circle), "Cypher — Security Assessment", close button
- **Chat area** (scrollable):
  - Cypher messages: left-aligned, bg-elevated, cyan left border
  - User messages: right-aligned, bg-[#1f2937]
  - Signal messages: "Signal captured" badge (cyan) + confirm/deny buttons
  - Contradiction messages: "Something to check" label (warning) + response options
  - Loading state: spinner + "Cypher is analyzing your response..."
- **Quick replies** (above input): pill buttons — "I'm not sure", "This doesn't apply", "Let's skip this for now"
- **Input area:** Textarea with character count (2000 max), Send button

### 2.9 Assessment — Group Progress Sidebar

**Layout:** 272px wide sidebar, left side of assessment  
**Content:**
- "Domain and group progress" label
- List of domain groups, each:
  - Domain name + status icon (check/spinner/circle)
  - Active domain expands to show individual controls with check/circle icons

### 2.10 Assessment — Domain Complete Overlay

**Layout:** Centered modal over black/50 backdrop, 560px card  
**Content:**
- "Domain Complete" heading
- Domain name
- Score transition: "3.4 → 3.8" (mono, 4xl)
- Delta with color (green up, red down)
- Summary message
- "Continue" button

### 2.11 Assessment — Answer Revision Panel

**Layout:** Fixed right panel, 480px wide, full height  
**Content:**
- "Revise Answer — [control name]" heading + close button
- Original answer card (readonly, scrollable)
- New answer textarea
- Reason input (optional)
- "Update Answer" button
- Revision count card

### 2.12 Assessment — Session Timeout

**Warning banner:** "Session pausing in 2 minutes." + "Stay active" link  
**Paused modal:** "Still there, [name]?" + "Resume" button

### 2.13 Notification Bell (Dropdown)

**Trigger:** Bell icon with unread count badge  
**Dropdown (360px card):**
- "Notifications" heading + "Mark all read" button
- Grouped by: Today, This Week, Earlier
- Each item: icon (by type) + title + description
- Types: confidence (warning triangle), domain (sparkle), overdue (shield alert), system (circle alert)
- Currently starts empty for new accounts

---

## 3. Shared UI Components

### Button

| Variant   | Style                                           |
|-----------|-------------------------------------------------|
| primary   | `bg-accent-primary text-bg-deep` + cyan glow hover |
| secondary | transparent, border, text-primary, elevated hover  |
| ghost     | transparent, muted text, elevated hover            |
| danger    | `bg-danger text-white`                             |

| Size | Height | Padding   |
|------|--------|-----------|
| sm   | h-8    | px-3      |
| md   | h-10   | px-4      |
| lg   | h-12   | px-6      |

Features: loading spinner state, disabled state (opacity-60)

### Card

| Variant     | Style                                          |
|-------------|-------------------------------------------------|
| default     | bg-surface, border                              |
| elevated    | bg-elevated, shadow-lg                          |
| interactive | bg-surface, hover: lift + cyan border + glow    |

### Badge

| Kind    | Colors                           |
|---------|----------------------------------|
| iso     | violet bg/text/border (20%/100%/30%) |
| nist    | cyan bg/text/border              |
| success | green bg/text/border             |
| warning | amber bg/text/border             |
| danger  | red bg/text/border               |
| neutral | elevated bg, muted text          |

### Input / Textarea

- rounded-xl, border-border, bg-bg-surface, text-text-primary
- Focus: cyan border + cyan ring (30% opacity)
- Note: Auth/onboarding pages currently use hardcoded `bg-slate-900 / border-slate-600 / text-slate-100` for reliability

### ScoreDisplay

- Score: mono, 5xl
- Delta: arrow icon + colored value (success/danger/muted)
- Maturity label: xs muted text

---

## 4. Interaction Patterns

| Pattern              | Current Behavior                                    |
|----------------------|-----------------------------------------------------|
| Assessment open      | Slide-in overlay from right, backdrop click to close |
| Domain complete      | Animated modal overlay                               |
| Answer revision      | Fixed right panel                                    |
| Session timeout      | Warning banner → full-screen pause modal             |
| Notifications        | Dropdown on bell click                               |
| Sidebar collapse     | Toggle 240px ↔ 60px, labels hidden when collapsed   |
| Score animation      | Counter animates from 0 to target over 800ms         |
| Empty states         | Centered card with CTA to start relevant action      |

---

## 5. Known Visual Issues to Address

1. **Theme token inconsistency** — Auth/onboarding pages use hardcoded Tailwind colors (slate-900, cyan-400) instead of design tokens because custom CSS variable-based classes weren't rendering reliably in the browser bundle
2. **Radar chart** — D3 SVG, not responsive to container resize
3. **ScoreTimeline** — D3 SVG, range sliders are unstyled HTML defaults
4. **No dark/light mode toggle** — currently dark only
5. **Cypher avatar** — empty circle placeholder, needs actual avatar/icon
6. **Mobile responsiveness** — sidebar doesn't collapse on mobile, assessment overlay is full-width but not optimized for small screens
7. **ComplianceCalendar** — was hardcoded placeholder data (now empty), needs real data integration
8. **Quick reply pills in chat** — non-functional (visual only)

---

## 6. File Map

| File | What it renders |
|------|----------------|
| `app/globals.css` | CSS variables, body defaults |
| `styles/design-system.ts` | Tailwind theme extension tokens |
| `components/ui/Button.tsx` | Button (4 variants, 3 sizes, loading) |
| `components/ui/Card.tsx` | Card (3 variants) |
| `components/ui/Badge.tsx` | Badge (7 kinds) |
| `components/ui/Input.tsx` | Input, Textarea, FieldError |
| `components/ui/ScoreDisplay.tsx` | Large score + delta display |
| `components/dashboard/ScoreCard.tsx` | Framework score card with sparkline |
| `components/dashboard/RadarChart.tsx` | D3 radar/spider chart |
| `components/dashboard/ScoreTimeline.tsx` | D3 dual-line timeline chart |
| `components/dashboard/DomainCard.tsx` | Domain score card with progress |
| `components/dashboard/ComplianceCalendar.tsx` | Compliance review calendar |
| `components/dashboard/RiskView.tsx` | Risk profile manager |
| `components/chat/CypherChat.tsx` | Cypher chat interface |
| `components/assessment/AssessmentController.tsx` | Assessment flow state machine |
| `components/assessment/GroupView.tsx` | Domain/group progress sidebar |
| `components/assessment/DomainCompleteOverlay.tsx` | Domain completion modal |
| `components/assessment/AnswerRevision.tsx` | Answer revision panel |
| `components/assessment/SessionTimeoutHandler.tsx` | Timeout warning + pause |
| `components/layout/NotificationBell.tsx` | Notification dropdown |
| `components/onboarding/EmptyState.tsx` | Cypher intro + start assessment |
| `app/(auth)/login/page.tsx` | Login form |
| `app/(auth)/signup/page.tsx` | Signup form |
| `app/onboarding/page.tsx` | 5-step onboarding wizard |
| `app/dashboard/layout.tsx` | Dashboard shell (sidebar + header) |
| `app/dashboard/page.tsx` | Dashboard content (tabs + data) |
| `app/assessment/page.tsx` | Assessment overlay wrapper |
| `app/(marketing)/page.tsx` | Landing/marketing page |

---

## 7. How to Return Changes

When you bring back updates, structure them like this:

```markdown
## Design Changes

### Token Updates
- `bg-deep`: #0A0F1E → #NEW_VALUE
- New token: `accent-tertiary`: #VALUE

### Component: Button
- primary variant: change bg to gradient(...)
- Add new variant: "outline"
- border-radius: 12px → 8px

### Screen: Dashboard
- ScoreCard: add framework icon top-left
- Remove sparkline, replace with bar chart
- DomainCard: change glow to solid left border

### Screen: Login
- Add company logo above heading
- Change button style to match new primary
```

I'll implement each change directly into the codebase.
