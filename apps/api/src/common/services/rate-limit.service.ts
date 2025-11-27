import { Injectable } from '@nestjs/common';

/**
 * Rate limiting service for password reset endpoints
 * Uses in-memory cache (should be replaced with Redis for production)
 */
@Injectable()
export class RateLimitService {
  private readonly forgotPasswordLimits = new Map<string, { count: number; resetAt: number }>();
  private readonly resetPasswordLimits = new Map<string, { count: number; resetAt: number }>();
  private readonly loginLimits = new Map<string, { count: number; resetAt: number }>();
  private readonly registerLimits = new Map<string, { count: number; resetAt: number }>();
  private readonly resendVerificationLimits = new Map<string, { count: number; resetAt: number }>();
  
  private readonly FORGOT_PASSWORD_LIMIT = 3; // 3 requests per hour
  private readonly RESET_PASSWORD_LIMIT = 5; // 5 attempts per hour
  private readonly LOGIN_LIMIT = 5; // 5 attempts per hour per IP
  // Increase register limit in development for testing
  private readonly REGISTER_LIMIT = process.env.NODE_ENV === 'production' ? 3 : 20; // 3 in prod, 20 in dev
  private readonly RESEND_VERIFICATION_LIMIT = 3; // 3 requests per hour (RFC-003)
  private readonly WINDOW_MS = 3600000; // 1 hour in milliseconds

  /**
   * Check if forgot password request is rate limited
   * @param email User email address
   * @returns true if rate limited, false otherwise
   */
  isForgotPasswordRateLimited(email: string): boolean {
    const key = `forgot:${email}`;
    const now = Date.now();
    const limit = this.forgotPasswordLimits.get(key);

    if (!limit || now > limit.resetAt) {
      // No limit or window expired, reset
      this.forgotPasswordLimits.set(key, { count: 1, resetAt: now + this.WINDOW_MS });
      return false;
    }

    if (limit.count >= this.FORGOT_PASSWORD_LIMIT) {
      return true;
    }

    limit.count++;
    return false;
  }

  /**
   * Check if reset password request is rate limited
   * SECURITY: Use IP+email instead of token to prevent bypass attacks
   * @param ip IP address
   * @param email User email address (optional, falls back to IP-only if not available)
   * @returns true if rate limited, false otherwise
   */
  isResetPasswordRateLimited(ip: string, email?: string): boolean {
    // Use IP+email if available, otherwise IP-only (prevents token-based bypass)
    const key = email ? `reset:${ip}:${email}` : `reset:${ip}`;
    const now = Date.now();
    const limit = this.resetPasswordLimits.get(key);

    if (!limit || now > limit.resetAt) {
      // No limit or window expired, reset
      this.resetPasswordLimits.set(key, { count: 1, resetAt: now + this.WINDOW_MS });
      return false;
    }

    if (limit.count >= this.RESET_PASSWORD_LIMIT) {
      return true;
    }

    limit.count++;
    return false;
  }

  /**
   * Check if login request is rate limited
   * @param ip IP address or identifier
   * @returns true if rate limited, false otherwise
   */
  isLoginRateLimited(ip: string): boolean {
    const key = `login:${ip}`;
    const now = Date.now();
    const limit = this.loginLimits.get(key);

    if (!limit || now > limit.resetAt) {
      // No limit or window expired, reset
      this.loginLimits.set(key, { count: 1, resetAt: now + this.WINDOW_MS });
      return false;
    }

    if (limit.count >= this.LOGIN_LIMIT) {
      return true;
    }

    limit.count++;
    return false;
  }

  /**
   * Check if register request is rate limited
   * @param ip IP address or identifier
   * @returns true if rate limited, false otherwise
   */
  isRegisterRateLimited(ip: string): boolean {
    const key = `register:${ip}`;
    const now = Date.now();
    const limit = this.registerLimits.get(key);

    if (!limit || now > limit.resetAt) {
      // No limit or window expired, reset
      this.registerLimits.set(key, { count: 1, resetAt: now + this.WINDOW_MS });
      return false;
    }

    if (limit.count >= this.REGISTER_LIMIT) {
      return true;
    }

    limit.count++;
    return false;
  }

  /**
   * Check if resend verification request is rate limited
   * RFC-003: Email verification flow
   * @param userId User ID
   * @returns true if rate limited, false otherwise
   */
  isResendVerificationRateLimited(userId: string): boolean {
    const key = `resend-verification:${userId}`;
    const now = Date.now();
    const limit = this.resendVerificationLimits.get(key);

    if (!limit || now > limit.resetAt) {
      // No limit or window expired, reset
      this.resendVerificationLimits.set(key, { count: 1, resetAt: now + this.WINDOW_MS });
      return false;
    }

    if (limit.count >= this.RESEND_VERIFICATION_LIMIT) {
      return true;
    }

    limit.count++;
    return false;
  }

  /**
   * Get remaining time until rate limit reset (in seconds)
   */
  getResetAfterSeconds(identifier: string, isResetPassword = false, isLogin = false, isRegister = false, isResendVerification = false, email?: string): number {
    let key: string;
    let limits: Map<string, { count: number; resetAt: number }>;

    if (isLogin) {
      key = `login:${identifier}`;
      limits = this.loginLimits;
    } else if (isRegister) {
      key = `register:${identifier}`;
      limits = this.registerLimits;
    } else if (isResetPassword) {
      // SECURITY: Use IP+email for reset password rate limiting
      key = email ? `reset:${identifier}:${email}` : `reset:${identifier}`;
      limits = this.resetPasswordLimits;
    } else if (isResendVerification) {
      // RFC-003: Resend verification rate limiting
      key = `resend-verification:${identifier}`;
      limits = this.resendVerificationLimits;
    } else {
      key = `forgot:${identifier}`;
      limits = this.forgotPasswordLimits;
    }

    const limit = limits.get(key);

    if (!limit) {
      return 0;
    }

    const remaining = limit.resetAt - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }

  /**
   * Clear expired rate limit entries (cleanup)
   */
  clearExpiredEntries(): void {
    const now = Date.now();
    
    for (const [key, limit] of this.forgotPasswordLimits.entries()) {
      if (now > limit.resetAt) {
        this.forgotPasswordLimits.delete(key);
      }
    }

    for (const [key, limit] of this.resetPasswordLimits.entries()) {
      if (now > limit.resetAt) {
        this.resetPasswordLimits.delete(key);
      }
    }

    for (const [key, limit] of this.loginLimits.entries()) {
      if (now > limit.resetAt) {
        this.loginLimits.delete(key);
      }
    }

    for (const [key, limit] of this.registerLimits.entries()) {
      if (now > limit.resetAt) {
        this.registerLimits.delete(key);
      }
    }

    for (const [key, limit] of this.resendVerificationLimits.entries()) {
      if (now > limit.resetAt) {
        this.resendVerificationLimits.delete(key);
      }
    }
  }

  /**
   * Clear all rate limits (development only)
   * Useful for testing and development
   */
  clearAllRateLimits(): void {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[RateLimitService] clearAllRateLimits called in production - ignoring');
      return;
    }
    
    this.forgotPasswordLimits.clear();
    this.resetPasswordLimits.clear();
    this.loginLimits.clear();
    this.registerLimits.clear();
    this.resendVerificationLimits.clear();
    
    console.log('[RateLimitService] All rate limits cleared (development mode)');
  }

  /**
   * Clear registration rate limits for a specific IP or all (development only)
   */
  clearRegisterRateLimit(ip?: string): void {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[RateLimitService] clearRegisterRateLimit called in production - ignoring');
      return;
    }
    
    if (ip) {
      const key = `register:${ip}`;
      this.registerLimits.delete(key);
      console.log(`[RateLimitService] Cleared registration rate limit for IP: ${ip}`);
    } else {
      this.registerLimits.clear();
      console.log('[RateLimitService] Cleared all registration rate limits');
    }
  }

  /**
   * Clear login rate limits for a specific IP or all (development only)
   */
  clearLoginRateLimit(ip?: string): void {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[RateLimitService] clearLoginRateLimit called in production - ignoring');
      return;
    }

    if (ip) {
      const key = `login:${ip}`;
      this.loginLimits.delete(key);
      console.log(`[RateLimitService] Cleared login rate limit for IP: ${ip}`);
    } else {
      this.loginLimits.clear();
      console.log('[RateLimitService] Cleared all login rate limits');
    }
  }
}
