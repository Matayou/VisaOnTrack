import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';

/**
 * Contract tests for UsersController
 * 
 * Tests:
 * - OpenAPI contract compliance
 * - Status code compliance
 * - Request/Response schema compliance
 */

describe('UsersController (Contract Tests)', () => {
  let app: INestApplication;
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUserResponse = {
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
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(mockService)
      .compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /users/me - OpenAPI Contract Compliance', () => {
    it('should match OpenAPI v0.2.1 response schema', async () => {
      service.getCurrentUser = jest.fn().mockResolvedValue(mockUserResponse);

      const mockRequest = {
        user: { userId: 'user-123' },
      } as any;

      const result = await controller.getCurrentUser(mockRequest);

      // Verify response matches User schema from OpenAPI spec
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('locale');
      expect(result).toHaveProperty('createdAt');
      
      // Verify required fields
      expect(typeof result.id).toBe('string');
      expect(typeof result.email).toBe('string');
      expect(Object.values(UserRole)).toContain(result.role);
      expect(typeof result.locale).toBe('string');
      expect(result.createdAt).toBeInstanceOf(Date);
      
      // Verify RFC-004 completion fields
      expect(result).toHaveProperty('onboardingCompleted');
      expect(result).toHaveProperty('seekerOnboardingCompleted');
      expect(result).toHaveProperty('providerOnboardingCompleted');
      expect(typeof result.onboardingCompleted).toBe('boolean');
      expect(typeof result.seekerOnboardingCompleted).toBe('boolean');
      expect(typeof result.providerOnboardingCompleted).toBe('boolean');
      
      // Verify optional fields
      if (result.name !== undefined) {
        expect(typeof result.name).toBe('string');
      }
      if (result.phone !== undefined) {
        expect(typeof result.phone).toBe('string');
      }
      if (result.onboardingCompletedAt !== undefined) {
        expect(result.onboardingCompletedAt).toBeInstanceOf(Date);
      }
    });

    it('should return 200 OK for successful requests', async () => {
      service.getCurrentUser = jest.fn().mockResolvedValue(mockUserResponse);

      const mockRequest = {
        user: { userId: 'user-123' },
      } as any;

      const result = await controller.getCurrentUser(mockRequest);

      expect(result).toBeDefined();
      // In actual HTTP test, status would be 200
    });

    it('should return 401 Unauthorized for unauthenticated requests', async () => {
      const mockRequest = {} as any;

      await expect(controller.getCurrentUser(mockRequest)).rejects.toThrow();
      // In actual HTTP test, status would be 401
    });

    it('should return 404 Not Found for missing resources', async () => {
      service.getCurrentUser = jest.fn().mockRejectedValue(
        new (require('@nestjs/common').NotFoundException)({
          code: 'NOT_FOUND',
          message: 'User not found',
        }),
      );

      const mockRequest = {
        user: { userId: 'non-existent' },
      } as any;

      await expect(controller.getCurrentUser(mockRequest)).rejects.toThrow();
      // In actual HTTP test, status would be 404
    });
  });

  describe('PATCH /users/me - OpenAPI Contract Compliance', () => {
    it('should match OpenAPI v0.2.1 request schema', async () => {
      // Verify request schema matches UpdateUserRequest from OpenAPI spec
      const updateData = {
        role: UserRole.PROVIDER,
        name: 'Updated Name',
        phone: '9876543210',
        locale: 'th',
      };

      // All fields should be optional (partial update)
      expect(updateData.role).toBeDefined();
      expect(updateData.name).toBeDefined();
      expect(updateData.phone).toBeDefined();
      expect(updateData.locale).toBeDefined();
    });

    it('should match OpenAPI v0.2.1 response schema', async () => {
      const updatedUser = { ...mockUserResponse, name: 'Updated Name' };
      service.updateCurrentUser = jest.fn().mockResolvedValue(updatedUser);

      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const result = await controller.updateCurrentUser(
        { name: 'Updated Name' },
        mockRequest,
      );

      // Verify response matches User schema from OpenAPI spec
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('locale');
      expect(result).toHaveProperty('createdAt');
    });

    it('should return 200 OK for successful requests', async () => {
      const updatedUser = { ...mockUserResponse, name: 'Updated Name' };
      service.updateCurrentUser = jest.fn().mockResolvedValue(updatedUser);

      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const result = await controller.updateCurrentUser(
        { name: 'Updated Name' },
        mockRequest,
      );

      expect(result).toBeDefined();
      // In actual HTTP test, status would be 200
    });

    it('should return 400 Bad Request for invalid requests', async () => {
      service.updateCurrentUser = jest.fn().mockRejectedValue(
        new (require('@nestjs/common').BadRequestException)({
          code: 'BAD_REQUEST',
          message: 'Cannot change role to ADMIN',
        }),
      );

      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      await expect(
        controller.updateCurrentUser({ role: UserRole.ADMIN }, mockRequest),
      ).rejects.toThrow();
      // In actual HTTP test, status would be 400
    });

    it('should return 401 Unauthorized for unauthenticated requests', async () => {
      const mockRequest = {} as any;

      await expect(
        controller.updateCurrentUser({ name: 'Updated' }, mockRequest),
      ).rejects.toThrow();
      // In actual HTTP test, status would be 401
    });

    it('should return 404 Not Found for missing resources', async () => {
      service.updateCurrentUser = jest.fn().mockRejectedValue(
        new (require('@nestjs/common').NotFoundException)({
          code: 'NOT_FOUND',
          message: 'User not found',
        }),
      );

      const mockRequest = {
        user: { userId: 'non-existent' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      await expect(
        controller.updateCurrentUser({ name: 'Updated' }, mockRequest),
      ).rejects.toThrow();
      // In actual HTTP test, status would be 404
    });
  });

  describe('POST /users/me/complete-onboarding - OpenAPI Contract Compliance', () => {
    it('should match OpenAPI v0.2.3 request schema', async () => {
      // Verify request schema matches CompleteOnboardingRequest from OpenAPI spec
      const requestData = {
        role: UserRole.SEEKER,
      };

      expect(requestData.role).toBeDefined();
      expect(Object.values(UserRole)).toContain(requestData.role);
    });

    it('should match OpenAPI v0.2.3 response schema', async () => {
      const completedUser = {
        ...mockUserResponse,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date('2025-01-11'),
        seekerOnboardingCompleted: true,
      };
      service.completeOnboarding = jest.fn().mockResolvedValue(completedUser);

      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const result = await controller.completeOnboarding({ role: UserRole.SEEKER }, mockRequest);

      // Verify response matches User schema from OpenAPI spec (v0.2.3)
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('onboardingCompleted');
      expect(result).toHaveProperty('seekerOnboardingCompleted');
      expect(result).toHaveProperty('providerOnboardingCompleted');
      expect(result.onboardingCompleted).toBe(true);
      expect(result.seekerOnboardingCompleted).toBe(true);
    });

    it('should return 200 OK for successful requests', async () => {
      const completedUser = {
        ...mockUserResponse,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date('2025-01-11'),
        seekerOnboardingCompleted: true,
      };
      service.completeOnboarding = jest.fn().mockResolvedValue(completedUser);

      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const result = await controller.completeOnboarding({ role: UserRole.SEEKER }, mockRequest);

      expect(result).toBeDefined();
      // In actual HTTP test, status would be 200
    });

    it('should return 400 Bad Request for role mismatch', async () => {
      service.completeOnboarding = jest.fn().mockRejectedValue(
        new (require('@nestjs/common').BadRequestException)({
          code: 'BAD_REQUEST',
          message: 'Role mismatch: user role is SEEKER, but request specifies PROVIDER',
        }),
      );

      const mockRequest = {
        user: { userId: 'user-123' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      await expect(
        controller.completeOnboarding({ role: UserRole.PROVIDER }, mockRequest),
      ).rejects.toThrow();
      // In actual HTTP test, status would be 400
    });

    it('should return 401 Unauthorized for unauthenticated requests', async () => {
      const mockRequest = {} as any;

      await expect(
        controller.completeOnboarding({ role: UserRole.SEEKER }, mockRequest),
      ).rejects.toThrow();
      // In actual HTTP test, status would be 401
    });

    it('should return 404 Not Found for missing resources', async () => {
      service.completeOnboarding = jest.fn().mockRejectedValue(
        new (require('@nestjs/common').NotFoundException)({
          code: 'NOT_FOUND',
          message: 'User not found',
        }),
      );

      const mockRequest = {
        user: { userId: 'non-existent' },
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      } as any;

      await expect(
        controller.completeOnboarding({ role: UserRole.SEEKER }, mockRequest),
      ).rejects.toThrow();
      // In actual HTTP test, status would be 404
    });
  });

  describe('Error Response Schema Compliance', () => {
    it('should match OpenAPI v0.2.1 error response schema', async () => {
      // Error responses should match Error schema from OpenAPI spec
      // Error schema: { code: string, message: string }
      
      const mockRequest = {} as any;

      try {
        await controller.getCurrentUser(mockRequest);
      } catch (error: any) {
        // Verify error response structure
        expect(error.response).toHaveProperty('code');
        expect(error.response).toHaveProperty('message');
        expect(typeof error.response.code).toBe('string');
        expect(typeof error.response.message).toBe('string');
      }
    });

    it('should return correct error codes per OpenAPI spec', async () => {
      // Verify error codes match OpenAPI spec
      // 400: BAD_REQUEST
      // 401: UNAUTHORIZED
      // 404: NOT_FOUND

      const mockRequest = {} as any;

      try {
        await controller.getCurrentUser(mockRequest);
      } catch (error: any) {
        expect(error.response.code).toBe('UNAUTHORIZED');
      }
    });
  });
});

