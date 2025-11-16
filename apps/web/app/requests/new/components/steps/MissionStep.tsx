'use client';

import { Check, Globe, Sparkles } from 'lucide-react';

import { sectionCardClass } from '@/app/requests/new/constants';
import { useRequestForm } from '@/app/requests/new/context/RequestFormContext';
import { featuredLocationOptions, locationOptions, missionVisaOptions } from '@/config/requestForm';

export function MissionStep() {
  const {
    formState,
    updateField,
    markFieldTouched,
    handleVisaSelect,
    handleLocationSelect,
    renderValidationFeedback,
    getInputClasses,
    isLocationSelectOpen,
    setIsLocationSelectOpen,
    focusedField,
    setFocusedField,
    hasCustomTitle,
    setHasCustomTitle,
  } = useRequestForm();

  const selectedMissionVisa = missionVisaOptions.find((option) => option.value === formState.visaType);

  return (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white">
          <Sparkles className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">Step 2</p>
          <h2 className="text-2xl font-semibold tracking-tight">What do you need?</h2>
          <p className="text-text-secondary">Pick your visa track and where you plan to live.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">
            Request title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formState.title}
            onChange={(event) => {
              const nextValue = event.target.value;
              setHasCustomTitle(nextValue.trim().length > 0);
              updateField('title', nextValue);
            }}
            onFocus={() => setFocusedField('title')}
            onBlur={() => {
              markFieldTouched('title');
              setFocusedField(null);
            }}
            placeholder="e.g. LTR visa with dependents arriving Q2 2025"
            className={`w-full rounded-base border bg-transparent px-4 py-3 text-base focus:outline-none focus:ring-2 transition ${getInputClasses('title')}`}
            maxLength={200}
            aria-invalid={false}
          />
          {focusedField === 'title' && !formState.title && (
            <div className="mt-3 flex flex-wrap gap-2">
              {['Call out visa class', 'Mention timing', 'Highlight dependents'].map((tip) => (
                <span key={tip} className="text-xs px-3 py-1 rounded-full border border-border-light text-text-secondary">
                  {tip}
                </span>
              ))}
            </div>
          )}
          {renderValidationFeedback('title', 'Title looks descriptive.')}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                Which visa feels right?
              </p>
              <p className="text-xs text-text-tertiary">Pick your best fit. Not sure? Choose “Other / Not sure.”</p>
            </div>
            {selectedMissionVisa && <span className="text-xs text-primary font-medium">{selectedMissionVisa.label}</span>}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {missionVisaOptions.map((option) => {
              const isActive = formState.visaType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-light bg-white/80 hover:border-primary/50'
                  }`}
                  onClick={() => handleVisaSelect(option.value)}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>{option.label}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">{option.description}</p>
                    </div>
                    {option.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                          isActive ? 'bg-primary text-white' : 'bg-border-light/60 text-text-tertiary'
                        }`}
                      >
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {option.details.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-text-tertiary">
                      {option.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <Check className={`w-3.5 h-3.5 mt-0.5 ${isActive ? 'text-primary' : 'text-border'}`} aria-hidden="true" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>
          {renderValidationFeedback('visaType')}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                Preferred location
              </p>
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
                      setIsLocationSelectOpen(false);
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
              onClick={() => setIsLocationSelectOpen((prev) => !prev)}
            >
              Somewhere else
            </button>
          </div>

          {isLocationSelectOpen && (
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
      </div>
    </section>
  );
}
