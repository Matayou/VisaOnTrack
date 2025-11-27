import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_SECRET, COOKIE_NAME } from '../jwt.config';

/**
 * JWT Authentication Guard
 * 
 * Extracts JWT token from HttpOnly cookie, validates it, and attaches userId to request.
 * Protects endpoints that require authentication (cookieAuth security scheme).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      // SECURITY: No debug logging to prevent PII leakage (cookie names, user IDs)
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    try {
      // Verify token signature and expiration
      const payload = this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });

      // SECURITY: No debug logging to prevent PII leakage (user IDs)
      // Attach userId and role to request object
      request.user = {
        userId: payload.userId,
        role: payload.role,
      };

      return true;
    } catch (error) {
      // SECURITY: No debug logging to prevent PII leakage (error details may contain sensitive info)
      // Token is invalid or expired
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      });
    }
  }

  /**
   * Extract JWT token from HttpOnly cookie
   * @param request Express request object
   * @returns Token string or null if not found
   */
  private extractTokenFromCookie(request: Request): string | null {
    // Cookie name is 'token' (from jwt.config.ts)
    const token = request.cookies?.[COOKIE_NAME];
    return token || null;
  }
}

