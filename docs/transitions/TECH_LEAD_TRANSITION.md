# Tech Lead Transition Document — VisaOnTrack v2

**Date:** 2025-01-11  
**Handing Off From:** Current Tech Lead  
**Handing Off To:** Successor Tech Lead  
**Purpose:** Complete technical context for seamless transition and accelerated onboarding

---

## 🎯 Executive Summary

**Project:** VisaOnTrack v2 — Two-sided marketplace (seekers ↔ providers in Thailand)  
**Current Milestone:** M1 — Auth & Onboarding (IN PROGRESS)  
**Status:** ✅ M0 Complete, M1 40% Complete, No Active Blockers  
**Architecture:** Monorepo (pnpm), Contract-First (OpenAPI), Schema-First (Prisma)

**Your Mission:** Ensure contract-first + schema-first principles. Make architecture decisions. Review technical quality.

---

## 📚 Essential Reading (Read First)

### Critical Documents
1. **`visaontrack-v2-spec.md`** — Single source of truth (READ THIS FIRST)
   - Section 1: Architecture Overview
   - Section 3: Data Model (28 models, 15 enums)
   - Section 5: API Endpoints (OpenAPI contract)
   - Section 14: CI/CD Pipeline

2. **`AGENT_TEAM.md`** — Team structure and workflows
   - Tech Lead role and responsibilities
   - Review process and quality gates

3. **`AGENT_PROMPTS.md`** (lines 86-129) — Your prompt and workflow

4. **`docs/ARCHITECTURE.md`** — Architecture overview and principles

### Review Process Documents
- **`CONTRIBUTING.md`** — DoR/DoD checklists, RFC template, PR guidelines
- **`PROJECT_STATUS.md`** — Current milestone status and task progress
- **`MILESTONE_M1.md`** — M1 task breakdown and requirements

---

## 🏗️ Architecture Overview

### Core Principles (MANDATORY)

1. **Contract-First Development**
   - Update OpenAPI spec (`packages/types/openapi.yaml`) BEFORE implementation
   - Regenerate API client: `pnpm generate:client`
   - Frontend MUST use generated client (`@visaontrack/client`)
   - NO manual fetch calls allowed

2. **Schema-First Development**
   - Update Prisma schema (`apps/api/prisma/schema.prisma`) BEFORE migrations
   - Generate Prisma client: `npx prisma generate`
   - Backend MUST use Prisma types
   - NO raw SQL unless absolutely necessary

3. **Scope Discipline**
   - ALL changes MUST match `visaontrack-v2-spec.md`
   - ANY deviation requires RFC (1-page format in `RFCs/` directory)
   - Scope Guardian reviews EVERY PR for spec adherence

### Monorepo Structure

```
/visaontrack
  /apps
    /web      (Next.js App Router + React + TypeScript)
    /api      (NestJS + PostgreSQL + Prisma)
  /packages
    /types    (OpenAPI spec: packages/types/openapi.yaml)
    /client   (Generated API client: packages/client/src/)
    /ui       (Shared UI components — not yet implemented)
  /infra      (IaC, migrations — not yet implemented)
  .github/workflows/ (CI/CD: ci.yml, migrations.yml)
```

**Key Files:**
- `packages/types/openapi.yaml` — OpenAPI 3.1.0 spec (v0.2.1)
- `apps/api/prisma/schema.prisma` — Prisma schema (28 models)
- `packages/client/src/` — Generated API client (TypeScript)

---

## 🔍 Your Review Responsibilities

### What You Review

1. **OpenAPI Spec Updates**
   - Contract compliance (matches spec Section 5)
   - Schema validation (proper types, constraints)
   - Response codes appropriate
   - Version bumps correct (semver)

2. **Prisma Schema Updates**
   - Model structure (matches spec Section 3)
   - Relations correct (no invalid relations)
   - Indexes appropriate
   - Cascade behavior correct

3. **CI/CD Workflows**
   - Workflow structure (matches spec Section 14)
   - Job configuration correct
   - Caching appropriate
   - Security (secrets handling)

4. **Frontend Implementation**
   - Next.js App Router best practices
   - TypeScript types correct
   - API client usage (no manual fetch)
   - Component structure maintainable
   - Performance optimized

5. **Backend Implementation**
   - NestJS patterns followed
   - Error handling appropriate
   - DTOs use class-validator
   - Service methods testable
   - Security implementation correct

### Review Process

**Standard Review Checklist:**
1. ✅ Technical quality (code structure, patterns, best practices)
2. ✅ Contract compliance (OpenAPI spec, Prisma schema)
3. ✅ Security (password hashing, token handling, validation)
4. ✅ Error handling (appropriate exceptions, user-friendly messages)
5. ✅ Performance (no unnecessary re-renders, efficient queries)
6. ✅ Documentation (code comments, JSDoc where needed)

**Review Decision Format:**
- ✅ **APPROVED** — Production-ready, no changes needed
- ⚠️ **APPROVED WITH RECOMMENDATIONS** — Production-ready, optional improvements suggested
- ❌ **REJECTED** — Critical issues, changes required before approval

---

## 📝 Review Patterns I've Established

### OpenAPI Spec Reviews

**Review Focus:**
- Schema references valid (`$ref` paths correct)
- Request/response schemas match task specification
- Error responses appropriate (400, 401, 403, 404, 429)
- Version bumps correct (minor for non-breaking changes)

**Common Issues Found:**
- Missing endpoint in spec (caught via Scope Guardian)
- Invalid schema references
- Missing error responses
- Incorrect version bumps

**Example Review:** `TECH_LEAD_REVIEW_PATCH_USERS_ME_OPENAPI.md`

### Prisma Schema Reviews

**Review Focus:**
- All models defined (matches spec Section 3)
- Relations use proper Prisma syntax (`@relation`)
- Cascade behavior appropriate (`onDelete: Cascade/Restrict/SetNull`)
- Indexes defined correctly
- Unique constraints properly defined

**Common Issues Found:**
- Invalid relations (e.g., `Request.orders` relation that doesn't exist)
- Missing indexes (e.g., `UsageCounter` composite index)
- Missing cascade behavior

**Example Review:** `docs/archive/reviews-completed/TECH_LEAD_REVIEW_M0_T3.md`

### Frontend Implementation Reviews

**Review Focus:**
- Next.js App Router conventions (`'use client'`, `useRouter`, `Link`)
- TypeScript compilation (no errors)
- API client usage (no manual fetch)
- Component structure maintainable
- Performance optimized
- Accessibility features (ARIA labels, keyboard nav)

**Common Issues Found:**
- Manual API calls instead of generated client
- Missing accessibility features (`role="alert"`, `aria-live`)
- Type assertions needed temporarily (acceptable with TODO notes)
- Performance optimizations (scroll handlers, re-renders)

**Example Reviews:**
- `docs/archive/reviews-completed/TECH_LEAD_REVIEW_M1_FE_LANDING_PAGE.md`
- `docs/archive/reviews-completed/TECH_LEAD_REVIEW_M1_FE_AUTH_FLOWS.md`
- `docs/archive/reviews-completed/TECH_LEAD_REVIEW_M1_FE_FORGOT_RESET_PASSWORD.md`

### Backend Implementation Reviews

**Review Focus:**
- NestJS patterns (controllers, services, DTOs, modules)
- Error handling appropriate
- Security implementation (password hashing, token handling)
- Audit logging (events logged, sensitive data excluded)
- Data retention (cleanup jobs, cron schedules)

**Common Issues Found:**
- Password validation doesn't match OpenAPI spec (fixed in RFC-002)
- Missing audit logging
- Token handling insecure (plaintext storage — fixed in RFC-002)
- Missing cleanup jobs

**Example Review:** `docs/archive/reviews-completed/TECH_LEAD_REVIEW_RFC_002_IMPLEMENTATION.md`

---

## 🔑 Key Technical Decisions Made

### OpenAPI Spec Versioning
- **Current Version:** v0.2.1
- **Versioning Strategy:** Semantic versioning (major.minor.patch)
- **Version Bumps:**
  - v0.2.0 → v0.2.1 (added forgot/reset password endpoints — RFC-002)
  - v0.2.1 → v0.2.2 (when PATCH /users/me is finalized)

### Prisma Schema Patterns
- **ID Fields:** UUID (`@default(uuid())`)
- **Money Fields:** Decimal (Prisma Decimal type)
- **JSON Fields:** `Json` type for arrays/objects
- **Enum Fields:** Prisma enums (15 enums defined)
- **Relations:** Always use `@relation` with explicit `fields` and `references`
- **Cascades:**
  - `onDelete: Cascade` — Child records deleted when parent deleted
  - `onDelete: Restrict` — Prevents deletion if child records exist
  - `onDelete: SetNull` — Sets foreign key to null (for optional relations)

### API Client Generation
- **Generator:** `openapi-typescript-codegen`
- **Output:** `packages/client/src/`
- **Usage:** `import { api } from '@visaontrack/client'`
- **Method Pattern:** `api.service.method({ requestBody: {...} })`
- **Regeneration:** Run `pnpm generate:client` after OpenAPI spec changes

### Frontend Patterns
- **Client Components:** Use `'use client'` directive for interactive features
- **Routing:** Next.js `Link` component for internal navigation
- **API Calls:** Always use generated client (no manual fetch)
- **Validation:** Client-side validation with real-time feedback
- **Accessibility:** Always include ARIA labels, `role="alert"` for errors, `aria-live="polite"` for dynamic content

### Backend Patterns
- **Error Handling:** Use NestJS exceptions (`BadRequestException`, `UnauthorizedException`, etc.)
- **Password Hashing:** bcrypt with salt rounds 10
- **Token Hashing:** bcrypt for password reset tokens (never store plaintext)
- **Audit Logging:** All sensitive operations logged (PASSWORD_RESET_REQUEST, PASSWORD_RESET_COMPLETE, etc.)
- **Cron Jobs:** Use `@nestjs/schedule` with `@Cron` decorator

---

## 🛠️ Common Tasks & How-To

### Review OpenAPI Spec Update

**Task:** Review new endpoint or schema addition

**Steps:**
1. Read the task document (e.g., `COORDINATION_TECH_LEAD_REVIEW_*.md`)
2. Read the OpenAPI spec changes (`packages/types/openapi.yaml`)
3. Verify:
   - Endpoint definition correct (method, path, operation ID)
   - Request/response schemas match specification
   - Error responses appropriate
   - Schema references valid
   - Version bump correct (if needed)
4. Create review document: `TECH_LEAD_REVIEW_*.md`
5. Provide decision: ✅ APPROVED / ⚠️ APPROVED WITH CHANGES / ❌ REJECTED

**Example:** `TECH_LEAD_REVIEW_PATCH_USERS_ME_OPENAPI.md`

### Review Prisma Schema Update

**Task:** Review new model or field addition

**Steps:**
1. Read the task document
2. Read Prisma schema changes (`apps/api/prisma/schema.prisma`)
3. Verify:
   - Model structure matches spec Section 3
   - Relations correct (proper `@relation` syntax)
   - Indexes defined correctly
   - Cascade behavior appropriate
4. Run validation: `npx prisma format` (validates syntax)
5. Create review document
6. Provide decision

**Example:** `docs/archive/reviews-completed/TECH_LEAD_REVIEW_M0_T3.md`

### Review Frontend Implementation

**Task:** Review page/component implementation

**Steps:**
1. Read the task document
2. Read implementation files (e.g., `apps/web/app/**/page.tsx`)
3. Verify:
   - Next.js App Router conventions
   - TypeScript compiles without errors
   - API client usage correct
   - Component structure maintainable
   - Performance optimized
   - Accessibility features present
4. Check linter errors: `read_lints` tool
5. Create review document
6. Provide decision with specific feedback

**Example:** `docs/archive/reviews-completed/TECH_LEAD_REVIEW_M1_FE_LANDING_PAGE.md`

### Review Backend Implementation

**Task:** Review API endpoint or service implementation

**Steps:**
1. Read the task document
2. Read implementation files (e.g., `apps/api/src/**/*.ts`)
3. Verify:
   - NestJS patterns followed
   - Error handling appropriate
   - Security implementation correct
   - Audit logging implemented
   - DTOs use class-validator
4. Check linter errors
5. Create review document
6. Provide decision with specific feedback

**Example:** `docs/archive/reviews-completed/TECH_LEAD_REVIEW_RFC_002_IMPLEMENTATION.md`

---

## ⚠️ Common Issues & Solutions

### Issue #1: Missing Endpoint in OpenAPI Spec

**Symptom:** Frontend Engineer reports missing endpoint

**Solution:**
1. Verify endpoint is in task specification
2. If in spec, add to OpenAPI spec (`packages/types/openapi.yaml`)
3. Bump version if needed (minor for non-breaking changes)
4. Regenerate API client: `pnpm generate:client`
5. Route to Scope Guardian for spec adherence review

**Example:** Missing `POST /messages/attachments` endpoint (caught by Scope Guardian)

### Issue #2: Invalid Prisma Relation

**Symptom:** `npx prisma format` fails with relation error

**Solution:**
1. Check relation syntax (`@relation` with `fields` and `references`)
2. Verify both models exist
3. Check for invalid relations (e.g., `Request.orders` when Order relates to Quote)
4. Fix relation and re-run validation

**Example:** Invalid `Request.orders` relation (fixed in M0 Task 3 review)

### Issue #3: Password Validation Mismatch

**Symptom:** Frontend validation doesn't match OpenAPI spec requirements

**Solution:**
1. Check OpenAPI spec password requirements
2. Update validation function to match spec exactly
3. Ensure all criteria checked (uppercase, lowercase, number, special character)
4. Update error messages to reflect requirements

**Example:** RFC-002 password validation updated to match OpenAPI spec (all 5 criteria)

### Issue #4: API Client Method Missing

**Symptom:** Frontend reports `api.auth.forgotPassword()` doesn't exist

**Solution:**
1. Verify endpoint exists in OpenAPI spec
2. Regenerate API client: `pnpm generate:client`
3. Verify method exists in `packages/client/src/services/`
4. If still missing, check OpenAPI spec syntax (operation ID, tags, etc.)

**Example:** `forgotPassword` and `resetPassword` methods needed regeneration (RFC-002)

### Issue #5: Type Assertions in API Calls

**Symptom:** Frontend uses `(api.auth as any).methodName()`

**Solution:**
1. Verify endpoint exists in OpenAPI spec
2. Regenerate API client
3. If still needed, note as temporary limitation
4. Verify method signature matches expected pattern
5. Document as "known limitation" in review

**Example:** RFC-002 forgot/reset password methods (acceptable temporary pattern)

---

## 🎓 Best Practices I've Learned

### 1. Always Verify Schema References

**Before approving OpenAPI spec updates:**
- Check all `$ref` paths are valid
- Verify referenced schemas exist
- Test schema structure with OpenAPI validator (if available)

**Why:** Invalid references break code generation and cause runtime errors

### 2. Check Cascade Behavior Carefully

**Before approving Prisma schema updates:**
- Review `onDelete` behavior for all relations
- Ensure cascade behavior makes business sense
- Test cascade behavior with sample data (if possible)

**Why:** Incorrect cascade behavior can cause data loss or constraint violations

### 3. Verify API Client Usage

**Before approving frontend implementations:**
- Check all API calls use generated client
- Verify method signatures match expected pattern
- Accept type assertions only if endpoint doesn't exist yet (with TODO notes)

**Why:** Manual fetch calls bypass contract-first principle and type safety

### 4. Review Security Implementation Thoroughly

**Before approving security-critical features:**
- Verify password hashing uses bcrypt/argon2
- Check token hashing (never store plaintext)
- Verify audit logging (sensitive data excluded)
- Check rate limiting implementation

**Why:** Security vulnerabilities can have severe consequences

### 5. Validate Error Handling

**Before approving implementations:**
- Check error messages are user-friendly
- Verify appropriate HTTP status codes
- Ensure error responses match OpenAPI spec
- Check error handling for edge cases

**Why:** Poor error handling leads to bad UX and security issues

### 6. Check Accessibility Features

**Before approving frontend implementations:**
- Verify ARIA labels present
- Check keyboard navigation support
- Ensure screen reader friendly
- Use `role="alert"` for error messages
- Use `aria-live="polite"` for dynamic content

**Why:** Accessibility is non-negotiable (WCAG AA minimum)

---

## 📊 Current Project Status

### Milestones

**✅ M0 — Contracts & Skeletons (COMPLETE)**
- Monorepo structure ✅
- OpenAPI v0.2 specification ✅
- Prisma schema (28 models) ✅
- OpenAPI client generation ✅
- CI/CD workflow skeleton ✅
- Project documentation ✅

**📋 M1 — Auth & Onboarding (IN PROGRESS — 40% Complete)**
- Landing page ✅ (all reviews approved)
- Login/Register flows ✅ (all reviews approved)
- Forgot/Reset password flow ✅ (all reviews approved)
- Account type selection ✅ (implementation complete, reviews pending)
- Seeker onboarding ⏳ (pending)
- Provider onboarding ⏳ (pending)

### OpenAPI Spec Status

**Current Version:** v0.2.1

**Endpoints Implemented:**
- ✅ Auth: `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- ✅ Users: `GET /users/me`, `PATCH /users/me` (spec added, backend pending)
- ⏳ Providers: `GET /providers`, `POST /providers`, etc. (pending)
- ⏳ Requests, Messages, Quotes, Orders, etc. (pending)

**Schema Status:**
- ✅ User schemas (User, UserRole, LoginRequest, etc.)
- ✅ Forgot/Reset password schemas (RFC-002)
- ✅ UpdateUserRequest schema (PATCH /users/me)
- ⏳ Other schemas pending implementation

### Prisma Schema Status

**Current Status:** Complete (28 models, 15 enums)

**Models:**
- ✅ Core models (11): User, ProviderProfile, ServicePackage, Request, Message, Quote, Order, Milestone, Review, Attachment, Notification
- ✅ Billing models (5): BillingCustomer, Subscription, Entitlement, UsageCounter, Invoice
- ✅ Admin models (12): AdminUser, VerificationCase, DisputeCase, Payout, Refund, FeatureFlag, FeeSchedule, Banner, EmailTemplate, AuditLog, InternalNote, Report

**Key Fields:**
- User model includes `passwordResetTokenHash` and `passwordResetTokenExpiry` (RFC-002)
- All relations validated and correct
- Indexes defined correctly

---

## 🔄 Review History & Patterns

### Completed Reviews

**M0 Reviews:**
1. ✅ Prisma Schema (M0 Task 3) — Approved with minor fix (invalid relation)
2. ✅ OpenAPI Client Generation (M0 Task 4) — Approved with minor fixes
3. ✅ CI/CD Workflow (M0 Task 5) — Approved
4. ✅ Project Documentation (M0 Task 6) — Approved with minor notes

**RFC-002 Reviews:**
1. ✅ API Contract Design — Approved
2. ✅ Mockups — Approved with minor note (language support)
3. ✅ API Implementation — Approved with password validation fix

**M1 Frontend Reviews:**
1. ✅ Landing Page (M1-FE-1) — Approved with recommendations
2. ✅ Login/Register Flows (M1-FE-2) — Approved with recommendations
3. ✅ Forgot/Reset Password Flow (M1-FE-3) — Approved with recommendations

**OpenAPI Spec Reviews:**
1. ✅ PATCH /users/me Endpoint — Approved

**Review Documents Location:**
- Active reviews: Root directory (`TECH_LEAD_REVIEW_*.md`)
- Completed reviews: `docs/archive/reviews-completed/TECH_LEAD_REVIEW_*.md`

### Review Patterns

**Consistent Structure:**
1. Executive Summary (decision + brief overview)
2. Detailed Feedback (technical quality, contract compliance, etc.)
3. Required Changes (if any)
4. Recommendations (optional improvements)
5. Final Decision (APPROVED/APPROVED WITH CHANGES/REJECTED)

**Scoring System:**
- I use quality scores (e.g., 10/10) for clarity
- Focus on actionable feedback
- Distinguish between required changes and optional recommendations

---

## 🚨 Known Issues & Pending Work

### High Priority Issues

1. **Register API Endpoint Missing** (Expected)
   - `/auth/register` endpoint not in OpenAPI spec v0.2.1
   - Frontend has commented API calls (expected)
   - Action: Backend Engineer needs to add endpoint (M1-BE-7)
   - Impact: Blocks register page API integration

2. **Password Hash Field Missing** (Expected)
   - User model doesn't have `passwordHash` field yet
   - Password reset implementation has TODO comment
   - Action: Add field when implementing login functionality
   - Impact: Low (expected during M1 implementation)

### Medium Priority Issues

3. **Email Service Integration** (Pending)
   - Email service is placeholder (console.log)
   - Needs Resend/SES integration per spec Section 1
   - Action: Backend Engineer to implement
   - Impact: Medium (forgot/reset password emails won't send)

4. **Rate Limiting Redis** (Pending)
   - Rate limiting uses in-memory cache
   - Needs Redis for production (multi-instance deployments)
   - Action: Backend Engineer to implement
   - Impact: Low for single-instance, high for multi-instance

### Low Priority Issues

5. **Typed Routes Disabled** (Temporary)
   - Route types not configured
   - Functionality works correctly
   - Action: Re-enable when route types configured
   - Impact: Low (type safety enhancement)

6. **Validation Function Extraction** (Future Enhancement)
   - Validation functions duplicated across files
   - Can be extracted to shared utilities
   - Action: Future refactoring
   - Impact: Low (code organization improvement)

---

## 📁 Important Files & Locations

### Core Specification Files

- **`visaontrack-v2-spec.md`** — Single source of truth
- **`packages/types/openapi.yaml`** — OpenAPI 3.1.0 specification (v0.2.1)
- **`apps/api/prisma/schema.prisma`** — Prisma schema (28 models, 15 enums)

### Project Management Files

- **`PROJECT_STATUS.md`** — Current milestone status
- **`MILESTONE_M0.md`** — M0 task breakdown
- **`MILESTONE_M1.md`** — M1 task breakdown
- **`CONTRIBUTING.md`** — DoR/DoD checklists, RFC template

### Team Structure Files

- **`AGENT_TEAM.md`** — Team roles and responsibilities
- **`AGENT_PROMPTS.md`** — Agent prompts (your prompt: lines 86-129)
- **`SCOPE_GUARDIAN.md`** — Scope Guardian role and process

### Review Documents

- **Active reviews:** Root directory (`TECH_LEAD_REVIEW_*.md`)
- **Completed reviews:** `docs/archive/reviews-completed/TECH_LEAD_REVIEW_*.md`
- **Approvals:** `docs/approvals/PM_FINAL_APPROVAL_*.md`

### RFC Documents

- **`RFCs/`** directory — RFC proposals and decisions
- **`RFCs/RFC-002-forgot-reset-password.md`** — Forgot/reset password RFC (APPROVED)

### Implementation Files

**Frontend:**
- `apps/web/app/page.tsx` — Landing page
- `apps/web/app/auth/login/page.tsx` — Login page
- `apps/web/app/auth/register/page.tsx` — Register page (full)
- `apps/web/app/auth/register/simple/page.tsx` — Register page (simple)
- `apps/web/app/auth/forgot-password/page.tsx` — Forgot password page
- `apps/web/app/auth/reset-password/page.tsx` — Reset password page
- `apps/web/app/onboarding/account-type/page.tsx` — Account type selection

**Backend:**
- `apps/api/src/auth/auth.controller.ts` — Auth endpoints
- `apps/api/src/auth/auth.service.ts` — Auth business logic
- `apps/api/src/auth/dto/*.dto.ts` — Auth DTOs
- `apps/api/src/common/services/email.service.ts` — Email service (placeholder)
- `apps/api/src/common/services/audit-log.service.ts` — Audit logging
- `apps/api/src/common/services/rate-limit.service.ts` — Rate limiting
- `apps/api/src/config/cron-jobs.ts` — Cron jobs

---

## 🤝 Collaboration Patterns

### Working with Scope Guardian

**Their Role:** Enforce spec adherence, prevent scope creep

**Your Collaboration:**
- They review spec adherence (you review technical quality)
- Can work in parallel (don't block each other)
- If they catch missing endpoint, add it to spec
- If they catch scope creep, require RFC

**Example:** Missing `POST /messages/attachments` endpoint (Scope Guardian caught, you added)

### Working with Frontend Engineer

**Their Needs:**
- OpenAPI spec complete for their endpoints
- API client regenerated after spec changes
- Clear review feedback on implementation quality

**Your Support:**
- Review OpenAPI spec updates promptly (blocks them if pending)
- Verify API client generation works
- Provide specific, actionable feedback in reviews

### Working with Backend Engineer

**Their Needs:**
- Prisma schema validated before migrations
- OpenAPI spec updates reviewed
- Clear feedback on implementation patterns

**Your Support:**
- Review Prisma schema updates promptly
- Review OpenAPI spec updates promptly
- Provide guidance on NestJS patterns

### Working with QA Engineer

**Their Role:** Test coverage, accessibility, responsiveness

**Your Collaboration:**
- You review technical quality (they review testability, accessibility)
- Can work in parallel
- They catch accessibility issues, you verify fixes in re-review

### Working with Security Guard

**Their Role:** Security requirements, compliance

**Your Collaboration:**
- You review technical implementation (they review security requirements)
- Can work in parallel
- They catch security issues, you verify fixes in re-review

---

## 🎯 Immediate Next Steps (For You)

### Week 1: Onboarding

1. **Read Essential Documents** (Day 1)
   - ✅ `visaontrack-v2-spec.md` (especially Sections 1, 3, 5, 14)
   - ✅ `AGENT_TEAM.md` and `AGENT_PROMPTS.md` (your role)
   - ✅ `docs/ARCHITECTURE.md`
   - ✅ `PROJECT_STATUS.md`

2. **Review Recent Work** (Day 2)
   - Read completed review documents in `docs/archive/reviews-completed/`
   - Understand review patterns and decision criteria
   - Review current implementations (M1 frontend pages)

3. **Familiarize with Codebase** (Day 3)
   - Explore monorepo structure
   - Review OpenAPI spec (`packages/types/openapi.yaml`)
   - Review Prisma schema (`apps/api/prisma/schema.prisma`)
   - Review CI/CD workflows (`.github/workflows/`)

### Week 2: Active Participation

1. **Start Reviewing Pending Items**
   - Review M1-FE-4 (Account Type Selection) if not yet reviewed
   - Review any pending OpenAPI spec updates
   - Review any pending Prisma schema updates

2. **Establish Your Patterns**
   - Continue using established review structure
   - Provide clear, actionable feedback
   - Distinguish required changes from recommendations

3. **Build Relationships**
   - Coordinate with Scope Guardian on spec adherence
   - Support Frontend/Backend Engineers with technical guidance
   - Collaborate with QA/Security on quality gates

---

## 💡 Tips for Success

### 1. Always Verify First Principles

**Before making any decision:**
- Check `visaontrack-v2-spec.md` — is it in the spec?
- Check OpenAPI spec — is the contract correct?
- Check Prisma schema — is the data model correct?

**Why:** Spec is truth. If it's not in spec, require RFC.

### 2. Balance Perfectionism with Pragmatism

**Approach:**
- Critical issues: Require fixes before approval
- Minor issues: Approve with recommendations (low priority)
- Optional improvements: Document as recommendations, don't block progress

**Why:** "Perfect is the enemy of done" — ship MVP, iterate later.

### 3. Provide Specific, Actionable Feedback

**Good feedback:**
- "Password validation only checks letter + number, missing uppercase, lowercase, special character. Update `validatePasswordStrength` to check all 5 criteria."
- "API client method uses type assertion. Verify endpoint exists in spec, regenerate client."

**Bad feedback:**
- "Code quality could be better."
- "There are some issues."

**Why:** Specific feedback enables quick fixes and learning.

### 4. Learn from Previous Reviews

**Review completed reviews:**
- Understand patterns that worked
- Learn from issues that were caught
- See how similar problems were solved

**Why:** Consistency helps the team understand your expectations.

### 5. Coordinate, Don't Block

**Workflow:**
- Reviews can happen in parallel (Tech Lead + QA + Security + Scope Guardian)
- Don't wait for other reviews to complete
- Communicate clearly when your review blocks others

**Why:** Parallel reviews accelerate delivery while maintaining quality.

### 6. Document Your Decisions

**Review Documents:**
- Create comprehensive review documents
- Explain your reasoning
- Provide clear decisions (APPROVED/APPROVED WITH CHANGES/REJECTED)

**Why:** Documentation helps the team learn and maintains accountability.

---

## 🚀 Opportunities for Improvement

### Technical Improvements

1. **Extract Shared Validation Functions**
   - Create `apps/web/lib/validation.ts` for shared validation functions
   - Reduces code duplication across pages
   - Priority: Low (can be done in future refactoring)

2. **Add TypeScript Strict Mode**
   - Enable strict mode in `tsconfig.json`
   - Improves type safety
   - Priority: Low (should be done gradually)

3. **Implement Shared UI Components**
   - Extract common components to `packages/ui`
   - Reduces duplication, improves consistency
   - Priority: Medium (benefits increase with more pages)

### Process Improvements

1. **Automated OpenAPI Validation**
   - Add Spectral or similar tool to CI/CD
   - Validates OpenAPI spec syntax automatically
   - Priority: Medium (catches errors early)

2. **Automated Prisma Schema Validation**
   - Add Prisma format check to CI/CD
   - Validates schema syntax automatically
   - Priority: Medium (catches errors early)

3. **Review Templates**
   - Create review template for consistency
   - Speeds up review process
   - Priority: Low (nice to have)

---

## ❓ Questions to Consider

### Open Questions

1. **shadcn/ui Component Adoption**
   - When should we adopt shadcn/ui components?
   - Currently acceptable to use custom components for MVP
   - Recommendation: Adopt incrementally as pages grow

2. **Shared Validation Library**
   - When to extract validation functions to shared library?
   - Currently acceptable to duplicate for MVP
   - Recommendation: Extract when pattern repeats 3+ times

3. **TypeScript Strict Mode**
   - When to enable strict mode?
   - Currently not enabled (easier migration path)
   - Recommendation: Enable gradually, file by file

4. **API Client Regeneration Automation**
   - Should regeneration be automatic on spec changes?
   - Currently manual (`pnpm generate:client`)
   - Recommendation: Add to CI/CD (verify generated client matches spec)

---

## 📞 Getting Help

### When You're Stuck

1. **Read the Spec** — `visaontrack-v2-spec.md` usually has the answer
2. **Check Previous Reviews** — See how similar issues were handled
3. **Coordinate with Team** — Ask Scope Guardian for spec questions, PM for blockers
4. **Review Code Examples** — Check existing implementations for patterns

### Key Contacts

- **Scope Guardian:** Spec adherence, RFC process
- **PM:** Task assignments, blockers, coordination
- **Frontend Engineer:** Frontend implementation questions
- **Backend Engineer:** Backend implementation questions
- **QA Engineer:** Testing questions, accessibility
- **Security Guard:** Security requirements, compliance

---

## 🎓 Knowledge Transfer Checklist

### Essential Knowledge

- [x] Understand contract-first development principle
- [x] Understand schema-first development principle
- [x] Know review process and quality gates
- [x] Familiar with OpenAPI 3.1.0 spec structure
- [x] Familiar with Prisma schema patterns
- [x] Understand Next.js App Router conventions
- [x] Understand NestJS patterns
- [x] Know security requirements (password hashing, token handling)
- [x] Know accessibility requirements (WCAG AA)

### Key Files Location

- [x] Know where OpenAPI spec is (`packages/types/openapi.yaml`)
- [x] Know where Prisma schema is (`apps/api/prisma/schema.prisma`)
- [x] Know where API client is generated (`packages/client/src/`)
- [x] Know where frontend pages are (`apps/web/app/`)
- [x] Know where backend code is (`apps/api/src/`)
- [x] Know where review documents are (root and `docs/archive/reviews-completed/`)
- [x] Know where RFCs are (`RFCs/`)

### Review Patterns

- [x] Understand review document structure
- [x] Know how to provide approval decisions
- [x] Know how to distinguish required vs. optional changes
- [x] Understand scoring system (10/10 quality scores)

---

## 🏆 What Went Well

### Successful Patterns

1. **Comprehensive Review Documents**
   - Detailed feedback helps engineers understand issues
   - Scoring system provides clear quality metrics
   - Distinction between required changes and recommendations

2. **Contract-First Approach**
   - OpenAPI spec updates before implementation
   - Prevents integration issues
   - Ensures type safety

3. **Schema-First Approach**
   - Prisma schema updates before migrations
   - Prevents data model issues
   - Ensures consistency

4. **Security-First Thinking**
   - Always verify security implementation
   - Catch issues early (password hashing, token handling)
   - Prevents vulnerabilities

---

## 🎯 Your Success Metrics

### Quality Metrics

- **Review Quality:** Clear, actionable feedback
- **Decision Speed:** Quick turnaround (same day when possible)
- **Issue Detection:** Catch technical issues before they cause problems
- **Team Support:** Help engineers understand patterns and best practices

### Technical Metrics

- **Contract Compliance:** 100% API calls use generated client
- **Schema Compliance:** 100% implementations match Prisma schema
- **Security Compliance:** 100% security requirements met
- **Code Quality:** Consistent patterns, maintainable code

---

## 🙏 Final Notes

**Thank you for taking on this role!**

The Tech Lead role is critical for maintaining technical quality and architecture consistency. Your reviews directly impact the quality of the final product.

**Remember:**
- **Spec is Truth** — Always verify against `visaontrack-v2-spec.md`
- **Contract-First** — OpenAPI spec before implementation
- **Schema-First** — Prisma schema before migrations
- **Balance** — Perfectionism with pragmatism (MVP focus)
- **Communication** — Specific, actionable feedback

**You have everything you need to succeed. Good luck!**

---

**Transition Completed By:** Current Tech Lead  
**Date:** 2025-01-11  
**Status:** ✅ Transition complete — Successor ready to begin

**Next Steps for Successor:**
1. Read this document fully
2. Read essential documents listed above
3. Review completed reviews to understand patterns
4. Start reviewing pending items
5. Build relationships with team members

---

**Questions?** Review this document, previous reviews, or coordinate with PM/Scope Guardian.

**Welcome aboard! 🚀**



