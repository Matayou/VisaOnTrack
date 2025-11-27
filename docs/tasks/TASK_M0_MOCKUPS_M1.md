# Task: Create M1 Mockups/Wireframes (Prerequisite)

**RFC:** RFC-001 (Approved)  
**Milestone:** M0 → M1 Prerequisite  
**Assigned To:** Frontend Engineer (or dedicated designer)  
**Status:** 📋 PENDING

---

## Goal
Create HTML mock files for M1 (Auth & Onboarding) routes to satisfy DoR checklist requirements and unblock M1 frontend work.

**Background:** Spec Section 2 references HTML mocks that don't exist. DoR checklist requires wireframes/mocks before frontend work can begin.

---

## DoR Checklist (Definition of Ready)
- [x] User story defined ✅
- [x] Wireframe/mock available ⏳ (THIS TASK creates them)
- [x] API contract defined (OpenAPI) ✅ (M0 Task 2)
- [x] Error states documented ⏳ (Document per mockup)
- [ ] Analytics events defined (if applicable)
- [x] Dependencies identified ✅ (None — can proceed immediately)
- [ ] DoR reviewed and approved

---

## Scope (M1 Routes Only)

Create HTML mock files for M1 (Auth & Onboarding) routes per spec Section 2:

### Auth Routes
1. `/auth/login` → `login-page.html`
2. `/auth/register` → `register-page.html`
3. `/auth/register/simple` → `simplified-registration.html`

### Onboarding Routes
4. `/onboarding/account-type` → `account-type-selection.html`
5. `/onboarding/seeker/welcome` → `onboarding-welcome.html`
6. `/onboarding/provider/welcome` → `provider-onboarding-welcome.html`
7. `/onboarding/provider/business` → `business-details-page.html`
8. `/onboarding/provider/services` → `services-pricing-improved.html`
9. `/onboarding/provider/credentials` → `credentials-page.html`
10. `/onboarding/provider/credentials/complete` → `complete-credentials-page.html`
11. `/onboarding/provider/payouts` → `payment-setup-final.html`

**Total:** 11 HTML mock files for M1 routes

---

## Deliverables

### Files to Create
- `docs/mockups/login-page.html`
- `docs/mockups/register-page.html`
- `docs/mockups/simplified-registration.html`
- `docs/mockups/account-type-selection.html`
- `docs/mockups/onboarding-welcome.html`
- `docs/mockups/provider-onboarding-welcome.html`
- `docs/mockups/business-details-page.html`
- `docs/mockups/services-pricing-improved.html`
- `docs/mockups/credentials-page.html`
- `docs/mockups/complete-credentials-page.html`
- `docs/mockups/payment-setup-final.html`

### Documentation
- Update `visaontrack-v2-spec.md` Section 2 to link to actual files
- Document error states per mockup (if applicable)
- Create mockup index/readme in `docs/mockups/README.md`

---

## Requirements

### Technical Requirements
- HTML files (static, no build process required)
- Responsive design (mobile + desktop)
- Use Tailwind CSS classes (aligned with frontend stack)
- Use shadcn/ui component patterns (aligned with frontend stack)
- Use Lucide icons (aligned with frontend stack)
- Accessible (a11y) — keyboard nav, ARIA labels where needed

### Design Requirements
- Match spec Section 2 route descriptions
- Follow request-centric marketplace UX patterns
- Two-sided marketplace: seeker vs provider flows
- Clear account type selection (SEEKER/PROVIDER)
- Provider onboarding: business → services → credentials → payouts

### Content Requirements
- Thai visa context (Thailand location, visa types)
- English + Thai language support (UI should support both)
- Error states documented (if applicable per route)
- Loading states (if applicable per route)

---

## Acceptance Criteria

- [ ] All 11 HTML mock files created
- [ ] Files stored in `docs/mockups/` directory
- [ ] Files match spec Section 2 route descriptions
- [ ] Files use Tailwind CSS classes
- [ ] Files are responsive (mobile + desktop)
- [ ] Files are accessible (keyboard nav, ARIA labels)
- [ ] Error states documented (if applicable)
- [ ] Spec Section 2 links updated to actual files
- [ ] Mockup index/readme created
- [ ] DoR checklist can be satisfied for M1 tasks
- [ ] Tech Lead review approved
- [ ] Scope Guardian review approved

---

## Dependencies

**None** — Can proceed immediately after RFC approval.

**Blocks:**
- M1 frontend work (cannot start without mockups per DoR)

---

## Timeline

**Estimate:** 1-2 days

**Tasks:**
1. Create HTML mock files (11 files)
2. Review with Tech Lead
3. Review with Scope Guardian
4. Update spec Section 2 links
5. Create mockup index/readme

---

## Notes

- These are static HTML files (no build process)
- Use Tailwind CSS CDN or inline styles (aligned with frontend stack)
- Use shadcn/ui component patterns (buttons, forms, cards, etc.)
- Focus on M1 routes only (remaining routes can be created per milestone)
- Mockups should be functional enough for Frontend Engineer to reference

---

## References

- Spec Section 2: `visaontrack-v2-spec.md` (lines 43-80)
- RFC-001: `RFCs/RFC-001-mockups-prerequisite.md`
- Frontend Stack: Tailwind + shadcn/ui + Lucide (spec Section 1)
- DoR Checklist: `TASK_TEMPLATES.md`

---

**Created:** 2025-01-11  
**RFC:** RFC-001 (Approved)  
**Status:** 📋 PENDING ASSIGNMENT

