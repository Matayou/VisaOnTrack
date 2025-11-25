# SawadeePass v2 — Project Status

**Last Updated:** 2025-11-24 (Pivot Implementation Complete)
**Current Phase:** Alpha / Verification
**Model:** Lead Gen + SaaS (No Escrow)
**Status:** ✅ **PIVOT IMPLEMENTED**

---

## 🚀 Pivot Summary (VisaOnTrack -> SawadeePass)

We have successfully pivoted from an Escrow-based marketplace to a **Lead Generation & SaaS** model.
- **Project Name:** SawadeePass
- **Core Logic:** Seekers post requests -> Providers spend **Credits** to unlock -> Direct Payment (off-platform) -> SaaS tools for fulfillment.
- **Monetization:** Credit Packs & Subscriptions (Provider side).

---

## 📋 Milestone Progress

### ✅ M0 — Contracts & Foundation — **COMPLETE**
- [x] Monorepo structure & CI/CD
- [x] OpenAPI v0.2 & Prisma Schema
- [x] Security hardening (JWT, IP-based rate limiting)

### ✅ M1 — Auth & Onboarding — **COMPLETE**
- [x] Landing Page
- [x] Seeker/Provider Registration
- [x] Email Verification (Simulated)
- [x] Provider Onboarding (Basic Profile)

### ✅ M2 — Intake & Lead Gen (The Pivot) — **COMPLETE**
- [x] **Seeker Intake Wizard:** `/get-started` (Public) & `/requests/new` (Auth).
- [x] **Smart Intake:** Persists data across registration.
- [x] **Request Lifecycle:** Draft -> Publish -> Open.
- [x] **Dashboards:** Role-specific dashboards for Seeker and Provider.

### ✅ M3 — Credit System & Proposals — **COMPLETE**
- [x] **Credit Engine:** Ledger, Transaction history, Deductions.
- [x] **Unlock Flow:** Provider spends credit to view/contact.
- [x] **Proposal Engine:** Draft/Sent status.
- [x] **Direct Connection:** Contact details revealed upon unlock.

### ⏳ M4 — Discovery & Trust — **NEXT**
- [ ] **Provider Directory:** Public search/filter.
- [ ] **Verification Workflow:** Admin approval tools.
- [ ] **Safe Payment Guide:** In-app education for off-platform payments.

### ⏳ M5 — SaaS Tools (Fulfillment) — **PLANNED**
- [ ] **Case Management:** Milestones, Document Vault.
- [ ] **Client Portal:** Seeker view of case progress.
- [ ] **Reviews:** Post-completion feedback loop.

### ⏳ M6 — Monetization (Stripe) — **PLANNED**
- [ ] **Stripe Billing:** Credit pack purchasing.
- [ ] **Subscriptions:** Pro/Agency tier gating.

---

## 🛠️ Technical Implementation Status

### Backend (NestJS)
- **Auth:** Full JWT flow + RBAC (Seeker/Provider/Admin).
- **Requests:** CRUD + Intake Mapping.
- **Credits:** Balance check, Transaction logging, Atomic deduction.
- **Migration:** Stripe Connect removed; Credit models added.

### Frontend (Next.js)
- **Intake:** Reusable `IntakeWizard` component.
- **Dashboards:**
  - **Provider:** Real-time credit balance, Locked/Unlocked request feed.
  - **Seeker:** Request list, Publish draft flow.
- **Client:** Auto-generated SDK + Manual extensions for Credit/Unlock methods.

---

## ⚠️ Known Issues / Tasks
- **Client Generation:** The `packages/client` is currently manually patched. Needs full regeneration from backend to be clean.
- **Admin UI:** Admin dashboard is minimal/missing. Needed for verifying providers.
- **Messaging:** Basic thread view exists, but real-time/polling logic needs refinement.

---

## 🔗 Key Documentation
- `sawadeepass-v2-spec.md`: **The Source of Truth** (Updated).
- `docs/role-flow-map.html`: Interactive mechanics visualizer.
- `docs/role-journey-wizard.html`: Step-by-step user journey guide.
