import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudentProfile } from '@/lib/types';
import { DEFAULT_STUDENT_PROFILE } from '@/lib/guardianAnimals';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: StudentProfile;
  setAuth: (user: AuthUser | null, token: string | null) => void;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'usr_default_demo',
        email: 'concurseiro@learningai.com.br',
        name: 'Aluno Alta Performance',
        role: 'student',
      },
      token: 'jwt_mock_initial_session',
      isAuthenticated: true,
      isLoading: false,
      profile: DEFAULT_STUDENT_PROFILE,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: Boolean(user && token),
          isLoading: false,
        }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'learning-ai-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
      }),
    }
  )
);
