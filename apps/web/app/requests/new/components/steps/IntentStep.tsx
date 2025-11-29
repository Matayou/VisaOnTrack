'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

import { useRequestForm } from '@/app/requests/new/context/RequestFormContext';
import { featuredLocationOptions, locationOptions } from '@/config/requestForm';
import { Card } from '@/components/ui';

export function IntentStep() {
  const {
    formState,
    handleLocationSelect,
    updateField,
    markFieldTouched,
    renderValidationFeedback,
    getInputClasses,
  } = useRequestForm();
  const [showFullLocationList, setShowFullLocationList] = useState(false);

  return (
    <Card as="section" padding="lg" elevated className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="from-primary/80 flex h-12 w-12 items-center justify-center rounded-base bg-gradient-to-br to-primary text-white">
          <Globe className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-tertiary">Step 3</p>
          <h2 className="text-2xl font-semibold tracking-tight">Preferred location</h2>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">Preferred location</p>
            <p className="text-xs text-text-tertiary">Where do you prefer to settle or spend most of your time?</p>
          </div>
          {formState.location && (
            <span className="text-xs font-medium text-primary">
              {locationOptions.find((opt) => opt.value === formState.location)?.label}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {locationOptions
            .filter((option) => featuredLocationOptions.includes(option.value))
            .map((option) => {
              const isActive = formState.location === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-base border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'hover:border-primary/50 border-border-light text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => {
                    handleLocationSelect(option.value);
                    setShowFullLocationList(false);
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          <button
            type="button"
            className={`rounded-base border px-3 py-1.5 text-sm transition ${
              formState.location && !featuredLocationOptions.includes(formState.location)
                ? 'bg-primary/10 border-primary text-primary'
                : 'hover:border-primary/50 border-border-light text-text-secondary hover:text-primary'
            }`}
            onClick={() => setShowFullLocationList((prev) => !prev)}
          >
            Somewhere else
          </button>
        </div>

        {showFullLocationList && (
          <select
            className="w-full rounded-base border border-border-light bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={formState.location}
            onChange={(event) => handleLocationSelect(event.target.value)}
          >
            <option value="">Where do you see yourself living?</option>
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {formState.location === 'OTHER' && (
          <input
            type="text"
            className={`w-full rounded-base border bg-transparent px-4 py-3 text-base transition focus:outline-none focus:ring-2 ${getInputClasses('locationDetail')}`}
            placeholder="Share the city or embassy"
            value={formState.locationDetail}
            onChange={(event) => updateField('locationDetail', event.target.value)}
            onBlur={() => markFieldTouched('locationDetail')}
          />
        )}
        {renderValidationFeedback('location')}
      </div>
    </Card>
  );
}
