/**
 * Authentication utility functions
 */

import { api } from '@visaontrack/client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Logout user and redirect to login page
 * @param router Next.js router instance
 */
export async function logout(router: AppRouterInstance): Promise<void> {
  try {
    await api.auth.logout();
    // Redirect to login page
    router.push('/auth/login');
  } catch (error) {
    // Even if logout fails, redirect to login (cookie might already be cleared)
    console.error('[Auth] Logout error:', error);
    router.push('/auth/login');
  }
}

