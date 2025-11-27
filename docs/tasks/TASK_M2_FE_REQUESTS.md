# Task M2-FE-1: Requests List & Detail Pages

**Milestone:** M2 — Requests & Messaging  
**Assigned To:** Frontend Engineer  
**Duration:** 1.5–2 days  
**Status:** ⏳ PENDING  
**Priority:** HIGH (core request functionality)

---

## User Story

**As a** Seeker,  
**I want to** create, view, and manage my visa requests through a user-friendly interface,  
**So that** I can post requests and allow providers to respond with quotes.

---

## Goal

Implement request pages (`/requests`, `/requests/[id]`, `/requests/new`) with listing, filtering, creation, and editing functionality, matching the OpenAPI contract and design patterns.

---

## Scope (Per Spec Section 2)

**Routes:**
- `/requests` — Request list page (with filters)
- `/requests/[id]` — Request detail/summary page
- `/requests/new` — Post new request form

**Mockup References:** Check `docs/mockups/` for request-related mockups  
**Spec Reference:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes)

**⚠️ SCOPE WARNING:** Implement exactly per spec and OpenAPI contract. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ⏳ (Check `docs/mockups/` for request mockups)
- [x] API contract defined ✅ (OpenAPI v0.2.x — requests endpoints)
- [x] Prisma schema ready ✅ (Request model exists)
- [x] Error states documented ✅ (OpenAPI spec — 400, 401, 403, 404)
- [x] Analytics events defined ⏳ (optional — track request creation if needed)
- [x] Dependencies identified ✅ (Next.js, API client, TanStack Query)
- [x] DoR reviewed and approved ✅

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation (pending backend API completion)

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide icons
- **API Client:** `@visaontrack/client` (generated from OpenAPI)
- **Data Fetching:** TanStack Query

### Implementation Details

**File Locations:**
- `apps/web/app/requests/page.tsx` — Request list page
- `apps/web/app/requests/[id]/page.tsx` — Request detail page
- `apps/web/app/requests/new/page.tsx` — Create request form
- `apps/web/app/requests/[id]/edit/page.tsx` — Edit request form (optional, can use same form)

**Pages to Implement:**

1. **`/requests` — Request List Page**
   - Display paginated list of requests
   - Filters: status (DRAFT, OPEN, CLOSED, HIRED), seekerId (for own requests)
   - Pagination controls
   - Request cards with: title, description preview, status badge, created date
   - "Create Request" button (SEEKER role only)
   - Link to request detail page

2. **`/requests/[id]` — Request Detail Page**
   - Display full request details
   - Show: title, description, visaType, budget range, location, status, created date
   - Edit button (owner only)
   - Link to message thread (`/requests/[id]/thread`)
   - Status badge
   - Action buttons based on status (e.g., "Publish" for DRAFT)

3. **`/requests/new` — Create Request Form**
   - Form fields:
     - Title (required, max 200 chars)
     - Description (required, max 10000 chars)
     - Visa Type (optional, max 100 chars)
     - Budget Min (optional, number)
     - Budget Max (optional, number)
     - Location (optional, max 200 chars)
   - Validation (client-side + server)
   - Submit creates request with DRAFT status
   - Redirect to request detail page on success
   - Error handling (400, 401, 403)

**API Integration:**
- `GET /requests` — List requests (with pagination, filters)
- `POST /requests` — Create request (SEEKER role)
- `GET /requests/{id}` — Get request details
- `PATCH /requests/{id}` — Update request (owner only)

**State Management:**
- Use TanStack Query for data fetching and caching
- Optimistic updates for create/update
- Error handling with user-friendly messages

**Authorization:**
- Check user role (SEEKER) before showing create button
- Check ownership before showing edit button
- Handle 403 errors gracefully

---

## Acceptance Criteria

### Request List Page (`/requests`)
- [ ] Displays paginated list of requests
- [ ] Supports filtering by status
- [ ] Supports filtering by seekerId (own requests)
- [ ] Shows request cards with key information
- [ ] "Create Request" button visible to SEEKER role only
- [ ] Links to request detail page
- [ ] Pagination controls work correctly
- [ ] Loading states displayed
- [ ] Error states handled gracefully

### Request Detail Page (`/requests/[id]`)
- [ ] Displays full request details
- [ ] Shows all request fields (title, description, visaType, budget, location, status)
- [ ] Edit button visible to owner only
- [ ] Link to message thread
- [ ] Status badge displayed
- [ ] Action buttons based on status
- [ ] Loading states displayed
- [ ] Error states handled (404, 401, 403)

### Create Request Form (`/requests/new`)
- [ ] Form fields match spec (title, description, visaType, budget, location)
- [ ] Client-side validation (required fields, max lengths)
- [ ] Server-side validation (error handling)
- [ ] Creates request with DRAFT status
- [ ] Redirects to request detail page on success
- [ ] Error handling (400, 401, 403)
- [ ] Loading states during submission
- [ ] SEEKER role only (403 for other roles)

### Technical Requirements
- [ ] Uses Next.js App Router
- [ ] TypeScript compiles without errors
- [ ] Uses generated API client
- [ ] Uses TanStack Query for data fetching
- [ ] Follows existing code patterns (M1-FE tasks reference)
- [ ] Responsive design (mobile + desktop)
- [ ] Accessibility (WCAG AA)
- [ ] Error handling matches existing patterns

---

## Testing Requirements

### Manual Testing
- [ ] Request list displays correctly
- [ ] Filtering works (status, seekerId)
- [ ] Pagination works
- [ ] Request creation works
- [ ] Request editing works (owner only)
- [ ] Authorization checks work (role, ownership)
- [ ] Error handling works (400, 401, 403, 404)
- [ ] Loading states display correctly
- [ ] Responsive design works (mobile + desktop)

---

## Dependencies

- ⚠️ **M2-BE-1** — Requests API endpoints must be complete first
- ✅ Next.js App Router — Already configured
- ✅ API client — Already generated
- ✅ TanStack Query — Already configured
- ✅ shadcn/ui components — Already available

---

## References

- **OpenAPI Spec:** `packages/types/openapi.yaml`
- **Spec:** `visaontrack-v2-spec.md` Section 2 (Routes)
- **Mockups:** `docs/mockups/` (check for request-related mockups)
- **Reference Implementation:** `apps/web/app/onboarding/` (M1-FE tasks)

---

## Notes

- **Status Management:** DRAFT requests are not visible to providers (only OPEN requests)
- **Authorization:** Must check user role and ownership before showing actions
- **Form Validation:** Client-side validation for UX, server-side for security
- **Error Handling:** Show user-friendly error messages
- **Loading States:** Use skeleton loaders or spinners

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ PENDING (blocked on M2-BE-1)

