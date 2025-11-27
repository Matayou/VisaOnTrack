'use client';

import { useState, useEffect } from 'react';
import { IntakeWizard } from '@/components/intake/IntakeWizard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/ui';

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
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>
      
      <Header variant="landing" scrolled={scrolled} />

      <main className="relative max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12 z-10">
        <IntakeWizard mode="public" />
      </main>

      <Footer />
    </div>
  );
}
