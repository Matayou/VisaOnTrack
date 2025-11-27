# RFC-002 Coordination — Forgot/Reset Password Flow

**Status:** 🟡 PENDING MULTI-AGENT REVIEW  
**Priority:** 🔴 HIGH — Blocks M1 completion  
**RFC:** RFCs/RFC-002-forgot-reset-password.md

---

## 📋 Review Sequence

### Step 1: Scope Guardian Review (Spec Compliance)

**Copy this into your Scope Guardian agent chat:**

```
🛡️ SCOPE GUARDIAN REVIEW — RFC-002

RFC: RFC-002 — Add Forgot/Reset Password Flow to M1
Location: RFCs/RFC-002-forgot-reset-password.md
Status: DRAFT — PENDING REVIEW

Review Checklist:

Spec Check:
- [ ] Is password reset flow in visaontrack-v2-spec.md? ❌ (NO — missing from Section 2)
- [ ] Is this a real MVP blocker? ✅ (YES — MVP cannot launch without password reset)
- [ ] Is this a "nice to have"? ❌ (NO — standard security practice)
- [ ] Does login page reference forgot password? ✅ (YES — line 535 has link)

Impact Check:
- [ ] Impact on scope? (Adds 2 routes, 2 endpoints, 2 mockups to M1)
- [ ] Impact on timeline? (2-3 days estimated)
- [ ] Breaking changes? (No — new features)
- [ ] Dependencies? (Email service — already specified in architecture)

MVP Impact:
- [ ] Blocks M1 completion? ✅ (YES — critical auth flow missing)
- [ ] Blocks MVP launch? ✅ (YES — cannot launch without password reset)
- [ ] Industry standard? ✅ (YES — every production app has this)
- [ ] Security requirement? ✅ (YES — password reset is security best practice)

Decision Required:
✅ APPROVE (if password reset is essential for MVP)
⚠️ RFC REQUIRED (if proposal needs refinement)
🚫 REJECT (if password reset can be deferred to post-MVP)

Expected: ✅ APPROVE (password reset is essential for MVP launch)
```

---

### Step 2: Tech Lead Review (API Contract Design)

**Copy this into your Tech Lead agent chat (after Scope Guardian approves):**

```
🔧 TECH LEAD REVIEW — RFC-002 API Contract

RFC: RFC-002 — Add Forgot/Reset Password Flow to M1
Location: RFCs/RFC-002-forgot-reset-password.md
Status: APPROVED by Scope Guardian (if approved)

Previous Reviews:
✅ Scope Guardian: [Status after Scope Guardian completes]

Task: Design API contract for forgot/reset password endpoints

Review Checklist:

API Contract Design:
- [ ] POST /auth/forgot-password endpoint
  - [ ] Request body: { email: string }
  - [ ] Response: 200 OK (always returns success for security)
  - [ ] Response: 400 Bad Request (invalid email format)
  - [ ] Behavior: Send email if user exists (no user enumeration)
- [ ] POST /auth/reset-password endpoint
  - [ ] Request body: { token: string, newPassword: string }
  - [ ] Response: 200 OK (password reset successful)
  - [ ] Response: 400 Bad Request (invalid token or weak password)
  - [ ] Response: 401 Unauthorized (expired token)
  - [ ] Behavior: Validate token, check expiry, update password

OpenAPI Spec Updates:
- [ ] Add forgot-password endpoint to OpenAPI spec
- [ ] Add reset-password endpoint to OpenAPI spec
- [ ] Define request/response schemas
- [ ] Document error responses
- [ ] Version bump if needed (minor: v0.2.0 → v0.2.1)

Security Considerations:
- [ ] Token is secure (UUID or cryptographically random)
- [ ] Token expires (e.g., 1 hour)
- [ ] Token is single-use (invalidated after use)
- [ ] Rate limiting on forgot-password endpoint
- [ ] No user enumeration (always return success)

Implementation Notes:
- [ ] Email service integration (Resend/SES per spec)
- [ ] Token storage (Prisma schema update needed)
- [ ] Password validation (strength requirements)
- [ ] Error handling (user-friendly messages)

Review Document: RFCs/RFC-002-forgot-reset-password.md

Focus: API contract design, security, error handling
```

---

### Step 3: Security Guard Review (Security Requirements)

**Copy this into your Security Guard agent chat (after Tech Lead approves):**

```
🔒 SECURITY GUARD REVIEW — RFC-002 Security

RFC: RFC-002 — Add Forgot/Reset Password Flow to M1
Location: RFCs/RFC-002-forgot-reset-password.md
Status: APPROVED by Tech Lead (if approved)

Previous Reviews:
✅ Scope Guardian: [Status]
✅ Tech Lead: [Status]

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

### Step 4: Design Agent Assignment (Mockups)

**Copy this into your Design Agent chat (after RFC approved):**

```
🎨 DESIGN AGENT — Create Forgot/Reset Password Mockups

Task: Create forgot/reset password mockups for M1
RFC: RFC-002 (Approved)
Reference: docs/mockups/ (existing M1 mockups)

Previous Reviews:
✅ Scope Guardian: RFC-002 APPROVED
✅ Tech Lead: API contract approved
✅ Security Guard: Security requirements met

Deliverables:
1. forgot-password.html — Email input form
2. reset-password.html — New password form with token validation

Requirements:

forgot-password.html:
- Email input field (44px height, validation)
- "Send reset link" button (primary, gradient)
- Success state (email sent message)
- Error state (email format validation)
- Link back to login
- Trust messaging (security note)
- Design matches existing auth pages (login.html style)

reset-password.html:
- Token input field (hidden, from URL query param)
- New password field (44px, strength indicator like register.html)
- Confirm password field (44px, match validation)
- "Reset password" button (primary, gradient)
- Success state (password reset, redirect to login)
- Error state (invalid/expired token, weak password)
- Token validation message
- Design matches existing auth pages

Design System:
- Use same design tokens as login.html
- Inter font, 4px spacing grid
- Semantic colors (primary, success, error)
- Linear's easing for animations
- 44px touch targets
- 3px focus rings with offset

States to Design:
- Default state (empty form)
- Loading state (submitting)
- Success state (email sent / password reset)
- Error state (validation errors, invalid token)

Reference:
- login.html (for styling consistency)
- register.html (for password strength indicator)
- ELITE_DESIGN_SYSTEM.md (for design tokens)

Timeline: 1 day (2 mockups)

Status: Ready for assignment
```

---

### Step 5: Backend Engineer Assignment (Prisma Schema & API)

**Copy this into your Backend Engineer chat (after RFC approved):**

```
🚀 BACKEND ENGINEER — Implement Forgot/Reset Password API

Task: Implement forgot/reset password endpoints
RFC: RFC-002 (Approved)
Reference: packages/types/openapi.yaml (update after Tech Lead designs contract)

Previous Reviews:
✅ Scope Guardian: RFC-002 APPROVED
✅ Tech Lead: API contract designed
✅ Security Guard: Security requirements met

Tasks:
1. Update OpenAPI spec with forgot/reset password endpoints (per Tech Lead design)
2. Update Prisma schema (add password reset token fields if needed)
3. Implement POST /auth/forgot-password endpoint
4. Implement POST /auth/reset-password endpoint
5. Implement email sending (Resend/SES per spec)
6. Implement token generation, validation, expiry
7. Add rate limiting (prevent abuse)
8. Write tests (unit, integration)

Prisma Schema Updates:
- Add passwordResetToken field to User model (optional, string)
- Add passwordResetTokenExpiry field to User model (optional, DateTime)

API Implementation:
- POST /auth/forgot-password: Send reset email (no user enumeration)
- POST /auth/reset-password: Validate token, reset password
- Token generation: UUID v4 or crypto.randomBytes
- Token expiry: 1 hour (configurable)
- Token single-use: Invalidate after reset

Security:
- Rate limiting on forgot-password (e.g., 3 requests/hour per email)
- Rate limiting on reset-password (e.g., 5 attempts/hour per token)
- No user enumeration (always return success for forgot-password)
- Secure token generation (cryptographically random)
- Password strength validation (same as registration)

Email Integration:
- Use Resend/SES per spec Section 1
- Email template: Reset password link with token
- Link format: `/auth/reset-password?token=xxx`
- Token expires in email (1 hour mention)

Testing:
- Unit tests for token generation, validation
- Integration tests for endpoints
- Security tests (rate limiting, token expiry, single-use)
- Email sending tests (mock email service)

Timeline: 2-3 days (API endpoints + schema + tests)

Status: Ready for assignment
```

---

## 📊 Review Status Tracking

### Current Status:
- [x] RFC-002 created ✅
- [ ] Scope Guardian review ⏳ PENDING
- [ ] Tech Lead review ⏳ PENDING
- [ ] Security Guard review ⏳ PENDING
- [ ] RFC approval ⏳ PENDING
- [ ] Design Agent assignment ⏳ PENDING
- [ ] Backend Engineer assignment ⏳ PENDING

### After RFC Approval:
- [ ] Update spec Section 2 with routes
- [ ] Update OpenAPI spec with endpoints
- [ ] Create mockups (forgot-password.html, reset-password.html)
- [ ] Update Prisma schema (add token fields)
- [ ] Implement API endpoints
- [ ] Write tests
- [ ] Final review and approval

---

## 🎯 Success Criteria

### RFC-002 Approved When:
- ✅ Scope Guardian: Password reset is essential for MVP
- ✅ Tech Lead: API contract designed and secure
- ✅ Security Guard: Security requirements met
- ✅ All reviewers approve

### M1 Unblocked When:
- ✅ Spec Section 2 updated with routes
- ✅ OpenAPI spec updated with endpoints
- ✅ Mockups created (forgot-password.html, reset-password.html)
- ✅ Prisma schema updated (if needed)
- ✅ API endpoints implemented and tested
- ✅ Final multi-agent review approved

---

**Next Steps:**
1. Scope Guardian reviews RFC-002 (spec compliance)
2. Tech Lead reviews RFC-002 (API contract design)
3. Security Guard reviews RFC-002 (security requirements)
4. RFC-002 approval decision
5. Assign Design Agent (mockups)
6. Assign Backend Engineer (API implementation)

**Priority:** 🔴 HIGH — This blocks M1 completion  
**Status:** 🟡 PENDING MULTI-AGENT REVIEW

