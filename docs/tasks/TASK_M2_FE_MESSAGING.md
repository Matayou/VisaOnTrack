# Task M2-FE-2: Messaging Thread & Attachments

**Milestone:** M2 — Requests & Messaging  
**Assigned To:** Frontend Engineer  
**Duration:** 1.5–2 days  
**Status:** ⏳ PENDING  
**Priority:** HIGH (core messaging functionality)

---

## User Story

**As a** Seeker or Provider,  
**I want to** communicate in request threads with file attachments,  
**So that** I can discuss visa requests and share relevant documents.

---

## Goal

Implement message thread page (`/requests/[id]/thread`) with threaded messaging, file attachment upload, and attachment display, matching the OpenAPI contract and design patterns.

---

## Scope (Per Spec Section 2)

**Route:**
- `/requests/[id]/thread` — Message thread view

**Mockup References:** Check `docs/mockups/` for messaging-related mockups  
**Spec Reference:** `visaontrack-v2-spec.md` Section 2 (App Structure & Routes), Section 9 (Files & Attachments)

**⚠️ SCOPE WARNING:** Implement exactly per spec and OpenAPI contract. No extra features. Any deviations require RFC approval.

---

## DoR Checklist (Definition of Ready)

- [x] User story defined with acceptance criteria ✅ (this document)
- [x] Wireframe/mock available ⏳ (Check `docs/mockups/` for messaging mockups)
- [x] API contract defined ✅ (OpenAPI v0.2.x — messages endpoints)
- [x] Prisma schema ready ✅ (Message, Attachment models exist)
- [x] Error states documented ✅ (OpenAPI spec — 400, 401, 403, 404, 413)
- [x] Analytics events defined ⏳ (optional — track message/attachment creation if needed)
- [x] Dependencies identified ✅ (Next.js, API client, TanStack Query, file upload)
- [x] DoR reviewed and approved ✅

**Status:** ✅ **DoR SATISFIED** — Ready to start implementation (pending backend API completion)

---

## Technical Requirements

### Stack Requirements (Per Spec Section 1)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide icons
- **API Client:** `@visaontrack/client` (generated from OpenAPI)
- **Data Fetching:** TanStack Query
- **File Upload:** HTML5 File API + FormData

### Implementation Details

**File Locations:**
- `apps/web/app/requests/[id]/thread/page.tsx` — Message thread page
- `apps/web/components/messages/MessageThread.tsx` — Message thread component
- `apps/web/components/messages/MessageComposer.tsx` — Message composition component
- `apps/web/components/messages/AttachmentUpload.tsx` — File upload component

**Page to Implement:**

**`/requests/[id]/thread` — Message Thread Page**
- Display threaded messages (chronological order)
- Message composer (text input + file upload)
- Attachment display (with download links)
- Real-time feel (polling for MVP, WebSocket post-MVP)
- Participant-only access (403 if not participant)
- Pagination for long threads

**Message Display:**
- Show sender name/avatar
- Show message body
- Show timestamp
- Show attachments (if any)
- Distinguish own messages vs. others
- Scroll to bottom on new messages

**Message Composer:**
- Text input (required, max 10000 chars)
- File upload button (drag-drop support)
- Attachment preview (before sending)
- Attachment removal (before sending)
- Send button
- Character counter
- Validation (client-side + server)

**File Upload:**
- Drag-drop support
- File picker button
- File preview (before upload)
- File size validation (client-side check against plan limit)
- MIME type validation (client-side check)
- Upload progress indicator
- Multiple files (up to 10 per message)
- Error handling (413 PayloadTooLarge, 403 AttachmentLimitExceeded)

**Attachment Display:**
- Show attachment name, size, type
- Download button (opens signed URL)
- File type icons
- Attachment list in message

**API Integration:**
- `GET /requests/{id}/messages` — List messages (with pagination)
- `POST /requests/{id}/messages` — Send message (with optional attachmentIds)
- `POST /messages/attachments` — Upload attachment (multipart/form-data)

**State Management:**
- Use TanStack Query for data fetching and caching
- Optimistic updates for message sending
- Polling for new messages (every 5-10 seconds for MVP)
- Error handling with user-friendly messages

**Authorization:**
- Check participant status before allowing access
- Handle 403 errors gracefully (show "You must be a participant" message)
- Hide composer if not participant

---

## Acceptance Criteria

### Message Thread Page (`/requests/[id]/thread`)
- [ ] Displays threaded messages (chronological)
- [ ] Shows sender information (name, avatar)
- [ ] Shows message body and timestamp
- [ ] Shows attachments (if any)
- [ ] Distinguishes own messages vs. others
- [ ] Scrolls to bottom on new messages
- [ ] Pagination works for long threads
- [ ] Loading states displayed
- [ ] Error states handled (401, 403, 404)

### Message Composer
- [ ] Text input works (required, max 10000 chars)
- [ ] File upload works (drag-drop + file picker)
- [ ] Attachment preview works (before sending)
- [ ] Attachment removal works (before sending)
- [ ] Send button works
- [ ] Character counter displays
- [ ] Validation works (client-side + server)
- [ ] Only visible to participants
- [ ] Loading states during submission

### File Upload
- [ ] Drag-drop support works
- [ ] File picker works
- [ ] File preview works (before upload)
- [ ] File size validation works (client-side)
- [ ] MIME type validation works (client-side)
- [ ] Upload progress indicator works
- [ ] Multiple files supported (up to 10)
- [ ] Error handling works (413, 403)
- [ ] Signed URLs work for downloads

### Technical Requirements
- [ ] Uses Next.js App Router
- [ ] TypeScript compiles without errors
- [ ] Uses generated API client
- [ ] Uses TanStack Query for data fetching
- [ ] Polling for new messages (MVP)
- [ ] Follows existing code patterns (M1-FE tasks reference)
- [ ] Responsive design (mobile + desktop)
- [ ] Accessibility (WCAG AA)
- [ ] Error handling matches existing patterns

---

## Testing Requirements

### Manual Testing
- [ ] Message thread displays correctly
- [ ] Message sending works
- [ ] File upload works (drag-drop + file picker)
- [ ] Attachment display works
- [ ] Attachment download works
- [ ] File size validation works
- [ ] MIME type validation works
- [ ] Participant-only access works (403 for non-participants)
- [ ] Polling for new messages works
- [ ] Error handling works (400, 401, 403, 404, 413)
- [ ] Loading states display correctly
- [ ] Responsive design works (mobile + desktop)

---

## Dependencies

- ⚠️ **M2-BE-2** — Messages API endpoints must be complete first
- ✅ Next.js App Router — Already configured
- ✅ API client — Already generated
- ✅ TanStack Query — Already configured
- ✅ shadcn/ui components — Already available

---

## References

- **OpenAPI Spec:** `packages/types/openapi.yaml`
- **Spec:** `visaontrack-v2-spec.md` Section 2 (Routes), Section 9 (Files & Attachments)
- **Mockups:** `docs/mockups/` (check for messaging-related mockups)
- **Reference Implementation:** `apps/web/app/onboarding/` (M1-FE tasks)

---

## Notes

- **Real-time:** Polling for MVP (5-10 second intervals), WebSocket upgrade post-MVP
- **File Upload:** Client-side validation for UX, server-side for security
- **Attachments:** Can be uploaded before sending message (link via attachmentIds)
- **Participant Check:** Must verify user is participant before allowing access
- **Error Handling:** Show user-friendly error messages (e.g., "File too large", "Invalid file type")
- **Loading States:** Use skeleton loaders or spinners

---

**Created:** 2025-01-11  
**Assigned To:** Frontend Engineer  
**Status:** ⏳ PENDING (blocked on M2-BE-2)

