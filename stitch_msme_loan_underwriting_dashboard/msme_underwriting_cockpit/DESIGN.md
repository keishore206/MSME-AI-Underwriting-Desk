---
name: MSME Underwriting Cockpit
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#434654'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#737686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1353d8'
  primary: '#003fb1'
  on-primary: '#ffffff'
  primary-container: '#1a56db'
  on-primary-container: '#d4dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#4e5e85'
  on-secondary: '#ffffff'
  secondary-container: '#c1d1ff'
  on-secondary-container: '#4a5980'
  tertiary: '#005439'
  on-tertiary: '#ffffff'
  tertiary-container: '#006f4d'
  on-tertiary-container: '#7ff2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00174d'
  on-primary-fixed-variant: '#003dab'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#b6c6f3'
  on-secondary-fixed: '#081a3e'
  on-secondary-fixed-variant: '#37466c'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  numeric-data:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-density, analytical operating environment tailored for commercial credit risk analysts and senior underwriters evaluating MSME credit facilities. 

The aesthetic marries institutional financial authority with computational precision:
- **Design Movement:** Corporate / Modern mixed with refined data density. Surfaces are clean, architectural, and strictly utilitarian to minimize cognitive fatigue during prolonged analysis sessions.
- **Brand Personality:** Authoritative, vigilant, transparent, and decisively fast. The interface conveys institutional credibility, mathematical rigor, and real-time oversight.
- **Audience:** Credit officers, MSME underwriting teams, and risk operations managers who make mission-critical capital deployment decisions under tight SLAs.
- **Visual Tone:** Grounded, disciplined, and high-clarity. The layout relies on purposeful data hierarchy, crisp separation of states, and high-visibility risk markers rather than purely decorative flair.

## Colors

The palette delivers immediate risk discernment, anchored by deep institutional navies and high-contrast structural tones:

- **Primary (`#1A56DB` - Royal Blue):** Drives primary actions, system focus rings, active interactive elements, and AI confidence indicators.
- **Secondary / Structure (`#0F2044` - Deep Navy):** Anchors primary desktop navigation, global sidebars, and structural contextual zones to create an immutable framing hierarchy.
- **Functional Semantics:**
  - **Approval / Healthy (`#059669` - Emerald Green):** Underwriting approvals, positive debt service coverage, credit clearance, and verified KYC/AML.
  - **Pending / In Review (`#D97706` - Amber):** Manual review triggers, covenant exceptions, mid-tier scoring bands, and human-in-the-loop steps.
  - **Critical / Fraud / Rejection (`#DC2626` - Crimson):** Fraud triggers, debt-burden breaches, entity blacklists, and automated rejections.
- **Surfaces & Canvas:**
  - **Canvas Base:** `#F8FAFC` (Warm White) reduces glare across high-resolution displays.
  - **Card / Module Surface:** `#FFFFFF` (Crisp White) provides contrast against the warm slate canvas.
  - **Subtle Row Alternation:** `#F1F5F9` for data tables and dense multi-line ledger inspections.
- **Typography & Tonal Contrast:**
  - **Primary Text:** `#111827` (Charcoal) ensures AA/AAA compliance on critical financial data and figures.
  - **Secondary Text:** `#6B7280` (Slate) accommodates metadata, field descriptors, and contextual timestamps.
  - **Borders & Dividers:** `#E2E8F0` provides crisp cell demarcation without visual noise.

## Typography

This design system uses Inter throughout all surfaces to maintain systematic metric balance, exceptional small-size legibility, and uniform tabular alignment:

- **Headings:**
  - `headline-lg` (32px Bold, -0.02em tracking) is reserved for workspace titles, entity names, and primary exposure summaries.
  - `headline-sm` (18px Semi-Bold) serves as the primary section header for underwriting dossiers, covenant checklists, and real-time cash flow cards.
- **Body & Data Rendering:**
  - `body-md` (14px Regular) forms the baseline for narrative inputs, risk rationale, and loan notes.
  - `numeric-data` utilizes tabular lining numbers (`font-variant-numeric: tabular-nums`) to guarantee alignment across balance sheets, debit/credit summaries, and debt service ratio lists.
- **Labels & Microcopy:**
  - Uppercase micro-labels (`label-sm`, 11px Semi-Bold, +0.04em tracking) are reserved for table headers, ledger columns, and status categorization tags.

## Layout & Spacing

The workspace prioritizes a desktop-first operating environment optimized for 1440px wide-aspect underwriting displays, adapting cleanly down to tablets and mobile fallback viewports:

- **Desktop Framework (1440px+):**
  - **Structural Navigation:** Fixed 260px wide sidebar clad in `#0F2044`, persistent across all routing contexts.
  - **Fluid Work Canvas:** Content workspace occupies remaining viewport real estate with a maximum content container of `1600px`, anchored by a standard 12-column grid, `1.5rem` (24px) gutters, and `2rem` (32px) margins.
  - **Split Workspace:** Dual-column or three-column dossier split: Left 60% for financial statement scrutiny and document analysis, Right 40% for the AI underwriting recommendation engine and agent status steppers.
- **Tablet / Laptop (1024px – 1439px):**
  - Sidebar collapses into an 72px icon-rail mode. Gutters scale to `1rem` (16px), margins scale to `1.5rem` (24px). The layout transitions to a stacked or tabbed orientation between dossier data and the decision engine.
- **Mobile Handheld (<1024px):**
  - Underwriting views shift to a single-column stacked view with sticky bottom actions for emergency approvals or secondary reviews. Outer margins tighten to `1rem` (16px).

## Elevation & Depth

To preserve an analytical, low-distraction environment, elevation relies on subtle, crisp depth tiers rather than sweeping decorative drop shadows:

- **Level 0 (Canvas Base):** Flat `#F8FAFC` background. Used for layout separation and table gutters.
- **Level 1 (Card & Module Layer):** `#FFFFFF` surfaces with a micro-border `1px solid #E2E8F0` coupled with a low-opacity ambient drop: `0px 1px 3px rgba(15, 32, 68, 0.05), 0px 1px 2px rgba(15, 32, 68, 0.03)`.
- **Level 2 (Active Panels & Popovers):** Elevated contextual flyouts, filter dropdowns, and date pickers use `0px 4px 6px -1px rgba(15, 32, 68, 0.07), 0px 2px 4px -2px rgba(15, 32, 68, 0.05)` over a `1px solid #CBD5E1` border.
- **Level 3 (Modal / Decision Overlay):** Loan rejection or sign-off modals use a focused scrim (`rgba(15, 32, 68, 0.6)`) and a structured elevation of `0px 20px 25px -5px rgba(15, 32, 68, 0.12), 0px 8px 10px -6px rgba(15, 32, 68, 0.06)`.
- **Level -1 (Recessed Inputs & Alternating Grids):** Well inserts, form inputs, and nested ledger rows use flat `#F1F5F9` or pure `#FFFFFF` with internal inset outlines to convey structural stability.

## Shapes

The geometric architecture relies on restrained corner radii to balance dense, tabular precision with approachable modern software standards:

- **Container & Card Radii (`rounded-sm` / 0.25rem - 4px to `rounded-md` / 6px):** Underwriting cards, financial charts, document viewer frames, and analytical containers use minimal 4px to 6px radii to retain sharp grid lines and maximize screen real estate.
- **Form Controls & Inputs (0.25rem / 4px):** Data entry fields, search bars, and dropdown triggers adhere strictly to 4px corners to communicate reliability.
- **Pill Exception (9999px):** Status badges, agent progress tags, risk tiers, and live underwriting status indicators strictly utilize full pill curvature (`rounded-full`) to contrast sharply against rectilinear card boundaries.

## Components

### Buttons
- **Primary:** Background `#1A56DB`, text `#FFFFFF`, 4px radius, `font-weight: 500`. Hover: `#1E40AF`. Active: `#1E3A8A`. Focus ring: 3px `#93C5FD`.
- **Secondary / Ghost:** Crisp white background `#FFFFFF`, border `1px solid #E2E8F0`, text `#111827`. Hover: `#F8FAFC`.
- **Destructive:** Background `#DC2626`, text `#FFFFFF`. Hover: `#B91C1C`. Reserved strictly for rejecting applications or flagging intentional fraud.

### Pill Badges
- **Approval / Pass:** Background `#ECFDF5`, border `1px solid #A7F3D0`, text `#065F46`.
- **In Review / Conditional:** Background `#FFFBEB`, border `1px solid #FDE68A`, text `#92400E`.
- **Fraud / High Risk:** Background `#FEF2F2`, border `1px solid #FECACA`, text `#991B1B`.
- **Neutral / Informational:** Background `#F1F5F9`, border `1px solid #E2E8F0`, text `#475569`.
- **Metrics:** Heights fixed at 22px (`label-sm`) with 8px horizontal padding.

### Data Tables
- **Header:** Background `#F8FAFC`, uppercase slate text (`#6B7280`), `1px solid #E2E8F0` bottom boundary.
- **Row Styling:** Baseline row height 44px for high density. Alternating stripes: Row A `#FFFFFF`, Row B `#F8FAFC`. Hover state: `#EFF6FF`.
- **Alignment:** Financial metrics right-aligned with `tabular-nums`. Status pills centered. Merchant metadata left-aligned.

### Input Fields & Controls
- **Inputs:** Height 36px, border `1px solid #D1D5DB`, background `#FFFFFF`, text `#111827`, placeholder `#9CA3AF`. Active focus transitions border to `#1A56DB` with a 2px blue ring.
- **Checkboxes & Radios:** 16px squares with 3px radius (radios circular), colored `#1A56DB` when checked, bordered in `#D1D5DB` when empty.

### Cards
- Base surface `#FFFFFF`, border `1px solid #E2E8F0`, 6px corner radius, padding `space-lg` (24px). Headers feature an 18px semi-bold title with integrated action slots on the far right.

### Live Agent Status Stepper
- Continuous pipeline visualizing real-time automated assessment:
  - **Completed Phase:** Emerald circle (`#059669`) with an internal white checkmark, joined by a solid emerald connector line.
  - **Active AI Phase:** Royal Blue circle (`#1A56DB`) containing a pulse animation, joined by an animated dashed connector.
  - **Pending Phase:** Slate-bordered hollow circle (`#CBD5E1`) with neutral background.

### Refined Financial Charts
- Embedded cash-flow and debt-service visualizations use minimal gridlines (`#F1F5F9`). Lines render with 2px stroke weight (Primary Blue `#1A56DB`, Benchmark Slate `#94A3B8`). Tooltips render on crisp white cards with `#0F2044` text overlays.