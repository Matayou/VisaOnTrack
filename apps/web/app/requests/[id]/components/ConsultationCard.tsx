'use client';

import React from 'react';
import { type Consultation } from '@visaontrack/client';
import { 
  Video, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Gift,
  CreditCard,
  Building2,
  BadgeCheck
} from 'lucide-react';

interface ConsultationCardProps {
  consultation: Consultation;
  userRole: 'SEEKER' | 'PROVIDER';
  onBook?: (consultation: Consultation) => void;
  onComplete?: (consultationId: string) => void;
  onCancel?: (consultationId: string) => void;
}

const statusConfig = {
  OFFERED: {
    label: 'Available',
    color: 'bg-blue-100 text-blue-700',
    icon: AlertCircle,
  },
  BOOKED: {
    label: 'Booked',
    color: 'bg-amber-100 text-amber-700',
    icon: Calendar,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-500',
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

export function ConsultationCard({
  consultation,
  userRole,
  onBook,
  onComplete,
  onCancel,
}: ConsultationCardProps) {
  const status = statusConfig[consultation.status] || statusConfig.OFFERED;
  const StatusIcon = status.icon;
  const isFree = consultation.type === 'FREE';
  const canBook = consultation.status === 'OFFERED' && userRole === 'SEEKER';
  const canComplete = consultation.status === 'BOOKED' && userRole === 'PROVIDER';
  const canCancel = (consultation.status === 'OFFERED' || consultation.status === 'BOOKED');

  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch {
      return null;
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Type Badge */}
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isFree 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            {isFree ? <Gift className="h-3.5 w-3.5" /> : <CreditCard className="h-3.5 w-3.5" />}
            {isFree ? 'Free' : currencyFormatter.format(consultation.priceTHB || 0)}
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {consultation.durationMinutes} min
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </div>
      </div>

      {/* Provider Info */}
      {consultation.provider && (
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <Building2 className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-900">
                {consultation.provider.businessName}
              </span>
              {consultation.provider.verifiedAt && (
                <BadgeCheck className="h-4 w-4 text-blue-500" />
              )}
            </div>
            {consultation.provider.yearsExperience && (
              <span className="text-xs text-gray-500">
                {consultation.provider.yearsExperience} years experience
              </span>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      {consultation.description && (
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
          {consultation.description}
        </p>
      )}

      {/* Scheduled Time */}
      {consultation.scheduledAt && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-700">
            {formatDateTime(consultation.scheduledAt)}
          </span>
        </div>
      )}

      {/* Meeting Link */}
      {consultation.meetingLink && consultation.status === 'BOOKED' && (
        <a
          href={consultation.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-100"
        >
          <Video className="h-4 w-4" />
          <span className="font-medium">Join Meeting</span>
        </a>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {canBook && (
          <button
            onClick={() => onBook?.(consultation)}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            {isFree ? 'Book Free Call' : `Book for ${currencyFormatter.format(consultation.priceTHB || 0)}`}
          </button>
        )}

        {canComplete && (
          <button
            onClick={() => onComplete?.(consultation.id)}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            Mark Complete
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => onCancel?.(consultation.id)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

