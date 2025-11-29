import { ConsultationType, ConsultationStatus } from '@prisma/client';

export class ConsultationResponseDto {
  id: string;
  requestId: string;
  providerId: string;
  type: ConsultationType;
  priceTHB: number | null;
  durationMinutes: number;
  description: string | null;
  meetingLink: string | null;
  scheduledAt: Date | null;
  status: ConsultationStatus;
  createdAt: Date;
  updatedAt: Date;

  // Optional nested data
  provider?: {
    id: string;
    businessName: string;
    businessType: string | null;
    yearsExperience: number | null;
    verifiedAt: Date | null;
  };
}
