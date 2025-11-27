import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { PrismaService } from '../common/services/prisma.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { Prisma, RequestStatus, UserRole } from '@prisma/client';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

describe('RequestsService', () => {
  let service: RequestsService;
  let prisma: jest.Mocked<PrismaService>;
  let auditLogService: jest.Mocked<AuditLogService>;

  const mockRequestRecord = {
    id: 'req-123',
    seekerId: 'user-123',
    title: 'Need visa help',
    description: 'Full description',
    visaType: 'Tourist',
    budgetMin: new Prisma.Decimal(1000),
    budgetMax: new Prisma.Decimal(2000),
    location: 'Bangkok',
    status: RequestStatus.DRAFT,
    createdAt: new Date('2025-01-10T00:00:00Z'),
  };

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
      request: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    } as unknown as jest.Mocked<PrismaService>;

    const mockAudit = {
      logRequestCreated: jest.fn(),
      logRequestUpdated: jest.fn(),
    } as unknown as jest.Mocked<AuditLogService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: AuditLogService,
          useValue: mockAudit,
        },
      ],
    }).compile();

    service = module.get(RequestsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    auditLogService = module.get(AuditLogService) as jest.Mocked<AuditLogService>;

    prisma.$transaction = jest
      .fn()
      .mockImplementation(async (operations: Promise<unknown>[]) => Promise.all(operations));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listRequests', () => {
    it('returns paginated data with metadata', async () => {
      prisma.request.findMany = jest.fn().mockResolvedValue([mockRequestRecord]);
      prisma.request.count = jest.fn().mockResolvedValue(1);

      const result = await service.listRequests({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
      expect(prisma.request.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 10,
        }),
      );
    });
  });

  describe('createRequest', () => {
    const createDto: CreateRequestDto = {
      title: 'Need visa help',
      description: 'Full description',
      visaType: 'Tourist',
      budgetMin: 1000,
      budgetMax: 2000,
      location: 'Bangkok',
    };

    it('creates a request for seeker role', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue({ id: 'user-123', role: UserRole.SEEKER });
      prisma.request.create = jest.fn().mockResolvedValue(mockRequestRecord);

      const result = await service.createRequest('user-123', UserRole.SEEKER, createDto, '127.0.0.1', 'jest');

      expect(result.id).toBe(mockRequestRecord.id);
      expect(prisma.request.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            seekerId: 'user-123',
            status: RequestStatus.DRAFT,
          }),
        }),
      );
      expect(auditLogService.logRequestCreated).toHaveBeenCalledWith(
        mockRequestRecord.id,
        'user-123',
        '127.0.0.1',
        'jest',
      );
    });

    it('throws ForbiddenException when role is not seeker', async () => {
      await expect(service.createRequest('user-123', UserRole.PROVIDER, createDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('validates budget range before creating', async () => {
      const invalidDto = { ...createDto, budgetMin: 5000, budgetMax: 2000 };
      prisma.user.findUnique = jest.fn().mockResolvedValue({ id: 'user-123', role: UserRole.SEEKER });

      await expect(service.createRequest('user-123', UserRole.SEEKER, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateRequest', () => {
    const updateDto: UpdateRequestDto = {
      status: RequestStatus.OPEN,
      title: 'Updated title',
    };

    it('updates request for owner', async () => {
      prisma.request.findUnique = jest.fn().mockResolvedValue(mockRequestRecord);
      prisma.request.update = jest
        .fn()
        .mockResolvedValue({ ...mockRequestRecord, status: RequestStatus.OPEN, title: 'Updated title' });

      const result = await service.updateRequest('req-123', 'user-123', UserRole.SEEKER, updateDto);

      expect(result.status).toBe(RequestStatus.OPEN);
      expect(prisma.request.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'req-123' },
          data: expect.objectContaining({ status: RequestStatus.OPEN, title: 'Updated title' }),
        }),
      );
      expect(auditLogService.logRequestUpdated).toHaveBeenCalledWith(
        'req-123',
        'user-123',
        UserRole.SEEKER,
        expect.any(Object),
        undefined,
        undefined,
      );
    });

    it('rejects invalid status transitions', async () => {
      prisma.request.findUnique = jest.fn().mockResolvedValue({
        ...mockRequestRecord,
        status: RequestStatus.OPEN,
      });

      await expect(
        service.updateRequest('req-123', 'user-123', UserRole.SEEKER, { status: RequestStatus.DRAFT }),
      ).rejects.toThrow(BadRequestException);
    });

    it('prevents non-owners from updating requests', async () => {
      prisma.request.findUnique = jest.fn().mockResolvedValue(mockRequestRecord);

      await expect(
        service.updateRequest('req-123', 'other-user', UserRole.PROVIDER, { title: 'x' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

