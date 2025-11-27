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
  Briefcase,
  Sparkles,
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
    title: 'Share Your Visa Goal',
    description: 'Tell us your visa type, timing, and budget in under 2 minutes. No paperwork yet.',
  },
  {
    number: 2,
    icon: ShieldCheck,
    title: 'Verified Experts Unlock & Reply',
    description: 'Licensed Thai agents, schools, and law firms spend credits to unlock your request and send proposals.',
  },
  {
    number: 3,
    icon: MessageCircle,
    title: 'Compare & Chat',
    description: 'Review timelines, inclusions, and pricing. Chat directly to clarify details before you commit.',
  },
  {
    number: 4,
    icon: CheckCircle2,
    title: 'Choose & Pay Your Provider Directly',
    description: 'Pick the provider that fits best. Pay them directly using our safety checklist and red-flag guidance.',
  },
];

const faqs = [
  {
    question: 'Is SawadeePass free for visa seekers?',
    answer: 'Yes. Posting your request and receiving proposals is free for seekers. Providers pay credits or subscriptions to unlock and respond to qualified leads.',
  },
  {
    question: 'Do you hold my payment in escrow?',
    answer:
      'No. You pay providers directly. We give you safety guidance, red flags to avoid, and a checklist to keep off-platform payments secure.',
  },
  {
    question: 'How fast will I hear back?',
    answer:
      'Most seekers receive their first proposal within 24–48 hours. Response time can vary by visa type and seasonality, but providers are incentivized to reply quickly because they spend credits to unlock leads.',
  },
  {
    question: 'How are providers vetted?',
    answer:
      'We verify identity, DBD/license documents, and track performance. Only verified Thai agents, schools, and law firms can unlock and submit proposals.',
  },
  {
    question: 'Which visas do you support?',
    answer:
      'Common visas include Education (ED), Business, LTR, Digital Nomad (DTV), Retirement, Marriage, and tourist extensions. Providers will advise the best path based on your situation.',
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

  const seekerFeatures = [
    {
      icon: ShieldCheck,
      title: 'Verified Thai Providers',
      description: 'Licensed agents, schools, and law firms pass ID + DBD/license checks before they can unlock leads.',
    },
    {
      icon: FileText,
      title: 'Transparent Proposals',
      description: 'See government fees, service fees, timelines, and inclusions before you choose who to work with.',
    },
    {
      icon: MessageCircle,
      title: 'Direct Chat & Docs',
      description: 'Ask questions, share documents, and clarify requirements in one thread per request.',
    },
    {
      icon: Lock,
      title: 'Safety Guidance for Payments',
      description: 'We do not hold funds. You pay providers directly using our safety checklist and red-flag reminders.',
    },
    {
      icon: Activity,
      title: 'Status Updates',
      description: 'Track replies, proposals, and next steps from a single request view.',
    },
    {
      icon: BarChart3,
      title: 'Fast Responses',
      description: 'Most requests receive a first reply within 24–48 hours because providers spend credits to unlock.',
    },
  ];

  const providerHighlights = [
    {
      icon: Briefcase,
      title: 'Qualified Leads, Not Clicks',
      description: 'Requests include visa type, timing, and budget so you can choose the right opportunities.',
    },
    {
      icon: Star,
      title: 'Credit-Based Unlocks',
      description: 'Spend credits to unlock a lead and reply. Predictable costs, no bidding wars.',
    },
    {
      icon: Compass,
      title: 'Proposal Workspace',
      description: 'Send structured proposals with timelines, deliverables, and pricing from one place.',
    },
    {
      icon: ShieldCheck,
      title: 'Verification Badge',
      description: 'Upload your documents once to earn a verified badge and increase win rates.',
    },
    {
      icon: Sparkles,
      title: 'Plans for Teams',
      description: 'Pro and Agency tiers with bundled credits and discounts for higher-volume teams.',
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary/10 to-blue-50 border border-primary/20 rounded-full text-sm font-semibold text-primary shadow-sm">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Lead marketplace for Thailand visas</span>
              </div>

              {/* Main Heading - Display size (48-72px) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-text-primary">
                Thailand visas, <GradientText>simplified</GradientText>
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
                Share your plan once and get proposals from verified Thai experts. Providers spend credits to unlock and
                reply; you pay them directly with our safety guidance.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {[
                  { label: 'Verified providers', value: 'ID + DBD/license checks', icon: ShieldCheck },
                  { label: 'Fast responses', value: '<48h for most requests', icon: BarChart3 },
                  { label: 'Visa coverage', value: 'ED, Business, LTR, DTV, Retirement', icon: FileText },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 bg-white/60 border border-border-light rounded-lg px-4 py-3 shadow-sm backdrop-blur-sm"
                    >
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/15">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary leading-tight">{item.label}</p>
                        <p className="text-xs text-text-secondary leading-tight">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary CTA - Eligibility Check */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/get-started"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-br from-primary via-primary to-primary-hover rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 min-h-[60px] w-full sm:w-auto"
                  aria-label="Start visa eligibility check"
                >
                  <Compass className="w-6 h-6" aria-hidden="true" />
                  <span>Start Visa Check</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/auth/register?role=provider"
                  className="mt-3 sm:mt-0 inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-primary bg-white border border-border-light rounded-xl transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[56px] w-full sm:w-auto"
                  aria-label="Sign up as a provider"
                >
                  <Users className="w-5 h-5" aria-hidden="true" />
                  <span>I’m a provider</span>
                </Link>
              </div>

              <p className="text-sm text-text-tertiary">
                Free for seekers. Providers pay credits/subscriptions to unlock and reply.
              </p>
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
              <GradientText>How SawadeePass Works</GradientText>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Providers pay to unlock qualified requests, so you get faster, higher-quality proposals — and you pay
              providers directly with clear safety guidance.
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
                <GradientText>For Seekers</GradientText>
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Get clarity before you commit. Verified providers send structured proposals you can compare side by side.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {seekerFeatures.map((feature) => {
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

        {/* Provider Section */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 sm:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-start">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary bg-primary/10 rounded-full border border-primary/20">
                For Providers
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-text-primary">
                Predictable lead unlocks. Purpose-built for Thai visa teams.
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                Spend credits to unlock qualified requests, send structured proposals, and manage your pipeline. Move up
                to Pro/Agency tiers for bundled credits and discounts.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white shadow-sm text-sm text-text-secondary">
                  <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
                  Verified badge after docs
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white shadow-sm text-sm text-text-secondary">
                  <BarChart3 className="w-4 h-4 text-primary" aria-hidden="true" />
                  Lead quality controls
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/auth/register?role=provider"
                  className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-br from-primary via-primary to-primary-hover rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2"
                >
                  <Compass className="w-5 h-5" aria-hidden="true" />
                  Start as a provider
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {providerHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white border border-border-light rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-11 h-11 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-md font-semibold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
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
              Start your Thailand visa plan today
            </h2>
            <p className="text-xl md:text-2xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
              Share your plan once, compare verified providers, and move forward with clear pricing and timelines.
            </p>
            <Link
              href="/get-started"
              className="group inline-flex items-center gap-3 px-12 py-6 text-xl font-bold text-primary bg-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary min-h-[64px]"
              aria-label="Start your visa journey"
            >
              <Compass className="w-6 h-6" aria-hidden="true" />
              <span>Start Visa Check</span>
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
