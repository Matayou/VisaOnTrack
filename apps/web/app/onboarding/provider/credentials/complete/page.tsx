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
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl bg-bg-primary border border-border-light rounded-lg shadow-md overflow-hidden animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="p-12 text-center bg-gradient-to-br from-success/5 to-success/2">
          <div className="w-20 h-20 bg-gradient-to-br from-success-light to-success/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_8px_32px_rgba(22,163,74,0.2)] animate-[scaleIn_400ms_cubic-bezier(0.16,1,0.3,1)]">
            <CheckCircle className="w-10 h-10 text-success animate-[checkDraw_600ms_cubic-bezier(0.16,1,0.3,1)_200ms_both]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_300ms_both]">
            Credentials Submitted!
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_400ms_both]">
            Thank you for submitting your credentials. We&rsquo;ll review them and notify you once approved.
          </p>
        </div>

        {/* Content */}
        <div className="p-12">
          {/* Timeline */}
          <div className="flex flex-col gap-0 mb-8">
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
                className="flex gap-4 pb-6 relative animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                {index < 2 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border-light" />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-150 z-10 ${
                    step.status === 'complete'
                      ? 'bg-gradient-to-br from-success to-success/80 shadow-[0_2px_8px_rgba(22,163,74,0.3)]'
                      : 'bg-bg-secondary border-2 border-border-light'
                  }`}
                >
                  <step.icon
                    className={`w-4 h-4 ${
                      step.status === 'complete' ? 'text-white' : 'text-text-tertiary'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/2 border border-primary/10 rounded-base flex gap-4 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_800ms_both]">
            <div className="w-10 h-10 bg-primary/10 rounded-base flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1.5">What happens next?</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                You&apos;ll receive an email notification once your credentials are verified. Once approved, you can start accepting clients immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-12 pt-0 flex justify-center animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_900ms_both]">
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
            className="h-11 px-8 text-base font-medium text-white rounded-base transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.15)] inline-flex items-center justify-center gap-2 bg-gradient-to-b from-primary to-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
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

