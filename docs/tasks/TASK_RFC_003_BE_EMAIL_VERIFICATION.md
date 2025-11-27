# Task RFC-003-BE: Email Verification Flow (Backend)

**RFC:** RFC-003: Email Verification Flow  
**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Backend Engineer  
**Duration:** 1.5-2 days (9-13 hours)  
**Status:** ⏳ **READY FOR ASSIGNMENT** (Pending email service integration)  
**Priority:** 🔴 **HIGH** — Security best practice

---

## User Story

**As a** user registering on the platform,  
**I want to** verify my email address via email link,  
**So that** I can ensure my account is secure and trusted.

---

## Goal

Implement email verification flow with token-based verification, following the same pattern as password reset (RFC-002), enabling users to verify their email addresses after registration.

---

## Scope (Per RFC-003)

**API Endpoints:**
- `GET /auth/verify-email?token=xxx` — Verify email with token from email link
- `POST /auth/resend-verification` — Resend verification email (requires auth)

**Prisma Schema Changes:**
- Add `emailVerified` boolean field (default: `false`)
- Add `emailVerificationToken` string field (hashed token, nullable)
- Add `emailVerificationTokenExpiry` DateTime field (nullable)

**Registration Flow Update:**
- Generate verification token on registration
- Send verification email on registration
- Set `emailVerified = false` on registration

**⚠️ SCOPE WARNING:** Implement exactly per RFC-003. Follow password reset pattern (RFC-002). No extra endpoints. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] RFC approved ✅ (RFC-003 approved by PM with conditions)
- [x] User story defined ✅ (this document)
- [x] API contract defined ✅ (RFC-003 specifies endpoints)
- [x] Prisma schema ready ⏳ (needs update — part of this task)
- [x] Email service pattern exists ✅ (EmailService exists, needs Resend/SES integration)
- [x] Token hashing pattern exists ✅ (password reset pattern can be reused)
- [x] Dependencies identified ✅ (JWT guard exists, PrismaService exists, AuditLogService exists)
- [x] DoR reviewed and approved ✅

**Status:** ⚠️ **CONDITIONAL** — Requires email service integration (Resend/SES)

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (HttpOnly cookie) — `JwtAuthGuard` already implemented
- **Email Service:** Resend/SES (per spec Section 1)

### Implementation Details

**File Locations:**
- `apps/api/prisma/schema.prisma` (Schema — add 3 fields)
- `apps/api/src/auth/auth.controller.ts` (Controller — add endpoints)
- `apps/api/src/auth/auth.service.ts` (Service — add verification logic)
- `apps/api/src/auth/dto/verify-email.dto.ts` (DTO — request/response)
- `apps/api/src/common/services/email.service.ts` (Email service — add verification email method)

**Endpoints to Implement:**

1. **GET /auth/verify-email?token=xxx**
   - Authentication: Not required (public endpoint)
   - Request: Token in query parameter
   - Response: `{ message: string, verified: boolean }`
   - Errors: 400 Bad Request (invalid token), 401 Unauthorized (expired token)

2. **POST /auth/resend-verification**
   - Authentication: Required (`JwtAuthGuard`)
   - Request: None (user ID from JWT token)
   - Response: `{ message: string }`
   - Errors: 400 Bad Request (already verified), 401 Unauthorized, 429 Throttled

**Verification Logic:**
- Generate cryptographically secure token (32 bytes, hex)
- Hash token before storing (bcrypt, same as password reset)
- Store hashed token and expiry (24 hours)
- Send email with plaintext token (NOT stored)
- Verify token by comparing hash
- Set `emailVerified = true` after verification
- Invalidate token after verification (single-use)
- Audit log verification events

**Registration Flow Update:**
- After user creation, generate verification token
- Send verification email
- Set `emailVerified = false`
- Store hashed token and expiry
- **REQUIRED:** Frontend redirects to `/auth/verify-email` instead of `/onboarding/account-type`
- **REQUIRED:** Onboarding routes are gated behind email verification check

**Security Requirements (Per RFC-003):**
- Tokens must be hashed before storing (never store plaintext)
- Tokens expire after 24 hours
- Tokens are single-use (invalidated after verification)
- Rate limiting for resend verification (3 requests/hour)
- Audit logging for verification events

**Email Service Integration:**
- Use Resend/SES per spec Section 1
- Send verification email on registration
- Send verification email on resend request
- Email template includes verification link with token
- **CRITICAL:** Never log tokens to console/logs

---

## Acceptance Criteria

### GET /auth/verify-email Endpoint
- [ ] Endpoint accepts token in query parameter
- [ ] Validates token (compares hash)
- [ ] Checks token expiry (24 hours)
- [ ] Sets `emailVerified = true` after verification
- [ ] Invalidates token after verification (single-use)
- [ ] Returns success response
- [ ] Returns 400 Bad Request for invalid token
- [ ] Returns 401 Unauthorized for expired token
- [ ] Audit logging works (`EMAIL_VERIFIED`)

### POST /auth/resend-verification Endpoint
- [ ] Endpoint requires authentication (`JwtAuthGuard`)
- [ ] Checks if email already verified (400 if verified)
- [ ] Rate limiting works (3 requests/hour)
- [ ] Generates new verification token
- [ ] Sends verification email
- [ ] Returns success response
- [ ] Returns 400 Bad Request if already verified
- [ ] Returns 401 Unauthorized for invalid token
- [ ] Returns 429 Throttled for rate limit exceeded
- [ ] Audit logging works (`VERIFICATION_EMAIL_RESENT`)

### Registration Flow Update
- [ ] Generates verification token on registration
- [ ] Sends verification email on registration
- [ ] Sets `emailVerified = false` on registration
- [ ] Stores hashed token and expiry

### Prisma Schema Updates
- [ ] `emailVerified` field added (Boolean, default: false)
- [ ] `emailVerificationToken` field added (String, nullable)
- [ ] `emailVerificationTokenExpiry` field added (DateTime, nullable)
- [ ] Migration created and applied successfully

### Email Service Integration
- [ ] Resend/SES integration implemented
- [ ] Verification email sent on registration
- [ ] Verification email sent on resend request
- [ ] Email template includes verification link
- [ ] **CRITICAL:** No tokens logged to console/logs

### Technical Requirements
- [ ] Uses NestJS framework
- [ ] TypeScript compiles without errors
- [ ] Uses Prisma for database queries
- [ ] Uses `JwtAuthGuard` for resend endpoint
- [ ] Uses `RateLimitService` for rate limiting
- [ ] Uses `AuditLogService` for audit logging
- [ ] Follows password reset pattern (RFC-002)

---

## Implementation Steps

1. **Update Prisma Schema**
   - Add 3 fields to User model
   - Run migration: `npx prisma migrate dev --name add_email_verification_fields`
   - Regenerate Prisma client: `npx prisma generate`

2. **Implement Token Generation/Hashing**
   - Reuse password reset token methods from `AuthService`
   - Add `generateEmailVerificationToken()` method
   - Add `hashEmailVerificationToken()` method
   - Add `compareEmailVerificationToken()` method

3. **Implement Email Service Method**
   - Add `sendVerificationEmail()` to `EmailService`
   - Integrate Resend/SES
   - Create email template
   - **CRITICAL:** Never log tokens

4. **Implement Verification Endpoint**
   - Add `GET /auth/verify-email` to `AuthController`
   - Implement token validation
   - Implement expiry check
   - Set `emailVerified = true`
   - Invalidate token
   - Audit log verification

5. **Implement Resend Endpoint**
   - Add `POST /auth/resend-verification` to `AuthController`
   - Use `JwtAuthGuard`
   - Check if already verified
   - Rate limiting (3 requests/hour)
   - Generate new token
   - Send email
   - Audit log resend

6. **Update Registration Flow**
   - Modify `register()` in `AuthService`
   - Generate verification token
   - Send verification email
   - Set `emailVerified = false`

7. **Update OpenAPI Spec**
   - Add `GET /auth/verify-email` endpoint
   - Add `POST /auth/resend-verification` endpoint
   - Update `POST /auth/register` response to include `emailVerified`

8. **Add Rate Limiting**
   - Add `isResendVerificationRateLimited()` to `RateLimitService`
   - Use in resend endpoint

---

## Testing Requirements

### Unit Tests
- [ ] Token generation works
- [ ] Token hashing works
- [ ] Token comparison works
- [ ] Email service method works
- [ ] Rate limiting works

### Integration Tests
- [ ] Verification endpoint works
- [ ] Resend endpoint works
- [ ] Registration sends verification email
- [ ] Token expiry works (24 hours)
- [ ] Token single-use works
- [ ] Rate limiting works

### Security Tests
- [ ] Tokens are hashed (no plaintext in DB)
- [ ] Tokens expire correctly
- [ ] Tokens are single-use
- [ ] No tokens in logs
- [ ] Rate limiting prevents abuse

---

## Dependencies

- ⚠️ **Email Service Integration** — Resend/SES (per PM conditions)
- ✅ `JwtAuthGuard` — Already implemented
- ✅ `PrismaService` — Already implemented
- ✅ `AuditLogService` — Already implemented
- ✅ `RateLimitService` — Already implemented
- ✅ Token hashing pattern — Exists in password reset (RFC-002)

---

## PM Conditions (Pre-Rollout)

1. ✅ Integrate Resend/SES email sending (no token logging)
2. ✅ Implement resend throttling using `RateLimitService`
3. ✅ Expose `emailVerified` flag in auth/user responses

---

## References

- **RFC:** `RFCs/RFC-003-email-verification-flow.md`
- **Password Reset Pattern:** `apps/api/src/auth/auth.service.ts` (RFC-002)
- **Email Service:** `apps/api/src/common/services/email.service.ts`
- **OpenAPI Spec:** `packages/types/openapi.yaml`

---

## Notes

- **Pattern Reuse:** Follow password reset pattern (RFC-002) exactly
- **Email Service:** Must integrate Resend/SES before production
- **Security:** Never log tokens, always hash before storing
- **Timeline:** Can be done in parallel with RFC-004

---

**Created:** 2025-01-11  
**Assigned To:** Backend Engineer  
**Status:** ⏳ **READY FOR ASSIGNMENT** (Pending email service integration)

**⚠️ UPDATE (2025-01-11):** Email verification is now REQUIRED (not optional). Registration flow has been updated to redirect to `/auth/verify-email`. Onboarding routes have been updated to gate access behind email verification check. Frontend implementation complete - backend endpoints needed to complete the flow.

