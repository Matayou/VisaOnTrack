import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UserRole } from '@prisma/client';

/**
 * Provider Verified Guard (RFC-005)
 *
 * Ensures providers have completed onboarding AND been verified by admin
 * before accessing protected features.
 *
 * Checks (for PROVIDER role only):
 * 1. onboardingCompleted = true
 * 2. providerOnboardingCompleted = true
 * 3. ProviderProfile.verifiedAt is set
 *
 * Seekers and Admins pass through without checks.
 *
 * Returns 403 Forbidden with clear message if not verified.
 */
@Injectable()
export class ProviderVerifiedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // No user attached (should be caught by JwtAuthGuard first)
    if (!user || !user.userId) {
      return true; // Let JwtAuthGuard handle this
    }

    // Only apply verification checks to PROVIDER role
    if (user.role !== UserRole.PROVIDER) {
      return true; // Seekers and Admins pass through
    }

    // Fetch user and provider profile from database
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        providerProfile: {
          select: {
            id: true,
            verifiedAt: true,
          },
        },
      },
    });

    if (!dbUser) {
      throw new ForbiddenException({
        code: 'PROVIDER_NOT_FOUND',
        message: 'User account not found',
      });
    }

    // Check 1: General onboarding completed
    if (!dbUser.onboardingCompleted) {
      throw new ForbiddenException({
        code: 'ONBOARDING_INCOMPLETE',
        message: 'Please complete your account onboarding first',
        redirect: '/onboarding/provider/welcome',
      });
    }

    // Check 2: Provider-specific onboarding completed
    if (!dbUser.providerOnboardingCompleted) {
      throw new ForbiddenException({
        code: 'PROVIDER_ONBOARDING_INCOMPLETE',
        message: 'Please complete your provider onboarding first',
        redirect: '/onboarding/provider/business',
      });
    }

    // Check 3: Provider profile exists
    if (!dbUser.providerProfile) {
      throw new ForbiddenException({
        code: 'PROVIDER_PROFILE_MISSING',
        message: 'Provider profile not found. Please complete onboarding.',
        redirect: '/onboarding/provider/business',
      });
    }

    // Check 4: Provider verified by admin
    if (!dbUser.providerProfile.verifiedAt) {
      throw new ForbiddenException({
        code: 'PROVIDER_NOT_VERIFIED',
        message:
          'Your provider account is pending verification. Please wait for admin approval.',
        redirect: '/onboarding/provider/credentials/complete',
      });
    }

    // All checks passed - provider is verified
    return true;
  }
}

