```markdown
# Design System Specification: The Monolithic Archive

## 1. Overview & Creative North Star
This design system is built upon a philosophy of **"Earthen Brutalism."** It is a visual language that rejects the flimsy, ephemeral nature of standard web templates in favor of something that feels permanent, architectural, and authoritative. 

### The Creative North Star: The Digital Curator
We treat the interface not as a screen, but as a physical archive. By utilizing high-contrast typography scales, intentional asymmetry, and deep, tonal layering, we move away from "software" and toward "experience." Elements should feel like they are carved from stone or resting on heavy, matte surfaces. We use glassmorphism not for "trendiness," but to simulate the way light filters through a dark, professional sanctuary.

---

## 2. Color & Atmospheric Depth
The palette is a sophisticated interplay between the void (Deep Charcoal) and the spark (Burnt Orange). 

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders for sectioning are strictly prohibited.** Structural boundaries must be defined through background color shifts or tonal transitions. Use `surface-container-low` against `surface` to define a sidebar, or `surface-container-highest` to define a header. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Each layer is "stacked" using the following hierarchy:
- **Base:** `surface` (#141311) – The foundation.
- **In-set:** `surface-container-low` (#1C1B19) – For secondary content areas.
- **Elevated:** `surface-container-high` (#2B2A28) – For primary interactive cards.
- **Active/Floating:** `surface-bright` (#3A3937) – For modals or active states.

### The "Glass & Gradient" Rule
Floating elements (Modals, Popovers, Navigation Bars) should utilize a glass effect: 
- **Fill:** `bg-surface` at 80% opacity.
- **Effect:** `backdrop-blur: 12px`.
- **Glow:** Main CTAs should feature a `glow-brand`: `0 0 20px rgba(235,94,40,0.15)`. This mimics the "ember" effect of the brand's primary accent.

---

## 3. Typography: Editorial Authority
The type system uses a triple-typeface approach to create a rich, tiered hierarchy that feels custom-commissioned.

*   **Display & Headlines (Raleway):** Used for large-scale editorial moments. The high x-height and sophisticated letterforms should be set with tight tracking (-0.02em) for headlines to command attention.
*   **Subheadings & Labels (Josefin Sans):** This is our "signature" font. Its geometric, vintage-modern flair provides a technical but warm touch to labels and metadata.
*   **Body & Utility (Montserrat):** Used for long-form reading. Set with generous line-height (1.6) to ensure the deep charcoal background remains legible and does not fatigue the eye.
*   **Code (Geist Mono):** Precision-engineered for technical data and code blocks, reflecting the "dev" aspect of the brand identity.

---

## 4. Elevation & Depth
In this system, depth is a function of light and material, not artificial drop shadows.

### The Layering Principle
Hierarchy is achieved by stacking `surface-container` tiers. For example, a card (`surface-container-high`) sitting on a section (`surface-container-low`) creates natural lift. 

### Ambient Shadows
When a floating element requires a shadow (e.g., a dropdown), it must be **extra-diffused**:
- `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);`
- Shadows should be tinted with the `on-surface` color (#E6E2DE) at very low opacity to simulate light refracting off the warm text colors.

### The "Ghost Border" Fallback
If a boundary is required for accessibility, use a **Ghost Border**:
- `border: 1px solid rgba(168, 138, 128, 0.15);` (using the `outline` token at 15% opacity).
- **Never** use 100% opaque, high-contrast borders.

---

## 5. Signature Components

### Buttons
- **Primary:** Burnt Orange (#EB5E28) to Deep Orange (#C44A1A) subtle linear gradient. Text: Warm White. 
- **Secondary:** Warm Stone (#CCC5B9) ghost style. A Ghost Border is used here, filling on hover.
- **Interaction:** All transitions must be `300ms cubic-bezier(0.4, 0, 0.2, 1)`.

### Cards & Containers
- **Construction:** No dividers. Use `2rem` of vertical white space to separate content.
- **Hover:** Cards should transition from `surface-container-high` to `surface-bright` with a subtle `glow-brand`.

### Input Fields
- **Base:** `surface-container-lowest` with a bottom-only Ghost Border.
- **Focus:** The bottom border transitions to Primary Accent (#EB5E28) with a 4px soft outer glow.

### Navigation / Header
- **Style:** Glassmorphic background with `backdrop-blur`.
- **Layout:** Intentional asymmetry. Place the logo at the far left and the primary action at the far right, leaving a wide, "breathed-out" center for a minimalist feel.

---

## 6. Do’s and Don’ts

### Do
- **Do** use overlapping elements. A floating image or card that breaks the container line creates a premium, editorial look.
- **Do** lean into the "Warm Stone" (`secondary`) for secondary text to keep the interface feeling earthy and grounded.
- **Do** use `Geist Mono` for small, all-caps metadata to add a layer of technical sophistication.

### Don't
- **Don't** use standard 12-column grids for everything. Allow for "dead space" to focus the user's eye.
- **Don't** use pure black (#000000). Always use the `bg-deep` (#1A1917) to maintain the "charcoal" warmth.
- **Don't** use sharp 90-degree corners. Adhere to the `DEFAULT` (0.25rem) or `md` (0.375rem) rounding scale to soften the "Brutalist" edges.