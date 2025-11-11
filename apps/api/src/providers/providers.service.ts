import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserRole, Prisma } from '@prisma/client';
import { CreateProviderRequestDto } from './dto/create-provider.dto';
import { UpdateProviderRequestDto } from './dto/update-provider.dto';
import { ProviderResponseDto } from './dto/provider-response.dto';
import { AuditLogService } from '../common/services/audit-log.service';

@Injectable()
export class ProvidersService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * Create provider profile
   * POST /providers
   * 
   * @param userId - User ID from JWT token
   * @param createData - Provider profile data
   * @param ip - Request IP for audit logging
   * @param ua - User agent for audit logging
   * @returns Created provider profile
   */
  async createProvider(
    userId: string,
    createData: CreateProviderRequestDto,
    ip?: string,
    ua?: string,
  ): Promise<ProviderResponseDto> {
    // Check if user already has a provider profile
    const existingProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Provider profile already exists. Use PATCH /providers/{id} to update.',
      });
    }

    // Verify user role is PROVIDER
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    if (user.role !== UserRole.PROVIDER) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Only users with PROVIDER role can create provider profiles',
      });
    }

    // Create provider profile
    const provider = await this.prisma.providerProfile.create({
      data: {
        userId,
        businessName: createData.businessName,
        description: createData.description || null,
        location: createData.location || null,
        languages: createData.languages || [],
      },
    });

    // Mark Step 1 (Business Details) as complete
    await this.prisma.user.update({
      where: { id: userId },
      data: { providerBusinessStepCompleted: true },
    });

    // Audit logging
    await this.auditLogService.logProviderCreated(provider.id, userId, ip, ua);

    return this.mapToResponseDto(provider);
  }

  /**
   * Get provider profile by ID
   * GET /providers/{id}
   * 
   * @param providerId - Provider profile ID
   * @returns Provider profile
   */
  async getProvider(providerId: string): Promise<ProviderResponseDto> {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Provider profile not found',
      });
    }

    return this.mapToResponseDto(provider);
  }

  /**
   * Update provider profile
   * PATCH /providers/{id}
   * 
   * @param providerId - Provider profile ID
   * @param userId - User ID from JWT token (for authorization)
   * @param updateData - Partial provider profile data
   * @param ip - Request IP for audit logging
   * @param ua - User agent for audit logging
   * @returns Updated provider profile
   */
  async updateProvider(
    providerId: string,
    userId: string,
    updateData: UpdateProviderRequestDto,
    ip?: string,
    ua?: string,
  ): Promise<ProviderResponseDto> {
    // Find provider profile
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Provider profile not found',
      });
    }

    // Authorization check: users can only update their own profile
    // (Admin can update any profile - will be handled by guard in M7)
    if (provider.userId !== userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'You can only update your own provider profile',
      });
    }

    // Track changes for audit logging
    const changes: Prisma.InputJsonValue = {};
    if (updateData.businessName !== undefined && updateData.businessName !== provider.businessName) {
      (changes as Record<string, unknown>).businessName = { from: provider.businessName, to: updateData.businessName };
    }
    if (updateData.description !== undefined && updateData.description !== provider.description) {
      (changes as Record<string, unknown>).description = { from: provider.description, to: updateData.description };
    }
    if (updateData.location !== undefined && updateData.location !== provider.location) {
      (changes as Record<string, unknown>).location = { from: provider.location, to: updateData.location };
    }
    if (updateData.languages !== undefined) {
      const oldLanguages = Array.isArray(provider.languages) ? provider.languages : [];
      const newLanguages = updateData.languages;
      if (JSON.stringify(oldLanguages.sort()) !== JSON.stringify(newLanguages.sort())) {
        (changes as Record<string, unknown>).languages = { from: oldLanguages, to: newLanguages };
      }
    }

    // Update provider profile
    const updatedProvider = await this.prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        businessName: updateData.businessName,
        description: updateData.description !== undefined ? updateData.description : undefined,
        location: updateData.location !== undefined ? updateData.location : undefined,
        languages: updateData.languages !== undefined ? updateData.languages : undefined,
      },
    });

    // Audit logging (only if changes were made)
    if (Object.keys(changes).length > 0) {
      await this.auditLogService.logProviderUpdated(providerId, userId, changes, ip, ua);
    }

    return this.mapToResponseDto(updatedProvider);
  }

  /**
   * Map Prisma ProviderProfile to ProviderResponseDto
   */
  private mapToResponseDto(provider: any): ProviderResponseDto {
    return {
      id: provider.id,
      userId: provider.userId,
      businessName: provider.businessName,
      description: provider.description || undefined,
      location: provider.location || undefined,
      languages: Array.isArray(provider.languages) ? provider.languages : [],
      verifiedAt: provider.verifiedAt || undefined,
      createdAt: provider.createdAt,
    };
  }
}

