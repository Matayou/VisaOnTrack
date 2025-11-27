# Task M1-FE-4/5/6: Onboarding Pages Implementation

**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Frontend Engineer  
**Duration:** 2–2.5 days (combined)  
**Status:** ✅ **COMPLETE** — All reviews approved, task complete  
**Priority:** HIGH (core onboarding flow)

---

## User Story

**As a** new user (seeker or provider),  
**I want to** complete onboarding with clear guidance and validation,  
**So that** I can set up my account correctly and efficiently.

---

## Goal

Implement account type selection, seeker onboarding welcome, and provider onboarding (5 steps) with proper validation, file uploads, and progress tracking, matching the production-ready mockup designs.

---

## Scope (Per Spec Section 2 & OpenAPI v0.2.1)

**Routes:**
- `/onboarding/account-type` → Account type selection (Seeker vs Provider)
- `/onboarding/seeker/welcome` → Seeker onboarding welcome
- `/onboarding/provider/welcome` → Provider onboarding welcome (Step 1)
- `/onboarding/provider/business` → Business details (Step 2)
- `/onboarding/provider/services` → Services & pricing (Step 3)
- `/onboarding/provider/credentials` → Credentials upload (Step 4)
- `/onboarding/provider/credentials/complete` → Credentials complete (Step 5)
- `/onboarding/provider/payouts` → Payment setup (Step 6 — Stripe Connect)

**Mockup References:**
- `docs/mockups/account-type.html`
- `docs/mockups/onboarding-seeker.html`
- `docs/mockups/onboarding-provider.html`
- `docs/mockups/business-details.html`
- `docs/mockups/services-pricing.html`
- `docs/mockups/credentials.html`
- `docs/mockups/credentials-complete.html`
- `docs/mockups/payment-setup.html`

**API Endpoints:**
- `PATCH /users/me` (update user role)
- `POST /providers` (create provider profile)
- `GET /providers/{id}` (get provider profile)
- `PATCH /providers/{id}` (update provider profile)
- `POST /messages/attachments` (upload credentials)
- Stripe Connect onboarding endpoints

**Spec Reference:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)

**⚠️ SCOPE WARNING:** Implement exactly per spec and OpenAPI contract. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (all mockups exist in `docs/mockups/`)
- [x] API contract defined ✅ (OpenAPI v0.2.1 — provider endpoints)
- [x] Prisma schema ready ✅ (User, Provider, Attachment models exist)
- [x] Error states documented ✅ (OpenAPI spec — validation errors, file upload errors, etc.)
- [x] Analytics events defined ⏳ (optional — track onboarding completion if needed)
- [x] Dependencies identified ✅ (OpenAPI client generated, Stripe Connect SDK)
- [x] DoR reviewed and approved ✅

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
- **File Upload:** Native HTML5 file upload or library (per spec)
- **Stripe Connect:** Stripe Connect SDK (for payment setup)

### Implementation Details

**File Locations:**
- `apps/web/app/onboarding/account-type/page.tsx` (Account type selection)
- `apps/web/app/onboarding/seeker/welcome/page.tsx` (Seeker welcome)
- `apps/web/app/onboarding/provider/welcome/page.tsx` (Provider welcome)
- `apps/web/app/onboarding/provider/business/page.tsx` (Business details)
- `apps/web/app/onboarding/provider/services/page.tsx` (Services & pricing)
- `apps/web/app/onboarding/provider/credentials/page.tsx` (Credentials upload)
- `apps/web/app/onboarding/provider/credentials/complete/page.tsx` (Credentials complete)
- `apps/web/app/onboarding/provider/payouts/page.tsx` (Payment setup)

**Components to Create:**

1. **Account Type Selection:**
   - Interactive selection cards (Seeker vs Provider)
   - Smooth hover/selected states
   - Feature lists per type
   - Continue button

2. **Seeker Onboarding Welcome:**
   - 4 key benefits with icons
   - Hover animations on benefit cards
   - Clear next actions (Get Started button)

3. **Provider Onboarding (5 Steps):**
   - **Step 1: Welcome** — Progress bar (5 steps), overview, step cards
   - **Step 2: Business Details** — Multi-field form (basic info, location, expertise), character counter, icon-enhanced inputs
   - **Step 3: Services & Pricing** — Service cards with add/remove, price inputs with currency prefix, duration and description fields
   - **Step 4: Credentials Upload** — Drag-and-drop file upload, file list with preview, upload progress states, multiple file types
   - **Step 5: Credentials Complete** — Animated success icon, timeline with review estimate, clear next steps
   - **Step 6: Payment Setup** — Stripe Connect branding, benefits explanation, external redirect flow

**API Client Usage:**
```typescript
import { api } from '@visaontrack/client';

// Update user role
await api.users.updateMe({
  role: 'SEEKER' | 'PROVIDER'
});

// Create/update provider
await api.providers.createProvider({
  businessName: string,
  description: string,
  location: string,
  // ... other fields
});

// Upload attachments
await api.messages.uploadAttachment({
  file: File,
  // ... other fields
});
```

**File Upload Requirements (Per Spec Section 5):**
- File size limits (per provider plan — Free: 2MB, Pro: 25MB, Pro+: 100MB, Enterprise: 250MB)
- File type validation
- Multiple file uploads
- Progress tracking
- Error handling (413 PayloadTooLarge, 403 AttachmentLimitExceeded)

**Stripe Connect Integration:**
- Redirect to Stripe Connect onboarding
- Handle Stripe Connect redirects
- Store Stripe Connect account ID

**Progress Tracking:**
- Progress bar shows current step
- Step completion validation
- Auto-save indicators (optional for MVP)

**Responsive Design:**
- Mobile-first approach
- Desktop breakpoints per mockup
- Touch-friendly inputs (44px minimum)

**Accessibility:**
- Semantic HTML (form, label, input, button)
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Error announcements (ARIA live regions)

---

## Acceptance Criteria

### Account Type Selection
- [ ] Page renders at `/onboarding/account-type`
- [ ] Interactive selection cards work (Seeker vs Provider)
- [ ] Smooth hover/selected states work
- [ ] Feature lists display per type
- [ ] Continue button updates user role
- [ ] Redirects to appropriate onboarding flow
- [ ] Page matches mockup design exactly

### Seeker Onboarding Welcome
- [ ] Page renders at `/onboarding/seeker/welcome`
- [ ] 4 key benefits display with icons
- [ ] Hover animations work on benefit cards
- [ ] Get Started button redirects appropriately
- [ ] Page matches mockup design exactly

### Provider Onboarding (5 Steps)
- [ ] **Step 1: Welcome** — Progress bar shows 5 steps, overview displays, step cards render
- [ ] **Step 2: Business Details** — Form fields render, character counter works, icon-enhanced inputs display
- [ ] **Step 3: Services & Pricing** — Service cards work, add/remove functions, price inputs validate
- [ ] **Step 4: Credentials Upload** — Drag-and-drop works, file list displays, upload progress shows, file type validation works
- [ ] **Step 5: Credentials Complete** — Success icon animates, timeline displays, next steps shown
- [ ] **Step 6: Payment Setup** — Stripe Connect branding displays, redirect to Stripe Connect works

### Technical Requirements
- [ ] Uses Next.js App Router
- [ ] TypeScript compiles without errors
- [ ] Uses Tailwind CSS for styling
- [ ] Uses shadcn/ui components
- [ ] Uses Lucide icons
- [ ] Uses `@visaontrack/client` for API calls
- [ ] No manual API calls (must use generated client)
- [ ] File uploads work correctly
- [ ] Stripe Connect integration works
- [ ] No linter errors
- [ ] Accessibility (a11y) checked (WCAG AA)

### Design Requirements
- [ ] Matches mockup designs exactly (all 8 pages)
- [ ] Colors match design system (`docs/mockups/ELITE_DESIGN_SYSTEM.md`)
- [ ] Typography matches design system
- [ ] Spacing matches design system (4px grid)
- [ ] Animations work smoothly
- [ ] Progress tracking works correctly

---

## DoD Checklist (Definition of Done)

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (API calls, file uploads)
- [ ] E2E tests written and passing (user flows)
- [ ] Accessibility (a11y) checked (keyboard nav, screen readers)
- [ ] Responsive design verified (mobile + desktop)
- [ ] Preview URL available (Vercel preview deployment)
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] Contract tests passing (OpenAPI client generation)
- [ ] File uploads tested (size limits, type validation)
- [ ] Stripe Connect integration tested
- [ ] Matches mockup designs exactly
- [ ] Scope Guardian approval ✅ **REQUIRED** (spec adherence verification)

**⚠️ CRITICAL:** Do not mark task complete without Scope Guardian approval.

---

## References

### Mockups
- **Account Type:** `docs/mockups/account-type.html`
- **Seeker Welcome:** `docs/mockups/onboarding-seeker.html`
- **Provider Welcome:** `docs/mockups/onboarding-provider.html`
- **Business Details:** `docs/mockups/business-details.html`
- **Services & Pricing:** `docs/mockups/services-pricing.html`
- **Credentials Upload:** `docs/mockups/credentials.html`
- **Credentials Complete:** `docs/mockups/credentials-complete.html`
- **Payment Setup:** `docs/mockups/payment-setup.html`
- **Design System:** `docs/mockups/ELITE_DESIGN_SYSTEM.md`
- **Patterns:** `docs/mockups/WORLD_CLASS_PATTERNS.md`

### Spec
- **Spec Document:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes), Section 5 (API endpoints)
- **Milestone Document:** `MILESTONE_M1.md` (Tasks 4, 5, 6)

### API Contract
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)
- **Endpoints:** `PATCH /users/me`, `POST /providers`, `GET /providers/{id}`, `PATCH /providers/{id}`, `POST /messages/attachments`
- **Schemas:** Provider, Attachment, ServicePackage
- **Error Responses:** 400 Bad Request, 403 EntitlementExceeded, 413 PayloadTooLarge, 429 Throttled

### Prisma Schema
- **User Model:** `apps/api/prisma/schema.prisma` (User model with role field)
- **Provider Model:** `apps/api/prisma/schema.prisma` (Provider model)
- **Attachment Model:** `apps/api/prisma/schema.prisma` (Attachment model)

### Generated Client
- **Package:** `@visaontrack/client`
- **Location:** `packages/client/src`
- **Usage:** `import { api } from '@visaontrack/client';`

---

## Dependencies

**Blocking Dependencies:**
- [x] OpenAPI client generated ✅ (M0 Task 4 complete)
- [ ] Backend Engineer: Provider onboarding API endpoints ⏳ (M1 Backend Task 9)
- [ ] Stripe Connect SDK configured ⏳ (requires Stripe account setup)

**Parallel Work:** Can start with frontend implementation using mock data, but requires backend API for completion.

---

## Testing Requirements

### Unit Tests
- [ ] Account type selection component renders
- [ ] Onboarding form components render
- [ ] Form validation works (business details, services, pricing)
- [ ] File upload component works
- [ ] Progress tracking works

### Integration Tests
- [ ] API calls use generated client correctly
- [ ] User role update works
- [ ] Provider creation works
- [ ] Provider update works
- [ ] File upload works (size limits, type validation)
- [ ] Stripe Connect redirect works
- [ ] Error handling works (validation errors, file upload errors)

### E2E Tests
- [ ] Account type selection flow works
- [ ] Seeker onboarding flow works
- [ ] Provider onboarding flow works (all 5 steps)
- [ ] File upload flow works
- [ ] Stripe Connect flow works

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader announces form fields correctly
- [ ] ARIA labels present where needed
- [ ] Error messages announced (ARIA live regions)
- [ ] Color contrast meets WCAG AA

---

## Review Process

### Multi-Agent Review (Required Before Completion)

1. **Tech Lead Review** ⏳ (technical implementation quality)
   - [ ] Code follows Next.js best practices
   - [ ] TypeScript types correct
   - [ ] API client usage correct (no manual API calls)
   - [ ] File upload implementation secure
   - [ ] Stripe Connect integration correct
   - [ ] Performance optimized

2. **QA Engineer Review** ⏳ (accessibility & responsiveness)
   - [ ] Accessibility (a11y) verified
   - [ ] Responsive design verified
   - [ ] Cross-browser testing completed
   - [ ] Form validation tested
   - [ ] File upload tested

3. **Security Guard Review** ⏳ (security requirements)
   - [ ] File upload size limits enforced
   - [ ] File type validation enforced
   - [ ] No sensitive data in logs
   - [ ] Stripe Connect integration secure

4. **Scope Guardian Review** ⏳ **REQUIRED** (spec adherence)
   - [ ] Implementation matches spec Section 2 exactly
   - [ ] API calls match OpenAPI v0.2.1 contract
   - [ ] No scope creep (no extra features)
   - [ ] Mockup designs matched exactly

5. **PM Final Approval** ⏳ (DoD satisfaction)
   - [ ] All DoD checklist items complete
   - [ ] All reviews approved

**⚠️ CRITICAL:** Scope Guardian approval is REQUIRED before marking task complete.

---

## Scope Discipline

### ✅ In Scope (Per Spec)
- Account type selection at `/onboarding/account-type`
- Seeker onboarding welcome at `/onboarding/seeker/welcome`
- Provider onboarding (5 steps) at `/onboarding/provider/*`
- Progress tracking (progress bar)
- File uploads (drag-and-drop, progress states)
- Stripe Connect integration (payment setup)
- Responsive design
- Accessibility (WCAG AA)

### ❌ Out of Scope (Requires RFC)
- Email verification flow
- Account activation flow
- Additional onboarding steps
- Custom file upload providers
- Extra validation beyond spec
- Analytics tracking (unless explicitly approved)

**⚠️ SCOPE WARNING:** If you need anything beyond the above, create an RFC first.

---

## Success Criteria

✅ **Task is complete when:**
1. All onboarding pages (8 pages) implemented
2. All pages match mockup designs exactly
3. All acceptance criteria met
4. All DoD checklist items complete
5. All reviews approved (Tech Lead, QA, Security Guard, Scope Guardian, PM)
6. Preview URL available and working
7. No linter errors
8. TypeScript compiles without errors
9. API calls use generated client correctly
10. File uploads work correctly
11. Stripe Connect integration works

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ PENDING — Ready to start  
**Next Step:** Implement onboarding pages matching mockups and using OpenAPI client

