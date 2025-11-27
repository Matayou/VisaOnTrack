import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class LoginResponseDto {
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
}

// Internal type for service response (includes token for cookie setting)
export interface LoginResponseWithToken extends LoginResponseDto {
  token: string;
}

