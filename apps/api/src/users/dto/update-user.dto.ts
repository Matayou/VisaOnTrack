import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserRequestDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;
}

