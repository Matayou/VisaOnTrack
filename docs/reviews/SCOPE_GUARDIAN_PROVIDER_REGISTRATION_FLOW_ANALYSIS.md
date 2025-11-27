# Scope Guardian Analysis — Provider Registration Flow Issues

**Date:** 2025-01-11  
**Reviewed By:** Scope Guardian  
**Analysis Type:** Code Review & Gap Analysis  
**Status:** ⚠️ **CRITICAL ISSUES IDENTIFIED**

---

## Executive Summary

**Critical Finding:** The provider registration flow has **5 critical issues** that prevent proper onboarding and verification enforcement. These issues must be addressed before production launch.

**Impact:** Providers can currently:
- Skip email verification
- Access main features before onboarding complete
- Access main features before verification approved
- Not see verification status
- Not be properly redirected after login

---

## Issues Identified

### Issue 1: Registration Redirects to Account Type (Not Email Verification) ❌

**Location:** `apps/web/app/auth/register/page.tsx` (Line 235)

**Current Code:**
```typescript
// Redirect to account type selection after successful registration
router.push('/onboarding/account-type');
```

**Problem:**
- Per RFC-003 requirement, registration should redirect to `/auth/verify-email` page
- Users can skip email verification and proceed directly to onboarding
- Violates security best practice (email verification required)

**Expected Behavior (Per RFC-003):**
```typescript
// Store email for verification page
localStorage.setItem('registeredEmail', email);

// Redirect to verify email page (NOT onboarding)
router.push('/auth/verify-email');
```

**Impact:** 🔴 **CRITICAL** — Email verification bypassed

**Fix Required:** Update registration redirect to `/auth/verify-email`

---

### Issue 2: Login Redirects to Dashboard (No Status Check) ❌

**Location:** `apps/web/app/auth/login/page.tsx` (Line 124)

**Current Code:**
```typescript
// Redirect to dashboard/home after successful login
router.push('/');
```

**Problem:**
- Per RFC-005 requirement, login should check:
  1. Email verification status
  2. Onboarding completion status
  3. Provider verification status (if provider)
- Currently redirects to dashboard without any checks
- Providers can access features before verification

**Expected Behavior (Per RFC-005):**
```typescript
const user = response.user;

// Priority 1: Email not verified
if (!user.emailVerified) {
  router.push('/auth/verify-email?from=login');
  return;
}

// Priority 2: Provider-specific checks
if (user.role === 'PROVIDER') {
  // Check onboarding completion
  if (!user.onboardingCompleted || !user.providerOnboardingCompleted) {
    router.push('/onboarding/provider/welcome');
    return;
  }

  // Check verification status
  const provider = await api.providers.getProvider({ id: user.id });
  if (!provider.verifiedAt) {
    router.push('/onboarding/provider/verification-status');
    return;
  }
}

// Priority 3: Everything complete - go to dashboard
router.push('/');
```

**Impact:** 🔴 **CRITICAL** — Providers can access features before verification

**Fix Required:** Implement login redirect logic per RFC-005

---

### Issue 3: Missing Provider Verification Gating ❌

**Location:** Multiple files (not implemented)

**Problem:**
- Per RFC-005 requirement, providers MUST be blocked from main features until:
  1. Onboarding completed (`onboardingCompleted = true` AND `providerOnboardingCompleted = true`)
  2. Documents verified (`ProviderProfile.verifiedAt` is set)
- No `ProviderVerifiedGuard` implemented (backend)
- No `ProviderAccessGate` component implemented (frontend)
- Providers can currently access all features before verification

**Expected Implementation:**

**Backend:**
- `apps/api/src/providers/guards/provider-verified.guard.ts` — Guard implementation
- Apply guard to provider feature endpoints:
  - `POST /requests/{id}/quotes`
  - `GET /requests`
  - `GET /requests/{id}`
  - `PATCH /orders/{id}/milestones`
  - `POST /messages`

**Frontend:**
- `apps/web/components/ProviderAccessGate.tsx` — Access gate component
- `apps/web/hooks/useProviderVerification.ts` — Verification status hook
- Apply gate to provider pages:
  - `/providers/requests` (requests marketplace)
  - `/providers/orders` (order dashboard)
  - `/providers/dashboard` (provider dashboard)

**Impact:** 🔴 **CRITICAL** — Unverified providers can interact with seekers

**Fix Required:** Implement RFC-005 (Provider Verification Gating System)

---

### Issue 4: Missing Verification Status Page ❌

**Location:** `apps/web/app/onboarding/provider/verification-status/page.tsx` (does not exist)

**Problem:**
- Per RFC-005 requirement, providers need a page to view verification status
- No `/onboarding/provider/verification-status` route exists
- Providers cannot see:
  - Verification status (PENDING, APPROVED, REJECTED, CHANGES_REQUESTED)
  - Timeline of verification process
  - Rejection reason (if rejected)
  - Requested changes (if changes requested)

**Expected Implementation:**
- Create `/onboarding/provider/verification-status` page
- Show verification status with appropriate UI:
  - PENDING: "Verification Pending" with timeline
  - APPROVED: "Account Verified!" with success message
  - REJECTED: "Verification Rejected" with reason and resubmit button
  - CHANGES_REQUESTED: "Changes Requested" with requested changes
- Call `GET /providers/{id}/verification-status` endpoint

**Impact:** 🟡 **HIGH** — Poor user experience (providers don't know status)

**Fix Required:** Implement verification status page per RFC-005

---

### Issue 5: Missing Email Verification Page ❌

**Location:** `apps/web/app/auth/verify-email/page.tsx` (does not exist)

**Problem:**
- Per RFC-003 requirement, users need a page to verify email
- No `/auth/verify-email` route exists
- Users cannot:
  - See "Check your email" message
  - Resend verification email
  - Verify email via token link
  - Continue to login without verification

**Expected Implementation:**
- Create `/auth/verify-email` page
- Show "Check your email" message with masked email
- "Resend verification email" button
- "Continue to login" button (allows login without verification)
- Handle verification token from email link (`?token=xxx`)
- Call `GET /auth/verify-email?token=xxx` endpoint

**Impact:** 🔴 **CRITICAL** — Email verification flow incomplete

**Fix Required:** Implement email verification page per RFC-003

---

## Flow Analysis

### Current Flow (Broken)
```
1. User registers → POST /auth/register
2. Redirect to /onboarding/account-type ❌ (should be /auth/verify-email)
3. User selects PROVIDER
4. Redirect to /onboarding/provider/welcome
5. User completes onboarding steps
6. User uploads credentials
7. User redirected to dashboard ❌ (no verification check)
8. User can access all features ❌ (no gating)
```

### Expected Flow (Per RFCs)
```
1. User registers → POST /auth/register
2. Redirect to /auth/verify-email ✅
3. User verifies email (or continues to login)
4. User logs in → POST /auth/login
5. Check email verification → /auth/verify-email (if not verified)
6. Check onboarding status → /onboarding/provider/welcome (if incomplete)
7. Check verification status → /onboarding/provider/verification-status (if not verified)
8. Redirect to dashboard (if all complete)
9. Provider features gated until verified ✅
```

---

## Implementation Status

### ✅ Implemented
- Registration form (`/auth/register`)
- Account type selection (`/onboarding/account-type`)
- Provider onboarding pages (`/onboarding/provider/*`)
- Onboarding completion API call (RFC-004)

### ❌ Missing (Critical)
- Email verification page (`/auth/verify-email`) — RFC-003
- Email verification endpoints (`GET /auth/verify-email`, `POST /auth/resend-verification`) — RFC-003
- Login redirect logic (check status after login) — RFC-005
- Provider verification guard (backend) — RFC-005
- Provider access gate (frontend) — RFC-005
- Verification status page (`/onboarding/provider/verification-status`) — RFC-005
- Verification status endpoint (`GET /providers/{id}/verification-status`) — RFC-005

---

## Priority Fixes

### 🔴 **CRITICAL (Before Production)**
1. **Fix registration redirect** — Redirect to `/auth/verify-email` instead of `/onboarding/account-type`
2. **Implement email verification page** — Create `/auth/verify-email` page (RFC-003)
3. **Implement login redirect logic** — Check status after login (RFC-005)
4. **Implement provider verification gating** — Block access until verified (RFC-005)

### 🟡 **HIGH (Before Production)**
5. **Implement verification status page** — Create `/onboarding/provider/verification-status` page (RFC-005)

---

## Recommendations

### Immediate Actions:
1. ✅ **Fix registration redirect** — Update `register/page.tsx` line 235
2. ✅ **Implement email verification page** — Create `/auth/verify-email` page (RFC-003-FE)
3. ✅ **Implement login redirect logic** — Update `login/page.tsx` (RFC-005-FE)
4. ✅ **Implement provider verification gating** — Backend guard + Frontend gate (RFC-005)
5. ✅ **Implement verification status page** — Create verification status page (RFC-005-FE)

### Testing Required:
- Test complete provider registration flow
- Test email verification flow
- Test login redirect logic
- Test provider verification gating
- Test verification status page

---

## Scope Compliance

### ✅ **COMPLIANT:**
- Registration form matches spec
- Account type selection matches spec
- Provider onboarding pages match spec
- Onboarding completion tracking implemented (RFC-004)

### ❌ **NON-COMPLIANT:**
- Registration redirect (should be `/auth/verify-email` per RFC-003)
- Login redirect (should check status per RFC-005)
- Provider verification gating (not implemented per RFC-005)
- Email verification page (not implemented per RFC-003)
- Verification status page (not implemented per RFC-005)

---

## Next Steps

1. **Frontend Engineer:** Fix registration redirect (1 hour)
2. **Frontend Engineer:** Implement email verification page (RFC-003-FE) (2-3 hours)
3. **Frontend Engineer:** Implement login redirect logic (RFC-005-FE) (2-3 hours)
4. **Backend Engineer:** Implement provider verification guard (RFC-005-BE) (4-6 hours)
5. **Frontend Engineer:** Implement provider access gate (RFC-005-FE) (4-6 hours)
6. **Frontend Engineer:** Implement verification status page (RFC-005-FE) (4-6 hours)

**Total Effort:** 17-25 hours (2-3 days)

---

**Status:** ⚠️ **CRITICAL ISSUES IDENTIFIED** — Fixes required before production  
**Reviewer:** Scope Guardian  
**Date:** 2025-01-11

