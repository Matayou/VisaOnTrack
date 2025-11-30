# Seeker Dashboard & Request Detail — User Story (SawadeePass)

> Source: `sawadeepass-v2-spec.md`, `apps/web/app/dashboard/page.tsx`, `apps/web/app/requests/[id]/page.tsx`, `docs/analysis/CODEBASE_REALITY_VS_DOCS.md` (2025-11-30). Persona is a visa seeker who just published (or is about to publish) a request.

## Persona Snapshot (First-Person)
- "I’m a working professional in Bangkok who needs a visa path. I filled the intake wizard and now I want to publish and manage my request without guessing what to do next."
- Motivations: fast replies, trustworthy providers, clear pricing and next steps.
- Anxieties: will anyone respond, is my info clear enough, what happens after I publish, how do I compare responses.

## Desired Outcomes
- I understand my request status at a glance (draft vs published vs hired/closed).
- I know the single next best action (publish, edit, message, review proposals).
- I can compare provider responses and move forward confidently (message, accept, or close).
- I stay informed on activity (views/unlocks/proposals/messages) without digging.

## Current Pain (Observed in Build)
- Dashboard is a list, but primary CTA and state cues are subtle; drafts don’t clearly push me to publish.
- Request detail mixes status, proposals, and activity without a clear “what now” moment.
- Activity stats (views/proposals/messages) are sparse; I don’t know if anyone has seen my request.
- Guidance/education (what a good request looks like, how to choose a provider) is buried in FAQ.

## Experience Principles
- **State clarity first:** a single status chip + headline that tells me what’s happening now and what to do.
- **Action over data:** every section ends in a decision/CTA (publish, edit, message, accept/decline, close).
- **Progress evidence:** surface engagement signals (unlocks, proposals, messages, last updated) near the top.
- **Risk reduction:** short guidance on safety and expectations (no escrow; off-platform payments) in-context.
- **Mobile parity:** core CTAs pinned in a sticky bar; lists and timelines stack cleanly.

## Dashboard (Seeker) — Story & Requirements
- As a seeker landing on `/dashboard`, I see:
  - A hero card: status of my latest request (draft/published/hired/closed) + primary CTA (Publish or View request) and secondary (Edit).
  - Engagement snapshot: counts for active requests, drafts, hired, closed; for the primary request show views/unlocks/proposals/messages.
  - Request list with clear state chips and a "Last updated" label; empty state nudges me to start a request with the intake wizard.
  - Next steps panel: concise guidance for my current state (Draft → "Publish to receive proposals"; Published → "Invite providers" once available; Hired → "Track progress" once cases exist).
  - Safety note: short, inline reminder about off-platform payments and messaging best practices.
- Presentation tweaks:
  - Promote the existing publish CTA to the top of the dashboard when a draft exists; keep it sticky on scroll for mobile.
  - Add a small info bar for draft requests: "Your request isn’t live yet. Publish to let providers respond."
  - Show a compact engagement pill row on each card: `Views · Proposals · Messages · Updated x days ago` (or placeholders if data unavailable).
  - Replace generic FAQ block with two contextual links: "What makes a strong request?" and "How to pick a provider" (links to help or inline tips).

### Acceptance Criteria — Dashboard
- I can tell in <3 seconds whether my request is live and what to do next.
- If I have a draft, a primary Publish CTA is visible above the fold on mobile/desktop.
- Each request card shows status, last updated, and engagement signals (even if zero/placeholder).
- Empty/draft states include guidance and a CTA to start or finish publishing.

## Request Detail — Story & Requirements
- As a seeker viewing `/requests/[id]`, I need a crisp overview and a path forward:
  - Header block: Title, status chip (Draft/Published/Hired/Closed), last updated, and primary CTA (Publish if draft; Message providers or Manage proposals if published; Close/Hire when applicable).
  - Request summary: Key fields from intake (visa type, location, duration/timeline, income/savings) plus budget range and description; edit button near the summary.
  - Engagement row: Views, unlocks, proposals, messages, and last activity timestamp.
  - Proposals section: Cards with provider name, headline offer, price/timeline, trust badges; actions to message or accept/decline; empty state explains what happens next and encourages patience/editing.
  - Messaging entry point: Clear, single CTA to open the thread (messaging is free for seekers).
  - Activity timeline: Creation, publish, unlocks, proposals received, messages; keep it concise and chronological.
  - Safety guidance: Inline reminder about off-platform payments and what a good proposal looks like.
- Presentation tweaks:
  - Keep Publish/Edit buttons sticky on mobile via the existing `MobileActionSheet`, but ensure the main CTA mirrors the current status.
  - Move engagement row above proposals to show evidence of traction before asking me to act.
  - If no proposals yet, show "While you wait" tips (clarify requirements, adjust budget/location, check spam for emails).
  - If proposals exist, sort by most recent or by provider credibility once signals are available.
  - Use consistent status language (Draft, Published, Hired, Closed) across the page and dashboard.

### Acceptance Criteria — Request Detail
- Primary CTA matches state (Draft → Publish; Published → Manage proposals/message; Hired/Closed → View history/close actions only).
- Intake-derived context (location, duration, income/savings) is visible without scrolling on desktop and near the top on mobile.
- Engagement row shows at least views/unlocks/proposals/messages; no data shows a friendly placeholder instead of blank space.
- Proposals list supports at least: view details, message provider, and accept/decline (when implemented); empty state provides guidance.
- Activity timeline lists at least: created, published, unlocks, proposals, messages (with timestamps if available).

## Open Questions / Follow-Ups
- Do we track views/unlocks in the API today? If not, add placeholders with explanatory copy until instrumentation exists.
- Should we expose proposal SLA ("Most seekers get first proposal within X hours") to set expectations?
- When cases/consultations ship, where should those appear (sidebar vs main column)?
- Align copy everywhere to SawadeePass brand and lead-gen (no escrow) language.
