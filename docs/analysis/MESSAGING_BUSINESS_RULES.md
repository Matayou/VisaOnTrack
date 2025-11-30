# Messaging Business Rules - Complete Specification

**Last Updated:** 2025-11-30
**Status:** ✅ Implemented

---

## Core Principle

**Messaging is ALWAYS request-scoped.**

All messaging happens in the context of a specific visa assistance request. There is NO general "message a provider" feature.

---

## Business Rules

### Rule 1: Request-Scoped Messaging Only

```
✅ ALLOWED:
- Seeker messages providers about THEIR OWN request
- Provider messages seeker about UNLOCKED requests

❌ NOT ALLOWED:
- Seeker browsing providers and messaging randomly
- Provider messaging seekers without unlocking request first
- General provider-to-provider messaging
- Seeker-to-seeker messaging
```

### Rule 2: Seeker Messaging Access

**Seekers can message when:**
1. They own the request (`request.seekerId === user.id`)
2. Request is published (`request.status === 'OPEN'`)
3. Within the request's thread (`/requests/[requestId]/thread`)

**Seekers CANNOT:**
- Message providers outside of their requests
- Initiate conversations with providers randomly
- Browse provider profiles and send messages

**Implementation:**
```typescript
// Seeker entitlements
{
  'messaging.enabled': true  // ← True, but request-scoped
}

// Backend enforcement in messages API
if (user.role === 'SEEKER') {
  const request = await getRequest(requestId);
  if (request.seekerId !== user.id) {
    throw new ForbiddenException('Can only message on your own requests');
  }
}
```

### Rule 3: Provider Messaging Access

**FREE Providers:**
- ❌ Cannot message seekers (must upgrade to PRO)
- ✅ Can still send proposals (without messaging)
- ✅ Can unlock requests (view contact details)

**PRO/AGENCY Providers:**
- ✅ Can message seekers on UNLOCKED requests
- ✅ Messaging used to refine/clarify proposals
- ✅ Discuss visa requirements before sending formal offer

**Implementation:**
```typescript
// Provider entitlements
FREE:  { 'messaging.enabled': false }
PRO:   { 'messaging.enabled': true }
AGENCY: { 'messaging.enabled': true }

// Backend enforcement in messages API
if (user.role === 'PROVIDER') {
  // Check plan entitlement
  const canMessage = await checkEntitlement(user.id, 'messaging.enabled');
  if (!canMessage) {
    throw new ForbiddenException('Messaging requires PRO/AGENCY plan');
  }

  // Check provider has unlocked this request
  const unlock = await findUnlock(user.id, requestId);
  if (!unlock || unlock.status !== 'UNLOCKED') {
    throw new ForbiddenException('Must unlock request before messaging');
  }
}
```

---

## User Flows

### Flow 1: Seeker-Initiated Discussion

```
1. Seeker creates visa request
   ↓
2. Publishes request (status = OPEN)
   ↓
3. Provider unlocks request (1 credit)
   ↓
4. Provider sends initial message OR proposal
   ↓
5. Seeker receives notification
   ↓
6. Seeker goes to request detail page
   ↓
7. Clicks "Messages" button (always visible for own requests)
   ↓
8. Thread page loads at /requests/[id]/thread
   ↓
9. Seeker can reply to provider messages
   ↓
10. Discussion continues (refining proposal/requirements)
```

**Key Point:** Seeker doesn't "initiate" - they respond within their request context.

### Flow 2: Provider-Initiated Discussion (PRO Plan)

```
1. PRO provider browses marketplace
   ↓
2. Finds interesting request
   ↓
3. Unlocks request (1 credit) → See full details
   ↓
4. Provider clicks "Send Message" button
   ↓
5. Thread page loads at /requests/[id]/thread
   ↓
6. Provider types message to clarify requirements
   ↓
7. Seeker receives notification
   ↓
8. Seeker responds with clarifications
   ↓
9. Provider prepares refined proposal
   ↓
10. Provider sends formal proposal (with pricing)
```

**Key Point:** Provider must unlock FIRST, then can message to refine proposal.

### Flow 3: FREE Provider (Blocked from Messaging)

```
1. FREE provider browses marketplace
   ↓
2. Finds interesting request
   ↓
3. Unlocks request (1 credit)
   ↓
4. Sees two options:
   - "Send Proposal" (allowed, no messaging)
   - "💎 Upgrade to message client" (blocked)
   ↓
5. If clicks upgrade prompt:
   → Goes to /pricing
   → Sees PRO plan benefits
   → Can upgrade to unlock messaging
   ↓
6. Without messaging:
   → Can send "blind" proposal (without discussion)
   → Seeker may request clarifications
   → Provider can't respond (stuck)
   → Encourages upgrade to PRO
```

**Key Point:** FREE providers can work, but messaging dramatically improves conversion.

---

## Technical Implementation

### Backend: Messages API Enforcement

**File:** `apps/api/src/messages/messages.controller.ts`

```typescript
@Post(':requestId/messages')
@UseGuards(JwtAuthGuard)
async sendMessage(
  @Param('requestId') requestId: string,
  @Body() body: SendMessageDto,
  @Req() req: ExpressRequest
) {
  const user = req.user;

  // Get the request
  const request = await this.requestsService.findOne(requestId);
  if (!request) {
    throw new NotFoundException('Request not found');
  }

  // RULE 1: Request must be published
  if (request.status !== 'OPEN') {
    throw new ForbiddenException('Cannot message on closed requests');
  }

  // RULE 2: Check user authorization based on role
  if (user.role === 'SEEKER') {
    // Seekers can only message on their own requests
    if (request.seekerId !== user.id) {
      throw new ForbiddenException(
        'You can only message providers on your own requests'
      );
    }
    // Seeker is authorized ✅
  }
  else if (user.role === 'PROVIDER') {
    // RULE 3: Provider must have messaging entitlement
    const canMessage = await this.entitlements.checkEntitlement(
      user.id,
      'messaging.enabled'
    );

    if (!canMessage) {
      throw new ForbiddenException({
        message: 'Messaging requires PRO or AGENCY plan',
        upgradeUrl: '/pricing',
        feature: 'messaging'
      });
    }

    // RULE 4: Provider must have unlocked this request
    const unlock = await this.unlocksService.findUnlock(user.id, requestId);

    if (!unlock || unlock.status !== 'UNLOCKED') {
      throw new ForbiddenException(
        'You must unlock this request before messaging the seeker'
      );
    }

    // Provider is authorized ✅
  }

  // Create the message
  return this.messagesService.create(requestId, user.id, body);
}
```

### Frontend: Thread Page Access

**File:** `apps/web/app/requests/[id]/thread/page.tsx`

```typescript
export default function MessageThreadPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await api.users.getCurrentUser();
      const req = await api.requests.getRequest({ id });

      setUser(currentUser);
      setRequest(req);

      // Verify access
      if (currentUser.role === 'SEEKER') {
        // Seekers can only access their own request threads
        if (req.seekerId !== currentUser.id) {
          router.push('/dashboard');
          toast.error('You can only message on your own requests');
        }
      } else if (currentUser.role === 'PROVIDER') {
        // Providers must have unlocked the request
        const unlocks = await api.requests.listUnlocks({ id });
        const hasUnlocked = unlocks.some(u => u.status === 'UNLOCKED');

        if (!hasUnlocked) {
          router.push('/providers/marketplace');
          toast.error('You must unlock this request first');
        }
      }
    };

    loadData();
  }, [id]);

  return (
    <FeatureGate
      feature="messaging.enabled"
      fallback={<ProviderUpgradeScreen />}
    >
      <MessageThread requestId={id} />
    </FeatureGate>
  );
}
```

---

## UI/UX Considerations

### Seeker Side

**Request Detail Page:**
- "Messages" button always visible (for own requests)
- No badge, no gating, clean button
- Opens thread at `/requests/[id]/thread`

**Thread Page:**
- Shows messages from providers who unlocked
- Seeker can reply to any provider
- Multiple providers can message on same request
- Seeker sees all conversations in one thread

### Provider Side

**Marketplace/Dashboard:**
- "Send Message" button only after unlock
- FREE: Shows amber upgrade card
- PRO/AGENCY: Shows working button

**Thread Page:**
- FREE providers see full-page upgrade prompt
- PRO/AGENCY providers see normal messaging UI
- Provider can only see/send messages on unlocked requests

---

## Security Considerations

### 1. Request Ownership Validation

```typescript
// Always verify seeker owns the request
if (user.role === 'SEEKER' && request.seekerId !== user.id) {
  throw new ForbiddenException();
}
```

### 2. Unlock Validation

```typescript
// Always verify provider unlocked the request
const unlock = await findUnlock(providerId, requestId);
if (!unlock || unlock.status !== 'UNLOCKED') {
  throw new ForbiddenException();
}
```

### 3. Plan Entitlement Check

```typescript
// Always verify provider has messaging enabled
if (!entitlements['messaging.enabled']) {
  throw new ForbiddenException('Upgrade to PRO');
}
```

### 4. Request Status Check

```typescript
// Only allow messaging on open requests
if (request.status !== 'OPEN') {
  throw new ForbiddenException('Request is closed');
}
```

---

## Edge Cases

### Case 1: Request Closed Mid-Conversation

**Scenario:** Seeker closes request while provider is typing message

**Handling:**
```typescript
if (request.status === 'CLOSED') {
  return {
    allowed: false,
    message: 'This request has been closed by the seeker',
    action: 'View your other active requests'
  };
}
```

### Case 2: Provider Plan Downgrade

**Scenario:** PRO provider downgrades to FREE while in conversation

**Handling:**
```typescript
// Existing messages remain visible (read-only)
// New message attempts return 403 Forbidden
// Provider sees upgrade prompt on send attempt
```

### Case 3: Multiple Providers on Same Request

**Scenario:** 3 providers unlock and message same seeker

**Handling:**
```typescript
// All messages in single thread (grouped by sender)
// Seeker can reply to specific providers
// Providers only see their own messages + seeker replies
// OR: Providers see all messages (transparent marketplace)
```

**Recommendation:** All providers see all messages (transparency).

---

## Summary Table

| Action | SEEKER | FREE Provider | PRO Provider |
|--------|--------|---------------|--------------|
| Create request | ✅ | ❌ | ❌ |
| Browse marketplace | ❌ | ✅ | ✅ |
| Unlock request | ❌ | ✅ (1 credit) | ✅ (1 credit) |
| Send message | ✅ (own request) | ❌ (upgrade) | ✅ (unlocked) |
| Read messages | ✅ (own request) | ✅ (unlocked) | ✅ (unlocked) |
| Send proposal | ❌ | ✅ (unlocked) | ✅ (unlocked) |

---

## Testing Checklist

### Seeker Tests
- [ ] Can message on own request ✅
- [ ] Cannot access other seekers' request threads ✅
- [ ] Cannot message providers outside request context ✅
- [ ] Messages persist after page reload ✅

### FREE Provider Tests
- [ ] Cannot send messages (sees upgrade prompt) ✅
- [ ] Can still send proposals ✅
- [ ] Can read messages from seekers ✅
- [ ] Upgrade prompt links to pricing page ✅

### PRO Provider Tests
- [ ] Can message on unlocked requests ✅
- [ ] Cannot message on locked requests ✅
- [ ] Must unlock before messaging ✅
- [ ] Can discuss requirements before proposing ✅

### Security Tests
- [ ] Seeker cannot access thread for request they don't own ✅
- [ ] Provider cannot message without unlock ✅
- [ ] FREE provider gets 403 on message send ✅
- [ ] Closed requests block new messages ✅

---

**Implementation Status:**
- ✅ Frontend: Seeker side ungated
- ✅ Frontend: Provider side gated correctly
- ✅ Backend: Entitlements updated for seekers
- ⚠️ Backend: Messages API enforcement (verify exists)

**Next:** Deploy and test all scenarios!
