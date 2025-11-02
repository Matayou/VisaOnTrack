# RFC Registry

All Request for Comments (RFCs) that propose changes beyond `visaontrack-v2-spec.md` must be tracked here.

---

## RFC Format

See `TASK_TEMPLATES.md` for RFC template (1-page format: Problem → Proposal → Impact → Rollout).

---

## RFC Status

| ID | Title | Status | Date | Decision |
|----|-------|--------|------|----------|
| RFC-001 | Add Mockups/Wireframes as Prerequisite for M1 | APPROVED | 2025-01-11 | ✅ APPROVED — Required per spec Section 2 & DoR |
| RFC-002 | Add Forgot/Reset Password Flow to M1 | APPROVED | 2025-01-11 | ✅ APPROVED — Tech Lead (Security Guard review pending) |

**Status values:**
- `DRAFT` — RFC created, awaiting review
- `REVIEW` — Under team review
- `APPROVED` — Approved, spec updated
- `REJECTED` — Rejected, not proceeding
- `DEFERRED` — Needs more info / discussion

---

## Creating an RFC

1. Copy RFC template from `TASK_TEMPLATES.md`
2. Create file: `RFCs/RFC-YYYY-MM-DD-[short-title].md`
3. Fill in: Problem → Proposal → Impact → Rollout
4. Request review (tag @ScopeGuardian, @TechLead, @PM)
5. Update status in this README once decision made
6. Update spec if approved

---

## RFC Review Criteria

**Scope Guardian evaluates:**
- Does it solve a real MVP blocker? ✅
- Or is it a "nice to have"? ❌
- Impact on timeline? ⚠️
- Impact on scope? ⚠️

**Decision:**
- **APPROVE** → Update spec → Proceed
- **REJECT** → Defer to post-MVP
- **DEFER** → Needs more info

---

**Last Updated:** 2025-01-11 (RFC-002 created — Critical gap)

