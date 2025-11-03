# Coordination — M1-BE-8: Add PATCH /users/me to OpenAPI Spec (BLOCKER RESOLUTION)

**Date:** 2025-01-11  
**Coordinated By:** Project Manager  
**Task:** M1-BE-8: User Management API Endpoints — Add PATCH /users/me to OpenAPI Spec  
**Assigned To:** Backend Engineer (with Tech Lead review)  
**Status:** 🔴 **CRITICAL BLOCKER** — Required for M1-FE-4

---

## Blocker Summary

**Issue:** `PATCH /users/me` endpoint is missing from OpenAPI spec (v0.2.1), which is required for M1-FE-4 (Account Type Selection).

**Impact:**
- 🔴 Blocks M1-FE-4 (Account Type Selection)
- 🔴 Blocks M1-FE-5 (Seeker Onboarding)
- 🔴 Blocks M1-FE-6 (Provider Onboarding)
- 🔴 Blocks all downstream M1 tasks

**See:** `BLOCKER_M1_FE_4_MISSING_PATCH_USERS_ME.md` for full blocker details

---

## Required Action

**Backend Engineer:** Please add `PATCH /users/me` endpoint to OpenAPI spec to unblock M1-FE-4.

**Priority:** 🔴 **CRITICAL** — Required immediately

---

## Implementation Requirements

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

**Requirements:**
- ✅ Matches `TASK_M1_BE_USER_MANAGEMENT_API.md` specification
- ✅ Includes all required request body properties (role, name, phone, locale)
- ✅ Includes all required response codes (200, 400, 401, 404)
- ✅ Uses existing schema references (`UserRole`, `User`)
- ✅ Uses existing response references (`BadRequest`, `Unauthorized`, `NotFound`)

### Step 2: Regenerate API Client

**Command:** `npm run generate:client` (or equivalent)

**Result:** `packages/client/src/services/UsersService.ts` will include `updateCurrentUser()` method

**Verification:** Frontend Engineer should verify `api.users.updateCurrentUser()` method exists after regeneration

### Step 3: Verify OpenAPI Spec

**Tech Lead:** Review OpenAPI spec update for:
- ✅ Correct schema references
- ✅ Correct response codes
- ✅ Matches task specification
- ✅ No breaking changes

**Scope Guardian:** Review spec adherence for:
- ✅ Matches `visaontrack-v2-spec.md` Section 5 (API endpoints)
- ✅ No scope creep
- ✅ No extra endpoints or features

---

## Acceptance Criteria

### OpenAPI Spec Update
- [ ] `PATCH /users/me` endpoint added to `packages/types/openapi.yaml`
- [ ] Endpoint includes all required request body properties (role, name, phone, locale)
- [ ] Endpoint includes all required response codes (200, 400, 401, 404)
- [ ] Endpoint uses existing schema references (`UserRole`, `User`)
- [ ] Endpoint uses existing response references (`BadRequest`, `Unauthorized`, `NotFound`)
- [ ] OpenAPI spec validates without errors

### API Client Regeneration
- [ ] API client regenerated (`npm run generate:client`)
- [ ] `packages/client/src/services/UsersService.ts` includes `updateCurrentUser()` method
- [ ] Method signature matches expected request/response types
- [ ] Frontend Engineer verifies method exists and is usable

### Review Status
- [ ] Tech Lead: Reviewed OpenAPI spec update
- [ ] Scope Guardian: Reviewed spec adherence
- [ ] PM: Verified blocker resolution

---

## Completion Status

**Backend Engineer:** ✅ **COMPLETE** — Endpoint added to OpenAPI spec
- ✅ `PATCH /users/me` endpoint added (lines 201-227)
- ✅ `UpdateUserRequest` schema added (lines 1316-1338)
- ✅ OpenAPI version updated to `0.2.1`
- ✅ All schema references valid
- ✅ All response references valid
- ✅ Matches coordination document specification

**See:** `BACKEND_ENGINEER_COMPLETION_PATCH_USERS_ME.md` for completion details

## Next Steps After Completion

1. ✅ **Backend Engineer:** Add `PATCH /users/me` to OpenAPI spec — ✅ COMPLETE
2. ✅ **API Client Regeneration:** API client regenerated — ✅ COMPLETE
3. ✅ **Method Verification:** `api.users.updateCurrentUser()` verified — ✅ COMPLETE
4. ⏳ **Frontend Engineer:** Verify API client method (can verify now)
5. ⏳ **Tech Lead:** Review OpenAPI spec update (parallel)
6. ⏳ **Scope Guardian:** Review spec adherence (parallel)
7. ⏳ **PM:** Update blocker status (BLOCKED → RESOLVED) after Frontend verification
8. ⏳ **Frontend Engineer:** Continue M1-FE-4 implementation (after verification)
9. ⏳ **Backend Engineer:** Implement `PATCH /users/me` endpoint (M1-BE-8 — separate task)

---

## References

- **Blocker Document:** `BLOCKER_M1_FE_4_MISSING_PATCH_USERS_ME.md`
- **Backend Task:** `TASK_M1_BE_USER_MANAGEMENT_API.md` (M1-BE-8)
- **Frontend Task:** `TASK_M1_FE_4_ACCOUNT_TYPE.md` (M1-FE-4)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)
- **Spec:** `visaontrack-v2-spec.md` Section 5 (API endpoints)

---

**Created:** 2025-01-11  
**Coordinated By:** Project Manager  
**Assigned To:** Backend Engineer (with Tech Lead review)  
**Status:** 🔴 **CRITICAL BLOCKER** — Required for M1-FE-4

