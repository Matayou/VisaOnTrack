import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { ListMessagesQueryDto } from './dto/list-messages-query.dto';
import { MessageResponseDto, MessageListResponseDto } from './dto/message-response.dto';
import { UserRole } from '@prisma/client';

/**
 * Messages Controller
 * 
 * Handles message operations for request threads.
 * All endpoints require authentication via JWT token in HttpOnly cookie.
 * 
 * Business Rules (see docs/analysis/MESSAGING_BUSINESS_RULES.md):
 * - Messaging is ALWAYS request-scoped (no general provider messaging)
 * - Seekers can message on their OWN requests
 * - Providers must have UNLOCKED the request AND have PRO/AGENCY plan
 */
@UseGuards(JwtAuthGuard)
@Controller('requests/:requestId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * GET /requests/:requestId/messages
   * List messages for a request with pagination
   * 
   * Access Control:
   * - SEEKER: Must own the request
   * - PROVIDER: Must have unlocked the request
   */
  @Get()
  async listMessages(
    @Param('requestId') requestId: string,
    @Query() query: ListMessagesQueryDto,
    @Req() req: Request,
  ): Promise<MessageListResponseDto> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    return this.messagesService.listMessages(
      requestId,
      userId,
      userRole,
      query.page,
      query.limit,
    );
  }

  /**
   * POST /requests/:requestId/messages
   * Send a message in the request thread
   * 
   * Access Control:
   * - SEEKER: Must own the request, request must be OPEN
   * - PROVIDER: Must have unlocked + PRO/AGENCY plan, request must be OPEN
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Param('requestId') requestId: string,
    @Body() dto: CreateMessageDto,
    @Req() req: Request,
  ): Promise<MessageResponseDto> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    return this.messagesService.sendMessage(requestId, userId, userRole, dto);
  }
}

