# Recovery Plan — Spec/SDK/Feature Alignment

This plan brings the codebase back in sync with the actual implementation, fixes build blockers, and stages delivery of missing core features. Steps are ordered by dependency; move to the next only after the previous is done.

## Decisions (agreed)
- Unlock pricing: configurable via env (default 1 credit).
- Credits purchase: keep simulated packs for now.
- Billing checkout/portal/subscription: keep in spec but gate behind feature flags and “coming soon” UI.
- Messaging/Proposals: ship MVP with message attachments.
- Consultations gating: gate by plan entitlements (Pro/Agency).
- Marketplace filters/sort: server-side visaType + location + budget + sort (newest/highest budget).

## Phase 1 — Contract + SDK Realignment (Day 1)
- Update OpenAPI to include: `/requests/{id}/unlock`, `/providers/me`, `intakeData` + `updatedAt` on Request, credits purchase (if kept), and correct PlanCode (Free/Pro/Agency).
- Regenerate the client (`pnpm generate:client`) and bump `OpenAPI.VERSION` to match the spec.
- Fix type usage in the app: remove `as any` for unlock/intakeData, and switch calls to the regenerated SDK.

## Phase 2 — Backend Fixes (Days 2–3)
- Unlock: ensure cost is configurable (env), enforce provider role, return `remainingCredits` and `unlockStatus/contact` data; keep errors clear (401/403/404).
- Consultations: map `providerId` correctly (providerProfile id), enforce unlock + plan entitlement, return actionable errors.
- Credits: keep simulated `purchase` endpoint working; keep balance/history consistent.
- Providers: `/providers/me` must work for onboarding providers and be documented.
- Billing endpoints: keep in spec but gate via feature flags and “coming soon” UI until Stripe sprint.

## Phase 3 — Frontend Alignment (Days 3–4)
- Swap to regenerated SDK; fix missing method/type errors (unlockRequest, intakeData, updatedAt, provider profile).
- Unlock UI: read configurable cost, handle zero credits (route to top-up/upgrade).
- Marketplace/Dashboard: use API pagination + filters (visaType/location/budget + sort newest/highest budget); remove fake match/competition until real data exists.
- Request detail: show proposals/messages/consultations only if APIs exist; otherwise soften copy/disable actions.
- Billing page: replace “Buy credits” stub with real flow or hide CTA; remove fake invoices until Stripe is live.

## Phase 4 — Missing Core Features (Days 5–8)
- Messaging: add controller (`GET/POST /requests/{id}/messages`, reuse attachments), thread UI + composer (with attachments).
- Proposals: minimal create/list/update endpoints; provider submit form; display on request detail.
- Optional quick win: add a lightweight consultations UI (offer/list/book) once backend is fixed to drive early value.

## Phase 5 — Entitlements & Usage Accuracy (Day 9)
- Compute credit usage by amount, not count; hide monthly free credits if allocation job isn’t running.
- Wrap premium actions with `FeatureGate` and ensure entitlements endpoint returns correct usage.
- Add monthly credit allocation job or temporarily remove the metric from UI.

## Phase 6 — Docs & Status Sync (Day 10)
- Refresh `CODEBASE_REALITY_VS_DOCS.md` with current reality.
- Update `PROJECT_STATUS.md` and `README.md` to match actual completion (no MFA/proposal claims until true).
- Note what’s live vs. stubbed (billing/checkout) and what’s next on the milestone track.

## Validation
- Run `pnpm generate:client && pnpm typecheck && pnpm lint`.
- Add smoke tests: intake → unlock → consultation offer (after backend fixes); messaging happy path once implemented.
- Verify unlock pricing and entitlement errors are consistent across UI/API.
