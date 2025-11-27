import { Controller, Post, Get, Query, Body, HttpCode, HttpStatus, Req, Res, BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ForgotPasswordResponseDto } from './dto/forgot-password.dto';
import { ResetPasswordDto, ResetPasswordResponseDto } from './dto/reset-password.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { VerifyEmailResponseDto, ResendVerificationResponseDto } from './dto/verify-email.dto';
import { LogoutResponseDto } from './dto/logout.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { COOKIE_NAME, COOKIE_OPTIONS } from './jwt.config';
import { RateLimitService } from '../common/services/rate-limit.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  /**
   * POST /auth/forgot-password
   * Request password reset email
   * CRITICAL: Always returns success (200 OK) to prevent user enumeration
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() req: Request,
  ): Promise<ForgotPasswordResponseDto> {
    // Extract IP and User-Agent for audit logging
    const ip = req.ip || req.headers['x-forwarded-for'] as string || undefined;
    const ua = req.headers['user-agent'] || undefined;

    try {
      await this.authService.forgotPassword(dto.email, ip, ua);
      
      // Always return success (no user enumeration)
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    } catch (error) {
      // Re-throw rate limit errors
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // For any other errors, still return success (no user enumeration)
      // Log error but don't reveal to caller
      console.error('[AuthController] Error in forgotPassword:', error);
      
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }
  }

  /**
   * POST /auth/reset-password
   * Reset password with token
   * CRITICAL: Hash provided token and compare with stored hash
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() req: Request,
  ): Promise<ResetPasswordResponseDto> {
    // Extract IP and User-Agent for audit logging
    const ip = req.ip || req.headers['x-forwarded-for'] as string || undefined;
    const ua = req.headers['user-agent'] || undefined;

    try {
      await this.authService.resetPassword(dto.token, dto.newPassword, ip, ua);
      
      return {
        message: 'Password reset successful. You can now login with your new password.',
      };
    } catch (error) {
      // Re-throw validation and authorization errors
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Log unexpected errors
      console.error('[AuthController] Error in resetPassword:', error);
      
      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while resetting your password. Please try again later.',
      });
    }
  }

  /**
   * POST /auth/login
   * Login user with email/password
   * Returns JWT token in HttpOnly cookie
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    // Extract IP and User-Agent for audit logging
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    try {
      const result = await this.authService.login(
        dto.email,
        dto.password,
        dto.rememberMe || false,
        ip,
        ua,
      );

      // Set JWT token in HttpOnly cookie
      const maxAge = dto.rememberMe
        ? 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        : 15 * 60 * 1000; // 15 minutes in milliseconds

      res.cookie(COOKIE_NAME, result.token, {
        ...COOKIE_OPTIONS,
        maxAge,
      });

      // Return response without token (token is in cookie)
      const { token, ...response } = result;
      return response;
    } catch (error) {
      // Re-throw validation and authorization errors
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }

      // Log unexpected errors
      console.error('[AuthController] Error in login:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while logging in. Please try again later.',
      });
    }
  }

  /**
   * POST /auth/register
   * Register new user account
   * Returns JWT token in HttpOnly cookie
   */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() dto: RegisterRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    // Extract IP and User-Agent for audit logging
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    try {
      const result = await this.authService.register(
        dto.email,
        dto.password,
        dto.name,
        dto.phone,
        ip,
        ua,
      );

      // Set JWT token in HttpOnly cookie (15 minutes for registration)
      res.cookie(COOKIE_NAME, result.token, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      // Return response without token (token is in cookie)
      const { token, ...response } = result;
      return response;
    } catch (error) {
      // Re-throw validation errors
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Log unexpected errors
      console.error('[AuthController] Error in register:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while registering. Please try again later.',
      });
    }
  }

  /**
   * GET /auth/verify-email?token=xxx
   * Verify email with token from email link
   * RFC-003: Email verification flow
   */
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Query('token') token: string,
    @Req() req: Request,
  ): Promise<VerifyEmailResponseDto> {
    // Extract IP and User-Agent for audit logging
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    if (!token) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Verification token is required',
      });
    }

    // Debug logging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AuthController] verifyEmail: Received token: ${token.substring(0, 8)}... (length: ${token.length})`);
    }

    try {
      await this.authService.verifyEmail(token, ip, ua);
      
      return {
        message: 'Email verified successfully. You can now login.',
        verified: true,
      };
    } catch (error) {
      // Re-throw validation and authorization errors
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Log unexpected errors with full details for debugging
      console.error('[AuthController] Error in verifyEmail:', error);
      console.error('[AuthController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('[AuthController] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      
      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while verifying your email. Please try again later.',
      });
    }
  }

  /**
   * POST /auth/resend-verification
   * Resend verification email
   * RFC-003: Email verification flow
   * Requires authentication (JWT token)
   */
  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Req() req: Request,
  ): Promise<ResendVerificationResponseDto> {
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
      const verifyUrl = await this.authService.resendVerificationEmail(userId, ip, ua);
      
      const response: ResendVerificationResponseDto = {
        message: 'Verification email sent. Please check your email.',
      };
      
      // Dev-only: Include verification link in response for local development
      if (process.env.NODE_ENV !== 'production' && verifyUrl) {
        response.verificationLink = verifyUrl;
      }
      
      return response;
    } catch (error) {
      // Re-throw validation and authorization errors
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Log unexpected errors
      console.error('[AuthController] Error in resendVerification:', error);
      
      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while sending the verification email. Please try again later.',
      });
    }
  }

  /**
   * POST /auth/logout
   * Logout user
   * Clears JWT cookie and logs logout event
   * Requires authentication (JWT token)
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
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
      // Log logout event
      await this.authService.logout(userId, ip, ua);

      // Clear JWT cookie by setting it to expire immediately
      res.cookie(COOKIE_NAME, '', {
        ...COOKIE_OPTIONS,
        maxAge: 0, // Expire immediately
      });

      return {
        message: 'Logged out successfully',
      };
    } catch (error) {
      // Log unexpected errors
      console.error('[AuthController] Error in logout:', error);

      // Still clear the cookie even if audit logging fails
      res.cookie(COOKIE_NAME, '', {
        ...COOKIE_OPTIONS,
        maxAge: 0,
      });

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while logging out. Please try again.',
      });
    }
  }

  /**
   * POST /auth/dev/clear-rate-limits
   * Clear all rate limits (development only)
   * This endpoint is only available in development mode
   */
  @Post('dev/clear-rate-limits')
  @HttpCode(HttpStatus.OK)
  clearRateLimits(@Req() req: Request): { message: string } {
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'This endpoint is not available in production',
      });
    }

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    this.rateLimitService.clearRegisterRateLimit(ip);
    
    return {
      message: 'Registration rate limits cleared. You can now register again.',
    };
  }

  /**
   * POST /auth/dev/clear-login-rate-limits
   * Clear login rate limits (development only)
   * This endpoint is only available in development mode
   */
  @Post('dev/clear-login-rate-limits')
  @HttpCode(HttpStatus.OK)
  clearLoginRateLimits(@Req() req: Request): { message: string } {
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'This endpoint is not available in production',
      });
    }

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    this.rateLimitService.clearLoginRateLimit(ip);
    
    return {
      message: 'Login rate limits cleared. You can now try signing in again.',
    };
  }
}
