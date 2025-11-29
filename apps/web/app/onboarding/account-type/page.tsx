'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Briefcase, Check, CheckCircle, ArrowRight, AlertCircle, LogOut } from 'lucide-react';
import { api, type UserRole } from '@visaontrack/client';
import { logout } from '@/lib/auth';
import { isApiError } from '@/lib/api-error';
import { Button, Spinner, GradientText, Footer } from '@/components/ui';
import { AuthPageShell } from '@/components/AuthPageShell';
import { LOADING_PROCESSING, LOADING_GENERIC } from '@/lib/loading-messages';
import { getErrorDisplayMessage } from '@/lib/error-handling';

type AccountType = 'SEEKER' | 'PROVIDER' | null;

interface Feature {
  text: string;
}

const seekerFeatures: Feature[] = [
  { text: 'Find verified immigration professionals' },
  { text: 'Track your application progress' },
  { text: 'Secure escrow payment protection' },
  { text: 'Document management & messaging' },
];

const providerFeatures: Feature[] = [
  { text: 'Reach more clients across Thailand' },
  { text: 'Manage multiple client applications' },
  { text: 'Secure milestone-based payments' },
  { text: 'Build reputation through reviews' },
];

export default function AccountTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AccountType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);

  // Check email verification status on mount
  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const user = await api.users.getCurrentUser();
        // If email is not verified, redirect to verification page
        if (!user.emailVerified) {
          router.push('/auth/verify-email');
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

    checkEmailVerification();
  }, [router]);

  const handleCardClick = (type: 'SEEKER' | 'PROVIDER') => {
    setSelectedType(type);
    setError(null);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, type: 'SEEKER' | 'PROVIDER') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(type);
    }
  };

  const handleContinue = async () => {
    if (!selectedType) {
      setError('Please select an account type to continue');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.users.updateCurrentUser({
        requestBody: {
          role: selectedType as UserRole,
        },
      });

      // Redirect to appropriate onboarding flow
      if (selectedType === 'SEEKER') {
        router.push('/onboarding/seeker/welcome');
      } else {
        router.push('/onboarding/provider/welcome');
      }
    } catch (error: unknown) {
      setError(getErrorDisplayMessage(error, 'update your account type'));
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedType && !isLoading) {
      handleContinue();
    }
  };

  // Show loading state while checking email verification
  if (isCheckingVerification) {
    return (
      <AuthPageShell showLandingActions={false}>
        <div className="w-full max-w-md text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-text-secondary">{LOADING_GENERIC}</p>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <>
      <AuthPageShell showLandingActions={false}>
        <div className="relative flex w-full items-center justify-center p-6">
          {/* Logout Button - Top Right */}
          <button
            onClick={() => logout(router)}
            className="hover:border-border absolute right-4 top-4 flex items-center gap-2 rounded-base border border-border-light bg-bg-primary px-4 py-2 text-sm text-text-secondary transition-all duration-150 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>Logout</span>
          </button>

          <div className="relative z-10 w-full max-w-4xl animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)]">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex h-14 w-14 animate-[scaleIn_400ms_cubic-bezier(0.16,1,0.3,1)_200ms_both] items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-hover shadow-[0_4px_12px_rgba(37,99,235,0.2)]">
                <Compass className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <h1 className="mb-3 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_300ms_both] text-3xl font-bold tracking-tight">
                <GradientText>What brings you to VisaOnTrack?</GradientText>
              </h1>
              <p className="animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_400ms_both] text-lg text-text-secondary">
                Choose how you&rsquo;d like to use the platform
              </p>
            </div>

            {/* Selection Cards */}
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Visa Seeker Card */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Select Visa Seeker account type"
                aria-pressed={selectedType === 'SEEKER'}
                onClick={() => handleCardClick('SEEKER')}
                onKeyDown={(e) => handleCardKeyDown(e, 'SEEKER')}
                className={`relative animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_500ms_both] cursor-pointer rounded-lg border-2 bg-bg-primary p-10 transition-all duration-150 ${
                  selectedType === 'SEEKER'
                    ? 'from-primary/2 to-primary/5 border-primary bg-gradient-to-br shadow-[0_8px_24px_rgba(37,99,235,0.15)]'
                    : 'hover:border-primary/30 border-border-light hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                {/* Selection Indicator */}
                <div
                  className={`absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-150 ${
                    selectedType === 'SEEKER'
                      ? 'border-primary bg-primary'
                      : 'border-border-light bg-bg-primary hover:border-primary'
                  }`}
                >
                  <Check
                    className={`h-5 w-5 text-white transition-all duration-150 ${
                      selectedType === 'SEEKER'
                        ? 'scale-100 opacity-100'
                        : 'scale-0 opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                {/* Card Icon */}
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-md transition-all duration-150 ${
                    selectedType === 'SEEKER'
                      ? 'from-primary/20 to-primary/10 bg-gradient-to-br'
                      : 'from-primary/10 to-primary/5 bg-gradient-to-br'
                  }`}
                >
                  <Compass className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>

                {/* Card Title */}
                <h2 className="mb-3 text-2xl font-semibold">I&rsquo;m a Visa Seeker</h2>

                {/* Card Description */}
                <p className="mb-6 text-base leading-relaxed text-text-secondary">
                  I need help navigating the visa application process in Thailand
                </p>

                {/* Features List */}
                <div className="flex flex-col gap-3">
                  {seekerFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 text-primary transition-transform duration-150 ${
                          selectedType === 'SEEKER' ? 'translate-x-1' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Provider Card */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Select Service Provider account type"
                aria-pressed={selectedType === 'PROVIDER'}
                onClick={() => handleCardClick('PROVIDER')}
                onKeyDown={(e) => handleCardKeyDown(e, 'PROVIDER')}
                className={`relative animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_600ms_both] cursor-pointer rounded-lg border-2 bg-bg-primary p-10 transition-all duration-150 ${
                  selectedType === 'PROVIDER'
                    ? 'from-primary/2 to-primary/5 border-primary bg-gradient-to-br shadow-[0_8px_24px_rgba(37,99,235,0.15)]'
                    : 'hover:border-primary/30 border-border-light hover:shadow-md'
                } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                {/* Selection Indicator */}
                <div
                  className={`absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-150 ${
                    selectedType === 'PROVIDER'
                      ? 'border-primary bg-primary'
                      : 'border-border-light bg-bg-primary hover:border-primary'
                  }`}
                >
                  <Check
                    className={`h-5 w-5 text-white transition-all duration-150 ${
                      selectedType === 'PROVIDER'
                        ? 'scale-100 opacity-100'
                        : 'scale-0 opacity-0'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                {/* Card Icon */}
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-md transition-all duration-150 ${
                    selectedType === 'PROVIDER'
                      ? 'from-primary/20 to-primary/10 bg-gradient-to-br'
                      : 'from-primary/10 to-primary/5 bg-gradient-to-br'
                  }`}
                >
                  <Briefcase className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>

                {/* Card Title */}
                <h2 className="mb-3 text-2xl font-semibold">I&rsquo;m a Service Provider</h2>

                {/* Card Description */}
                <p className="mb-6 text-base leading-relaxed text-text-secondary">
                  I&rsquo;m an immigration professional looking to connect with clients
                </p>

                {/* Features List */}
                <div className="flex flex-col gap-3">
                  {providerFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 text-primary transition-transform duration-150 ${
                          selectedType === 'PROVIDER' ? 'translate-x-1' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex animate-[fadeInUp_300ms_cubic-bezier(0.16,1,0.3,1)] items-center gap-2 text-sm text-error"
              >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Continue Button */}
            <div className="animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_700ms_both] text-center">
              <Button
                type="button"
                onClick={handleContinue}
                onKeyDown={handleKeyDown}
                disabled={!selectedType || isLoading}
                loading={isLoading}
                icon={!isLoading ? <ArrowRight className="h-5 w-5" /> : undefined}
                iconPosition="right"
              >
                {isLoading ? LOADING_PROCESSING : 'Continue'}
              </Button>
            </div>
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
        `}</style>
      </AuthPageShell>
      <Footer />
    </>
  );
}

