# Messaging Gating Fix - Critical Business Rule

**Issue:** Messaging system was built without proper entitlement gating
**Status:** 🔴 CRITICAL - Violates business model
**Priority:** Fix before any deployment

---

## Problem Statement

The messaging system built by the agents has two critical issues:

1. **No Payment Gate:** Messaging is accessible to ALL users, including FREE tier providers
2. **Missing Provider UI:** Messaging is only visible on requester side, not provider side
3. **Business Rule Violation:** Messaging should be a PAID feature (PRO/AGENCY only), just like consultations

---

## Current State (Incorrect)

### Request Detail Page (Requester Side)
**File:** `apps/web/app/requests/[id]/page.tsx` (lines 190-198)

```typescript
// ❌ INCORRECT - No gating, shows to everyone
{mappedData?.status === 'PUBLISHED' && (
  <button
    onClick={() => router.push(`/requests/${requestId}/thread`)}
    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2"
  >
    <MessageSquare className="h-4 w-4" />
    Messages
  </button>
)}
```

### Provider Side
**Status:** ❌ No UI exists for providers to access messaging

---

## Correct Implementation

### Step 1: Add Messaging Entitlement to Backend

**File:** `apps/api/src/billing/plan-entitlements.ts`

```typescript
// Current structure (consultations only):
export const PLAN_ENTITLEMENTS: Record<PlanCode, PlanEntitlements> = {
  FREE: {
    name: 'Free',
    features: {
      'unlocks.enabled': true,
      'packages.max': 1,
      'analytics.basic': true,
      'consultations.canOffer': false, // ✅ Correctly gated
      // ❌ MISSING: 'messaging.enabled': false,
    },
  },
  PRO: {
    name: 'Pro',
    features: {
      'unlocks.enabled': true,
      'packages.max': 5,
      'analytics.advanced': true,
      'consultations.canOffer': true, // ✅ Correctly gated
      // ❌ MISSING: 'messaging.enabled': true,
    },
  },
  AGENCY: {
    name: 'Agency',
    features: {
      'unlocks.enabled': true,
      'packages.max': 999,
      'analytics.advanced': true,
      'consultations.canOffer': true, // ✅ Correctly gated
      // ❌ MISSING: 'messaging.enabled': true,
    },
  },
};
```

**Fix:**
```typescript
export const PLAN_ENTITLEMENTS: Record<PlanCode, PlanEntitlements> = {
  FREE: {
    name: 'Free',
    features: {
      'unlocks.enabled': true,
      'packages.max': 1,
      'analytics.basic': true,
      'consultations.canOffer': false,
      'messaging.enabled': false, // ✅ FREE users cannot message
    },
  },
  PRO: {
    name: 'Pro',
    features: {
      'unlocks.enabled': true,
      'packages.max': 5,
      'analytics.advanced': true,
      'consultations.canOffer': true,
      'messaging.enabled': true, // ✅ PRO users can message
    },
  },
  AGENCY: {
    name: 'Agency',
    features: {
      'unlocks.enabled': true,
      'packages.max': 999,
      'analytics.advanced': true,
      'consultations.canOffer': true,
      'messaging.enabled': true, // ✅ AGENCY users can message
    },
  },
};
```

---

### Step 2: Gate Messages Button on Requester Side

**File:** `apps/web/app/requests/[id]/page.tsx`

**Current (line 190-198):**
```typescript
{mappedData?.status === 'PUBLISHED' && (
  <button onClick={() => router.push(`/requests/${requestId}/thread`)}>
    <MessageSquare className="h-4 w-4" />
    Messages
  </button>
)}
```

**Fixed:**
```typescript
{mappedData?.status === 'PUBLISHED' && (
  <FeatureGate
    feature="messaging.enabled"
    fallback={
      <button
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500"
        disabled
      >
        <MessageSquare className="h-4 w-4" />
        Messages (PRO)
      </button>
    }
  >
    <button
      onClick={() => router.push(`/requests/${requestId}/thread`)}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
    >
      <MessageSquare className="h-4 w-4" />
      Messages
    </button>
  </FeatureGate>
)}
```

**Import needed:**
```typescript
import { FeatureGate } from '@/components/FeatureGate';
```

---

### Step 3: Add Provider-Side Messaging Access

**File:** `apps/web/app/providers/marketplace/components/LeadCard.tsx` (or similar)

Providers who have unlocked a request should see a "Message" button:

```typescript
import { FeatureGate } from '@/components/FeatureGate';
import { MessageSquare } from 'lucide-react';

// Inside LeadCard component, after unlock button:
{request.unlockStatus === 'UNLOCKED' && (
  <FeatureGate
    feature="messaging.enabled"
    fallback={
      <div className="text-xs text-gray-500 mt-2">
        💎 Upgrade to PRO to message clients
      </div>
    }
  >
    <button
      onClick={() => router.push(`/requests/${request.id}/thread`)}
      className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
    >
      <MessageSquare className="h-4 w-4" />
      Send Message
    </button>
  </FeatureGate>
)}
```

---

### Step 4: Gate Thread Page Access

**File:** `apps/web/app/requests/[id]/thread/page.tsx`

Add gating at the page level to prevent direct URL access:

```typescript
import { FeatureGate } from '@/components/FeatureGate';

export default function MessageThreadPage() {
  return (
    <FeatureGate
      feature="messaging.enabled"
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Messaging is a PRO Feature</h1>
            <p className="mt-2 text-gray-600">
              Upgrade to PRO or AGENCY plan to message clients
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="mt-4 rounded-lg bg-primary px-6 py-3 text-white"
            >
              View Plans
            </button>
          </div>
        </div>
      }
    >
      {/* Existing messaging UI */}
    </FeatureGate>
  );
}
```

---

## Implementation Checklist

### Backend (1 hour)
- [ ] Update `apps/api/src/billing/plan-entitlements.ts`
  - [ ] Add `'messaging.enabled': false` to FREE plan
  - [ ] Add `'messaging.enabled': true` to PRO plan
  - [ ] Add `'messaging.enabled': true` to AGENCY plan
- [ ] Test entitlements endpoint: `GET /billing/entitlements`
- [ ] Verify FREE users get `messaging.enabled: false`
- [ ] Verify PRO/AGENCY users get `messaging.enabled: true`

### Frontend - Requester Side (1 hour)
- [ ] Update `apps/web/app/requests/[id]/page.tsx`
  - [ ] Import `FeatureGate` component
  - [ ] Wrap "Messages" button with FeatureGate
  - [ ] Add fallback showing "Messages (PRO)" disabled button
- [ ] Update `apps/web/app/requests/[id]/thread/page.tsx`
  - [ ] Add page-level FeatureGate
  - [ ] Add upgrade prompt fallback
  - [ ] Link to `/pricing` page

### Frontend - Provider Side (2 hours)
- [ ] Find all places where unlocked requests are displayed:
  - [ ] `apps/web/app/providers/marketplace/page.tsx`
  - [ ] `apps/web/app/providers/dashboard/page.tsx`
  - [ ] `apps/web/app/providers/marketplace/components/LeadCard.tsx`
- [ ] Add "Message" button to each unlocked request card
- [ ] Wrap with FeatureGate
- [ ] Add upgrade prompt for FREE users
- [ ] Test navigation to `/requests/[id]/thread`

### Testing (1 hour)
- [ ] **As FREE provider:**
  - [ ] Unlock a request
  - [ ] Verify "Send Message" button shows upgrade prompt
  - [ ] Try accessing `/requests/[id]/thread` directly (should show upgrade page)
- [ ] **As PRO provider:**
  - [ ] Unlock a request
  - [ ] Click "Send Message" → Should open thread
  - [ ] Send a message → Should work
- [ ] **As Requester:**
  - [ ] Create and publish request
  - [ ] Verify "Messages" button works
  - [ ] See messages from providers

---

## Business Rules Summary

### Who Can Message?

| User Type | Plan | Can Send Messages? |
|-----------|------|-------------------|
| Requester | Any | ✅ Yes (always free for requesters) |
| Provider | FREE | ❌ No - Must upgrade |
| Provider | PRO | ✅ Yes |
| Provider | AGENCY | ✅ Yes |

### How Messaging Works

1. **Requester creates request** → Always can message (free)
2. **Provider unlocks request** (costs 1 credit)
3. **Provider needs PRO/AGENCY** to send messages
4. **Both parties** can exchange messages freely after that

---

## Why This Matters

### Revenue Impact
- Messaging is a **core value proposition** for PRO plans
- FREE providers can see requests but must upgrade to communicate
- Drives conversion from FREE → PRO ($X/month)

### User Experience
- Requesters always have free messaging (reduces friction)
- Providers see value of upgrade (unlock + message = qualified leads)
- Clear upgrade prompts guide FREE users to paid plans

### Technical Debt
- Agents built feature without business context
- Easy fix: ~5 hours total (1 backend + 4 frontend)
- Must fix before ANY production deployment

---

## Estimated Effort

**Total:** 5 hours

| Task | Time |
|------|------|
| Backend entitlements update | 1 hour |
| Requester side gating | 1 hour |
| Provider side UI + gating | 2 hours |
| Testing all scenarios | 1 hour |

---

## Priority

🔴 **CRITICAL - Must fix before deployment**

This is a **business model violation**. Shipping messaging without payment gating:
- Gives away premium feature for free
- Eliminates upgrade incentive
- Loses revenue
- Confuses pricing strategy

**Fix this FIRST** before any other Phase 1 work.

---

## Files to Modify

### Backend (1 file)
1. `apps/api/src/billing/plan-entitlements.ts`

### Frontend (4-5 files)
1. `apps/web/app/requests/[id]/page.tsx` (requester)
2. `apps/web/app/requests/[id]/thread/page.tsx` (gate page)
3. `apps/web/app/providers/marketplace/page.tsx` (provider list)
4. `apps/web/app/providers/dashboard/page.tsx` (provider dashboard)
5. `apps/web/app/providers/marketplace/components/LeadCard.tsx` (if exists)

---

## Next Steps

1. Read this document
2. Start with backend (1 hour)
3. Test entitlements endpoint
4. Fix frontend gating (3 hours)
5. Full QA testing (1 hour)
6. Deploy fix

**Do this before continuing with Path C Week 1.**
