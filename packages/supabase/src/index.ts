import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  MistakeEntry, 
  Flashcard, 
  UserMetrics, 
  QuestionAttempt, 
  ExamNotice 
} from '@learning-ai/types';

// Environment variables fallback (compatível com Next.js e Expo/React Native)
const getEnvVar = (keyNext: string, keyExpo: string): string => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[keyNext]) return process.env[keyNext] as string;
    if (process.env[keyExpo]) return process.env[keyExpo] as string;
  }
  return '';
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'EXPO_PUBLIC_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('seu-projeto') &&
    !supabaseAnonKey.includes('sua-chave')
  );
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseInstance;
};

export const supabase = isSupabaseConfigured() ? getSupabase() : null;

export class SupabaseService {
  /**
   * Sincroniza o Caderno de Erros com o PostgreSQL no Supabase.
   */
  static async syncMistakes(userId: string, mistakes: MistakeEntry[]): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const client = getSupabase();
      if (!client) return { success: false, error: 'Cliente Supabase indisponível' };

      const records = mistakes.map(m => ({
        id: m.id,
        user_id: userId,
        question_id: m.question.id,
        user_personal_note: m.userPersonalNote || '',
        is_overcome: m.isOvercome,
        last_attempt_date: m.attemptDate,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await client
        .from('mistakes_notebook')
        .upsert(records, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Erro ao sincronizar erros com Supabase:', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  /**
   * Sincroniza os Flashcards de Repetição Espaçada (Curva Ebbinghaus / SM-2).
   */
  static async syncFlashcards(userId: string, flashcards: Flashcard[]): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const client = getSupabase();
      if (!client) return { success: false, error: 'Cliente Supabase indisponível' };

      const records = flashcards.map(f => ({
        id: f.id,
        user_id: userId,
        subject_name: f.subjectName,
        topic_name: f.topicName,
        front: f.front,
        back: f.back,
        next_review_date: f.nextReviewDate,
        interval_days: f.intervalDays,
        repetitions: f.repetitions,
        ease_factor: f.easeFactor,
        created_at: new Date().toISOString(),
      }));

      const { error } = await client
        .from('flashcards')
        .upsert(records, { onConflict: 'id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Erro ao sincronizar flashcards com Supabase:', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  /**
   * Registra uma tentativa de resposta e o diagnóstico cognitivo no Supabase.
   */
  static async recordAttempt(userId: string, attempt: QuestionAttempt): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const client = getSupabase();
      if (!client) return { success: false, error: 'Cliente Supabase indisponível' };

      const { error } = await client
        .from('question_attempts')
        .insert({
          id: attempt.id,
          user_id: userId,
          question_id: attempt.questionId,
          selected_option_id: attempt.selectedOptionId,
          is_correct: attempt.isCorrect,
          time_spent_seconds: attempt.timeSpentSeconds,
          error_type: attempt.diagnostic?.errorType || null,
          ai_diagnostic: attempt.diagnostic || null,
          answered_at: attempt.answeredAt,
        });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Erro ao registrar tentativa com Supabase:', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  /**
   * Atualiza as métricas globais de rendimento e acurácia do estudante.
   */
  static async syncMetrics(userId: string, metrics: UserMetrics): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const client = getSupabase();
      if (!client) return { success: false, error: 'Cliente Supabase indisponível' };

      const { error } = await client
        .from('user_study_metrics')
        .upsert({
          user_id: userId,
          total_answered: metrics.totalAnswered,
          total_correct: metrics.totalCorrect,
          global_accuracy: metrics.globalAccuracy,
          streak_days: metrics.streakDays,
          estimated_cutoff_score: metrics.estimatedCutoffScore,
          probability_of_passing: metrics.probabilityOfPassing,
          error_distribution: metrics.errorDistribution,
          banca_alignment: metrics.bancaAlignment,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Erro ao sincronizar métricas:', err?.message || err);
      return { success: false, error: err?.message };
    }
  }
}
