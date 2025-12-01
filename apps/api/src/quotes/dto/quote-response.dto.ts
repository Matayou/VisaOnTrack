import { QuoteItemDto } from './quote-item.dto';

/**
 * Provider info for quote response
 */
export class QuoteProviderDto {
  id: string;
  businessName: string;
  businessType: string | null;
  yearsExperience: number | null;
  verifiedAt: Date | null;
}

/**
 * DTO for quote response
 */
export class QuoteResponseDto {
  id: string;
  requestId: string;
  providerId: string;
  items: QuoteItemDto[];
  totalTHB: number;
  etaDays: number;
  terms: string | null;
  status: string;
  validUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  provider?: QuoteProviderDto;
}

