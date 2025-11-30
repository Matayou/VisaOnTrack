# Provider Dashboard & Request Detail — User Story (SawadeePass)

> Source: `sawadeepass-v2-spec.md`, `apps/web/app/providers/dashboard/page.tsx`, `apps/web/app/requests/[id]/page.tsx`, `docs/analysis/CODEBASE_REALITY_VS_DOCS.md` (2025-11-30). Persona is a provider who unlocks and responds to seeker requests.

## Persona Snapshot (First-Person)
- "I run a small visa agency in Bangkok. I need a predictable way to find qualified leads, see if they’re worth my time, and message them quickly to win the job."
- Motivations: steady lead flow, clear ROI on credits, fast outreach, and trust signals to stand out.
- Anxieties: wasting credits on weak leads, missing messages, unclear next steps after unlocking, copy still referencing escrow.

## Desired Outcomes
- I instantly know my credit balance, unlock cost, and which leads are worth unlocking.
- I can unlock and contact a lead within seconds, with a clear path to send a proposal/message.
- I see signals that justify my spend (lead freshness, budget, urgency, location, visa type).
- I manage conversations and proposals from one place without losing track of state.

## Current Pain (Observed in Build)
- Unlock value proposition is implicit; no upfront cues on lead quality or urgency.
- Messaging is gated but the upgrade/PRO value is not reinforced in-context.
- Marketplace vs dashboard separation is blurry; unlocked vs locked isn’t always surfaced.
- No obvious rhythm for “what next” after unlocking (message vs proposal vs consultation).

## Experience Principles
- **ROI clarity:** lead value (budget/location/visa/age/urgency) and freshness are visible before spending credits.
- **Fast to contact:** unlock → message CTA is immediate; no dead ends after spending credits.
- **State certainty:** every lead shows lock status, last activity, and what actions are available.
- **Plan awareness:** messaging/pro features are framed as benefits, not roadblocks.
- **Mobile readiness:** key actions (unlock, message, view details) remain reachable in sticky areas.

## Dashboard (Provider) — Story & Requirements
- As a provider on `/providers/dashboard`, I see:
  - Credit bar with balance, unlock cost, and a quick top-up/upgrade CTA.
  - Lead list/cards showing: status (Locked/Unlocked), visa type, budget range, location, created/updated time, and short summary from intake.
  - Quality signals: freshness badge (e.g., “New · 2h”), budget/urgency pill, and whether the lead is popular (unlocks/proposals count when available).
  - Clear primary actions per lead: `Unlock (cost)` if locked; `Message` + `View`/`Propose` if unlocked.
  - Messaging gate: if not on PRO/AGENCY, the Message button shows upgrade value ("Messaging is PRO: win the client faster").
  - Empty/low-lead state: points to Marketplace browse and offers tips to refine filters (visa type, location, budget).
- Presentation tweaks:
  - Move credits + unlock CTA into a sticky top bar for mobile; include a “Credits low” chip when < threshold.
  - Add inline ROI hints: “Avg seekers respond within X hrs” or “Budget ฿X–Y”.
  - Show a compact engagement row on each unlocked lead: `Messages · Proposals · Last activity` (placeholders if data missing).
  - Keep a small sidebar (or inline section) with verification badge status and quick links (profile, billing, help).

### Acceptance Criteria — Dashboard
- Credit balance and unlock cost visible above the fold on desktop/mobile.
- Each lead card shows lock status, visa type, location, budget, and freshness.
- Locked leads present a single Unlock CTA; unlocked leads present Message + View/Propose CTAs.
- Messaging gate copy appears for non-PRO plans; PRO/AGENCY can message without friction.
- Empty state offers a Marketplace link and guidance to check back or adjust filters.

## Request Detail (Provider View) — Story & Requirements
- As a provider viewing `/requests/[id]` (after unlock), I need to decide and act quickly:
  - Header block: Title, status chip (Draft/Published/Hired/Closed), last updated, lock status, and primary action (Message or Send proposal when available).
  - Lead summary: Intake-derived context (visa type, location, duration/timeline, income/savings), budget range, and seeker goals; surface any urgency indicator.
  - Contact path: Prominent Message CTA (PRO-gated); show a friendly gate for FREE with upgrade value.
  - Proposal path: If proposals are implemented, surface “Send proposal” or “Draft proposal” CTA near the header; show any submitted proposal status.
  - Engagement row: Unlock time, last activity, messages count, proposal count; placeholders if data missing.
  - Safety/expectations: Brief reminder about off-platform payments and communication etiquette.
  - Activity timeline: Unlock event, messages, proposals, status changes; concise and chronological.
- Presentation tweaks:
  - Keep primary actions (Message/Propose) sticky on mobile, aligned with status.
  - Place engagement row above proposals/messages so I see traction before acting.
  - If messaging is gated, the fallback explains PRO benefits and routes to pricing without dead ends.
  - If proposals are not yet implemented, add a “Coming soon” stub with expected date and suggest messaging as the immediate step.

### Acceptance Criteria — Request Detail
- Lock status is clear; if locked, only Unlock is offered; if unlocked, Message/Propose are visible.
- Intake context and budget are visible without scrolling on desktop and high on mobile.
- Engagement row shows at least unlock time and message/proposal counts (or placeholders).
- Messaging gate behaves per plan: FREE sees upgrade prompt; PRO/AGENCY can message.
- Proposal action present or stubbed with guidance; no dead-end states after unlocking.
- Activity timeline lists unlock and subsequent interactions (messages/proposals/status changes).

## Open Questions / Follow-Ups
- Do we have backend metrics for views/unlocks/proposals per request for providers? If not, add placeholders and instrument.
- What is the default unlock cost and how is it surfaced (env-driven) on cards?
- Should we show competitive context (number of providers who unlocked) to set urgency?
- Where to place consultations once enabled (sidebar vs main actions) to avoid crowding primary CTAs?
- Ensure copy fully reflects lead-gen (no escrow) and SawadeePass branding.
