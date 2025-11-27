import { RequestStatus } from '@prisma/client';

/**
 * DTO for Audit Log entry
 */
export class AuditLogEntryDto {
  id: string;
  action: string;
  createdAt: Date;
  actorRole?: string;
}

/**
 * DTO matching Request schema (OpenAPI Request)
 */
export class RequestResponseDto {
  id: string;
  seekerId: string;
  title: string;
  description: string;
  visaType?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  location?: string | null;
  status: RequestStatus;
  createdAt: Date;
  intakeData?: any | null;
  
  /**
   * Recent activity logs for the request
   */
  auditLogs?: AuditLogEntryDto[];

  /**
   * For providers: Indicates if they have unlocked this request
   * LOCKED = No proposal exists
   * UNLOCKED = Proposal exists (Draft/Pending/etc)
   */
  unlockStatus?: 'LOCKED' | 'UNLOCKED';
}
