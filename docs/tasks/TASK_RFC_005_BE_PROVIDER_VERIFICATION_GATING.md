# Task RFC-005-BE: Provider Verification Gating System (Backend)

**RFC:** RFC-005: Provider Verification Gating System  
**Milestone:** M1 — Auth & Onboarding  
**Assigned To:** Backend Engineer  
**Duration:** 2-3 days (16-23 hours)  
**Status:** ⏳ **BLOCKED** — Waiting for RFC-004 completion  
**Priority:** 🔴 **CRITICAL** — Blocks provider access until verified

---

## User Story

**As a** provider on the platform,  
**I want to** be blocked from accessing main features until I complete onboarding AND am verified by admin,  
**So that** only vetted providers can interact with seekers.

---

## Goal

Implement `ProviderVerifiedGuard` that blocks provider access to main platform features until both onboarding is complete AND documents are verified by admin, ensuring only vetted providers can interact with seekers.

---

## Scope (Per RFC-005)

**Guard Implementation:**
- Create `ProviderVerifiedGuard` (NestJS guard)
- Guard checks:
  1. User role is PROVIDER
  2. `onboardingCompleted = true`
  3. `providerOnboardingCompleted = true`
  4. `ProviderProfile.verifiedAt` is set

**Protected Endpoints:**
- `POST /requests/{id}/quotes` — Submit quotes
- `GET /requests` — Browse requests marketplace
- `GET /requests/{id}` — View request details
- `PATCH /orders/{id}/milestones` — Update milestones
- `POST /messages` — Message seekers
- `GET /providers/dashboard` — Provider dashboard (if implemented)

**API Endpoint:**
- `GET /providers/{id}/verification-status` — Get verification case status

**Error Response:**
- Return `403 Forbidden` with structured error message
- Include verification status in error response
- Allow frontend to display remediation steps

**⚠️ SCOPE WARNING:** Implement exactly per RFC-005. Guard must check BOTH onboarding completion AND verification. No extra endpoints. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] RFC approved ✅ (RFC-005 approved by PM, contingent on RFC-004)
- [x] RFC-004 complete ⏳ (MUST be complete first — dependency)
- [x] User story defined ✅ (this document)
- [x] Guard pattern exists ✅ (JwtAuthGuard pattern can be reused)
- [x] Provider profile exists ✅ (ProviderProfile model exists)
- [x] Verification case exists ✅ (VerificationCase model exists)
- [x] Dependencies identified ✅ (JWT guard exists, PrismaService exists)
- [x] DoR reviewed and approved ✅

**Status:** ⏳ **BLOCKED** — Waiting for RFC-004 completion

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
- `apps/api/src/providers/guards/provider-verified.guard.ts` (Guard implementation)
- `apps/api/src/providers/providers.controller.ts` (Apply guard to endpoints)
- `apps/api/src/providers/providers.service.ts` (Add verification status method)
- `apps/api/src/providers/dto/verification-status.dto.ts` (DTO — verification status response)

**Guard Implementation:**

1. **ProviderVerifiedGuard**
   - Extends `CanActivate` interface
   - Composes with `JwtAuthGuard` (user must be authenticated)
   - Checks user role is PROVIDER
   - Checks `onboardingCompleted = true`
   - Checks `providerOnboardingCompleted = true`
   - Checks `ProviderProfile.verifiedAt` is set
   - Returns `403 Forbidden` with structured error if not verified

2. **Guard Composition**
   - Use `@UseGuards(JwtAuthGuard, ProviderVerifiedGuard)`
   - `JwtAuthGuard` runs first (authentication)
   - `ProviderVerifiedGuard` runs second (authorization)

3. **Error Response Structure**
   ```typescript
   {
     code: 'PROVIDER_NOT_VERIFIED',
     message: 'Provider verification required',
     status: 'pending' | 'rejected' | 'incomplete',
     remediation: 'Complete onboarding and wait for admin verification'
   }
   ```

**Verification Status Endpoint:**

1. **GET /providers/{id}/verification-status**
   - Authentication: Required (`JwtAuthGuard`)
   - Authorization: Provider can only check own status
   - Response: Verification case status, onboarding status
   - Errors: 401 Unauthorized, 403 Forbidden (not provider), 404 Not Found

**Performance Considerations:**
- Guard queries database for `ProviderProfile.verifiedAt`
- Consider caching verification status (optional optimization)
- Single query per request (acceptable)

---

## Acceptance Criteria

### ProviderVerifiedGuard
- [ ] Guard checks user role is PROVIDER
- [ ] Guard checks `onboardingCompleted = true`
- [ ] Guard checks `providerOnboardingCompleted = true`
- [ ] Guard checks `ProviderProfile.verifiedAt` is set
- [ ] Guard returns `403 Forbidden` if not verified
- [ ] Guard returns structured error with status
- [ ] Guard composes with `JwtAuthGuard` correctly
- [ ] Guard allows access if all conditions met

### Protected Endpoints
- [ ] `POST /requests/{id}/quotes` protected by guard
- [ ] `GET /requests` protected by guard
- [ ] `GET /requests/{id}` protected by guard
- [ ] `PATCH /orders/{id}/milestones` protected by guard
- [ ] `POST /messages` protected by guard
- [ ] All endpoints return `403 Forbidden` if not verified

### Verification Status Endpoint
- [ ] Endpoint requires authentication (`JwtAuthGuard`)
- [ ] Endpoint returns verification status
- [ ] Endpoint returns onboarding status
- [ ] Endpoint validates provider can only check own status
- [ ] Endpoint returns 403 Forbidden if not provider
- [ ] Endpoint returns 404 Not Found if provider not found

### Error Handling
- [ ] Structured error responses (403 Forbidden)
- [ ] Error includes verification status
- [ ] Error includes remediation steps
- [ ] Frontend can parse error for UI display

### Technical Requirements
- [ ] Uses NestJS framework
- [ ] TypeScript compiles without errors
- [ ] Uses Prisma for database queries
- [ ] Uses `JwtAuthGuard` for authentication
- [ ] Follows existing guard pattern (JwtAuthGuard reference)
- [ ] Performance acceptable (single DB query per request)

---

## Implementation Steps

1. **Wait for RFC-004 Completion**
   - RFC-004-BE must be complete
   - Onboarding completion fields must exist
   - `onboardingCompleted` and `providerOnboardingCompleted` must be available

2. **Create ProviderVerifiedGuard**
   - Create `apps/api/src/providers/guards/provider-verified.guard.ts`
   - Implement `CanActivate` interface
   - Check user role is PROVIDER
   - Check onboarding completion flags
   - Check `ProviderProfile.verifiedAt`
   - Return structured error if not verified

3. **Apply Guard to Endpoints**
   - Identify all provider-protected endpoints
   - Apply `@UseGuards(JwtAuthGuard, ProviderVerifiedGuard)` to endpoints
   - Test guard behavior

4. **Implement Verification Status Endpoint**
   - Add `GET /providers/{id}/verification-status` to `ProvidersController`
   - Use `JwtAuthGuard`
   - Validate provider can only check own status
   - Return verification case status
   - Return onboarding status

5. **Update OpenAPI Spec**
   - Add `GET /providers/{id}/verification-status` endpoint
   - Document guard requirements in spec Section 11
   - Document blocked vs allowed features

6. **Test Guard Behavior**
   - Test guard allows verified providers
   - Test guard blocks unverified providers
   - Test guard blocks incomplete onboarding
   - Test error responses

---

## Testing Requirements

### Unit Tests
- [ ] Guard checks role correctly
- [ ] Guard checks onboarding completion correctly
- [ ] Guard checks verification status correctly
- [ ] Guard returns correct error structure

### Integration Tests
- [ ] Guard protects endpoints correctly
- [ ] Guard allows verified providers
- [ ] Guard blocks unverified providers
- [ ] Guard blocks incomplete onboarding
- [ ] Verification status endpoint works

### Security Tests
- [ ] Guard cannot be bypassed
- [ ] Guard checks all required conditions
- [ ] Error responses don't leak sensitive information

---

## Dependencies

- ⚠️ **RFC-004** — MUST be complete first (onboarding completion tracking)
- ✅ `JwtAuthGuard` — Already implemented
- ✅ `PrismaService` — Already implemented
- ✅ `ProviderProfile` model — Already exists
- ✅ `VerificationCase` model — Already exists

---

## References

- **RFC:** `RFCs/RFC-005-provider-verification-gating-system.md`
- **RFC-004:** `RFCs/RFC-004-onboarding-completion-tracking.md`
- **Guard Pattern:** `apps/api/src/auth/guards/jwt-auth.guard.ts`
- **Provider Controller:** `apps/api/src/providers/providers.controller.ts`
- **OpenAPI Spec:** `packages/types/openapi.yaml`

---

## Notes

- **Dependency:** Must wait for RFC-004 completion
- **Performance:** Guard adds DB query — monitor performance
- **Error Structure:** Must be parseable by frontend for UI display
- **Rollout:** Coordinate with frontend to avoid limbo state

---

**Created:** 2025-01-11  
**Assigned To:** Backend Engineer  
**Status:** ⏳ **BLOCKED** — Waiting for RFC-004 completion

