'use client';

import React from 'react';
import { type Quote } from '@visaontrack/client';
import { 
  Building2, 
  BadgeCheck, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface ProposalCardProps {
  quote: Quote;
  userRole: 'SEEKER' | 'PROVIDER';
  onAccept?: (quoteId: string) => void;
  onDecline?: (quoteId: string) => void;
  onViewDetails?: (quote: Quote) => void;
}

const statusConfig = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-600',
    icon: FileText,
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-700',
    icon: AlertCircle,
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  DECLINED: {
    label: 'Declined',
    color: 'bg-red-100 text-red-600',
    icon: XCircle,
  },
  EXPIRED: {
    label: 'Expired',
    color: 'bg-gray-100 text-gray-400',
    icon: Clock,
  },
};

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
});

export function ProposalCard({
  quote,
  userRole,
  onAccept,
  onDecline,
  onViewDetails,
}: ProposalCardProps) {
  const status = statusConfig[quote.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;
  const canRespond = quote.status === 'PENDING' && userRole === 'SEEKER';

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  // Calculate total from items
  const calculatedTotal = quote.items?.reduce(
    (sum, item) => sum + (item.priceTHB * item.quantity),
    0
  ) || quote.totalTHB;

  return (
    <div className="rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-start justify-between">
          {/* Provider Info */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Building2 className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-gray-900">
                  {quote.provider?.businessName || 'Provider'}
                </span>
                {quote.provider?.verifiedAt && (
                  <BadgeCheck className="h-4 w-4 text-blue-500" />
                )}
              </div>
              {quote.provider?.yearsExperience && (
                <span className="text-xs text-gray-500">
                  {quote.provider.yearsExperience} years experience
                </span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {/* Line Items */}
        {quote.items && quote.items.length > 0 && (
          <div className="mb-4 space-y-2">
            {quote.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {item.title}
                  {item.quantity > 1 && (
                    <span className="text-gray-400"> × {item.quantity}</span>
                  )}
                </span>
                <span className="font-medium text-gray-900">
                  {currencyFormatter.format(item.priceTHB * item.quantity)}
                </span>
              </div>
            ))}
            {quote.items.length > 3 && (
              <button
                onClick={() => onViewDetails?.(quote)}
                className="text-sm text-primary hover:underline"
              >
                +{quote.items.length - 3} more items
              </button>
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-medium text-gray-600">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {currencyFormatter.format(calculatedTotal)}
          </span>
        </div>

        {/* ETA & Terms */}
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          {quote.etaDays && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {quote.etaDays} days
            </span>
          )}
          {quote.validUntil && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Valid until {formatDate(quote.validUntil)}
            </span>
          )}
        </div>

        {/* Terms */}
        {quote.terms && (
          <p className="mt-3 text-sm text-gray-500 line-clamp-2">
            {quote.terms}
          </p>
        )}
      </div>

      {/* Actions */}
      {canRespond && (
        <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
          <button
            onClick={() => onDecline?.(quote.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ThumbsDown className="h-4 w-4" />
            Decline
          </button>
          <button
            onClick={() => onAccept?.(quote.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <ThumbsUp className="h-4 w-4" />
            Accept
          </button>
        </div>
      )}
    </div>
  );
}

