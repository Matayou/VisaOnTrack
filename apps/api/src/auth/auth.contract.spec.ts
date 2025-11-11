import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';

/**
 * Contract tests for AuthController
 * 
 * Tests:
 * - OpenAPI contract compliance
 * - Status code compliance
 * - Request/Response schema compliance
 */

describe('AuthController (Contract Tests)', () => {
  let app: INestApplication;
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockLoginResponse = {
    user: {
      id: 'user-123',
      email: 'test@example.com',
      role: UserRole.SEEKER,
      name: 'Test User',
      phone: '1234567890',
      locale: 'en',
      createdAt: new Date('2025-01-01'),
    },
    message: 'Login successful',
    token: 'mock-jwt-token',
  };

  const mockRegisterResponse = {
    user: {
      id: 'new-user-123',
      email: 'newuser@example.com',
      role: UserRole.SEEKER,
      name: 'New User',
      phone: '1234567890',
      locale: 'en',
      createdAt: new Date('2025-01-01'),
    },
    message: 'Registration successful. Welcome to VisaOnTrack!',
    token: 'mock-jwt-token',
  };

  beforeEach(async () => {
    const mockService = {
      login: jest.fn(),
      register: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockService)
      .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /auth/login - OpenAPI Contract Compliance', () => {
    it('should match OpenAPI v0.2.2 response schema', async () => {
      service.login = jest.fn().mockResolvedValue(mockLoginResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const result = await controller.login(
        {
          email: 'test@example.com',
          password: 'TestPassword123!',
          rememberMe: false,
        },
        mockRequest,
        mockResponse,
      );

      // Verify response matches LoginResponse schema from OpenAPI spec
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('message');
      expect(result).not.toHaveProperty('token'); // Token should be in cookie, not response

      // Verify user object matches User schema
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('role');
      expect(result.user).toHaveProperty('locale');
      expect(result.user).toHaveProperty('createdAt');

      // Verify required fields
      expect(typeof result.user.id).toBe('string');
      expect(typeof result.user.email).toBe('string');
      expect(Object.values(UserRole)).toContain(result.user.role);
      expect(typeof result.user.locale).toBe('string');
      expect(result.user.createdAt).toBeInstanceOf(Date);
      expect(typeof result.message).toBe('string');

      // Verify optional fields
      if (result.user.name !== undefined) {
        expect(typeof result.user.name).toBe('string');
      }
      if (result.user.phone !== undefined) {
        expect(typeof result.user.phone).toBe('string');
      }
    });

    it('should accept rememberMe field in request', async () => {
      service.login = jest.fn().mockResolvedValue(mockLoginResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await controller.login(
        {
          email: 'test@example.com',
          password: 'TestPassword123!',
          rememberMe: true,
        },
        mockRequest,
        mockResponse,
      );

      expect(service.login).toHaveBeenCalledWith(
        'test@example.com',
        'TestPassword123!',
        true,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should set cookie with correct name and options', async () => {
      service.login = jest.fn().mockResolvedValue(mockLoginResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await controller.login(
        {
          email: 'test@example.com',
          password: 'TestPassword123!',
          rememberMe: false,
        },
        mockRequest,
        mockResponse,
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        'mock-jwt-token',
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'strict',
          path: '/',
          maxAge: 15 * 60 * 1000, // 15 minutes
        }),
      );
    });

    it('should return 200 OK for successful login', async () => {
      service.login = jest.fn().mockResolvedValue(mockLoginResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const result = await controller.login(
        {
          email: 'test@example.com',
          password: 'TestPassword123!',
        },
        mockRequest,
        mockResponse,
      );

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.message).toBe('Login successful');
    });

    it('should return 401 Unauthorized for invalid credentials', async () => {
      service.login = jest.fn().mockRejectedValue(
        new (await import('@nestjs/common')).UnauthorizedException({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        }),
      );

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await expect(
        controller.login(
          {
            email: 'test@example.com',
            password: 'wrong-password',
          },
          mockRequest,
          mockResponse,
        ),
      ).rejects.toThrow();
    });

    it('should return 429 Throttled for rate limit exceeded', async () => {
      service.login = jest.fn().mockRejectedValue(
        new (await import('@nestjs/common')).BadRequestException({
          code: 'THROTTLED',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: 3600,
        }),
      );

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await expect(
        controller.login(
          {
            email: 'test@example.com',
            password: 'TestPassword123!',
          },
          mockRequest,
          mockResponse,
        ),
      ).rejects.toThrow();
    });
  });

  describe('POST /auth/register - OpenAPI Contract Compliance', () => {
    it('should match OpenAPI v0.2.2 response schema', async () => {
      service.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const result = await controller.register(
        {
          email: 'newuser@example.com',
          password: 'TestPassword123!',
          name: 'New User',
          phone: '1234567890',
        },
        mockRequest,
        mockResponse,
      );

      // Verify response matches RegisterResponse schema from OpenAPI spec
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('message');
      expect(result).not.toHaveProperty('token'); // Token should be in cookie, not response

      // Verify user object matches User schema
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('role');
      expect(result.user).toHaveProperty('locale');
      expect(result.user).toHaveProperty('createdAt');

      // Verify required fields
      expect(typeof result.user.id).toBe('string');
      expect(typeof result.user.email).toBe('string');
      expect(Object.values(UserRole)).toContain(result.user.role);
      expect(typeof result.user.locale).toBe('string');
      expect(result.user.createdAt).toBeInstanceOf(Date);
      expect(typeof result.message).toBe('string');
      expect(result.message).toBe('Registration successful. Welcome to VisaOnTrack!');
    });

    it('should accept optional name and phone fields', async () => {
      service.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await controller.register(
        {
          email: 'newuser@example.com',
          password: 'TestPassword123!',
          name: 'New User',
          phone: '1234567890',
        },
        mockRequest,
        mockResponse,
      );

      expect(service.register).toHaveBeenCalledWith(
        'newuser@example.com',
        'TestPassword123!',
        'New User',
        '1234567890',
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should handle missing optional fields', async () => {
      service.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await controller.register(
        {
          email: 'newuser@example.com',
          password: 'TestPassword123!',
        },
        mockRequest,
        mockResponse,
      );

      expect(service.register).toHaveBeenCalledWith(
        'newuser@example.com',
        'TestPassword123!',
        undefined,
        undefined,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should set cookie with correct name and options', async () => {
      service.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await controller.register(
        {
          email: 'newuser@example.com',
          password: 'TestPassword123!',
        },
        mockRequest,
        mockResponse,
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        'mock-jwt-token',
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'strict',
          path: '/',
          maxAge: 15 * 60 * 1000, // 15 minutes
        }),
      );
    });

    it('should return 200 OK for successful registration', async () => {
      service.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const result = await controller.register(
        {
          email: 'newuser@example.com',
          password: 'TestPassword123!',
        },
        mockRequest,
        mockResponse,
      );

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.message).toBe('Registration successful. Welcome to VisaOnTrack!');
    });

    it('should return 400 Bad Request for duplicate email', async () => {
      service.register = jest.fn().mockRejectedValue(
        new (await import('@nestjs/common')).BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Email already registered',
        }),
      );

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await expect(
        controller.register(
          {
            email: 'existing@example.com',
            password: 'TestPassword123!',
          },
          mockRequest,
          mockResponse,
        ),
      ).rejects.toThrow();
    });

    it('should return 400 Bad Request for weak password', async () => {
      service.register = jest.fn().mockRejectedValue(
        new (await import('@nestjs/common')).BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
        }),
      );

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await expect(
        controller.register(
          {
            email: 'newuser@example.com',
            password: 'weak',
          },
          mockRequest,
          mockResponse,
        ),
      ).rejects.toThrow();
    });

    it('should return 429 Throttled for rate limit exceeded', async () => {
      service.register = jest.fn().mockRejectedValue(
        new (await import('@nestjs/common')).BadRequestException({
          code: 'THROTTLED',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: 3600,
        }),
      );

      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      await expect(
        controller.register(
          {
            email: 'newuser@example.com',
            password: 'TestPassword123!',
          },
          mockRequest,
          mockResponse,
        ),
      ).rejects.toThrow();
    });
  });
});

