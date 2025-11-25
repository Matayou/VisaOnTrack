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
import { isApiError } from '@/lib/api-error';
import { Header } from '@/components/Header';
import { Footer } from '@/components/ui';
import { getErrorDisplayMessage } from '@/lib/error-handling';

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

  // Complete onboarding when page loads
  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        await api.users.completeOnboarding({
          requestBody: {
            role: UserRole.SEEKER,
          },
        });
        // Onboarding completed successfully (silent success)
      } catch (error: unknown) {
        // Log error but don't block user experience
        console.error('[SeekerWelcome] Error completing onboarding:', error);
        console.warn(getErrorDisplayMessage(error, 'complete onboarding'));
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
    <div className="min-h-screen bg-bg-secondary">
      <Header variant="seeker" />
      <main className="flex items-center justify-center p-6 py-12 min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-4xl bg-bg-primary border border-border-light rounded-lg shadow-md">
          {/* Header */}
          <div className="px-6 pt-8 pb-6 sm:px-12 sm:pt-12 sm:pb-8 text-center bg-gradient-to-br from-primary/2 to-primary/5 rounded-t-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-success-light to-success-light/60 rounded-full inline-flex items-center justify-center mb-6">
              <CheckCircle
                className="w-8 h-8 text-success"
                aria-hidden="true"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-3">
              Welcome to VisaOnTrack!
            </h1>
            <p className="text-base sm:text-lg text-text-secondary">
              Let&rsquo;s find the perfect immigration professional for your needs
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pt-6 pb-6 sm:px-12 sm:pt-10 sm:pb-10">
            <h2 className="text-base font-semibold mb-6 text-text-secondary uppercase tracking-wider text-xs">
              Here&rsquo;s what you can do
            </h2>

            {/* Benefits Grid */}
            <div className="space-y-6 mb-10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 bg-bg-secondary border border-border-light rounded-md flex gap-5 transition-colors duration-150 hover:border-border-medium"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-base flex items-center justify-center flex-shrink-0">
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
          <div className="flex flex-col sm:flex-row gap-4 px-6 pb-6 sm:px-12 sm:pb-12">
            <button
              type="button"
              onClick={handleCompleteProfile}
              onKeyDown={(e) => handleKeyDown(e, handleCompleteProfile)}
              className="flex-1 h-12 px-8 text-base font-medium text-text-primary bg-bg-secondary border border-border-light rounded-base transition-colors duration-150 hover:bg-bg-primary inline-flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Complete your profile"
            >
              <Settings className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>Complete Profile</span>
            </button>
            <button
              type="button"
              onClick={handleBrowseProviders}
              onKeyDown={(e) => handleKeyDown(e, handleBrowseProviders)}
              className="flex-1 h-12 px-8 text-base font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-base transition-all duration-200 hover:shadow-[0_4px_12px_rgba(37,99,235,0.25)] shadow-[0_2px_8px_rgba(37,99,235,0.15)] inline-flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Browse providers"
            >
              <span>Browse Providers</span>
              <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

