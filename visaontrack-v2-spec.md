# VisaOnTrack v2 — Consolidated Product & Technical Spec (MVP)

## 0) Vision & Guardrails
- **Product:** Two-sided marketplace connecting **visa seekers** with vetted **service providers** in Thailand; request-centric (seekers post, providers reply with quotes).
- **Build principle:** **Contract-first (OpenAPI)** + **schema-first (Prisma/SQL)** with **strict scope control** (1-page RFC for changes), **DoR/DoD checklists**, and **automated CI**.
- **Monetization:** Provider **plans** (Free/Pro/Pro+/Enterprise) via **Stripe Billing**; seeker orders and provider payouts via **Stripe Connect**.

---

## 1) Architecture Overview

**Frontend**
- Next.js (App Router) + React + TypeScript
- Tailwind + shadcn/ui + Lucide; TanStack Query; Zod for runtime validation
- Auth UI (NextAuth optional), API client auto-generated from OpenAPI

**Backend**
- Node + TypeScript (NestJS), PostgreSQL (Prisma)
- REST API (OpenAPI 3.1); JWT (HttpOnly cookie); role-based authZ
- Storage: S3/R2 signed URLs; Email: Resend/SES; Realtime (poll → WS post-MVP)

**Ops/CI**
- FE on Vercel; BE on Fly/Railway; DB on Neon/Supabase
- GitHub Actions: typecheck, lint, tests, contract tests, build, preview deploys
- Observability: Sentry + OpenTelemetry; structured logs; env-scoped secrets

**Repo layout (mono, recommended)**
```
/visaontrack
  /apps
    /web   (Next.js)
    /api   (NestJS)
  /packages
    /types   (OpenAPI, Zod models)
    /client  (generated API client)
    /ui      (shared UI)
  infra/     (IaC, migrations)
  .github/workflows/
```

---

## 2) App Structure & Routes (with HTML mockups)

**Landing & Auth**
- `/` (landing) → [`docs/mockups/landing.html`](docs/mockups/landing.html)
- `/auth/login` → [`docs/mockups/login.html`](docs/mockups/login.html)
- `/auth/register` → [`docs/mockups/register.html`](docs/mockups/register.html)
- `/auth/register/simple` → [`docs/mockups/register-simple.html`](docs/mockups/register-simple.html)
- `/auth/forgot-password` → [`docs/mockups/forgot-password.html`](docs/mockups/forgot-password.html) (RFC-002)
- `/auth/reset-password?token=xxx` → [`docs/mockups/reset-password.html`](docs/mockups/reset-password.html) (RFC-002)

**Onboarding**
- `/onboarding/account-type` → [`docs/mockups/account-type.html`](docs/mockups/account-type.html)
- `/onboarding/seeker/welcome` → [`docs/mockups/onboarding-seeker.html`](docs/mockups/onboarding-seeker.html)
- `/onboarding/provider/welcome` → [`docs/mockups/onboarding-provider.html`](docs/mockups/onboarding-provider.html)
- `/onboarding/provider/business` → [`docs/mockups/business-details.html`](docs/mockups/business-details.html)
- `/onboarding/provider/services` → [`docs/mockups/services-pricing.html`](docs/mockups/services-pricing.html)
- `/onboarding/provider/credentials` → [`docs/mockups/credentials.html`](docs/mockups/credentials.html)
- `/onboarding/provider/credentials/complete` → [`docs/mockups/credentials-complete.html`](docs/mockups/credentials-complete.html)
- `/onboarding/provider/payouts` → [`docs/mockups/payment-setup.html`](docs/mockups/payment-setup.html)

**Core User Flows**
- `/requests` (list) → `visa-requests-final.html`
- `/requests/new` → `post-request-page.html`
- `/requests/[id]` (summary) · `/requests/[id]/thread` (messaging)
- `/providers` → `find-providers-page.html`
- `/providers/[slug]` → `provider-profile.html`

**Plans & Billing**
- `/plans` (pricing & upgrade)
- `/settings/billing` (plan card, invoices, usage meters)

**Orders**
- `/quotes/[id]` (review/accept/pay)
- `/checkout` (Connect PaymentIntent)
- `/orders` · `/orders/[id]` (milestones, delivery, dispute, review)

**Admin**
- `/admin` overview; queues and tools:
  - `/admin/providers`, `/admin/providers/{id}` (vetting/approve/suspend)
  - `/admin/requests`, `/admin/messages`, `/admin/reviews` (moderation)
  - `/admin/orders`, `/admin/disputes` (resolution)
  - `/admin/payouts`, `/admin/refunds` (finance ops)
  - `/admin/billing/subscriptions`, `/admin/billing/overrides`, `/admin/billing/reports`, `/admin/billing/audit`
  - `/admin/audit-log`, `/admin/config` (flags, fees, taxonomies), `/admin/content` (banners, email templates)
  - `/admin/users` (roles, MFA), `/admin/tools` (safe maintenance)

---

## 3) Data Model (schema-first)

**Core**
```
User(id, email, role[SEEKER|PROVIDER|ADMIN], name, phone, locale, createdAt)
ProviderProfile(id, userId FK->User, businessName, description, location, languages[], verifiedAt?)
ServicePackage(id, providerId, title, description, priceTHB, deliverables[], etaDays, isActive)
Request(id, seekerId, title, description, visaType, budgetMin, budgetMax, location, status[DRAFT|OPEN|CLOSED|HIRED], createdAt)
Message(id, requestId, senderId, body, createdAt)
Quote(id, requestId, providerId, items[], totalTHB, etaDays, terms, status[PENDING|ACCEPTED|DECLINED|EXPIRED], validUntil)
Order(id, quoteId, escrowStatus[REQUIRES_PAYMENT|HELD|RELEASED|REFUNDED], status[ACTIVE|DELIVERED|COMPLETED|DISPUTED|CANCELLED])
Milestone(id, orderId, title, dueAt, status[PENDING|DONE])
Review(id, orderId, rating 1..5, tags[], text, createdAt)
Attachment(id, ownerUserId, requestId?, orderId?, key, mime, size)
Notification(id, userId, type, payload JSON, readAt)
```

**Billing & Entitlements (add)**
```
enum PlanCode { FREE, PRO, PRO_PLUS, ENTERPRISE }
enum SubscriptionStatus { INCOMPLETE, TRIALING, ACTIVE, PAST_DUE, CANCELED, UNPAID }

BillingCustomer(id, providerId unique, stripeCustomerId unique, createdAt)
Subscription(id, billingCustomerId, stripeSubscriptionId unique, planCode, status,
             currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, createdAt, updatedAt)
Entitlement(id, providerId, key, value JSON, updatedAt)            // unique(providerId,key)
UsageCounter(id, providerId, periodKey 'YYYY-MM', metric, used, limit, resetAt, updatedAt) // idx(providerId,metric,periodKey)
Invoice(id, billingCustomerId, stripeInvoiceId unique, total, currency, paidAt?, hostedInvoiceUrl?, createdAt)
```

**Admin & Ops (add)**
```
AdminUser(id, email, role[ADMIN|MODERATOR|FINANCE|SUPPORT], mfaEnabled, createdAt)
VerificationCase(id, providerId, status[PENDING|APPROVED|CHANGES_REQUESTED|REJECTED], checklist JSON, reviewerId, decidedAt)
DisputeCase(id, orderId, status[OPEN|RESOLVED|REFUNDED|ESCALATED], resolution JSON, handlerId, openedAt, closedAt)
Payout(id, providerId, amountTHB, stripePayoutId?, status[PENDING|PAID|FAILED], scheduledAt, paidAt)
Refund(id, orderId, amountTHB, reason, stripeRefundId?, status[PENDING|SUCCEEDED|FAILED], createdAt)
FeatureFlag(key, enabled, audience JSON, updatedAt)
FeeSchedule(id, type[PLATFORM_FEE|PAYOUT_FEE], valuePct, valueFixedTHB, effectiveFrom)
Banner(id, title, message, type[INFO|WARN|CRITICAL], activeFrom, activeTo)
EmailTemplate(id, key, subject, html, updatedAt)
AuditLog(id, actorUserId, actorRole, action, entityType, entityId, diff JSON, ip, ua, createdAt)
InternalNote(id, entityType, entityId, authorId, body, createdAt)
Report(id, entityType, entityId, reporterUserId, reason, status[OPEN|ACTIONED|DISMISSED], createdAt)
```

---

## 4) Provider Plans & Entitlements

**Plan Matrix (v1)**

| Feature | Free | Pro | Pro+ | Enterprise |
|---|---:|---:|---:|---:|
| Monthly (THB) | 0 | 490 | 990 | Custom |
| Annual (THB) | – | 4,900 | 9,900 | Custom |
| Photos / Packages | 3 / 3 | 12 / 12 | 30 / 30 | 60+ / 60+ |
| Profile video | – | 1 | 3 | 5 |
| Docs in profile | 2 | 10 | 25 | 50 |
| Quotes / mo | 5 | 50 | **200*** | Custom |
| Attachment size | 2 MB | 25 MB | 100 MB | 250 MB |
| Visibility boost | 1.0× | **1.2×** | **1.4×** | Custom |
| Analytics | Basic | **Advanced** | **Export** | Custom |
| Support | Community | **Priority email** | **Priority + chat** | Manager |

\* “Unlimited” fair-use set at 200/mo (throttle beyond; Enterprise lifts).

**Entitlements (examples)**
```
photos.max=12, packages.max=12, attachments.maxSizeMB=25,
quotes.monthly.max=50, quotes.monthly.used, visibility.weight=1.2,
analytics.level='advanced'
```
- Enforcement at **API middleware**; UI gates show counters/upsell.

---

## 5) API (contract-first)

**New endpoints (tag: `billing`)**
- `POST /billing/checkout-session` → `{ url }`
- `GET  /billing/portal` → `{ url }`
- `GET  /billing/subscription` → `{ planCode, status, period dates, cancelAtPeriodEnd }`
- `GET  /billing/entitlements/me` → full entitlements + usage
- `POST /billing/webhook` (no auth; Stripe signature verification; idempotent)

**Existing endpoints (entitlement errors)**
- `POST /requests/{id}/quotes` → `403 EntitlementExceeded` / `429 Throttled`
- `POST /providers/{id}/packages` → `403 EntitlementExceeded`
- `POST /messages/attachments` → `413 PayloadTooLarge`, `403 AttchLimitExceeded`

**Core endpoints (excerpt)**
- Auth: `/auth/login`, `/users/me`
- Providers: `/providers` (search/create); `/providers/{id}` (get/patch)
- Packages: `/packages` (create)
- Requests: `/requests` (get/post), `/requests/{id}` (get/patch)
- Messages: `/requests/{id}/messages` (get/post)
- Quotes: `/requests/{id}/quotes` (post), `/quotes/{id}` (get/patch)
- Checkout (Connect): `/checkout/intent` (create PaymentIntent)
- Orders: `/orders` (get), `/orders/{id}` (get/patch)
- Reviews: `/orders/{id}/review` (post)

**Admin endpoints (excerpt)**
- `/admin/providers/*`, `/admin/verification-cases/*`
- `/admin/reports`, `/admin/disputes`, `/admin/payouts`, `/admin/refunds`
- `/admin/billing/*`, `/admin/audit-logs`, `/admin/config/*`, `/admin/content/*`, `/admin/users`

---

## 6) Workflows

**Provider vetting**
- Upload credentials → VerificationCase checklist → approve/suspend → badge + ranking eligibility.

**Seeker journey**
- Post request → receive provider quotes → accept quote → pay deposit (Connect) → Order active → milestones/delivery → review.

**Provider quotes & limits**
- Quote composer observes `quotes.monthly.max` and `used`; throttles with upsell when exceeded.

**Billing (plans)**
- `/plans` → Stripe Checkout → webhook → `Subscription ACTIVE` → entitlements applied instantly.
- `/settings/billing` → usage meters, portal link, invoices.

**Admin**
- Queues: providers pending, reports, disputes, payouts/refunds.
- Actions logged to AuditLog; sensitive actions require MFA + (optional) IP allowlist.

---

## 7) Discovery & Ranking
```
score = quality*wQ + activity*wA + planBoost*wP + recency*wR
planBoost from entitlements.visibility.weight (Free=1.0, Pro=1.2, Pro+=1.4)
```
- Mixed model keeps quality above pure pay-to-rank.
- “Why ranked” tooltip (optional), admin breakdown for audits.

---

## 8) Usage Counting & Quotas
- `UsageCounter` increments on quote submission (`metric="quotes.monthly"`, `periodKey="YYYY-MM"`).
- First of month (Asia/Bangkok) cron resets/rolls period.
- Over-limit: API returns structured error; UI blocks add/submit actions. Downgrade never deletes, only blocks new creations.

---

## 9) Files & Attachments
- Signed URLs; hard size caps per plan; MIME allowlist (pdf, jpg, png, webp, docx, xlsx).
- Virus scan queue; quarantine on fail; redactions for PII view modes.

---

## 10) Payments

**Stripe Billing (plans)**
- Products: `provider-plan-pro`, `provider-plan-pro-plus`, `provider-plan-enterprise`
- Prices: monthly + yearly (THB), trials, coupons, Stripe Tax
- Webhooks: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
- Dunning: smart retries + 7-day grace; auto-downgrade on non-payment

**Stripe Connect (orders)**
- Seekers pay deposits (PaymentIntents) → funds held → release/refund per Order/Dispute.
- Separate keys & webhooks from Billing.

---

## 11) Security & Compliance
- RBAC: SEEKER/PROVIDER/ADMIN (+ MODERATOR/FINANCE/SUPPORT sub-roles)
- MFA for admin; IP allowlist for payouts/refunds/role changes
- Row-level authorization (participants only); CSRF protection
- Audit every admin mutation; PDPA/GDPR: store Stripe IDs, not card data
- Data retention policy & backups; secure doc viewer (watermark, access logs)

---

## 12) Analytics & Observability
- Events: `posted_request`, `submitted_quote`, `accepted_quote`, `payment_succeeded`, `order_delivered`, `review_submitted`, `subscription_activated`, `plan_changed`, `downgrade_effective`
- Dashboards: conversion funnel, time-to-first-quote, quote acceptance, dispute rate, **MRR/ARR**, churn, plan mix, trial→paid
- Alerts: webhook failures, entitlement misapplies, counter desync

---

## 13) Testing Strategy
- **Unit:** services/hooks/utils
- **Integration:** API routes + DB
- **Contract:** Pact (FE consumer ↔ BE provider)
- **E2E (Playwright):**
  - Upgrade plan → entitlements live → quote gating works
  - Post request → receive quote → accept → pay → order active → deliver → review
  - Admin: vetting approve; dispute resolve & refund; moderation hide/restore
- **Security:** authZ tests, rate-limits, file enforcement
- **Load:** quote bursts; admin queues pagination

**Definitions**
- **DoR:** user story + wireframe/mock + API contract + error states + analytics
- **DoD:** code + unit/integration/E2E + a11y + telemetry + docs + preview URLs

---

## 14) CI/CD Pipeline (GitHub Actions)
1) Verify: `pnpm -w typecheck && lint && test`
2) Contracts: OpenAPI lint + Pact verify + client generation
3) Build: FE Vercel preview; BE Docker deploy to staging/preview
4) PR comment: preview links + test summary; Sentry DSNs in preview

---

## 15) Feature Flags & Rollout
- `plans_ui_enabled` (FE), `entitlements_enforced` (BE)
- Pilot with subset of providers; seed **Free** entitlements for all existing providers
- Backfill Stripe Customers lazily on first upgrade

---

## 16) Milestones (sequence)

**M0 – Contracts & Skeletons (2–3d)**
- OpenAPI v0.2, Prisma schema, generated client, repos + CI

**M1 – Auth & Onboarding (4–5d)**
- Login/Register, account type, provider business + services

**M2 – Requests & Messaging (5–6d)**
- Post request/list/thread; attachments (base caps)

**M3 – Quotes & Checkout (6–7d)**
- Quote composer; accept; Connect PaymentIntent; Order creation

**M4 – Orders & Reviews (4–5d)**
- Milestones, delivery, review flow

**M5 – Discovery & Profiles (3–4d)**
- Provider search, profile; ranking mix with planBoost

**M6 – Plans & Billing (5–6d)**
- `/plans`, `/settings/billing`, Billing endpoints & webhook, entitlements engine, counters, gating

**M7 – Admin (6–8d)**
- Vetting/moderation; payouts/refunds; disputes; billing dashboards; audit log

---

## 17) Acceptance Criteria (must pass)

- **Billing:** Completing Stripe Checkout sets `Subscription=ACTIVE`, `GET /billing/entitlements/me` reflects plan within seconds; Customer Portal changes propagate via webhook without manual steps.
- **Quotas:** Over-quota actions return structured errors; UI blocks and shows upgrade with live counters; downgrades block new creations if above caps (no deletions).
- **Orders:** Payment success → `escrow=HELD`, webhook idempotent; delivery → review; dispute → refund/decision recorded.
- **Admin:** Approve provider writes `VerificationCase` + `AuditLog`; refund succeeds via Stripe and updates Order/Refund; moderation hides content immediately and logs reason.
- **Security:** Role gates enforced; admin sensitive actions require MFA; audit entries for all admin mutations.

---

## 18) Runbooks & Env

**Env vars (billing)**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_PROPLUS_MONTHLY=price_...
STRIPE_PRICE_PROPLUS_YEARLY=price_...
STRIPE_PRICE_ENTERPRISE=price_...
APP_URL=https://app.visaontrack.com
API_URL=https://api.visaontrack.com
```

**Stripe test checklist**
- Create products/prices (THB), enable Stripe Tax, promo codes
- Configure webhooks (staging/prod); verify signatures; re-deliver on failure
- Trial flows, dunning emails, grace period behavior; cancel at period end

**Operational notes**
- Key rotation order: staging → prod; monitor webhook health
- Counter desync remediation: reconcile usage from events; idempotent processors

---

## 19) Change Control / Anti-Scope Creep
- All deltas via 1-page RFC (Problem → Proposal → Impact → Rollout)
- Any contract change → OpenAPI **minor** bump → regenerate client
- Weekly backlog grooming; feature flags for risky features

---

*(This spec consolidates all pages, models, APIs, workflows, Stripe Billing/Connect, admin ops, testing, CI/CD, security, analytics, rollout, and acceptance criteria for the MVP.)*
