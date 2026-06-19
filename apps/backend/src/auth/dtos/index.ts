import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  nome: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  senha: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  senha: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  novaSenha: string;
}
