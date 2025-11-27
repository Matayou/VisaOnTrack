# Task M2-BE-1: Requests API Endpoints

**Milestone:** M2 — Requests & Messaging  
**Assigned To:** Backend Engineer  
**Duration:** 2–2.5 days  
**Status:** ⏳ PENDING  
**Priority:** HIGH (core request functionality)

---

## User Story

**As a** Seeker,  
**I want to** create, view, and manage my visa requests via API,  
**So that** I can post requests and allow providers to respond with quotes.

---

## Goal

Implement requests API endpoints (`GET /requests`, `POST /requests`, `GET /requests/{id}`, `PATCH /requests/{id}`) with proper authorization, status management, and pagination, matching the OpenAPI contract.

---

## Scope (Per OpenAPI v0.2.x & Spec Section 5)

**API Endpoints:**
- `GET /requests` — List requests with pagination and filters
- `POST /requests` — Create new visa request (SEEKER role)
- `GET /requests/{id}` — Get request details
- `PATCH /requests/{id}` — Update request (owner only)

**OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.x)  
**Spec Reference:** `visaontrack-v2-spec.md` Section 5 (API endpoints)

**⚠️ SCOPE WARNING:** Implement exactly per OpenAPI contract. No extra endpoints. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (N/A — backend API, frontend mockups exist)
- [x] API contract defined ✅ (OpenAPI v0.2.x — requests endpoints)
- [x] Prisma schema ready ✅ (Request model exists)
- [x] Error states documented ✅ (OpenAPI spec — 400, 401, 403, 404)
- [x] Analytics events defined ⏳ (optional — track request creation if needed)
- [x] Dependencies identified ✅ (NestJS, Prisma, JWT guard)
- [x] DoR reviewed and approved ✅

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (HttpOnly cookie) — `JwtAuthGuard` already implemented

### Implementation Details

**File Locations:**
- `apps/api/src/requests/requests.controller.ts` (Controller — endpoints)
- `apps/api/src/requests/requests.service.ts` (Service — business logic)
- `apps/api/src/requests/dto/*.dto.ts` (DTOs — request/response validation)
- `apps/api/src/requests/requests.module.ts` (Module configuration)

**Endpoints to Implement:**

1. **GET /requests**
   - Query params: `page?`, `limit?`, `status?`, `seekerId?`
   - Response: `{ data: Request[], meta: PaginationMeta }`
   - Errors: 401 Unauthorized
   - Authorization: Authenticated users (all roles)

2. **POST /requests**
   - Request: `{ title: string, description: string, visaType?: string, budgetMin?: number, budgetMax?: number, location?: string }`
   - Response: `{ id, seekerId, title, description, visaType, budgetMin, budgetMax, location, status: 'DRAFT', createdAt }`
   - Errors: 400 Bad Request, 401 Unauthorized
   - Authorization: SEEKER role only
   - Default status: `DRAFT`

3. **GET /requests/{id}**
   - Response: `Request` object
   - Errors: 401 Unauthorized, 404 Not Found
   - Authorization: Authenticated users (all roles)

4. **PATCH /requests/{id}**
   - Request: `{ title?: string, description?: string, visaType?: string, budgetMin?: number, budgetMax?: number, location?: string, status?: RequestStatus }`
   - Response: `Request` object (updated)
   - Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
   - Authorization: Owner (seekerId) only
   - Status transitions: DRAFT → OPEN → CLOSED/HIRED

**Request Status Management:**
- `DRAFT` — Initial state (not visible to providers)
- `OPEN` — Published and visible to providers
- `CLOSED` — Seeker closed without hiring
- `HIRED` — Seeker accepted a quote (triggers order creation in M3)

**Validation:**
- Title: required, max 200 characters
- Description: required, max 10000 characters
- VisaType: optional, max 100 characters
- BudgetMin/BudgetMax: optional, positive numbers, budgetMin <= budgetMax
- Location: optional, max 200 characters
- Status: enum (DRAFT, OPEN, CLOSED, HIRED)

**Pagination:**
- Default: `page=1`, `limit=20`
- Max limit: 100
- Response includes `meta: { page, limit, total, totalPages }`

---

## Acceptance Criteria

### GET /requests
- [ ] Returns paginated list of requests
- [ ] Supports filtering by status
- [ ] Supports filtering by seekerId
- [ ] Returns correct pagination metadata
- [ ] Requires authentication
- [ ] Returns 401 for unauthenticated requests

### POST /requests
- [ ] Creates request with DRAFT status
- [ ] Sets seekerId from authenticated user
- [ ] Validates required fields (title, description)
- [ ] Validates field lengths and types
- [ ] Returns created request
- [ ] Requires SEEKER role
- [ ] Returns 401 for unauthenticated requests
- [ ] Returns 403 for non-SEEKER roles

### GET /requests/{id}
- [ ] Returns request details
- [ ] Returns 404 if request not found
- [ ] Requires authentication
- [ ] Returns 401 for unauthenticated requests

### PATCH /requests/{id}
- [ ] Updates request fields
- [ ] Validates status transitions
- [ ] Only owner (seekerId) can update
- [ ] Returns updated request
- [ ] Returns 403 for non-owner attempts
- [ ] Returns 404 if request not found
- [ ] Requires authentication
- [ ] Returns 401 for unauthenticated requests

### Technical Requirements
- [ ] Uses NestJS framework
- [ ] TypeScript compiles without errors
- [ ] Uses Prisma for database queries
- [ ] Uses `JwtAuthGuard` for authentication
- [ ] Follows existing code patterns (M1-BE-7, M1-BE-8 reference)
- [ ] Unit tests implemented
- [ ] Integration tests implemented
- [ ] Security tests implemented

---

## Testing Requirements

### Unit Tests
- [ ] Service method tests (create, update, list, get)
- [ ] DTO validation tests
- [ ] Status transition tests

### Integration Tests
- [ ] Endpoint authentication tests
- [ ] Endpoint authorization tests (role checks, owner checks)
- [ ] Pagination tests
- [ ] Filtering tests
- [ ] Error handling tests

### Security Tests
- [ ] SEEKER-only creation test
- [ ] Owner-only update test
- [ ] Unauthenticated access tests

---

## Dependencies

- ✅ `JwtAuthGuard` — Already implemented (M1-BE-7)
- ✅ `PrismaService` — Already implemented
- ✅ `Request` model — Already defined in Prisma schema
- ✅ OpenAPI spec — Already defined

---

## References

- **OpenAPI Spec:** `packages/types/openapi.yaml`
- **Prisma Schema:** `apps/api/prisma/schema.prisma`
- **Spec:** `visaontrack-v2-spec.md` Section 5
- **Reference Implementation:** `apps/api/src/users/users.controller.ts` (M1-BE-8)

---

## Notes

- **Status Transitions:** Validate status changes (e.g., can't go from HIRED back to OPEN)
- **Default Status:** New requests start as DRAFT (seeker can publish later)
- **Authorization:** Owner checks must verify seekerId matches authenticated user
- **Pagination:** Use cursor-based if needed for performance (offset-based for MVP)

---

**Created:** 2025-01-11  
**Assigned To:** Backend Engineer  
**Status:** ⏳ PENDING

