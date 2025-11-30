# Tailwind Design System Audit & Standardization Plan

**Date:** 2025-11-30
**Project:** VisaOnTrack (SawadeePass)
**Platform:** Next.js + Tailwind CSS v3
**Focus:** Component Library Standardization & Styling Consistency

---

## Executive Summary

The codebase has evolved with inconsistent component styling patterns. This audit identifies critical areas needing standardization to ensure maintainability, accessibility, and design consistency.

### Key Findings

- **Input Heights:** Mixed usage of `h-11` (44px) and `h-12` (48px)
- **Border Radius:** Inconsistent between `rounded-base` (8px), `rounded-lg` (16px), and `rounded-xl`
- **FormField Pattern:** Available but not enforced across 20+ forms
- **Component Library:** Strong foundation exists but needs enforcement
- **Tailwind Version:** v3 (not v4) - standard configuration with CSS variables

---

## Current Component Library Status

### ✅ Completed Components

| Component | Status | Standardized | Notes |
|-----------|--------|--------------|-------|
| **Button** | ✅ Complete | Yes | 5 variants, 3 sizes, h-12 default (48px) |
| **Input** | ✅ Complete | Yes | Fixed h-12, rounded-base, error/success states |
| **Select** | ✅ Complete | Yes | Matches Input styling |
| **FormField** | ✅ Complete | Partial | Exists but not used everywhere |
| **Card** | ✅ Complete | Yes | rounded-base, 3 variants, 4 padding sizes |
| **Modal** | ✅ Complete | Yes | rounded-lg, 3 sizes, accessible |
| **Spinner** | ✅ Complete | Yes | 4 sizes, 3 colors |
| **Toast** | ✅ Complete | Yes | - |

### ⚠️ Missing Components (Phase 4 Deliverables)

- MessageThread
- MessageComposer
- AttachmentUpload
- QuoteForm / ProposalForm
- ConsultationsList
- Mobile ActionSheet (partial implementation exists)

---

## Critical Inconsistencies

### 1. Input Height Variance

**Standard (Correct):** `h-12` (48px) - Meets WCAG 2.1 AA touch target minimum

**Found 20+ files** using inline inputs with mixed heights:

```tsx
// ❌ INCORRECT - h-11 (44px) - Below accessibility minimum
className="h-11 w-full rounded-base..."

// ✅ CORRECT - h-12 (48px) - Meets accessibility standard
className="h-12 w-full rounded-base..."
```

**Files needing fix:**
- `apps/web/app/auth/verify-email/page.tsx` (line 331)
- `apps/web/app/auth/register/simple/page.tsx` (line 168)
- Multiple auth pages with inline inputs instead of FormField

**Action:** Replace all inline inputs with `<Input />` or `<FormField />` components.

---

### 2. Border Radius Inconsistency

**Design System Standard:** `rounded-base` (8px) for inputs/buttons/cards

**Usage Analysis:**
- `rounded-base`: 313 occurrences ✅ **STANDARD**
- `rounded-lg`: 88 occurrences ⚠️ (16px - used for modals, some cards)
- `rounded-xl`: Mixed usage (auth page icons, decorative elements)

**Rules:**
```tsx
// ✅ CORRECT Usage
<Input className="rounded-base" />        // 8px - Forms
<Button className="rounded-lg" />         // 16px - Buttons (from Button component)
<Card className="rounded-base" />         // 8px - Cards
<Modal className="rounded-lg" />          // 16px - Modals
<div className="rounded-xl" />            // 20px+ - Decorative icons only
```

**Issue:** Some auth pages use `rounded-xl` for input containers inconsistently.

**Action:** Enforce radius standards in component documentation.

---

### 3. FormField Component Not Enforced

**Available Component:**
```tsx
<FormField
  label="Email"
  name="email"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
  required
/>
```

**Current Usage:**
- ✅ Used in: 2 files (request form context)
- ❌ NOT used in: 20+ forms across auth, onboarding, and settings pages

**Manual Input Pattern (Repeated 50+ times):**
```tsx
// ❌ Anti-pattern - Repeated across codebase
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-sm font-medium">Email</label>
  <input
    type="email"
    id="email"
    className="h-12 w-full rounded-base border..."
  />
  {error && <span className="text-error text-xs">{error}</span>}
</div>
```

**Files needing migration:**
- `apps/web/app/auth/login/page.tsx` (lines 118-194)
- `apps/web/app/auth/register/page.tsx` (multiple inputs)
- `apps/web/app/onboarding/provider/business/page.tsx` (8+ custom inputs)
- `apps/web/app/auth/forgot-password/page.tsx`
- `apps/web/app/auth/reset-password/page.tsx`

**Action:** Migrate all inline form fields to `<FormField />` component.

---

### 4. Validation Feedback Inconsistency

**Three Different Patterns Found:**

#### Pattern A: Using FormField (Correct)
```tsx
<FormField
  validationStatus="error"
  error="Email is required"
/>
```

#### Pattern B: Inline with icons (Login page)
```tsx
<input className={emailValidation.status === 'error' ? 'border-error' : ''} />
{emailValidation.status === 'error' && (
  <AlertCircle className="absolute right-4 top-1/2" />
)}
```

#### Pattern C: Manual error spans (Most common)
```tsx
<input className={errors.email ? 'border-error' : ''} />
{errors.email && <span className="text-error text-xs">{errors.email}</span>}
```

**Action:** Standardize on FormField component which handles all validation states consistently.

---

## Design Token Analysis

### Current Tailwind Configuration

**File:** `apps/web/tailwind.config.ts`

```typescript
borderRadius: {
  xs: '2px',      // Checkbox corners
  sm: '0.25rem',  // 4px
  base: '0.5rem', // 8px - PRIMARY STANDARD
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
}

spacing: {
  '10': '2.5rem', // 40px
  '11': '2.75rem', // 44px (NOT IN CONFIG - calculated by Tailwind)
  '12': '3rem',   // 48px - PRIMARY INPUT HEIGHT
}
```

**Colors (CSS Variables):**
```css
--color-primary: #2563eb
--color-primary-hover: #1d4ed8
--color-success: #16a34a
--color-text-primary: #0a0a0a
--color-text-secondary: #525252
--color-text-tertiary: #a3a3a3
--color-bg-primary: #ffffff
--color-bg-secondary: #fafafa
--color-border-light: rgba(0, 0, 0, 0.06)
```

**Shadows:**
```typescript
boxShadow: {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  'focus-primary': '0 0 0 3px rgba(37, 99, 235, 0.1)',
  'focus-success': '0 0 0 3px rgba(22, 163, 74, 0.1)',
  'focus-error': '0 0 0 3px rgba(220, 38, 38, 0.1)',
}
```

---

## Responsive Design Patterns

### Current Breakpoints (Tailwind Defaults)

```typescript
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

### Mobile-First Patterns Found

✅ **Good Examples:**
```tsx
// Responsive padding
<div className="p-6 sm:p-8" />

// Responsive text sizing
<h1 className="text-3xl sm:text-4xl" />

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
```

⚠️ **Needs Improvement:**
- MobileActionSheet component needs container query support
- Several forms not optimized for mobile (fixed widths)
- Missing responsive patterns for messaging/proposals UI

---

## Accessibility Audit

### Touch Target Compliance

**WCAG 2.1 AA Requirement:** 44×44px minimum

**Current State:**
- ✅ Button (md): 48px height ✅ COMPLIANT
- ✅ Button (sm): 40px height ⚠️ BELOW STANDARD (use sparingly)
- ✅ Input: 48px height ✅ COMPLIANT
- ❌ Inline inputs with h-11: 44px ⚠️ BORDERLINE (migrate to h-12)

### Focus States

**Standardized across all components:**
```tsx
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
// Or for inputs:
focus:border-primary focus:shadow-focus-primary
```

---

## Standardization Plan

### Phase 1: Component Migration (Days 1-2)

**Priority 1 - Auth Pages (High Traffic):**
1. ✅ Audit complete
2. Migrate to FormField:
   - `/app/auth/login/page.tsx`
   - `/app/auth/register/page.tsx`
   - `/app/auth/forgot-password/page.tsx`
   - `/app/auth/reset-password/page.tsx`
   - `/app/auth/verify-email/page.tsx`

**Priority 2 - Onboarding (User Journey Critical):**
1. `/app/onboarding/provider/business/page.tsx` (8 inputs)
2. `/app/onboarding/provider/credentials/page.tsx`
3. `/app/onboarding/provider/services/page.tsx`

**Priority 3 - Forms:**
1. Request edit form
2. Provider profile manage
3. Account settings (when implemented)

### Phase 2: Missing Components (Days 3-5)

Build the following components following established patterns:

**MessageThread.tsx**
```tsx
<Card padding="none">
  <div className="flex flex-col gap-4 p-4">
    {/* Messages with h-auto, rounded-lg bubbles */}
  </div>
</Card>
```

**MessageComposer.tsx**
```tsx
<form className="flex gap-2">
  <Input placeholder="Type a message..." className="flex-1" />
  <Button type="submit" icon={<Send />} />
</form>
```

**ProposalForm.tsx**
```tsx
<Card>
  <FormField label="Proposed Fee" name="fee" type="number" required />
  <FormField label="Timeline" name="timeline" type="text" required />
  <FormField label="Description" name="description" as="textarea" required />
</Card>
```

### Phase 3: Documentation (Day 6)

1. Update `apps/web/components/ui/README.md`
2. Create component usage examples
3. Document design tokens and when to use each
4. Add ESLint rules (optional) to enforce component usage

### Phase 4: Enforcement (Day 7)

1. Run codebase-wide search for anti-patterns
2. Create PR with all migrations
3. Add comments to enforce FormField usage
4. Update onboarding docs for new developers

---

## Design System Rules (Enforced)

### Input & Form Standards

| Element | Height | Border Radius | Pattern |
|---------|--------|---------------|---------|
| Text Input | `h-12` (48px) | `rounded-base` (8px) | Use `<Input />` or `<FormField />` |
| Select | `h-12` (48px) | `rounded-base` (8px) | Use `<Select />` |
| Textarea | `min-h-24` | `rounded-base` (8px) | Use `<Input as="textarea" />` |
| Button (md) | `h-12` (48px) | `rounded-lg` (16px) | Use `<Button />` |
| Button (sm) | `h-10` (40px) | `rounded-lg` (16px) | Use sparingly |

### Card & Container Standards

| Element | Border Radius | Shadow | Padding |
|---------|---------------|--------|---------|
| Card | `rounded-base` (8px) | `shadow-xs` or `shadow-md` | `p-6` (md) |
| Modal | `rounded-lg` (16px) | `shadow-lg` | `p-6` |
| Auth Card | `rounded-2xl` | Custom | `p-6 sm:p-8` |

### Color Usage

```tsx
// Text
text-text-primary     // Body text (#0a0a0a)
text-text-secondary   // Muted text (#525252)
text-text-tertiary    // Disabled/placeholder (#a3a3a3)

// Backgrounds
bg-bg-primary         // White (#ffffff)
bg-bg-secondary       // Light gray (#fafafa)
bg-bg-tertiary        // Disabled (#f5f5f5)

// Borders
border-border-light   // Default (rgba(0,0,0,0.06))
border-border-medium  // Hover (rgba(0,0,0,0.12))

// States
border-primary        // Focus
border-error          // Error (#dc2626)
border-success        // Success (#16a34a)
```

---

## Component Delivery Checklist

When building new components:

- [ ] Uses design tokens from `tailwind.config.ts`
- [ ] Follows height standards (h-12 for inputs, buttons)
- [ ] Uses correct border radius (rounded-base for inputs, rounded-lg for buttons)
- [ ] Implements error/success states consistently
- [ ] Includes focus states (focus:ring-2 focus:ring-primary)
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Responsive (mobile-first, sm/md/lg breakpoints)
- [ ] Documented with JSDoc and usage examples
- [ ] Exported from `components/ui/index.ts`
- [ ] Tested on mobile (touch targets 44×44px minimum)

---

## Migration Examples

### Before & After: Login Form

**❌ Before (Inline, Inconsistent):**
```tsx
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-sm font-medium">Email</label>
  <input
    type="email"
    id="email"
    className="h-12 w-full rounded-base border border-border-light..."
  />
  {emailValidation.status === 'error' && (
    <span className="text-error text-xs">{emailValidation.message}</span>
  )}
</div>
```

**✅ After (Using FormField):**
```tsx
<FormField
  label="Email"
  name="email"
  type="email"
  placeholder="you@example.com"
  validationStatus={emailValidation.status}
  error={emailValidation.message}
  required
/>
```

**Benefits:**
- 90% less code
- Consistent styling automatically
- Icons handled by component
- Accessible by default
- Easy to maintain

---

## Next Steps

1. **Review & Approve** this audit with team
2. **Create Tasks** for Phase 1 migrations
3. **Build Missing Components** (Phase 4 from RECOVERY_PLAN)
4. **Update Documentation** with final patterns
5. **Enforce Standards** via code review

---

## Files Reference

### Component Library
- `apps/web/components/ui/Button.tsx`
- `apps/web/components/ui/Input.tsx`
- `apps/web/components/ui/Select.tsx`
- `apps/web/components/ui/FormField.tsx`
- `apps/web/components/ui/Card.tsx`
- `apps/web/components/ui/Modal.tsx`
- `apps/web/components/ui/Spinner.tsx`

### Configuration
- `apps/web/tailwind.config.ts` (Design tokens)
- `apps/web/app/globals.css` (CSS variables)

### Documentation
- `apps/web/components/ui/README.md` (Component docs)
- `docs/analysis/RECOVERY_PLAN.md` (Project roadmap)

---

**End of Audit**
