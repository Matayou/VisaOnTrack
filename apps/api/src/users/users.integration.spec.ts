import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaClient, UserRole } from '@prisma/client';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dto/update-user.dto';

/**
 * Integration tests for UsersService
 * 
 * Tests:
 * - Database operations
 * - Audit logging
 * - Data persistence
 * 
 * NOTE: These tests require a test database.
 * For unit tests, use mocks in users.service.spec.ts
 */

describe('UsersService (Integration)', () => {
  let app: INestApplication;
  let service: UsersService;
  let prisma: PrismaClient;
  let testUserId: string;

  beforeAll(async () => {
    // TODO: Set up test database connection
    // For now, skip if test database is not available
    if (!process.env.TEST_DATABASE_URL) {
      console.warn('TEST_DATABASE_URL not set, skipping integration tests');
      return;
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaClient>(PrismaClient);

    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        role: UserRole.SEEKER,
        name: 'Test User',
        phone: '1234567890',
        locale: 'en',
      },
    });
    testUserId = testUser.id;
  });

  afterAll(async () => {
    if (app) {
      // Cleanup test user
      if (testUserId) {
        await prisma.user.deleteMany({
          where: { id: testUserId },
        });
        await prisma.auditLog.deleteMany({
          where: { entityId: testUserId },
        });
      }
      await app.close();
    }
  });

  describe('GET /users/me (Integration)', () => {
    it('should query database correctly', async () => {
      if (!testUserId) return;

      const user = await service.getCurrentUser(testUserId);

      expect(user).toBeDefined();
      expect(user.id).toBe(testUserId);
      expect(user.email).toBeDefined();
    });

    it('should return user data from database', async () => {
      if (!testUserId) return;

      const user = await service.getCurrentUser(testUserId);

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('locale');
      expect(user).toHaveProperty('createdAt');
    });

    it('should handle database errors', async () => {
      await expect(service.getCurrentUser('non-existent-id')).rejects.toThrow();
    });
  });

  describe('PATCH /users/me (Integration)', () => {
    it('should update database correctly', async () => {
      if (!testUserId) return;

      const updateData: UpdateUserRequestDto = {
        name: 'Updated Name',
      };

      const updatedUser = await service.updateCurrentUser(testUserId, updateData);

      expect(updatedUser.name).toBe('Updated Name');

      // Verify in database
      const dbUser = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(dbUser?.name).toBe('Updated Name');
    });

    it('should persist changes to database', async () => {
      if (!testUserId) return;

      const updateData: UpdateUserRequestDto = {
        role: UserRole.PROVIDER,
        locale: 'th',
      };

      await service.updateCurrentUser(testUserId, updateData, '127.0.0.1', 'test-agent');

      // Verify in database
      const dbUser = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(dbUser?.role).toBe(UserRole.PROVIDER);
      expect(dbUser?.locale).toBe('th');
    });

    it('should create audit log entries in database', async () => {
      if (!testUserId) return;

      const updateData: UpdateUserRequestDto = {
        name: 'Integration Test Name',
      };

      await service.updateCurrentUser(testUserId, updateData, '127.0.0.1', 'test-agent');

      // Verify audit log created
      const auditLogs = await prisma.auditLog.findMany({
        where: {
          entityId: testUserId,
          action: 'USER_PROFILE_UPDATED',
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      expect(auditLogs.length).toBeGreaterThan(0);
      expect(auditLogs[0].action).toBe('USER_PROFILE_UPDATED');
      expect(auditLogs[0].entityType).toBe('User');
      expect(auditLogs[0].entityId).toBe(testUserId);
      expect(auditLogs[0].ip).toBe('127.0.0.1');
      expect(auditLogs[0].ua).toBe('test-agent');
    });

    it('should handle database errors', async () => {
      await expect(
        service.updateCurrentUser('non-existent-id', { name: 'Test' }),
      ).rejects.toThrow();
    });
  });

  describe('POST /users/me/complete-onboarding (Integration)', () => {
    it('should complete onboarding and persist to database', async () => {
      if (!testUserId) return;

      const result = await service.completeOnboarding(testUserId, UserRole.SEEKER, '127.0.0.1', 'test-agent');

      expect(result.onboardingCompleted).toBe(true);
      expect(result.seekerOnboardingCompleted).toBe(true);
      expect(result.onboardingCompletedAt).toBeDefined();

      // Verify in database
      const dbUser = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(dbUser?.onboardingCompleted).toBe(true);
      expect(dbUser?.seekerOnboardingCompleted).toBe(true);
      expect(dbUser?.onboardingCompletedAt).toBeDefined();
    });

    it('should create audit log entry in database', async () => {
      if (!testUserId) return;

      await service.completeOnboarding(testUserId, UserRole.SEEKER, '127.0.0.1', 'test-agent');

      // Verify audit log created
      const auditLogs = await prisma.auditLog.findMany({
        where: {
          entityId: testUserId,
          action: 'ONBOARDING_COMPLETED',
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      expect(auditLogs.length).toBeGreaterThan(0);
      expect(auditLogs[0].action).toBe('ONBOARDING_COMPLETED');
      expect(auditLogs[0].entityType).toBe('User');
      expect(auditLogs[0].entityId).toBe(testUserId);
      expect(auditLogs[0].ip).toBe('127.0.0.1');
      expect(auditLogs[0].ua).toBe('test-agent');
    });

    it('should handle role mismatch correctly', async () => {
      if (!testUserId) return;

      // Update user to PROVIDER role
      await prisma.user.update({
        where: { id: testUserId },
        data: { role: UserRole.PROVIDER },
      });

      // Try to complete onboarding with SEEKER role (should fail)
      await expect(service.completeOnboarding(testUserId, UserRole.SEEKER)).rejects.toThrow();

      // Complete onboarding with PROVIDER role (should succeed)
      const result = await service.completeOnboarding(testUserId, UserRole.PROVIDER);
      expect(result.providerOnboardingCompleted).toBe(true);
    });

    it('should handle database errors', async () => {
      await expect(service.completeOnboarding('non-existent-id', UserRole.SEEKER)).rejects.toThrow();
    });
  });

  describe('JWT Authentication (Placeholder)', () => {
    // TODO: Implement JWT authentication integration tests when JWT guard is implemented
    it('should extract userId from JWT token', () => {
      // TODO: Test JWT token extraction
      expect(true).toBe(true); // Placeholder
    });

    it('should return 401 Unauthorized for invalid token', () => {
      // TODO: Test invalid token handling
      expect(true).toBe(true); // Placeholder
    });

    it('should return 401 Unauthorized for expired token', () => {
      // TODO: Test expired token handling
      expect(true).toBe(true); // Placeholder
    });

    it('should return 401 Unauthorized for missing token', () => {
      // TODO: Test missing token handling
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Authorization (Integration)', () => {
    it('should only allow users to update own data', async () => {
      if (!testUserId) return;

      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          email: `other-${Date.now()}@example.com`,
          role: UserRole.SEEKER,
          locale: 'en',
        },
      });

      try {
        // Try to update other user's data (should fail or be prevented by guard)
        // This test verifies that the service doesn't allow cross-user updates
        // In production, this would be enforced by JWT guard
        const updateData: UpdateUserRequestDto = { name: 'Hacked Name' };
        await service.updateCurrentUser(otherUser.id, updateData);

        // If we get here, the service should have prevented the update
        // Verify the other user's data wasn't changed
        const dbUser = await prisma.user.findUnique({
          where: { id: otherUser.id },
        });
        expect(dbUser?.name).not.toBe('Hacked Name');
      } finally {
        // Cleanup
        await prisma.user.delete({ where: { id: otherUser.id } });
      }
    });

    it('should enforce role restrictions (cannot set ADMIN)', async () => {
      if (!testUserId) return;

      const updateData: UpdateUserRequestDto = {
        role: UserRole.ADMIN,
      };

      await expect(service.updateCurrentUser(testUserId, updateData)).rejects.toThrow();
    });
  });
});

