# Task: Create Forgot/Reset Password Mockups (RFC-002)

**RFC:** RFC-002 (Approved)  
**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Design Agent  
**Status:** 📋 ASSIGNED

---

## Goal
Create HTML mock files for forgot/reset password flow to complete M1 auth coverage.

**Background:** RFC-002 approved — forgot/reset password flow required for M1. Login page has "Forgot password?" link but no pages exist.

---

## DoR Checklist (Definition of Ready)
- [x] User story defined ✅
- [x] Wireframe/mock available ⏳ (THIS TASK creates them)
- [x] API contract defined (OpenAPI) ✅ (Tech Lead designed)
- [x] Error states documented ⏳ (Document per mockup)
- [x] Dependencies identified ✅ (None — can proceed immediately)
- [x] DoR reviewed and approved ✅

---

## Scope (RFC-002 Routes)

Create HTML mock files for forgot/reset password routes per RFC-002:

1. `/auth/forgot-password` → `forgot-password.html` (enter email)
2. `/auth/reset-password?token=xxx` → `reset-password.html` (enter new password)

**Total:** 2 HTML mock files

---

## Deliverables

### Files to Create
- `docs/mockups/forgot-password.html`
- `docs/mockups/reset-password.html`

### Documentation
- Document error states per mockup
- Document loading states per mockup
- Document success states per mockup

---

## Requirements

### Technical Requirements
- HTML files (static, no build process required)
- Responsive design (mobile + desktop)
- Use Tailwind CSS classes OR inline styles matching Tailwind patterns
- Use shadcn/ui component patterns (buttons, forms, cards, dialogs)
- Use Lucide icons (aligned with frontend stack)
- Accessible (a11y) — keyboard nav, ARIA labels where needed

### Design Requirements

#### forgot-password.html:
- Email input field (44px height, validation)
- "Send reset link" button (primary, gradient)
- Success state (email sent message) — "If an account with that email exists, a password reset link has been sent."
- Error state (email format validation)
- Link back to login
- Trust messaging (security note about email link expiry)
- Design matches existing auth pages (login.html style)

#### reset-password.html:
- Token input field (hidden, from URL query param — `?token=xxx`)
- New password field (44px, strength indicator like register.html)
- Confirm password field (44px, match validation)
- "Reset password" button (primary, gradient)
- Success state (password reset successful, redirect to login)
- Error states:
  - Invalid/expired token message
  - Weak password validation
  - Token already used message
- Token validation message (display token status)
- Design matches existing auth pages (login.html style)

### Content Requirements
- English + Thai language support (UI should support both)
- Error states documented (invalid email, invalid token, expired token, weak password)
- Loading states documented (submitting form)
- Success states documented (email sent, password reset)

### Security Messaging:
- Forgot password: "If an account with that email exists, a password reset link has been sent."
- Reset password: "This link expires in 1 hour" (in email, not on page)
- Security note: "Never share your reset token with anyone"

---

## Acceptance Criteria

- [ ] `forgot-password.html` created
- [ ] `reset-password.html` created
- [ ] Files stored in `docs/mockups/` directory
- [ ] Files match RFC-002 route descriptions
- [ ] Files use Tailwind CSS classes OR inline styles matching Tailwind patterns
- [ ] Files are responsive (mobile + desktop)
- [ ] Files are accessible (keyboard nav, ARIA labels)
- [ ] Error states designed (invalid email, invalid token, expired token, weak password)
- [ ] Loading states designed (submitting form)
- [ ] Success states designed (email sent, password reset)
- [ ] Design matches existing auth pages (login.html, register.html style)
- [ ] DoR checklist can be satisfied for M1 tasks
- [ ] Tech Lead review approved
- [ ] Scope Guardian review approved

---

## Dependencies

**None** — Can proceed immediately after RFC approval.

**References:**
- `login.html` — For styling consistency
- `register.html` — For password strength indicator pattern
- `ELITE_DESIGN_SYSTEM.md` — For design tokens
- RFC-002: `RFCs/RFC-002-forgot-reset-password.md`
- Spec Section 2: `visaontrack-v2-spec.md`

**Blocks:**
- M1 frontend work (cannot start without mockups per DoR)

---

## Timeline

**Estimate:** 1 day (2 mockups)

**Tasks:**
1. Create `forgot-password.html` (email input form)
2. Create `reset-password.html` (new password form with token validation)
3. Review with Tech Lead
4. Review with Scope Guardian
5. Update spec Section 2 links (if needed)

---

## Notes

- These are static HTML files (no build process)
- Use Tailwind CSS CDN or inline styles (aligned with frontend stack)
- Use shadcn/ui component patterns (buttons, forms, cards, etc.)
- Focus on RFC-002 routes only (2 files)
- Mockups should be functional enough for Frontend Engineer to reference
- Security messaging should be clear and helpful
- Token handling should be clearly documented in design

---

## References

- RFC-002: `RFCs/RFC-002-forgot-reset-password.md`
- Spec Section 2: `visaontrack-v2-spec.md` (lines 45-51)
- OpenAPI Spec: `packages/types/openapi.yaml` (forgot/reset password endpoints)
- Frontend Stack: Tailwind + shadcn/ui + Lucide (spec Section 1)
- DoR Checklist: `TASK_TEMPLATES.md`
- Design System: `docs/mockups/ELITE_DESIGN_SYSTEM.md`

---

**Created:** 2025-01-11  
**RFC:** RFC-002 (Approved)  
**Status:** 📋 ASSIGNED TO DESIGN AGENT

