import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { QuotesService } from './quotes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteResponseDto } from './dto/quote-response.dto';
import { UserRole } from '@prisma/client';

/**
 * Quotes Controller
 * 
 * Handles quote/proposal operations.
 * Quotes are the formal offers providers send to seekers.
 * 
 * Business Rules:
 * - Provider must have unlocked the request first (has a DRAFT proposal)
 * - Provider can only have one quote per request
 * - Seeker can accept/decline quotes
 * - Accepted quote transitions request to HIRED status
 */
@UseGuards(JwtAuthGuard)
@Controller()
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  /**
   * POST /requests/:requestId/quotes
   * Submit a quote for a request (Provider only)
   */
  @Post('requests/:requestId/quotes')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async submitQuote(
    @Param('requestId') requestId: string,
    @Body() dto: CreateQuoteDto,
    @Req() req: Request,
  ): Promise<QuoteResponseDto> {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    return this.quotesService.submitQuote(requestId, userId, dto);
  }

  /**
   * GET /requests/:requestId/quotes
   * List all quotes for a request (Seeker sees all proposals for their request)
   */
  @Get('requests/:requestId/quotes')
  async listQuotesForRequest(
    @Param('requestId') requestId: string,
    @Req() req: Request,
  ): Promise<QuoteResponseDto[]> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    return this.quotesService.listQuotesForRequest(requestId, userId, userRole);
  }

  /**
   * GET /quotes/:id
   * Get quote by ID
   */
  @Get('quotes/:id')
  async getQuote(
    @Param('id') quoteId: string,
    @Req() req: Request,
  ): Promise<QuoteResponseDto> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    return this.quotesService.getQuote(quoteId, userId, userRole);
  }

  /**
   * PATCH /quotes/:id
   * Update quote (accept/decline by seeker, update terms by provider)
   */
  @Patch('quotes/:id')
  async updateQuote(
    @Param('id') quoteId: string,
    @Body() dto: UpdateQuoteDto,
    @Req() req: Request,
  ): Promise<QuoteResponseDto> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    return this.quotesService.updateQuote(quoteId, userId, userRole, dto);
  }
}

