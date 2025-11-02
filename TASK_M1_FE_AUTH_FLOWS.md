# Task M1-FE-2: Login/Register Flows Implementation

**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Frontend Engineer  
**Duration:** 1–1.5 days  
**Status:** ⚠️ IN PROGRESS — Files created by Scope Guardian (incorrect role), awaiting Frontend Engineer review  
**Priority:** HIGH (core authentication flow)  
**⚠️ INCIDENT:** Scope Guardian created implementation files (role boundary violation). Files kept per user request. Frontend Engineer to review/validate/complete.

---

## User Story

**As a** user (seeker or provider),  
**I want to** register and log in with smart validation and typo detection,  
**So that** I can access the platform securely and efficiently.

---

## Goal

Implement login and register flows with smart validation, typo detection, real-time password strength indicator, and proper error handling, matching the production-ready mockup designs.

---

## Scope (Per Spec Section 2 & OpenAPI v0.2.1)

**Routes:**
- `/auth/login` → Login page
- `/auth/register` → Full registration page
- `/auth/register/simple` → Simplified registration (email + password only)

**Mockup References:**
- `docs/mockups/login.html`
- `docs/mockups/register.html`
- `docs/mockups/register-simple.html`

**API Endpoints:**
- `POST /auth/login` (OpenAPI v0.2.1)
- `POST /auth/register` (OpenAPI v0.2.1)
- `POST /auth/forgot-password` (OpenAPI v0.2.1 — RFC-002)
- `POST /auth/reset-password` (OpenAPI v0.2.1 — RFC-002)

**Spec Reference:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)

**⚠️ SCOPE WARNING:** Implement exactly per spec and OpenAPI contract. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (`docs/mockups/login.html`, `register.html`, `register-simple.html`)
- [x] API contract defined ✅ (OpenAPI v0.2.1 — `POST /auth/login`, `POST /auth/register`)
- [x] Prisma schema ready ✅ (User model exists in `apps/api/prisma/schema.prisma`)
- [x] Error states documented ✅ (OpenAPI spec — invalid credentials, weak password, duplicate email, etc.)
- [x] Analytics events defined ⏳ (optional — track registration/login events if needed)
- [x] Dependencies identified ✅ (OpenAPI client generated, ready for use)
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

### Implementation Details

**File Locations:**
- `apps/web/app/auth/login/page.tsx` (Login page)
- `apps/web/app/auth/register/page.tsx` (Full registration page)
- `apps/web/app/auth/register/simple/page.tsx` (Simplified registration page)

**Components to Create:**
1. **Login Page:**
   - Email/password inputs
   - Remember me checkbox
   - Forgot password link (→ `/auth/forgot-password`)
   - Submit button with loading state
   - Error message display

2. **Register Page (Full):**
   - Email/password inputs
   - Real-time password strength indicator (4-bar)
   - Inline validation hints
   - Proper autocomplete attributes
   - Submit button with loading state
   - Error message display

3. **Register Page (Simple):**
   - Email/password inputs only
   - "Complete later" messaging
   - 30-second promise
   - Submit button with loading state
   - Error message display

**API Client Usage:**
```typescript
import { api } from '@visaontrack/client';

// Login
await api.auth.login({
  email: string,
  password: string,
  rememberMe?: boolean
});

// Register
await api.auth.register({
  email: string,
  password: string,
  name?: string,
  phone?: string
});
```

**Smart Validation:**
- Email format validation (client-side + server-side)
- Typo detection (email domain suggestions)
- Password strength validation (uppercase, lowercase, number, special character — per OpenAPI spec)
- Real-time feedback (inline hints)

**Error Handling:**
- Invalid credentials (401 Unauthorized)
- Weak password (400 Bad Request)
- Duplicate email (400 Bad Request)
- Network errors
- Rate limiting (429 Throttled)

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

### Login Flow
- [ ] Login page renders at `/auth/login`
- [ ] Email/password inputs with proper labels
- [ ] Remember me checkbox works
- [ ] Forgot password link redirects to `/auth/forgot-password`
- [ ] Submit button shows loading state during API call
- [ ] Invalid credentials error displayed (401)
- [ ] Successful login redirects to dashboard/home
- [ ] JWT token stored in HttpOnly cookie (handled by backend)
- [ ] Page matches mockup design exactly

### Register Flow (Full)
- [ ] Register page renders at `/auth/register`
- [ ] Email/password inputs with proper labels
- [ ] Real-time password strength indicator (4-bar)
- [ ] Inline validation hints display
- [ ] Proper autocomplete attributes (email, new-password)
- [ ] Submit button shows loading state during API call
- [ ] Weak password error displayed (400)
- [ ] Duplicate email error displayed (400)
- [ ] Successful registration redirects to account type selection
- [ ] Page matches mockup design exactly

### Register Flow (Simple)
- [ ] Simple register page renders at `/auth/register/simple`
- [ ] Email/password inputs only
- [ ] "Complete later" messaging displayed
- [ ] 30-second promise displayed
- [ ] Submit button shows loading state during API call
- [ ] Error handling works
- [ ] Successful registration redirects to account type selection
- [ ] Page matches mockup design exactly

### Technical Requirements
- [ ] Uses Next.js App Router
- [ ] TypeScript compiles without errors
- [ ] Uses Tailwind CSS for styling
- [ ] Uses shadcn/ui components (form, input, button, etc.)
- [ ] Uses Lucide icons (if applicable)
- [ ] Uses `@visaontrack/client` for API calls
- [ ] No manual API calls (must use generated client)
- [ ] No linter errors
- [ ] Accessibility (a11y) checked (WCAG AA)

### Design Requirements
- [ ] Matches mockup designs exactly (`login.html`, `register.html`, `register-simple.html`)
- [ ] Colors match design system (`docs/mockups/ELITE_DESIGN_SYSTEM.md`)
- [ ] Typography matches design system
- [ ] Spacing matches design system (4px grid)
- [ ] Form validation animations work smoothly

---

## DoD Checklist (Definition of Done)

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (API calls)
- [ ] E2E tests written and passing (user flows)
- [ ] Accessibility (a11y) checked (keyboard nav, screen readers)
- [ ] Responsive design verified (mobile + desktop)
- [ ] Preview URL available (Vercel preview deployment)
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] Contract tests passing (OpenAPI client generation)
- [ ] Matches mockup designs exactly
- [ ] Scope Guardian approval ✅ **REQUIRED** (spec adherence verification)

**⚠️ CRITICAL:** Do not mark task complete without Scope Guardian approval.

---

## References

### Mockups
- **Login:** `docs/mockups/login.html`
- **Register (Full):** `docs/mockups/register.html`
- **Register (Simple):** `docs/mockups/register-simple.html`
- **Design System:** `docs/mockups/ELITE_DESIGN_SYSTEM.md`
- **Patterns:** `docs/mockups/WORLD_CLASS_PATTERNS.md`

### Spec
- **Spec Document:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)
- **Milestone Document:** `MILESTONE_M1.md` (Task 2)

### API Contract
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)
- **Endpoints:** `POST /auth/login`, `POST /auth/register`
- **Schemas:** LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
- **Error Responses:** 400 Bad Request, 401 Unauthorized, 429 Throttled

### Prisma Schema
- **User Model:** `apps/api/prisma/schema.prisma` (User model)

### Generated Client
- **Package:** `@visaontrack/client`
- **Location:** `packages/client/src`
- **Usage:** `import { api } from '@visaontrack/client';`

---

## Dependencies

**Blocking Dependencies:**
- [x] OpenAPI client generated ✅ (M0 Task 4 complete)
- [ ] Backend Engineer: Authentication API endpoints (`POST /auth/login`, `POST /auth/register`) ⏳ (M1 Backend Task 7)

**Parallel Work:** Can start with frontend implementation using mock data, but requires backend API for completion.

---

## Testing Requirements

### Unit Tests
- [ ] Login form component renders
- [ ] Register form component renders
- [ ] Form validation works (email format, password strength)
- [ ] Password strength indicator updates correctly
- [ ] Typo detection works (email domain suggestions)

### Integration Tests
- [ ] API calls use generated client correctly
- [ ] Login API call succeeds with valid credentials
- [ ] Register API call succeeds with valid data
- [ ] Error handling works (invalid credentials, weak password, duplicate email)
- [ ] Rate limiting handled correctly (429 Throttled)

### E2E Tests
- [ ] Login flow works end-to-end
- [ ] Register flow works end-to-end
- [ ] Error states display correctly
- [ ] Redirects work after successful login/register

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
   - [ ] Performance optimized

2. **QA Engineer Review** ⏳ (accessibility & responsiveness)
   - [ ] Accessibility (a11y) verified
   - [ ] Responsive design verified
   - [ ] Cross-browser testing completed
   - [ ] Form validation tested

3. **Security Guard Review** ⏳ (security requirements)
   - [ ] Password validation matches OpenAPI spec
   - [ ] No sensitive data in logs
   - [ ] Rate limiting handled correctly
   - [ ] JWT token handling secure (HttpOnly cookie)

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
- Login page at `/auth/login`
- Register page (full) at `/auth/register`
- Register page (simple) at `/auth/register/simple`
- Smart validation (email format, password strength)
- Typo detection (email domain suggestions)
- Remember me functionality
- Forgot password link (→ `/auth/forgot-password`)
- Real-time password strength indicator (4-bar)
- Inline validation hints
- Proper autocomplete attributes
- Responsive design
- Accessibility (WCAG AA)

### ❌ Out of Scope (Requires RFC)
- Email verification flow
- OAuth/social login
- Multi-factor authentication (MFA)
- Account activation flow
- Terms of service acceptance (unless in spec)
- Privacy policy acceptance (unless in spec)
- Analytics tracking (unless explicitly approved)
- Extra form fields beyond spec
- Custom authentication methods

**⚠️ SCOPE WARNING:** If you need anything beyond the above, create an RFC first.

---

## Success Criteria

✅ **Task is complete when:**
1. All three pages (login, register full, register simple) implemented
2. All pages match mockup designs exactly
3. All acceptance criteria met
4. All DoD checklist items complete
5. All reviews approved (Tech Lead, QA, Security Guard, Scope Guardian, PM)
6. Preview URL available and working
7. No linter errors
8. TypeScript compiles without errors
9. API calls use generated client correctly

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ PENDING — Ready to start  
**Next Step:** Implement login/register flows matching mockups and using OpenAPI client

