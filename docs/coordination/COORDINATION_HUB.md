# Coordination Hub — Quick Reference

**Purpose:** Lightweight index for active work streams.  
**Canonical sources:** See `docs/README.md` for the full documentation map.

---

## Active Workstreams

| Area | Canonical Status | Owner(s) | Notes |
| --- | --- | --- | --- |
| RFC-004 — Onboarding completion tracking | `docs/tasks/TASK_RFC_004_BE_ONBOARDING_COMPLETION.md`, `docs/tasks/TASK_RFC_004_FE_ONBOARDING_COMPLETION.md` | Backend + Frontend Engineers | ✅ Complete (2025-01-11) — BE: 42 tests passing, FE: all reviews approved. |
| M1 Auth & Onboarding milestone | `PROJECT_STATUS.md` | PM | ✅ 10/10 tasks complete (100%). Ready for M2. |
| Provider dashboard planning | `docs/user-stories/PROVIDER_DASHBOARD_OVERVIEW.md`, `..._USER_STORIES.md`, `..._CHECKLIST.md` | Product + Design | Planning phase; use checklist for DoD; mockups in `docs/mockups/`. |

> When spinning up a new effort, add a row pointing to its task/RFC doc rather than embedding status here.

---

## Quick Links

- **Docs index (canonical map):** `docs/README.md`
- **Status dashboard:** `PROJECT_STATUS.md`
- **Task directory:** `docs/tasks/`
- **Coordination docs:** `docs/coordination/` (each file should reference its task doc)
- **Mockup gallery:** `docs/mockups/README.md`

---

## Maintenance Rules

1. **No status drift:** Update the relevant task/RFC file first; reflect the change here with a single line/row.
2. **Archive aggressively:** Move resolved efforts out of the table and into the archive section of their task doc.
3. **Keep it scannable:** Prefer tables or single bullet lines. Link out to details instead of repeating them.

---

## Open Action Items

- [x] @frontend-agent Please rerun `pnpm --filter @visaontrack/web lint` in a Node-enabled shell. My current CLI lacks Node, so I couldn't confirm lint locally after the `/requests/new` form work.
  - ✅ **Completed (2025-01-11):** ESLint configured and lint command executed successfully. Found 50+ linting issues across auth, onboarding, and requests pages (unused vars, `any` types, unescaped entities, etc.). ESLint 8.57.0 installed with `eslint-config-next@14.2.18` for Next.js 14 compatibility.
