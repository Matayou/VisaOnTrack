# Scope Guardian Review — Registration & Onboarding Flow Gaps

**Date:** 2025-01-11  
**Reviewed By:** Scope Guardian  
**Review Type:** Gap Analysis & RFC Requirements  
**Status:** ⚠️ **RFC REQUIRED** — Multiple gaps identified requiring spec changes

---

## Executive Summary

**Critical Finding:** The registration and onboarding flow has **5 critical gaps** that are NOT explicitly covered in `visaontrack-v2-spec.md`. These gaps must be addressed via RFC process before implementation.

**Impact:** These gaps prevent a production-ready registration system and violate the requirement that **providers must be blocked from main platform features until onboarding is complete AND documents are verified**.

---

## Gap Analysis Against Spec

### Gap 1: Email Verification Flow ❌ NOT IN SPEC

**Current Spec Status:**
- Spec Section 2: No `/auth/verify-email` route
- Spec Section 5: No `GET /auth/verify-email` endpoint
- Spec Section 3: No `emailVerified` field in User model
- Spec Section 6: No email verification workflow

**Required Changes:**
- Add `/auth/verify-email` route to Spec Section 2
- Add `GET /auth/verify-email?token=xxx` endpoint to OpenAPI spec
- Add `POST /auth/resend-verification` endpoint to OpenAPI spec
- Add `emailVerified` boolean field to User model (Prisma schema)
- Add `emailVerificationToken` and `emailVerificationTokenExpiry` fields to User model

**RFC Required:** ✅ **YES** — RFC-003

---

### Gap 2: Onboarding Completion Tracking ❌ NOT IN SPEC

**Current Spec Status:**
- Spec Section 2: Onboarding routes exist, but no completion tracking
- Spec Section 3: No `onboardingCompleted` field in User model
- Spec Section 6: No onboarding completion workflow

**Required Changes:**
- Add `onboardingCompleted` boolean field to User model
- Add `onboardingCompletedAt` DateTime field to User model
- Add `seekerOnboardingCompleted` and `providerOnboardingCompleted` boolean fields
- Add `POST /users/me/complete-onboarding` endpoint to OpenAPI spec
- Add onboarding completion workflow to Spec Section 6

**RFC Required:** ✅ **YES** — RFC-004

---

### Gap 3: Provider Verification Gating System ❌ PARTIALLY IN SPEC

**Current Spec Status:**
- Spec Section 6: Provider vetting workflow exists ("Upload credentials → VerificationCase checklist → approve/suspend → badge + ranking eligibility")
- Spec Section 3: `ProviderProfile.verifiedAt` field exists
- Spec Section 11: RBAC mentioned, but no explicit provider verification guard

**Missing:**
- No explicit requirement to BLOCK provider features until verified
- No provider verification guard specification
- No frontend access control specification
- No login redirect logic for unverified providers

**Required Changes:**
- Add explicit requirement: Providers MUST be blocked from main features until `verifiedAt` is set
- Add provider verification guard to Spec Section 11 (Security)
- Add login redirect logic to Spec Section 6 (Workflows)
- Document which features are blocked vs allowed

**RFC Required:** ✅ **YES** — RFC-005

---

### Gap 4: Login Redirect Logic ❌ NOT IN SPEC

**Current Spec Status:**
- Spec Section 2: Login route exists (`/auth/login`)
- Spec Section 6: No login redirect workflow
- No specification for checking onboarding/verification status after login

**Required Changes:**
- Add login redirect workflow to Spec Section 6
- Specify redirect logic:
  1. Email not verified → `/auth/verify-email`
  2. Onboarding incomplete → appropriate onboarding page
  3. Provider not verified → `/onboarding/provider/verification-status`
  4. Everything complete → dashboard

**RFC Required:** ✅ **YES** — RFC-005 (combined with provider verification gating)

---

### Gap 5: Provider Verification Status Page ❌ NOT IN SPEC

**Current Spec Status:**
- Spec Section 2: No `/onboarding/provider/verification-status` route
- Spec Section 5: No `GET /providers/{id}/verification-status` endpoint

**Required Changes:**
- Add `/onboarding/provider/verification-status` route to Spec Section 2
- Add `GET /providers/{id}/verification-status` endpoint to OpenAPI spec
- Add verification status page mockup

**RFC Required:** ✅ **YES** — RFC-005 (combined with provider verification gating)

---

## Spec Compliance Assessment

### ✅ In Spec (No RFC Required)
- Provider onboarding routes (Section 2)
- Provider vetting workflow (Section 6)
- `ProviderProfile.verifiedAt` field (Section 3)
- `VerificationCase` model (Section 3)
- Admin provider vetting endpoints (Section 2, M7)

### ❌ Not In Spec (RFC Required)
- Email verification flow
- Onboarding completion tracking
- Provider verification gating system (explicit blocking)
- Login redirect logic
- Provider verification status page

---

## RFC Requirements

### RFC-003: Email Verification Flow
**Priority:** 🔴 **HIGH** — Required for production security  
**Status:** ⏳ **TO BE CREATED**

**Changes Required:**
- Spec Section 2: Add `/auth/verify-email` route
- Spec Section 5: Add `GET /auth/verify-email?token=xxx` and `POST /auth/resend-verification` endpoints
- Spec Section 3: Add `emailVerified`, `emailVerificationToken`, `emailVerificationTokenExpiry` fields to User model
- OpenAPI spec: Add endpoints (version bump required)
- Prisma schema: Add fields

---

### RFC-004: Onboarding Completion Tracking
**Priority:** 🔴 **HIGH** — Required for provider gating  
**Status:** ⏳ **TO BE CREATED**

**Changes Required:**
- Spec Section 3: Add `onboardingCompleted`, `onboardingCompletedAt`, `seekerOnboardingCompleted`, `providerOnboardingCompleted` fields to User model
- Spec Section 5: Add `POST /users/me/complete-onboarding` endpoint
- Spec Section 6: Add onboarding completion workflow
- OpenAPI spec: Add endpoint (version bump required)
- Prisma schema: Add fields

---

### RFC-005: Provider Verification Gating System
**Priority:** 🔴 **CRITICAL** — Blocks provider access until verified  
**Status:** ⏳ **TO BE CREATED**

**Changes Required:**
- Spec Section 11: Add provider verification guard requirement
- Spec Section 6: Add explicit provider gating workflow
- Spec Section 2: Add `/onboarding/provider/verification-status` route
- Spec Section 5: Add `GET /providers/{id}/verification-status` endpoint
- Spec Section 6: Add login redirect logic workflow
- Document blocked vs allowed features
- OpenAPI spec: Add endpoint (version bump required)

---

## Implementation Blockers

### 🚫 **BLOCKED UNTIL RFC APPROVAL:**
1. Email verification implementation — **BLOCKED** (RFC-003 required)
2. Onboarding completion tracking — **BLOCKED** (RFC-004 required)
3. Provider verification gating — **BLOCKED** (RFC-005 required)
4. Login redirect logic — **BLOCKED** (RFC-005 required)
5. Provider verification status page — **BLOCKED** (RFC-005 required)

### ✅ **ALLOWED (In Spec):**
- Provider onboarding pages (already implemented)
- Provider vetting workflow (admin endpoints in M7)
- `ProviderProfile.verifiedAt` field (already in schema)

---

## Recommendations

### Immediate Actions:
1. ✅ **Create RFC-003** — Email verification flow
2. ✅ **Create RFC-004** — Onboarding completion tracking
3. ✅ **Create RFC-005** — Provider verification gating system

### Review Process:
1. Scope Guardian reviews RFCs for spec alignment
2. Tech Lead reviews technical feasibility
3. Security Guard reviews security implications
4. PM reviews timeline impact
5. Team approval → Spec update → Implementation

### Priority Order:
1. **RFC-005** (CRITICAL) — Provider verification gating (blocks provider access)
2. **RFC-004** (HIGH) — Onboarding completion tracking (required for gating)
3. **RFC-003** (HIGH) — Email verification (security best practice)

---

## Scope Discipline Compliance

### ✅ **COMPLIANT:**
- All gaps identified and documented
- RFC process initiated for spec changes
- No implementation without RFC approval
- Spec adherence maintained

### ⚠️ **REQUIRES ATTENTION:**
- RFCs must be created and approved before implementation
- Spec updates required after RFC approval
- OpenAPI version bumps required for API changes
- Prisma migrations required for schema changes

---

## Next Steps

1. **Scope Guardian:** Create RFC-003, RFC-004, RFC-005
2. **Team Review:** Review RFCs per RFC process
3. **Spec Update:** Update spec after RFC approval
4. **Implementation:** Proceed with implementation after spec update

---

**Status:** ⚠️ **RFC REQUIRED** — Implementation blocked until RFCs approved  
**Reviewer:** Scope Guardian  
**Date:** 2025-01-11

