'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Clock, ArrowRight, LogOut } from 'lucide-react';
import { api } from '@visaontrack/client';
import { logout } from '@/lib/auth';
import { getNextProviderOnboardingStep } from '@/lib/onboarding';
import { isApiError } from '@/lib/api-error';
import { Button, Spinner, PageBackground, GradientText, Footer } from '@/components/ui';

export default function ProviderWelcomePage() {
  const router = useRouter();
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);

  // Check email verification status and onboarding progress on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const user = await api.users.getCurrentUser();
        // If email is not verified, redirect to verification page
        if (!user.emailVerified) {
          router.push('/auth/verify-email');
          return;
        }

        // If onboarding is complete, redirect to home
        if (user.providerOnboardingCompleted) {
          router.push('/');
          return;
        }

        // Check if user has already started onboarding - redirect to next step
        const nextStep = getNextProviderOnboardingStep(user);
        if (nextStep && nextStep !== '/onboarding/provider/welcome') {
          router.push(nextStep);
          return;
        }

        setIsCheckingVerification(false);
      } catch (error: unknown) {
        // If not authenticated, redirect to login
        if (isApiError(error) && error.status === 401) {
          router.push('/auth/login');
          return;
        }
        // For other errors, allow user to proceed (they'll be caught by API calls)
        setIsCheckingVerification(false);
      }
    };

    checkStatus();
  }, [router]);

  useEffect(() => {
    // Animate progress steps after page load (only if verification check passed)
    if (!isCheckingVerification) {
      const steps = document.querySelectorAll('[data-progress-step]');
      steps.forEach((step, index) => {
        setTimeout(() => {
          step.classList.add('active');
        }, 1000 + index * 200);
      });
    }
  }, [isCheckingVerification]);

  const handleStartSetup = async () => {
    try {
      const user = await api.users.getCurrentUser();
      const nextStep = getNextProviderOnboardingStep(user);
      if (nextStep) {
        router.push(nextStep);
      } else {
        // Fallback to business step if no next step found
        router.push('/onboarding/provider/business');
      }
    } catch (err) {
      console.error('[ProviderWelcomePage] Error getting next step:', err);
      // Fallback to business step on error
      router.push('/onboarding/provider/business');
    }
  };

  const handleCompleteLater = () => {
    // Redirect to dashboard or home
    router.push('/');
  };

  // Show loading state while checking email verification
  if (isCheckingVerification) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-text-secondary">Checking verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary relative overflow-hidden flex items-center justify-center p-6">
      <PageBackground />
      {/* Logout Button - Top Right */}
      <button
        onClick={() => logout(router)}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 hover:border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        <span>Logout</span>
      </button>

      <div className="relative z-10 w-full max-w-6xl bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-lg shadow-lg shadow-primary/5 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
        {/* Header */}
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-md mb-6 shadow-[0_4px_12px_rgba(37,99,235,0.2)] animate-[scaleIn_400ms_cubic-bezier(0.16,1,0.3,1)]">
            <Briefcase className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_200ms_both]">
            <GradientText>Welcome to VisaOnTrack!</GradientText>
          </h1>
          <p className="text-lg text-text-secondary max-w-[42rem] mx-auto animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_300ms_both]">
            Let&rsquo;s get your profile set up so you can start connecting with clients
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-12 pb-8 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_400ms_both]">
          <div className="text-sm text-text-secondary mb-3 text-center">
            Complete these 3 steps to activate your account
          </div>
          <div className="flex gap-2 h-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="flex-1 bg-border-light rounded-sm overflow-hidden relative"
              >
                <div
                  data-progress-step
                  className="absolute top-0 left-0 w-full h-full bg-primary transition-all duration-400"
                  style={{
                    transform: 'translateX(-100%)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Steps List */}
        <div className="px-12 pb-12">
          <div className="flex flex-col gap-6">
            {[
              {
                number: 1,
                title: 'Business Details',
                description: 'Tell us about your business, location, and expertise',
                time: '~3 minutes',
              },
              {
                number: 2,
                title: 'Services & Pricing',
                description: 'List the visa services you offer and set your pricing',
                time: '~5 minutes',
              },
              {
                number: 3,
                title: 'Professional Credentials',
                description: 'Upload your license and certifications for verification',
                time: '~2 minutes',
              },
            ].map((step, index) => (
              <div
                key={step.number}
                role="button"
                tabIndex={0}
                aria-label={`Step ${step.number}: ${step.title}. ${step.description}. Estimated time: ${step.time}`}
                className="p-6 bg-bg-secondary border border-border-light rounded-md flex gap-5 transition-all duration-150 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_both] cursor-pointer hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ animationDelay: `${500 + index * 100}ms` }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Step cards are informational only, no action needed
                  }
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-base flex items-center justify-center text-xl font-bold text-primary flex-shrink-0 transition-transform duration-150">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1.5">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-2">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-12 pb-12 flex gap-4 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_900ms_both]">
          <Button
            type="button"
            onClick={handleCompleteLater}
            variant="secondary"
            className="flex-1"
            icon={<LogOut className="w-4.5 h-4.5" />}
            iconPosition="left"
          >
            Complete Later
          </Button>
          <Button
            type="button"
            onClick={handleStartSetup}
            className="flex-1"
            icon={<ArrowRight className="w-4.5 h-4.5" />}
            iconPosition="right"
          >
            Start Setup
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0) rotate(-180deg);
          }
          to {
            transform: scale(1) rotate(0deg);
          }
        }

        [data-progress-step].active {
          transform: translateX(0) !important;
        }
      `}</style>
      <Footer />
    </div>
  );
}

