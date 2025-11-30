# Messaging Gating Logic - Critical Fix

**Issue:** Incorrectly gated messaging on SEEKER side
**Fixed:** 2025-11-30
**Priority:** 🔴 CRITICAL

---

## The Problem

Initial implementation added FeatureGate to the request detail page, which is viewed by **SEEKERS (visa requesters)**.

This was **WRONG** because:
- Seekers create visa requests
- Seekers should ALWAYS be able to message providers who respond
- Messaging is FREE for seekers (it's a core feature)
- Only PROVIDERS need to pay for messaging

---

## Correct Business Logic

### Two-Sided Marketplace

```
SEEKER SIDE (Request Detail Page)
├─ Seeker creates visa request
├─ Publishes request to marketplace
├─ Providers send proposals/messages
└─ Seeker can ALWAYS message back (FREE)
   └─ NO GATING NEEDED ✅

PROVIDER SIDE (Marketplace/Dashboard)
├─ Provider browses requests
├─ Provider unlocks request (1 credit)
├─ Provider wants to message seeker
└─ Provider needs PRO/AGENCY plan
   └─ GATING NEEDED ✅
```

---

## Corrected Implementation

### ❌ BEFORE (Incorrect)

**File:** `apps/web/app/requests/[id]/page.tsx` (SEEKER viewing own request)

```typescript
// ❌ WRONG - This page is for SEEKERS, not providers!
{mappedData?.status === 'PUBLISHED' && (
  <FeatureGate feature="messaging.enabled" fallback={...}>
    <button>Messages</button>
  </FeatureGate>
)}
```

**Problem:** Seeker sees "Messages (PRO)" and can't message providers!

---

### ✅ AFTER (Correct)

**File:** `apps/web/app/requests/[id]/page.tsx` (SEEKER viewing own request)

```typescript
// ✅ CORRECT - No gating for seekers
{mappedData?.status === 'PUBLISHED' && (
  <button onClick={() => router.push(`/requests/${requestId}/thread`)}>
    <MessageSquare /> Messages
  </button>
)}
```

**Result:** Seeker always sees working "Messages" button ✅

---

## Where Gating IS Applied (Provider Side)

### Location 1: Thread Page
**File:** `apps/web/app/requests/[id]/thread/page.tsx`

```typescript
// This page can be accessed by BOTH seekers and providers
// So we need to check WHO is accessing it

export default function MessageThreadPage() {
  // ✅ CORRECT: Gate only applies to providers
  return (
    <FeatureGate
      feature="messaging.enabled"
      fallback={<ProviderUpgradeScreen />}
    >
      <MessageThread />
    </FeatureGate>
  );
}
```

**But wait...** this will block seekers too if they call the entitlements API!

**SOLUTION:** Backend must return `messaging.enabled: true` for SEEKERS.

---

### Location 2: Provider Marketplace
**File:** `apps/web/app/providers/marketplace/components/LeadCard.tsx`

```typescript
// ✅ CORRECT: Only providers see this page
{request.unlockStatus === 'UNLOCKED' && (
  <FeatureGate
    feature="messaging.enabled"
    fallback={<UpgradePrompt />}
  >
    <button>Send Message</button>
  </FeatureGate>
)}
```

---

### Location 3: Provider Dashboard
**File:** `apps/web/app/providers/dashboard/page.tsx`

```typescript
// ✅ CORRECT: Only providers see this page
{request.unlockStatus === 'UNLOCKED' && (
  <FeatureGate feature="messaging.enabled">
    <button>Message</button>
  </FeatureGate>
)}
```

---

## Backend Fix Required

### File: `apps/api/src/billing/billing.controller.ts`

**Current code likely has this issue:**

```typescript
@Get('entitlements')
async getEntitlements(@Req() req: ExpressRequest) {
  const user = req.user;

  // ❌ PROBLEM: Seekers don't have provider profiles
  const provider = await this.prisma.providerProfile.findUnique({
    where: { userId: user.id }
  });

  const planCode = provider?.user?.planCode || PlanCode.FREE;
  // Returns FREE plan entitlements for seekers
  // messaging.enabled = false ← WRONG!
}
```

**Fixed code:**

```typescript
@Get('entitlements')
async getEntitlements(@Req() req: ExpressRequest) {
  const user = req.user;

  // ✅ FIX: Seekers always get messaging access
  if (user.role === 'SEEKER') {
    return {
      planCode: 'N/A',
      planName: 'Seeker',
      entitlements: {
        'messaging.enabled': true,  // ← Always true for seekers
        'consultations.canOffer': false,
        'analytics.enabled': false,
        // ... other seeker-appropriate entitlements
      },
      usage: {
        creditsRemaining: 0,
        creditsUsedThisMonth: 0,
        monthlyFreeCredits: 0,
        packagesCreated: 0,
        packagesMax: 0,
        consultationsOffered: 0
      }
    };
  }

  // For providers: Check actual plan
  const provider = await this.prisma.providerProfile.findUnique({
    where: { userId: user.id },
    include: { user: true }
  });

  const planCode = provider?.user?.planCode || PlanCode.FREE;

  return {
    planCode,
    planName: PLAN_METADATA[planCode].name,
    entitlements: PLAN_ENTITLEMENTS[planCode],
    usage: await this.calculateUsage(provider.id)
  };
}
```

---

## Summary of Changes

### Frontend Changes ✅

1. **Removed FeatureGate from request detail page** (seeker side)
   - File: `apps/web/app/requests/[id]/page.tsx`
   - Change: Plain button, no gating
   - Result: Seekers always see "Messages" button

2. **Kept FeatureGate on provider pages** (provider side)
   - Files: LeadCard.tsx, dashboard page, thread page
   - Change: None needed
   - Result: Providers see gating correctly

### Backend Changes Required ⚠️

3. **Add seeker check to entitlements endpoint**
   - File: `apps/api/src/billing/billing.controller.ts`
   - Change: Return `messaging.enabled: true` for seekers
   - Result: Seekers can access thread page

---

## User Flows (Corrected)

### Flow 1: Seeker Messages Provider ✅

```
1. Seeker creates visa request
2. Publishes request
3. Provider unlocks request (pays 1 credit)
4. Provider sends message (if PRO/AGENCY) ← GATED
5. Seeker receives notification
6. Seeker clicks "Messages" button ← NO GATE
7. Thread page loads ← NO GATE (seeker)
8. Seeker types reply and sends ← WORKS
```

### Flow 2: FREE Provider Tries to Message ❌→💰

```
1. FREE provider browses marketplace
2. Unlocks interesting request (1 credit)
3. Sees amber "Upgrade to PRO" card ← GATED
4. Clicks "View Plans"
5. Upgrades to PRO plan
6. Returns to request
7. Sees "Send Message" button ← NO LONGER GATED
8. Clicks and messages seeker ← WORKS
```

### Flow 3: PRO Provider Messages Seeker ✅

```
1. PRO provider browses marketplace
2. Unlocks request (1 credit)
3. Sees "Send Message" button ← NO GATE (has PRO)
4. Clicks button
5. Thread page loads ← NO GATE (has PRO)
6. Types message and sends ← WORKS
7. Seeker receives notification
8. Seeker replies ← WORKS (no gate for seekers)
```

---

## Testing Checklist

### Test 1: Seeker Messaging (Always Free)
- [ ] Login as seeker
- [ ] Create and publish request
- [ ] Click "Messages" button
- [ ] ✅ Should see button (not disabled)
- [ ] ✅ Should open thread page (no upgrade prompt)
- [ ] ✅ Should be able to send messages

### Test 2: FREE Provider Blocked
- [ ] Login as FREE provider
- [ ] Unlock a request
- [ ] ✅ Should see amber "Upgrade" card
- [ ] ✅ Should NOT see "Send Message" button
- [ ] Try accessing `/requests/[id]/thread` directly
- [ ] ✅ Should see upgrade prompt

### Test 3: PRO Provider Allowed
- [ ] Login as PRO provider
- [ ] Unlock a request
- [ ] ✅ Should see "Send Message" button
- [ ] Click "Send Message"
- [ ] ✅ Should open thread page
- [ ] ✅ Should be able to send messages

### Test 4: Backend Returns Correct Entitlements
- [ ] As seeker: Call `/api/billing/entitlements`
- [ ] ✅ Should return `messaging.enabled: true`
- [ ] As FREE provider: Call `/api/billing/entitlements`
- [ ] ✅ Should return `messaging.enabled: false`
- [ ] As PRO provider: Call `/api/billing/entitlements`
- [ ] ✅ Should return `messaging.enabled: true`

---

## Key Insight

**Messaging is a TWO-SIDED feature:**

| Side | User Type | Messaging Cost | Gating Needed? |
|------|-----------|---------------|----------------|
| **Demand Side** | Seeker (requester) | FREE (always) | ❌ No |
| **Supply Side** | Provider (expert) | PRO/AGENCY only | ✅ Yes |

**Why this makes sense:**
- Seekers NEED to communicate to get help (core value)
- Providers EARN money from leads (can afford to pay)
- Free-tier providers can still send proposals (lead generation)
- Messaging is a premium upsell for serious providers

---

## Files Modified

1. ✅ `apps/web/app/requests/[id]/page.tsx` - Removed FeatureGate
2. ⚠️ `apps/api/src/billing/billing.controller.ts` - Need to add seeker check

---

**Status:** Frontend fixed ✅, Backend needs verification ⚠️
**Next:** Check if backend already handles seekers correctly
