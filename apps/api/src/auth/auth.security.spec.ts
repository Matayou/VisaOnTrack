import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { EmailService } from '../common/services/email.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { RateLimitService } from '../common/services/rate-limit.service';

/**
 * Security tests for AuthService
 * 
 * Tests:
 * - Password security (hashing, strength validation)
 * - Rate limiting security
 * - JWT token security
 * - Input validation security
 * - Sensitive data security
 */

describe('AuthService (Security)', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaClient>;
  let jwtService: jest.Mocked<JwtService>;
  let auditLogService: jest.Mocked<AuditLogService>;
  let rateLimitService: jest.Mocked<RateLimitService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: UserRole.SEEKER,
    name: 'Test User',
    phone: '1234567890',
    locale: 'en',
    passwordHash: '$2b$10$hashedPassword',
    passwordResetTokenHash: null,
    passwordResetTokenExpiry: null,
    createdAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    const mockJwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const mockEmailService = {
      sendPasswordResetEmail: jest.fn(),
    } as unknown as jest.Mocked<EmailService>;

    const mockAuditLog = {
      logPasswordResetRequest: jest.fn(),
      logPasswordResetComplete: jest.fn(),
      logPasswordResetFailed: jest.fn(),
      logLogin: jest.fn(),
      logRegister: jest.fn(),
    } as unknown as jest.Mocked<AuditLogService>;

    const mockRateLimit = {
      isForgotPasswordRateLimited: jest.fn(),
      isResetPasswordRateLimited: jest.fn(),
      isLoginRateLimited: jest.fn(),
      isRegisterRateLimited: jest.fn(),
      getResetAfterSeconds: jest.fn(),
      clearExpiredEntries: jest.fn(),
    } as unknown as jest.Mocked<RateLimitService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: AuditLogService,
          useValue: mockAuditLog,
        },
        {
          provide: RateLimitService,
          useValue: mockRateLimit,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaClient);
    jwtService = module.get(JwtService);
    auditLogService = module.get(AuditLogService);
    rateLimitService = module.get(RateLimitService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Password Security', () => {
    it('should hash passwords before storing (never store plaintext)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$hashedPassword' as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123' };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register('test@example.com', 'TestPassword123!');

      expect(bcrypt.hash).toHaveBeenCalledWith('TestPassword123!', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          passwordHash: '$2b$10$hashedPassword',
        }),
      });
      // Verify password is NOT stored as plaintext
      expect(prisma.user.create).not.toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            passwordHash: 'TestPassword123!',
          }),
        }),
      );
    });

    it('should compare passwords using bcrypt (timing-safe comparison)', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login('test@example.com', 'TestPassword123!');

      expect(bcrypt.compare).toHaveBeenCalledWith('TestPassword123!', mockUser.passwordHash);
    });

    it('should reject weak passwords (too short)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.register('test@example.com', 'short')).rejects.toThrow(BadRequestException);
      await expect(service.register('test@example.com', 'short')).rejects.toThrow({
        code: 'VALIDATION_ERROR',
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject weak passwords (no uppercase)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.register('test@example.com', 'nouppercase123!')).rejects.toThrow(BadRequestException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject weak passwords (no lowercase)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.register('test@example.com', 'NOLOWERCASE123!')).rejects.toThrow(BadRequestException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject weak passwords (no numbers)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.register('test@example.com', 'NoNumbers!')).rejects.toThrow(BadRequestException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject weak passwords (no special characters)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.register('test@example.com', 'NoSpecial123')).rejects.toThrow(BadRequestException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should accept strong passwords (meets all requirements)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$hashedPassword' as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123' };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register('test@example.com', 'TestPassword123!');

      expect(prisma.user.create).toHaveBeenCalled();
    });
  });

  describe('Rate Limiting Security', () => {
    it('should enforce login rate limiting (5 attempts/hour)', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(true);
      rateLimitService.getResetAfterSeconds.mockReturnValue(3600);

      await expect(service.login('test@example.com', 'password')).rejects.toThrow(BadRequestException);
      await expect(service.login('test@example.com', 'password')).rejects.toThrow({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 3600,
      });

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should enforce register rate limiting (3 attempts/hour)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(true);
      rateLimitService.getResetAfterSeconds.mockReturnValue(3600);

      await expect(service.register('test@example.com', 'TestPassword123!')).rejects.toThrow(BadRequestException);
      await expect(service.register('test@example.com', 'TestPassword123!')).rejects.toThrow({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 3600,
      });

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('JWT Token Security', () => {
    it('should generate JWT tokens with correct payload structure', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login('test@example.com', 'TestPassword123!');

      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, role: mockUser.role },
        expect.objectContaining({
          secret: expect.any(String),
          expiresIn: expect.any(String),
        }),
      );
    });

    it('should use extended expiration when rememberMe is true', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login('test@example.com', 'TestPassword123!', true);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '7d',
        }),
      );
    });

    it('should use default expiration when rememberMe is false', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login('test@example.com', 'TestPassword123!', false);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '15m',
        }),
      );
    });
  });

  describe('Input Validation Security', () => {
    it('should normalize email to lowercase and trim (prevent case-based attacks)', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$hashedPassword' as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: 'test@example.com' };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register('  TEST@EXAMPLE.COM  ', 'TestPassword123!');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
        }),
      });
    });

    it('should prevent duplicate email registration', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await expect(service.register('test@example.com', 'TestPassword123!')).rejects.toThrow(BadRequestException);
      await expect(service.register('test@example.com', 'TestPassword123!')).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: 'Email already registered',
      });

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('Sensitive Data Security', () => {
    it('should never expose passwordHash in response', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.login('test@example.com', 'TestPassword123!');

      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('passwordResetTokenHash');
      expect(result.user).not.toHaveProperty('passwordResetTokenExpiry');
    });

    it('should never expose passwordHash in register response', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$hashedPassword' as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123' };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      const result = await service.register('test@example.com', 'TestPassword123!');

      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('passwordResetTokenHash');
      expect(result.user).not.toHaveProperty('passwordResetTokenExpiry');
    });
  });

  describe('Authentication Security', () => {
    it('should not reveal whether user exists on failed login (generic error)', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.login('nonexistent@example.com', 'password')).rejects.toThrow(UnauthorizedException);
      await expect(service.login('nonexistent@example.com', 'password')).rejects.toThrow({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password', // Generic message, not "user not found"
      });

      expect(auditLogService.logLogin).toHaveBeenCalledWith(null, false, 'nonexistent@example.com', undefined, undefined);
    });

    it('should not reveal whether password is wrong vs user not found (generic error)', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await expect(service.login('test@example.com', 'wrong-password')).rejects.toThrow(UnauthorizedException);
      await expect(service.login('test@example.com', 'wrong-password')).rejects.toThrow({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password', // Generic message, not "wrong password"
      });
    });
  });

  describe('Audit Logging Security', () => {
    it('should log all login attempts (successful and failed)', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login('test@example.com', 'TestPassword123!', false, '127.0.0.1', 'test-agent');

      expect(auditLogService.logLogin).toHaveBeenCalledWith(
        mockUser.id,
        true,
        'test@example.com',
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should log failed login attempts', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      try {
        await service.login('test@example.com', 'wrong-password');
      } catch (error) {
        // Expected to fail
      }

      expect(auditLogService.logLogin).toHaveBeenCalledWith(
        mockUser.id,
        false,
        'test@example.com',
        undefined,
        undefined,
      );
    });

    it('should log all registrations', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$hashedPassword' as never);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123' };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register('test@example.com', 'TestPassword123!', undefined, undefined, '127.0.0.1', 'test-agent');

      expect(auditLogService.logRegister).toHaveBeenCalledWith(
        newUser.id,
        'test@example.com',
        UserRole.SEEKER,
        '127.0.0.1',
        'test-agent',
      );
    });
  });
});

