# Tailwind Quick Reference – VisaOnTrack Design System

**Platform:** Next.js + Tailwind CSS v3
**Last Updated:** 2025-11-30

---

## Component Heights (WCAG 2.1 AA Compliant)

```
┌─────────────────────────────────────┐
│  Button (sm)  - h-10 (40px)   ⚠️    │  Use sparingly
├─────────────────────────────────────┤
│  Button (md)  - h-12 (48px)   ✅    │  DEFAULT - Recommended
├─────────────────────────────────────┤
│  Button (lg)  - h-14 (56px)   ✅    │  Large touch targets
├─────────────────────────────────────┤
│  Input        - h-12 (48px)   ✅    │  STANDARD
├─────────────────────────────────────┤
│  Select       - h-12 (48px)   ✅    │  STANDARD
├─────────────────────────────────────┤
│  Textarea     - min-h-24 (96px) ✅  │  Minimum
└─────────────────────────────────────┘
```

**Rule:** Always use `h-12` for form inputs and default buttons.

---

## Border Radius Standards

```css
/* Design System Tokens */
rounded-xs    2px     // Checkboxes only
rounded-sm    4px     // Rare - small decorative elements
rounded-base  8px     ✅ PRIMARY - Inputs, Cards, Containers
rounded-md    12px    // Rare - special cards
rounded-lg    16px    ✅ SECONDARY - Buttons, Modals, Message bubbles
rounded-xl    20px    // Decorative icons, auth card icons
rounded-2xl   24px    // Auth page cards (.ios-card)
rounded-full  9999px  // Avatars, pills, icon buttons
```

**When to use what:**

| Element | Radius | Example |
|---------|--------|---------|
| Input / FormField | `rounded-base` | `<Input className="rounded-base" />` |
| Button | `rounded-lg` | Built into Button component |
| Card | `rounded-base` | Built into Card component |
| Modal | `rounded-lg` | Built into Modal component |
| Message Bubble | `rounded-lg` | Chat interfaces |
| Avatar | `rounded-full` | User profile images |
| Icon Container | `rounded-xl` | Decorative backgrounds |

---

## Color Palette (CSS Variables)

### Text Colors
```tsx
text-text-primary    #0a0a0a (near black)    // Body text, headings
text-text-secondary  #525252 (medium gray)   // Supporting text
text-text-tertiary   #a3a3a3 (light gray)    // Placeholders, disabled
```

### Background Colors
```tsx
bg-bg-primary        #ffffff (white)         // Main surfaces
bg-bg-secondary      #fafafa (off-white)     // Secondary surfaces
bg-bg-tertiary       #f5f5f5 (light gray)    // Disabled backgrounds
```

### Border Colors
```tsx
border-border-light  rgba(0,0,0,0.06)        // Default borders
border-border-medium rgba(0,0,0,0.12)        // Hover state
border-border-dark   rgba(0,0,0,0.20)        // Active/pressed
```

### Brand & Semantic Colors
```tsx
// Primary (Blue)
bg-primary           #2563eb                 // Brand blue
bg-primary-hover     #1d4ed8                 // Darker blue
text-primary         #2563eb                 // Blue text

// Success (Green)
bg-success           #16a34a                 // Success green
bg-success-light     #dcfce7                 // Light green background
text-success         #16a34a                 // Success text

// Error (Red)
bg-error             #dc2626                 // Error red
bg-error-light       #fee2e2                 // Light red background
text-error           #dc2626                 // Error text

// Warning (Orange)
bg-warning           #f59e0b                 // Warning orange
bg-warning-light     #fef3c7                 // Light orange background
text-warning         #f59e0b                 // Warning text
```

### Footer Colors (Dark Theme)
```tsx
bg-footer-surface          #05070f           // Dark navy
bg-footer-surfaceMuted     #0c1324           // Slightly lighter navy
text-footer-text-primary   #f4f7ff           // Near white
text-footer-text-secondary rgba(226,232,255,0.82)  // Muted white
border-footer-border       rgba(255,255,255,0.08)  // Subtle white border
```

---

## Shadows

```tsx
// Card Shadows
shadow-xs   // Subtle - Default cards
shadow-sm   // Light elevation
shadow-md   // Medium elevation - Elevated cards
shadow-lg   // Heavy elevation - Modals

// Focus Rings (Form Inputs)
focus:shadow-focus-primary   // Blue glow (primary focus)
focus:shadow-focus-success   // Green glow (success state)
focus:shadow-focus-error     // Red glow (error state)

// Accent Shadows (Buttons, Cards)
shadow-primary-sm   // Small blue glow
shadow-primary-md   // Medium blue glow
shadow-success-sm   // Small green glow
shadow-success-md   // Medium green glow
```

**Visual Example:**
```
┌─────────────────────────┐
│  shadow-xs (default)    │  Barely visible, subtle depth
├─────────────────────────┤
│  shadow-md (elevated)   │  Clear floating effect
├─────────────────────────┤
│  shadow-lg (modal)      │  Strong depth, attention-grabbing
└─────────────────────────┘
```

---

## Spacing Scale (4px Grid)

```css
/* Base Unit: 4px */
gap-1     4px      // Tight spacing
gap-2     8px      ✅ COMMON - Icon + text
gap-3     12px     ✅ COMMON - Form fields
gap-4     16px     ✅ COMMON - Card content
gap-6     24px     ✅ COMMON - Sections
gap-8     32px     // Large sections
gap-12    48px     // Page sections
gap-16    64px     // Hero sections

/* Padding Standards */
p-4       16px     // Tight padding
p-6       24px     ✅ DEFAULT - Card padding
p-8       32px     // Spacious padding
p-12      48px     // Very spacious

/* Margins */
mb-2      8px      // Label to input
mb-4      16px     // Between form groups
mb-6      24px     // Section headings
```

**Form Spacing Pattern:**
```tsx
<div className="flex flex-col gap-6">  {/* 24px between fields */}
  <FormField ... />
  <FormField ... />
  <FormField ... />
</div>
```

---

## Typography Scale

```tsx
// Font Sizes (with line heights)
text-xs     13px / 1.5    // Small labels, metadata
text-sm     14px / 1.5    ✅ Labels, helper text
text-base   15px / 1.6    ✅ DEFAULT - Body text, inputs
text-md     16px / 1.5    // Emphasized body
text-lg     18px / 1.4    // Subheadings
text-xl     20px / 1.4    // Card titles
text-2xl    24px / 1.2    // Section headings
text-3xl    32px / 1.2    // Page headings
text-4xl    48px / 1.1    // Hero text

// Font Weights
font-normal    400    // Body text
font-medium    500    ✅ Labels, buttons
font-semibold  600    ✅ Headings, emphasis
font-bold      700    // Hero text, strong emphasis

// Font Family
font-sans      Inter (from CSS variable)
```

**Text Hierarchy:**
```tsx
<h1 className="text-3xl font-bold text-text-primary">
  Page Title
</h1>
<h2 className="text-xl font-semibold text-text-primary">
  Section Title
</h2>
<p className="text-base text-text-secondary">
  Body paragraph with supporting information.
</p>
<span className="text-sm text-text-tertiary">
  Helper text or metadata
</span>
```

---

## Component Patterns

### FormField (Complete Field)
```tsx
<FormField
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  error="Email is required"
  required
/>
```
**Use when:** You need label + input + validation together (95% of cases)

---

### Input (Standalone)
```tsx
<Input
  type="text"
  placeholder="Search..."
  icon={<Search className="h-4 w-4" />}
/>
```
**Use when:** You need just the input without label (search bars, inline editing)

---

### Button
```tsx
// Primary (default)
<Button>Click me</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// With icon
<Button icon={<Plus />} iconPosition="left">
  Add Item
</Button>

// Loading state
<Button loading>Submitting...</Button>

// Full width
<Button fullWidth>Submit</Button>
```

---

### Card
```tsx
// Default card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Variants
<Card variant="default" />   // White with border
<Card variant="muted" />     // Light gray with border
<Card variant="outline" />   // Transparent with border

// Padding
<Card padding="sm" />  // 16px
<Card padding="md" />  // 24px (default)
<Card padding="lg" />  // 32px
<Card padding="none" /> // 0px (for custom layouts)

// Elevation
<Card elevated />  // Adds shadow-md
```

---

### Modal
```tsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  size="md"
  footer={
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  }
>
  <p>Modal content goes here</p>
</Modal>
```

---

## Responsive Breakpoints

```tsx
// Tailwind Default Breakpoints
sm:   640px   // Mobile landscape
md:   768px   // Tablet
lg:   1024px  // Desktop
xl:   1280px  // Large desktop
2xl:  1536px  // Extra large

// Mobile-First Patterns
<div className="p-4 sm:p-6 md:p-8">           // Responsive padding
<h1 className="text-2xl md:text-3xl lg:text-4xl">  // Responsive text
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">  // Responsive grid

// Hide/Show by Breakpoint
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

---

## Common Layout Patterns

### Flex Container (Horizontal)
```tsx
<div className="flex items-center gap-3">
  <Icon />
  <span>Text</span>
</div>
```

### Flex Container (Vertical)
```tsx
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Grid (Responsive)
```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

### Centered Container
```tsx
<div className="mx-auto max-w-4xl px-4">
  <div>Centered content with max width</div>
</div>
```

### Full-Page Layout
```tsx
<div className="min-h-screen flex flex-col">
  <header className="border-b border-border-light">...</header>
  <main className="flex-1 container mx-auto py-8">...</main>
  <footer className="border-t border-border-light">...</footer>
</div>
```

---

## State Patterns

### Focus States (Interactive Elements)
```tsx
// Buttons
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2

// Inputs
focus:border-primary focus:shadow-focus-primary

// Links
focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
```

### Hover States
```tsx
// Buttons
hover:bg-primary-hover

// Cards
hover:shadow-md

// Text links
hover:text-primary hover:underline
```

### Disabled States
```tsx
disabled:cursor-not-allowed disabled:opacity-60
```

### Loading States
```tsx
<Button loading>
  {/* Button shows spinner automatically */}
</Button>

// Or custom spinner
<Spinner size="sm" color="primary" />
```

---

## Validation States

### Input States
```tsx
// Error
<Input error />
className="border-error bg-error-light/5 focus:shadow-focus-error"

// Success
<Input success />
className="border-success bg-success-light/5 focus:shadow-focus-success"

// Default
className="border-border-light hover:border-border-medium focus:border-primary"
```

### Error Message
```tsx
<span className="text-xs text-error">
  This field is required
</span>
```

### Success Message
```tsx
<span className="text-xs text-success">
  Looks good!
</span>
```

---

## Animation Classes

```tsx
// Fade in from bottom
className="animate-fade-in-up"

// Slide up
className="animate-slide-up"

// Scale in
className="animate-scale-in"

// Custom transition
className="transition-all duration-200"
className="transition-colors duration-150"
```

---

## Accessibility Patterns

### Focus Visible (Keyboard Navigation)
```tsx
className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
```

### Screen Reader Only
```tsx
<span className="sr-only">Accessible label</span>
```

### ARIA Labels
```tsx
<button aria-label="Close modal">
  <X className="h-4 w-4" />
</button>
```

### Skip to Content
```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white px-4 py-2"
>
  Skip to main content
</a>
```

---

## Common Mistakes to Avoid

### ❌ DON'T: Use h-11 for inputs
```tsx
<input className="h-11" />  // 44px - Below accessibility minimum
```

### ✅ DO: Use h-12 for inputs
```tsx
<Input />  // 48px - Meets WCAG 2.1 AA
```

---

### ❌ DON'T: Mix border radius inconsistently
```tsx
<input className="rounded-lg" />
<Card className="rounded-base" />
<Button className="rounded-xl" />
```

### ✅ DO: Follow standards
```tsx
<Input className="rounded-base" />   // 8px - Inputs
<Card className="rounded-base" />    // 8px - Cards
<Button className="rounded-lg" />    // 16px - Buttons
```

---

### ❌ DON'T: Write inline form fields
```tsx
<div className="flex flex-col gap-2">
  <label>Email</label>
  <input className="h-12 w-full rounded-base border..." />
  {error && <span className="text-error text-xs">{error}</span>}
</div>
```

### ✅ DO: Use FormField component
```tsx
<FormField
  label="Email"
  name="email"
  error={error}
/>
```

---

### ❌ DON'T: Hardcode colors
```tsx
<div className="bg-[#2563eb]">  // Hardcoded hex
```

### ✅ DO: Use design tokens
```tsx
<div className="bg-primary">  // Design token
```

---

## Cheat Sheet Summary

```
┌──────────────────────────────────────────────────┐
│  HEIGHTS                                         │
├──────────────────────────────────────────────────┤
│  Input/Button:  h-12 (48px)       ✅ STANDARD   │
│  Textarea:      min-h-24 (96px)   ✅ STANDARD   │
├──────────────────────────────────────────────────┤
│  RADIUS                                          │
├──────────────────────────────────────────────────┤
│  Inputs/Cards:  rounded-base (8px)  ✅ PRIMARY  │
│  Buttons/Modals: rounded-lg (16px)  ✅ SECONDARY│
├──────────────────────────────────────────────────┤
│  SPACING                                         │
├──────────────────────────────────────────────────┤
│  Form fields:   gap-6 (24px)      ✅ STANDARD   │
│  Card padding:  p-6 (24px)        ✅ STANDARD   │
│  Icon + text:   gap-2 (8px)       ✅ STANDARD   │
├──────────────────────────────────────────────────┤
│  TEXT                                            │
├──────────────────────────────────────────────────┤
│  Body:          text-base (15px)  ✅ DEFAULT    │
│  Labels:        text-sm (14px)    ✅ STANDARD   │
│  Headings:      text-xl to 3xl    ✅ SCALE      │
└──────────────────────────────────────────────────┘
```

---

## Quick Component Reference

| Need | Use This | Import |
|------|----------|--------|
| Form field with label | `<FormField />` | `@/components/ui` |
| Standalone input | `<Input />` | `@/components/ui` |
| Dropdown | `<Select />` | `@/components/ui` |
| Button | `<Button />` | `@/components/ui` |
| Container | `<Card />` | `@/components/ui` |
| Dialog | `<Modal />` | `@/components/ui` |
| Loading | `<Spinner />` | `@/components/ui` |

---

**End of Quick Reference**

For detailed implementation guides, see:
- `TAILWIND_DESIGN_SYSTEM_AUDIT.md` - Full audit and standards
- `COMPONENT_IMPLEMENTATION_GUIDE.md` - New component patterns
- `FORM_MIGRATION_CHECKLIST.md` - Migration instructions
