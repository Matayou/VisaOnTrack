# Coordination — M1-FE-2 Security Fixes

**Task:** M1-FE-2: Login/Register Flows — Security Fixes  
**Engineer:** Frontend Engineer  
**Status:** ⏳ PENDING FIXES  
**Date:** 2025-01-11

---

## ✅ Security Guard Review Results

**Status:** ⚠️ APPROVED WITH REQUIRED CHANGES

**Issues Found:**
- ❌ Critical: Password validation in register (full) doesn't match OpenAPI requirements
- ❌ Critical: Password validation in register (simple) missing OpenAPI requirements

**Security Score:** ⚠️ **7/10** (deduction for password validation mismatch)

**See:** `SECURITY_GUARD_REVIEW_M1_FE_2.md` for full review details

---

## 🔧 Required Fixes

### Fix 1: Fix Password Validation in Register Page (Full) — CRITICAL

**Priority:** 🔴 **CRITICAL**

**Location:** `apps/web/app/auth/register/page.tsx` lines 92-128

**Issue:**
- Line 109: `if (/[A-Z]/.test(password) || /[0-9]/.test(password)) count++;`
- **Problem:** Allows uppercase OR numbers (not both required)
- **Issue:** Can pass with only uppercase + special, missing number requirement

**Current (INCORRECT):**
```typescript
if (/[A-Z]/.test(password) || /[0-9]/.test(password)) count++;
```

**Required (CORRECT):**
```typescript
// Length (8+)
if (password.length >= 8) count++;

// Lowercase (required)
if (/[a-z]/.test(password)) count++;

// Uppercase (required)
if (/[A-Z]/.test(password)) count++;

// Number (required)
if (/[0-9]/.test(password)) count++;

// Special character (required)
if (/[^A-Za-z0-9]/.test(password)) count++;
```

**Impact:** Password validation will match OpenAPI v0.2.1 requirements (all 4 criteria required)

---

### Fix 2: Add Password Validation in Register Page (Simple) — CRITICAL

**Priority:** 🔴 **CRITICAL**

**Location:** `apps/web/app/auth/register/simple/page.tsx` line 78

**Issue:**
- Only checks `password.length < 8`
- **Problem:** Missing uppercase, lowercase, number, special character requirements

**Current (INCORRECT):**
```typescript
// Only checks length >= 8
if (password.length < 8) {
  // Error
}
```

**Required (CORRECT):**
- Add full password strength validation matching OpenAPI requirements
- Option 1: Reuse `checkPasswordStrength()` from full register page
- Option 2: Implement inline validation matching OpenAPI requirements

**Example Implementation:**
```typescript
const checkPasswordStrength = (password: string): number => {
  let count = 0;
  
  // Length (8+)
  if (password.length >= 8) count++;
  
  // Lowercase (required)
  if (/[a-z]/.test(password)) count++;
  
  // Uppercase (required)
  if (/[A-Z]/.test(password)) count++;
  
  // Number (required)
  if (/[0-9]/.test(password)) count++;
  
  // Special character (required)
  if (/[^A-Za-z0-9]/.test(password)) count++;
  
  return count;
};
```

**Impact:** Password validation will match OpenAPI v0.2.1 requirements

---

## 📋 Frontend Engineer Assignment

**Deliver to:** Frontend Engineer (separate Cursor chat)

**Prompt:**
```
Frontend Engineer: Please apply the required security fixes for M1-FE-2.

Task Document: TASK_M1_FE_AUTH_FLOWS.md
Security Guard Review: SECURITY_GUARD_REVIEW_M1_FE_2.md

Required Fixes:
1. Fix password validation in register page (full)
   - Location: apps/web/app/auth/register/page.tsx (lines 92-128)
   - Issue: Line 109 allows uppercase OR numbers instead of requiring ALL 4 criteria
   - Fix: Require all 4 criteria separately (uppercase, lowercase, number, special character)

2. Add password validation in register page (simple)
   - Location: apps/web/app/auth/register/simple/page.tsx (line 78)
   - Issue: Only checks length >= 8, missing uppercase/lowercase/number/special character requirements
   - Fix: Add full password strength validation matching OpenAPI requirements

OpenAPI Requirements:
- Password validation must require ALL 4 criteria:
  - Uppercase letter (A-Z)
  - Lowercase letter (a-z)
  - Number (0-9)
  - Special character (!@#$%^&*(),.?":{}|<>)

Fix Details:
- Register (full): Replace OR logic with separate checks for all 4 criteria
- Register (simple): Add password strength validation matching OpenAPI requirements
- Option: Reuse checkPasswordStrength() from full register page for consistency

After applying fixes:
1. Verify TypeScript compilation (tsc --noEmit)
2. Verify no linter errors
3. Test password validation (try passwords missing each requirement)
4. Verify password strength meter updates correctly

Reply format:
"Frontend Engineer: Security Fixes Applied
✅ Fix 1: Password validation fixed in register page (full) - all 4 criteria required
✅ Fix 2: Password validation added in register page (simple) - matches OpenAPI requirements
✅ TypeScript compilation: PASS
✅ Linter checks: PASS
[Any additional notes]"
```

---

## ✅ Verification Checklist

After Frontend Engineer applies fixes:

- [ ] Fix 1: Password validation fixed in register page (full) — all 4 criteria required (verified)
- [ ] Fix 2: Password validation added in register page (simple) — matches OpenAPI requirements (verified)
- [ ] TypeScript compilation passes (`tsc --noEmit`)
- [ ] Linter checks pass
- [ ] Password validation matches OpenAPI v0.2.1 requirements (all 4 criteria required)
- [ ] Password strength meter updates correctly

---

## 📊 Status Tracking

### Current Status:
- ✅ Frontend Engineer: Initial implementation complete
- ✅ Tech Lead: ✅ APPROVED (production-ready, quality 10/10)
- ✅ QA Engineer: ✅ VERIFIED (all fixes correctly applied, no regressions)
- ✅ Security Guard: ⚠️ APPROVED WITH REQUIRED CHANGES (password validation fixes needed)
- ⏳ Frontend Engineer: ⏳ PENDING FIXES (NEXT)
- ⏳ Security Guard: ⏳ PENDING RE-REVIEW (after fixes, if requested)
- ⏳ Scope Guardian: ⏳ PENDING (REQUIRED)
- ⏳ PM Final Approval: ⏳ PENDING

---

## 🔄 Next Steps

1. ⏳ Frontend Engineer: Apply required security fixes — **NEXT**
2. ⏳ Security Guard: Re-review after fixes (if requested)
3. ⏳ Scope Guardian: Review (required)
4. ⏳ PM: Final approval (pending)

---

**Created By:** PM Coordinator  
**Date:** 2025-01-11  
**Status:** ⏳ PENDING FIXES

