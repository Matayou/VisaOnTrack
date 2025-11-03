# Coordination — M1-FE-4: Account Type Selection — Frontend Engineer Assignment

**Date:** 2025-01-11  
**Coordinated By:** Project Manager  
**Task:** M1-FE-4: Account Type Selection Implementation  
**Assigned To:** Frontend Engineer  
**Status:** 🔴 **BLOCKED** — Waiting for `PATCH /users/me` endpoint in OpenAPI spec

**⚠️ BLOCKER IDENTIFIED:**
- `PATCH /users/me` endpoint is missing from OpenAPI spec (v0.2.1)
- Required for M1-FE-4 (Account Type Selection)
- Blocks M1-FE-4, M1-FE-5, M1-FE-6, and all downstream M1 tasks
- **See:** `BLOCKER_M1_FE_4_MISSING_PATCH_USERS_ME.md` for full blocker details  
- **Resolution:** Backend Engineer adding `PATCH /users/me` to OpenAPI spec (see `COORDINATION_M1_BE_8_PATCH_USERS_ME.md`)

---

## Task Assignment

**Frontend Engineer:** Please implement the Account Type Selection page (M1-FE-4).

---

## Task Document

**See:** `TASK_M1_FE_4_ACCOUNT_TYPE.md` for complete task details

---

## Task Summary

**Objective:** Implement account type selection page with interactive selection cards, smooth animations, and role update API integration.

**Route:** `/onboarding/account-type`

**Key Requirements:**
- Interactive selection cards (Seeker vs Provider)
- Smooth hover/selected states
- Feature lists per type
- Continue button with loading state
- API integration (`PATCH /users/me` to update user role)
- Success redirect (Seeker → `/onboarding/seeker/welcome`, Provider → `/onboarding/provider/welcome`)
- Match mockup exactly (`docs/mockups/account-type.html`)

**Duration:** 0.5 day

**Priority:** HIGH (core onboarding flow)

---

## DoR Checklist Verification

✅ **All DoR Requirements Met:**
- ✅ User story defined with acceptance criteria
- ✅ Wireframe/mock available (`docs/mockups/account-type.html`)
- ✅ API contract defined (`PATCH /users/me` — OpenAPI v0.2.1) — ✅ **RESOLVED**
- ✅ Error states documented (selection required, API errors)
- ✅ Dependencies identified (OpenAPI client generated) — ✅ **API client regenerated**

**Status:** ✅ **DoR SATISFIED** — **BLOCKER RESOLVED** — Ready for implementation

---

## Implementation Requirements

### Core Features
- [ ] Interactive selection cards (Seeker vs Provider)
- [ ] Smooth hover/selected states (CSS transitions)
- [ ] Feature lists per type (display features for each account type)
- [ ] Continue button with loading state (disabled until selection made)
- [ ] Error handling (selection required, API errors, network errors)
- [ ] Success redirect (Seeker → `/onboarding/seeker/welcome`, Provider → `/onboarding/provider/welcome`)

### Design Requirements
- [ ] Match mockup exactly (`docs/mockups/account-type.html`)
- [ ] Responsive design (mobile-first, desktop breakpoints)
- [ ] Accessibility (WCAG AA):
  - Semantic HTML (role="button" for cards, aria-label, aria-selected)
  - Keyboard navigation (Tab, Enter, Space)
  - Focus states (visible focus indicators)
  - Screen reader friendly (proper labels and announcements)
- [ ] Animations (hover effects, selection animations, page transitions)

### API Integration
- [ ] Use `PATCH /users/me` to update user role
- [ ] Handle loading states (show spinner on Continue button)
- [ ] Handle error states (display error messages)
- [ ] Handle success (redirect to appropriate onboarding flow)

### Form Validation
- [ ] Selection required (disable Continue button until selection made)
- [ ] Show error message if user tries to continue without selection

---

## Technical Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide icons
- **API Client:** `@visaontrack/client` (generated from OpenAPI v0.2.1)

**File Location:**
- `apps/web/app/onboarding/account-type/page.tsx`

---

## References

- **Task Document:** `TASK_M1_FE_4_ACCOUNT_TYPE.md`
- **Mockup:** `docs/mockups/account-type.html`
- **Spec:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1 — `PATCH /users/me`)
- **Milestone:** `MILESTONE_M1.md` (Task 4: Account Type Selection)

---

## Success Criteria

**Implementation Complete When:**
- ✅ Page renders at `/onboarding/account-type`
- ✅ Interactive selection cards work (Seeker vs Provider)
- ✅ Smooth hover/selected states work
- ✅ Feature lists display per type
- ✅ Continue button updates user role via API
- ✅ Success redirects to appropriate onboarding flow
- ✅ Page matches mockup exactly
- ✅ Accessibility requirements met (WCAG AA)
- ✅ Responsive design verified (mobile + desktop)
- ✅ TypeScript compiles without errors
- ✅ No linter errors

**After Implementation:**
- ✅ Submit for multi-agent review (Tech Lead → QA Engineer → Security Guard → Scope Guardian)
- ✅ Apply any required fixes
- ✅ Mark task complete after all approvals

---

## Next Steps After Implementation

1. **Frontend Engineer:** Submit implementation for review
2. **Tech Lead:** Review technical implementation
3. **QA Engineer:** Review accessibility and responsiveness
4. **Security Guard:** Review security requirements
5. **Scope Guardian:** Review spec adherence
6. **PM:** Final approval and mark task complete
7. **Continue:** Proceed to next M1 task (M1-FE-5: Seeker Onboarding Welcome)

---

**Created:** 2025-01-11  
**Coordinated By:** Project Manager  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ **READY** — Blocker resolved, all reviews approved, ready for Frontend Engineer implementation

**✅ BLOCKER RESOLVED:** All backend work complete, all reviews approved. Frontend Engineer can proceed with implementation.

