# Frontend Recovery Execution Plan

**Date:** November 30, 2024
**Status:** IN PROGRESS
**Developer:** Claude (Frontend-Developer Agent)

## Executive Summary

Executing Phase 3-4 of the Recovery Plan to align frontend with backend capabilities and deliver critical missing features for MVP completion.

---

## Phase 3: Frontend Alignment (Days 3-4) - IN PROGRESS

### 3.1 SDK Type Safety Fixes

**Priority:** HIGH
**Status:** READY TO START

#### Issues to Fix:
1. `apps/web/app/requests/[id]/page.tsx`
   - Line 96: `const intakeData = (request as any).intakeData;`
   - Lines 138-143: Casting for `proposals`, `messages`, `auditLogs`

2. `apps/web/app/providers/dashboard/page.tsx`
   - Line 51: `status: 'OPEN' as any`

#### Solution:
- Request model already includes `intakeData` field - remove cast
- Check OpenAPI spec for proposals/messages/auditLogs relation
- If not in spec, create proper TypeScript interfaces locally

**Files to Update:**
- `apps/web/app/requests/[id]/page.tsx`
- `apps/web/app/providers/dashboard/page.tsx`

---

### 3.2 Unlock UI Enhancement

**Priority:** MEDIUM
**Status:** PARTIALLY COMPLETE

**Current State:**
- Basic unlock button exists in provider dashboard (line 242)
- Handles zero credits scenario (line 70-73)
- Uses hardcoded cost assumption

**Improvements Needed:**
- Fetch configurable unlock cost from backend
- Show cost in UI before unlock
- Better error handling for insufficient credits
- Redirect to `/pricing` or `/account/billing` on zero credits

**Files to Update:**
- `apps/web/app/providers/dashboard/page.tsx`
- `apps/web/app/providers/marketplace/page.tsx` (if exists)

---

### 3.3 Marketplace Filters & Pagination

**Priority:** MEDIUM
**Status:** TO IMPLEMENT

**Requirements:**
- Server-side pagination (page, limit)
- Filter by: visaType, location, budget range
- Sort by: newest (createdAt desc), highest budget (budgetMax desc)
- Remove fake match/competition data

**API Available:**
```typescript
api.requests.listRequests({
  page: 1,
  limit: 20,
  status: 'OPEN',
  // Add: visaType, location, budgetMin, budgetMax, sortBy
})
```

**Files to Create/Update:**
- `apps/web/app/providers/marketplace/page.tsx`
- `apps/web/components/RequestFilters.tsx` (new)

---

## Phase 4: Missing Core Features (Days 5-8) - CRITICAL

### 4.1 Messaging System (BLOCKING MVP)

**Priority:** CRITICAL
**Status:** NOT STARTED
**Estimate:** 6-8 hours

#### Backend APIs Available:
```typescript
// List messages
api.messages.listMessages({ id: requestId, page: 1, limit: 20 })

// Send message
api.messages.sendMessage({
  id: requestId,
  requestBody: { content, attachmentIds }
})

// Upload attachment
api.messages.uploadAttachment({
  formData: { file }
})
```

#### Components to Build:

**1. MessageThread Component**
`apps/web/app/requests/[id]/components/MessageThread.tsx`

Features:
- Display messages in chronological order
- Sender/recipient distinction (seeker vs provider)
- Timestamp formatting
- Attachment display (with download links)
- Loading states
- Pagination (load more)
- Auto-scroll to bottom on new message

**2. MessageComposer Component**
`apps/web/app/requests/[id]/components/MessageComposer.tsx`

Features:
- Textarea with auto-resize
- Character count (2000 char limit?)
- File attachment area
- Drag-and-drop support
- File preview (images show thumbnail)
- File size validation
- MIME type validation (pdf, jpg, png, webp, docx, xlsx)
- Multiple file support (up to entitlement limit)
- Send button (disabled when empty/uploading)
- Upload progress indicator

**3. AttachmentUploader Component**
`apps/web/components/AttachmentUploader.tsx`

Features:
- Drag-drop zone
- Click to browse
- File list with remove option
- Size/type validation
- Progress bars
- Error display
- Reusable across app

**4. Thread Page**
`apps/web/app/requests/[id]/thread/page.tsx`

Features:
- Full-screen message view
- Header with request title
- Back button to request detail
- MessageThread + MessageComposer
- Real-time updates (polling or websocket)
- Unread count tracking
- Mobile-optimized

#### Data Flow:
```
1. User types message
2. User adds files (optional)
3. Click send:
   a. Upload files → get attachment IDs
   b. Send message with attachmentIds
   c. Clear composer
   d. Append to thread
4. Poll for new messages every 5s
```

---

### 4.2 Proposals System

**Priority:** HIGH
**Status:** PARTIAL (ProposalsList exists but stubbed)
**Estimate:** 4-6 hours

#### Backend APIs Available:
```typescript
// Submit quote/proposal
api.quotes.submitQuote({
  id: requestId,
  requestBody: {
    packageId?,
    description,
    totalPrice,
    deliveryDays,
    items: [{ description, price }]
  }
})

// Get quote
api.quotes.getQuote({ id: quoteId })

// Update quote status
api.quotes.updateQuote({
  id: quoteId,
  requestBody: { status: 'ACCEPTED' | 'DECLINED' }
})
```

#### Components to Build:

**1. ProposalSubmitForm Component**
`apps/web/app/requests/[id]/components/ProposalSubmitForm.tsx`

Features:
- Service package dropdown (provider's packages)
- Custom proposal option
- Line items builder (add/remove)
- Total price calculation
- Delivery timeline (days)
- Description/pitch textarea
- Submit button
- Validation
- Success/error states

**2. ProposalCard Component**
`apps/web/app/requests/[id]/components/ProposalCard.tsx`

Features:
- Provider info (name, rating, photo)
- Price display
- Delivery timeline
- Line items breakdown
- Description
- Accept/Decline buttons (seeker view)
- Edit/Withdraw buttons (provider view)
- Status badge (pending/accepted/declined)

**3. Update ProposalsList**
`apps/web/app/requests/[id]/components/ProposalsList.tsx`

Current Issues:
- Likely shows mock data
- No real API integration

Fixes:
- Fetch quotes from API
- Map to ProposalCard components
- Handle empty state
- Provider can submit new proposal
- Seeker can accept/decline

---

### 4.3 Consultations UI

**Priority:** HIGH
**Status:** NOT STARTED
**Estimate:** 6-8 hours

#### Backend APIs Available (100% Ready):
```typescript
// Offer consultation (provider)
api.consultations.offerConsultation({
  id: requestId,
  requestBody: {
    type: 'FREE' | 'PAID',
    price?,
    duration,
    description,
    availableSlots: ['2024-12-01T14:00:00Z']
  }
})

// List consultations
api.consultations.listConsultations({ id: requestId })

// Book consultation (seeker)
api.consultations.bookConsultation({
  id: consultationId,
  requestBody: {
    selectedSlot: '2024-12-01T14:00:00Z'
  }
})

// Complete/Cancel
api.consultations.completeConsultation({ id })
api.consultations.cancelConsultation({ id })
```

#### Components to Build:

**1. ConsultationOfferCard Component**
`apps/web/app/requests/[id]/components/ConsultationOfferCard.tsx`

Features:
- Provider info
- Free vs Paid badge
- Price (if paid)
- Duration (15min, 30min, 1hr)
- Description/pitch
- Available time slots
- "Book Now" button (seeker view)
- Status: OFFERED, BOOKED, COMPLETED, CANCELLED

**2. ConsultationOfferForm Component**
`apps/web/app/providers/components/ConsultationOfferForm.tsx`

Features:
- Type selector (Free/Paid)
- Price input (if paid)
- Duration dropdown
- Description textarea
- Availability picker (date/time slots)
- Multiple slot support
- Submit button
- **Gated by FeatureGate** (PRO/AGENCY only)

**3. ConsultationBookingModal Component**
`apps/web/components/ConsultationBookingModal.tsx`

Features:
- Time slot selection
- Calendar view (optional)
- Confirmation details
- Payment handling (if paid)
- Book button
- Success/error states

**4. ConsultationsList Component**
`apps/web/app/requests/[id]/components/ConsultationsList.tsx`

Features:
- List all consultations for request
- Filter by status
- Seeker view: book offered consultations
- Provider view: manage offered consultations
- Integration into request detail page

**5. Provider Dashboard Integration**
`apps/web/app/providers/dashboard/page.tsx`

Add section:
- Upcoming consultations
- Consultation offers sent
- Quick action to offer consultation

---

## Implementation Strategy

### Day 1-2: Messaging System (CRITICAL PATH)
1. ✅ Create MessageThread component (2h)
2. ✅ Create MessageComposer component (2h)
3. ✅ Create AttachmentUploader component (1.5h)
4. ✅ Create thread page + routing (1h)
5. ✅ Integration testing (1.5h)

### Day 3: Proposals System
1. ✅ Update ProposalsList to use real API (1h)
2. ✅ Create ProposalCard component (1.5h)
3. ✅ Create ProposalSubmitForm component (2h)
4. ✅ Integration + testing (1.5h)

### Day 4: Consultations UI
1. ✅ Create ConsultationOfferCard (1.5h)
2. ✅ Create ConsultationOfferForm (2h)
3. ✅ Create ConsultationBookingModal (1.5h)
4. ✅ Create ConsultationsList + integration (2h)
5. ✅ Provider dashboard integration (1h)

### Day 5: Polish & Testing
1. ✅ Fix all TypeScript errors
2. ✅ Remove `as any` casts
3. ✅ Test all flows end-to-end
4. ✅ Mobile responsive checks
5. ✅ Accessibility audit
6. ✅ Documentation

---

## Technical Standards

### TypeScript
- Strict mode enabled
- No `as any` casts
- Proper error handling
- Type guards for API responses

### React/Next.js
- Client components for interactivity
- Server components where possible
- Proper loading states
- Error boundaries
- Optimistic updates

### Styling
- Tailwind CSS (existing design system)
- Mobile-first responsive
- iOS-style cards
- Consistent spacing (4px grid)
- Lucide React icons

### API Integration
- Use `@visaontrack/client` SDK
- Proper error handling with `getErrorDisplayMessage`
- Loading states with `Spinner` component
- 401 redirects to login
- Retry on failure

### File Upload
- Client-side validation (size, type)
- Progress indicators
- Error display
- Preview for images
- Drag-drop support

---

## Success Criteria

### Messaging System
- ✅ Users can send/receive messages on requests
- ✅ File attachments upload successfully
- ✅ Messages display chronologically
- ✅ Mobile responsive
- ✅ Real-time feel (polling)

### Proposals System
- ✅ Providers can submit proposals
- ✅ Seekers can view/accept/decline
- ✅ Proper status tracking
- ✅ Line items display correctly

### Consultations UI
- ✅ PRO/AGENCY providers can offer consultations
- ✅ FREE providers see upgrade prompt
- ✅ Seekers can book consultations
- ✅ Time slots work correctly
- ✅ Payment flow (if paid)

### Overall Quality
- ✅ Zero TypeScript errors
- ✅ Zero `as any` casts
- ✅ All components accessible
- ✅ Mobile responsive
- ✅ Consistent design system

---

## Next Actions

**Immediate (Today):**
1. Start with Messaging System (MessageThread component)
2. Build AttachmentUploader (reusable)
3. Create MessageComposer
4. Wire up thread page

**Tomorrow:**
1. Complete messaging system testing
2. Build Proposals UI
3. Start Consultations components

**Notes:**
- Consultations backend is 100% ready - just needs UI
- Messaging is BLOCKING - prioritize first
- Proposals partially exist - update existing code
- All APIs are available and tested

---

*Document created: November 30, 2024*
*Last updated: November 30, 2024*
*Status: IN PROGRESS*
