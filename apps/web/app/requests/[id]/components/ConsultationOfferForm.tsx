'use client';

import React, { useState } from 'react';
import { api, type OfferConsultationRequest, ConsultationType } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { X, Video, Clock, Gift, CreditCard, Loader } from 'lucide-react';

interface ConsultationOfferFormProps {
  requestId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
];

const PRICE_SUGGESTIONS = [500, 1000, 1500, 2000, 3000, 5000];

export function ConsultationOfferForm({
  requestId,
  onSuccess,
  onCancel,
}: ConsultationOfferFormProps) {
  const [type, setType] = useState<ConsultationType>(ConsultationType.FREE);
  const [durationMinutes, setDurationMinutes] = useState<15 | 30 | 45 | 60>(30);
  const [priceTHB, setPriceTHB] = useState<number>(1000);
  const [description, setDescription] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const requestBody: OfferConsultationRequest = {
        type,
        durationMinutes: durationMinutes as OfferConsultationRequest.durationMinutes,
        description: description.trim() || undefined,
        meetingLink: meetingLink.trim() || undefined,
      };

      if (type === ConsultationType.PAID) {
        requestBody.priceTHB = priceTHB;
      }

      await api.consultations.offerConsultation({
        id: requestId,
        requestBody,
      });

      onSuccess();
    } catch (err: any) {
      console.error('[ConsultationOfferForm] Error:', err);
      setError(getErrorDisplayMessage(err, 'offer consultation'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">
              Offer Consultation
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Type Selection */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Consultation Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType(ConsultationType.FREE)}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  type === ConsultationType.FREE
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Gift className="h-5 w-5" />
                <span className="font-medium">Free</span>
              </button>
              <button
                type="button"
                onClick={() => setType(ConsultationType.PAID)}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  type === ConsultationType.PAID
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Paid</span>
              </button>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDurationMinutes(option.value as 15 | 30 | 45 | 60)}
                  className={`flex items-center justify-center gap-1 rounded-lg border px-3 py-2.5 text-sm transition-all ${
                    durationMinutes === option.value
                      ? 'border-primary bg-primary/10 font-medium text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  {option.value}m
                </button>
              ))}
            </div>
          </div>

          {/* Price (for paid consultations) */}
          {type === ConsultationType.PAID && (
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price (THB)
              </label>
              <div className="mb-2">
                <input
                  type="number"
                  value={priceTHB}
                  onChange={(e) => setPriceTHB(Number(e.target.value))}
                  min={500}
                  max={10000}
                  step={100}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter price in THB"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {PRICE_SUGGESTIONS.map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setPriceTHB(price)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      priceTHB === price
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ฿{price.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              What will you discuss?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Describe what topics you'll cover in the consultation..."
            />
            <p className="mt-1 text-xs text-gray-400">
              {description.length}/500 characters
            </p>
          </div>

          {/* Meeting Link (optional) */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Meeting Link <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            />
            <p className="mt-1 text-xs text-gray-400">
              You can add this later before the scheduled time
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Offer Consultation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

