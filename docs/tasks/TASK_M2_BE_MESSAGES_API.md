# Task M2-BE-2: Messages API Endpoints

**Milestone:** M2 — Requests & Messaging  
**Assigned To:** Backend Engineer  
**Duration:** 1.5–2 days  
**Status:** ⏳ PENDING  
**Priority:** HIGH (core messaging functionality)

---

## User Story

**As a** Seeker or Provider,  
**I want to** send and receive messages in request threads with file attachments,  
**So that** I can communicate about visa requests and share relevant documents.

---

## Goal

Implement messages API endpoints (`GET /requests/{id}/messages`, `POST /requests/{id}/messages`, `POST /messages/attachments`) with participant-only access, file upload validation, and attachment linking, matching the OpenAPI contract.

---

## Scope (Per OpenAPI v0.2.x & Spec Section 5)

**API Endpoints:**
- `GET /requests/{id}/messages` — List messages in request thread
- `POST /requests/{id}/messages` — Send message in thread (participants only)
- `POST /messages/attachments` — Upload attachment (with size/MIME validation)

**OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.x)  
**Spec Reference:** `visaontrack-v2-spec.md` Section 5 (API endpoints), Section 9 (Files & Attachments)

**⚠️ SCOPE WARNING:** Implement exactly per OpenAPI contract. No extra endpoints. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (N/A — backend API, frontend mockups exist)
- [x] API contract defined ✅ (OpenAPI v0.2.x — messages endpoints)
- [x] Prisma schema ready ✅ (Message, Attachment models exist)
- [x] Error states documented ✅ (OpenAPI spec — 400, 401, 403, 404, 413)
- [x] Analytics events defined ⏳ (optional — track message/attachment creation if needed)
- [x] Dependencies identified ✅ (NestJS, Prisma, JWT guard, file storage)
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
- **File Storage:** S3/R2 (signed URLs for downloads)
- **File Upload:** multipart/form-data

### Implementation Details

**File Locations:**
- `apps/api/src/messages/messages.controller.ts` (Controller — endpoints)
- `apps/api/src/messages/messages.service.ts` (Service — business logic)
- `apps/api/src/messages/dto/*.dto.ts` (DTOs — request/response validation)
- `apps/api/src/messages/messages.module.ts` (Module configuration)
- `apps/api/src/messages/attachments.service.ts` (Attachment upload logic)

**Endpoints to Implement:**

1. **GET /requests/{id}/messages**
   - Query params: `page?`, `limit?`
   - Response: `{ data: Message[], meta: PaginationMeta }`
   - Errors: 401 Unauthorized, 403 Forbidden, 404 Not Found
   - Authorization: Request participants only (seeker + providers who have quoted)

2. **POST /requests/{id}/messages**
   - Request: `{ body: string, attachmentIds?: string[] }`
   - Response: `Message` object (with attachments if provided)
   - Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
   - Authorization: Request participants only
   - Validation: body required, minLength 1, maxLength 10000
   - Attachment linking: attachmentIds must reference existing attachments

3. **POST /messages/attachments**
   - Request: `multipart/form-data` with `file` field
   - Response: `{ id, fileName, fileSize, mimeType, storageKey, uploadedBy, createdAt }`
   - Errors: 400 Bad Request, 401 Unauthorized, 403 AttachmentLimitExceeded, 413 PayloadTooLarge
   - Authorization: Authenticated users
   - File validation:
     - Size limit: Check `attachments.maxSizeMB` entitlement (per plan)
     - MIME allowlist: pdf, jpg, png, webp, docx, xlsx
     - Virus scanning: Queue for MVP, quarantine on fail

**Participant Authorization:**
- Request participants = seeker (request.seekerId) + providers who have submitted quotes for this request
- Check participant status before allowing message access
- Return 403 Forbidden if user is not a participant

**File Upload Validation:**
- Size limits (per plan entitlement):
  - Free: 2 MB
  - Pro: 25 MB
  - Pro+: 100 MB
  - Enterprise: 250 MB
- MIME type validation (allowlist):
  - `application/pdf`
  - `image/jpeg`, `image/png`, `image/webp`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (docx)
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (xlsx)
- File storage: Upload to S3/R2, store `storageKey` in database
- Signed URLs: Generate signed URLs for downloads (expires in 1 hour)

**Attachment Linking:**
- Attachments can be linked to messages via `attachmentIds` array
- Attachments can also be standalone (linked to request only)
- Validate attachmentIds exist and belong to authenticated user

**Pagination:**
- Default: `page=1`, `limit=50` (messages)
- Max limit: 100
- Response includes `meta: { page, limit, total, totalPages }`

---

## Acceptance Criteria

### GET /requests/{id}/messages
- [ ] Returns paginated list of messages
- [ ] Only request participants can access
- [ ] Returns 403 for non-participants
- [ ] Returns 404 if request not found
- [ ] Requires authentication
- [ ] Returns 401 for unauthenticated requests

### POST /requests/{id}/messages
- [ ] Creates message in thread
- [ ] Sets senderId from authenticated user
- [ ] Validates body (required, 1-10000 characters)
- [ ] Links attachments if attachmentIds provided
- [ ] Only request participants can send
- [ ] Returns 403 for non-participants
- [ ] Returns 404 if request not found
- [ ] Requires authentication
- [ ] Returns 401 for unauthenticated requests

### POST /messages/attachments
- [ ] Uploads file to storage (S3/R2)
- [ ] Validates file size (per plan entitlement)
- [ ] Validates MIME type (allowlist)
- [ ] Stores attachment metadata in database
- [ ] Returns attachment object with signed URL
- [ ] Returns 413 if file too large
- [ ] Returns 403 if attachment quota exceeded
- [ ] Returns 400 for invalid MIME type
- [ ] Requires authentication
- [ ] Returns 401 for unauthenticated requests

### Technical Requirements
- [ ] Uses NestJS framework
- [ ] TypeScript compiles without errors
- [ ] Uses Prisma for database queries
- [ ] Uses `JwtAuthGuard` for authentication
- [ ] File upload handling (multipart/form-data)
- [ ] File storage integration (S3/R2)
- [ ] Signed URL generation
- [ ] Follows existing code patterns (M1-BE-7, M1-BE-8 reference)
- [ ] Unit tests implemented
- [ ] Integration tests implemented
- [ ] Security tests implemented

---

## Testing Requirements

### Unit Tests
- [ ] Service method tests (create message, list messages, upload attachment)
- [ ] DTO validation tests
- [ ] Participant check tests
- [ ] File validation tests (size, MIME type)

### Integration Tests
- [ ] Endpoint authentication tests
- [ ] Endpoint authorization tests (participant checks)
- [ ] File upload tests (size limits, MIME validation)
- [ ] Attachment linking tests
- [ ] Pagination tests
- [ ] Error handling tests

### Security Tests
- [ ] Participant-only access tests
- [ ] File size limit enforcement tests
- [ ] MIME type validation tests
- [ ] Unauthenticated access tests

---

## Dependencies

- ✅ `JwtAuthGuard` — Already implemented (M1-BE-7)
- ✅ `PrismaService` — Already implemented
- ✅ `Message`, `Attachment` models — Already defined in Prisma schema
- ✅ OpenAPI spec — Already defined
- ⏳ File storage service (S3/R2) — Needs configuration
- ⏳ Virus scanning service — Optional for MVP (can queue)

---

## References

- **OpenAPI Spec:** `packages/types/openapi.yaml`
- **Prisma Schema:** `apps/api/prisma/schema.prisma`
- **Spec:** `visaontrack-v2-spec.md` Section 5 (API), Section 9 (Files & Attachments)
- **Reference Implementation:** `apps/api/src/users/users.controller.ts` (M1-BE-8)

---

## Notes

- **Participant Check:** Must verify user is either the seeker or a provider who has quoted
- **File Storage:** Use S3/R2 with signed URLs (expires in 1 hour)
- **Virus Scanning:** Queue for MVP, implement quarantine logic
- **Attachment Limits:** Check `attachments.maxSizeMB` entitlement from user's plan
- **MIME Validation:** Strict allowlist (reject everything else)

---

**Created:** 2025-01-11  
**Assigned To:** Backend Engineer  
**Status:** ⏳ PENDING

