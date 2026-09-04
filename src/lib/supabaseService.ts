import { getSupabase, isSupabaseConfigured } from './supabase';
import { MistakeEntry, Flashcard, UserMetrics, QuestionAttempt, ExamNotice } from './types';

export class SupabaseService {
  /**
   * Sincroniza o Caderno de Erros com o banco PostgreSQL no Supabase.
   */
  static async syncMistakes(userId: string, mistakes: MistakeEntry[]): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const client = getSupabase();
      if (!client) return { success: false, error: 'Cliente Supabase indisponível' };

      // Upsert no banco
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
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

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
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

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
          answered_at: attempt.answeredAt || new Date().toISOString(),
        });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Erro ao salvar tentativa no Supabase:', err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  /**
   * Salva métricas consolidadas do estudante no perfil.
   */
  static async syncMetrics(userId: string, metrics: UserMetrics): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const client = getSupabase();
      if (!client) return { success: false, error: 'Cliente Supabase indisponível' };

      const { error } = await client
        .from('profiles')
        .update({
          streak_days: metrics.streakDays,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Erro ao sincronizar perfil com Supabase:', err?.message || err);
      return { success: false, error: err?.message };
    }
  }
}
