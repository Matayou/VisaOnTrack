'use client';

import { Header } from './Header';

/**
 * SeekerHeader component - Wrapper for unified Header with seeker variant
 * @deprecated Use Header component directly with variant="seeker"
 */
export function SeekerHeader() {
  return <Header variant="seeker" />;
}
