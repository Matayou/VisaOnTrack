# Backend Fix: Seeker Entitlements Access

**Issue:** Backend endpoint blocks seekers from accessing entitlements
**Impact:** 🔴 CRITICAL - FeatureGate fails for all seekers
**Status:** Needs immediate fix

---

## The Problem

### Backend Endpoint
**File:** `apps/api/src/billing/billing.controller.ts`

```typescript
@Get('entitlements/me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PROVIDER)  // ← BLOCKS SEEKERS!
async getEntitlements(@Request() req): Promise<EntitlementsResponse> {
  const userId = (req as any).user?.userId;
  return this.entitlements.getEntitlementsWithUsage(userId);
}
```

**Problem:**
- `@Roles(UserRole.PROVIDER)` guard returns 403 Forbidden for seekers
- Seekers can't call the entitlements API at all!

### Entitlements Service
**File:** `apps/api/src/billing/entitlements.service.ts`

```typescript
async getUserPlan(userId: string): Promise<PlanCode> {
  const provider = await this.prisma.providerProfile.findUnique({
    where: { userId }
  });

  if (!provider) {
    throw new NotFoundException('Provider profile not found');
  }
  // ...
}
```

**Problem:**
- Only looks for `providerProfile`
- Seekers don't have provider profiles
- Throws `NotFoundException` for seekers

---

## The Fix

### Step 1: Remove Role Guard from Controller

**File:** `apps/api/src/billing/billing.controller.ts`

```typescript
@Get('entitlements/me')
@UseGuards(JwtAuthGuard)  // ← Remove RolesGuard
// @Roles(UserRole.PROVIDER) ← Remove this
async getEntitlements(@Request() req): Promise<EntitlementsResponse> {
  const userId = (req as any).user?.userId;
  const userRole = (req as any).user?.role;  // ← Add role
  return this.entitlements.getEntitlementsWithUsage(userId, userRole);
}
```

### Step 2: Update Service to Handle Both Roles

**File:** `apps/api/src/billing/entitlements.service.ts`

Add this method before `getUserPlan`:

```typescript
/**
 * Get entitlements with usage for ANY user (provider or seeker)
 */
async getEntitlementsWithUsage(
  userId: string,
  userRole?: string
): Promise<EntitlementsResponse> {
  // SEEKERS: Return seeker-specific entitlements
  if (userRole === 'SEEKER') {
    return {
      planCode: 'FREE' as PlanCode,  // Seekers don't have plans
      planName: 'Seeker',
      entitlements: {
        // Seekers get messaging for free
        'messaging.enabled': true,

        // Seekers can't offer consultations
        'consultations.canOffer': false,
        'consultations.platformFee': 0,

        // No credit/package limits for seekers
        'credits.monthlyFree': 0,
        'packages.max': 0,

        // No provider features
        'analytics.enabled': false,
        'analytics.advanced': false,
        'team.enabled': false,
        'team.maxMembers': 0,

        // File uploads (reasonable limits)
        'fileUpload.maxSizeMB': 10,

        // No search ranking (not applicable)
        'search.rankingBoost': 0,
      },
      usage: {
        creditsRemaining: 0,
        creditsUsedThisMonth: 0,
        monthlyFreeCredits: 0,
        packagesCreated: 0,
        packagesMax: 0,
        consultationsOffered: 0,
      },
    };
  }

  // PROVIDERS: Existing logic
  const planCode = await this.getUserPlan(userId);
  const entitlements = PLAN_ENTITLEMENTS[planCode];
  const planName = PLAN_METADATA[planCode].name;

  const provider = await this.prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      credits: true,
      servicePackages: { select: { id: true } },
      consultations: { select: { id: true } },
    },
  });

  if (!provider) {
    throw new NotFoundException('Provider profile not found');
  }

  // Calculate credits used this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const creditsUsedThisMonth = await this.prisma.creditTransaction.count({
    where: {
      providerId: provider.id,
      type: 'SPEND',
      createdAt: { gte: monthStart },
    },
  });

  const monthlyFreeCredits = entitlements['credits.monthlyFree'] as number;

  return {
    planCode,
    planName,
    entitlements: entitlements as Record<string, EntitlementValue>,
    usage: {
      creditsRemaining: provider.credits,
      creditsUsedThisMonth,
      monthlyFreeCredits,
      packagesCreated: provider.servicePackages.length,
      packagesMax: entitlements['packages.max'] as number,
      consultationsOffered: provider.consultations.length,
    },
  };
}
```

---

## Implementation Steps

### 1. Update Controller (5 min)

```bash
# Open file
apps/api/src/billing/billing.controller.ts

# Line 18: Remove @Roles decorator
# Line 17: Remove RolesGuard from @UseGuards
# Line 20-21: Add userRole extraction and pass to service
```

### 2. Update Service (15 min)

```bash
# Open file
apps/api/src/billing/entitlements.service.ts

# Add role check at start of getEntitlementsWithUsage()
# Return seeker entitlements if role === 'SEEKER'
# Keep existing provider logic for providers
```

### 3. Test (10 min)

```bash
# Test 1: Call as seeker
curl -X GET http://localhost:3001/api/billing/entitlements/me \
  -H "Authorization: Bearer <seeker-jwt-token>"

# Expected:
{
  "planCode": "FREE",
  "planName": "Seeker",
  "entitlements": {
    "messaging.enabled": true  // ← Key!
  }
}

# Test 2: Call as FREE provider
curl -X GET http://localhost:3001/api/billing/entitlements/me \
  -H "Authorization: Bearer <provider-jwt-token>"

# Expected:
{
  "planCode": "FREE",
  "planName": "Free",
  "entitlements": {
    "messaging.enabled": false  // ← Key!
  }
}
```

---

## Alternative: Frontend Role Check (Quick Fix)

If you can't modify backend right now, fix it in frontend:

**File:** `apps/web/components/FeatureGate.tsx`

```typescript
export function FeatureGate({ feature, children, fallback }) {
  const [user, setUser] = useState(null);
  const [entitlements, setEntitlements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user first
        const currentUser = await api.users.getCurrentUser();
        setUser(currentUser);

        // SEEKERS: Always grant messaging access
        if (currentUser.role === 'SEEKER') {
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        // PROVIDERS: Check entitlements
        const data = await api.billing.getEntitlements();
        setEntitlements(data);
        setHasAccess(data.entitlements[feature] === true);
      } catch (error) {
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [feature]);

  // ...rest of component
}
```

**Problem with this approach:**
- Extra API call (getCurrentUser)
- Hardcoded logic in frontend
- Won't work for other features
- Not scalable

**Better: Fix the backend** ✅

---

## Summary

**Current State:**
- ❌ Backend blocks seekers from entitlements API
- ❌ FeatureGate fails for seekers (403 error)
- ❌ Seekers can't use messaging (even though frontend fixed)

**After Fix:**
- ✅ Seekers can call `/billing/entitlements/me`
- ✅ Returns `messaging.enabled: true` for seekers
- ✅ FeatureGate works correctly for both roles
- ✅ Messaging works for seekers (always free)
- ✅ Messaging gated for FREE providers

**Time:** ~30 minutes to implement and test

---

**Next Step:** Implement the backend fix or use frontend workaround?
