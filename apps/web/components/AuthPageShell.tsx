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
    <div className="relative min-h-screen overflow-hidden bg-bg-secondary">
      <PageBackground />
      <Header variant="landing" showLandingActions={showLandingActions} />
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}
