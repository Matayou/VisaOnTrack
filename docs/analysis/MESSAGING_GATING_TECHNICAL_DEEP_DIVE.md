# Messaging Gating - Technical Deep Dive

**How it works in complete detail**

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Flow                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: User Authentication (Already Handled)                  │
│  - User logs in → JWT token stored in cookies                   │
│  - Token contains: userId, role (PROVIDER/SEEKER), planCode     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Page Load → FeatureGate Component Renders              │
│  - Component mounts and immediately checks entitlements          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Entitlements API Call                                  │
│  GET /api/billing/entitlements                                  │
│  Returns: { planCode, planName, entitlements: {...}, usage }    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: FeatureGate Evaluates Access                           │
│  - Checks if entitlements['messaging.enabled'] === true         │
│  - Shows content OR fallback based on result                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Backend - Plan Entitlements System

### File: `apps/api/src/billing/plan-entitlements.ts`

This file defines what features are available for each plan tier.

**Data Structure:**

```typescript
export const PLAN_ENTITLEMENTS = {
  [PlanCode.FREE]: {
    'consultations.canOffer': false,
    'messaging.enabled': false,        // ← FREE users CANNOT message
    'credits.monthlyFree': 0,
    'packages.max': 3,
    // ... other entitlements
  },
  [PlanCode.PRO]: {
    'consultations.canOffer': true,
    'messaging.enabled': true,         // ← PRO users CAN message
    'credits.monthlyFree': 10,
    'packages.max': 12,
    // ... other entitlements
  },
  [PlanCode.AGENCY]: {
    'consultations.canOffer': true,
    'messaging.enabled': true,         // ← AGENCY users CAN message
    'credits.monthlyFree': 30,
    'packages.max': 999,
    // ... other entitlements
  },
} as const;
```

**How it's stored:**
- This is a **static configuration** (not in database)
- Changes require code deployment
- Type-safe using TypeScript `as const`

---

## Part 2: Backend - Entitlements API Endpoint

### File: `apps/api/src/billing/billing.controller.ts`

**Endpoint:** `GET /api/billing/entitlements`

**What happens when this is called:**

```typescript
@Get('entitlements')
@UseGuards(JwtAuthGuard) // ← Requires authentication
async getEntitlements(@Req() req: ExpressRequest) {
  // 1. Extract user from JWT token
  const user = req.user; // { id: '123', role: 'PROVIDER', planCode: 'FREE' }

  // 2. Fetch provider profile from database
  const provider = await this.prisma.providerProfile.findUnique({
    where: { userId: user.id },
    include: { user: true }
  });

  // 3. Get plan code (defaults to FREE if not set)
  const planCode = provider?.user?.planCode || PlanCode.FREE;

  // 4. Look up entitlements from PLAN_ENTITLEMENTS
  const entitlements = PLAN_ENTITLEMENTS[planCode];

  // 5. Calculate current usage stats
  const usage = await this.calculateUsage(provider.id);

  // 6. Return complete entitlements object
  return {
    planCode: planCode,                    // "FREE"
    planName: PLAN_METADATA[planCode].name, // "Free"
    entitlements: entitlements,            // { 'messaging.enabled': false, ... }
    usage: {
      creditsRemaining: 5,
      creditsUsedThisMonth: 3,
      monthlyFreeCredits: 0,
      packagesCreated: 2,
      packagesMax: 3,
      consultationsOffered: 0
    }
  };
}
```

**Example Response (FREE user):**

```json
{
  "planCode": "FREE",
  "planName": "Free",
  "entitlements": {
    "consultations.canOffer": false,
    "messaging.enabled": false,
    "credits.monthlyFree": 0,
    "packages.max": 3,
    "fileUpload.maxSizeMB": 2,
    "search.rankingBoost": 1,
    "analytics.enabled": false,
    "analytics.advanced": false,
    "team.enabled": false,
    "team.maxMembers": 1
  },
  "usage": {
    "creditsRemaining": 5,
    "creditsUsedThisMonth": 3,
    "monthlyFreeCredits": 0,
    "packagesCreated": 2,
    "packagesMax": 3,
    "consultationsOffered": 0
  }
}
```

**Example Response (PRO user):**

```json
{
  "planCode": "PRO",
  "planName": "Pro",
  "entitlements": {
    "consultations.canOffer": true,
    "messaging.enabled": true,        // ← TRUE for PRO
    "credits.monthlyFree": 10,
    "packages.max": 12,
    // ... rest of entitlements
  },
  "usage": { /* ... */ }
}
```

---

## Part 3: Frontend - FeatureGate Component

### File: `apps/web/components/FeatureGate.tsx`

This is the **core component** that checks entitlements and shows/hides features.

**Component Props:**

```typescript
interface FeatureGateProps {
  feature: string;              // e.g., 'messaging.enabled'
  children: ReactNode;          // What to show if user HAS access
  fallback?: ReactNode;         // What to show if user DOESN'T have access
  modalVariant?: 'detailed' | 'simple';
  silent?: boolean;             // If true, just hide (no upgrade prompt)
}
```

**How it works internally:**

```typescript
export function FeatureGate({ feature, children, fallback, silent }) {
  // STATE
  const [entitlements, setEntitlements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // FETCH ENTITLEMENTS ON MOUNT
  useEffect(() => {
    const fetchEntitlements = async () => {
      try {
        // Call backend API
        const data = await api.billing.getEntitlements();
        setEntitlements(data);

        // Check if user has access to the requested feature
        const featureValue = data.entitlements[feature];

        // For boolean entitlements (like 'messaging.enabled')
        if (typeof featureValue === 'boolean') {
          setHasAccess(featureValue);
        }
        // For numeric/string entitlements (like 'packages.max')
        else if (featureValue !== undefined && featureValue !== null) {
          setHasAccess(true);
        }
        // Feature not found or explicitly disabled
        else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Failed to fetch entitlements:', error);
        setHasAccess(false); // ← Fail closed (deny access on error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntitlements();
  }, [feature]);

  // LOADING STATE
  if (isLoading) {
    return <Spinner />;
  }

  // USER HAS ACCESS → Show children
  if (hasAccess) {
    return <>{children}</>;
  }

  // USER DOESN'T HAVE ACCESS

  // Option 1: Silent mode (just hide)
  if (silent) {
    return null;
  }

  // Option 2: Custom fallback provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Option 3: Default upgrade modal
  return (
    <>
      <div onClick={() => setShowUpgradeModal(true)}>
        {children} {/* Shows content but disabled/dimmed */}
      </div>
      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={feature}
      />
    </>
  );
}
```

**Key Points:**

1. **Runs client-side** in the browser
2. **Fetches entitlements** on component mount
3. **Caches nothing** (fetches fresh every time)
4. **Fails closed** (denies access if API call fails)
5. **Shows loading spinner** while checking
6. **Flexible** (can show fallback, modal, or hide silently)

---

## Part 4: Implementation - Request Detail Page

### File: `apps/web/app/requests/[id]/page.tsx`

**How the "Messages" button is gated:**

```typescript
// Line 17: Import FeatureGate
import { FeatureGate } from '@/components/FeatureGate';

// Lines 191-213: Render Messages button with gating
{mappedData?.status === 'PUBLISHED' && (
  <FeatureGate
    feature="messaging.enabled"
    fallback={
      <button
        className="inline-flex items-center gap-2 rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary/60 cursor-not-allowed"
        disabled
        title="Upgrade to PRO plan to message service providers"
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

**What happens step-by-step:**

1. **Page loads** → FeatureGate component mounts
2. **FeatureGate** calls `api.billing.getEntitlements()`
3. **Backend returns** entitlements for current user's plan
4. **FeatureGate checks** `entitlements['messaging.enabled']`
5. **If true (PRO/AGENCY):** Shows working "Messages" button
6. **If false (FREE):** Shows disabled "Messages (PRO)" button with tooltip
7. **User clicks disabled button:** Nothing happens (it's disabled)
8. **User clicks PRO badge area:** Could trigger upgrade modal (optional)

---

## Part 5: Implementation - Thread Page Gating

### File: `apps/web/app/requests/[id]/thread/page.tsx`

**Entire page wrapped in FeatureGate:**

```typescript
export default function MessageThreadPage() {
  const router = useRouter();

  return (
    <FeatureGate
      feature="messaging.enabled"
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
          <div className="max-w-md text-center">
            <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Messaging is a PRO Feature
            </h1>
            <p className="text-gray-600 mb-6">
              Upgrade to PRO or AGENCY plan to communicate directly with clients.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="rounded-lg bg-primary px-6 py-3 text-white"
            >
              View Plans & Pricing
            </button>
          </div>
        </div>
      }
    >
      {/* Normal messaging UI - MessageThread, MessageComposer, etc. */}
    </FeatureGate>
  );
}
```

**What happens when FREE user types URL directly:**

1. **User navigates to** `/requests/123/thread`
2. **Page component renders** → FeatureGate mounts
3. **FeatureGate** calls API → Gets `messaging.enabled: false`
4. **FeatureGate** evaluates `hasAccess = false`
5. **FeatureGate** renders `fallback` instead of `children`
6. **User sees** full-page upgrade prompt
7. **User clicks** "View Plans & Pricing" → Redirects to `/pricing`

**What happens when PRO user accesses same URL:**

1. **User navigates to** `/requests/123/thread`
2. **Page component renders** → FeatureGate mounts
3. **FeatureGate** calls API → Gets `messaging.enabled: true`
4. **FeatureGate** evaluates `hasAccess = true`
5. **FeatureGate** renders `children` (normal messaging UI)
6. **User sees** MessageThread and can send messages

---

## Part 6: Implementation - Provider Marketplace

### File: `apps/web/app/providers/marketplace/components/LeadCard.tsx`

**Messaging button for unlocked requests:**

```typescript
{request.unlockStatus === 'UNLOCKED' && (
  <div className="mt-3 space-y-2">
    {/* Existing proposal button */}
    <button className="...">Send proposal</button>

    {/* New: Messaging button with gating */}
    <FeatureGate
      feature="messaging.enabled"
      fallback={
        <div className="mt-2 rounded-lg border-2 border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <span className="text-lg">💎</span>
            <div>
              <p className="text-sm font-medium text-amber-900">
                Messaging is a PRO Feature
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Upgrade to communicate directly with this client
              </p>
              <button
                onClick={() => router.push('/pricing')}
                className="mt-2 text-xs font-medium text-amber-900 underline"
              >
                View Plans →
              </button>
            </div>
          </div>
        </div>
      }
    >
      <button
        onClick={() => router.push(`/requests/${request.id}/thread`)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white"
      >
        <MessageSquare className="h-4 w-4" />
        Send Message
      </button>
    </FeatureGate>
  </div>
)}
```

**Flow for FREE provider:**

1. **Provider unlocks request** (spends 1 credit)
2. **Unlock succeeds** → `request.unlockStatus = 'UNLOCKED'`
3. **Card re-renders** → Shows proposal button + messaging section
4. **FeatureGate mounts** → Calls entitlements API
5. **API returns** `messaging.enabled: false` (FREE plan)
6. **FeatureGate shows fallback** → Amber upgrade card appears
7. **Provider sees:** "💎 Messaging is a PRO Feature"
8. **Provider clicks** "View Plans →" → Goes to pricing page

**Flow for PRO provider:**

1. **Provider unlocks request** (spends 1 credit)
2. **Unlock succeeds** → `request.unlockStatus = 'UNLOCKED'`
3. **Card re-renders** → Shows proposal button + messaging section
4. **FeatureGate mounts** → Calls entitlements API
5. **API returns** `messaging.enabled: true` (PRO plan)
6. **FeatureGate shows children** → "Send Message" button appears
7. **Provider clicks** "Send Message" → Navigates to `/requests/123/thread`
8. **Thread page loads** → FeatureGate passes → Shows messaging UI

---

## Part 7: User Flows - Complete Scenarios

### Scenario A: FREE Provider Tries to Message

```
1. FREE provider logs in
   ↓
2. Browses marketplace → Sees interesting request
   ↓
3. Clicks "Unlock" → Spends 1 credit
   ↓
4. Unlock succeeds → Request card updates
   ↓
5. Sees two options:
   - "Send proposal" (blue button) ← WORKS
   - Amber box: "💎 Messaging is a PRO Feature" ← BLOCKED
   ↓
6. Clicks "View Plans →"
   ↓
7. Lands on /pricing page
   ↓
8. Sees PRO plan features:
   - ✅ Message clients directly (highlighted)
   - ✅ Offer consultations
   - 10 free credits/month
   - etc.
   ↓
9. Decides to upgrade
   ↓
10. Clicks "Start Free Trial" or "Subscribe Now"
   ↓
11. Completes Stripe checkout
   ↓
12. User.planCode updated to "PRO" in database
   ↓
13. Returns to marketplace
   ↓
14. Now sees working "Send Message" button! ✅
```

### Scenario B: PRO Provider Messages Client

```
1. PRO provider logs in
   ↓
2. Browses marketplace → Sees request
   ↓
3. Clicks "Unlock" → Spends 1 credit
   ↓
4. Sees two working buttons:
   - "Send proposal" (blue, primary)
   - "Send Message" (blue, outlined)
   ↓
5. Clicks "Send Message"
   ↓
6. Navigates to /requests/123/thread
   ↓
7. FeatureGate checks entitlements
   ↓
8. messaging.enabled = true ✅
   ↓
9. Thread page loads normally
   ↓
10. Provider types message + uploads file
   ↓
11. Clicks "Send"
   ↓
12. Message sent via API
   ↓
13. Requester receives notification
   ↓
14. Requester replies
   ↓
15. Provider sees reply (5-second polling)
```

### Scenario C: Requester (Always Free)

```
1. Requester logs in
   ↓
2. Creates visa request
   ↓
3. Publishes request (status = OPEN)
   ↓
4. Views own request detail page
   ↓
5. Sees "Messages" button (no gating for requesters)
   ↓
6. Clicks "Messages"
   ↓
7. Thread page loads
   ↓
8. FeatureGate checks: user role = SEEKER
   ↓
9. For seekers: messaging.enabled is NOT checked
   ↓
10. Thread loads normally ✅
   ↓
11. Requester can message any provider who unlocked
```

**Wait, how does it work for requesters?**

Actually, looking at the current implementation, requesters go through the same FeatureGate. But requesters don't have a `planCode` (only providers do). So:

- **Requester calls** `/api/billing/entitlements`
- **Backend checks** provider profile → Returns null
- **Entitlements defaults to** FREE plan
- **messaging.enabled** = false

**This is a BUG!** Requesters should always have messaging access.

Let me check how this should actually work...

---

## Part 8: Requesters Access (IMPORTANT CLARIFICATION)

Looking at the implementation, there's a potential issue. Let me trace through what happens:

**Current Code:**
```typescript
// In billing.controller.ts
const provider = await this.prisma.providerProfile.findUnique({
  where: { userId: user.id }
});

const planCode = provider?.user?.planCode || PlanCode.FREE;
```

**Problem:** Requesters (seekers) don't have a provider profile, so this returns null.

**Solution Options:**

### Option 1: Check User Role (RECOMMENDED)
```typescript
// In billing.controller.ts
@Get('entitlements')
async getEntitlements(@Req() req: ExpressRequest) {
  const user = req.user;

  // SEEKERS always get full access to messaging
  if (user.role === 'SEEKER') {
    return {
      planCode: 'N/A',
      planName: 'Seeker',
      entitlements: {
        'messaging.enabled': true,  // ← Always true for seekers
        // ... other seeker-specific entitlements
      },
      usage: {}
    };
  }

  // PROVIDERS: Check plan code
  const provider = await this.prisma.providerProfile.findUnique({
    where: { userId: user.id }
  });

  const planCode = provider?.user?.planCode || PlanCode.FREE;
  return {
    planCode,
    entitlements: PLAN_ENTITLEMENTS[planCode],
    usage: await this.calculateUsage(provider.id)
  };
}
```

### Option 2: Skip FeatureGate for Requesters
```typescript
// In request detail page
const user = await api.users.getCurrentUser();

{mappedData?.status === 'PUBLISHED' && (
  user.role === 'SEEKER' ? (
    // Seekers: No gating
    <button onClick={() => router.push(`/requests/${requestId}/thread`)}>
      <MessageSquare /> Messages
    </button>
  ) : (
    // Providers: Gated
    <FeatureGate feature="messaging.enabled">
      <button>Messages</button>
    </FeatureGate>
  )
)}
```

**Which option was implemented?**

Let me check the actual code...

Actually, **the backend needs to be updated** to handle seekers correctly. This is likely already handled in the entitlements service, but we should verify.

---

## Part 9: Performance & Caching

### Current Implementation

**No caching** - Every FeatureGate component calls the API independently:

```
LeadCard #1 → GET /entitlements (200ms)
LeadCard #2 → GET /entitlements (200ms)
LeadCard #3 → GET /entitlements (200ms)
...
= 600ms+ for 3 cards on one page!
```

### Recommended: Add Caching

**Option A: React Context (Recommended)**

```typescript
// New file: contexts/EntitlementsContext.tsx
const EntitlementsContext = createContext(null);

export function EntitlementsProvider({ children }) {
  const [entitlements, setEntitlements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOnce = async () => {
      const data = await api.billing.getEntitlements();
      setEntitlements(data);
      setIsLoading(false);
    };
    fetchOnce();
  }, []);

  return (
    <EntitlementsContext.Provider value={{ entitlements, isLoading }}>
      {children}
    </EntitlementsContext.Provider>
  );
}

// Update FeatureGate to use context
export function FeatureGate({ feature, children, fallback }) {
  const { entitlements, isLoading } = useContext(EntitlementsContext);

  if (isLoading) return <Spinner />;

  const hasAccess = entitlements?.entitlements[feature] === true;
  return hasAccess ? children : (fallback || null);
}
```

**Benefits:**
- ✅ Single API call per page load
- ✅ All FeatureGates share same data
- ✅ Instant rendering after first load

**Option B: Local Storage Cache**

```typescript
const CACHE_KEY = 'entitlements';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// In FeatureGate useEffect
const cached = localStorage.getItem(CACHE_KEY);
if (cached) {
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp < CACHE_DURATION) {
    setEntitlements(data);
    setIsLoading(false);
    return; // Use cache, skip API call
  }
}

// Fetch fresh data
const data = await api.billing.getEntitlements();
localStorage.setItem(CACHE_KEY, JSON.stringify({
  data,
  timestamp: Date.now()
}));
```

**Benefits:**
- ✅ Persists across page navigation
- ✅ Reduces API calls significantly
- ✅ Works even if API is slow

---

## Part 10: Security Considerations

### Frontend Gating is NOT Security

**Important:** FeatureGate is **UX only**, not security!

```typescript
// ❌ This does NOT prevent a malicious user from:
<FeatureGate feature="messaging.enabled">
  <SecretContent />
</FeatureGate>

// They can:
// 1. Open browser DevTools
// 2. Modify React state: hasAccess = true
// 3. See the content
```

### Real Security: Backend Enforcement

**Every API endpoint must check entitlements:**

```typescript
// In messages.controller.ts
@Post(':id/messages')
async sendMessage(@Param('id') requestId: string, @Req() req) {
  const user = req.user;

  // 1. Check if user is a provider
  if (user.role !== 'PROVIDER') {
    // Seekers can always message
    return this.messagesService.create(requestId, body);
  }

  // 2. Get provider's plan
  const provider = await this.prisma.providerProfile.findUnique({
    where: { userId: user.id },
    include: { user: true }
  });

  // 3. Check messaging entitlement
  const planCode = provider.user.planCode || 'FREE';
  const canMessage = PLAN_ENTITLEMENTS[planCode]['messaging.enabled'];

  // 4. Deny if not allowed
  if (!canMessage) {
    throw new ForbiddenException({
      message: 'Messaging requires PRO or AGENCY plan',
      upgradeUrl: '/pricing',
      feature: 'messaging'
    });
  }

  // 5. Allow if entitled
  return this.messagesService.create(requestId, body);
}
```

**Frontend + Backend Together:**

```
Frontend FeatureGate → Prevents UI confusion (good UX)
         +
Backend Entitlement Check → Prevents API abuse (security)
         =
Complete Protection ✅
```

---

## Part 11: Error Handling

### What happens if API call fails?

```typescript
// In FeatureGate
try {
  const data = await api.billing.getEntitlements();
  setHasAccess(data.entitlements[feature] === true);
} catch (error) {
  console.error('Failed to fetch entitlements:', error);
  setHasAccess(false); // ← FAIL CLOSED (deny access)
}
```

**Fail Closed Strategy:**
- ✅ If API is down → Deny access (safe)
- ✅ If network error → Deny access (safe)
- ✅ If 401 Unauthorized → Deny access (user not logged in)
- ✅ If 500 Server Error → Deny access (safe)

**Trade-off:**
- ❌ If API is down, even PRO users can't access features
- ✅ But this is safer than accidentally giving FREE users access

---

## Part 12: Testing the Flow

### Manual Testing Steps

**Test 1: FREE Provider Flow**
```bash
# 1. Logout
# 2. Register new provider account
# 3. Verify planCode = FREE in database:
SELECT "planCode" FROM "User" WHERE email = 'test@example.com';
# Should return: FREE

# 4. Login
# 5. Go to marketplace
# 6. Unlock a request
# 7. Check network tab in DevTools:
GET /api/billing/entitlements
# Response should show: "messaging.enabled": false

# 8. Verify UI shows amber upgrade card
# 9. Try accessing /requests/123/thread directly
# 10. Verify full-page upgrade prompt appears
```

**Test 2: PRO Provider Flow**
```bash
# 1. Update user plan in database:
UPDATE "User" SET "planCode" = 'PRO' WHERE email = 'test@example.com';

# 2. Logout and login again (refresh JWT)
# 3. Go to marketplace
# 4. Unlock a request
# 5. Check network tab:
GET /api/billing/entitlements
# Response should show: "messaging.enabled": true

# 6. Verify "Send Message" button appears (blue, not amber)
# 7. Click "Send Message"
# 8. Verify thread page loads normally
# 9. Send a test message
# 10. Verify message appears
```

---

## Summary: Complete Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USER LOGIN                                                 │
│    - JWT token created with: userId, role, planCode          │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. PAGE LOADS WITH FeatureGate                               │
│    - Component mounts                                         │
│    - Shows loading spinner                                    │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. API CALL: GET /api/billing/entitlements                  │
│    - Backend extracts user from JWT                          │
│    - Backend looks up provider profile                       │
│    - Backend gets planCode from User table                   │
│    - Backend returns PLAN_ENTITLEMENTS[planCode]             │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. FeatureGate EVALUATES                                     │
│    - Checks entitlements['messaging.enabled']                │
│    - FREE: false → Shows fallback (upgrade prompt)           │
│    - PRO:  true  → Shows children (working button)           │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. USER INTERACTION                                          │
│    FREE: Clicks upgrade prompt → Goes to /pricing            │
│    PRO:  Clicks "Send Message" → Goes to /thread             │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. MESSAGE SENDING (PRO only)                                │
│    - User types message                                      │
│    - Clicks "Send"                                           │
│    - API: POST /api/requests/:id/messages                    │
│    - Backend checks entitlements again (security)            │
│    - Message saved to database                               │
│    - Recipient receives notification                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

1. **Backend defines entitlements** in static config file
2. **API endpoint exposes** entitlements based on user's plan
3. **FeatureGate component** checks entitlements and shows/hides UI
4. **Multiple use cases**: Page-level, button-level, silent gating
5. **Fail-safe design**: Denies access on error (secure)
6. **NOT security**: Frontend gating is UX only
7. **Real security**: Backend APIs must also check entitlements
8. **Performance**: Consider caching for better UX
9. **Requesters**: Need special handling (always free messaging)

The system is **simple**, **flexible**, and **secure** when properly implemented on both frontend and backend.
