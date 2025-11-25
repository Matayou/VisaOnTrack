import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import {
  Prisma,
  Request as PrismaRequest,
  RequestStatus,
  UserRole,
  CreditTransactionType,
  ProposalStatus,
} from '@prisma/client';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { RequestListResponseDto } from './dto/request-list-response.dto';
import { ListRequestsQueryDto } from './dto/list-requests-query.dto';
import { AuditLogService } from '../common/services/audit-log.service';

@Injectable()
export class RequestsService {
  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_LIMIT = 20;
  private readonly MAX_LIMIT = 100;

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * List visa requests with pagination and optional filters
   * GET /requests
   */
  async listRequests(
    query: ListRequestsQueryDto,
    viewerId?: string,
    viewerRole?: UserRole | string,
  ): Promise<RequestListResponseDto> {
    const page = query.page ?? this.DEFAULT_PAGE;
    const limit = Math.min(query.limit ?? this.DEFAULT_LIMIT, this.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where: Prisma.RequestWhereInput = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.seekerId) {
      where.seekerId = query.seekerId;
    }

    // For Providers, we might want to know if they've unlocked/quoted
    const include: Prisma.RequestInclude = {};
    if (viewerRole === UserRole.PROVIDER && viewerId) {
      // Look up the provider profile ID for the current user
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId: viewerId },
        select: { id: true },
      });

      if (provider) {
        include.proposals = {
          where: { providerId: provider.id },
          select: { id: true, status: true },
        };
      }
    }

    const [requests, total] = await this.prisma.$transaction([
      this.prisma.request.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: Object.keys(include).length > 0 ? include : undefined,
      }),
      this.prisma.request.count({ where }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      data: requests.map((request) => {
        const dto = this.mapRequest(request);
        
        // Enhance with provider context if available
        if (viewerRole === UserRole.PROVIDER && (request as any).proposals) {
          const myProposals = (request as any).proposals as { status: ProposalStatus }[];
          if (myProposals.length > 0) {
            dto.unlockStatus = 'UNLOCKED'; // Or map specific status if needed
          } else {
            dto.unlockStatus = 'LOCKED';
          }
        }
        return dto;
      }),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Create a new request (SEEKER role only)
   * POST /requests
   */
  async createRequest(
    userId: string,
    role: UserRole | undefined,
    dto: CreateRequestDto,
    ip?: string,
    ua?: string,
  ): Promise<RequestResponseDto> {
    if (!role || role !== UserRole.SEEKER) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Only SEEKER accounts can create requests',
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    if (user.role !== UserRole.SEEKER) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Only SEEKER accounts can create requests',
      });
    }

    this.validateBudgetRange(dto.budgetMin, dto.budgetMax);

    const request = await this.prisma.request.create({
      data: {
        seekerId: userId,
        title: this.sanitizeRequiredString(dto.title, 'title'),
        description: this.sanitizeRequiredString(dto.description, 'description'),
        visaType: this.sanitizeNullableString(dto.visaType),
        budget: this.formatBudget(dto.budgetMin, dto.budgetMax),
        location: this.sanitizeNullableString(dto.location),
        intakeData: dto.intakeData ?? Prisma.DbNull,
        status: RequestStatus.DRAFT,
      },
    });

    await this.auditLogService.logRequestCreated(request.id, userId, ip, ua || 'unknown');

    return this.mapRequest(request);
  }

  /**
   * Get request by ID
   * GET /requests/{id}
   */
  async getRequestById(requestId: string): Promise<RequestResponseDto> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Request not found',
      });
    }

    return this.mapRequest(request);
  }

  /**
   * Update request fields (owner or ADMIN)
   * PATCH /requests/{id}
   */
  async updateRequest(
    requestId: string,
    userId: string,
    role: UserRole | undefined,
    dto: UpdateRequestDto,
    ip?: string,
    ua?: string,
  ): Promise<RequestResponseDto> {
    if (
      dto.title === undefined &&
      dto.description === undefined &&
      dto.visaType === undefined &&
      dto.budgetMin === undefined &&
      dto.budgetMax === undefined &&
      dto.location === undefined &&
      dto.status === undefined
    ) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Provide at least one field to update',
      });
    }

    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Request not found',
      });
    }

    if (request.seekerId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this request',
      });
    }

    const { budgetMin: currentBudgetMin, budgetMax: currentBudgetMax } = this.parseBudget(request.budget);

    const nextBudgetMin = dto.budgetMin !== undefined ? dto.budgetMin : currentBudgetMin;
    const nextBudgetMax = dto.budgetMax !== undefined ? dto.budgetMax : currentBudgetMax;

    this.validateBudgetRange(nextBudgetMin, nextBudgetMax);

    if (dto.status) {
      this.validateStatusTransition(request.status, dto.status);
    }

    const changes: Record<string, unknown> = {};
    const data: Prisma.RequestUpdateInput = {};

    if (dto.title !== undefined) {
      const title = this.sanitizeRequiredString(dto.title, 'title');
      data.title = title;
      if (title !== request.title) {
        changes.title = { from: request.title, to: title };
      }
    }

    if (dto.description !== undefined) {
      const description = this.sanitizeRequiredString(dto.description, 'description');
      data.description = description;
      if (description !== request.description) {
        changes.description = { from: request.description, to: description };
      }
    }

    if (dto.visaType !== undefined) {
      const visaType = this.sanitizeNullableString(dto.visaType);
      data.visaType = visaType;
      if (visaType !== request.visaType) {
        changes.visaType = { from: request.visaType, to: visaType };
      }
    }

    if (dto.location !== undefined) {
      const location = this.sanitizeNullableString(dto.location);
      data.location = location;
      if (location !== request.location) {
        changes.location = { from: request.location, to: location };
      }
    }

    if (dto.budgetMin !== undefined || dto.budgetMax !== undefined) {
      const newBudget = this.formatBudget(
        dto.budgetMin !== undefined ? dto.budgetMin : currentBudgetMin,
        dto.budgetMax !== undefined ? dto.budgetMax : currentBudgetMax,
      );
      data.budget = newBudget;
      if (newBudget !== request.budget) {
        changes.budget = { from: request.budget, to: newBudget };
      }
    }

    if (dto.status !== undefined && dto.status !== request.status) {
      data.status = dto.status;
      changes.status = { from: request.status, to: dto.status };
    }

    if (Object.keys(data).length === 0) {
      // Nothing changed; return current state
      return this.mapRequest(request);
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id: requestId },
      data,
    });

    if (Object.keys(changes).length > 0) {
      await this.auditLogService.logRequestUpdated(
        requestId,
        userId,
        role ?? UserRole.SEEKER,
        changes as Prisma.InputJsonValue,
        ip,
        ua || 'unknown',
      );
    }

    return this.mapRequest(updatedRequest);
  }

  /**
   * Unlock a request for a provider
   * Deducts 1 credit and creates a DRAFT proposal
   */
  async unlockRequest(requestId: string, providerUserId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId: providerUserId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // Check if already unlocked (Proposal exists)
    const existingProposal = await this.prisma.proposal.findFirst({
      where: {
        requestId,
        providerId: provider.id,
      },
    });

    if (existingProposal) {
      throw new BadRequestException('Request already unlocked');
    }

    // Check credits
    const COST = 1;
    if (provider.credits < COST) {
      throw new ForbiddenException('Insufficient credits to unlock request');
    }

    // Transaction: Deduct credit, Create Proposal, Log Transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Deduct Credit
      await tx.providerProfile.update({
        where: { id: provider.id },
        data: { credits: { decrement: COST } },
      });

      // 2. Create Credit Transaction
      await tx.creditTransaction.create({
        data: {
          providerId: provider.id,
          amount: -COST,
          type: CreditTransactionType.SPEND,
          reason: `Unlock Request: ${requestId}`,
        },
      });

      // 3. Create Proposal (Draft)
      const proposal = await tx.proposal.create({
        data: {
          requestId,
          providerId: provider.id,
          totalTHB: 0, // Placeholder
          status: ProposalStatus.DRAFT,
        },
      });

      return { success: true, proposalId: proposal.id, remainingCredits: provider.credits - COST };
    });
  }

  private sanitizeRequiredString(value: string, field: string): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: `${field} cannot be empty`,
      });
    }
    return trimmed;
  }

  private sanitizeNullableString(value?: string | null): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private validateBudgetRange(budgetMin?: number | null, budgetMax?: number | null): void {
    if (
      budgetMin !== undefined &&
      budgetMin !== null &&
      budgetMax !== undefined &&
      budgetMax !== null &&
      budgetMin > budgetMax
    ) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'budgetMin cannot be greater than budgetMax',
      });
    }
  }

  private validateStatusTransition(current: RequestStatus, next: RequestStatus): void {
    if (current === next) {
      return;
    }

    if (current === RequestStatus.DRAFT) {
      if (next !== RequestStatus.OPEN) {
        throw new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Draft requests can only transition to OPEN',
        });
      }
      return;
    }

    if (current === RequestStatus.OPEN) {
      if (next !== RequestStatus.CLOSED && next !== RequestStatus.HIRED) {
        throw new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Open requests can only transition to CLOSED or HIRED',
        });
      }
      return;
    }

    throw new BadRequestException({
      code: 'BAD_REQUEST',
      message: `Requests with status ${current} cannot transition to ${next}`,
    });
  }

  private mapRequest(request: PrismaRequest): RequestResponseDto {
    const { budgetMin, budgetMax } = this.parseBudget(request.budget);
    return {
      id: request.id,
      seekerId: request.seekerId,
      title: request.title,
      description: request.description,
      visaType: request.visaType ?? null,
      budgetMin,
      budgetMax,
      location: request.location ?? null,
      status: request.status,
      createdAt: request.createdAt,
      intakeData: request.intakeData,
    };
  }

  /**
   * Format budgetMin and budgetMax into a budget string (e.g., "THB 50k-80k")
   */
  private formatBudget(budgetMin?: number | null, budgetMax?: number | null): string | null {
    if (budgetMin === null || budgetMin === undefined) {
      if (budgetMax === null || budgetMax === undefined) {
        return null;
      }
      return `THB ${this.formatBudgetValue(budgetMax)}+`;
    }
    if (budgetMax === null || budgetMax === undefined) {
      return `THB ${this.formatBudgetValue(budgetMin)}+`;
    }
    return `THB ${this.formatBudgetValue(budgetMin)}-${this.formatBudgetValue(budgetMax)}`;
  }

  /**
   * Format a budget value (e.g., 50000 -> "50k")
   */
  private formatBudgetValue(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`.replace('.0', '');
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  }

  /**
   * Parse budget string back to budgetMin and budgetMax
   */
  private parseBudget(budget: string | null): { budgetMin: number | null; budgetMax: number | null } {
    if (!budget) {
      return { budgetMin: null, budgetMax: null };
    }

    // Try to parse formats like "THB 50k-80k", "THB 50k+", "THB 50k"
    const match = budget.match(/THB\s*(\d+(?:\.\d+)?[kM]?)(?:-(\d+(?:\.\d+)?[kM]?))?(\+)?/i);
    if (!match) {
      return { budgetMin: null, budgetMax: null };
    }

    const parseValue = (val: string): number => {
      if (val.endsWith('M')) {
        return parseFloat(val) * 1000000;
      }
      if (val.endsWith('k')) {
        return parseFloat(val) * 1000;
      }
      return parseFloat(val);
    };

    const min = parseValue(match[1]);
    const max = match[2] ? parseValue(match[2]) : match[3] ? null : min;

    return { budgetMin: min, budgetMax: max };
  }
}
