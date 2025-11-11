'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, UserRole } from '@visaontrack/client';
import {
  CheckCircle,
  Search,
  ShieldCheck,
  Activity,
  MessageCircle,
  Settings,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { logout } from '@/lib/auth';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: <Search className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: 'Browse Verified Providers',
    description:
      'Search through hundreds of verified immigration professionals in Thailand. Filter by location, specialization, and reviews.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: 'Secure Payment Protection',
    description:
      'Pay safely with milestone-based escrow. Funds are released only when you confirm work is complete to your satisfaction.',
  },
  {
    icon: <Activity className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: 'Track Your Progress',
    description:
      "Monitor every step of your visa application. Get updates in real-time and always know what's happening.",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-primary" aria-hidden="true" />,
    title: 'Direct Communication',
    description:
      'Chat directly with your provider, upload documents, and get quick answers to all your questions.',
  },
];

export default function SeekerWelcomePage() {
  const router = useRouter();
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
      } catch (err: any) {
        // If not authenticated, redirect to login
        if (err?.status === 401) {
          router.push('/auth/login');
          return;
        }
        // For other errors, allow user to proceed (they'll be caught by API calls)
        setIsCheckingVerification(false);
      }
    };

    checkEmailVerification();
  }, [router]);

  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  // Complete onboarding when page loads
  useEffect(() => {
    const completeOnboarding = async () => {
      setIsCompletingOnboarding(true);
      setOnboardingError(null);

      try {
        await api.users.completeOnboarding({
          requestBody: {
            role: UserRole.SEEKER,
          },
        });
        // Onboarding completed successfully (silent success)
      } catch (err: any) {
        // Log error but don't block user experience
        console.error('[SeekerWelcome] Error completing onboarding:', err);
        setOnboardingError(
          err?.body?.message || 'Failed to mark onboarding as complete. You can continue using the app.'
        );
      } finally {
        setIsCompletingOnboarding(false);
      }
    };

    completeOnboarding();
  }, []);

  const handleCompleteProfile = () => {
    // TODO: Navigate to profile completion page when implemented
    // For now, this could be a no-op or navigate to settings
    router.push('/settings');
  };

  const handleBrowseProviders = () => {
    router.push('/providers');
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Show loading state while checking email verification
  if (isCheckingVerification) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Checking verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6 relative">
      {/* Logout Button - Top Right */}
      <button
        onClick={() => logout(router)}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 hover:border-border hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        <span>Logout</span>
      </button>

      <div className="w-full max-w-[48rem] bg-bg-primary border border-border-light rounded-lg shadow-md animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="px-6 pt-8 pb-6 sm:px-12 sm:pt-12 sm:pb-8 text-center bg-gradient-to-br from-primary/2 to-primary/5 rounded-t-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-success-light to-success-light/60 rounded-full inline-flex items-center justify-center mb-6 animate-[scaleIn_400ms_cubic-bezier(0.16,1,0.3,1)]">
            <CheckCircle
              className="w-8 h-8 text-success animate-[checkDraw_600ms_cubic-bezier(0.16,1,0.3,1)_200ms_both]"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_200ms_both]">
            Welcome to VisaOnTrack!
          </h1>
          <p className="text-base sm:text-lg text-text-secondary animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_300ms_both]">
            Let's find the perfect immigration professional for your needs
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pt-6 pb-6 sm:px-12 sm:pt-10 sm:pb-10">
          <h2 className="text-base font-semibold mb-6 text-text-secondary uppercase tracking-wider text-xs">
            Here's what you can do
          </h2>

          {/* Benefits Grid */}
          <div className="space-y-6 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-6 bg-bg-secondary border border-border-light rounded-md flex gap-5 transition-all duration-150 hover:-translate-y-1 hover:translate-x-1 hover:shadow-lg hover:border-primary/20 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  animationDelay: `${400 + index * 100}ms`,
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-base flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-110 group-hover:rotate-[5deg]">
                  {benefit.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1.5">{benefit.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 px-6 pb-6 sm:px-12 sm:pb-12 animate-[fadeInUp_600ms_cubic-bezier(0.16,1,0.3,1)_800ms_both]">
          <button
            type="button"
            onClick={handleCompleteProfile}
            onKeyDown={(e) => handleKeyDown(e, handleCompleteProfile)}
            className="flex-1 h-12 px-8 text-base font-medium text-text-primary bg-bg-secondary border border-border-light rounded-base transition-all duration-150 hover:bg-bg-primary hover:-translate-y-0.5 inline-flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Complete your profile"
          >
            <Settings className="w-[18px] h-[18px]" aria-hidden="true" />
            <span>Complete Profile</span>
          </button>
          <button
            type="button"
            onClick={handleBrowseProviders}
            onKeyDown={(e) => handleKeyDown(e, handleBrowseProviders)}
            className="flex-1 h-12 px-8 text-base font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-base transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] shadow-[0_2px_8px_rgba(37,99,235,0.2)] inline-flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:translate-y-0"
            aria-label="Browse providers"
          >
            <span>Browse Providers</span>
            <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
          </button>
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

