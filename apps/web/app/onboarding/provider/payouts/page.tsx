'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Zap,
  Eye,
  Lock,
} from 'lucide-react';

export default function PaymentSetupPage() {
  const router = useRouter();

  const handleConnectStripe = () => {
    // TODO: Redirect to Stripe Connect onboarding when backend is ready
    // window.location.href = stripeConnectUrl;
  };

  const handleSkip = () => {
    // TODO: Mark payment setup as skipped and redirect to dashboard
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="max-w-6xl mx-auto bg-bg-primary border border-border-light rounded-md shadow-md animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="p-8 border-b border-border-light">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1 rounded-sm transition-all duration-150 ${
                  step <= 5 ? 'bg-primary' : 'bg-border-light'
                }`}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Payment Setup</h1>
          <p className="text-sm text-text-secondary">
            Connect your bank account to receive payments securely through Stripe
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stripe Connect Card */}
          <div className="p-8 bg-gradient-to-br from-[#635BFF]/5 to-[#635BFF]/2 border border-[#635BFF]/10 rounded-lg mb-8 animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#635BFF] to-[#5850EC] rounded-base flex items-center justify-center animate-[scaleIn_300ms_cubic-bezier(0.16,1,0.3,1)_100ms_both]">
                <CreditCard className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold">Powered by Stripe</span>
            </div>
            <h2 className="text-lg font-semibold mb-3 animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_200ms_both]">
              Connect your Stripe account
            </h2>
            <p className="text-base text-text-secondary leading-relaxed mb-6 animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_300ms_both]">
              We use Stripe Connect to ensure your payments are secure and timely. You&rsquo;ll be redirected to Stripe to complete a quick setup (takes ~2 minutes).
            </p>
            <button
              type="button"
              onClick={handleConnectStripe}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleConnectStripe();
                }
              }}
              aria-label="Connect with Stripe to set up payments"
              className="w-full h-12 px-6 text-base font-semibold text-white rounded-base transition-all duration-200 shadow-[0_4px_12px_rgba(99,91,255,0.25)] inline-flex items-center justify-center gap-3 bg-gradient-to-br from-[#635BFF] to-[#5850EC] hover:shadow-md hover:shadow-[#635BFF]/20 animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_400ms_both] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ExternalLink className="w-5 h-5" aria-hidden="true" />
              Connect with Stripe
            </button>
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-5 mb-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Secure & Protected',
                description:
                  'Bank-level security with encryption and PCI compliance. Your financial data is never stored on our servers.',
                delay: 500,
              },
              {
                icon: Zap,
                title: 'Fast Payouts',
                description:
                  'Receive payments within 2-3 business days automatically when clients approve milestones.',
                delay: 600,
              },
              {
                icon: Eye,
                title: 'Transparent Fees',
                description: 'Simple 5% platform fee on completed projects. No hidden charges, no monthly fees.',
                delay: 700,
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 p-5 bg-bg-secondary border border-border-light rounded-base transition-all duration-150 hover:translate-x-1 hover:border-primary/20 animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_both]"
                style={{ animationDelay: `${benefit.delay}ms` }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-base flex items-center justify-center flex-shrink-0 transition-transform duration-150">
                  <benefit.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security Badge */}
          <div className="flex gap-4 p-5 bg-gradient-to-br from-success/5 to-success/2 border border-success/10 rounded-base animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_800ms_both]">
            <div className="w-10 h-10 bg-gradient-to-br from-success-light to-success/20 rounded-base flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-success" aria-hidden="true" />
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Your data is safe.</strong> Stripe is trusted by millions of businesses worldwide and is certified to the highest compliance standards.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border-light flex justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push('/onboarding/provider/credentials')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push('/onboarding/provider/credentials');
              }
            }}
            aria-label="Go back to previous step"
            className="h-11 px-6 text-base font-medium text-text-primary bg-bg-secondary border border-border-light rounded-base cursor-pointer transition-all duration-150 inline-flex items-center gap-2 hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
            Back
          </button>
          <button
            type="button"
            onClick={handleSkip}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSkip();
              }
            }}
            aria-label="Skip payment setup for now"
            className="h-11 px-4 text-base font-medium text-primary bg-transparent border-none cursor-pointer transition-all duration-150 inline-flex items-center gap-2 hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Skip for now
            <ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

