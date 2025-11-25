'use client';

import { Header } from './Header';

/**
 * ProviderHeader component - Wrapper for unified Header with provider variant
 * @deprecated Use Header component directly with variant="provider"
 */
export function ProviderHeader() {
  return <Header variant="provider" />;
}

