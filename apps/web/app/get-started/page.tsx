'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, MessageSquare, Wallet } from 'lucide-react';
import { IntakeWizard } from '@/components/intake/IntakeWizard';
import { Header } from '@/components/Header';
import { Footer, GradientText, PageBackground } from '@/components/ui';

export default function GetStartedPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-secondary relative overflow-hidden">
      <PageBackground />
      <Header variant="landing" scrolled={scrolled} />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 space-y-6 sm:space-y-8">
        <section className="ios-card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-12 pointer-events-none" aria-hidden="true" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Start your visa plan with <GradientText>SawadeePass</GradientText>
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
              Share your goals, timing, and budget. Verified Thai providers spend credits to unlock and send proposals.
              You pay providers directly using our safety guidance.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, title: 'Verified providers', desc: 'ID + license checks' },
                { icon: MessageSquare, title: 'Proposals in 24–48h', desc: 'Providers unlock to reply' },
                { icon: Wallet, title: 'Direct payment safety', desc: 'No escrow; follow our checklist' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3 rounded-lg border border-border-light bg-white/60 px-3.5 py-3 shadow-sm">
                    <span className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/15">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary leading-tight">{item.title}</p>
                      <p className="text-xs text-text-secondary leading-tight">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="ios-card p-4 sm:p-6 lg:p-8">
          <IntakeWizard mode="public" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
