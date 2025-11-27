# Task: M0 Task 3 — Prisma Schema (Schema-First)

**Status:** 🎯 Ready to Start  
**Assigned to:** Backend Engineer  
**Tech Lead Review:** Required before migration  
**Priority:** Critical (blocks all backend work)

---

## Task Summary

Design and implement Prisma schema for VisaOnTrack v2 per spec Section 3 (Data Model). This is a **schema-first** requirement — schema must be designed BEFORE any database migrations.

**Principle:** Schema-first → Generate Prisma types → Backend uses types

---

## Prerequisites

✅ **COMPLETE:** OpenAPI v0.2 Specification (Task 2)  
✅ **COMPLETE:** Monorepo Structure (Task 1)  
✅ **READY:** Section 3 data model reference  
✅ **READY:** OpenAPI schemas for alignment

---

## Requirements

### 1. Create Prisma Schema File

**Location:** `/apps/api/prisma/schema.prisma`

**Template:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### 2. Define All Models (per Section 3)

#### **Core Models** (11 models)

1. **User**
   - Fields: `id, email, role, name, phone, locale, createdAt`
   - Role enum: `SEEKER | PROVIDER | ADMIN`

2. **ProviderProfile**
   - Fields: `id, userId (FK), businessName, description, location, languages[] (array), verifiedAt?`
   - Relation: `User` (one-to-one)

3. **ServicePackage**
   - Fields: `id, providerId (FK), title, description, priceTHB, deliverables[] (array), etaDays, isActive`
   - Relation: `ProviderProfile` (many-to-one)

4. **Request**
   - Fields: `id, seekerId (FK), title, description, visaType, budgetMin, budgetMax, location, status, createdAt`
   - Status enum: `DRAFT | OPEN | CLOSED | HIRED`
   - Relation: `User` (seeker)

5. **Message**
   - Fields: `id, requestId (FK), senderId (FK), body, createdAt`
   - Relations: `Request`, `User` (sender)

6. **Quote**
   - Fields: `id, requestId (FK), providerId (FK), items[] (JSON array), totalTHB, etaDays, terms, status, validUntil`
   - Status enum: `PENDING | ACCEPTED | DECLINED | EXPIRED`
   - Relations: `Request`, `ProviderProfile`

7. **Order**
   - Fields: `id, quoteId (FK), escrowStatus, status`
   - EscrowStatus enum: `REQUIRES_PAYMENT | HELD | RELEASED | REFUNDED`
   - Status enum: `ACTIVE | DELIVERED | COMPLETED | DISPUTED | CANCELLED`
   - Relation: `Quote`

8. **Milestone**
   - Fields: `id, orderId (FK), title, dueAt, status`
   - Status enum: `PENDING | DONE`
   - Relation: `Order`

9. **Review**
   - Fields: `id, orderId (FK), rating (1-5), tags[] (array), text, createdAt`
   - Relation: `Order`

10. **Attachment**
    - Fields: `id, ownerUserId (FK), requestId? (FK, nullable), orderId? (FK, nullable), key, mime, size`
    - Relations: `User` (owner), `Request?`, `Order?`

11. **Notification**
    - Fields: `id, userId (FK), type, payload (JSON), readAt?`
    - Relation: `User`

---

#### **Billing Models** (5 models)

1. **BillingCustomer**
   - Fields: `id, providerId (unique FK), stripeCustomerId (unique), createdAt`
   - Relation: `ProviderProfile` (one-to-one)

2. **Subscription**
   - Fields: `id, billingCustomerId (FK), stripeSubscriptionId (unique), planCode, status, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, createdAt, updatedAt`
   - PlanCode enum: `FREE | PRO | PRO_PLUS | ENTERPRISE`
   - Status enum: `INCOMPLETE | TRIALING | ACTIVE | PAST_DUE | CANCELED | UNPAID`
   - Relation: `BillingCustomer`

3. **Entitlement**
   - Fields: `id, providerId (FK), key (string), value (JSON), updatedAt`
   - Unique constraint: `(providerId, key)` per spec

4. **UsageCounter**
   - Fields: `id, providerId (FK), periodKey (YYYY-MM format), metric, used, limit, resetAt, updatedAt`
   - Index: `idx(providerId, metric, periodKey)` per spec

5. **Invoice**
   - Fields: `id, billingCustomerId (FK), stripeInvoiceId (unique), total, currency, paidAt?, hostedInvoiceUrl?, createdAt`
   - Relation: `BillingCustomer`

---

#### **Admin Models** (12 models)

1. **AdminUser**
   - Fields: `id, email, role, mfaEnabled, createdAt`
   - Role enum: `ADMIN | MODERATOR | FINANCE | SUPPORT`

2. **VerificationCase**
   - Fields: `id, providerId (FK), status, checklist (JSON), reviewerId (FK?), decidedAt?`
   - Status enum: `PENDING | APPROVED | CHANGES_REQUESTED | REJECTED`
   - Relations: `ProviderProfile`, `AdminUser?` (reviewer)

3. **DisputeCase**
   - Fields: `id, orderId (FK), status, resolution (JSON), handlerId (FK?), openedAt, closedAt?`
   - Status enum: `OPEN | RESOLVED | REFUNDED | ESCALATED`
   - Relations: `Order`, `AdminUser?` (handler)

4. **Payout**
   - Fields: `id, providerId (FK), amountTHB, stripePayoutId?, status, scheduledAt, paidAt?`
   - Status enum: `PENDING | PAID | FAILED`
   - Relation: `ProviderProfile`

5. **Refund**
   - Fields: `id, orderId (FK), amountTHB, reason, stripeRefundId?, status, createdAt`
   - Status enum: `PENDING | SUCCEEDED | FAILED`
   - Relation: `Order`

6. **FeatureFlag**
   - Fields: `key (primary key), enabled, audience (JSON), updatedAt`

7. **FeeSchedule**
   - Fields: `id, type, valuePct, valueFixedTHB, effectiveFrom`
   - Type enum: `PLATFORM_FEE | PAYOUT_FEE`

8. **Banner**
   - Fields: `id, title, message, type, activeFrom, activeTo`
   - Type enum: `INFO | WARN | CRITICAL`

9. **EmailTemplate**
   - Fields: `id, key, subject, html, updatedAt`

10. **AuditLog**
    - Fields: `id, actorUserId (FK?), actorRole, action, entityType, entityId, diff (JSON), ip, ua, createdAt`
    - Relation: `User?` (actor)

11. **InternalNote**
    - Fields: `id, entityType, entityId, authorId (FK), body, createdAt`
    - Relation: `User` (author)

12. **Report**
    - Fields: `id, entityType, entityId, reporterUserId (FK), reason, status, createdAt`
    - Status enum: `OPEN | ACTIONED | DISMISSED`
    - Relation: `User` (reporter)

---

### 3. Required Indexes

Per spec requirements:

- **UsageCounter:** `@@index([providerId, metric, periodKey])`
- **Unique constraints:**
  - `BillingCustomer.providerId` (unique)
  - `BillingCustomer.stripeCustomerId` (unique)
  - `Subscription.stripeSubscriptionId` (unique)
  - `Entitlement(providerId, key)` (unique composite)
  - `Invoice.stripeInvoiceId` (unique)

---

### 4. Enum Definitions

Define all enums per spec:

- `UserRole`: `SEEKER | PROVIDER | ADMIN`
- `RequestStatus`: `DRAFT | OPEN | CLOSED | HIRED`
- `QuoteStatus`: `PENDING | ACCEPTED | DECLINED | EXPIRED`
- `EscrowStatus`: `REQUIRES_PAYMENT | HELD | RELEASED | REFUNDED`
- `OrderStatus`: `ACTIVE | DELIVERED | COMPLETED | DISPUTED | CANCELLED`
- `MilestoneStatus`: `PENDING | DONE`
- `PlanCode`: `FREE | PRO | PRO_PLUS | ENTERPRISE`
- `SubscriptionStatus`: `INCOMPLETE | TRIALING | ACTIVE | PAST_DUE | CANCELED | UNPAID`
- `VerificationCaseStatus`: `PENDING | APPROVED | CHANGES_REQUESTED | REJECTED`
- `DisputeCaseStatus`: `OPEN | RESOLVED | REFUNDED | ESCALATED`
- `PayoutStatus`: `PENDING | PAID | FAILED`
- `RefundStatus`: `PENDING | SUCCEEDED | FAILED`
- `AdminRole`: `ADMIN | MODERATOR | FINANCE | SUPPORT`
- `FeeScheduleType`: `PLATFORM_FEE | PAYOUT_FEE`
- `BannerType`: `INFO | WARN | CRITICAL`
- `ReportStatus`: `OPEN | ACTIONED | DISMISSED`

---

### 5. Relations & Cascades

**Guidelines:**
- Use proper Prisma relation syntax (`@relation`)
- Set cascade behavior appropriately:
  - `onDelete: Cascade` for dependent child records
  - `onDelete: Restrict` for critical parent records
  - `onDelete: SetNull` for optional relations

**Key Relations:**
- `ProviderProfile.userId` → `User.id` (one-to-one)
- `Request.seekerId` → `User.id` (many-to-one, onDelete: Restrict)
- `Quote.requestId` → `Request.id` (many-to-one, onDelete: Cascade)
- `Order.quoteId` → `Quote.id` (one-to-one, onDelete: Restrict)
- `BillingCustomer.providerId` → `ProviderProfile.id` (one-to-one)

---

### 6. Field Types & Constraints

**Guidelines:**
- UUIDs: `String @id @default(uuid())`
- Timestamps: `DateTime @default(now())`
- Decimals: Use `Decimal` for `priceTHB`, `amountTHB`, `totalTHB`
- Arrays: Use `Json` for `languages[]`, `deliverables[]`, `tags[]`, `items[]`
- JSON: Use `Json` for `checklist`, `resolution`, `payload`, `diff`, `audience`
- Optionals: Use `?` for nullable fields
- String lengths: Add `@db.VarChar(XXX)` where appropriate

---

### 7. Generate Prisma Client

After schema creation:

```bash
cd apps/api
npx prisma generate
```

Verify generated types are correct.

---

## Reference Documents

1. **Spec Section 3:** `visaontrack-v2-spec.md` (lines 84-128)
2. **OpenAPI Schemas:** `packages/types/openapi.yaml` (for field validation)
3. **Milestone:** `MILESTONE_M0.md` Task 3

---

## Acceptance Criteria

- [ ] All 28 models defined (11 Core + 5 Billing + 12 Admin)
- [ ] All enums defined (15 enums)
- [ ] Required indexes added (`UsageCounter` composite index)
- [ ] Unique constraints defined (BillingCustomer, Subscription, Invoice, Entitlement)
- [ ] Relations defined with proper cascades
- [ ] Field types match spec (UUIDs, DateTime, Decimal, Json arrays)
- [ ] Schema validates: `npx prisma validate`
- [ ] Prisma client generates: `npx prisma generate`

---

## Tech Lead Review Checklist

Before marking complete, Tech Lead will verify:

- [ ] Schema matches Section 3 data model exactly
- [ ] No additional models beyond spec (scope discipline)
- [ ] All indexes from spec included
- [ ] Enum values match spec exactly
- [ ] Relations use proper cascade behavior
- [ ] Field types are appropriate (Decimal for money, Json for arrays)
- [ ] Schema is ready for migrations

---

## Notes

- **Schema-first principle:** Schema must be complete BEFORE any migration
- **Alignment with OpenAPI:** Ensure Prisma schema aligns with OpenAPI request/response schemas
- **Future migrations:** This schema will be the base for all future migrations
- **JSON fields:** Use Prisma's `Json` type for flexible structures (checklists, payloads, etc.)

---

## Next Steps After Completion

1. Tech Lead review and approval
2. Mark Task 3 complete in `MILESTONE_M0.md`
3. Proceed to Task 4: OpenAPI Client Generation (Frontend Engineer)

---

**Tech Lead:** Ready to review upon completion  
**Scope Guardian:** Will verify no scope creep (only Section 3 models)

