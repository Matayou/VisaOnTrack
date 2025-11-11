import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { EmailService } from '../common/services/email.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { RateLimitService } from '../common/services/rate-limit.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaClient>;
  let jwtService: jest.Mocked<JwtService>;
  let emailService: jest.Mocked<EmailService>;
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
    // Create mock PrismaClient
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    // Create mock JwtService
    const mockJwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    // Create mock EmailService
    const mockEmailService = {
      sendPasswordResetEmail: jest.fn(),
    } as unknown as jest.Mocked<EmailService>;

    // Create mock AuditLogService
    const mockAuditLog = {
      logPasswordResetRequest: jest.fn(),
      logPasswordResetComplete: jest.fn(),
      logPasswordResetFailed: jest.fn(),
      logLogin: jest.fn(),
      logRegister: jest.fn(),
    } as unknown as jest.Mocked<AuditLogService>;

    // Create mock RateLimitService
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
    emailService = module.get(EmailService);
    auditLogService = module.get(AuditLogService);
    rateLimitService = module.get(RateLimitService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const testPassword = 'TestPassword123!';
    const testEmail = 'test@example.com';

    beforeEach(() => {
      // Mock bcrypt.compare to return true for valid passwords
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      rateLimitService.isLoginRateLimited.mockReturnValue(false);
      jwtService.sign.mockReturnValue('mock-jwt-token');
    });

    it('should successfully login user with valid credentials', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.login(testEmail, testPassword, false, '127.0.0.1', 'test-agent');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('message', 'Login successful');
      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.role).toBe(mockUser.role);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: testEmail.toLowerCase().trim() },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(testPassword, mockUser.passwordHash);
      expect(auditLogService.logLogin).toHaveBeenCalledWith(
        mockUser.id,
        true,
        testEmail,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should generate JWT token with correct payload', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login(testEmail, testPassword, false);

      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, role: mockUser.role },
        expect.objectContaining({
          secret: expect.any(String),
          expiresIn: expect.any(String),
        }),
      );
    });

    it('should use extended expiration when rememberMe is true', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login(testEmail, testPassword, true);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '7d',
        }),
      );
    });

    it('should use default expiration when rememberMe is false', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login(testEmail, testPassword, false);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '15m',
        }),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.login(testEmail, testPassword)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(testEmail, testPassword)).rejects.toThrow({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });

      expect(auditLogService.logLogin).toHaveBeenCalledWith(null, false, testEmail, undefined, undefined);
    });

    it('should throw UnauthorizedException when user has no passwordHash', async () => {
      const userWithoutPassword = { ...mockUser, passwordHash: null };
      prisma.user.findUnique = jest.fn().mockResolvedValue(userWithoutPassword);

      await expect(service.login(testEmail, testPassword)).rejects.toThrow(UnauthorizedException);
      expect(auditLogService.logLogin).toHaveBeenCalledWith(null, false, testEmail, undefined, undefined);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(testEmail, 'wrong-password')).rejects.toThrow(UnauthorizedException);
      await expect(service.login(testEmail, 'wrong-password')).rejects.toThrow({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });

      expect(auditLogService.logLogin).toHaveBeenCalledWith(mockUser.id, false, testEmail, undefined, undefined);
    });

    it('should check rate limiting before processing', async () => {
      rateLimitService.isLoginRateLimited.mockReturnValue(true);
      rateLimitService.getResetAfterSeconds.mockReturnValue(3600);

      await expect(service.login(testEmail, testPassword)).rejects.toThrow(BadRequestException);
      await expect(service.login(testEmail, testPassword)).rejects.toThrow({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 3600,
      });

      expect(rateLimitService.isLoginRateLimited).toHaveBeenCalledWith('unknown');
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should normalize email to lowercase and trim', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login('  TEST@EXAMPLE.COM  ', testPassword);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should exclude sensitive fields from response', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.login(testEmail, testPassword);

      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('passwordResetTokenHash');
      expect(result.user).not.toHaveProperty('passwordResetTokenExpiry');
    });

    it('should handle optional IP and user agent', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await service.login(testEmail, testPassword);

      expect(auditLogService.logLogin).toHaveBeenCalledWith(
        mockUser.id,
        true,
        testEmail,
        undefined,
        undefined,
      );
    });
  });

  describe('register', () => {
    const testPassword = 'TestPassword123!';
    const testEmail = 'newuser@example.com';
    const testName = 'New User';
    const testPhone = '1234567890';

    beforeEach(() => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(false);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      // Mock bcrypt.hash
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('$2b$10$hashedPassword' as never);
    });

    it('should successfully register new user', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = {
        ...mockUser,
        id: 'new-user-123',
        email: testEmail.toLowerCase(),
        name: testName,
        phone: testPhone,
      };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      const result = await service.register(testEmail, testPassword, testName, testPhone, '127.0.0.1', 'test-agent');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('message', 'Registration successful. Welcome to VisaOnTrack!');
      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result.user.email).toBe(testEmail.toLowerCase());
      expect(result.user.name).toBe(testName);
      expect(result.user.phone).toBe(testPhone);
      expect(result.user.role).toBe(UserRole.SEEKER);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(auditLogService.logRegister).toHaveBeenCalledWith(
        newUser.id,
        testEmail.toLowerCase(),
        UserRole.SEEKER,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should create user with default role SEEKER', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: testEmail.toLowerCase() };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register(testEmail, testPassword);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          role: UserRole.SEEKER,
        }),
      });
    });

    it('should hash password before storing', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: testEmail.toLowerCase() };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register(testEmail, testPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(testPassword, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          passwordHash: '$2b$10$hashedPassword',
        }),
      });
    });

    it('should throw BadRequestException when email already exists', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await expect(service.register(testEmail, testPassword)).rejects.toThrow(BadRequestException);
      await expect(service.register(testEmail, testPassword)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: 'Email already registered',
      });

      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when password is weak', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      // Test various weak passwords
      const weakPasswords = [
        'short', // Too short
        'nouppercase123!', // No uppercase
        'NOLOWERCASE123!', // No lowercase
        'NoNumbers!', // No numbers
        'NoSpecial123', // No special characters
      ];

      for (const weakPassword of weakPasswords) {
        await expect(service.register(testEmail, weakPassword)).rejects.toThrow(BadRequestException);
        await expect(service.register(testEmail, weakPassword)).rejects.toThrow({
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('Password must be at least 8 characters'),
        });
      }

      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should check rate limiting before processing', async () => {
      rateLimitService.isRegisterRateLimited.mockReturnValue(true);
      rateLimitService.getResetAfterSeconds.mockReturnValue(3600);

      await expect(service.register(testEmail, testPassword)).rejects.toThrow(BadRequestException);
      await expect(service.register(testEmail, testPassword)).rejects.toThrow({
        code: 'THROTTLED',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 3600,
      });

      expect(rateLimitService.isRegisterRateLimited).toHaveBeenCalledWith('unknown');
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should normalize email to lowercase and trim', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: testEmail.toLowerCase() };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register('  TEST@EXAMPLE.COM  ', testPassword);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
        }),
      });
    });

    it('should handle optional name and phone', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: testEmail.toLowerCase(), name: null, phone: null };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register(testEmail, testPassword);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: null,
          phone: null,
        }),
      });
    });

    it('should set default locale to en', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: testEmail.toLowerCase(), locale: 'en' };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register(testEmail, testPassword);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          locale: 'en',
        }),
      });
    });

    it('should exclude sensitive fields from response', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: testEmail.toLowerCase() };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      const result = await service.register(testEmail, testPassword);

      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('passwordResetTokenHash');
      expect(result.user).not.toHaveProperty('passwordResetTokenExpiry');
    });

    it('should generate JWT token with default expiration (not rememberMe)', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: testEmail.toLowerCase() };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register(testEmail, testPassword);

      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: newUser.id, role: UserRole.SEEKER },
        expect.objectContaining({
          expiresIn: '15m',
        }),
      );
    });

    it('should handle optional IP and user agent', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-123', email: testEmail.toLowerCase() };
      prisma.user.create = jest.fn().mockResolvedValue(newUser);

      await service.register(testEmail, testPassword);

      expect(auditLogService.logRegister).toHaveBeenCalledWith(
        newUser.id,
        testEmail.toLowerCase(),
        UserRole.SEEKER,
        undefined,
        undefined,
      );
    });
  });
});
