'use client';

import { useEffect, useRef, useState } from 'react';
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
  DRAFT: 'bg-amber-50 text-amber-800 border-amber-200',
  OPEN: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-gray-100 text-gray-700 border-gray-200',
  HIRED: 'bg-blue-50 text-blue-800 border-blue-200',
};

export function Header({ variant, scrolled = false, onAnchorClick, showLandingActions = true }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [latestRequest, setLatestRequest] = useState<Request | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(variant !== 'landing');
  const menuRef = useRef<HTMLDivElement | null>(null);

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
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between" aria-label="Site header">
        {/* Logo */}
        {/* Logo */}
        <Link
          href={getLogoHref()}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
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
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              <Link
                href="/#features"
                onClick={(e) => onAnchorClick?.(e, '#features')}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
                aria-label="View features"
              >
                Features
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
                aria-label="How it works"
              >
                How it Works
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#pricing"
                onClick={(e) => onAnchorClick?.(e, '#pricing')}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
                aria-label="View pricing"
              >
                Pricing
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
              </Link>
              <Link
                href="/get-started"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
                aria-label="Check your visa eligibility"
              >
                Eligibility
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
              </Link>
              {showLandingActions && (
                <>
                  <Link
                    href="/auth/login"
                    className="px-5 py-2 min-h-[44px] text-sm font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/get-started"
                    className="px-5 py-2 min-h-[44px] text-sm font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-lg transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
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
              className="md:hidden p-2 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </>
        )}

        {/* Seeker variant - Latest request link (Hidden per design requirements) */}
        {/* {variant === 'seeker' && latestRequest && (
          <Link
            href={`/requests/${latestRequest.id}`}
            className="hidden md:inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
          >
            My request
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClasses[latestRequest.status] ?? 'bg-bg-secondary text-text-secondary border-border-light'
                }`}
            >
              {statusLabels[latestRequest.status] ?? latestRequest.status}
            </span>
          </Link>
        )} */}

        {/* Seeker variant - Navigation links */}
        {variant === 'seeker' && (
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
            >
              Dashboard
            </Link>
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
            >
              Find Providers
            </Link>
          </nav>
        )}

        {/* Provider variant - Navigation links */}
        {variant === 'provider' && (
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <Link
              href="/providers/marketplace"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
            >
              Browse Leads
            </Link>
            <Link
              href="/quotes"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
            >
              My Proposals
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-base transition"
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
                className="inline-flex items-center gap-2 rounded-full border border-border-light px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition"
              >
                <UserIcon className="w-4 h-4" aria-hidden="true" />
                <ChevronDown className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-base border border-border-light bg-white shadow-lg">
                  {variant === 'seeker' ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                      >
                        Home
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                      >
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
        )}
      </nav>

      {/* Mobile Navigation Menu (landing variant only) */}
      {variant === 'landing' && isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-light bg-white">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-3" aria-label="Mobile navigation">
            <Link
              href="/#features"
              onClick={(e) => {
                onAnchorClick?.(e, '#features');
                setIsMobileMenuOpen(false);
              }}
              className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
              aria-label="View features"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
              aria-label="How it works"
            >
              How it Works
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
              aria-label="View pricing"
            >
              Pricing
            </Link>
            {showLandingActions && (
              <div className="pt-2 space-y-2 border-t border-border-light">
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-semibold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/15 transition-colors text-center"
                  aria-label="Check your visa eligibility"
                >
                  Check Eligibility
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary transition-colors text-center"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-lg transition-all duration-200 text-center"
                  aria-label="Check your visa eligibility"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

