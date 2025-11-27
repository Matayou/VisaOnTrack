# Security Incident: M1-BE-7 Critical Security Issues

> **Canonical Status:** This incident has been resolved. See `docs/tasks/TASK_M1_BE_AUTH_API.md` and `PROJECT_STATUS.md` for current status.

**Date:** 2025-01-11  
**Priority:** 🔴 CRITICAL  
**Status:** ✅ **RESOLVED** (2025-01-11) — All security fixes complete and approved  
**Reported By:** Tech Lead  
**Assigned To:** Backend Engineer

---

## Executive Summary

Security review identified 3 high-priority issues and 2 medium-priority issues in M1-BE-7 that must be addressed before production. Most critical: the JWT authentication guard is not implemented, leaving protected endpoints vulnerable.

---

## 🔴 Critical Issues (Must Fix Before Production)

### 1. JWT Authentication Guard Missing

**Location:** `apps/api/src/users/users.controller.ts` (line 15)

**Issue:** `/users/me` endpoints use a placeholder `(req as any).user?.userId` instead of a real JWT guard

**Risk:** Authentication bypass — any request can forge `req.user` and access protected endpoints

**Impact:** Violates spec requirement (cookieAuth security). Endpoints are effectively unprotected

**Status:** M1-BE-7 marked complete, but guard implementation is missing

**Recommendation:** Implement JWT guard before marking M1-BE-7 complete. Token generation exists; validation/guard is missing

**Estimated Time:** 2-3 hours

---

### 2. Password Reset Token Logging

**Location:** `apps/api/src/common/services/email.service.ts` (line 42)

**Issue:** Full reset link (including token) logged to stdout: `console.log(\`[EmailService] Reset link: ${resetLink}\`)`

**Risk:** Tokens leak into logs (stdout, log aggregation, CI/CD logs)

**Impact:** Anyone with log access can reset user passwords

**Recommendation:** Remove token from logs immediately. Log only email address and timestamp

**Estimated Time:** 5 minutes

---

### 3. Rate Limiting Bypass Vulnerability

**Location:** `apps/api/src/common/services/rate-limit.service.ts` (line 49)

**Issue:** Reset password rate limiting uses token as key (`reset:${token}`)

**Risk:** Attackers can try unlimited tokens; each new token bypasses the limit

**Impact:** Enables brute-force attacks on reset tokens

**Recommendation:** Use IP + email or IP + user ID as key, or add global throttle per IP

**Estimated Time:** 30 minutes

---

## ⚠️ Important Issues (Fix Soon, Not Blockers)

### 4. Multiple PrismaClient Instances

**Location:** `apps/api/src/auth/auth.module.ts` (line 22), `apps/api/src/users/users.module.ts` (line 10)

**Issue:** Each module creates its own `PrismaClient()` instance

**Impact:** Defeats connection pooling, potential connection exhaustion, clean shutdown issues

**Recommendation:** Create shared PrismaService registered at app root (best practice, not security blocker)

**Estimated Time:** 1-2 hours

---

### 5. Missing Global ValidationPipe

**Location:** `apps/api/src/main.ts` (line 6)

**Issue:** No ValidationPipe configured, so DTO validation doesn't run

**Impact:** Invalid data can reach controllers, defeating contract-first approach

**Recommendation:** Add `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` in main.ts

**Estimated Time:** 15 minutes

---

## Recommended Action Plan

### Immediate Actions (This Week)

#### 1. Re-open M1-BE-7: JWT Guard Implementation
- **Assign to:** Backend Engineer
- **Priority:** CRITICAL
- **Estimated time:** 2-3 hours
- **Action:** Implement JWT guard that extracts/validates token from HttpOnly cookie and attaches userId to request

#### 2. Quick Security Fixes (Can be done in parallel)
- **Assign to:** Backend Engineer
- **Priority:** HIGH
- **Estimated time:** 1 hour total
- **Actions:**
  - Remove token from email service logs (5 min)
  - Fix reset password rate limiting to use IP+email (30 min)
  - Add global ValidationPipe (15 min)

#### 3. Architecture Improvement
- **Assign to:** Backend Engineer
- **Priority:** MEDIUM
- **Estimated time:** 1-2 hours
- **Action:** Refactor PrismaClient to shared service

---

## Impact on M1 Milestone

**Current status:** M1-BE-7 marked complete (89% milestone progress)  
**Required action:** Re-open M1-BE-7 to address critical issues  
**Timeline impact:** +4-6 hours of work (mostly JWT guard)  
**Risk if ignored:** Production security vulnerabilities

---

## Decision

**Decision:** Option A — Re-open M1-BE-7 and fix critical issues before proceeding to M1-BE-9

**Rationale:** Security issues must be fixed before production. Better to fix now than create technical debt.

---

## Next Steps

1. ✅ PM: Review and approve action plan (COMPLETE)
2. ✅ PM: Re-open M1-BE-7 (COMPLETE)
3. ⏳ PM: Assign Backend Engineer to implement fixes
4. ⏳ Backend Engineer: Implement critical fixes
5. ⏳ PM: Coordinate Security Guard re-review after fixes
6. ⏳ PM: Update milestone progress after completion

---

**Prepared by:** Tech Lead  
**Date:** 2025-01-11  
**PM Decision:** APPROVED — Re-opening M1-BE-7 to fix critical security issues  
**Status:** Awaiting Backend Engineer assignment

