import { RequestStatus } from '@prisma/client';

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
   * For providers: Indicates if they have unlocked this request
   * LOCKED = No proposal exists
   * UNLOCKED = Proposal exists (Draft/Pending/etc)
   */
  unlockStatus?: 'LOCKED' | 'UNLOCKED';
}
