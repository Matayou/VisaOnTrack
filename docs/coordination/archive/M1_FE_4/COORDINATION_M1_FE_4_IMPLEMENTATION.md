# Coordination — M1-FE-4: Account Type Selection — Implementation Ready

**Date:** 2025-01-11  
**Coordinated By:** Project Manager  
**Task:** M1-FE-4: Account Type Selection Implementation  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ **READY** — Blocker resolved, ready for implementation

---

## Task Assignment

**Frontend Engineer:** Please implement the Account Type Selection page (M1-FE-4).

**✅ BLOCKER RESOLVED:** All backend work complete, all reviews approved. You can proceed with implementation.

---

## Task Document

**See:** `TASK_M1_FE_4_ACCOUNT_TYPE.md` for complete task details

---

## Blocker Resolution Summary

**✅ BLOCKER STATUS: RESOLVED**

**Completed Steps:**
- ✅ Backend Engineer: Added `PATCH /users/me` to OpenAPI spec — ✅ COMPLETE
- ✅ Backend Engineer: Regenerated API client — ✅ COMPLETE
- ✅ Method Verification: `api.users.updateCurrentUser()` verified — ✅ COMPLETE
- ✅ Tech Lead Review: ✅ APPROVED (production-ready)
- ✅ Scope Guardian Review: ✅ APPROVED (matches spec requirements, no scope creep)

**API Client Method:**
- ✅ `api.users.updateCurrentUser(requestBody: UpdateUserRequest): Promise<User>`
- ✅ Available in `packages/client/src/services/UsersService.ts`
- ✅ Request body type: `UpdateUserRequest` (role, name, phone, locale - all optional)

**See:** `BLOCKER_RESOLUTION_PATCH_USERS_ME.md` for full resolution summary

---

## Implementation Requirements

### Core Features
- [ ] Interactive selection cards (Seeker vs Provider)
- [ ] Smooth hover/selected states (CSS transitions)
- [ ] Feature lists per type (display features for each account type)
- [ ] Continue button with loading state (disabled until selection made)
- [ ] Error handling (selection required, API errors, network errors)
- [ ] Success redirect (Seeker → `/onboarding/seeker/welcome`, Provider → `/onboarding/provider/welcome`)

### API Integration

**Method:** `api.users.updateCurrentUser()`

**Request Body:**
```typescript
{
  role: 'SEEKER' | 'PROVIDER'  // Required for account type selection
}
```

**Example Usage:**
```typescript
import { api } from '@visaontrack/client';

// Update user role (account type selection)
await api.users.updateCurrentUser({
  role: 'SEEKER' // or 'PROVIDER'
});
```

**Error Handling:**
- `400 BadRequest` — Invalid request (e.g., invalid role)
- `401 Unauthorized` — Not authenticated
- `404 NotFound` — User not found
- `429 Throttled` — Rate limiting (if applicable)

### Design Requirements
- [ ] Match mockup exactly (`docs/mockups/account-type.html`)
- [ ] Responsive design (mobile-first, desktop breakpoints)
- [ ] Accessibility (WCAG AA):
  - Semantic HTML (role="button" for cards, aria-label, aria-selected)
  - Keyboard navigation (Tab, Enter, Space)
  - Focus states (visible focus indicators)
  - Screen reader friendly (proper labels and announcements)
- [ ] Animations (hover effects, selection animations, page transitions)

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

## Success Criteria

**Implementation Complete When:**
- ✅ Page renders at `/onboarding/account-type`
- ✅ Interactive selection cards work (Seeker vs Provider)
- ✅ Smooth hover/selected states work
- ✅ Feature lists display per type
- ✅ Continue button updates user role via API (`api.users.updateCurrentUser()`)
- ✅ Success redirects to appropriate onboarding flow:
  - Seeker → `/onboarding/seeker/welcome`
  - Provider → `/onboarding/provider/welcome`
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

## References

- **Task Document:** `TASK_M1_FE_4_ACCOUNT_TYPE.md`
- **Blocker Resolution:** `BLOCKER_RESOLUTION_PATCH_USERS_ME.md`
- **Mockup:** `docs/mockups/account-type.html`
- **Spec:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1 — `PATCH /users/me`)
- **Milestone:** `MILESTONE_M1.md` (Task 4: Account Type Selection)

---

## Implementation Notes

### API Client Method
- Use `api.users.updateCurrentUser()` from `@visaontrack/client`
- Method signature: `updateCurrentUser(requestBody: UpdateUserRequest): Promise<User>`
- Request body: `{ role: 'SEEKER' | 'PROVIDER' }`
- Handle loading state (show spinner, disable button)
- Handle error state (show error message)
- Handle success (redirect to appropriate flow)

### Selection State Management
- Use React state to track selected account type
- Update UI when selection changes
- Enable Continue button only when selection is made

### Error Handling
- Selection required: Show error message if user tries to continue without selection
- API errors: Display error message (401 Unauthorized, 400 Bad Request, 500 Internal Server Error)
- Network errors: Display network error message

### Accessibility
- Use `role="button"` for selection cards
- Use `aria-label` to describe each card
- Use `aria-selected` to indicate selection state
- Use `aria-disabled` for disabled Continue button
- Use keyboard events (onKeyDown for Enter/Space)
- Use focus management (focus visible on cards)

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
**Status:** ⏳ **READY** — Blocker resolved, all reviews approved, ready for implementation

**✅ BLOCKER RESOLVED:** All backend work complete, API client ready, all reviews approved. Frontend Engineer can proceed with implementation.

