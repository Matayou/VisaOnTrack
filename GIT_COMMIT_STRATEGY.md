# Git Commit Strategy — VisaOnTrack v2

**Policy:** Regular commits after each logical unit of work is complete and reviewed.

---

## Commit Strategy

### Per Task Completion (Primary)
**Commit after each M0 task:**
1. Task completes
2. Reviews pass (Tech Lead, QA, Security as applicable)
3. Scope Guardian approves (for spec adherence tasks)

**Commit Message Format:**
```
feat(m0): Complete [Task Name] (Task X)

[Brief description of what was completed]
- Key accomplishment 1
- Key accomplishment 2
- Review approvals (Tech Lead, QA, Security, Scope Guardian)

Reviewed-by: [Agents that approved]
```

### Commit Frequency
- ✅ **After each task completion** (recommended for M0)
- ⚠️ **After significant logical units** (if task has multiple parts)
- ❌ **Not per-file** (too granular)
- ❌ **Not per-milestone** (too coarse)

---

## PM Coordinator Commit Responsibility

**I (PM Coordinator) commit:**
- After each task is marked complete in PROJECT_STATUS.md
- After all required reviews are approved
- With appropriate commit message documenting review approvals
- Regular checkpoints (daily if there's work)

---

## Initial Commit ✅ COMPLETE

**Commit:** `feat(m0): Complete foundation setup - Tasks 1-3`
- **Date:** Initial commit
- **Tasks:** M0 Tasks 1-3 (Monorepo, OpenAPI, Prisma)
- **Status:** ✅ Committed

---

## Future Commit Schedule

**M0 Remaining Tasks:**
- [ ] Task 4: OpenAPI Client Generation → Commit after completion
- [ ] Task 5: CI/CD Workflow Skeleton → Commit after completion
- [ ] Task 6: Project Documentation → Commit after completion

**After M0:**
- Continue per-task commit strategy
- Commit after each milestone task completion
- Include review approvals in commit messages

---

## Commit Checklist

Before committing:
- [ ] Task is marked complete in PROJECT_STATUS.md
- [ ] All required reviews are approved
- [ ] No sensitive data (API keys, passwords, .env files)
- [ ] Commit message follows format
- [ ] Review approvals documented in commit message

---

## Notes

- **Regular commits:** I (PM Coordinator) will commit after each task completion going forward
- **Commit frequency:** After each logical unit (task completion) is the standard
- **Review tracking:** All commit messages document review approvals
- **Scope discipline:** Only commit reviewed, approved work

---

**Last Updated:** Initial commit established  
**PM Commitment:** Regular commits after each task completion
