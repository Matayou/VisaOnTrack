# Task M1-FE-3: Forgot/Reset Password Flow Implementation (RFC-002)

**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Frontend Engineer  
**Duration:** 0.5–1 day  
**Status:** ⏳ IN PROGRESS — Frontend Engineer assigned  
**Priority:** HIGH (security requirement, RFC-002)

---

## User Story

**As a** user who forgot their password,  
**I want to** reset my password via email link,  
**So that** I can regain access to my account securely.

---

## Goal

Implement forgot/reset password flow with proper validation, error handling, and token management, matching the production-ready mockup designs and OpenAPI contract (RFC-002).

---

## Scope (Per RFC-002 & OpenAPI v0.2.1)

**Routes:**
- `/auth/forgot-password` → Forgot password page
- `/auth/reset-password?token=xxx` → Reset password page (token from URL)

**Mockup References:**
- `docs/mockups/forgot-password.html`
- `docs/mockups/reset-password.html`

**API Endpoints:**
- `POST /auth/forgot-password` (OpenAPI v0.2.1 — RFC-002)
- `POST /auth/reset-password` (OpenAPI v0.2.1 — RFC-002)

**RFC Reference:** `RFCs/RFC-002-forgot-reset-password.md`  
**Spec Reference:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)

**⚠️ SCOPE WARNING:** Implement exactly per RFC-002 and OpenAPI contract. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (`docs/mockups/forgot-password.html`, `reset-password.html`)
- [x] API contract defined ✅ (OpenAPI v0.2.1 — `POST /auth/forgot-password`, `POST /auth/reset-password`)
- [x] Prisma schema ready ✅ (User model with `passwordResetTokenHash`, `passwordResetTokenExpiry` fields)
- [x] Error states documented ✅ (OpenAPI spec — invalid token, expired token, weak password, etc.)
- [x] Analytics events defined ⏳ (optional — track password reset requests if needed)
- [x] Dependencies identified ✅ (OpenAPI client generated, RFC-002 API implemented)
- [x] DoR reviewed and approved ✅

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation

**Note:** Backend API endpoints are already implemented via RFC-002. Frontend implementation can proceed immediately.

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide icons
- **API Client:** `@visaontrack/client` (generated from OpenAPI v0.2.1)

### Implementation Details

**File Locations:**
- `apps/web/app/auth/forgot-password/page.tsx` (Forgot password page)
- `apps/web/app/auth/reset-password/page.tsx` (Reset password page with token validation)

**Components to Create:**
1. **Forgot Password Page:**
   - Email input with validation
   - Submit button with loading state
   - Success message (always shown, no user enumeration)
   - Error message display (if needed)

2. **Reset Password Page:**
   - Token extraction from URL query parameter (`?token=xxx`)
   - Token validation (client-side + server-side)
   - New password input with strength indicator
   - Confirm password input
   - Submit button with loading state
   - Error message display (invalid token, expired token, weak password)
   - Success redirect to login page

**API Client Usage:**
```typescript
import { api } from '@visaontrack/client';

// Forgot Password
await api.auth.forgotPassword({
  email: string
});

// Reset Password
await api.auth.resetPassword({
  token: string,
  newPassword: string
});
```

**Token Handling:**
- Extract token from URL query parameter (`?token=xxx`)
- Validate token format (client-side)
- Send token to backend for validation (server-side)
- Handle token expiry (1 hour from generation)
- Handle invalid token (single-use, already used)

**Password Validation:**
- Password strength requirements (uppercase, lowercase, number, special character — per OpenAPI spec)
- Real-time password strength indicator
- Confirm password match validation

**Error Handling:**
- Invalid token (400 Bad Request)
- Expired token (401 Unauthorized)
- Weak password (400 Bad Request)
- Token already used (401 Unauthorized)
- Network errors
- Rate limiting (429 Throttled)

**Security Features (Per RFC-002):**
- No user enumeration (always return success for forgot-password)
- Token expiry enforced (1 hour)
- Token single-use enforced (invalidated after reset)
- Password validation enforced (per OpenAPI spec)

**Responsive Design:**
- Mobile-first approach
- Desktop breakpoints per mockup
- Touch-friendly inputs (44px minimum)

**Accessibility:**
- Semantic HTML (form, label, input, button)
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Error announcements (ARIA live regions)

---

## Acceptance Criteria

### Forgot Password Flow
- [ ] Forgot password page renders at `/auth/forgot-password`
- [ ] Email input with proper label
- [ ] Submit button shows loading state during API call
- [ ] Success message always displayed (no user enumeration)
- [ ] Email sent if user exists (backend handles this)
- [ ] Error handling works (invalid email format, network errors)
- [ ] Rate limiting handled correctly (429 Throttled)
- [ ] Page matches mockup design exactly

### Reset Password Flow
- [ ] Reset password page renders at `/auth/reset-password?token=xxx`
- [ ] Token extracted from URL query parameter
- [ ] Token validated (client-side + server-side)
- [ ] New password input with strength indicator
- [ ] Confirm password input
- [ ] Password validation enforced (uppercase, lowercase, number, special character)
- [ ] Submit button shows loading state during API call
- [ ] Invalid token error displayed (400 Bad Request)
- [ ] Expired token error displayed (401 Unauthorized)
- [ ] Weak password error displayed (400 Bad Request)
- [ ] Token already used error displayed (401 Unauthorized)
- [ ] Successful reset redirects to login page
- [ ] Page matches mockup design exactly

### Technical Requirements
- [ ] Uses Next.js App Router
- [ ] TypeScript compiles without errors
- [ ] Uses Tailwind CSS for styling
- [ ] Uses shadcn/ui components (form, input, button, etc.)
- [ ] Uses Lucide icons (if applicable)
- [ ] Uses `@visaontrack/client` for API calls
- [ ] No manual API calls (must use generated client)
- [ ] No linter errors
- [ ] Accessibility (a11y) checked (WCAG AA)

### Design Requirements
- [ ] Matches mockup designs exactly (`forgot-password.html`, `reset-password.html`)
- [ ] Colors match design system (`docs/mockups/ELITE_DESIGN_SYSTEM.md`)
- [ ] Typography matches design system
- [ ] Spacing matches design system (4px grid)
- [ ] Form validation animations work smoothly

---

## DoD Checklist (Definition of Done)

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (API calls)
- [ ] E2E tests written and passing (user flows)
- [ ] Accessibility (a11y) checked (keyboard nav, screen readers)
- [ ] Responsive design verified (mobile + desktop)
- [ ] Preview URL available (Vercel preview deployment)
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] Contract tests passing (OpenAPI client generation)
- [ ] Matches mockup designs exactly
- [ ] Security requirements met (no user enumeration, token validation, password validation)
- [ ] Scope Guardian approval ✅ **REQUIRED** (spec adherence verification)

**⚠️ CRITICAL:** Do not mark task complete without Scope Guardian approval.

---

## References

### Mockups
- **Forgot Password:** `docs/mockups/forgot-password.html`
- **Reset Password:** `docs/mockups/reset-password.html`
- **Design System:** `docs/mockups/ELITE_DESIGN_SYSTEM.md`
- **Patterns:** `docs/mockups/WORLD_CLASS_PATTERNS.md`

### Spec & RFC
- **Spec Document:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)
- **RFC Document:** `RFCs/RFC-002-forgot-reset-password.md`
- **Milestone Document:** `MILESTONE_M1.md` (Task 3)

### API Contract
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)
- **Endpoints:** `POST /auth/forgot-password`, `POST /auth/reset-password`
- **Schemas:** ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse
- **Error Responses:** 400 Bad Request, 401 Unauthorized, 429 Throttled

### Prisma Schema
- **User Model:** `apps/api/prisma/schema.prisma` (User model with `passwordResetTokenHash`, `passwordResetTokenExpiry` fields)

### Generated Client
- **Package:** `@visaontrack/client`
- **Location:** `packages/client/src`
- **Usage:** `import { api } from '@visaontrack/client';`

### Implementation Status
- **Backend API:** ✅ COMPLETE (RFC-002 implementation — `TASK_RFC_002_BACKEND_ENGINEER.md`)
- **Backend Reviews:** ✅ COMPLETE (Tech Lead, Security Guard, Scope Guardian, PM approved)

---

## Dependencies

**Blocking Dependencies:**
- [x] OpenAPI client generated ✅ (M0 Task 4 complete)
- [x] RFC-002 API endpoints implemented ✅ (Backend Engineer — RFC-002 complete)
- [x] RFC-002 reviews approved ✅ (Tech Lead, Security Guard, Scope Guardian, PM)

**Parallel Work:** Can proceed immediately — all prerequisites complete.

---

## Testing Requirements

### Unit Tests
- [ ] Forgot password form component renders
- [ ] Reset password form component renders
- [ ] Token extraction from URL works
- [ ] Form validation works (email format, password strength)
- [ ] Password strength indicator updates correctly
- [ ] Confirm password match validation works

### Integration Tests
- [ ] API calls use generated client correctly
- [ ] Forgot password API call succeeds
- [ ] Reset password API call succeeds with valid token
- [ ] Error handling works (invalid token, expired token, weak password)
- [ ] Rate limiting handled correctly (429 Throttled)
- [ ] Token validation works (client-side + server-side)

### E2E Tests
- [ ] Forgot password flow works end-to-end
- [ ] Reset password flow works end-to-end
- [ ] Token expiry handled correctly
- [ ] Token single-use enforced
- [ ] Error states display correctly
- [ ] Redirects work after successful reset

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader announces form fields correctly
- [ ] ARIA labels present where needed
- [ ] Error messages announced (ARIA live regions)
- [ ] Color contrast meets WCAG AA

---

## Review Process

### Multi-Agent Review (Required Before Completion)

1. **Tech Lead Review** ⏳ (technical implementation quality)
   - [ ] Code follows Next.js best practices
   - [ ] TypeScript types correct
   - [ ] API client usage correct (no manual API calls)
   - [ ] Token handling secure
   - [ ] Performance optimized

2. **QA Engineer Review** ⏳ (accessibility & responsiveness)
   - [ ] Accessibility (a11y) verified
   - [ ] Responsive design verified
   - [ ] Cross-browser testing completed
   - [ ] Form validation tested

3. **Security Guard Review** ⏳ (security requirements)
   - [ ] Password validation matches OpenAPI spec
   - [ ] Token validation secure (client-side + server-side)
   - [ ] No sensitive data in logs
   - [ ] Rate limiting handled correctly
   - [ ] No user enumeration (always return success)

4. **Scope Guardian Review** ⏳ **REQUIRED** (spec adherence)
   - [ ] Implementation matches RFC-002 exactly
   - [ ] Implementation matches spec Section 2 exactly
   - [ ] API calls match OpenAPI v0.2.1 contract
   - [ ] No scope creep (no extra features)
   - [ ] Mockup designs matched exactly

5. **PM Final Approval** ⏳ (DoD satisfaction)
   - [ ] All DoD checklist items complete
   - [ ] All reviews approved

**⚠️ CRITICAL:** Scope Guardian approval is REQUIRED before marking task complete.

---

## Scope Discipline

### ✅ In Scope (Per RFC-002 & Spec)
- Forgot password page at `/auth/forgot-password`
- Reset password page at `/auth/reset-password?token=xxx`
- Token extraction from URL
- Token validation (client-side + server-side)
- Password strength validation (uppercase, lowercase, number, special character)
- Real-time password strength indicator
- Error handling (invalid token, expired token, weak password)
- Success redirect to login
- Responsive design
- Accessibility (WCAG AA)

### ❌ Out of Scope (Requires RFC)
- Email verification flow
- Password reset via SMS
- Password reset via security questions
- Multi-factor authentication (MFA)
- Password history enforcement
- Extra security features beyond RFC-002

**⚠️ SCOPE WARNING:** If you need anything beyond the above, create an RFC first.

---

## Success Criteria

✅ **Task is complete when:**
1. Both pages (forgot password, reset password) implemented
2. Both pages match mockup designs exactly
3. All acceptance criteria met
4. All DoD checklist items complete
5. All reviews approved (Tech Lead, QA, Security Guard, Scope Guardian, PM)
6. Preview URL available and working
7. No linter errors
8. TypeScript compiles without errors
9. API calls use generated client correctly
10. Security requirements met (RFC-002)

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ PENDING — Ready to start  
**Next Step:** Implement forgot/reset password flows matching mockups and using OpenAPI client (RFC-002 API already implemented)

