'use client';

import React, { useState } from 'react';
import { api, type Consultation, type BookConsultationRequest } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  BadgeCheck,
  Gift,
  CreditCard,
  Loader,
  AlertCircle
} from 'lucide-react';

interface ConsultationBookingModalProps {
  consultation: Consultation;
  onSuccess: () => void;
  onCancel: () => void;
}

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
});

// Generate time slots for the next 7 days
function generateTimeSlots(): { date: Date; label: string }[] {
  const slots: { date: Date; label: string }[] = [];
  const now = new Date();
  
  for (let day = 1; day <= 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    
    // Add slots at 9am, 11am, 2pm, 4pm, 6pm
    const hours = [9, 11, 14, 16, 18];
    hours.forEach((hour) => {
      const slotDate = new Date(date);
      slotDate.setHours(hour, 0, 0, 0);
      
      const label = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(slotDate);
      
      slots.push({ date: slotDate, label });
    });
  }
  
  return slots;
}

export function ConsultationBookingModal({
  consultation,
  onSuccess,
  onCancel,
}: ConsultationBookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const timeSlots = generateTimeSlots();
  const isFree = consultation.type === 'FREE';

  const handleBook = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const requestBody: BookConsultationRequest = {
        scheduledAt: selectedSlot.toISOString(),
      };

      const response = await api.consultations.bookConsultation({
        id: consultation.id,
        requestBody,
      });

      // If paid consultation, handle payment
      if (response.paymentIntent?.clientSecret) {
        // TODO: Integrate Stripe payment flow
        // For now, just show success
        console.log('Payment intent created:', response.paymentIntent);
      }

      onSuccess();
    } catch (err: any) {
      console.error('[ConsultationBookingModal] Error:', err);
      setError(getErrorDisplayMessage(err, 'book consultation'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group slots by date
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    const dateKey = slot.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, typeof timeSlots>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">
              Book Consultation
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Consultation Summary */}
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex items-start gap-3">
            {/* Provider Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {consultation.provider?.businessName || 'Provider'}
                </span>
                {consultation.provider?.verifiedAt && (
                  <BadgeCheck className="h-4 w-4 text-blue-500" />
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {/* Duration */}
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {consultation.durationMinutes} min
                </span>

                {/* Type/Price */}
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  isFree 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {isFree ? (
                    <><Gift className="h-3 w-3" /> Free</>
                  ) : (
                    <><CreditCard className="h-3 w-3" /> {currencyFormatter.format(consultation.priceTHB || 0)}</>
                  )}
                </span>
              </div>

              {consultation.description && (
                <p className="mt-2 text-sm text-gray-500">
                  {consultation.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="max-h-[400px] overflow-y-auto p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <label className="mb-3 block text-sm font-medium text-gray-700">
            Select a time slot
          </label>

          <div className="space-y-4">
            {Object.entries(slotsByDate).map(([dateKey, slots]) => (
              <div key={dateKey}>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  {new Date(dateKey).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((slot, idx) => {
                    const isSelected = selectedSlot?.getTime() === slot.date.getTime();
                    const timeLabel = slot.date.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    });

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSlot(slot.date)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 font-medium text-primary'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {timeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBook}
              disabled={isSubmitting || !selectedSlot}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  {isFree ? 'Confirm Booking' : `Book & Pay ${currencyFormatter.format(consultation.priceTHB || 0)}`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

