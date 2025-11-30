import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { ConsultationType, ConsultationStatus, UserRole } from '@prisma/client';
import { OfferConsultationDto } from './dto/offer-consultation.dto';
import { BookConsultationDto } from './dto/book-consultation.dto';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
import { BookConsultationResponseDto } from './dto/book-consultation-response.dto';
import { EntitlementsService } from '../billing/entitlements.service';

@Injectable()
export class ConsultationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService,
  ) {}

  /**
   * Offer a consultation (provider only)
   */
  async offerConsultation(
    requestId: string,
    providerId: string,
    dto: OfferConsultationDto,
  ): Promise<ConsultationResponseDto> {
    // Get provider's userId for entitlement check
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
      select: { userId: true },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // Check if provider has access to consultations feature (premium only)
    await this.entitlements.requireEntitlement(
      provider.userId,
      'consultations.canOffer',
    );

    // Verify request exists
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Verify provider has unlocked the request
    // TODO: Check unlock status when unlock feature is fully implemented
    // For now, we'll allow consultation offers after unlocking

    // Validate paid consultation has price
    if (dto.type === ConsultationType.PAID && !dto.priceTHB) {
      throw new BadRequestException('Price is required for paid consultations');
    }

    // Create consultation
    const consultation = await this.prisma.consultation.create({
      data: {
        requestId,
        providerId,
        type: dto.type,
        priceTHB: dto.priceTHB,
        durationMinutes: dto.durationMinutes,
        description: dto.description,
        meetingLink: dto.meetingLink,
        status: ConsultationStatus.OFFERED,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    return this.mapToDto(consultation);
  }

  /**
   * List consultations for a request
   */
  async listConsultations(
    requestId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<ConsultationResponseDto[]> {
    // Verify request exists
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: {
        seeker: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Check authorization
    // Seeker: must be the request owner
    // Provider: must have unlocked the request (TODO: verify unlock)
    if (userRole === UserRole.SEEKER && request.seekerId !== userId) {
      throw new ForbiddenException('Not authorized to view consultations for this request');
    }

    const consultations = await this.prisma.consultation.findMany({
      where: { requestId },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
      orderBy: [
        { type: 'asc' }, // FREE first
        { createdAt: 'desc' },
      ],
    });

    return consultations.map((c) => this.mapToDto(c));
  }

  /**
   * Book a consultation (seeker only)
   */
  async bookConsultation(
    consultationId: string,
    userId: string,
    dto: BookConsultationDto,
  ): Promise<BookConsultationResponseDto> {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        request: true,
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Verify seeker owns the request
    if (consultation.request.seekerId !== userId) {
      throw new ForbiddenException('Not authorized to book this consultation');
    }

    // Verify consultation is still available
    if (consultation.status !== ConsultationStatus.OFFERED) {
      throw new BadRequestException(
        `Consultation cannot be booked (status: ${consultation.status})`,
      );
    }

    // Validate scheduled time is in the future
    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt < new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Update consultation status
    const updated = await this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        scheduledAt,
        status: ConsultationStatus.BOOKED,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    const response: BookConsultationResponseDto = {
      consultation: this.mapToDto(updated),
    };

    // If paid consultation, create payment intent
    if (consultation.type === ConsultationType.PAID && consultation.priceTHB) {
      // TODO: Integrate Stripe PaymentIntent creation
      // For now, return placeholder
      response.paymentIntent = {
        clientSecret: 'pi_placeholder_secret',
        amount: Number(consultation.priceTHB),
      };
    }

    return response;
  }

  /**
   * Complete a consultation (provider only)
   */
  async completeConsultation(
    consultationId: string,
    providerId: string,
  ): Promise<ConsultationResponseDto> {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Verify provider owns the consultation
    if (consultation.providerId !== providerId) {
      throw new ForbiddenException('Not authorized to complete this consultation');
    }

    // Verify consultation is booked
    if (consultation.status !== ConsultationStatus.BOOKED) {
      throw new BadRequestException(
        `Consultation cannot be completed (status: ${consultation.status})`,
      );
    }

    const updated = await this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        status: ConsultationStatus.COMPLETED,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    return this.mapToDto(updated);
  }

  /**
   * Cancel a consultation (seeker or provider)
   */
  async cancelConsultation(
    consultationId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<ConsultationResponseDto> {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        request: true,
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Verify authorization
    const isSeeker = userRole === UserRole.SEEKER && consultation.request.seekerId === userId;
    const isProvider = userRole === UserRole.PROVIDER && consultation.providerId === userId;

    if (!isSeeker && !isProvider) {
      throw new ForbiddenException('Not authorized to cancel this consultation');
    }

    // Can only cancel if OFFERED or BOOKED
    if (consultation.status !== ConsultationStatus.OFFERED &&
        consultation.status !== ConsultationStatus.BOOKED) {
      throw new BadRequestException(
        `Consultation cannot be cancelled (status: ${consultation.status})`,
      );
    }

    const updated = await this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        status: ConsultationStatus.CANCELLED,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    // TODO: Handle refund for paid consultations

    return this.mapToDto(updated);
  }

  /**
   * Map Prisma model to DTO
   */
  private mapToDto(consultation: any): ConsultationResponseDto {
    return {
      id: consultation.id,
      requestId: consultation.requestId,
      providerId: consultation.providerId,
      type: consultation.type,
      priceTHB: consultation.priceTHB ? Number(consultation.priceTHB) : null,
      durationMinutes: consultation.durationMinutes,
      description: consultation.description,
      meetingLink: consultation.meetingLink,
      scheduledAt: consultation.scheduledAt,
      status: consultation.status,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
      provider: consultation.provider,
    };
  }
}
