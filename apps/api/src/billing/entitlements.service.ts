import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PlanCode, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../common/services/prisma.service';
import {
  PLAN_ENTITLEMENTS,
  PLAN_METADATA,
  EntitlementKey,
  EntitlementValue,
  getEntitlement,
  hasEntitlement,
} from './plan-entitlements';

export interface EntitlementsResponse {
  planCode: PlanCode;
  planName: string;
  entitlements: Record<string, EntitlementValue>;
  usage: {
    creditsRemaining: number;
    creditsUsedThisMonth: number;
    monthlyFreeCredits: number;
    packagesCreated: number;
    packagesMax: number;
    consultationsOffered: number;
  };
}

@Injectable()
export class EntitlementsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get the current active plan for a user (provider).
   * Returns FREE if no active subscription exists.
   */
  async getUserPlan(userId: string): Promise<PlanCode> {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        subscriptions: {
          where: {
            status: {
              in: [
                SubscriptionStatus.ACTIVE,
                SubscriptionStatus.TRIALING,
              ],
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // If no active subscription, user is on FREE plan
    if (provider.subscriptions.length === 0) {
      return PlanCode.FREE;
    }

    return provider.subscriptions[0].planCode;
  }

  /**
   * Get a specific entitlement value for a user
   */
  async getEntitlement<T extends EntitlementValue = EntitlementValue>(
    userId: string,
    key: EntitlementKey,
  ): Promise<T> {
    const planCode = await this.getUserPlan(userId);
    return getEntitlement<T>(planCode, key);
  }

  /**
   * Check if a user has a boolean entitlement
   */
  async checkEntitlement(userId: string, key: EntitlementKey): Promise<boolean> {
    const planCode = await this.getUserPlan(userId);
    return hasEntitlement(planCode, key);
  }

  /**
   * Require a specific entitlement, throwing ForbiddenException if not granted
   */
  async requireEntitlement(userId: string, key: EntitlementKey): Promise<void> {
    const hasAccess = await this.checkEntitlement(userId, key);
    if (!hasAccess) {
      const planCode = await this.getUserPlan(userId);
      const currentPlan = PLAN_METADATA[planCode].name;
      throw new ForbiddenException(
        `This feature is not available on the ${currentPlan} plan. Please upgrade to access ${String(key)}.`,
      );
    }
  }

  /**
   * Check if a numeric entitlement limit has been reached
   */
  async checkLimit(
    userId: string,
    key: EntitlementKey,
    currentCount: number,
  ): Promise<boolean> {
    const limit = await this.getEntitlement<number>(userId, key);
    return currentCount < limit;
  }

  /**
   * Require that a limit has not been reached, throwing ForbiddenException if exceeded
   */
  async requireLimit(
    userId: string,
    key: EntitlementKey,
    currentCount: number,
  ): Promise<void> {
    const limit = await this.getEntitlement<number>(userId, key);
    if (currentCount >= limit) {
      const planCode = await this.getUserPlan(userId);
      const currentPlan = PLAN_METADATA[planCode].name;
      throw new ForbiddenException(
        `You have reached the ${String(key)} limit (${limit}) for the ${currentPlan} plan. Please upgrade to increase your limit.`,
      );
    }
  }

  /**
   * Get all entitlements and usage stats for a user
   * Handles both SEEKERS and PROVIDERS
   */
  async getEntitlementsWithUsage(userId: string, userRole?: string): Promise<EntitlementsResponse> {
    // SEEKERS: Return seeker-specific entitlements
    // Seekers can message providers ONLY within their own requests
    // Messaging is always request-scoped (not general provider messaging)
    if (userRole === 'SEEKER') {
      return {
        planCode: PlanCode.FREE,
        planName: 'Seeker',
        entitlements: {
          // Messaging enabled for seekers (request-scoped only)
          'messaging.enabled': true,

          // Seekers cannot offer consultations
          'consultations.canOffer': false,
          'consultations.platformFee': 0,

          // No credit/package features for seekers
          'credits.monthlyFree': 0,
          'packages.max': 0,

          // No provider-only features
          'analytics.enabled': false,
          'analytics.advanced': false,
          'team.enabled': false,
          'team.maxMembers': 1,

          // Reasonable file upload limits for seekers
          'fileUpload.maxSizeMB': 10,

          // Not applicable for seekers
          'search.rankingBoost': 0,
        } as Record<string, EntitlementValue>,
        usage: {
          creditsRemaining: 0,
          creditsUsedThisMonth: 0,
          monthlyFreeCredits: 0,
          packagesCreated: 0,
          packagesMax: 0,
          consultationsOffered: 0,
        },
      };
    }

    // PROVIDERS: Get actual plan entitlements
    const planCode = await this.getUserPlan(userId);
    const entitlements = PLAN_ENTITLEMENTS[planCode];
    const planName = PLAN_METADATA[planCode].name;

    // Get provider for usage stats
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        credits: true,
        servicePackages: {
          select: {
            id: true,
          },
        },
        consultations: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // Calculate credits used this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const creditsUsedThisMonth = await this.prisma.creditTransaction.count({
      where: {
        providerId: provider.id,
        type: 'SPEND',
        createdAt: {
          gte: monthStart,
        },
      },
    });

    const monthlyFreeCredits = entitlements['credits.monthlyFree'] as number;

    return {
      planCode,
      planName,
      entitlements: entitlements as Record<string, EntitlementValue>,
      usage: {
        creditsRemaining: provider.credits,
        creditsUsedThisMonth,
        monthlyFreeCredits,
        packagesCreated: provider.servicePackages.length,
        packagesMax: entitlements['packages.max'] as number,
        consultationsOffered: provider.consultations.length,
      },
    };
  }

  /**
   * Get the platform fee percentage for consultations based on plan
   */
  async getConsultationPlatformFee(userId: string): Promise<number> {
    return this.getEntitlement<number>(userId, 'consultations.platformFee');
  }
}
