'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  ShieldCheck,
  Lock,
  Activity,
  MessageCircle,
  FileText,
  Star,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { api } from '@visaontrack/client';
import { getNextProviderOnboardingStep } from '@/lib/onboarding';
import { isApiError } from '@/lib/api-error';
import { Spinner } from '@/components/ui';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Spinner size="lg" className="mb-4" />
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
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-border-light shadow-md shadow-black/5'
            : 'bg-white/90 backdrop-blur-xl border-b border-border-light'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between" aria-label="Site header">
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

          {/* Desktop Navigation */}
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
              href="/get-started"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
              aria-label="Check your visa eligibility"
            >
              Eligibility
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2 min-h-[44px] text-sm font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
            <Link
              href="/get-started"
              className="px-5 py-2 min-h-[44px] text-sm font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-lg hover:shadow-md hover:shadow-primary/15 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Check your visa eligibility"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-light bg-white">
            <nav className="max-w-7xl mx-auto px-6 py-4 space-y-3" aria-label="Mobile navigation">
              <a
                href="#features"
                onClick={(e) => {
                  handleAnchorClick(e, '#features');
                  setIsMobileMenuOpen(false);
                }}
                className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                aria-label="View features"
              >
                Features
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                aria-label="How it works"
              >
                How it Works
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                aria-label="View pricing"
              >
                Pricing
              </a>
              <div className="pt-2 space-y-2 border-t border-border-light">
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-semibold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/15 transition-colors text-center"
                  aria-label="Check your visa eligibility"
                >
                  Check Eligibility
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary transition-colors text-center"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-lg hover:shadow-md hover:shadow-primary/15 transition-all duration-200 text-center"
                  aria-label="Check your visa eligibility"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column: Text Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-success-light to-green-50 border border-success/20 rounded-full text-sm font-semibold text-success shadow-sm">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Trusted by 1,000+ verified providers</span>
              </div>

              {/* Main Heading - Display size (48-72px) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-text-primary">
                Navigate Your Visa Journey with{' '}
                <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>

              {/* Hero Image - Mobile: After heading */}
              <div className="relative w-full h-[280px] sm:h-[320px] lg:hidden">
                <Image
                  src="/images/illustrations/hero.png"
                  alt="Visa journey illustration"
                  fill
                  className="object-contain"
                  priority
                  sizes="100vw"
                />
              </div>

              {/* Description - Body text (16-18px) */}
              <p className="text-lg md:text-xl text-text-secondary max-w-xl lg:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Connect with verified immigration professionals in Thailand.{' '}
                Secure payments, transparent pricing, and milestone-based progress tracking.
              </p>

              {/* Primary CTA - Eligibility Check */}
              <div className="pt-2">
                <Link
                  href="/get-started"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-br from-primary via-primary to-primary-hover rounded-xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 min-h-[60px] w-full sm:w-auto"
                  aria-label="Start visa eligibility check"
                >
                  <Compass className="w-6 h-6" aria-hidden="true" />
                  <span>Start Your Visa Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image - Desktop only */}
            <div className="hidden lg:block relative w-full h-[500px] xl:h-[600px]">
              <Image
                src="/images/illustrations/hero.png"
                alt="Visa journey illustration"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1200px) 50vw, 600px"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 md:py-24 bg-bg-secondary">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              A complete platform designed to make your visa journey smooth, secure, and transparent.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-8 bg-bg-primary border border-border-light rounded-xl transition-all duration-200 hover:border-border-medium hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-text-primary">{feature.title}</h3>
                  <p className="text-base text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto my-20 md:my-24 px-6 sm:px-8 py-20 md:py-24 bg-gradient-to-br from-primary via-primary to-primary-hover rounded-2xl text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'patternMove 20s linear infinite',
          }}></div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-hover/50 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Ready to Start Your Visa Journey?
            </h2>
            <p className="text-xl md:text-2xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
              Find the perfect visa option for your situation in minutes
            </p>
            <Link
              href="/get-started"
              className="group inline-flex items-center gap-3 px-12 py-6 text-xl font-bold text-primary bg-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary min-h-[64px]"
              aria-label="Start your visa journey"
            >
              <Compass className="w-6 h-6" aria-hidden="true" />
              <span>Start Your Visa Journey</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-16 border-t border-border-light" role="contentinfo">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 text-lg font-bold text-text-primary mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label="VisaOnTrack homepage"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center" aria-hidden="true">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span>VisaOnTrack</span>
            </Link>
            <p className="text-base text-text-secondary max-w-md leading-relaxed">
              Connect with verified immigration professionals. Secure payments, transparent pricing, and milestone-based progress tracking.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Product</h3>
            <nav className="space-y-3" aria-label="Product navigation">
              <a href="#features" onClick={(e) => handleAnchorClick(e, '#features')} className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                Features
              </a>
              <a href="#" className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                How it Works
              </a>
              <a href="#" className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                Pricing
              </a>
            </nav>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Support</h3>
            <nav className="space-y-3" aria-label="Support navigation">
              <a href="#" className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                Help Center
              </a>
              <a href="#" className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                Terms
              </a>
              <a href="#" className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                Privacy
              </a>
            </nav>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border-light text-center">
          <p className="text-sm text-text-tertiary">© 2025 VisaOnTrack. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
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

