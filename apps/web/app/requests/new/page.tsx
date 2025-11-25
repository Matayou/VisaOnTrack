'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@visaontrack/client';
import { Spinner, PageBackground } from '@/components/ui';
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
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Spinner size="lg" />
          <p className="text-text-secondary text-sm">{LOADING_GENERIC}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-secondary" />}>
      <div className="min-h-screen bg-bg-secondary relative overflow-hidden">
        <PageBackground />
        <SeekerHeader />
        <main className="relative max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12 z-10">
          <IntakeWizard mode="authenticated" />
        </main>
      </div>
    </Suspense>
  );
}
