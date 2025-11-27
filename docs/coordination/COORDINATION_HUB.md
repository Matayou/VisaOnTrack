# Coordination Hub — Quick Reference

**Purpose:** Lightweight index for active work streams.  
**Canonical sources:** See `docs/README.md` for the full documentation map.

---

## Active Workstreams

| Area | Canonical Status | Owner(s) | Notes |
| --- | --- | --- | --- |
| M2 — Requests & Messaging | `docs/milestones/MILESTONE_M2.md` | Backend + Frontend Engineers | ⏳ In Progress (0/4 tasks) — BE tasks ready for assignment. |
| M2-BE-1: Requests API | `docs/tasks/TASK_M2_BE_REQUESTS_API.md` | Backend Engineer | ⏳ PENDING — Ready for assignment. |
| M2-BE-2: Messages API | `docs/tasks/TASK_M2_BE_MESSAGES_API.md` | Backend Engineer | ⏳ PENDING — Ready for assignment. |
| M2-FE-1: Requests pages | `docs/tasks/TASK_M2_FE_REQUESTS.md` | Frontend Engineer | ⏳ PENDING — Blocked on M2-BE-1. |
| M2-FE-2: Messaging pages | `docs/tasks/TASK_M2_FE_MESSAGING.md` | Frontend Engineer | ⏳ PENDING — Blocked on M2-BE-2. |
| Provider dashboard planning | `docs/user-stories/PROVIDER_DASHBOARD_OVERVIEW.md`, `..._USER_STORIES.md`, `..._CHECKLIST.md` | Product + Design | Planning phase; use checklist for DoD. |

> When spinning up a new effort, add a row pointing to its task/RFC doc rather than embedding status here.

---

## Quick Links

- **Docs index (canonical map):** `docs/README.md`
- **Status dashboard:** `PROJECT_STATUS.md`
- **Task directory:** `docs/tasks/`
- **Coordination docs:** `docs/coordination/` (each file should reference its task doc)
- **Design documentation:** `docs/design/` — Design system, audit reports, Phase 1 completion

---

## Maintenance Rules

1. **No status drift:** Update the relevant task/RFC file first; reflect the change here with a single line/row.
2. **Archive aggressively:** Move resolved efforts out of the table and into the archive section of their task doc.
3. **Keep it scannable:** Prefer tables or single bullet lines. Link out to details instead of repeating them.

---

## Open Action Items

- [x] @frontend-agent Please rerun `pnpm --filter @visaontrack/web lint` in a Node-enabled shell. My current CLI lacks Node, so I couldn't confirm lint locally after the `/requests/new` form work.
  - ✅ **Completed (2025-01-11):** ESLint configured and all linting issues resolved. Created shared typed error helper (`apps/web/lib/api-error.ts`) to eliminate `any` types in error handling. Fixed accessibility issues (aria-pressed instead of aria-selected, proper entity encoding). Removed unused state variables. All pages now lint clean with ESLint 8.57.0 + `eslint-config-next@14.2.18`.
