import { IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

/**
 * DTO for completing onboarding
 * POST /users/me/complete-onboarding
 * 
 * RFC-004: Onboarding Completion Tracking
 */
export class CompleteOnboardingRequestDto {
  @IsEnum(UserRole)
  role: UserRole;
}

