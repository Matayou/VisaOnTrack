import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { AuditLogService } from '../common/services/audit-log.service';

describe('UsersService', () => {
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
    passwordResetTokenHash: null,
    passwordResetTokenExpiry: null,
    onboardingCompleted: false,
    onboardingCompletedAt: null,
    seekerOnboardingCompleted: false,
    providerOnboardingCompleted: false,
    createdAt: new Date('2025-01-01'),
  };

  const mockAdminUser = {
    ...mockUser,
    id: 'admin-123',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
  };

  beforeEach(async () => {
    // Create mock PrismaClient
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    // Create mock AuditLogService
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

  describe('getCurrentUser', () => {
    it('should return user data when user exists', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getCurrentUser('user-123');

      expect(result).toEqual({
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
        createdAt: mockUser.createdAt,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
    });

    it('should exclude sensitive fields from response', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getCurrentUser('user-123');

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('passwordResetTokenHash');
      expect(result).not.toHaveProperty('passwordResetTokenExpiry');
    });

    it('should return undefined for optional fields when null', async () => {
      const userWithoutOptionalFields = {
        ...mockUser,
        name: null,
        phone: null,
      };
      prisma.user.findUnique = jest.fn().mockResolvedValue(userWithoutOptionalFields);

      const result = await service.getCurrentUser('user-123');

      expect(result.name).toBeUndefined();
      expect(result.phone).toBeUndefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.getCurrentUser('non-existent')).rejects.toThrow(NotFoundException);
      await expect(service.getCurrentUser('non-existent')).rejects.toThrow({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    });

    it('should return correct UserResponseDto structure', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.getCurrentUser('user-123');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('locale');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('onboardingCompleted');
      expect(result).toHaveProperty('seekerOnboardingCompleted');
      expect(result).toHaveProperty('providerOnboardingCompleted');
      expect(typeof result.id).toBe('string');
      expect(typeof result.email).toBe('string');
      expect(Object.values(UserRole)).toContain(result.role);
    });
  });

  describe('completeOnboarding', () => {
    it('should complete onboarding for SEEKER role', async () => {
      const completedUser = {
        ...mockUser,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date('2025-01-11'),
        seekerOnboardingCompleted: true,
      };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(completedUser);
      auditLogService.logOnboardingCompleted = jest.fn().mockResolvedValue(undefined);

      const result = await service.completeOnboarding('user-123', UserRole.SEEKER, '127.0.0.1', 'test-agent');

      expect(result.onboardingCompleted).toBe(true);
      expect(result.seekerOnboardingCompleted).toBe(true);
      expect(result.providerOnboardingCompleted).toBe(false);
      expect(result.onboardingCompletedAt).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          onboardingCompleted: true,
          onboardingCompletedAt: expect.any(Date),
          seekerOnboardingCompleted: true,
        },
      });
      expect(auditLogService.logOnboardingCompleted).toHaveBeenCalledWith(
        'user-123',
        UserRole.SEEKER,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should complete onboarding for PROVIDER role', async () => {
      const providerUser = {
        ...mockUser,
        role: UserRole.PROVIDER,
      };
      const completedUser = {
        ...providerUser,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date('2025-01-11'),
        providerOnboardingCompleted: true,
      };
      prisma.user.findUnique = jest.fn().mockResolvedValue(providerUser);
      prisma.user.update = jest.fn().mockResolvedValue(completedUser);
      auditLogService.logOnboardingCompleted = jest.fn().mockResolvedValue(undefined);

      const result = await service.completeOnboarding('user-123', UserRole.PROVIDER, '127.0.0.1', 'test-agent');

      expect(result.onboardingCompleted).toBe(true);
      expect(result.seekerOnboardingCompleted).toBe(false);
      expect(result.providerOnboardingCompleted).toBe(true);
      expect(result.onboardingCompletedAt).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          onboardingCompleted: true,
          onboardingCompletedAt: expect.any(Date),
          providerOnboardingCompleted: true,
        },
      });
      expect(auditLogService.logOnboardingCompleted).toHaveBeenCalledWith(
        'user-123',
        UserRole.PROVIDER,
        '127.0.0.1',
        'test-agent',
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.completeOnboarding('non-existent', UserRole.SEEKER)).rejects.toThrow(NotFoundException);
      await expect(service.completeOnboarding('non-existent', UserRole.SEEKER)).rejects.toThrow({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    });

    it('should throw BadRequestException when role mismatch', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await expect(service.completeOnboarding('user-123', UserRole.PROVIDER)).rejects.toThrow(BadRequestException);
      await expect(service.completeOnboarding('user-123', UserRole.PROVIDER)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: expect.stringContaining('Role mismatch'),
      });
    });

    it('should throw BadRequestException when trying to complete onboarding for ADMIN role', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockAdminUser);

      await expect(service.completeOnboarding('admin-123', UserRole.ADMIN)).rejects.toThrow(BadRequestException);
      await expect(service.completeOnboarding('admin-123', UserRole.ADMIN)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: 'Cannot complete onboarding for ADMIN role',
      });
    });

    it('should set onboardingCompletedAt timestamp', async () => {
      const completedUser = {
        ...mockUser,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date('2025-01-11T12:00:00Z'),
        seekerOnboardingCompleted: true,
      };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(completedUser);
      auditLogService.logOnboardingCompleted = jest.fn().mockResolvedValue(undefined);

      const beforeTime = new Date();
      await service.completeOnboarding('user-123', UserRole.SEEKER);
      const afterTime = new Date();

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          onboardingCompletedAt: expect.any(Date),
        }),
      });

      const updateCall = (prisma.user.update as jest.Mock).mock.calls[0][0];
      const timestamp = updateCall.data.onboardingCompletedAt;
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should exclude sensitive fields from response', async () => {
      const completedUser = {
        ...mockUser,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date('2025-01-11'),
        seekerOnboardingCompleted: true,
      };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(completedUser);
      auditLogService.logOnboardingCompleted = jest.fn().mockResolvedValue(undefined);

      const result = await service.completeOnboarding('user-123', UserRole.SEEKER);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('passwordResetTokenHash');
      expect(result).not.toHaveProperty('passwordResetTokenExpiry');
    });

    it('should audit log completion event', async () => {
      const completedUser = {
        ...mockUser,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date('2025-01-11'),
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
      expect(auditLogService.logOnboardingCompleted).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCurrentUser', () => {
    it('should update user role (SEEKER → PROVIDER)', async () => {
      const updatedUser = { ...mockUser, role: UserRole.PROVIDER };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { role: UserRole.PROVIDER };
      const result = await service.updateCurrentUser('user-123', updateData, '127.0.0.1', 'test-agent');

      expect(result.role).toBe(UserRole.PROVIDER);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { role: UserRole.PROVIDER },
      });
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          actorUserId: 'user-123',
          actorRole: UserRole.SEEKER,
          action: 'USER_PROFILE_UPDATED',
          entityType: 'User',
          entityId: 'user-123',
          diff: { role: { from: UserRole.SEEKER, to: UserRole.PROVIDER } },
          ip: '127.0.0.1',
          ua: 'test-agent',
        },
      });
    });

    it('should update user name', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { name: 'Updated Name' };
      const result = await service.updateCurrentUser('user-123', updateData);

      expect(result.name).toBe('Updated Name');
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should update user phone', async () => {
      const updatedUser = { ...mockUser, phone: '9876543210' };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { phone: '9876543210' };
      const result = await service.updateCurrentUser('user-123', updateData);

      expect(result.phone).toBe('9876543210');
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should update user locale', async () => {
      const updatedUser = { ...mockUser, locale: 'th' };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { locale: 'th' };
      const result = await service.updateCurrentUser('user-123', updateData);

      expect(result.locale).toBe('th');
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const updateData: UpdateUserRequestDto = { name: 'New Name' };
      await expect(service.updateCurrentUser('non-existent', updateData)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when trying to set ADMIN role', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const updateData: UpdateUserRequestDto = { role: UserRole.ADMIN };
      await expect(service.updateCurrentUser('user-123', updateData)).rejects.toThrow(BadRequestException);
      await expect(service.updateCurrentUser('user-123', updateData)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: 'Cannot change role to ADMIN',
      });
    });

    it('should throw BadRequestException when trying to change ADMIN role', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockAdminUser);

      const updateData: UpdateUserRequestDto = { role: UserRole.PROVIDER };
      await expect(service.updateCurrentUser('admin-123', updateData)).rejects.toThrow(BadRequestException);
      await expect(service.updateCurrentUser('admin-123', updateData)).rejects.toThrow({
        code: 'BAD_REQUEST',
        message: 'Cannot change role of ADMIN user',
      });
    });

    it('should only update provided fields (partial updates)', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { name: 'Updated Name' };
      await service.updateCurrentUser('user-123', updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { name: 'Updated Name' },
      });
      expect(prisma.user.update).not.toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: expect.anything(),
            phone: expect.anything(),
            locale: expect.anything(),
          }),
        }),
      );
    });

    it('should exclude sensitive fields from response', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { name: 'Updated Name' };
      const result = await service.updateCurrentUser('user-123', updateData);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('passwordResetTokenHash');
      expect(result).not.toHaveProperty('passwordResetTokenExpiry');
    });

    it('should create audit log when fields change', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { name: 'Updated Name' };
      await service.updateCurrentUser('user-123', updateData, '127.0.0.1', 'test-agent');

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          actorUserId: 'user-123',
          actorRole: UserRole.SEEKER,
          action: 'USER_PROFILE_UPDATED',
          entityType: 'User',
          entityId: 'user-123',
          diff: { name: { from: 'Test User', to: 'Updated Name' } },
          ip: '127.0.0.1',
          ua: 'test-agent',
        },
      });
    });

    it('should not create audit log when no fields change', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(mockUser);

      const updateData: UpdateUserRequestDto = { name: 'Test User' }; // Same as current
      await service.updateCurrentUser('user-123', updateData);

      expect(prisma.auditLog.create).not.toHaveBeenCalled();
    });

    it('should track changes correctly (before/after values)', async () => {
      const updatedUser = {
        ...mockUser,
        role: UserRole.PROVIDER,
        name: 'Updated Name',
        phone: '9876543210',
      };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = {
        role: UserRole.PROVIDER,
        name: 'Updated Name',
        phone: '9876543210',
      };
      await service.updateCurrentUser('user-123', updateData);

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          diff: {
            role: { from: UserRole.SEEKER, to: UserRole.PROVIDER },
            name: { from: 'Test User', to: 'Updated Name' },
            phone: { from: '1234567890', to: '9876543210' },
          },
        }),
      });
    });

    it('should handle null values for optional fields', async () => {
      const updatedUser = { ...mockUser, name: null, phone: null };
      prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prisma.user.update = jest.fn().mockResolvedValue(updatedUser);
      prisma.auditLog.create = jest.fn().mockResolvedValue({});

      const updateData: UpdateUserRequestDto = { name: null, phone: null };
      const result = await service.updateCurrentUser('user-123', updateData);

      expect(result.name).toBeUndefined();
      expect(result.phone).toBeUndefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { name: null, phone: null },
      });
    });
  });
});

