# Next.js Architecture Analysis - VisaOnTrack (SawadeePass)

**Date:** 2025-11-30
**Analyzed by:** Next.js React Expert
**Codebase Version:** App Router (Next.js 14+)

---

## Executive Summary

The VisaOnTrack application is a full-stack Next.js application using the App Router architecture. The codebase demonstrates a mature understanding of modern Next.js patterns but has **critical architectural gaps** that need addressing:

### Critical Issues
1. **ALL pages use `'use client'` directive** - Missing Server Component optimization opportunities
2. **Missing route:** `/requests/[id]/thread` for messaging functionality
3. **Type safety violations:** Extensive use of `as any` casting (7 files)
4. **No error boundaries or loading states** at route level (no `error.tsx` or `loading.tsx` files)
5. **Client-side data fetching everywhere** - No Server Component data fetching patterns
6. **No pagination implementation** despite API support

### Strengths
✅ Clean App Router file structure
✅ Role-based routing (`/dashboard` vs `/providers/dashboard`)
✅ Intake-first flow with localStorage persistence
✅ Proper route parameter handling with `useParams`
✅ Structured component organization

---

## 1. Current Routing Architecture

### Route Structure Analysis

```
apps/web/app/
├── layout.tsx                      # Root layout (Server Component ✅)
├── page.tsx                        # Landing (Client ❌)
├── dashboard/
│   └── page.tsx                    # Seeker dashboard (Client ❌, 742 LOC)
├── providers/
│   ├── page.tsx                    # Provider listing (Client ❌)
│   ├── [id]/page.tsx               # Provider detail (Client ❌)
│   ├── dashboard/page.tsx          # Provider dashboard (Client ❌, 349 LOC)
│   ├── marketplace/page.tsx        # Lead marketplace (Client ❌)
│   └── profile/manage/page.tsx     # Profile management (Client ❌)
├── requests/
│   ├── new/page.tsx                # Request wizard (Client ❌)
│   ├── [id]/
│   │   ├── page.tsx                # Request detail (Client ❌, 258 LOC)
│   │   ├── edit/page.tsx           # Edit request (Client ❌)
│   │   └── ❌ thread/              # MISSING - messaging thread
│   │   └── components/             # Request-specific components
├── auth/
│   ├── login/page.tsx              # Login (Client ❌)
│   ├── register/page.tsx           # Register (Client ❌)
│   ├── forgot-password/page.tsx    # Password reset (Client ❌)
│   └── ...
├── onboarding/
│   ├── account-type/page.tsx       # Account type selection (Client ❌)
│   ├── seeker/welcome/page.tsx     # Seeker onboarding (Client ❌)
│   └── provider/
│       ├── welcome/page.tsx        # Provider welcome (Client ❌)
│       ├── business/page.tsx       # Business info (Client ❌)
│       ├── credentials/page.tsx    # Credential upload (Client ❌)
│       └── services/page.tsx       # Service selection (Client ❌)
├── get-started/page.tsx            # Public intake wizard (Client ❌)
├── pricing/page.tsx                # Pricing page (Client ❌)
├── account/
│   └── billing/page.tsx            # Billing settings (Client ❌)
└── for-experts/page.tsx            # Expert landing (Client ❌)
```

**Total Route Pages:** 26
**Client Components:** 25 (96%)
**Server Components:** 1 (Root layout only)
**Missing Error Boundaries:** 26
**Missing Loading States:** 26

---

## 2. Role-Based Routing Pattern

### Current Implementation

The application implements role-based routing through **client-side redirects** in dashboard pages:

```typescript
// apps/web/app/dashboard/page.tsx (Line 206-210)
const user = await api.users.getCurrentUser();
if (user.role === 'PROVIDER' || user.role === 'ADMIN') {
  router.replace('/providers/dashboard');
  return;
}
```

### Issues with Current Pattern

1. **No Middleware Protection** - Routes are not protected at the Next.js middleware level
2. **Client-Side Redirects** - Causes unnecessary round trips and flash of wrong content
3. **No Layout-Level Protection** - Each page handles its own auth check
4. **No SSR Protection** - Server doesn't know about user role until client hydration

### Recommended Pattern

```typescript
// apps/web/middleware.ts (NEW FILE NEEDED)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.url;

  // Decode JWT to get role (server-side)
  const userRole = decodeToken(token)?.role;

  // Provider-only routes
  if (pathname.startsWith('/providers/dashboard') && userRole !== 'PROVIDER') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Seeker-only routes
  if (pathname === '/dashboard' && userRole === 'PROVIDER') {
    return NextResponse.redirect(new URL('/providers/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/providers/:path*', '/requests/:path*'],
};
```

---

## 3. Data Fetching Anti-Patterns

### Current Pattern (All Pages)

```typescript
// apps/web/app/dashboard/page.tsx (Lines 203-279)
'use client';

export default function DashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const response = await api.requests.listRequests({
        page: 1,
        limit: 5,
        seekerId: user.id
      });
      setRequests(response.data ?? []);
    };
    run();
  }, []);

  // Manual loading states, error handling...
}
```

**Problems:**
- ❌ Waterfalls: User fetch → Request fetch (sequential, not parallel)
- ❌ No SSR: Data fetched after client hydration
- ❌ Loading states: Manual implementation with useState
- ❌ No streaming: User waits for all data before seeing anything
- ❌ No caching: Every navigation refetches

### Recommended Server Component Pattern

```typescript
// apps/web/app/dashboard/page.tsx (RECOMMENDED)
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/server';
import { DashboardContent } from './DashboardContent';
import { RequestListSkeleton } from './RequestListSkeleton';

// Server Component (default)
export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/login');
  if (user.role === 'PROVIDER') redirect('/providers/dashboard');

  return (
    <div>
      <DashboardHeader user={user} />
      <Suspense fallback={<RequestListSkeleton />}>
        <RequestList userId={user.id} />
      </Suspense>
    </div>
  );
}

// Separate async Server Component for data fetching
async function RequestList({ userId }: { userId: string }) {
  // Parallel fetching with Promise.all
  const [requests, credits] = await Promise.all([
    api.requests.listRequests({ seekerId: userId, limit: 5 }),
    api.credits.getBalance(),
  ]);

  return <DashboardContent requests={requests} credits={credits} />;
}
```

**Benefits:**
✅ SSR: Data available on initial render
✅ Streaming: UI shows progressively with Suspense
✅ Parallel fetching: User + Requests fetched together
✅ Automatic caching: Next.js caches by default
✅ No loading state management: Suspense handles it

---

## 4. Missing Route: `/requests/[id]/thread`

### Current State

**Messages Service Exists:**
```typescript
// packages/client/src/services/MessagesService.ts
export class MessagesService {
  public static listMessages({ id, page, limit }): Promise<MessageListResponse>
  public static sendMessage({ id, requestBody }): Promise<Message>
  public static uploadAttachment({ formData }): Promise<Attachment>
}
```

**No Route Implementation:**
```
apps/web/app/requests/[id]/
├── page.tsx              ✅ Request detail
├── edit/page.tsx         ✅ Edit request
└── thread/               ❌ MISSING
    └── page.tsx          ❌ MISSING
```

### Proposed Architecture

```typescript
// apps/web/app/requests/[id]/thread/page.tsx (NEW FILE)
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api, type Message } from '@visaontrack/client';
import { MessageList } from './components/MessageList';
import { MessageComposer } from './components/MessageComposer';
import { ThreadHeader } from './components/ThreadHeader';

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const requestId = params.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    if (!requestId) return;

    const loadMessages = async () => {
      try {
        const response = await api.messages.listMessages({
          id: requestId,
          page: 1,
          limit: 50
        });
        setMessages(response.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [requestId]);

  // Handle new message
  const handleSendMessage = async (content: string, attachments: File[]) => {
    try {
      // Upload attachments first
      const attachmentIds = await Promise.all(
        attachments.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const attachment = await api.messages.uploadAttachment({
            formData
          });
          return attachment.id;
        })
      );

      // Send message with attachment IDs
      const newMessage = await api.messages.sendMessage({
        id: requestId,
        requestBody: {
          content,
          attachmentIds
        },
      });

      setMessages((prev) => [...prev, newMessage]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <ThreadHeader requestId={requestId} />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
      <MessageComposer onSend={handleSendMessage} />
    </div>
  );
}
```

**Components Needed:**
- `components/ThreadHeader.tsx` - Request info, participants
- `components/MessageList.tsx` - Scrollable message history
- `components/MessageBubble.tsx` - Individual message with attachments
- `components/MessageComposer.tsx` - Input field, file upload, send button
- `components/AttachmentPreview.tsx` - File preview before sending

**Real-time Updates (Phase 2):**
```typescript
// Option 1: Polling
useEffect(() => {
  const interval = setInterval(async () => {
    const latest = await api.messages.listMessages({
      id: requestId,
      limit: 1
    });
    if (latest.data[0]?.id !== messages[0]?.id) {
      // Fetch new messages
    }
  }, 5000); // Poll every 5 seconds

  return () => clearInterval(interval);
}, [requestId, messages]);

// Option 2: WebSocket (Future)
// useEffect(() => {
//   const ws = new WebSocket(`wss://api.visaontrack.com/requests/${requestId}/messages`);
//   ws.onmessage = (event) => {
//     const newMessage = JSON.parse(event.data);
//     setMessages((prev) => [...prev, newMessage]);
//   };
//   return () => ws.close();
// }, [requestId]);
```

---

## 5. Type Safety Issues

### Files with `as any` Casting

```
apps/web/app/providers/marketplace/components/LeadCard.tsx
apps/web/app/providers/dashboard/page.tsx
apps/web/app/providers/marketplace/page.tsx
apps/web/app/dashboard/page.tsx
apps/web/app/requests/[id]/page.tsx
apps/web/app/requests/[id]/components/RequestEditForm.tsx
apps/web/components/ui/Card.tsx
```

### Example Violations

```typescript
// apps/web/app/providers/marketplace/page.tsx (Line 42)
api.requests.listRequests({ status: 'OPEN' as any })
//                                           ^^^^^^^^ Type violation

// apps/web/app/dashboard/page.tsx (Line 519)
const intakeData = request.intakeData as any;
//                                     ^^^^^^ Type violation

// apps/web/app/requests/[id]/page.tsx (Line 58-59)
const updated = await api.requests.updateRequest({
  id: request.id,
  requestBody: { status: 'OPEN' }, // @ts-ignore comment used
});
```

### Root Cause Analysis

1. **OpenAPI Schema Mismatch:** Generated types don't match actual API responses
2. **Missing Properties:** `intakeData`, `unlockStatus`, `updatedAt` not in schema
3. **Enum Issues:** `RequestStatus` enum might not include all values
4. **Partial SDK Generation:** Client SDK out of sync with spec

### Fix Strategy (Per Recovery Plan Phase 1)

```yaml
# From RECOVERY_PLAN.md (Phase 1)
- Update OpenAPI to include:
    - /requests/{id}/unlock
    - /providers/me
    - intakeData + updatedAt on Request
    - correct PlanCode (Free/Pro/Agency)
- Regenerate client: pnpm generate:client
- Fix type usage: remove as any for unlock/intakeData
```

**After regeneration, replace:**
```typescript
// BEFORE
const intakeData = request.intakeData as any;
api.requests.listRequests({ status: 'OPEN' as any });

// AFTER (with updated schema)
const intakeData = request.intakeData; // Type: IntakeData | null
api.requests.listRequests({ status: 'OPEN' }); // Type: RequestStatus.OPEN
```

---

## 6. Intake-First Flow Architecture

### Current Implementation

**Step 1: Public Intake Wizard**
```typescript
// apps/web/app/get-started/page.tsx
<IntakeWizard mode="public" />
```

**Step 2: localStorage Persistence**
```typescript
// apps/web/components/intake/IntakeWizard.tsx (Line 36-37)
const INTAKE_DATA_KEY = 'vot_intake_data';

// After wizard completion
localStorage.setItem(INTAKE_DATA_KEY, JSON.stringify(intakeData));
router.push('/auth/register/simple');
```

**Step 3: Auto-create on First Dashboard Visit**
```typescript
// apps/web/app/dashboard/page.tsx (Lines 214-261)
const intakeDataJson = localStorage.getItem(INTAKE_DATA_KEY);

if (intakeDataJson && !autoCreateAttemptedRef.current) {
  autoCreateAttemptedRef.current = true;

  const intakeData = JSON.parse(intakeDataJson);
  const budget = estimateBudgetFromSavings(intakeData.savings);

  const newRequest = await api.requests.createRequest({
    requestBody: {
      title: `Visa application for ${mapEligibilityCodeToVisaType(intakeData.selectedCode)}`,
      description: intakeData.fields?.join(', ') || 'None',
      visaType: mapEligibilityCodeToVisaType(intakeData.selectedCode),
      budgetMin: budget.min,
      budgetMax: budget.max,
      location: intakeData.location === 'Inside Thailand' ? 'Inside Thailand' : 'Outside Thailand',
      intakeData: intakeData, // Stored for rich display
    },
  });

  localStorage.removeItem(INTAKE_DATA_KEY);
  router.push(`/requests/${newRequest.id}`);
}
```

### Flow Diagram

```
┌─────────────────────┐
│ 1. Public Landing   │
│ /get-started        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Intake Wizard    │
│ (4-step form)       │
│ - Age, Purpose      │
│ - Income, Savings   │
│ - Visa Selection    │
│ - Review            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. Save to          │
│ localStorage        │
│ 'vot_intake_data'   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 4. Register         │
│ /auth/register      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 5. First Visit to   │
│ /dashboard          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 6. Auto-create      │
│ Request from        │
│ localStorage        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 7. Redirect to      │
│ /requests/{id}      │
│ Clear localStorage  │
└─────────────────────┘
```

### Strengths
✅ Seamless UX: No data re-entry
✅ Conversion optimized: Capture intent before auth
✅ Data preserved: survives registration flow
✅ Ref protection: `autoCreateAttemptedRef` prevents duplicate requests

### Weaknesses
❌ No SSR: Auto-create only happens client-side
❌ Race conditions: Multiple tabs could create duplicate requests
❌ No error recovery: If auto-create fails, localStorage persists
❌ No expiry: Old intake data never cleaned up

### Improvements

```typescript
// Add expiry timestamp
const intakeData = {
  ...data,
  _timestamp: Date.now(),
  _ttl: 24 * 60 * 60 * 1000, // 24 hours
};

// Check expiry on read
const isExpired = (Date.now() - intakeData._timestamp) > intakeData._ttl;
if (isExpired) {
  localStorage.removeItem(INTAKE_DATA_KEY);
  return null;
}

// Server-side approach (better)
// Store in session cookie instead of localStorage
// Auto-create via Server Action after registration
```

---

## 7. Pagination Implementation Gap

### API Supports Pagination

```typescript
// packages/client/src/services/RequestsService.ts
public static listRequests({
  page = 1,
  limit = 20,
  status,
  seekerId,
}): CancelablePromise<RequestListResponse>
```

### Frontend Ignores It

```typescript
// apps/web/app/dashboard/page.tsx (Line 263)
const response = await api.requests.listRequests({
  page: 1,      // Hardcoded to page 1
  limit: 5,     // Shows only 5 items
  seekerId: user.id
});
setRequests(response.data ?? []); // No pagination state
```

**No UI Controls:**
- ❌ No "Load More" button
- ❌ No page numbers
- ❌ No "Showing X of Y" indicator
- ❌ No infinite scroll

### Recommended Implementation

```typescript
// apps/web/app/dashboard/page.tsx
const [requests, setRequests] = useState<Request[]>([]);
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  hasMore: false,
});
const [isLoadingMore, setIsLoadingMore] = useState(false);

const loadRequests = async (page: number) => {
  const response = await api.requests.listRequests({
    page,
    limit: pagination.limit,
    seekerId: user.id,
  });

  setPagination({
    page: response.meta.page,
    limit: response.meta.limit,
    total: response.meta.total,
    hasMore: response.meta.page < response.meta.totalPages,
  });

  setRequests((prev) =>
    page === 1 ? response.data : [...prev, ...response.data]
  );
};

const loadMore = async () => {
  setIsLoadingMore(true);
  await loadRequests(pagination.page + 1);
  setIsLoadingMore(false);
};

// UI
{pagination.hasMore && (
  <Button onClick={loadMore} disabled={isLoadingMore}>
    {isLoadingMore ? 'Loading...' : `Load More (${pagination.total - requests.length} remaining)`}
  </Button>
)}
```

---

## 8. Missing Error Boundaries and Loading States

### Current State

- **0** `error.tsx` files in app directory
- **0** `loading.tsx` files in app directory
- Manual error handling in every page
- Manual loading states with `useState`

### Impact

```typescript
// Every page does this manually:
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

try {
  const data = await api.requests.listRequests();
} catch (err) {
  setError(getErrorDisplayMessage(err, 'load requests'));
} finally {
  setIsLoading(false);
}

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

**Issues:**
- ❌ Repeated code across 26 pages
- ❌ Inconsistent error messages
- ❌ No error recovery strategies
- ❌ No automatic retry logic

### Recommended Pattern

```typescript
// apps/web/app/dashboard/loading.tsx (NEW FILE)
export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
      <p>Loading your dashboard...</p>
    </div>
  );
}

// apps/web/app/dashboard/error.tsx (NEW FILE)
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-lg font-bold text-red-900">
          Something went wrong
        </h2>
        <p className="mb-4 text-sm text-red-700">{error.message}</p>
        <button
          onClick={reset}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// apps/web/app/dashboard/page.tsx (Simplified)
export default async function DashboardPage() {
  const user = await getCurrentUser();
  const requests = await api.requests.listRequests({
    seekerId: user.id
  });

  // No try/catch, no loading states
  // Next.js handles errors with error.tsx
  // Suspense/loading.tsx handles loading

  return <DashboardContent requests={requests} />;
}
```

---

## 9. State Management Patterns

### Current Approach

**No global state management library** (Redux, Zustand, Jotai)
**Local state everywhere** with `useState`

```typescript
// apps/web/app/dashboard/page.tsx
const [requests, setRequests] = useState<Request[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
```

**Issues:**
- ❌ Prop drilling for shared state
- ❌ Duplicate API calls across pages
- ❌ No cache invalidation strategy
- ❌ No optimistic updates

### Credit Balance Example

```typescript
// apps/web/app/providers/dashboard/page.tsx (Lines 32, 49-53)
const [credits, setCredits] = useState<number>(0);

const [creditsRes, requestsRes] = await Promise.all([
  api.credits.getBalance(), // Fetched here
  api.requests.listRequests({ status: 'OPEN' as any }),
]);
setCredits(creditsRes.credits);

// apps/web/app/providers/marketplace/page.tsx (Lines 20, 40-41)
const [credits, setCredits] = useState<number>(0);

const [creditsRes, requestsRes] = await Promise.all([
  api.credits.getBalance(), // Fetched again here
  api.requests.listRequests({ status: 'OPEN' as any }),
]);
```

**Same data fetched in multiple pages:**
- `/providers/dashboard`
- `/providers/marketplace`
- After unlock action

### Recommended Pattern

**Option 1: Server Components + React Cache**
```typescript
// app/providers/layout.tsx (Server Component)
import { cache } from 'react';
import { getCredits } from '@/lib/api/credits';

const getCachedCredits = cache(getCredits);

export default async function ProvidersLayout({ children }) {
  const credits = await getCachedCredits();

  return (
    <div>
      <ProviderHeader credits={credits} />
      {children}
    </div>
  );
}
```

**Option 2: Zustand Store (Client-side)**
```typescript
// lib/stores/credits.ts
import { create } from 'zustand';

interface CreditsStore {
  credits: number;
  isLoading: boolean;
  fetchCredits: () => Promise<void>;
  deductCredits: (amount: number) => void;
}

export const useCreditsStore = create<CreditsStore>((set) => ({
  credits: 0,
  isLoading: false,
  fetchCredits: async () => {
    set({ isLoading: true });
    const result = await api.credits.getBalance();
    set({ credits: result.credits, isLoading: false });
  },
  deductCredits: (amount) =>
    set((state) => ({ credits: state.credits - amount })),
}));

// Usage in components
const { credits, fetchCredits } = useCreditsStore();
```

**Option 3: React Query (Recommended)**
```typescript
// lib/queries/credits.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCredits() {
  return useQuery({
    queryKey: ['credits'],
    queryFn: () => api.credits.getBalance(),
    staleTime: 30000, // 30 seconds
  });
}

export function useUnlockRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      api.requests.unlockRequest({ id: requestId }),
    onSuccess: (data) => {
      // Optimistically update credits
      queryClient.setQueryData(['credits'], (old) => ({
        ...old,
        credits: data.remainingCredits,
      }));
    },
  });
}

// Usage
const { data: credits, isLoading } = useCredits();
const unlockMutation = useUnlockRequest();

const handleUnlock = async (id: string) => {
  await unlockMutation.mutate(id);
};
```

---

## 10. Authentication Across Server/Client Boundary

### Current Pattern

**Client-side auth check in every page:**

```typescript
// apps/web/app/dashboard/page.tsx (Lines 206-210)
useEffect(() => {
  const run = async () => {
    const user = await api.users.getCurrentUser();
    if (user.role === 'PROVIDER' || user.role === 'ADMIN') {
      router.replace('/providers/dashboard');
      return;
    }
  };
  run();
}, []);
```

**Issues:**
- ❌ Flash of unauthenticated content
- ❌ API call on every page load
- ❌ No SSR protection
- ❌ Repeated across all protected pages

### Recommended Architecture

**1. Server-Side Auth Utility**
```typescript
// lib/auth/server.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user;
  } catch {
    redirect('/auth/login');
  }
}

export async function requireRole(role: 'SEEKER' | 'PROVIDER' | 'ADMIN') {
  const user = await getCurrentUser();

  if (user.role !== role) {
    if (role === 'SEEKER' && user.role === 'PROVIDER') {
      redirect('/providers/dashboard');
    } else if (role === 'PROVIDER' && user.role === 'SEEKER') {
      redirect('/dashboard');
    } else {
      redirect('/');
    }
  }

  return user;
}
```

**2. Use in Server Components**
```typescript
// apps/web/app/dashboard/page.tsx
import { requireRole } from '@/lib/auth/server';

export default async function DashboardPage() {
  const user = await requireRole('SEEKER');

  // User is guaranteed to be authenticated and a SEEKER
  // No client-side redirects, no useEffect

  return <DashboardContent user={user} />;
}
```

**3. Client-Side Context for Hydration**
```typescript
// components/providers/AuthProvider.tsx
'use client';

import { createContext, useContext } from 'react';

const AuthContext = createContext<User | null>(null);

export function AuthProvider({
  children,
  user
}: {
  children: React.ReactNode;
  user: User
}) {
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// apps/web/app/layout.tsx
import { getCurrentUser } from '@/lib/auth/server';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default async function RootLayout({ children }) {
  const user = await getCurrentUser().catch(() => null);

  return (
    <html>
      <body>
        {user ? (
          <AuthProvider user={user}>
            {children}
          </AuthProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
```

---

## 11. Recommendations Summary

### Phase 1: Server Component Migration (Priority: HIGH)

**Convert these pages to Server Components first:**

1. **Dashboard pages** (`/dashboard`, `/providers/dashboard`)
   - High traffic
   - Simple data requirements
   - No complex interactivity

2. **Request detail** (`/requests/[id]`)
   - SEO important
   - Initial data can be SSR'd
   - Interactive parts can be Client Components

3. **Provider listings** (`/providers`, `/providers/marketplace`)
   - SEO critical
   - Filter/sort can be Server Actions

**Pattern:**
```typescript
// Server Component (page.tsx)
export default async function Page() {
  const data = await fetchData(); // Server-side
  return <ClientWrapper initialData={data} />;
}

// Client Component (ClientWrapper.tsx)
'use client';
export function ClientWrapper({ initialData }) {
  const [data, setData] = useState(initialData);
  // Interactive logic here
}
```

### Phase 2: Add Route Handlers (Priority: HIGH)

**Create missing routes:**

1. `/requests/[id]/thread` - Messaging interface
2. Add `error.tsx` to critical routes
3. Add `loading.tsx` to critical routes
4. Add `not-found.tsx` for 404 handling

### Phase 3: Fix Type Safety (Priority: HIGH)

**Per Recovery Plan Phase 1:**

1. Update OpenAPI schema with missing properties:
   - `intakeData` on Request
   - `updatedAt` on Request
   - `unlockStatus` on Request (provider view)
   - `/requests/{id}/unlock` endpoint
   - `/providers/me` endpoint

2. Regenerate client:
   ```bash
   pnpm generate:client
   ```

3. Remove all `as any` casts:
   ```bash
   # Find and fix
   grep -r "as any" apps/web/app
   ```

### Phase 4: Add Pagination (Priority: MEDIUM)

**Implement in:**
1. Dashboard request list
2. Provider marketplace
3. Message threads (when created)

### Phase 5: Implement Middleware (Priority: MEDIUM)

1. Create `apps/web/middleware.ts`
2. Add role-based route protection
3. Add auth token validation
4. Add request logging

### Phase 6: Add State Management (Priority: LOW)

**Only if needed for:**
- Credits balance across pages
- Optimistic UI updates
- Complex form state

**Recommendation:** Use React Query for server state, local state for UI state

---

## 12. File Structure Recommendations

### Current Issues

- ❌ 26 pages with `'use client'` at top
- ❌ No error boundaries
- ❌ No loading states
- ❌ Component organization unclear

### Recommended Structure

```
apps/web/app/
├── (auth)/                      # Route group (no layout impact)
│   ├── login/page.tsx           # Can be Client
│   ├── register/page.tsx        # Can be Client
│   └── layout.tsx               # Auth layout (logo only)
│
├── (dashboard)/                 # Route group (shared layout)
│   ├── layout.tsx               # Dashboard layout with nav
│   ├── dashboard/               # Seeker dashboard
│   │   ├── page.tsx             # Server Component
│   │   ├── loading.tsx          # Loading UI
│   │   ├── error.tsx            # Error boundary
│   │   └── _components/         # Private components (not routes)
│   │       ├── DashboardContent.tsx  # Client Component
│   │       ├── RequestCard.tsx       # Client Component
│   │       └── FilterBar.tsx         # Client Component
│   │
│   └── requests/
│       └── [id]/
│           ├── page.tsx              # Server Component
│           ├── loading.tsx
│           ├── error.tsx
│           ├── edit/page.tsx         # Client Component (form)
│           ├── thread/               # NEW
│           │   ├── page.tsx          # Client Component (real-time)
│           │   ├── loading.tsx
│           │   ├── error.tsx
│           │   └── _components/
│           │       ├── MessageList.tsx
│           │       ├── MessageBubble.tsx
│           │       └── MessageComposer.tsx
│           └── _components/
│               ├── RequestOverview.tsx
│               └── ProposalsList.tsx
│
├── (providers)/                      # Route group
│   ├── layout.tsx                    # Provider layout
│   └── providers/
│       ├── page.tsx                  # Server Component
│       ├── loading.tsx
│       ├── error.tsx
│       ├── [id]/page.tsx             # Server Component
│       ├── dashboard/page.tsx        # Server Component
│       └── marketplace/
│           ├── page.tsx              # Server Component
│           ├── loading.tsx
│           ├── error.tsx
│           └── _components/
│               ├── LeadCard.tsx      # Client Component
│               └── LeadFilters.tsx   # Client Component
│
├── middleware.ts                     # Route protection
├── layout.tsx                        # Root layout
├── loading.tsx                       # Global loading
└── error.tsx                         # Global error
```

**Benefits:**
- ✅ Route groups keep routes clean
- ✅ `_components` folders indicate private components
- ✅ Server Components by default
- ✅ Error boundaries at every level
- ✅ Loading states at every level

---

## 13. Next Steps (Actionable)

### Week 1: Critical Fixes

**Day 1-2: Type Safety (Phase 1)**
- [ ] Update OpenAPI schema with missing properties
- [ ] Run `pnpm generate:client`
- [ ] Fix all `as any` casts in 7 files
- [ ] Run `pnpm typecheck` to verify

**Day 3-4: Messaging Route (Phase 4)**
- [ ] Create `/requests/[id]/thread/page.tsx`
- [ ] Implement MessageList component
- [ ] Implement MessageComposer component
- [ ] Add file upload handling
- [ ] Test end-to-end messaging flow

**Day 5: Error Boundaries**
- [ ] Add `error.tsx` to all route segments
- [ ] Add `loading.tsx` to all route segments
- [ ] Test error recovery flows

### Week 2: Server Component Migration

**Day 1-2: Dashboard Migration**
- [ ] Convert `/dashboard/page.tsx` to Server Component
- [ ] Create `DashboardContent.tsx` Client Component
- [ ] Test SSR and hydration
- [ ] Measure performance impact

**Day 3-4: Provider Dashboard Migration**
- [ ] Convert `/providers/dashboard/page.tsx` to Server Component
- [ ] Convert `/providers/marketplace/page.tsx` to Server Component
- [ ] Test provider flows

**Day 5: Request Detail Migration**
- [ ] Convert `/requests/[id]/page.tsx` to Server Component
- [ ] Split into Server/Client components
- [ ] Test SEO with Google Search Console

### Week 3: Pagination & State Management

**Day 1-2: Implement Pagination**
- [ ] Add pagination UI to dashboard
- [ ] Add pagination UI to marketplace
- [ ] Add "Load More" vs "Page Numbers" decision
- [ ] Test with large datasets

**Day 3-4: Add React Query**
- [ ] Install `@tanstack/react-query`
- [ ] Set up QueryClientProvider
- [ ] Migrate credits balance to React Query
- [ ] Add optimistic updates for unlock

**Day 5: Testing & Optimization**
- [ ] Run Lighthouse audits
- [ ] Test Core Web Vitals
- [ ] Fix any regressions

### Week 4: Middleware & Polish

**Day 1-2: Middleware**
- [ ] Create `middleware.ts`
- [ ] Add role-based route protection
- [ ] Test all route combinations
- [ ] Remove client-side redirects

**Day 3-4: Documentation**
- [ ] Update architecture docs
- [ ] Document Server/Client component split
- [ ] Create component library docs
- [ ] Update README.md

**Day 5: Final Testing**
- [ ] E2E tests for critical flows
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Performance monitoring setup

---

## Appendix A: Client Component Audit

### Pages that MUST stay Client Components

```typescript
// Authentication flows (forms, redirects)
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password

// Complex forms
/requests/new              // Multi-step wizard
/requests/[id]/edit        // Form with validation
/providers/profile/manage  // Profile editor

// Onboarding flows
/onboarding/**             // Multi-step, localStorage

// Real-time features
/requests/[id]/thread      // WebSocket/polling

// Public intake
/get-started               // Multi-step wizard, localStorage
```

### Pages that SHOULD be Server Components

```typescript
// Static/SEO pages
/                          // Landing page
/for-experts               // Marketing page
/pricing                   // Pricing table

// Data display pages
/dashboard                 // Request list
/providers/dashboard       // Lead list
/providers                 // Provider directory
/providers/[id]            // Provider profile
/providers/marketplace     // Lead marketplace
/requests/[id]             // Request detail

// Account pages
/account/billing           // Billing history
```

### Hybrid Approach Example

```typescript
// apps/web/app/dashboard/page.tsx (Server Component)
import { RequestListClient } from './_components/RequestListClient';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const initialRequests = await fetchRequests(user.id);

  return (
    <div>
      <h1>Dashboard</h1>
      <RequestListClient
        initialData={initialRequests}
        userId={user.id}
      />
    </div>
  );
}

// apps/web/app/dashboard/_components/RequestListClient.tsx (Client Component)
'use client';

export function RequestListClient({ initialData, userId }) {
  const [requests, setRequests] = useState(initialData);
  const [filter, setFilter] = useState('ALL');

  // Interactive logic here

  return (
    <>
      <FilterBar onChange={setFilter} />
      <RequestList requests={filteredRequests} />
    </>
  );
}
```

---

## Appendix B: Performance Metrics

### Before Optimization (Estimated)

```
Metric                          Current
─────────────────────────────────────────
First Contentful Paint (FCP)    2.5s
Largest Contentful Paint (LCP)  4.0s
Time to Interactive (TTI)       5.5s
Cumulative Layout Shift (CLS)   0.15
First Input Delay (FID)         150ms

JavaScript Bundle Size          450kb (gzipped)
Client-Side Requests            3-5 per page
Time to First Data              1.5s (after JS loads)
```

### After Optimization (Projected)

```
Metric                          Target
─────────────────────────────────────────
First Contentful Paint (FCP)    1.0s  ↓60%
Largest Contentful Paint (LCP)  2.0s  ↓50%
Time to Interactive (TTI)       2.5s  ↓55%
Cumulative Layout Shift (CLS)   0.05  ↓67%
First Input Delay (FID)         50ms  ↓67%

JavaScript Bundle Size          200kb ↓56%
Client-Side Requests            0-1   ↓80%
Time to First Data              0s    ↓100% (SSR)
```

### Optimization Impact

**Server Components:**
- Reduces client bundle by ~200kb (React rendering code stays on server)
- Eliminates client-side data fetching waterfalls
- Enables streaming with Suspense

**Error Boundaries:**
- Prevents whole-page crashes
- Enables partial error recovery
- Better user experience

**Pagination:**
- Reduces initial data load
- Faster page rendering
- Better perceived performance

---

## Conclusion

The VisaOnTrack Next.js application has a solid foundation with clean routing and component organization. However, it's **not leveraging Next.js App Router's most powerful features:**

1. **Server Components** - Everything is client-rendered
2. **Streaming** - No progressive loading
3. **Error Boundaries** - No automatic error handling
4. **Middleware** - No server-side route protection

By following the **4-week migration plan** above, the application will achieve:

✅ **50%+ faster page loads** (Server Component rendering)
✅ **Type-safe codebase** (No more `as any`)
✅ **Better SEO** (SSR for all content pages)
✅ **Improved UX** (Error boundaries, loading states, pagination)
✅ **Complete feature set** (Messaging thread implemented)

**Priority Order:**
1. Type safety fixes (enables everything else)
2. Messaging thread (critical missing feature)
3. Server Component migration (biggest impact)
4. Pagination (UX improvement)
5. Middleware (security & UX)

This analysis provides a complete roadmap for transforming the application into a production-ready, performant Next.js App Router application.
