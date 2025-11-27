# RFC-004: Onboarding Completion Tracking

## Problem

The registration and onboarding flow lacks completion tracking, making it impossible to:
- Gate features until onboarding is complete
- Track onboarding progress
- Redirect users appropriately after login
- Enforce provider verification requirements

**Current State:**
- Onboarding routes exist (`/onboarding/seeker/welcome`, `/onboarding/provider/*`)
- No tracking of onboarding completion status
- No `onboardingCompleted` field in User model
- No way to check if user has completed onboarding
- No way to gate features until onboarding complete

**Impact:**
- 🔴 **CRITICAL** — Cannot gate provider features until onboarding complete
- 🔴 **CRITICAL** — Cannot enforce provider verification requirements
- 🟡 **HIGH** — Poor user experience (no progress tracking)
- 🟡 **HIGH** — Cannot redirect users appropriately after login

## Proposal

Add onboarding completion tracking to User model and API:

**Data Model (Prisma schema):**
- Add `onboardingCompleted` boolean field (default: `false`)
- Add `onboardingCompletedAt` DateTime field (nullable)
- Add `seekerOnboardingCompleted` boolean field (default: `false`)
- Add `providerOnboardingCompleted` boolean field (default: `false`)

**API Endpoints (OpenAPI spec):**
- `POST /users/me/complete-onboarding` — Mark onboarding as complete
- `GET /users/me` — Include `onboardingCompleted` status in response

**Workflow:**
1. User completes onboarding steps
2. Frontend calls `POST /users/me/complete-onboarding` with role
3. Backend sets appropriate completion flags:
   - `onboardingCompleted = true`
   - `onboardingCompletedAt = now()`
   - `seekerOnboardingCompleted = true` (if role is SEEKER)
   - `providerOnboardingCompleted = true` (if role is PROVIDER)
4. User can now access gated features (if verified)

**Provider-Specific:**
- Provider onboarding completion is separate from verification
- Provider must complete onboarding AND be verified to access features
- Completion tracking enables provider verification gating (RFC-005)

## Impact

**Scope:**
- Adds 4 fields to User model (Prisma schema)
- Adds 1 API endpoint to OpenAPI spec
- Modifies `GET /users/me` response to include completion status
- Requires completion logic in onboarding flows

**Breaking Changes:**
- None (new fields, optional)

**Dependencies:**
- None (standalone feature)

**Timeline:**
- Spec update: 1 hour
- Prisma schema update: 30 minutes
- API endpoint: 2-3 hours
- Frontend integration: 2-3 hours
- **Total: 5.5-7.5 hours (1 day)**

**Risk:**
- Low — Simple boolean tracking
- No complex logic required

## Rollout

**Feature Flag:** N/A (core feature)

**Migration:**
- Add fields to User model (nullable, defaults to `false`)
- Existing users: `onboardingCompleted = false` (can complete later)
- No data migration required

**Rollback Plan:**
- Can disable completion requirement if issues occur
- Existing users unaffected

**Tasks:**
1. Update spec Section 3 with completion fields
2. Update Prisma schema (add 4 fields)
3. Add `POST /users/me/complete-onboarding` endpoint to OpenAPI spec
4. Modify `GET /users/me` response to include completion status
5. Implement completion endpoint
6. Update onboarding flows to call completion endpoint
7. Tech Lead review (API contract)
8. Scope Guardian review (spec compliance)
9. QA review (testing)

## Decision

[ ] Approved [ ] Rejected [ ] Deferred

**Decision Date:** TBD  
**Decided By:** TBD

**Reviewers:**
- [ ] Scope Guardian — Review required
- [ ] Tech Lead — Review required
- [ ] PM — Review required

---

**Priority:** 🔴 **HIGH** — Required for provider gating  
**Severity:** 🔴 **CRITICAL** — Blocks provider verification gating (RFC-005)

