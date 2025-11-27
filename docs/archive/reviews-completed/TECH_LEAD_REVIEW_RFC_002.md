# Tech Lead Review — RFC-002: Forgot/Reset Password API Contract

**Date:** RFC-002 Review  
**Reviewed By:** Tech Lead  
**RFC:** `RFCs/RFC-002-forgot-reset-password.md`  
**Status:** ✅ **APPROVED WITH RECOMMENDATIONS**

---

## Executive Summary

The RFC-002 proposal for forgot/reset password flow is **well-structured and addresses a critical M1 gap**. The API contract design follows security best practices. This review provides detailed API contract specifications, security considerations, and implementation notes.

**Recommendation:** ✅ **APPROVED** — Proceed with API contract design per this review.

---

## API Contract Design ✅

### POST /auth/forgot-password ✅

**Purpose:** Send password reset email to user (if email exists).

**Security Requirement:** Always return 200 OK (no user enumeration).

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Request Schema:**
- `email` (string, required): Valid email address format

**Response (200 OK):**
```json
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

**Response Schema:**
- `message` (string): Generic success message (no indication of user existence)

**Error Responses:**
- `400 Bad Request`: Invalid email format
  ```json
  {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "errors": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
  ```
- `429 Too Many Requests`: Rate limit exceeded
  ```json
  {
    "code": "THROTTLED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 3600
  }
  ```

**Behavior:**
1. Validate email format (RFC 5322)
2. If email exists, generate secure token and send reset email
3. Always return 200 OK (security: prevent user enumeration)
4. Rate limit: 3 requests/hour per email IP address

**Implementation Notes:**
- Token generation: Use `crypto.randomBytes(32).toString('hex')` or UUID v4
- Token expiry: 1 hour (configurable via environment variable)
- Email template: Use Resend/SES per spec Section 1
- Email link: `https://visaontrack.com/auth/reset-password?token={token}`
- Rate limiting: Use IP + email combination (3 requests/hour)

---

### POST /auth/reset-password ✅

**Purpose:** Reset user password using token from email.

**Request:**
```json
{
  "token": "abc123...",
  "newPassword": "SecurePassword123!"
}
```

**Request Schema:**
- `token` (string, required): Password reset token from email
- `newPassword` (string, required): New password (must meet strength requirements)

**Password Strength Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

**Response (200 OK):**
```json
{
  "message": "Password has been reset successfully."
}
```

**Response Schema:**
- `message` (string): Success message

**Error Responses:**
- `400 Bad Request`: Invalid token or weak password
  ```json
  {
    "code": "BAD_REQUEST",
    "message": "Invalid token or password does not meet strength requirements",
    "errors": [
      {
        "field": "newPassword",
        "message": "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      }
    ]
  }
  ```
- `401 Unauthorized`: Token expired or already used
  ```json
  {
    "code": "UNAUTHORIZED",
    "message": "Token has expired or has already been used. Please request a new password reset."
  }
  ```
- `404 Not Found`: Token not found
  ```json
  {
    "code": "NOT_FOUND",
    "message": "Invalid reset token."
  }
  ```

**Behavior:**
1. Validate token format
2. Check token exists and hasn't expired
3. Check token hasn't been used (single-use)
4. Validate password strength
5. Update password and invalidate token
6. Rate limit: 5 attempts/hour per token

**Implementation Notes:**
- Token validation: Check `passwordResetToken` and `passwordResetTokenExpiry` in User model
- Token expiry: 1 hour from generation
- Token single-use: Set `passwordResetToken` to `null` after successful reset
- Password hashing: Use bcrypt with salt rounds (minimum 10)
- Rate limiting: Use token + IP combination (5 attempts/hour)

---

## OpenAPI Spec Updates ✅

### Endpoints to Add

**1. POST /auth/forgot-password**
- Location: After `/auth/login` endpoint
- Tag: `auth`
- Operation ID: `forgotPassword`
- Request schema: `ForgotPasswordRequest`
- Response schema: `ForgotPasswordResponse`
- Error responses: 400 (ValidationError), 429 (ThrottledError)

**2. POST /auth/reset-password**
- Location: After `/auth/forgot-password` endpoint
- Tag: `auth`
- Operation ID: `resetPassword`
- Request schema: `ResetPasswordRequest`
- Response schema: `ResetPasswordResponse`
- Error responses: 400 (BadRequest), 401 (Unauthorized), 404 (NotFound)

### Schemas to Add

**ForgotPasswordRequest:**
```yaml
ForgotPasswordRequest:
  type: object
  required:
    - email
  properties:
    email:
      type: string
      format: email
      example: user@example.com
```

**ForgotPasswordResponse:**
```yaml
ForgotPasswordResponse:
  type: object
  required:
    - message
  properties:
    message:
      type: string
      example: "If an account exists with this email, a password reset link has been sent."
```

**ResetPasswordRequest:**
```yaml
ResetPasswordRequest:
  type: object
  required:
    - token
    - newPassword
  properties:
    token:
      type: string
      example: "abc123..."
    newPassword:
      type: string
      format: password
      minLength: 8
      description: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
```

**ResetPasswordResponse:**
```yaml
ResetPasswordResponse:
  type: object
  required:
    - message
  properties:
    message:
      type: string
      example: "Password has been reset successfully."
```

### Version Bump

- **Current:** v0.2.0
- **Proposed:** v0.2.1 (minor bump for new non-breaking endpoints)
- **Rationale:** Adds new endpoints without breaking existing API

---

## Security Considerations ✅

### Token Security ✅
- ✅ **Secure Generation:** Use `crypto.randomBytes(32).toString('hex')` (64-character hex string) or UUID v4
- ✅ **Cryptographically Random:** Never use predictable tokens (timestamp, email hash, etc.)
- ✅ **Length:** Minimum 32 bytes (64 hex characters) for security

### Token Expiry ✅
- ✅ **Expiry Time:** 1 hour (configurable via `PASSWORD_RESET_TOKEN_EXPIRY` environment variable)
- ✅ **Storage:** `passwordResetTokenExpiry` field in User model (DateTime)
- ✅ **Validation:** Check `expiry > now()` before accepting token

### Token Single-Use ✅
- ✅ **Single-Use:** Invalidate token after successful password reset
- ✅ **Implementation:** Set `passwordResetToken = null` and `passwordResetTokenExpiry = null` after reset
- ✅ **Security:** Prevents token reuse even if email is compromised

### Rate Limiting ✅
- ✅ **Forgot Password Endpoint:**
  - 3 requests/hour per email IP combination
  - Prevents email spam and abuse
  - Use Redis or in-memory store for rate limiting
- ✅ **Reset Password Endpoint:**
  - 5 attempts/hour per token IP combination
  - Prevents brute force attacks
  - Use Redis or in-memory store for rate limiting

### No User Enumeration ✅
- ✅ **Always Return 200 OK:** `/auth/forgot-password` always returns success (even if email doesn't exist)
- ✅ **Generic Message:** "If an account exists with this email, a password reset link has been sent."
- ✅ **Security:** Prevents attackers from discovering which emails are registered

### Password Validation ✅
- ✅ **Strength Requirements:**
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (!@#$%^&*)
- ✅ **Validation:** Validate before accepting token (fail fast)
- ✅ **Error Messages:** User-friendly messages without revealing validation rules exactly

---

## Implementation Notes ✅

### Email Service Integration ✅
- ✅ **Service:** Use Resend/SES per spec Section 1
- ✅ **Template:** Create password reset email template
- ✅ **Link Format:** `https://visaontrack.com/auth/reset-password?token={token}`
- ✅ **Expiry Mention:** Include "Token expires in 1 hour" in email
- ✅ **Security Note:** Include "If you didn't request this, ignore this email"

### Token Storage (Prisma Schema) ✅

**Required Schema Updates:**
```prisma
model User {
  // ... existing fields ...
  
  passwordResetToken        String?   @db.VarChar(255)
  passwordResetTokenExpiry  DateTime?
  
  // ... rest of model ...
  
  @@index([passwordResetToken])
}
```

**Migration:**
```bash
cd apps/api
npx prisma migrate dev --name add_password_reset_token
```

**Index:** Add index on `passwordResetToken` for fast token lookup

### Password Validation ✅
- ✅ **Library:** Use `zod` or `class-validator` for password validation
- ✅ **Rules:** Minimum 8 chars, uppercase, lowercase, number, special char
- ✅ **Hashing:** Use `bcrypt` with salt rounds (minimum 10)
- ✅ **Timing:** Constant-time comparison for token validation (prevent timing attacks)

### Error Handling ✅
- ✅ **User-Friendly Messages:** Clear error messages without revealing system internals
- ✅ **Validation Errors:** Specific field-level errors for password validation
- ✅ **Security Errors:** Generic messages for token errors (don't reveal why token failed)
- ✅ **Rate Limit Errors:** Include `retryAfter` header for client handling

### Testing Requirements ✅
- ✅ **Unit Tests:** Token generation, validation, expiry check
- ✅ **Integration Tests:** Endpoint testing with valid/invalid tokens
- ✅ **Security Tests:** Rate limiting, token expiry, single-use enforcement
- ✅ **Email Tests:** Mock email service, verify email sending
- ✅ **Password Tests:** Password strength validation, hashing verification

---

## Checklist Summary

### API Contract Design ✅
- [x] POST /auth/forgot-password endpoint
  - [x] Request body: { email: string }
  - [x] Response: 200 OK (always returns success for security)
  - [x] Response: 400 Bad Request (invalid email format)
  - [x] Behavior: Send email if user exists (no user enumeration)
- [x] POST /auth/reset-password endpoint
  - [x] Request body: { token: string, newPassword: string }
  - [x] Response: 200 OK (password reset successful)
  - [x] Response: 400 Bad Request (invalid token or weak password)
  - [x] Response: 401 Unauthorized (expired token)
  - [x] Behavior: Validate token, check expiry, update password

### OpenAPI Spec Updates ✅
- [x] Add forgot-password endpoint to OpenAPI spec
- [x] Add reset-password endpoint to OpenAPI spec
- [x] Define request/response schemas
- [x] Document error responses
- [x] Version bump if needed (minor: v0.2.0 → v0.2.1)

### Security Considerations ✅
- [x] Token is secure (UUID or cryptographically random)
- [x] Token expires (e.g., 1 hour)
- [x] Token is single-use (invalidated after use)
- [x] Rate limiting on forgot-password endpoint
- [x] No user enumeration (always return success)

### Implementation Notes ✅
- [x] Email service integration (Resend/SES per spec)
- [x] Token storage (Prisma schema update needed)
- [x] Password validation (strength requirements)
- [x] Error handling (user-friendly messages)

---

## Recommendations

### Best Practices ✅
- ✅ API contract follows REST conventions
- ✅ Security best practices implemented
- ✅ Error handling is comprehensive
- ✅ Rate limiting prevents abuse
- ✅ User enumeration prevention is implemented

### Implementation Priority
1. **High Priority:** Prisma schema update (add token fields)
2. **High Priority:** OpenAPI spec update (add endpoints)
3. **High Priority:** Token generation and validation logic
4. **Medium Priority:** Email service integration
5. **Medium Priority:** Rate limiting implementation
6. **Low Priority:** Comprehensive testing

---

## Final Decision

✅ **APPROVED** — API contract design is ready for implementation.

**Summary:**
- API contract design is complete and secure
- Security best practices are implemented
- OpenAPI spec updates are specified
- Implementation notes are comprehensive
- Token storage and validation are specified

**Action Items:**
1. ✅ **Tech Lead:** API contract design complete (this review)
2. ⏳ **Backend Engineer:** Update OpenAPI spec per this design
3. ⏳ **Backend Engineer:** Update Prisma schema (add token fields)
4. ⏳ **Backend Engineer:** Implement endpoints per this contract
5. ⏳ **Security Guard:** Review security implementation
6. ⏳ **QA Engineer:** Test password reset flow

**Next Steps:**
- Update OpenAPI spec with forgot/reset password endpoints
- Update Prisma schema with token fields
- Implement endpoints per API contract
- Test security requirements (rate limiting, token expiry, single-use)

---

**Tech Lead Signature:** ✅ Approved for implementation  
**API Contract Quality:** ✅ Complete, secure, and ready for implementation

