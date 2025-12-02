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
import { ProviderVerifiedGuard } from '../providers/guards/provider-verified.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteResponseDto } from './dto/quote-response.dto';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller()
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('requests/:requestId/quotes')
  @UseGuards(RolesGuard, ProviderVerifiedGuard)
  @Roles(UserRole.PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async submitQuote(
    @Param('requestId') requestId: string,
    @Body() dto: CreateQuoteDto,
    @Req() req: Request,
  ): Promise<QuoteResponseDto> {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Authentication required' });
    }
    return this.quotesService.submitQuote(requestId, userId, dto);
  }

  @Get('requests/:requestId/quotes')
  async listQuotesForRequest(
    @Param('requestId') requestId: string,
    @Req() req: Request,
  ): Promise<QuoteResponseDto[]> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;
    if (!userId) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Authentication required' });
    }
    return this.quotesService.listQuotesForRequest(requestId, userId, userRole);
  }

  @Get('quotes/:id')
  async getQuote(@Param('id') quoteId: string, @Req() req: Request): Promise<QuoteResponseDto> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;
    if (!userId) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Authentication required' });
    }
    return this.quotesService.getQuote(quoteId, userId, userRole);
  }

  @Patch('quotes/:id')
  async updateQuote(
    @Param('id') quoteId: string,
    @Body() dto: UpdateQuoteDto,
    @Req() req: Request,
  ): Promise<QuoteResponseDto> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;
    if (!userId) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Authentication required' });
    }
    return this.quotesService.updateQuote(quoteId, userId, userRole, dto);
  }
}
