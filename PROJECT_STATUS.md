# VisaOnTrack v2 — Project Status

**Last Updated:** M0 Task 3 Complete (Multi-Agent Approved)
**Current Milestone:** M0 — Contracts & Skeletons
**Phase:** Active Development — M0 In Progress
**Agent Team:** ✅ All agents created and ready
**Current Task:** M0 Task 4 — OpenAPI Client Generation

---

## Milestone Progress

### ✅ M0 — Contracts & Skeletons (2–3d) — **IN PROGRESS**
- [x] OpenAPI v0.2 specification ✅ **COMPLETE** (Scope Guardian approved)
- [x] Prisma schema (all models) ✅ **COMPLETE** (Multi-agent approved: Tech Lead, QA, Security, Scope Guardian)
- [x] Monorepo structure setup ✅ **COMPLETE** (Scope Guardian approved)
- [ ] OpenAPI client generation configured
- [ ] CI/CD workflow skeleton
- [ ] Project documentation (README, DoR/DoD templates)

### 📋 M1 — Auth & Onboarding (4–5d) — **PENDING**
- [ ] Login/Register flows
- [ ] Account type selection
- [ ] Provider business details onboarding
- [ ] Services/packages onboarding

### 📋 M2 — Requests & Messaging (5–6d) — **PENDING**
- [ ] Post request/list/thread
- [ ] Attachments (base caps)

### 📋 M3 — Quotes & Checkout (6–7d) — **PENDING**
- [ ] Quote composer
- [ ] Accept quote flow
- [ ] Stripe Connect PaymentIntent
- [ ] Order creation

### 📋 M4 — Orders & Reviews (4–5d) — **PENDING**
- [ ] Milestones tracking
- [ ] Delivery flow
- [ ] Review submission

### 📋 M5 — Discovery & Profiles (3–4d) — **PENDING**
- [ ] Provider search
- [ ] Profile pages
- [ ] Ranking algorithm with planBoost

### 📋 M6 — Plans & Billing (5–6d) — **PENDING**
- [ ] `/plans` pricing page
- [ ] `/settings/billing` dashboard
- [ ] Billing API endpoints
- [ ] Stripe Billing webhook handler
- [ ] Entitlements engine
- [ ] Usage counters & gating

### 📋 M7 — Admin (6–8d) — **PENDING**
- [ ] Vetting/moderation tools
- [ ] Payouts/refunds management
- [ ] Dispute resolution
- [ ] Billing dashboards
- [ ] Audit log system

---

## Blockers & Risks

_None currently._

---

## Recent Decisions

**M0 Task 1 Completion (Monorepo Setup):**
- ✅ Structure matches spec Section 1 exactly
- ✅ Specs/ directory removed (not in spec)
- ✅ .github/workflows/ directory created (required by spec)
- ✅ Scope Guardian approved final structure

**M0 Task 2 Completion (OpenAPI v0.2 Specification):**
- ✅ All endpoints from spec Section 5 defined
- ✅ Missing endpoint `POST /messages/attachments` added (Scope Guardian finding)
- ✅ Error schemas defined (403 EntitlementExceeded, 429 Throttled, 413 PayloadTooLarge, etc.)
- ✅ JWT HttpOnly cookie authentication documented
- ✅ Version set to v0.2.0 (semver)
- ✅ Request/response schemas match Section 3 data model

**M0 Task 3 Completion (Prisma Schema):**
- ✅ All 28 models defined per Section 3 (11 Core + 5 Billing + 12 Admin)
- ✅ All enums defined per spec (16 enums verified by QA, matches spec)
- ✅ Required indexes present (UsageCounter composite index)
- ✅ Unique constraints defined (BillingCustomer, Subscription, Invoice, Entitlement)
- ✅ Relations properly configured with cascade behavior
- ✅ Field types align with spec (Decimal, Json, UUIDs, DateTime)
- ✅ Tech Lead fix applied (invalid Request.orders relation removed)
- ✅ Schema validates and Prisma client generates successfully

**Multi-Agent Review Results:**
> ✅ **Tech Lead:** APPROVED — Architecture approved, fix applied
> ✅ **QA Engineer:** APPROVED — Schema complete, testable, all 28 models present
> ✅ **Security Guard:** APPROVED — Security requirements met, compliance verified
> ✅ **Scope Guardian:** APPROVED — Schema matches spec Section 3 exactly
> 
> **Status:** All reviews approved. Task 3 complete. Proceed to Task 4 (OpenAPI Client Generation).
> 
> Spec is Truth. MVP focus. No exceptions without RFC.

---

## Next Actions

1. ✅ Set up monorepo structure — **COMPLETE** (Scope Guardian approved)
2. ✅ Create OpenAPI v0.2 spec — **COMPLETE** (Scope Guardian approved)
3. ✅ Define Prisma schema — **COMPLETE** (Multi-agent approved: Tech Lead, QA, Security, Scope Guardian)
4. Configure OpenAPI client generation — **NEXT** (Frontend Engineer)
5. Configure CI/CD workflow skeleton

---

## Team Structure

**Agent Team:** See `AGENT_TEAM.md` for team roles and responsibilities.
**Agent Prompts:** See `AGENT_PROMPTS.md` for system instructions per role.
**Scope Guardian:** See `SCOPE_GUARDIAN.md` for anti-scope-creep playbook.

**Active Agents:**
- 🛡️ Scope Guardian (enforcing spec adherence)
- 📋 Project Manager (tracking milestones)
- 🔧 Tech Lead (architecture decisions)
- 💻 Frontend Engineer (Next.js implementation)
- 🚀 Backend Engineer (NestJS implementation)
- 🧪 QA Engineer (testing & quality gates)
- 🔒 Security Guard (security & compliance)

## Notes

- **Principle:** Contract-first (OpenAPI) + schema-first (Prisma)
- **Scope control:** All changes via 1-page RFC (see `SCOPE_GUARDIAN.md`)
- **Quality gates:** DoR/DoD checklists required before implementation (see `TASK_TEMPLATES.md`)
- **Team workflow:** See `AGENT_TEAM.md` for PR review process and escalation paths

