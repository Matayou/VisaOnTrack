'use client';

import { Suspense } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { PersonalStep } from '@/app/requests/new/components/steps/PersonalStep';
import { MissionStep } from '@/app/requests/new/components/steps/MissionStep';
import { BudgetStep } from '@/app/requests/new/components/steps/BudgetStep';
import { SupportStep } from '@/app/requests/new/components/steps/SupportStep';
import { baseCardClass } from '@/app/requests/new/constants';
import { RequestFormProvider, useRequestForm } from '@/app/requests/new/context/RequestFormContext';
import { formSteps } from '@/config/requestForm';
import { logout } from '@/lib/auth';
import { SeekerHeader } from '@/components/SeekerHeader';
import { Button, Spinner } from '@/components/ui';

const stepComponents = [PersonalStep, MissionStep, BudgetStep, SupportStep];

export default function CreateRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <Spinner size="lg" />
            <p className="text-text-secondary text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <RequestFormProvider>
        <CreateRequestForm />
      </RequestFormProvider>
    </Suspense>
  );
}

function CreateRequestForm() {
  const router = useRouter();
  const {
    isCheckingAuth,
    createdRequest,
    redirectCountdown,
    resetForm,
    handleSubmit,
    currentStep,
    progressPercentage,
    isStepValid,
    handleStepIndicatorClick,
    stepButtonRefs,
    handleStepSwipeStart,
    handleStepSwipeMove,
    handleStepSwipeEnd,
    handleStepSwipeCancel,
    handleBack,
    handleContinue,
    stepError,
    submitError,
    isSubmitDisabled,
    isSubmitting,
    isPreFilledFromEligibility,
  } = useRequestForm();

  const renderCurrentStep = () => {
    const StepComponent = stepComponents[currentStep] ?? SupportStep;
    return <StepComponent />;
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Spinner size="lg" />
          <p className="text-text-secondary text-sm">Checking your account...</p>
        </div>
      </div>
    );
  }

  if (createdRequest) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <SeekerHeader />
        <div className="p-6 lg:p-10 relative">
        <div className="max-w-6xl mx-auto">
            <div className={`${baseCardClass} p-10 text-center space-y-6`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">Request published</p>
                <h1 className="text-3xl font-semibold">{createdRequest.title}</h1>
                <p className="text-text-secondary">
                  Your visa brief is live. We will redirect you automatically in {redirectCountdown}s so you can monitor responses.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  type="button" 
                  onClick={() => router.push(`/requests/${createdRequest.id}`)}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  View request now
                </Button>
                <Button 
                  type="button" 
                  onClick={() => router.push('/requests')}
                  variant="outline"
                >
                  View all requests
                </Button>
                <Button 
                  type="button" 
                  onClick={resetForm}
                  variant="ghost"
                >
                  Post another request
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SeekerHeader />
      <div className="p-6 lg:p-10 relative">
        <div className="max-w-6xl mx-auto space-y-6">
          {isPreFilledFromEligibility && (
            <div className={`${baseCardClass} p-4 bg-primary/5 border-primary/20`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-text-primary">
                  <span className="font-semibold">Your form was pre-filled</span> based on your eligibility check. You can edit any field as needed.
                </p>
              </div>
            </div>
          )}
          <header className={`${baseCardClass} px-6 py-8 md:px-10 md:py-10`}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:items-center">
              {/* Left Column: Heading & Description */}
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">
                  Visa seeker workspace
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-semibold leading-[1.15] tracking-tight text-text-primary">
                  Unlock expert visa help in minutes
                </h1>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl">
                  Share your situation, budget, and timeline to get matched with vetted providers. One clear brief, faster answers.
                </p>
              </div>

              {/* Right Column: Feature List */}
              <div className="lg:pl-6 lg:border-l lg:border-border-light">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-text-secondary leading-relaxed">
                      Matched with verified specialists—no cold outreach.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-text-secondary leading-relaxed">
                      One private brief powers accurate offers (never public).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-text-secondary leading-relaxed">
                      Clear budget + timing unlock faster, reality-checked responses.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className={`${baseCardClass} p-6 md:p-8 space-y-6`}>
              <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">
                    Step {currentStep + 1} of {formSteps.length}
                  </p>
                  <h2 className="text-2xl font-semibold text-text-primary">{formSteps[currentStep]?.title}</h2>
                  <p className="text-sm text-text-secondary">{formSteps[currentStep]?.subtitle}</p>
                </div>
              <div className="h-2 w-full bg-border/30 rounded-full overflow-hidden" aria-hidden="true">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
              </div>
              <ol
                className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible sm:snap-none"
                aria-label="Request builder progress"
              >
                {formSteps.map((step, index) => {
                  const stepComplete = index < currentStep && isStepValid(index);
                  const isActive = index === currentStep;
                  const canJump = index <= currentStep + 1;
                  return (
                    <li key={step.id} className="snap-center flex-shrink-0 min-w-[72vw] sm:min-w-0 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleStepIndicatorClick(index)}
                        ref={(element) => {
                          stepButtonRefs.current[index] = element;
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-xs sm:text-sm transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          isActive
                            ? 'border-primary bg-primary/5 text-text-primary shadow-sm'
                            : stepComplete
                            ? 'border-success/50 bg-success/5 text-text-secondary'
                            : 'border-border-light bg-bg-secondary/60 text-text-tertiary'
                        }`}
                        aria-current={isActive ? 'step' : undefined}
                        aria-label={`Step ${index + 1}: ${step.title}`}
                        disabled={!canJump}
                      >
                        <div className="flex items-center gap-2 font-semibold text-text-primary">
                          {stepComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
                          ) : (
                            <span className="text-xs text-text-tertiary">{index + 1}</span>
                          )}
                          <span className="truncate">{step.title}</span>
                        </div>
                        <p className="text-[0.7rem] text-text-tertiary mt-1 line-clamp-2">{step.subtitle}</p>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>

            <div
              onTouchStart={handleStepSwipeStart}
              onTouchMove={handleStepSwipeMove}
              onTouchEnd={handleStepSwipeEnd}
              onTouchCancel={handleStepSwipeCancel}
            >
              {renderCurrentStep()}
            </div>

            <div className="sticky bottom-4 z-10">
              <div className="bg-bg-primary/95 border border-border-light rounded-base px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm backdrop-blur">
                {stepError && (
                  <p className="text-error text-sm flex items-center gap-2" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {stepError}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 md:ml-auto">
                  <Button 
                    type="button" 
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    icon={<ArrowLeft className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Cancel
                  </Button>
                  {currentStep > 0 && (
                    <Button 
                      type="button" 
                      onClick={handleBack}
                      variant="outline"
                      icon={<ArrowLeft className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Back
                    </Button>
                  )}
                  {currentStep < formSteps.length - 1 && (
                    <Button 
                      type="button" 
                      onClick={handleContinue}
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      Continue
                    </Button>
                  )}
                  {currentStep === formSteps.length - 1 && (
                    <Button 
                      type="submit" 
                      disabled={isSubmitDisabled}
                      loading={isSubmitting}
                      icon={!isSubmitting ? <CheckCircle2 className="w-4 h-4" /> : undefined}
                      iconPosition="right"
                    >
                      {isSubmitting ? 'Publishing request...' : 'Publish request'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {submitError && (
              <p className="text-error text-sm flex items-center gap-2" role="alert">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {submitError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
