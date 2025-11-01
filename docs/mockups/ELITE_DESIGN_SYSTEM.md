# VisaOnTrack Elite Design System

**Inspiration:** Stripe Atlas, Linear, Gusto, Modern Treasury  
**Philosophy:** Trust-first, precision-crafted, purposeful design  
**Target:** Match quality of $1B+ companies

---

## Design Tokens (CSS Custom Properties)

```css
:root {
  /* Typography Scale */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.8125rem;    /* 13px - small labels, captions */
  --font-size-sm: 0.875rem;      /* 14px - body small, secondary text */
  --font-size-base: 0.9375rem;   /* 15px - primary body text */
  --font-size-md: 1rem;          /* 16px - larger body, small headings */
  --font-size-lg: 1.125rem;      /* 18px - subheadings */
  --font-size-xl: 1.25rem;       /* 20px - section headings */
  --font-size-2xl: 1.5rem;       /* 24px - page headings */
  --font-size-3xl: 2rem;         /* 32px - hero text */
  --font-size-4xl: 3rem;         /* 48px - landing page hero */
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.2;      /* Large headings */
  --line-height-snug: 1.4;       /* Subheadings */
  --line-height-normal: 1.5;     /* UI elements */
  --line-height-relaxed: 1.6;    /* Body copy */
  
  /* Letter Spacing */
  --tracking-tight: -0.02em;     /* Large headings */
  --tracking-normal: -0.01em;    /* Medium headings */
  --tracking-wide: 0;            /* Body text */
  
  /* Colors - Semantic */
  --color-primary: #2563eb;      /* Blue 600 - Trust, reliability */
  --color-primary-hover: #1d4ed8;
  --color-primary-light: #dbeafe;
  
  --color-text-primary: #0a0a0a;   /* Almost black */
  --color-text-secondary: #525252; /* Gray 600 */
  --color-text-tertiary: #a3a3a3;  /* Gray 400 */
  
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #fafafa;
  --color-bg-tertiary: #f5f5f5;
  
  --color-border-light: rgba(0, 0, 0, 0.06);
  --color-border-medium: rgba(0, 0, 0, 0.12);
  --color-border-dark: rgba(0, 0, 0, 0.20);
  
  --color-success: #16a34a;      /* Green 600 */
  --color-success-light: #dcfce7;
  --color-error: #dc2626;        /* Red 600 */
  --color-error-light: #fee2e2;
  --color-warning: #eab308;      /* Yellow 500 */
  --color-warning-light: #fef9c3;
  
  /* Spacing Scale (4px base) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px - badges, small elements */
  --radius-base: 0.5rem;  /* 8px - buttons, inputs */
  --radius-md: 0.75rem;   /* 12px - cards */
  --radius-lg: 1rem;      /* 16px - modals */
  
  /* Shadows (Subtle) */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  
  /* Animation */
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-base: 300ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 500ms cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Layout */
  --content-max-width: 80rem;    /* 1280px */
  --content-narrow: 42rem;        /* 672px - for readability */
  --content-form: 28rem;          /* 448px - for forms */
}
```

---

## Component Specifications

### Buttons

```html
<!-- Primary Button -->
<button class="btn-primary">
  Continue
</button>

<style>
.btn-primary {
  height: 2.75rem;              /* 44px - touch friendly */
  padding: 0 var(--space-6);    /* 24px horizontal */
  font-size: var(--font-size-base);  /* 15px */
  font-weight: var(--font-weight-medium);  /* 500 */
  letter-spacing: var(--tracking-normal);
  border-radius: var(--radius-base);
  background: linear-gradient(180deg, 
    var(--color-primary) 0%, 
    var(--color-primary-hover) 100%);
  color: white;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
```

### Input Fields

```html
<div class="input-group">
  <label for="email" class="input-label">Email address</label>
  <div class="input-wrapper">
    <input 
      type="email" 
      id="email"
      class="input-field"
      placeholder="you@company.com"
    />
  </div>
  <span class="input-hint">We'll never share your email</span>
</div>

<style>
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);  /* 8px */
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  letter-spacing: var(--tracking-normal);
}

.input-field {
  height: 2.75rem;  /* 44px */
  padding: 0 var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-base);
  transition: all var(--transition-fast);
}

.input-field:hover {
  border-color: var(--color-border-medium);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}
</style>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Account Settings</h3>
    <p class="card-description">Manage your account preferences</p>
  </div>
  <div class="card-content">
    <!-- Content here -->
  </div>
</div>

<style>
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.card-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.card-content {
  padding: var(--space-6);
}
</style>
```

---

## Layout Patterns

### Page Container
```css
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
}
```

### Section Spacing
```css
.section {
  padding: var(--space-24) 0;  /* 96px vertical */
}

.section + .section {
  border-top: 1px solid var(--color-border-light);
}
```

---

## Micro-interactions

### Hover Lift
```css
.interactive-card {
  transition: transform var(--transition-base), 
              box-shadow var(--transition-base);
}

.interactive-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Button Press
```css
.btn:active {
  transform: scale(0.98);
}
```

### Input Focus
```css
.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  transition: box-shadow var(--transition-fast);
}
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## Accessibility Requirements

1. **Color Contrast:** Minimum WCAG AA (4.5:1 for normal text)
2. **Focus States:** Visible on ALL interactive elements
3. **Touch Targets:** Minimum 44x44px
4. **Keyboard Navigation:** Tab order follows visual order
5. **ARIA Labels:** For all icon-only buttons
6. **Error Messages:** Associated with inputs via aria-describedby

---

## Quality Checklist

Before considering a page "done", verify:

- [ ] Typography uses design tokens (no arbitrary sizes)
- [ ] Spacing follows 4px grid
- [ ] All interactive elements have hover states
- [ ] Focus states are visible and consistent
- [ ] Colors are semantic, not decorative
- [ ] Animations have purpose
- [ ] Forms have proper validation states
- [ ] Mobile responsive (tested at 320px, 768px, 1280px)
- [ ] Passes accessibility audit (Lighthouse)
- [ ] Compared side-by-side with Stripe/Linear for quality

---

**This is the foundation. Every page must be built on this system.**

