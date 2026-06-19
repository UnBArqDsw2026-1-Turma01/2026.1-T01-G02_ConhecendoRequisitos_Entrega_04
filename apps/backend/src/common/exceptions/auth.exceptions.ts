import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Email ${email} já está cadastrado`);
  }
}

export class InvalidEmailException extends BadRequestException {
  constructor() {
    super('Email inválido');
  }
}

export class WeakPasswordException extends BadRequestException {
  constructor() {
    super('Senha deve conter pelo menos 8 caracteres');
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Email ou senha inválidos');
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super('Token inválido ou expirado');
  }
}

export class UserNotFoundException extends UnauthorizedException {
  constructor() {
    super('Usuário não encontrado');
  }
}
