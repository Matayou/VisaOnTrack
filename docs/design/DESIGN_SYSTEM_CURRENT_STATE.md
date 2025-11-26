# Design System Current State

**Date:** 2025-01-22 (Updated)  
**Status:** Active Design System - Phase 1 & 2 Complete (100% Coverage Achieved)

## Overview

This document captures the current state of the design system implementation in VisaOnTrack v2, including design tokens, component library, and usage patterns.

## Design Tokens

### CSS Variables (globals.css)

The `apps/web/app/globals.css` file defines minimal CSS variables:

```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-success: #16a34a;
  --color-text-primary: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-tertiary: #a3a3a3;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #fafafa;
  --color-border-light: rgba(0, 0, 0, 0.06);
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --color-surface-footer: #05070f;
  --color-surface-footer-muted: #0c1324;
  --color-text-on-dark: #f4f7ff;
  --color-text-on-dark-muted: rgba(226, 232, 255, 0.82);
  --color-text-on-dark-subtle: rgba(148, 163, 184, 0.85);
  --color-border-footer: rgba(255, 255, 255, 0.08);
  --color-glow-footer: rgba(37, 99, 235, 0.35);
}
```

**Note:** ✅ CSS variables are now integrated with Tailwind config. Tailwind classes reference CSS variables as the source of truth, enabling future theming support.

**Dark Surface Tokens (2025-11-26):**
- `--color-surface-footer` / `--color-surface-footer-muted` — layered background tones for the global footer.
- `--color-text-on-dark*` — text hierarchy tuned for ≥4.5:1 contrast on dark surfaces.
- `--color-border-footer` — subtle dividers that remain visible on the new surface.
- `--color-glow-footer` — radial accent used for the soft gradient glow.

### Tailwind Configuration

The `apps/web/tailwind.config.ts` contains a comprehensive design system:

#### Colors
- **Primary:** `#2563eb` (Blue 600) with hover variant `#1d4ed8`
- **Text:** Primary (`#0a0a0a`), Secondary (`#525252`), Tertiary (`#a3a3a3`)
- **Background:** Primary (white), Secondary (`#fafafa`), Tertiary (`#f5f5f5`)
- **Footer surfaces:** Dark gradient tokens (`footer.surface`, `footer.surfaceMuted`, `footer.text.*`, `footer.border`, `footer.glow`) mapped from the new CSS variables for high-contrast footers.
- **Borders:** Light, Medium, Dark variants with opacity
- **Semantic:** Success, Error, Warning with light variants

#### Typography
- **Font Family:** Inter (Google Fonts) with system font fallbacks
- **Font Sizes:** xs (13px) through 4xl (48px) with calculated line heights
- **Line Heights:** Tight (1.2), Snug (1.4), Normal (1.5), Relaxed (1.6)

#### Spacing
- **Base Unit:** 4px grid system
- **Scale:** 1 (4px) through 24 (96px)
- Consistent spacing values throughout

#### Border Radius
- sm: 4px
- base: 8px (most common)
- md: 12px
- lg: 16px

#### Shadows
- xs, sm, md, lg variants with subtle opacity
- Consistent shadow patterns

#### Transitions
- Smooth timing function: `cubic-bezier(0.16, 1, 0.3, 1)`
- Fast: 150ms
- Base: 300ms
- Slow: 500ms

## Component Library

### Available Components

Located in `apps/web/components/ui/`:

1. **Button** (`Button.tsx`)
   - Variants: primary, secondary, outline, ghost, danger
   - Sizes: sm (40px), md (48px), lg (56px)
   - Features: loading state, icons, fullWidth
   - Well-documented with TypeScript types

2. **Spinner** (`Spinner.tsx`)
   - Sizes: xs (12px), sm (16px), md (24px), lg (32px)
   - Colors: primary, white, current
   - Accessible with ARIA labels

3. **PageBackground** (`PageBackground.tsx`)
   - Decorative background component
   - Gradient orbs and grid pattern
   - Used across multiple pages

4. **GradientText** (`GradientText.tsx`)
   - Gradient text for headings
   - Primary color gradient effect

5. **Input** (`Input.tsx`) ✅ NEW
   - Fixed height: `h-12` (48px)
   - Fixed border radius: `rounded-base` (8px)
   - Variants: default, error, success
   - Icon support (left and right)
   - Full accessibility support
   - Disabled state handling

6. **FormField** (`FormField.tsx`) ✅ NEW
   - Complete form field pattern
   - Label with required indicator
   - Input integration
   - Validation feedback with icons
   - Accessible error messages
   - Helper text support

7. **Header** (`Header.tsx`) ✅ NEW
   - Unified header component with 3 variants
   - Variants: `landing`, `seeker`, `provider`
   - Standardized styling (z-50, backdrop-blur, shadow)
   - Role-based navigation
   - Mobile menu support (landing variant)
   - User menu dropdown (seeker and provider variants)

8. **Footer** (`Footer.tsx`) ✅ NEW
   - Unified footer component with 2 variants (full, minimal)
   - Currently supports `full` variant
   - Responsive design (mobile-first)
   - Brand, product links, support links, and copyright
   - Accessible navigation with ARIA labels
   - Used on all pages except auth pages

### Component Usage

**Good Practices:**
- Button component is used consistently across all pages ✅
- Spinner is consistently used for loading states
- PageBackground provides visual consistency
- Input component available for use
- FormField component available for use

**Recent Improvements:**
- ✅ Deprecated button classes removed (Phase 1 Complete)
- ✅ All pages now use Button component consistently
- ✅ Header component unified across all pages (Phase 2 Complete)
- ✅ Footer component added to all applicable pages (Phase 2 Complete)

## Design Patterns

### Card/Container Patterns

- **baseCardClass:** `bg-bg-primary border border-border-light rounded-base shadow-sm`
- Used consistently across request forms and dashboard
- Defined in `apps/web/app/requests/new/constants.ts`

### Form Input Patterns

**Standardization Complete:** ✅
- ✅ All inputs now use `h-12` (48px) - standardized
- ✅ All inputs now use `rounded-base` (8px) - standardized
- ✅ Validation logic extracted to shared utilities (`lib/validation.ts`)
- ✅ Input component created with consistent styling
- ✅ FormField component created for complete form field pattern

**Common Patterns:**
- Validation feedback with icons (CheckCircle, AlertCircle)
- Real-time validation on input change
- Touch-friendly input sizes (48px meets accessibility standards)
- Shared validation utilities used across all auth pages

### Header/Navigation Patterns

**Standardization Complete:** ✅
- ✅ Unified Header component created with 3 variants (`landing`, `seeker`, `provider`)
- ✅ All pages now use unified Header component
- ✅ Consistent styling (z-50, backdrop-blur-xl, shadow)
- ✅ Code duplication eliminated
- ✅ SeekerHeader and ProviderHeader are now wrappers for Header component

**Variants:**
- **Landing:** Public pages with navigation links, mobile menu, scroll effects
- **Seeker:** SEEKER users with latest request status, user menu
- **Provider:** PROVIDER users with marketplace links, user menu

### Footer Patterns

**Standardization Complete:** ✅
- ✅ Unified Footer component created with 2 variants (`full`, `minimal`)
- ✅ Currently supports `full` variant
- ✅ All applicable pages now use unified Footer component (14 pages)
- ✅ Consistent branding and navigation across all pages
- ✅ Responsive design with mobile-first approach
- ✅ Accessible navigation with ARIA labels
- ✅ **2025-11-26 Update:** Dark surface treatment aligns the footer with trust-first visual language while preserving existing information architecture.

**Dark Footer Acceptance Criteria (Tech Lead · 2025-11-26):**
- Maintain ≥4.5:1 contrast for navigation links and body copy, ≥3:1 contrast for iconography/badges.
- Focus rings must remain visible on dark backgrounds via `ring-offset-footer-surface`.
- Hover/focus interactions may only brighten text or underline; no color shifts that drop below contrast requirements.
- Gradient/glow layers are decorative only (no semantic information) and must keep text readable at all breakpoints.
- Both `full` and `minimal` variants inherit the same tokens to guarantee consistency across authenticated vs. marketing pages.

**Usage:**
- **Public Pages:** Landing, How It Works, Get Started
- **Authenticated Pages:** Dashboard, Request Detail, New Request
- **Onboarding Pages:** All onboarding pages (account-type, seeker/welcome, provider/*)
- **Excluded:** Auth pages (login, register, etc.) - intentionally excluded

### Loading States

**Standardization Complete:** ✅
- ✅ Loading message constants created (`lib/loading-messages.ts`)
- ✅ 8 standardized loading messages available
- ✅ 100% coverage - All 11 pages with loading states now use constants
- ✅ Consistent loading text across similar actions

**Available Constants:**
- `LOADING_GENERIC` - "Loading..."
- `LOADING_SIGNING_IN` - "Signing in..."
- `LOADING_CREATING_ACCOUNT` - "Creating account..."
- `LOADING_SAVING` - "Saving..."
- `LOADING_SUBMITTING` - "Submitting..."
- `LOADING_PROCESSING` - "Processing..."
- `LOADING_RESETTING_PASSWORD` - "Resetting password..."
- `LOADING_SENDING_EMAIL` - "Sending email..."

**Pages Using Loading Constants (11):**
- Auth: login, register, register/simple
- Onboarding: account-type, provider/business, provider/services, provider/credentials
- Dashboard, requests/[id], requests/new, landing page

### Error States

**Standardization Complete:** ✅
- ✅ Error handling utilities created (`lib/error-handling.ts`)
- ✅ 8 error handling utility functions available
- ✅ 100% coverage - All 17 pages with error handling now use standardized utilities
- ✅ User-friendly error messages
- ✅ Consistent error detection (network, validation, auth, rate limit)

**Available Functions:**
- `extractErrorMessage()` - Unified error message extraction
- `handleApiError()` - Structured error handling with context
- `getErrorDisplayMessage()` - User-friendly error messages
- `isNetworkError()` - Check for network errors
- `isValidationError()` - Check for validation errors
- `isAuthError()` - Check for authentication errors
- `isRateLimitError()` - Check for rate limit errors
- `getRateLimitMessage()` - User-friendly rate limit messages

**Pages Using Error Handling Utilities (17):**
- **Auth (6):** login, register, register/simple, verify-email, reset-password, forgot-password
- **Onboarding (7):** account-type, seeker/welcome, provider/welcome, provider/business, provider/services, provider/credentials, provider/credentials/complete
- **Other (4):** dashboard, requests/[id], requests/new (context), landing page

### Success States

**Patterns:**
- Success messages with CheckCircle icon
- Green color (`text-success`)
- Used for validation feedback and form completion

## Spacing System Adherence

**Good:**
- Most pages follow 4px grid system
- Consistent use of spacing scale (4, 8, 12, 16, 24, 32px)

**Issues:**
- Some pages use arbitrary spacing values
- Gap values sometimes don't align with spacing scale

## Typography Consistency

**Good:**
- Inter font family used consistently
- Font size scale is followed
- Line heights are appropriate

**Issues:**
- Some pages use arbitrary font sizes
- Heading hierarchy not always consistent

## Color Usage

**Good:**
- Primary color used consistently for CTAs
- Semantic colors (success, error, warning) used appropriately
- Text color hierarchy is maintained

**Issues:**
- Some hardcoded colors instead of design tokens
- Color opacity values vary (e.g., `primary/5`, `primary/10`)

## Animation & Transitions

**Good:**
- Smooth timing function used consistently
- Transition durations are appropriate (150-300ms)
- Hover effects are consistent

**Issues:**
- Some pages have custom animations not using design tokens
- Animation timing varies slightly across pages

## Responsive Design

**Breakpoints:**
- Mobile-first approach
- Common breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Touch targets meet 44px minimum

**Issues:**
- Some pages have inconsistent responsive behavior
- Mobile menu implementations vary

## Accessibility

**Good Practices:**
- ARIA labels on icons
- Role attributes for alerts
- Semantic HTML
- Focus indicators

**Issues:**
- Some interactive elements missing ARIA labels
- Focus states not always visible
- Keyboard navigation not tested on all pages

## Gaps & Improvements Needed

### Missing Components
1. ✅ **Input Component** - COMPLETE (Phase 1)
2. ✅ **Form Field Component** - COMPLETE (Phase 1)
3. **Card Component** - Cards use class strings, should be a component
4. **Modal/Dialog Component** - Not found in codebase
5. **Toast/Notification Component** - Not found in codebase
6. **Select/Dropdown Component** - Custom implementation exists but not in component library

### Design Token Gaps
1. CSS variables are minimal - should expand or remove if not used
2. Some colors hardcoded instead of using tokens
3. Spacing values sometimes arbitrary

### Pattern Standardization Needed
1. ✅ Form validation patterns extracted to shared utilities - COMPLETE (Phase 1)
2. ✅ Header implementations unified - COMPLETE (Phase 2)
3. ✅ Error/success message patterns componentized (via FormField) - COMPLETE (Phase 1)
4. ✅ Loading state patterns standardized - COMPLETE (Phase 2)
5. ✅ Error handling patterns standardized - COMPLETE (Phase 2)
6. ✅ Footer component created and added to all pages - COMPLETE (Phase 2)

## Recommendations

### High Priority
1. ✅ Create Input component with consistent styling - COMPLETE (Phase 1)
2. ✅ Create FormField component (label + input + validation) - COMPLETE (Phase 1)
3. ✅ Standardize header implementation - COMPLETE (Phase 2)
4. ✅ Extract form validation to shared utilities - COMPLETE (Phase 1)
5. ✅ Remove deprecated button classes - COMPLETE (Phase 1)

### Medium Priority
1. ✅ Expand CSS variables or remove if not used - COMPLETE (Phase 2)
2. Create Card component (Phase 3)
3. ✅ Standardize loading state patterns - COMPLETE (Phase 2, 100% coverage)
4. Create Modal/Dialog component (Phase 3)
5. ✅ Standardize error handling patterns - COMPLETE (Phase 2, 100% coverage)
6. ✅ Create Footer component - COMPLETE (Phase 2)
5. Improve responsive design consistency

### Low Priority
1. Create Toast/Notification component
2. Standardize animation patterns
3. Improve color token usage
4. Document component usage patterns

## Next Steps

1. ✅ Component library expanded (Input, FormField) - COMPLETE
2. ✅ Shared form validation utilities created - COMPLETE
3. Standardize header component (Phase 2)
4. Update pages to use new Input/FormField components (optional, gradual migration)
5. ✅ Deprecated patterns removed - COMPLETE

## Phase 1 & 2 Completion Summary

**Date:** 2025-01-22  
**Status:** ✅ Phase 1 & 2 Complete

### Phase 1 (Critical & High Priority)
All critical and high priority items from the audit findings resolution plan have been completed:
- Deprecated button classes removed
- Input heights standardized (h-12)
- Border radius standardized (rounded-base)
- Validation utilities created and integrated
- Input and FormField components created

### Phase 2 (Medium Priority)
All medium priority items from the audit findings resolution plan have been completed with 100% coverage:
- ✅ Header implementation unified (Header component with 3 variants, all pages)
- ✅ Footer component created and added to all applicable pages (14 pages)
- ✅ Loading states standardized (11 pages, 100% coverage, 8 constants)
- ✅ Error handling standardized (17 pages, 100% coverage, 8 utility functions)
- ✅ CSS variable usage improved (Tailwind config uses CSS variables as source of truth)

See completion reports for details:
- `docs/design/AUDIT_FINDINGS_RESOLUTION_PHASE1_COMPLETE.md`
- `docs/design/AUDIT_FINDINGS_RESOLUTION_PHASE2_COMPLETE.md`

