import { IsInt, Min, Max } from 'class-validator';

/**
 * DTO for marking provider onboarding step as complete
 * POST /users/me/mark-provider-step-complete
 */
export class MarkStepCompleteRequestDto {
  @IsInt()
  @Min(1)
  @Max(3)
  step: number; // 1: business, 2: services, 3: credentials
}

export class MarkStepCompleteResponseDto {
  message: string;
}

