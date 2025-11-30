'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, UserRole } from '@visaontrack/client';
import { CheckCircle, Clock, ShieldCheck, Sparkles, Mail, ArrowRight, PartyPopper } from 'lucide-react';
import { ProviderHeader } from '@/components/ProviderHeader';
import { Footer, Card, Button } from '@/components/ui';

export default function CredentialsCompletePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const completeOnboarding = async () => {
      try {
        await api.users.completeOnboarding({
          requestBody: {
            role: UserRole.PROVIDER,
          },
        });
      } catch (error: unknown) {
        console.error('[CredentialsComplete] Error completing onboarding:', error);
      }
    };

    completeOnboarding();
  }, []);

  const handleGoToDashboard = () => {
    router.push('/');
  };

  const steps = [
    {
      icon: CheckCircle,
      status: 'complete' as const,
      title: 'Documents Uploaded',
      description: 'Your credentials have been successfully submitted.',
    },
    {
      icon: Clock,
      status: 'current' as const,
      title: 'Under Review',
      description: 'Our team reviews submissions within 1-2 business days.',
    },
    {
      icon: ShieldCheck,
      status: 'pending' as const,
      title: 'Verification Complete',
      description: 'Once approved, you can start accepting clients immediately.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg-secondary">
      <ProviderHeader />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          {/* Success Card */}
          <Card 
            padding="none" 
            elevated 
            className={`overflow-hidden transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            {/* Header with Celebration */}
            <div className="from-success/10 via-success/5 relative overflow-hidden bg-gradient-to-br to-transparent px-6 py-10 text-center sm:px-10 sm:py-12">
              {/* Decorative elements */}
              <div className="bg-success/5 absolute -left-10 -top-10 h-40 w-40 rounded-full" />
              <div className="bg-success/5 absolute -bottom-10 -right-10 h-40 w-40 rounded-full" />
              
              {/* Success Icon */}
              <div 
                className={`to-success/80 shadow-success/30 relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-success shadow-lg transition-all delay-200 duration-500 ${mounted ? 'scale-100' : 'scale-0'}`}
              >
                <CheckCircle 
                  className={`h-10 w-10 text-white transition-all delay-500 duration-300 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} 
                  aria-hidden="true" 
                />
              </div>

              {/* Title */}
              <div className="flex items-center justify-center gap-2">
                <PartyPopper className="h-5 w-5 text-success" aria-hidden="true" />
                <h1 
                  className={`text-2xl font-bold tracking-tight text-text-primary transition-all delay-300 duration-500 sm:text-3xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  Credentials Submitted!
                </h1>
                <PartyPopper className="h-5 w-5 -scale-x-100 text-success" aria-hidden="true" />
              </div>
              
              <p 
                className={`delay-400 mt-3 text-base text-text-secondary transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              >
                You&apos;re almost there! We&apos;ll review your credentials shortly.
              </p>
            </div>

            {/* Timeline */}
            <div className="px-6 py-8 sm:px-10">
              <div className="space-y-0">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`relative flex gap-4 pb-6 transition-all duration-500 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute bottom-0 left-4 top-10 w-0.5 bg-border-light" />
                    )}
                    
                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                        step.status === 'complete'
                          ? 'shadow-success/30 bg-success shadow-sm'
                          : step.status === 'current'
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'border-2 border-border-light bg-bg-secondary'
                      }`}
                    >
                      <step.icon
                        className={`h-4 w-4 ${
                          step.status === 'complete'
                            ? 'text-white'
                            : step.status === 'current'
                            ? 'text-primary'
                            : 'text-text-tertiary'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <h3 
                        className={`text-sm font-semibold ${
                          step.status === 'pending' ? 'text-text-tertiary' : 'text-text-primary'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-text-secondary">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Email Notice */}
              <div 
                className={`border-primary/20 bg-primary/5 mt-2 flex items-center gap-3 rounded-lg border p-4 transition-all delay-700 duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              >
                <div className="bg-primary/10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full">
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">Check your email</p>
                  <p className="text-xs text-text-secondary">
                    We&apos;ll notify you once your credentials are verified.
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="bg-bg-secondary/50 border-t border-border-light px-6 py-5 sm:px-10">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <div 
                  className={`delay-800 flex items-center gap-2 text-sm text-text-secondary transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                >
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Explore your dashboard while you wait</span>
                </div>
                <Button
                  onClick={handleGoToDashboard}
                  icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  iconPosition="right"
                  className={`delay-900 transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
