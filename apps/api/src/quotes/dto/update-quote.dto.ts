import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';

/**
 * Quote status enum (matches OpenAPI QuoteStatus)
 */
export enum QuoteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

/**
 * DTO for updating a quote
 * PATCH /quotes/{id}
 */
export class UpdateQuoteDto {
  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  terms?: string;
}

