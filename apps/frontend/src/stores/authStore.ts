import { create } from 'zustand';
import type { User } from '../types';
import { useProgressStore } from './progressStore';

type InitialAuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

const getInitialAuthState = (): InitialAuthState => {
  const storedToken = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('auth_user');

  if (!storedToken || !storedUser) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }

  try {
    const user = JSON.parse(storedUser) as User;
    return {
      user,
      token: storedToken,
      isAuthenticated: true,
    };
  } catch {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  login: (user: User, token: string) => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...getInitialAuthState(),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  setToken: (token) => set({ token }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    useProgressStore.getState().clearProgress();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  login: (user, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      error: null,
    });
  },

  restoreSession: () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({
          user,
          token: storedToken,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  },
}));
