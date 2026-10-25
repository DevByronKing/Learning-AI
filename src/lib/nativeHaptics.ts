/**
 * Utilitário de Feedback Háptico Multiplataforma (Capacitor Mobile + Web Fallback)
 * Proporciona resposta tátil instantânea no celular ao acertar/errar questões ou virar flashcards.
 */
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const nativeHaptics = {
  /**
   * Vibração leve de toque (seleção de alternativas, clique de menu)
   */
  async lightImpact(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    }
  },

  /**
   * Vibração média de impacto (virar flashcard, confirmar resposta)
   */
  async mediumImpact(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }
    }
  },

  /**
   * Vibração de sucesso (acerto de questão ou término de simulado)
   */
  async success(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([20, 50, 40]);
      }
    }
  },

  /**
   * Vibração de alerta duplo (erro em pegadinha de banca)
   */
  async warning(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([60, 40, 60]);
      }
    }
  }
};
