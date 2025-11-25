import {
  Injectable,
  BadRequestException,
  PayloadTooLargeException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { PlanCode } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { AttachmentResponseDto } from './dto/attachment-response.dto';
import { AuditLogService } from '../common/services/audit-log.service';

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
 * Allowed MIME types for attachments
 */
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
];

/**
 * File size limits per plan (in bytes)
 */
const FILE_SIZE_LIMITS: Record<PlanCode, number> = {
  FREE: 2 * 1024 * 1024, // 2MB
  PRO: 25 * 1024 * 1024, // 25MB
  AGENCY: 100 * 1024 * 1024, // 100MB
};

/**
 * Default plan for new users (if no subscription found)
 */
const DEFAULT_PLAN = PlanCode.FREE;

@Injectable()
export class AttachmentsService {
  private readonly uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  /**
   * Upload attachment file
   * POST /messages/attachments
   * 
   * @param userId - User ID from JWT token
   * @param file - Uploaded file
   * @param requestId - Request ID (required)
   * @param ip - Request IP for audit logging
   * @param ua - User agent for audit logging
   * @returns Created attachment
   */
  async uploadAttachment(
    userId: string,
    file: MulterFile,
    requestId?: string,
    ip?: string,
    ua?: string,
  ): Promise<AttachmentResponseDto> {
    if (!requestId) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'requestId is required for attachment context',
      });
    }

    // Validate file exists
    if (!file) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'File is required',
      });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: `Invalid file type. Allowed types: PDF, JPEG, PNG, WebP, DOCX, XLSX`,
      });
    }

    // Validate entity existence/ownership before persisting
    await this.assertRequestAccess(userId, requestId);

    // Get user's plan to check file size limit
    const plan = await this.getUserPlan(userId);
    const maxSize = FILE_SIZE_LIMITS[plan];

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new PayloadTooLargeException({
        code: 'PAYLOAD_TOO_LARGE',
        message: `File size exceeds plan limit. Maximum size for ${plan} plan: ${maxSizeMB}MB`,
      });
    }

    // Check attachment quota (if needed - placeholder for now)
    // TODO: Implement attachment quota check per plan

    // Generate unique file key
    const fileKey = this.generateFileKey(file.originalname || 'file');

    // Save file to storage (local filesystem for now)
    const filePath = await this.saveFile(file, fileKey);

    // Create attachment record in database
    const attachment = await this.prisma.attachment.create({
      data: {
        ownerUserId: userId,
        requestId: requestId || null,
        key: fileKey,
        mime: file.mimetype,
        size: file.size,
      },
    });

    // Audit logging
    await this.auditLogService.logAttachmentUploaded(attachment.id, userId, file.mimetype, file.size, ip, ua);

    return {
      id: attachment.id,
      ownerUserId: attachment.ownerUserId,
      requestId: attachment.requestId || undefined,
      key: attachment.key,
      mime: attachment.mime,
      size: attachment.size,
    };
  }

  /**
   * Get user's plan (from subscription or default to FREE)
   */
  private async getUserPlan(userId: string): Promise<PlanCode> {
    // Find user's provider profile
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // If provider has active subscription, use that plan
    if (providerProfile?.subscriptions?.[0]?.planCode) {
      return providerProfile.subscriptions[0].planCode;
    }

    // Default to FREE plan
    return DEFAULT_PLAN;
  }

  /**
   * Generate unique file key for storage
   */
  private generateFileKey(originalName: string): string {
    const id = crypto.randomUUID();
    const ext = path.extname(originalName) || '';
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `attachments/${id}/${sanitizedName}`;
  }

  /**
   * Save file to local filesystem
   * TODO: Replace with S3/R2 integration in production
   */
  private async saveFile(file: MulterFile, fileKey: string): Promise<string> {
    const filePath = path.join(this.uploadDir, fileKey);
    const dir = path.dirname(filePath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, file.buffer);

    return filePath;
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('[AttachmentsService] Failed to create upload directory:', error);
    }
  }

  /**
   * Ensure the request exists and the caller is allowed to attach to it.
   * Allowed: seeker who owns the request, or provider with a proposal on that request.
   */
  private async assertRequestAccess(userId: string, requestId: string): Promise<void> {
    const [request, providerProfile] = await Promise.all([
      this.prisma.request.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          seekerId: true,
          proposals: {
            select: { providerId: true },
          },
        },
      }),
      this.prisma.providerProfile.findUnique({
        where: { userId },
        select: { id: true },
      }),
    ]);

    if (!request) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Request not found',
      });
    }

    const isSeeker = request.seekerId === userId;
    const isProposalProvider =
      providerProfile && request.proposals.some((proposal) => proposal.providerId === providerProfile.id);

    if (!isSeeker && !isProposalProvider) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'You do not have permission to attach files to this request',
      });
    }
  }
}
