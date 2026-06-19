import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService, PrismaService],
  exports: [ProgressService],
})
export class ProgressModule {}
