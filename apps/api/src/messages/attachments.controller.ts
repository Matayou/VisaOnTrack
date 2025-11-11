import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  BadRequestException,
  UnauthorizedException,
  PayloadTooLargeException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AttachmentsService } from './attachments.service';
import { AttachmentResponseDto } from './dto/attachment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';

/**
 * File type from multer
 */
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/**
 * DTO for upload attachment request body (non-file fields)
 */
class UploadAttachmentRequestDto {
  @IsOptional()
  @IsUUID()
  requestId?: string;

  @IsOptional()
  @IsUUID()
  orderId?: string;
}

/**
 * Attachments Controller
 * 
 * Endpoints require authentication via JWT token in HttpOnly cookie (cookieAuth).
 * JWT guard extracts and validates token, attaching userId to request.
 */
@UseGuards(JwtAuthGuard)
@Controller('messages/attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  /**
   * POST /messages/attachments
   * Upload attachment file
   * 
   * Security: cookieAuth (JWT token required)
   * Request: multipart/form-data with file and optional requestId/orderId
   * Response: Attachment schema (200 OK)
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @UploadedFile() file: MulterFile,
    @Body() body: UploadAttachmentRequestDto,
    @Req() req: Request,
  ): Promise<AttachmentResponseDto> {
    // userId is extracted by JwtAuthGuard and attached to req.user
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Extract IP and User-Agent for audit logging
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    const ua = req.headers['user-agent'] || undefined;

    try {
      return await this.attachmentsService.uploadAttachment(
        userId,
        file,
        body.requestId,
        body.orderId,
        ip,
        ua,
      );
    } catch (error) {
      // Re-throw known exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof PayloadTooLargeException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      // Log unexpected errors
      console.error('[AttachmentsController] Error in uploadAttachment:', error);

      throw new BadRequestException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while uploading the file. Please try again later.',
      });
    }
  }
}

