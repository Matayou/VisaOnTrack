# Contributing to VisaOnTrack v2

Thank you for contributing! This document outlines our development process and quality gates.

---

## 📋 DoR (Definition of Ready) Checklist

**Before starting any work, ensure:**

- [ ] User story matches `visaontrack-v2-spec.md`
- [ ] API contract defined (or uses existing OpenAPI spec)
- [ ] Prisma schema ready (or uses existing schema)
- [ ] Wireframe/mock available (for frontend work)
- [ ] Error states documented
- [ ] Analytics events defined (if applicable)

**No work starts without DoR approval.**

See [`TASK_TEMPLATES.md`](./TASK_TEMPLATES.md) for full DoR template.

---

## ✅ DoD (Definition of Done) Checklist

**Before marking work complete, ensure:**

- [ ] Code implemented
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing (if applicable)
- [ ] Accessibility (a11y) checked
- [ ] Telemetry added (if applicable)
- [ ] Documentation updated
- [ ] Preview URL available (for frontend work)
- [ ] Scope Guardian approval (for spec adherence)

**No PR merges without DoD completion.**

See [`TASK_TEMPLATES.md`](./TASK_TEMPLATES.md) for full DoD template.

---

## 🔄 RFC Process (Request for Comments)

**Any change beyond `visaontrack-v2-spec.md` requires an RFC:**

1. Create RFC in `RFCs/` directory (see template below)
2. Get Scope Guardian review first
3. Team review (Tech Lead, relevant Engineer, QA)
4. Approval → Update spec → Proceed
5. Track RFC in `RFCs/README.md`

### RFC Template (1-Page Format)

```markdown
# RFC: [Title]

## Problem
[1-2 sentences: What problem does this solve?]

## Proposal
[2-3 sentences: What is the proposed solution?]

## Impact
- **Scope:** [Adds/modifies/removes X]
- **Breaking Changes:** [Yes/No - if yes, describe]
- **Dependencies:** [List any blocking dependencies]
- **Timeline:** [Estimated effort]

## Rollout
- **Feature Flag:** [Flag name if needed]
- **Migration:** [If data migration required]
- **Rollback Plan:** [How to revert if issues]

## Decision
[ ] Approved [ ] Rejected [ ] Deferred
```

See [`TASK_TEMPLATES.md`](./TASK_TEMPLATES.md) for full RFC template.

---

## 🔍 PR Guidelines

### PR Title Format

```
feat(m0): Complete [Task Name]
fix(m1): Fix [Issue]
docs: Update [Documentation]
```

### PR Description

Include:
- Task/issue reference
- Changes made
- Review approvals (Tech Lead, QA, Security, Scope Guardian as applicable)
- Testing performed

### PR Review Process

1. **Scope Guardian:** Does this match spec? RFC if needed?
2. **Tech Lead:** Architecture/contract compliance?
3. **QA:** Tests passing? Coverage adequate?
4. **Security:** Security requirements met? (if applicable)
5. **PM:** DoD checklist complete?

---

## 🛡️ Scope Discipline

**The spec (`visaontrack-v2-spec.md`) is the single source of truth.**

- ✅ **Allowed:** Implementing spec-defined features exactly as written
- ✅ **Allowed:** Fixing bugs in existing spec features
- ✅ **Allowed:** Improving test coverage for spec features
- ❌ **Blocked:** Features not in spec (require RFC)
- ❌ **Blocked:** "Nice to have" features (defer to post-MVP)

See [`SCOPE_GUARDIAN.md`](./SCOPE_GUARDIAN.md) for full scope discipline rules.

---

## 🧪 Testing Requirements

- **Unit tests:** >80% coverage
- **Integration tests:** >60% coverage
- **E2E tests:** Critical paths (Playwright)
- **Contract tests:** Pact (FE consumer ↔ BE provider)
- **Security tests:** AuthZ, rate limits, file enforcement

See [`visaontrack-v2-spec.md`](./visaontrack-v2-spec.md) Section 13 for full testing strategy.

---

## 📦 Contract-First Development

1. Update OpenAPI spec (`packages/types/openapi.yaml`)
2. Bump version if breaking: `v0.2.0` → `v0.3.0` (minor bump)
3. Regenerate API client: `pnpm generate:client`
4. Use generated client in frontend (no manual fetch)

---

## 🗄️ Schema-First Development

1. Update Prisma schema (`apps/api/prisma/schema.prisma`)
2. Create migration: `npx prisma migrate dev --name [migration-name]`
3. Generate Prisma client: `npx prisma generate`
4. Use generated types in backend

---

## 🔐 Security Requirements

- All admin mutations must log to `AuditLog`
- Sensitive admin actions require MFA
- Payouts/refunds require IP allowlist (optional)
- No card data storage (only Stripe IDs)
- PDPA/GDPR compliance for PII

See [`visaontrack-v2-spec.md`](./visaontrack-v2-spec.md) Section 11 for full security requirements.

---

## 📊 Quality Gates

- **DoR:** Must complete before work starts
- **DoD:** Must complete before PR merge
- **Tests:** Must pass before merge
- **Scope:** Must match spec (or have RFC)
- **Reviews:** All required reviews must approve

---

## 🚀 Quick Links

- **Spec:** [`visaontrack-v2-spec.md`](./visaontrack-v2-spec.md)
- **Templates:** [`TASK_TEMPLATES.md`](./TASK_TEMPLATES.md)
- **Agent Team:** [`AGENT_TEAM.md`](./AGENT_TEAM.md)
- **Scope Guardian:** [`SCOPE_GUARDIAN.md`](./SCOPE_GUARDIAN.md)

---

**Remember: Spec is Truth. MVP focus. No exceptions without RFC.**

