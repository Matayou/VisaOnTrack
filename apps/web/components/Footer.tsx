'use client';

import Link from 'next/link';
import { Compass } from 'lucide-react';

interface FooterProps {
  /**
   * Optional variant for future use (currently only 'full' is supported)
   */
  variant?: 'full' | 'minimal';
}

/**
 * Unified Footer component for consistent footer across all pages
 * 
 * Features:
 * - Full footer with brand, product links, support links, and copyright
 * - Responsive design (mobile-first)
 * - Accessible navigation with ARIA labels
 * - Consistent styling with design system
 * 
 * @example
 * // Full footer (default)
 * <Footer />
 * 
 * @example
 * // Minimal footer (if needed in future)
 * <Footer variant="minimal" />
 */
export function Footer({ variant = 'full' }: FooterProps) {
  const linkClass =
    'block text-base text-footer-text-secondary hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-footer-surface rounded';

  const inlineLinkClass =
    'text-sm text-footer-text-secondary hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-footer-surface rounded';

  const isMinimal = variant === 'minimal';

  const brand = (
    <Link
      href="/"
      className="inline-flex items-center gap-3 rounded text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-footer-surface"
      aria-label="SawadeePass homepage"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
        <Compass className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>SawadeePass</span>
    </Link>
  );

  return (
    <footer
      className={`relative isolate border-t border-footer-border bg-footer-surface text-footer-text-primary ${isMinimal ? 'py-12' : 'py-16'
        }`}
      role="contentinfo"
    >
      {/* Background glow softens the dark treatment without new assets */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 12% 20%, var(--color-glow-footer), transparent 45%), radial-gradient(circle at 88% 10%, rgba(79, 70, 229, 0.25), transparent 40%)',
        }}
      />
      {/* Subtle grid adds structure that matches the dashboard surfaces */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] opacity-40 [background-size:80px_80px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        {isMinimal ? (
          <>
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              {brand}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-end">
                <Link href="/#how-it-works" className={inlineLinkClass}>
                  How It Works
                </Link>
                <Link href="/help" className={inlineLinkClass}>
                  Help Center
                </Link>
                <Link href="/terms" className={inlineLinkClass}>
                  Terms
                </Link>
                <Link href="/privacy" className={inlineLinkClass}>
                  Privacy
                </Link>
              </div>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-footer-text-tertiary">© 2025 SawadeePass. All rights reserved.</p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
              <div className="space-y-4 md:col-span-2">
                {brand}
                <p className="max-w-md text-base leading-relaxed text-footer-text-secondary">
                  Thailand visa marketplace: share your plan once and get proposals from verified providers. They spend
                  credits to unlock leads; you pay providers directly with our safety guidance.
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-footer-text-tertiary">
                  Product
                </h3>
                <nav className="space-y-3" aria-label="Product navigation">
                  <Link href="/#features" className={linkClass}>
                    Features
                  </Link>
                  <Link href="/#how-it-works" className={linkClass}>
                    How it Works
                  </Link>
                  <Link href="/for-experts" className={linkClass}>
                    For Experts
                  </Link>
                </nav>
              </div>

              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-footer-text-tertiary">
                  Support
                </h3>
                <nav className="space-y-3" aria-label="Support navigation">
                  <Link href="/help" className={linkClass}>
                    Help Center
                  </Link>
                  <Link href="/terms" className={linkClass}>
                    Terms
                  </Link>
                  <Link href="/privacy" className={linkClass}>
                    Privacy
                  </Link>
                </nav>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 text-center md:text-left">
              <p className="text-sm text-footer-text-tertiary">© 2025 SawadeePass. All rights reserved.</p>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
