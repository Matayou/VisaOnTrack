import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log password reset request event (per Section 11)
   * CRITICAL: Never log tokens (hashed or plaintext) in audit logs
   */
  async logPasswordResetRequest(userId: string, email: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'USER',
        action: 'PASSWORD_RESET_REQUEST',
        entityType: 'User',
        entityId: userId,
        diff: { email }, // No token in details
        ip: ip || null,
      },
    });
  }

  /**
   * Log password reset completion event (per Section 11)
   * CRITICAL: Never log tokens (hashed or plaintext) in audit logs
   */
  async logPasswordResetComplete(userId: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'USER',
        action: 'PASSWORD_RESET_COMPLETE',
        entityType: 'User',
        entityId: userId,
        diff: { success: true },
        ip: ip || null,
      },
    });
  }

  /**
   * Log onboarding completion event (RFC-004)
   * Per Section 11: Audit logging for sensitive actions
   */
  async logOnboardingCompleted(userId: string, role: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: role as any,
        action: 'ONBOARDING_COMPLETED',
        entityType: 'User',
        entityId: userId,
        diff: { role } as Prisma.InputJsonValue,
        ip: ip || null,
      },
    });
  }

  /**
   * Log failed password reset attempt (per Section 11)
   * CRITICAL: Never log tokens (hashed or plaintext) in audit logs
   */
  async logPasswordResetFailed(reason: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: null,
        actorRole: 'USER',
        action: 'PASSWORD_RESET_FAILED',
        entityType: 'User',
        entityId: null,
        diff: { reason }, // No token in details
        ip: ip || null,
      },
    });
  }

  /**
   * Log login attempt (per Section 11)
   * CRITICAL: Never log passwords or tokens in audit logs
   */
  async logLogin(userId: string | null, success: boolean, email: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'USER',
        action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
        entityType: 'User',
        entityId: userId,
        diff: { email, success }, // No password in details
        ip: ip || null,
      },
    });
  }

  /**
   * Log logout event (per Section 11)
   */
  async logLogout(userId: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'USER',
        action: 'LOGOUT',
        entityType: 'User',
        entityId: userId,
        diff: { success: true },
        ip: ip || null,
      },
    });
  }

  /**
   * Log registration event (per Section 11)
   * CRITICAL: Never log passwords in audit logs
   */
  async logRegister(userId: string, email: string, role: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'USER',
        action: 'USER_REGISTERED',
        entityType: 'User',
        entityId: userId,
        diff: { email, role }, // No password in details
        ip: ip || null,
      },
    });
  }

  /**
   * Log provider creation event (per Section 11)
   * CRITICAL: Never log sensitive data in audit logs
   */
  async logProviderCreated(providerId: string, userId: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'PROVIDER',
        action: 'PROVIDER_CREATED',
        entityType: 'ProviderProfile',
        entityId: providerId,
        diff: { providerId, userId },
        ip: ip || null,
      },
    });
  }

  /**
   * Log provider update event (per Section 11)
   * CRITICAL: Never log sensitive data in audit logs
   */
  async logProviderUpdated(
    providerId: string,
    userId: string,
    changes: Prisma.InputJsonValue,
    ip?: string,
    ua?: string,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'PROVIDER',
        action: 'PROVIDER_UPDATED',
        entityType: 'ProviderProfile',
        entityId: providerId,
        diff: changes,
        ip: ip || null,
      },
    });
  }

  /**
   * Log attachment upload event (per Section 11)
   * CRITICAL: Never log file contents or sensitive data in audit logs
   */
  async logAttachmentUploaded(
    attachmentId: string,
    userId: string,
    mimeType: string,
    size: number,
    ip?: string,
    ua?: string,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'USER',
        action: 'ATTACHMENT_UPLOADED',
        entityType: 'Attachment',
        entityId: attachmentId,
        diff: { mimeType, size }, // No file contents
        ip: ip || null,
      },
    });
  }

  /**
   * Log email verification completion event (RFC-003)
   * Per Section 11: Audit logging for sensitive actions
   * CRITICAL: Never log tokens (hashed or plaintext) in audit logs
   */
  async logEmailVerified(userId: string, email: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'USER',
        action: 'EMAIL_VERIFIED',
        entityType: 'User',
        entityId: userId,
        diff: { email, verified: true }, // No token in details
        ip: ip || null,
      },
    });
  }

  /**
   * Log verification email resend event (RFC-003)
   * Per Section 11: Audit logging for sensitive actions
   * CRITICAL: Never log tokens (hashed or plaintext) in audit logs
   */
  async logVerificationEmailResent(userId: string, email: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        actorRole: 'USER',
        action: 'VERIFICATION_EMAIL_RESENT',
        entityType: 'User',
        entityId: userId,
        diff: { email }, // No token in details
        ip: ip || null,
      },
    });
  }

  /**
   * Log failed email verification attempt (RFC-003)
   * Per Section 11: Audit logging for sensitive actions
   * CRITICAL: Never log tokens (hashed or plaintext) in audit logs
   */
  async logEmailVerificationFailed(reason: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: null,
        actorRole: 'USER',
        action: 'EMAIL_VERIFICATION_FAILED',
        entityType: 'User',
        entityId: null,
        diff: { reason }, // No token in details
        ip: ip || null,
      },
    });
  }

  /**
   * Log request creation event (per Section 11)
   * Action performed by SEEKER role
   */
  async logRequestCreated(requestId: string, seekerId: string, ip?: string, ua?: string): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: seekerId,
        actorRole: 'SEEKER',
        action: 'REQUEST_CREATED',
        entityType: 'Request',
        entityId: requestId,
        diff: { requestId },
        ip: ip || null,
      },
    });
  }

  /**
   * Log request update event (per Section 11)
   */
  async logRequestUpdated(
    requestId: string,
    actorUserId: string,
    actorRole: string,
    changes: Prisma.InputJsonValue,
    ip?: string,
    ua?: string,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorUserId,
        actorRole,
        action: 'REQUEST_UPDATED',
        entityType: 'Request',
        entityId: requestId,
        diff: changes,
        ip: ip || null,
      },
    });
  }
}

