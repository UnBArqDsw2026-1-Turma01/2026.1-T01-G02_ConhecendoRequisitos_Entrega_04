import { Controller, Get, Param, ParseIntPipe, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('modules')
@UseGuards(JwtGuard)
export class ModulesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async getModule(@Param('id', ParseIntPipe) id: number) {
    const module = await this.prisma.modulo.findUnique({
      where: { id },
      include: {
        conteudos: {
          orderBy: { ordem: 'asc' },
        },
        quiz: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Módulo não encontrado');
    }

    return module;
  }
}

@Controller('quiz')
@UseGuards(JwtGuard)
export class QuizController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async getQuiz(@Param('id', ParseIntPipe) id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questoes: {
          orderBy: { ordem: 'asc' },
          include: {
            alternativas: {
              orderBy: { ordem: 'asc' },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz não encontrado');
    }

    return quiz;
  }
}
