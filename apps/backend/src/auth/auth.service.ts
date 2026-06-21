import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  InvalidTokenException,
  UserNotFoundException,
  WeakPasswordException,
} from '../common/exceptions/auth.exceptions';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dtos';
import { UserResponseDto } from '../users/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, nome, senha } = registerDto;

    // Validar se o usuário já existe
    const existingUser = await this.usersService.findById(email);
    if (existingUser) {
      throw new EmailAlreadyExistsException(email);
    }

    // Validar força da senha
    if (senha.length < 8) {
      throw new WeakPasswordException();
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário (padrão: aluno)
    await this.usersService.create(email, nome, senhaHash, 'aluno');

    // Gerar token
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }
    const token = this.generateToken(user);

    return {
      token,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    // Buscar usuário
    const user = await this.usersService.findById(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Validar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      throw new InvalidCredentialsException();
    }

    // Gerar token
    const userDto = await this.usersService.findByEmail(email);
    if (!userDto) {
      throw new InvalidCredentialsException();
    }
    const token = this.generateToken(userDto);

    return {
      token,
      user: userDto,
    };
  }

  async forgotPassword(email: string) {
    // Buscar usuário
    const user = await this.usersService.findById(email);
    if (!user) {
      // Não retornar erro para não expor que email existe
      return {
        message: 'Se o email existe, você receberá um link para recuperação',
      };
    }

    // Gerar token único (usando crypto ao invés de uuid)
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expira em 1 hora

    // Salvar token no banco
    await this.usersService.update(email, {
      token_recuperacao: token,
      data_expiracao_token: expiresAt,
    });

    // TODO: Enviar email com link de recuperação
    // Por enquanto, apenas retornamos o token para desenvolvimento
    return {
      message: 'Email de recuperação enviado',
      token, // Remover em produção
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, novaSenha } = resetPasswordDto;

    // Buscar usuário pelo token
    const user = await this.prisma.usuario.findFirst({
      where: {
        token_recuperacao: token,
      },
    });

    if (!user) {
      throw new InvalidTokenException();
    }

    // Validar expiração do token
    if (!user.data_expiracao_token || user.data_expiracao_token < new Date()) {
      throw new InvalidTokenException();
    }

    // Validar força da nova senha
    if (novaSenha.length < 8) {
      throw new WeakPasswordException();
    }

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha e limpar token
    await this.usersService.update(user.email, {
      senha: senhaHash,
      token_recuperacao: null,
      data_expiracao_token: null,
    });

    return { message: 'Senha redefinida com sucesso' };
  }

  private generateToken(user: UserResponseDto): string {
    const payload = {
      id: user.email,
      email: user.email,
      nome: user.nome,
    };

    return this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('jwt.secret') ||
        'secret-key-change-in-production',
      expiresIn: this.configService.get<number>('jwt.expiresIn') || 3600,
    });
  }
}
