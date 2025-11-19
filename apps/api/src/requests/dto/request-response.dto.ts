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
}

