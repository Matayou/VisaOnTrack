# Task M1-FE-4: Account Type Selection Implementation

**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Frontend Engineer  
**Duration:** 0.5 day  
**Status:** 🔴 **BLOCKED** — Waiting for `PATCH /users/me` endpoint in OpenAPI spec  
**Priority:** HIGH (core onboarding flow)

**⚠️ BLOCKER:** `PATCH /users/me` endpoint is missing from OpenAPI spec (v0.2.1), which is required for this task.  
**See:** `BLOCKER_M1_FE_4_MISSING_PATCH_USERS_ME.md` for full blocker details  
**Resolution:** Backend Engineer adding `PATCH /users/me` to OpenAPI spec (see `COORDINATION_M1_BE_8_PATCH_USERS_ME.md`)

---

## User Story

**As a** new user who just registered,  
**I want to** select my account type (Seeker or Provider),  
**So that** I can proceed to the appropriate onboarding flow.

---

## Goal

Implement account type selection page with interactive selection cards, smooth animations, and role update API integration, matching the production-ready mockup design.

---

## Scope (Per Spec Section 2 & OpenAPI v0.2.1)

**Route:**
- `/onboarding/account-type` → Account type selection page

**Mockup Reference:**
- `docs/mockups/account-type.html`

**API Endpoint:**
- `PATCH /users/me` (update user role — Seeker or Provider)

**Spec Reference:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)

**⚠️ SCOPE WARNING:** Implement exactly per spec and OpenAPI contract. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (mockup exists: `docs/mockups/account-type.html`)
- [x] API contract defined ✅ (`PATCH /users/me` — OpenAPI v0.2.1)
- [x] Error states documented ✅ (selection required, API errors)
- [x] Dependencies identified ✅ (OpenAPI client generated)

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation

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

**File Location:**
- `apps/web/app/onboarding/account-type/page.tsx`

**Required Features:**
- Interactive selection cards (Seeker vs Provider)
- Smooth hover/selected states (CSS transitions)
- Feature lists per type (display features for each account type)
- Continue button with loading state (disabled until selection made)
- Error handling (selection required, API errors, network errors)
- Success redirect (Seeker → `/onboarding/seeker/welcome`, Provider → `/onboarding/provider/welcome`)

**Design Requirements:**
- Match mockup exactly (`docs/mockups/account-type.html`)
- Responsive design (mobile-first, desktop breakpoints)
- Accessibility (WCAG AA):
  - Semantic HTML (role="button" for cards, aria-label, aria-selected)
  - Keyboard navigation (Tab, Enter, Space)
  - Focus states (visible focus indicators)
  - Screen reader friendly (proper labels and announcements)
- Animations (hover effects, selection animations, page transitions)

**API Integration:**
- Use `PATCH /users/me` to update user role
- Handle loading states (show spinner on Continue button)
- Handle error states (display error messages)
- Handle success (redirect to appropriate onboarding flow)

**Form Validation:**
- Selection required (disable Continue button until selection made)
- Show error message if user tries to continue without selection

---

## Acceptance Criteria

### Functional Requirements
- [ ] Page renders at `/onboarding/account-type`
- [ ] Two selection cards display (Seeker and Provider)
- [ ] Cards are interactive (clickable, keyboard accessible)
- [ ] Hover states work (smooth transitions)
- [ ] Selection states work (visual feedback when selected)
- [ ] Feature lists display per type (when card is selected)
- [ ] Continue button is disabled until selection is made
- [ ] Continue button shows loading state when submitting
- [ ] API call updates user role (`PATCH /users/me`)
- [ ] Success redirects to appropriate flow:
  - Seeker → `/onboarding/seeker/welcome`
  - Provider → `/onboarding/provider/welcome`
- [ ] Error handling works (selection required, API errors, network errors)

### Design Requirements
- [ ] Page matches mockup exactly (`docs/mockups/account-type.html`)
- [ ] Responsive design works (mobile and desktop)
- [ ] Animations work (hover effects, selection animations)
- [ ] Colors match design system (from mockup)
- [ ] Typography matches design system (from mockup)
- [ ] Spacing matches design system (from mockup)

### Accessibility Requirements
- [ ] Semantic HTML used (proper roles and labels)
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus states visible (clear focus indicators)
- [ ] Screen reader friendly (proper labels and announcements)
- [ ] ARIA attributes correct (aria-label, aria-selected, aria-disabled)
- [ ] Touch targets meet 44px minimum (for mobile)

### Technical Requirements
- [ ] Uses Next.js App Router
- [ ] TypeScript compiles without errors
- [ ] Uses Tailwind CSS for styling
- [ ] Uses Lucide icons (or shadcn/ui components)
- [ ] Uses OpenAPI client (`@visaontrack/client`)
- [ ] No linter errors
- [ ] Code follows project conventions

---

## DoD Checklist (Definition of Done)

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing (if applicable)
- [ ] Accessibility (a11y) checked (WCAG AA compliance)
- [ ] Responsive design verified (mobile + desktop)
- [ ] Preview URL available
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] Contract tests passing (OpenAPI client — API calls work)
- [ ] Multi-agent review complete:
  - [ ] Tech Lead review (technical quality)
  - [ ] QA Engineer review (accessibility & responsiveness)
  - [ ] Security Guard review (security requirements)
  - [ ] Scope Guardian review (spec adherence)
  - [ ] PM final approval (DoD satisfaction)

---

## Implementation Notes

### Selection State Management
- Use React state to track selected account type
- Update UI when selection changes
- Enable Continue button only when selection is made

### API Integration
- Use `api.users.updateMe()` from `@visaontrack/client`
- Request body: `{ role: 'SEEKER' | 'PROVIDER' }`
- Handle loading state (show spinner, disable button)
- Handle error state (show error message)
- Handle success (redirect to appropriate flow)

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

### Responsive Design
- Mobile-first approach (single column layout on mobile)
- Desktop breakpoints (two-column layout on desktop)
- Touch targets meet 44px minimum
- Padding adjusts for mobile/desktop

---

## References

- **Mockup:** `docs/mockups/account-type.html`
- **Spec:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1 — `PATCH /users/me`)
- **Milestone:** `MILESTONE_M1.md` (Task 4: Account Type Selection)

---

## Next Steps After Completion

1. **Frontend Engineer:** Implement page and submit for review
2. **Tech Lead:** Review technical implementation
3. **QA Engineer:** Review accessibility and responsiveness
4. **Security Guard:** Review security requirements
5. **Scope Guardian:** Review spec adherence
6. **PM:** Final approval and mark task complete
7. **Continue:** Proceed to next M1 task (M1-FE-5: Seeker Onboarding Welcome)

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ PENDING — Ready for implementation

