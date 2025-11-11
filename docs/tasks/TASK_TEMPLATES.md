# Task Templates

## DoR (Definition of Ready) Checklist

Use this before starting any feature work:

- [ ] User story defined with acceptance criteria
- [ ] Wireframe/mock/design available (or reference to HTML mock)
- [ ] API contract updated in OpenAPI spec (if backend change)
- [ ] Prisma schema updated (if data model change)
- [ ] Error states documented (400, 403, 404, 429, 500, etc.)
- [ ] Analytics events defined (if user action tracking needed)
- [ ] Dependencies identified (other tasks/PRs)
- [ ] DoR reviewed and approved

---

## DoD (Definition of Done) Checklist

Use this before marking a task complete:

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing (if applicable)
- [ ] Accessibility (a11y) checked (keyboard nav, screen readers)
- [ ] Telemetry/analytics added (if required)
- [ ] Documentation updated (README, API docs, inline comments)
- [ ] Preview URL available (Vercel/Fly preview deployment)
- [ ] No linter errors
- [ ] TypeScript compiles without errors
- [ ] Contract tests passing (OpenAPI client generation)

---

## RFC Template (1-Page)

**Title:** [Brief description of change]

**Problem:**
[1-2 sentences: What problem does this solve?]

**Proposal:**
[2-3 sentences: What is the proposed solution?]

**Impact:**
- **Scope:** [Adds/modifies/removes X]
- **Breaking Changes:** [Yes/No - if yes, describe]
- **Dependencies:** [List any blocking dependencies]
- **Timeline:** [Estimated effort]

**Rollout:**
- **Feature Flag:** [Flag name if needed]
- **Migration:** [If data migration required]
- **Rollback Plan:** [How to revert if issues]

**Decision:** [ ] Approved [ ] Rejected [ ] Deferred

---

## User Story Template

```
As a [role],
I want to [action],
So that [benefit].

**Acceptance Criteria:**
- [ ] AC1
- [ ] AC2
- [ ] AC3

**Technical Notes:**
[Any implementation details]

**Dependencies:**
- [ ] Task/PR #X
- [ ] External service Y
```

---

## Bug Report Template

**Title:** [Brief description]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser/OS:
- Build/Commit:
- Feature flags enabled:

**Logs/Screenshots:**
[Attach if applicable]

