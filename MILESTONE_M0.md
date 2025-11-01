# M0 — Contracts & Skeletons

**Duration:** 2–3 days  
**Status:** 🔄 IN PROGRESS

## Goal
Establish the foundation: OpenAPI contract, Prisma schema, monorepo structure, and CI/CD pipeline skeleton.

## Tasks Breakdown

### 1. Monorepo Structure Setup
- [x] Initialize pnpm workspace ✅
- [x] Create directory structure ✅
  ```
  /apps/web      (Next.js)
  /apps/api      (NestJS)
  /packages/types (OpenAPI, Zod models)
  /packages/client (generated API client)
  /packages/ui   (shared UI components)
  /infra         (IaC, migrations)
  .github/workflows/
  ```
- [x] Set up root `package.json` with workspace config ✅
- [x] Configure TypeScript path aliases ✅

### 2. OpenAPI v0.2 Specification
- [x] Create `/packages/types/openapi.yaml` ✅
- [x] Define core endpoints ✅
  - Auth: `POST /auth/login`, `GET /users/me`
  - Providers: `GET /providers`, `POST /providers`, `GET /providers/{id}`, `PATCH /providers/{id}`
  - Packages: `POST /packages`
  - Requests: `GET /requests`, `POST /requests`, `GET /requests/{id}`, `PATCH /requests/{id}`
  - Messages: `GET /requests/{id}/messages`, `POST /requests/{id}/messages`, `POST /messages/attachments`
  - Quotes: `POST /requests/{id}/quotes`, `GET /quotes/{id}`, `PATCH /quotes/{id}`
  - Checkout: `POST /checkout/intent`
  - Orders: `GET /orders`, `GET /orders/{id}`, `PATCH /orders/{id}`
  - Reviews: `POST /orders/{id}/review`
  - Billing: `POST /billing/checkout-session`, `GET /billing/portal`, `GET /billing/subscription`, `GET /billing/entitlements/me`, `POST /billing/webhook`
  - Admin: placeholder endpoints (detailed in M7)
- [x] Define request/response schemas (Zod-compatible) ✅
- [x] Add error response schemas (403 EntitlementExceeded, 429 Throttled, etc.) ✅
- [x] Document authentication (JWT via HttpOnly cookie) ✅
- [x] Version as `v0.2.0` (semver: major.minor.patch) ✅

**Status:** ✅ **COMPLETE** — Scope Guardian approved

**Scope Guardian Approval:**
> ✅ **APPROVED** — OpenAPI v0.2 Specification matches spec Section 5 exactly.
> 
> All required endpoints are present. Error schemas are defined. Request/response schemas match Section 3 data model. Authentication is documented correctly. Version is v0.2.0 as required.
> 
> Proceed with Task 3 (Prisma schema).

### 3. Prisma Schema
- [ ] Create `/apps/api/prisma/schema.prisma`
- [ ] Define all models per Section 3:
  - **Core:** User, ProviderProfile, ServicePackage, Request, Message, Quote, Order, Milestone, Review, Attachment, Notification
  - **Billing:** BillingCustomer, Subscription, Entitlement, UsageCounter, Invoice
  - **Admin:** AdminUser, VerificationCase, DisputeCase, Payout, Refund, FeatureFlag, FeeSchedule, Banner, EmailTemplate, AuditLog, InternalNote, Report
- [ ] Add indexes per spec (e.g., `idx(providerId,metric,periodKey)` on UsageCounter)
- [ ] Define enums: PlanCode, SubscriptionStatus, UserRole, RequestStatus, QuoteStatus, OrderStatus, etc.
- [ ] Add relations (FKs) with proper cascades
- [ ] Generate Prisma client: `npx prisma generate`

### 4. OpenAPI Client Generation
- [ ] Set up client generator in `/packages/client`
  - Options: `openapi-typescript-codegen`, `@openapi-contrib/openapi-generator`, or custom
- [ ] Configure generator to output TypeScript types + fetch client
- [ ] Set up npm script: `pnpm -w generate:client` (reads OpenAPI spec, generates client)
- [ ] Ensure generated types are Zod-compatible or generate Zod schemas alongside

### 5. CI/CD Workflow Skeleton
- [ ] Create `.github/workflows/ci.yml`
- [ ] Add jobs:
  1. **Verify:** `pnpm -w typecheck && pnpm -w lint && pnpm -w test`
  2. **Contracts:** OpenAPI lint (Spectral or similar), Pact verify, client generation check
  3. **Build:** FE (Next.js build), BE (NestJS build/Docker)
  4. **Preview:** Deploy FE to Vercel preview, BE to staging/preview
  5. **PR Comment:** Post preview links + test summary
- [ ] Add workflow for migrations (Prisma migrate on merge to main)

### 6. Project Documentation
- [ ] Create root `README.md`:
  - Project overview
  - Setup instructions
  - Development workflow
  - Monorepo structure
- [ ] Create `CONTRIBUTING.md`:
  - DoR checklist template
  - DoD checklist template
  - RFC template (1-page format: Problem → Proposal → Impact → Rollout)
  - PR guidelines
- [ ] Create `docs/ARCHITECTURE.md` (link to spec, high-level overview)

## DoR Checklist (Definition of Ready)
- [x] User story defined
- [ ] Wireframe/mock available
- [x] API contract defined (OpenAPI)
- [ ] Error states documented
- [ ] Analytics events defined

## DoD Checklist (Definition of Done)
- [ ] Code implemented
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing (if applicable)
- [ ] Accessibility (a11y) checked
- [ ] Telemetry added
- [ ] Documentation updated
- [ ] Preview URL available

## Acceptance Criteria
- [x] OpenAPI spec is valid (passes lint) ✅
- [ ] Prisma schema generates without errors
- [ ] Generated API client is type-safe and usable
- [ ] CI workflow runs successfully (at least typecheck/lint)
- [x] Monorepo structure allows independent development of FE/BE ✅

## Dependencies
- Node.js 18+ installed
- pnpm installed
- PostgreSQL (Neon/Supabase) credentials available (can use Docker locally)

## Notes
- Keep OpenAPI spec and Prisma schema in sync manually for M0 (automation can come later)
- Client generation should be idempotent (can run multiple times)
- CI should fail fast on contract mismatches

