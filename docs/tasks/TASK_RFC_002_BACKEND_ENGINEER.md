# Task: Implement Forgot/Reset Password API Endpoints (RFC-002)

**RFC:** RFC-002 (Approved)  
**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Backend Engineer  
**Status:** 📋 ASSIGNED

---

## Goal
Implement forgot/reset password API endpoints with security requirements per RFC-002 and Security Guard review.

**Background:** RFC-002 approved — forgot/reset password flow required for M1. OpenAPI spec updated, Prisma schema updated. Implementation required with security requirements.

---

## DoR Checklist (Definition of Ready)
- [x] User story defined ✅
- [x] Wireframe/mock available ✅ (Design Agent delivered mockups — forgot-password.html, reset-password.html)
- [x] API contract defined (OpenAPI) ✅ (Tech Lead designed)
- [x] Prisma schema updated ✅ (passwordResetTokenHash, passwordResetTokenExpiry fields added)
- [x] Error states documented ✅ (OpenAPI spec)
- [x] Dependencies identified ✅ (Email service — Resend/SES per spec)
- [x] DoR reviewed and approved ✅

**Status:** ✅ DoR SATISFIED — All requirements met, ready for implementation

---

## Scope (RFC-002 Endpoints)

Implement forgot/reset password API endpoints per RFC-002 and Tech Lead design:

1. `POST /auth/forgot-password` — Send password reset email
2. `POST /auth/reset-password` — Reset password with token

**Security Requirements (Security Guard):**
- 🔴 **CRITICAL:** Token hashing (use `passwordResetTokenHash`, hash before storing)
- 🔴 **REQUIRED:** Audit logging (log password reset events per Section 11)
- 🟡 **REQUIRED:** Data retention policy (auto-delete expired tokens)

---

## Deliverables

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

## Requirements

### API Endpoint: POST /auth/forgot-password

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Behavior:**
1. Validate email format
2. Check if user exists (don't reveal to caller)
3. Generate secure token (UUID v4 or crypto.randomBytes)
4. **Hash token before storing** (bcrypt/argon2) — 🔴 CRITICAL
5. Store hashed token in `passwordResetTokenHash` field
6. Store token expiry (1 hour from now) in `passwordResetTokenExpiry` field
7. Send email with reset link (plaintext token in email, not stored in DB)
8. **Always return success** (200 OK) — no user enumeration
9. **Rate limiting:** 3 requests/hour per email
10. **Audit logging:** Log password reset request event (per Section 11)

**Error Responses:**
- `400 Bad Request` — Invalid email format
- `429 Throttled` — Rate limit exceeded

### API Endpoint: POST /auth/reset-password

**Request:**
```json
{
  "token": "abc123def456...",
  "newPassword": "newSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful. You can now login with your new password."
}
```

**Behavior:**
1. **Hash provided token** and compare with stored hash (not plaintext comparison)
2. Validate token (hash matches, not expired, not used)
3. Validate password strength (same as registration requirements)
4. Update password (bcrypt/argon2)
5. Invalidate token (single-use: clear `passwordResetTokenHash` and `passwordResetTokenExpiry`)
6. **Rate limiting:** 5 attempts/hour per token
7. **Audit logging:** Log password reset completion event (per Section 11)

**Error Responses:**
- `400 Bad Request` — Invalid token or weak password
- `401 Unauthorized` — Expired or used token
- `429 Throttled` — Rate limit exceeded

---

## Security Requirements (Security Guard)

### 🔴 CRITICAL: Token Hashing

**Requirement:** Never store plaintext tokens in database.

**Implementation:**
```typescript
// Generate token
const token = crypto.randomBytes(32).toString('hex');

// Hash token before storing
const tokenHash = await bcrypt.hash(token, 10);

// Store hashed token (NOT plaintext)
user.passwordResetTokenHash = tokenHash;
user.passwordResetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

// Email plaintext token to user (not stored in DB)
await sendEmail({ resetLink: `/auth/reset-password?token=${token}` });

// Validation: Hash provided token and compare
const isValid = await bcrypt.compare(providedToken, user.passwordResetTokenHash);
```

**Prisma Schema:**
- Use `passwordResetTokenHash` field (String?, hashed token)
- Never use `passwordResetToken` (plaintext) — SECURITY RISK

### 🔴 REQUIRED: Audit Logging

**Requirement:** Log password reset events per Section 11.

**Implementation:**
```typescript
// Log password reset request
await prisma.auditLog.create({
  userId: user.id,
  action: 'PASSWORD_RESET_REQUEST',
  resource: 'User',
  resourceId: user.id,
  details: { email: user.email }, // No token in details
  createdAt: new Date(),
});

// Log password reset completion
await prisma.auditLog.create({
  userId: user.id,
  action: 'PASSWORD_RESET_COMPLETE',
  resource: 'User',
  resourceId: user.id,
  details: { success: true },
  createdAt: new Date(),
});

// Log failed reset attempt
await prisma.auditLog.create({
  userId: null,
  action: 'PASSWORD_RESET_FAILED',
  resource: 'User',
  resourceId: null,
  details: { reason: 'INVALID_TOKEN' }, // No token in details
  createdAt: new Date(),
});
```

**Requirements:**
- Log password reset requests
- Log password reset completions
- Log failed reset attempts
- Never log tokens (hashed or plaintext)

### 🟡 REQUIRED: Data Retention Policy

**Requirement:** Auto-delete expired tokens for PDPA/GDPR compliance.

**Implementation:**
```typescript
// Cleanup job (run daily via cron)
async function cleanupExpiredTokens() {
  const expiredCutoff = new Date(Date.now() - 86400000); // 24 hours ago
  
  await prisma.user.updateMany({
    where: {
      passwordResetTokenExpiry: {
        lt: expiredCutoff,
      },
    },
    data: {
      passwordResetTokenHash: null,
      passwordResetTokenExpiry: null,
    },
  });
}
```

**Policy:**
- **Retention Period:** 24 hours after token expiry
- **Cleanup Frequency:** Daily cron job
- **Compliance:** PDPA/GDPR data retention requirements

---

## Technical Requirements

### Token Generation
- Use UUID v4 or `crypto.randomBytes(32).toString('hex')`
- Cryptographically secure (not predictable)

### Token Hashing
- Use bcrypt or argon2 (same as password hashing)
- Hash tokens before storing in database
- Compare hashed tokens during validation

### Token Expiry
- 1 hour from generation (configurable)
- Server-side validation (check `passwordResetTokenExpiry`)
- Clear fields after expiry or use

### Rate Limiting
- Forgot password: 3 requests/hour per email
- Reset password: 5 attempts/hour per token
- Use Redis or in-memory cache for rate limiting

### Email Integration
- Use Resend/SES per spec Section 1
- Email template: Password reset link with token
- Link format: `/auth/reset-password?token=xxx`
- Token expiry mentioned in email (1 hour)

### Audit Logging
- Log all password reset events (per Section 11)
- Include user ID, timestamp, action type
- Never include tokens in logs

---

## Acceptance Criteria

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
- [ ] OpenAPI spec updated ✅ (Tech Lead already done)
- [ ] Prisma schema updated ✅ (already done)
- [ ] Tech Lead review approved
- [ ] Security Guard review approved
- [ ] Scope Guardian review approved

---

## Dependencies

**Required:**
- Email service (Resend/SES per spec Section 1)
- Prisma schema updated (passwordResetTokenHash, passwordResetTokenExpiry fields)
- OpenAPI spec updated (endpoints defined per Tech Lead design)

**Blocks:**
- M1 frontend work (cannot start without API endpoints)

---

## Timeline

**Estimate:** 1-2 days (implementation + tests + security requirements)

**Tasks:**
1. Implement token generation and hashing
2. Implement `POST /auth/forgot-password` endpoint
3. Implement `POST /auth/reset-password` endpoint
4. Implement audit logging
5. Implement data retention cleanup job
6. Implement rate limiting
7. Implement email sending
8. Write tests (unit, integration, security)
9. Review with Tech Lead
10. Review with Security Guard
11. Review with Scope Guardian

---

## Notes

- **Security is CRITICAL:** Never store plaintext tokens, always hash before storing
- **Audit logging is REQUIRED:** Log all password reset events per Section 11
- **Data retention is REQUIRED:** Auto-delete expired tokens for PDPA/GDPR compliance
- **Rate limiting is REQUIRED:** Prevent abuse and brute force attacks
- **No user enumeration:** Always return success for forgot-password (even if user doesn't exist)

---

## References

- RFC-002: `RFCs/RFC-002-forgot-reset-password.md`
- Security Requirements: `RFC_002_SECURITY_REQUIREMENTS.md`
- OpenAPI Spec: `packages/types/openapi.yaml` (forgot/reset password endpoints)
- Prisma Schema: `apps/api/prisma/schema.prisma` (User model with passwordResetTokenHash)
- Spec Section 11: `visaontrack-v2-spec.md` (security requirements, audit logging)
- DoR Checklist: `TASK_TEMPLATES.md`

---

**Created:** 2025-01-11  
**RFC:** RFC-002 (Approved)  
**Status:** 📋 ASSIGNED TO BACKEND ENGINEER

