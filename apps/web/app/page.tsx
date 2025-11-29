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
  Users,
  CheckCircle2,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Sparkles,
  Clock,
  Zap,
  Laptop,
  Palmtree,
  GraduationCap,
  Building2,
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
    title: 'Share Your Goal',
    description: 'Tell us your visa type, timing, and budget in under 2 minutes.',
  },
  {
    number: 2,
    icon: ShieldCheck,
    title: 'Experts Reply',
    description: 'Verified Thai agents and schools unlock your request and send proposals.',
  },
  {
    number: 3,
    icon: MessageCircle,
    title: 'Compare & Chat',
    description: 'Review timelines and pricing. Chat directly to clarify details.',
  },
  {
    number: 4,
    icon: CheckCircle2,
    title: 'Choose & Pay',
    description: 'Pick your provider and pay them directly with our safety guidance.',
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
          role: user.role,
        });

        // User is authenticated - redirect based on status
        if (!user.emailVerified) {
          router.push('/auth/verify-email');
          return;
        }

        if (user.role === 'PROVIDER' && !user.providerOnboardingCompleted) {
          const nextStep = getNextProviderOnboardingStep(user);
          if (nextStep) {
            router.push(nextStep);
            return;
          }
        }

        if (user.role === 'SEEKER') {
          router.push('/requests/new');
          return;
        }

        if (user.role === 'PROVIDER') {
          router.push('/providers/dashboard');
          return;
        }

        setIsCheckingAuth(false);
      } catch (error: unknown) {
        if (isApiError(error) && error.status === 401) {
          setIsCheckingAuth(false);
        } else {
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
      <div className="flex min-h-screen items-center justify-center bg-bg-secondary">
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-text-primary">
      <PageBackground />
      <Header variant="landing" scrolled={scrolled} onAnchorClick={handleAnchorClick} />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-48">
          <div className="relative z-10 mx-auto max-w-7xl px-6 text-center sm:px-8">

            {/* Badge */}
            <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>The #1 Marketplace for Thai Visas</span>
            </div>

            {/* Headline */}
            <h1 className="mx-auto mb-8 max-w-4xl animate-fade-in-up text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 delay-100 sm:text-6xl lg:text-7xl">
              Live the <span
                className="inline-block bg-clip-text font-bold text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, #ED1C24 0%, #ED1C24 22%, #F0F0F0 22%, #F0F0F0 36%, #241D4F 36%, #241D4F 64%, #F0F0F0 64%, #F0F0F0 78%, #ED1C24 78%, #ED1C24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >Thai</span> Life.<br />
              <span className="text-primary">We’ll Handle the Visa.</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl animate-fade-in-up text-xl leading-relaxed text-gray-600 delay-200">
              From beachside study to city business—find the perfect visa solution tailored to your journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex animate-fade-in-up flex-col items-center justify-center gap-4 delay-300 sm:flex-row">
              <Link
                href="/get-started"
                className="shadow-primary/25 flex w-full transform items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover sm:w-auto"
              >
                <Compass className="h-5 w-5" />
                Start Your Journey
              </Link>
              <Link
                href="/auth/register?role=provider"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 sm:w-auto"
              >
                I’m a Provider
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="delay-400 mt-12 flex animate-fade-in-up flex-wrap justify-center gap-6 text-sm font-medium text-gray-500 sm:gap-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                Verified Providers
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                24h Response Time
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-600" />
                Secure Process
              </div>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full max-w-7xl -translate-x-1/2">
            <div className="animate-blob absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-100 opacity-30 mix-blend-multiply blur-3xl filter"></div>
            <div className="animate-blob animation-delay-2000 absolute right-10 top-20 h-72 w-72 rounded-full bg-purple-100 opacity-30 mix-blend-multiply blur-3xl filter"></div>
            <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-1/2 h-72 w-72 rounded-full bg-pink-100 opacity-30 mix-blend-multiply blur-3xl filter"></div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="border-y border-gray-100 bg-gray-50/50 py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">How SawadeePass Works</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                A simple, transparent process designed to get you the best visa options without the headache.
              </p>
            </div>

            <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="absolute left-0 top-12 -z-10 hidden h-0.5 w-full bg-gray-200 lg:block"></div>

              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.number} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                      <div className="bg-primary/10 border-primary/20 mb-6 flex h-14 w-14 items-center justify-center rounded-xl border text-2xl font-bold text-primary">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-gray-900">{step.title}</h3>
                      <p className="leading-relaxed text-gray-600">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid (Bento Style) */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Why Travelers Choose Us</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                We've built a platform that puts you in control of your visa journey.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Feature 1: Large Card */}
              <div className="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:col-span-2">
                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">Verified Thai Providers</h3>
                  <p className="max-w-md text-lg text-gray-600">
                    We verify identity, business licenses, and track performance. Only legitimate agents and schools can unlock your request.
                  </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col justify-center rounded-3xl border border-gray-100 bg-gray-50 p-8 transition-all duration-300 hover:bg-white hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Fast Responses</h3>
                <p className="text-gray-600">
                  Most requests get a reply within 24-48 hours. Experts are eager to help.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col justify-center rounded-3xl border border-gray-100 bg-gray-50 p-8 transition-all duration-300 hover:bg-white hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Direct Chat</h3>
                <p className="text-gray-600">
                  Ask questions and clarify details directly with experts before you commit.
                </p>
              </div>

              {/* Feature 4: Large Card */}
              <div className="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:col-span-2">
                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">Transparent Proposals</h3>
                  <p className="max-w-md text-lg text-gray-600">
                    Compare government fees, service fees, and timelines side-by-side. No hidden costs or surprises.
                  </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-orange-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Traveler User Stories */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Who We Help</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Whatever brings you to Thailand, we'll help you find the right visa solution.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Digital Nomad */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Laptop className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Digital Nomads</h3>
                <p className="mb-4 text-gray-600">
                  Work remotely from Thailand with the new Digital Nomad Visa (DTV). Get help navigating requirements and documentation.
                </p>
                <div className="text-sm text-gray-500">
                  <strong className="text-primary">Common visas:</strong> DTV, ED Visa, Business Visa
                </div>
              </div>

              {/* Retiree */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Palmtree className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Retirees</h3>
                <p className="mb-4 text-gray-600">
                  Settle down in paradise with a Retirement Visa or LTR. Connect with experts who specialize in long-term residence.
                </p>
                <div className="text-sm text-gray-500">
                  <strong className="text-primary">Common visas:</strong> Retirement Visa, LTR
                </div>
              </div>

              {/* Student */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Students</h3>
                <p className="mb-4 text-gray-600">
                  Study Thai language or attend university? Find language schools and agents who can help with Education Visas.
                </p>
                <div className="text-sm text-gray-500">
                  <strong className="text-primary">Common visas:</strong> ED Visa, Student Visa
                </div>
              </div>

              {/* Business Professional */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-lg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">Business Professionals</h3>
                <p className="mb-4 text-gray-600">
                  Starting a business or working for a Thai company? Get expert guidance on work permits and Business Visas.
                </p>
                <div className="text-sm text-gray-500">
                  <strong className="text-primary">Common visas:</strong> Non-B, BOI Visa, Work Permit
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-24 sm:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="flex w-full items-center justify-between bg-white px-6 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="pr-8 text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="border-t border-gray-100 bg-white px-6 pb-6 pt-2 leading-relaxed text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary py-24 text-center text-white">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-8 text-4xl font-bold md:text-5xl">Ready to start your journey?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-blue-100">
              Join thousands of others who have found their perfect visa solution with SawadeePass.
            </p>
            <Link
              href="/get-started"
              className="inline-flex transform items-center gap-2 rounded-xl bg-white px-10 py-5 text-xl font-bold text-primary shadow-xl transition-all hover:-translate-y-1 hover:bg-gray-50"
            >
              Start Visa Check
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
