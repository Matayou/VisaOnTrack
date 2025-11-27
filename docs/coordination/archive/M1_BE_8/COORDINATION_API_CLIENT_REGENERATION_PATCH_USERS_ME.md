# Coordination — API Client Regeneration (PATCH /users/me)

**Date:** 2025-01-11  
**Coordinated By:** Project Manager  
**Task:** Regenerate API client after PATCH /users/me endpoint addition  
**Status:** ⏳ PENDING

---

## Background

**Backend Engineer** has added `PATCH /users/me` endpoint to OpenAPI spec (v0.2.1).

**Next Step:** Regenerate API client to include `updateCurrentUser()` method.

**See:** `BACKEND_ENGINEER_COMPLETION_PATCH_USERS_ME.md` for endpoint details

---

## Required Action

**Backend Engineer:** Please regenerate the API client (you just updated the OpenAPI spec).

**Rationale:** In contract-first development, whoever updates the OpenAPI contract should regenerate the client immediately to ensure consistency.

---

## Regeneration Command

### Option 1: From packages/client directory
```bash
cd packages/client
npm run generate
```

### Option 2: From root directory (pnpm workspace)
```bash
pnpm --filter @visaontrack/client generate
```

---

## Expected Results

### After Regeneration:

**File:** `packages/client/src/services/UsersService.ts`

**Expected Method:**
```typescript
updateCurrentUser(requestBody: UpdateUserRequest): Promise<User>
```

**Expected Type:**
```typescript
interface UpdateUserRequest {
  role?: UserRole | null;
  name?: string | null;
  phone?: string | null;
  locale?: string | null;
}
```

**Expected Usage:**
```typescript
import { api } from '@visaontrack/client';

// Update user role (account type selection)
await api.users.updateCurrentUser({
  role: 'SEEKER' // or 'PROVIDER'
});
```

---

## Verification Checklist

After regeneration, verify:

- [ ] `packages/client/src/services/UsersService.ts` includes `updateCurrentUser()` method
- [ ] Method signature matches expected request/response types
- [ ] `UpdateUserRequest` type exists and matches OpenAPI spec
- [ ] `User` return type matches OpenAPI spec
- [ ] TypeScript compilation succeeds (`pnpm --filter @visaontrack/web typecheck`)
- [ ] No linter errors

---

## Frontend Engineer Verification

After API client regeneration:

**Frontend Engineer:** Please verify `api.users.updateCurrentUser()` method exists and is usable.

**Verification Steps:**
1. Check `packages/client/src/services/UsersService.ts` for `updateCurrentUser()` method
2. Verify method signature matches expected types
3. Test TypeScript compilation (`pnpm --filter @visaontrack/web typecheck`)
4. Report verification status

---

## Next Steps After Regeneration

1. ✅ **API Client Regenerated**
2. ⏳ **Frontend Engineer:** Verify `api.users.updateCurrentUser()` method exists
3. ⏳ **Tech Lead:** Review OpenAPI spec update
4. ⏳ **Scope Guardian:** Review spec adherence
5. ⏳ **PM:** Update blocker status (BLOCKED → RESOLVED)
6. ⏳ **Frontend Engineer:** Continue M1-FE-4 implementation

---

**Created:** 2025-01-11  
**Coordinated By:** Project Manager  
**Status:** ⏳ PENDING — Awaiting API client regeneration

