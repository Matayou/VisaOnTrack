'use client';

import { Globe, Sparkles, FileText } from 'lucide-react';

import { DropdownSelect } from '@/app/requests/new/components/inputs/DropdownSelect';
import { DatePickerTrigger } from '@/app/requests/new/components/inputs/DatePickerTrigger';
import { sectionCardClass } from '@/app/requests/new/constants';
import { useRequestForm } from '@/app/requests/new/context/RequestFormContext';
import {
  ageRangeOptions,
  inThailandVisaOptions,
  nationalityOptions,
  residencyOptions,
} from '@/config/requestForm';

export function PersonalStep() {
  const {
    formState,
    handleAgeRangeSelect,
    handleResidencySelect,
    handleNationalitySelect,
    updateField,
    markFieldTouched,
    renderValidationFeedback,
    getInputClasses,
    formatDateDisplay,
  } = useRequestForm();

  return (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white">
          <Sparkles className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">Step 1</p>
          <h2 className="text-2xl font-semibold tracking-tight">Tell us about you</h2>
          <p className="text-text-secondary">Nationality details help providers assess eligibility.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
              Age range
            </label>
            <div className="flex flex-wrap gap-3">
              {ageRangeOptions.map((option) => {
                const isActive = formState.ageRange === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAgeRangeSelect(option.value)}
                    className={`flex-1 min-w-[150px] h-12 rounded-base border px-4 text-base font-semibold transition focus-visible:ring-2 focus-visible:ring-primary/40 flex items-center justify-center ${
                      isActive
                        ? 'border-primary bg-primary/5 text-text-primary shadow-xs'
                        : 'border-border-light text-text-secondary hover:border-primary/40 hover:text-primary'
                    }`}
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-text-tertiary">Requesters must be at least 18 years old.</p>
            {renderValidationFeedback('ageRange')}
          </div>

          <div className="space-y-2">
            <label htmlFor="nationality" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
              Nationality
            </label>
            <DropdownSelect
              id="nationality"
              value={formState.nationality}
              options={nationalityOptions}
              placeholder="Select nationality"
              onSelect={handleNationalitySelect}
              startIcon={<Globe className="w-4 h-4 text-text-tertiary" aria-hidden="true" />}
              triggerClassName={getInputClasses('nationality')}
            />
            {renderValidationFeedback('nationality')}
          </div>
        </div>

        <div className="space-y-3">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                Current location
              </p>
              <p className="text-xs text-text-tertiary">Let providers know where you are starting from.</p>
            </div>

          <div className="grid gap-3 md:grid-cols-2">
            {residencyOptions.map((option) => {
              const Icon = option.icon;
              const isActive = formState.currentLocation === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleResidencySelect(option.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive ? 'border-primary bg-primary/5 text-text-primary shadow-sm' : 'border-border-light text-text-secondary hover:border-primary/40'
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-secondary/80 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="text-xs text-text-tertiary">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {renderValidationFeedback('currentLocation')}
        </div>

        {formState.currentLocation === 'IN_THAILAND' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Current visa type</label>
              <DropdownSelect
                value={formState.currentVisaType}
                options={inThailandVisaOptions}
                placeholder="Select visa type"
                onSelect={(value) => {
                  updateField('currentVisaType', value);
                  markFieldTouched('currentVisaType');
                }}
                startIcon={<FileText className="w-4 h-4 text-text-tertiary" aria-hidden="true" />}
                triggerClassName={getInputClasses('currentVisaType')}
              />
              {renderValidationFeedback('currentVisaType')}
            </div>

            <div className="space-y-2">
              <label htmlFor="currentVisaExpiry" className="text-sm font-medium text-text-secondary">
                Current visa expiry date
              </label>
              <DatePickerTrigger
                id="currentVisaExpiry"
                value={formState.currentVisaExpiry}
                onChange={(event) => updateField('currentVisaExpiry', event.target.value)}
                onBlur={() => markFieldTouched('currentVisaExpiry')}
                displayValue={formatDateDisplay(formState.currentVisaExpiry)}
                buttonClassName={getInputClasses('currentVisaExpiry')}
              />
              {renderValidationFeedback('currentVisaExpiry')}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
