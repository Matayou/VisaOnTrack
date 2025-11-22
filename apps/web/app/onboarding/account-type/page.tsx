'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Briefcase, Check, CheckCircle, ArrowRight, AlertCircle, LogOut } from 'lucide-react';
import { api, type UserRole } from '@visaontrack/client';
import { logout } from '@/lib/auth';
import { getApiErrorMessage, isApiError } from '@/lib/api-error';
import { Button, Spinner, PageBackground, GradientText } from '@/components/ui';

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
      const apiError = isApiError(error) ? error : null;
      if (apiError?.status === 401) {
        setError('You must be logged in to continue. Please sign in.');
      } else if (apiError?.status === 400) {
        setError('Invalid request. Please try again.');
      } else if (apiError?.status === 404) {
        setError('User not found. Please try again.');
      } else {
        setError(
          apiError ? getApiErrorMessage(apiError, 'An error occurred. Please try again.') : 'An error occurred. Please try again.',
        );
      }
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
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 hover:border-border hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        <span>Logout</span>
      </button>

      <div className="relative z-10 w-full max-w-4xl animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary-hover rounded-md mb-6 shadow-[0_4px_12px_rgba(37,99,235,0.2)] animate-[scaleIn_400ms_cubic-bezier(0.16,1,0.3,1)_200ms_both]">
            <Compass className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_300ms_both]">
            <GradientText>What brings you to VisaOnTrack?</GradientText>
          </h1>
          <p className="text-lg text-text-secondary animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_400ms_both]">
            Choose how you&rsquo;d like to use the platform
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Visa Seeker Card */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Select Visa Seeker account type"
            aria-pressed={selectedType === 'SEEKER'}
            onClick={() => handleCardClick('SEEKER')}
            onKeyDown={(e) => handleCardKeyDown(e, 'SEEKER')}
            className={`relative p-10 bg-bg-primary border-2 rounded-lg cursor-pointer transition-all duration-150 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_500ms_both] ${
              selectedType === 'SEEKER'
                ? 'border-primary bg-gradient-to-br from-primary/2 to-primary/5 shadow-[0_8px_24px_rgba(37,99,235,0.15)]'
                : 'border-border-light hover:border-primary/30 hover:shadow-md'
            } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            {/* Selection Indicator */}
            <div
              className={`absolute top-6 right-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                selectedType === 'SEEKER'
                  ? 'border-primary bg-primary scale-110'
                  : 'border-border-light bg-bg-primary hover:border-primary hover:scale-110'
              }`}
            >
              <Check
                className={`w-5 h-5 text-white transition-all duration-150 ${
                  selectedType === 'SEEKER'
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-0'
                }`}
                aria-hidden="true"
              />
            </div>

            {/* Card Icon */}
            <div
              className={`w-16 h-16 rounded-md mb-6 flex items-center justify-center transition-all duration-150 ${
                selectedType === 'SEEKER'
                  ? 'bg-gradient-to-br from-primary/20 to-primary/10'
                  : 'bg-gradient-to-br from-primary/10 to-primary/5 hover:scale-110 hover:rotate-[5deg]'
              }`}
            >
              <Compass className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>

            {/* Card Title */}
            <h2 className="text-2xl font-semibold mb-3">I&rsquo;m a Visa Seeker</h2>

            {/* Card Description */}
            <p className="text-base text-text-secondary mb-6 leading-relaxed">
              I need help navigating the visa application process in Thailand
            </p>

            {/* Features List */}
            <div className="flex flex-col gap-3">
              {seekerFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-sm text-text-secondary">
                  <CheckCircle
                    className={`w-5 h-5 text-primary flex-shrink-0 mt-0.5 transition-transform duration-150 ${
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
            className={`relative p-10 bg-bg-primary border-2 rounded-lg cursor-pointer transition-all duration-150 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_600ms_both] ${
              selectedType === 'PROVIDER'
                ? 'border-primary bg-gradient-to-br from-primary/2 to-primary/5 shadow-[0_8px_24px_rgba(37,99,235,0.15)]'
                : 'border-border-light hover:border-primary/30 hover:shadow-md'
            } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            {/* Selection Indicator */}
            <div
              className={`absolute top-6 right-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                selectedType === 'PROVIDER'
                  ? 'border-primary bg-primary scale-110'
                  : 'border-border-light bg-bg-primary hover:border-primary hover:scale-110'
              }`}
            >
              <Check
                className={`w-5 h-5 text-white transition-all duration-150 ${
                  selectedType === 'PROVIDER'
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-0'
                }`}
                aria-hidden="true"
              />
            </div>

            {/* Card Icon */}
            <div
              className={`w-16 h-16 rounded-md mb-6 flex items-center justify-center transition-all duration-150 ${
                selectedType === 'PROVIDER'
                  ? 'bg-gradient-to-br from-primary/20 to-primary/10'
                  : 'bg-gradient-to-br from-primary/10 to-primary/5 hover:scale-110 hover:rotate-[5deg]'
              }`}
            >
              <Briefcase className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>

            {/* Card Title */}
            <h2 className="text-2xl font-semibold mb-3">I&rsquo;m a Service Provider</h2>

            {/* Card Description */}
            <p className="text-base text-text-secondary mb-6 leading-relaxed">
              I&rsquo;m an immigration professional looking to connect with clients
            </p>

            {/* Features List */}
            <div className="flex flex-col gap-3">
              {providerFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-sm text-text-secondary">
                  <CheckCircle
                    className={`w-5 h-5 text-primary flex-shrink-0 mt-0.5 transition-transform duration-150 ${
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
            className="mb-6 text-sm text-error flex items-center gap-2 animate-[fadeInUp_300ms_cubic-bezier(0.16,1,0.3,1)]"
          >
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_700ms_both]">
          <Button
            type="button"
            onClick={handleContinue}
            onKeyDown={handleKeyDown}
            disabled={!selectedType || isLoading}
            loading={isLoading}
            icon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
            iconPosition="right"
          >
            {isLoading ? 'Updating...' : 'Continue'}
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
      `}</style>
    </div>
  );
}

