# RFC-002 Mockup Review Coordination

**Task:** Review Forgot/Reset Password Mockups (RFC-002)  
**Delivered By:** 🎨 Design Agent  
**Coordinated By:** 📋 Project Manager  
**Date:** 2025-01-11  
**Status:** 📋 AWAITING REVIEW

---

## ✅ Deliverables Received

Design Agent has delivered the following mockups:

1. ✅ `docs/mockups/forgot-password.html` — Email input form
2. ✅ `docs/mockups/reset-password.html` — New password form with token validation

**Status:** ✅ COMPLETE — Ready for multi-agent review

---

## 🔄 Review Process

### Review Sequence:
1. **Tech Lead Review** — Verify technical requirements (Tailwind, shadcn/ui, Thai context, error states)
2. **Scope Guardian Review** — Verify spec compliance, assess code creep, approve/reject
3. **QA Engineer Review** — Verify accessibility, responsive design, error/loading states
4. **PM Final Approval** — Verify DoR satisfied for M1 tasks

---

## 📋 Tech Lead Review (FIRST)

**Copy this into your Tech Lead agent chat:**

```
🔧 TECH LEAD REVIEW — RFC-002 Mockups

Task: Review forgot/reset password HTML mockups (RFC-002)
Location: docs/mockups/forgot-password.html, docs/mockups/reset-password.html
Status: Design Agent delivered, awaiting review

Previous Work:
✅ Spec Section 2 updated (routes added)
✅ Prisma schema updated (passwordResetTokenHash, passwordResetTokenExpiry fields)
✅ OpenAPI spec updated (endpoints added, version bumped to v0.2.1)
✅ Design Agent delivered mockups

Task: Review technical requirements for forgot/reset password mockups

Review Checklist:

Technical Requirements:
- [ ] HTML files (static, no build process required)
- [ ] Responsive design (mobile + desktop)
- [ ] Use Tailwind CSS classes OR inline styles matching Tailwind patterns
- [ ] Use shadcn/ui component patterns (buttons, forms, cards, dialogs)
- [ ] Use Lucide icons (aligned with frontend stack)
- [ ] Accessible (a11y) — keyboard nav, ARIA labels where needed

Design Consistency:
- [ ] Match existing auth pages (login.html, register.html style)
- [ ] Use same design system tokens (ELITE_DESIGN_SYSTEM.md)
- [ ] Follow same patterns as existing M1 mockups

forgot-password.html Requirements:
- [ ] Email input field (44px height, validation)
- [ ] "Send reset link" button (primary, gradient)
- [ ] Success state (email sent message) — "If an account with that email exists, a password reset link has been sent."
- [ ] Error state (email format validation)
- [ ] Link back to login
- [ ] Trust messaging (security note about email link expiry)
- [ ] Design matches login.html style

reset-password.html Requirements:
- [ ] Token input field (hidden, from URL query param — ?token=xxx)
- [ ] New password field (44px, strength indicator like register.html)
- [ ] Confirm password field (44px, match validation)
- [ ] "Reset password" button (primary, gradient)
- [ ] Success state (password reset successful, redirect to login)
- [ ] Error states:
  - [ ] Invalid/expired token message
  - [ ] Weak password validation
  - [ ] Token already used message
- [ ] Token validation message (display token status)
- [ ] Design matches login.html style

Content Requirements:
- [ ] English + Thai language support (UI should support both)
- [ ] Error states documented (invalid email, invalid token, expired token, weak password)
- [ ] Loading states documented (submitting form)
- [ ] Success states documented (email sent, password reset)

Security Messaging:
- [ ] Forgot password: "If an account with that email exists, a password reset link has been sent."
- [ ] Security note: "Never share your reset token with anyone"

References:
- Task: TASK_RFC_002_DESIGN_AGENT.md
- Assignment: DESIGN_AGENT_ASSIGNMENT_RFC_002.md
- RFC: RFCs/RFC-002-forgot-reset-password.md
- Design System: docs/mockups/ELITE_DESIGN_SYSTEM.md
- Existing: docs/mockups/login.html, docs/mockups/register.html
- OpenAPI Spec: packages/types/openapi.yaml (forgot/reset password endpoints)

Files to Review:
- docs/mockups/forgot-password.html
- docs/mockups/reset-password.html

Acceptance Criteria:
- [ ] All technical requirements met
- [ ] Design consistency verified
- [ ] All states designed (loading, error, success)
- [ ] Responsive design verified
- [ ] Accessibility requirements met
- [ ] Security messaging appropriate

Next Steps:
- Tech Lead review → Approve/Request changes
- If approved → Scope Guardian review
- If changes needed → Design Agent fixes → Re-review

Timeline: 1 day (review)
Priority: HIGH — Blocks M1 completion
```

---

## 📋 Scope Guardian Review (AFTER Tech Lead Approval)

**Copy this into your Scope Guardian agent chat (after Tech Lead approves):**

```
🛡️ SCOPE GUARDIAN REVIEW — RFC-002 Mockups

Task: Review forgot/reset password HTML mockups for spec compliance (RFC-002)
Location: docs/mockups/forgot-password.html, docs/mockups/reset-password.html
Status: Tech Lead approved, awaiting Scope Guardian review

Previous Reviews:
✅ Tech Lead: ✅ APPROVED (all technical requirements met — design consistency verified, all states designed, responsive design verified, accessibility requirements met, security messaging appropriate)

Task: Review spec compliance for forgot/reset password mockups

Review Checklist:

Spec Compliance:
- [ ] Routes match spec Section 2 (RFC-002 routes)
  - [ ] /auth/forgot-password → forgot-password.html
  - [ ] /auth/reset-password?token=xxx → reset-password.html
- [ ] No routes beyond RFC-002 scope
- [ ] No features beyond RFC-002 scope
- [ ] Design matches existing M1 auth pages (login.html, register.html)

Code Creep Check:
- [ ] No extra routes beyond RFC-002
- [ ] No extra features beyond RFC-002
- [ ] No "nice to have" additions beyond spec
- [ ] All features required by RFC-002 present

RFC Compliance:
- [ ] Mockups match RFC-002 requirements
- [ ] Mockups match RFC-002 route descriptions
- [ ] Mockups match RFC-002 security messaging

References:
- Spec Section 2: visaontrack-v2-spec.md (lines 45-51)
- RFC-002: RFCs/RFC-002-forgot-reset-password.md
- Tech Lead Review: (awaiting Tech Lead approval)

Files to Review:
- docs/mockups/forgot-password.html
- docs/mockups/reset-password.html

Decision Required:
- [ ] APPROVED — Matches spec Section 2 (RFC-002)
- [ ] REJECTED — Scope deviation found
- [ ] RFC REQUIRED — Feature beyond RFC-002 scope

Next Steps:
- Scope Guardian review → Approve/Reject
- If approved → QA Engineer review
- If rejected → Design Agent fixes → Re-review

Timeline: 1 day (review)
Priority: HIGH — Blocks M1 completion
```

---

## 📋 QA Engineer Review (AFTER Scope Guardian Approval)

**Copy this into your QA Engineer agent chat (after Scope Guardian approves):**

```
✅ QA ENGINEER REVIEW — RFC-002 Mockups

Task: Review forgot/reset password HTML mockups for quality (RFC-002)
Location: docs/mockups/forgot-password.html, docs/mockups/reset-password.html
Status: Tech Lead & Scope Guardian approved, awaiting QA review

Previous Reviews:
✅ Tech Lead: ✅ APPROVED (all technical requirements met — design consistency verified, all states designed, responsive design verified, accessibility requirements met, security messaging appropriate)
✅ Scope Guardian: ✅ APPROVED (spec compliance verified — routes match spec Section 2, no code creep, RFC-002 requirements met)

Task: Review quality, accessibility, and responsiveness for forgot/reset password mockups

Review Checklist:

Accessibility (A11y):
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] ARIA labels present where needed
- [ ] Screen reader compatibility
- [ ] Focus states visible and clear
- [ ] Color contrast meets WCAG 2.1 AA (minimum)
- [ ] Form labels properly associated
- [ ] Error messages announced to screen readers

Responsive Design:
- [ ] Mobile breakpoint (320px - 768px) — tested
- [ ] Tablet breakpoint (768px - 1024px) — tested
- [ ] Desktop breakpoint (1024px+) — tested
- [ ] Layout adapts appropriately at each breakpoint
- [ ] Touch targets adequate (44px minimum)
- [ ] Text readable at all sizes

Error States:
- [ ] Invalid email validation (forgot-password.html)
- [ ] Invalid/expired token message (reset-password.html)
- [ ] Weak password validation (reset-password.html)
- [ ] Token already used message (reset-password.html)
- [ ] Error messages clear and helpful
- [ ] Error states visually distinct

Loading States:
- [ ] Submitting form state (forgot-password.html)
- [ ] Submitting form state (reset-password.html)
- [ ] Loading indicators present
- [ ] Disabled states during submission

Success States:
- [ ] Email sent confirmation (forgot-password.html)
- [ ] Password reset successful (reset-password.html)
- [ ] Success messages clear and helpful
- [ ] Success states visually distinct

User Experience:
- [ ] Form validation is helpful (not frustrating)
- [ ] Error recovery is clear
- [ ] Security messaging is appropriate
- [ ] Trust messaging is present
- [ ] Navigation is intuitive

References:
- Task: TASK_RFC_002_DESIGN_AGENT.md
- RFC: RFCs/RFC-002-forgot-reset-password.md
- Design System: docs/mockups/ELITE_DESIGN_SYSTEM.md
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/

Files to Review:
- docs/mockups/forgot-password.html
- docs/mockups/reset-password.html

Acceptance Criteria:
- [ ] All accessibility requirements met
- [ ] All responsive design requirements met
- [ ] All states designed (loading, error, success)
- [ ] User experience is excellent
- [ ] Quality is production-ready

Next Steps:
- QA Engineer review → Approve/Request changes
- If approved → PM final approval
- If changes needed → Design Agent fixes → Re-review

Timeline: 1 day (review)
Priority: HIGH — Blocks M1 completion
```

---

## 📊 Review Status Tracking

### Current Status:
- ✅ Design Agent: ✅ COMPLETE — Mockups delivered
- ✅ Tech Lead Review: ✅ APPROVED (all technical requirements met)
- ✅ Scope Guardian Review: ✅ APPROVED (spec compliance verified)
- ⏳ QA Engineer Review: ⏳ PENDING (NEXT)
- ⏳ PM Final Approval: ⏳ PENDING

---

## 🎯 Next Immediate Action

**Step 1: QA Engineer Review (START HERE)**

Copy the QA Engineer review prompt below into your QA Engineer agent chat to continue the review sequence.

After QA Engineer approves, proceed to PM final approval.

---

**Created:** 2025-01-11  
**PM:** Project Manager  
**Status:** 📋 AWAITING REVIEW  
**Next Step:** Tech Lead review → Scope Guardian review → QA review

