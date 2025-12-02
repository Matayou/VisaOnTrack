# SawadeePass Docs Guide

**🚀 NEW TO THE RECOVERY PLAN? Start here:** [START_HERE.md](./START_HERE.md)

> **📊 Project Status:** See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for current blockers, feature matrix, and implementation status.

Use this map to find the canonical source for each type of information. When creating new material, append to the source listed here (or add a short pointer back to it) instead of spawning another top-level doc.

## Overview & Scope
- `docs/overview/PROJECT_BRIEF.md` — canonical one-pager (vision, model, stage).
- `docs/overview/SCOPE_AND_OBJECTIVES.md` — scope boundaries and current objectives.

## Status & Coordination
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** — **single source of truth** for project status, blockers, feature matrix.
- `docs/tasks/` — **one task file per RFC/feature** is the live status. Example: `docs/tasks/TASK_RFC_004_FE_ONBOARDING_COMPLETION.md`.
- `docs/coordination/COORDINATION_HUB.md` — index of who’s doing what; each entry should point back to its task file.
- `docs/coordination/*review*.md` — supplemental review notes only. Start each with a pointer to the task doc.

## Product Requirements
- `sawadeepass-v2-spec.md` — platform-wide spec.
- `docs/user-stories/PROVIDER_DASHBOARD_OVERVIEW.md` — module map.
- `docs/user-stories/PROVIDER_DASHBOARD_USER_STORIES.md` — acceptance criteria.
- `docs/user-stories/PROVIDER_DASHBOARD_CHECKLIST.md` — implementation checklist (acts as DoD for the module).

## Design & Visuals
- Design system documentation will be created in `docs/design/` directory.

## Setup & Ops References
- `docs/setup/TEAM_SETUP_INSTRUCTIONS_M1_BE_7.md` — latest backend environment steps.
- `docs/setup/` — other environment runbooks.
- `docs/incidents/`, `docs/blockers/` — only for active issues; archive once resolved.

## Maintenance Rules
1. **Declare the source:** add a blockquote at the top of non-canonical docs linking back to the task/spec they expand on.
2. **Archive instead of duplicating:** move outdated summaries into an `archive/` subfolder (e.g., `docs/mockups/archive/provider-pages/…`) and leave a short stub that points to the live file.
3. **Update the index:** whenever you add a new canonical doc, add it to this guide and to `COORDINATION_HUB.md`.
4. **Prefer sections over files:** extend the relevant task/spec/README instead of creating a separate document unless the content clearly targets a different audience.

Keeping to these rules should keep the docs directory navigable even as more AI agents contribute.
