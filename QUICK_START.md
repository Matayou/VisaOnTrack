# VisaOnTrack v2 — Quick Start Guide

**For:** Tech Lead, Backend Engineer, Frontend Engineer  
**Status:** Ready to begin M0 work

---

## 🚀 Starting Right Now

### Step 1: Monorepo Structure (Tech Lead)
```bash
# Initialize pnpm workspace
pnpm init

# Create directory structure
mkdir -p apps/web apps/api packages/types packages/client packages/ui infra .github/workflows

# Set up root package.json with workspaces
```

**Reference:** `MILESTONE_M0.md` Section 1  
**Check against:** `visaontrack-v2-spec.md` Section 1 (Repo layout)

---

### Step 2: OpenAPI Spec (Tech Lead + Backend Engineer)
```bash
# Create OpenAPI spec
touch packages/types/openapi.yaml

# Define endpoints per Section 5:
# - Auth endpoints
# - Provider endpoints
# - Request endpoints
# - Message endpoints
# - Quote endpoints
# - Order endpoints
# - Billing endpoints
# - Admin endpoints (placeholders)
```

**Reference:** `visaontrack-v2-spec.md` Section 5 (API endpoints)  
**Version:** `v0.2.0` (semver)

---

### Step 3: Prisma Schema (Backend Engineer)
```bash
# Create Prisma schema
mkdir -p apps/api/prisma
touch apps/api/prisma/schema.prisma

# Define models per Section 3:
# - Core models (User, ProviderProfile, etc.)
# - Billing models (BillingCustomer, Subscription, etc.)
# - Admin models (AdminUser, VerificationCase, etc.)
```

**Reference:** `visaontrack-v2-spec.md` Section 3 (Data Model)  
**Generate client:** `npx prisma generate`

---

### Step 4: Client Generation (Frontend Engineer)
```bash
# Set up client generator in packages/client
cd packages/client
pnpm init

# Install generator (e.g., openapi-typescript-codegen)
pnpm add -D openapi-typescript-codegen

# Configure generation script in package.json
```

**Reference:** `MILESTONE_M0.md` Section 4

---

### Step 5: CI/CD Workflow (Tech Lead)
```bash
# Create GitHub Actions workflow
touch .github/workflows/ci.yml

# Define jobs:
# 1. Verify (typecheck, lint, test)
# 2. Contracts (OpenAPI lint, client generation check)
# 3. Build (FE, BE)
# 4. Preview (deploy to preview environments)
```

**Reference:** `visaontrack-v2-spec.md` Section 14 (CI/CD Pipeline)

---

## 🛡️ Scope Guardian Checklist

Before starting any task:

- [ ] ✅ Task is in `MILESTONE_M0.md`
- [ ] ✅ Implementation matches `visaontrack-v2-spec.md`
- [ ] ✅ No "extra" features beyond spec
- [ ] ✅ RFC created if proposing changes beyond spec

**If uncertain:** Tag `@ScopeGuardian` before proceeding.

---

## 📋 DoR/DoD Reminders

### Before Starting Work:
- ✅ DoR checklist complete? (see `TASK_TEMPLATES.md`)
- ✅ Spec section reviewed?
- ✅ Questions/clarifications identified?

### Before Marking Complete:
- ✅ DoD checklist complete? (see `TASK_TEMPLATES.md`)
- ✅ Tests passing?
- ✅ Documentation updated?
- ✅ Scope Guardian approval?

---

## 🔗 Key Files

- **Spec:** `visaontrack-v2-spec.md` (single source of truth)
- **Milestone:** `MILESTONE_M0.md` (task breakdown)
- **Status:** `PROJECT_STATUS.md` (progress tracking)
- **Templates:** `TASK_TEMPLATES.md` (DoR/DoD/RFC)
- **Scope Guardian:** `SCOPE_GUARDIAN.md` (anti-creep playbook)

---

## 💬 Tag Agents

- `@TechLead` — Architecture decisions
- `@BackendEngineer` — API/schema questions
- `@FrontendEngineer` — Client generation questions
- `@ScopeGuardian` — Spec adherence questions
- `@PM` — Milestone tracking

---

**Ready to start! Begin with Step 1 (Monorepo Structure).**

