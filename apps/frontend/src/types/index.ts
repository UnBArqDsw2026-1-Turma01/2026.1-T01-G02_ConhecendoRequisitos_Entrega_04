export interface User {
  email: string;
  nome: string;
  tipo: 'aluno' | 'administrador';
  email_verificado: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  nome: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  novaSenha: string;
}

export interface Trail {
  id: number;
  titulo: string;
  descricao?: string;
  ordem?: number;
}

export interface Module {
  id: number;
  titulo: string;
  descricao?: string;
  ordem?: number;
  idTrilha: number;
}

export interface Content {
  id: number;
  titulo: string;
  conteudo: string;
  ordem?: number;
  idModulo: number;
}

export interface Quiz {
  id: number;
  titulo: string;
  idModulo: number;
}

export interface Progress {
  id: number;
  emailAluno: string;
  idTrilha: number;
  dataInicio: Date;
  dataFim?: Date;
  percentualConcluido: number;
}
