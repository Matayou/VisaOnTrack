# Provider Dashboard - Standardized Design System

**Date:** 2025-01-11  
**Purpose:** Standardized CSS variables and design tokens for all provider dashboard pages  
**Status:** 📋 Reference Document

---

## Standardized CSS Variables

```css
:root {
  /* Typography Scale */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.8125rem;      /* 13px */
  --font-size-sm: 0.875rem;       /* 14px */
  --font-size-base: 0.9375rem;    /* 15px */
  --font-size-md: 1rem;           /* 16px */
  --font-size-lg: 1.125rem;      /* 18px */
  --font-size-xl: 1.25rem;       /* 20px */
  --font-size-2xl: 1.5rem;        /* 24px */
  --font-size-3xl: 2rem;         /* 32px */
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.2;       /* Headings */
  --line-height-normal: 1.5;       /* UI elements */
  --line-height-relaxed: 1.6;     /* Body copy */
  
  /* Letter Spacing */
  --tracking-tight: -0.02em;       /* Large headings */
  --tracking-normal: -0.01em;      /* Medium headings */
  
  /* Colors - Primary */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-light: #dbeafe;
  
  /* Colors - Status */
  --color-success: #16a34a;
  --color-success-light: #dcfce7;
  --color-error: #dc2626;
  --color-error-light: #fee2e2;
  --color-warning: #eab308;
  --color-warning-light: #fef9c3;
  
  /* Colors - Text (No Pure Black) */
  --color-text-primary: #1a1a1a;      /* Softer contrast */
  --color-text-secondary: #525252;
  --color-text-tertiary: #a3a3a3;
  
  /* Colors - Background */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #fafafa;
  --color-bg-tertiary: #f5f5f5;
  
  /* Colors - Borders */
  --color-border-light: rgba(0, 0, 0, 0.06);
  --color-border-medium: rgba(0, 0, 0, 0.08);
  --color-border-dark: rgba(0, 0, 0, 0.12);
  
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
  
  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-base: 0.5rem;  /* 8px */
  --radius-md: 0.75rem;   /* 12px */
  
  /* Shadows (Subtle) */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  
  /* Transitions (Custom Easing) */
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-base: 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## Standardized Component Styles

### Body
```css
body {
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  -webkit-font-smoothing: antialiased;
  line-height: var(--line-height-relaxed);  /* 1.6 for body */
}
```

### Logo
```css
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-10);  /* 40px */
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.logo:hover {
  opacity: 0.8;
}
```

### Navigation Links
```css
.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  border-radius: var(--radius-base);
  transition: all var(--transition-fast);
  margin-bottom: var(--space-1);
  position: relative;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--color-primary);
  border-radius: 0 2px 2px 0;
}
```

### Page Title
```css
.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--color-text-primary);
}
```

### Card Title
```css
.card-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--color-text-primary);
  margin-bottom: var(--space-8);
}
```

### Cards
```css
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-8);  /* 32px - generous padding */
  margin-bottom: var(--space-6);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: border-color 200ms cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
```

### Buttons - Primary
```css
.btn-primary {
  height: 2.75rem;  /* 44px - touch friendly */
  padding: 0 var(--space-6);  /* 24px horizontal */
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.01em;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary:active {
  transform: scale(0.98) translateY(0);
}
```

### Buttons - Secondary
```css
.btn-secondary {
  height: 2.75rem;  /* 44px - consistent height */
  padding: 0 var(--space-5);  /* 20px horizontal */
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.01em;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
  transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-secondary:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-medium);
}

.btn-secondary:active {
  transform: scale(0.98) translateY(0);
}
```

### Form Inputs
```css
.form-input,
.form-select {
  width: 100%;
  height: 3rem;  /* 48px - touch friendly */
  padding: 0 var(--space-4);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-base);
  transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  border-width: 2px;
}
```

---

## Key Design Principles

1. **No Pure Black**: Use `#1a1a1a` instead of `#0a0a0a`
2. **Generous Padding**: Cards use `var(--space-8)` (32px) not `var(--space-6)` (24px)
3. **Touch-Friendly**: Buttons and inputs are 44-48px height
4. **Consistent Typography**: Letter-spacing -0.02em on headings, -0.01em on buttons
5. **Purposeful Animations**: Custom easing `cubic-bezier(0.16, 1, 0.3, 1)`
6. **Active States**: Scale to 0.98 for tactile feedback
7. **Line Height**: 1.6 for body, 1.2 for headings
8. **Logo Margin**: `var(--space-10)` (40px) for breathing room

