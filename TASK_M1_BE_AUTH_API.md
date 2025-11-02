# Task M1-BE-7: Authentication API Endpoints Implementation

**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Backend Engineer  
**Duration:** 1–1.5 days  
**Status:** ⏳ PENDING  
**Priority:** HIGH (core authentication - login/register)

---

## User Story

**As a** user (seeker or provider),  
**I want to** register and log in via secure API endpoints,  
**So that** I can access the platform with proper authentication and authorization.

---

## Goal

Implement authentication API endpoints (`POST /auth/login`, `POST /auth/register`) with JWT token generation, password hashing, rate limiting, and proper error handling, matching the OpenAPI v0.2.1 contract.

**Note:** Forgot/reset password endpoints (`POST /auth/forgot-password`, `POST /auth/reset-password`) are already implemented via RFC-002. This task focuses on login and register endpoints only.

---

## Scope (Per OpenAPI v0.2.1 & Spec Section 5)

**API Endpoints:**
- `POST /auth/login` — User login (email/password)
- `POST /auth/register` — User registration (email/password)

**OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)  
**Spec Reference:** `visaontrack-v2-spec.md` Section 5 (API endpoints)

**⚠️ SCOPE WARNING:** Implement exactly per OpenAPI contract. No extra endpoints. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ✅ (N/A — backend API, frontend mockups exist)
- [x] API contract defined ✅ (OpenAPI v0.2.1 — `POST /auth/login`, `POST /auth/register`)
- [x] Prisma schema ready ✅ (User model exists in `apps/api/prisma/schema.prisma`)
- [x] Error states documented ✅ (OpenAPI spec — 400 Bad Request, 401 Unauthorized, 429 Throttled)
- [x] Analytics events defined ⏳ (optional — track login/register events if needed)
- [x] Dependencies identified ✅ (bcrypt, JWT, rate limiting, NestJS)
- [x] DoR reviewed and approved ✅

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (HttpOnly cookie)
- **Password Hashing:** bcrypt (salt rounds 10)
- **Rate Limiting:** In-memory (with TODO for Redis in production)

### Implementation Details

**File Locations:**
- `apps/api/src/auth/auth.controller.ts` (Controller — endpoints)
- `apps/api/src/auth/auth.service.ts` (Service — business logic)
- `apps/api/src/auth/dto/*.dto.ts` (DTOs — request/response validation)
- `apps/api/src/auth/auth.module.ts` (Module configuration)

**Endpoints to Implement:**

1. **POST /auth/login**
   - Request: `{ email: string, password: string, rememberMe?: boolean }`
   - Response: `{ user: User, message: string }` (JWT token in HttpOnly cookie)
   - Errors: 400 Bad Request, 401 Unauthorized, 429 Throttled

2. **POST /auth/register**
   - Request: `{ email: string, password: string, name?: string, phone?: string }`
   - Response: `{ user: User, message: string }` (JWT token in HttpOnly cookie)
   - Errors: 400 Bad Request, 429 Throttled

**Password Hashing:**
- Use bcrypt with salt rounds 10
- Hash password before storing in database
- Compare hashed passwords (never compare plaintext)

**JWT Token Generation:**
- Generate JWT token with user ID and role
- Store token in HttpOnly cookie (secure, httpOnly, sameSite: 'strict')
- Set expiration (15 minutes for login, 7 days if rememberMe)
- Token payload: `{ userId: string, role: UserRole }`

**Rate Limiting:**
- Login: 5 attempts per hour per IP
- Register: 3 attempts per hour per IP
- Use in-memory rate limiting (TODO: Redis for production)

**Password Validation:**
- Minimum 8 characters
- Must contain: uppercase letter, lowercase letter, number, special character
- Validation per OpenAPI spec requirements

**User Creation:**
- Default role: `SEEKER`
- Email must be unique (Prisma unique constraint)
- Store password hash (never plaintext)
- Created timestamp: `createdAt: now()`

**Error Handling:**
- Invalid credentials (401 Unauthorized)
- Duplicate email (400 Bad Request)
- Weak password (400 Bad Request)
- Rate limiting (429 Throttled)
- Network errors (500 Internal Server Error)

**Audit Logging (Per Spec Section 11):**
- Log login attempts (success/failure)
- Log registration events
- Log password-related events
- Never log passwords or tokens

---

## Acceptance Criteria

### POST /auth/login Endpoint
- [ ] Endpoint accepts email/password in request body
- [ ] Validates email format (client-side + server-side)
- [ ] Validates password presence
- [ ] Finds user by email in database
- [ ] Compares password hash (bcrypt.compare)
- [ ] Generates JWT token with user ID and role
- [ ] Sets HttpOnly cookie with token
- [ ] Returns user data (without password)
- [ ] Returns 401 Unauthorized for invalid credentials
- [ ] Returns 429 Throttled for rate limit exceeded
- [ ] Rate limiting works (5 attempts/hour/IP)
- [ ] Audit logging works (login events logged)

### POST /auth/register Endpoint
- [ ] Endpoint accepts email/password in request body
- [ ] Validates email format (client-side + server-side)
- [ ] Validates password strength (uppercase, lowercase, number, special character)
- [ ] Checks for duplicate email (Prisma unique constraint)
- [ ] Hashes password with bcrypt (salt rounds 10)
- [ ] Creates user with default role: `SEEKER`
- [ ] Generates JWT token with user ID and role
- [ ] Sets HttpOnly cookie with token
- [ ] Returns user data (without password)
- [ ] Returns 400 Bad Request for duplicate email
- [ ] Returns 400 Bad Request for weak password
- [ ] Returns 429 Throttled for rate limit exceeded
- [ ] Rate limiting works (3 attempts/hour/IP)
- [ ] Audit logging works (registration events logged)

### Technical Requirements
- [ ] Uses NestJS framework
- [ ] TypeScript compiles without errors
- [ ] Uses Prisma for database queries
- [ ] Uses bcrypt for password hashing
- [ ] Uses JWT for token generation
- [ ] Uses HttpOnly cookies for token storage
- [ ] Rate limiting implemented
- [ ] Audit logging implemented
- [ ] No linter errors
- [ ] Matches OpenAPI v0.2.1 contract exactly

### Security Requirements (Per Spec Section 11)
- [ ] Password hashing (bcrypt, salt rounds 10)
- [ ] JWT token in HttpOnly cookie (secure, httpOnly, sameSite: 'strict')
- [ ] Rate limiting (login: 5/hour, register: 3/hour)
- [ ] Password validation (uppercase, lowercase, number, special character)
- [ ] No passwords or tokens in logs
- [ ] Audit logging (login/register events)

---

## DoD Checklist (Definition of Done)

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (database, JWT, rate limiting)
- [ ] Security tests written and passing (password hashing, rate limiting, JWT)
- [ ] Audit logging implemented (login/register events)
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
- **Endpoints:** `POST /auth/login`, `POST /auth/register`
- **Schemas:** LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
- **Error Responses:** 400 Bad Request, 401 Unauthorized, 429 Throttled
- **Milestone Document:** `MILESTONE_M1.md` (Task 7)

### Prisma Schema
- **User Model:** `apps/api/prisma/schema.prisma` (User model)
- **Fields:** `id`, `email`, `role`, `passwordHash`, `createdAt`, etc.

### Existing Implementation (Reference)
- **Forgot/Reset Password:** Already implemented via RFC-002
- **Reference Files:** `apps/api/src/auth/auth.controller.ts`, `apps/api/src/auth/auth.service.ts` (RFC-002 implementation)

### Security Requirements
- **Password Hashing:** bcrypt (salt rounds 10)
- **JWT:** HttpOnly cookie (secure, httpOnly, sameSite: 'strict')
- **Rate Limiting:** In-memory (with TODO for Redis)
- **Audit Logging:** Per Spec Section 11

---

## Dependencies

**Blocking Dependencies:**
- [x] Prisma schema defined ✅ (M0 Task 3 complete)
- [x] OpenAPI contract defined ✅ (M0 Task 2 complete)
- [x] NestJS project initialized ✅ (M0 complete)

**Parallel Work:** Can work in parallel with frontend tasks (contract-first approach).

---

## Testing Requirements

### Unit Tests
- [ ] Auth service methods testable
- [ ] Password hashing works correctly
- [ ] JWT token generation works correctly
- [ ] Password validation works correctly
- [ ] Rate limiting logic works correctly

### Integration Tests
- [ ] Database queries work correctly (user creation, lookup)
- [ ] JWT token generation and validation works
- [ ] HttpOnly cookie setting works
- [ ] Rate limiting works (in-memory)
- [ ] Audit logging works (events logged)
- [ ] Error handling works (invalid credentials, duplicate email, weak password)

### Security Tests
- [ ] Password hashing secure (bcrypt, salt rounds 10)
- [ ] JWT token secure (HttpOnly cookie, secure, sameSite)
- [ ] Rate limiting enforced (login: 5/hour, register: 3/hour)
- [ ] Password validation enforced (uppercase, lowercase, number, special character)
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
   - [ ] Password hashing secure (bcrypt, salt rounds 10)
   - [ ] JWT token secure (HttpOnly cookie, secure, sameSite)
   - [ ] Rate limiting enforced
   - [ ] Password validation enforced
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
- `POST /auth/login` endpoint
- `POST /auth/register` endpoint
- JWT token generation (HttpOnly cookie)
- Password hashing (bcrypt)
- Password validation (uppercase, lowercase, number, special character)
- Rate limiting (login: 5/hour, register: 3/hour)
- Audit logging (login/register events)
- Error handling (400, 401, 429)

### ❌ Out of Scope (Requires RFC)
- `POST /auth/forgot-password` (already implemented via RFC-002)
- `POST /auth/reset-password` (already implemented via RFC-002)
- OAuth/social login
- Multi-factor authentication (MFA)
- Email verification
- Account activation
- Password history enforcement
- Session management (beyond JWT)
- Extra authentication methods

**⚠️ SCOPE WARNING:** If you need anything beyond the above, create an RFC first.

---

## Known Limitations & TODOs

**Per Existing Implementation (RFC-002):**
- [ ] Password field — User model needs `passwordHash` field
  - Currently password update is skipped (see TODO in auth.service.ts)
  - Add when implementing login functionality
- [ ] Email service — Placeholder needs actual Resend/SES integration
  - Location: `email.service.ts`
  - Replace console.log with actual email service
- [ ] Rate limiting — Replace in-memory cache with Redis for production
  - Location: `rate-limit.service.ts`
  - Current implementation uses Map (fine for development)

---

## Success Criteria

✅ **Task is complete when:**
1. Both endpoints (`POST /auth/login`, `POST /auth/register`) implemented
2. All endpoints match OpenAPI v0.2.1 contract exactly
3. All acceptance criteria met
4. All DoD checklist items complete
5. All reviews approved (Tech Lead, Security Guard, QA, Scope Guardian, PM)
6. No linter errors
7. TypeScript compiles without errors
8. Contract tests passing
9. Security requirements met (password hashing, JWT, rate limiting, audit logging)

---

**Created:** 2025-01-11  
**Assigned To:** Backend Engineer  
**Status:** ⏳ PENDING — Ready to start  
**Next Step:** Implement login/register endpoints matching OpenAPI v0.2.1 contract

