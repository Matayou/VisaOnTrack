# Coordination — M1-FE-3: Forgot/Reset Password Flow (Frontend Engineer)

**Task:** M1-FE-3: Forgot/Reset Password Flow Implementation (RFC-002)  
**Engineer:** Frontend Engineer  
**Status:** ⏳ ASSIGNED  
**Date:** 2025-01-11

---

## ✅ DoR Checklist Status

**Definition of Ready (DoR):**
- ✅ User story defined with acceptance criteria
- ✅ Wireframe/mock available (`docs/mockups/forgot-password.html`, `reset-password.html`)
- ✅ API contract defined (OpenAPI v0.2.1 — `POST /auth/forgot-password`, `POST /auth/reset-password`)
- ✅ Prisma schema ready (User model with `passwordResetTokenHash`, `passwordResetTokenExpiry` fields)
- ✅ Error states documented (OpenAPI spec — invalid token, expired token, weak password, etc.)
- ✅ Dependencies identified (OpenAPI client generated, RFC-002 API implemented)

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation

---

## 📋 Task Assignment

**Deliver to:** Frontend Engineer (separate Cursor chat)

**Prompt:**
```
Frontend Engineer: Please implement the Forgot/Reset Password Flow (M1-FE-3) per RFC-002.

Task Document: TASK_M1_FE_FORGOT_RESET_PASSWORD.md
Implementation Location:
- apps/web/app/auth/forgot-password/page.tsx
- apps/web/app/auth/reset-password/page.tsx

Mockup References:
- docs/mockups/forgot-password.html
- docs/mockups/reset-password.html

Previous Implementation Reference:
- M1-FE-2 (Login/Register flows) — Use similar patterns for form validation, error handling, accessibility

Backend API Status:
- ✅ Backend API endpoints complete (RFC-002 implemented)
- ✅ POST /auth/forgot-password — Ready to use
- ✅ POST /auth/reset-password — Ready to use

API Client Usage:
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

Requirements:
1. Forgot Password Page (/auth/forgot-password):
   - Email input with validation
   - Submit button with loading state
   - Success message (always shown, no user enumeration)
   - Error handling (invalid email format, network errors, rate limiting)
   - Match mockup: docs/mockups/forgot-password.html

2. Reset Password Page (/auth/reset-password?token=xxx):
   - Extract token from URL query parameter
   - Token validation (client-side + server-side)
   - New password input with strength indicator (4-bar meter)
   - Confirm password input
   - Password validation (uppercase, lowercase, number, special character — same as register pages)
   - Submit button with loading state
   - Error handling (invalid token, expired token, weak password, token already used)
   - Success redirect to login page
   - Match mockup: docs/mockups/reset-password.html

Security Requirements (RFC-002):
- No user enumeration (always return success for forgot-password)
- Token expiry enforced (1 hour)
- Token single-use enforced (invalidated after reset)
- Password validation enforced (per OpenAPI spec — same as register pages)

Accessibility Requirements:
- Semantic HTML (form, label, input, button)
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Error announcements with role="alert" (learn from M1-FE-2 fixes)
- Password strength meter with aria-live="polite" (learn from M1-FE-2 fixes)

After implementation:
1. Verify TypeScript compilation (tsc --noEmit)
2. Verify no linter errors
3. Test forgot password flow (email validation, success message)
4. Test reset password flow (token extraction, validation, password strength, error handling)
5. Verify accessibility (keyboard nav, screen readers)
6. Verify responsive design (mobile + desktop)

Reply format:
"Frontend Engineer: M1-FE-3 Implementation Complete
✅ Forgot password page implemented (/auth/forgot-password)
✅ Reset password page implemented (/auth/reset-password?token=xxx)
✅ Token extraction and validation working
✅ Password strength validation working (matches register pages)
✅ Error handling implemented (invalid token, expired token, weak password)
✅ Success redirect to login working
✅ Accessibility requirements met (role='alert', aria-live)
✅ Responsive design verified
✅ TypeScript compilation: PASS
✅ Linter checks: PASS
[Any additional notes]"
```

---

## 📊 Task Status Tracking

### Current Status:
- ✅ DoR: SATISFIED
- ⏳ Frontend Engineer: PENDING (NEXT)
- ⏳ Tech Lead Review: PENDING
- ⏳ QA Engineer Review: PENDING
- ⏳ Security Guard Review: PENDING
- ⏳ Scope Guardian Review: PENDING (REQUIRED)
- ⏳ PM Final Approval: PENDING

---

## 🔄 Next Steps

1. ⏳ Frontend Engineer: Implement forgot/reset password flows — **NEXT**
2. ⏳ Tech Lead: Review technical implementation quality
3. ⏳ QA Engineer: Review accessibility & responsiveness
4. ⏳ Security Guard: Review security requirements
5. ⏳ Scope Guardian: Review spec adherence (REQUIRED)
6. ⏳ PM: Final approval

---

**Created By:** PM Coordinator  
**Date:** 2025-01-11  
**Status:** ⏳ ASSIGNED

