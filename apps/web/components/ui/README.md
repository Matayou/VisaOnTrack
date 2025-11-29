# UI Component Library

This directory contains shared, reusable UI components with consistent styling and behavior.

## Components

### Spinner

A loading spinner component with configurable size and color.

**Usage:**

```tsx
import { Spinner } from '@/components/ui';

// Default spinner (medium, primary color)
<Spinner />

// Small white spinner (for dark backgrounds)
<Spinner size="sm" color="white" />

// Large spinner with custom class
<Spinner size="lg" className="mx-auto" />
```

**Props:**

- `size`: `'xs' | 'sm' | 'md' | 'lg'` (default: `'md'`)
  - xs: 12px
  - sm: 16px
  - md: 24px
  - lg: 32px
- `color`: `'primary' | 'white' | 'current'` (default: `'primary'`)
- `className`: Additional CSS classes
- `aria-label`: Accessibility label (default: "Loading")

---

### Button

A comprehensive button component with multiple variants, sizes, and states.

**Usage:**

```tsx
import { Button } from '@/components/ui';
import { ArrowRight, Trash } from 'lucide-react';

// Primary button (default)
<Button>Click me</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Outline button
<Button variant="outline">Learn more</Button>

// Ghost button
<Button variant="ghost">Skip</Button>

// Danger button
<Button variant="danger">Delete</Button>

// With icon
<Button icon={<ArrowRight />} iconPosition="right">
  Continue
</Button>

// Loading state
<Button loading>Submitting...</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

**Props:**

- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
  - sm: 40px height
  - md: 48px height (meets accessibility standards)
  - lg: 56px height
- `loading`: boolean - Shows spinner and disables button
- `icon`: React.ReactNode - Icon to display
- `iconPosition`: `'left' | 'right'` (default: `'left'`)
- `fullWidth`: boolean - Makes button full width
- All standard HTML button attributes (onClick, disabled, type, etc.)

---

## Design Consistency

All components follow the project's design system:

- **Colors**: Uses design tokens from Tailwind config
- **Spacing**: 8px base unit system
- **Typography**: Inter font family
- **Animations**: Smooth 200-300ms transitions
- **Accessibility**: WCAG 2.1 AA compliant

### Button Heights

All button sizes meet minimum touch target requirements:
- Small: 40px (10px padding)
- Medium: 48px (12px padding) ← **Recommended default**
- Large: 56px (14px padding)

### Color Variants

- **Primary**: Gradient blue (from-primary to-primary-hover)
- **Secondary**: Light background with border
- **Outline**: Transparent with border
- **Ghost**: Transparent, no border
- **Danger**: Red background for destructive actions

---

## Migration Guide

### From inline spinners

**Before:**
```tsx
<div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
```

**After:**
```tsx
<Spinner size="md" />
```

### From inline buttons

**Before:**
```tsx
<button className="px-6 py-3 bg-gradient-to-b from-primary to-primary-hover text-white rounded-lg">
  Submit
</button>
```

**After:**
```tsx
<Button>Submit</Button>
```

---

## Testing

Components are designed to work with:
- Keyboard navigation (Tab, Enter, Space)
- Screen readers (proper ARIA attributes)
- Touch devices (minimum 44x44px touch targets)
- Reduced motion preferences

---

## Maintenance

When adding new components to this library:

1. Follow existing patterns for props and types
2. Export from `index.ts`
3. Add JSDoc comments with usage examples
4. Ensure accessibility (ARIA, keyboard support)
5. Test on mobile and desktop
6. Update this README

---

## Files Migrated

The following pages have been migrated to use these shared components:

### Auth Pages
- ✅ `/app/auth/login/page.tsx`
- ✅ `/app/auth/register/page.tsx`
- ✅ `/app/auth/forgot-password/page.tsx`
- ✅ `/app/auth/reset-password/page.tsx`

### Landing & Marketing
- ✅ `/app/page.tsx` (landing page)
- ✅ `/app/get-started/page.tsx`

### Dashboard & User
- ✅ `/app/dashboard/page.tsx`
- ✅ `/components/SeekerHeader.tsx`

### Onboarding
- ✅ `/app/onboarding/account-type/page.tsx`
- ✅ `/app/onboarding/provider/welcome/page.tsx`

### Request Form
- ✅ `/app/requests/new/page.tsx`

---

## Related Files

- Design system: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Design system docs: `docs/design/DESIGN_SYSTEM_CURRENT_STATE.md`

