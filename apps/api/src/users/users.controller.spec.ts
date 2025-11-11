import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { CompleteOnboardingRequestDto } from './dto/complete-onboarding.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUserResponse: UserResponseDto = {
    id: 'user-123',
    email: 'test@example.com',
    role: UserRole.SEEKER,
    name: 'Test User',
    phone: '1234567890',
    locale: 'en',
    onboardingCompleted: false,
    onboardingCompletedAt: undefined,
    seekerOnboardingCompleted: false,
    providerOnboardingCompleted: false,
    createdAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    const mockService = {
      getCurrentUser: jest.fn(),
      updateCurrentUser: jest.fn(),
      completeOnboarding: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users/me', () => {
    it('should return 200 OK with user data when authenticated', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
      } as unknown as Request;

      service.getCurrentUser = jest.fn().mockResolvedValue(mockUserResponse);

      const result = await controller.getCurrentUser(mockRequest);

      expect(result).toEqual(mockUserResponse);
      expect(service.getCurrentUser).toHaveBeenCalledWith('user-123');
      expect(service.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should return 401 Unauthorized when userId missing', async () => {
      const mockRequest = {} as Request;

      await expect(controller.getCurrentUser(mockRequest)).rejects.toThrow(UnauthorizedException);
      await expect(controller.getCurrentUser(mockRequest)).rejects.toThrow({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });

      expect(service.getCurrentUser).not.toHaveBeenCalled();
    });

    it('should call service.getCurrentUser() with correct userId', async () => {
      const mockRequest = {
        user: { userId: 'user-456' },
      } as unknown as Request;

      service.getCurrentUser = jest.fn().mockResolvedValue(mockUserResponse);

      await controller.getCurrentUser(mockRequest);

      expect(service.getCurrentUser).toHaveBeenCalledWith('user-456');
      expect(service.getCurrentUser).not.toHaveBeenCalledWith('user-123');
    });
  });

  describe('PATCH /users/me', () => {
    const updateData: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    it('should return 200 OK with updated user data', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': undefined,
        },
      } as unknown as Request;

      const updatedUser = { ...mockUserResponse, name: 'Updated Name' };
      service.updateCurrentUser = jest.fn().mockResolvedValue(updatedUser);

      const result = await controller.updateCurrentUser(updateData, mockRequest);

      expect(result).toEqual(updatedUser);
      expect(service.updateCurrentUser).toHaveBeenCalledWith('user-123', updateData, '127.0.0.1', 'test-agent');
    });

    it('should return 401 Unauthorized when userId missing', async () => {
      const mockRequest = {} as Request;

      await expect(controller.updateCurrentUser(updateData, mockRequest)).rejects.toThrow(UnauthorizedException);
      await expect(controller.updateCurrentUser(updateData, mockRequest)).rejects.toThrow({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });

      expect(service.updateCurrentUser).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request for invalid role', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const invalidUpdateData: UpdateUserRequestDto = { role: UserRole.ADMIN };
      service.updateCurrentUser = jest.fn().mockRejectedValue(
        new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Cannot change role to ADMIN',
        }),
      );

      await expect(controller.updateCurrentUser(invalidUpdateData, mockRequest)).rejects.toThrow(BadRequestException);
    });

    it('should return 404 Not Found when user not found', async () => {
      const mockRequest = {
        user: { userId: 'non-existent' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      service.updateCurrentUser = jest.fn().mockRejectedValue(
        new NotFoundException({
          code: 'NOT_FOUND',
          message: 'User not found',
        }),
      );

      await expect(controller.updateCurrentUser(updateData, mockRequest)).rejects.toThrow(NotFoundException);
    });

    it('should call service.updateCurrentUser() with correct parameters', async () => {
      const mockRequest = {
        user: { userId: 'user-456' },
        ip: '192.168.1.1',
        headers: { 'user-agent': 'Mozilla/5.0' },
      } as unknown as Request;

      service.updateCurrentUser = jest.fn().mockResolvedValue(mockUserResponse);

      await controller.updateCurrentUser(updateData, mockRequest);

      expect(service.updateCurrentUser).toHaveBeenCalledWith('user-456', updateData, '192.168.1.1', 'Mozilla/5.0');
    });

    it('should extract IP and User-Agent for audit logging', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': undefined,
        },
      } as unknown as Request;

      service.updateCurrentUser = jest.fn().mockResolvedValue(mockUserResponse);

      await controller.updateCurrentUser(updateData, mockRequest);

      expect(service.updateCurrentUser).toHaveBeenCalledWith(
        'user-123',
        updateData,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should use x-forwarded-for header when ip is not available', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: undefined,
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': '10.0.0.1',
        },
      } as unknown as Request;

      service.updateCurrentUser = jest.fn().mockResolvedValue(mockUserResponse);

      await controller.updateCurrentUser(updateData, mockRequest);

      expect(service.updateCurrentUser).toHaveBeenCalledWith('user-123', updateData, '10.0.0.1', 'test-agent');
    });

    it('should handle internal server errors gracefully', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      service.updateCurrentUser = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(controller.updateCurrentUser(updateData, mockRequest)).rejects.toThrow(BadRequestException);
      await expect(controller.updateCurrentUser(updateData, mockRequest)).rejects.toThrow({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating your profile. Please try again later.',
      });
    });

    it('should re-throw BadRequestException errors', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const badRequestError = new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Invalid role',
      });
      service.updateCurrentUser = jest.fn().mockRejectedValue(badRequestError);

      await expect(controller.updateCurrentUser(updateData, mockRequest)).rejects.toThrow(badRequestError);
    });

    it('should re-throw UnauthorizedException errors', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const unauthorizedError = new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
      service.updateCurrentUser = jest.fn().mockRejectedValue(unauthorizedError);

      await expect(controller.updateCurrentUser(updateData, mockRequest)).rejects.toThrow(unauthorizedError);
    });
  });

  describe('POST /users/me/complete-onboarding', () => {
    const completeOnboardingData: CompleteOnboardingRequestDto = {
      role: UserRole.SEEKER,
    };

    it('should return 200 OK with updated user data when onboarding completed', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': undefined,
        },
      } as unknown as Request;

      const completedUser = {
        ...mockUserResponse,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date('2025-01-11'),
        seekerOnboardingCompleted: true,
      };
      service.completeOnboarding = jest.fn().mockResolvedValue(completedUser);

      const result = await controller.completeOnboarding(completeOnboardingData, mockRequest);

      expect(result).toEqual(completedUser);
      expect(result.onboardingCompleted).toBe(true);
      expect(result.seekerOnboardingCompleted).toBe(true);
      expect(service.completeOnboarding).toHaveBeenCalledWith('user-123', UserRole.SEEKER, '127.0.0.1', 'test-agent');
    });

    it('should return 401 Unauthorized when userId missing', async () => {
      const mockRequest = {} as Request;

      await expect(controller.completeOnboarding(completeOnboardingData, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.completeOnboarding(completeOnboardingData, mockRequest)).rejects.toThrow({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });

      expect(service.completeOnboarding).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request for role mismatch', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      service.completeOnboarding = jest.fn().mockRejectedValue(
        new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Role mismatch: user role is SEEKER, but request specifies PROVIDER',
        }),
      );

      const invalidData: CompleteOnboardingRequestDto = { role: UserRole.PROVIDER };
      await expect(controller.completeOnboarding(invalidData, mockRequest)).rejects.toThrow(BadRequestException);
    });

    it('should return 400 Bad Request for ADMIN role', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      service.completeOnboarding = jest.fn().mockRejectedValue(
        new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Cannot complete onboarding for ADMIN role',
        }),
      );

      const invalidData: CompleteOnboardingRequestDto = { role: UserRole.ADMIN };
      await expect(controller.completeOnboarding(invalidData, mockRequest)).rejects.toThrow(BadRequestException);
    });

    it('should return 404 Not Found when user not found', async () => {
      const mockRequest = {
        user: { userId: 'non-existent' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      service.completeOnboarding = jest.fn().mockRejectedValue(
        new NotFoundException({
          code: 'NOT_FOUND',
          message: 'User not found',
        }),
      );

      await expect(controller.completeOnboarding(completeOnboardingData, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should call service.completeOnboarding() with correct parameters', async () => {
      const mockRequest = {
        user: { userId: 'user-456' },
        ip: '192.168.1.1',
        headers: { 'user-agent': 'Mozilla/5.0' },
      } as unknown as Request;

      service.completeOnboarding = jest.fn().mockResolvedValue(mockUserResponse);

      await controller.completeOnboarding(completeOnboardingData, mockRequest);

      expect(service.completeOnboarding).toHaveBeenCalledWith('user-456', UserRole.SEEKER, '192.168.1.1', 'Mozilla/5.0');
    });

    it('should extract IP and User-Agent for audit logging', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': undefined,
        },
      } as unknown as Request;

      service.completeOnboarding = jest.fn().mockResolvedValue(mockUserResponse);

      await controller.completeOnboarding(completeOnboardingData, mockRequest);

      expect(service.completeOnboarding).toHaveBeenCalledWith(
        'user-123',
        UserRole.SEEKER,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should use x-forwarded-for header when ip is not available', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: undefined,
        headers: {
          'user-agent': 'test-agent',
          'x-forwarded-for': '10.0.0.1',
        },
      } as unknown as Request;

      service.completeOnboarding = jest.fn().mockResolvedValue(mockUserResponse);

      await controller.completeOnboarding(completeOnboardingData, mockRequest);

      expect(service.completeOnboarding).toHaveBeenCalledWith('user-123', UserRole.SEEKER, '10.0.0.1', 'test-agent');
    });

    it('should handle internal server errors gracefully', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      service.completeOnboarding = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(controller.completeOnboarding(completeOnboardingData, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.completeOnboarding(completeOnboardingData, mockRequest)).rejects.toThrow({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while completing onboarding. Please try again later.',
      });
    });

    it('should re-throw BadRequestException errors', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const badRequestError = new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Role mismatch',
      });
      service.completeOnboarding = jest.fn().mockRejectedValue(badRequestError);

      await expect(controller.completeOnboarding(completeOnboardingData, mockRequest)).rejects.toThrow(
        badRequestError,
      );
    });

    it('should re-throw UnauthorizedException errors', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;

      const unauthorizedError = new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });
      service.completeOnboarding = jest.fn().mockRejectedValue(unauthorizedError);

      await expect(controller.completeOnboarding(completeOnboardingData, mockRequest)).rejects.toThrow(
        unauthorizedError,
      );
    });
  });
});

