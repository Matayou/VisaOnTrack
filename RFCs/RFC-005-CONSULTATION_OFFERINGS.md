# RFC-005: Consultation Offerings (Pre-Quote Discovery Calls)

**Status:** 🟡 DRAFT
**Created:** 2025-11-28
**Author:** Product Team
**Priority:** HIGH (Reduces friction in provider-seeker engagement)

---

## Problem

**Current Flow:**
```
Seeker posts request → Provider unlocks (1 credit) → Provider sends quote
```

**Friction Points:**
1. **Providers** spend credits without knowing if seeker's needs fit their expertise
2. **Seekers** receive quotes without understanding provider's working style/approach
3. **No discovery phase** - both parties jump straight to pricing
4. **High rejection rate** - quotes don't match expectations

**User Feedback:**
- Providers: "I waste credits on requests that aren't a good fit"
- Seekers: "I don't know which provider to choose - quotes all look similar"
- Both: "I wish I could talk to the provider before committing"

---

## Proposal

Add **Consultation Offerings** - lightweight, pre-quote discovery calls that providers can offer (free or paid) before sending a full quote.

### User Flow

#### Provider Perspective:
```
1. Provider unlocks request (1 credit)
2. Provider offers consultation (instead of/before quote)
   - Free 15-min call OR
   - Paid 30-min call (฿500-฿2000)
3. Seeker books consultation slot
4. Call happens (via Zoom/Google Meet link)
5. Provider decides to send quote (or not)
```

#### Seeker Perspective:
```
1. Seeker posts request
2. Seeker receives consultation offers (not quotes)
3. Seeker compares: free vs. paid, provider profiles
4. Seeker books 1-3 consultations
5. After calls, seeker receives quotes from interested providers
```

---

## Benefits

### For Providers:
- ✅ **Qualify leads** before spending time on detailed quotes
- ✅ **Showcase expertise** - stand out from competitors
- ✅ **Earn upfront** - paid consultations generate immediate revenue
- ✅ **Higher conversion** - quotes sent after call have better acceptance rate

### For Seekers:
- ✅ **Better decisions** - meet providers before choosing
- ✅ **Clearer expectations** - understand what's included
- ✅ **Free options** - many providers offer free discovery calls
- ✅ **Faster trust building** - human connection before transaction

### For Platform:
- ✅ **Higher engagement** - consultations are sticky (calendar bookings)
- ✅ **More transactions** - paid consultations = immediate GMV
- ✅ **Better matches** - fewer disputes, higher satisfaction
- ✅ **Differentiation** - competitors (Upwork, Fiverr) don't have this

---

## Technical Design

### 1. Data Model (Prisma Schema)

```prisma
enum ConsultationType {
  FREE
  PAID
}

enum ConsultationStatus {
  OFFERED      // Provider offered, seeker hasn't booked
  BOOKED       // Seeker booked, awaiting call
  COMPLETED    // Call happened
  CANCELLED    // Either party cancelled
  EXPIRED      // Offer expired (7 days)
}

model Consultation {
  id              String             @id @default(uuid())
  requestId       String
  providerId      String
  type            ConsultationType
  priceTHB        Decimal?           @db.Decimal(10, 2) // Null for FREE
  durationMinutes Int                // 15, 30, 45, 60
  description     String?            @db.Text // What will be discussed
  meetingLink     String?            @db.VarChar(500) // Zoom/Google Meet URL
  scheduledAt     DateTime?          // When call is scheduled
  status          ConsultationStatus @default(OFFERED)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  // Relations
  request  Request         @relation(fields: [requestId], references: [id], onDelete: Cascade)
  provider ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Restrict)
  payment  ConsultationPayment?

  @@index([requestId])
  @@index([providerId])
  @@index([status])
}

model ConsultationPayment {
  id                String   @id @default(uuid())
  consultationId    String   @unique
  stripePaymentIntentId String @unique @db.VarChar(255)
  amountTHB         Decimal  @db.Decimal(10, 2)
  status            String   @db.VarChar(50) // succeeded, pending, failed
  createdAt         DateTime @default(now())

  // Relations
  consultation Consultation @relation(fields: [consultationId], references: [id], onDelete: Cascade)

  @@index([consultationId])
}
```

### 2. API Endpoints (OpenAPI)

```yaml
/requests/{id}/consultations:
  post:
    summary: Offer consultation
    description: Provider offers consultation (free or paid) to seeker
    operationId: offerConsultation
    security:
      - cookieAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/OfferConsultationRequest'
    responses:
      '201':
        description: Consultation offered
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Consultation'
      '403':
        $ref: '#/components/responses/Forbidden'
        description: Provider hasn't unlocked request

  get:
    summary: List consultations
    description: Get all consultation offers for a request
    operationId: listConsultations
    security:
      - cookieAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      '200':
        description: Consultation list
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Consultation'

/consultations/{id}/book:
  post:
    summary: Book consultation
    description: Seeker books consultation slot
    operationId: bookConsultation
    security:
      - cookieAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/BookConsultationRequest'
    responses:
      '200':
        description: Consultation booked
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookConsultationResponse'
      '402':
        description: Payment required (for paid consultations)
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaymentRequiredResponse'

/consultations/{id}/complete:
  post:
    summary: Mark consultation complete
    description: Provider marks consultation as completed
    operationId: completeConsultation
    security:
      - cookieAuth: []
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      '200':
        description: Consultation marked complete
      '403':
        $ref: '#/components/responses/Forbidden'
```

**Request/Response Schemas:**

```yaml
OfferConsultationRequest:
  type: object
  required:
    - type
    - durationMinutes
  properties:
    type:
      $ref: '#/components/schemas/ConsultationType'
    priceTHB:
      type: number
      minimum: 0
      description: Price (required for PAID type)
    durationMinutes:
      type: integer
      enum: [15, 30, 45, 60]
    description:
      type: string
      maxLength: 1000
      description: What will be discussed in the call
    meetingLink:
      type: string
      format: uri
      description: Zoom/Google Meet link (optional, can add later)

BookConsultationRequest:
  type: object
  required:
    - scheduledAt
  properties:
    scheduledAt:
      type: string
      format: date-time
      description: When seeker wants to have the call
    notes:
      type: string
      maxLength: 500
      description: Seeker's notes/questions for the call

BookConsultationResponse:
  type: object
  properties:
    consultation:
      $ref: '#/components/schemas/Consultation'
    paymentIntent:
      type: object
      description: Stripe PaymentIntent (only for paid consultations)
      properties:
        clientSecret:
          type: string
        amount:
          type: number
```

### 3. Frontend Components

#### Provider Dashboard - Request Detail:
```tsx
// apps/web/app/providers/dashboard/[requestId]/components/ConsultationOffer.tsx

interface ConsultationOfferProps {
  requestId: string;
  onOffered: () => void;
}

export function ConsultationOffer({ requestId, onOffered }: ConsultationOfferProps) {
  const [type, setType] = useState<'FREE' | 'PAID'>('FREE');
  const [price, setPrice] = useState<number>(1000);
  const [duration, setDuration] = useState<15 | 30 | 45 | 60>(30);

  return (
    <Card>
      <h3>Offer Consultation</h3>
      <p>Talk to the seeker before sending a quote</p>

      {/* Type toggle */}
      <SegmentedControl
        value={type}
        onChange={setType}
        options={[
          { value: 'FREE', label: 'Free Call' },
          { value: 'PAID', label: 'Paid Call' }
        ]}
      />

      {/* Duration picker */}
      <Select value={duration} onChange={setDuration}>
        <option value={15}>15 minutes (Quick intro)</option>
        <option value={30}>30 minutes (Standard)</option>
        <option value={45}>45 minutes (Deep dive)</option>
        <option value={60}>60 minutes (Comprehensive)</option>
      </Select>

      {/* Price input (only for PAID) */}
      {type === 'PAID' && (
        <Input
          type="number"
          label="Price (฿)"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={500}
          max={5000}
          step={100}
        />
      )}

      {/* Description */}
      <Textarea
        label="What will you discuss?"
        placeholder="E.g., I'll review your situation, explain visa options, answer questions about timeline and documents needed."
        maxLength={1000}
      />

      {/* CTA */}
      <Button onClick={handleOfferConsultation}>
        {type === 'FREE' ? 'Offer Free Call' : `Offer ฿${price} Call`}
      </Button>
    </Card>
  );
}
```

#### Seeker Dashboard - Request Detail:
```tsx
// apps/web/app/requests/[id]/components/ConsultationsList.tsx

interface ConsultationsListProps {
  requestId: string;
  consultations: Consultation[];
}

export function ConsultationsList({ requestId, consultations }: ConsultationsListProps) {
  if (!consultations.length) {
    return (
      <EmptyState
        icon={<Calendar />}
        title="No consultations offered yet"
        description="Providers will offer free or paid consultations to discuss your needs before sending quotes."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3>Consultation Offers</h3>

      {/* Free consultations first */}
      {consultations
        .filter(c => c.type === 'FREE')
        .map(consultation => (
          <ConsultationCard
            key={consultation.id}
            consultation={consultation}
            onBook={() => handleBook(consultation.id)}
          />
        ))}

      {/* Paid consultations */}
      {consultations
        .filter(c => c.type === 'PAID')
        .map(consultation => (
          <ConsultationCard
            key={consultation.id}
            consultation={consultation}
            onBook={() => handleBook(consultation.id)}
          />
        ))}
    </div>
  );
}

function ConsultationCard({ consultation, onBook }) {
  return (
    <Card className="hover:border-primary">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Avatar src={consultation.provider.avatar} />
            <div>
              <h4>{consultation.provider.businessName}</h4>
              <span className="text-sm text-gray-500">
                {consultation.provider.yearsExperience} years experience
              </span>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-700">
            {consultation.description}
          </p>

          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {consultation.durationMinutes} minutes
            </span>

            <span className="flex items-center gap-1">
              {consultation.type === 'FREE' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <strong>Free</strong>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  ฿{consultation.priceTHB}
                </>
              )}
            </span>
          </div>
        </div>

        <Button onClick={onBook} size="sm">
          Book Call
        </Button>
      </div>
    </Card>
  );
}
```

---

## Business Logic

### Consultation Lifecycle

```
1. OFFERED
   ↓ (seeker books)
2. BOOKED
   ↓ (payment confirmed for paid consultations)
3. SCHEDULED
   ↓ (call happens, provider marks complete)
4. COMPLETED
```

**Alternative flows:**
- Seeker cancels (< 24h before) → status: CANCELLED, refund issued
- Provider cancels → status: CANCELLED, full refund
- Seeker no-show → status: COMPLETED (provider marks), no refund
- Expires (7 days, no booking) → status: EXPIRED

### Payment Flow (Paid Consultations)

```
1. Seeker clicks "Book Call"
2. Frontend creates Stripe PaymentIntent
   POST /consultations/{id}/book
   → Returns clientSecret
3. Frontend shows Stripe payment form
4. Seeker pays
5. Webhook updates consultation status → SCHEDULED
6. Email + calendar invite sent to both parties
```

### Credit Interaction

**Current:** Provider spends 1 credit to unlock request
**New:** Provider can offer consultation after unlocking (no extra credits)

**Why?** Consultation is an alternative to sending a quote, not an additional step.

---

## Pricing Strategy

### Free Consultations:
- **Duration:** 15-30 minutes
- **Provider Benefit:** Lead generation, showcase expertise
- **Seeker Benefit:** Zero risk, explore options

### Paid Consultations:
- **Pricing Range:** ฿500 - ฿5,000
- **Common Prices:**
  - ฿500-฿1,000: Quick advice (15-30 min)
  - ฿1,500-฿2,500: Standard consultation (30-45 min)
  - ฿3,000-฿5,000: Premium deep dive (60 min)

**Platform Fee:**
- 15% on paid consultations (matches quote fee)
- No fee on free consultations

**Provider Payout:**
- Immediate after consultation marked COMPLETED
- 85% of consultation price
- Via Stripe Connect

---

## Migration Plan

### Phase 1: MVP (Week 1-2)
- [ ] Add Consultation model to Prisma
- [ ] Create API endpoints (offer, list, book, complete)
- [ ] Build provider "Offer Consultation" UI
- [ ] Build seeker "View Consultations" UI
- [ ] Add Stripe payment for paid consultations
- [ ] Email notifications (booking confirmed, reminder)

### Phase 2: Enhancements (Week 3-4)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] In-app meeting links (integrate Zoom/Google Meet)
- [ ] Provider availability calendar
- [ ] Auto-scheduling (seeker picks from available slots)
- [ ] Consultation → Quote conversion tracking

### Phase 3: Advanced (Month 2+)
- [ ] Consultation packages (buy 3 get 1 free)
- [ ] Recurring consultations (monthly retainer)
- [ ] Group consultations (1 provider, multiple seekers)
- [ ] Consultation recordings (opt-in)

---

## Success Metrics

### Provider Adoption:
- **Target:** 40% of providers offer consultations within first month
- **Measure:** consultations_offered / total_active_providers

### Seeker Engagement:
- **Target:** 60% of seekers book at least 1 consultation
- **Measure:** requests_with_booked_consultation / total_requests

### Conversion:
- **Target:** 70% of completed consultations lead to quote
- **Measure:** quotes_sent_after_consultation / consultations_completed

### Revenue:
- **Target:** Paid consultations = 10% of total GMV
- **Measure:** SUM(paid_consultation_revenue) / total_gmv

---

## Risks & Mitigation

### Risk 1: Providers bypass platform
**Scenario:** Provider gives personal contact during call, seeker pays off-platform
**Mitigation:**
- Educate: "Platform protects both parties with escrow, dispute resolution"
- Incentivize: Lower fees for on-platform transactions
- Monitor: Flag keywords in consultation descriptions ("WhatsApp", "direct payment")

### Risk 2: Low paid consultation demand
**Scenario:** Seekers only book free consultations
**Mitigation:**
- Quality signal: Paid consultations = premium providers
- Positioning: "Skip the line" - paid consultations get priority booking
- Social proof: Show "12 people booked this consultation"

### Risk 3: No-shows
**Scenario:** Seeker books, doesn't show up
**Mitigation:**
- Require payment upfront (even for free - ฿100 deposit, refunded after)
- Calendar reminders (email + SMS 24h before, 1h before)
- Penalty: 3 no-shows = consultation booking suspended

---

## Alternatives Considered

### Alternative 1: "Pre-Quote Message"
**Idea:** Provider sends message before quote (no call)
**Why Rejected:** Less personal, lower engagement, harder to build trust

### Alternative 2: "Quotes Include Free Call"
**Idea:** Every quote automatically includes 15-min call
**Why Rejected:** Forces calls when not needed, adds friction

### Alternative 3: "Calendar Booking Only (No Consultations)"
**Idea:** Just add calendar to existing quotes
**Why Rejected:** Misses opportunity for upfront revenue, doesn't reduce quote waste

---

## Open Questions

1. **Should consultations count toward provider entitlements?**
   - Free plan: 5 consultations/month?
   - Pro plan: 50 consultations/month?
   - **Recommendation:** No limits for MVP, monitor usage

2. **Should we allow video calls in-platform?**
   - Pro: Keep users on platform, better analytics
   - Con: Complex integration (Twilio, Agora)
   - **Recommendation:** Start with external links (Zoom/Meet), add in-platform later

3. **Refund policy for paid consultations?**
   - **Recommendation:**
     - Cancel >24h before: 100% refund
     - Cancel <24h before: 50% refund
     - Provider cancels: 100% refund + ฿200 credit
     - No-show: No refund

---

## Implementation Checklist

### Backend:
- [ ] Add Consultation model to Prisma schema
- [ ] Add ConsultationPayment model
- [ ] Create migration
- [ ] Implement `POST /requests/:id/consultations` (offer)
- [ ] Implement `GET /requests/:id/consultations` (list)
- [ ] Implement `POST /consultations/:id/book` (book)
- [ ] Implement `POST /consultations/:id/complete` (complete)
- [ ] Add Stripe PaymentIntent creation for paid consultations
- [ ] Add webhook handler for consultation payments
- [ ] Add consultation expiration cron job (7 days)
- [ ] Add email notifications (booking, reminder, completed)

### Frontend:
- [ ] Create `ConsultationOffer` component (provider side)
- [ ] Create `ConsultationsList` component (seeker side)
- [ ] Create `ConsultationBooking` modal
- [ ] Add Stripe payment form for paid consultations
- [ ] Add calendar invite generation
- [ ] Add consultation status badges
- [ ] Update request detail page (both provider & seeker views)

### Testing:
- [ ] Unit tests for consultation service
- [ ] Integration tests for consultation API
- [ ] E2E test: Provider offers free consultation → Seeker books → Call happens
- [ ] E2E test: Provider offers paid consultation → Seeker pays → Booking confirmed
- [ ] Payment flow testing (success, failure, refund)

### Documentation:
- [ ] Update OpenAPI spec (v0.2.5 → v0.3.0)
- [ ] Add consultation endpoints to API docs
- [ ] Update user guide (how to offer/book consultations)
- [ ] Add to help center FAQ

---

## Rollout Plan

### Week 1: Alpha (Internal Testing)
- Deploy to staging
- Test with 5 providers + 5 seekers
- Collect feedback

### Week 2: Beta (Early Access)
- Enable for 20% of providers (highest-rated)
- Monitor metrics daily
- Fix bugs, iterate on UX

### Week 3: General Availability
- Enable for all providers
- Announce via email + in-app banner
- Publish blog post: "Introducing Consultations"

### Week 4: Optimization
- Analyze conversion data
- A/B test pricing recommendations
- Add missing features based on feedback

---

## Conclusion

Consultation offerings solve a critical friction point: **providers waste credits on bad-fit leads, seekers struggle to choose between similar-looking quotes.**

By adding a lightweight discovery phase, we:
1. **Reduce waste** - providers qualify leads before detailed quotes
2. **Build trust** - human connection before transaction
3. **Generate revenue** - paid consultations = immediate GMV
4. **Differentiate** - competitors don't have this feature

**Recommendation:** Proceed with Phase 1 MVP (2 weeks implementation).

---

**Approvals Required:**
- [ ] Product Lead
- [ ] Engineering Lead
- [ ] Design Lead
- [ ] Business/Finance

**Next Steps:**
1. Review this RFC in team meeting
2. Get stakeholder sign-off
3. Create implementation tasks
4. Assign to sprint

---

**Questions? Feedback?**
Comment on this RFC or ping @product-team in Slack.
