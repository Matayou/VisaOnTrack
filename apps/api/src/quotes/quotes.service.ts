import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserRole, ProposalStatus, RequestStatus } from '@prisma/client';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto, QuoteStatus } from './dto/update-quote.dto';
import { QuoteResponseDto } from './dto/quote-response.dto';
import { QuoteItemDto } from './dto/quote-item.dto';

/**
 * Extended Proposal data structure for storing quote items
 * Items are stored as JSON in the terms field with a special prefix
 */
interface QuoteData {
  items: QuoteItemDto[];
  terms: string | null;
  etaDays: number;
}

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Submit a quote for a request
   * POST /requests/{id}/quotes
   * 
   * Business Rules:
   * 1. Provider must have unlocked the request (has a DRAFT proposal)
   * 2. Provider can only have one active quote per request
   * 3. Request must be OPEN
   */
  async submitQuote(
    requestId: string,
    userId: string,
    dto: CreateQuoteDto,
  ): Promise<QuoteResponseDto> {
    // Get provider profile
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
      select: { id: true, businessName: true, businessType: true, yearsExperience: true, verifiedAt: true },
    });

    if (!provider) {
      throw new ForbiddenException('Provider profile not found');
    }

    // Check request exists and is OPEN
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== RequestStatus.OPEN) {
      throw new ForbiddenException(
        `Cannot submit quote on ${request.status.toLowerCase()} requests`,
      );
    }

    // Check if provider has unlocked (has a proposal for this request)
    const existingProposal = await this.prisma.proposal.findFirst({
      where: {
        requestId,
        providerId: provider.id,
      },
    });

    if (!existingProposal) {
      throw new ForbiddenException(
        'You must unlock this request before submitting a quote. Use 1 credit to unlock.',
      );
    }

    // Check if proposal is already submitted (not DRAFT)
    if (existingProposal.status !== ProposalStatus.DRAFT) {
      throw new ConflictException(
        'You have already submitted a quote for this request',
      );
    }

    // Validate total matches sum of items
    const calculatedTotal = dto.items.reduce(
      (sum, item) => sum + item.priceTHB * item.quantity,
      0,
    );
    
    if (Math.abs(calculatedTotal - dto.totalTHB) > 0.01) {
      throw new BadRequestException(
        `Total (${dto.totalTHB}) does not match sum of items (${calculatedTotal})`,
      );
    }

    // Store quote data as JSON in terms field
    const quoteData: QuoteData = {
      items: dto.items,
      terms: dto.terms || null,
      etaDays: dto.etaDays,
    };

    // Update the DRAFT proposal to PENDING with quote data
    const updatedProposal = await this.prisma.proposal.update({
      where: { id: existingProposal.id },
      data: {
        totalTHB: dto.totalTHB,
        timeline: `${dto.etaDays} days`,
        terms: JSON.stringify(quoteData),
        status: ProposalStatus.PENDING,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    return this.mapProposalToQuote(updatedProposal);
  }

  /**
   * Get quote by ID
   * GET /quotes/{id}
   */
  async getQuote(
    quoteId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<QuoteResponseDto> {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: quoteId },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
            userId: true,
          },
        },
        request: {
          select: {
            seekerId: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new NotFoundException('Quote not found');
    }

    // Authorization check
    const isSeeker = userRole === UserRole.SEEKER && proposal.request.seekerId === userId;
    const isProvider = userRole === UserRole.PROVIDER && proposal.provider.userId === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isSeeker && !isProvider && !isAdmin) {
      throw new ForbiddenException('Not authorized to view this quote');
    }

    return this.mapProposalToQuote(proposal);
  }

  /**
   * Update quote (accept/decline)
   * PATCH /quotes/{id}
   * 
   * Business Rules:
   * - Seeker can ACCEPT or DECLINE
   * - Provider can update terms (if still PENDING)
   * - Accepted quote transitions request to HIRED
   */
  async updateQuote(
    quoteId: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateQuoteDto,
  ): Promise<QuoteResponseDto> {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: quoteId },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
            userId: true,
          },
        },
        request: {
          select: {
            id: true,
            seekerId: true,
            status: true,
          },
        },
      },
    });

    if (!proposal) {
      throw new NotFoundException('Quote not found');
    }

    const isSeeker = userRole === UserRole.SEEKER && proposal.request.seekerId === userId;
    const isProvider = userRole === UserRole.PROVIDER && proposal.provider.userId === userId;

    if (!isSeeker && !isProvider && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Not authorized to update this quote');
    }

    // Validate status transitions
    if (dto.status) {
      await this.validateStatusTransition(
        proposal.status,
        dto.status,
        isSeeker,
        isProvider,
      );
    }

    // Build update data
    const updateData: any = {};

    if (dto.status) {
      updateData.status = this.mapQuoteStatusToProposalStatus(dto.status);
    }

    if (dto.terms !== undefined && isProvider) {
      // Provider updating terms - merge with existing quote data
      const existingData = this.parseQuoteData(proposal.terms);
      existingData.terms = dto.terms;
      updateData.terms = JSON.stringify(existingData);
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    // Update proposal
    const updatedProposal = await this.prisma.proposal.update({
      where: { id: quoteId },
      data: updateData,
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
    });

    // If quote was accepted, transition request to HIRED
    if (dto.status === QuoteStatus.ACCEPTED) {
      await this.prisma.request.update({
        where: { id: proposal.requestId },
        data: { status: RequestStatus.HIRED },
      });
    }

    return this.mapProposalToQuote(updatedProposal);
  }

  /**
   * List quotes for a request (for seekers to see all proposals)
   */
  async listQuotesForRequest(
    requestId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<QuoteResponseDto[]> {
    // Check request exists
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Authorization: Only seeker who owns the request can see all quotes
    if (userRole === UserRole.SEEKER && request.seekerId !== userId) {
      throw new ForbiddenException('Not authorized to view quotes for this request');
    }

    // Get all non-DRAFT proposals for this request
    const proposals = await this.prisma.proposal.findMany({
      where: {
        requestId,
        status: {
          not: ProposalStatus.DRAFT,
        },
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            yearsExperience: true,
            verifiedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return proposals.map((p) => this.mapProposalToQuote(p));
  }

  /**
   * Validate status transition
   */
  private async validateStatusTransition(
    currentStatus: ProposalStatus,
    newStatus: QuoteStatus,
    isSeeker: boolean,
    isProvider: boolean,
  ): Promise<void> {
    // Only PENDING quotes can be accepted/declined
    if (currentStatus !== ProposalStatus.PENDING) {
      throw new BadRequestException(
        `Cannot change status of ${currentStatus.toLowerCase()} quote`,
      );
    }

    // Seeker can only accept or decline
    if (isSeeker) {
      if (newStatus !== QuoteStatus.ACCEPTED && newStatus !== QuoteStatus.DECLINED) {
        throw new ForbiddenException('Seekers can only accept or decline quotes');
      }
    }

    // Provider cannot accept their own quote
    if (isProvider && newStatus === QuoteStatus.ACCEPTED) {
      throw new ForbiddenException('Providers cannot accept their own quotes');
    }
  }

  /**
   * Map QuoteStatus enum to ProposalStatus
   */
  private mapQuoteStatusToProposalStatus(status: QuoteStatus): ProposalStatus {
    const mapping: Record<QuoteStatus, ProposalStatus> = {
      [QuoteStatus.PENDING]: ProposalStatus.PENDING,
      [QuoteStatus.ACCEPTED]: ProposalStatus.ACCEPTED,
      [QuoteStatus.DECLINED]: ProposalStatus.DECLINED,
      [QuoteStatus.EXPIRED]: ProposalStatus.EXPIRED,
    };
    return mapping[status];
  }

  /**
   * Parse quote data from terms JSON
   */
  private parseQuoteData(terms: string | null): QuoteData {
    if (!terms) {
      return { items: [], terms: null, etaDays: 0 };
    }

    try {
      return JSON.parse(terms) as QuoteData;
    } catch {
      // If terms is not JSON, treat it as plain terms text
      return { items: [], terms, etaDays: 0 };
    }
  }

  /**
   * Map Prisma Proposal to QuoteResponseDto
   */
  private mapProposalToQuote(proposal: any): QuoteResponseDto {
    const quoteData = this.parseQuoteData(proposal.terms);
    
    // Parse etaDays from timeline
    let etaDays = quoteData.etaDays || 0;
    if (proposal.timeline && !etaDays) {
      const match = proposal.timeline.match(/(\d+)/);
      etaDays = match ? parseInt(match[1], 10) : 0;
    }

    // Calculate validUntil (7 days from creation for PENDING)
    let validUntil: Date | null = null;
    if (proposal.status === ProposalStatus.PENDING) {
      validUntil = new Date(proposal.createdAt);
      validUntil.setDate(validUntil.getDate() + 7);
    }

    return {
      id: proposal.id,
      requestId: proposal.requestId,
      providerId: proposal.providerId,
      items: quoteData.items || [],
      totalTHB: Number(proposal.totalTHB),
      etaDays,
      terms: quoteData.terms,
      status: proposal.status,
      validUntil,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
      provider: proposal.provider
        ? {
            id: proposal.provider.id,
            businessName: proposal.provider.businessName,
            businessType: proposal.provider.businessType,
            yearsExperience: proposal.provider.yearsExperience,
            verifiedAt: proposal.provider.verifiedAt,
          }
        : undefined,
    };
  }
}

