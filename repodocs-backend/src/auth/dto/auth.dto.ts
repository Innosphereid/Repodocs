import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  token: string;
}

export class AuthResponseDto {
  @IsString()
  access_token: string;

  user: {
    id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
    planType: string;
    monthlyUsageCount: number;
  };
}

export class AuthStatusDto {
  @IsString()
  authenticated: boolean;

  user?: {
    id: string;
    username: string;
    planType: string;
  };
}

export class LocalAuthDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
