import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { ProgressService } from './progress.service';
import { UpdatePercentDto } from './dto/update-percent.dto';

@Controller('progress')
@UseGuards(JwtGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Novas rotas (compatíveis com o contrato solicitado)
  @Get('/tracks/:trackId/progress')
  getTrackProgress(
    @Request() req,
    @Param('trackId', ParseIntPipe) trackId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.getTrackProgress(userId, trackId);
  }

  @Post('/modules/:moduleId/start')
  startModule(
    @Request() req,
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.startModule(userId, moduleId);
  }

  @Post('/lessons/:lessonId/complete')
  completeLessonById(
    @Request() req,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.completeLessonById(userId, lessonId);
  }

  @Post('/exercises/:exerciseId/complete')
  completeExerciseById(
    @Request() req,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.completeExerciseById(userId, exerciseId);
  }

  @Post('/modules/:moduleId/complete')
  completeModule(
    @Request() req,
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.completeModule(userId, moduleId);
  }

  // Rotas legadas (mantidas para compatibilidade)
  @Get()
  getMyProgress(@Request() req) {
    const userId = req.user.id;
    return this.progressService.getMyProgress(userId);
  }

  @Post('trails/:trailId/start')
  startTrail(@Request() req, @Param('trailId', ParseIntPipe) trailId: number) {
    const userId = req.user.id;
    return this.progressService.startTrail(userId, trailId);
  }

  @Patch('trails/:trailId')
  updateTrailProgress(
    @Request() req,
    @Param('trailId', ParseIntPipe) trailId: number,
    @Body() body: UpdatePercentDto,
  ) {
    const userId = req.user.id;
    return this.progressService.updateTrailProgress(
      userId,
      trailId,
      body.percentualConcluido,
    );
  }

  @Post('trails/:trailId/complete')
  completeTrail(
    @Request() req,
    @Param('trailId', ParseIntPipe) trailId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.completeTrail(userId, trailId);
  }

  @Post('trails/:trailId/lessons/:lessonId/start')
  startLesson(
    @Request() req,
    @Param('trailId', ParseIntPipe) trailId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.startLesson(userId, trailId, lessonId);
  }

  @Patch('trails/:trailId/lessons/:lessonId')
  updateLessonProgress(
    @Request() req,
    @Param('trailId', ParseIntPipe) trailId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() body: UpdatePercentDto,
  ) {
    const userId = req.user.id;
    return this.progressService.updateLessonProgress(
      userId,
      trailId,
      lessonId,
      body.percentualConcluido,
    );
  }

  @Post('trails/:trailId/lessons/:lessonId/complete')
  completeLesson(
    @Request() req,
    @Param('trailId', ParseIntPipe) trailId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.completeLesson(userId, trailId, lessonId);
  }

  @Post('trails/:trailId/exercises/:exerciseId/complete')
  completeExercise(
    @Request() req,
    @Param('trailId', ParseIntPipe) trailId: number,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.completeExercise(userId, trailId, exerciseId);
  }
}
