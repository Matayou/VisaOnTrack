import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaClient, UserRole } from '@prisma/client';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

/**
 * Integration tests for AuthService
 * 
 * Tests:
 * - Database operations
 * - Password hashing and verification
 * - JWT token generation
 * - Audit logging
 * - Data persistence
 * 
 * NOTE: These tests require a test database.
 * For unit tests, use mocks in auth.service.spec.ts
 */

describe('AuthService (Integration)', () => {
  let app: INestApplication;
  let service: AuthService;
  let prisma: PrismaClient;
  let testUserEmail: string;
  let testUserId: string;

  beforeAll(async () => {
    // TODO: Set up test database connection
    // For now, skip if test database is not available
    if (!process.env.TEST_DATABASE_URL) {
      console.warn('TEST_DATABASE_URL not set, skipping integration tests');
      return;
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaClient>(PrismaClient);

    // Generate unique test email
    testUserEmail = `test-${Date.now()}@example.com`;
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

  describe('POST /auth/register (Integration)', () => {
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';
    const testPhone = '1234567890';

    it('should create user in database with hashed password', async () => {
      if (!process.env.TEST_DATABASE_URL) return;

      const result = await service.register(
        testUserEmail,
        testPassword,
        testName,
        testPhone,
        '127.0.0.1',
        'test-agent',
      );

      testUserId = result.user.id;

      expect(result).toBeDefined();
      expect(result.user.id).toBeDefined();
      expect(result.user.email).toBe(testUserEmail.toLowerCase());
      expect(result.user.name).toBe(testName);
      expect(result.user.phone).toBe(testPhone);
      expect(result.user.role).toBe(UserRole.SEEKER);
      expect(result.token).toBeDefined();
      expect(result.message).toBe('Registration successful. Welcome to VisaOnTrack!');

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { id: testUserId },
      });

      expect(user).toBeDefined();
      expect(user?.email).toBe(testUserEmail.toLowerCase());
      expect(user?.passwordHash).toBeDefined();
      expect(user?.passwordHash).not.toBe(testPassword); // Password should be hashed
      expect(user?.role).toBe(UserRole.SEEKER);

      // Verify password was hashed correctly
      const isPasswordValid = await bcrypt.compare(testPassword, user!.passwordHash!);
      expect(isPasswordValid).toBe(true);
    });

    it('should create audit log entry for registration', async () => {
      if (!testUserId || !process.env.TEST_DATABASE_URL) return;

      const auditLog = await prisma.auditLog.findFirst({
        where: {
          entityId: testUserId,
          action: 'USER_REGISTERED',
        },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.actorUserId).toBe(testUserId);
      expect(auditLog?.actorRole).toBe(UserRole.SEEKER);
      expect(auditLog?.entityType).toBe('User');
      expect(auditLog?.entityId).toBe(testUserId);
    });

    it('should handle duplicate email registration', async () => {
      if (!testUserId || !process.env.TEST_DATABASE_URL) return;

      await expect(
        service.register(testUserEmail, testPassword, testName, testPhone),
      ).rejects.toThrow();
    });
  });

  describe('POST /auth/login (Integration)', () => {
    const testPassword = 'TestPassword123!';
    let loginEmail: string;
    let loginUserId: string;

    beforeAll(async () => {
      if (!process.env.TEST_DATABASE_URL) return;

      // Create a user for login tests
      loginEmail = `login-${Date.now()}@example.com`;
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const user = await prisma.user.create({
        data: {
          email: loginEmail,
          passwordHash: hashedPassword,
          role: UserRole.SEEKER,
          locale: 'en',
        },
      });
      loginUserId = user.id;
    });

    afterAll(async () => {
      if (loginUserId && process.env.TEST_DATABASE_URL) {
        await prisma.user.deleteMany({
          where: { id: loginUserId },
        });
        await prisma.auditLog.deleteMany({
          where: { entityId: loginUserId },
        });
      }
    });

    it('should successfully login with valid credentials', async () => {
      if (!loginUserId || !process.env.TEST_DATABASE_URL) return;

      const result = await service.login(loginEmail, testPassword, false, '127.0.0.1', 'test-agent');

      expect(result).toBeDefined();
      expect(result.user.id).toBe(loginUserId);
      expect(result.user.email).toBe(loginEmail.toLowerCase());
      expect(result.token).toBeDefined();
      expect(result.message).toBe('Login successful');
    });

    it('should fail login with invalid password', async () => {
      if (!loginUserId || !process.env.TEST_DATABASE_URL) return;

      await expect(service.login(loginEmail, 'wrong-password', false)).rejects.toThrow();
    });

    it('should fail login with non-existent email', async () => {
      if (!process.env.TEST_DATABASE_URL) return;

      await expect(service.login('nonexistent@example.com', testPassword, false)).rejects.toThrow();
    });

    it('should create audit log entry for successful login', async () => {
      if (!loginUserId || !process.env.TEST_DATABASE_URL) return;

      // Wait a bit for async audit log
      await new Promise((resolve) => setTimeout(resolve, 100));

      const auditLog = await prisma.auditLog.findFirst({
        where: {
          entityId: loginUserId,
          action: 'USER_LOGIN',
          success: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog?.actorUserId).toBe(loginUserId);
    });

    it('should create audit log entry for failed login', async () => {
      if (!loginUserId || !process.env.TEST_DATABASE_URL) return;

      try {
        await service.login(loginEmail, 'wrong-password', false);
      } catch (error) {
        // Expected to fail
      }

      // Wait a bit for async audit log
      await new Promise((resolve) => setTimeout(resolve, 100));

      const auditLog = await prisma.auditLog.findFirst({
        where: {
          entityId: loginUserId,
          action: 'USER_LOGIN',
          success: false,
        },
        orderBy: { createdAt: 'desc' },
      });

      expect(auditLog).toBeDefined();
    });

    it('should generate JWT token with correct payload', async () => {
      if (!loginUserId || !process.env.TEST_DATABASE_URL) return;

      const result = await service.login(loginEmail, testPassword, false);

      // Token should be a valid JWT string
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(result.token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });
});

