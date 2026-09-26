---
name: Clinical Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0daee'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff3ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dfe9fc'
  surface-container-highest: '#d9e3f7'
  on-surface: '#121c2a'
  on-surface-variant: '#4c4546'
  inverse-surface: '#273140'
  inverse-on-surface: '#ebf1ff'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#545f72'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f7'
  on-secondary-container: '#586376'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00210e'
  on-tertiary-container: '#009854'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#d8e3f9'
  secondary-fixed-dim: '#bcc7dd'
  on-secondary-fixed: '#111c2c'
  on-secondary-fixed-variant: '#3c4759'
  tertiary-fixed: '#82faab'
  tertiary-fixed-dim: '#64dd91'
  on-tertiary-fixed: '#00210e'
  on-tertiary-fixed-variant: '#00522b'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f7'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 44px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  title-sm:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-telemetry:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.25rem
  margin: 1.25rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system delivers an elevated, medical-grade personal companion experience reminiscent of high-end consumer diagnostics and Cupertino hardware aesthetics. It balances sterile clinical credibility with tactile consumer luxury.

### Aesthetic Core
- **Hyper-Minimalist Medical:** Expansive negative space, razor-sharp typographic hierarchy, and surgical alignment.
- **Hardware-Inspired Depth:** Physical feeling derived from soft diffuse multi-stop shadows, hairline borders, and polished monochromatic surfaces.
- **Biometric Telemetry:** Information architecture prioritizes live readouts, trend lines, and clinical biomarkers rendered with calm, understated precision rather than alarming dashboard noise.

## Colors

The palette is rooted in an ultra-clean monochrome and surgical silver spectrum, accented with precise, muted clinical telemetry states.

### Palette Architecture
- **Pitch Black (`#000000`):** Anchors primary actions, core numerical readouts, and high-impact micro-typography.
- **Canvas Tiers:**
  - Base Background: Pure White (`#FFFFFF`) for elevated cards and ambient canvases.
  - Recessed Surfaces: Platinum Ice (`#F8F9FA`) and Silver Substrate (`#F1F3F5`) for segmented wells and foundational canvas depth.
- **Structural Outlines:** Subtle hairline divider gray (`#E9ECEF`) defining component perimeters without visual clutter.
- **Medical Telemetry Accents:**
  - Neutral / Steady: Slate Chromium (`#5A6578`) for baseline monitoring and axis lines.
  - Optimal / Balanced: Clinical Sage/Emerald (`#0F9D58`) for normal ranges and calibrated readouts.
  - Cautionary: Muted Amber (`#D97706`) for physiological shifts requiring attention.
  - Critical: Precision Crimson (`#DC2626`) reserved strictly for acute anomalies.

## Typography

The type system utilizes Inter to achieve an authoritative, neutral voice mirroring diagnostic instrumentation and native device typography.

### Rules of Usage
- **Tabular Numerics:** All clinical figures, vital indicators, and time-stamped telemetry data must use tabular figures (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during live data feeds.
- **Tracking Protocols:** Display metrics feature tight negative tracking for density and optical weight. Telemetry labels and metadata tags utilize uppercase styling with loose tracking (`0.06em`) to preserve legibility at sub-12px sizes.

## Layout & Spacing

A disciplined 4pt/8pt dynamic grid dictates internal card layouts, nested metrics, and outer safe boundaries.

### Layout Principles
- **Mobile First Focus:** Screen margins default to 20px (`1.25rem`) on mobile viewports to provide edge breathing room while maximizing lateral telemetry chart width.
- **Card Clustered Architecture:** Data is isolated into distinct, self-contained telemetry pods rather than endless dividing lines. Related biometric datapoints sit with tight internal padding (`space-md`), framed by generous external separations (`space-lg`).

## Elevation & Depth

Visual separation relies on physical surface shifts rather than high-contrast drops.

### Elevation Hierarchy
- **Level 0 (Canvas Base):** Recessed canvas rendered in `#F8F9FA` or `#F1F3F5`.
- **Level 1 (Telemetry Pods & Main Cards):** Pure `#FFFFFF` surfaces paired with a 1px border of `#E9ECEF` and a dual-stage micro shadow:
  - Ambient: `0 1px 3px rgba(0, 0, 0, 0.02)`
  - Direct: `0 12px 32px -4px rgba(0, 0, 0, 0.04)`
- **Level 2 (Interactive Flyouts & Modals):** Pure `#FFFFFF` floating panels with `0 24px 48px -12px rgba(0, 0, 0, 0.08)` and crisp `#E9ECEF` hairline borders.
- **Level 3 (Tactile Push Elements):** Solid `#000000` buttons utilize no drop shadow, grounding themselves strictly via absolute value contrast against the light environment.

## Shapes

The form language is ultra-rounded, soft, and ergonomically shaped to balance clinical precision with comforting hardware ergonomics.

### Curvature Profiles
- **Telemetry Pods & Health Cards:** Heavy, fluid corner radiuses calibrated at `24px` to `28px` (falling within `rounded-xl`).
- **Pill Badges & Primary Interactive Controls:** Complete `9999px` full-radius pills for floating chips, segmented switchers, and call-to-action touchpoints.
- **Internal Micro Containers:** Input wells and nested graph enclosures step down to `16px` to harmonize with parent card radii.

## Components

### Buttons
- **Primary CTA:** Pitch black (`#000000`) fill, pure white (`#FFFFFF`) typography, 52px height, full pill shape (`9999px`) or `18px` roundedness. No borders; subtle scale-down feedback (`0.98`) upon press.
- **Secondary / Ghost:** `#F1F3F5` background, `#000000` text, zero border, matches primary dimensions.

### Telemetry Health Cards
- **Construction:** Crisp `#FFFFFF` surface, `26px` corner radius, `1px solid #E9ECEF`.
- **Structure:** Top header houses uppercase telemetry category in `label-telemetry` (`#8A94A6`), accompanied by a live pulse status indicator (6px circular badge). Main reading sits in `headline-lg` tabular figures, supported by subtle trend differentials underneath.

### Segmented Chips & Range Selectors
- **Structure:** Encased in a continuous `#F1F3F5` track with `9999px` radius.
- **Active State:** Solid white background floating above the track with a subtle `0 2px 8px rgba(0,0,0,0.06)` shadow and pitch black typography. Inactive state remains muted `#5A6578`.

### Form Fields & Inputs
- **Treatment:** Soft platinum wells (`#F8F9FA`) with hairline `#E9ECEF` outlines, switching on focus to a crisp `#000000` 1px border. Floating unit labels (e.g., "mg/dL", "BPM") sit right-aligned in tabular `body-md` slate.

### Selection Controls
- **Checkboxes & Radios:** Unchecked states rendered in 1.5px `#E9ECEF` rings on white. Checked state transitions cleanly to solid `#000000` with high-contrast `#FFFFFF` check/dot glyphs.