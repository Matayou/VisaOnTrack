# M1-BE-9 Task Assignment — Provider Onboarding API

**Task:** M1-BE-9: Provider Onboarding API Endpoints  
**Assigned To:** Backend Engineer  
**Date:** 2025-01-11  
**Status:** Ready for Assignment  
**Priority:** HIGH (final M1 task)

---

## 📋 Task Overview

**Duration:** 1.5–2 days  
**Milestone:** M1 — Auth & Onboarding (8/9 tasks complete — 89%)  
**Dependencies:** M1-BE-7 complete ✅ (Authentication API — PM final approval granted)

---

## 🎯 Task Goal

Implement provider onboarding API endpoints (`POST /providers`, `GET /providers/{id}`, `PATCH /providers/{id}`, `POST /messages/attachments`) with business details, services/pricing, credentials upload, and Stripe Connect integration, matching the OpenAPI v0.2.1 contract.

---

## 📝 Task Requirements

### API Endpoints to Implement

1. **`POST /providers`** — Create provider profile
   - Business details validation
   - Services & pricing validation
   - User association (from JWT token)
   - Error handling (400, 401, 403, 429)

2. **`GET /providers/{id}`** — Get provider profile
   - Return provider data with services
   - Authorization check (own profile or public)
   - Error handling (401, 403, 404)

3. **`PATCH /providers/{id}`** — Update provider profile
   - Business details update
   - Services & pricing update
   - Authorization check (own profile only)
   - Error handling (400, 401, 403, 404, 429)

4. **`POST /messages/attachments`** — Upload credentials
   - File upload handling (per spec caps)
   - File type validation (PDF, images)
   - File size limits (per provider plan)
   - Storage (local or S3 per spec)
   - Error handling (400, 401, 413, 429)

### Stripe Connect Integration

- Create Stripe Connect account for provider
- Handle Stripe Connect onboarding redirects
- Store Stripe Connect account ID in database
- Error handling (Stripe API errors, connection failures)

---

## ✅ Prerequisites (All Complete)

- ✅ **Prisma Schema:** Provider, ServicePackage, Attachment models defined
- ✅ **OpenAPI Contract:** Provider endpoints defined (v0.2.1)
- ✅ **Infrastructure:** PostgreSQL installed, database created, migrations applied
- ✅ **Authentication:** M1-BE-7 complete (JWT authentication working)
- ✅ **User Management:** M1-BE-8 complete (user endpoints working)
- ✅ **Frontend:** M1-FE-6 complete (provider onboarding pages implemented)

---

## 📚 References

### Task Document
- **Full Task Spec:** `docs/tasks/TASK_M1_BE_PROVIDER_ONBOARDING_API.md`
- **Milestone Reference:** `docs/milestones/MILESTONE_M1.md` (Task 9)

### API Contract
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)
- **Endpoints:** `POST /providers`, `GET /providers/{id}`, `PATCH /providers/{id}`, `POST /messages/attachments`
- **Schemas:** Provider, ServicePackage, Attachment, CreateProviderRequest, UpdateProviderRequest

### Prisma Schema
- **Provider Model:** `apps/api/prisma/schema.prisma`
- **ServicePackage Model:** `apps/api/prisma/schema.prisma`
- **Attachment Model:** `apps/api/prisma/schema.prisma`

### Frontend Reference
- **Frontend Implementation:** M1-FE-6 complete (all 6 provider onboarding pages)
- **API Client:** Generated OpenAPI client ready (`api.providers.createProvider()`, etc.)

---

## 🎯 Implementation Pattern

### Follow M1-BE-7 & M1-BE-8 Patterns

**Code Structure:**
- NestJS modules (ProvidersModule, AttachmentsModule)
- DTOs for request/response validation
- Services for business logic (ProvidersService, AttachmentsService)
- Controllers for HTTP handling (ProvidersController, AttachmentsController)
- Prisma for database operations

**Testing Pattern (M1-BE-8):**
- Unit tests (service, controller, DTOs)
- Integration tests (database, file upload)
- Security tests (authorization, file upload security)
- Contract tests (OpenAPI compliance)
- Follow M1-BE-7 test pattern (100+ test cases across 7 files)

**Security:**
- JWT authentication (from M1-BE-7)
- Authorization checks (own profile only)
- File upload security (size limits, type validation)
- Rate limiting (per spec)
- Audit logging (provider creation, updates)

---

## 📋 DoD Checklist

### Implementation
- [ ] Code implemented and reviewed
- [ ] All endpoints match OpenAPI v0.2.1 contract exactly
- [ ] Business details validation implemented
- [ ] Services & pricing validation implemented
- [ ] File upload handling implemented
- [ ] Stripe Connect integration implemented

### Testing
- [ ] Unit tests written and passing (follow M1-BE-8 pattern)
- [ ] Integration tests written and passing
- [ ] Security tests written and passing (authorization, file upload security)
- [ ] Contract tests passing (OpenAPI spec compliance)

### Quality & Standards
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] Audit logging implemented (provider creation, updates)
- [ ] Error handling comprehensive (400, 401, 403, 404, 413, 429)

### Multi-Agent Reviews
- [ ] Tech Lead review complete
- [ ] Security Guard review complete
- [ ] QA Engineer review complete (tests)
- [ ] Scope Guardian review complete (REQUIRED)
- [ ] PM final approval granted

---

## ⚠️ Scope Discipline

### ✅ In Scope (Per OpenAPI v0.2.1)
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

### ❌ Out of Scope (Requires RFC)
- Provider search endpoint (M5)
- Provider listing endpoint (M5)
- Provider ranking endpoint (M5)
- Provider verification endpoint (M7 — admin)
- Extra provider fields beyond spec
- Custom file upload providers

**⚠️ SCOPE WARNING:** Implement exactly per OpenAPI contract. No extra endpoints. No extra features.

---

## 🚀 Next Steps

1. **Backend Engineer:** Review task document (`docs/tasks/TASK_M1_BE_PROVIDER_ONBOARDING_API.md`)
2. **Backend Engineer:** Review OpenAPI spec (`packages/types/openapi.yaml`)
3. **Backend Engineer:** Review Prisma schema (`apps/api/prisma/schema.prisma`)
4. **Backend Engineer:** Review M1-BE-7 & M1-BE-8 implementation patterns
5. **Backend Engineer:** Begin implementation
6. **PM:** Create coordination document when implementation starts

---

## 📊 Success Criteria

✅ **Task is complete when:**
1. All endpoints implemented and match OpenAPI v0.2.1 contract exactly
2. All tests implemented (following M1-BE-8 pattern)
3. All multi-agent reviews approved
4. PM final approval granted
5. Milestone M1 complete (9/9 tasks — 100%)

---

**Created:** 2025-01-11  
**PM:** Project Manager  
**Status:** Ready for Assignment

**Task Document:** `docs/tasks/TASK_M1_BE_PROVIDER_ONBOARDING_API.md`  
**Coordination:** Will be created when implementation starts

