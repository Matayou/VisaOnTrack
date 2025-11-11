# Task M1-BE-9: Provider Onboarding API Endpoints Implementation

**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Backend Engineer  
**Duration:** 1.5–2 days  
**Status:** ⏳ PENDING  
**Priority:** HIGH (provider onboarding flow)

---

## User Story

**As a** provider,  
**I want to** create and update my provider profile via secure API endpoints,  
**So that** I can complete onboarding and offer services on the platform.

---

## Goal

Implement provider onboarding API endpoints (`POST /providers`, `GET /providers/{id}`, `PATCH /providers/{id}`, `POST /messages/attachments`) with business details, services/pricing, credentials upload, and Stripe Connect integration, matching the OpenAPI v0.2.1 contract.

---

## Scope (Per OpenAPI v0.2.1 & Spec Section 5)

**API Endpoints:**
- `POST /providers` — Create provider profile (business details)
- `GET /providers/{id}` — Get provider profile
- `PATCH /providers/{id}` — Update provider profile (business details, services)
- `POST /messages/attachments` — Upload credentials (file upload)

**Stripe Connect Integration:**
- Create Stripe Connect account for provider
- Handle Stripe Connect onboarding redirects
- Store Stripe Connect account ID in database

**OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)  
**Spec Reference:** `visaontrack-v2-spec.md` Section 5 (API endpoints)

**⚠️ SCOPE WARNING:** Implement exactly per OpenAPI contract. No extra endpoints. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (N/A — backend API, frontend mockups exist)
- [x] API contract defined ✅ (OpenAPI v0.2.1 — provider endpoints, file upload)
- [x] Prisma schema ready ✅ (Provider, ServicePackage, Attachment models exist)
- [x] Error states documented ✅ (OpenAPI spec — 400, 403, 413, 429)
- [x] Analytics events defined ⏳ (optional — track provider creation if needed)
- [x] Dependencies identified ✅ (Stripe SDK, file upload library, NestJS, Prisma)
- [x] DoR reviewed and approved ✅

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **File Storage:** Local or S3 (per spec)
- **Payment:** Stripe Connect SDK

### Implementation Details

**File Locations:**
- `apps/api/src/providers/providers.controller.ts` (Controller — endpoints)
- `apps/api/src/providers/providers.service.ts` (Service — business logic)
- `apps/api/src/providers/dto/*.dto.ts` (DTOs — request/response validation)
- `apps/api/src/providers/providers.module.ts` (Module configuration)
- `apps/api/src/messages/attachments.controller.ts` (Controller — file upload)
- `apps/api/src/messages/attachments.service.ts` (Service — file upload logic)

**Endpoints to Implement:**

1. **POST /providers**
   - Authentication: Required (JWT token)
   - Request: `{ businessName: string, description: string, location: string, languages: string[], ... }`
   - Response: `{ provider: Provider }`
   - Errors: 400 Bad Request, 401 Unauthorized, 429 Throttled

2. **GET /providers/{id}**
   - Authentication: Required (JWT token)
   - Request: Provider ID in URL
   - Response: `{ provider: Provider }`
   - Errors: 401 Unauthorized, 404 Not Found

3. **PATCH /providers/{id}**
   - Authentication: Required (JWT token)
   - Request: `{ businessName?: string, description?: string, location?: string, ... }`
   - Response: `{ provider: Provider }`
   - Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

4. **POST /messages/attachments**
   - Authentication: Required (JWT token)
   - Request: `{ file: File, requestId?: string, orderId?: string }`
   - Response: `{ attachment: Attachment }`
   - Errors: 400 Bad Request, 403 AttachmentLimitExceeded, 413 PayloadTooLarge, 429 Throttled

**Business Details Validation:**
- Business name: Required, string, max 200 characters
- Description: Required, string, max 5000 characters (per spec)
- Location: Required, string
- Languages: Array of strings
- Phone: Optional, string, max 50 characters
- Website: Optional, string (URL validation)

**Services & Pricing:**
- Service packages: Array of ServicePackage objects
- Title: Required, string
- Description: Optional, string
- PriceTHB: Required, Decimal (per spec)
- Duration: Optional, number (days)
- Deliverables: Array of strings

**File Upload Requirements (Per Spec Section 5):**
- File size limits (per provider plan):
  - Free: 2MB
  - Pro: 25MB
  - Pro+: 100MB
  - Enterprise: 250MB
- File type validation (PDF, images, etc.)
- Multiple file uploads
- Storage: Local or S3 (per spec)
- File key generation (unique, secure)

**Stripe Connect Integration:**
- Create Stripe Connect account for provider
- Redirect to Stripe Connect onboarding
- Handle Stripe Connect redirects
- Store Stripe Connect account ID in database
- Error handling (Stripe API errors)

**Authorization:**
- Users can only create/update their own provider profile
- Users can only upload attachments to their own requests/orders
- Admin users can access any provider profile (future - M7)

**Error Handling:**
- Invalid data (400 Bad Request)
- Unauthorized (401 Unauthorized)
- Forbidden (403 Forbidden — cannot update other user's profile)
- File too large (413 PayloadTooLarge)
- Attachment limit exceeded (403 AttachmentLimitExceeded)
- Rate limiting (429 Throttled)

**Audit Logging (Per Spec Section 11):**
- Log provider creation (PROVIDER_CREATED)
- Log provider updates (PROVIDER_UPDATED)
- Log attachment uploads (ATTACHMENT_UPLOADED)
- Never log passwords or tokens

---

## Acceptance Criteria

### POST /providers Endpoint
- [ ] Endpoint requires authentication (JWT token)
- [ ] Validates request body (business details)
- [ ] Creates provider profile in database
- [ ] Links provider to user (userId from JWT token)
- [ ] Returns provider data
- [ ] Returns 400 Bad Request for invalid data
- [ ] Returns 401 Unauthorized for invalid token
- [ ] Returns 429 Throttled for rate limit exceeded
- [ ] Audit logging works (provider creation)

### GET /providers/{id} Endpoint
- [ ] Endpoint requires authentication (JWT token)
- [ ] Finds provider by ID in database
- [ ] Returns provider data
- [ ] Returns 401 Unauthorized for invalid token
- [ ] Returns 404 Not Found if provider not found

### PATCH /providers/{id} Endpoint
- [ ] Endpoint requires authentication (JWT token)
- [ ] Validates request body (business details, services)
- [ ] Updates provider profile in database
- [ ] Authorization check (users can only update own profile)
- [ ] Returns updated provider data
- [ ] Returns 400 Bad Request for invalid data
- [ ] Returns 401 Unauthorized for invalid token
- [ ] Returns 403 Forbidden if not owner
- [ ] Returns 404 Not Found if provider not found
- [ ] Audit logging works (provider updates)

### POST /messages/attachments Endpoint
- [ ] Endpoint requires authentication (JWT token)
- [ ] Validates file (size, type)
- [ ] Checks file size limits (per provider plan)
- [ ] Checks attachment limits (per provider plan)
- [ ] Uploads file to storage (local or S3)
- [ ] Creates attachment record in database
- [ ] Returns attachment data
- [ ] Returns 400 Bad Request for invalid file
- [ ] Returns 403 AttachmentLimitExceeded for quota exceeded
- [ ] Returns 413 PayloadTooLarge for file too large
- [ ] Returns 429 Throttled for rate limit exceeded
- [ ] Audit logging works (attachment uploads)

### Stripe Connect Integration
- [ ] Creates Stripe Connect account for provider
- [ ] Redirects to Stripe Connect onboarding
- [ ] Handles Stripe Connect redirects
- [ ] Stores Stripe Connect account ID in database
- [ ] Error handling (Stripe API errors)

### Technical Requirements
- [ ] Uses NestJS framework
- [ ] TypeScript compiles without errors
- [ ] Uses Prisma for database queries
- [ ] Uses Stripe SDK for Stripe Connect
- [ ] File upload implemented (local or S3)
- [ ] Rate limiting implemented
- [ ] Audit logging implemented
- [ ] No linter errors
- [ ] Matches OpenAPI v0.2.1 contract exactly

### Security Requirements (Per Spec Section 11)
- [ ] JWT token validation (HttpOnly cookie)
- [ ] User authorization (can only update own profile)
- [ ] File upload size limits enforced (per provider plan)
- [ ] File type validation enforced
- [ ] No passwords or tokens in logs
- [ ] Audit logging (provider creation, updates, attachment uploads)

---

## DoD Checklist (Definition of Done)

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (database, file upload, Stripe Connect)
- [ ] Security tests written and passing (authorization checks, file upload security)
- [ ] Audit logging implemented (provider creation, updates, attachment uploads)
- [ ] Documentation updated (API docs, inline comments)
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] Contract tests passing (OpenAPI spec validation)
- [ ] File uploads tested (size limits, type validation)
- [ ] Stripe Connect integration tested
- [ ] Matches OpenAPI v0.2.1 contract exactly
- [ ] Scope Guardian approval ✅ **REQUIRED** (spec adherence verification)

**⚠️ CRITICAL:** Do not mark task complete without Scope Guardian approval.

---

## References

### Spec & Contract
- **Spec Document:** `visaontrack-v2-spec.md` Section 5 (API endpoints), Section 11 (Security)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)
- **Endpoints:** `POST /providers`, `GET /providers/{id}`, `PATCH /providers/{id}`, `POST /messages/attachments`
- **Schemas:** Provider, ServicePackage, Attachment, CreateProviderRequest, UpdateProviderRequest
- **Error Responses:** 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 413 PayloadTooLarge, 429 Throttled
- **Milestone Document:** `MILESTONE_M1.md` (Task 9)

### Prisma Schema
- **Provider Model:** `apps/api/prisma/schema.prisma` (Provider model)
- **ServicePackage Model:** `apps/api/prisma/schema.prisma` (ServicePackage model)
- **Attachment Model:** `apps/api/prisma/schema.prisma` (Attachment model)
- **Relations:** Provider → User, Provider → ServicePackage, Attachment → User

### File Upload (Per Spec Section 5)
- **Size Limits:** Free: 2MB, Pro: 25MB, Pro+: 100MB, Enterprise: 250MB
- **File Types:** PDF, images (per spec)
- **Storage:** Local or S3 (per spec)

### Stripe Connect
- **Stripe SDK:** Stripe Connect SDK
- **Onboarding:** Stripe Connect onboarding flow
- **Account Storage:** Stripe Connect account ID in database

---

## Dependencies

**Blocking Dependencies:**
- [x] Prisma schema defined ✅ (M0 Task 3 complete)
- [x] OpenAPI contract defined ✅ (M0 Task 2 complete)
- [x] NestJS project initialized ✅ (M0 complete)
- [ ] Stripe account configured ⏳ (requires Stripe account setup)
- [ ] File storage configured ⏳ (local or S3)

**Parallel Work:** Can work in parallel with frontend tasks (contract-first approach).

---

## Testing Requirements

### Unit Tests
- [ ] Providers service methods testable
- [ ] Attachments service methods testable
- [ ] Business details validation works correctly
- [ ] Services/pricing validation works correctly
- [ ] File upload validation works correctly
- [ ] Stripe Connect integration works correctly

### Integration Tests
- [ ] Database queries work correctly (provider creation, update, lookup)
- [ ] File upload works correctly (local or S3)
- [ ] File size limits enforced (per provider plan)
- [ ] File type validation enforced
- [ ] Attachment limits enforced (per provider plan)
- [ ] Stripe Connect integration works
- [ ] Authorization checks work (users can only update own profile)
- [ ] Audit logging works (provider creation, updates, attachment uploads)
- [ ] Error handling works (validation errors, file upload errors, Stripe errors)

### Security Tests
- [ ] JWT token validation secure
- [ ] User authorization enforced (can only update own profile)
- [ ] File upload size limits enforced
- [ ] File type validation enforced
- [ ] Attachment limits enforced
- [ ] No passwords or tokens in logs
- [ ] Audit logging secure (events logged, no sensitive data)

### Contract Tests
- [ ] Request/response schemas match OpenAPI v0.2.1
- [ ] Error responses match OpenAPI v0.2.1
- [ ] Status codes match OpenAPI v0.2.1

---

## Review Process

### Multi-Agent Review (Required Before Completion)

1. **Tech Lead Review** ⏳ (technical implementation quality)
   - [ ] Code follows NestJS best practices
   - [ ] TypeScript types correct
   - [ ] API contract compliance verified (OpenAPI v0.2.1)
   - [ ] Implementation quality verified
   - [ ] Performance optimized
   - [ ] File upload implementation secure
   - [ ] Stripe Connect integration correct

2. **Security Guard Review** ⏳ (security requirements)
   - [ ] JWT token validation secure
   - [ ] User authorization enforced
   - [ ] File upload size limits enforced
   - [ ] File type validation enforced
   - [ ] Attachment limits enforced
   - [ ] No passwords or tokens in logs
   - [ ] Audit logging secure

3. **QA Engineer Review** ⏳ (testing & quality)
   - [ ] Unit tests comprehensive
   - [ ] Integration tests comprehensive
   - [ ] Security tests comprehensive
   - [ ] Contract tests passing
   - [ ] File upload tested

4. **Scope Guardian Review** ⏳ **REQUIRED** (spec adherence)
   - [ ] Implementation matches OpenAPI v0.2.1 contract exactly
   - [ ] Implementation matches spec Section 5 exactly
   - [ ] No scope creep (no extra endpoints, no extra features)
   - [ ] Security requirements met (Spec Section 11)

5. **PM Final Approval** ⏳ (DoD satisfaction)
   - [ ] All DoD checklist items complete
   - [ ] All reviews approved

**⚠️ CRITICAL:** Scope Guardian approval is REQUIRED before marking task complete.

---

## Scope Discipline

### ✅ In Scope (Per OpenAPI v0.2.1 & Spec)
- `POST /providers` endpoint
- `GET /providers/{id}` endpoint
- `PATCH /providers/{id}` endpoint
- `POST /messages/attachments` endpoint
- Business details (name, description, location, languages, phone, website)
- Services/pricing (ServicePackage objects)
- File upload (credentials upload)
- Stripe Connect integration (payment setup)
- File size limits (per provider plan)
- File type validation
- Attachment limits (per provider plan)
- Error handling (400, 401, 403, 404, 413, 429)

### ❌ Out of Scope (Requires RFC)
- Provider search endpoint (M5)
- Provider listing endpoint (M5)
- Provider ranking endpoint (M5)
- Provider verification endpoint (M7 — admin)
- Provider moderation endpoint (M7 — admin)
- Extra provider fields beyond spec
- Custom file upload providers
- Extra validation beyond spec

**⚠️ SCOPE WARNING:** If you need anything beyond the above, create an RFC first.

---

## Success Criteria

✅ **Task is complete when:**
1. All endpoints (`POST /providers`, `GET /providers/{id}`, `PATCH /providers/{id}`, `POST /messages/attachments`) implemented
2. All endpoints match OpenAPI v0.2.1 contract exactly
3. All acceptance criteria met
4. All DoD checklist items complete
5. All reviews approved (Tech Lead, Security Guard, QA, Scope Guardian, PM)
6. No linter errors
7. TypeScript compiles without errors
8. Contract tests passing
9. File uploads work correctly
10. Stripe Connect integration works
11. Security requirements met (authorization, file upload security, audit logging)

---

**Created:** 2025-01-11  
**Assigned To:** Backend Engineer  
**Status:** ⏳ PENDING — Ready to start  
**Next Step:** Implement provider onboarding endpoints matching OpenAPI v0.2.1 contract

