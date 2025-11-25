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
  if (variant === 'minimal') {
    return (
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-border-light" role="contentinfo">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-lg font-bold text-text-primary">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </span>
            <span>VisaOnTrack</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/how-it-works" className="hover:text-text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/help" className="hover:text-text-primary transition-colors">
              Help Center
            </Link>
            <Link href="/terms" className="hover:text-text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
        <div className="pt-6 mt-6 border-t border-border-light text-center">
          <p className="text-sm text-text-tertiary">© 2025 VisaOnTrack. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-16 border-t border-border-light" role="contentinfo">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-lg font-bold text-text-primary mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="VisaOnTrack homepage"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </span>
            <span>VisaOnTrack</span>
          </Link>
          <p className="text-base text-text-secondary max-w-md leading-relaxed">
            Connect with verified immigration professionals. 100% free platform for visa seekers. Secure payments and milestone-based progress tracking.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Product</h3>
          <nav className="space-y-3" aria-label="Product navigation">
            <Link
              href="/#features"
              className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              How it Works
            </Link>
            <Link
              href="/#pricing"
              className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Support</h3>
          <nav className="space-y-3" aria-label="Support navigation">
            <Link
              href="/help"
              className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Help Center
            </Link>
            <Link
              href="/terms"
              className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="block text-base text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>

      {/* Copyright */}
      <div className="pt-8 border-t border-border-light text-center">
        <p className="text-sm text-text-tertiary">© 2025 VisaOnTrack. All rights reserved.</p>
      </div>
    </footer>
  );
}

