import api from './api';
import type { Trail, Module, Content, Quiz } from '../types';

export const trailsService = {
  getTrackProgress: async (trackId: number): Promise<any> => {
    const response = await api.get(`/progress/tracks/${trackId}/progress`);
    return response.data;
  },

  startModule: async (moduleId: number): Promise<any> => {
    const response = await api.post(`/progress/modules/${moduleId}/start`);
    return response.data;
  },

  completeLessonById: async (lessonId: number): Promise<any> => {
    const response = await api.post(`/progress/lessons/${lessonId}/complete`);
    return response.data;
  },

  completeExerciseById: async (exerciseId: number): Promise<any> => {
    const response = await api.post(`/progress/exercises/${exerciseId}/complete`);
    return response.data;
  },

  completeModule: async (moduleId: number): Promise<any> => {
    const response = await api.post(`/progress/modules/${moduleId}/complete`);
    return response.data;
  },

  // Trilhas
  getTrails: async (): Promise<Trail[]> => {
    const response = await api.get('/trails');
    return response.data;
  },

  getTrail: async (id: number): Promise<Trail> => {
    const response = await api.get(`/trails/${id}`);
    return response.data;
  },

  // Módulos
  getModules: async (trailId: number): Promise<Module[]> => {
    const response = await api.get(`/trails/${trailId}/modules`);
    return response.data;
  },

  getModule: async (moduleId: number): Promise<Module> => {
    const response = await api.get(`/modules/${moduleId}`);
    return response.data;
  },

  // Conteúdo
  getContent: async (contentId: number): Promise<Content> => {
    const response = await api.get(`/content/${contentId}`);
    return response.data;
  },

  // Quiz
  getQuiz: async (quizId: number): Promise<Quiz> => {
    const response = await api.get(`/quiz/${quizId}`);
    return response.data;
  },

  submitQuizAnswer: async (quizId: number, answers: Record<string, string>): Promise<any> => {
    const response = await api.post(`/quiz/${quizId}/submit`, { answers });
    return response.data;
  },

  // Progresso
  getProgress: async (): Promise<any> => {
    const response = await api.get('/progress');
    return response.data;
  },

  startTrail: async (trailId: number): Promise<any> => {
    const response = await api.post(`/progress/trails/${trailId}/start`);
    return response.data;
  },

  updateTrailProgress: async (trailId: number, percentualConcluido: number): Promise<any> => {
    const response = await api.patch(`/progress/trails/${trailId}`, {
      percentualConcluido,
    });
    return response.data;
  },

  completeTrail: async (trailId: number): Promise<any> => {
    const response = await api.post(`/progress/trails/${trailId}/complete`);
    return response.data;
  },

  startLesson: async (trailId: number, lessonId: number): Promise<any> => {
    const response = await api.post(`/progress/trails/${trailId}/lessons/${lessonId}/start`);
    return response.data;
  },

  updateLessonProgress: async (trailId: number, lessonId: number, percentualConcluido: number): Promise<any> => {
    const response = await api.patch(`/progress/trails/${trailId}/lessons/${lessonId}`, {
      percentualConcluido,
    });
    return response.data;
  },

  completeLesson: async (trailId: number, lessonId: number): Promise<any> => {
    const response = await api.post(`/progress/trails/${trailId}/lessons/${lessonId}/complete`);
    return response.data;
  },

  completeExercise: async (trailId: number, exerciseId: number): Promise<any> => {
    const response = await api.post(`/progress/trails/${trailId}/exercises/${exerciseId}/complete`);
    return response.data;
  },
};
