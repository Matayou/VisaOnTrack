import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseWithToken } from './dto/login.dto';
import { RegisterRequestDto, RegisterResponseWithToken } from './dto/register.dto';
import { UserRole } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockLoginResponse: LoginResponseWithToken = {
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

  const mockRegisterResponse: RegisterResponseWithToken = {
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
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    const loginDto: LoginRequestDto = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      rememberMe: false,
    };

    it('should return 200 OK with user data and set cookie when login successful', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': undefined,
        },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.login = jest.fn().mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto, mockRequest, mockResponse);

      expect(result).toEqual({
        user: mockLoginResponse.user,
        message: mockLoginResponse.message,
      });
      expect(result).not.toHaveProperty('token');
      expect(service.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        false,
        '127.0.0.1',
        'test-agent',
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

    it('should set extended cookie expiration when rememberMe is true', async () => {
      const loginDtoWithRememberMe: LoginRequestDto = {
        ...loginDto,
        rememberMe: true,
      };
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.login = jest.fn().mockResolvedValue(mockLoginResponse);

      await controller.login(loginDtoWithRememberMe, mockRequest, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        'mock-jwt-token',
        expect.objectContaining({
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }),
      );
    });

    it('should return 401 Unauthorized when credentials are invalid', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.login = jest.fn().mockRejectedValue(
        new UnauthorizedException({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        }),
      );

      await expect(controller.login(loginDto, mockRequest, mockResponse)).rejects.toThrow(UnauthorizedException);
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request when rate limited', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.login = jest.fn().mockRejectedValue(
        new BadRequestException({
          code: 'THROTTLED',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: 3600,
        }),
      );

      await expect(controller.login(loginDto, mockRequest, mockResponse)).rejects.toThrow(BadRequestException);
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should extract IP from x-forwarded-for header when ip is not available', async () => {
      const mockRequest = {
        ip: undefined,
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': '10.0.0.1',
        },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.login = jest.fn().mockResolvedValue(mockLoginResponse);

      await controller.login(loginDto, mockRequest, mockResponse);

      expect(service.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
        false,
        '10.0.0.1',
        'test-agent',
      );
    });

    it('should handle internal server errors gracefully', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.login = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(controller.login(loginDto, mockRequest, mockResponse)).rejects.toThrow(BadRequestException);
      await expect(controller.login(loginDto, mockRequest, mockResponse)).rejects.toThrow({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while logging in. Please try again later.',
      });
    });

    it('should re-throw BadRequestException errors', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const badRequestError = new BadRequestException({
        code: 'THROTTLED',
        message: 'Rate limit exceeded',
      });
      service.login = jest.fn().mockRejectedValue(badRequestError);

      await expect(controller.login(loginDto, mockRequest, mockResponse)).rejects.toThrow(badRequestError);
    });

    it('should re-throw UnauthorizedException errors', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const unauthorizedError = new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
      service.login = jest.fn().mockRejectedValue(unauthorizedError);

      await expect(controller.login(loginDto, mockRequest, mockResponse)).rejects.toThrow(unauthorizedError);
    });
  });

  describe('POST /auth/register', () => {
    const registerDto: RegisterRequestDto = {
      email: 'newuser@example.com',
      password: 'TestPassword123!',
      name: 'New User',
      phone: '1234567890',
    };

    it('should return 200 OK with user data and set cookie when registration successful', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': undefined,
        },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      const result = await controller.register(registerDto, mockRequest, mockResponse);

      expect(result).toEqual({
        user: mockRegisterResponse.user,
        message: mockRegisterResponse.message,
      });
      expect(result).not.toHaveProperty('token');
      expect(service.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
        registerDto.phone,
        '127.0.0.1',
        'test-agent',
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

    it('should handle optional name and phone', async () => {
      const registerDtoWithoutOptional: RegisterRequestDto = {
        email: 'newuser@example.com',
        password: 'TestPassword123!',
      };
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      await controller.register(registerDtoWithoutOptional, mockRequest, mockResponse);

      expect(service.register).toHaveBeenCalledWith(
        registerDtoWithoutOptional.email,
        registerDtoWithoutOptional.password,
        undefined,
        undefined,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should return 400 Bad Request when email already exists', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.register = jest.fn().mockRejectedValue(
        new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Email already registered',
        }),
      );

      await expect(controller.register(registerDto, mockRequest, mockResponse)).rejects.toThrow(BadRequestException);
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request when password is weak', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.register = jest.fn().mockRejectedValue(
        new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
        }),
      );

      await expect(controller.register(registerDto, mockRequest, mockResponse)).rejects.toThrow(BadRequestException);
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request when rate limited', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.register = jest.fn().mockRejectedValue(
        new BadRequestException({
          code: 'THROTTLED',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: 3600,
        }),
      );

      await expect(controller.register(registerDto, mockRequest, mockResponse)).rejects.toThrow(BadRequestException);
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should extract IP from x-forwarded-for header when ip is not available', async () => {
      const mockRequest = {
        ip: undefined,
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': '10.0.0.1',
        },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.register = jest.fn().mockResolvedValue(mockRegisterResponse);

      await controller.register(registerDto, mockRequest, mockResponse);

      expect(service.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
        registerDto.phone,
        '10.0.0.1',
        'test-agent',
      );
    });

    it('should handle internal server errors gracefully', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      service.register = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(controller.register(registerDto, mockRequest, mockResponse)).rejects.toThrow(BadRequestException);
      await expect(controller.register(registerDto, mockRequest, mockResponse)).rejects.toThrow({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while registering. Please try again later.',
      });
    });

    it('should re-throw BadRequestException errors', async () => {
      const mockRequest = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const badRequestError = new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Email already registered',
      });
      service.register = jest.fn().mockRejectedValue(badRequestError);

      await expect(controller.register(registerDto, mockRequest, mockResponse)).rejects.toThrow(badRequestError);
    });
  });
});
