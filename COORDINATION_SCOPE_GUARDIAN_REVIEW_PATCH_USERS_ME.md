# Coordination — Scope Guardian Review: PATCH /users/me OpenAPI Spec Update

**Date:** 2025-01-11  
**Coordinated By:** Project Manager  
**Task:** Review OpenAPI spec update (PATCH /users/me endpoint) for spec adherence  
**Assigned To:** Scope Guardian  
**Status:** ⏳ PENDING

---

## Task Assignment

**Scope Guardian:** Please review the OpenAPI spec update for the `PATCH /users/me` endpoint addition for spec adherence.

**Priority:** HIGH (required for blocker resolution)

**⚠️ CRITICAL:** This review is REQUIRED before blocker can be marked as resolved.

**Can happen in parallel with:** Tech Lead review

---

## Background

**Backend Engineer** has added `PATCH /users/me` endpoint to OpenAPI spec (v0.2.1) to unblock M1-FE-4 (Account Type Selection).

**See:**
- `BACKEND_ENGINEER_COMPLETION_PATCH_USERS_ME.md` for implementation details
- `COORDINATION_M1_BE_8_PATCH_USERS_ME.md` for coordination details
- `BLOCKER_M1_FE_4_MISSING_PATCH_USERS_ME.md` for blocker context

---

## Review Scope

### Spec Reference
**Spec:** `visaontrack-v2-spec.md` Section 5 (API endpoints)

### OpenAPI Spec File
**File:** `packages/types/openapi.yaml`  
**Version:** `0.2.1` (updated from `0.2.0`)

### Changes to Review

#### 1. Endpoint Definition (Lines 201-227)
- `PATCH /users/me` endpoint added
- Operation ID: `updateCurrentUser`
- Tags: `users`
- Security: `cookieAuth`
- Request body: `UpdateUserRequest` schema
- Response codes: `200`, `400`, `401`, `404`

#### 2. Schema Definition (Lines 1316-1338)
- `UpdateUserRequest` schema added
- Properties: `role`, `name`, `phone`, `locale`
- All properties nullable (supports partial updates)
- Uses `UserRole` enum reference for role

#### 3. Version Update
- OpenAPI version: `0.2.1` (was `0.2.0`)
- Contract version comment updated

---

## Review Checklist

### ✅ Spec Adherence
- [ ] Endpoint matches `visaontrack-v2-spec.md` Section 5 requirements
- [ ] Endpoint is required by spec (user management, account type selection)
- [ ] No extra endpoints beyond spec requirements
- [ ] No extra properties beyond spec requirements
- [ ] Request/response schemas match spec Section 3 data model

### ✅ Scope Compliance
- [ ] No scope creep (only required endpoint)
- [ ] No "nice to have" features beyond spec
- [ ] Endpoint serves M1-FE-4 requirement (account type selection)
- [ ] Endpoint serves M1-BE-8 requirement (user management)
- [ ] No extra functionality beyond specified use cases

### ✅ RFC Compliance (if applicable)
- [ ] Endpoint addition was coordinated (not arbitrary)
- [ ] Endpoint matches coordination document specification
- [ ] Endpoint addresses blocker requirement
- [ ] No deviations from coordination without RFC

### ✅ Versioning Compliance
- [ ] Version bump is appropriate (`0.2.0` → `0.2.1`)
- [ ] Minor version bump for non-breaking change (correct)
- [ ] Contract version comment updated (correct)

---

## Review Criteria

**Approve if:**
- ✅ Endpoint matches spec Section 5 requirements
- ✅ Endpoint is required (not scope creep)
- ✅ No extra features beyond spec
- ✅ Version bump is appropriate
- ✅ Serves documented use cases (M1-FE-4, M1-BE-8)

**Request Changes if:**
- ⚠️ Extra properties or endpoints not in spec
- ⚠️ Version bump is incorrect
- ⚠️ Minor scope deviations (specify required changes)

**Reject if:**
- ❌ Endpoint not required by spec
- ❌ Significant scope creep
- ❌ Violates spec requirements

---

## Expected Review Outcomes

### ✅ APPROVED
- Endpoint matches spec requirements
- No scope creep identified
- Ready for blocker resolution

### ⚠️ APPROVED WITH CHANGES
- Endpoint mostly compliant
- Minor scope issues (specify required changes)
- Can proceed after fixes

### ❌ REJECTED
- Significant scope violations
- Endpoint not required by spec
- Block further progress

---

## Review Format

Please provide:
1. **Decision:** ✅ APPROVED / ⚠️ APPROVED WITH CHANGES / ❌ REJECTED
2. **Spec Adherence:** Matches spec Section 5? (Yes/No with details)
3. **Scope Compliance:** No scope creep? (Yes/No with details)
4. **Required Changes:** List of changes needed (if any)
5. **Rationale:** Why approved/rejected/changes required

---

## Next Steps After Review

**If Approved:**
- ✅ Scope Guardian review complete
- ⏳ Tech Lead review (can happen in parallel)
- ⏳ API client regeneration (Backend Engineer)
- ⏳ Frontend Engineer verification
- ⏳ PM: Update blocker status (BLOCKED → RESOLVED)

**If Changes Required:**
- ⏳ Backend Engineer applies fixes
- ⏳ Scope Guardian re-reviews
- ⏳ Continue with next steps after approval

**If Rejected:**
- ⏳ Backend Engineer addresses scope issues
- ⏳ Scope Guardian re-reviews
- ⏳ Block progress until resolved

---

## Critical Review Points

### ⚠️ Must Verify:
1. **Endpoint is required:** `PATCH /users/me` is needed for account type selection (M1-FE-4)
2. **No scope creep:** Only required properties (role, name, phone, locale)
3. **Matches coordination:** Endpoint matches `COORDINATION_M1_BE_8_PATCH_USERS_ME.md` specification
4. **No extra features:** No additional endpoints or properties beyond requirements

### ⚠️ Known Acceptable:
- ✅ Partial updates (all properties nullable) — required for use case
- ✅ Version bump (`0.2.0` → `0.2.1`) — minor, non-breaking change
- ✅ `UpdateUserRequest` schema — required for request body

---

## References

- **Spec:** `visaontrack-v2-spec.md` Section 5 (API endpoints)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (lines 201-227, 1316-1338)
- **Backend Task:** `TASK_M1_BE_USER_MANAGEMENT_API.md`
- **Backend Completion:** `BACKEND_ENGINEER_COMPLETION_PATCH_USERS_ME.md`
- **Coordination:** `COORDINATION_M1_BE_8_PATCH_USERS_ME.md`
- **Blocker:** `BLOCKER_M1_FE_4_MISSING_PATCH_USERS_ME.md`
- **Frontend Task:** `TASK_M1_FE_4_ACCOUNT_TYPE.md`

---

**Created:** 2025-01-11  
**Coordinated By:** Project Manager  
**Assigned To:** Scope Guardian  
**Status:** ⏳ PENDING — Awaiting Scope Guardian review

**Priority:** 🔴 **CRITICAL** — Required for blocker resolution

**⚠️ REMINDER:** This review is REQUIRED before blocker can be marked as resolved. No exceptions.

