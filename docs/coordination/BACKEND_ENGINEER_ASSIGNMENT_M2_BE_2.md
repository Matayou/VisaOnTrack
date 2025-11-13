# Backend Engineer Assignment — M2-BE-2: Messages API Endpoints

**Date:** 2025-01-11  
**Assigned To:** 🚀 Backend Engineer  
**Task:** M2-BE-2: Messages API Endpoints  
**Priority:** 🔴 **HIGH** — Core messaging functionality  
**Duration:** 1.5–2 days  
**Status:** ⏳ **ASSIGNED** — Ready to start (after M2-BE-1)

---

## Task Overview

Implement messages API endpoints (`GET /requests/{id}/messages`, `POST /requests/{id}/messages`, `POST /messages/attachments`) with participant-only access, file upload validation, and attachment linking.

---

## Task Document

**Canonical Task Document:** `docs/tasks/TASK_M2_BE_MESSAGES_API.md`

This document contains:
- User story and acceptance criteria
- Technical requirements
- API endpoint specifications
- File upload validation details
- Testing requirements
- Dependencies

---

## Key Requirements

### Endpoints to Implement
1. **GET /requests/{id}/messages** — List messages (participants only)
2. **POST /requests/{id}/messages** — Send message (participants only, optional attachmentIds)
3. **POST /messages/attachments** — Upload attachment (multipart/form-data, size/MIME validation)

### Authorization
- Messages endpoints — Request participants only (seeker + providers who have quoted)
- Attachment upload — Authenticated users

### File Upload Validation
- Size limits (per plan entitlement):
  - Free: 2 MB
  - Pro: 25 MB
  - Pro+: 100 MB
  - Enterprise: 250 MB
- MIME allowlist: pdf, jpg, png, webp, docx, xlsx
- Virus scanning: Queue for MVP

---

## Dependencies

- ✅ `JwtAuthGuard` — Already implemented (M1-BE-7)
- ✅ `PrismaService` — Already implemented
- ✅ `Message`, `Attachment` models — Already defined in Prisma schema
- ✅ OpenAPI spec — Already defined
- ⏳ File storage service (S3/R2) — Needs configuration
- ⏳ Virus scanning service — Optional for MVP (can queue)

---

## Reference Implementation

Follow patterns from:
- `apps/api/src/users/users.controller.ts` (M1-BE-8)
- `apps/api/src/auth/auth.controller.ts` (M1-BE-7)

---

## Testing Requirements

- Unit tests for service methods
- Integration tests for endpoints
- Authorization tests (participant checks)
- File upload tests (size limits, MIME validation)
- Security tests

---

## Next Steps

1. Review task document: `docs/tasks/TASK_M2_BE_MESSAGES_API.md`
2. Review OpenAPI spec: `packages/types/openapi.yaml` (messages endpoints)
3. Review Prisma schema: `apps/api/prisma/schema.prisma` (Message, Attachment models)
4. Configure file storage service (S3/R2)
5. Start implementation following existing patterns

---

## Questions or Issues?

If you encounter any questions or issues:
1. Check the task document for details
2. Review the OpenAPI spec for contract requirements
3. Check reference implementations (M1-BE-7, M1-BE-8)
4. Contact PM if blockers arise

---

**Assigned By:** Project Manager  
**Date:** 2025-01-11  
**Status:** ⏳ **ASSIGNED** — Ready to start (after M2-BE-1)

