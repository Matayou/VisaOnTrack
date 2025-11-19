'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

import { sectionCardClass } from '@/app/requests/new/constants';
import { useRequestForm } from '@/app/requests/new/context/RequestFormContext';
import { featuredLocationOptions, locationOptions } from '@/config/requestForm';

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
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
          <Globe className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">Step 3</p>
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
            <span className="text-xs text-primary font-medium">
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
                  className={`px-3 py-1.5 rounded-base border text-sm transition ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
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
            className={`px-3 py-1.5 rounded-base border text-sm transition ${
              formState.location && !featuredLocationOptions.includes(formState.location)
                ? 'border-primary text-primary bg-primary/10'
                : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
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
            className={`w-full rounded-base border bg-transparent px-4 py-3 text-base focus:outline-none focus:ring-2 transition ${getInputClasses('locationDetail')}`}
            placeholder="Share the city or embassy"
            value={formState.locationDetail}
            onChange={(event) => updateField('locationDetail', event.target.value)}
            onBlur={() => markFieldTouched('locationDetail')}
          />
        )}
        {renderValidationFeedback('location')}
      </div>
    </section>
  );
}
