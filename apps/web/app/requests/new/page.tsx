'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@visaontrack/client';
import { Spinner, PageBackground, Footer } from '@/components/ui';
import { SeekerHeader } from '@/components/SeekerHeader';
import { IntakeWizard } from '@/components/intake/IntakeWizard';
import { LOADING_GENERIC } from '@/lib/loading-messages';

export default function CreateRequestPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await api.users.getCurrentUser();
        if (!user) throw new Error('No user');
        setIsCheckingAuth(false);
      } catch (error) {
        router.push('/auth/login?returnUrl=/requests/new');
      }
    };
    checkAuth();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-secondary p-6">
        <div className="space-y-3 text-center">
          <Spinner size="lg" />
          <p className="text-sm text-text-secondary">{LOADING_GENERIC}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-secondary" />}>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-bg-secondary">
        <PageBackground />
        <SeekerHeader />
        <main className="relative z-10 mx-auto max-w-7xl flex-1 px-6 py-8 sm:px-8 sm:py-12">
          <IntakeWizard mode="authenticated" />
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}
