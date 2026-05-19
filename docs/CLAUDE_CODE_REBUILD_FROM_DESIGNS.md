# Claude Code Instructions — Pixel-Perfect Page Rebuild from Design Files
## `CLAUDE_CODE_REBUILD_FROM_DESIGNS.md`
### Purpose: Rebuild all Agent 7 pages to exactly match the HTML + PNG design files saved in `/stitch_output/`

---

## YOUR MISSION

The pages built by Agent 7 do not match the design files visually. Your job is to read every design file in `/stitch_output/`, understand exactly what the page should look like, and rewrite each Next.js page component to match pixel-perfectly.

**You are doing visual/styling work only. Do NOT change:**
- Any routing logic
- Any stub function signatures (form handlers, auth stubs)
- Any TypeScript types
- Any API endpoint references
- Any CSRF token stubs
- Anything in `/lib/`, `/orchestration/`, `/app/api/`

**You ARE rewriting:**
- All page components in `app/(marketing)/` and `app/(auth)/`
- All shared layout components (TopNav, Footer, DarkLightToggle)
- All shared UI components used on pre-login pages (Button, Input, Card, etc.)
- `app/globals.css` — CSS custom properties and design tokens
- `tailwind.config.ts` — ensure all design system tokens are registered

---

## WHERE TO FIND THE DESIGN FILES

All design files are saved at:
```
~/Documents/Code/simplify-is/stitch_output/
```

For each page you will find some combination of these file types:
- `*.html` — the authoritative HTML with exact classes, structure, and inline styles
- `*.png` — screenshot of exactly what the page should look like visually
- `*_light*.html` / `*_light*.png` — light mode variant
- `*_mobile*.html` / `*_mobile*.png` — mobile breakpoint variant
- `*_tablet*.html` / `*_tablet*.png` — tablet breakpoint variant

**The HTML file is your primary source of truth.** Read it in full before writing any code. The PNG is your visual reference to compare against.

---

## HOW TO APPROACH EACH PAGE

For every page, follow this exact process:

### Step 1 — Read ALL design files for that page
```bash
# Read the HTML file(s)
cat ~/Documents/Code/simplify-is/stitch_output/[page-name]*.html

# View the PNG screenshot(s) — open and examine visually
open ~/Documents/Code/simplify-is/stitch_output/[page-name]*.png
```

### Step 2 — Extract design tokens from the HTML
Look for and note down:
- Background colours (exact hex values)
- Text colours (exact hex values)
- Font families (Raleway, Josefin Sans, Montserrat, Geist Mono)
- Font sizes, weights, letter-spacing values
- Padding and margin values
- Border styles (ghost borders, no solid lines)
- Glassmorphic effects (`backdrop-blur`, opacity values)
- Gradient definitions (terracotta gradients, dividers)
- Box shadow / glow effects
- Animation classes

### Step 3 — Rewrite the Next.js page component
- Convert the HTML structure to React/JSX
- Use Tailwind classes where possible
- Use CSS custom properties (var(--color-primary) etc.) for design tokens
- Preserve ALL routing logic and stub functions from the existing file — only change visual/layout code
- Maintain TypeScript strict mode

### Step 4 — Implement dark + light mode
- Dark mode = default (no class needed)
- Light mode = applied via `.light` class on `<html>` element
- Check both HTML files and implement both themes
- Test toggle switches correctly

### Step 5 — Implement all three breakpoints
- Mobile (375px): single column, hamburger nav
- Tablet (768px): 2-column where applicable
- Desktop (1280px): full layout
- Use Tailwind responsive prefixes: `sm:` `md:` `lg:` `xl:`

### Step 6 — Visual check
After writing each page, run `npm run dev` and compare side-by-side with the PNG. They should be indistinguishable.

---

## PAGE REBUILD ORDER

Work through pages in this order. Complete one fully (dark + light + all breakpoints) before moving to the next.

| Priority | Page | Route | Design Files to Read |
|----------|------|-------|---------------------|
| 1 | Landing Page | `/` | `page1_landing_*` |
| 2 | Login | `/login` | `page9_login_*` |
| 3 | Signup | `/signup` | `page11_signup_*` |
| 4 | Email Verify | `/signup/verify` | `page12_verify_*` |
| 5 | MFA | `/login/mfa` | `page10_mfa_*` |
| 6 | How It Works | `/how-it-works` | `page2_howitworks_*` |
| 7 | Frameworks | `/frameworks` | `page3_frameworks_*` |
| 8 | Pricing | `/pricing` | `page4_pricing_*` |
| 9 | Maturity Model | `/maturity-model` | `page5_maturity_*` |
| 10 | Meet Cypher | `/meet-cypher` | `page6_cypher_*` |
| 11 | Terms of Service | `/terms` | `page7_terms_*` |
| 12 | Privacy Policy | `/privacy` | `page8_privacy_*` |
| 13 | 404 Error | `/404` | `page13_404_*` |
| 14 | Forgot Password | `/forgot-password` | Build from design system — match login aesthetic |
| 15 | Reset Password | `/reset-password` | Build from design system — match login aesthetic |
| 16 | 403 / 500 / 503 | `/403` `/500` `/503` | Build from design system — match 404 aesthetic |

---

## DESIGN SYSTEM TOKENS TO REGISTER

Ensure these are in `app/globals.css` as CSS custom properties, and registered in `tailwind.config.ts`:

```css
:root {
  /* Dark mode defaults */
  --color-primary: #EB5E28;
  --color-primary-deep: #C44A1A;
  --color-secondary: #7C3AED;
  --surface-base: #1A1917;
  --surface-container-low: #252320;
  --surface-container-high: #2E2B28;
  --surface-bright: #3A3530;
  --text-primary: #FFFCF2;
  --text-secondary: #E6E2DE;
  --text-muted: #CCC5B9;
  --text-subtle: #A88A80;
  --border-subtle: rgba(168, 138, 128, 0.15);
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --glow-brand: 0 0 20px rgba(235, 94, 40, 0.15);
  --glow-cyan: 0 0 20px rgba(0, 212, 255, 0.15);
  --glow-violet: 0 0 20px rgba(124, 58, 237, 0.15);
}

html.light {
  /* Light mode overrides — warm cream/stone tones */
  --surface-base: #F5F0E8;
  --surface-container-low: #EDE8DE;
  --surface-container-high: #E5DFD3;
  --surface-bright: #D9D2C4;
  --text-primary: #1A1917;
  --text-secondary: #2E2B28;
  --text-muted: #4A4540;
  --text-subtle: #6B5E55;
  --border-subtle: rgba(90, 75, 65, 0.15);
  /* accent colours remain same */
}
```

---

## FONTS — MUST BE LOADED

In `app/layout.tsx`, ensure these Google Fonts are loaded:

```typescript
import { Raleway, Josefin_Sans, Montserrat } from 'next/font/google'
// Geist Mono — use next/font/local or import from 'geist/font/mono'
```

Tailwind font family config:
```javascript
fontFamily: {
  'raleway': ['Raleway', 'sans-serif'],
  'josefin': ['Josefin Sans', 'sans-serif'],
  'montserrat': ['Montserrat', 'sans-serif'],
  'mono': ['Geist Mono', 'monospace'],
}
```

---

## CRITICAL DESIGN RULES (FROM DESIGN SYSTEM)

Read these carefully — these are the rules that make the difference between bland and premium:

### The No-Line Rule
**NEVER use `border: 1px solid` for sectioning.** Use background colour shifts to separate regions. Ghost borders (`rgba(168,138,128,0.15)`) only as accessibility fallback.

### No Pure Black
**NEVER use `#000000`.** Always use `--surface-base` (`#1A1917`) for the darkest backgrounds.

### No Pill Buttons
Buttons use sharp edges or very subtle radius (`rounded` = 0.25rem max). No `rounded-full` on buttons.

### Glassmorphic Nav
```css
background: rgba(26, 25, 23, 0.80);
backdrop-filter: blur(12px);
```

### Oversized Section Numbers
Sections use faded large numbers (01, 02, 03) as background decorative elements. Colour: `--text-subtle` at 10–15% opacity.

### All Transitions
```css
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Button Primary
```css
background: linear-gradient(135deg, #EB5E28, #C44A1A);
color: #FFFCF2;
box-shadow: var(--glow-brand);  /* on hover */
```

### Input Fields
```css
background: var(--surface-container-low);
border-bottom: 1px solid var(--border-subtle);  /* bottom only */
/* On focus: */
border-bottom-color: var(--color-primary);
box-shadow: 0 4px 8px rgba(235, 94, 40, 0.1);
```

### Section Dividers
```css
background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
height: 1px;
```

---

## DARK/LIGHT TOGGLE IMPLEMENTATION

The toggle must be present on every single page. Implement it as a shared component:

```typescript
// components/marketing/DarkLightToggle.tsx
'use client'
import { useEffect, useState } from 'react'

export function DarkLightToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('simplify-theme')
    const prefersDark = saved ? saved === 'dark' : true
    setIsDark(prefersDark)
    document.documentElement.classList.toggle('light', !prefersDark)
  }, [])

  const toggle = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem('simplify-theme', newIsDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('light', !newIsDark)
  }

  return (
    <button onClick={toggle} aria-label="Toggle dark/light mode">
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
```

Place it top-right in the navigation bar on every page.

---

## ANIMATIONS (FRAMER MOTION)

All scroll-triggered section reveals:
```typescript
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
}
```

Respect reduced motion:
```typescript
import { useReducedMotion } from 'framer-motion'
const shouldReduce = useReducedMotion()
// Pass shouldReduce to disable animations when true
```

---

## WHAT NOT TO TOUCH

These files must not be modified — they contain backend logic from Agents 1–5:

```
lib/auth/client.ts
lib/auth/server.ts
lib/auth/context.tsx
lib/db/
lib/config/env.ts
lib/api/
orchestration/
app/api/
middleware.ts
supabase/migrations/
```

Any stub functions already in auth page components (login, signup, etc.) — keep them exactly as-is. Only change the JSX/visual layer around them.

---

## DEFINITION OF DONE

You are finished when:

- [ ] Every page listed in the rebuild order is complete
- [ ] Every page matches its PNG screenshot pixel-perfectly
- [ ] Dark mode and light mode both work on every page
- [ ] Toggle persists in localStorage key `simplify-theme`
- [ ] All three breakpoints work (375px, 768px, 1280px)
- [ ] `npm run lint` passes — zero errors
- [ ] `npm run build` passes — zero errors
- [ ] No console errors in browser on any page
- [ ] All animations smooth, `prefers-reduced-motion` respected
- [ ] Write `HANDOFF_7B_VISUAL_REBUILD.md` listing every page fixed and confirming lint + build pass

---

## FINAL NOTE

The design files in `/stitch_output/` are the single source of truth. If anything in this instruction file conflicts with what you see in the HTML/PNG files — **the files win.** Trust the design files over any written description.

Take your time. Do one page at a time. Get it right before moving on.

*Instructions written April 2026.*
