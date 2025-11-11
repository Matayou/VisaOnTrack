# Task M1-BE-8: User Management API Endpoints Implementation

**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Backend Engineer  
**Duration:** 0.5 day  
**Status:** ✅ **COMPLETE** — All reviews approved, all tests implemented and verified, task complete  
**Priority:** MEDIUM (account type selection support)

---

## User Story

**As a** user who just registered,  
**I want to** update my account type (Seeker or Provider) via API,  
**So that** I can proceed to the appropriate onboarding flow.

---

## Goal

Implement user management API endpoints (`GET /users/me`, `PATCH /users/me`) to get current user data and update user role (account type selection), matching the OpenAPI v0.2.1 contract.

---

## Scope (Per OpenAPI v0.2.1 & Spec Section 5)

**API Endpoints:**
- `GET /users/me` — Get current user data
- `PATCH /users/me` — Update current user (role, name, phone, etc.)

**OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)  
**Spec Reference:** `visaontrack-v2-spec.md` Section 5 (API endpoints)

**⚠️ SCOPE WARNING:** Implement exactly per OpenAPI contract. No extra endpoints. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (N/A — backend API, frontend mockups exist)
- [x] API contract defined ✅ (OpenAPI v0.2.1 — `GET /users/me`, `PATCH /users/me`)
- [x] Prisma schema ready ✅ (User model exists in `apps/api/prisma/schema.prisma`)
- [x] Error states documented ✅ (OpenAPI spec — 400 Bad Request, 401 Unauthorized)
- [x] Analytics events defined ⏳ (optional — track role changes if needed)
- [x] Dependencies identified ✅ (JWT middleware, NestJS, Prisma)
- [x] DoR reviewed and approved ✅

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (HttpOnly cookie) — middleware required

### Implementation Details

**File Locations:**
- `apps/api/src/users/users.controller.ts` (Controller — endpoints)
- `apps/api/src/users/users.service.ts` (Service — business logic)
- `apps/api/src/users/dto/*.dto.ts` (DTOs — request/response validation)
- `apps/api/src/users/users.module.ts` (Module configuration)

**Endpoints to Implement:**

1. **GET /users/me**
   - Authentication: Required (JWT token from HttpOnly cookie)
   - Request: None (user ID from JWT token)
   - Response: `{ user: User }` (user data without password)
   - Errors: 401 Unauthorized, 404 Not Found

2. **PATCH /users/me**
   - Authentication: Required (JWT token from HttpOnly cookie)
   - Request: `{ role?: UserRole, name?: string, phone?: string, locale?: string }`
   - Response: `{ user: User }` (updated user data without password)
   - Errors: 400 Bad Request, 401 Unauthorized, 404 Not Found

**JWT Middleware:**
- Extract JWT token from HttpOnly cookie
- Validate token
- Extract user ID from token payload
- Attach user ID to request object
- Return 401 Unauthorized if token invalid/expired

**User Lookup:**
- Find user by ID from JWT token
- Return user data (exclude password, passwordResetTokenHash)
- Return 404 Not Found if user not found

**Role Update:**
- Validate role (must be `SEEKER` or `PROVIDER`)
- Update user role in database
- Return updated user data
- Audit log role changes (per Spec Section 11)

**Field Updates:**
- Validate name (string, max 200 characters)
- Validate phone (string, max 50 characters)
- Validate locale (string, max 10 characters, default: 'en')
- Update fields in database
- Return updated user data

**Error Handling:**
- Invalid token (401 Unauthorized)
- User not found (404 Not Found)
- Invalid role (400 Bad Request)
- Validation errors (400 Bad Request)

**Audit Logging (Per Spec Section 11):**
- Log role changes (USER_ROLE_UPDATED)
- Log profile updates (USER_PROFILE_UPDATED)
- Never log passwords or tokens

---

## Acceptance Criteria

### GET /users/me Endpoint
- [ ] Endpoint requires authentication (JWT token)
- [ ] Extracts user ID from JWT token
- [ ] Finds user by ID in database
- [ ] Returns user data (without password, passwordResetTokenHash)
- [ ] Returns 401 Unauthorized for invalid/expired token
- [ ] Returns 404 Not Found if user not found
- [ ] Audit logging works (user data access)

### PATCH /users/me Endpoint
- [ ] Endpoint requires authentication (JWT token)
- [ ] Extracts user ID from JWT token
- [ ] Validates request body (role, name, phone, locale)
- [ ] Validates role (must be `SEEKER` or `PROVIDER`)
- [ ] Updates user fields in database
- [ ] Returns updated user data (without password, passwordResetTokenHash)
- [ ] Returns 400 Bad Request for invalid role
- [ ] Returns 401 Unauthorized for invalid/expired token
- [ ] Returns 404 Not Found if user not found
- [ ] Audit logging works (role changes, profile updates)

### Technical Requirements
- [ ] Uses NestJS framework
- [ ] TypeScript compiles without errors
- [ ] Uses Prisma for database queries
- [ ] Uses JWT middleware for authentication
- [ ] Rate limiting implemented (if needed)
- [ ] Audit logging implemented
- [ ] No linter errors
- [ ] Matches OpenAPI v0.2.1 contract exactly

### Security Requirements (Per Spec Section 11)
- [ ] JWT token validation (HttpOnly cookie)
- [ ] User authorization (can only update own data)
- [ ] Role validation (SEEKER or PROVIDER only)
- [ ] No passwords or tokens in logs
- [ ] Audit logging (role changes, profile updates)

---

## DoD Checklist (Definition of Done)

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (database, JWT, authorization)
- [ ] Security tests written and passing (authorization checks, role validation)
- [ ] Audit logging implemented (role changes, profile updates)
- [ ] Documentation updated (API docs, inline comments)
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] Contract tests passing (OpenAPI spec validation)
- [ ] Matches OpenAPI v0.2.1 contract exactly
- [ ] Scope Guardian approval ✅ **REQUIRED** (spec adherence verification)

**⚠️ CRITICAL:** Do not mark task complete without Scope Guardian approval.

---

## References

### Spec & Contract
- **Spec Document:** `visaontrack-v2-spec.md` Section 5 (API endpoints), Section 11 (Security)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)
- **Endpoints:** `GET /users/me`, `PATCH /users/me`
- **Schemas:** User, UpdateUserRequest, UpdateUserResponse
- **Error Responses:** 400 Bad Request, 401 Unauthorized, 404 Not Found
- **Milestone Document:** `MILESTONE_M1.md` (Task 8)

### Prisma Schema
- **User Model:** `apps/api/prisma/schema.prisma` (User model)
- **Fields:** `id`, `email`, `role`, `name`, `phone`, `locale`, `createdAt`, etc.
- **Enum:** `UserRole` (SEEKER, PROVIDER, ADMIN)

### Authentication (Reference)
- **JWT Middleware:** Use existing JWT middleware from auth module
- **Token Extraction:** From HttpOnly cookie
- **Token Validation:** JWT validation middleware

---

## Dependencies

**Blocking Dependencies:**
- [x] Prisma schema defined ✅ (M0 Task 3 complete)
- [x] OpenAPI contract defined ✅ (M0 Task 2 complete)
- [x] NestJS project initialized ✅ (M0 complete)
- [ ] JWT middleware implemented ⏳ (from auth module)

**Parallel Work:** Can work in parallel with frontend tasks (contract-first approach).

---

## Testing Requirements

### Unit Tests
- [ ] Users service methods testable
- [ ] Role validation works correctly
- [ ] Field validation works correctly
- [ ] User lookup works correctly

### Integration Tests
- [ ] Database queries work correctly (user lookup, update)
- [ ] JWT middleware works correctly
- [ ] Authorization checks work (users can only update own data)
- [ ] Role validation works (SEEKER or PROVIDER only)
- [ ] Audit logging works (role changes, profile updates)
- [ ] Error handling works (invalid token, user not found, invalid role)

### Security Tests
- [ ] JWT token validation secure
- [ ] User authorization enforced (can only update own data)
- [ ] Role validation enforced (SEEKER or PROVIDER only)
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

2. **Security Guard Review** ⏳ (security requirements)
   - [ ] JWT token validation secure
   - [ ] User authorization enforced
   - [ ] Role validation enforced
   - [ ] No passwords or tokens in logs
   - [ ] Audit logging secure

3. **QA Engineer Review** ⏳ (testing & quality)
   - [ ] Unit tests comprehensive
   - [ ] Integration tests comprehensive
   - [ ] Security tests comprehensive
   - [ ] Contract tests passing

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
- `GET /users/me` endpoint
- `PATCH /users/me` endpoint
- JWT token validation (HttpOnly cookie)
- User authorization (can only update own data)
- Role validation (SEEKER or PROVIDER)
- Field validation (name, phone, locale)
- Audit logging (role changes, profile updates)
- Error handling (400, 401, 404)

### ❌ Out of Scope (Requires RFC)
- User deletion endpoint
- User list endpoint (admin only)
- User search endpoint
- Extra user fields beyond spec
- User preferences endpoint
- User settings endpoint
- Extra authentication methods

**⚠️ SCOPE WARNING:** If you need anything beyond the above, create an RFC first.

---

## Success Criteria

✅ **Task is complete when:**
1. Both endpoints (`GET /users/me`, `PATCH /users/me`) implemented
2. All endpoints match OpenAPI v0.2.1 contract exactly
3. All acceptance criteria met
4. All DoD checklist items complete
5. All reviews approved (Tech Lead, Security Guard, QA, Scope Guardian, PM)
6. No linter errors
7. TypeScript compiles without errors
8. Contract tests passing
9. Security requirements met (JWT validation, authorization, audit logging)

---

**Created:** 2025-01-11  
**Assigned To:** Backend Engineer  
**Status:** ⏳ PENDING — Ready to start  
**Next Step:** Implement user management endpoints matching OpenAPI v0.2.1 contract

