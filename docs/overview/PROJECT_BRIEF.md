# SawadeePass v2 — Project Brief

> Canonical overview for project scope and objectives. Source documents: `sawadeepass-v2-spec.md` and `PROJECT_STATUS.md` (2025-11-30). Keep this file aligned whenever the spec or milestone status changes.

**Audience:** Leadership, PM, Eng Leads  
**Stage:** Alpha (Pivot to Lead Gen + SaaS implemented)  
**Brand:** SawadeePass (formerly VisaOnTrack)  
**Last Updated:** 2025-11-30

## TL;DR
- Request-centric marketplace connecting visa seekers with vetted providers in Thailand.
- Lead-generation + SaaS model: seekers post requests, providers spend credits to unlock and respond; payments happen off-platform.
- Current build covers intake-first request creation, seeker/provider dashboards, and credit-based unlock flow; Stripe billing and deeper trust features are planned next.

## Users & Value
- **Visa Seekers:** Guided intake → auto-drafted request → publish to receive proposals; see all requests in a dashboard with status filters.
- **Providers:** See anonymized requests, unlock with credits to view contact details, and manage unlocked leads from a provider dashboard.
- **Admin (planned):** Vet providers, moderate intake quality, and monitor lead quality via internal dashboards.

## Product Pillars (MVP Scope)
- **Intake-first request creation:** Public and authenticated wizards that capture location/duration/income and prefill the request draft.
- **Lead unlock economy:** Provider credit ledger (balance/history), unlock endpoint (`/requests/:id/unlock`), and unlock UI integrated into the provider dashboard.
- **Proposal + messaging loop:** Request detail page with proposal placeholders and audit timeline; messaging/attachments service exists but end-to-end flow needs completion.
- **Dashboards:** Role-specific dashboards (seeker = request list with metrics, provider = lead feed with unlock actions).
- **Trust and verification (coming):** Provider verification case handling and public directory/search planned for the next milestone.

## Business Model
- **Credits:** Default cost = 1 credit per lead unlock; credit balance and history are live. Purchase flow is simulated for now (Stripe to be wired in M6).
- **Subscriptions:** Free / Pro / Agency tiers with included credits and SaaS entitlements (case tools, badges). Billing UI planned; feature gating to follow once Stripe is live.
- **No escrow:** Payments occur directly between seeker and provider; platform revenue comes from credits + subscriptions.

## Stage & Implemented Capabilities (Alpha)
- **Frontend (Next.js):** Landing page with auth-aware redirects; public and authenticated intake wizards; seeker dashboard as request list with metrics and auto-create-from-intake; provider dashboard with credit balance and unlock controls; request detail page with publish/edit actions and intake context.
- **Backend (NestJS + Prisma):** Auth + RBAC; requests CRUD with audit logging; credit balance/history/purchase simulator; unlock flow that creates a draft proposal and deducts credits; consultations module scaffolded; attachments service for uploads.
- **API client:** Generated SDK in `packages/client` (needs regeneration after spec alignment per recovery plan).
- **Infrastructure:** Monorepo (apps/web, apps/api, packages/*), pnpm workspace, CI scripts scaffolded; observability hooks (Sentry/OTel) defined in spec.

## Next Milestone Focus (per PROJECT_STATUS)
- **M4 — Discovery & Trust:** Provider directory/search, verification workflow, safe-payment education.
- **M5 — SaaS Tools:** Case management, document vault, shared timeline/portal.
- **M6 — Monetization:** Stripe Billing for credit packs and subscriptions; entitlements-based feature gating.
