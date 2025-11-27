# RFC-002 Security Requirements — Implementation Checklist

**RFC:** RFC-002 — Add Forgot/Reset Password Flow to M1  
**Status:** ✅ APPROVED WITH REQUIRED CHANGES (Security Guard)  
**Date:** 2025-01-11

---

## ✅ Security Guard Approval Status

**Decision:** ✅ APPROVED WITH REQUIRED CHANGES

**Requirements Met:**
- ✅ Token generation is cryptographically secure
- ✅ Token expiry is reasonable (1 hour recommended)
- ✅ Token is single-use (invalidated after reset)
- ✅ No user enumeration (always return success for forgot-password)
- ✅ Rate limiting specified (forgot-password and reset-password endpoints)
- ✅ Password strength validation on reset
- ✅ HTTPS required (tokens in URL)
- ✅ Email sent securely (HTTPS links)
- ✅ PDPA/GDPR compliance considered

**Required Changes:**
1. 🔴 **CRITICAL** — Token hashing (use `passwordResetTokenHash` instead of plaintext)
2. 🔴 **REQUIRED** — Audit logging (password reset events per Section 11)
3. 🟡 **REQUIRED** — Data retention policy (auto-delete expired tokens)
4. ✅ **Low Priority** — Document token exclusion from logs

---

## 🔴 CRITICAL REQUIREMENT #1: Token Hashing

### Problem
Tokens must be hashed before storing in database. Plaintext tokens in database are a security risk.

### Solution
- Use `passwordResetTokenHash` field (not `passwordResetToken`)
- Hash tokens before storing (bcrypt/argon2)
- Compare hashed tokens during validation (not plaintext)

### Implementation

#### Prisma Schema:
```prisma
model User {
  // ... existing fields ...
  passwordResetTokenHash String?  // Hashed token (never plaintext)
  passwordResetTokenExpiry DateTime?
}
```

#### API Implementation:
```typescript
// Generate token
const token = crypto.randomBytes(32).toString('hex');

// Hash token before storing
const tokenHash = await bcrypt.hash(token, 10);

// Store hashed token
user.passwordResetTokenHash = tokenHash;
user.passwordResetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

// Email plaintext token to user (not stored in DB)
await sendEmail({ resetLink: `/auth/reset-password?token=${token}` });

// Validation: Hash provided token and compare
const isValid = await bcrypt.compare(providedToken, user.passwordResetTokenHash);
```

### Security Benefits
- Tokens cannot be read from database (hashed)
- Even if database is compromised, tokens are secure
- Industry best practice (never store plaintext sensitive data)

---

## 🔴 REQUIRED REQUIREMENT #2: Audit Logging

### Problem
Password reset events must be logged per Section 11 (security compliance).

### Solution
- Log password reset requests (`AuditLog` entry)
- Log password reset completions (`AuditLog` entry)
- Log failed reset attempts (invalid token, expired token)
- Include user ID, timestamp, action type

### Implementation

#### AuditLog Schema (already exists per spec):
```prisma
model AuditLog {
  id        String   @id @default(uuid())
  adminId   String?  // null for user actions
  userId    String?  // User who performed action
  action    String   // e.g., "PASSWORD_RESET_REQUEST", "PASSWORD_RESET_COMPLETE"
  resource  String   // e.g., "User"
  resourceId String? // User ID
  details   Json?    // Additional details (no sensitive data)
  createdAt DateTime @default(now())
}
```

#### API Implementation:
```typescript
// Log password reset request
await auditLog.create({
  userId: user.id,
  action: 'PASSWORD_RESET_REQUEST',
  resource: 'User',
  resourceId: user.id,
  details: { email: user.email }, // No token in details
  createdAt: new Date(),
});

// Log password reset completion
await auditLog.create({
  userId: user.id,
  action: 'PASSWORD_RESET_COMPLETE',
  resource: 'User',
  resourceId: user.id,
  details: { success: true },
  createdAt: new Date(),
});

// Log failed reset attempt
await auditLog.create({
  userId: null, // Unknown user
  action: 'PASSWORD_RESET_FAILED',
  resource: 'User',
  resourceId: null,
  details: { reason: 'INVALID_TOKEN' }, // No token in details
  createdAt: new Date(),
});
```

### Compliance Benefits
- Section 11 compliance (audit logging for security events)
- Track password reset activity
- Security incident investigation support
- No sensitive data in logs (tokens excluded)

---

## 🟡 REQUIRED REQUIREMENT #3: Data Retention Policy

### Problem
Expired tokens must be deleted for PDPA/GDPR compliance (data retention).

### Solution
- Auto-delete expired tokens after retention period
- Cleanup job/cron to remove expired tokens
- Retention policy: Delete expired tokens after 24 hours (or immediately after expiry)

### Implementation

#### Cleanup Job (Cron or Scheduled Task):
```typescript
// Auto-delete expired tokens (run daily)
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

#### Data Retention Policy:
- **Retention Period:** 24 hours after token expiry
- **Cleanup Frequency:** Daily cron job
- **Policy:** Delete `passwordResetTokenHash` and `passwordResetTokenExpiry` fields
- **Compliance:** PDPA/GDPR data retention requirements met

### Compliance Benefits
- PDPA/GDPR compliance (data retention policy)
- Automatic cleanup (no manual intervention)
- Reduces database storage (expired tokens removed)
- Security benefit (expired tokens cannot be reused)

---

## ✅ LOW PRIORITY REQUIREMENT #4: Token Exclusion from Logs

### Problem
Tokens must not be logged (even hashed tokens should not appear in logs).

### Solution
- Document that tokens are excluded from logs
- Audit log details should not include tokens (hashed or plaintext)
- Only include user ID, timestamp, action type in logs

### Implementation

#### Documentation:
- Add comment in code: `// Tokens are never logged (security requirement)`
- Document in API documentation
- Document in audit logging policy

#### Code Example:
```typescript
// ✅ CORRECT: No token in audit log
await auditLog.create({
  userId: user.id,
  action: 'PASSWORD_RESET_REQUEST',
  details: { email: user.email }, // No token here
});

// ❌ INCORRECT: Token in audit log (DO NOT DO THIS)
await auditLog.create({
  userId: user.id,
  action: 'PASSWORD_RESET_REQUEST',
  details: { token: token }, // NEVER log tokens
});
```

---

## 📋 Implementation Checklist

### Prisma Schema Updates:
- [ ] Add `passwordResetTokenHash` field (String?, hashed token)
- [ ] Add `passwordResetTokenExpiry` field (DateTime?)
- [ ] Create migration file
- [ ] Generate Prisma client

### API Implementation:
- [ ] Hash tokens before storing (`bcrypt.hash(token, 10)`)
- [ ] Compare hashed tokens during validation (`bcrypt.compare(providedToken, storedHash)`)
- [ ] Never store plaintext tokens
- [ ] Never log tokens (hashed or plaintext)
- [ ] Audit log password reset requests
- [ ] Audit log password reset completions
- [ ] Audit log failed reset attempts
- [ ] Implement cleanup job for expired tokens

### Testing:
- [ ] Unit tests for token hashing
- [ ] Unit tests for token validation (hashed comparison)
- [ ] Integration tests for audit logging
- [ ] Integration tests for cleanup job
- [ ] Security tests (no plaintext tokens in DB)
- [ ] Security tests (no tokens in logs)

### Documentation:
- [ ] Document token hashing requirement
- [ ] Document audit logging requirement
- [ ] Document data retention policy
- [ ] Document token exclusion from logs

---

## 🎯 Implementation Priority

1. 🔴 **CRITICAL** — Token hashing (required before production)
2. 🔴 **REQUIRED** — Audit logging (required for Section 11 compliance)
3. 🟡 **REQUIRED** — Data retention policy (required for PDPA/GDPR compliance)
4. ✅ **Low Priority** — Token exclusion from logs (documentation)

---

## 📊 Compliance Status

### Section 11 Compliance:
- ✅ Audit logging for password reset events
- ✅ Security best practices (token hashing)
- ✅ No sensitive data in logs (tokens excluded)

### PDPA/GDPR Compliance:
- ✅ Data retention policy (auto-delete expired tokens)
- ✅ Token expiry enforced (1 hour)
- ✅ Secure token storage (hashed)

---

## ✅ Security Guard Final Approval

**Status:** ✅ APPROVED WITH REQUIRED CHANGES

**Implementation Blocker:**
- 🔴 Token hashing implementation (required before production)
- 🔴 Audit logging implementation (required for Section 11 compliance)
- 🟡 Data retention policy specification (required for PDPA/GDPR compliance)

**Ready for implementation after:**
- ✅ All required changes implemented
- ✅ Token hashing verified (no plaintext tokens)
- ✅ Audit logging verified (all events logged)
- ✅ Data retention policy verified (cleanup job working)

---

**Last Updated:** 2025-01-11  
**Security Guard:** ✅ APPROVED WITH REQUIRED CHANGES  
**Status:** Ready for implementation (with required security changes)

