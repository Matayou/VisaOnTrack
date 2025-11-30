'use client';

import { CheckCircle2, Briefcase, Package, ShieldCheck, CreditCard } from 'lucide-react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const PROVIDER_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'business',
    title: 'Business',
    description: 'Company details & expertise',
    icon: Briefcase,
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Pricing & packages',
    icon: Package,
  },
  {
    id: 'credentials',
    title: 'Credentials',
    description: 'Verification documents',
    icon: ShieldCheck,
  },
  {
    id: 'payouts',
    title: 'Payouts',
    description: 'Payment setup',
    icon: CreditCard,
  },
];

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
  steps?: OnboardingStep[];
}

export function OnboardingProgress({
  currentStep,
  totalSteps = 4,
  steps = PROVIDER_ONBOARDING_STEPS,
}: OnboardingProgressProps) {
  const progressPercentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-light">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="min-w-20 text-right text-sm font-semibold text-text-secondary">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`group flex flex-1 flex-col items-center rounded-lg border-2 p-3 transition-all duration-200 ${
                isCurrent
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : isComplete
                  ? 'border-success/40 bg-success/5'
                  : 'bg-bg-secondary/50 border-border-light'
              }`}
            >
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                  isCurrent
                    ? 'bg-primary text-white shadow-primary-sm'
                    : isComplete
                    ? 'bg-success text-white'
                    : 'bg-bg-tertiary text-text-tertiary'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Icon className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <span
                className={`text-center text-xs font-semibold ${
                  isCurrent ? 'text-primary' : isComplete ? 'text-success' : 'text-text-tertiary'
                }`}
              >
                {step.title}
              </span>
              <span className="hidden text-center text-[10px] text-text-tertiary sm:block">
                {step.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

