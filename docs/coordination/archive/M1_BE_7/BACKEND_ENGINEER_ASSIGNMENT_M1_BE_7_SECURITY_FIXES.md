# M1-BE-7 Security Fixes — Backend Engineer Assignment

**Task:** M1-BE-7 Security Fixes (Critical Issues)  
**Assigned To:** Backend Engineer  
**Date:** 2025-01-11  
**Status:** 🔴 CRITICAL — Must Fix Before Production  
**Priority:** HIGHEST

---

## 📋 Task Overview

**Duration:** 4-6 hours total  
**Milestone:** M1 — Auth & Onboarding  
**Dependencies:** M1-BE-7 implementation (needs fixes)  
**Security Incident:** `docs/incidents/SECURITY_INCIDENT_M1_BE_7_CRITICAL_ISSUES.md`

---

## 🎯 Task Goal

Fix critical security issues identified in M1-BE-7 before production deployment. Most critical: implement JWT authentication guard to protect endpoints.

---

## 🔴 Critical Issues (Must Fix)

### 1. JWT Authentication Guard Missing (CRITICAL)

**Location:** `apps/api/src/users/users.controller.ts` (line 15)

**Current Issue:**
```typescript
// Current placeholder code
(req as any).user?.userId
```

**Required Fix:**
- Implement JWT guard that extracts token from HttpOnly cookie
- Validate token signature and expiration
- Attach `userId` to request object
- Protect `/users/me` endpoints with guard

**Implementation Steps:**
1. Create `apps/api/src/auth/guards/jwt-auth.guard.ts`
2. Extract token from `req.cookies['accessToken']`
3. Verify token with JWT secret
4. Attach `userId` to `req.user`
5. Apply guard to `UsersController` endpoints

**Estimated Time:** 2-3 hours

**Reference:**
- JWT token generation exists in `AuthService.generateToken()`
- Use same secret from `process.env.JWT_SECRET`
- Follow NestJS guard pattern (M1-BE-8 reference)

---

### 2. Password Reset Token Logging (HIGH)

**Location:** `apps/api/src/common/services/email.service.ts` (line 42)

**Current Issue:**
```typescript
console.log(`[EmailService] Reset link: ${resetLink}`)
```

**Required Fix:**
- Remove token from logs
- Log only email address and timestamp

**Implementation:**
```typescript
// Replace with:
console.log(`[EmailService] Password reset email sent to: ${email} at ${new Date().toISOString()}`)
```

**Estimated Time:** 5 minutes

---

### 3. Rate Limiting Bypass Vulnerability (HIGH)

**Location:** `apps/api/src/common/services/rate-limit.service.ts` (line 49)

**Current Issue:**
```typescript
// Current: Uses token as key
`reset:${token}`
```

**Required Fix:**
- Use IP + email as key instead
- Or use IP + user ID
- Add global throttle per IP

**Implementation:**
```typescript
// Replace with:
`reset:${ip}:${email}` // or `reset:${ip}:${userId}`
```

**Estimated Time:** 30 minutes

---

## ⚠️ Important Issues (Fix Soon)

### 4. Missing Global ValidationPipe (MEDIUM)

**Location:** `apps/api/src/main.ts` (line 6)

**Current Issue:** No ValidationPipe configured

**Required Fix:**
```typescript
import { ValidationPipe } from '@nestjs/common';

// Add to bootstrap():
app.useGlobalPipes(new ValidationPipe({ 
  whitelist: true, 
  transform: true 
}));
```

**Estimated Time:** 15 minutes

---

### 5. Multiple PrismaClient Instances (MEDIUM)

**Location:** `apps/api/src/auth/auth.module.ts` (line 22), `apps/api/src/users/users.module.ts` (line 10)

**Current Issue:** Each module creates its own `PrismaClient()` instance

**Required Fix:**
- Create shared `PrismaService` registered at app root
- Inject `PrismaService` into modules instead of creating new instances

**Implementation Steps:**
1. Create `apps/api/src/common/services/prisma.service.ts`
2. Register as global provider in `AppModule`
3. Update `AuthModule` and `UsersModule` to inject `PrismaService`

**Estimated Time:** 1-2 hours

---

## 📋 Implementation Checklist

### Critical Fixes (Must Complete)
- [ ] Implement JWT authentication guard
  - [ ] Create `jwt-auth.guard.ts`
  - [ ] Extract token from HttpOnly cookie
  - [ ] Validate token signature and expiration
  - [ ] Attach userId to request
  - [ ] Apply guard to UsersController
  - [ ] Test guard with protected endpoints
- [ ] Remove token from email service logs
- [ ] Fix reset password rate limiting (use IP+email)

### Important Fixes (Complete Soon)
- [ ] Add global ValidationPipe to main.ts
- [ ] Refactor PrismaClient to shared service

---

## 🧪 Testing Requirements

### JWT Guard Tests
- [ ] Unit test: Guard extracts token from cookie
- [ ] Unit test: Guard validates token signature
- [ ] Unit test: Guard rejects expired tokens
- [ ] Unit test: Guard rejects invalid tokens
- [ ] Integration test: Protected endpoint requires valid token
- [ ] Integration test: Protected endpoint rejects missing token
- [ ] Integration test: Protected endpoint rejects invalid token

### Security Tests
- [ ] Test: Token not logged in email service
- [ ] Test: Rate limiting uses IP+email (not token)
- [ ] Test: ValidationPipe validates DTOs

---

## 📚 References

### Security Incident Document
- **Full Report:** `docs/incidents/SECURITY_INCIDENT_M1_BE_7_CRITICAL_ISSUES.md`

### Implementation References
- **JWT Token Generation:** `apps/api/src/auth/auth.service.ts` (generateToken method)
- **NestJS Guards:** Follow M1-BE-8 pattern
- **Cookie Parsing:** Already configured in `apps/api/src/main.ts`

### OpenAPI Spec
- **Security Scheme:** `cookieAuth` (HttpOnly cookies)
- **Spec:** `packages/types/openapi.yaml`

---

## ✅ DoD Checklist

### Implementation
- [ ] JWT guard implemented and tested
- [ ] Token logging removed from email service
- [ ] Rate limiting fixed (IP+email)
- [ ] Global ValidationPipe added
- [ ] PrismaClient refactored to shared service

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Security tests written and passing

### Quality & Standards
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] All critical issues fixed
- [ ] Code reviewed

### Multi-Agent Reviews
- [ ] Tech Lead review complete
- [ ] Security Guard re-review complete (REQUIRED)
- [ ] PM final approval granted

---

## 🚀 Next Steps

1. **Backend Engineer:** Review security incident document
2. **Backend Engineer:** Implement critical fixes (JWT guard, logging, rate limiting)
3. **Backend Engineer:** Implement important fixes (ValidationPipe, PrismaService)
4. **Backend Engineer:** Write tests for all fixes
5. **Backend Engineer:** Notify PM when fixes complete
6. **PM:** Coordinate Security Guard re-review
7. **PM:** Update milestone progress after completion

---

**Created:** 2025-01-11  
**PM:** Project Manager  
**Status:** Ready for Implementation  
**Priority:** 🔴 CRITICAL

