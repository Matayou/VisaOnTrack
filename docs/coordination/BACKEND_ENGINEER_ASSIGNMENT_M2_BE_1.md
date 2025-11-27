# Backend Engineer Assignment — M2-BE-1: Requests API Endpoints

**Date:** 2025-01-11  
**Assigned To:** 🚀 Backend Engineer  
**Task:** M2-BE-1: Requests API Endpoints  
**Priority:** 🔴 **HIGH** — Core request functionality  
**Duration:** 2–2.5 days  
**Status:** ⏳ **ASSIGNED** — Ready to start

---

## Task Overview

Implement requests API endpoints (`GET /requests`, `POST /requests`, `GET /requests/{id}`, `PATCH /requests/{id}`) with proper authorization, status management, and pagination.

---

## Task Document

**Canonical Task Document:** `docs/tasks/TASK_M2_BE_REQUESTS_API.md`

This document contains:
- User story and acceptance criteria
- Technical requirements
- API endpoint specifications
- Testing requirements
- Dependencies

---

## Key Requirements

### Endpoints to Implement
1. **GET /requests** — List requests (pagination, filters: status, seekerId)
2. **POST /requests** — Create request (SEEKER role only, default status: DRAFT)
3. **GET /requests/{id}** — Get request details
4. **PATCH /requests/{id}** — Update request (owner only)

### Authorization
- `POST /requests` — SEEKER role only
- `PATCH /requests/{id}` — Owner (seekerId) only
- `GET /requests` — Authenticated users (all roles)

### Request Status
- `DRAFT` — Initial state (not visible to providers)
- `OPEN` — Published and visible to providers
- `CLOSED` — Seeker closed without hiring
- `HIRED` — Seeker accepted a quote (M3)

---

## Dependencies

- ✅ `JwtAuthGuard` — Already implemented (M1-BE-7)
- ✅ `PrismaService` — Already implemented
- ✅ `Request` model — Already defined in Prisma schema
- ✅ OpenAPI spec — Already defined

---

## Reference Implementation

Follow patterns from:
- `apps/api/src/users/users.controller.ts` (M1-BE-8)
- `apps/api/src/auth/auth.controller.ts` (M1-BE-7)

---

## Testing Requirements

- Unit tests for service methods
- Integration tests for endpoints
- Authorization tests (role checks, owner checks)
- Security tests

---

## Next Steps

1. Review task document: `docs/tasks/TASK_M2_BE_REQUESTS_API.md`
2. Review OpenAPI spec: `packages/types/openapi.yaml` (requests endpoints)
3. Review Prisma schema: `apps/api/prisma/schema.prisma` (Request model)
4. Start implementation following existing patterns

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
**Status:** ⏳ **ASSIGNED** — Ready to start

