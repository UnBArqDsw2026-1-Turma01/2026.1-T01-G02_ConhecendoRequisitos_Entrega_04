import { Exclude } from 'class-transformer';

export class UserDto {
  email: string;
  nome: string;
  tipo: string;
  email_verificado: boolean;

  @Exclude()
  senha: string;

  @Exclude()
  token_recuperacao: string;

  @Exclude()
  data_expiracao_token: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

export class UserResponseDto {
  email: string;
  nome: string;
  tipo: string;
  email_verificado: boolean;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
