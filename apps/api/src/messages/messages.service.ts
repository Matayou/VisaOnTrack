import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserRole, RequestStatus, ProposalStatus } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto, MessageListResponseDto, PaginationMetaDto } from './dto/message-response.dto';
import { EntitlementsService } from '../billing/entitlements.service';

@Injectable()
export class MessagesService {
  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_LIMIT = 20;
  private readonly MAX_LIMIT = 100;

  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: EntitlementsService,
  ) {}

  /**
   * List messages for a request with pagination
   * GET /requests/{id}/messages
   * 
   * Security:
   * - SEEKER: Must own the request
   * - PROVIDER: Must have unlocked the request (has a proposal)
   */
  async listMessages(
    requestId: string,
    userId: string,
    userRole: UserRole,
    page: number = this.DEFAULT_PAGE,
    limit: number = this.DEFAULT_LIMIT,
  ): Promise<MessageListResponseDto> {
    // Validate limit
    limit = Math.min(limit, this.MAX_LIMIT);
    const skip = (page - 1) * limit;

    // Get the request
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Authorization check
    await this.authorizeMessageAccess(request, userId, userRole, 'read');

    // Fetch messages with sender info
    const [messages, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where: { requestId },
        orderBy: { createdAt: 'asc' }, // Chronological order
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.message.count({
        where: { requestId },
      }),
    ]);

    // Get attachments for all messages
    const messageIds = messages.map((m) => m.id);
    // Note: The current schema doesn't have a direct message-attachment relation
    // Attachments are linked to requests, not individual messages
    // For now, we'll return messages without attachments linkage

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    const meta: PaginationMetaDto = {
      page,
      limit,
      total,
      totalPages,
    };

    return {
      data: messages.map((message) => this.mapMessageToDto(message)),
      meta,
    };
  }

  /**
   * Send a message in a request thread
   * POST /requests/{id}/messages
   * 
   * Security Rules (from MESSAGING_BUSINESS_RULES.md):
   * 1. Request must be OPEN (not DRAFT/CLOSED/HIRED)
   * 2. SEEKER: Can only message on their OWN requests
   * 3. PROVIDER: Must have messaging entitlement (PRO/AGENCY plan)
   * 4. PROVIDER: Must have UNLOCKED the request (has a proposal)
   */
  async sendMessage(
    requestId: string,
    userId: string,
    userRole: UserRole,
    dto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    // Get the request
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Rule 1: Request must be OPEN
    if (request.status !== RequestStatus.OPEN) {
      throw new ForbiddenException(
        `Cannot message on ${request.status.toLowerCase()} requests. Request must be open.`,
      );
    }

    // Authorization check (includes entitlement and unlock validation)
    await this.authorizeMessageAccess(request, userId, userRole, 'write');

    // Validate body
    if (!dto.body || dto.body.trim().length === 0) {
      throw new BadRequestException('Message body cannot be empty');
    }

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        requestId,
        senderId: userId,
        body: dto.body.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // If attachmentIds provided, associate them with the request
    // Note: Current schema links attachments to requests, not messages
    if (dto.attachmentIds && dto.attachmentIds.length > 0) {
      await this.prisma.attachment.updateMany({
        where: {
          id: { in: dto.attachmentIds },
          ownerUserId: userId,
          requestId: null, // Only update unassigned attachments
        },
        data: {
          requestId,
        },
      });
    }

    return this.mapMessageToDto(message);
  }

  /**
   * Authorization helper for message access
   * 
   * @param request - The request entity
   * @param userId - Current user ID
   * @param userRole - Current user role
   * @param action - 'read' or 'write'
   */
  private async authorizeMessageAccess(
    request: { id: string; seekerId: string; status: RequestStatus },
    userId: string,
    userRole: UserRole,
    action: 'read' | 'write',
  ): Promise<void> {
    if (userRole === UserRole.SEEKER) {
      // Rule 2: Seekers can only message on their OWN requests
      if (request.seekerId !== userId) {
        throw new ForbiddenException(
          'You can only view/send messages on your own requests',
        );
      }
      // Seeker is authorized ✓
      return;
    }

    if (userRole === UserRole.PROVIDER) {
      // Rule 3: Provider must have messaging entitlement (for write actions)
      if (action === 'write') {
        try {
          await this.entitlements.requireEntitlement(userId, 'messaging.enabled');
        } catch (error) {
          throw new ForbiddenException({
            code: 'MESSAGING_REQUIRES_UPGRADE',
            message: 'Messaging requires PRO or AGENCY plan. Please upgrade to communicate with seekers.',
            upgradeUrl: '/pricing',
            feature: 'messaging',
          });
        }
      }

      // Rule 4: Provider must have unlocked the request (has a proposal)
      const provider = await this.prisma.providerProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!provider) {
        throw new ForbiddenException('Provider profile not found');
      }

      const proposal = await this.prisma.proposal.findFirst({
        where: {
          requestId: request.id,
          providerId: provider.id,
          // Any proposal status means they've unlocked
          status: {
            in: [
              ProposalStatus.DRAFT,
              ProposalStatus.PENDING,
              ProposalStatus.ACCEPTED,
              ProposalStatus.DECLINED,
            ],
          },
        },
      });

      if (!proposal) {
        throw new ForbiddenException(
          'You must unlock this request before messaging the seeker. Use 1 credit to unlock.',
        );
      }

      // Provider is authorized ✓
      return;
    }

    // ADMIN role: Allow all access
    if (userRole === UserRole.ADMIN) {
      return;
    }

    throw new ForbiddenException('Not authorized to access messages');
  }

  /**
   * Map Prisma message to DTO
   */
  private mapMessageToDto(message: any): MessageResponseDto {
    return {
      id: message.id,
      requestId: message.requestId,
      senderId: message.senderId,
      body: message.body,
      createdAt: message.createdAt,
      sender: message.sender
        ? {
            id: message.sender.id,
            name: message.sender.name,
            email: message.sender.email,
            role: message.sender.role,
          }
        : undefined,
    };
  }
}

