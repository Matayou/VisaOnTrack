# Design Agent Assignment — RFC-002 Mockups

**Task:** Create Forgot/Reset Password Mockups (RFC-002)  
**Assigned To:** 🎨 Design / UI/UX Agent  
**Assigned By:** 📋 Project Manager  
**Date:** 2025-01-11  
**Status:** 📋 ASSIGNED

---

## 🎯 Assignment Brief

Create HTML mock files for the forgot/reset password flow to complete M1 auth coverage.

**RFC:** RFC-002 (Approved) — Add Forgot/Reset Password Flow to M1  
**Timeline:** 1 day (2 mockups)  
**Priority:** 🔴 HIGH — Blocks M1 completion

---

## 📋 Deliverables

Create **2 HTML mock files**:

1. `docs/mockups/forgot-password.html` — Email input form
2. `docs/mockups/reset-password.html` — New password form with token validation

---

## ✅ Task Requirements

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
- Design matches existing auth pages (`login.html` style)

#### reset-password.html:
- Token input field (hidden, from URL query param — `?token=xxx`)
- New password field (44px, strength indicator like `register.html`)
- Confirm password field (44px, match validation)
- "Reset password" button (primary, gradient)
- Success state (password reset successful, redirect to login)
- Error states:
  - Invalid/expired token message
  - Weak password validation
  - Token already used message
- Token validation message (display token status)
- Design matches existing auth pages (`login.html` style)

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

## 📚 References

**Task Assignment:** `TASK_RFC_002_DESIGN_AGENT.md`  
**RFC:** `RFCs/RFC-002-forgot-reset-password.md`  
**Spec Section 2:** `visaontrack-v2-spec.md` (lines 45-51)  
**OpenAPI Spec:** `packages/types/openapi.yaml` (forgot/reset password endpoints)  
**Design System:** `docs/mockups/ELITE_DESIGN_SYSTEM.md`  
**Existing Mockups:** 
- `docs/mockups/login.html` — For styling consistency
- `docs/mockups/register.html` — For password strength indicator pattern
**DoR Checklist:** `TASK_TEMPLATES.md`

---

## ✅ Acceptance Criteria

- [ ] `forgot-password.html` created in `docs/mockups/`
- [ ] `reset-password.html` created in `docs/mockups/`
- [ ] Files match RFC-002 route descriptions
- [ ] Files use Tailwind CSS classes OR inline styles matching Tailwind patterns
- [ ] Files are responsive (mobile + desktop)
- [ ] Files are accessible (keyboard nav, ARIA labels)
- [ ] Error states designed (invalid email, invalid token, expired token, weak password)
- [ ] Loading states designed (submitting form)
- [ ] Success states designed (email sent, password reset)
- [ ] Design matches existing auth pages (`login.html`, `register.html` style)
- [ ] Tech Lead review approved
- [ ] Scope Guardian review approved

---

## 🔄 Review Process

After Design Agent completes mockups:

1. **Tech Lead Review** — Verify technical requirements (Tailwind, shadcn/ui, Thai context, error states)
2. **Scope Guardian Review** — Verify spec compliance, assess code creep, approve/reject
3. **QA Engineer Review** — Verify accessibility, responsive design, error/loading states
4. **PM Final Approval** — Verify DoR satisfied for M1 tasks

---

## 📝 Notes

- These are static HTML files (no build process)
- Use Tailwind CSS CDN or inline styles (aligned with frontend stack)
- Use shadcn/ui component patterns (buttons, forms, cards, etc.)
- Focus on RFC-002 routes only (2 files)
- Mockups should be functional enough for Frontend Engineer to reference
- Security messaging should be clear and helpful
- Token handling should be clearly documented in design

---

**Created:** 2025-01-11  
**Assigned By:** Project Manager  
**Status:** 📋 ASSIGNED TO DESIGN AGENT  
**Next Step:** Design Agent creates mockups → Tech Lead review → Scope Guardian review → QA review

