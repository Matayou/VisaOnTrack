'use client';

import { ReactNode } from 'react';
import { ProviderHeader } from '@/components/ProviderHeader';
import { Footer, Card } from '@/components/ui';
import { OnboardingProgress } from './OnboardingProgress';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  title: string;
  subtitle: string;
}

export function OnboardingLayout({
  children,
  currentStep,
  title,
  subtitle,
}: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-secondary">
      <ProviderHeader />
      
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Progress Section */}
          <Card padding="md" elevated className="animate-fade-in-up">
            <OnboardingProgress currentStep={currentStep} />
          </Card>

          {/* Page Header */}
          <div className="animate-fade-in-up px-1" style={{ animationDelay: '100ms' }}>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {title}
            </h1>
            <p className="text-base text-text-secondary">{subtitle}</p>
          </div>

          {/* Main Content */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

