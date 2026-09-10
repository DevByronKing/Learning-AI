/**
 * Learning AI - Core Retention & Conversion Analytics Tracking
 * Mapeamento dos 5 eventos essenciais para Product-Market Fit e Retenção B2C
 */

export type CoreAnalyticsEvent = 
  | 'diagnosis_completed'            // 1. Ativação Core / Aha Moment
  | 'mascot_strategy_interacted'     // 2. Conexão Emocional & Direção do Dia
  | 'daily_mission_completed'        // 3. Loop de Hábito Diário (D1 -> D7)
  | 'flashcard_srs_reviewed'         // 4. Retenção Cognitiva & Espaçamento
  | 'paywall_checkout_started'       // 5. Intenção de Conversão B2C
  | 'subscription_activated';        // 5b. Sucesso de Conversão

export interface AnalyticsEventPayload {
  event: CoreAnalyticsEvent;
  userId?: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

// Armazenamento em memória para sessão atual e dashboard
class AnalyticsService {
  private eventsLog: AnalyticsEventPayload[] = [];
  private listeners: ((event: AnalyticsEventPayload) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('learning_ai_analytics_events');
        if (stored) {
          this.eventsLog = JSON.parse(stored);
        }
      } catch (e) {
        // storage opcional
      }
    }
  }

  public track(event: CoreAnalyticsEvent, properties: Record<string, any> = {}) {
    const payload: AnalyticsEventPayload = {
      event,
      properties,
      timestamp: new Date().toISOString(),
    };

    this.eventsLog.unshift(payload);
    if (this.eventsLog.length > 200) {
      this.eventsLog = this.eventsLog.slice(0, 200);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('learning_ai_analytics_events', JSON.stringify(this.eventsLog));
      } catch (e) {
        // quota
      }
    }

    // Notificar observadores em tempo real (ex: Dashboard)
    this.listeners.forEach(fn => fn(payload));

    // Log para depuração de Engenharia de Produto
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📊 [Analytics Event]: ${event}`, properties);
    }
  }

  public getEvents(): AnalyticsEventPayload[] {
    return [...this.eventsLog];
  }

  public getCounts(): Record<CoreAnalyticsEvent, number> {
    const counts: Record<CoreAnalyticsEvent, number> = {
      diagnosis_completed: 0,
      mascot_strategy_interacted: 0,
      daily_mission_completed: 0,
      flashcard_srs_reviewed: 0,
      paywall_checkout_started: 0,
      subscription_activated: 0,
    };

    this.eventsLog.forEach(e => {
      if (counts[e.event] !== undefined) {
        counts[e.event]++;
      }
    });

    return counts;
  }

  public subscribe(callback: (event: AnalyticsEventPayload) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
}

export const analytics = new AnalyticsService();
