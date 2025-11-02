# RFC-002: Add Forgot/Reset Password Flow to M1

## Problem
The forgot/reset password flow is missing from the specification, API, and mockups, but the login page includes a "Forgot password?" link. Users clicking this link will encounter a 404 error, and the MVP cannot launch without password reset functionality. This is a critical gap in M1 (Auth & Onboarding) coverage.

**Current State:**
- Login page has "Forgot password?" link (line 535 in `login.html`)
- No forgot password page exists (`forgot-password.html` — missing)
- No reset password page exists (`reset-password.html` — missing)
- Spec Section 2 does not include `/auth/forgot-password` or `/auth/reset-password` routes
- OpenAPI spec does not include `POST /auth/forgot-password` or `POST /auth/reset-password` endpoints
- Prisma schema may not include password reset token fields

**Impact:**
- ❌ **CRITICAL** — M1 cannot launch without password reset
- ❌ **CRITICAL** — User experience broken (404 on forgot password click)
- ❌ **CRITICAL** — Security best practice missing
- ❌ **CRITICAL** — Industry standard feature missing

## Proposal
Add complete forgot/reset password flow to M1 scope:

**Routes (Spec Section 2):**
1. `/auth/forgot-password` → `forgot-password.html` (enter email)
2. `/auth/reset-password?token=xxx` → `reset-password.html` (enter new password)

**API Endpoints (OpenAPI spec):**
1. `POST /auth/forgot-password` — Send password reset email
2. `POST /auth/reset-password` — Reset password with token

**Mockups:**
1. `forgot-password.html` — Email input form
2. `reset-password.html` — New password form with token validation

**Prisma Schema (if needed):**
- Add `passwordResetTokenHash` field to User model (optional, string) — **SECURITY: Hashed token, not plaintext**
- Add `passwordResetTokenExpiry` field to User model (optional, DateTime)
- Add `AuditLog` entries for password reset events (per Section 11 compliance)

**Standard Flow:**
1. User clicks "Forgot password?" on login page
2. User enters email on `/auth/forgot-password` page
3. API sends email with reset token link
4. User clicks link → `/auth/reset-password?token=xxx`
5. User enters new password
6. API validates token and resets password
7. User redirected to login page with success message

## Impact
- **Scope:** Adds 2 routes, 2 API endpoints, 2 mockups to M1
- **Breaking Changes:** No (new features)
- **Dependencies:** Email service (Resend/SES per spec Section 1)
- **Timeline:** 2-3 days (spec update, API endpoints, mockups, schema update)

**Risk:**
- Low — Standard password reset flow
- Email service already specified in architecture
- Token-based reset is industry standard

## Rollout
- **Feature Flag:** N/A (core auth feature)
- **Migration:** N/A (adds fields, doesn't modify existing data)
- **Rollback Plan:** Can disable forgot password link if issues occur

**Tasks:**
1. Update spec Section 2 with forgot/reset password routes
2. Add OpenAPI endpoints (`POST /auth/forgot-password`, `POST /auth/reset-password`)
3. Create mockups (`forgot-password.html`, `reset-password.html`)
4. Update Prisma schema (add `passwordResetTokenHash` and `passwordResetTokenExpiry` fields)
5. Implement token hashing (hash tokens before storing in DB)
6. Implement audit logging (log password reset requests and completions)
7. Implement data retention policy (auto-delete expired tokens)
8. Tech Lead review (API contract)
9. Scope Guardian review (spec compliance)
10. Security Guard review (security requirements)
11. QA review (security testing)

## Decision
[x] Approved [ ] Rejected [ ] Deferred

**Decision Date:** 2025-01-11  
**Decided By:** Security Guard (Final Approval)

**Decision Reason:** Security requirements met with required changes. API contract design is secure. Required changes: (1) Token hashing — use `passwordResetTokenHash` instead of plaintext token, (2) Audit logging — log password reset events per Section 11, (3) Data retention policy — auto-delete expired tokens for PDPA/GDPR compliance. Implementation blockers: Token hashing (required before production), Audit logging (required for Section 11 compliance), Data retention policy (required for PDPA/GDPR compliance).

---

**Status:** ✅ APPROVED WITH REQUIRED CHANGES (Security Guard)

**Reviewers:**
- ✅ Scope Guardian — APPROVED (password reset essential for MVP)
- ✅ Tech Lead — APPROVED (API contract designed)
- ✅ Security Guard — APPROVED WITH REQUIRED CHANGES (security requirements met, changes required)
- ✅ PM — APPROVED (timeline acceptable: 2-3 days)

**Security Guard Required Changes:**
1. 🔴 **CRITICAL** — Token hashing: Use `passwordResetTokenHash` instead of `passwordResetToken` (hash tokens before storing)
2. 🔴 **REQUIRED** — Audit logging: Log password reset requests and completions per Section 11
3. 🟡 **REQUIRED** — Data retention policy: Specify auto-delete policy for expired tokens (PDPA/GDPR compliance)
4. ✅ **Low Priority** — Document token exclusion from logs (no sensitive data in logs)

---

**Priority:** 🔴 **HIGH** — This blocks M1 completion  
**Severity:** 🔴 **CRITICAL** — MVP cannot launch without password reset

