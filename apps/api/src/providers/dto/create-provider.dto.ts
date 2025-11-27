import { IsString, IsOptional, IsArray, MinLength, MaxLength, ArrayMinSize, ArrayMaxSize, IsInt, Min, Max } from 'class-validator';

/**
 * DTO for creating a provider profile
 * POST /providers
 */
export class CreateProviderRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  businessName: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(500)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  yearsExperience?: number;
}
