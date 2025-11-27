import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../common/services/email.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { RateLimitService } from '../common/services/rate-limit.service';
import { LoginRequestDto, LoginResponseDto, LoginResponseWithToken } from './dto/login.dto';
import { RegisterRequestDto, RegisterResponseDto, RegisterResponseWithToken } from './dto/register.dto';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REMEMBER_ME_EXPIRES_IN } from './jwt.config';

@Injectable()
export class AuthService {
  private readonly TOKEN_EXPIRY_MS = 3600000; // 1 hour in milliseconds (password reset)
  private readonly EMAIL_VERIFICATION_TOKEN_EXPIRY_MS = 86400000; // 24 hours in milliseconds (RFC-003)

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private auditLogService: AuditLogService,
    private rateLimitService: RateLimitService,
  ) {}

  /**
   * Generate cryptographically secure reset token
   * @returns Plaintext token (will be hashed before storing)
   */
  private generateResetToken(): string {
    // Use crypto.randomBytes for cryptographically secure tokens
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash reset token before storing in database
   * CRITICAL: Never store plaintext tokens - always hash before storing
   * @param token Plaintext token
   * @returns Hashed token (bcrypt)
   */
  private async hashResetToken(token: string): Promise<string> {
    // Use bcrypt with salt rounds 10 (same as password hashing)
    return bcrypt.hash(token, 10);
  }

  /**
   * Generate SHA-256 hash of reset token for O(1) database lookup
   * PERFORMANCE: Store deterministic SHA-256 hash alongside bcrypt hash
   * to enable WHERE passwordResetTokenHashSha256 = sha256(token) queries
   * instead of O(n) bcrypt comparisons
   * @param token Plaintext token
   * @returns SHA-256 hash (hex string)
   */
  private hashResetTokenSha256(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate cryptographically secure email verification token
   * RFC-003: Email verification flow
   * @returns Plaintext token (will be hashed before storing)
   */
  private generateEmailVerificationToken(): string {
    // Use crypto.randomBytes for cryptographically secure tokens
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash email verification token before storing in database
   * RFC-003: Security requirement - never store plaintext tokens
   * @param token Plaintext token
   * @returns Hashed token (bcrypt)
   */
  private async hashEmailVerificationToken(token: string): Promise<string> {
    // Use bcrypt with salt rounds 10 (same as password hashing)
    return bcrypt.hash(token, 10);
  }

  /**
   * Compare provided email verification token with stored hash
   * RFC-003: Always compare hashed tokens, never plaintext
   * @param providedToken Plaintext token from request
   * @param storedHash Hashed token from database
   * @returns true if tokens match, false otherwise
   */
  private async compareEmailVerificationToken(providedToken: string, storedHash: string | null): Promise<boolean> {
    if (!storedHash) {
      return false;
    }
    return bcrypt.compare(providedToken, storedHash);
  }

  /**
   * Compare provided token with stored hash
   * CRITICAL: Always compare hashed tokens, never plaintext
   * @param providedToken Plaintext token from request
   * @param storedHash Hashed token from database
   * @returns true if tokens match, false otherwise
   */
  private async compareResetToken(providedToken: string, storedHash: string | null): Promise<boolean> {
    if (!storedHash) {
      return false;
    }
    return bcrypt.compare(providedToken, storedHash);
  }

  /**
   * Validate password strength (per OpenAPI spec requirements)
   * Minimum 8 characters, uppercase, lowercase, number, special character
   */
  private validatePasswordStrength(password: string): boolean {
    if (password.length < 8) {
      return false;
    }
    // At least one uppercase letter
    const hasUpperCase = /[A-Z]/.test(password);
    // At least one lowercase letter
    const hasLowerCase = /[a-z]/.test(password);
    // At least one number
    const hasNumber = /[0-9]/.test(password);
    // At least one special character (!@#$%^&*)
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Request password reset - send reset email
   * CRITICAL SECURITY: Always returns success (no user enumeration)
   * @param email User email address
   * @param ip Optional IP address for audit logging
   * @param ua Optional user agent for audit logging
   */
  async forgotPassword(email: string, ip?: string, ua?: string): Promise<void> {
    // Rate limiting: 3 requests/hour per email
    if (this.rateLimitService.isForgotPasswordRateLimited(email)) {
      const resetAfter = this.rateLimitService.getResetAfterSeconds(email, false, false, false);
      throw new BadRequestException({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: resetAfter,
      });
    }

    // Find user by email (don't reveal if user exists)
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // CRITICAL: Always return success (no user enumeration)
    // If user exists, send email. If not, still return success.
    if (user) {
      // Generate secure token
      const token = this.generateResetToken();

      // CRITICAL: Hash token before storing (never store plaintext)
      const tokenHash = await this.hashResetToken(token);
      const tokenHashSha256 = this.hashResetTokenSha256(token);

      // Store hashed token and expiry
      // PERFORMANCE: Store SHA-256 hash for O(1) lookup, bcrypt hash for verification
      const expiry = new Date(Date.now() + this.TOKEN_EXPIRY_MS);
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetTokenHash: tokenHash, // Bcrypt hash for secure comparison
          passwordResetTokenHashSha256: tokenHashSha256, // SHA-256 hash for O(1) lookup
          passwordResetTokenExpiry: expiry,
        },
      });

      // Send email with plaintext token (NOT stored in DB)
      const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
      await this.emailService.sendPasswordResetEmail(email, token, resetUrl);

      // Audit logging: Log password reset request
      await this.auditLogService.logPasswordResetRequest(user.id, email, ip, ua);
    }

    // Always return success (no user enumeration)
    // User will receive email if account exists, but API always returns 200 OK
  }

  /**
   * Reset password with token
   * CRITICAL SECURITY: Hash provided token and compare with stored hash
   * @param token Plaintext reset token from email
   * @param newPassword New password
   * @param ip Optional IP address for audit logging
   * @param ua Optional user agent for audit logging
   */
  async resetPassword(token: string, newPassword: string, ip?: string, ua?: string, email?: string): Promise<void> {
    // Rate limiting: 5 attempts/hour per IP+email (prevents token-based bypass)
    // SECURITY: Use better identifier fallback to avoid 'unknown' bucket collision
    // Pass email if available, otherwise use IP or x-forwarded-for
    const rateLimitIdentifier = email || ip || 'unknown';
    if (this.rateLimitService.isResetPasswordRateLimited(rateLimitIdentifier, email)) {
      const resetAfter = this.rateLimitService.getResetAfterSeconds(rateLimitIdentifier, true, false, false, false, email);
      throw new BadRequestException({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: resetAfter,
      });
    }

    // Validate password strength
    if (!this.validatePasswordStrength(newPassword)) {
      // Audit logging: Log failed reset attempt (weak password)
      await this.auditLogService.logPasswordResetFailed('WEAK_PASSWORD', ip, ua);
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
      });
    }

    // PERFORMANCE: Use SHA-256 hash for O(1) lookup instead of O(n) bcrypt comparison
    // Generate SHA-256 hash of provided token
    const tokenHashSha256 = this.hashResetTokenSha256(token);

    // Find user by SHA-256 hash (O(1) query instead of O(n) iteration)
    const validUser = await this.prisma.user.findFirst({
      where: {
        passwordResetTokenHashSha256: tokenHashSha256,
        passwordResetTokenExpiry: { gte: new Date() }, // Not expired
      },
    });

    // If no user found by SHA-256, token is invalid
    if (!validUser) {
      // Audit logging: Log failed reset attempt (invalid token)
      await this.auditLogService.logPasswordResetFailed('INVALID_TOKEN', ip, ua);
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired reset token',
      });
    }

    // CRITICAL: Verify token with bcrypt hash (SHA-256 is for lookup only, not verification)
    // This ensures security even if SHA-256 collision occurs
    const isValid = await this.compareResetToken(token, validUser.passwordResetTokenHash);
    if (!isValid) {
      // Audit logging: Log failed reset attempt (token mismatch)
      await this.auditLogService.logPasswordResetFailed('TOKEN_MISMATCH', ip, ua);
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired reset token',
      });
    }

    // Note: Expiry check is already done in the query (passwordResetTokenExpiry: { gte: new Date() })
    // But we double-check here for extra safety
    if (!validUser.passwordResetTokenExpiry || validUser.passwordResetTokenExpiry < new Date()) {
      // Audit logging: Log failed reset attempt (expired token)
      await this.auditLogService.logPasswordResetFailed('EXPIRED_TOKEN', ip, ua);
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Reset token has expired. Please request a new password reset.',
      });
    }

    // Hash new password
    const passwordHash = await this.hashPassword(newPassword);

    // Update password and invalidate token (single-use)
    await this.prisma.user.update({
      where: { id: validUser.id },
      data: {
        // Invalidate token (single-use)
        passwordResetTokenHash: null,
        passwordResetTokenHashSha256: null, // Also clear SHA-256 hash
        passwordResetTokenExpiry: null,
        // Update password hash (M1-BE-7: passwordHash field added)
        passwordHash: passwordHash,
      },
    });

    // Audit logging: Log password reset completion
    await this.auditLogService.logPasswordResetComplete(validUser.id, ip, ua);
  }

  /**
   * Generate JWT token for user
   * @param userId User ID
   * @param role User role
   * @param rememberMe Whether to use extended expiration
   * @returns JWT token
   */
  private generateToken(userId: string, role: UserRole, rememberMe = false): string {
    const payload = { userId, role };
    const expiresIn = rememberMe ? JWT_REMEMBER_ME_EXPIRES_IN : JWT_EXPIRES_IN;
    
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn,
    });
  }

  /**
   * Login user with email and password
   * @param email User email
   * @param password User password
   * @param rememberMe Whether to extend token expiration
   * @param ip Optional IP address for audit logging
   * @param ua Optional user agent for audit logging
   * @returns User data and token
   */
  async login(
    email: string,
    password: string,
    rememberMe = false,
    ip?: string,
    ua?: string,
  ): Promise<LoginResponseWithToken> {
    // Rate limiting: 5 attempts/hour per IP or email
    // SECURITY: Use email as identifier if IP is missing to avoid 'unknown' bucket collision
    const rateLimitIdentifier = ip || email || 'unknown';
    if (this.rateLimitService.isLoginRateLimited(rateLimitIdentifier)) {
      const resetAfter = this.rateLimitService.getResetAfterSeconds(rateLimitIdentifier, false, true, false);
      throw new BadRequestException({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: resetAfter,
      });
    }

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always log login attempt (even if user not found, for security)
    if (!user || !user.passwordHash) {
      await this.auditLogService.logLogin(null, false, email, ip, ua);
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    // Compare password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      await this.auditLogService.logLogin(user.id, false, email, ip, ua);
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.role, rememberMe);

    // Log successful login
    await this.auditLogService.logLogin(user.id, true, email, ip, ua);

    // Return user data (exclude sensitive fields)
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || undefined,
        phone: user.phone || undefined,
        locale: user.locale,
        emailVerified: user.emailVerified, // RFC-003: Include email verification status
        createdAt: user.createdAt,
      },
      message: 'Login successful',
      token, // For controller to set cookie
    };
  }

  /**
   * Register new user
   * @param email User email
   * @param password User password
   * @param name Optional user name
   * @param phone Optional user phone
   * @param ip Optional IP address for audit logging
   * @param ua Optional user agent for audit logging
   * @returns User data and token
   */
  async register(
    email: string,
    password: string,
    name?: string,
    phone?: string,
    ip?: string,
    ua?: string,
  ): Promise<RegisterResponseWithToken> {
    // Rate limiting: 3 attempts/hour per IP or email
    // SECURITY: Use email as identifier if IP is missing to avoid 'unknown' bucket collision
    const rateLimitIdentifier = ip || email || 'unknown';
    if (this.rateLimitService.isRegisterRateLimited(rateLimitIdentifier)) {
      const resetAfter = this.rateLimitService.getResetAfterSeconds(rateLimitIdentifier, false, false, true);
      throw new BadRequestException({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: resetAfter,
      });
    }

    // Validate password strength
    if (!this.validatePasswordStrength(password)) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
      });
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // RFC-003: Generate email verification token
    const verificationToken = this.generateEmailVerificationToken();
    const verificationTokenHash = await this.hashEmailVerificationToken(verificationToken);
    const verificationTokenExpiry = new Date(Date.now() + this.EMAIL_VERIFICATION_TOKEN_EXPIRY_MS);

    // Create user with default role SEEKER and emailVerified = false
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: UserRole.SEEKER,
        name: name || null,
        phone: phone || null,
        locale: 'en',
        emailVerified: false, // RFC-003: Email verification required
        emailVerificationToken: verificationTokenHash, // RFC-003: Hashed token
        emailVerificationTokenExpiry: verificationTokenExpiry, // RFC-003: 24 hours expiry
      },
    });

    // RFC-003: Send verification email
    const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
    await this.emailService.sendVerificationEmail(user.email, verificationToken, verifyUrl);

    // Generate JWT token
    const token = this.generateToken(user.id, user.role, false);

    // Log registration
    await this.auditLogService.logRegister(user.id, user.email, user.role, ip, ua);

    // Return user data (exclude sensitive fields)
    const response: RegisterResponseWithToken = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || undefined,
        phone: user.phone || undefined,
        locale: user.locale,
        emailVerified: user.emailVerified, // RFC-003: Include email verification status
        createdAt: user.createdAt,
      },
      message: 'Registration successful. Please check your email to verify your account.',
      token, // For controller to set cookie
    };

    // Dev-only: Include verification link in response for local development
    // This allows developers to test email verification without actual email delivery
    if (process.env.NODE_ENV !== 'production') {
      (response as any).verificationLink = verifyUrl;
    }

    return response;
  }

  /**
   * Verify email with token
   * RFC-003: Email verification flow
   * @param token Plaintext verification token from email
   * @param ip Optional IP address for audit logging
   * @param ua Optional user agent for audit logging
   */
  async verifyEmail(token: string, ip?: string, ua?: string): Promise<void> {
    // Find user by verification token
    // Note: We need to check all users with active tokens and compare hashes
    // This is less efficient but necessary for security (token is hashed)
    const now = new Date();
    const usersWithTokens = await this.prisma.user.findMany({
      where: {
        emailVerificationToken: { not: null },
        emailVerificationTokenExpiry: { gte: now }, // Not expired
      },
    });

    // Debug logging in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[AuthService] verifyEmail: Found ${usersWithTokens.length} users with active verification tokens`);
    }

    let validUser = null;
    for (const user of usersWithTokens) {
      // CRITICAL: Compare provided token with stored hash (not plaintext)
      const isValid = await this.compareEmailVerificationToken(token, user.emailVerificationToken);
      if (isValid) {
        validUser = user;
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[AuthService] verifyEmail: Found matching token for user ${user.email}`);
        }
        break;
      }
    }

    if (!validUser) {
      // Debug logging in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[AuthService] verifyEmail: No matching token found. Searched ${usersWithTokens.length} users with active tokens.`);
        if (usersWithTokens.length === 0) {
          console.log(`[AuthService] verifyEmail: No users found with active verification tokens in database.`);
        } else {
          console.log(`[AuthService] verifyEmail: Token provided doesn't match any of the ${usersWithTokens.length} active tokens.`);
        }
      }
      
      // Audit logging: Log failed verification attempt (invalid token)
      // Non-blocking: Don't fail verification if audit logging fails
      this.auditLogService.logEmailVerificationFailed('INVALID_TOKEN', ip, ua).catch((err) => {
        console.error('[AuthService] Failed to log email verification failure:', err);
      });
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired verification token. Please request a new verification email.',
      });
    }

    // Check if token is expired
    if (!validUser.emailVerificationTokenExpiry || validUser.emailVerificationTokenExpiry < new Date()) {
      // Audit logging: Log failed verification attempt (expired token)
      // Non-blocking: Don't fail verification if audit logging fails
      this.auditLogService.logEmailVerificationFailed('EXPIRED_TOKEN', ip, ua).catch((err) => {
        console.error('[AuthService] Failed to log email verification failure:', err);
      });
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Verification token has expired. Please request a new verification email.',
      });
    }

    // Check if email already verified
    if (validUser.emailVerified) {
      // Audit logging: Log verification attempt (already verified)
      // Non-blocking: Don't fail verification if audit logging fails
      this.auditLogService.logEmailVerificationFailed('ALREADY_VERIFIED', ip, ua).catch((err) => {
        console.error('[AuthService] Failed to log email verification failure:', err);
      });
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Email is already verified',
      });
    }

    // Update user: set emailVerified = true and invalidate token (single-use)
    await this.prisma.user.update({
      where: { id: validUser.id },
      data: {
        emailVerified: true, // RFC-003: Mark email as verified
        emailVerificationToken: null, // Invalidate token (single-use)
        emailVerificationTokenExpiry: null,
      },
    });

    // Audit logging: Log email verification completion
    // Non-blocking: Don't fail verification if audit logging fails
    this.auditLogService.logEmailVerified(validUser.id, validUser.email, ip, ua).catch((err) => {
      console.error('[AuthService] Failed to log email verification:', err);
    });
  }

  /**
   * Logout user
   * Logs logout event for audit purposes
   * @param userId User ID from JWT token
   * @param ip Optional IP address for audit logging
   * @param ua Optional user agent for audit logging
   */
  async logout(userId: string, ip?: string, ua?: string): Promise<void> {
    // Audit logging: Log logout event
    await this.auditLogService.logLogout(userId, ip, ua);
  }

  /**
   * Resend verification email
   * RFC-003: Email verification flow
   * @param userId User ID from JWT token
   * @param ip Optional IP address for audit logging
   * @param ua Optional user agent for audit logging
   * @returns Verification URL (for dev mode)
   */
  async resendVerificationEmail(userId: string, ip?: string, ua?: string): Promise<string> {
    // Rate limiting: 3 requests/hour per user
    if (this.rateLimitService.isResendVerificationRateLimited(userId)) {
      const resetAfter = this.rateLimitService.getResetAfterSeconds(userId, false, false, false, true);
      throw new BadRequestException({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: resetAfter,
      });
    }

    // Find user by ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }

    // Check if email already verified
    if (user.emailVerified) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Email is already verified',
      });
    }

    // Generate new verification token
    const verificationToken = this.generateEmailVerificationToken();
    const verificationTokenHash = await this.hashEmailVerificationToken(verificationToken);
    const verificationTokenExpiry = new Date(Date.now() + this.EMAIL_VERIFICATION_TOKEN_EXPIRY_MS);

    // Update user with new token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationTokenHash, // RFC-003: Hashed token
        emailVerificationTokenExpiry: verificationTokenExpiry, // RFC-003: 24 hours expiry
      },
    });

    // RFC-003: Send verification email
    const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
    await this.emailService.sendVerificationEmail(user.email, verificationToken, verifyUrl);

    // Audit logging: Log verification email resend
    await this.auditLogService.logVerificationEmailResent(user.id, user.email, ip, ua);
    
    // Return verification URL for dev mode (will be added to response in controller)
    return verifyUrl;
  }

  /**
   * Cleanup expired password reset tokens (data retention policy)
   * Run daily via cron job for PDPA/GDPR compliance
   */
  async cleanupExpiredTokens(): Promise<number> {
    const expiredCutoff = new Date(Date.now() - 86400000); // 24 hours ago
    
    const result = await this.prisma.user.updateMany({
      where: {
        passwordResetTokenExpiry: {
          lt: expiredCutoff,
        },
      },
      data: {
        passwordResetTokenHash: null,
        passwordResetTokenExpiry: null,
      },
    });

    return result.count;
  }
}

