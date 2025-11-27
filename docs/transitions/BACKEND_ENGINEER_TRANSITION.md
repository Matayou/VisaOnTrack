# Backend Engineer Transition Document

**Date:** 2025-01-11  
**Outgoing:** Backend Engineer (Current Agent)  
**Incoming:** Backend Engineer (Successor Agent)  
**Status:** ✅ Transition Ready

---

## 🎯 Quick Start

You're taking over as **Backend Engineer for VisaOnTrack v2**. This document contains everything you need to hit the ground running.

### Immediate Context

**Current Milestone:** M0 (Contracts & Skeletons) → M1 (Auth & Onboarding)  
**Recent Completed Work:**
- ✅ OpenAPI v0.2 Specification (Part 2/2) - Complete with all schemas
- ✅ Prisma Schema (28 models, 16 enums) - Complete and validated
- ✅ RFC-002 Implementation - Forgot/Reset Password API endpoints
- ✅ PATCH /users/me endpoint - Added to OpenAPI spec, client regenerated

**Active Blockers:** None (recently resolved)

---

## 📋 Your Mission & Responsibilities

### Mission Statement
Build NestJS API per OpenAPI spec. Enforce entitlements. Integrate Stripe.

### Core Responsibilities

1. **API Implementation** (Section 5)
   - Implement endpoints per OpenAPI contract
   - Follow contract-first principle
   - Ensure endpoint matches spec exactly

2. **Entitlement Enforcement** (Section 4, Section 8)
   - Middleware-level checks
   - Enforce: `quotes.monthly.max`, `packages.max`, `photos.max`, `attachments.maxSizeMB`, `visibility.weight`
   - Return structured errors (403 EntitlementExceeded, 429 Throttled)

3. **Stripe Integration** (Section 10)
   - Stripe Billing: checkout sessions, subscriptions, webhooks
   - Stripe Connect: PaymentIntents, payouts
   - Webhook handlers (idempotent)

4. **Schema Management** (Section 3)
   - Prisma migrations
   - Schema-first approach (schema → types → implementation)

5. **AuthZ Enforcement** (Section 11)
   - RBAC middleware
   - Row-level authorization
   - Audit logging for admin actions

6. **Usage Counting** (Section 8)
   - UsageCounter model
   - Monthly quota tracking
   - Period resets (Asia/Bangkok timezone)

7. **Contract Testing** (Section 13)
   - Pact provider tests
   - Ensure contract compliance

---

## 🛠️ Your Workflow (Critical Pattern)

**ALWAYS follow this sequence:**

```
1. Check DoR (TASK_TEMPLATES.md)
   ↓
2. Verify endpoint in OpenAPI spec (Section 5)
   ↓
3. Create/update Prisma model if needed (Section 3)
   ↓
4. Implement endpoint per contract
   ↓
5. Add entitlement checks (Section 4, Section 8)
   ↓
6. Add authZ checks (Section 11)
   ↓
7. Write tests (unit, integration, contract)
   ↓
8. Check DoD (TASK_TEMPLATES.md)
```

**CRITICAL:** Never skip steps. Never implement without OpenAPI contract first.

---

## 📁 Project Structure (What You Need to Know)

### Key Directories

```
apps/api/
├── src/
│   ├── auth/              # Auth endpoints (login, forgot-password, reset-password)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/           # Request/response DTOs
│   ├── common/
│   │   └── services/      # Shared services
│   │       ├── email.service.ts
│   │       ├── audit-log.service.ts
│   │       └── rate-limit.service.ts
│   ├── config/
│   │   └── cron-jobs.ts   # Scheduled tasks
│   └── app.module.ts      # Main NestJS module
├── prisma/
│   └── schema.prisma      # Database schema (28 models, 16 enums)
└── package.json

packages/types/
└── openapi.yaml           # OpenAPI 3.1 specification (v0.2.1)

packages/client/
└── src/                   # Generated API client (DO NOT EDIT)
    ├── services/
    │   └── UsersService.ts # Contains updateCurrentUser()
    └── models/
        └── UpdateUserRequest.ts
```

### Important Files to Know

**Specification:**
- `visaontrack-v2-spec.md` - **MASTER SPEC** (Section 3 = data model, Section 5 = API)
- `packages/types/openapi.yaml` - OpenAPI contract (always reference this)
- `apps/api/prisma/schema.prisma` - Database schema

**Templates & Guidelines:**
- `TASK_TEMPLATES.md` - DoR/DoD checklists (use before starting/finishing)
- `AGENT_PROMPTS.md` - Your role definition (lines 181-231)
- `SCOPE_GUARDIAN.md` - Anti-scope-creep rules

**Tasks:**
- `TASK_M0_T3_PRISMA_SCHEMA.md` - Prisma schema task (completed)
- `TASK_RFC_002_BACKEND_ENGINEER.md` - Forgot/reset password (completed)
- `BLOCKER_M1_FE_4_MISSING_PATCH_USERS_ME.md` - Resolved blocker

---

## ✅ What's Been Completed (Handoff State)

### M0 - Contracts & Skeletons

1. **OpenAPI v0.2.1 Specification** ✅
   - All 28 endpoints defined
   - All request/response schemas (Zod-compatible)
   - All error schemas (403, 413, 429, etc.)
   - Location: `packages/types/openapi.yaml`
   - **Status:** Complete, validated, no linter errors

2. **Prisma Schema** ✅
   - 28 models (11 Core + 5 Billing + 12 Admin)
   - 16 enums defined
   - All indexes and unique constraints
   - Relations with proper cascades
   - Location: `apps/api/prisma/schema.prisma`
   - **Status:** Complete, ready for migrations
   - **Note:** Password field not yet added to User model (will be added with login implementation)

3. **API Client Generation** ✅
   - Client regenerated from OpenAPI spec
   - Location: `packages/client/src/`
   - **Status:** Up to date with v0.2.1

### M1 - Auth & Onboarding (Partial)

1. **RFC-002: Forgot/Reset Password API** ✅
   - `POST /auth/forgot-password` - Implemented
   - `POST /auth/reset-password` - Implemented
   - Token hashing (bcrypt) - CRITICAL requirement met
   - Audit logging - All events logged
   - Data retention cleanup job - Daily cron
   - Rate limiting - 3/hour forgot, 5/hour reset
   - Location: `apps/api/src/auth/`
   - **Status:** Implementation complete, pending reviews
   - **TODO:** Password field needs to be added to User model when implementing login

2. **PATCH /users/me Endpoint** ✅
   - Added to OpenAPI spec
   - Schema: `UpdateUserRequest` (role, name, phone, locale)
   - API client regenerated
   - Location: `packages/types/openapi.yaml` (lines 201-227)
   - **Status:** Spec complete, ready for backend implementation
   - **Next:** Implement endpoint in NestJS (M1-BE-8 task)

---

## 🔴 Critical Patterns & Gotchas

### 1. Token Hashing (SECURITY - NEVER BREAK THIS)

**CRITICAL:** Tokens must ALWAYS be hashed before storing.

```typescript
// ✅ CORRECT:
const token = crypto.randomBytes(32).toString('hex');
const tokenHash = await bcrypt.hash(token, 10);
user.passwordResetTokenHash = tokenHash; // Store hashed
await emailService.sendEmail({ token }); // Email plaintext

// ❌ NEVER DO THIS:
user.passwordResetToken = token; // NEVER store plaintext
```

**Where Applied:**
- `auth.service.ts` - Forgot/reset password implementation
- Always use `passwordResetTokenHash` field (never `passwordResetToken`)

### 2. Contract-First Principle

**ALWAYS:**
1. Update OpenAPI spec first
2. Regenerate client (`cd packages/client && npm run generate`)
3. Then implement endpoint

**NEVER:**
- Implement endpoint without OpenAPI contract
- Manually create API calls (use generated client)
- Bypass OpenAPI validation

### 3. Entitlement Enforcement Pattern

**Location:** Middleware or service layer  
**Pattern:**

```typescript
// Check entitlement before action
const entitlements = await getEntitlements(providerId);
if (currentUsage >= entitlements['quotes.monthly.max']) {
  throw new ForbiddenException({
    code: 'ENTITLEMENT_EXCEEDED',
    message: 'Monthly quote limit exceeded',
    entitlement: 'quotes.monthly.max',
    limit: entitlements['quotes.monthly.max'],
    used: currentUsage,
  });
}
```

**Required Entitlements:**
- `quotes.monthly.max` - Quote submission limits
- `packages.max` - Service package limits
- `photos.max` - Profile photo limits
- `attachments.maxSizeMB` - File size limits
- `visibility.weight` - Ranking boost

### 4. Audit Logging Pattern

**CRITICAL:** Always log admin mutations and sensitive actions.

```typescript
// Log password reset request
await auditLogService.logPasswordResetRequest(userId, email, ip, ua);

// Log admin action
await prisma.auditLog.create({
  data: {
    actorUserId: adminId,
    actorRole: 'ADMIN',
    action: 'PROVIDER_APPROVED',
    entityType: 'ProviderProfile',
    entityId: providerId,
    diff: { status: 'APPROVED' },
    ip,
    ua,
  },
});
```

**NEVER log:**
- Tokens (hashed or plaintext)
- Passwords
- Sensitive PII beyond necessary fields

### 5. Schema-First Pattern

**ALWAYS:**
1. Update Prisma schema first
2. Create migration: `npx prisma migrate dev --name description`
3. Generate client: `npx prisma generate`
4. Use generated types in code

**NEVER:**
- Manually write types that Prisma can generate
- Skip migrations for schema changes
- Use raw SQL unless absolutely necessary

---

## 📚 Key Endpoints Reference

### Auth Endpoints (Implemented)
- `POST /auth/login` - Login (OpenAPI defined, backend TODO)
- `POST /auth/forgot-password` - ✅ Implemented (RFC-002)
- `POST /auth/reset-password` - ✅ Implemented (RFC-002)

### User Endpoints (Spec Ready)
- `GET /users/me` - Get current user (OpenAPI defined, backend TODO)
- `PATCH /users/me` - ✅ OpenAPI defined, backend TODO (M1-BE-8)

### Provider Endpoints (OpenAPI Defined, Backend TODO)
- `GET /providers` - Search providers
- `POST /providers` - Create provider profile
- `GET /providers/{id}` - Get provider
- `PATCH /providers/{id}` - Update provider

### Quote Endpoints (OpenAPI Defined, Backend TODO)
- `POST /requests/{id}/quotes` - Submit quote (entitlement: quotes.monthly.max)
- `GET /quotes/{id}` - Get quote
- `PATCH /quotes/{id}` - Update quote

### Billing Endpoints (OpenAPI Defined, Backend TODO - M6)
- `POST /billing/checkout-session` - Create Stripe Checkout
- `GET /billing/portal` - Customer portal URL
- `GET /billing/subscription` - Get subscription
- `GET /billing/entitlements/me` - Get entitlements + usage
- `POST /billing/webhook` - Stripe webhook handler

**Full List:** See `packages/types/openapi.yaml` paths section

---

## 🔧 Technical Stack & Setup

### Dependencies Required

```bash
cd apps/api
npm install @nestjs/common @nestjs/core @nestjs/schedule
npm install @prisma/client prisma
npm install bcrypt class-validator class-transformer
npm install @types/bcrypt --save-dev
```

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/visaontrack"

# Application
APP_URL="http://localhost:3000"
API_URL="http://localhost:3001"

# Stripe (M6 - Plans & Billing)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Common Commands

```bash
# Prisma
cd apps/api
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Create and apply migration
npx prisma validate          # Validate schema
npx prisma studio            # Open Prisma Studio (DB GUI)

# API Client
cd packages/client
npm run generate             # Regenerate from OpenAPI spec

# From root
pnpm --filter @visaontrack/client generate
```

---

## ⚠️ Known Issues & TODOs

### Critical TODOs (Must Address)

1. **Password Field in User Model**
   - **Issue:** User model missing `passwordHash` field
   - **Impact:** Login cannot be implemented until added
   - **Location:** `apps/api/prisma/schema.prisma`
   - **Action:** Add when implementing login (M1-BE-1)
   - **Note:** RFC-002 reset password skips password update (see TODO comment)

2. **Email Service Integration**
   - **Issue:** `email.service.ts` uses placeholder (console.log)
   - **Impact:** Password reset emails not actually sent
   - **Location:** `apps/api/src/common/services/email.service.ts`
   - **Action:** Integrate Resend/SES per spec Section 1
   - **Priority:** Medium (doesn't block testing)

3. **Rate Limiting (Production)**
   - **Issue:** Uses in-memory Map (not Redis)
   - **Impact:** Won't work in multi-instance deployment
   - **Location:** `apps/api/src/common/services/rate-limit.service.ts`
   - **Action:** Replace with Redis for production
   - **Priority:** Low (fine for development)

### Schema Considerations

- **User.passwordHash:** Not yet added (will be added with login)
- **All other models:** Complete per Section 3
- **Relations:** All properly defined with appropriate cascades

---

## 🎯 Next Tasks (Your Priority Order)

### Immediate (M1 Blockers)

1. **M1-BE-8: User Management API Endpoints**
   - **Status:** OpenAPI spec complete ✅
   - **Action:** Implement `PATCH /users/me` endpoint in NestJS
   - **Blocks:** M1-FE-4 (Account Type Selection)
   - **Location:** `apps/api/src/users/` (create directory)
   - **Files:** `users.controller.ts`, `users.service.ts`, `users.module.ts`

2. **M1-BE-1: Auth Endpoints Implementation**
   - **Status:** OpenAPI spec complete ✅
   - **Action:** Implement `POST /auth/login` endpoint
   - **Prerequisite:** Add `passwordHash` field to User model
   - **Location:** `apps/api/src/auth/` (already exists)

### Upcoming (M1-M7 Pipeline)

3. **M2-BE-*: Requests & Messaging** (M2)
   - Implement request endpoints
   - Implement message endpoints
   - Attachment upload handling

4. **M3-BE-*: Quotes & Checkout** (M3)
   - Quote submission with entitlement checks
   - Stripe Connect PaymentIntent creation

5. **M6-BE-*: Plans & Billing** (M6)
   - Stripe Billing integration
   - Entitlements engine
   - Usage counter implementation

---

## 🔍 Debugging & Troubleshooting

### Common Issues & Solutions

**Issue: OpenAPI spec changes not reflected**
- **Solution:** Always regenerate client after spec changes
  ```bash
  cd packages/client && npm run generate
  ```

**Issue: Prisma types not found**
- **Solution:** Regenerate Prisma client
  ```bash
  cd apps/api && npx prisma generate
  ```

**Issue: Endpoint not matching spec**
- **Solution:** Check OpenAPI spec first, ensure implementation matches exactly

**Issue: Entitlement check failing**
- **Solution:** Verify entitlement key matches spec (e.g., `quotes.monthly.max`)

**Issue: Token hashing errors**
- **Solution:** Always use bcrypt.hash() before storing, never store plaintext

---

## 📖 Essential Reading

### Must Read First

1. **Your Role:** `AGENT_PROMPTS.md` lines 181-231
2. **Specification:** `visaontrack-v2-spec.md`
   - Section 3: Data Model (28 models)
   - Section 4: Provider Plans & Entitlements
   - Section 5: API Endpoints
   - Section 8: Usage Counting & Quotas
   - Section 10: Payments (Stripe)
   - Section 11: Security & Compliance

3. **Workflow:** `TASK_TEMPLATES.md` - DoR/DoD checklists

### Reference When Needed

- `SCOPE_GUARDIAN.md` - Anti-scope-creep rules
- `AGENT_TEAM.md` - Team coordination
- `PROJECT_STATUS.md` - Current milestone status

---

## 🚨 Security Requirements (Never Skip)

### Critical Security Rules

1. **Token Hashing**
   - ✅ NEVER store plaintext tokens
   - ✅ Always hash with bcrypt before storing
   - ✅ Compare hashed tokens, never plaintext

2. **Audit Logging**
   - ✅ Log all password reset events
   - ✅ Log all admin mutations
   - ✅ NEVER log tokens/passwords

3. **Entitlement Enforcement**
   - ✅ Check entitlements at middleware level
   - ✅ Return structured errors (not generic 403)

4. **Rate Limiting**
   - ✅ Forgot password: 3/hour per email
   - ✅ Reset password: 5/hour per token

5. **Data Retention**
   - ✅ Auto-delete expired tokens (24h after expiry)
   - ✅ Cleanup job runs daily

---

## 💡 Code Patterns & Examples

### Standard Endpoint Pattern

```typescript
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get(':id')
  @UseGuards(AuthGuard) // JWT cookie auth
  async getResource(@Param('id') id: string): Promise<Resource> {
    // AuthZ check (row-level if needed)
    // Entitlement check (if provider action)
    return this.resourceService.findById(id);
  }
}
```

### Entitlement Check Pattern

```typescript
// In service or middleware
async checkEntitlement(providerId: string, key: string, currentUsage: number) {
  const entitlement = await prisma.entitlement.findUnique({
    where: { providerId_key: { providerId, key } },
  });
  
  const limit = entitlement?.value as number;
  if (currentUsage >= limit) {
    throw new ForbiddenException({
      code: 'ENTITLEMENT_EXCEEDED',
      entitlement: key,
      limit,
      used: currentUsage,
    });
  }
}
```

### Audit Log Pattern

```typescript
await prisma.auditLog.create({
  data: {
    actorUserId: userId,
    actorRole: 'USER',
    action: 'ACTION_NAME',
    entityType: 'EntityType',
    entityId: entityId,
    diff: { /* changes */ }, // NEVER include tokens/passwords
    ip: req.ip,
    ua: req.headers['user-agent'],
  },
});
```

---

## 🤝 Team Coordination

### When to Tag Other Agents

- **@ScopeGuardian** - When unsure if feature is in spec
- **@TechLead** - When OpenAPI contract design needed
- **@SecurityGuard** - When security requirements unclear
- **@FrontendEngineer** - When API contract changes affect frontend
- **@PM** - When blockers identified or tasks complete

### Response Patterns

- Endpoint not in spec: `"❓ ENDPOINT CHECK: Not in OpenAPI spec. RFC needed?"`
- Entitlement missing: `"⚠️ MISSING: Entitlement check required. See Section 4."`
- AuthZ missing: `"⚠️ MISSING: AuthZ check required. See Section 11."`
- Contract mismatch: `"⚠️ MISMATCH: Implementation doesn't match OpenAPI contract."`

---

## 🎓 Lessons Learned

### What Went Well

1. **Contract-first approach** - Having OpenAPI spec first made implementation smooth
2. **Schema-first** - Prisma schema defined all types, no manual type errors
3. **Security-first** - Token hashing pattern established early

### What to Watch For

1. **Password field missing** - User model needs passwordHash (noted in TODOs)
2. **Email service placeholder** - Needs actual Resend/SES integration
3. **Rate limiting** - In-memory won't scale, needs Redis

### Common Mistakes to Avoid

1. ❌ Storing plaintext tokens (use passwordResetTokenHash)
2. ❌ Implementing without OpenAPI contract
3. ❌ Skipping entitlement checks
4. ❌ Missing audit logs
5. ❌ Manual API calls instead of generated client

---

## 📊 Current Status Summary

### M0 Status: ✅ COMPLETE
- OpenAPI v0.2.1 spec - Complete
- Prisma schema - Complete
- Monorepo structure - Complete

### M1 Status: 🟡 IN PROGRESS
- RFC-002 (Forgot/Reset Password) - ✅ Implementation complete, pending reviews
- PATCH /users/me spec - ✅ Complete, backend TODO
- Auth endpoints (login) - ⏳ Pending (needs passwordHash field)

### Blocker Status: ✅ RESOLVED
- M1-FE-4 blocker (PATCH /users/me) - ✅ Resolved (spec + client regenerated)

---

## 🔄 Handoff Checklist

- [x] All completed work documented
- [x] Current state of codebase documented
- [x] Known issues and TODOs listed
- [x] Next tasks prioritized
- [x] Key patterns and examples provided
- [x] Security requirements emphasized
- [x] Team coordination guidelines provided
- [x] Common gotchas documented

---

## 🎯 Your First Tasks (Recommended Start)

1. **Read:** This transition document (you're doing it!)
2. **Read:** `AGENT_PROMPTS.md` lines 181-231 (your role definition)
3. **Review:** `packages/types/openapi.yaml` (understand the contract)
4. **Review:** `apps/api/prisma/schema.prisma` (understand the data model)
5. **Start:** Implement `PATCH /users/me` endpoint (M1-BE-8)

---

## 💪 You've Got This!

You're inheriting a well-structured foundation:
- ✅ Complete OpenAPI specification
- ✅ Complete Prisma schema
- ✅ Established patterns and security requirements
- ✅ Clear workflow and guidelines

**Remember:**
- Contract-first → Schema-first → Implementation → Entitlements → AuthZ → Tests → DoD
- Security is non-negotiable
- Scope discipline is critical
- Team coordination is essential

**Thank you for taking over. Make it even better!** 🚀

---

**Outgoing Backend Engineer**  
**Date:** 2025-01-11  
**Next Agent:** You're it! 🎯



