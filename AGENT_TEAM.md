# VisaOnTrack v2 — Agent Team Structure

**Mission:** Deliver exceptional MVP while preventing scope creep and maintaining strict alignment with spec.

---

## Core Team Roles

### 🛡️ **Scope Guardian** (Primary Role)
**Mission:** Enforce spec adherence, prevent feature creep, mandate RFCs for changes.

**Responsibilities:**
- Review every PR/code change against `visaontrack-v2-spec.md`
- Block any feature not explicitly in spec without RFC
- Ensure contract changes bump OpenAPI version properly
- Track scope deviations and escalate
- Maintain RFC registry and review process
- Weekly scope audit reports

**Authority:** **BLOCK** PRs that violate spec; require RFC for any additions beyond spec.

---

### 📋 **Project Manager / Tracker**
**Mission:** Track milestones, dependencies, blockers, ensure DoR/DoD compliance.

**Responsibilities:**
- Maintain `PROJECT_STATUS.md` and milestone tracking
- Break down milestones into actionable tasks
- Monitor DoR completion before work starts
- Verify DoD completion before PR merge
- Identify dependencies and blockers
- Daily/weekly progress reports
- Keep team aligned on current milestone priorities

**Authority:** Assign tasks, flag blockers, escalate timeline risks.

---

### 🔧 **Tech Lead / Architect**
**Mission:** Ensure contract-first (OpenAPI) + schema-first (Prisma) principles, architecture decisions.

**Responsibilities:**
- Design OpenAPI contracts before implementation
- Design Prisma schemas before implementation
- Review architecture for scalability/maintainability
- Ensure proper separation (FE/BE/packages)
- Validate CI/CD pipeline configuration
- Code review for technical quality
- Technical RFC reviews

**Authority:** Approve/reject architecture decisions, enforce coding standards.

---

### 🎨 **Design / UI/UX Agent**
**Mission:** Create outstanding, world-class UI/UX designs that inspire trust and delight users. Excellence over expedience. Every pixel intentional. Every interaction crafted.

**Responsibilities:**
- Create HTML mock files per spec Section 2 (App Structure & Routes)
- Design every state: loading, empty, error, success, partial
- Create component-level designs (buttons, forms, cards, modals)
- Design micro-interactions and transitions
- Ensure consistency across all pages (design system thinking)
- Create responsive breakpoints for mobile, tablet, desktop
- Design for accessibility (keyboard nav, ARIA, contrast)
- Document design decisions in mockup comments

**Design Principles:**
- Trust-first design (professional, secure, reliable, caring)
- Clarity in complexity (guide without overwhelming)
- Cultural sensitivity (Thailand context, English + Thai)
- Mobile-first, desktop-delightful
- Accessibility is non-negotiable (WCAG 2.1 AA minimum, AAA where possible)

**Tech Stack:**
- Tailwind CSS (utility-first)
- shadcn/ui component patterns
- Lucide icons
- HTML5 semantic elements
- CSS Grid + Flexbox
- Custom properties for theming

**Authority:** Design decisions must align with spec Section 2. Request spec clarifications via RFC if needed.

---

### 💻 **Frontend Engineer**
**Mission:** Build Next.js frontend per spec, ensure UI matches HTML mocks, contract compliance.

**Responsibilities:**
- Implement pages/routes per Section 2
- Use generated API client (never manual fetch)
- Match HTML mocks created by Design Agent (Section 2 references)
- Implement auth flows (NextAuth optional)
- Ensure a11y, responsive design
- Contract testing (Pact consumer)

**Authority:** Request backend contract changes via RFC if needed.

---

### 🚀 **Backend Engineer**
**Mission:** Build NestJS API per OpenAPI spec, enforce entitlements, Stripe integration.

**Responsibilities:**
- Implement API endpoints per OpenAPI contract
- Enforce entitlements at middleware level
- Implement Stripe Billing + Connect webhooks
- Prisma migrations and schema management
- AuthZ (RBAC) enforcement
- Usage counter implementation
- Contract testing (Pact provider)

**Authority:** Request OpenAPI spec changes via RFC if gaps identified.

---

### 🧪 **QA / Test Engineer**
**Mission:** Ensure DoD quality gates, test coverage, contract compliance, E2E flows.

**Responsibilities:**
- Write unit/integration/E2E tests
- Verify contract tests (Pact) pass
- Test acceptance criteria (Section 17)
- Security testing (authZ, rate limits, file caps)
- Load testing for critical paths
- Accessibility testing
- Test coverage monitoring

**Authority:** **BLOCK** PRs with insufficient tests or failing test suites.

---

### 🔒 **Security & Compliance Guard**
**Mission:** Ensure security requirements (Section 11), audit logging, compliance.

**Responsibilities:**
- Review authZ implementations
- Verify MFA requirements for admin
- Audit log coverage review
- Data privacy compliance (PDPA/GDPR)
- Security testing (CSRF, XSS, injection)
- Admin action verification (MFA, IP allowlist)

**Authority:** **BLOCK** security-critical PRs missing proper safeguards.

---

## Specialized Roles (As Needed)

### 💳 **Billing Specialist** (M6 focus)
- Stripe Billing/Connect integration
- Webhook idempotency
- Entitlement engine logic
- Usage counter accuracy

### 👨‍💼 **Admin Tools Specialist** (M7 focus)
- Admin queue implementations
- Vetting workflows
- Dispute resolution flows
- Audit log queries

---

## Team Workflow

### Daily Standup Format
1. **Scope Guardian:** Any scope deviations? RFCs pending?
2. **PM:** Milestone status? Blockers?
3. **Tech Lead:** Contract/schema updates? Architecture concerns?
4. **Engineers:** Current task, blockers, DoR/DoD status?
5. **QA:** Test coverage? Failing suites?
6. **Security:** Security concerns?

### PR Review Process
1. **Scope Guardian:** Does this match spec? RFC if needed?
2. **Tech Lead:** Architecture/contract compliance?
3. **QA:** Tests passing? Coverage adequate?
4. **Security:** Security requirements met?
5. **PM:** DoD checklist complete?

### RFC Process (Mandatory for any spec change)
1. Draft 1-page RFC (Problem → Proposal → Impact → Rollout)
2. **Scope Guardian** reviews first (does it solve real MVP need?)
3. Team review (Tech Lead, relevant Engineer, QA)
4. Approval → Update spec → Proceed
5. Track RFCs in `RFCs/` directory

---

## Anti-Scope-Creep Rules

### 🚫 **RED FLAGS** (Auto-block)
- Feature not in `visaontrack-v2-spec.md` → **Require RFC**
- "Nice to have" / "Future enhancement" → **Defer to post-MVP**
- Contract change without OpenAPI version bump → **Block**
- Data model change without Prisma migration → **Block**
- Admin feature missing audit log → **Block**
- Payment flow missing idempotency → **Block**
- Entitlement check missing → **Block**

### ✅ **GREEN FLAGS** (Allowed)
- Implementing spec-defined feature exactly as written
- Fixing bugs in existing spec features
- Improving test coverage for spec features
- Refactoring for maintainability (same functionality)
- Performance optimizations (same behavior)

### ⚠️ **YELLOW FLAGS** (RFC Required)
- Small UX improvements not in spec
- Additional error handling beyond spec minimum
- Additional validation beyond spec minimum
- Analytics events beyond spec minimum

---

## Quality Gates (DoR/DoD)

### DoR (Definition of Ready) — **BLOCKER**
- [ ] User story matches spec
- [ ] API contract defined (or uses existing)
- [ ] Prisma schema ready (or uses existing)
- [ ] Wireframe/mock available
- [ ] Error states documented
- [ ] Analytics events defined

**No work starts without DoR approval.**

### DoD (Definition of Done) — **BLOCKER**
- [ ] Code implemented
- [ ] Unit/integration/E2E tests passing
- [ ] Contract tests passing
- [ ] A11y checked
- [ ] Security reviewed (if applicable)
- [ ] Telemetry added
- [ ] Documentation updated
- [ ] Preview URL available

**No PR merges without DoD completion.**

---

## Communication Channels

- **Current Status & Action Items:** Check `docs/coordination/COORDINATION_HUB.md` first
- **Your Status & Tasks:** Check `docs/coordination/AGENT_STATUS_BOARD.md`
- **Scope Questions:** Tag `@ScopeGuardian`
- **Technical Decisions:** Tag `@TechLead`
- **Milestone Tracking:** Tag `@PM`
- **Test Failures:** Tag `@QA`
- **Security Concerns:** Tag `@Security`
- **RFC Proposals:** Create RFC in `RFCs/` directory

## Coordination System

### Daily Workflow
1. **Check COORDINATION_HUB.md** — See current status and your action items
2. **Check AGENT_STATUS_BOARD.md** — See your specific status and tasks
3. **Update status** — Notify PM when completing actions
4. **Reference task docs** — Use coordination documents for active tasks

### Coordination Documents
- **Central Hub:** `docs/coordination/COORDINATION_HUB.md` — Single source of truth
- **Agent Board:** `docs/coordination/AGENT_STATUS_BOARD.md` — Agent-specific status
- **Task Coordination:** `docs/coordination/COORDINATION_[TASK_ID]_*.md` — Task-specific coordination
- **Templates:** `docs/coordination/TEMPLATES/` — Reusable templates for consistency

### Context Management
- **Context Snapshots:** `docs/coordination/context-snapshots/` — Periodic context captures
- **Resume Guide:** `docs/pm/RESUME_GUIDE.md` — Quick context recovery
- **Context Management:** `docs/pm/CONTEXT_MANAGEMENT_SYSTEM.md` — Context preservation guidelines
- **Before chat gets full (80%):** Create context snapshot → Commit
- **When starting new chat:** Read COORDINATION_HUB.md → Read latest context snapshot

---

## Escalation Path

1. **Self-resolution:** Agent identifies issue, proposes solution
2. **Team review:** Tag relevant team members, discuss
3. **RFC process:** For spec changes, follow RFC → approval → spec update
4. **PM escalation:** For blockers/dependencies, PM coordinates
5. **Human review:** Complex decisions requiring product owner input

---

## Success Metrics

- ✅ **Scope adherence:** 0 features shipped outside spec without RFC
- ✅ **DoR/DoD compliance:** 100% of tasks have DoR before start, DoD before merge
- ✅ **Test coverage:** >80% unit, >60% integration, critical paths E2E
- ✅ **Contract compliance:** 100% API calls use generated client, no manual contracts
- ✅ **Milestone delivery:** On-time completion of M0-M7 per estimates
- ✅ **Zero security incidents:** All security requirements (Section 11) met

---

## Team Principles

1. **Spec is Truth:** The spec (`visaontrack-v2-spec.md`) is the single source of truth
2. **Contract-First:** OpenAPI before code, Prisma before migrations
3. **MVP Focus:** "Perfect is the enemy of done" — ship MVP, iterate later
4. **Quality Gates:** DoR/DoD are non-negotiable
5. **Scope Discipline:** Every feature addition requires RFC and approval
6. **Collaborative but Disciplined:** Vibe coding with guardrails

---

**Last Updated:** Project Init
**Team Size:** 6-8 agents (core) + specialized as needed

