'use client';

import type { ReactNode } from 'react';
import { Header } from './Header';
import { PageBackground } from './ui';

interface AuthPageShellProps {
  children: ReactNode;
  showLandingActions?: boolean;
}

export function AuthPageShell({ children, showLandingActions = false }: AuthPageShellProps) {
  return (
    <div className="min-h-screen bg-bg-secondary relative overflow-hidden">
      <PageBackground />
      <Header variant="landing" showLandingActions={showLandingActions} />
      <main className="flex items-center justify-center p-6 sm:p-8 min-h-[calc(100vh-96px)]">
        {children}
      </main>
    </div>
  );
}
