import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { ProvidersService } from './providers.service';
import { CreateProviderRequestDto } from './dto/create-provider.dto';
import { UpdateProviderRequestDto } from './dto/update-provider.dto';
import { ProviderResponseDto } from './dto/provider-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

/**
 * Providers Controller
 * 
 * Endpoints require authentication via JWT token in HttpOnly cookie (cookieAuth).
 * JWT guard extracts and validates token, attaching userId to request.
 */
@UseGuards(JwtAuthGuard)
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  /**
   * POST /providers
   * Create provider profile
   * 
   * Security: cookieAuth (JWT token required)
   * Response: ProviderProfile schema (201 Created)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProvider(
    @Body() dto: CreateProviderRequestDto,
    @Req() req: Request,
  ): Promise<ProviderResponseDto> {
    // userId is extracted by JwtAuthGuard and attached to req.user
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Extract IP and User-Agent for audit logging
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    try {
      return await this.providersService.createProvider(userId, dto, ip, ua);
    } catch (error) {
      // Re-throw known exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // Log unexpected errors
      console.error('[ProvidersController] Error in createProvider:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while creating your provider profile. Please try again later.',
      });
    }
  }

  /**
   * GET /providers/{id}
   * Get provider profile by ID
   * 
   * Security: cookieAuth (JWT token required)
   * Response: ProviderProfile schema (200 OK)
   */
  @Get(':id')
  async getProvider(@Param('id') id: string): Promise<ProviderResponseDto> {
    try {
      return await this.providersService.getProvider(id);
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Log unexpected errors
      console.error('[ProvidersController] Error in getProvider:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while retrieving the provider profile. Please try again later.',
      });
    }
  }

  /**
   * PATCH /providers/{id}
   * Update provider profile
   * 
   * Security: cookieAuth (JWT token required)
   * Authorization: Users can only update their own profile
   * Response: ProviderProfile schema (200 OK)
   */
  @Patch(':id')
  async updateProvider(
    @Param('id') id: string,
    @Body() dto: UpdateProviderRequestDto,
    @Req() req: Request,
  ): Promise<ProviderResponseDto> {
    // userId is extracted by JwtAuthGuard and attached to req.user
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Extract IP and User-Agent for audit logging
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    try {
      return await this.providersService.updateProvider(id, userId, dto, ip, ua);
    } catch (error) {
      // Re-throw known exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // Log unexpected errors
      console.error('[ProvidersController] Error in updateProvider:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating your provider profile. Please try again later.',
      });
    }
  }
}

