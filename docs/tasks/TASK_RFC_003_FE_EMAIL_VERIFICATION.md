# Task RFC-003-FE: Email Verification Flow (Frontend)

**RFC:** RFC-003: Email Verification Flow  
**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Frontend Engineer  
**Duration:** 1 day (2-3 hours)  
**Status:** ⏳ **READY FOR ASSIGNMENT** (Pending backend completion)  
**Priority:** 🔴 **HIGH** — Security best practice

---

## User Story

**As a** user registering on the platform,  
**I want to** verify my email address via email link,  
**So that** I can ensure my account is secure and trusted.

---

## Goal

Create email verification page (`/auth/verify-email`) that handles token verification and displays verification status, enabling users to verify their email addresses after registration.

---

## Scope (Per RFC-003)

**Routes:**
- `/auth/verify-email` — Verification page (shows "Check your email" or verification status)
- `/auth/verify-email?token=xxx` — Verify email with token from email link

**Features:**
- Display "Check your email" message after registration
- Handle token verification from email link
- Display verification success/error messages
- Resend verification email button (requires auth)
- **REQUIRED:** Redirect to account type selection after successful verification

**⚠️ SCOPE WARNING:** Implement exactly per RFC-003. Follow existing auth page patterns. No extra features. Any deviations require RFC approval.

**⚠️ SECURITY REQUIREMENT:** Email verification is MANDATORY before accessing onboarding flows. Onboarding routes must check email verification status and redirect unverified users to `/auth/verify-email`.

---

## DoR Checklist (Definition of Ready)

- [x] RFC approved ✅ (RFC-003 approved by PM with conditions)
- [x] Backend endpoints ready ⏳ (RFC-003-BE must be complete)
- [x] User story defined ✅ (this document)
- [x] Mockup available ⏳ (needs creation — part of this task)
- [x] API client ready ⏳ (will be regenerated after backend endpoints)
- [x] DoR reviewed and approved ✅

**Status:** ⏳ **BLOCKED** — Waiting for RFC-003-BE completion

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 
- **Icons:** Lucide Icons
- **API Client:** Generated from OpenAPI spec

### Implementation Details

**File Locations:**
- `apps/web/app/auth/verify-email/page.tsx` (Verification page)
- `docs/mockups/verify-email.html` (Mockup — needs creation)

**Page States:**

1. **Initial State (No Token)**
   - Show "Check your email" message
   - Display email address (if available)
   - Show "Resend verification email" button (if authenticated)
   - Show "Back to login" link

2. **Verifying State (Token in URL)**
   - Show loading spinner
   - Call `GET /auth/verify-email?token=xxx`
   - Handle success/error

3. **Success State**
   - Show success message
   - Show "Continue to login" button
   - Redirect to login after delay

4. **Error State**
   - Show error message
   - Show "Resend verification email" button
   - Show "Back to login" link

**Resend Verification:**
- Requires authentication (JWT cookie)
- Call `POST /auth/resend-verification`
- Show success message
- Handle rate limiting errors (429)

**Error Handling:**
- Invalid token (400 Bad Request)
- Expired token (401 Unauthorized)
- Network errors
- Rate limiting errors (429)

---

## Acceptance Criteria

### Verification Page
- [ ] Displays "Check your email" message when no token
- [ ] Handles token verification from URL query parameter
- [ ] Shows loading state during verification
- [ ] Shows success message after verification
- [ ] Shows error message for invalid/expired token
- [ ] Shows "Resend verification email" button (if authenticated)
- [ ] Shows "Back to login" link
- [ ] Redirects to login after successful verification

### Resend Verification
- [ ] Calls `POST /auth/resend-verification` when button clicked
- [ ] Requires authentication (shows login prompt if not authenticated)
- [ ] Shows loading state during API call
- [ ] Shows success message after resend
- [ ] Handles rate limiting errors (429)
- [ ] Handles network errors

### Technical Requirements
- [ ] Uses generated API client
- [ ] TypeScript compiles without errors
- [ ] Follows existing auth page patterns (M1-FE-2)
- [ ] Error handling matches existing patterns
- [ ] Loading states match existing patterns
- [ ] Accessibility (WCAG AA) compliant
- [ ] Responsive design (mobile-first)

---

## Implementation Steps

1. **Wait for Backend Completion**
   - RFC-003-BE must be complete
   - API endpoints must be available
   - OpenAPI spec must be updated

2. **Create Mockup**
   - Create `docs/mockups/verify-email.html`
   - Follow existing mockup patterns
   - Include all page states

3. **Regenerate API Client**
   - Run `pnpm run generate` in `packages/client`
   - Verify `verifyEmail` and `resendVerification` methods exist

4. **Implement Verification Page**
   - Create `apps/web/app/auth/verify-email/page.tsx`
   - Implement token verification logic
   - Implement resend verification logic
   - Add loading/error handling
   - Add accessibility features
   - Add responsive design

5. **Test Verification Flow**
   - Test token verification
   - Test resend verification
   - Test error handling
   - Test accessibility
   - Test responsive design

---

## Testing Requirements

### Manual Testing
- [ ] Verification page displays correctly
- [ ] Token verification works
- [ ] Resend verification works
- [ ] Error handling works
- [ ] Loading states work
- [ ] Accessibility works (WCAG AA)
- [ ] Responsive design works (mobile-first)

---

## Dependencies

- ⚠️ **RFC-003-BE** — Must be complete first
- ✅ Auth page patterns — Already exist (M1-FE-2)
- ✅ API client — Will be regenerated after backend

---

## References

- **RFC:** `RFCs/RFC-003-email-verification-flow.md`
- **Backend Task:** `docs/tasks/TASK_RFC_003_BE_EMAIL_VERIFICATION.md`
- **Auth Pages:** `apps/web/app/auth/` (M1-FE-2 reference)

---

## Notes

- **Pattern Reuse:** Follow existing auth page patterns (M1-FE-2)
- **Email Service:** Backend must integrate Resend/SES before production
- **Security:** Never log tokens, handle errors gracefully

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ **BLOCKED** — Waiting for RFC-003-BE completion

**⚠️ UPDATE (2025-01-11):** Email verification is now REQUIRED (not optional). Registration flow has been updated to redirect to `/auth/verify-email`. Onboarding routes (`/onboarding/account-type`, `/onboarding/seeker/welcome`, `/onboarding/provider/welcome`) have been updated to gate access behind email verification check. Users cannot proceed with onboarding until email is verified.

