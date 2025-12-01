import { IsArray, IsNumber, IsInt, Min, IsOptional, IsString, MaxLength, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteItemDto } from './quote-item.dto';

/**
 * DTO for creating/submitting a quote
 * POST /requests/{id}/quotes
 */
export class CreateQuoteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];

  @IsNumber()
  @Min(0)
  totalTHB: number;

  @IsInt()
  @Min(1)
  etaDays: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  terms?: string;
}

