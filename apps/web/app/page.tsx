'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  ShieldCheck,
  Lock,
  Activity,
  MessageCircle,
  FileText,
  Star,
  ArrowRight,
} from 'lucide-react';
import { api } from '@visaontrack/client';
import { getNextProviderOnboardingStep } from '@/lib/onboarding';
import { isApiError } from '@/lib/api-error';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is authenticated and redirect accordingly
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await api.users.getCurrentUser();
        console.log('[LandingPage] User authenticated:', {
          id: user.id,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          providerOnboardingCompleted: user.providerOnboardingCompleted,
          providerBusinessStepCompleted: user.providerBusinessStepCompleted,
          providerServicesStepCompleted: user.providerServicesStepCompleted,
          providerCredentialsStepCompleted: user.providerCredentialsStepCompleted,
        });
        
        // User is authenticated - redirect based on status
        // Check email verification first
        if (!user.emailVerified) {
          console.log('[LandingPage] Email not verified, redirecting to verify-email');
          router.push('/auth/verify-email');
          return;
        }

        // Check provider onboarding progress
        if (user.role === 'PROVIDER' && !user.providerOnboardingCompleted) {
          const nextStep = getNextProviderOnboardingStep(user);
          console.log('[LandingPage] Provider with incomplete onboarding, next step:', nextStep);
          if (nextStep) {
            router.push(nextStep);
            return;
          }
        }

        // SEEKER users go directly to create request page (no onboarding process)
        if (user.role === 'SEEKER') {
          console.log('[LandingPage] Seeker user, redirecting to create request page');
          router.push('/requests/new');
          return;
        }

        // For completed onboarding, stay on landing page
        // (or redirect to dashboard when it exists)
        console.log('[LandingPage] User authenticated, showing landing page (role:', user.role, ')');
        setIsCheckingAuth(false);
      } catch (error: unknown) {
        // User is not authenticated - show landing page
        if (isApiError(error) && error.status === 401) {
          console.log('[LandingPage] User not authenticated (401), showing landing page');
          setIsCheckingAuth(false);
        } else {
          // Other errors - show landing page anyway
          console.error('[LandingPage] Error checking auth:', error);
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Smooth scroll handler
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const features = [
    {
      icon: ShieldCheck,
      title: 'Verified Providers',
      description: 'All immigration professionals are vetted and verified. Work with confidence knowing credentials are checked.',
    },
    {
      icon: Lock,
      title: 'Secure Escrow',
      description: 'Your payment is protected. Funds released only when milestones are completed to your satisfaction.',
    },
    {
      icon: Activity,
      title: 'Track Progress',
      description: 'Monitor your visa application in real-time. Always know what\'s happening and what\'s next.',
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Chat directly with your provider. Get updates, ask questions, and stay informed throughout.',
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Upload, share, and organize all your visa documents securely in one place.',
    },
    {
      icon: Star,
      title: 'Reviews & Ratings',
      description: 'Read verified reviews from real clients. Make informed decisions based on others\' experiences.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-150 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-border-light shadow-sm'
            : 'bg-white/80 backdrop-blur-xl border-b border-border-light'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between" aria-label="Site header">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-lg font-bold text-text-primary hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="VisaOnTrack homepage"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center" aria-hidden="true">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span>VisaOnTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <a
              href="#features"
              onClick={(e) => handleAnchorClick(e, '#features')}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
              aria-label="View features"
            >
              Features
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
              aria-label="How it works"
            >
              How it Works
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
              aria-label="View pricing"
            >
              Pricing
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
            </a>
            <Link
              href="/auth/login"
              className="px-5 py-2 min-h-[44px] text-sm font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2 min-h-[44px] text-sm font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Get started with a free account"
            >
              Get Started
            </Link>
          </nav>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-success-light to-green-200 border border-green-300 rounded-full text-sm font-semibold text-success mb-8 animate-[slideDown_600ms_ease-out]">
            <ShieldCheck className="w-4 h-4" />
            <span>Trusted by 1,000+ verified providers</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6 animate-[fadeInUp_800ms_ease-out_100ms_both]">
            Navigate Your Visa Journey with Confidence
          </h1>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-10 animate-[fadeInUp_800ms_ease-out_200ms_both]">
            Connect with verified immigration professionals in Thailand.{' '}
            Secure payments, transparent pricing, and milestone-based progress tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fadeInUp_800ms_ease-out_300ms_both]">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 text-base font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary min-h-[44px]"
              aria-label="Get started with a free account"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <a
              href="#features"
              onClick={(e) => handleAnchorClick(e, '#features')}
              className="px-8 py-3.5 text-base font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px] flex items-center justify-center"
              aria-label="Learn more about features"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-8 py-16 bg-bg-secondary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-8 bg-bg-primary border border-border-light rounded-xl transition-all duration-150 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 animate-[fadeInUp_600ms_ease-out_both]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-5 transition-transform duration-150 group-hover:scale-110" aria-hidden="true">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto my-16 px-8 py-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'patternMove 20s linear infinite',
          }}></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to Start Your Visa Journey?
            </h2>
            <p className="text-lg opacity-95 mb-8">
              Join thousands who&rsquo;ve successfully navigated their visa process with VisaOnTrack
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-primary bg-white rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary min-h-[44px]"
              aria-label="Create a free account"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-border-light text-center" role="contentinfo">
        <nav className="flex flex-wrap gap-8 justify-center mb-6" aria-label="Footer navigation">
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
            About
          </a>
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
            How it Works
          </a>
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
            Pricing
          </a>
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
            Help Center
          </a>
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
            Terms
          </a>
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
            Privacy
          </a>
        </nav>
        <p className="text-sm text-text-tertiary">© 2025 VisaOnTrack. All rights reserved.</p>
      </footer>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        @keyframes patternMove {
          from {
            transform: translate(0, 0);
          }
          to {
            transform: translate(60px, 60px);
          }
        }
      `}</style>
    </div>
  );
}

