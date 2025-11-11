# RFC-005: Provider Verification Gating System

## Problem

Providers can access main platform features (submit quotes, browse requests, manage orders) **before completing onboarding AND before being verified by admin**. This violates the core requirement that providers must be vetted before interacting with seekers.

**Current State:**
- Provider vetting workflow exists in spec Section 6 ("Upload credentials → VerificationCase checklist → approve/suspend")
- `ProviderProfile.verifiedAt` field exists in schema
- **BUT:** No explicit requirement to BLOCK provider features until verified
- **BUT:** No provider verification guard in spec Section 11
- **BUT:** No login redirect logic for unverified providers
- **BUT:** No provider verification status page

**Impact:**
- 🔴 **CRITICAL** — Unverified providers can submit quotes and interact with seekers
- 🔴 **CRITICAL** — Platform quality and trust compromised
- 🔴 **CRITICAL** — Violates core product requirement (vetted providers only)
- 🟡 **HIGH** — Poor user experience (providers don't know why features are blocked)

## Proposal

Implement strict provider verification gating system:

**Core Requirement:**
Providers MUST meet BOTH conditions to access main platform features:
1. **Onboarding completed** (`onboardingCompleted = true` AND `providerOnboardingCompleted = true`)
2. **Documents verified** (`ProviderProfile.verifiedAt` is set by admin)

**Blocked Features (Until Verified):**
- Submit quotes (`POST /requests/{id}/quotes`)
- Browse requests marketplace (`GET /requests`)
- View request details (`GET /requests/{id}`)
- Manage orders (order dashboard, order detail)
- Update milestones (`PATCH /orders/{id}/milestones`)
- Message seekers (`POST /messages`)
- View provider dashboard (`/providers/dashboard`)
- Appear in provider search/discovery
- Receive quote requests

**Allowed Features (Before Verification):**
- Complete onboarding steps
- View onboarding progress
- Edit provider profile (business details, services)
- Upload/update credentials
- View verification status
- Access settings (profile, account)
- View help/documentation

**Backend Implementation:**
- Create `ProviderVerifiedGuard` (NestJS guard)
- Guard checks:
  1. User role is PROVIDER
  2. `onboardingCompleted = true`
  3. `providerOnboardingCompleted = true`
  4. `ProviderProfile.verifiedAt` is set
- Apply guard to all provider feature endpoints
- Return `403 Forbidden` with clear error message if not verified

**Frontend Implementation:**
- Create `ProviderAccessGate` component
- Check verification status on protected pages
- Redirect to appropriate page:
  - Onboarding incomplete → `/onboarding/provider/welcome`
  - Verification pending → `/onboarding/provider/verification-status`
  - Verification rejected → `/onboarding/provider/verification-status`
- Show blocking message with status

**Login Redirect Logic:**
After login, check provider status:
1. Email not verified → `/auth/verify-email`
2. Onboarding incomplete → `/onboarding/provider/welcome`
3. Verification pending/rejected → `/onboarding/provider/verification-status`
4. Verified → Dashboard

**Routes (Spec Section 2):**
- `/onboarding/provider/verification-status` → Verification status page

**API Endpoints (OpenAPI spec):**
- `GET /providers/{id}/verification-status` — Get verification case status

**Spec Updates Required:**
- Spec Section 11: Add provider verification guard requirement
- Spec Section 6: Add explicit provider gating workflow
- Spec Section 6: Add login redirect logic workflow
- Document blocked vs allowed features

## Impact

**Scope:**
- Adds 1 route to Spec Section 2
- Adds 1 API endpoint to OpenAPI spec
- Adds provider verification guard to Spec Section 11
- Adds provider gating workflow to Spec Section 6
- Adds login redirect logic to Spec Section 6
- Requires verification status page mockup

**Breaking Changes:**
- None (new guard, existing endpoints protected)

**Dependencies:**
- RFC-004 (Onboarding completion tracking) — REQUIRED
- Provider vetting workflow (already in spec)

**Timeline:**
- Spec update: 2 hours
- Backend guard: 4-6 hours
- Frontend gate component: 4-6 hours
- Verification status page: 4-6 hours
- Login redirect logic: 2-3 hours
- **Total: 16-23 hours (2-3 days)**

**Risk:**
- Low — Standard authorization guard pattern
- Well-defined requirements
- Clear blocked vs allowed features

## Rollout

**Feature Flag:** N/A (core security feature)

**Migration:**
- No data migration required
- Existing providers: Will be blocked until verified
- Admin can verify providers via admin dashboard (M7)

**Rollback Plan:**
- Can disable guard if issues occur
- Can allow unverified providers temporarily if needed

**Tasks:**
1. Update spec Section 11 with provider verification guard requirement
2. Update spec Section 6 with provider gating workflow
3. Update spec Section 6 with login redirect logic
4. Add `/onboarding/provider/verification-status` route to Spec Section 2
5. Add `GET /providers/{id}/verification-status` endpoint to OpenAPI spec
6. Create verification status page mockup
7. Implement `ProviderVerifiedGuard` (backend)
8. Apply guard to provider feature endpoints
9. Implement `ProviderAccessGate` component (frontend)
10. Implement verification status page
11. Implement login redirect logic
12. Tech Lead review (architecture)
13. Security Guard review (authorization)
14. Scope Guardian review (spec compliance)
15. QA review (authorization testing)

## Decision

[ ] Approved [ ] Rejected [ ] Deferred

**Decision Date:** TBD  
**Decided By:** TBD

**Reviewers:**
- [ ] Scope Guardian — Review required
- [ ] Tech Lead — Review required
- [ ] Security Guard — Review required
- [ ] PM — Review required

---

**Priority:** 🔴 **CRITICAL** — Blocks provider access until verified  
**Severity:** 🔴 **CRITICAL** — Core product requirement

**Dependencies:**
- RFC-004 (Onboarding completion tracking) — Must be approved first

