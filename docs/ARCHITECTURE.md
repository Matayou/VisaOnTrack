# SawadeePass v2 — Architecture Overview

This document provides a high-level overview of the SawadeePass v2 architecture. For the complete technical specification, see [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md).

---

## 🎯 Vision

**Two-sided marketplace connecting visa seekers with vetted service providers in Thailand.**

Request-centric platform where seekers post requests and providers reply with quotes.

---

## 🏗️ Architecture Principles

1. **Contract-First:** OpenAPI spec → Generate client → Frontend uses client
2. **Schema-First:** Prisma schema → Generate types → Backend uses types
3. **Scope Discipline:** All changes via 1-page RFC, strict adherence to spec
4. **Quality Gates:** DoR/DoD checklists, automated CI/CD

---

## 📦 Monorepo Structure

```
/visaontrack
  /apps
    /web      (Next.js frontend)
    /api      (NestJS backend)
  /packages
    /types    (OpenAPI spec, Zod models)
    /client   (generated API client)
    /ui       (shared UI components)
  /infra      (IaC, migrations)
  .github/workflows/ (CI/CD)
```

See [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md) Section 1 for details.

---

## 🔄 Data Flow

### Request Flow

1. **Seeker posts request** → `POST /requests`
2. **Providers see request** → `GET /requests`
3. **Provider submits quote** → `POST /requests/{id}/quotes`
4. **Seeker accepts quote** → `PATCH /quotes/{id}` (status=ACCEPTED)
5. **Payment** → `POST /checkout/intent` (Stripe Connect)
6. **Order created** → `Order` model (escrow=HELD)
7. **Delivery & review** → Milestones, delivery, review flow

### Provider Onboarding Flow

1. **Register** → `POST /auth/register`
2. **Business details** → `POST /providers`
3. **Services/packages** → `POST /packages`
4. **Credentials upload** → `POST /messages/attachments`
5. **Vetting** → Admin reviews → VerificationCase
6. **Approval** → `ProviderProfile.verifiedAt` set

See [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md) Section 6 for full workflows.

---

## 💾 Data Model

**Core Models (11):**
- User, ProviderProfile, ServicePackage, Request, Message, Quote, Order, Milestone, Review, Attachment, Notification

**Billing Models (5):**
- BillingCustomer, Subscription, Entitlement, UsageCounter, Invoice

**Admin Models (12):**
- AdminUser, VerificationCase, DisputeCase, Payout, Refund, FeatureFlag, FeeSchedule, Banner, EmailTemplate, AuditLog, InternalNote, Report

See [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md) Section 3 for full data model.

---

## 🔌 API Architecture

**REST API (OpenAPI 3.1)**
- Contract-first development
- JWT authentication (HttpOnly cookies)
- Role-based authorization (RBAC)
- Entitlement enforcement at middleware level

**Endpoints:**
- Auth, Providers, Requests, Messages, Quotes, Orders, Reviews, Billing, Admin

See [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md) Section 5 for full API specification.

---

## 💳 Payment Architecture

**Stripe Billing (Provider Plans)**
- Products: Pro, Pro+, Enterprise
- Subscriptions: Monthly + Annual (THB)
- Webhooks: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

**Stripe Connect (Orders)**
- PaymentIntents for deposits
- Funds held in escrow
- Release/refund per Order/Dispute

See [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md) Section 10 for payment details.

---

## 🚀 Deployment

**Frontend:** Vercel (preview + production)  
**Backend:** Fly.io / Railway (staging + production)  
**Database:** Neon / Supabase (PostgreSQL)  
**CI/CD:** GitHub Actions

See [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md) Section 14 for CI/CD pipeline.

---

## 🔒 Security Architecture

- **RBAC:** SEEKER/PROVIDER/ADMIN roles (+ sub-roles)
- **MFA:** Required for admin sensitive actions
- **Audit Logging:** All admin mutations logged
- **Data Privacy:** PDPA/GDPR compliance
- **Authentication:** JWT via HttpOnly cookies

See [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md) Section 11 for full security requirements.

---

## 📊 Observability

- **Error Tracking:** Sentry
- **Tracing:** OpenTelemetry
- **Logging:** Structured logs
- **Monitoring:** GitHub Actions status, webhook health

See [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md) Section 12 for observability details.

---

## 📚 Reference Documentation

- **Full Specification:** [`../sawadeepass-v2-spec.md`](../sawadeepass-v2-spec.md)
- **Contributing:** [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
- **Agent Team:** [`../AGENT_TEAM.md`](../AGENT_TEAM.md)
- **Scope Guardian:** [`../SCOPE_GUARDIAN.md`](../SCOPE_GUARDIAN.md)

---

**Last Updated:** M0 Completion  
**Status:** Foundation established, ready for M1 (Auth & Onboarding)

