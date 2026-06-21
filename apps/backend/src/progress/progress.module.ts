import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { ModulesController, QuizController } from './content-delivery.controller';

@Module({
  controllers: [ProgressController, ModulesController, QuizController],
  providers: [ProgressService, PrismaService],
  exports: [ProgressService],
})
export class ProgressModule {}
