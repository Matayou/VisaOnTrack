# SawadeePass v2 — Scope & Objectives

> Canonical scope and objectives for the current Alpha release. Aligned to `sawadeepass-v2-spec.md`, `PROJECT_STATUS.md`, and `docs/analysis/RECOVERY_PLAN.md` (2025-11-30). Update this file whenever the spec, plan, or code reality shifts.

**Audience:** PM, Tech Lead, Stakeholders  
**Stage:** Alpha (Pivot implemented; preparing M4 Discovery & Trust)  
**Last Updated:** 2025-11-30

## Objectives (Alpha)
- **Product adoption:** Convert visitors from landing → intake → registered → published request. Signal: intake completion and publish rates (targets to be set with PM).
- **Supply readiness:** Onboard and verify providers so they can unlock and respond. Signal: verified provider count and unlock-to-proposal rate.
- **Monetization readiness:** Validate credit-spend behavior with simulated packs; keep pricing configurable (env). Signal: unlock volume vs. credit balance depletion.
- **Trust & quality:** Keep spam low and match quality high. Signal: rejection/abandonment rates on unlocked leads; admin review coverage once vetting is live.
- **Technical reliability:** Keep SDK/spec/prisma in sync; automated typecheck/lint/test must pass before shipping.

## In Scope (Alpha + M4 prep)
- **Intake-first posting:** Public `/get-started` wizard persists answers through registration; authenticated `/requests/new` prefilled from intake data; drafts can publish/close/hire.
- **Lead unlock economy:** Credit ledger (balance/history/purchase simulator), unlock endpoint (`/requests/:id/unlock`) that creates a draft proposal and reveals contact data; configurable credit cost via env per recovery plan.
- **Dashboards & request detail:** Seeker dashboard = request list with metrics and status filters; provider dashboard = lead feed with lock/unlock actions and credit badge; request detail page shows intake context, audit timeline stub, publish/edit actions.
- **Proposal/messaging loop (MVP):** Proposal model and draft creation on unlock exist; messaging attachments service exists. Full proposal submission and threaded messaging are expected deliverables for M4.
- **Trust & discovery (M4):** Provider verification workflow and public directory/search; safe-payment education copy; admin vetting/quality views.
- **Monetization plumbing:** Subscriptions (Free/Pro/Agency) and credit packs defined in spec; billing UI + Stripe wiring planned for M6 with feature flags guarding unfinished flows.

## Out of Scope (for Alpha)
- Escrowed payments or on-platform funds flow (pivot removed escrow; payments are off-platform).
- Real-time messaging or WebSocket presence (polling-only/backlog).
- Mobile apps; non-Thai geographies; additional languages beyond current locale defaults.
- Full case management portal (milestones/vault/shared timeline) until M5.
- Production Stripe billing and invoicing (credit purchase currently simulated).

## Assumptions & Dependencies
- **Single source of truth:** OpenAPI spec and Prisma schema define contracts; SDK must be regenerated after spec updates.
- **Brand alignment:** External-facing copy uses "SawadeePass"; clean up residual "VisaOnTrack" references during ongoing work.
- **Configurable pricing:** Credit cost should be driven by env to support experimentation; default = 1 credit per unlock.
- **Feature gating:** Unfinished billing/trust features must be behind feature flags or "coming soon" UI to avoid scope creep.

## Risks & Follow-ups
- **Docs vs. code drift:** Recovery plan tracks misalignments (e.g., intakeData in requests, unlock endpoint not in OpenAPI). Keep this file updated after each alignment pass.
- **SDK divergence:** `packages/client` is manually patched; regenerate after the OpenAPI update to avoid `as any` usage in the web app.
- **Copy mismatch:** Some UI copy still references escrow flows; ensure alignment with the lead-gen + SaaS model before marketing pushes.
