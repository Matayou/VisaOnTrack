# Frontend Engineer Assignment — M1-FE-6: Provider Onboarding

**Date:** 2025-01-11  
**From:** Project Manager  
**To:** Frontend Engineer  
**Task:** M1-FE-6: Provider Onboarding (5 steps)  
**Status:** ⏳ READY TO START  
**Priority:** HIGH

---

## 📋 Task Assignment

**Frontend Engineer:** Please proceed with M1-FE-6: Provider Onboarding implementation.

**Task Document:** `docs/tasks/TASK_M1_FE_ONBOARDING.md`

**Current Status:**
- ✅ All prerequisites complete (M0, mockups, RFC-002)
- ✅ No blocker dependencies — Can proceed independently of M1-BE-7 setup
- ✅ Mockups available and production-ready
- ✅ API contract defined (OpenAPI v0.2.1)

---

## 🎯 Task Overview

**What to Implement:**
Provider onboarding flow with 5 steps:
1. Welcome page (`/onboarding/provider/welcome`)
2. Business details (`/onboarding/provider/business`)
3. Services & pricing (`/onboarding/provider/services`)
4. Credentials upload (`/onboarding/provider/credentials`)
5. Credentials complete (`/onboarding/provider/credentials/complete`)
6. Payment setup (`/onboarding/provider/payouts`) — Stripe Connect

**Duration Estimate:** 2–2.5 days

---

## 📚 References

### Mockups (Production-Ready)
- **Provider Welcome:** `docs/mockups/onboarding-provider.html`
- **Business Details:** `docs/mockups/business-details.html`
- **Services & Pricing:** `docs/mockups/services-pricing.html`
- **Credentials:** `docs/mockups/credentials.html`
- **Credentials Complete:** `docs/mockups/credentials-complete.html`
- **Payment Setup:** `docs/mockups/payment-setup.html`

### Task Document
- **Full Requirements:** `docs/tasks/TASK_M1_FE_ONBOARDING.md`
- **Milestone Tracking:** `docs/milestones/MILESTONE_M1.md`

### API Endpoints
- **Provider API:** `POST /providers`, `GET /providers/{id}`, `PATCH /providers/{id}`
- **Attachments:** `POST /messages/attachments` (for credentials)
- **Stripe Connect:** Will be implemented in M1-BE-9 (backend)

---

## ✅ DoR Checklist (Definition of Ready)

- [x] Wireframe/mock available ✅ (all 6 mockups ready)
- [x] API contract defined ✅ (OpenAPI v0.2.1)
- [x] Error states documented ✅ (task document)
- [x] Dependencies identified ✅ (Next.js, shadcn/ui, Lucide icons)
- [x] Task document reviewed ✅ (TASK_M1_FE_ONBOARDING.md)

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation

---

## 📝 Implementation Requirements

### Technical Stack
- **Framework:** Next.js App Router
- **Styling:** Tailwind CSS
- **Icons:** Lucide icons
- **Components:** shadcn/ui patterns
- **API Client:** Generated from OpenAPI (`@visaontrack/client`)

### Key Features
- Auto-save indicators
- Drag-drop file uploads
- Progress tracking
- Character counters
- Real-time validation
- Responsive design (mobile-first)
- Accessibility (WCAG AA)

### Design Compliance
- Match mockups exactly (all 6 pages)
- Follow design system patterns
- Use Tailwind classes mapped to design tokens
- Implement smooth animations and transitions

---

## 🎯 Acceptance Criteria

See `docs/tasks/TASK_M1_FE_ONBOARDING.md` for complete acceptance criteria.

**Key Requirements:**
- [ ] All 6 pages implemented per routes
- [ ] Matches mockup designs exactly
- [ ] Auto-save functionality works
- [ ] File uploads work (drag-drop)
- [ ] Progress tracking works
- [ ] Character counters work
- [ ] Real-time validation works
- [ ] Responsive design verified
- [ ] Accessibility (WCAG AA) verified

---

## 📊 Current Project Context

**M1 Milestone Status:** 7/9 tasks complete (78%)

**Completed Tasks:**
- ✅ M1-FE-1: Landing Page
- ✅ M1-FE-2: Login/Register Flows
- ✅ M1-FE-3: Forgot/Reset Password
- ✅ M1-FE-4: Account Type Selection
- ✅ M1-FE-5: Seeker Onboarding Welcome
- ✅ M1-BE-8: User Management API
- ✅ M1-BE-7: Authentication API (setup pending)

**In Progress:**
- ⏳ M1-BE-7: Setup pending (`.env` file blocker)

**Pending:**
- ⏳ M1-FE-6: Provider Onboarding (this task)
- ⏳ M1-BE-9: Provider Onboarding API

**Note:** M1-BE-7 setup blocker does NOT affect M1-FE-6. You can proceed independently.

---

## 🚀 Next Steps

1. **Review Task Document:** `docs/tasks/TASK_M1_FE_ONBOARDING.md`
2. **Review Mockups:** All 6 provider onboarding pages in `docs/mockups/`
3. **Begin Implementation:** Start with provider welcome page
4. **Notify PM:** When implementation complete, ready for review

---

## 📞 What to Revert Back

Please reply with:

1. **Confirmation:** "Ready to start M1-FE-6" or "Need clarification on [specific item]"
2. **Timeline:** Estimated completion date
3. **Questions:** Any blockers or clarifications needed
4. **Progress Updates:** As you complete each page (optional, but appreciated)

---

**Coordination Hub:** `docs/coordination/COORDINATION_HUB.md`  
**Agent Status Board:** `docs/coordination/AGENT_STATUS_BOARD.md`  
**Task Document:** `docs/tasks/TASK_M1_FE_ONBOARDING.md`

---

**Created:** 2025-01-11  
**PM:** Project Manager  
**Status:** ⏳ **ASSIGNED** — Awaiting Frontend Engineer confirmation

