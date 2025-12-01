'use client';

import React, { useEffect, useState } from 'react';
import { api, type Consultation } from '@visaontrack/client';
import { ConsultationCard } from './ConsultationCard';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, Video, Plus, Gift } from 'lucide-react';

interface ConsultationsListProps {
  requestId: string;
  userRole: 'SEEKER' | 'PROVIDER';
  onOfferConsultation?: () => void;
  onBookConsultation?: (consultation: Consultation) => void;
}

export function ConsultationsList({
  requestId,
  userRole,
  onOfferConsultation,
  onBookConsultation,
}: ConsultationsListProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConsultations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.consultations.listConsultations({ id: requestId });
      setConsultations(data);
    } catch (err: any) {
      console.error('[ConsultationsList] Error loading:', err);
      setError(getErrorDisplayMessage(err, 'load consultations'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [requestId]);

  const handleComplete = async (consultationId: string) => {
    try {
      await api.consultations.completeConsultation({ id: consultationId });
      await loadConsultations();
    } catch (err: any) {
      alert(getErrorDisplayMessage(err, 'complete consultation'));
    }
  };

  const handleCancel = async (consultationId: string) => {
    if (!confirm('Are you sure you want to cancel this consultation?')) return;
    
    try {
      await api.consultations.cancelConsultation({ id: consultationId });
      await loadConsultations();
    } catch (err: any) {
      alert(getErrorDisplayMessage(err, 'cancel consultation'));
    }
  };

  // Group consultations by status for better UX
  const activeConsultations = consultations.filter(
    (c) => c.status === 'OFFERED' || c.status === 'BOOKED'
  );
  const pastConsultations = consultations.filter(
    (c) => c.status === 'COMPLETED' || c.status === 'CANCELLED' || c.status === 'EXPIRED'
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading consultations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadConsultations}
          className="mt-2 text-sm font-medium text-red-700 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Consultations</h2>
          {consultations.length > 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {consultations.length}
            </span>
          )}
        </div>

        {userRole === 'PROVIDER' && onOfferConsultation && (
          <button
            onClick={onOfferConsultation}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Offer Consultation
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {consultations.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Gift className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mb-1 font-medium text-gray-900">
              {userRole === 'SEEKER' 
                ? 'No consultations offered yet'
                : 'Offer a consultation to connect'}
            </p>
            <p className="text-sm text-gray-500">
              {userRole === 'SEEKER'
                ? 'Providers can offer free or paid consultations to discuss your case'
                : 'Offer a free discovery call to build trust with the seeker'}
            </p>

            {userRole === 'PROVIDER' && onOfferConsultation && (
              <button
                onClick={onOfferConsultation}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                <Plus className="h-4 w-4" />
                Offer Consultation
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Consultations */}
            {activeConsultations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Active ({activeConsultations.length})
                </h3>
                {activeConsultations.map((consultation) => (
                  <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    userRole={userRole}
                    onBook={onBookConsultation}
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}

            {/* Past Consultations */}
            {pastConsultations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400">
                  Past ({pastConsultations.length})
                </h3>
                {pastConsultations.map((consultation) => (
                  <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    userRole={userRole}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

