import { IsString, IsOptional, IsArray, MinLength, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';

/**
 * DTO for updating a provider profile
 * PATCH /providers/{id}
 */
export class UpdateProviderRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  businessName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(20) // Reasonable limit
  languages?: string[];
}

