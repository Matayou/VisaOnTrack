import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ConsultationsService } from './consultations.service';
import { OfferConsultationDto } from './dto/offer-consultation.dto';
import { BookConsultationDto } from './dto/book-consultation.dto';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
import { BookConsultationResponseDto } from './dto/book-consultation-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  /**
   * POST /requests/:id/consultations
   * Offer a consultation (provider only)
   */
  @Post('requests/:id/consultations')
  @Roles(UserRole.PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async offerConsultation(
    @Param('id') requestId: string,
    @Body() dto: OfferConsultationDto,
    @Req() req: ExpressRequest,
  ): Promise<ConsultationResponseDto> {
    const auth = (req as any).user;
    const userId = auth?.userId;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    // Get provider ID from user
    // TODO: This assumes the user has a provider profile. Add proper check.
    const providerId = userId; // Simplified for now

    return this.consultationsService.offerConsultation(requestId, providerId, dto);
  }

  /**
   * GET /requests/:id/consultations
   * List consultations for a request
   */
  @Get('requests/:id/consultations')
  async listConsultations(
    @Param('id') requestId: string,
    @Req() req: ExpressRequest,
  ): Promise<ConsultationResponseDto[]> {
    const auth = (req as any).user;
    const userId = auth?.userId;
    const role = auth?.role as UserRole;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.consultationsService.listConsultations(requestId, userId, role);
  }

  /**
   * POST /consultations/:id/book
   * Book a consultation (seeker only)
   */
  @Post('consultations/:id/book')
  @Roles(UserRole.SEEKER)
  @HttpCode(HttpStatus.OK)
  async bookConsultation(
    @Param('id') consultationId: string,
    @Body() dto: BookConsultationDto,
    @Req() req: ExpressRequest,
  ): Promise<BookConsultationResponseDto> {
    const auth = (req as any).user;
    const userId = auth?.userId;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.consultationsService.bookConsultation(consultationId, userId, dto);
  }

  /**
   * POST /consultations/:id/complete
   * Mark consultation as completed (provider only)
   */
  @Post('consultations/:id/complete')
  @Roles(UserRole.PROVIDER)
  @HttpCode(HttpStatus.OK)
  async completeConsultation(
    @Param('id') consultationId: string,
    @Req() req: ExpressRequest,
  ): Promise<ConsultationResponseDto> {
    const auth = (req as any).user;
    const userId = auth?.userId;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    // TODO: Get providerId from user's provider profile
    const providerId = userId; // Simplified for now

    return this.consultationsService.completeConsultation(consultationId, providerId);
  }

  /**
   * POST /consultations/:id/cancel
   * Cancel a consultation (seeker or provider)
   */
  @Post('consultations/:id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelConsultation(
    @Param('id') consultationId: string,
    @Req() req: ExpressRequest,
  ): Promise<ConsultationResponseDto> {
    const auth = (req as any).user;
    const userId = auth?.userId;
    const role = auth?.role as UserRole;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.consultationsService.cancelConsultation(consultationId, userId, role);
  }
}
