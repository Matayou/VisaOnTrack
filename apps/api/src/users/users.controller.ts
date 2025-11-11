import {
  Controller,
  Patch,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { CompleteOnboardingRequestDto } from './dto/complete-onboarding.dto';
import { MarkStepCompleteRequestDto, MarkStepCompleteResponseDto } from './dto/mark-step-complete.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Users Controller
 * 
 * Endpoints require authentication via JWT token in HttpOnly cookie (cookieAuth).
 * JWT guard extracts and validates token, attaching userId to request.
 */
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/me
   * Get current user profile
   * 
   * Security: cookieAuth (JWT token required)
   * Response: User schema
   */
  @Get('me')
  async getCurrentUser(@Req() req: Request): Promise<UserResponseDto> {
    // userId is extracted by JwtAuthGuard and attached to req.user
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    return this.usersService.getCurrentUser(userId);
  }

  /**
   * PATCH /users/me
   * Update current user profile
   * 
   * Security: cookieAuth (JWT token required)
   * Request: UpdateUserRequest (role, name, phone, locale - all optional)
   * Response: User schema
   */
  @Patch('me')
  async updateCurrentUser(
    @Body() dto: UpdateUserRequestDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    // userId is extracted by JwtAuthGuard and attached to req.user
    const userId = (req as any).user?.userId;

    if (!userId) {
      // SECURITY: No debug logging to prevent PII leakage (cookie contents, user IDs)
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Extract IP and User-Agent for audit logging
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    try {
      return await this.usersService.updateCurrentUser(userId, dto, ip, ua);
    } catch (error) {
      // Re-throw validation and authorization errors
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }

      // Log unexpected errors
      console.error('[UsersController] Error in updateCurrentUser:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating your profile. Please try again later.',
      });
    }
  }

  /**
   * POST /users/me/complete-onboarding
   * Complete onboarding for current user
   * 
   * RFC-004: Onboarding Completion Tracking
   * 
   * Security: cookieAuth (JWT token required)
   * Request: CompleteOnboardingRequest (role: SEEKER | PROVIDER)
   * Response: User schema (with completion flags set)
   */
  @Post('me/complete-onboarding')
  @HttpCode(HttpStatus.OK)
  async completeOnboarding(
    @Body() dto: CompleteOnboardingRequestDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
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
      return await this.usersService.completeOnboarding(userId, dto.role, ip, ua);
    } catch (error) {
      // Re-throw validation and authorization errors
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }

      // Log unexpected errors
      console.error('[UsersController] Error in completeOnboarding:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while completing onboarding. Please try again later.',
      });
    }
  }

  /**
   * POST /users/me/mark-provider-step-complete
   * Mark a provider onboarding step as complete
   * 
   * Security: cookieAuth (JWT token required)
   * Request: MarkStepCompleteRequest (step: 1 | 2 | 3)
   * Response: MarkStepCompleteResponse
   */
  @Post('me/mark-provider-step-complete')
  @HttpCode(HttpStatus.OK)
  async markProviderStepComplete(
    @Body() dto: MarkStepCompleteRequestDto,
    @Req() req: Request,
  ): Promise<MarkStepCompleteResponseDto> {
    // userId is extracted by JwtAuthGuard and attached to req.user
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Validate step is 1, 2, or 3
    if (dto.step < 1 || dto.step > 3) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Step must be 1, 2, or 3',
      });
    }

    try {
      await this.usersService.markProviderStepComplete(userId, dto.step as 1 | 2 | 3);
      return {
        message: `Step ${dto.step} marked as complete`,
      };
    } catch (error) {
      // Re-throw validation and authorization errors
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }

      // Log unexpected errors
      console.error('[UsersController] Error in markProviderStepComplete:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while marking step as complete. Please try again later.',
      });
    }
  }
}

