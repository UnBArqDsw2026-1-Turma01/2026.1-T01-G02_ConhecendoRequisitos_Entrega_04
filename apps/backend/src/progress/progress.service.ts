import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusProgresso } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type ModuleState = 'LOCKED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getTrackProgress(userId: string, trackId: number) {
    const trilha = await this.prisma.trilha.findUnique({
      where: { id: trackId },
      include: {
        modulos: {
          orderBy: [{ ordem: 'asc' }, { id: 'asc' }],
        },
      },
    });

    if (!trilha) {
      throw new NotFoundException('Trilha não encontrada');
    }

    const progressoTrilha = await this.prisma.progressoTrilha.findUnique({
      where: {
        emailAluno_idTrilha: {
          emailAluno: userId,
          idTrilha: trackId,
        },
      },
      include: {
        progressosModulo: true,
      },
    });

    const progressoModuloMap = new Map(
      (progressoTrilha?.progressosModulo ?? []).map((item) => [
        item.idModulo,
        item,
      ]),
    );

    const modules = trilha.modulos.map((modulo, index) => {
      const moduleProgress = progressoModuloMap.get(modulo.id);
      const previousModule = index > 0 ? trilha.modulos[index - 1] : null;
      const previousProgress = previousModule
        ? progressoModuloMap.get(previousModule.id)
        : null;

      const unlocked =
        index === 0 || previousProgress?.status === StatusProgresso.concluido;

      const percent = moduleProgress
        ? Math.min(100, Math.max(0, moduleProgress.progresso))
        : 0;

      const state = this.resolveModuleState(unlocked, moduleProgress?.status);

      return {
        id: modulo.id,
        title: modulo.titulo,
        description: modulo.descricao,
        order: modulo.ordem,
        percent,
        state,
        unlocked,
      };
    });

    const totalModules = modules.length;
    const trackPercent =
      totalModules > 0
        ? Math.round(
            modules.reduce(
              (accumulator, module) => accumulator + module.percent,
              0,
            ) / totalModules,
          )
        : 0;

    const trackState: StatusProgresso =
      totalModules > 0 &&
      modules.every((module) => module.state === 'COMPLETED')
        ? StatusProgresso.concluido
        : modules.some((module) => module.percent > 0)
          ? StatusProgresso.em_andamento
          : StatusProgresso.nao_iniciado;

    return {
      track: {
        id: trilha.id,
        title: trilha.titulo,
        description: trilha.descricao,
        percent: trackPercent,
        state: trackState,
      },
      modules,
    };
  }

  async startModule(userId: string, moduleId: number) {
    const module = await this.getModuleOrThrow(moduleId);
    await this.assertModuleUnlocked(userId, module.idTrilha, module.id);

    await this.prisma.$transaction(async (tx) => {
      const progressoTrilha = await this.ensureTrailProgressTx(
        tx,
        userId,
        module.idTrilha,
      );

      const existingModuleProgress = await tx.progressoModulo.findUnique({
        where: {
          idProgressoTrilha_idModulo: {
            idProgressoTrilha: progressoTrilha.id,
            idModulo: moduleId,
          },
        },
      });

      if (existingModuleProgress?.status === StatusProgresso.concluido) {
        return;
      }

      await tx.progressoModulo.upsert({
        where: {
          idProgressoTrilha_idModulo: {
            idProgressoTrilha: progressoTrilha.id,
            idModulo: moduleId,
          },
        },
        create: {
          idProgressoTrilha: progressoTrilha.id,
          idModulo: moduleId,
          status: StatusProgresso.em_andamento,
          progresso: 0,
          dataInicio: new Date(),
        },
        update: {
          status: StatusProgresso.em_andamento,
          dataInicio: existingModuleProgress?.dataInicio ?? new Date(),
          dataDeFinalizacao: null,
        },
      });

      await this.recalculateTrackProgressTx(tx, userId, module.idTrilha);
    });

    return this.getTrackProgress(userId, module.idTrilha);
  }

  async completeLessonById(userId: string, lessonId: number) {
    const lesson = await this.prisma.conteudo.findUnique({
      where: { id: lessonId },
      include: {
        modulo: {
          select: {
            id: true,
            idTrilha: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Aula não encontrada');
    }

    await this.assertModuleUnlocked(
      userId,
      lesson.modulo.idTrilha,
      lesson.modulo.id,
    );

    await this.prisma.$transaction(async (tx) => {
      const progressoTrilha = await this.ensureTrailProgressTx(
        tx,
        userId,
        lesson.modulo.idTrilha,
      );
      const progressoModulo = await this.ensureModuleProgressTx(
        tx,
        progressoTrilha.id,
        lesson.modulo.id,
      );

      await tx.progressoConteudo.upsert({
        where: {
          idProgressoModulo_idConteudo: {
            idProgressoModulo: progressoModulo.id,
            idConteudo: lesson.id,
          },
        },
        create: {
          idProgressoModulo: progressoModulo.id,
          idConteudo: lesson.id,
          status: true,
          dataDeFinalizacao: new Date(),
        },
        update: {
          status: true,
          dataDeFinalizacao: new Date(),
        },
      });

      await this.recalculateModuleProgressTx(tx, userId, lesson.modulo.id);
      await this.recalculateTrackProgressTx(tx, userId, lesson.modulo.idTrilha);
    });

    return this.getTrackProgress(userId, lesson.modulo.idTrilha);
  }

  async completeExerciseById(userId: string, exerciseId: number) {
    const exercise = await this.prisma.quiz.findUnique({
      where: { id: exerciseId },
      include: {
        modulo: {
          select: {
            id: true,
            idTrilha: true,
          },
        },
      },
    });

    if (!exercise || !exercise.modulo) {
      throw new NotFoundException('Exercício não encontrado');
    }

    await this.assertModuleUnlocked(
      userId,
      exercise.modulo.idTrilha,
      exercise.modulo.id,
    );

    await this.prisma.$transaction(async (tx) => {
      await this.ensureTrailProgressTx(tx, userId, exercise.modulo!.idTrilha);

      await tx.tentativaQuiz.upsert({
        where: {
          emailAluno_idQuiz: {
            emailAluno: userId,
            idQuiz: exercise.id,
          },
        },
        create: {
          emailAluno: userId,
          idQuiz: exercise.id,
          status: StatusProgresso.concluido,
          progresso: 100,
          dataInicio: new Date(),
          dataDeFinalizacao: new Date(),
        },
        update: {
          status: StatusProgresso.concluido,
          progresso: 100,
          dataDeFinalizacao: new Date(),
        },
      });

      await this.recalculateModuleProgressTx(tx, userId, exercise.modulo!.id);
      await this.recalculateTrackProgressTx(
        tx,
        userId,
        exercise.modulo!.idTrilha,
      );
    });

    return this.getTrackProgress(userId, exercise.modulo.idTrilha);
  }

  async completeModule(userId: string, moduleId: number) {
    const module = await this.getModuleOrThrow(moduleId);
    await this.assertModuleUnlocked(userId, module.idTrilha, module.id);

    await this.prisma.$transaction(async (tx) => {
      const progressoTrilha = await this.ensureTrailProgressTx(
        tx,
        userId,
        module.idTrilha,
      );
      const progressoModulo = await this.ensureModuleProgressTx(
        tx,
        progressoTrilha.id,
        module.id,
      );

      const requirement = await this.getModuleRequirementProgressTx(
        tx,
        userId,
        module.id,
        progressoModulo.id,
      );

      if (
        requirement.totalRequired > 0 &&
        requirement.completedRequired < requirement.totalRequired
      ) {
        throw new BadRequestException(
          'Módulo ainda não pode ser concluído: existem aulas ou exercícios obrigatórios pendentes.',
        );
      }

      await tx.progressoModulo.update({
        where: { id: progressoModulo.id },
        data: {
          status: StatusProgresso.concluido,
          progresso: 100,
          dataInicio: progressoModulo.dataInicio ?? new Date(),
          dataDeFinalizacao: new Date(),
        },
      });

      await this.recalculateTrackProgressTx(tx, userId, module.idTrilha);
    });

    return this.getTrackProgress(userId, module.idTrilha);
  }

  // =====================
  // Rotas legadas
  // =====================

  async getMyProgress(userId: string) {
    const trilhas = await this.prisma.trilha.findMany({
      orderBy: [{ ordem: 'asc' }, { id: 'asc' }],
    });

    const data = await Promise.all(
      trilhas.map(async (trilha) => this.getTrackProgress(userId, trilha.id)),
    );

    return {
      trilhas: data.map((item) => ({
        trilhaId: item.track.id,
        titulo: item.track.title,
        status: item.track.state,
        percentualConcluido: item.track.percent,
        aulas: item.modules.map((module) => ({
          moduloId: module.id,
          titulo: module.title,
          trilhaId: item.track.id,
          status: this.toLegacyStatus(module.state),
          percentualConcluido: module.percent,
        })),
      })),
      exercicios: [],
    };
  }

  async startTrail(userId: string, trilhaId: number) {
    const firstModule = await this.getFirstModuleOrThrow(trilhaId);
    await this.startModule(userId, firstModule.id);
    return this.getTrackProgress(userId, trilhaId);
  }

  async updateTrailProgress(
    userId: string,
    trilhaId: number,
    percentualConcluido: number,
  ) {
    // Mantido por compatibilidade: não força conclusão indevida.
    await this.ensureTrailProgressTx(this.prisma, userId, trilhaId);

    await this.prisma.progressoTrilha.update({
      where: {
        emailAluno_idTrilha: {
          emailAluno: userId,
          idTrilha: trilhaId,
        },
      },
      data: {
        progresso: Math.min(99, Math.max(0, percentualConcluido)),
        status:
          percentualConcluido > 0
            ? StatusProgresso.em_andamento
            : StatusProgresso.nao_iniciado,
      },
    });

    await this.recalculateTrackProgressTx(this.prisma, userId, trilhaId);
    return this.getTrackProgress(userId, trilhaId);
  }

  async completeTrail(userId: string, trilhaId: number) {
    const track = await this.getTrackProgress(userId, trilhaId);

    if (!track.modules.every((module) => module.state === 'COMPLETED')) {
      throw new BadRequestException(
        'A trilha só pode ser concluída quando todos os módulos estiverem concluídos.',
      );
    }

    await this.prisma.progressoTrilha.update({
      where: {
        emailAluno_idTrilha: {
          emailAluno: userId,
          idTrilha: trilhaId,
        },
      },
      data: {
        status: StatusProgresso.concluido,
        progresso: 100,
        dataDeFinalizacao: new Date(),
      },
    });

    return this.getTrackProgress(userId, trilhaId);
  }

  async startLesson(userId: string, trailId: number, lessonId: number) {
    const module = await this.getModuleOrThrow(lessonId);

    if (module.idTrilha !== trailId) {
      throw new NotFoundException('Módulo não encontrado para esta trilha');
    }

    return this.startModule(userId, lessonId);
  }

  async updateLessonProgress(
    userId: string,
    trailId: number,
    lessonId: number,
    percentualConcluido: number,
  ) {
    const module = await this.getModuleOrThrow(lessonId);

    if (module.idTrilha !== trailId) {
      throw new NotFoundException('Módulo não encontrado para esta trilha');
    }

    await this.startModule(userId, lessonId);

    await this.prisma.$transaction(async (tx) => {
      const progressoTrilha = await this.ensureTrailProgressTx(
        tx,
        userId,
        trailId,
      );
      const progressoModulo = await this.ensureModuleProgressTx(
        tx,
        progressoTrilha.id,
        lessonId,
      );

      await tx.progressoModulo.update({
        where: { id: progressoModulo.id },
        data: {
          status: StatusProgresso.em_andamento,
          progresso: Math.min(99, Math.max(0, percentualConcluido)),
          dataInicio: progressoModulo.dataInicio ?? new Date(),
          dataDeFinalizacao: null,
        },
      });

      await this.recalculateTrackProgressTx(tx, userId, trailId);
    });

    return this.getTrackProgress(userId, trailId);
  }

  async completeLesson(userId: string, trailId: number, lessonId: number) {
    const module = await this.getModuleOrThrow(lessonId);

    if (module.idTrilha !== trailId) {
      throw new NotFoundException('Módulo não encontrado para esta trilha');
    }

    await this.assertModuleUnlocked(userId, trailId, lessonId);

    await this.prisma.$transaction(async (tx) => {
      const progressoTrilha = await this.ensureTrailProgressTx(
        tx,
        userId,
        trailId,
      );
      const progressoModulo = await this.ensureModuleProgressTx(
        tx,
        progressoTrilha.id,
        lessonId,
      );

      const contents = await tx.conteudo.findMany({
        where: { idModulo: lessonId },
        select: { id: true },
      });

      for (const content of contents) {
        await tx.progressoConteudo.upsert({
          where: {
            idProgressoModulo_idConteudo: {
              idProgressoModulo: progressoModulo.id,
              idConteudo: content.id,
            },
          },
          create: {
            idProgressoModulo: progressoModulo.id,
            idConteudo: content.id,
            status: true,
            dataDeFinalizacao: new Date(),
          },
          update: {
            status: true,
            dataDeFinalizacao: new Date(),
          },
        });
      }

      await this.recalculateModuleProgressTx(tx, userId, lessonId);
      await this.recalculateTrackProgressTx(tx, userId, trailId);
    });

    return this.getTrackProgress(userId, trailId);
  }

  async completeExercise(userId: string, trailId: number, exerciseId: number) {
    const byQuizId = await this.prisma.quiz.findUnique({
      where: { id: exerciseId },
      include: { modulo: { select: { idTrilha: true } } },
    });

    if (byQuizId?.modulo?.idTrilha === trailId) {
      return this.completeExerciseById(userId, byQuizId.id);
    }

    const byModuleId = await this.prisma.quiz.findFirst({
      where: {
        idModulo: exerciseId,
        modulo: {
          idTrilha: trailId,
        },
      },
      select: { id: true },
    });

    if (!byModuleId) {
      throw new NotFoundException('Exercício não encontrado para esta trilha');
    }

    return this.completeExerciseById(userId, byModuleId.id);
  }

  // =====================
  // Helpers
  // =====================

  private resolveModuleState(
    unlocked: boolean,
    status?: StatusProgresso,
  ): ModuleState {
    if (!unlocked) {
      return 'LOCKED';
    }

    if (status === StatusProgresso.concluido) {
      return 'COMPLETED';
    }

    if (status === StatusProgresso.em_andamento) {
      return 'IN_PROGRESS';
    }

    return 'NOT_STARTED';
  }

  private async getModuleOrThrow(moduleId: number) {
    const module = await this.prisma.modulo.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException('Módulo não encontrado');
    }

    return module;
  }

  private async getFirstModuleOrThrow(trackId: number) {
    const firstModule = await this.prisma.modulo.findFirst({
      where: { idTrilha: trackId },
      orderBy: [{ ordem: 'asc' }, { id: 'asc' }],
    });

    if (!firstModule) {
      throw new NotFoundException('Esta trilha não possui módulos');
    }

    return firstModule;
  }

  private async assertModuleUnlocked(
    userId: string,
    trackId: number,
    moduleId: number,
  ) {
    const orderedModules = await this.prisma.modulo.findMany({
      where: { idTrilha: trackId },
      orderBy: [{ ordem: 'asc' }, { id: 'asc' }],
      select: { id: true },
    });

    const currentIndex = orderedModules.findIndex(
      (item) => item.id === moduleId,
    );

    if (currentIndex < 0) {
      throw new NotFoundException('Módulo não encontrado na trilha');
    }

    if (currentIndex === 0) {
      return;
    }

    const previousModuleId = orderedModules[currentIndex - 1].id;

    const progressoTrilha = await this.prisma.progressoTrilha.findUnique({
      where: {
        emailAluno_idTrilha: {
          emailAluno: userId,
          idTrilha: trackId,
        },
      },
      include: {
        progressosModulo: true,
      },
    });

    const previousModuleProgress = progressoTrilha?.progressosModulo.find(
      (item) => item.idModulo === previousModuleId,
    );

    if (
      !previousModuleProgress ||
      previousModuleProgress.status !== StatusProgresso.concluido
    ) {
      throw new ForbiddenException(
        'Módulo bloqueado. Conclua o módulo anterior primeiro.',
      );
    }
  }

  private async ensureTrailProgressTx(
    tx: Prisma.TransactionClient | PrismaService,
    userId: string,
    trackId: number,
  ) {
    await this.assertTrailExists(trackId);

    return tx.progressoTrilha.upsert({
      where: {
        emailAluno_idTrilha: {
          emailAluno: userId,
          idTrilha: trackId,
        },
      },
      create: {
        emailAluno: userId,
        idTrilha: trackId,
        status: StatusProgresso.nao_iniciado,
        progresso: 0,
      },
      update: {},
    });
  }

  private async ensureModuleProgressTx(
    tx: Prisma.TransactionClient | PrismaService,
    progressoTrilhaId: number,
    moduleId: number,
  ) {
    return tx.progressoModulo.upsert({
      where: {
        idProgressoTrilha_idModulo: {
          idProgressoTrilha: progressoTrilhaId,
          idModulo: moduleId,
        },
      },
      create: {
        idProgressoTrilha: progressoTrilhaId,
        idModulo: moduleId,
        status: StatusProgresso.em_andamento,
        progresso: 0,
        dataInicio: new Date(),
      },
      update: {
        status: StatusProgresso.em_andamento,
      },
    });
  }

  private async getModuleRequirementProgressTx(
    tx: Prisma.TransactionClient | PrismaService,
    userId: string,
    moduleId: number,
    progressoModuloId: number,
  ) {
    const [totalContents, completedContents, quiz] = await Promise.all([
      tx.conteudo.count({ where: { idModulo: moduleId } }),
      tx.progressoConteudo.count({
        where: {
          idProgressoModulo: progressoModuloId,
          status: true,
        },
      }),
      tx.quiz.findFirst({
        where: { idModulo: moduleId },
        select: { id: true },
      }),
    ]);

    let quizCompleted = false;
    if (quiz) {
      const attempt = await tx.tentativaQuiz.findUnique({
        where: {
          emailAluno_idQuiz: {
            emailAluno: userId,
            idQuiz: quiz.id,
          },
        },
        select: { status: true },
      });

      quizCompleted = attempt?.status === StatusProgresso.concluido;
    }

    const totalRequired = totalContents + (quiz ? 1 : 0);
    const completedRequired = completedContents + (quizCompleted ? 1 : 0);

    return {
      totalRequired,
      completedRequired,
      percent:
        totalRequired > 0
          ? Math.round((completedRequired / totalRequired) * 100)
          : 0,
    };
  }

  private async recalculateModuleProgressTx(
    tx: Prisma.TransactionClient | PrismaService,
    userId: string,
    moduleId: number,
  ) {
    const module = await tx.modulo.findUnique({
      where: { id: moduleId },
      select: { id: true, idTrilha: true },
    });

    if (!module) {
      throw new NotFoundException('Módulo não encontrado');
    }

    const progressoTrilha = await this.ensureTrailProgressTx(
      tx,
      userId,
      module.idTrilha,
    );
    const progressoModulo = await this.ensureModuleProgressTx(
      tx,
      progressoTrilha.id,
      moduleId,
    );

    const requirement = await this.getModuleRequirementProgressTx(
      tx,
      userId,
      moduleId,
      progressoModulo.id,
    );

    const nextStatus: StatusProgresso =
      requirement.totalRequired > 0 && requirement.percent >= 100
        ? StatusProgresso.concluido
        : requirement.percent > 0
          ? StatusProgresso.em_andamento
          : StatusProgresso.nao_iniciado;

    await tx.progressoModulo.update({
      where: { id: progressoModulo.id },
      data: {
        status: nextStatus,
        progresso: Math.min(100, Math.max(0, requirement.percent)),
        dataInicio:
          nextStatus !== StatusProgresso.nao_iniciado
            ? (progressoModulo.dataInicio ?? new Date())
            : progressoModulo.dataInicio,
        dataDeFinalizacao:
          nextStatus === StatusProgresso.concluido
            ? (progressoModulo.dataDeFinalizacao ?? new Date())
            : null,
      },
    });
  }

  private async recalculateTrackProgressTx(
    tx: Prisma.TransactionClient | PrismaService,
    userId: string,
    trackId: number,
  ) {
    const modules = await tx.modulo.findMany({
      where: { idTrilha: trackId },
      orderBy: [{ ordem: 'asc' }, { id: 'asc' }],
      select: { id: true },
    });

    const progressoTrilha = await this.ensureTrailProgressTx(
      tx,
      userId,
      trackId,
    );

    const moduleProgressList = await tx.progressoModulo.findMany({
      where: {
        idProgressoTrilha: progressoTrilha.id,
        idModulo: { in: modules.map((module) => module.id) },
      },
      select: {
        idModulo: true,
        progresso: true,
        status: true,
      },
    });

    const moduleProgressMap = new Map(
      moduleProgressList.map((item) => [item.idModulo, item]),
    );

    const modulePercents = modules.map((module) => {
      const item = moduleProgressMap.get(module.id);
      return item ? Math.min(100, Math.max(0, item.progresso)) : 0;
    });

    const percent =
      modulePercents.length > 0
        ? Math.round(
            modulePercents.reduce(
              (accumulator, value) => accumulator + value,
              0,
            ) / modulePercents.length,
          )
        : 0;

    const status: StatusProgresso =
      modulePercents.length > 0 &&
      modulePercents.every((value) => value === 100)
        ? StatusProgresso.concluido
        : modulePercents.some((value) => value > 0)
          ? StatusProgresso.em_andamento
          : StatusProgresso.nao_iniciado;

    await tx.progressoTrilha.update({
      where: { id: progressoTrilha.id },
      data: {
        progresso: percent,
        status,
        dataInicio:
          status !== StatusProgresso.nao_iniciado
            ? (progressoTrilha.dataInicio ?? new Date())
            : progressoTrilha.dataInicio,
        dataDeFinalizacao:
          status === StatusProgresso.concluido
            ? (progressoTrilha.dataDeFinalizacao ?? new Date())
            : null,
      },
    });
  }

  private async assertTrailExists(trackId: number) {
    const trilha = await this.prisma.trilha.findUnique({
      where: { id: trackId },
    });
    if (!trilha) {
      throw new NotFoundException('Trilha não encontrada');
    }
  }

  private toLegacyStatus(state: ModuleState): StatusProgresso {
    if (state === 'COMPLETED') {
      return StatusProgresso.concluido;
    }

    if (state === 'IN_PROGRESS') {
      return StatusProgresso.em_andamento;
    }

    return StatusProgresso.nao_iniciado;
  }
}
