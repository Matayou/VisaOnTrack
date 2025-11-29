'use client';

import { Globe, Sparkles, FileText } from 'lucide-react';

import { DropdownSelect } from '@/app/requests/new/components/inputs/DropdownSelect';
import { DatePickerTrigger } from '@/app/requests/new/components/inputs/DatePickerTrigger';
import { useRequestForm } from '@/app/requests/new/context/RequestFormContext';
import {
  ageRangeOptions,
  inThailandVisaOptions,
  nationalityOptions,
  residencyOptions,
} from '@/config/requestForm';
import { Card } from '@/components/ui';

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
    <Card as="section" padding="lg" elevated className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-base bg-gradient-to-br from-primary to-primary-hover text-white">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-tertiary">Step 1</p>
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
                    className={`focus-visible:ring-primary/40 flex h-12 min-w-[150px] flex-1 items-center justify-center rounded-base border px-4 text-base font-semibold transition focus-visible:ring-2 ${
                      isActive
                        ? 'bg-primary/5 border-primary text-text-primary shadow-xs'
                        : 'hover:border-primary/40 border-border-light text-text-secondary hover:text-primary'
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
              startIcon={<Globe className="h-4 w-4 text-text-tertiary" aria-hidden="true" />}
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
                  className={`focus-visible:ring-primary/40 rounded-2xl border px-4 py-4 text-left transition focus-visible:ring-2 ${
                    isActive ? 'bg-primary/5 border-primary text-text-primary shadow-sm' : 'hover:border-primary/40 border-border-light text-text-secondary'
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-bg-secondary/80 flex h-10 w-10 items-center justify-center rounded-full text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
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
                startIcon={<FileText className="h-4 w-4 text-text-tertiary" aria-hidden="true" />}
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
    </Card>
  );
}
