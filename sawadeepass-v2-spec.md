# SawadeePass v2 — Consolidated Product & Technical Spec (MVP)

## 0) Vision & Guardrails
- **Product:** Two-sided marketplace connecting **visa seekers** with vetted **service providers** in Thailand; request-centric (seekers post, providers reply with proposals).
- **Model:** **Lead Gen + SaaS**. Providers pay via **Subscription/Credits** to unlock leads and use tools. **No escrow**. Payments happen directly between users.
- **Build principle:** **Contract-first (OpenAPI)** + **schema-first (Prisma/SQL)** with **strict scope control** (1-page RFC for changes), **DoR/DoD checklists**, and **automated CI**.
- **Monetization:** Provider **subscriptions** (SaaS tools + credit quota) and **credit packs** (unlock leads) via **Stripe Billing**.

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
/sawadeepass
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

## 2) App Structure & Routes

**Landing & Intake**
- `/` (landing)
- `/get-started` (seeker intake wizard: needs, urgency, budget)

**Auth**
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password?token=xxx`

**Onboarding**
- `/onboarding/account-type` (if not pre-selected)
- `/onboarding/provider/basics` (business type, location)
- `/onboarding/provider/verification` (document upload)

**Core User Flows**
- `/dashboard` (role-specific view)
- `/requests` (marketplace list - anonymized for providers)
- `/requests/new` (seeker post - prefilled from intake)
- `/requests/[id]` (thread/proposal view)
- `/providers/[slug]` (public profile)

**SaaS Tools**
- `/cases` (provider case management)
- `/cases/[id]` (shared timeline, vault, chat)

**Billing (Providers)**
- `/billing/plans` (subscriptions)
- `/billing/credits` (top-up)
- `/settings/billing` (invoices, usage)

**Admin**
- `/admin` (overview)
- `/admin/vetting` (badge approval)
- `/admin/quality` (intake/spam moderation)
- `/admin/users` (suspensions)

---

## 3) Data Model (schema-first)

**Core**
```
User(id, email, role[SEEKER|PROVIDER|ADMIN], name, phone, locale, createdAt)
ProviderProfile(id, userId, businessType[AGENT|SCHOOL|LAW], verifiedAt?, credits int, subscriptionStatus)
Request(id, seekerId, title, visaType, budget, status[DRAFT|OPEN|CLOSED], intakeData JSON, createdAt)
Proposal(id, requestId, providerId, totalTHB, timeline, status[PENDING|ACCEPTED|DECLINED], terms)
Case(id, proposalId, status[ACTIVE|COMPLETED|DISPUTED], paymentStatus[UNPAID|PARTIAL|PAID])
Milestone(id, caseId, title, dueAt, status[PENDING|DONE])
Review(id, caseId, rating 1..5, text, createdAt)
```

**Billing & Credits**
```
CreditTransaction(id, providerId, amount, type[PURCHASE|SPEND|REFUND], reason, createdAt)
Subscription(id, providerId, planCode, status, currentPeriodEnd)
Invoice(id, providerId, amount, status, url)
```

**Trust & Ops**
```
VerificationCase(id, providerId, documents[], status[PENDING|APPROVED|REJECTED], reviewerId)
AuditLog(id, actorId, action, entityId, metadata JSON)
Report(id, targetId, reporterId, reason)
```

---

## 4) Provider Monetization (Lead + SaaS)

**Credit System**
- **Unlock Lead:** Cost = 1 Credit (approx 500 THB value).
- **Refunds:** Auto-refund credit if seeker doesn't read proposal within 48h.

**Subscription Tiers**
| Feature | Free | Pro (990 THB/mo) | Agency (2990 THB/mo) |
|---|---|---|---|
| Included Credits | 0 | 3 / mo | 10 / mo |
| Credit Discount | 0% | 10% off | 20% off |
| Profile Badge | Basic | **Featured** | **Top Rated** |
| Case Tools | Limit 1 active | **Unlimited** | **Unlimited + Team** |
| Support | Email | **Priority** | **Dedicated** |

---

## 5) API (Contract-First)

**Credit Endpoints**
- `GET /credits/balance`
- `POST /credits/purchase` (Stripe Checkout)
- `POST /requests/{id}/unlock` (Spend credit)

**Core Endpoints**
- `/auth/*`, `/users/me`
- `/requests` (GET list, POST create)
- `/proposals` (POST create, GET list)
- `/cases` (milestone/vault management)

**Admin Endpoints**
- `/admin/vetting/{id}/approve`
- `/admin/quality/intake`

---

## 6) Workflows

**Seeker Intake**
- `/get-started` -> Intake Token -> Register -> Auto-Draft -> Publish (Email Verified).

**Provider Verification**
- Signup -> Upload Docs (DBD/License) -> Admin Review -> Badge Granted -> Leads Unlocked.

**Lead Unlock**
- Provider views anonymized lead -> Clicks "Unlock" -> Credit Deducted -> Contact Details Revealed -> Proposal Sent.

**Fulfillment (Direct Payment)**
- Seeker accepts proposal -> Off-platform payment -> Seeker clicks "Mark Paid" -> SaaS Tools Active (Vault/Milestones).

---

## 7) Trust & Safety

- **Verification:** Strict document checks (DBD, ID). No badge = No quotes.
- **Reviews:** Tied to "Case Complete" status. No fake reviews.
- **Disputes:** Admin mediates but cannot refund. Penalty = Suspension/Ban.
- **Safe Payment Guide:** In-chat warnings about 100% upfront requests.

---

## 8) Analytics

- **Funnel:** Visitor -> Intake -> Registered -> Published.
- **Monetization:** Credit Utilization Rate, ARPU, Churn.
- **Liquidity:** % Requests with >0 Proposals, Time-to-Proposal.

---

## 9) Rollout Strategy

**Phase 1: Supply (2 Weeks)**
- Provider onboarding & verification only.
- Seed "Free Credits" to early adopters.

**Phase 2: Demand (2 Weeks)**
- Launch `/get-started` intake.
- Marketing campaigns (SEO/Social).

**Phase 3: Marketplace (Live)**
- Enable "Unlock" logic.
- Turn on Credit purchasing.

---

## 10) Change Control
- Spec is Truth.
- Changes via RFC.
- OpenAPI contract must stay synced.
