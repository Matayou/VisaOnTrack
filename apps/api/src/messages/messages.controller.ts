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
import { ProviderVerifiedGuard } from '../providers/guards/provider-verified.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { ListMessagesQueryDto } from './dto/list-messages-query.dto';
import { MessageResponseDto, MessageListResponseDto } from './dto/message-response.dto';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, ProviderVerifiedGuard)
@Controller('requests/:requestId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async listMessages(
    @Param('requestId') requestId: string,
    @Query() query: ListMessagesQueryDto,
    @Req() req: Request,
  ): Promise<MessageListResponseDto> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role as UserRole;
    if (!userId) {
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Authentication required' });
    }
    return this.messagesService.listMessages(requestId, userId, userRole, query.page, query.limit);
  }

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
      throw new UnauthorizedException({ code: 'UNAUTHORIZED', message: 'Authentication required' });
    }
    return this.messagesService.sendMessage(requestId, userId, userRole, dto);
  }
}
