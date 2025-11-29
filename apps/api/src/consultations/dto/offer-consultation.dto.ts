import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { ConsultationType } from '@prisma/client';

export class OfferConsultationDto {
  @IsEnum(ConsultationType)
  type: ConsultationType;

  @ValidateIf((o) => o.type === ConsultationType.PAID)
  @IsNumber()
  @Min(500)
  @Max(10000)
  priceTHB?: number;

  @IsInt()
  @Min(15)
  @Max(120)
  durationMinutes: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  meetingLink?: string;
}
