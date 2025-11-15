# Task: Refactor `apps/web/app/requests/new/page.tsx`

## Background
`CreateRequestPage` has grown into a ~2,000 line component that handles every step of the seeker request form. The file now mixes UI, state management, validation, and data definitions, making it difficult to reason about and risky to modify. We recently added richer visa metadata, custom dropdowns, and readiness UI which exacerbated the size.

## Goals
1. **Split the flow into step components** – isolate `Personal`, `Mission`, `Intent`, `Budget`, and `Review` sections so each file stays small and easier to test.
2. **Extract shared utilities and configs** – move visa data, dropdown options, and formatting helpers into dedicated modules under `apps/web/config` / `apps/web/lib`.
3. **Reduce prop drilling** – introduce a form context or reducer-based hook that exposes `formState`, `updateField`, validation helpers, and navigation so child components don’t receive massive prop bundles.
4. **Abstract reusable inputs** – create shared components for the styled dropdown, date picker trigger, readiness cards, etc., to keep styling consistent and centralized.
5. **Maintain feature parity** – no UX regressions; keep the custom readiness step, validation messages, and accessibility attributes.
6. **Capture current behavior** – document the existing UX (custom dropdowns, date defaults, readiness data) so the next agent understands what must remain intact.

## Deliverables
- New component structure (e.g., `PersonalStep.tsx`, `MissionStep.tsx`, etc.) imported by `page.tsx`.
- Config/utility files for visa requirements, options, and formatting.
- Form context/hook powering the steps.
- Reusable input components for dropdown/date fields.
- Documentation of the current UX decisions (custom dropdowns, readiness data) so downstream agents know what to preserve.
- Updated tests (or TODO comments) to verify the refactor didn’t break functionality.

## Success Criteria
- `apps/web/app/requests/new/page.tsx` should primarily orchestrate steps, not contain full JSX for each one.
- Individual step files stay under ~200 lines.
- No duplicated data/config across files.
- Lint/test suite continues to pass.
