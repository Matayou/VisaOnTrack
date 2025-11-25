'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Users,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Lock,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  FileText,
  BarChart3,
} from 'lucide-react';
import { PageBackground, GradientText, Button, Footer } from '@/components/ui';
import { Header } from '@/components/Header';

const steps = [
  {
    number: 1,
    icon: Compass,
    title: 'Tell Us What You Need',
    description: 'Answer a few quick questions about your nationality, purpose, timeline, and budget. Our smart system matches you with the best visa options.',
    benefit: 'Takes less than 2 minutes',
    visual: 'eligibility-form',
  },
  {
    number: 2,
    icon: Users,
    title: 'Get Matched with Experts',
    description: 'We match you with vetted immigration professionals who specialize in your visa type. All providers are verified and have proven track records.',
    benefit: 'Only verified, experienced professionals',
    visual: 'provider-matching',
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: 'Compare & Choose',
    description: 'Receive detailed quotes with timelines and deliverables. Compare options, read reviews, and choose the provider that fits your needs. Our platform is completely free for visa seekers.',
    benefit: '100% free platform, no hidden fees',
    visual: 'quote-comparison',
  },
  {
    number: 4,
    icon: Activity,
    title: 'Track Your Progress',
    description: 'Your payment is held securely in escrow. Track milestones, communicate directly with your provider, and release payment only when satisfied.',
    benefit: 'Your money is protected until you\'re happy',
    visual: 'progress-tracking',
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    description: 'All providers are vetted and verified. Work with confidence.',
  },
  {
    icon: Lock,
    title: 'Secure Escrow',
    description: 'Your payment is protected until milestones are completed.',
  },
  {
    icon: BarChart3,
    title: '100% Free Platform',
    description: 'No platform fees for visa seekers. You only pay providers for their services, with full transparency.',
  },
  {
    icon: MessageCircle,
    title: 'Direct Communication',
    description: 'Chat directly with your provider throughout the process.',
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

export default function HowItWorksPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-secondary relative overflow-hidden">
      <PageBackground />

      <Header variant="landing" scrolled={scrolled} />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-24">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-success-light to-green-50 border border-success/20 rounded-full text-sm font-semibold text-success shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Trusted by 1,000+ successful visa applications</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Get Your Thailand Visa in{' '}
              <GradientText>4 Simple Steps</GradientText>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Connect with verified immigration experts. 100% free platform. Secure payments. Track progress. Get results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/get-started"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-br from-primary via-primary to-primary-hover rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 min-h-[60px] w-full sm:w-auto"
              >
                <span>Start Your Visa Request</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#steps"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-lg font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary hover:border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* 4-Step Process */}
        <section id="steps" className="bg-bg-secondary py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                <GradientText>How It Works</GradientText>
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                A simple, secure process designed to get you the visa you need
              </p>
            </div>

            {/* Step Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <div key={step.number} className="group">
                    {/* Step Card - Consistent with landing page feature cards */}
                    <div className="h-full relative p-8 bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl transition-all duration-300 hover:border-primary/50 overflow-hidden">
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
                      
                      <div className="relative">
                        {/* Icon Container */}
                        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-6">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        
                        {/* Step Number */}
                        <div className="absolute top-0 right-0 text-primary text-2xl font-bold">
                          {step.number}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-lg font-bold mb-3 text-text-primary">
                          {step.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose VisaOnTrack */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              <GradientText>Why Choose VisaOnTrack?</GradientText>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Everything you need for a smooth, secure visa journey
            </p>
          </div>

          {/* Benefits Grid - Consistent with landing page features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="group relative p-8 bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl transition-all duration-300 hover:border-primary/50 overflow-hidden"
                >
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
                  
                  <div className="relative">
                    {/* Icon Container */}
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 text-text-primary">
                      {benefit.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-bg-secondary py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                <GradientText>Common Questions</GradientText>
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                Everything you need to know to get started
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-border-light rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-bg-secondary transition-colors"
                  >
                    <span className="text-base font-semibold text-text-primary pr-4">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-5 text-sm text-text-secondary leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="max-w-7xl mx-auto my-20 md:my-24 px-6 sm:px-8 py-20 md:py-24 bg-gradient-to-br from-primary via-primary to-primary-hover rounded-2xl text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Ready to Start Your Visa Journey?
            </h2>
            <p className="text-xl md:text-2xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands who've successfully obtained their Thailand visa
            </p>
            <Link
              href="/get-started"
              className="group inline-flex items-center gap-3 px-12 py-6 text-xl font-bold text-primary bg-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary min-h-[64px]"
            >
              <span>Start Your Request Now</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

