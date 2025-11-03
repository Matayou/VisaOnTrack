# 🚨 BLOCKER: M1-FE-4 Missing API Endpoint — PATCH /users/me

**Date:** 2025-01-11  
**Identified By:** Frontend Engineer  
**Blocking:** M1-FE-4 (Account Type Selection)  
**Priority:** 🔴 CRITICAL

---

## Issue Summary

**Problem:** The `PATCH /users/me` endpoint is missing from the OpenAPI spec (v0.2.1), which is required for M1-FE-4 (Account Type Selection) to update user roles.

**Impact:**
- 🔴 **Blocks M1-FE-4** (Account Type Selection) — Cannot implement without API endpoint
- 🔴 **Blocks M1-FE-5** (Seeker Onboarding) — Depends on account type selection
- 🔴 **Blocks M1-FE-6** (Provider Onboarding) — Depends on account type selection
- 🔴 **Blocks all downstream M1 tasks** — Onboarding flow cannot proceed

---

## Evidence

### Current OpenAPI Spec Status
**File:** `packages/types/openapi.yaml` (v0.2.1)

**Current State:**
```yaml
/users/me:
  get:
    tags:
      - users
    summary: Get current user
    description: Returns authenticated user profile
    operationId: getCurrentUser
    security:
      - cookieAuth: []
    responses:
      '200':
        description: User profile
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      '401':
        $ref: '#/components/responses/Unauthorized'
```

**Missing:** `PATCH /users/me` endpoint definition

### Task Requirements
**File:** `TASK_M1_FE_4_ACCOUNT_TYPE.md`

**Requirement:**
- "API Integration (`PATCH /users/me` to update user role)"
- "Use `api.users.updateMe()` from `@visaontrack/client`"
- "Request body: `{ role: 'SEEKER' | 'PROVIDER' }`"

### Backend Task Status
**File:** `TASK_M1_BE_USER_MANAGEMENT_API.md`

**Task M1-BE-8:** User Management API Endpoints Implementation
- **Status:** ⏳ PENDING
- **Priority:** MEDIUM (account type selection support)
- **Includes:** `PATCH /users/me` implementation
- **Issue:** Endpoint not yet added to OpenAPI spec

---

## Required Fix

### Step 1: Add PATCH /users/me to OpenAPI Spec

**File:** `packages/types/openapi.yaml`

**Location:** After `GET /users/me` (line 182-199)

**Required Addition:**
```yaml
  /users/me:
    get:
      # ... existing GET endpoint ...
    
    patch:
      tags:
        - users
      summary: Update current user
      description: Update authenticated user's profile (including role selection)
      operationId: updateCurrentUser
      security:
        - cookieAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                role:
                  $ref: '#/components/schemas/UserRole'
                name:
                  type: string
                  nullable: true
                phone:
                  type: string
                  nullable: true
                locale:
                  type: string
                  nullable: true
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
```

### Step 2: Regenerate API Client

**Command:** `npm run generate:client` (or equivalent)

**Result:** `packages/client/src/services/UsersService.ts` will include `updateCurrentUser()` method

### Step 3: Implement Backend Endpoint

**Task:** M1-BE-8 (User Management API Endpoints Implementation)
- Implement `PATCH /users/me` endpoint in NestJS
- Validate request body (role, name, phone, locale)
- Update user in database
- Return updated user data
- Handle errors (400, 401, 404)

---

## Resolution Plan

### Option 1: Add Endpoint First (Recommended)

**Timeline:** ~0.5 day additional time

**Steps:**
1. ✅ **Backend Engineer:** Add `PATCH /users/me` to OpenAPI spec
2. ✅ **Tech Lead:** Review OpenAPI spec update
3. ✅ **Scope Guardian:** Review spec adherence
4. ✅ **Backend Engineer:** Regenerate API client
5. ✅ **Frontend Engineer:** Verify API client method exists
6. ✅ **Backend Engineer:** Implement `PATCH /users/me` endpoint
7. ✅ **Tech Lead:** Review backend implementation
8. ✅ **Security Guard:** Review security requirements
9. ✅ **Scope Guardian:** Review spec adherence
10. ✅ **Frontend Engineer:** Implement M1-FE-4 with API integration

**Total Time:** ~1 day (0.5 day OpenAPI spec update + 0.5 day backend implementation)

### Option 2: Parallel Work (Frontend Mockup)

**Timeline:** No additional time (parallel work)

**Steps:**
1. ✅ **Backend Engineer:** Add `PATCH /users/me` to OpenAPI spec (while Frontend Engineer works on UI)
2. ✅ **Frontend Engineer:** Implement M1-FE-4 UI without API integration (mock API calls)
3. ✅ **Backend Engineer:** Implement `PATCH /users/me` endpoint
4. ✅ **Frontend Engineer:** Replace mock API calls with real API integration
5. ✅ **Multi-agent review:** Review complete implementation

**Total Time:** ~0.5 day (parallel work, Frontend can work on UI while Backend adds endpoint)

---

## Recommendation

**Option 1 (Add Endpoint First) is recommended** because:
- ✅ Cleaner implementation (no mock API calls)
- ✅ Frontend Engineer can test with real API
- ✅ Better integration testing
- ✅ No refactoring needed (no mock removal)

**Option 2 (Parallel Work) is acceptable** if:
- ⚠️ Timeline pressure exists
- ⚠️ Frontend Engineer prefers to work on UI first
- ⚠️ Backend Engineer can add endpoint quickly

---

## Next Steps

1. ✅ **PM:** Acknowledge blocker and coordinate resolution
2. ⏳ **Backend Engineer:** Add `PATCH /users/me` to OpenAPI spec
3. ⏳ **Tech Lead:** Review OpenAPI spec update
4. ⏳ **Scope Guardian:** Review spec adherence
5. ⏳ **Backend Engineer:** Regenerate API client
6. ⏳ **Frontend Engineer:** Verify API client method exists
7. ⏳ **Backend Engineer:** Implement `PATCH /users/me` endpoint
8. ⏳ **Multi-agent review:** Review backend implementation
9. ⏳ **Frontend Engineer:** Implement M1-FE-4 with API integration

---

## Status

**Current Status:** ⏳ **PARTIALLY RESOLVED** — Endpoint added to OpenAPI spec, awaiting API client regeneration and reviews

**Resolution Status:** ✅ **IN PROGRESS** — Backend Engineer completed OpenAPI spec update

**Completion Steps:**
- ✅ **Backend Engineer:** Added `PATCH /users/me` to OpenAPI spec — ✅ COMPLETE
- ⏳ **API Client Regeneration:** Regenerate API client (see `COORDINATION_API_CLIENT_REGENERATION_PATCH_USERS_ME.md`)
- ⏳ **Tech Lead:** Review OpenAPI spec update
- ⏳ **Scope Guardian:** Review spec adherence
- ⏳ **Frontend Engineer:** Verify API client method exists
- ⏳ **PM:** Update blocker status (BLOCKED → RESOLVED)

**See:** `BACKEND_ENGINEER_COMPLETION_PATCH_USERS_ME.md` for completion details

---

**Created:** 2025-01-11  
**Identified By:** Frontend Engineer  
**Blocker Status:** 🔴 **CRITICAL** — Blocks M1-FE-4 and downstream tasks

