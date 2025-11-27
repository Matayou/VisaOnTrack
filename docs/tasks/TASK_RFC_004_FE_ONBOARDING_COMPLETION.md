# Task RFC-004-FE: Onboarding Completion Tracking (Frontend)

**RFC:** RFC-004: Onboarding Completion Tracking  
**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Frontend Engineer  
**Duration:** 1 day (2-3 hours)  
**Status:** ✅ **COMPLETE** — All reviews approved, PM final approval granted (2025-01-11)

**Priority:** HIGH — Required for provider gating (RFC-005)



> **Canonical Status:** This task file is the single source of truth for RFC-004-FE progress. Coordination and review docs now point back here for the latest state.



### Current Review State (updated 2025-01-11)

- ✅ Implementation complete (frontend)
- ✅ Tech Lead review approved (10/10)
- ✅ QA Engineer review approved (9/10)
- ✅ Scope Guardian review approved (10/10)
- ✅ PM final approval granted (2025-01-11)

**Final Status:** ✅ **COMPLETE** — All reviews approved, task complete


---

## User Story

**As a** user completing onboarding,  
**I want to** have my onboarding completion tracked automatically,  
**So that** I can access gated features (after verification for providers).

---

## Goal

Update onboarding flows to call `POST /users/me/complete-onboarding` endpoint when user completes onboarding, enabling backend to track completion status.

---

## Scope (Per RFC-004)

**Onboarding Flows to Update:**
- Seeker onboarding completion (`/onboarding/seeker/welcome` — last step)
- Provider onboarding completion (`/onboarding/provider/credentials/complete` — last step)
  - **Note:** Payment Setup step removed from flow (2025-01-11). Onboarding now ends at Credentials Complete page.

**API Integration:**
- Call `POST /users/me/complete-onboarding` with role
- Handle success/error responses
- Store completion status in user context/state

**⚠️ SCOPE WARNING:** Implement exactly per RFC-004. Update only completion calls. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] RFC approved ✅ (RFC-004 approved by PM)
- [x] Backend endpoint ready ✅ (RFC-004-BE complete — 2025-01-11)
- [x] User story defined ✅ (this document)
- [x] Onboarding flows exist ✅ (M1-FE-5, M1-FE-6 complete)
- [x] API client ready ✅ (regenerated — `api.users.completeOnboarding` available)
- [x] DoR reviewed and approved ✅

**DoR Snapshot:** ✅ **UNBLOCKED** — RFC-004-BE complete, ready for implementation (2025-01-11)

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Client:** Generated from OpenAPI spec

### Implementation Details

**File Locations:**
- `apps/web/app/onboarding/seeker/welcome/page.tsx` (Seeker completion)
- `apps/web/app/onboarding/provider/credentials/complete/page.tsx` (Provider completion)
  - **Note:** Updated from `/onboarding/provider/payouts` (Payment Setup step removed from flow)
- `packages/client/src/` (API client — will be regenerated)

**Completion Logic:**

1. **Seeker Onboarding Completion**
   - After user views welcome page (last step)
   - Call `POST /users/me/complete-onboarding` with `{ role: 'SEEKER' }`
   - Handle success/error
   - Update user context/state

2. **Provider Onboarding Completion**
   - After user completes credentials upload (last step — Credentials Complete page)
   - Call `POST /users/me/complete-onboarding` with `{ role: 'PROVIDER' }`
   - Handle success/error
   - Update user context/state
   - **Note:** Payment Setup step removed from flow (2025-01-11). Onboarding now ends at Credentials Complete.

**Error Handling:**
- Network errors (show error message)
- Validation errors (400 Bad Request)
- Authentication errors (401 Unauthorized)
- Role mismatch errors (400 Bad Request)

**User Experience:**
- Show loading state during API call
- Show success message (optional)
- Handle errors gracefully
- Don't block user if API call fails (can retry later)

---

## Acceptance Criteria

### Seeker Onboarding Completion
- [x] Calls `POST /users/me/complete-onboarding` with `{ role: 'SEEKER' }` ✅
- [x] Shows loading state during API call ✅
- [x] Handles success response ✅
- [x] Handles error response ✅
- [x] Updates backend state (completion status stored in database) ✅

### Provider Onboarding Completion
- [x] Calls `POST /users/me/complete-onboarding` with `{ role: 'PROVIDER' }` ✅
- [x] Shows loading state during API call ✅
- [x] Handles success response ✅
- [x] Handles error response ✅
- [x] Updates backend state (completion status stored in database) ✅

### Technical Requirements
- [x] Uses generated API client ✅
- [x] TypeScript compiles without errors ✅
- [x] Follows existing code patterns (M1-FE-5, M1-FE-6) ✅
- [x] Error handling matches existing patterns ✅
- [x] Loading states match existing patterns ✅

---

## Implementation Steps

1. **Wait for Backend Completion**
   - RFC-004-BE must be complete
   - API endpoint must be available
   - OpenAPI spec must be updated

2. **Regenerate API Client**
   - Run `pnpm run generate` in `packages/client`
   - Verify `completeOnboarding` method exists

3. **Update Seeker Onboarding**
   - Modify `apps/web/app/onboarding/seeker/welcome/page.tsx`
   - Add completion API call
   - Add loading/error handling

4. **Update Provider Onboarding**
   - Modify `apps/web/app/onboarding/provider/credentials/complete/page.tsx`
   - Add completion API call
   - Add loading/error handling
   - **Note:** Updated from Payouts page (Payment Setup step removed from flow)

5. **Test Completion Flow**
   - Test seeker completion
   - Test provider completion
   - Test error handling

---

## Testing Requirements

### Manual Testing
- [x] Seeker onboarding completion works ✅
- [x] Provider onboarding completion works ✅
- [x] Error handling works ✅
- [x] Loading states work ✅
- [x] Backend state updates correctly (verified via API) ✅

---

## Dependencies

- ⚠️ **RFC-004-BE** — Must be complete first
- ✅ Onboarding flows — Already implemented (M1-FE-5, M1-FE-6)
- ✅ API client — Will be regenerated after backend

---

## References

- **RFC:** `RFCs/RFC-004-onboarding-completion-tracking.md`
- **Backend Task:** `docs/tasks/TASK_RFC_004_BE_ONBOARDING_COMPLETION.md`
- **Seeker Onboarding:** `apps/web/app/onboarding/seeker/welcome/page.tsx`
- **Provider Onboarding:** `apps/web/app/onboarding/provider/credentials/complete/page.tsx`
- **Payouts Removal Update:** `docs/coordination/FRONTEND_ENGINEER_UPDATE_PAYOUTS_REMOVAL.md`

---

## Notes

- **Simple Integration:** Just API call addition, no complex logic
- **Required for RFC-005:** Must be completed before provider verification gating
- **Non-Blocking:** API call failure shouldn't block user (can retry)

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status History:** ✅ Implementation finished on 2025-01-11 (backend dependency cleared). Current live status is maintained in the header above.

