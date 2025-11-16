'use client';

import { Shield } from 'lucide-react';

import { ReadinessCard } from '@/app/requests/new/components/readiness/ReadinessCard';
import { sectionCardClass } from '@/app/requests/new/constants';
import { useRequestForm } from '@/app/requests/new/context/RequestFormContext';
import { resolveLocationLabel, resolveVisaLabel } from '@/lib/requestForm';

export function SupportStep() {
  const {
    formState,
    readinessItems,
    readinessStatus,
    handleReadinessStatus,
    readinessReadyCount,
    readinessHelpCount,
    updateField,
    markFieldTouched,
  } = useRequestForm();

  return (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
          <Shield className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">Step 4</p>
          <h2 className="text-2xl font-semibold tracking-tight">What help do you want?</h2>
          <p className="text-text-secondary">Choose the touchpoints: strategy, documents, bookings, follow-up.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary font-semibold">Request preview</p>
              <h3 className="text-xl font-semibold text-text-primary">{formState.title || 'Untitled request'}</h3>
            </div>
            <span className="text-xs text-text-tertiary">{new Intl.DateTimeFormat('en-US').format(new Date())}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-secondary">Personal snapshot</p>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-text-tertiary">Age range</dt>
                  <dd className="font-medium text-text-primary">{formState.ageRange || '—'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-tertiary">Nationality</dt>
                  <dd className="font-medium text-text-primary">{formState.nationality || '—'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-tertiary">Current status</dt>
                  <dd className="font-medium text-text-primary">
                    {formState.currentLocation === 'IN_THAILAND' ? 'Inside Thailand' : 'Outside Thailand'}
                  </dd>
                </div>
                {formState.currentLocation === 'IN_THAILAND' && (
                  <div className="flex items-center justify-between">
                    <dt className="text-text-tertiary">Current visa</dt>
                    <dd className="font-medium text-text-primary">{formState.currentVisaType || '—'}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-text-secondary">Intent & logistics</p>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-text-tertiary">Target visa</dt>
                  <dd className="font-medium text-text-primary">{resolveVisaLabel(formState.visaType) || '—'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-tertiary">Preferred location</dt>
                  <dd className="font-medium text-text-primary">{resolveLocationLabel(formState.location) || '—'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-tertiary">Budget range</dt>
                  <dd className="font-medium text-text-primary">
                    {formState.budgetMin && formState.budgetMax ? `THB ${formState.budgetMin} - ${formState.budgetMax}` : '—'}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-text-tertiary">Timeline</dt>
                  <dd className="font-medium text-text-primary">{formState.timeline || '—'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {readinessItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                How ready are your documents?
              </p>
              <span className="text-xs text-text-tertiary">
                {readinessReadyCount} ready · {readinessHelpCount} need help
              </span>
            </div>
            <div className="space-y-3">
              {readinessItems.map((item) => (
                <ReadinessCard
                  key={item.key}
                  item={item}
                  status={readinessStatus[item.key] ?? 'in-progress'}
                  onStatusChange={(status) => handleReadinessStatus(item.key, status)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-text-secondary mb-2">
            Last notes (optional)
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formState.additionalNotes}
            onChange={(event) => updateField('additionalNotes', event.target.value)}
            onBlur={() => markFieldTouched('additionalNotes')}
            placeholder="Dependent details, employer info, anything else providers should know."
            className="w-full rounded-base border border-border bg-transparent px-4 py-3 text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary transition"
            maxLength={2000}
          />
        </div>
      </div>
    </section>
  );
}
