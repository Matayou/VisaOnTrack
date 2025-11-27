/**
 * DTOs for email verification endpoints
 * RFC-003: Email verification flow
 */

export class VerifyEmailResponseDto {
  message: string;
  verified: boolean;
}

export class ResendVerificationResponseDto {
  message: string;
  // Dev-only: Verification link for local development (when email service is stub)
  verificationLink?: string; // Only included in development mode
}

