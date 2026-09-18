import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MistakeEntry, UserMetrics, Flashcard } from '@/lib/types';
import { INITIAL_MISTAKES, INITIAL_METRICS } from '@/lib/mockData';

interface StudyState {
  // Caderno de Erros
  mistakes: MistakeEntry[];
  addMistake: (mistake: MistakeEntry) => void;
  toggleOvercome: (id: string) => void;
  updatePersonalNote: (id: string, note: string) => void;

  // Estado da Sessão Ativa de Simulado / Quiz
  activeQuestionIndex: number;
  setActiveQuestionIndex: (index: number) => void;
  selectedAnswers: Record<string, string>; // questionId -> optionId
  selectAnswer: (questionId: string, optionId: string) => void;
  revealedAnswers: Record<string, boolean>; // questionId -> boolean
  revealAnswer: (questionId: string) => void;
  resetSessionAnswers: () => void;

  // Métricas do Estudante
  metrics: UserMetrics;
  incrementStreak: () => void;
  addStudyMinutes: (minutes: number) => void;
  updateAccuracy: (totalQuestions: number, correctQuestions: number) => void;

  // Flashcards (Repetição Espaçada)
  flashcards: Flashcard[];
  recordFlashcardReview: (cardId: string, qualityScore: number) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      mistakes: INITIAL_MISTAKES,
      addMistake: (mistake) =>
        set((state) => ({
          mistakes: [mistake, ...state.mistakes.filter((m) => m.question.id !== mistake.question.id)],
        })),

      toggleOvercome: (id) =>
        set((state) => ({
          mistakes: state.mistakes.map((m) =>
            m.id === id ? { ...m, isOvercome: !m.isOvercome } : m
          ),
        })),

      updatePersonalNote: (id, note) =>
        set((state) => ({
          mistakes: state.mistakes.map((m) =>
            m.id === id ? { ...m, userPersonalNote: note } : m
          ),
        })),

      // Quiz Session
      activeQuestionIndex: 0,
      setActiveQuestionIndex: (index) => set({ activeQuestionIndex: index }),

      selectedAnswers: {},
      selectAnswer: (questionId, optionId) =>
        set((state) => ({
          selectedAnswers: { ...state.selectedAnswers, [questionId]: optionId },
        })),

      revealedAnswers: {},
      revealAnswer: (questionId) =>
        set((state) => ({
          revealedAnswers: { ...state.revealedAnswers, [questionId]: true },
        })),

      resetSessionAnswers: () =>
        set({
          activeQuestionIndex: 0,
          selectedAnswers: {},
          revealedAnswers: {},
        }),

      // Métricas
      metrics: INITIAL_METRICS,
      incrementStreak: () =>
        set((state) => ({
          metrics: { ...state.metrics, streakDays: state.metrics.streakDays + 1 },
        })),

      addStudyMinutes: (_minutes) =>
        set((state) => ({
          metrics: {
            ...state.metrics,
          },
        })),

      updateAccuracy: (total, correct) =>
        set((state) => {
          const totalAnswered = state.metrics.totalAnswered + total;
          const totalCorrect = state.metrics.totalCorrect + correct;
          const globalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
          return {
            metrics: {
              ...state.metrics,
              totalAnswered,
              totalCorrect,
              globalAccuracy,
            },
          };
        }),

      // Flashcards SM-2
      flashcards: [],
      recordFlashcardReview: (cardId, qualityScore) =>
        set((state) => ({
          flashcards: state.flashcards.map((f) => {
            if (f.id !== cardId) return f;
            // Algoritmo SuperMemo SM-2
            let { easeFactor, intervalDays, repetitions } = f;
            if (qualityScore >= 3) {
              if (repetitions === 0) {
                intervalDays = 1;
              } else if (repetitions === 1) {
                intervalDays = 6;
              } else {
                intervalDays = Math.round(intervalDays * easeFactor);
              }
              repetitions += 1;
            } else {
              repetitions = 0;
              intervalDays = 1;
            }
            easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - qualityScore) * (0.08 + (5 - qualityScore) * 0.02)));

            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + intervalDays);

            return {
              ...f,
              repetitions,
              easeFactor: +easeFactor.toFixed(2),
              intervalDays,
              nextReviewDate: nextDate.toISOString().split('T')[0],
            };
          }),
        })),
    }),
    {
      name: 'learning-ai-study-storage',
      partialize: (state) => ({
        mistakes: state.mistakes,
        metrics: state.metrics,
        flashcards: state.flashcards,
      }),
    }
  )
);
