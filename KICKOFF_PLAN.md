# VisaOnTrack v2 — Kickoff Plan

**Status:** 🚀 Ready to Start  
**Current Milestone:** M0 — Contracts & Skeletons  
**Estimated Duration:** 2–3 days

---

## 🎯 Immediate Next Steps (Priority Order)

### Phase 1: Foundation Setup (Day 1, Morning)
1. ✅ **Monorepo Structure** → Tech Lead + PM
   - Initialize pnpm workspace
   - Create directory structure per spec
   - Set up root `package.json`
   - Configure TypeScript path aliases

### Phase 2: Contracts & Schema (Day 1, Afternoon)
2. ✅ **OpenAPI v0.2 Spec** → Tech Lead + Backend Engineer
   - Create `/packages/types/openapi.yaml`
   - Define all endpoints per Section 5
   - Define request/response schemas
   - Add error schemas

3. ✅ **Prisma Schema** → Tech Lead + Backend Engineer
   - Create `/apps/api/prisma/schema.prisma`
   - Define all models per Section 3
   - Add enums, indexes, relations
   - Generate Prisma client

### Phase 3: Client Generation (Day 2, Morning)
4. ✅ **OpenAPI Client Generator** → Frontend Engineer + Tech Lead
   - Set up client generator in `/packages/client`
   - Configure generation script
   - Test generated client

### Phase 4: CI/CD Skeleton (Day 2, Afternoon)
5. ✅ **GitHub Actions Workflow** → Tech Lead
   - Create `.github/workflows/ci.yml`
   - Set up jobs: verify, contracts, build, preview
   - Add migration workflow

### Phase 5: Documentation (Day 3)
6. ✅ **Project Documentation** → PM
   - Root `README.md`
   - `CONTRIBUTING.md`
   - `docs/ARCHITECTURE.md`

---

## 🛡️ Agent Assignments for M0

| Task | Primary Agent | Supporting Agents |
|------|--------------|-------------------|
| Monorepo Setup | 🔧 Tech Lead | 📋 PM |
| OpenAPI Spec | 🔧 Tech Lead | 🚀 Backend Engineer |
| Prisma Schema | 🚀 Backend Engineer | 🔧 Tech Lead |
| Client Generation | 💻 Frontend Engineer | 🔧 Tech Lead |
| CI/CD Workflow | 🔧 Tech Lead | 🚀 Backend Engineer |
| Documentation | 📋 PM | 🔧 Tech Lead |
| **Scope Review** | 🛡️ Scope Guardian | _All agents_ |

---

## 🔍 Quality Gates (DoD for M0)

Before marking M0 complete:

- [ ] ✅ **Monorepo:** Structure matches spec Section 1, pnpm workspaces configured
- [ ] ✅ **OpenAPI:** Spec valid (passes Spectral lint), versioned v0.2.0
- [ ] ✅ **Prisma:** Schema generates without errors, all models from Section 3 present
- [ ] ✅ **Client:** Generated client is type-safe, can be imported/used
- [ ] ✅ **CI/CD:** Workflow runs successfully (at least typecheck/lint passes)
- [ ] ✅ **Docs:** README.md, CONTRIBUTING.md, ARCHITECTURE.md created
- [ ] ✅ **Scope:** All work matches spec, no features outside spec

**Scope Guardian must approve before M0 completion.**

---

## 📋 Daily Standup Format (Starting Today)

**Today's Focus:** Monorepo setup + OpenAPI spec start

1. **Scope Guardian:** No scope deviations yet (spec foundation work)
2. **PM:** M0 in progress, tracking 6 tasks
3. **Tech Lead:** Starting with monorepo structure, then OpenAPI design
4. **Backend Engineer:** Ready to start Prisma schema after OpenAPI
5. **Frontend Engineer:** Ready for client generation setup
6. **QA:** Preparing test setup for M0 completion verification

---

## 🚨 Blockers & Risks

**Current Blockers:** None  
**Current Risks:**
- ⚠️ **OpenAPI ↔ Prisma Sync:** Manual for M0 (automation post-M0)
- ⚠️ **Timeline:** 2-3 days is tight; may need buffer

---

## ✅ Definition of Ready (DoR) for M0

**Already Met:**
- ✅ User story defined (M0 goal: foundation setup)
- ✅ API contract approach defined (OpenAPI-first)
- ✅ Data model approach defined (Prisma-first)

**Pending:**
- ⏳ Wireframe/mock available (N/A for M0 — infrastructure only)
- ⏳ Error states documented (will document in OpenAPI spec)
- ⏳ Analytics events defined (deferred to M1+)

**Status:** ✅ DoR Complete (M0 is infrastructure, exceptions noted)

---

## 🎬 Action Items (Right Now)

1. **Tech Lead** → Start monorepo structure setup
   - Initialize pnpm workspace
   - Create directory tree per spec
   - Set up root `package.json`

2. **Backend Engineer** → Prepare for OpenAPI spec
   - Review Section 5 (API endpoints)
   - Review Section 3 (Data model)
   - Identify any questions/clarifications

3. **Scope Guardian** → Monitor initial setup
   - Verify monorepo structure matches spec Section 1
   - Ensure no "extra" packages/directories
   - Flag any deviations

4. **PM** → Track progress
   - Update `PROJECT_STATUS.md` as tasks complete
   - Monitor blockers
   - Report timeline risks

---

## 📞 Communication

**Tag agents:**
- `@TechLead` for architecture decisions
- `@BackendEngineer` for API/schema questions
- `@ScopeGuardian` for spec adherence questions
- `@PM` for milestone tracking

---

## 🎯 Success Criteria

M0 is complete when:
1. ✅ Monorepo structure matches spec exactly
2. ✅ OpenAPI v0.2 spec is valid and complete
3. ✅ Prisma schema matches Section 3 exactly
4. ✅ Generated client is usable
5. ✅ CI workflow runs successfully
6. ✅ Documentation is complete
7. ✅ Scope Guardian approves all work

---

**Last Updated:** Project Kickoff  
**Next Update:** After Phase 1 (Monorepo Setup) completion

