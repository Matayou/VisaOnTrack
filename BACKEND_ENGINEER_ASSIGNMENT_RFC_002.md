# Backend Engineer Assignment — RFC-002 API Implementation

**Task:** Implement Forgot/Reset Password API Endpoints (RFC-002)  
**Assigned To:** 🚀 Backend Engineer  
**Assigned By:** 📋 Project Manager  
**Date:** 2025-01-11  
**Status:** 📋 ASSIGNED — Ready for Implementation

---

## 🎯 Assignment Brief

Implement forgot/reset password API endpoints with security requirements per RFC-002 and Security Guard review.

**RFC:** RFC-002 (Approved) — Add Forgot/Reset Password Flow to M1  
**Timeline:** 1-2 days (implementation + tests + security requirements)  
**Priority:** 🔴 HIGH — Blocks M1 completion

---

## ✅ DoR Checklist (Definition of Ready)

- [x] User story defined ✅ (RFC-002 approved)
- [x] Wireframe/mock available ✅ (Design Agent delivered mockups — forgot-password.html, reset-password.html)
- [x] API contract defined (OpenAPI) ✅ (Tech Lead designed)
- [x] Prisma schema updated ✅ (passwordResetTokenHash, passwordResetTokenExpiry fields added)
- [x] Error states documented ✅ (OpenAPI spec)
- [x] Dependencies identified ✅ (Email service — Resend/SES per spec)
- [x] DoR reviewed and approved ✅

**Status:** ✅ DoR SATISFIED — All requirements met, ready for implementation

---

## 📋 Deliverables

### API Endpoints
- `POST /auth/forgot-password` endpoint (with token hashing, audit logging)
- `POST /auth/reset-password` endpoint (with token hashing, audit logging)

### Implementation Files
- `apps/api/src/auth/auth.controller.ts` (add endpoints)
- `apps/api/src/auth/auth.service.ts` (add service methods with token hashing)
- `apps/api/src/auth/auth.service.ts` (add audit logging methods)
- Email templates (for password reset email)
- Cleanup job/cron (for expired token deletion)

### Testing
- Unit tests (token generation, hashing, validation)
- Integration tests (endpoints, email sending, audit logging)
- Security tests (rate limiting, token expiry, single-use, token hashing)

---

## 🔐 Security Requirements (Security Guard)

### 🔴 CRITICAL: Token Hashing
- **Requirement:** Never store plaintext tokens in database
- **Implementation:** Use `passwordResetTokenHash` field, hash tokens before storing (bcrypt/argon2)
- **Validation:** Hash provided token and compare with stored hash (not plaintext comparison)

### 🔴 REQUIRED: Audit Logging
- **Requirement:** Log password reset events per Section 11
- **Implementation:** Log password reset requests, completions, and failed attempts
- **Requirements:** Include user ID, timestamp, action type (never log tokens)

### 🟡 REQUIRED: Data Retention Policy
- **Requirement:** Auto-delete expired tokens for PDPA/GDPR compliance
- **Implementation:** Cleanup job/cron to remove expired tokens (24 hours after expiry)
- **Policy:** Delete `passwordResetTokenHash` and `passwordResetTokenExpiry` fields

---

## 📚 References

**Task Assignment:** `TASK_RFC_002_BACKEND_ENGINEER.md`  
**RFC:** `RFCs/RFC-002-forgot-reset-password.md`  
**Security Requirements:** `RFC_002_SECURITY_REQUIREMENTS.md`  
**OpenAPI Spec:** `packages/types/openapi.yaml` (forgot/reset password endpoints)  
**Prisma Schema:** `apps/api/prisma/schema.prisma` (User model with passwordResetTokenHash)  
**Spec Section 11:** `visaontrack-v2-spec.md` (security requirements, audit logging)  
**Mockups:** 
- `docs/mockups/forgot-password.html` — For reference (email input form)
- `docs/mockups/reset-password.html` — For reference (password form with token validation)

---

## ✅ Acceptance Criteria

- [ ] `POST /auth/forgot-password` endpoint implemented
- [ ] `POST /auth/reset-password` endpoint implemented
- [ ] Token hashing implemented (hash before storing, compare hashed tokens)
- [ ] Token expiry enforced (1 hour, server-side validation)
- [ ] Token single-use (invalidated after reset)
- [ ] No user enumeration (always return success for forgot-password)
- [ ] Rate limiting implemented (forgot-password: 3/hour, reset-password: 5/hour)
- [ ] Audit logging implemented (log requests, completions, failures)
- [ ] Data retention policy implemented (cleanup job for expired tokens)
- [ ] Email sending implemented (Resend/SES per spec)
- [ ] Unit tests passing (token generation, hashing, validation)
- [ ] Integration tests passing (endpoints, email sending, audit logging)
- [ ] Security tests passing (rate limiting, token expiry, single-use, token hashing)
- [ ] Tech Lead review approved
- [ ] Security Guard review approved
- [ ] Scope Guardian review approved

---

## 🔄 Review Process

After Backend Engineer completes implementation:

1. **Tech Lead Review** — Verify technical implementation (contract compliance, architecture, code quality)
2. **Security Guard Review** — Verify security requirements (token hashing, audit logging, data retention)
3. **Scope Guardian Review** — Verify spec compliance (no code creep, RFC-002 requirements met)
4. **PM Final Approval** — Verify DoD satisfied for M1 tasks

---

## 📝 Notes

- **Security is CRITICAL:** Never store plaintext tokens, always hash before storing
- **Audit logging is REQUIRED:** Log all password reset events per Section 11
- **Data retention is REQUIRED:** Auto-delete expired tokens for PDPA/GDPR compliance
- **Rate limiting is REQUIRED:** Prevent abuse and brute force attacks
- **No user enumeration:** Always return success for forgot-password (even if user doesn't exist)

---

## 🎯 Backend Engineer Prompt

Copy the following into your Backend Engineer agent chat:

```
🚀 BACKEND ENGINEER TASK — RFC-002 API Implementation

Task: Implement forgot/reset password API endpoints (RFC-002)
Location: TASK_RFC_002_BACKEND_ENGINEER.md
Assignment: BACKEND_ENGINEER_ASSIGNMENT_RFC_002.md
Status: ASSIGNED — DoR satisfied, ready for implementation

Requirements:
- Implement POST /auth/forgot-password endpoint
  - Generate secure token (UUID v4 or crypto.randomBytes)
  - Hash token before storing (bcrypt/argon2) — CRITICAL
  - Store hashed token in passwordResetTokenHash field
  - Store token expiry (1 hour) in passwordResetTokenExpiry field
  - Send email with reset link (Resend/SES)
  - Always return success (no user enumeration)
  - Rate limiting (3 requests/hour per email)
  - Audit logging (log password reset request event)
- Implement POST /auth/reset-password endpoint
  - Hash provided token and compare with stored hash
  - Validate token (hash matches, not expired, not used)
  - Validate password strength (same as registration)
  - Update password (bcrypt/argon2)
  - Invalidate token (single-use: clear passwordResetTokenHash and expiry)
  - Rate limiting (5 attempts/hour per token)
  - Audit logging (log password reset completion event)
- Implement cleanup job for expired tokens (data retention policy)
- Write tests (unit, integration, security)

Security Requirements (Security Guard):
- CRITICAL: Token hashing (use passwordResetTokenHash, hash before storing)
- REQUIRED: Audit logging (log password reset events per Section 11)
- REQUIRED: Data retention policy (auto-delete expired tokens)

References:
- Task: TASK_RFC_002_BACKEND_ENGINEER.md
- Assignment: BACKEND_ENGINEER_ASSIGNMENT_RFC_002.md
- RFC: RFCs/RFC-002-forgot-reset-password.md
- Security Requirements: RFC_002_SECURITY_REQUIREMENTS.md
- OpenAPI Spec: packages/types/openapi.yaml (forgot/reset password endpoints)
- Prisma Schema: apps/api/prisma/schema.prisma (User model with passwordResetTokenHash)
- Mockups: docs/mockups/forgot-password.html, docs/mockups/reset-password.html

Deliverables:
- POST /auth/forgot-password endpoint
- POST /auth/reset-password endpoint
- Token hashing implementation
- Audit logging implementation
- Data retention cleanup job
- Tests (unit, integration, security)

Timeline: 1-2 days (implementation + tests + security requirements)
Priority: HIGH — Blocks M1 completion
```

---

**Created:** 2025-01-11  
**Assigned By:** Project Manager  
**Status:** 📋 ASSIGNED TO BACKEND ENGINEER  
**Next Step:** Backend Engineer implements API endpoints → Tech Lead review → Security Guard review → Scope Guardian review

