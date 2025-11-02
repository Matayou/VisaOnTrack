# Mockup Review — CRITICAL GAPS IDENTIFIED

**Review Date:** 2025-01-11  
**Status:** 🚨 CRITICAL GAPS FOUND  
**Priority:** HIGH — Blocking M1 approval

---

## 🚨 CRITICAL GAP #1: Forgot/Reset Password Flow

### Problem
**Forgot password and reset password pages are MISSING from:**
1. ❌ Spec Section 2 (routes)
2. ❌ OpenAPI spec (API endpoints)
3. ❌ Mockups delivered
4. ✅ Login page has "forgot password" link (but no page exists!)

### Evidence

#### Spec Section 2 (Routes):
```markdown
**Landing & Auth**
- `/` (landing)
- `/auth/login`
- `/auth/register`
- `/auth/register/simple`
```
**Missing:** `/auth/forgot-password` or `/auth/reset-password`

#### OpenAPI Spec:
```yaml
paths:
  /auth/login:
    post:
      summary: Login user
```
**Missing:** `/auth/forgot-password` and `/auth/reset-password` endpoints

#### Mockups Delivered:
- ✅ `login.html` — has "Forgot password?" link
- ❌ `forgot-password.html` — MISSING
- ❌ `reset-password.html` — MISSING

#### Login Page Analysis:
The `login.html` mockup includes:
- "Forgot password?" link (line ~XXX)
- But clicking it would lead to a non-existent page

### Impact Assessment

**Severity:** 🔴 **CRITICAL** (HIGH)

**Why This Is Critical:**
1. **User Experience:** Users will click "forgot password" link and hit a 404
2. **Security:** Password reset is a standard security practice
3. **Production Readiness:** MVP cannot launch without password reset
4. **User Trust:** Missing password reset undermines trust in platform
5. **Industry Standard:** Every production app has password reset

**Is This Normal?**
- ❌ **NO** — Forgot/reset password is standard for production apps
- ❌ **NO** — This is a critical gap in M1 coverage
- ✅ **YES** — This should be part of M1 (Auth & Onboarding)

### Required Resolution

**Action Required:**
1. **RFC to add forgot/reset password to spec** (if not already planned)
2. **Add OpenAPI endpoints** (`POST /auth/forgot-password`, `POST /auth/reset-password`)
3. **Create mockups** (`forgot-password.html`, `reset-password.html`)
4. **Update Prisma schema** (if reset tokens needed)

**Standard Flow:**
1. `/auth/forgot-password` — Enter email
2. Email sent with reset token
3. `/auth/reset-password?token=xxx` — Enter new password
4. Password reset complete

---

## 📋 M1 Coverage Comprehensive Review

### M1 Scope (per spec Section 2):
**Auth & Onboarding:**
- ✅ `/` (landing) — delivered
- ✅ `/auth/login` — delivered
- ✅ `/auth/register` — delivered
- ✅ `/auth/register/simple` — delivered
- ❌ **MISSING:** `/auth/forgot-password`
- ❌ **MISSING:** `/auth/reset-password`
- ✅ `/onboarding/account-type` — delivered
- ✅ `/onboarding/seeker/welcome` — delivered
- ✅ `/onboarding/provider/welcome` — delivered
- ✅ `/onboarding/provider/business` — delivered
- ✅ `/onboarding/provider/services` — delivered
- ✅ `/onboarding/provider/credentials` — delivered
- ✅ `/onboarding/provider/credentials/complete` — delivered
- ✅ `/onboarding/provider/payouts` — delivered

### M1 Coverage Assessment:
- **Routes Delivered:** 12/14 (86%)
- **Critical Gaps:** 2 routes (forgot/reset password)
- **Status:** ⚠️ **INCOMPLETE** (missing critical auth flow)

---

## 🔍 Additional Potential Gaps

### 1. Email Verification
**Question:** Do users verify their email after registration?
- **Check Spec:** Is email verification in spec?
- **Check OpenAPI:** Is there an endpoint?
- **Check Mockups:** Is there a verification page?

### 2. Account Activation
**Question:** Are there account activation steps?
- **Provider Accounts:** Do they need admin approval before activation?
- **Seeker Accounts:** Are they activated immediately?

### 3. Terms of Service / Privacy Policy
**Question:** Are legal pages required for MVP?
- **Registration:** Users accept terms during registration
- **Legal Pages:** Are `/terms` and `/privacy` needed for MVP?

### 4. Error States
**Question:** Are all error states covered?
- **404 Pages:** What happens on invalid routes?
- **500 Pages:** What happens on server errors?
- **Offline State:** What happens when API is down?

### 5. Email Confirmations
**Question:** Are confirmation emails covered in design?
- **Registration Confirmation:** Email sent after registration?
- **Password Reset Email:** Email sent with reset link?
- **Email Templates:** Are email templates part of M1?

---

## ✅ Verification Checklist

### Auth Flow Completeness:
- [x] Landing page
- [x] Login page
- [x] Register page (full)
- [x] Register page (simple)
- [ ] **FORGOT PASSWORD PAGE** ❌ MISSING
- [ ] **RESET PASSWORD PAGE** ❌ MISSING
- [x] Account type selection
- [x] Onboarding flows

### API Endpoints Completeness:
- [x] POST /auth/login
- [x] POST /auth/register (implied)
- [ ] **POST /auth/forgot-password** ❌ MISSING
- [ ] **POST /auth/reset-password** ❌ MISSING

### Data Model Completeness:
- [x] User model (has email, password)
- [ ] **Password reset token field?** ⚠️ NEEDS VERIFICATION
- [ ] **Password reset token expiry?** ⚠️ NEEDS VERIFICATION

---

## 📊 Critical Gaps Summary

### 🔴 CRITICAL GAPS (MUST FIX):
1. ❌ **Forgot Password Page** — missing mockup
2. ❌ **Reset Password Page** — missing mockup
3. ❌ **POST /auth/forgot-password** — missing API endpoint
4. ❌ **POST /auth/reset-password** — missing API endpoint

### ⚠️ POTENTIAL GAPS (NEEDS VERIFICATION):
1. ⚠️ Email verification flow
2. ⚠️ Account activation flow
3. ⚠️ Legal pages (terms, privacy)
4. ⚠️ Error pages (404, 500)
5. ⚠️ Email templates

---

## 🎯 Proposed Resolutions

### Resolution #1: Forgot/Reset Password (CRITICAL)

**Problem:** Forgot/reset password flow is missing from spec, API, and mockups

**Proposal:**
1. **RFC to add forgot/reset password to spec Section 2**
   - Add `/auth/forgot-password` route
   - Add `/auth/reset-password` route
2. **Update OpenAPI spec**
   - Add `POST /auth/forgot-password` endpoint
   - Add `POST /auth/reset-password` endpoint
3. **Create mockups**
   - `forgot-password.html` (enter email)
   - `reset-password.html` (enter new password with token)
4. **Update Prisma schema** (if needed)
   - Add `passwordResetToken` field to User model
   - Add `passwordResetTokenExpiry` field to User model

**Timeline:** 1-2 days (spec update + mockups + API endpoints)

**Priority:** 🔴 **CRITICAL** (M1 cannot launch without this)

### Resolution #2: Email Verification (If Required)

**Problem:** May need email verification after registration

**Proposal:**
1. Check spec for email verification requirement
2. If required, add routes and mockups
3. If not required for MVP, document as post-MVP

**Timeline:** TBD (depends on spec requirement)

**Priority:** ⚠️ **MEDIUM** (if required, must be part of M1)

---

## 🔄 Action Items

### Immediate (Blocking M1):
1. ✅ **PM:** Identify critical gaps (THIS DOCUMENT)
2. ⏳ **Scope Guardian:** Verify if forgot/reset password is in spec (check all sections)
3. ⏳ **Tech Lead:** Add forgot/reset password to OpenAPI spec
4. ⏳ **Design Agent:** Create forgot/reset password mockups
5. ⏳ **Backend Engineer:** Add password reset token fields to Prisma schema (if needed)

### Verification (Non-Blocking):
1. ⏳ Verify email verification requirements
2. ⏳ Verify account activation flow
3. ⏳ Verify legal pages requirement
4. ⏳ Verify error pages requirement
5. ⏳ Verify email templates requirement

---

## 📝 Updated M1 Coverage Assessment

### Original Assessment:
- **Coverage:** ✅ 100% (12/12 routes)
- **Status:** ✅ COMPLETE

### Corrected Assessment:
- **Coverage:** ⚠️ 86% (12/14 routes — missing forgot/reset)
- **Critical Gaps:** 2 routes (forgot/reset password)
- **Status:** ⚠️ **INCOMPLETE** (missing critical auth flow)

### Blocking Status:
- 🚨 **M1 BLOCKED** — Cannot approve without forgot/reset password flow
- 🚨 **MVP BLOCKED** — Cannot launch without password reset

---

## 🎯 Final Recommendation

### For M1 Approval:
1. **DO NOT APPROVE** without forgot/reset password flow
2. **CREATE RFC** to add forgot/reset password to spec
3. **UPDATE OPENAPI** with forgot/reset password endpoints
4. **CREATE MOCKUPS** for forgot/reset password pages
5. **VERIFY OTHER GAPS** (email verification, etc.)

### For MVP Launch:
**Password reset is NON-NEGOTIABLE.**
- Every production app has password reset
- Users expect it
- Security best practice
- Industry standard

---

**Status:** 🚨 **CRITICAL GAPS IDENTIFIED**  
**Recommendation:** 🚫 **DO NOT APPROVE M1** until forgot/reset password flow is added  
**Priority:** 🔴 **HIGH** — This blocks M1 completion

