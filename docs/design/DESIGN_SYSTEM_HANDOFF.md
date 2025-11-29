# Design System Enforcement – Handoff Notes

**Owner:** Codex (AI) → Claude  
**Last Updated:** 2025-11-29  
**Scope:** UI primitives, enforcement guardrails, lint cleanup

---

## Session 1 (Codex) - Initial Setup

### What was done
- Added missing primitives in `apps/web/components/ui/`: `Card` (with `as`, padding variants, elevation + subcomponents), `Modal`, `Toast`, `Select`. Exported via `ui/index.ts`.
- Added Tailwind lint guardrails: `eslint-plugin-tailwindcss` with warn-level rules in `apps/web/.eslintrc.json`.
- Migrated key pages to use `Card` instead of ad-hoc class strings:
  - Request wizard steps: `apps/web/app/requests/new/components/steps/{PersonalStep,MissionStep,IntentStep,BudgetStep,SupportStep}.tsx`
  - Intake wizard: main panel, recommendation tiles, profile summary in `apps/web/components/intake/IntakeWizard.tsx`
  - Provider onboarding business page: header and form sections in `apps/web/app/onboarding/provider/business/page.tsx`

---

## Session 2 (Claude) - Cleanup & Documentation

### What was done
- ✅ **Removed deprecated constants file** `apps/web/app/requests/new/constants.ts`:
  - Deleted entire file containing `baseCardClass`, `sectionCardClass`, `panelClass`, `mutedPanelClass`
  - Also removed unused `primaryButtonClass`, `outlineButtonClass`, `ghostButtonClass`
  - All constants were already deprecated and no longer imported anywhere
- ✅ **Fixed JSX closing tag errors** in wizard step components:
  - `PersonalStep.tsx`, `MissionStep.tsx`, `IntentStep.tsx`, `BudgetStep.tsx`, `SupportStep.tsx`
  - Changed `</section>` to `</Card>` where `<Card as="section">` was used
  - Fixed `as="header"` to valid `as` prop in provider business page
- ✅ **Updated UI README** (`apps/web/components/ui/README.md`):
  - Removed references to deprecated constants
  - Updated related files section
- ✅ **Ran lint** and documented findings:
  - Total warnings: 1697
  - Class ordering (auto-fixable): 1422
  - Arbitrary values: 186
  - Custom classnames: ~89
- ✅ **Updated documentation** in `docs/design/DESIGN_SYSTEM_CURRENT_STATE.md`:
  - Marked Card/Container Patterns as complete
  - Added lint status section with breakdown
  - Updated gaps, recommendations, and next steps
- ✅ **Audited migration candidates**:
  - Bespoke selects have intentionally different styling per context (not migration candidates)
  - MobileActionSheet is a bottom sheet, not a modal (correct pattern)
  - Inline banners serve different purposes than Toast (correct patterns)

### Why
- Move UI to tokenized surfaces (radius/spacing/colors) and shared primitives to keep agents on-rails.
- Prepare lint guardrails so arbitrary colors/spacing can be blocked once the code is cleaned up.

---

## Current Status

### ✅ Completed
- UI primitive components (Card, Modal, Toast, Select, Input, FormField, Button, Spinner)
- Card migrations across all wizard steps and intake flow
- Deprecated constants file removed
- JSX tag mismatches fixed
- **Class ordering fixed** - 0 violations (set to error)
- **Design tokens added** to `tailwind.config.ts`:
  - `max-w-auth` (28rem), `w-4.5`/`h-4.5` (18px), `rounded-xs` (2px)
  - Focus shadows: `shadow-focus-primary/success/error`
  - Accent shadows: `shadow-primary-sm/md`, `shadow-success-sm/md`
  - Colors: `success-bright` (#10b981)
  - Animations: `slide-up`, `fade-in-up`, `fade-in-up-slow`, `scale-in`, `file-slide-in`
- **Auth pages migrated** to use new tokens
- **UI components updated** (Input, Select) to use focus shadow tokens
- **Lint rules set to error** for classnames-order
- **CI integration confirmed** - lint runs on every PR/push

### ⚠️ Remaining Work (Low Priority)
1. ~94 arbitrary value warnings for complex patterns:
   - Animations with delays (acceptable - CSS limitation)
   - Grid layouts with fr units (acceptable - design specific)
   - Letter spacing, viewport widths (acceptable - one-off values)
2. Consider adding more tokens if patterns repeat frequently

---

## Quick Start for Next Agent

```bash
# Install deps
pnpm --filter @visaontrack/web install

# Auto-fix class ordering
pnpm --filter @visaontrack/web lint --fix

# See remaining violations
pnpm --filter @visaontrack/web lint
```

### Files with most arbitrary values to address:
- `apps/web/app/auth/*.tsx` - focus shadows, sizing
- `apps/web/components/intake/IntakeWizard.tsx` - sizing, colors
- `apps/web/app/requests/**/*.tsx` - various patterns

### Documentation to update:
- `docs/design/DESIGN_SYSTEM_CURRENT_STATE.md` - lint status section as violations are fixed
