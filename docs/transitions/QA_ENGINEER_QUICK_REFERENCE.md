# QA Engineer Quick Reference

**For:** Successor QA Engineer  
**Purpose:** Daily reference guide for common tasks

---

## 🚀 Quick Start Checklist

When reviewing a new task:

1. [ ] Read task document (requirements, DoR/DoD)
2. [ ] Read implementation files
3. [ ] Test in browser (if frontend) using Browser MCP
4. [ ] Run accessibility checks (see below)
5. [ ] Run responsive design checks (see below)
6. [ ] Check TypeScript compilation
7. [ ] Create review document
8. [ ] Provide approval status

---

## ✅ Accessibility Quick Checks

### Command Line Checks
```bash
# Check for role="alert" on error messages
grep -r "role=\"alert\"" apps/web/app/

# Check for aria-live on dynamic content
grep -r "aria-live" apps/web/app/

# Check for aria-describedby on inputs
grep -r "aria-describedby" apps/web/app/

# Check touch targets (h-11 = 44px)
grep -r "h-11\|min-h.*44" apps/web/app/
```

### Browser MCP Checks
```javascript
// Navigate and snapshot
browser_navigate({url: "http://localhost:3000/path"})
browser_wait_for({time: 2})
browser_snapshot()

// Check role="alert"
browser_evaluate({
  function: `() => {
    const alerts = document.querySelectorAll('[role="alert"]');
    return { count: alerts.length, allValid: Array.from(alerts).every(el => el.getAttribute('role') === 'alert') };
  }`
})

// Check touch targets
browser_evaluate({
  function: `() => {
    const buttons = document.querySelectorAll('button, a');
    return Array.from(buttons).map(btn => {
      const rect = btn.getBoundingClientRect();
      return { text: btn.textContent.trim(), minSize: Math.min(rect.width, rect.height), meets44px: Math.min(rect.width, rect.height) >= 44 };
    });
  }`
})

// Test responsive design
browser_resize({width: 375, height: 667})  // Mobile
browser_resize({width: 768, height: 1024}) // Tablet
browser_resize({width: 1280, height: 720})  // Desktop
```

---

## 📋 Standard Review Template

```markdown
## QA Engineer Review: [APPROVED/REJECTED/APPROVED WITH CHANGES]

### ✅ Accessibility (A11y) Review
**Keyboard Navigation:**
- ✅ [Finding]
- ❌ [Issue]

**ARIA Labels & Attributes:**
- ✅ [Finding]
- ❌ [Issue]

**Semantic HTML:**
- ✅ [Finding]

**Screen Reader Support:**
- ✅ [Finding]
- ❌ [Issue]

### ✅ Responsive Design Review
**Touch Targets:**
- ✅ All buttons meet 44px minimum
- ❌ [Issue]

**Mobile/Tablet/Desktop:**
- ✅ [Finding]
- ❌ [Issue]

### ⚠️ Issues Found
1. **Issue Title**
   - Location: `file:line`
   - Fix: [specific fix]
   - Impact: [why it matters]

### Required Changes
1. [Specific fix with code example]

### Recommendations (Optional)
- [Optional improvements]

### Summary
**Status:** [APPROVED/REJECTED/APPROVED WITH CHANGES]
- [Overall assessment]
```

---

## 🔧 Common Fixes

### Fix 1: Missing `role="alert"` on Error Messages
```tsx
// ❌ BEFORE
{error && <div className="text-error...">{error}</div>}

// ✅ AFTER
{error && <div role="alert" className="text-error...">{error}</div>}
```

### Fix 2: Missing `aria-live` on Password Strength Meter
```tsx
// ❌ BEFORE
<div className="strength-meter...">

// ✅ AFTER
<div aria-live="polite" aria-atomic="true">
  <div className="strength-meter...">
```

### Fix 3: Missing `aria-describedby` on Form Inputs
```tsx
// ❌ BEFORE
<input id="email" />
<div>{validation.message}</div>

// ✅ AFTER
<input id="email" aria-describedby={validation.status !== 'empty' ? 'email-message' : undefined} />
<div id="email-message">{validation.message}</div>
```

### Fix 4: Touch Targets Below 44px
```tsx
// ❌ BEFORE
<button className="h-10 px-4...">  // 40px - too small

// ✅ AFTER
<button className="h-11 px-4...">  // 44px - correct
<button className="min-h-[44px] py-2...">  // Ensures 44px
```

---

## 🎯 Critical Patterns

### Error Messages
- Always use `role="alert"`
- Place near related input (visual)
- Link via `aria-describedby` (accessibility)

### Password Strength Meter
- Always use `aria-live="polite"` + `aria-atomic="true"`
- Wrap entire meter container
- Include strength message in container

### Form Validation
- Link messages via `aria-describedby`
- Set `aria-invalid` when error
- Provide clear, helpful messages

### Touch Targets
- Minimum 44px × 44px
- Use `h-11` for inputs/buttons (Tailwind)
- Use `min-h-[44px]` if padding might reduce size

---

## 🔍 Verification Commands

```bash
# TypeScript compilation
cd apps/web && pnpm typecheck

# Linter check
cd apps/web && pnpm lint

# Prisma validation
cd apps/api && npx prisma validate
```

---

## 📚 Key Files

- `QA_ENGINEER_TRANSITION.md` - Full transition document
- `AGENT_PROMPTS.md` - Role definition
- `PROJECT_STATUS.md` - Current project status
- `visaontrack-v2-spec.md` - Complete specification

---

**Quick Tip:** Keep this file open while reviewing tasks!



