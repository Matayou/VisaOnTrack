# Verification: api.users.updateCurrentUser()

**Date:** 2025-01-11  
**Status:** ✅ VERIFIED

---

## API Method Verification

### Method Existence
✅ **Method exists:** `packages/client/src/services/UsersService.ts` (line 36)

### Method Signature
```typescript
public static updateCurrentUser({
  requestBody,
}: {
  requestBody: UpdateUserRequest,
}): CancelablePromise<User>
```

### Request Type: UpdateUserRequest
```typescript
export type UpdateUserRequest = {
  role?: UserRole;           // 'SEEKER' | 'PROVIDER' | null
  name?: string | null;
  phone?: string | null;
  locale?: string | null;
};
```

### Response Type: User
Returns updated `User` object

---

## Usage Example

```typescript
import { api } from '@visaontrack/client';

// Update user role (account type selection)
await api.users.updateCurrentUser({
  requestBody: {
    role: 'SEEKER'  // or 'PROVIDER'
  }
});

// Update user profile
await api.users.updateCurrentUser({
  requestBody: {
    name: 'John Doe',
    phone: '+66123456789',
    locale: 'en-US'
  }
});

// Partial update (only role)
await api.users.updateCurrentUser({
  requestBody: {
    role: 'PROVIDER'
  }
});
```

---

## API Client Export
✅ **Exported correctly:** `packages/client/src/api.ts` (line 57)
- `api.users` references `Services.UsersService`
- Method accessible via `api.users.updateCurrentUser()`

---

## TypeScript Compilation
✅ **Compiles successfully:** Verified with `pnpm --filter @visaontrack/web typecheck`

---

## Use Cases

### Primary Use Case: Account Type Selection (M1-FE-4)
**Location:** `/onboarding/account-type` (to be implemented)
**Usage:** 
- User selects account type (Seeker or Provider)
- Frontend calls `api.users.updateCurrentUser({ requestBody: { role: 'SEEKER' | 'PROVIDER' } })`
- Backend updates user role in database
- Frontend redirects to appropriate onboarding flow

### Additional Use Cases
- Profile updates (name, phone, locale)
- Partial updates supported (only update fields provided)

---

## Status

✅ **VERIFIED AND READY TO USE**

The `api.users.updateCurrentUser()` method is:
- ✅ Generated from OpenAPI spec
- ✅ Correctly typed (TypeScript)
- ✅ Exported in API client
- ✅ Ready for use in account type selection and profile update flows

---

**Verified By:** Frontend Engineer  
**Date:** 2025-01-11

