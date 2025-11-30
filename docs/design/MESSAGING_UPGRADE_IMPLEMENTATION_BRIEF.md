# Messaging Upgrade Prompts - Implementation Brief

**For:** frontend-developer agent
**Priority:** HIGH (business-critical feature gating)
**Estimated Time:** 2-3 hours
**Status:** Design Complete, Ready for Implementation

---

## Quick Start

### Files to Modify

```
apps/web/app/requests/[id]/thread/page.tsx          CREATE/UPDATE
apps/web/app/providers/marketplace/components/LeadCard.tsx  UPDATE
```

### Dependencies (Already Installed)

```typescript
import { FeatureGate } from '@/components/FeatureGate';
import { MessageSquare, Sparkles, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
```

---

## Implementation Tasks

### Task 1: Thread Page Upgrade Prompt (30 min)

**File:** `apps/web/app/requests/[id]/thread/page.tsx`

**Wrap entire page in FeatureGate:**

```typescript
'use client';

import { FeatureGate } from '@/components/FeatureGate';
import { useRouter } from 'next/navigation';
import { MessageSquare, CheckCircle, TrendingUp, Clock } from 'lucide-react';

export default function MessageThreadPage() {
  const router = useRouter();

  return (
    <FeatureGate
      feature="messaging.enabled"
      fallback={
        {/* Copy full upgrade prompt from design spec */}
      }
    >
      {/* Existing messaging thread UI */}
    </FeatureGate>
  );
}
```

**Full code:** See `docs/design/MESSAGING_UPGRADE_PROMPTS_DESIGN.md` - Task 1

---

### Task 2: LeadCard Messaging Buttons (1.5 hours)

**File:** `apps/web/app/providers/marketplace/components/LeadCard.tsx`

**Find unlocked state section** (around line 123-137):

```typescript
{!isLocked && (
  <div className="...">
    <span>Unlocked</span>
    <button>Send proposal</button>  // ← Current state
  </div>
)}
```

**Replace with feature-gated messaging:**

```typescript
{!isLocked && (
  <div className="flex flex-col items-start justify-between gap-3 border-t border-gray-100 pt-3">
    <div className="flex items-center gap-2 text-sm">
      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/10">
        Unlocked
      </span>
      <span className="text-gray-500">You can now send a proposal</span>
    </div>

    <FeatureGate
      feature="messaging.enabled"
      silent={true}
      fallback={
        {/* FREE user - amber upgrade card */}
      }
    >
      {/* PRO user - messaging + proposal buttons */}
    </FeatureGate>
  </div>
)}
```

**Full code:** See `docs/design/MESSAGING_UPGRADE_PROMPTS_DESIGN.md` - Task 2

---

## Design Specs Quick Reference

### Colors

```typescript
// Primary (Blue)
bg-primary              #2563eb
bg-primary-hover        #1d4ed8
text-primary            #2563eb

// Upgrade (Amber/Gold)
bg-amber-600            #d97706
bg-amber-50             #fffbeb
border-amber-200        #fde68a
text-amber-900          #78350f

// Success (Green)
bg-green-600            #16a34a
bg-green-50             #dcfce7
text-green-700          #15803d
```

### Heights (WCAG AA Compliant)

```typescript
h-12   // 48px - Primary buttons, inputs
h-10   // 40px - Secondary CTAs (upgrade buttons)
h-8    // 32px - Icon containers
```

### Border Radius

```typescript
rounded-lg     // 16px - Buttons
rounded-base   // 8px  - Cards, inputs
rounded-2xl    // 24px - Icon backgrounds
rounded-full   // Pills, badges
```

### Spacing

```typescript
gap-2   // 8px  - Icon + text
gap-3   // 12px - Small spacing
gap-6   // 24px - Standard spacing
p-4     // 16px - Compact padding
p-6     // 24px - Standard card padding
```

---

## Testing Checklist

### Test as FREE Provider

```bash
# 1. Login as FREE provider
# 2. Navigate to /requests/[id]/thread
# Expected: See full-page upgrade prompt

# 3. Go to marketplace
# 4. Unlock a request
# Expected: See amber "Message with PRO" upgrade card

# 5. Click "Upgrade to PRO"
# Expected: Navigate to /pricing
```

### Test as PRO Provider

```bash
# 1. Login as PRO provider
# 2. Navigate to /requests/[id]/thread
# Expected: See messaging thread (no prompt)

# 3. Go to marketplace
# 4. Unlock a request
# Expected: See "Send Message" button (blue outline)

# 5. Click "Send Message"
# Expected: Navigate to /requests/[id]/thread
```

### Test Responsive

```bash
# 1. Test at 375px (mobile)
# Expected: Stacked buttons, full-width cards

# 2. Test at 768px (tablet)
# Expected: Side-by-side buttons on upgrade prompt

# 3. Test at 1024px (desktop)
# Expected: Same as tablet (max-w-lg constraint)
```

### Test Accessibility

```bash
# 1. Tab through all interactive elements
# Expected: Clear focus rings (blue for primary, amber for upgrade)

# 2. Use screen reader
# Expected: All buttons have accessible labels

# 3. Check color contrast
# Expected: All text meets WCAG AA (4.5:1 minimum)
```

---

## Visual Previews

### Preview HTML Mockup

Open in browser:
```
C:\Dev\VOT2\docs\design\mockups\messaging-upgrade-prompts-v1.html
```

Contains:
- Full thread page upgrade prompt (desktop + mobile)
- PRO user state (messaging enabled)
- FREE user state (upgrade card)
- Side-by-side comparison
- Design system reference

---

## API Integration

### Entitlement Check

The `FeatureGate` component automatically checks:

```typescript
// Backend API: /api/billing/entitlements
{
  "messaging.enabled": true   // PRO/AGENCY
  "messaging.enabled": false  // FREE
}
```

**Already implemented in backend** - no changes needed.

---

## Common Pitfalls

### DON'T

```typescript
// ❌ Hardcode colors
<div className="bg-[#2563eb]">

// ❌ Use wrong heights
<button className="h-11">  // Below WCAG minimum

// ❌ Mix border radius
<Card className="rounded-xl">  // Should be rounded-base

// ❌ Forget focus states
<button className="...">  // Missing focus-visible
```

### DO

```typescript
// ✅ Use design tokens
<div className="bg-primary">

// ✅ Use correct heights
<button className="h-12">  // 48px - WCAG AA

// ✅ Consistent border radius
<Card className="rounded-base">  // 8px standard

// ✅ Add focus states
<button className="... focus-visible:ring-2 focus-visible:ring-primary">
```

---

## Code Snippets

### Thread Page Upgrade Prompt (Copy-Paste Ready)

```typescript
<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
  <div className="w-full max-w-lg">
    {/* Icon */}
    <div className="mb-6 flex justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200/50">
        <MessageSquare className="h-10 w-10 text-white" strokeWidth={2} />
      </div>
    </div>

    {/* Heading */}
    <h1 className="mb-3 text-center text-3xl font-bold text-text-primary">
      Messaging is a PRO Feature
    </h1>

    {/* Description */}
    <p className="mb-8 text-center text-base text-text-secondary">
      Direct messaging helps you close more deals by building trust with clients before sending proposals.
    </p>

    {/* Benefits List */}
    <div className="mb-8 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
        What you'll unlock
      </h2>

      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
          <CheckCircle className="h-5 w-5 text-success" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-medium text-text-primary">Direct client communication</p>
          <p className="text-sm text-text-secondary">
            Answer questions and build rapport before submitting quotes
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
          <TrendingUp className="h-5 w-5 text-success" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-medium text-text-primary">Higher conversion rates</p>
          <p className="text-sm text-text-secondary">
            Providers who message first are 3x more likely to win the job
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
          <Clock className="h-5 w-5 text-success" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-medium text-text-primary">Real-time notifications</p>
          <p className="text-sm text-text-secondary">
            Get instant alerts when clients respond to your messages
          </p>
        </div>
      </div>
    </div>

    {/* Pricing Callout */}
    <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-center">
      <p className="mb-1 text-sm font-medium text-blue-900">
        Included in PRO plan
      </p>
      <p className="text-2xl font-bold text-blue-900">
        1,490 THB<span className="text-base font-normal text-blue-700">/month</span>
      </p>
      <p className="mt-1 text-xs text-blue-700">
        14-day free trial • No credit card required
      </p>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={() => router.back()}
        className="flex h-12 flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Go Back
      </button>
      <button
        onClick={() => router.push('/pricing')}
        className="flex h-12 flex-1 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:bg-primary-hover hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        View Plans & Pricing
      </button>
    </div>

    {/* Footer Note */}
    <p className="mt-6 text-center text-sm text-text-tertiary">
      Already have PRO?{' '}
      <button
        onClick={() => router.push('/account')}
        className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
      >
        Check your subscription
      </button>
    </p>
  </div>
</div>
```

### FREE User Upgrade Card (Copy-Paste Ready)

```typescript
<div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
  <div className="mb-2 flex items-start gap-3">
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400/20">
      <Sparkles className="h-4.5 w-4.5 text-amber-600" strokeWidth={2.5} />
    </div>
    <div className="flex-1">
      <p className="mb-1 text-sm font-semibold text-amber-900">
        Message this client with PRO
      </p>
      <p className="text-xs text-amber-700">
        Build trust and answer questions before sending your proposal
      </p>
    </div>
  </div>
  <button
    onClick={() => router.push('/pricing')}
    className="flex h-10 w-full items-center justify-center rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
  >
    Upgrade to PRO
  </button>
</div>
```

### PRO User Messaging Button (Copy-Paste Ready)

```typescript
<button
  onClick={() => router.push(`/requests/${request.id}/thread`)}
  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 text-base font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
>
  <MessageSquare className="h-4.5 w-4.5" strokeWidth={2} />
  <span>Send Message</span>
</button>
```

---

## Success Criteria

- [ ] FREE users see full-page upgrade prompt on `/thread` page
- [ ] PRO users can access `/thread` page normally
- [ ] FREE users see amber upgrade card on unlocked requests
- [ ] PRO users see "Send Message" button on unlocked requests
- [ ] All CTAs route to correct pages (`/pricing`, `/account`, `/thread`)
- [ ] Mobile responsive (375px, 768px, 1024px)
- [ ] Keyboard navigation works (focus states visible)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All buttons are 48px tall (WCAG AA)

---

## Resources

**Full Design Spec:**
- `C:\Dev\VOT2\docs\design\MESSAGING_UPGRADE_PROMPTS_DESIGN.md`

**Visual Mockup:**
- `C:\Dev\VOT2\docs\design\mockups\messaging-upgrade-prompts-v1.html`

**Design System:**
- `C:\Dev\VOT2\docs\design\TAILWIND_QUICK_REFERENCE.md`

**Context:**
- `C:\Dev\VOT2\docs\MESSAGING_GATING_COMPLETED.md`

---

## Questions?

**Design:** Ask tailwind-frontend-expert
**Backend:** Ask backend-developer (entitlements API)
**Next.js:** Ask react-nextjs-expert (routing, SSR)
**Implementation:** Ask frontend-developer (you!)

---

**Status:** Ready to implement
**Priority:** HIGH
**Estimated Time:** 2-3 hours
**Dependencies:** None (all components exist)

---

**Good luck!** The designs are polished and production-ready.
