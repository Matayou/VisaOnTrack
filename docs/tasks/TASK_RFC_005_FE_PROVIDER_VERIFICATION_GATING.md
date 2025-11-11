# Task RFC-005-FE: Provider Verification Gating System (Frontend)

**RFC:** RFC-005: Provider Verification Gating System  
**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Frontend Engineer  
**Duration:** 2-3 days (16-23 hours)  
**Status:** ⏳ **BLOCKED** — Waiting for RFC-004 and RFC-005-BE completion  
**Priority:** 🔴 **CRITICAL** — Blocks provider access until verified

---

## User Story

**As a** provider on the platform,  
**I want to** see clear messaging when features are blocked and be guided through verification,  
**So that** I understand why I can't access features and what I need to do.

---

## Goal

Implement `ProviderAccessGate` component and verification status page that blocks provider access to main features until verification is complete, providing clear messaging and remediation steps.

---

## Scope (Per RFC-005)

**Components:**
- `ProviderAccessGate` component — Checks verification status and blocks access
- Verification status page — `/onboarding/provider/verification-status`

**Protected Pages:**
- Provider dashboard (`/providers/dashboard`)
- Request marketplace (`/requests`)
- Request details (`/requests/[id]`)
- Order management (`/orders`)
- Messages (`/messages`)

**Login Redirect Logic:**
- Check provider status after login
- Redirect to appropriate page:
  - Email not verified → `/auth/verify-email`
  - Onboarding incomplete → `/onboarding/provider/welcome`
  - Verification pending/rejected → `/onboarding/provider/verification-status`
  - Verified → Dashboard

**⚠️ SCOPE WARNING:** Implement exactly per RFC-005. Coordinate with backend rollout to avoid limbo state. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] RFC approved ✅ (RFC-005 approved by PM, contingent on RFC-004)
- [x] RFC-004 complete ⏳ (MUST be complete first — dependency)
- [x] RFC-005-BE complete ⏳ (MUST be complete first — dependency)
- [x] User story defined ✅ (this document)
- [x] Mockup available ⏳ (needs creation — part of this task)
- [x] API client ready ⏳ (will be regenerated after backend endpoints)
- [x] DoR reviewed and approved ✅

**Status:** ⏳ **BLOCKED** — Waiting for RFC-004 and RFC-005-BE completion

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
- `apps/web/components/providers/ProviderAccessGate.tsx` (Gate component)
- `apps/web/app/onboarding/provider/verification-status/page.tsx` (Status page)
- `apps/web/app/auth/login/page.tsx` (Update login redirect logic)
- `docs/mockups/verification-status.html` (Mockup — needs creation)

**ProviderAccessGate Component:**

1. **Component Logic**
   - Check user role is PROVIDER
   - Check `onboardingCompleted` status
   - Check `providerOnboardingCompleted` status
   - Check `emailVerified` status
   - Check `ProviderProfile.verifiedAt` status
   - Redirect based on status
   - Show blocking message with status

2. **Redirect Logic**
   - Email not verified → `/auth/verify-email`
   - Onboarding incomplete → `/onboarding/provider/welcome`
   - Verification pending → `/onboarding/provider/verification-status`
   - Verification rejected → `/onboarding/provider/verification-status`
   - Verified → Allow access

3. **Blocking Message**
   - Show status-specific message
   - Show remediation steps
   - Show "Continue" button (redirects to appropriate page)

**Verification Status Page:**

1. **Page States**
   - Pending — "Your verification is pending admin review"
   - Approved — "Your verification is complete" (shouldn't see this page)
   - Rejected — "Your verification was rejected. Please update your credentials."
   - Changes Requested — "Please update your credentials based on admin feedback."

2. **Page Features**
   - Display verification case status
   - Display onboarding completion status
   - Show "Update Credentials" button (if rejected/changes requested)
   - Show "Contact Support" link
   - Show "Back to Dashboard" link (if verified)

**Login Redirect Logic:**

1. **After Login**
   - Check user role
   - If PROVIDER, check status:
     - Email not verified → Redirect to `/auth/verify-email`
     - Onboarding incomplete → Redirect to `/onboarding/provider/welcome`
     - Verification pending/rejected → Redirect to `/onboarding/provider/verification-status`
     - Verified → Redirect to dashboard

2. **Status Checking**
   - Call `GET /users/me` to get user status
   - Call `GET /providers/{id}/verification-status` to get verification status
   - Determine redirect based on status

**Error Handling:**
- Handle 403 Forbidden errors from backend
- Parse structured error responses
- Display appropriate remediation steps
- Handle network errors gracefully

---

## Acceptance Criteria

### ProviderAccessGate Component
- [ ] Component checks verification status
- [ ] Component redirects based on status
- [ ] Component shows blocking message
- [ ] Component shows remediation steps
- [ ] Component handles errors gracefully

### Verification Status Page
- [ ] Page displays verification status
- [ ] Page displays onboarding status
- [ ] Page shows appropriate actions based on status
- [ ] Page handles pending state
- [ ] Page handles rejected state
- [ ] Page handles changes requested state

### Login Redirect Logic
- [ ] Redirects to email verification if not verified
- [ ] Redirects to onboarding if incomplete
- [ ] Redirects to verification status if pending/rejected
- [ ] Redirects to dashboard if verified
- [ ] Handles errors gracefully

### Protected Pages
- [ ] Provider dashboard protected
- [ ] Request marketplace protected
- [ ] Request details protected
- [ ] Order management protected
- [ ] Messages protected

### Technical Requirements
- [ ] Uses generated API client
- [ ] TypeScript compiles without errors
- [ ] Follows existing component patterns
- [ ] Error handling matches existing patterns
- [ ] Accessibility (WCAG AA) compliant
- [ ] Responsive design (mobile-first)

---

## Implementation Steps

1. **Wait for Dependencies**
   - RFC-004 must be complete
   - RFC-005-BE must be complete
   - API endpoints must be available
   - OpenAPI spec must be updated

2. **Create Mockup**
   - Create `docs/mockups/verification-status.html`
   - Follow existing mockup patterns
   - Include all page states

3. **Regenerate API Client**
   - Run `pnpm run generate` in `packages/client`
   - Verify `getVerificationStatus` method exists
   - Verify `GET /users/me` includes completion fields

4. **Implement ProviderAccessGate Component**
   - Create `apps/web/components/providers/ProviderAccessGate.tsx`
   - Implement status checking logic
   - Implement redirect logic
   - Implement blocking message
   - Add error handling

5. **Implement Verification Status Page**
   - Create `apps/web/app/onboarding/provider/verification-status/page.tsx`
   - Implement status display
   - Implement action buttons
   - Add error handling
   - Add accessibility features
   - Add responsive design

6. **Update Login Redirect Logic**
   - Modify `apps/web/app/auth/login/page.tsx`
   - Add provider status checking
   - Add redirect logic
   - Add error handling

7. **Apply Gate to Protected Pages**
   - Wrap protected pages with `ProviderAccessGate`
   - Test gate behavior
   - Test redirects

8. **Test Complete Flow**
   - Test login redirect logic
   - Test gate blocking
   - Test verification status page
   - Test error handling
   - Test accessibility
   - Test responsive design

---

## Testing Requirements

### Manual Testing
- [ ] ProviderAccessGate works correctly
- [ ] Verification status page works correctly
- [ ] Login redirect logic works correctly
- [ ] Protected pages are blocked correctly
- [ ] Error handling works correctly
- [ ] Accessibility works (WCAG AA)
- [ ] Responsive design works (mobile-first)

---

## Dependencies

- ⚠️ **RFC-004** — MUST be complete first
- ⚠️ **RFC-005-BE** — MUST be complete first
- ✅ Component patterns — Already exist
- ✅ API client — Will be regenerated after backend

---

## References

- **RFC:** `RFCs/RFC-005-provider-verification-gating-system.md`
- **RFC-004:** `RFCs/RFC-004-onboarding-completion-tracking.md`
- **Backend Task:** `docs/tasks/TASK_RFC_005_BE_PROVIDER_VERIFICATION_GATING.md`
- **Onboarding Pages:** `apps/web/app/onboarding/provider/` (M1-FE-6 reference)

---

## Notes

- **Dependency:** Must wait for RFC-004 and RFC-005-BE completion
- **Coordination:** Coordinate rollout with backend to avoid limbo state
- **Error Handling:** Must parse structured 403 errors from backend
- **User Experience:** Clear messaging is critical for user understanding

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ **BLOCKED** — Waiting for RFC-004 and RFC-005-BE completion

