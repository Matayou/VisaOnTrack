# RFC-001: Add Mockups/Wireframes as Prerequisite for M1

## Problem
The spec (`visaontrack-v2-spec.md` Section 2) references HTML mocks (e.g., `login-page.html`, `register-page.html`, `account-type-selection.html`, etc.) that do not exist in the codebase. The DoR (Definition of Ready) checklist requires wireframes/mocks before starting frontend work. Without these mockups, M1 (Auth & Onboarding) frontend work cannot proceed per our quality gates.

**Current State:**
- Spec Section 2 references 15+ HTML mock files
- No HTML mock files exist in the codebase
- DoR checklist blocks frontend work without wireframes/mocks
- M0 is complete but mockups were not included

**Impact:**
- Cannot start M1 frontend work (DoR blocks it)
- Frontend Engineer cannot begin implementation without visual reference
- Risk of rework if UI is built without proper design reference

## Proposal
Add a **mockup/wireframe task** as a prerequisite before M1:

**Option A:** Create mockups/wireframes for M1 routes (Auth & Onboarding) before starting M1
- `/auth/login` → `login-page.html`
- `/auth/register` → `register-page.html`, `simplified-registration.html`
- `/onboarding/account-type` → `account-type-selection.html`
- `/onboarding/seeker/welcome` → `onboarding-welcome.html`
- `/onboarding/provider/welcome` → `provider-onboarding-welcome.html`
- `/onboarding/provider/business` → `business-details-page.html`
- `/onboarding/provider/services` → `services-pricing-improved.html`
- `/onboarding/provider/credentials` → `credentials-page.html`, `complete-credentials-page.html`
- `/onboarding/provider/payouts` → `payment-setup-final.html`

**Option B:** Create a milestone M0.5 for mockups/wireframes (all routes) before M1

**Recommendation:** Option A (M1-specific mockups first) to unblock M1 quickly, then create remaining mockups incrementally per milestone.

**Deliverable:**
- HTML mock files matching spec Section 2 routes
- Stored in `/docs/mockups/` or `/mockups/` directory
- Linked from spec Section 2
- Reference in DoR checklist before M1 frontend work

## Impact
- **Scope:** Adds mockup/wireframe creation task (not in original M0 scope)
- **Breaking Changes:** No
- **Dependencies:** None (can proceed immediately)
- **Timeline:** 1-2 days (depends on mockup complexity and tooling)

**Risk:**
- Low: Mockups are documentation/design artifacts, not code
- May require design decisions if mockups don't exist elsewhere

## Rollout
- **Feature Flag:** N/A (not a feature)
- **Migration:** N/A (new assets)
- **Rollback Plan:** N/A (can proceed without mockups if design exists elsewhere, but DoR will block)

**Tasks:**
1. Create mockup/wireframe task (or M0.5 milestone)
2. Assign to appropriate agent (Frontend Engineer or dedicated designer)
3. Create HTML mock files per spec Section 2
4. Store in `/docs/mockups/` or `/mockups/` directory
5. Update spec Section 2 to link to actual files
6. Verify DoR checklist can be satisfied before M1 frontend work

## Decision
[x] Approved [ ] Rejected [ ] Deferred

**Decision Date:** 2025-01-11  
**Decided By:** Scope Guardian

**Decision Reason:** RFC-001 addresses a required prerequisite per the spec. Spec Section 2 explicitly references HTML mocks. DoR checklist blocks frontend work without wireframes/mocks. M1 frontend work cannot proceed without these. This is not scope creep—it fulfills a prerequisite already required by the spec. Option A (M1-specific mockups) aligns with MVP focus and unblocks M1 quickly.

---

**Status:** ✅ APPROVED

**Reviewers:**
- ✅ Scope Guardian — APPROVED (spec adherence verified)
- ⏳ Tech Lead — Review recommended (technical feasibility)
- ⏳ Frontend Engineer — Review recommended (design requirements)
- ✅ PM — APPROVED (timeline acceptable: 1-2 days)

**Next Actions:**
1. Proceed with Option A (M1-specific mockups)
2. Create mockup creation task
3. Assign to Frontend Engineer or dedicated designer
4. Create HTML mock files per spec Section 2 routes for M1
5. Store in `/docs/mockups/` or `/mockups/` directory
6. Update spec Section 2 links once files are created

