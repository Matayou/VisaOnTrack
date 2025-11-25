/**
 * DTO for provider profile response
 * GET /providers/{id}, POST /providers, PATCH /providers/{id}
 */
export class ProviderResponseDto {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  location?: string;
  languages: string[];
  website?: string;
  contactPhone?: string;
  yearsExperience?: number;
  verifiedAt?: Date;
  createdAt: Date;
}
