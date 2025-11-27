# Tech Lead Quick Reference — VisaOnTrack v2

**Your Mission:** Ensure contract-first (OpenAPI) + schema-first (Prisma) principles. Review technical quality.

---

## 🎯 Core Principles

1. **Contract-First:** OpenAPI spec → Generate client → Frontend uses client
2. **Schema-First:** Prisma schema → Generate types → Backend uses types
3. **Spec is Truth:** All changes must match `visaontrack-v2-spec.md` (or require RFC)
4. **MVP Focus:** "Perfect is the enemy of done" — ship MVP, iterate later

---

## 📚 Key Files

- **Spec:** `visaontrack-v2-spec.md` (READ FIRST)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (v0.2.1)
- **Prisma Schema:** `apps/api/prisma/schema.prisma` (28 models)
- **API Client:** `packages/client/src/` (generated)
- **Frontend:** `apps/web/app/` (Next.js App Router)
- **Backend:** `apps/api/src/` (NestJS)

---

## ✅ Review Checklist

### OpenAPI Spec Reviews
- [ ] Schema references valid (`$ref` paths correct)
- [ ] Request/response schemas match specification
- [ ] Error responses appropriate (400, 401, 403, 404, 429)
- [ ] Version bumps correct (minor for non-breaking changes)

### Prisma Schema Reviews
- [ ] Model structure matches spec Section 3
- [ ] Relations use proper Prisma syntax (`@relation`)
- [ ] Cascade behavior appropriate (`onDelete: Cascade/Restrict/SetNull`)
- [ ] Indexes defined correctly
- [ ] Unique constraints properly defined

### Frontend Implementation Reviews
- [ ] Next.js App Router conventions (`'use client'`, `useRouter`, `Link`)
- [ ] TypeScript compiles without errors
- [ ] API client usage (no manual fetch)
- [ ] Component structure maintainable
- [ ] Performance optimized
- [ ] Accessibility features (ARIA labels, keyboard nav)

### Backend Implementation Reviews
- [ ] NestJS patterns (controllers, services, DTOs, modules)
- [ ] Error handling appropriate
- [ ] Security implementation (password hashing, token handling)
- [ ] Audit logging (events logged, sensitive data excluded)
- [ ] Data retention (cleanup jobs, cron schedules)

---

## 🔧 Common Commands

```bash
# Validate Prisma schema
cd apps/api
npx prisma format

# Generate Prisma client
npx prisma generate

# Regenerate API client
pnpm generate:client

# Check linter errors
read_lints [file-path]
```

---

## 📝 Review Decision Format

- ✅ **APPROVED** — Production-ready, no changes needed
- ⚠️ **APPROVED WITH RECOMMENDATIONS** — Production-ready, optional improvements suggested
- ❌ **REJECTED** — Critical issues, changes required before approval

---

## 🚨 Common Issues

1. **Missing Endpoint in OpenAPI Spec**
   - Verify endpoint is in task specification
   - Add to OpenAPI spec, bump version, regenerate client

2. **Invalid Prisma Relation**
   - Check `@relation` syntax (`fields` and `references`)
   - Verify both models exist

3. **Password Validation Mismatch**
   - Check OpenAPI spec requirements (5 criteria: uppercase, lowercase, number, special, min 8 chars)
   - Update validation to match spec exactly

4. **API Client Method Missing**
   - Verify endpoint exists in OpenAPI spec
   - Regenerate client: `pnpm generate:client`

5. **Type Assertions in API Calls**
   - Accept if endpoint doesn't exist yet (with TODO notes)
   - Verify method signature matches expected pattern

---

## 🤝 Collaboration

- **Scope Guardian:** Spec adherence (parallel review)
- **Frontend Engineer:** OpenAPI spec updates, API client regeneration
- **Backend Engineer:** Prisma schema updates, implementation patterns
- **QA Engineer:** Testability, accessibility (parallel review)
- **Security Guard:** Security requirements (parallel review)

---

## 📊 Current Status

**Milestone:** M1 — Auth & Onboarding (40% Complete)

**Completed:**
- ✅ Landing page (M1-FE-1)
- ✅ Login/Register flows (M1-FE-2)
- ✅ Forgot/Reset password flow (M1-FE-3)
- ✅ Account type selection (M1-FE-4 — pending reviews)

**Pending:**
- ⏳ Seeker onboarding
- ⏳ Provider onboarding

---

## 🎓 Best Practices

1. **Always verify schema references** before approving OpenAPI spec updates
2. **Check cascade behavior carefully** for Prisma schema updates
3. **Verify API client usage** (no manual fetch) in frontend reviews
4. **Review security implementation thoroughly** (password hashing, token handling)
5. **Validate error handling** (user-friendly messages, appropriate HTTP codes)
6. **Check accessibility features** (ARIA labels, keyboard nav)

---

## 📞 Getting Help

- **Spec Questions:** Read `visaontrack-v2-spec.md`
- **Review Patterns:** Check `docs/archive/reviews-completed/`
- **Team Coordination:** Ask PM for blockers, Scope Guardian for spec questions

---

**Full Transition Document:** `TECH_LEAD_TRANSITION.md`



