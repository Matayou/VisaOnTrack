# Consultation Feature - UI/UX Mockups

**Date:** 2025-11-28
**Feature:** RFC-005 Consultation Offerings
**Status:** Design Review Ready

---

## Overview

Three HTML mockups have been created to demonstrate the consultation feature integration across both seeker and provider experiences. These mockups follow the existing design system and component patterns used throughout SawadeePass.

## Files Created

### 1. `consultation-seeker-view-v1.html`
**Purpose:** Shows how seekers view and interact with consultation offers on their request detail page

**Key Features:**
- Consultations section positioned between RequestOverview and Proposals
- Info banner explaining consultation purpose
- Two consultation cards (FREE and PAID examples)
- Clear visual distinction between free and paid offerings
- Provider reputation indicators (verified badge, ratings)
- Detailed consultation information (duration, platform, inclusions)
- Direct "Book" CTAs
- Empty state design (commented out in code)
- Updated activity timeline showing consultation offers
- Updated stats widget showing consultation count

**Design Decisions:**
- **Placement:** Inserted between overview and proposals to encourage early engagement
- **Visual Hierarchy:** Free consultations use green gradient badges, paid use blue
- **Information Density:** Balanced detail with scannability - key info visible at glance
- **Trust Signals:** Prominent verified badges, ratings, and review counts
- **Mobile-First:** Responsive grid layout, stacks cleanly on mobile

### 2. `consultation-booking-modal-v1.html`
**Purpose:** Modal interface for booking consultations (both free and paid)

**Key Features:**

**FREE Consultation Modal:**
- Provider summary card with trust indicators
- "What to expect" section with bullet points
- Date/time picker with timezone indicator
- Optional notes field for seeker questions
- Email confirmation notice
- Simple two-button footer (Cancel / Confirm)

**PAID Consultation Modal:**
- All FREE features plus:
- Enhanced "What's included" section
- Stripe Payment Element placeholder
- Order summary breakdown
- Cancellation policy notice
- "Pay & Confirm" CTA showing price

**Design Decisions:**
- **Two States:** Separate mockups for free vs paid to show payment integration
- **Progressive Disclosure:** Information revealed in logical order (provider → details → schedule → payment)
- **Trust Building:** Multiple reassurance elements (confirmation email, cancellation policy, what's included)
- **Payment UX:** Clear order summary, Stripe element placeholder, transparent pricing
- **Mobile Optimization:** Modal scrolls within viewport, sticky header/footer

### 3. `consultation-provider-offer-v1.html`
**Purpose:** Shows providers how to offer consultations from unlocked requests

**Key Features:**

**Dashboard View:**
- Updated request card with new action buttons
- Blue info banner explaining options ("Offer consultation first or send quote")
- Two distinct CTAs: "Offer Call" (secondary) and "Send Quote" (primary)
- Locked vs unlocked request comparison
- Maintains existing credit system UI

**Offer Consultation Modal:**
- Radio card selection: FREE vs PAID
- Visual differentiation between consultation types
- Dynamic price field (shows/hides based on selection)
- Duration dropdown with contextual descriptions
- Rich text area for describing discussion topics
- Optional meeting link field
- "How it works" info box
- Validation hints (character limits, price ranges)

**Design Decisions:**
- **Non-Disruptive:** Consultation offering is optional, quote flow remains primary
- **Clear Choice:** Radio cards make FREE vs PAID selection obvious
- **Guided Input:** Placeholder text, character limits, and validation hints reduce errors
- **Flexibility:** Meeting link optional to allow async scheduling
- **Education:** Info box explains workflow for new providers

---

## Design System Compliance

All mockups adhere to the existing SawadeePass design system:

### Colors
- **Primary:** `#2563eb` (Blue 600) for CTAs and interactive elements
- **Success/Free:** Green gradient badges for free consultations
- **Info/Paid:** Blue gradient badges for paid consultations
- **Text:** Gray scale hierarchy (900 → 700 → 500 → 400)

### Typography
- **Font:** Inter with system fallbacks
- **Headings:** Bold 900, sizes 16-24px
- **Body:** Regular 400-500, size 14px
- **Labels:** Semibold 600, size 12-14px

### Components
- **Cards:** `.ios-card` style with rounded corners, subtle shadows
- **Buttons:** Primary gradient, secondary outline, consistent padding/radius
- **Form Inputs:** Standard height (48px), rounded-base (8px), focus states
- **Badges:** Rounded, colored backgrounds, semibold text
- **Icons:** Lucide React style, 16-20px, consistent stroke width

### Spacing
- **Card Padding:** 20-24px (p-5/p-6)
- **Section Gaps:** 16-24px (gap-4/gap-6)
- **Element Margins:** 8-16px (mb-2/mb-4)

### Responsive Behavior
- **Breakpoints:** Mobile-first, lg breakpoint at 1024px
- **Layout:** Single column mobile → Two/three column desktop
- **Touch Targets:** Minimum 44x44px for buttons
- **Typography:** Scales sm → base → lg at breakpoints

---

## User Flows Demonstrated

### Seeker Flow
1. **Discover:** See consultation offers on request detail page
2. **Compare:** Review free vs paid options, provider info
3. **Book FREE:** Select time → Add notes → Confirm
4. **Book PAID:** Select time → Add notes → Pay → Confirm
5. **Receive:** Email confirmation with meeting link

### Provider Flow
1. **Unlock:** Spend credit to view request details
2. **Decide:** Offer consultation OR send quote directly
3. **Configure:** Choose FREE/PAID → Set duration → Describe topics
4. **Offer:** Submit consultation offer to seeker
5. **Confirm:** Receive booking notification → Add meeting link

---

## Implementation Notes

### Component Mapping

**Seeker View (`consultation-seeker-view-v1.html`):**
```
<ConsultationsList requestId={id}>
  <ConsultationCard consultation={c} onBook={handleBook} />
  <ConsultationEmptyState />
</ConsultationsList>
```

**Booking Modal (`consultation-booking-modal-v1.html`):**
```
<ConsultationBookingModal
  consultation={consultation}
  onConfirm={handleBooking}
  onCancel={closeModal}
/>
```

**Provider Offer (`consultation-provider-offer-v1.html`):**
```
<OfferConsultationModal
  requestId={requestId}
  onSubmit={handleOfferConsultation}
  onCancel={closeModal}
/>
```

### API Integration Points

1. **Fetch Consultations:** `GET /requests/{id}/consultations`
2. **Offer Consultation:** `POST /requests/{id}/consultations`
3. **Book Consultation:** `POST /consultations/{id}/book`
4. **Create Payment Intent:** Stripe integration for paid bookings

### State Management

```typescript
// Seeker
const [consultations, setConsultations] = useState<Consultation[]>([]);
const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

// Provider
const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
const [consultationType, setConsultationType] = useState<'FREE' | 'PAID'>('FREE');
```

---

## Next Steps

### Phase 2A: Seeker Components (2-3 hours)
1. ✅ HTML mockups complete
2. ⏳ Build `ConsultationsList.tsx` component
3. ⏳ Build `ConsultationCard.tsx` sub-component
4. ⏳ Build `ConsultationBookingModal.tsx` component
5. ⏳ Integrate into `/requests/[id]` page

### Phase 2B: Provider Components (2-3 hours)
1. ✅ HTML mockups complete
2. ⏳ Build `OfferConsultationModal.tsx` component
3. ⏳ Update provider dashboard request cards
4. ⏳ Add action button logic

### Phase 2C: Payment Integration (2-3 hours)
1. ⏳ Add Stripe Elements to booking modal
2. ⏳ Implement PaymentIntent creation
3. ⏳ Add webhook handlers for payment confirmation
4. ⏳ Test full paid consultation flow

---

## Design Review Questions

1. **Information Hierarchy:** Is the consultation section prominent enough without overwhelming the page?
2. **Trust Signals:** Are the provider verification badges and ratings sufficient?
3. **Pricing Display:** Is the paid consultation pricing clear and justified?
4. **Mobile UX:** Do modals work well on mobile devices? Should we consider full-page overlays?
5. **Empty States:** Is the consultation empty state helpful and actionable?
6. **Provider Actions:** Is the "Offer Call" vs "Send Quote" decision clear to providers?

---

## Changelog

### 2025-11-28 - Initial Mockups
- Created seeker view with consultations list
- Created booking modal (free + paid variants)
- Created provider offer modal
- All designs follow existing SawadeePass design system
- Mobile-responsive layouts implemented
- Accessibility considerations included (ARIA, focus states)

---

**Status:** ✅ Ready for review and implementation

**Reviewers:** Product team, UX lead, Frontend engineers

**Files:**
- `consultation-seeker-view-v1.html` (Seeker experience)
- `consultation-booking-modal-v1.html` (Booking interface)
- `consultation-provider-offer-v1.html` (Provider offering)
