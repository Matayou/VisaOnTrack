import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserRole, Prisma } from '@prisma/client';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuditLogService } from '../common/services/audit-log.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * Update current user profile
   * PATCH /users/me
   * 
   * @param userId - User ID from JWT token (set by authentication guard)
   * @param updateData - Partial user data to update
   * @param ip - Request IP for audit logging
   * @param ua - User agent for audit logging
   * @returns Updated user data
   */
  async updateCurrentUser(
    userId: string,
    updateData: UpdateUserRequestDto,
    ip?: string,
    ua?: string,
  ): Promise<UserResponseDto> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Validate role if provided (must be SEEKER or PROVIDER, not ADMIN)
    if (updateData.role !== undefined) {
      if (updateData.role === UserRole.ADMIN) {
        throw new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Cannot change role to ADMIN',
        });
      }

      // If user is already ADMIN, don't allow role change
      if (user.role === UserRole.ADMIN) {
        throw new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Cannot change role of ADMIN user',
        });
      }
    }

    // Track changes for audit logging
    const changes: Record<string, unknown> = {};
    if (updateData.role !== undefined && updateData.role !== user.role) {
      changes.role = { from: user.role, to: updateData.role };
    }
    if (updateData.name !== undefined && updateData.name !== user.name) {
      changes.name = { from: user.name, to: updateData.name };
    }
    if (updateData.phone !== undefined && updateData.phone !== user.phone) {
      changes.phone = { from: user.phone, to: updateData.phone };
    }
    if (updateData.locale !== undefined && updateData.locale !== user.locale) {
      changes.locale = { from: user.locale, to: updateData.locale };
    }

    // Build update data (only include defined fields)
    const updatePayload: {
      role?: UserRole;
      name?: string | null;
      phone?: string | null;
      locale?: string;
    } = {};

    if (updateData.role !== undefined) {
      updatePayload.role = updateData.role;
    }
    if (updateData.name !== undefined) {
      updatePayload.name = updateData.name || null;
    }
    if (updateData.phone !== undefined) {
      updatePayload.phone = updateData.phone || null;
    }
    if (updateData.locale !== undefined) {
      updatePayload.locale = updateData.locale;
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    });

    // Audit logging: Log user profile updates (per Section 11)
    if (Object.keys(changes).length > 0) {
      await this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          actorRole: user.role,
          action: 'USER_PROFILE_UPDATED',
          entityType: 'User',
          entityId: userId,
          diff: changes as Prisma.InputJsonValue,
          ip: ip || null,
        },
      });
    }

    // Return user data (exclude sensitive fields)
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name || undefined,
      phone: updatedUser.phone || undefined,
      locale: updatedUser.locale,
      emailVerified: updatedUser.emailVerified, // RFC-003: Include email verification status
      onboardingCompleted: updatedUser.onboardingCompleted,
      onboardingCompletedAt: updatedUser.onboardingCompletedAt || undefined,
      seekerOnboardingCompleted: updatedUser.seekerOnboardingCompleted,
      providerOnboardingCompleted: updatedUser.providerOnboardingCompleted,
      // Provider onboarding step tracking
      providerBusinessStepCompleted: updatedUser.providerBusinessStepCompleted || undefined,
      providerServicesStepCompleted: updatedUser.providerServicesStepCompleted || undefined,
      providerCredentialsStepCompleted: updatedUser.providerCredentialsStepCompleted || undefined,
      createdAt: updatedUser.createdAt,
    };
  }

  /**
   * Get current user profile
   * GET /users/me
   * 
   * @param userId - User ID from JWT token (set by authentication guard)
   * @returns User data
   */
  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Return user data (exclude sensitive fields)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || undefined,
      phone: user.phone || undefined,
      locale: user.locale,
      emailVerified: user.emailVerified, // RFC-003: Include email verification status
      onboardingCompleted: user.onboardingCompleted,
      onboardingCompletedAt: user.onboardingCompletedAt || undefined,
      seekerOnboardingCompleted: user.seekerOnboardingCompleted,
      providerOnboardingCompleted: user.providerOnboardingCompleted,
      // Provider onboarding step tracking
      providerBusinessStepCompleted: user.providerBusinessStepCompleted || undefined,
      providerServicesStepCompleted: user.providerServicesStepCompleted || undefined,
      providerCredentialsStepCompleted: user.providerCredentialsStepCompleted || undefined,
      createdAt: user.createdAt,
    };
  }

  /**
   * Mark provider onboarding step as complete
   * Helper method for step-by-step tracking
   * 
   * @param userId - User ID
   * @param step - Step number (1: business, 2: services, 3: credentials)
   */
  async markProviderStepComplete(userId: string, step: 1 | 2 | 3): Promise<void> {
    const updateData: {
      providerBusinessStepCompleted?: boolean;
      providerServicesStepCompleted?: boolean;
      providerCredentialsStepCompleted?: boolean;
    } = {};

    if (step === 1) {
      updateData.providerBusinessStepCompleted = true;
    } else if (step === 2) {
      updateData.providerServicesStepCompleted = true;
    } else if (step === 3) {
      updateData.providerCredentialsStepCompleted = true;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  /**
   * Get next provider onboarding step based on completion status
   * 
   * @param userId - User ID
   * @returns Next step URL or null if all steps complete
   */
  async getNextProviderOnboardingStep(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        providerBusinessStepCompleted: true,
        providerServicesStepCompleted: true,
        providerCredentialsStepCompleted: true,
        providerOnboardingCompleted: true,
      },
    });

    if (!user || user.role !== 'PROVIDER') {
      return null;
    }

    // If onboarding is complete, no next step
    if (user.providerOnboardingCompleted) {
      return null;
    }

    // Determine next step based on completion status
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

  /**
   * Complete onboarding for current user
   * POST /users/me/complete-onboarding
   * 
   * RFC-004: Onboarding Completion Tracking
   * 
   * @param userId - User ID from JWT token (set by authentication guard)
   * @param role - Role to complete onboarding for (must match user's role)
   * @param ip - Request IP for audit logging
   * @param ua - User agent for audit logging
   * @returns Updated user data with completion flags set
   */
  async completeOnboarding(
    userId: string,
    role: UserRole,
    ip?: string,
    ua?: string,
  ): Promise<UserResponseDto> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Validate role matches user's actual role
    if (role !== user.role) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: `Role mismatch: user role is ${user.role}, but request specifies ${role}`,
      });
    }

    // Validate role is SEEKER or PROVIDER (not ADMIN)
    if (role === UserRole.ADMIN) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Cannot complete onboarding for ADMIN role',
      });
    }

    // Build update data based on role
    const updateData: {
      onboardingCompleted: boolean;
      onboardingCompletedAt: Date;
      seekerOnboardingCompleted?: boolean;
      providerOnboardingCompleted?: boolean;
    } = {
      onboardingCompleted: true,
      onboardingCompletedAt: new Date(),
    };

    if (role === UserRole.SEEKER) {
      updateData.seekerOnboardingCompleted = true;
    } else if (role === UserRole.PROVIDER) {
      updateData.providerOnboardingCompleted = true;
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Audit logging: Log onboarding completion (RFC-004)
    await this.auditLogService.logOnboardingCompleted(userId, role, ip, ua);

      // Return updated user data
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name || undefined,
        phone: updatedUser.phone || undefined,
        locale: updatedUser.locale,
        emailVerified: updatedUser.emailVerified, // RFC-003: Include email verification status
        onboardingCompleted: updatedUser.onboardingCompleted,
        onboardingCompletedAt: updatedUser.onboardingCompletedAt || undefined,
        seekerOnboardingCompleted: updatedUser.seekerOnboardingCompleted,
        providerOnboardingCompleted: updatedUser.providerOnboardingCompleted,
        // Provider onboarding step tracking
        providerBusinessStepCompleted: updatedUser.providerBusinessStepCompleted || undefined,
        providerServicesStepCompleted: updatedUser.providerServicesStepCompleted || undefined,
        providerCredentialsStepCompleted: updatedUser.providerCredentialsStepCompleted || undefined,
        createdAt: updatedUser.createdAt,
      };
    }
}

