# Design System Current State

**Date:** 2025-01-22  
**Status:** Active Design System Audit

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
}
```

**Note:** CSS variables are defined but not extensively used. The codebase primarily uses Tailwind classes.

### Tailwind Configuration

The `apps/web/tailwind.config.ts` contains a comprehensive design system:

#### Colors
- **Primary:** `#2563eb` (Blue 600) with hover variant `#1d4ed8`
- **Text:** Primary (`#0a0a0a`), Secondary (`#525252`), Tertiary (`#a3a3a3`)
- **Background:** Primary (white), Secondary (`#fafafa`), Tertiary (`#f5f5f5`)
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

### Component Usage

**Good Practices:**
- Button component is used in most pages
- Spinner is consistently used for loading states
- PageBackground provides visual consistency

**Issues:**
- Some pages still use deprecated button classes (`primaryButtonClass`, `outlineButtonClass`)
- Not all pages use the Button component consistently

## Design Patterns

### Card/Container Patterns

- **baseCardClass:** `bg-bg-primary border border-border-light rounded-base shadow-sm`
- Used consistently across request forms and dashboard
- Defined in `apps/web/app/requests/new/constants.ts`

### Form Input Patterns

**Inconsistencies Found:**
- Input heights vary: `h-11` (44px) vs `h-12` (48px)
- Border radius varies: `rounded-base` vs `rounded-lg`
- Validation feedback patterns are duplicated across pages
- Some pages have inline validation, others use context

**Common Patterns:**
- Validation feedback with icons (CheckCircle, AlertCircle)
- Real-time validation on input change
- Touch-friendly input sizes (44px+)

### Header/Navigation Patterns

**Three Different Implementations:**

1. **Landing/Get-Started Pages:** Inline header implementation
   - Sticky header with scroll effects
   - Mobile menu with state management
   - Navigation links

2. **SeekerHeader Component:** (`components/SeekerHeader.tsx`)
   - Role-based header for SEEKER users
   - Shows latest request status
   - User menu dropdown

3. **ProviderHeader Component:** (`components/ProviderHeader.tsx`)
   - Role-based header for PROVIDER users
   - Navigation links (Marketplace, My Offers, Orders)
   - User menu dropdown

**Issues:**
- Header implementations are not consistent
- Landing page header is duplicated in get-started page
- Different styling approaches (z-index, backdrop-blur values)

### Loading States

**Patterns:**
- Spinner component used consistently
- Loading text varies: "Loading...", "Signing in...", "Creating account..."
- Some pages show full-screen loading, others show inline

### Error States

**Patterns:**
- Error messages with AlertCircle icon
- Role="alert" for accessibility
- Error styling: `text-error` with icon
- Some pages show errors inline, others at form level

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
1. **Input Component** - Form inputs are implemented inline, should be componentized
2. **Card Component** - Cards use class strings, should be a component
3. **Form Field Component** - Label + Input + Validation feedback pattern should be componentized
4. **Modal/Dialog Component** - Not found in codebase
5. **Toast/Notification Component** - Not found in codebase
6. **Select/Dropdown Component** - Custom implementation exists but not in component library

### Design Token Gaps
1. CSS variables are minimal - should expand or remove if not used
2. Some colors hardcoded instead of using tokens
3. Spacing values sometimes arbitrary

### Pattern Standardization Needed
1. Form validation patterns should be extracted to shared utilities
2. Header implementations should be unified
3. Error/success message patterns should be componentized
4. Loading state patterns should be standardized

## Recommendations

### High Priority
1. Create Input component with consistent styling
2. Create FormField component (label + input + validation)
3. Standardize header implementation
4. Extract form validation to shared utilities
5. Remove deprecated button classes

### Medium Priority
1. Expand CSS variables or remove if not used
2. Create Card component
3. Standardize loading state patterns
4. Create Modal/Dialog component
5. Improve responsive design consistency

### Low Priority
1. Create Toast/Notification component
2. Standardize animation patterns
3. Improve color token usage
4. Document component usage patterns

## Next Steps

1. Review and prioritize component library expansion
2. Create shared form validation utilities
3. Standardize header component
4. Update pages to use new components
5. Remove deprecated patterns

