import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsNumber } from 'class-validator';

/**
 * DTO for a quote line item
 */
export class QuoteItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsInt()
  @Min(1)
  quantity: number = 1;

  @IsNumber()
  @Min(0)
  priceTHB: number;
}

