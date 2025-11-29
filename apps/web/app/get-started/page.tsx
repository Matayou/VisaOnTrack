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
    <div className="relative min-h-screen overflow-hidden bg-bg-secondary">
      <PageBackground />
      <Header variant="landing" scrolled={scrolled} />

      <main className="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="ios-card relative overflow-hidden p-6 sm:p-8">
          <div className="bg-primary/10 pointer-events-none absolute right-0 top-0 -mr-10 -mt-12 h-40 w-40 rounded-full blur-3xl" aria-hidden="true" />
          <div className="relative">
            <h1 className="mb-3 text-2xl font-bold text-text-primary sm:text-3xl">
              Start your visa plan with <GradientText>SawadeePass</GradientText>
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
              Share your goals, timing, and budget. Verified Thai providers spend credits to unlock and send proposals.
              You pay providers directly using our safety guidance.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: 'Verified providers', desc: 'ID + license checks' },
                { icon: MessageSquare, title: 'Proposals in 24–48h', desc: 'Providers unlock to reply' },
                { icon: Wallet, title: 'Direct payment safety', desc: 'No escrow; follow our checklist' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3 rounded-lg border border-border-light bg-white/60 px-3.5 py-3 shadow-sm">
                    <span className="bg-primary/10 border-primary/15 inline-flex h-9 w-9 items-center justify-center rounded-full border text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold leading-tight text-text-primary">{item.title}</p>
                      <p className="text-xs leading-tight text-text-secondary">{item.desc}</p>
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
