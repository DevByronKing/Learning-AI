/**
 * Learning AI - Centralized Growth & Conversion Analytics Engine
 * Provider-agnostic tracking supporting PostHog, Mixpanel, GA4, Meta Pixel, and in-memory persistence.
 */

export type CoreAnalyticsEvent =
  | 'diagnosis_completed'        // Ativação Core / Aha Moment (Simulado)
  | 'mascot_strategy_interacted' // Conexão Emocional & Direção do Dia
  | 'daily_mission_completed'    // Loop de Hábito Diário (D1 -> D7)
  | 'flashcard_srs_reviewed'     // Retenção Cognitiva & Espaçamento
  | 'paywall_checkout_started'   // Legado: Intenção de Conversão B2C
  | 'subscription_activated';    // Confirmação de pagamento / liberação de plano

export type GrowthAnalyticsEvent =
  | 'pageview'                   // Visualização de página ou aba
  | 'cta_clicked'                // Clique em CTAs de ativação / aquisição
  | 'onboarding_step_viewed'     // Visualização de etapa do onboarding (1 a 5)
  | 'onboarding_completed'       // Conclusão com sucesso do onboarding
  | 'paywall_cta_clicked'        // Intenção de compra / clique em assinar plano
  | 'checkout_started'           // Abertura do carrinho / checkout
  | 'experiment_assigned'        // Atribuição de variante de teste A/B
  | 'support_contact_initiated'  // Ponto de contato WhatsApp / Live Chat
  | 'paid_user_churn_feedback';  // Diagnóstico de churn e cancelamento de pagante / trial

export type StandardAnalyticsEvent = CoreAnalyticsEvent | GrowthAnalyticsEvent;

export interface AnalyticsEventPayload {
  event: StandardAnalyticsEvent;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, any>;
  timestamp: string;
}

export interface FunnelStageMetrics {
  stage: string;
  event: StandardAnalyticsEvent;
  count: number;
  dropOffRateFromPrevious: number; // Porcentagem de perda (ex: 24.5%)
  conversionRateFromFirst: number; // Porcentagem do topo até esta etapa (ex: 12.3%)
}

declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, properties?: Record<string, any>) => void;
      identify?: (userId: string, userProperties?: Record<string, any>) => void;
    };
    mixpanel?: {
      track: (eventName: string, properties?: Record<string, any>) => void;
      identify?: (userId: string) => void;
    };
  }
}

class AnalyticsService {
  private eventsLog: AnalyticsEventPayload[] = [];
  private listeners: ((event: AnalyticsEventPayload) => void)[] = [];
  private sessionId: string = '';
  private currentUserId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        // Gerenciamento de Session ID para rastreamento de funil
        let currentSession = sessionStorage.getItem('learning_ai_session_id');
        if (!currentSession) {
          currentSession = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          sessionStorage.setItem('learning_ai_session_id', currentSession);
        }
        this.sessionId = currentSession;

        // Recuperar ID de usuário autenticado
        const authData = localStorage.getItem('learning_ai_auth');
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            if (parsed.state?.user?.id) {
              this.currentUserId = parsed.state.user.id;
            }
          } catch {}
        }

        // Histórico de eventos local para observabilidade do dashboard
        const stored = localStorage.getItem('learning_ai_analytics_events');
        if (stored) {
          this.eventsLog = JSON.parse(stored);
        }
      } catch (e) {
        // Fallback resiliente
      }
    }
  }

  /**
   * Identifica o usuário nos serviços de analytics (PostHog, Mixpanel)
   */
  public identify(userId: string, traits: Record<string, any> = {}) {
    this.currentUserId = userId;
    if (typeof window === 'undefined') return;

    if (window.posthog?.identify) {
      window.posthog.identify(userId, traits);
    }
    if (window.mixpanel?.identify) {
      window.mixpanel.identify(userId);
    }
    if (window.gtag) {
      window.gtag('set', 'user_properties', { user_id: userId, ...traits });
    }
  }

  /**
   * Dispara um evento unificado para todos os provedores configurados
   */
  public track(event: StandardAnalyticsEvent, properties: Record<string, any> = {}) {
    const payload: AnalyticsEventPayload = {
      event,
      userId: this.currentUserId || undefined,
      sessionId: this.sessionId,
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : '',
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      },
      timestamp: new Date().toISOString(),
    };

    // 1. Armazenamento local com buffer circular
    this.eventsLog.unshift(payload);
    if (this.eventsLog.length > 300) {
      this.eventsLog = this.eventsLog.slice(0, 300);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('learning_ai_analytics_events', JSON.stringify(this.eventsLog));
      } catch {}
    }

    // 2. Despacho para Provedores Externos (PostHog / Mixpanel / GA4 / Meta)
    if (typeof window !== 'undefined') {
      this.dispatchToExternalProviders(event, payload.properties || {});
    }

    // 3. Notificar observadores em tempo real (ex: Funnel Dashboards)
    this.listeners.forEach((fn) => {
      try {
        fn(payload);
      } catch (err) {
        console.warn('[Analytics Listener Error]:', err);
      }
    });

    // 4. Log em ambiente de desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📊 [Analytics Track]: ${event}`, payload.properties);
    }
  }

  private dispatchToExternalProviders(event: StandardAnalyticsEvent, props: Record<string, any>) {
    // PostHog
    if (window.posthog?.capture) {
      window.posthog.capture(event, props);
    }

    // Mixpanel
    if (window.mixpanel?.track) {
      window.mixpanel.track(event, props);
    }

    // Google Analytics 4 (gtag)
    if (window.gtag) {
      window.gtag('event', event, props);
    }

    // Meta Pixel (fbq)
    if (window.fbq) {
      if (event === 'pageview') {
        window.fbq('track', 'PageView');
      } else if (event === 'subscription_activated') {
        window.fbq('track', 'Purchase', {
          value: props.amount || 0,
          currency: props.currency || 'BRL',
        });
      } else if (event === 'paywall_cta_clicked' || event === 'checkout_started') {
        window.fbq('track', 'InitiateCheckout', {
          content_name: props.planId,
          value: props.price || 0,
          currency: props.currency || 'BRL',
        });
      } else if (event === 'onboarding_completed') {
        window.fbq('track', 'CompleteRegistration', {
          status: 'onboarding_success',
        });
      }
    }
  }

  // ─── Helpers de Análise de Funil e Drop-Off ───────────────────────────

  /**
   * Calcula a taxa de desistência (Drop-off Rate) entre a etapa A e B:
   * Drop-off = ((Etapa A - Etapa B) / Etapa A) * 100%
   */
  public calculateDropOff(previousCount: number, currentCount: number): number {
    if (previousCount <= 0) return 0;
    if (currentCount >= previousCount) return 0;
    return parseFloat((((previousCount - currentCount) / previousCount) * 100).toFixed(2));
  }

  /**
   * Calcula a taxa de conversão final do topo até a etapa alvo:
   * Conversion = (Convertidos / Total Visitantes) * 100%
   */
  public calculateConversionRate(totalVisitors: number, totalConverted: number): number {
    if (totalVisitors <= 0) return 0;
    return parseFloat(((totalConverted / totalVisitors) * 100).toFixed(2));
  }

  /**
   * Consolida as métricas do funil canônico de aquisição
   */
  public getFunnelMetrics(): FunnelStageMetrics[] {
    const counts = this.getCounts();
    const stages: { stage: string; event: StandardAnalyticsEvent }[] = [
      { stage: '1. Visitantes (Página Inicial)', event: 'pageview' },
      { stage: '2. Clique no CTA Principal', event: 'cta_clicked' },
      { stage: '3. Início do Onboarding', event: 'onboarding_step_viewed' },
      { stage: '4. Conclusão do Onboarding', event: 'onboarding_completed' },
      { stage: '5. Abertura do Paywall', event: 'paywall_cta_clicked' },
      { stage: '6. Assinatura Confirmada', event: 'subscription_activated' },
    ];

    const firstCount = counts['pageview'] || 1;
    let prevCount = firstCount;

    return stages.map((s, index) => {
      const currentCount = counts[s.event] || 0;
      const dropOff = index === 0 ? 0 : this.calculateDropOff(prevCount, currentCount);
      const conversion = this.calculateConversionRate(firstCount, currentCount);
      prevCount = currentCount > 0 ? currentCount : prevCount;

      return {
        stage: s.stage,
        event: s.event,
        count: currentCount,
        dropOffRateFromPrevious: dropOff,
        conversionRateFromFirst: conversion,
      };
    });
  }

  public getEvents(): AnalyticsEventPayload[] {
    return [...this.eventsLog];
  }

  public getCounts(): Record<StandardAnalyticsEvent, number> {
    const counts: Record<StandardAnalyticsEvent, number> = {
      pageview: 0,
      cta_clicked: 0,
      onboarding_step_viewed: 0,
      onboarding_completed: 0,
      paywall_cta_clicked: 0,
      checkout_started: 0,
      subscription_activated: 0,
      experiment_assigned: 0,
      diagnosis_completed: 0,
      mascot_strategy_interacted: 0,
      daily_mission_completed: 0,
      flashcard_srs_reviewed: 0,
      paywall_checkout_started: 0,
      support_contact_initiated: 0,
      paid_user_churn_feedback: 0,
    };

    this.eventsLog.forEach((e) => {
      if (counts[e.event] !== undefined) {
        counts[e.event]++;
      }
    });

    return counts;
  }

  public subscribe(callback: (event: AnalyticsEventPayload) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  public clearEvents() {
    this.eventsLog = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('learning_ai_analytics_events');
      } catch {}
    }
  }
}

export const analytics = new AnalyticsService();
