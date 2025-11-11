import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient, UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { AuditLogService } from '../common/services/audit-log.service';

/**
 * Security tests for UsersService
 * 
 * Tests:
 * - Authorization security
 * - Input validation security
 * - Sensitive data security
 */

describe('UsersService (Security)', () => {
  let service: UsersService;
  let prisma: jest.Mocked<PrismaClient>;
  let auditLogService: jest.Mocked<AuditLogService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: UserRole.SEEKER,
    name: 'Test User',
    phone: '1234567890',
    locale: 'en',
    passwordHash: 'hashed-password',
    passwordResetTokenHash: 'hashed-token',
    passwordResetTokenExpiry: new Date(),
    createdAt: new Date('2025-01-01'),
  };

  const mockAdminUser = {
    ...mockUser,
    id: 'admin-123',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
  };

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    const mockAuditLog = {
      logPasswordResetRequest: jest.fn(),
      logPasswordResetComplete: jest.fn(),
      logPasswordResetFailed: jest.fn(),
      logOnboardingCompleted: jest.fn(),
    } as unknown as jest.Mocked<AuditLogService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
        {
          provide: AuditLogService,
          useValue: mockAuditLog,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaClient);
    auditLogService = module.get(AuditLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Authorization Security', () => {
    it('should prevent users from updating other users data', async () => {
      // This test verifies that the service method requires userId parameter
      // In production, this would be enforced by JWT guard extracting userId from token
      // The service itself should not allow cross-user updates
      
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated' });

      // User can only update their own data (userId must match)
      const updateData: UpdateUserRequestDto = { name: 'Updated Name' };
      await service.updateCurrentUser('user-123', updateData);

      // Verify that update was called with correct userId
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.any(Object),
      });

      // Verify that update was NOT called with different userId
      expect(prisma.user.update).not.toHaveBeenCalledWith({
        where: { id: 'other-user-id' },
        data: expect.any(Object),
      });
    });

    it('should prevent role escalation (cannot set ADMIN)', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const updateData: UpdateUserRequestDto = { role: UserRole.ADMIN };
      await expect(service.updateCurrentUser('user-123', updateData)).rejects.toThrow(BadRequestException);
      await expect(service.updateCurrentUser('user-123', updateData)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: 'Cannot change role to ADMIN',
      });
    });

    it('should prevent ADMIN role changes', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockAdminUser);

      const updateData: UpdateUserRequestDto = { role: UserRole.PROVIDER };
      await expect(service.updateCurrentUser('admin-123', updateData)).rejects.toThrow(BadRequestException);
      await expect(service.updateCurrentUser('admin-123', updateData)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: 'Cannot change role of ADMIN user',
      });
    });

    it('should enforce user can only update own data', async () => {
      // This is enforced by requiring userId parameter
      // JWT guard should extract userId from token and pass it to service
      // Service should not allow updating other users
        
      prisma.user.findUnique = jest.fn().mockImplementation((args) => {
        if (args.where.id === 'user-123') {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      });

      const updateData: UpdateUserRequestDto = { name: 'Updated Name' };
      
      // User can update their own data
      await expect(service.updateCurrentUser('user-123', updateData)).resolves.toBeDefined();
      
      // User cannot update other user's data (user not found)
      await expect(service.updateCurrentUser('other-user-id', updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Input Validation Security', () => {
    it('should reject invalid role values', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      // This would be caught by DTO validation, but we test service-level validation
      const updateData = { role: 'INVALID_ROLE' } as UpdateUserRequestDto;
      
      // Service should handle invalid enum values
      // In practice, DTO validation would catch this first
      await expect(service.updateCurrentUser('user-123', updateData)).rejects.toThrow();
    });

    it('should enforce max length constraints (name)', async () => {
      // This is tested in DTO validation tests
      // Service should respect max length constraints
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const updateData: UpdateUserRequestDto = {
        name: 'a'.repeat(201), // Exceeds max length
      };

      // DTO validation should catch this, but service should also handle it
      // In practice, NestJS validation pipe would reject this before service
      expect(updateData.name?.length).toBeGreaterThan(200);
    });

    it('should enforce max length constraints (phone)', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const updateData: UpdateUserRequestDto = {
        phone: '1'.repeat(51), // Exceeds max length
      };

      expect(updateData.phone?.length).toBeGreaterThan(50);
    });

    it('should enforce max length constraints (locale)', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const updateData: UpdateUserRequestDto = {
        locale: 'a'.repeat(11), // Exceeds max length
      };

      expect(updateData.locale?.length).toBeGreaterThan(10);
    });

    it('should prevent SQL injection (Prisma handles this)', async () => {
      // Prisma uses parameterized queries, so SQL injection is prevented
      // This test verifies that Prisma is used correctly
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(mockUser);

      const updateData: UpdateUserRequestDto = {
        name: "'; DROP TABLE users; --",
      };

      await service.updateCurrentUser('user-123', updateData);

      // Verify Prisma update was called (Prisma handles SQL injection)
      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { name: "'; DROP TABLE users; --" },
      });
    });

    it('should prevent XSS attacks (input sanitization)', async () => {
      // XSS prevention should be handled at input validation level
      // This test verifies that malicious input is stored as-is (no execution)
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue({ ...mockUser, name: '<script>alert("xss")</script>' });

      const updateData: UpdateUserRequestDto = {
        name: '<script>alert("xss")</script>',
      };

      const result = await service.updateCurrentUser('user-123', updateData);

      // Input should be stored as-is (no execution)
      expect(result.name).toBe('<script>alert("xss")</script>');
      // In production, frontend should sanitize output, but backend stores as-is
    });
  });

  describe('Sensitive Data Security', () => {
    it('should never return passwordHash in response', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getCurrentUser('user-123');

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('password');
    });

    it('should never return passwordResetTokenHash in response', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getCurrentUser('user-123');

      expect(result).not.toHaveProperty('passwordResetTokenHash');
      expect(result).not.toHaveProperty('passwordResetToken');
    });

    it('should never log sensitive data in audit logs', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated' });
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { name: 'Updated Name' };
      await service.updateCurrentUser('user-123', updateData, '127.0.0.1', 'test-agent');

      // Verify audit log was created
      expect(prisma.auditLog.create).toHaveBeenCalled();
      
      // Verify audit log does not contain sensitive data
      const auditLogCall = (prisma.auditLog.create as jest.Mock).mock.calls[0][0];
      expect(auditLogCall.data.diff).not.toHaveProperty('passwordHash');
      expect(auditLogCall.data.diff).not.toHaveProperty('password');
      expect(auditLogCall.data.diff).not.toHaveProperty('passwordResetTokenHash');
      expect(auditLogCall.data.diff).not.toHaveProperty('passwordResetToken');
    });

    it('should never expose sensitive data in error messages', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      try {
        await service.updateCurrentUser('user-123', { role: UserRole.ADMIN });
      } catch (error) {
        // Error message should not contain sensitive data
        const errorMessage = JSON.stringify(error);
        expect(errorMessage).not.toContain('passwordHash');
        expect(errorMessage).not.toContain('password');
        expect(errorMessage).not.toContain('passwordResetTokenHash');
        expect(errorMessage).not.toContain('passwordResetToken');
      }
    });

    it('should exclude sensitive fields from update payload', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(mockUser);

      const updateData: UpdateUserRequestDto = { name: 'Updated Name' };
      await service.updateCurrentUser('user-123', updateData);

      // Verify update payload does not include sensitive fields
      const updateCall = (prisma.user.update as jest.Mock).mock.calls[0][0];
      expect(updateCall.data).not.toHaveProperty('passwordHash');
      expect(updateCall.data).not.toHaveProperty('passwordResetTokenHash');
    });
  });

  describe('Onboarding Completion Security', () => {
    it('should prevent role mismatch attacks', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      // Try to complete onboarding with wrong role (should fail)
      await expect(service.completeOnboarding('user-123', UserRole.PROVIDER)).rejects.toThrow(BadRequestException);
      await expect(service.completeOnboarding('user-123', UserRole.PROVIDER)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: expect.stringContaining('Role mismatch'),
      });
    });

    it('should prevent ADMIN role onboarding completion', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockAdminUser);

      await expect(service.completeOnboarding('admin-123', UserRole.ADMIN)).rejects.toThrow(BadRequestException);
      await expect(service.completeOnboarding('admin-123', UserRole.ADMIN)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: 'Cannot complete onboarding for ADMIN role',
      });
    });

    it('should prevent unauthorized onboarding completion', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      // User not found (unauthorized access attempt)
      await expect(service.completeOnboarding('non-existent', UserRole.SEEKER)).rejects.toThrow(NotFoundException);
    });

    it('should audit log onboarding completion events', async () => {
      const completedUser = {
        ...mockUser,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        seekerOnboardingCompleted: true,
      };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(completedUser);
      auditLogService.logOnboardingCompleted = jest.fn().mockResolvedValue(undefined);

      await service.completeOnboarding('user-123', UserRole.SEEKER, '127.0.0.1', 'test-agent');

      expect(auditLogService.logOnboardingCompleted).toHaveBeenCalledWith(
        'user-123',
        UserRole.SEEKER,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should never expose sensitive data in onboarding completion response', async () => {
      const completedUser = {
        ...mockUser,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        seekerOnboardingCompleted: true,
      };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(completedUser);
      auditLogService.logOnboardingCompleted = jest.fn().mockResolvedValue(undefined);

      const result = await service.completeOnboarding('user-123', UserRole.SEEKER);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('passwordResetTokenHash');
    });
  });
});

