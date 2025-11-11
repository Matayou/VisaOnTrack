# Project Management Pages - Role Breakdown

**Status:** Documentation Complete  
**Last Updated:** November 2025

---

## 👥 Overview

The project management pages serve **two distinct user roles** with different needs:

1. **Seekers** (Visa Applicants) - Typically 1 active order at a time
2. **Providers** (Service Providers) - Multiple active orders from different seekers

---

## 🔍 Current Pages Analysis

### Current Status
The **5 pages created** are currently **optimized for Seekers** (the user's context). They show the seeker's perspective:
- Orders belong to the seeker
- Files uploaded by seeker
- Appointments scheduled with providers
- Notifications about seeker's orders
- Requests posted by seeker

---

## 📋 Pages by Role

### ✅ **SEEKER Pages** (Current - Optimized for Visa Applicants)

#### 1. **Order Dashboard** (`order-dashboard.html`)
**Purpose:** View all orders placed by the seeker

**Seeker View:**
- ✅ See all orders they've placed
- ✅ Track progress on their orders
- ✅ Filter by status (active, completed, cancelled)
- ✅ View which provider is handling each order
- ✅ Stats: Active orders (typically 1), total spent, completed orders

**Provider Would See:**
- ❌ Multiple orders from different seekers
- ❌ Filter by seeker name
- ❌ Stats: Total active orders, revenue, completion rate
- ❌ Different actions (update milestones, submit files)

#### 2. **Order Detail** (`order-detail.html`)
**Purpose:** Manage a specific order from seeker's perspective

**Seeker View:**
- ✅ Track milestone progress
- ✅ Upload documents/files
- ✅ View provider information
- ✅ Schedule appointments with provider
- ✅ Complete order (release escrow) or cancel
- ✅ View provider's updates on milestones

**Provider Would See:**
- ❌ Update milestone status (mark as complete)
- ❌ View seeker information (name, contact)
- ❌ Upload completed documents
- ❌ See seeker's uploaded files
- ❌ Cannot complete/cancel (seeker controls this)

#### 3. **Request Status** (`request-status.html`)
**Purpose:** Track request lifecycle from seeker's perspective

**Seeker View:**
- ✅ See request timeline (posted → quotes → hired)
- ✅ View all quotes received from providers
- ✅ Accept/decline quotes
- ✅ See which quote was accepted
- ✅ Navigate to related order

**Provider Would See:**
- ❌ Browse all open requests (marketplace view)
- ❌ Submit quotes for requests
- ❌ See quote status (pending, accepted, declined)
- ❌ Different timeline (quoted → accepted → order created)

#### 4. **Notifications** (`notifications.html`)
**Purpose:** Centralized notification center

**Seeker Notifications:**
- ✅ Milestone completed (by provider)
- ✅ New message from provider
- ✅ Upcoming deadline reminders
- ✅ Appointment scheduled by provider
- ✅ Quote received

**Provider Notifications:**
- ✅ New request posted
- ✅ Quote accepted/declined
- ✅ New message from seeker
- ✅ File uploaded by seeker
- ✅ Appointment requested
- ✅ Order completed (payment released)

#### 5. **Appointments** (`appointments.html`)
**Purpose:** Manage appointments

**Seeker View:**
- ✅ See appointments scheduled with providers
- ✅ Join video calls
- ✅ View in-person meeting locations
- ✅ Reschedule appointments
- ✅ Set reminders

**Provider View:**
- ✅ See appointments with all seekers
- ✅ Schedule appointments for multiple orders
- ✅ Filter by seeker/order
- ✅ Manage availability/calendar
- ✅ Same join/reschedule functionality

---

## 🔄 Required Provider-Specific Pages

To fully support Providers, we need these additional/adjusted pages:

### Provider-Only Pages Needed:

1. **Provider Order Dashboard**
   - Multiple orders from different seekers
   - Filter by seeker, status, date
   - Stats: Active orders count, revenue, completion rate
   - Different card layout (show seeker name prominently)

2. **Provider Order Detail**
   - Update milestone status (mark as done)
   - View seeker information
   - Upload completed documents
   - View seeker's uploaded files
   - Cannot complete/cancel order (seeker action)

3. **Requests Marketplace** (for Providers)
   - Browse all open requests
   - Filter by visa type, location, budget
   - Submit quotes
   - View quote status

4. **Provider Appointments**
   - Appointments with all seekers
   - Calendar view (multiple appointments)
   - Filter by seeker/order
   - Manage availability

---

## 📊 Comparison Table

| Feature | Seeker View | Provider View |
|---------|------------|---------------|
| **Order Dashboard** | Own orders (typically 1 active) | Multiple orders from different seekers |
| **Order Detail** | Track progress, upload files | Update milestones, view seeker files |
| **Request Status** | Track own requests | Browse marketplace, submit quotes |
| **Notifications** | Provider updates, milestones | Seeker messages, new requests, quotes |
| **Appointments** | With provider | With multiple seekers |
| **Files** | Upload documents | View seeker files, upload completed work |
| **Milestones** | View progress | Update status, mark complete |
| **Actions** | Complete/cancel order | Update order status (not complete/cancel) |

---

## 🎯 Recommendations

### Option 1: **Separate Provider Pages** (Recommended)
Create provider-specific versions of key pages:
- `order-dashboard-provider.html`
- `order-detail-provider.html`
- `requests-marketplace.html` (new)
- `appointments-provider.html` (enhanced)

**Pros:** Clear separation, optimized for each role  
**Cons:** More pages to maintain

### Option 2: **Role-Based Views** (Single Page)
Use role detection to show/hide sections:
- Same HTML files with conditional rendering
- JavaScript/backend determines what to show

**Pros:** Fewer files  
**Cons:** More complex logic, harder to maintain

### Option 3: **Document Differences Only**
Keep current seeker-focused pages, document provider differences

**Pros:** Faster to implement  
**Cons:** Providers won't have optimized views initially

---

## ✅ Next Steps

1. **Document current pages as "Seeker-focused"** ✅ (This document)
2. **Create provider-specific pages** (if requested)
3. **Update README** with role clarification
4. **Update index.html** to separate by role

---

## 📝 Notes

- Current pages are **100% functional for Seekers**
- Provider pages would share the same design system
- Key differences are in **data/content**, not design
- Both roles need similar features, just different perspectives
- Notifications and Appointments pages are mostly **role-agnostic** (work for both)

---

**Question for User:** Would you like me to create provider-specific versions of these pages?

