# RFC-006: Subscription Plan Features & Consultation Gating

**Status:** 📝 Draft
**Created:** 2025-11-28
**Author:** Product Team
**Related:** RFC-005 (Consultation Offerings)

---

## Problem Statement

Consultations (RFC-005) need to be a premium feature, but the current system uses credits for unlocking requests. We need to:
1. Define clear plan tiers with feature differentiation
2. Gate consultations behind subscription plans
3. Create pricing & account management pages
4. Implement entitlement middleware
5. Maintain the existing credit system for lead unlocking

---

## Proposed Solution

### Business Model: Hybrid Monetization

**Credits (Pay-Per-Lead):**
- ฿100/credit
- 1 credit = Unlock 1 request
- Available to ALL plan tiers (including FREE)
- One-time purchase, no expiration

**Subscriptions (Premium Features):**
- Monthly/Annual billing via Stripe
- Unlock premium features (consultations, analytics, priority support)
- Usage limits per plan tier
- Upgrade/downgrade anytime

---

## Plan Tier Definitions

### FREE Plan (Current Users)
**Price:** ฿0/month

**Features:**
- ✅ Create provider profile
- ✅ Purchase credits (฿100/credit)
- ✅ Unlock requests (1 credit each)
- ✅ Send quotes (unlimited)
- ✅ Basic messaging
- ✅ Up to 3 service packages
- ✅ 2MB file uploads

**Limitations:**
- ❌ Cannot offer consultations
- ❌ No analytics dashboard
- ❌ Standard support only
- ❌ Lower search ranking

**Use Case:** Trying out the platform, small providers

---

### PRO Plan (Individual Experts)
**Price:** ฿1,490/month or ฿14,900/year (save 17%)

**Everything in FREE, plus:**
- ✅ **Offer FREE consultations** (unlimited)
- ✅ **Offer PAID consultations** (unlimited)
- ✅ Platform keeps 15% of consultation fees
- ✅ 10 free credits/month (renews monthly)
- ✅ Up to 12 service packages
- ✅ 25MB file uploads
- ✅ Basic analytics dashboard
- ✅ Priority search ranking (2x boost)
- ✅ Email support (24h response)

**Consultation Revenue:**
- Provider sets price: ฿500-฿10,000
- Platform fee: 15%
- Provider keeps: 85%
- Example: ฿2,500 consultation → Provider gets ฿2,125

**Use Case:** Individual visa experts, consultants, small agencies

---

### AGENCY Plan (Agencies & High-Volume Providers)
**Price:** ฿4,990/month or ฿49,900/year (save 17%)

**Everything in PRO, plus:**
- ✅ 30 free credits/month (renews monthly)
- ✅ Reduced platform fee: **10%** on consultations
- ✅ Unlimited service packages
- ✅ 100MB file uploads
- ✅ Advanced analytics + export
- ✅ Team collaboration (up to 5 users)
- ✅ White-label consultation links
- ✅ Priority support (4h response)
- ✅ Highest search ranking (5x boost)

**Consultation Revenue:**
- Platform fee: 10% (vs 15% on PRO)
- Provider keeps: 90%
- Example: ฿2,500 consultation → Provider gets ฿2,250

**Use Case:** Visa agencies, law firms, educational institutions

---

## Feature Comparison Matrix

| Feature | FREE | PRO | AGENCY |
|---------|------|-----|--------|
| **Core Features** |
| Provider profile | ✅ | ✅ | ✅ |
| Send quotes | ✅ | ✅ | ✅ |
| Messaging | ✅ | ✅ | ✅ |
| **Consultations** |
| Offer FREE consultations | ❌ | ✅ | ✅ |
| Offer PAID consultations | ❌ | ✅ | ✅ |
| Platform fee | - | 15% | 10% |
| **Credits & Unlocking** |
| Purchase credits | ✅ | ✅ | ✅ |
| Credit price | ฿100 | ฿100 | ฿100 |
| Monthly free credits | 0 | 10 | 30 |
| **Content Limits** |
| Service packages | 3 | 12 | Unlimited |
| File upload size | 2MB | 25MB | 100MB |
| **Visibility** |
| Search ranking boost | 1x | 2x | 5x |
| **Analytics** |
| Basic analytics | ❌ | ✅ | ✅ |
| Advanced analytics | ❌ | ❌ | ✅ |
| Data export | ❌ | ❌ | ✅ |
| **Support** |
| Support tier | Standard | Priority (24h) | Premium (4h) |
| **Collaboration** |
| Team members | 1 | 1 | 5 |

---

## Technical Implementation

### 1. Database Schema (Already Exists ✅)

```prisma
// schema.prisma (NO CHANGES NEEDED)

enum PlanCode {
  FREE
  PRO
  AGENCY
}

model Subscription {
  id                   String             @id @default(uuid())
  billingCustomerId    String
  stripeSubscriptionId String             @unique
  planCode             PlanCode
  status               SubscriptionStatus @default(INCOMPLETE)
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean            @default(false)
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  billingCustomer BillingCustomer @relation(...)
  // ... existing relations
}
```

### 2. Entitlement Configuration

Create `/apps/api/src/billing/plan-entitlements.ts`:

```typescript
export const PLAN_ENTITLEMENTS = {
  FREE: {
    // Consultations
    'consultations.canOffer': false,
    'consultations.platformFee': 0,

    // Credits
    'credits.monthlyFree': 0,

    // Content
    'packages.max': 3,
    'fileUpload.maxSizeMB': 2,

    // Visibility
    'search.rankingBoost': 1,

    // Features
    'analytics.enabled': false,
    'analytics.advanced': false,
    'analytics.export': false,
    'support.tier': 'standard',
    'team.maxMembers': 1,
  },

  PRO: {
    // Consultations
    'consultations.canOffer': true,
    'consultations.platformFee': 0.15, // 15%

    // Credits
    'credits.monthlyFree': 10,

    // Content
    'packages.max': 12,
    'fileUpload.maxSizeMB': 25,

    // Visibility
    'search.rankingBoost': 2,

    // Features
    'analytics.enabled': true,
    'analytics.advanced': false,
    'analytics.export': false,
    'support.tier': 'priority',
    'team.maxMembers': 1,
  },

  AGENCY: {
    // Consultations
    'consultations.canOffer': true,
    'consultations.platformFee': 0.10, // 10%

    // Credits
    'credits.monthlyFree': 30,

    // Content
    'packages.max': 999,
    'fileUpload.maxSizeMB': 100,

    // Visibility
    'search.rankingBoost': 5,

    // Features
    'analytics.enabled': true,
    'analytics.advanced': true,
    'analytics.export': true,
    'support.tier': 'premium',
    'team.maxMembers': 5,
  },
} as const;
```

### 3. Entitlement Service

Create `/apps/api/src/billing/entitlements.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { PlanCode } from '@prisma/client';
import { PLAN_ENTITLEMENTS } from './plan-entitlements';

@Injectable()
export class EntitlementsService {
  constructor(private prisma: PrismaService) {}

  async getUserPlan(userId: string): Promise<PlanCode> {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        billingCustomer: {
          include: {
            subscriptions: {
              where: {
                status: 'ACTIVE',
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!provider?.billingCustomer?.subscriptions[0]) {
      return PlanCode.FREE;
    }

    return provider.billingCustomer.subscriptions[0].planCode;
  }

  async checkEntitlement(
    userId: string,
    entitlement: string,
  ): Promise<boolean | number | string> {
    const plan = await this.getUserPlan(userId);
    const value = PLAN_ENTITLEMENTS[plan][entitlement];
    return value ?? false;
  }

  async requireEntitlement(
    userId: string,
    entitlement: string,
  ): Promise<void> {
    const hasAccess = await this.checkEntitlement(userId, entitlement);
    if (!hasAccess) {
      const plan = await this.getUserPlan(userId);
      throw new ForbiddenException(
        `This feature requires a higher plan. Current plan: ${plan}. ` +
        `Upgrade to access ${entitlement}.`,
      );
    }
  }
}
```

### 4. Update Consultation Service

Update `/apps/api/src/consultations/consultations.service.ts`:

```typescript
import { EntitlementsService } from '../billing/entitlements.service';

@Injectable()
export class ConsultationsService {
  constructor(
    private prisma: PrismaService,
    private entitlements: EntitlementsService, // ADD THIS
  ) {}

  async offerConsultation(
    requestId: string,
    providerId: string,
    dto: OfferConsultationDto,
  ) {
    // CHECK ENTITLEMENT BEFORE ALLOWING CONSULTATION OFFER
    await this.entitlements.requireEntitlement(
      providerId,
      'consultations.canOffer',
    );

    // ... rest of existing logic

    // Get platform fee from plan
    const platformFee = await this.entitlements.checkEntitlement(
      providerId,
      'consultations.platformFee',
    );

    // Store platformFee if needed for later revenue split
    // ...
  }
}
```

### 5. Monthly Credit Allocation (Cron Job)

Create `/apps/api/src/billing/credit-allocator.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../common/services/prisma.service';
import { PLAN_ENTITLEMENTS } from './plan-entitlements';

@Injectable()
export class CreditAllocatorService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async allocateMonthlyCredits() {
    console.log('[CreditAllocator] Running monthly credit allocation...');

    const activeSubscriptions = await this.prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        planCode: { in: ['PRO', 'AGENCY'] }, // Only PRO+ get free credits
      },
      include: {
        billingCustomer: {
          include: { providerProfile: true },
        },
      },
    });

    for (const sub of activeSubscriptions) {
      const freeCredits = PLAN_ENTITLEMENTS[sub.planCode]['credits.monthlyFree'];

      if (freeCredits > 0) {
        await this.prisma.creditTransaction.create({
          data: {
            providerId: sub.billingCustomer.providerProfile.id,
            type: 'GRANT',
            amount: freeCredits,
            balanceAfter: 0, // Calculate actual balance
            description: `Monthly credit allocation: ${sub.planCode} plan`,
          },
        });
      }
    }

    console.log(`[CreditAllocator] Allocated credits to ${activeSubscriptions.length} providers`);
  }
}
```

---

## Frontend Implementation

### 1. Pricing Page (`/pricing`)

Create `/apps/web/app/pricing/page.tsx`:

```tsx
export default function PricingPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1>Choose Your Plan</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FREE Plan Card */}
          <PlanCard
            name="FREE"
            price={0}
            features={[
              'Create provider profile',
              'Purchase credits (฿100 each)',
              'Send unlimited quotes',
              'Up to 3 service packages',
              '2MB file uploads',
            ]}
            limitations={[
              'No consultation offerings',
              'No analytics',
              'Standard support',
            ]}
          />

          {/* PRO Plan Card - HIGHLIGHTED */}
          <PlanCard
            name="PRO"
            price={1490}
            highlighted
            features={[
              'Offer FREE & PAID consultations',
              '10 free credits/month',
              'Up to 12 service packages',
              '25MB file uploads',
              'Analytics dashboard',
              'Priority support',
              '2x search ranking',
            ]}
            badge="Most Popular"
          />

          {/* AGENCY Plan Card */}
          <PlanCard
            name="AGENCY"
            price={4990}
            features={[
              'Everything in PRO',
              '30 free credits/month',
              'Unlimited packages',
              '100MB file uploads',
              'Advanced analytics',
              'Team collaboration (5 users)',
              '5x search ranking',
              'Premium support (4h)',
              'Lower platform fee (10%)',
            ]}
          />
        </div>
      </div>
    </div>
  );
}
```

### 2. Account Settings Page (`/account/billing`)

Create `/apps/web/app/account/billing/page.tsx`:

```tsx
export default function BillingPage() {
  const { subscription } = useSubscription();

  return (
    <div>
      <h1>Billing & Subscription</h1>

      {/* Current Plan Card */}
      <div className="card">
        <h2>Current Plan: {subscription?.planCode || 'FREE'}</h2>
        <p>Status: {subscription?.status}</p>

        {subscription && (
          <>
            <p>Next billing: {subscription.currentPeriodEnd}</p>
            <button onClick={handleManageSubscription}>
              Manage Subscription
            </button>
          </>
        )}

        {!subscription && (
          <button onClick={() => router.push('/pricing')}>
            Upgrade to PRO
          </button>
        )}
      </div>

      {/* Usage Stats */}
      <UsageStatsCard />

      {/* Credit Balance */}
      <CreditBalanceCard />

      {/* Invoice History */}
      <InvoiceHistoryTable />
    </div>
  );
}
```

### 3. Feature Gate Component

Create `/apps/web/components/FeatureGate.tsx`:

```tsx
export function FeatureGate({
  feature,
  children,
  fallback,
}: {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasAccess, currentPlan } = useEntitlement(feature);

  if (!hasAccess) {
    return fallback || (
      <UpgradePrompt
        feature={feature}
        currentPlan={currentPlan}
      />
    );
  }

  return <>{children}</>;
}

// Usage:
<FeatureGate feature="consultations.canOffer">
  <OfferConsultationButton />
</FeatureGate>
```

### 4. Update Provider Dashboard

Update `/apps/web/app/providers/dashboard/page.tsx`:

```tsx
// Wrap consultation button in feature gate
<FeatureGate
  feature="consultations.canOffer"
  fallback={
    <UpgradeBanner
      message="Upgrade to PRO to offer consultations"
      cta="View Plans"
    />
  }
>
  <button onClick={() => setShowOfferModal(true)}>
    Offer Consultation
  </button>
</FeatureGate>
```

---

## API Endpoints (Mostly Exist ✅)

### Billing Endpoints (Already Implemented)
- `GET /billing/subscription` - Get current subscription
- `POST /billing/checkout` - Create Stripe checkout session
- `POST /billing/portal` - Create customer portal session
- `GET /billing/entitlements` - Get plan entitlements

### New Endpoint Needed
- `GET /billing/usage` - Get current usage metrics

---

## Migration Plan

### Phase 1: Backend (2-3 hours)
1. ✅ Database schema (already exists)
2. ⏳ Create `plan-entitlements.ts` config
3. ⏳ Create `EntitlementsService`
4. ⏳ Update `ConsultationsService` with entitlement checks
5. ⏳ Create `CreditAllocatorService` for monthly credits
6. ⏳ Add tests

### Phase 2: Frontend - Pricing Page (2-3 hours)
1. ⏳ Create `/pricing` page
2. ⏳ Create `PlanCard` component
3. ⏳ Integrate Stripe checkout
4. ⏳ Add comparison matrix
5. ⏳ Mobile responsive design

### Phase 3: Frontend - Account Settings (2-3 hours)
1. ⏳ Create `/account/billing` page
2. ⏳ Create `FeatureGate` component
3. ⏳ Create `UpgradePrompt` component
4. ⏳ Add usage stats display
5. ⏳ Add invoice history

### Phase 4: Feature Gating (1-2 hours)
1. ⏳ Wrap consultation features in `FeatureGate`
2. ⏳ Add upgrade prompts throughout app
3. ⏳ Update provider onboarding to show plan benefits

### Phase 5: Testing & Polish (2-3 hours)
1. ⏳ Test upgrade/downgrade flows
2. ⏳ Test entitlement checks
3. ⏳ Test monthly credit allocation
4. ⏳ Test Stripe webhooks
5. ⏳ Add analytics events

**Total Estimated Time:** 10-14 hours

---

## Success Metrics

**Conversion Goals:**
- 20% of FREE providers upgrade to PRO within 30 days
- 5% of PRO providers upgrade to AGENCY within 90 days

**Revenue Goals:**
- Average consultation value: ฿2,000
- PRO providers average 5 consultations/month
- AGENCY providers average 20 consultations/month

**Retention Goals:**
- 90% monthly retention for PRO subscribers
- 95% monthly retention for AGENCY subscribers

---

## Risks & Mitigations

**Risk 1:** Existing FREE users churn when consultations gated
- **Mitigation:** Grandfather existing users with 30-day PRO trial
- **Mitigation:** Clear communication about new features

**Risk 2:** Consultation platform fee seems high (15%)
- **Mitigation:** Lower than competitors (Calendly: 20%, SuperHire: 25%)
- **Mitigation:** Clear value proposition (leads + consultations)

**Risk 3:** Complex pricing confuses users
- **Mitigation:** Simple 3-tier structure
- **Mitigation:** Clear feature comparison matrix
- **Mitigation:** "Most Popular" badge on PRO plan

---

## Open Questions

1. Should FREE users see consultation offerings but can't offer them?
   - **Recommendation:** Yes, with upgrade CTA

2. What happens to existing consultations if provider downgrades?
   - **Recommendation:** Honor existing bookings, block new offers

3. Should annual plans get additional discount?
   - **Recommendation:** Yes, 17% (2 months free)

4. Should we allow monthly free credits to roll over?
   - **Recommendation:** No, "use it or lose it" model

---

## Next Steps

1. **Product Decision:** Approve plan tiers and pricing
2. **Design:** Create pricing page mockups
3. **Backend:** Implement entitlement service
4. **Frontend:** Build pricing & billing pages
5. **Marketing:** Prepare launch communication

---

**Status:** 📝 Awaiting approval

**Estimated Effort:** 10-14 hours implementation + 2-3 days testing

**Dependencies:** RFC-005 (Consultation Offerings)

**Target Launch:** Q1 2025
