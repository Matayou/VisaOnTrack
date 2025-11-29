'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Compass, Menu, X, ChevronDown, LogOut, Sparkles, Briefcase, User as UserIcon } from 'lucide-react';
import { api, type Request, type RequestStatus, type User } from '@visaontrack/client';
import { logout } from '@/lib/auth';

export type HeaderVariant = 'landing' | 'seeker' | 'provider';

interface HeaderProps {
  variant: HeaderVariant;
  scrolled?: boolean;
  onAnchorClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  showLandingActions?: boolean;
}

const statusLabels: Partial<Record<RequestStatus, string>> = {
  DRAFT: 'Draft',
  OPEN: 'Active',
  CLOSED: 'Closed',
  HIRED: 'Hired',
};

const statusClasses: Partial<Record<RequestStatus, string>> = {
  DRAFT: 'bg-amber-50 text-amber-800 ring-amber-600/10',
  OPEN: 'bg-emerald-50 text-emerald-800 ring-emerald-600/10',
  CLOSED: 'bg-gray-100 text-gray-700 ring-gray-400/20',
  HIRED: 'bg-blue-50 text-blue-800 ring-blue-600/10',
};

export function Header({ variant, scrolled = false, onAnchorClick, showLandingActions = true }: HeaderProps) {
  const router = useRouter();
  const menuId = useId();
  const [user, setUser] = useState<User | null>(null);
  const [latestRequest, setLatestRequest] = useState<Request | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(variant !== 'landing');
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuContentRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Load user data for seeker and provider variants
  useEffect(() => {
    if (variant === 'landing') {
      return;
    }

    const load = async () => {
      try {
        const currentUser = await api.users.getCurrentUser();
        setUser(currentUser);

        // Load latest request for seeker variant
        if (variant === 'seeker' && currentUser.role === 'SEEKER') {
          const list = await api.requests.listRequests({ page: 1, limit: 1, seekerId: currentUser.id });
          setLatestRequest(list.data?.[0] ?? null);
        }
      } catch (err: unknown) {
        console.error(`[Header] Unable to load user data for ${variant}`, err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [variant]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close menu on Escape and keep focus within the menu when open
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const focusableSelectors = ['a[href]', 'button:not([disabled])', '[tabindex]:not([tabindex="-1"])'];
    const focusableElements = menuContentRef.current
      ? (Array.from(menuContentRef.current.querySelectorAll<HTMLElement>(focusableSelectors.join(','))) || [])
      : [];

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (event.key === 'Tab' && focusableElements.length > 0) {
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Hide header for seeker variant if user is not a seeker
  if (variant === 'seeker' && !isLoading && (!user || user.role !== 'SEEKER')) {
    return null;
  }

  // Hide header for provider variant if user is a seeker
  if (variant === 'provider' && !isLoading && user && user.role === 'SEEKER') {
    return null;
  }

  // Determine logo href based on variant
  const getLogoHref = () => {
    if (variant === 'landing') {
      return '/';
    }
    if (variant === 'seeker') {
      return '/dashboard';
    }
    if (variant === 'provider') {
      if (!user || (user.role === 'PROVIDER' && !user.providerOnboardingCompleted)) {
        return '/onboarding/provider/business';
      }
      if (user.role === 'PROVIDER') {
        return '/dashboard';
      }
      return '/';
    }
    return '/';
  };

  // Use consistent brand mark across all variants
  const LogoIcon = Compass;

  // Base header classes - standardized across all variants
  const baseHeaderClasses = 'sticky top-0 z-50 transition-all duration-200';
  const headerClasses =
    variant === 'landing'
      ? `${baseHeaderClasses} ${scrolled
        ? 'bg-white/95 backdrop-blur-xl border-b border-border-light shadow-md shadow-black/5'
        : 'bg-white/95 backdrop-blur-xl border-b border-border-light shadow-sm'
      }`
      : `${baseHeaderClasses} bg-white/95 backdrop-blur-xl border-b border-border-light shadow-sm`;

  return (
    <header className={headerClasses}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8" aria-label="Site header">
        {/* Logo */}
        {/* Logo */}
        <Link
          href={getLogoHref()}
          className="flex items-center gap-3 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="VisaOnTrack homepage"
        >
          <div className="relative h-12 w-40">
            <Image
              src="/images/logos/sawadeepass.png"
              alt="SawadeePass"
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 120px, 160px"
              priority
            />
          </div>
        </Link>
        {/* Navigation Links */}
        {variant === 'landing' && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
              <Link
                href="/#features"
                onClick={(e) => onAnchorClick?.(e, '#features')}
                className="group relative text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary"
                aria-label="View features"
              >
                Features
                <span className="absolute bottom-[-4px] left-0 h-0.5 w-0 bg-primary transition-all duration-150 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#how-it-works"
                onClick={(e) => onAnchorClick?.(e, '#how-it-works')}
                className="group relative text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary"
                aria-label="How it works"
              >
                How it Works
                <span className="absolute bottom-[-4px] left-0 h-0.5 w-0 bg-primary transition-all duration-150 group-hover:w-full"></span>
              </Link>
              {showLandingActions && (
                <>
                  <Link
                    href="/auth/login"
                    className="flex min-h-[44px] items-center justify-center rounded-lg border border-border-light bg-transparent px-5 py-2 text-sm font-medium text-text-primary transition-all duration-150 hover:bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/get-started"
                    className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-b from-primary to-primary-hover px-5 py-2 text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                    aria-label="Check your visa eligibility"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-text-secondary transition-colors hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </>
        )}

        {/* Mobile menu button for seeker/provider variants */}
        {(variant === 'provider' || variant === 'seeker') && (
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        )}

        {/* Seeker variant - Latest request link (Hidden per design requirements) */}
        {/* {variant === 'seeker' && latestRequest && (
          <Link
            href={`/requests/${latestRequest.id}`}
            className="hidden md:inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
          >
            My request
            <span
              className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusClasses[latestRequest.status] ?? 'bg-bg-secondary text-text-secondary ring-border-light'
                }`}
            >
              {statusLabels[latestRequest.status] ?? latestRequest.status}
            </span>
          </Link>
        )} */}

        {/* Seeker variant - Navigation links */}
        {variant === 'seeker' && (
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-base px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 rounded-base px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
            >
              Find Providers
            </Link>
          </nav>
        )}

        {/* Provider variant - Navigation links */}
        {variant === 'provider' && (
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            <Link
              href="/providers/marketplace"
              className="inline-flex items-center gap-2 rounded-base px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
            >
              Browse Leads
            </Link>
            <Link
              href="/quotes"
              className="inline-flex items-center gap-2 rounded-base px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
            >
              My Proposals
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded-base px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
            >
              Orders
            </Link>
          </nav>
        )}

        {/* User Menu (for seeker and provider variants) */}
        {(variant === 'seeker' || variant === 'provider') && (
          <div className="flex items-center gap-3">
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="hover:border-border inline-flex items-center gap-2 rounded-full border border-border-light px-3 py-1.5 text-sm font-medium text-text-secondary transition hover:text-text-primary"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-controls={menuId}
                ref={menuButtonRef}
              >
                <UserIcon className="h-4 w-4" aria-hidden="true" />
                <ChevronDown className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
              </button>
              {isMenuOpen && (
                <div
                  id={menuId}
                  role="menu"
                  aria-label="User menu"
                  className="absolute right-0 mt-2 w-44 rounded-base border border-border-light bg-white shadow-lg focus:outline-none"
                  ref={menuContentRef}
                >
                  {variant === 'seeker' ? (
                    <>
                      <Link
                        href="/dashboard"
                        role="menuitem"
                        className="hover:bg-bg-secondary/60 block px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
                      >
                        Home
                      </Link>
                      <Link
                        href="/settings"
                        role="menuitem"
                        className="hover:bg-bg-secondary/60 block px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
                      >
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        role="menuitem"
                        className="hover:bg-bg-secondary/60 block px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        role="menuitem"
                        className="hover:bg-bg-secondary/60 block px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        role="menuitem"
                        className="hover:bg-bg-secondary/60 block px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
                      >
                        Settings
                      </Link>
                    </>
                  )}
                  <form
                    action={() => logout(router)}
                    className="hover:bg-bg-secondary/60 flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary"
                    role="menuitem"
                  >
                    <button type="submit" className="flex w-full items-center gap-2 text-left">
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation Menu (landing variant only) */}
      {variant === 'landing' && isMobileMenuOpen && (
        <div className="border-t border-border-light bg-white md:hidden">
          <nav className="mx-auto max-w-7xl space-y-3 px-6 py-4" aria-label="Mobile navigation">
            <Link
              href="/#features"
              onClick={(e) => {
                onAnchorClick?.(e, '#features');
                setIsMobileMenuOpen(false);
              }}
              className="block rounded-lg px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
              aria-label="View features"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={(e) => {
                onAnchorClick?.(e, '#how-it-works');
                setIsMobileMenuOpen(false);
              }}
              className="block rounded-lg px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
              aria-label="How it works"
            >
              How it Works
            </Link>
            {showLandingActions && (
              <div className="space-y-2 border-t border-border-light pt-2">
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-primary/10 border-primary/20 hover:bg-primary/15 block w-full rounded-lg border px-4 py-3 text-center text-base font-semibold text-primary transition-colors"
                  aria-label="Get started"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-center text-base font-medium text-text-primary transition-colors hover:bg-bg-secondary"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-lg bg-gradient-to-b from-primary to-primary-hover px-4 py-3 text-center text-base font-medium text-white transition-all duration-200"
                  aria-label="Check your visa eligibility"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Mobile Navigation Menu (seeker/provider variants) */}
      {variant === 'seeker' && isMobileMenuOpen && (
        <div className="border-t border-border-light bg-white md:hidden">
          <nav className="mx-auto max-w-7xl space-y-3 px-6 py-4" aria-label="Mobile navigation">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/providers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
            >
              Find Providers
            </Link>
            <div className="space-y-2 border-t border-border-light pt-2">
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-center text-base font-medium text-text-primary transition-colors hover:bg-bg-secondary"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout(router);
                }}
                className="bg-primary/10 border-primary/20 hover:bg-primary/15 block w-full rounded-lg border px-4 py-3 text-center text-base font-semibold text-primary transition-colors"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}

      {variant === 'provider' && isMobileMenuOpen && (
        <div className="border-t border-border-light bg-white md:hidden">
          <nav className="mx-auto max-w-7xl space-y-3 px-6 py-4" aria-label="Mobile navigation">
            <Link
              href="/providers/marketplace"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
            >
              Browse Leads
            </Link>
            <Link
              href="/quotes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
            >
              My Proposals
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
            >
              Orders
            </Link>
            <div className="space-y-2 border-t border-border-light pt-2">
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-center text-base font-medium text-text-primary transition-colors hover:bg-bg-secondary"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-lg border border-border-light bg-transparent px-4 py-3 text-center text-base font-medium text-text-primary transition-colors hover:bg-bg-secondary"
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout(router);
                }}
                className="bg-primary/10 border-primary/20 hover:bg-primary/15 block w-full rounded-lg border px-4 py-3 text-center text-base font-semibold text-primary transition-colors"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
