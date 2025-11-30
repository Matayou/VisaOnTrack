# Path C: Build It Right - Comprehensive 6-Week Plan

**Goal:** Production-grade, polished, optimized application
**Timeline:** 4-6 weeks (with 1-2 developers)
**Philosophy:** Do it once, do it right

---

## 📊 Overview

This plan executes the full RECOVERY_PLAN.md with additional polish, testing, and optimization. You'll build a world-class application that's:

- ✅ Type-safe (zero `as any` casts)
- ✅ Performance-optimized (50-60% faster load times)
- ✅ Design system consistent (single source of truth)
- ✅ Well-tested (comprehensive coverage)
- ✅ Production-ready (error handling, monitoring)
- ✅ Documented (team can onboard easily)

---

## 🗓️ 6-Week Timeline

### Week 1: Foundation & Critical Features
**Goal:** Unblock MVP, fix contract/SDK issues

**Days 1-2: OpenAPI & SDK Alignment** (RECOVERY_PLAN Phase 1)
- [ ] Update OpenAPI spec with missing endpoints:
  - `/requests/{id}/unlock` (exists in code, not in spec)
  - `/providers/me` (exists in code, not in spec)
  - Add `intakeData` field to Request schema
  - Add `updatedAt` field to Request schema
  - Correct `PlanCode` enum (Free/Pro/Agency)
- [ ] Regenerate client: `pnpm generate:client`
- [ ] Bump `OpenAPI.VERSION` to match spec
- [ ] Run typecheck: `pnpm typecheck`

**Days 3-4: Test & Polish Messaging System**
- [ ] Manual testing checklist:
  - Create new request
  - Navigate to `/requests/[id]/thread`
  - Send text message
  - Upload file attachment (test all supported types)
  - Verify real-time updates (5-second polling)
  - Test on mobile viewport
  - Test error states (network failure, file too large)
- [ ] Fix any bugs found
- [ ] Add loading skeletons
- [ ] Add optimistic updates

**Day 5: Build Proposals UI** (RECOVERY_PLAN Phase 4)
- [ ] Read: `docs/design/COMPONENT_IMPLEMENTATION_GUIDE.md` (Section 3-4)
- [ ] Create `apps/web/app/requests/[id]/components/ProposalCard.tsx`
- [ ] Create `apps/web/app/requests/[id]/components/ProposalForm.tsx`
- [ ] Update `apps/web/app/requests/[id]/components/ProposalsList.tsx`
- [ ] Wire to API: `api.quotes.listQuotes()`, `api.quotes.submitQuote()`
- [ ] Test: Provider can submit, Seeker can view

**Deliverable:** Core features complete, ready for Week 2 polish

---

### Week 2: Consultations & Design System
**Goal:** Revenue features + UI consistency

**Days 1-2: Consultations UI** (RECOVERY_PLAN Phase 4)
- [ ] Read: `RFCs/RFC-005-CONSULTATION_OFFERINGS.md`
- [ ] Read: `RFCs/RFC-005-IMPLEMENTATION-STATUS.md`
- [ ] Create 5 components:
  - [ ] `ConsultationOfferCard.tsx` - Display offer to seeker
  - [ ] `ConsultationOfferForm.tsx` - Provider creates offer
  - [ ] `ConsultationBookingModal.tsx` - Seeker books time slot
  - [ ] `ConsultationsList.tsx` - List all consultations
  - [ ] `ConsultationDashboardWidget.tsx` - Provider dashboard integration
- [ ] Wire to backend API (already complete):
  - `api.consultations.offerConsultation()`
  - `api.consultations.listConsultations()`
  - `api.consultations.bookConsultation()`
  - `api.consultations.completeConsultation()`
  - `api.consultations.cancelConsultation()`
- [ ] Gate with `FeatureGate` component (PRO/AGENCY plans only)
- [ ] Test end-to-end flow

**Days 3-5: Design System Standardization**
- [ ] Read: `docs/design/FORM_MIGRATION_CHECKLIST.md`
- [ ] Migrate auth pages to FormField (6 files):
  - [ ] `app/auth/login/page.tsx`
  - [ ] `app/auth/register/page.tsx`
  - [ ] `app/auth/forgot-password/page.tsx`
  - [ ] `app/auth/reset-password/page.tsx`
  - [ ] `app/auth/verify-email/page.tsx`
  - [ ] `app/auth/resend-verification/page.tsx`
- [ ] Migrate onboarding pages (3 files):
  - [ ] `app/onboarding/provider/business/page.tsx`
  - [ ] `app/onboarding/provider/credentials/page.tsx`
  - [ ] `app/onboarding/provider/services/page.tsx`
- [ ] Migrate other forms (2 files):
  - [ ] `app/requests/[id]/components/RequestEditForm.tsx`
  - [ ] `app/providers/profile/manage/page.tsx`
- [ ] Verify: All inputs use `h-12` (not `h-11`)
- [ ] Verify: All inputs use `rounded-base` (not `rounded-lg`)

**Deliverable:** Revenue features live, UI consistency improved 75%

---

### Week 3: Server Component Migration
**Goal:** 50-60% performance improvement

**Days 1-2: Dashboard Migration**
- [ ] Read: `docs/design/SERVER_COMPONENT_MIGRATION_GUIDE.md` (Section 2.1-2.2)
- [ ] Convert `app/dashboard/page.tsx` to Server Component
- [ ] Move data fetching to server side
- [ ] Implement proper loading states with `loading.tsx`
- [ ] Add error boundary with `error.tsx`
- [ ] Extract client-only parts to separate components
- [ ] Measure performance: Lighthouse scores before/after

**Days 3-4: Marketplace & Listing Pages**
- [ ] Convert `app/providers/dashboard/page.tsx` to Server Component
- [ ] Convert `app/providers/marketplace/page.tsx` to Server Component
- [ ] Implement server-side pagination
- [ ] Implement server-side filters (visaType, location, budget)
- [ ] Implement server-side sorting (newest, highest budget)
- [ ] Use React `cache()` for deduplication
- [ ] Add streaming with `<Suspense>` boundaries

**Day 5: Request Detail Page**
- [ ] Convert `app/requests/[id]/page.tsx` to Server Component
- [ ] Keep messaging client-side (interactive)
- [ ] Server-render request metadata for SEO
- [ ] Implement parallel data fetching
- [ ] Add metadata for social sharing

**Deliverable:** Core pages migrated, 50-60% faster load times

---

### Week 4: Type Safety & Error Handling
**Goal:** Zero type errors, robust error handling

**Days 1-2: Type Safety Fixes**
- [ ] Read: `docs/analysis/NEXTJS_ARCHITECTURE_ANALYSIS.md` (Section 4)
- [ ] Fix type violations in 7 files:
  - [ ] `app/requests/[id]/page.tsx` - Remove `as any` for intakeData
  - [ ] `app/dashboard/page.tsx` - Fix request type assertions
  - [ ] `app/providers/dashboard/page.tsx` - Fix unlock types
  - [ ] `app/providers/marketplace/page.tsx` - Fix filter types
  - [ ] `app/onboarding/provider/credentials/page.tsx` - Fix provider types
  - [ ] `app/requests/[id]/components/MobileActionSheet.tsx` - Fix action types
  - [ ] `app/providers/[id]/page.tsx` - Fix profile types
- [ ] Enable strict TypeScript: `"strict": true` in tsconfig.json
- [ ] Run: `pnpm typecheck` (should be zero errors)
- [ ] Remove all remaining `as any` casts

**Days 3-4: Error Boundaries & Loading States**
- [ ] Create global error boundary: `app/error.tsx`
- [ ] Create 404 page: `app/not-found.tsx`
- [ ] Add error boundaries to each route segment
- [ ] Create loading skeletons for all pages
- [ ] Implement toast notifications for user errors
- [ ] Add retry mechanisms for failed API calls
- [ ] Test error scenarios:
  - Network failure
  - API server down
  - Invalid data
  - Unauthorized access
  - Rate limiting

**Day 5: Pagination Implementation**
- [ ] Add pagination UI to dashboard
- [ ] Add pagination UI to marketplace
- [ ] Implement "Load More" pattern or infinite scroll
- [ ] Add page size selector (10, 25, 50, 100)
- [ ] Add total count display
- [ ] Persist pagination state in URL params

**Deliverable:** Rock-solid application, graceful error handling

---

### Week 5: Testing & Performance
**Goal:** Comprehensive test coverage, optimized bundle

**Days 1-3: Test Coverage**
- [ ] Set up testing framework (if not done):
  - Install Vitest or Jest
  - Install React Testing Library
  - Install Playwright for E2E
- [ ] Unit tests for components:
  - [ ] MessageThread.tsx
  - [ ] MessageComposer.tsx
  - [ ] ProposalCard.tsx
  - [ ] ProposalForm.tsx
  - [ ] ConsultationOfferCard.tsx
  - [ ] FormField.tsx
  - [ ] Button.tsx
- [ ] Integration tests:
  - [ ] Intake wizard flow
  - [ ] Request creation flow
  - [ ] Unlock request flow
  - [ ] Messaging flow
  - [ ] Proposal submission flow
- [ ] E2E tests:
  - [ ] Complete user journey (seeker)
  - [ ] Complete user journey (provider)
  - [ ] Payment flow (when ready)
- [ ] Target: 80%+ code coverage

**Days 4-5: Performance Optimization**
- [ ] Read: `docs/analysis/NEXTJS_ARCHITECTURE_ANALYSIS.md` (Section 11)
- [ ] Bundle analysis: `pnpm build && pnpm analyze`
- [ ] Code splitting optimizations
- [ ] Image optimization (Next.js Image component)
- [ ] Font optimization (next/font)
- [ ] Remove unused dependencies
- [ ] Lazy load heavy components
- [ ] Implement ISR for static pages
- [ ] Add CDN caching headers
- [ ] Lighthouse audit (target: 90+ on all metrics)

**Deliverable:** Well-tested, optimized application

---

### Week 6: Polish & Documentation
**Goal:** Production-ready deployment

**Days 1-2: Security & Middleware**
- [ ] Create auth middleware: `middleware.ts`
- [ ] Implement route protection
- [ ] Add CSRF protection
- [ ] Add rate limiting
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Audit dependencies for vulnerabilities
- [ ] Set up environment variable validation
- [ ] Secure sensitive data (API keys, tokens)

**Days 3-4: Documentation**
- [ ] Update `README.md` with current state
- [ ] Update `PROJECT_STATUS.md`
- [ ] Document all components in Storybook (optional)
- [ ] Create deployment guide
- [ ] Create troubleshooting guide
- [ ] Document architecture decisions
- [ ] Create onboarding guide for new developers
- [ ] Update API documentation

**Day 5: Final QA & Deployment**
- [ ] Full regression testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS, Android)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance testing (load testing)
- [ ] Deploy to staging
- [ ] Stakeholder review
- [ ] Deploy to production
- [ ] Monitor error tracking (Sentry, LogRocket, etc.)
- [ ] Celebrate! 🎉

**Deliverable:** Production-ready, world-class application

---

## 📈 Success Metrics

### Performance Targets
- **First Contentful Paint:** < 1.0s (currently 2.5s)
- **Largest Contentful Paint:** < 2.0s (currently 4.0s)
- **Time to Interactive:** < 2.5s (currently 5.5s)
- **JavaScript Bundle:** < 200kb (currently 450kb)
- **Lighthouse Score:** 90+ (all categories)

### Quality Targets
- **Type Safety:** 100% (zero `as any` casts)
- **Test Coverage:** 80%+ (critical paths 100%)
- **Error Handling:** All routes have error boundaries
- **Accessibility:** WCAG 2.1 AA compliant
- **SEO:** All pages have metadata, OG tags

### Code Quality Targets
- **Component Consistency:** 100% FormField usage (22/22 files)
- **Server Components:** 80% of pages (currently 4%)
- **Design System:** All components use design tokens
- **Documentation:** All features documented

---

## 📚 Reference Documents (Read as Needed)

### Week 1 References
- `docs/analysis/RECOVERY_PLAN.md` - Overall plan
- `docs/design/COMPONENT_IMPLEMENTATION_GUIDE.md` - Component specs

### Week 2 References
- `RFCs/RFC-005-CONSULTATION_OFFERINGS.md` - Consultations feature
- `docs/design/FORM_MIGRATION_CHECKLIST.md` - Form migration guide
- `docs/design/TAILWIND_QUICK_REFERENCE.md` - Design tokens

### Week 3 References
- `docs/design/SERVER_COMPONENT_MIGRATION_GUIDE.md` - Migration patterns
- `docs/analysis/NEXTJS_ARCHITECTURE_ANALYSIS.md` - Architecture audit

### Week 4 References
- `docs/analysis/NEXTJS_ARCHITECTURE_ANALYSIS.md` - Type safety issues
- Next.js error handling docs

### Week 5 References
- Testing framework documentation
- Next.js performance docs
- Bundle analyzer output

### Week 6 References
- Next.js middleware docs
- Security best practices
- Deployment platform docs

---

## 🎯 Daily Workflow

Each day, follow this pattern:

1. **Morning (30 min):**
   - Review todo list
   - Read relevant docs for today's tasks
   - Plan the day's work

2. **Work (6-7 hours):**
   - Focus on completing tasks
   - Take breaks every 90 minutes
   - Ask questions when blocked

3. **End of Day (30 min):**
   - Test what you built
   - Commit your work
   - Update todo list
   - Document any decisions or blockers

---

## 🆘 Getting Help

**If you get stuck:**

1. Check the relevant reference doc for that week
2. Search for similar patterns in existing code
3. Review the component implementation guide
4. Ask for clarification on specific tasks

**Common blockers:**

- "TypeScript errors after SDK regeneration" → Check OpenAPI spec matches backend
- "Server Component not working" → Check for client-only hooks (`useState`, `useEffect`)
- "Form migration breaking" → Use exact FormField props from guide
- "Performance not improving" → Check bundle analyzer for heavy imports

---

## 📊 Progress Tracking

Track your progress weekly:

**Week 1:**
- [ ] OpenAPI updated and SDK regenerated
- [ ] Messaging system tested and polished
- [ ] Proposals UI complete

**Week 2:**
- [ ] Consultations UI complete
- [ ] 11 forms migrated to FormField

**Week 3:**
- [ ] 5+ pages migrated to Server Components
- [ ] Performance improved 50%+

**Week 4:**
- [ ] Zero TypeScript errors
- [ ] All pages have error boundaries
- [ ] Pagination implemented

**Week 5:**
- [ ] 80%+ test coverage
- [ ] Lighthouse score 90+

**Week 6:**
- [ ] Security middleware in place
- [ ] Documentation complete
- [ ] Production deployment successful

---

## 🚀 You're Building Something Great

This plan will take time, but you'll end up with a **world-class application** that:

- Delights users with performance
- Is maintainable by any developer
- Scales to thousands of users
- Has minimal bugs and issues
- Represents professional-grade work

**Stay focused, stay consistent, and enjoy the process!** 🎯

---

**Last Updated:** 2025-11-30
**Estimated Completion:** Week of 2026-01-13 (with 1 developer)
**Estimated Completion:** Week of 2026-01-06 (with 2 developers)
