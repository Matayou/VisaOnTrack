import { IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;
}

export class RegisterResponseDto {
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
    phone?: string;
    locale: string;
    emailVerified: boolean; // RFC-003: Email verification status
    createdAt: Date;
  };
  message: string;
  // Dev-only: Verification link for local development (when email service is stub)
  verificationLink?: string; // Only included in development mode
}

// Internal type for service response (includes token for cookie setting)
export interface RegisterResponseWithToken extends RegisterResponseDto {
  token: string;
}

