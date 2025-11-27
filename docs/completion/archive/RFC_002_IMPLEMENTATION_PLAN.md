# RFC-002 Implementation Plan — Forgot/Reset Password Flow

**Status:** ✅ RFC APPROVED (Tech Lead) — Implementation Ready  
**Priority:** 🔴 HIGH — Blocks M1 completion  
**RFC:** RFCs/RFC-002-forgot-reset-password.md

---

## ✅ Review Status

### Completed Reviews:
- ✅ **Scope Guardian:** APPROVED — Password reset essential for MVP
- ✅ **Tech Lead:** APPROVED — API contract designed and secure
- ✅ **Security Guard:** APPROVED WITH REQUIRED CHANGES — Security requirements met, changes required

### Pending:
- ⏳ Security Guard review (security requirements)
- ⏳ Final RFC approval (after Security Guard)
- ⏳ Implementation tasks (spec update, API, mockups, schema)

---

## 📋 Implementation Tasks

### Task 1: Security Guard Review (IMMEDIATE)

**Copy this into your Security Guard agent chat:**

```
🔒 SECURITY GUARD REVIEW — RFC-002 Security

RFC: RFC-002 — Add Forgot/Reset Password Flow to M1
Location: RFCs/RFC-002-forgot-reset-password.md
Status: APPROVED by Tech Lead

Previous Reviews:
✅ Scope Guardian: APPROVED (password reset essential for MVP)
✅ Tech Lead: APPROVED (API contract designed and secure)

Task: Review security requirements for password reset flow

Review Checklist:

Security Requirements:
- [ ] Token generation is cryptographically secure
- [ ] Token expiry is reasonable (1 hour recommended)
- [ ] Token is single-use (invalidated after reset)
- [ ] No user enumeration (always return success for forgot-password)
- [ ] Rate limiting on forgot-password endpoint (prevent abuse)
- [ ] Rate limiting on reset-password endpoint (prevent brute force)
- [ ] Password strength validation on reset
- [ ] Token stored securely (hashed or encrypted if in DB)
- [ ] HTTPS required (tokens in URL)
- [ ] Email sent securely (HTTPS links)

Compliance:
- [ ] PDPA/GDPR compliance (token expiry, data retention)
- [ ] Security best practices followed
- [ ] Audit logging (password reset events logged?)
- [ ] No sensitive data in logs (tokens not logged)

Implementation Security:
- [ ] Token generation method (UUID v4 or crypto.randomBytes)
- [ ] Token storage (database vs in-memory cache)
- [ ] Token expiry enforcement (server-side validation)
- [ ] Password hashing (bcrypt/argon2 per existing auth)
- [ ] Email security (no tokens in plaintext email if possible)

Review Document: RFCs/RFC-002-forgot-reset-password.md

Focus: Security requirements, compliance, best practices
```

---

### Task 2: Update Spec Section 2 (After RFC Approval)

**Assigned To:** PM (with Scope Guardian approval)

**Actions:**
1. Add routes to spec Section 2:
   - `/auth/forgot-password` → `forgot-password.html`
   - `/auth/reset-password?token=xxx` → `reset-password.html`
2. Update `visaontrack-v2-spec.md` Section 2 with new routes
3. Verify spec links point to mockups (after mockups created)

**Files to Update:**
- `visaontrack-v2-spec.md` (Section 2: App Structure & Routes)

---

### Task 3: Update OpenAPI Spec (After Security Guard Approval)

**Assigned To:** Backend Engineer (per Tech Lead design)

**Actions:**
1. Add `POST /auth/forgot-password` endpoint
   - Request: `{ email: string }`
   - Response: `200 OK` (always success for security)
   - Error: `400 Bad Request` (invalid email format)
2. Add `POST /auth/reset-password` endpoint
   - Request: `{ token: string, newPassword: string }`
   - Response: `200 OK` (password reset successful)
   - Error: `400 Bad Request` (invalid token or weak password)
   - Error: `401 Unauthorized` (expired token)
3. Define request/response schemas
4. Document error responses
5. Version bump: `v0.2.0` → `v0.2.1` (minor bump for new endpoints)

**Files to Update:**
- `packages/types/openapi.yaml`

**Reference:**
- Tech Lead API contract design (per Tech Lead review)

---

### Task 4: Update Prisma Schema (After Security Guard Approval)

**Assigned To:** Backend Engineer

**Actions:**
1. Add `passwordResetTokenHash` field to User model
   - Type: `String?` (optional)
   - Purpose: Store **hashed** reset token (SECURITY: Never store plaintext tokens)
   - **SECURITY REQUIREMENT:** Hash tokens before storing (bcrypt/argon2)
2. Add `passwordResetTokenExpiry` field to User model
   - Type: `DateTime?` (optional)
   - Purpose: Store token expiry time
3. Create migration: `npx prisma migrate dev --name add_password_reset_fields`
4. Generate Prisma client: `npx prisma generate`

**Files to Update:**
- `apps/api/prisma/schema.prisma`

**Migration Notes:**
- Fields are optional (nullable)
- No data loss (existing users unaffected)
- Migration is reversible

**Security Guard Required Changes:**
- 🔴 **CRITICAL:** Use `passwordResetTokenHash` (hashed) instead of `passwordResetToken` (plaintext)
- Hash tokens before storing in database (bcrypt/argon2)
- Never store plaintext tokens in database

---

### Task 5: Create Mockups (After RFC Approval)

**Assigned To:** Design Agent

**Actions:**
1. Create `forgot-password.html`
   - Email input field (44px height, validation)
   - "Send reset link" button (primary, gradient)
   - Success state (email sent message)
   - Error state (email format validation)
   - Link back to login
   - Trust messaging (security note)
   - Design matches existing auth pages (login.html style)
2. Create `reset-password.html`
   - Token input field (hidden, from URL query param)
   - New password field (44px, strength indicator like register.html)
   - Confirm password field (44px, match validation)
   - "Reset password" button (primary, gradient)
   - Success state (password reset, redirect to login)
   - Error state (invalid/expired token, weak password)
   - Token validation message
   - Design matches existing auth pages

**Files to Create:**
- `docs/mockups/forgot-password.html`
- `docs/mockups/reset-password.html`

**Reference:**
- `login.html` (for styling consistency)
- `register.html` (for password strength indicator)
- `ELITE_DESIGN_SYSTEM.md` (for design tokens)

**Timeline:** 1 day (2 mockups)

---

### Task 6: Implement API Endpoints (After Schema Update)

**Assigned To:** Backend Engineer

**Actions:**
1. Implement `POST /auth/forgot-password` endpoint
   - Generate secure token (UUID v4 or crypto.randomBytes)
   - **Hash token before storing** (bcrypt/argon2) — 🔴 SECURITY REQUIREMENT
   - Store **hashed token** and expiry in User model (`passwordResetTokenHash`)
   - Send email with reset link (Resend/SES)
   - Always return success (no user enumeration)
   - Rate limiting (e.g., 3 requests/hour per email)
   - **Audit logging:** Log password reset request event (per Section 11)
2. Implement `POST /auth/reset-password` endpoint
   - **Hash provided token** and compare with stored hash (not plaintext comparison)
   - Validate token (hash matches, not expired, not used)
   - Validate password strength (same as registration)
   - Update password (bcrypt/argon2)
   - Invalidate token (single-use: clear `passwordResetTokenHash` and expiry)
   - Rate limiting (e.g., 5 attempts/hour per token)
   - **Audit logging:** Log password reset completion event (per Section 11)
3. Email integration (Resend/SES per spec)
4. Error handling (user-friendly messages)
5. **Data retention policy:** Auto-delete expired tokens (cleanup job/cron)

**Security Guard Required Changes:**
- 🔴 **CRITICAL:** Hash tokens before storing (use `passwordResetTokenHash` field)
- 🔴 **REQUIRED:** Audit logging for password reset requests and completions
- 🟡 **REQUIRED:** Data retention policy (auto-delete expired tokens)
- ✅ **Low Priority:** Document token exclusion from logs (no sensitive data)

**Files to Create/Update:**
- `apps/api/src/auth/auth.controller.ts` (add endpoints)
- `apps/api/src/auth/auth.service.ts` (add service methods with token hashing)
- `apps/api/src/auth/auth.service.ts` (add audit logging methods)
- Email templates (for password reset email)
- Cleanup job/cron (for expired token deletion)

**Testing:**
- Unit tests (token generation, hashing, validation)
- Integration tests (endpoints, email sending, audit logging)
- Security tests (rate limiting, token expiry, single-use, token hashing)

**Timeline:** 1-2 days (implementation + tests + security changes)

---

## 🔄 Implementation Sequence

1. ⏳ **Security Guard Review** (IMMEDIATE — Step 1)
   - Review security requirements
   - Approve RFC-002
2. ✅ **RFC-002 Approval** (After Security Guard)
   - Mark RFC-002 as APPROVED
   - Update RFC registry
3. ✅ **Update Spec Section 2** (PM)
   - Add routes to spec
   - Link to mockups (after mockups created)
4. ✅ **Update OpenAPI Spec** (Backend Engineer)
   - Add endpoints per Tech Lead design
   - Version bump to v0.2.1
5. ✅ **Update Prisma Schema** (Backend Engineer)
   - Add reset token fields
   - Create migration
6. ✅ **Create Mockups** (Design Agent)
   - forgot-password.html
   - reset-password.html
7. ✅ **Implement API Endpoints** (Backend Engineer)
   - POST /auth/forgot-password
   - POST /auth/reset-password
   - Tests
8. ✅ **Final Review** (Multi-agent)
   - Tech Lead: API implementation review
   - Scope Guardian: Spec compliance review
   - QA Engineer: Security testing

---

## 📊 Status Tracking

### Current Status:
- [x] RFC-002 created ✅
- [x] Scope Guardian review ✅ APPROVED
- [x] Tech Lead review ✅ APPROVED
- [x] Security Guard review ✅ APPROVED WITH REQUIRED CHANGES
- [x] RFC-002 final approval ✅ APPROVED
- [ ] Spec Section 2 update ⏳ PENDING
- [ ] OpenAPI spec update ⏳ PENDING
- [ ] Prisma schema update ⏳ PENDING (with token hashing)
- [ ] Mockups creation ⏳ PENDING
- [ ] API implementation ⏳ PENDING (with token hashing, audit logging, data retention)
- [ ] Final review ⏳ PENDING

### Security Guard Required Changes:
- 🔴 **CRITICAL:** Token hashing (use `passwordResetTokenHash`, hash before storing)
- 🔴 **REQUIRED:** Audit logging (log password reset events per Section 11)
- 🟡 **REQUIRED:** Data retention policy (auto-delete expired tokens)
- ✅ **Low Priority:** Document token exclusion from logs

**See:** `RFC_002_SECURITY_REQUIREMENTS.md` for detailed implementation checklist

---

## 🎯 Next Immediate Action

**RFC-002 is now APPROVED with required security changes!**

**Implementation can begin with these tasks:**

1. ✅ **Update Spec Section 2** — Add routes (PM)
2. ✅ **Update OpenAPI Spec** — Add endpoints per Tech Lead design (Backend Engineer)
3. ✅ **Update Prisma Schema** — Add `passwordResetTokenHash` and `passwordResetTokenExpiry` fields (Backend Engineer)
4. ✅ **Create Mockups** — Design Agent creates `forgot-password.html` and `reset-password.html`
5. ✅ **Implement API** — Backend Engineer implements endpoints with:
   - Token hashing (🔴 CRITICAL requirement)
   - Audit logging (🔴 REQUIRED for Section 11)
   - Data retention policy (🟡 REQUIRED for PDPA/GDPR)

**Security Guard Required Changes (must be implemented):**
- See `RFC_002_SECURITY_REQUIREMENTS.md` for detailed checklist
- Token hashing implementation (required before production)
- Audit logging implementation (required for Section 11 compliance)
- Data retention policy (required for PDPA/GDPR compliance)

---

**Priority:** 🔴 HIGH — Blocks M1 completion  
**Status:** ✅ RFC APPROVED WITH REQUIRED CHANGES (Security Guard)  
**Next Step:** Begin implementation with security requirements included

