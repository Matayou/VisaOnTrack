# PM Notification — Root Folder Organization

**To:** Project Manager  
**From:** Scope Guardian  
**Date:** 2025-01-11  
**Priority:** MEDIUM  
**Status:** ⏳ AWAITING PM APPROVAL

---

## Situation

**Issue:** Root folder has 80+ markdown files, many of which are ephemeral review/coordination documents. This is causing clutter and makes it difficult to find important documentation.

**Current State:**
- Root folder contains: Core docs, Task docs, Review docs, Coordination docs, RFC-related docs, Completed/ephemeral docs
- Some files are no longer actively referenced
- Difficult to distinguish between active work and completed/archived work

**Impact:**
- ⚠️ **Medium** — Organization and maintainability issue
- ⚠️ **Low** — No functional impact, but slows down navigation

---

## Proposed Solution

### Directory Structure

**Keep in Root (Core/Reference Documents):**
- `README.md`, `CONTRIBUTING.md`, `visaontrack-v2-spec.md`
- `MILESTONE_M0.md`, `MILESTONE_M1.md`
- `PROJECT_STATUS.md`
- `AGENT_PROMPTS.md`, `AGENT_TEAM.md`
- `KICKSTART_PLAN.md`, `QUICK_START.md`
- `GIT_COMMIT_STRATEGY.md`, `TASK_TEMPLATES.md`

**Organize into Folders:**

1. **`docs/tasks/`** — All task documents
   - `TASK_M0_*.md` files
   - `TASK_M1_*.md` files
   - `TASK_RFC_002_*.md` files
   - `TASK_*.md` files

2. **`docs/work/`** — Active work/coordination
   - `docs/work/coordination/` — All `COORDINATION_*.md` files
   - `docs/work/reviews/` — Review documents (organized by milestone/task)
   - `docs/work/blockers/` — Blocker documents (`BLOCKER_*.md`)

3. **`docs/archive/`** — Completed/ephemeral documents
   - `docs/archive/reviews-completed/` — Old review documents
   - `docs/archive/coordination-completed/` — Old coordination documents
   - `docs/archive/incidents/` — Incident reports (`*_INCIDENT_*.md`)

4. **`RFCs/`** — RFC-related work (already exists, consolidate)
   - Move `RFC_002_*.md` files from root to `RFCs/` folder
   - Keep `RFCs/RFC-001-*.md`, `RFCs/RFC-002-*.md` structure

5. **`docs/completion/`** — Completion/completion status documents
   - `*_COMPLETION_*.md` files
   - `*_COMPLETION_SUMMARY.md` files
   - `*_IMPLEMENTATION_STATUS.md` files

6. **`docs/approvals/`** — PM final approval documents
   - `PM_FINAL_APPROVAL_*.md` files

---

## File Categorization

### Core/Reference (Stay in Root — 11 files)
- `README.md`
- `CONTRIBUTING.md`
- `visaontrack-v2-spec.md`
- `MILESTONE_M0.md`
- `MILESTONE_M1.md`
- `PROJECT_STATUS.md`
- `AGENT_PROMPTS.md`
- `AGENT_TEAM.md`
- `KICKOFF_PLAN.md`
- `QUICK_START.md`
- `GIT_COMMIT_STRATEGY.md`
- `TASK_TEMPLATES.md`

### Tasks (Move to `docs/tasks/` — ~15 files)
- `TASK_M0_*.md`
- `TASK_M1_*.md`
- `TASK_RFC_002_*.md`
- `TASK_*.md`

### Coordination (Move to `docs/work/coordination/` — ~20 files)
- `COORDINATION_*.md` files

### Reviews (Move to `docs/work/reviews/` — ~25 files)
- `TECH_LEAD_REVIEW_*.md`
- `SCOPE_GUARDIAN_REVIEW_*.md`
- `QA_ENGINEER_REVIEW_*.md`
- `SECURITY_GUARD_REVIEW_*.md`
- `FRONTEND_ENGINEER_REVIEW_*.md`
- `M1_FE_2_REVIEW_REPORT.md`

### Blockers (Move to `docs/work/blockers/` — ~2 files)
- `BLOCKER_*.md`

### RFC Work (Move to `RFCs/` — ~6 files)
- `RFC_002_*.md` (not `RFCs/RFC-002-*.md` which already exists)

### Completion (Move to `docs/completion/` — ~5 files)
- `*_COMPLETION_*.md`
- `*_COMPLETION_SUMMARY.md`
- `*_IMPLEMENTATION_STATUS.md`
- `*_IMPLEMENTATION_PLAN.md`

### Approvals (Move to `docs/approvals/` — ~5 files)
- `PM_FINAL_APPROVAL_*.md`

### Incidents (Move to `docs/archive/incidents/` — ~3 files)
- `*_INCIDENT_*.md`
- `PM_INCIDENT_RESPONSE_*.md`

### Mockup Reviews (Move to `docs/archive/` — ~3 files)
- `MOCKUP_REVIEW_*.md`

---

## Implementation Plan

1. **Create directory structure** (if not exists):
   - `docs/tasks/`
   - `docs/work/coordination/`
   - `docs/work/reviews/`
   - `docs/work/blockers/`
   - `docs/archive/reviews-completed/`
   - `docs/archive/coordination-completed/`
   - `docs/archive/incidents/`
   - `docs/completion/`
   - `docs/approvals/`

2. **Move files** to appropriate directories

3. **Create README.md** in each new directory explaining organization

4. **Update references** (if any broken links found):
   - Check for cross-file references
   - Update broken links after move

5. **Verify** no critical files were moved incorrectly

---

## Questions for PM

1. **Archive timing:** Should completed reviews be moved to `docs/archive/` immediately, or kept in `docs/work/reviews/` until milestone is complete?

2. **Reference updates:** If files reference each other (e.g., coordination docs referencing task docs), should we:
   - Update all references automatically?
   - Document moved files and update references incrementally?

3. **Scope of work:** Should we:
   - Move all files at once?
   - Move in phases (e.g., archive old files first, then organize active work)?

4. **Backup/revert:** Should we:
   - Create a backup of current structure?
   - Document moves for easy revert if needed?

---

## Benefits

✅ **Improved organization:** Clear separation between core docs, active work, and archives  
✅ **Better navigation:** Easier to find relevant documents  
✅ **Reduced clutter:** Root folder only contains essential reference documents  
✅ **Scalability:** Structure can accommodate future milestones/work  
✅ **Maintainability:** Clear organization makes project easier to maintain

---

## Risks

⚠️ **Broken references:** Some files may reference moved files by path  
   - **Mitigation:** Check for references and update if found  
   - **Mitigation:** Document all moves for reference

⚠️ **Learning curve:** Team needs to know new structure  
   - **Mitigation:** README files in each directory  
   - **Mitigation:** Update `PROJECT_STATUS.md` if needed

---

## Approval Request

**Decision Required:**
- [ ] ✅ **APPROVED** — Proceed with file organization as proposed
- [ ] ⚠️ **APPROVED WITH CHANGES** — Approve with modifications (specify below)
- [ ] ❌ **REJECTED** — Do not proceed (provide reason)

**If approved, preferred approach:**
- [ ] Move all files at once
- [ ] Move in phases (specify phases)
- [ ] Other (specify)

---

## Next Steps

**After PM Approval:**
1. Scope Guardian implements file organization
2. Update any broken references
3. Create README files in new directories
4. Update `PROJECT_STATUS.md` if structure changes affect workflow
5. Notify team of new structure (if needed)

---

**Created:** 2025-01-11  
**Coordinated By:** Scope Guardian  
**Status:** ⏳ AWAITING PM APPROVAL  
**Priority:** MEDIUM (organization/maintainability)

