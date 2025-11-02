# Backend Engineer Coordination — M1-BE-7: Missing /auth/register Endpoint

**Task:** M1-BE-7: Authentication API Endpoints  
**Issue:** `/auth/register` endpoint not in OpenAPI spec (v0.2.1)  
**Impact:** Frontend M1-FE-2 blocked — Register pages need this endpoint  
**Priority:** HIGH — BLOCKER for M1-FE-2 completion  
**Date:** 2025-01-11

---

## 🔴 Blocker Summary

**Problem:** `/auth/register` endpoint is referenced in `TASK_M1_FE_AUTH_FLOWS.md` but is NOT in OpenAPI spec (v0.2.1)

**Impact:**
- Frontend register pages have commented API calls
- `api.auth.register()` doesn't exist in generated client
- M1-FE-2 cannot be completed without this endpoint

**Action Required:** Backend Engineer to verify and add endpoint to OpenAPI spec (M1-BE-7)

---

## 📋 Current Status

### OpenAPI Spec Status
- ✅ `POST /auth/login` — ✅ EXISTS (OpenAPI v0.2.1)
- ✅ `POST /auth/forgot-password` — ✅ EXISTS (OpenAPI v0.2.1 — RFC-002)
- ✅ `POST /auth/reset-password` — ✅ EXISTS (OpenAPI v0.2.1 — RFC-002)
- ❌ `POST /auth/register` — ❌ MISSING (not in OpenAPI v0.2.1)

### Task Document Status
- ✅ `TASK_M1_FE_AUTH_FLOWS.md` — References `POST /auth/register` endpoint
- ✅ `TASK_M1_BE_AUTH_API.md` — Task M1-BE-7 includes register endpoint

### Frontend Implementation Status
- ✅ Login page uses `api.auth.login()` (works — endpoint exists)
- ⚠️ Register pages have commented API calls (blocked — endpoint missing)

---

## 🎯 Coordination Request

### To Backend Engineer

**Please verify `/auth/register` endpoint status:**

1. **Check Task Document:** `TASK_M1_BE_AUTH_API.md`
   - Task M1-BE-7 includes `POST /auth/register` endpoint
   - Verify if this is planned for M1-BE-7

2. **Check OpenAPI Spec:** `packages/types/openapi.yaml`
   - Verify if endpoint exists (it doesn't currently)
   - If missing, add to spec

3. **If Endpoint Planned:**
   - Add `POST /auth/register` endpoint to OpenAPI spec
   - Version bump: v0.2.1 → v0.2.2 (minor, non-breaking)
   - Implement endpoint per spec requirements
   - Regenerate API client
   - Notify Frontend Engineer when ready

4. **If Endpoint NOT Planned:**
   - Create RFC to add endpoint
   - Explain why endpoint is missing
   - Get Scope Guardian approval
   - Then proceed with implementation

---

## 📋 Endpoint Requirements (Per Task Document)

### POST /auth/register Endpoint

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string?",
  "phone": "string?"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "role": "SEEKER",
    "name": "string?",
    "phone": "string?"
  },
  "message": "string"
}
```
**JWT token set in HttpOnly cookie**

**Error Responses:**
- `400 Bad Request` — Invalid email format, weak password, duplicate email
- `429 Throttled` — Rate limit exceeded (3 attempts/hour/IP)

**Requirements (Per Spec Section 11):**
- Password validation: uppercase, lowercase, number, special character
- Password hashing: bcrypt (salt rounds 10)
- Rate limiting: 3 attempts/hour/IP
- Audit logging: registration events logged
- JWT token: HttpOnly cookie (secure, httpOnly, sameSite: 'strict')

---

## 📊 Status Update

**Report back to PM with:**

1. **Endpoint Status:** ✅ PLANNED / ❌ NOT PLANNED / ⚠️ NEEDS RFC
2. **OpenAPI Spec:** Will add / Already exists / Needs RFC
3. **Implementation Timeline:** Estimate for endpoint implementation
4. **API Client:** Will regenerate / Already regenerated

**Reply Format:**
```
Backend Engineer Status: /auth/register endpoint
Status: [PLANNED/NOT PLANNED/NEEDS RFC]
OpenAPI Spec: [Will add/Already exists/Needs RFC]
Timeline: [Estimate]
[Detailed status]
```

---

## ✅ After Endpoint Added

### Frontend Engineer Actions

1. Uncomment API calls in register pages
2. Test full registration flow
3. Verify API integration works
4. Complete any remaining pieces
5. Report completion to PM

### Multi-Agent Review

1. Tech Lead Review — Code quality
2. QA Engineer Review — Accessibility & responsiveness
3. Security Guard Review — Password validation, security
4. Scope Guardian Review — Spec adherence
5. PM Final Approval — DoD checklist

---

**Created:** 2025-01-11  
**PM:** Project Manager  
**Status:** ⚠️ COORDINATING — Awaiting Backend Engineer endpoint status  
**Priority:** HIGH — BLOCKER for M1-FE-2 completion

