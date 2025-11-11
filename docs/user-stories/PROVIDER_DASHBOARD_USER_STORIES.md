# Provider Dashboard — User Stories & Corner Cases

**Date:** 2025-01-11  
**Purpose:** Comprehensive user stories and edge cases for provider dashboard tools  
**Status:** 📋 Planning Document

---

## Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [Profile Management](#profile-management)
3. [Service Packages Management](#service-packages-management)
4. [Quotes Management](#quotes-management)
5. [Orders Management](#orders-management)
6. [Billing & Plans](#billing--plans)
7. [Analytics & Reporting](#analytics--reporting)
8. [Messages & Communication](#messages--communication)
9. [Payouts & Finances](#payouts--finances)
10. [Settings & Preferences](#settings--preferences)
11. [Verification & Compliance](#verification--compliance)
12. [Corner Cases & Edge Cases](#corner-cases--edge-cases)

---

## Dashboard Overview

### User Story: Provider Dashboard Landing Page

**As a** service provider  
**I want to** see an overview dashboard when I log in  
**So that** I can quickly understand my business status and take action

**Acceptance Criteria:**
- [ ] Dashboard shows key metrics: Active Orders, Pending Quotes, Revenue (This Month), Completion Rate
- [ ] Dashboard shows recent activity: Latest orders, new requests, messages
- [ ] Dashboard shows plan status and usage: Current plan, quotes used/limit, features available
- [ ] Dashboard shows verification status: Verified badge or pending verification notice
- [ ] Dashboard shows notifications: Unread messages, order updates, system alerts
- [ ] Dashboard is responsive: Works on mobile, tablet, desktop
- [ ] Dashboard loads within 2 seconds
- [ ] Dashboard shows loading states while data fetches
- [ ] Dashboard handles errors gracefully: Shows error message if data fails to load

**Corner Cases:**
- [ ] Provider has no orders yet → Show empty state with "Get Started" CTA
- [ ] Provider has 100+ orders → Pagination or "View All" link
- [ ] Provider's verification is pending → Show prominent verification banner
- [ ] Provider's plan expired → Show plan expiration warning
- [ ] Provider exceeded quote limit → Show upgrade CTA prominently
- [ ] Network error → Show retry button
- [ ] Partial data load → Show available data, indicate loading for rest
- [ ] Provider account suspended → Show suspension notice, disable actions
- [ ] Provider hasn't completed onboarding → Redirect to onboarding
- [ ] Multiple tabs open → Data syncs correctly, no race conditions

---

## Profile Management

### User Story: View Provider Profile

**As a** service provider  
**I want to** view my public profile  
**So that** I can see how seekers see my profile

**Acceptance Criteria:**
- [ ] Profile shows: Business name, description, location, languages, verification badge
- [ ] Profile shows: Service packages (active only)
- [ ] Profile shows: Reviews and ratings
- [ ] Profile shows: Profile photos/videos (within plan limits)
- [ ] Profile shows: Documents/credentials (if verified)
- [ ] Profile shows: Contact information (if allowed by settings)
- [ ] Profile is editable: "Edit Profile" button visible
- [ ] Profile matches public view: Same as `/providers/[slug]` page

**Corner Cases:**
- [ ] Profile not verified → Show "Pending Verification" status
- [ ] Profile suspended → Show "Account Suspended" message
- [ ] No service packages → Show "Add Your First Package" CTA
- [ ] No reviews yet → Show "No reviews yet" message
- [ ] Profile photo upload failed → Show error, allow retry
- [ ] Profile description too long → Truncate with "Read More"
- [ ] Profile has special characters → Display correctly (HTML encoding)
- [ ] Profile viewed while editing → Show "You're viewing your public profile" notice

### User Story: Edit Provider Profile

**As a** service provider  
**I want to** edit my profile information  
**So that** I can keep my business details up to date

**Acceptance Criteria:**
- [ ] Can edit: Business name, description, location, languages
- [ ] Can upload: Profile photos (within plan limit)
- [ ] Can upload: Profile videos (within plan limit)
- [ ] Can upload: Documents/credentials (if not verified yet)
- [ ] Can delete: Photos, videos, documents
- [ ] Validation: Business name required, max 200 chars
- [ ] Validation: Description max 5000 chars
- [ ] Validation: Location must be valid
- [ ] Validation: Languages must be from allowed list
- [ ] Auto-save: Draft saved every 30 seconds
- [ ] Save button: Shows "Saving..." state
- [ ] Success feedback: "Profile updated successfully"
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] Business name already taken → Show error, suggest alternatives
- [ ] Description contains profanity → Show warning, block save
- [ ] Photo exceeds size limit → Show error with plan limit info
- [ ] Photo wrong format → Show error with allowed formats
- [ ] Upload interrupted → Resume upload or show error
- [ ] Multiple photos uploaded simultaneously → Queue uploads, show progress
- [ ] Profile edited while verification pending → Reset verification status
- [ ] Profile edited while verified → Require re-verification (if major changes)
- [ ] Network timeout during save → Retry automatically, show status
- [ ] Concurrent edits → Last save wins, show conflict warning
- [ ] Browser back button → Warn about unsaved changes
- [ ] Form validation fails → Highlight errors, prevent save
- [ ] Special characters in fields → Handle encoding correctly
- [ ] Very long description → Show character count, warn at limit
- [ ] Image upload fails → Show error, allow retry with different image
- [ ] Video upload takes long → Show progress bar, allow cancellation
- [ ] Delete photo → Confirm dialog, undo option (5 seconds)

### User Story: Manage Profile Photos/Videos

**As a** service provider  
**I want to** manage my profile photos and videos  
**So that** I can showcase my business visually

**Acceptance Criteria:**
- [ ] Can upload photos: Up to plan limit (Free: 3, Pro: 12, Pro+: 30, Enterprise: 60+)
- [ ] Can upload videos: Up to plan limit (Free: 0, Pro: 1, Pro+: 3, Enterprise: 5)
- [ ] Can reorder: Drag and drop to change order
- [ ] Can set primary: Mark one photo as primary/featured
- [ ] Can delete: Remove photos/videos
- [ ] Shows usage: "3/12 photos used" counter
- [ ] Shows limits: Plan limits clearly displayed
- [ ] Upgrade prompt: Shows upgrade CTA when limit reached
- [ ] File validation: Size limits, format validation
- [ ] Upload progress: Shows progress bar during upload
- [ ] Preview: Shows thumbnail before upload completes

**Corner Cases:**
- [ ] At photo limit → Disable upload, show upgrade CTA
- [ ] At video limit → Disable upload, show upgrade CTA
- [ ] Plan downgrade → Can't upload more, but existing media stays
- [ ] Upload fails → Show error, allow retry
- [ ] File too large → Show error with size limit
- [ ] Wrong file format → Show error with allowed formats
- [ ] Upload interrupted → Resume or show error
- [ ] Multiple uploads → Queue uploads, show individual progress
- [ ] Delete primary photo → Auto-select next photo as primary
- [ ] Delete only photo → Show "Add Photo" CTA
- [ ] Reorder fails → Show error, revert to previous order
- [ ] Network slow → Show progress, allow cancellation
- [ ] Image corrupted → Show error, allow retry
- [ ] Video processing → Show "Processing..." state
- [ ] Video processing fails → Show error, allow retry
- [ ] Concurrent uploads → Handle race conditions correctly
- [ ] Browser refresh during upload → Resume or show error

---

## Service Packages Management

### User Story: View Service Packages

**As a** service provider  
**I want to** view all my service packages  
**So that** I can see what services I offer

**Acceptance Criteria:**
- [ ] Shows all packages: Active and inactive
- [ ] Shows package details: Title, description, price, deliverables, ETA
- [ ] Shows package status: Active/Inactive badge
- [ ] Can filter: Active only, Inactive only, All
- [ ] Can search: Search by title or description
- [ ] Can sort: By price, date created, status
- [ ] Shows usage: "3/12 packages used" counter
- [ ] Shows limits: Plan limits clearly displayed
- [ ] Upgrade prompt: Shows upgrade CTA when limit reached
- [ ] Empty state: "Add Your First Package" if no packages

**Corner Cases:**
- [ ] No packages → Show empty state with CTA
- [ ] At package limit → Disable "Add Package" button, show upgrade CTA
- [ ] Plan downgrade → Can't add more, but existing packages stay
- [ ] Package has special characters → Display correctly
- [ ] Very long description → Truncate with "Read More"
- [ ] Package price is 0 → Show "Free" or "Contact for pricing"
- [ ] Package has many deliverables → Show first 3, "View All" link
- [ ] Search returns no results → Show "No packages found"
- [ ] Filter returns no results → Show "No packages match your filter"
- [ ] Concurrent edits → Show conflict warning
- [ ] Package deleted by admin → Show "Deleted by admin" notice

### User Story: Create Service Package

**As a** service provider  
**I want to** create a new service package  
**So that** I can offer new services to seekers

**Acceptance Criteria:**
- [ ] Form fields: Title (required), description (required), price (required), deliverables (array), ETA days (required)
- [ ] Validation: Title max 200 chars, description max 2000 chars, price min 0, ETA min 1 day
- [ ] Can add deliverables: Add multiple deliverables
- [ ] Can remove deliverables: Remove individual deliverables
- [ ] Can set active: Toggle active/inactive
- [ ] Shows usage: "3/12 packages used" counter
- [ ] Shows limits: Plan limits clearly displayed
- [ ] Upgrade prompt: Shows upgrade CTA when limit reached
- [ ] Save button: Creates package, shows success message
- [ ] Cancel button: Discards changes, returns to list
- [ ] Auto-save: Draft saved every 30 seconds
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] At package limit → Disable form, show upgrade CTA
- [ ] Title already exists → Show warning (not error, allow duplicate)
- [ ] Price is 0 → Show warning, allow save
- [ ] Price is negative → Show error, prevent save
- [ ] Price has decimals → Allow 2 decimal places
- [ ] ETA is 0 → Show error, prevent save
- [ ] ETA is very large (1000+ days) → Show warning, allow save
- [ ] No deliverables added → Show warning, allow save
- [ ] Many deliverables → Show scrollable list
- [ ] Deliverable too long → Truncate or show error
- [ ] Special characters → Handle encoding correctly
- [ ] Form validation fails → Highlight errors, prevent save
- [ ] Network error → Show error, allow retry
- [ ] Save fails → Show error, keep form data
- [ ] Concurrent creation → Handle race conditions
- [ ] Browser back button → Warn about unsaved changes
- [ ] Form timeout → Show warning, allow save
- [ ] Plan downgrade during creation → Block save, show upgrade CTA

### User Story: Edit Service Package

**As a** service provider  
**I want to** edit an existing service package  
**So that** I can update my service offerings

**Acceptance Criteria:**
- [ ] Can edit: All fields (title, description, price, deliverables, ETA)
- [ ] Can toggle: Active/inactive status
- [ ] Can delete: Delete package (with confirmation)
- [ ] Shows current values: Pre-filled form with existing data
- [ ] Validation: Same as create form
- [ ] Save button: Updates package, shows success message
- [ ] Cancel button: Discards changes, returns to list
- [ ] Auto-save: Draft saved every 30 seconds
- [ ] Error handling: Shows specific error messages
- [ ] Shows impact: Warns if package is used in active orders

**Corner Cases:**
- [ ] Package used in active orders → Show warning, allow edit
- [ ] Package used in quotes → Show warning, allow edit
- [ ] Package deleted → Show confirmation, handle active orders
- [ ] Package edited while order active → Show impact warning
- [ ] Price changed → Show impact on active orders/quotes
- [ ] ETA changed → Show impact on active orders
- [ ] Package deactivated → Show impact on visibility
- [ ] Concurrent edits → Show conflict warning
- [ ] Package deleted by admin → Show "Deleted by admin" notice
- [ ] Network error → Show error, keep form data
- [ ] Save fails → Show error, allow retry
- [ ] Browser back button → Warn about unsaved changes
- [ ] Form timeout → Show warning, allow save
- [ ] Package not found → Show error, redirect to list

### User Story: Delete Service Package

**As a** service provider  
**I want to** delete a service package  
**So that** I can remove services I no longer offer

**Acceptance Criteria:**
- [ ] Delete button: Visible on package card/list
- [ ] Confirmation dialog: "Are you sure you want to delete this package?"
- [ ] Shows impact: Lists active orders/quotes using this package
- [ ] Can cancel: Cancel deletion
- [ ] Can confirm: Confirm deletion
- [ ] Success feedback: "Package deleted successfully"
- [ ] Error handling: Shows specific error messages
- [ ] Soft delete: Package marked inactive, not permanently deleted

**Corner Cases:**
- [ ] Package used in active orders → Show warning, block deletion or allow with impact notice
- [ ] Package used in pending quotes → Show warning, allow deletion
- [ ] Package used in completed orders → Allow deletion (historical data preserved)
- [ ] Package is only active package → Show warning, allow deletion
- [ ] Package deleted by admin → Show "Deleted by admin" notice
- [ ] Network error → Show error, allow retry
- [ ] Delete fails → Show error, keep package
- [ ] Concurrent deletion → Handle race conditions
- [ ] Package not found → Show error, refresh list
- [ ] Account suspended → Block deletion
- [ ] Plan downgrade → Allow deletion (helps stay within limits)

---

## Quotes Management

### User Story: View All Quotes

**As a** service provider  
**I want to** view all my quotes  
**So that** I can track my quote submissions

**Acceptance Criteria:**
- [ ] Shows all quotes: Pending, Accepted, Declined, Expired
- [ ] Shows quote details: Request title, quote amount, status, date submitted
- [ ] Can filter: By status, by request, by date range
- [ ] Can search: Search by request title or quote ID
- [ ] Can sort: By date, amount, status
- [ ] Shows usage: "12/50 quotes used this month" counter
- [ ] Shows limits: Plan limits clearly displayed
- [ ] Upgrade prompt: Shows upgrade CTA when limit reached
- [ ] Empty state: "No quotes yet" if no quotes
- [ ] Pagination: Handles large quote lists

**Corner Cases:**
- [ ] No quotes → Show empty state with "Browse Requests" CTA
- [ ] At quote limit → Show upgrade CTA prominently
- [ ] Quote expired → Show "Expired" badge, allow resubmit
- [ ] Quote declined → Show "Declined" badge, show reason if available
- [ ] Quote accepted → Show "Accepted" badge, link to order
- [ ] Many quotes → Pagination or infinite scroll
- [ ] Search returns no results → Show "No quotes found"
- [ ] Filter returns no results → Show "No quotes match your filter"
- [ ] Quote status changed → Show notification, update UI
- [ ] Concurrent status updates → Handle race conditions
- [ ] Quote deleted → Show "Deleted" notice
- [ ] Network error → Show error, allow retry
- [ ] Partial data load → Show available data, indicate loading

### User Story: Submit Quote

**As a** service provider  
**I want to** submit a quote for a request  
**So that** I can offer my services to seekers

**Acceptance Criteria:**
- [ ] Can select request: Browse requests, select one
- [ ] Quote form: Items (array), total THB, ETA days, terms (optional)
- [ ] Can add items: Add multiple line items with description and price
- [ ] Auto-calculates total: Sum of all items
- [ ] Can set ETA: Days until completion
- [ ] Can add terms: Optional terms and conditions
- [ ] Shows usage: "12/50 quotes used this month" counter
- [ ] Shows limits: Plan limits clearly displayed
- [ ] Upgrade prompt: Shows upgrade CTA when limit reached
- [ ] Validation: Total required, ETA required, at least one item
- [ ] Submit button: Creates quote, shows success message
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] At quote limit → Disable submit, show upgrade CTA
- [ ] Request already closed → Show error, disable submit
- [ ] Request already has accepted quote → Show warning, allow submit (if seeker allows multiple)
- [ ] Already submitted quote for this request → Show "Quote already submitted" notice
- [ ] Quote expired → Allow resubmit
- [ ] Total is 0 → Show warning, allow submit
- [ ] Total is negative → Show error, prevent submit
- [ ] Total exceeds request budget → Show warning, allow submit
- [ ] ETA is 0 → Show error, prevent submit
- [ ] ETA is very large → Show warning, allow submit
- [ ] No items added → Show error, prevent submit
- [ ] Item price is negative → Show error, prevent submit
- [ ] Item description too long → Truncate or show error
- [ ] Special characters → Handle encoding correctly
- [ ] Network error → Show error, allow retry
- [ ] Submit fails → Show error, keep form data
- [ ] Concurrent submission → Handle race conditions
- [ ] Request deleted → Show error, refresh list
- [ ] Provider account suspended → Block submission
- [ ] Provider not verified → Block submission (if required)
- [ ] Plan downgrade during submission → Block submit, show upgrade CTA
- [ ] Quote limit reached during submission → Block submit, show upgrade CTA
- [ ] Request status changed → Show error, refresh request
- [ ] Browser back button → Warn about unsaved changes
- [ ] Form timeout → Show warning, allow submit

### User Story: Edit Quote

**As a** service provider  
**I want to** edit a pending quote  
**So that** I can update my quote before it's accepted

**Acceptance Criteria:**
- [ ] Can edit: All fields (items, total, ETA, terms)
- [ ] Can only edit: Pending quotes (not accepted/declined/expired)
- [ ] Shows current values: Pre-filled form with existing data
- [ ] Validation: Same as create form
- [ ] Save button: Updates quote, shows success message
- [ ] Cancel button: Discards changes, returns to list
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] Quote already accepted → Show error, disable edit
- [ ] Quote already declined → Show error, disable edit
- [ ] Quote expired → Show error, allow resubmit instead
- [ ] Quote status changed → Show error, refresh quote
- [ ] Concurrent edits → Show conflict warning
- [ ] Network error → Show error, keep form data
- [ ] Save fails → Show error, allow retry
- [ ] Browser back button → Warn about unsaved changes
- [ ] Quote not found → Show error, redirect to list
- [ ] Request closed → Show error, disable edit

### User Story: Withdraw Quote

**As a** service provider  
**I want to** withdraw a pending quote  
**So that** I can cancel my quote submission

**Acceptance Criteria:**
- [ ] Withdraw button: Visible on pending quotes
- [ ] Confirmation dialog: "Are you sure you want to withdraw this quote?"
- [ ] Can cancel: Cancel withdrawal
- [ ] Can confirm: Confirm withdrawal
- [ ] Success feedback: "Quote withdrawn successfully"
- [ ] Error handling: Shows specific error messages
- [ ] Updates usage: Decrements quote counter

**Corner Cases:**
- [ ] Quote already accepted → Show error, disable withdraw
- [ ] Quote already declined → Show error, disable withdraw
- [ ] Quote expired → Show error, disable withdraw
- [ ] Quote status changed → Show error, refresh quote
- [ ] Network error → Show error, allow retry
- [ ] Withdraw fails → Show error, keep quote
- [ ] Concurrent withdrawal → Handle race conditions
- [ ] Quote not found → Show error, refresh list
- [ ] Request closed → Show error, disable withdraw

---

## Orders Management

### User Story: View All Orders

**As a** service provider  
**I want to** view all my orders  
**So that** I can manage my active work

**Acceptance Criteria:**
- [ ] Shows all orders: Active, Delivered, Completed, Disputed, Cancelled
- [ ] Shows order details: Seeker name, order title, status, amount, due date
- [ ] Shows stats: Active orders count, completed orders count, revenue (this month), completion rate
- [ ] Can filter: By status, by seeker, by date range
- [ ] Can search: Search by order ID, seeker name, order title
- [ ] Can sort: By date, amount, status
- [ ] Shows milestones: Progress bars showing milestone completion
- [ ] Empty state: "No orders yet" if no orders
- [ ] Pagination: Handles large order lists

**Corner Cases:**
- [ ] No orders → Show empty state with "Browse Requests" CTA
- [ ] Many orders → Pagination or infinite scroll
- [ ] Order status changed → Show notification, update UI
- [ ] Order disputed → Show "Disputed" badge prominently
- [ ] Order cancelled → Show "Cancelled" badge
- [ ] Order overdue → Show "Overdue" badge, highlight
- [ ] Search returns no results → Show "No orders found"
- [ ] Filter returns no results → Show "No orders match your filter"
- [ ] Concurrent status updates → Handle race conditions
- [ ] Network error → Show error, allow retry
- [ ] Partial data load → Show available data, indicate loading
- [ ] Order deleted → Show "Deleted" notice
- [ ] Seeker account deleted → Show "Seeker account deleted" notice

### User Story: View Order Details

**As a** service provider  
**I want to** view order details  
**So that** I can see all information about a specific order

**Acceptance Criteria:**
- [ ] Shows order info: Order ID, status, amount, dates, seeker info
- [ ] Shows milestones: List of milestones with status
- [ ] Shows messages: Message thread with seeker
- [ ] Shows files: Seeker's uploaded files, provider's completed work
- [ ] Shows quote: Original quote details
- [ ] Shows payment: Escrow status, payment status
- [ ] Can update milestones: Mark milestones as complete
- [ ] Can upload files: Upload completed work
- [ ] Can message seeker: Send messages
- [ ] Can download invoice: Download order invoice
- [ ] Cannot complete order: Only seeker can complete
- [ ] Cannot cancel order: Only seeker can cancel

**Corner Cases:**
- [ ] Order not found → Show error, redirect to list
- [ ] Order deleted → Show "Order deleted" notice
- [ ] Seeker account deleted → Show "Seeker account deleted" notice
- [ ] Order disputed → Show dispute details, limit actions
- [ ] Order cancelled → Show cancellation reason, disable actions
- [ ] Order completed → Show completion date, disable milestone updates
- [ ] All milestones complete → Show "All milestones complete" notice
- [ ] Milestone overdue → Show "Overdue" badge
- [ ] File upload fails → Show error, allow retry
- [ ] File too large → Show error with size limit
- [ ] Wrong file format → Show error with allowed formats
- [ ] Many files → Show pagination or "View All" link
- [ ] Message send fails → Show error, allow retry
- [ ] Concurrent milestone updates → Show conflict warning
- [ ] Network error → Show error, allow retry
- [ ] Order status changed → Show notification, refresh page
- [ ] Payment failed → Show "Payment failed" notice
- [ ] Escrow released → Show "Payment released" notice
- [ ] Invoice not available → Show "Invoice not available" notice

### User Story: Update Milestone Status

**As a** service provider  
**I want to** mark milestones as complete  
**So that** I can track my progress on orders

**Acceptance Criteria:**
- [ ] Can mark complete: "Mark Complete" button on pending milestones
- [ ] Confirmation: Optional confirmation dialog
- [ ] Success feedback: "Milestone marked as complete"
- [ ] Updates UI: Milestone status changes to "Complete"
- [ ] Updates progress: Progress bar updates
- [ ] Error handling: Shows specific error messages
- [ ] Can only update: Pending milestones (not completed ones)

**Corner Cases:**
- [ ] Milestone already complete → Disable button, show "Complete" badge
- [ ] Order completed → Disable milestone updates
- [ ] Order cancelled → Disable milestone updates
- [ ] Order disputed → Disable milestone updates (or require admin approval)
- [ ] Milestone overdue → Show "Overdue" badge, allow mark complete
- [ ] All milestones complete → Show "All milestones complete" notice
- [ ] Network error → Show error, allow retry
- [ ] Update fails → Show error, keep milestone status
- [ ] Concurrent updates → Show conflict warning
- [ ] Milestone not found → Show error, refresh page
- [ ] Order status changed → Show error, refresh page
- [ ] Provider account suspended → Block updates

### User Story: Upload Completed Work

**As a** service provider  
**I want to** upload completed work files  
**So that** I can deliver work to seekers

**Acceptance Criteria:**
- [ ] Upload button: "Upload Completed Work" button
- [ ] File picker: Select one or multiple files
- [ ] File validation: Size limits, format validation
- [ ] Upload progress: Shows progress bar during upload
- [ ] Success feedback: "Files uploaded successfully"
- [ ] Shows files: List of uploaded files
- [ ] Can delete: Delete uploaded files (with confirmation)
- [ ] Can download: Download uploaded files
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] File too large → Show error with size limit
- [ ] Wrong file format → Show error with allowed formats
- [ ] Upload fails → Show error, allow retry
- [ ] Upload interrupted → Resume upload or show error
- [ ] Multiple uploads → Queue uploads, show individual progress
- [ ] Order completed → Disable uploads
- [ ] Order cancelled → Disable uploads
- [ ] Order disputed → Disable uploads (or require admin approval)
- [ ] Many files → Show pagination or "View All" link
- [ ] File deleted → Show confirmation, handle active orders
- [ ] Network slow → Show progress, allow cancellation
- [ ] File corrupted → Show error, allow retry
- [ ] Concurrent uploads → Handle race conditions
- [ ] Browser refresh during upload → Resume or show error
- [ ] Plan downgrade → Block uploads if over limit
- [ ] Account suspended → Block uploads

---

## Billing & Plans

### User Story: View Billing Dashboard

**As a** service provider  
**I want to** view my billing information  
**So that** I can understand my subscription and usage

**Acceptance Criteria:**
- [ ] Shows current plan: Plan name, price, billing cycle
- [ ] Shows subscription status: Active, Past Due, Cancelled, etc.
- [ ] Shows usage meters: Quotes used/limit, packages used/limit, etc.
- [ ] Shows invoices: List of past invoices
- [ ] Shows payment method: Card on file (last 4 digits)
- [ ] Can upgrade: "Upgrade Plan" button
- [ ] Can manage: "Manage Subscription" link to Stripe portal
- [ ] Can view invoices: Download or view invoices
- [ ] Shows next billing date: When next payment is due
- [ ] Shows cancellation: If cancelling at period end

**Corner Cases:**
- [ ] No subscription → Show "Free Plan" badge, upgrade CTA
- [ ] Subscription past due → Show "Past Due" warning, payment CTA
- [ ] Subscription cancelled → Show "Cancelling on [date]" notice
- [ ] Subscription trialing → Show "Trial ends on [date]" notice
- [ ] Usage at limit → Show "At Limit" warning, upgrade CTA
- [ ] Usage over limit → Show "Over Limit" warning, upgrade CTA
- [ ] No invoices → Show "No invoices yet" message
- [ ] Many invoices → Pagination or "View All" link
- [ ] Invoice not available → Show "Invoice not available" notice
- [ ] Payment method expired → Show "Payment method expired" warning
- [ ] Payment failed → Show "Payment failed" warning, update payment CTA
- [ ] Network error → Show error, allow retry
- [ ] Stripe portal unavailable → Show error, contact support CTA
- [ ] Plan change pending → Show "Plan change pending" notice
- [ ] Downgrade scheduled → Show "Downgrading on [date]" notice

### User Story: Upgrade Plan

**As a** service provider  
**I want to** upgrade my plan  
**So that** I can access more features and higher limits

**Acceptance Criteria:**
- [ ] Shows plans: Free, Pro, Pro+, Enterprise
- [ ] Shows features: Feature comparison table
- [ ] Shows current plan: Highlights current plan
- [ ] Shows pricing: Monthly and annual prices
- [ ] Can select plan: Click plan to select
- [ ] Can select billing: Monthly or annual
- [ ] Shows savings: Annual savings highlighted
- [ ] Upgrade button: "Upgrade to [Plan]" button
- [ ] Redirects to Stripe: Stripe Checkout page
- [ ] Success handling: Webhook updates subscription
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] Already on plan → Show "Current Plan" badge, disable upgrade
- [ ] On higher plan → Show "Downgrade" option instead
- [ ] Payment method missing → Show "Add Payment Method" CTA
- [ ] Payment method expired → Show "Update Payment Method" CTA
- [ ] Stripe checkout fails → Show error, allow retry
- [ ] Stripe checkout cancelled → Return to plans page
- [ ] Webhook delay → Show "Processing..." state
- [ ] Webhook fails → Show error, contact support CTA
- [ ] Plan change pending → Show "Plan change pending" notice
- [ ] Concurrent upgrades → Handle race conditions
- [ ] Network error → Show error, allow retry
- [ ] Account suspended → Block upgrades
- [ ] Trial expired → Show "Trial expired" notice
- [ ] Payment failed → Show "Payment failed" error

### User Story: Manage Subscription

**As a** service provider  
**I want to** manage my subscription  
**So that** I can update payment method, cancel, etc.

**Acceptance Criteria:**
- [ ] Manage button: "Manage Subscription" button
- [ ] Redirects to Stripe: Stripe Customer Portal
- [ ] Can update payment: Update payment method
- [ ] Can cancel: Cancel subscription
- [ ] Can resume: Resume cancelled subscription
- [ ] Can update billing: Update billing address
- [ ] Can view invoices: View and download invoices
- [ ] Success handling: Webhook updates subscription
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] No subscription → Show "No active subscription" notice
- [ ] Stripe portal unavailable → Show error, contact support CTA
- [ ] Payment method update fails → Show error, allow retry
- [ ] Cancellation fails → Show error, allow retry
- [ ] Webhook delay → Show "Processing..." state
- [ ] Webhook fails → Show error, contact support CTA
- [ ] Subscription cancelled → Show "Cancelled" notice, resume CTA
- [ ] Subscription past due → Show "Past Due" warning
- [ ] Payment failed → Show "Payment failed" warning
- [ ] Network error → Show error, allow retry
- [ ] Account suspended → Block management

### User Story: View Usage Meters

**As a** service provider  
**I want to** view my usage meters  
**So that** I can track my usage against plan limits

**Acceptance Criteria:**
- [ ] Shows usage: Quotes used/limit, packages used/limit, etc.
- [ ] Shows progress: Progress bars for each meter
- [ ] Shows reset date: When usage resets (monthly)
- [ ] Shows warnings: "80% used" warnings
- [ ] Shows limits: Plan limits clearly displayed
- [ ] Upgrade prompt: Shows upgrade CTA when at limit
- [ ] Real-time updates: Usage updates in real-time
- [ ] Historical data: Shows previous month usage

**Corner Cases:**
- [ ] At limit → Show "At Limit" warning, upgrade CTA
- [ ] Over limit → Show "Over Limit" warning, upgrade CTA
- [ ] Usage reset → Show "Usage reset" notice
- [ ] Usage not reset → Show "Usage will reset on [date]" notice
- [ ] Multiple meters → Show all meters, prioritize important ones
- [ ] No usage → Show "0% used" with progress bar
- [ ] Usage error → Show error, allow retry
- [ ] Network error → Show error, allow retry
- [ ] Usage desync → Show warning, contact support CTA
- [ ] Plan change → Show usage adjustment notice
- [ ] Downgrade → Show "Usage will be limited" warning

---

## Analytics & Reporting

### User Story: View Analytics Dashboard

**As a** service provider  
**I want to** view my business analytics  
**So that** I can understand my performance

**Acceptance Criteria:**
- [ ] Shows metrics: Revenue, orders, quotes, conversion rate
- [ ] Shows charts: Revenue over time, orders over time
- [ ] Shows time range: Last 7 days, 30 days, 90 days, custom
- [ ] Shows filters: Filter by order status, quote status
- [ ] Can export: Export data (if plan allows)
- [ ] Shows comparisons: Compare periods
- [ ] Real-time updates: Data updates in real-time
- [ ] Empty state: "No data yet" if no data

**Corner Cases:**
- [ ] No data → Show empty state with "Get Started" CTA
- [ ] Plan doesn't allow analytics → Show upgrade CTA
- [ ] Plan doesn't allow export → Show upgrade CTA
- [ ] Data loading → Show loading state
- [ ] Data error → Show error, allow retry
- [ ] Network error → Show error, allow retry
- [ ] Large date range → Show "Loading..." state
- [ ] Export fails → Show error, allow retry
- [ ] Export large dataset → Show "Generating..." state
- [ ] Concurrent exports → Queue exports
- [ ] Analytics disabled → Show "Analytics disabled" notice
- [ ] Account suspended → Block analytics

---

## Messages & Communication

### User Story: View Messages

**As a** service provider  
**I want to** view messages with seekers  
**So that** I can communicate about orders

**Acceptance Criteria:**
- [ ] Shows conversations: List of conversations with seekers
- [ ] Shows unread count: Badge showing unread messages
- [ ] Shows last message: Preview of last message
- [ ] Shows seeker info: Seeker name, avatar
- [ ] Shows order context: Order title, status
- [ ] Can filter: By order, by seeker, by unread
- [ ] Can search: Search messages
- [ ] Empty state: "No messages yet" if no messages
- [ ] Real-time updates: New messages appear in real-time

**Corner Cases:**
- [ ] No messages → Show empty state
- [ ] Many conversations → Pagination or infinite scroll
- [ ] Unread messages → Show unread badge, highlight
- [ ] Message send fails → Show error, allow retry
- [ ] Message too long → Truncate or show error
- [ ] Special characters → Handle encoding correctly
- [ ] Network error → Show error, allow retry
- [ ] Real-time connection lost → Show "Reconnecting..." notice
- [ ] Seeker account deleted → Show "Seeker account deleted" notice
- [ ] Order deleted → Show "Order deleted" notice
- [ ] Concurrent messages → Handle race conditions
- [ ] Message deleted → Show "Message deleted" notice

### User Story: Send Message

**As a** service provider  
**I want to** send messages to seekers  
**So that** I can communicate about orders

**Acceptance Criteria:**
- [ ] Message input: Text input field
- [ ] Send button: "Send" button
- [ ] Can attach files: Attach files (within plan limits)
- [ ] File validation: Size limits, format validation
- [ ] Success feedback: Message sent confirmation
- [ ] Error handling: Shows specific error messages
- [ ] Real-time delivery: Message appears immediately
- [ ] Read receipts: Shows when message is read (if available)

**Corner Cases:**
- [ ] Message empty → Disable send button
- [ ] Message too long → Show error, prevent send
- [ ] File too large → Show error with size limit
- [ ] Wrong file format → Show error with allowed formats
- [ ] Upload fails → Show error, allow retry
- [ ] Send fails → Show error, allow retry
- [ ] Network error → Show error, allow retry
- [ ] Order closed → Show warning, allow send
- [ ] Seeker account deleted → Show error, disable send
- [ ] Account suspended → Block sending
- [ ] Rate limit → Show "Too many messages" error
- [ ] Concurrent sends → Handle race conditions
- [ ] Message contains profanity → Show warning, allow send
- [ ] Special characters → Handle encoding correctly

---

## Payouts & Finances

### User Story: View Payouts

**As a** service provider  
**I want to** view my payouts  
**So that** I can track my earnings

**Acceptance Criteria:**
- [ ] Shows payouts: List of all payouts
- [ ] Shows status: Pending, Paid, Failed
- [ ] Shows amount: Payout amount in THB
- [ ] Shows date: Scheduled date, paid date
- [ ] Shows orders: Orders included in payout
- [ ] Can filter: By status, by date range
- [ ] Can search: Search by payout ID
- [ ] Shows total: Total earnings, pending payouts
- [ ] Empty state: "No payouts yet" if no payouts

**Corner Cases:**
- [ ] No payouts → Show empty state
- [ ] Payout pending → Show "Pending" badge, scheduled date
- [ ] Payout failed → Show "Failed" badge, error message
- [ ] Payout paid → Show "Paid" badge, paid date
- [ ] Many payouts → Pagination or infinite scroll
- [ ] Search returns no results → Show "No payouts found"
- [ ] Filter returns no results → Show "No payouts match your filter"
- [ ] Network error → Show error, allow retry
- [ ] Payout status changed → Show notification, update UI
- [ ] Concurrent updates → Handle race conditions
- [ ] Payout not found → Show error, refresh list
- [ ] Account suspended → Block payouts
- [ ] Payment method not set → Show "Set up payment method" CTA

### User Story: View Earnings

**As a** service provider  
**I want to** view my earnings summary  
**So that** I can understand my financial performance

**Acceptance Criteria:**
- [ ] Shows total earnings: All-time earnings
- [ ] Shows period earnings: This month, last month, custom range
- [ ] Shows breakdown: By order, by service package
- [ ] Shows pending: Pending payouts amount
- [ ] Shows paid: Paid payouts amount
- [ ] Shows chart: Earnings over time chart
- [ ] Can export: Export earnings report (if plan allows)
- [ ] Shows fees: Platform fees deducted
- [ ] Shows net: Net earnings after fees

**Corner Cases:**
- [ ] No earnings → Show "No earnings yet" message
- [ ] Negative earnings → Show "Refunds exceed earnings" notice
- [ ] Large earnings → Format large numbers correctly
- [ ] Earnings error → Show error, allow retry
- [ ] Network error → Show error, allow retry
- [ ] Export fails → Show error, allow retry
- [ ] Export large dataset → Show "Generating..." state
- [ ] Plan doesn't allow export → Show upgrade CTA
- [ ] Account suspended → Block earnings view
- [ ] Payment method not set → Show "Set up payment method" CTA

---

## Settings & Preferences

### User Story: Manage Account Settings

**As a** service provider  
**I want to** manage my account settings  
**So that** I can control my account preferences

**Acceptance Criteria:**
- [ ] Can update: Email, name, phone, password
- [ ] Can update: Language, timezone, locale
- [ ] Can update: Notification preferences
- [ ] Can update: Privacy settings
- [ ] Can delete: Delete account (with confirmation)
- [ ] Validation: Email format, password strength
- [ ] Success feedback: "Settings updated successfully"
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] Email already taken → Show error, suggest alternatives
- [ ] Password too weak → Show error, suggest stronger password
- [ ] Password confirmation mismatch → Show error
- [ ] Current password incorrect → Show error
- [ ] Network error → Show error, allow retry
- [ ] Save fails → Show error, keep form data
- [ ] Concurrent updates → Show conflict warning
- [ ] Account suspended → Block updates
- [ ] Delete account → Show confirmation, handle active orders
- [ ] Delete account with active orders → Show warning, block deletion
- [ ] Delete account with pending payouts → Show warning, block deletion
- [ ] Browser back button → Warn about unsaved changes
- [ ] Form timeout → Show warning, allow save

### User Story: Manage Notification Preferences

**As a** service provider  
**I want to** manage my notification preferences  
**So that** I can control what notifications I receive

**Acceptance Criteria:**
- [ ] Can toggle: Email notifications, push notifications, SMS notifications
- [ ] Can configure: Notification types (orders, quotes, messages, etc.)
- [ ] Can set frequency: Immediate, daily digest, weekly digest
- [ ] Can set quiet hours: Do not disturb hours
- [ ] Success feedback: "Preferences updated successfully"
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] No notification methods → Show "Enable at least one method" error
- [ ] Invalid email → Show error
- [ ] Invalid phone → Show error
- [ ] Network error → Show error, allow retry
- [ ] Save fails → Show error, keep preferences
- [ ] Concurrent updates → Show conflict warning
- [ ] Account suspended → Block updates
- [ ] Browser back button → Warn about unsaved changes

---

## Verification & Compliance

### User Story: View Verification Status

**As a** service provider  
**I want to** view my verification status  
**So that** I can understand if I'm verified

**Acceptance Criteria:**
- [ ] Shows status: Pending, Approved, Changes Requested, Rejected
- [ ] Shows checklist: Verification checklist items
- [ ] Shows feedback: Admin feedback if changes requested or rejected
- [ ] Shows date: Verification date if approved
- [ ] Can resubmit: Resubmit if rejected or changes requested
- [ ] Can upload: Upload additional documents
- [ ] Shows impact: What features require verification
- [ ] Empty state: "Not yet verified" if not started

**Corner Cases:**
- [ ] Verification pending → Show "Pending" badge, estimated time
- [ ] Verification approved → Show "Verified" badge, verification date
- [ ] Changes requested → Show "Changes Requested" badge, feedback
- [ ] Verification rejected → Show "Rejected" badge, reason
- [ ] Verification expired → Show "Verification expired" notice
- [ ] Resubmission fails → Show error, allow retry
- [ ] Document upload fails → Show error, allow retry
- [ ] Document too large → Show error with size limit
- [ ] Wrong document format → Show error with allowed formats
- [ ] Network error → Show error, allow retry
- [ ] Account suspended → Show "Account suspended" notice
- [ ] Verification in progress → Show "Verification in progress" notice

### User Story: Submit Verification

**As a** service provider  
**I want to** submit my verification documents  
**So that** I can get verified

**Acceptance Criteria:**
- [ ] Upload documents: Upload required documents
- [ ] Fill checklist: Complete verification checklist
- [ ] Submit button: Submit for review
- [ ] Success feedback: "Verification submitted successfully"
- [ ] Shows status: "Pending Review" status
- [ ] Error handling: Shows specific error messages

**Corner Cases:**
- [ ] Already verified → Show "Already verified" notice
- [ ] Verification pending → Show "Verification pending" notice
- [ ] Missing documents → Show error, list missing documents
- [ ] Document upload fails → Show error, allow retry
- [ ] Document too large → Show error with size limit
- [ ] Wrong document format → Show error with allowed formats
- [ ] Checklist incomplete → Show error, highlight incomplete items
- [ ] Network error → Show error, allow retry
- [ ] Submit fails → Show error, allow retry
- [ ] Account suspended → Block submission
- [ ] Concurrent submission → Handle race conditions

---

## Corner Cases & Edge Cases

### Authentication & Authorization

- [ ] Provider not logged in → Redirect to login
- [ ] Provider session expired → Show "Session expired" notice, redirect to login
- [ ] Provider account suspended → Show suspension notice, disable actions
- [ ] Provider account deleted → Show "Account deleted" notice, redirect to login
- [ ] Provider role changed → Show "Role changed" notice, redirect appropriately
- [ ] Provider not verified → Block verified-only features, show verification CTA
- [ ] Provider onboarding incomplete → Redirect to onboarding
- [ ] Provider MFA required → Require MFA before sensitive actions
- [ ] Provider IP blocked → Show "Access denied" error
- [ ] Provider rate limited → Show "Too many requests" error

### Plan & Entitlement Edge Cases

- [ ] Plan expired → Show "Plan expired" notice, downgrade to Free
- [ ] Plan payment failed → Show "Payment failed" notice, grace period
- [ ] Plan cancelled → Show "Cancelling on [date]" notice
- [ ] Plan downgrade → Block new creations over limit, keep existing
- [ ] Plan upgrade → Immediately apply new limits
- [ ] Entitlement desync → Show warning, contact support CTA
- [ ] Usage counter desync → Show warning, contact support CTA
- [ ] Usage reset failed → Show warning, contact support CTA
- [ ] Plan change pending → Show "Plan change pending" notice
- [ ] Trial expired → Show "Trial expired" notice, upgrade CTA
- [ ] Enterprise plan → Show custom limits, contact manager CTA

### Data & State Edge Cases

- [ ] Order deleted → Show "Order deleted" notice
- [ ] Request deleted → Show "Request deleted" notice
- [ ] Quote deleted → Show "Quote deleted" notice
- [ ] Seeker account deleted → Show "Seeker account deleted" notice
- [ ] Provider account deleted → Show "Account deleted" notice
- [ ] Data conflict → Show conflict warning, allow resolve
- [ ] Concurrent updates → Show conflict warning
- [ ] Stale data → Show "Data outdated" notice, refresh
- [ ] Partial data → Show available data, indicate loading
- [ ] Data corruption → Show error, contact support CTA

### Network & Performance Edge Cases

- [ ] Network offline → Show "Offline" notice, queue actions
- [ ] Network slow → Show loading state, allow cancellation
- [ ] Network timeout → Show timeout error, allow retry
- [ ] Network error → Show error, allow retry
- [ ] Server error → Show "Server error" notice, contact support CTA
- [ ] Rate limit → Show "Too many requests" error, retry after
- [ ] Service unavailable → Show "Service unavailable" notice
- [ ] Maintenance mode → Show "Maintenance" notice
- [ ] API version mismatch → Show "Update required" notice

### File & Upload Edge Cases

- [ ] File too large → Show error with size limit
- [ ] Wrong file format → Show error with allowed formats
- [ ] File corrupted → Show error, allow retry
- [ ] Upload interrupted → Resume upload or show error
- [ ] Upload timeout → Show timeout error, allow retry
- [ ] Virus detected → Show "Virus detected" error, block upload
- [ ] File scan pending → Show "Scanning..." state
- [ ] File scan failed → Show error, allow retry
- [ ] Multiple uploads → Queue uploads, show individual progress
- [ ] Concurrent uploads → Handle race conditions
- [ ] Browser refresh during upload → Resume or show error
- [ ] File deleted → Show "File deleted" notice
- [ ] File not found → Show "File not found" error

### Payment & Financial Edge Cases

- [ ] Payment failed → Show "Payment failed" error
- [ ] Payment pending → Show "Payment pending" notice
- [ ] Payment refunded → Show "Payment refunded" notice
- [ ] Escrow released → Show "Payment released" notice
- [ ] Escrow held → Show "Payment held" notice
- [ ] Payout failed → Show "Payout failed" error, contact support CTA
- [ ] Payout pending → Show "Payout pending" notice
- [ ] Payment method expired → Show "Payment method expired" warning
- [ ] Payment method invalid → Show "Payment method invalid" error
- [ ] Stripe error → Show Stripe error message
- [ ] Webhook delay → Show "Processing..." state
- [ ] Webhook failed → Show error, contact support CTA

### Time & Date Edge Cases

- [ ] Timezone mismatch → Convert times correctly
- [ ] Date range invalid → Show error, suggest valid range
- [ ] Date in past → Show warning if applicable
- [ ] Date in future → Show warning if applicable
- [ ] Daylight saving time → Handle DST correctly
- [ ] Month end → Handle month boundaries correctly
- [ ] Year end → Handle year boundaries correctly
- [ ] Leap year → Handle leap years correctly
- [ ] Usage reset timing → Reset at correct time (Asia/Bangkok)

### UI/UX Edge Cases

- [ ] Browser back button → Warn about unsaved changes
- [ ] Browser refresh → Warn about unsaved changes
- [ ] Multiple tabs → Sync data correctly
- [ ] Window resize → Responsive design works
- [ ] Mobile view → Mobile-optimized UI
- [ ] Tablet view → Tablet-optimized UI
- [ ] Desktop view → Desktop-optimized UI
- [ ] Print view → Print-friendly layout
- [ ] Screen reader → Accessibility works
- [ ] Keyboard navigation → Keyboard navigation works
- [ ] Focus management → Focus management works
- [ ] Loading states → Loading states shown
- [ ] Error states → Error states shown
- [ ] Empty states → Empty states shown
- [ ] Success states → Success states shown

### Integration Edge Cases

- [ ] Stripe integration error → Show error, contact support CTA
- [ ] Email service error → Show error, allow retry
- [ ] File storage error → Show error, allow retry
- [ ] Database error → Show error, contact support CTA
- [ ] Cache error → Show error, allow retry
- [ ] Webhook error → Show error, contact support CTA
- [ ] API version mismatch → Show "Update required" notice
- [ ] Third-party service down → Show "Service unavailable" notice

---

## Summary

This document covers comprehensive user stories and corner cases for provider dashboard tools. Each user story includes:

1. **Acceptance Criteria**: What must be implemented
2. **Corner Cases**: Edge cases and error scenarios
3. **Error Handling**: How errors should be handled
4. **State Management**: How different states should be handled
5. **Integration Points**: How integrations should work
6. **Performance**: Performance considerations
7. **Security**: Security considerations
8. **Accessibility**: Accessibility considerations

**Next Steps:**
1. Review and prioritize user stories
2. Create detailed task breakdowns
3. Create wireframes/mockups
4. Define API contracts
5. Implement user stories
6. Test corner cases
7. Document edge case handling

---

**Last Updated:** 2025-01-11  
**Status:** 📋 Planning Complete — Ready for Implementation Planning

