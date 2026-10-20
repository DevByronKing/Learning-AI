/**
 * Argus - SIEM (Security Information and Event Management) Engine
 * Coleta centralizada, correlação de eventos em tempo real, detecção de anomalias
 * e exportação em formato padrão de mercado (CEF - Common Event Format).
 */

export type SiemEventType =
  | 'AUTH_FAILED'
  | 'AUTH_SUCCESS'
  | 'SQLI_ATTEMPT'
  | 'XSS_ATTEMPT'
  | 'CSRF_VIOLATION'
  | 'SSRF_ATTEMPT'
  | 'WAF_IP_BANNED'
  | 'MALWARE_BLOCKED'
  | 'PRIVILEGE_ESCALATION_ATTEMPT'
  | 'PROMPT_INJECTION_ATTEMPT'
  | 'PHISHING_DETECTED'
  | 'ZERO_TRUST_REJECTED'
  | 'BRUTE_FORCE_DETECTED';

export type SiemSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SiemEvent {
  id: string;
  timestamp: string;
  timestampMs: number;
  eventType: SiemEventType;
  severity: SiemSeverity;
  sourceIp: string;
  userId?: string;
  details: Record<string, any>;
}

export interface SiemAlert {
  id: string;
  triggeredAt: string;
  title: string;
  severity: SiemSeverity;
  sourceIp: string;
  correlatedEventCount: number;
  recommendation: string;
}

class SiemRegistry {
  private events: SiemEvent[] = [];
  private alerts: SiemAlert[] = [];
  private maxBufferSize = 2000;

  /**
   * Registra um evento de segurança estruturado no SIEM.
   */
  public logEvent(event: Omit<SiemEvent, 'id' | 'timestamp' | 'timestampMs'>): SiemEvent {
    const timestampMs = Date.now();
    const fullEvent: SiemEvent = {
      ...event,
      id: `siem_${timestampMs}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date(timestampMs).toISOString(),
      timestampMs,
    };

    this.events.unshift(fullEvent);
    if (this.events.length > this.maxBufferSize) {
      this.events.pop();
    }

    // Executa correlação automática de anomalias
    this.correlateEvents(fullEvent);

    return fullEvent;
  }

  /**
   * Correlaciona eventos recentes do mesmo IP para detectar ataques coordenados (ex: Brute Force).
   */
  private correlateEvents(incoming: SiemEvent): void {
    const windowMs = 5 * 60 * 1000; // Janela de 5 minutos
    const recentFromIp = this.events.filter(
      (e) => e.sourceIp === incoming.sourceIp && incoming.timestampMs - e.timestampMs <= windowMs
    );

    // Regra 1: Mais de 5 falhas de autenticação -> Brute Force Attack
    const failedLogins = recentFromIp.filter((e) => e.eventType === 'AUTH_FAILED');
    if (failedLogins.length >= 5) {
      this.triggerAlert({
        title: 'Ataque de Força Bruta Detectado',
        severity: 'CRITICAL',
        sourceIp: incoming.sourceIp,
        correlatedEventCount: failedLogins.length,
        recommendation: 'Aplicar banimento imediato no WAF IP Jail e exigir verificação CAPTCHA/2FA.',
      });
    }

    // Regra 2: Múltiplas injeções de SQL/XSS em sequência -> Exploração ativa de vulnerabilidades
    const exploits = recentFromIp.filter((e) =>
      ['SQLI_ATTEMPT', 'XSS_ATTEMPT', 'SSRF_ATTEMPT', 'PRIVILEGE_ESCALATION_ATTEMPT'].includes(e.eventType)
    );
    if (exploits.length >= 3) {
      this.triggerAlert({
        title: 'Campanha Ativa de Exploração de Vulnerabilidades',
        severity: 'CRITICAL',
        sourceIp: incoming.sourceIp,
        correlatedEventCount: exploits.length,
        recommendation: 'Isolar tráfego da rede de origem e inspecionar integridade de tabelas.',
      });
    }
  }

  private triggerAlert(alertData: Omit<SiemAlert, 'id' | 'triggeredAt'>): void {
    const existingRecent = this.alerts.find(
      (a) => a.title === alertData.title && a.sourceIp === alertData.sourceIp
    );

    if (!existingRecent) {
      const alert: SiemAlert = {
        ...alertData,
        id: `alt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        triggeredAt: new Date().toISOString(),
      };
      this.alerts.unshift(alert);
    }
  }

  public getEvents(filter?: { severity?: SiemSeverity; eventType?: SiemEventType; ip?: string }): SiemEvent[] {
    return this.events.filter((e) => {
      if (filter?.severity && e.severity !== filter.severity) return false;
      if (filter?.eventType && e.eventType !== filter.eventType) return false;
      if (filter?.ip && e.sourceIp !== filter.ip) return false;
      return true;
    });
  }

  public getAlerts(): SiemAlert[] {
    return this.alerts;
  }

  public clear(): void {
    this.events = [];
    this.alerts = [];
  }

  /**
   * Formata evento para o padrão CEF (Common Event Format) consumível por Splunk / Datadog / Sentinel.
   */
  public toCefString(event: SiemEvent): string {
    const severityMap: Record<SiemSeverity, number> = {
      INFO: 1,
      LOW: 3,
      MEDIUM: 5,
      HIGH: 8,
      CRITICAL: 10,
    };
    const cefSeverity = severityMap[event.severity] || 1;
    const msg = event.details.message || event.eventType;
    return `CEF:0|Argus|LearningAI|1.0|${event.eventType}|${msg}|${cefSeverity}|src=${event.sourceIp}${event.userId ? ` suser=${event.userId}` : ''}`;
  }
}

export const siemEngine = new SiemRegistry();
