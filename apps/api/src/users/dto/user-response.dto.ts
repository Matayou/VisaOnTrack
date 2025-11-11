import { UserRole } from '@prisma/client';

/**
 * DTO for user response
 * GET /users/me
 * 
 * RFC-003: Includes email verification status
 * RFC-004: Includes onboarding completion status
 */
export class UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  locale: string;
  emailVerified: boolean; // RFC-003: Email verification status
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Date;
  seekerOnboardingCompleted: boolean;
  providerOnboardingCompleted: boolean;
  // Provider onboarding step tracking
  providerBusinessStepCompleted?: boolean; // Step 1: Business details completed
  providerServicesStepCompleted?: boolean; // Step 2: Services & pricing completed
  providerCredentialsStepCompleted?: boolean; // Step 3: Credentials upload completed
  createdAt: Date;
}

