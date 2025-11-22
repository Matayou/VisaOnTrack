'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { api, type User } from '@visaontrack/client';
import { logout } from '@/lib/auth';

export function ProviderHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await api.users.getCurrentUser();
        setUser(currentUser);
        // Show header for PROVIDER role or during onboarding (when role might not be set yet)
        // We'll show it if user exists and is not a SEEKER
        if (currentUser.role === 'SEEKER') {
          setIsLoading(false);
          return;
        }
      } catch (err: unknown) {
        console.error('[ProviderHeader] Unable to load user', err);
        // On error, still show header (might be during onboarding)
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Determine where the logo should link based on onboarding status
  const getLogoHref = () => {
    // If user is not loaded yet or during onboarding, link to first onboarding step
    if (!user || (user.role === 'PROVIDER' && !user.providerOnboardingCompleted)) {
      return '/onboarding/provider/business';
    }
    // If provider onboarding is complete, link to dashboard
    if (user.role === 'PROVIDER') {
      return '/dashboard';
    }
    // Default fallback
    return '/';
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Hide header only if we confirmed user is a SEEKER
  // During onboarding, user might not have role set yet, so we show header by default
  if (!isLoading && user && user.role === 'SEEKER') {
    return null;
  }

  // Show header during loading, for PROVIDER role, or during onboarding

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border-light shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={getLogoHref()} className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-text-primary">VisaOnTrack</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <Link
              href="/requests"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
            >
              Marketplace
            </Link>
            <Link
              href="/quotes"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
            >
              My Offers
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
            >
              Orders
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-border-light px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition"
            >
              <UserIcon className="w-4 h-4" aria-hidden="true" />
              <ChevronDown className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-base border border-border-light bg-white shadow-lg">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                >
                  Settings
                </Link>
                <form
                  action={() => logout(router)}
                  className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60 flex items-center gap-2"
                >
                  <button type="submit" className="flex items-center gap-2 w-full text-left">
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

