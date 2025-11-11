# Task RFC-004-BE: Onboarding Completion Tracking (Backend)

**RFC:** RFC-004: Onboarding Completion Tracking  
**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Backend Engineer  
**Duration:** 1 day (5.5-7.5 hours)  
**Status:** ✅ **COMPLETE** — Implementation & Tests Complete (2025-01-11)  
**Priority:** 🔴 **HIGH** — Required for provider gating (RFC-005)

> **Canonical Status:** This task file is the single source of truth for RFC-004-BE progress. Coordination and review docs now point back here for the latest state.

---

## User Story

**As a** user completing onboarding,  
**I want to** mark my onboarding as complete via API,  
**So that** I can access gated features (after verification for providers).

---

## Goal

Implement onboarding completion tracking API endpoint (`POST /users/me/complete-onboarding`) and update `GET /users/me` to include completion status, enabling frontend to track onboarding progress and gate features.

---

## Scope (Per RFC-004)

**API Endpoints:**
- `POST /users/me/complete-onboarding` — Mark onboarding as complete
- `GET /users/me` — Include `onboardingCompleted` status in response (modify existing endpoint)

**Prisma Schema Changes:**
- Add `onboardingCompleted` boolean field (default: `false`)
- Add `onboardingCompletedAt` DateTime field (nullable)
- Add `seekerOnboardingCompleted` boolean field (default: `false`)
- Add `providerOnboardingCompleted` boolean field (default: `false`)

**⚠️ SCOPE WARNING:** Implement exactly per RFC-004. No extra endpoints. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] RFC approved ✅ (RFC-004 approved by PM)
- [x] User story defined ✅ (this document)
- [x] API contract defined ✅ (RFC-004 specifies endpoints)
- [x] Prisma schema ready ⏳ (needs update — part of this task)
- [x] Dependencies identified ✅ (JWT guard exists, PrismaService exists)
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
- `apps/api/prisma/schema.prisma` (Schema — add 4 fields)
- `apps/api/src/users/users.controller.ts` (Controller — add endpoint)
- `apps/api/src/users/users.service.ts` (Service — add completion logic)
- `apps/api/src/users/dto/complete-onboarding.dto.ts` (DTO — request validation)
- `apps/api/src/users/dto/user-response.dto.ts` (DTO — update response to include completion status)

**Endpoints to Implement:**

1. **POST /users/me/complete-onboarding**
   - Authentication: Required (`JwtAuthGuard`)
   - Request: `{ role: 'SEEKER' | 'PROVIDER' }`
   - Response: `{ user: User }` (updated user with completion flags)
   - Errors: 400 Bad Request (invalid role), 401 Unauthorized, 404 Not Found

2. **GET /users/me** (Modify Existing)
   - Add `onboardingCompleted` to response
   - Add `onboardingCompletedAt` to response
   - Add `seekerOnboardingCompleted` to response
   - Add `providerOnboardingCompleted` to response

**Completion Logic:**
- Validate role (must match user's actual role)
- Set `onboardingCompleted = true`
- Set `onboardingCompletedAt = now()`
- Set role-specific flag (`seekerOnboardingCompleted` or `providerOnboardingCompleted`)
- Return updated user data
- Audit log completion event (per Spec Section 11)

**Error Handling:**
- Invalid role (400 Bad Request)
- Role mismatch (400 Bad Request — user's role doesn't match request)
- Invalid token (401 Unauthorized)
- User not found (404 Not Found)

**Audit Logging (Per Spec Section 11):**
- Log onboarding completion (`ONBOARDING_COMPLETED`)
- Include role in audit log
- Never log passwords or tokens

---

## Acceptance Criteria

### POST /users/me/complete-onboarding Endpoint
- [x] Endpoint requires authentication (`JwtAuthGuard`) ✅
- [x] Validates request body (role field) ✅
- [x] Validates role (must be `SEEKER` or `PROVIDER`) ✅
- [x] Validates role matches user's actual role ✅
- [x] Sets `onboardingCompleted = true` ✅
- [x] Sets `onboardingCompletedAt = now()` ✅
- [x] Sets appropriate role-specific flag ✅
- [x] Returns updated user data ✅
- [x] Returns 400 Bad Request for invalid role ✅
- [x] Returns 400 Bad Request for role mismatch ✅
- [x] Returns 401 Unauthorized for invalid/expired token ✅
- [x] Returns 404 Not Found if user not found ✅
- [x] Audit logging works (`ONBOARDING_COMPLETED`) ✅

### GET /users/me Endpoint (Modify)
- [x] Response includes `onboardingCompleted` field ✅
- [x] Response includes `onboardingCompletedAt` field ✅
- [x] Response includes `seekerOnboardingCompleted` field ✅
- [x] Response includes `providerOnboardingCompleted` field ✅
- [x] Fields are nullable/optional as appropriate ✅

### Prisma Schema Updates
- [x] `onboardingCompleted` field added (Boolean, default: false) ✅
- [x] `onboardingCompletedAt` field added (DateTime, nullable) ✅
- [x] `seekerOnboardingCompleted` field added (Boolean, default: false) ✅
- [x] `providerOnboardingCompleted` field added (Boolean, default: false) ✅
- [x] Migration created and applied successfully ✅

### Technical Requirements
- [x] Uses NestJS framework ✅
- [x] TypeScript compiles without errors ✅
- [x] Uses Prisma for database queries ✅
- [x] Uses `JwtAuthGuard` for authentication ✅
- [x] Uses `AuditLogService` for audit logging ✅
- [x] Follows existing code patterns (M1-BE-8 reference) ✅

### Test Coverage
- [x] Unit tests (19 tests) ✅
- [x] DTO tests (8 tests) ✅
- [x] Integration tests (4 tests) ✅
- [x] Security tests (5 tests) ✅
- [x] Contract tests (6 tests) ✅
- [x] **Total: 42 tests passing** ✅

---

## Implementation Steps

1. **Update Prisma Schema**
   - Add 4 fields to User model
   - Run migration: `npx prisma migrate dev --name add_onboarding_completion_fields`
   - Regenerate Prisma client: `npx prisma generate`

2. **Create DTO**
   - Create `complete-onboarding.dto.ts`
   - Define `CompleteOnboardingRequestDto` with `role` field
   - Add validation decorators (`@IsEnum(UserRole)`)

3. **Update User Response DTO**
   - Modify `user-response.dto.ts`
   - Add completion fields to response

4. **Implement Service Method**
   - Add `completeOnboarding(userId, role)` to `UsersService`
   - Validate role matches user's role
   - Update completion flags
   - Audit log completion event
   - Return updated user

5. **Implement Controller Endpoint**
   - Add `POST /users/me/complete-onboarding` to `UsersController`
   - Use `JwtAuthGuard` (already applied at controller level)
   - Call service method
   - Return updated user

6. **Update GET /users/me**
   - Modify `getCurrentUser()` to include completion fields
   - Update response DTO

7. **Update OpenAPI Spec**
   - Add `POST /users/me/complete-onboarding` endpoint
   - Update `GET /users/me` response schema

---

## Testing Requirements

### Unit Tests
- [ ] Service method validates role
- [ ] Service method sets completion flags correctly
- [ ] Service method audit logs completion
- [ ] DTO validation works

### Integration Tests
- [ ] Endpoint requires authentication
- [ ] Endpoint sets completion flags
- [ ] Endpoint returns updated user
- [ ] Endpoint validates role mismatch
- [ ] GET /users/me includes completion fields

---

## Dependencies

- ✅ `JwtAuthGuard` — Already implemented
- ✅ `PrismaService` — Already implemented
- ✅ `AuditLogService` — Already implemented
- ✅ `UsersService` — Already exists
- ✅ `UsersController` — Already exists

---

## References

- **RFC:** `RFCs/RFC-004-onboarding-completion-tracking.md`
- **OpenAPI Spec:** `packages/types/openapi.yaml`
- **Prisma Schema:** `apps/api/prisma/schema.prisma`
- **Reference Implementation:** `apps/api/src/users/users.controller.ts` (M1-BE-8)

---

## Notes

- **No External Dependencies:** This is a standalone feature
- **Simple Implementation:** Boolean tracking, no complex logic
- **Required for RFC-005:** Must be completed before provider verification gating
- **Migration:** Fields are nullable with defaults, no data migration needed

---

**Created:** 2025-01-11  
**Assigned To:** Backend Engineer  
**Completed:** 2025-01-11  
**Status:** ✅ **COMPLETE** — Implementation & Tests Complete (42 tests passing)

**Completion Summary:**
- ✅ Prisma schema updated (4 fields added)
- ✅ Migration created and applied (`20251108004408_add_onboarding_completion_fields`)
- ✅ DTOs created (`complete-onboarding.dto.ts`)
- ✅ Service method implemented (`completeOnboarding`)
- ✅ Controller endpoint implemented (`POST /users/me/complete-onboarding`)
- ✅ GET /users/me updated (includes completion fields)
- ✅ OpenAPI spec updated (v0.2.3)
- ✅ API client regenerated
- ✅ 42 tests passing (unit, DTO, integration, security, contract)

**See:** `apps/api/RFC_004_BE_IMPLEMENTATION_COMPLETE.md` for full implementation details

