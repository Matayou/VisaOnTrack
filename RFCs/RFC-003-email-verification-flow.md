# RFC-003: Email Verification Flow

## Problem

The registration flow lacks email verification, which is a critical security and trust requirement for production. Users can register and immediately access the platform without verifying their email address, leading to:

- **Security Risk:** Fake accounts, spam registrations, account takeover vulnerabilities
- **Trust Issue:** Unverified emails reduce platform credibility
- **User Experience:** No email verification step means users may register with incorrect emails
- **Compliance:** Industry standard practice missing

**Current State:**
- Registration creates user account immediately
- No email verification required
- No `/auth/verify-email` route in spec Section 2
- No email verification endpoints in OpenAPI spec
- No `emailVerified` field in User model
- Users can login and use platform without email verification

**Impact:**
- 🔴 **CRITICAL** — Security best practice missing
- 🔴 **CRITICAL** — Trust and credibility issue
- 🟡 **HIGH** — User experience gap
- 🟡 **HIGH** — Industry standard missing

## Proposal

Add email verification flow to registration process:

**User Flow:**
1. User registers → `POST /auth/register`
2. User receives verification email with token link
3. User redirected to `/auth/verify-email` page (shows "Check your email" message)
4. User clicks link in email → `GET /auth/verify-email?token=xxx`
5. Email verified → User can proceed to onboarding
6. **REQUIRED:** Email verification is mandatory before accessing onboarding flows
7. Onboarding routes are gated behind email verification check

**Routes (Spec Section 2):**
- `/auth/verify-email` → Verification page (shows "Check your email" or verification status)
- `/auth/verify-email?token=xxx` → Verify email with token from email link

**API Endpoints (OpenAPI spec):**
- `GET /auth/verify-email?token=xxx` — Verify email with token
- `POST /auth/resend-verification` — Resend verification email (requires auth)

**Data Model (Prisma schema):**
- Add `emailVerified` boolean field to User model (default: `false`)
- Add `emailVerificationToken` string field (hashed token, nullable)
- Add `emailVerificationTokenExpiry` DateTime field (nullable)

**Security Requirements:**
- Tokens must be hashed before storing (never store plaintext tokens)
- Tokens expire after 24 hours
- Tokens are single-use (invalidated after verification)
- Audit logging for verification events (per Section 11)

**Email Service:**
- Use Resend/SES per spec Section 1
- Send verification email on registration
- Email template includes verification link with token

## Impact

**Scope:**
- Adds 1 route to Spec Section 2
- Adds 2 API endpoints to OpenAPI spec
- Adds 3 fields to User model (Prisma schema)
- Requires email service integration
- Requires verification page mockup

**Breaking Changes:** 
- ⚠️ **REQUIRED:** Email verification is now mandatory before onboarding
- Onboarding routes will redirect unverified users to `/auth/verify-email`
- Registration flow redirects to verification page instead of account type selection

**Dependencies:**
- Email service (Resend/SES) — already specified in architecture
- Token hashing (bcrypt) — already used for passwords

**Timeline:** 
- Spec update: 1 hour
- API endpoints: 4-6 hours
- Frontend page: 2-3 hours
- Email integration: 2-3 hours
- **Total: 9-13 hours (1.5-2 days)**

**Risk:**
- Low — Standard email verification flow
- Email service already specified
- Token-based verification is industry standard

## Rollout

**Feature Flag:** N/A (core security feature)

**Migration:**
- Add fields to User model (nullable, defaults to `false`)
- Existing users: `emailVerified = false` (can verify later)
- No data migration required

**Rollback Plan:**
- Can temporarily allow unverified users to access onboarding (feature flag)
- Existing users: `emailVerified = false` (must verify before accessing features)
- **Note:** Email verification is a security requirement and should not be disabled in production

**Tasks:**
1. Update spec Section 2 with `/auth/verify-email` route
2. Add OpenAPI endpoints (`GET /auth/verify-email`, `POST /auth/resend-verification`)
3. Update Prisma schema (add `emailVerified`, `emailVerificationToken`, `emailVerificationTokenExpiry`)
4. Create verification page mockup (`verify-email.html`)
5. Implement token generation and hashing
6. Implement email sending (Resend/SES)
7. Implement verification endpoint
8. Implement resend verification endpoint
9. Add audit logging for verification events
10. **REQUIRED:** Update registration flow to redirect to `/auth/verify-email` instead of `/onboarding/account-type`
11. **REQUIRED:** Add email verification gating to onboarding routes (middleware/route protection)
12. **REQUIRED:** Update account type selection page to check email verification status
13. Tech Lead review (API contract)
14. Security Guard review (security requirements)
15. Scope Guardian review (spec compliance)
16. QA review (security testing)

## Decision

[ ] Approved [ ] Rejected [ ] Deferred

**Decision Date:** TBD  
**Decided By:** TBD

**Reviewers:**
- [ ] Scope Guardian — Review required
- [ ] Tech Lead — Review required
- [ ] Security Guard — Review required
- [ ] PM — Review required

---

**Priority:** 🔴 **HIGH** — Security best practice  
**Severity:** 🔴 **CRITICAL** — Required for production security

