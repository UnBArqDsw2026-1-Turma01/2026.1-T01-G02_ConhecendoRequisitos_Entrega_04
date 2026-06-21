import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new UserResponseDto({
      email: user.email,
      nome: user.nome,
      tipo: user.tipo,
      email_verificado: user.email_verificado,
    });
  }

  async findById(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async create(
    email: string,
    nome: string,
    senhaHash: string,
    tipo: 'aluno' | 'administrador',
  ) {
    const usuario = await this.prisma.usuario.create({
      data: {
        email,
        nome,
        senha: senhaHash,
        tipo,
      },
    });

    // Criar o registro específico de tipo
    if (tipo === 'aluno') {
      await this.prisma.aluno.create({
        data: {
          email,
        },
      });
    } else if (tipo === 'administrador') {
      await this.prisma.administrador.create({
        data: {
          email,
        },
      });
    }

    return usuario;
  }

  async update(email: string, data: any) {
    return this.prisma.usuario.update({
      where: { email },
      data,
    });
  }
}
