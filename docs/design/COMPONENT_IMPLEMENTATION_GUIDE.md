# Component Implementation Guide

**Project:** VisaOnTrack (SawadeePass)
**Date:** 2025-11-30
**Focus:** Phase 4 Missing Components (Messaging, Proposals, Consultations)

---

## Overview

This guide provides Tailwind-first implementation patterns for the missing core features identified in the RECOVERY_PLAN. Each component follows the established design system standards.

---

## 1. MessageThread Component

### Purpose
Display conversation history between seeker and provider with proper message bubbles, timestamps, and attachment support.

### Design Specifications

**Layout:**
- Container: Card with `padding="none"`
- Message bubbles: `rounded-lg` (16px) for natural conversation feel
- Max width: 70% for readability
- Alignment: Sender (right), Receiver (left)

**Colors:**
- Sender bubble: `bg-primary` with `text-white`
- Receiver bubble: `bg-bg-secondary` with `text-text-primary`
- Timestamp: `text-text-tertiary text-xs`

### Implementation

**File:** `apps/web/components/messaging/MessageThread.tsx`

```tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { format } from 'date-fns';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  currentUserId,
}) => {
  return (
    <Card padding="none" className="max-h-[600px] overflow-y-auto">
      <div className="flex flex-col gap-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-text-tertiary">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isSender = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex flex-col gap-1 ${
                  isSender ? 'items-end' : 'items-start'
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    isSender
                      ? 'bg-primary text-white'
                      : 'bg-bg-secondary text-text-primary'
                  }`}
                >
                  {!isSender && (
                    <p className="mb-1 text-xs font-medium opacity-80">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                      {message.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 rounded-base px-3 py-2 text-xs transition-all ${
                            isSender
                              ? 'bg-white/10 hover:bg-white/20'
                              : 'bg-bg-primary hover:bg-bg-tertiary'
                          }`}
                        >
                          <span>📎</span>
                          <span className="flex-1 truncate">
                            {attachment.fileName}
                          </span>
                          <span className="text-xs opacity-60">
                            {formatFileSize(attachment.fileSize)}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <p className="px-1 text-xs text-text-tertiary">
                  {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                </p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
```

---

## 2. MessageComposer Component

### Purpose
Input area for composing messages with attachment support and character count.

### Design Specifications

**Layout:**
- Multi-line textarea with auto-expand (up to 6 lines)
- Fixed height: `min-h-24` (96px)
- Attachment button on left, send button on right
- Character counter below input (optional)

### Implementation

**File:** `apps/web/components/messaging/MessageComposer.tsx`

```tsx
'use client';

import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui';

export interface MessageComposerProps {
  onSend: (content: string, attachments: File[]) => Promise<void>;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  placeholder = 'Type your message...',
  maxLength = 2000,
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && attachments.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSend(content.trim(), attachments);
      setContent('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-base bg-bg-secondary px-3 py-2 text-sm"
            >
              <Paperclip className="h-4 w-4 text-text-tertiary" />
              <span className="max-w-[200px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-text-tertiary hover:text-error transition-colors"
                aria-label="Remove attachment"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        {/* Attachment Button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleAttachmentSelect}
          className="hidden"
          aria-label="Attach files"
        />
        <Button
          type="button"
          variant="outline"
          size="md"
          icon={<Paperclip className="h-4 w-4" />}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSubmitting}
          aria-label="Attach file"
        />

        {/* Message Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled || isSubmitting}
          className="flex-1 min-h-24 max-h-[200px] resize-y rounded-base border border-border-light bg-bg-primary px-4 py-3 text-base text-text-primary outline-none transition-all duration-150 placeholder:text-text-tertiary hover:border-border-medium focus:border-primary focus:shadow-focus-primary disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Message content"
        />

        {/* Send Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<Send className="h-4 w-4" />}
          loading={isSubmitting}
          disabled={disabled || (!content.trim() && attachments.length === 0)}
          aria-label="Send message"
        />
      </div>

      {/* Character Counter */}
      {maxLength && (
        <div className="flex justify-end">
          <span
            className={`text-xs ${
              content.length > maxLength * 0.9
                ? 'text-warning'
                : 'text-text-tertiary'
            }`}
          >
            {content.length} / {maxLength}
          </span>
        </div>
      )}
    </form>
  );
};
```

---

## 3. ProposalCard Component

### Purpose
Display provider proposals with pricing, timeline, and accept/decline actions.

### Design Specifications

**Layout:**
- Card container with `padding="md"`
- Provider avatar and name at top
- Proposal details in body
- Action buttons at bottom
- Badge for proposal status

### Implementation

**File:** `apps/web/components/proposals/ProposalCard.tsx`

```tsx
'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';
import { Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';

export interface Proposal {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  fee: number;
  timeline: string;
  description: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: Date;
}

export interface ProposalCardProps {
  proposal: Proposal;
  onAccept?: (proposalId: string) => Promise<void>;
  onDecline?: (proposalId: string) => Promise<void>;
  isActionsDisabled?: boolean;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onAccept,
  onDecline,
  isActionsDisabled = false,
}) => {
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [isDeclining, setIsDeclining] = React.useState(false);

  const handleAccept = async () => {
    if (!onAccept) return;
    setIsAccepting(true);
    try {
      await onAccept(proposal.id);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!onDecline) return;
    setIsDeclining(true);
    try {
      await onDecline(proposal.id);
    } finally {
      setIsDeclining(false);
    }
  };

  const getStatusBadge = () => {
    switch (proposal.status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-base bg-success-light px-2 py-1 text-xs font-medium text-success">
            <CheckCircle className="h-3 w-3" />
            Accepted
          </span>
        );
      case 'DECLINED':
        return (
          <span className="inline-flex items-center gap-1 rounded-base bg-error-light px-2 py-1 text-xs font-medium text-error">
            <XCircle className="h-3 w-3" />
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-base bg-warning-light px-2 py-1 text-xs font-medium text-warning">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <Card variant="default" padding="md" className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {proposal.providerAvatar ? (
            <img
              src={proposal.providerAvatar}
              alt={proposal.providerName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-semibold">
              {proposal.providerName.charAt(0)}
            </div>
          )}

          {/* Provider Info */}
          <div>
            <h3 className="font-semibold text-text-primary">
              {proposal.providerName}
            </h3>
            <p className="text-xs text-text-tertiary">
              {new Date(proposal.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {getStatusBadge()}
      </div>

      {/* Proposal Details */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {/* Fee */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-base bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Proposed Fee</p>
              <p className="font-semibold text-text-primary">
                ฿{proposal.fee.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-base bg-success/10">
              <Clock className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Timeline</p>
              <p className="font-semibold text-text-primary">
                {proposal.timeline}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {proposal.description}
          </p>
        </div>
      </div>

      {/* Actions */}
      {proposal.status === 'PENDING' && (onAccept || onDecline) && (
        <div className="flex gap-3 border-t border-border-light pt-4">
          {onDecline && (
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleDecline}
              loading={isDeclining}
              disabled={isActionsDisabled || isAccepting}
            >
              Decline
            </Button>
          )}
          {onAccept && (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleAccept}
              loading={isAccepting}
              disabled={isActionsDisabled || isDeclining}
            >
              Accept Proposal
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
```

---

## 4. ProposalForm Component (Provider Side)

### Purpose
Allow providers to submit proposals with fee, timeline, and description.

### Implementation

**File:** `apps/web/components/proposals/ProposalForm.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { Card, Button, FormField } from '@/components/ui';

export interface ProposalFormData {
  fee: number;
  timeline: string;
  description: string;
}

export interface ProposalFormProps {
  requestId: string;
  onSubmit: (data: ProposalFormData) => Promise<void>;
  onCancel?: () => void;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({
  requestId,
  onSubmit,
  onCancel,
}) => {
  const [fee, setFee] = useState('');
  const [timeline, setTimeline] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Partial<ProposalFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<ProposalFormData> = {};

    if (!fee || parseFloat(fee) <= 0) {
      newErrors.fee = 'Please enter a valid fee amount';
    }

    if (!timeline.trim()) {
      newErrors.timeline = 'Please specify a timeline';
    }

    if (!description.trim() || description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        fee: parseFloat(fee),
        timeline: timeline.trim(),
        description: description.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="default" padding="lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Submit Proposal
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Provide your pricing and timeline for this visa application
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Fee */}
        <FormField
          label="Proposed Fee (THB)"
          name="fee"
          type="number"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          placeholder="5000"
          error={errors.fee}
          required
          helperText="Enter the total fee for your services"
        />

        {/* Timeline */}
        <FormField
          label="Estimated Timeline"
          name="timeline"
          type="text"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          placeholder="e.g., 2-3 weeks"
          error={errors.timeline}
          required
          helperText="How long will the process take?"
        />

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium text-text-primary">
            Description
            <span className="ml-1 text-error">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your services, what's included, and any requirements..."
            rows={6}
            className="w-full rounded-base border border-border-light bg-bg-primary px-4 py-3 text-base text-text-primary outline-none transition-all duration-150 placeholder:text-text-tertiary hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
          />
          {errors.description && (
            <span className="text-xs text-error">{errors.description}</span>
          )}
          <span className="text-xs text-text-tertiary">
            {description.length} / 500 characters (min 50)
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-border-light pt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={isSubmitting}
          >
            Submit Proposal
          </Button>
        </div>
      </form>
    </Card>
  );
};
```

---

## 5. Mobile ActionSheet Component

### Purpose
Bottom sheet modal for mobile actions (iOS-style).

### Design Specifications

**Layout:**
- Fixed bottom position on mobile
- Slide-up animation
- Backdrop blur
- Rounded top corners (`rounded-t-xl`)

### Implementation

**File:** `apps/web/components/ui/MobileActionSheet.tsx`

```tsx
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface MobileActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg animate-slide-up rounded-t-xl bg-bg-primary md:rounded-xl md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border-light p-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text-secondary"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
```

---

## Component Export Barrel

Update `apps/web/components/ui/index.ts`:

```tsx
export * from './Button';
export * from './Input';
export * from './Select';
export * from './FormField';
export * from './Card';
export * from './Modal';
export * from './Spinner';
export * from './Toast';
export * from './PageBackground';
export * from './GradientText';
export * from './MobileActionSheet';
```

Create `apps/web/components/messaging/index.ts`:

```tsx
export * from './MessageThread';
export * from './MessageComposer';
```

Create `apps/web/components/proposals/index.ts`:

```tsx
export * from './ProposalCard';
export * from './ProposalForm';
```

---

## Responsive Patterns

### Mobile-First Breakpoints

```tsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col gap-4 md:flex-row">
  <div className="flex-1">Content A</div>
  <div className="flex-1">Content B</div>
</div>

// Full width on mobile, fixed width on desktop
<div className="w-full md:max-w-2xl">
  <Card>...</Card>
</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop Only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile Only</div>
```

---

## Accessibility Checklist

For every component:

- [ ] Semantic HTML (button, form, nav, etc.)
- [ ] ARIA labels for icon-only buttons
- [ ] Focus states (focus:ring-2 focus:ring-primary)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Error announcements (role="alert")
- [ ] Touch targets 44×44px minimum
- [ ] Color contrast 4.5:1 minimum
- [ ] Loading states (aria-busy, aria-live)

---

## Testing Strategy

1. **Visual Testing:** Test on mobile (375px), tablet (768px), desktop (1440px)
2. **Keyboard Testing:** Tab through all interactive elements
3. **Screen Reader:** Test with NVDA/JAWS/VoiceOver
4. **Touch Testing:** Verify touch targets on real devices
5. **Performance:** Lighthouse score 90+ on all pages

---

## Next Steps

1. Implement these components in order: MessageThread → MessageComposer → ProposalCard → ProposalForm
2. Integrate with existing API endpoints
3. Add to component library documentation
4. Create usage examples in Storybook (optional)
5. Test on production-like data

---

**End of Guide**
