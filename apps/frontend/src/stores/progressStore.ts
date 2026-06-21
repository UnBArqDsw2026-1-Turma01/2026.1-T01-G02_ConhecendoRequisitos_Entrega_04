import { create } from 'zustand';

export interface TrailProgress {
  trailId: number;
  status: 'nao_iniciado' | 'em_andamento' | 'concluido';
  percentualConcluido: number;
  dataInicio?: string | null;
  dataConclusao?: string | null;
  ultimaAtualizacao?: string | null;
}

export interface LessonProgress {
  trailId: number;
  lessonId: number;
  status: 'nao_iniciado' | 'em_andamento' | 'concluido';
  percentualConcluido: number;
  dataInicio?: string | null;
  dataConclusao?: string | null;
  ultimaAtualizacao?: string | null;
}

export interface ExerciseProgress {
  quizId: number;
  lessonId?: number | null;
  status: 'nao_iniciado' | 'em_andamento' | 'concluido';
  percentualConcluido: number;
  dataInicio?: string | null;
  dataConclusao?: string | null;
  ultimaAtualizacao?: string | null;
}

interface ProgressStore {
  trails: Record<number, TrailProgress>;
  lessons: Record<string, LessonProgress>;
  exercises: Record<number, ExerciseProgress>;
  setProgressData: (data: {
    trilhas: Array<{
      trilhaId: number;
      status: TrailProgress['status'];
      percentualConcluido: number;
      dataInicio?: string | null;
      dataConclusao?: string | null;
      ultimaAtualizacao?: string | null;
      aulas: Array<{
        moduloId: number;
        trilhaId: number;
        status: LessonProgress['status'];
        percentualConcluido: number;
        dataInicio?: string | null;
        dataConclusao?: string | null;
        ultimaAtualizacao?: string | null;
      }>;
    }>;
    exercicios: Array<{
      quizId: number;
      moduloId?: number | null;
      status: ExerciseProgress['status'];
      percentualConcluido: number;
      dataInicio?: string | null;
      dataConclusao?: string | null;
      ultimaAtualizacao?: string | null;
    }>;
  }) => void;
  clearProgress: () => void;
}

const toLessonKey = (trailId: number, lessonId: number) => `${trailId}:${lessonId}`;

export const useProgressStore = create<ProgressStore>((set) => ({
  trails: {},
  lessons: {},
  exercises: {},

  setProgressData: (data) => {
    const nextTrails: Record<number, TrailProgress> = {};
    const nextLessons: Record<string, LessonProgress> = {};
    const nextExercises: Record<number, ExerciseProgress> = {};

    data.trilhas.forEach((trilha) => {
      nextTrails[trilha.trilhaId] = {
        trailId: trilha.trilhaId,
        status: trilha.status,
        percentualConcluido: trilha.percentualConcluido,
        dataInicio: trilha.dataInicio,
        dataConclusao: trilha.dataConclusao,
        ultimaAtualizacao: trilha.ultimaAtualizacao,
      };

      trilha.aulas.forEach((aula) => {
        const lessonKey = toLessonKey(aula.trilhaId, aula.moduloId);
        nextLessons[lessonKey] = {
          trailId: aula.trilhaId,
          lessonId: aula.moduloId,
          status: aula.status,
          percentualConcluido: aula.percentualConcluido,
          dataInicio: aula.dataInicio,
          dataConclusao: aula.dataConclusao,
          ultimaAtualizacao: aula.ultimaAtualizacao,
        };
      });
    });

    data.exercicios.forEach((exercicio) => {
      nextExercises[exercicio.quizId] = {
        quizId: exercicio.quizId,
        lessonId: exercicio.moduloId,
        status: exercicio.status,
        percentualConcluido: exercicio.percentualConcluido,
        dataInicio: exercicio.dataInicio,
        dataConclusao: exercicio.dataConclusao,
        ultimaAtualizacao: exercicio.ultimaAtualizacao,
      };
    });

    set({
      trails: nextTrails,
      lessons: nextLessons,
      exercises: nextExercises,
    });
  },

  clearProgress: () => {
    set({
      trails: {},
      lessons: {},
      exercises: {},
    });
  },
}));

export const progressKey = {
  lesson: toLessonKey,
};
