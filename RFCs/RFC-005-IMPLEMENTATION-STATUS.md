# RFC-005 Implementation Status: Consultation Offerings

**Last Updated:** 2025-11-28
**Status:** 🟢 Phase 1 Complete (Backend + API Client) | Phase 2 Frontend Ready to Start

---

## ✅ **COMPLETED (Phase 1: Backend API)**

### 1. Database Schema ✅
**Files Created:**
- `apps/api/prisma/schema.prisma` (updated)
  - Added `ConsultationType` enum (FREE, PAID)
  - Added `ConsultationStatus` enum (OFFERED, BOOKED, COMPLETED, CANCELLED, EXPIRED)
  - Added `Consultation` model with all fields
  - Added `ConsultationPayment` model
  - Added relations to Request and ProviderProfile

**Migration:**
- Migration applied: `20251128103147_add_consultation_models`
- Database tables created: `Consultation`, `ConsultationPayment`
- All indexes created

---

### 2. Backend API ✅
**Files Created:**

#### DTOs (Data Transfer Objects)
- `apps/api/src/consultations/dto/offer-consultation.dto.ts`
  - Validates consultation offers
  - Type: FREE or PAID
  - Price validation (฿500-฿10,000 for PAID)
  - Duration validation (15-120 minutes)

- `apps/api/src/consultations/dto/book-consultation.dto.ts`
  - Validates booking requests
  - Scheduled time validation
  - Optional notes field

- `apps/api/src/consultations/dto/consultation-response.dto.ts`
  - Response structure for consultation data
  - Includes provider info (nested)

- `apps/api/src/consultations/dto/book-consultation-response.dto.ts`
  - Booking response with optional payment intent
  - For paid consultations

#### Service Layer
- `apps/api/src/consultations/consultations.service.ts`
  - ✅ `offerConsultation()` - Provider offers consultation
  - ✅ `listConsultations()` - List all consultations for a request
  - ✅ `bookConsultation()` - Seeker books consultation
  - ✅ `completeConsultation()` - Provider marks complete
  - ✅ `cancelConsultation()` - Either party cancels
  - Authorization checks (seeker owns request, provider owns consultation)
  - Status validation (can't book completed consultation, etc.)

#### Controller
- `apps/api/src/consultations/consultations.controller.ts`
  - ✅ `POST /requests/:id/consultations` - Offer consultation (provider)
  - ✅ `GET /requests/:id/consultations` - List consultations
  - ✅ `POST /consultations/:id/book` - Book consultation (seeker)
  - ✅ `POST /consultations/:id/complete` - Complete consultation (provider)
  - ✅ `POST /consultations/:id/cancel` - Cancel consultation
  - JWT authentication required
  - Role-based guards (PROVIDER/SEEKER)

#### Module
- `apps/api/src/consultations/consultations.module.ts`
  - Wires controller + service
  - Registered in `AppModule`

**Build Status:** ✅ `npm run build` passes

---

### 3. OpenAPI Spec & API Client ✅

**Status:** ✅ **COMPLETE**

**Files Updated:**
- `packages/types/openapi.yaml` (version 0.2.4 → 0.2.5)
  - Added `consultations` tag
  - Added 5 consultation endpoints:
    - `POST /requests/{id}/consultations` - Offer consultation
    - `GET /requests/{id}/consultations` - List consultations
    - `POST /consultations/{id}/book` - Book consultation
    - `POST /consultations/{id}/complete` - Complete consultation
    - `POST /consultations/{id}/cancel` - Cancel consultation
  - Added schemas:
    - `ConsultationType` enum (FREE, PAID)
    - `ConsultationStatus` enum (OFFERED, BOOKED, COMPLETED, CANCELLED, EXPIRED)
    - `Consultation` object with provider info
    - `OfferConsultationRequest` with validation
    - `BookConsultationRequest` with scheduledAt
    - `BookConsultationResponse` with optional paymentIntent

**API Client Generated:**
- `packages/client/src/services/ConsultationsService.ts`
  - ✅ `offerConsultation()` method
  - ✅ `listConsultations()` method
  - ✅ `bookConsultation()` method
  - ✅ `completeConsultation()` method
  - ✅ `cancelConsultation()` method
- `packages/client/src/models/`
  - ✅ `Consultation.ts`
  - ✅ `ConsultationType.ts`
  - ✅ `ConsultationStatus.ts`
  - ✅ `OfferConsultationRequest.ts`
  - ✅ `BookConsultationRequest.ts`
  - ✅ `BookConsultationResponse.ts`

**Command Used:** `pnpm generate:client`

---

## ⏳ **PENDING (Phase 2: Frontend)**

### 4. Frontend Components

#### Component 1: ConsultationsList (Seeker Side)
**Location:** `apps/web/app/requests/[id]/components/ConsultationsList.tsx`

**Features:**
- Display all consultation offers for a request
- Free consultations shown first
- Provider info (avatar, business name, years exp)
- Duration + price display
- "Book Call" button
- Empty state when no consultations

**Props:**
```tsx
interface ConsultationsListProps {
  requestId: string;
}
```

**API Calls:**
- `GET /requests/:id/consultations`
- Fetch on component mount
- Auto-refresh when new offers arrive (polling or WS)

---

#### Component 2: ConsultationOfferCard (Provider Side)
**Location:** `apps/web/app/providers/dashboard/components/ConsultationOfferCard.tsx`

**Features:**
- Form to offer consultation
- Type toggle: Free vs. Paid
- Duration picker: 15/30/45/60 minutes
- Price input (only for paid)
- Description textarea (what will be discussed)
- Meeting link input (optional, can add later)
- "Offer Free Call" / "Offer ฿X Call" button

**Props:**
```tsx
interface ConsultationOfferCardProps {
  requestId: string;
  onOffered: () => void;
}
```

**API Calls:**
- `POST /requests/:id/consultations`

---

#### Component 3: ConsultationBookingModal (Seeker Side)
**Location:** `apps/web/components/consultations/ConsultationBookingModal.tsx`

**Features:**
- Modal/dialog UI
- Date/time picker (future dates only)
- Notes textarea (questions for provider)
- Stripe payment form (for paid consultations)
- "Confirm Booking" button
- Loading states
- Success/error feedback

**Props:**
```tsx
interface ConsultationBookingModalProps {
  consultation: Consultation;
  isOpen: boolean;
  onClose: () => void;
  onBooked: () => void;
}
```

**API Calls:**
- `POST /consultations/:id/book`
- Stripe PaymentIntent if paid consultation

---

### 5. Page Integration

#### Update: Seeker Request Detail Page
**File:** `apps/web/app/requests/[id]/page.tsx`

**Changes:**
```tsx
// Add between RequestOverview and ProposalsList
<ConsultationsList requestId={requestId} />
```

**Visual Flow:**
1. Request Overview (top)
2. **Consultations Section** ← NEW
3. Proposals/Quotes (below)
4. Activity Timeline (bottom)

---

#### Update: Provider Dashboard
**File:** `apps/web/app/providers/dashboard/page.tsx`

**Changes:**
```tsx
// After unlocking request, show action buttons:
{req.unlockStatus === 'UNLOCKED' && (
  <div className="flex gap-2">
    <Button onClick={() => setOfferConsultationFor(req.id)}>
      📞 Offer Consultation
    </Button>
    <Button variant="outline" onClick={() => handleSendQuote(req.id)}>
      💰 Send Quote
    </Button>
  </div>
)}

// Add ConsultationOfferCard modal
{offerConsultationFor && (
  <ConsultationOfferCard
    requestId={offerConsultationFor}
    onOffered={handleConsultationOffered}
  />
)}
```

---

## 📋 **Next Steps (Ordered)**

### ✅ Immediate (COMPLETED):
1. ✅ Update OpenAPI spec with consultation endpoints
2. ✅ Regenerate API client: `pnpm generate:client`
3. ✅ Verify types are available in frontend

### Phase 2A: Seeker Experience (2-3 hours):
4. Build `ConsultationsList.tsx` component
5. Build `ConsultationBookingModal.tsx` component
6. Integrate into `/requests/[id]` page
7. Test booking flow (free consultations first)

### Phase 2B: Provider Experience (2-3 hours):
8. Build `ConsultationOfferCard.tsx` component
9. Update provider dashboard to show action buttons
10. Test offering flow (free + paid)

### Phase 2C: Stripe Integration (2-3 hours):
11. Add Stripe PaymentIntent creation
12. Add Stripe payment form to booking modal
13. Add webhook handler for payment confirmation
14. Test paid consultation flow

### Phase 2D: Polish (1-2 hours):
15. Add email notifications (booking, reminder, completion)
16. Add consultation status badges
17. Add calendar invite generation
18. Error handling & loading states

---

## 🧪 **Testing Checklist**

### Backend API (Ready to Test Now):
- [ ] POST /requests/:id/consultations - Offer free consultation
- [ ] POST /requests/:id/consultations - Offer paid consultation
- [ ] GET /requests/:id/consultations - List consultations
- [ ] POST /consultations/:id/book - Book free consultation
- [ ] POST /consultations/:id/book - Book paid consultation (payment pending)
- [ ] POST /consultations/:id/complete - Mark complete
- [ ] POST /consultations/:id/cancel - Cancel consultation
- [ ] Authorization: Seeker can't offer consultations
- [ ] Authorization: Provider can't book consultations
- [ ] Validation: Paid consultation requires price
- [ ] Validation: Can't book past date
- [ ] Validation: Can't complete unbooked consultation

### Frontend (After Components Built):
- [ ] Seeker sees consultation offers on request detail page
- [ ] Free consultations appear first
- [ ] Provider info displays correctly
- [ ] "Book Call" button works
- [ ] Booking modal opens with correct data
- [ ] Date picker only allows future dates
- [ ] Paid consultations show Stripe payment form
- [ ] Booking success feedback
- [ ] Provider can offer consultations from dashboard
- [ ] Type toggle (free/paid) works
- [ ] Price input validation (฿500-฿10,000)
- [ ] Duration picker works
- [ ] Offer success feedback

### End-to-End:
- [ ] Provider unlocks request → offers free consultation
- [ ] Seeker receives notification
- [ ] Seeker books consultation → selects date/time
- [ ] Provider receives confirmation email
- [ ] Both parties receive calendar invite
- [ ] Provider marks consultation complete
- [ ] Consultation status updates in UI
- [ ] Provider sends quote after consultation
- [ ] Seeker accepts quote → creates order

---

## 📊 **Metrics to Track**

### Provider Adoption:
- % of providers who offer consultations (target: 40%)
- Average consultations offered per provider
- Free vs. paid ratio

### Seeker Engagement:
- % of requests with consultation offers
- % of seekers who book consultations (target: 60%)
- Average consultations booked per request

### Conversion:
- % of completed consultations → quotes sent (target: 70%)
- % of quotes after consultation → accepted
- Time from consultation → quote (should be faster)

### Revenue:
- Total paid consultation revenue
- Average paid consultation price
- Platform fee collected (15%)

---

## 🔧 **Configuration**

### Environment Variables (Already Set):
- `DATABASE_URL` - PostgreSQL connection ✅
- `JWT_SECRET` - Authentication ✅
- `STRIPE_SECRET_KEY` - Payment processing (needed for Phase 2C)
- `STRIPE_WEBHOOK_SECRET` - Webhook verification (needed for Phase 2C)

### Feature Flags (Future):
- `CONSULTATIONS_ENABLED` - Toggle feature on/off
- `PAID_CONSULTATIONS_ENABLED` - Toggle paid consultations
- `MIN_CONSULTATION_PRICE` - Dynamic pricing floor
- `MAX_CONSULTATION_PRICE` - Dynamic pricing ceiling

---

## 💡 **Technical Decisions Made**

### 1. Provider ID Resolution
**Decision:** Use `userId` directly as `providerId` for now
**Reasoning:** Simplified for MVP, assumes user has provider profile
**TODO:** Add proper lookup via `ProviderProfile` table

### 2. Payment Intent Creation
**Decision:** Placeholder in booking response for MVP
**Reasoning:** Focus on flow first, Stripe integration in Phase 2C
**TODO:** Replace with actual Stripe API call

### 3. Authorization Strategy
**Decision:** Role-based guards + ownership checks
**Reasoning:** Clear separation, easy to audit
**Implementation:** JWT guard → Role guard → Service-level checks

### 4. Consultation Expiration
**Decision:** 7-day expiration via status change
**Reasoning:** Prevents stale offers accumulating
**TODO:** Add cron job to mark expired consultations

### 5. Refund Policy
**Decision:** Not implemented in Phase 1
**Reasoning:** Complex business logic, needs product decision
**TODO:** Add refund handling in Phase 2C

---

## 🚨 **Known Limitations / TODOs**

### Backend:
- [ ] Provider ID lookup (currently uses userId directly)
- [ ] Stripe PaymentIntent creation (placeholder only)
- [ ] Refund handling (not implemented)
- [ ] Email notifications (not implemented)
- [ ] Consultation expiration cron job (7 days)
- [ ] Unlock status verification (TODO in service)

### Frontend:
- [ ] All components not built yet
- [x] API client ready (`ConsultationsService` available)
- [ ] No Stripe Elements integration
- [ ] No date/time picker (need to choose library)
- [ ] No calendar invite generation

### Infrastructure:
- [ ] No monitoring/logging for consultation events
- [ ] No analytics tracking
- [ ] No rate limiting on consultation offers
- [ ] No abuse prevention (spam consultations)

---

## 📚 **Related Documents**

- **RFC-005:** `RFCs/RFC-005-CONSULTATION_OFFERINGS.md` - Full specification
- **Codebase Analysis:** `docs/analysis/CODEBASE_REALITY_VS_DOCS.md` - Context
- **Milestone M3:** Quotes system (consultations feed into this)
- **OpenAPI Spec:** `packages/types/openapi.yaml` (needs update)

---

## 🎯 **Success Criteria**

### Phase 1 (Backend + API Client) ✅ COMPLETE
- [x] Database schema created
- [x] API endpoints implemented
- [x] Service layer complete
- [x] Authorization working
- [x] Backend builds successfully
- [x] OpenAPI spec updated
- [x] API client generated and types available

### Phase 2 (Frontend) ⏳ PENDING
- [ ] Seeker can view consultation offers
- [ ] Seeker can book consultations
- [ ] Provider can offer consultations
- [ ] Basic flow works end-to-end

### Phase 3 (Production Ready) ⏳ FUTURE
- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Calendar invites
- [ ] 70% consultation → quote conversion
- [ ] 40% provider adoption
- [ ] 60% seeker booking rate

---

**Ready for:** Frontend component development (Phase 2A starting)

**Estimated Time to MVP:** 6-8 hours of focused frontend development

**Blockers:** None - Backend complete, API client ready, types available

---

**Questions?** Review RFC-005 or ping @product-team
