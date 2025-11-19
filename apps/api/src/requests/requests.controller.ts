import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestsService } from './requests.service';
import { ListRequestsQueryDto } from './dto/list-requests-query.dto';
import { RequestListResponseDto } from './dto/request-list-response.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async listRequests(@Query() query: ListRequestsQueryDto): Promise<RequestListResponseDto> {
    return this.requestsService.listRequests(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRequest(
    @Body() dto: CreateRequestDto,
    @Req() req: ExpressRequest,
  ): Promise<RequestResponseDto> {
    const auth = (req as any).user;
    const userId = auth?.userId;
    const role = auth?.role as UserRole | undefined;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    return this.requestsService.createRequest(userId, role, dto, ip, ua);
  }

  @Get(':id')
  async getRequest(@Param('id') id: string): Promise<RequestResponseDto> {
    return this.requestsService.getRequestById(id);
  }

  @Patch(':id')
  async updateRequest(
    @Param('id') id: string,
    @Body() dto: UpdateRequestDto,
    @Req() req: ExpressRequest,
  ): Promise<RequestResponseDto> {
    const auth = (req as any).user;
    const userId = auth?.userId;
    const role = auth?.role as UserRole | undefined;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    return this.requestsService.updateRequest(id, userId, role, dto, ip, ua);
  }
}

