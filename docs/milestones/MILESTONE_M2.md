# M2 — Requests & Messaging

**Duration:** 5–6 days  
**Status:** ⏳ IN PROGRESS  
**Prerequisites:** ✅ M1 complete (Auth & Onboarding)

---

## Goal

Implement the core request posting and messaging system, enabling Seekers to post visa requests and communicate with Providers through threaded messages with file attachments.

---

## Prerequisites ✅

### Foundation Complete:
- ✅ **M0 — Contracts & Skeletons** — COMPLETE (all 6 tasks)
- ✅ **M1 — Auth & Onboarding** — COMPLETE (10/10 tasks)
  - ✅ User authentication (login/register)
  - ✅ Onboarding flows (seeker + provider)
  - ✅ Onboarding completion tracking (RFC-004)

### Ready for Implementation:
- ✅ OpenAPI contract defined (v0.2.x with requests/messages endpoints)
- ✅ Prisma schema defined (Request, Message, Attachment models)
- ✅ OpenAPI client generated (ready for frontend use)
- ✅ Mockups available (if needed — check `docs/mockups/`)

---

## Tasks Breakdown

### Backend Tasks (Backend Engineer)

#### Task 1: Requests API Endpoints
**Duration:** 2–2.5 days  
**Status:** ⏳ PENDING

**Endpoints to Implement:**
- `GET /requests` — List requests with pagination and filters
- `POST /requests` — Create new visa request (SEEKER role)
- `GET /requests/{id}` — Get request details
- `PATCH /requests/{id}` — Update request (owner only)

**Key Features:**
- Request status management (DRAFT, OPEN, CLOSED, HIRED)
- Seeker-only creation (role check)
- Owner-only updates (authorization)
- Pagination support
- Filtering by status and seekerId

**Task Document:** `docs/tasks/TASK_M2_BE_REQUESTS_API.md`

---

#### Task 2: Messages API Endpoints
**Duration:** 1.5–2 days  
**Status:** ⏳ PENDING

**Endpoints to Implement:**
- `GET /requests/{id}/messages` — List messages in request thread
- `POST /requests/{id}/messages` — Send message in thread (participants only)
- `POST /messages/attachments` — Upload attachment (with size/MIME validation)

**Key Features:**
- Thread-based messaging (request participants only)
- Attachment upload with size limits (per plan entitlements)
- MIME type validation (pdf, jpg, png, webp, docx, xlsx)
- File size enforcement (403/413 errors)
- Attachment linking to messages

**Task Document:** `docs/tasks/TASK_M2_BE_MESSAGES_API.md`

---

### Frontend Tasks (Frontend Engineer)

#### Task 1: Requests List & Detail Pages
**Duration:** 1.5–2 days  
**Status:** ⏳ IN PROGRESS (refactoring `/requests/new` into step components + shared form context; lint/test blocked until Node runtime is available)

**Pages to Implement:**
- `/requests` — Request list page (with filters)
- `/requests/[id]` — Request detail/summary page
- `/requests/new` — Post new request form

**Key Features:**
- Request listing with pagination
- Status filtering
- Request creation form (title, description, visaType, budget, location)
- Request detail view
- Request editing (owner only)

**Task Document:** `docs/tasks/TASK_M2_FE_REQUESTS.md`

---

#### Task 2: Messaging Thread & Attachments
**Duration:** 1.5–2 days  
**Status:** ⏳ PENDING

**Pages to Implement:**
- `/requests/[id]/thread` — Message thread view

**Key Features:**
- Threaded message display
- Message composition
- File attachment upload
- Attachment display/download
- Real-time feel (polling for MVP, WS post-MVP)
- Size limit validation (client-side + server enforcement)

**Task Document:** `docs/tasks/TASK_M2_FE_MESSAGING.md`

---

## API Endpoints Summary

### Requests
- `GET /requests` — List with pagination (page, limit, status, seekerId filters)
- `POST /requests` — Create (SEEKER role, returns Request)
- `GET /requests/{id}` — Get details
- `PATCH /requests/{id}` — Update (owner only)

### Messages
- `GET /requests/{id}/messages` — List messages in thread
- `POST /requests/{id}/messages` — Send message (participants only, attachmentIds optional)
- `POST /messages/attachments` — Upload attachment (multipart/form-data, returns Attachment)

---

## Data Model (Per Prisma Schema)

### Request
- `id`, `seekerId`, `title`, `description`, `visaType`, `budgetMin`, `budgetMax`, `location`, `status`, `createdAt`
- Relations: `seeker` (User), `messages` (Message[]), `quotes` (Quote[]), `attachments` (Attachment[])

### Message
- `id`, `requestId`, `senderId`, `body`, `createdAt`
- Relations: `request` (Request), `sender` (User), `attachments` (Attachment[])

### Attachment
- `id`, `messageId?`, `requestId?`, `fileName`, `fileSize`, `mimeType`, `storageKey`, `uploadedBy`, `createdAt`
- Relations: `message` (Message?), `request` (Request?), `uploader` (User)

---

## Security & Authorization

### Role-Based Access
- **Requests:**
  - `POST /requests` — SEEKER role only
  - `PATCH /requests/{id}` — Owner (seekerId) only
  - `GET /requests` — Authenticated users (all roles)
  
- **Messages:**
  - `POST /requests/{id}/messages` — Request participants only (seeker + providers who have quoted)
  - `GET /requests/{id}/messages` — Request participants only

### File Upload Security
- Size limits enforced per plan (`attachments.maxSizeMB` entitlement)
- MIME type allowlist (pdf, jpg, png, webp, docx, xlsx)
- Virus scanning (queue for MVP, quarantine on fail)
- Signed URLs for downloads

---

## Entitlements & Limits

### Attachment Limits (Per Plan)
- **Free:** 2 MB max size
- **Pro:** 25 MB max size
- **Pro+:** 100 MB max size
- **Enterprise:** 250 MB max size

### Error Responses
- `403 AttachmentLimitExceeded` — Quota exceeded
- `413 PayloadTooLarge` — File size exceeds plan limit
- `400 BadRequest` — Invalid MIME type or file format

---

## Testing Requirements

### Backend
- Unit tests for service methods
- Integration tests for endpoints
- Authorization tests (role checks, owner checks)
- File upload tests (size limits, MIME validation)
- Security tests (participant-only messaging)

### Frontend
- Component tests for request forms
- Message thread rendering
- File upload UI (drag-drop, size validation)
- Error handling (403, 413, 400)
- Pagination tests

---

## Dependencies

### Required
- ✅ M1 complete (authentication, user management)
- ✅ OpenAPI spec v0.2.x with requests/messages endpoints
- ✅ Prisma schema with Request, Message, Attachment models

### Optional (Nice to Have)
- File storage service (S3/R2) configured
- Virus scanning service configured (can queue for MVP)

---

## Success Criteria

✅ **M2 is complete when:**
1. All API endpoints implemented and tested
2. All frontend pages implemented and tested
3. File upload working with size/MIME validation
4. Authorization enforced (role checks, participant checks)
5. All reviews approved (Tech Lead, QA, Security, Scope Guardian, PM)
6. DoD checklists satisfied

---

## Notes

- **File Storage:** Use signed URLs for downloads (S3/R2)
- **Real-time:** Polling for MVP (WebSocket upgrade post-MVP)
- **Virus Scanning:** Queue for MVP, quarantine on fail
- **Attachments:** Can be linked to messages or requests (standalone)

---

**Created:** 2025-01-11  
**Status:** ⏳ READY TO START  
**Next:** Create task documents and assign to engineers

