'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { api, UserRole } from '@visaontrack/client';
import { CheckCircle, Clock, ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/ui';
import { getErrorDisplayMessage } from '@/lib/error-handling';

export default function CredentialsCompletePage() {
  const router = useRouter();

  // Complete onboarding when page loads
  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        await api.users.completeOnboarding({
          requestBody: {
            role: UserRole.PROVIDER,
          },
        });
        // Onboarding completed successfully (silent success)
      } catch (error: unknown) {
        // Log error but don't block user experience
        console.error('[CredentialsComplete] Error completing onboarding:', error);
        console.warn(getErrorDisplayMessage(error, 'complete onboarding'));
      }
    };

    completeOnboarding();
  }, []);

  const handleGoToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-secondary">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-6xl animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-lg border border-border-light bg-bg-primary shadow-md">
        {/* Header */}
        <div className="from-success/5 to-success/2 bg-gradient-to-br p-12 text-center">
          <div className="to-success/20 mx-auto mb-8 flex h-20 w-20 animate-[scaleIn_400ms_cubic-bezier(0.16,1,0.3,1)] items-center justify-center rounded-full bg-gradient-to-br from-success-light shadow-[0_8px_32px_rgba(22,163,74,0.2)]">
            <CheckCircle className="h-10 w-10 animate-[checkDraw_600ms_cubic-bezier(0.16,1,0.3,1)_200ms_both] text-success" aria-hidden="true" />
          </div>
          <h1 className="mb-3 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_300ms_both] text-3xl font-bold tracking-tight">
            Credentials Submitted!
          </h1>
          <p className="animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_400ms_both] text-lg leading-relaxed text-text-secondary">
            Thank you for submitting your credentials. We&rsquo;ll review them and notify you once approved.
          </p>
        </div>

        {/* Content */}
        <div className="p-12">
          {/* Timeline */}
          <div className="mb-8 flex flex-col gap-0">
            {[
              {
                icon: CheckCircle,
                status: 'complete',
                title: 'Documents Uploaded',
                description: 'Your credentials have been successfully submitted to our verification team.',
                delay: 500,
              },
              {
                icon: Clock,
                status: 'pending',
                title: 'Under Review',
                description: 'Our team typically reviews submissions within 1-2 business days. We&rsquo;ll email you with any questions.',
                delay: 600,
              },
              {
                icon: ShieldCheck,
                status: 'pending',
                title: 'Approval & Activation',
                description: 'Once approved, you&rsquo;ll receive an email and can start accepting clients immediately.',
                delay: 700,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative flex animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_both] gap-4 pb-6"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                {index < 2 && (
                  <div className="absolute bottom-0 left-4 top-10 w-0.5 bg-border-light" />
                )}
                <div
                  className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-150 ${
                    step.status === 'complete'
                      ? 'to-success/80 bg-gradient-to-br from-success shadow-[0_2px_8px_rgba(22,163,74,0.3)]'
                      : 'border-2 border-border-light bg-bg-secondary'
                  }`}
                >
                  <step.icon
                    className={`h-4 w-4 ${
                      step.status === 'complete' ? 'text-white' : 'text-text-tertiary'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="mb-1 text-sm font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="from-primary/5 to-primary/2 border-primary/10 flex animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_800ms_both] gap-4 rounded-base border bg-gradient-to-br p-5">
            <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-base">
              <Info className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1.5 text-sm font-semibold">What happens next?</h4>
              <p className="text-xs leading-relaxed text-text-secondary">
                You&apos;ll receive an email notification once your credentials are verified. Once approved, you can start accepting clients immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_900ms_both] justify-center p-12 pt-0">
          <button
            type="button"
            onClick={handleGoToDashboard}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleGoToDashboard();
              }
            }}
            aria-label="Go to dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-base bg-gradient-to-b from-primary to-primary-hover px-8 text-base font-medium text-white shadow-[0_2px_8px_rgba(37,99,235,0.15)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>
        </div>
      </div>

      <Footer />

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
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkDraw {
          from {
            opacity: 0;
            transform: scale(0) rotate(-45deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}

