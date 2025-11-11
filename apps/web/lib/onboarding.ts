'use client';

import { User } from '@visaontrack/client';

/**
 * Get the next provider onboarding step based on completion status
 * @param user - Current user object
 * @returns Next step URL or null if all steps complete
 */
export function getNextProviderOnboardingStep(user: User | null): string | null {
  if (!user || user.role !== 'PROVIDER') {
    return null;
  }

  // If onboarding is complete, no next step
  if (user.providerOnboardingCompleted) {
    return null;
  }

  // Determine next step based on completion status
  // Handle undefined/null as false (not completed)
  
  // If no steps are completed, user should start at welcome page
  const hasStartedOnboarding = 
    user.providerBusinessStepCompleted || 
    user.providerServicesStepCompleted || 
    user.providerCredentialsStepCompleted;
  
  if (!hasStartedOnboarding) {
    return '/onboarding/provider/welcome';
  }
  
  // User has started onboarding - find next incomplete step
  if (!user.providerBusinessStepCompleted) {
    return '/onboarding/provider/business';
  }
  if (!user.providerServicesStepCompleted) {
    return '/onboarding/provider/services';
  }
  if (!user.providerCredentialsStepCompleted) {
    return '/onboarding/provider/credentials';
  }

  // All steps complete but onboarding not marked complete
  return '/onboarding/provider/credentials/complete';
}

