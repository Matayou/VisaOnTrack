'use client';

import { useEffect, useState } from 'react';
import { Calendar, Wallet } from 'lucide-react';

import { useRequestForm } from '@/app/requests/new/context/RequestFormContext';
import { budgetPresets, timelineShortcuts } from '@/config/requestForm';
import { Card } from '@/components/ui';

export function BudgetStep() {
  const {
    formState,
    handleBudgetPreset,
    renderValidationFeedback,
    handleTimelineShortcut,
    updateField,
    markFieldTouched,
  } = useRequestForm();
  const [isCustomTimeline, setIsCustomTimeline] = useState(
    () => !!formState.timeline && !timelineShortcuts.some((shortcut) => shortcut.value === formState.timeline),
  );

  useEffect(() => {
    if (!formState.timeline) {
      setIsCustomTimeline(false);
      return;
    }
    const matchesPreset = timelineShortcuts.some((shortcut) => shortcut.value === formState.timeline);
    setIsCustomTimeline(!matchesPreset);
  }, [formState.timeline]);

  return (
    <Card as="section" padding="lg" elevated className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="from-primary/80 flex h-12 w-12 items-center justify-center rounded-base bg-gradient-to-br to-primary text-white">
          <Wallet className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-tertiary">Step 3</p>
          <h2 className="text-2xl font-semibold tracking-tight">Budget & timing</h2>
          <p className="text-text-secondary">Set expectations so providers can respond accurately.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                Budget range (THB)
              </p>
              <p className="text-xs text-text-tertiary">Shared privately with vetted providers only</p>
            </div>
            <span className="rounded-full border border-border-light px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-tertiary">
              Private
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {budgetPresets.map((preset) => {
              const isActive = Number(formState.budgetMin) === preset.min && Number(formState.budgetMax) === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  className={`focus-visible:ring-primary/40 rounded-2xl border px-4 py-3 text-left transition focus-visible:ring-2 ${
                    isActive
                      ? 'bg-primary/5 border-primary text-primary shadow-sm'
                      : 'bg-bg-secondary/60 hover:border-primary/40 border-border-light text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => handleBudgetPreset(preset)}
                >
                  <p className="text-sm font-semibold">{preset.label}</p>
                  <p className="mt-1 text-xs text-text-tertiary">{preset.description}</p>
                </button>
              );
            })}
          </div>
          {renderValidationFeedback('budgetMin')}
        </div>

        <div className="space-y-3">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
              Ideal approval window
            </p>
            <p className="text-xs text-text-tertiary">Helps agents prioritize and flag feasibility early.</p>
          </div>

          <div className="flex flex-col gap-3">
            {timelineShortcuts.map((shortcut) => {
              const isActive = formState.timeline === shortcut.value && !isCustomTimeline;
              return (
                <button
                  key={shortcut.value}
                  type="button"
                  className={`focus-visible:ring-primary/40 w-full rounded-2xl border px-4 py-3 text-left transition focus-visible:ring-2 ${
                    isActive
                      ? 'bg-primary/5 border-primary text-primary shadow-sm'
                      : 'bg-bg-secondary/60 hover:border-primary/40 border-border-light text-text-secondary hover:text-primary'
                  }`}
                  onClick={() => {
                    handleTimelineShortcut(shortcut.value);
                    setIsCustomTimeline(false);
                  }}
                >
                  <p className="text-sm font-semibold">{shortcut.label}</p>
                  <p className="mt-1 text-xs text-text-tertiary">{shortcut.description}</p>
                </button>
              );
            })}
            <button
              type="button"
              className={`focus-visible:ring-primary/40 w-full rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:ring-2 ${
                isCustomTimeline
                  ? 'bg-primary/5 border-primary text-primary shadow-sm'
                  : 'bg-bg-secondary/60 hover:border-primary/40 border-dashed border-border-light text-text-secondary hover:text-primary'
              }`}
              onClick={() => setIsCustomTimeline(true)}
            >
              Set a custom note
            </button>
          </div>

          {isCustomTimeline && (
            <div className="border-border focus-within:ring-primary/30 flex items-center gap-3 rounded-base border bg-transparent px-4 py-3 focus-within:ring-2">
              <Calendar className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
              <input
                id="timeline"
                name="timeline"
                type="text"
                value={formState.timeline}
                onChange={(event) => updateField('timeline', event.target.value)}
                onBlur={() => markFieldTouched('timeline')}
                placeholder="e.g. Need passport stamped before 30 April 2025"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
