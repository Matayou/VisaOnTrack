import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

/**
 * DTO for creating a request (POST /requests)
 */
export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  visaType?: string | null;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'budgetMin must be a valid number' },
  )
  @Min(0)
  budgetMin?: number | null;

  @IsOptional()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'budgetMax must be a valid number' },
  )
  @Min(0)
  budgetMax?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string | null;
}

