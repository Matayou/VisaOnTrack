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
  Users,
  CheckCircle2,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '@visaontrack/client';
import { getNextProviderOnboardingStep } from '@/lib/onboarding';
import { isApiError } from '@/lib/api-error';
import { Spinner, PageBackground, GradientText, Footer } from '@/components/ui';
import { LOADING_GENERIC } from '@/lib/loading-messages';
import { Header } from '@/components/Header';
import { getErrorDisplayMessage } from '@/lib/error-handling';

const steps = [
  {
    number: 1,
    icon: Compass,
    title: 'Tell Us What You Need',
    description: 'Answer a few quick questions about your nationality, purpose, timeline, and budget. Takes less than 2 minutes.',
  },
  {
    number: 2,
    icon: Users,
    title: 'Get Matched with Experts',
    description: 'We match you with vetted immigration professionals who specialize in your visa type. Only verified, experienced professionals.',
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: 'Compare & Choose',
    description: 'Receive detailed quotes with timelines and deliverables. Compare options, read reviews, and choose your provider. 100% free platform.',
  },
  {
    number: 4,
    icon: Activity,
    title: 'Track Your Progress',
    description: 'Your payment is held securely in escrow. Track milestones, communicate directly, and release payment only when satisfied.',
  },
];

const faqs = [
  {
    question: 'How long does the process take?',
    answer: 'The initial matching and quote process typically takes 24-48 hours. Once you select a provider, timeline depends on your visa type and requirements. Most applications are processed within 2-4 weeks.',
  },
  {
    question: 'Is the platform free?',
    answer: 'Yes! VisaOnTrack is completely free for visa seekers. There are no platform fees, no hidden costs, and no subscription charges. You only pay providers directly for their visa services, and all payments are held in secure escrow until milestones are completed to your satisfaction.',
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "If you're not satisfied with a milestone, you can request revisions before releasing payment. Our support team is also available to help resolve any issues. Your satisfaction is our priority.",
  },
  {
    question: 'Do I need to be in Thailand to use this service?',
    answer: 'No! You can start the process from anywhere. However, some visa types may require you to be in Thailand for certain steps. Our providers will guide you through the specific requirements for your situation.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

        // PROVIDER users with completed onboarding go to provider dashboard
        if (user.role === 'PROVIDER') {
          console.log('[LandingPage] Provider user with completed onboarding, redirecting to provider dashboard');
          router.push('/providers/dashboard');
          return;
        }

        // For other roles, stay on landing page
        console.log('[LandingPage] User authenticated, showing landing page (role:', user.role, ')');
        setIsCheckingAuth(false);
      } catch (error: unknown) {
        // User is not authenticated - show landing page
        if (isApiError(error) && error.status === 401) {
          console.log('[LandingPage] User not authenticated (401), showing landing page');
          setIsCheckingAuth(false);
        } else {
          // Other errors - show landing page anyway
          console.error('[LandingPage] Error checking auth:', getErrorDisplayMessage(error, 'check authentication'));
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
          <p className="text-text-secondary">{LOADING_GENERIC}</p>
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
      description: 'All immigration professionals are vetted and verified. Work with confidence knowing credentials are thoroughly checked.',
    },
    {
      icon: BarChart3,
      title: '100% Free Platform',
      description: 'No platform fees for visa seekers. You only pay providers for their services. Complete transparency, no hidden costs.',
    },
    {
      icon: Lock,
      title: 'Secure Escrow',
      description: 'Your payment is protected in escrow. Funds released only when milestones are completed to your satisfaction.',
    },
    {
      icon: Activity,
      title: 'Track Progress',
      description: 'Monitor your visa application in real-time. Always know what\'s happening and what\'s next.',
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Chat directly with your provider. Get updates, ask questions, and stay informed throughout the process.',
    },
    {
      icon: Star,
      title: 'Reviews & Ratings',
      description: 'Read verified reviews from real clients. Make informed decisions based on proven track records.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary relative overflow-hidden">
      <PageBackground />
      <Header variant="landing" scrolled={scrolled} onAnchorClick={handleAnchorClick} />

      <main className="relative z-10">
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
                <GradientText>Confidence</GradientText>
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
                100% free platform for visa seekers. Secure payments and milestone-based progress tracking.
              </p>

              {/* Primary CTA - Eligibility Check */}
              <div className="pt-2">
                <Link
                  href="/get-started"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-br from-primary via-primary to-primary-hover rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 min-h-[60px] w-full sm:w-auto"
                  aria-label="Start visa eligibility check"
                >
                  <Compass className="w-6 h-6" aria-hidden="true" />
                  <span>Start Your Visa Journey</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
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

        {/* How It Works Section */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-6 sm:px-8 py-20 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              <GradientText>How It Works</GradientText>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              A simple, secure process to get you the visa you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
                >
                  {/* Step number badge */}
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 pr-8">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="bg-gray-50 py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                <GradientText>Why Choose SawadeePass</GradientText>
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Everything you need for a smooth, secure, and transparent visa journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-6 sm:px-8 py-20 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              <GradientText>Common Questions</GradientText>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Everything you need to know to get started
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-base font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
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
              className="group inline-flex items-center gap-3 px-12 py-6 text-xl font-bold text-primary bg-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary min-h-[64px]"
              aria-label="Start your visa journey"
            >
              <Compass className="w-6 h-6" aria-hidden="true" />
              <span>Start Your Visa Journey</span>
              <ArrowRight className="w-6 h-6" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

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

