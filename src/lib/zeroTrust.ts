/**
 * Argus - Zero Trust Architecture (ZTA) Engine
 * Princípios de Confiança Zero:
 * 1. "Nunca Confie, Sempre Verifique" (Perímetro de rede não confere privilégio)
 * 2. Verificação contínua e dinâmica de contexto (IP, User-Agent, Freshness de Token)
 * 3. Step-up Authentication (Re-autenticação explícita para ações de alto risco)
 * 4. Detecção de Anomalias de Sessão (Troca súbita de IP / Fingerprint Hijacking)
 */

export interface ZeroTrustContext {
  userId: string;
  sessionTokenIssuedAt: number; // Unix ms
  currentIp: string;
  sessionOriginIp: string;
  userAgent: string;
  sessionUserAgent: string;
  isHighPrivilegeAction: boolean;
  stepUpConfirmedAt?: number; // Unix ms
}

export interface ZeroTrustEvaluation {
  isGranted: boolean;
  requiresStepUp: boolean;
  isCompromised: boolean;
  riskScore: number; // 0 a 100
  reasons: string[];
}

const MAX_TOKEN_AGE_MS = 24 * 60 * 60 * 1000; // 24 horas
const STEP_UP_FRESHNESS_WINDOW_MS = 15 * 60 * 1000; // 15 minutos

/**
 * Avalia continuamente cada requisição segundo o modelo Zero Trust.
 */
export function evaluateZeroTrustRequest(context: ZeroTrustContext): ZeroTrustEvaluation {
  const reasons: string[] = [];
  let riskScore = 0;
  let isCompromised = false;
  let requiresStepUp = false;

  // 1. Verificação de Idade do Token (Token Freshness)
  const tokenAge = Date.now() - context.sessionTokenIssuedAt;
  if (tokenAge > MAX_TOKEN_AGE_MS) {
    reasons.push('TOKEN_EXPIRED');
    riskScore += 100;
  } else if (tokenAge > 12 * 60 * 60 * 1000) {
    // Token envelhecido (> 12h) eleva o risco
    riskScore += 20;
    reasons.push('TOKEN_STALE');
  }

  // 2. Verificação de Seqüestro de Sessão (Session Hijacking / IP Shift)
  if (context.currentIp !== context.sessionOriginIp) {
    riskScore += 45;
    reasons.push('IP_SHIFT_DETECTED');
  }

  // 3. Verificação de User-Agent (Troca de Navegador/Dispositivo na mesma sessão)
  if (context.userAgent !== context.sessionUserAgent) {
    riskScore += 60;
    isCompromised = true;
    reasons.push('USER_AGENT_MISMATCH_SUSPECTED_HIJACK');
  }

  // 4. Verificação de Operações Críticas (Step-Up Authentication)
  if (context.isHighPrivilegeAction) {
    const isStepUpFresh =
      context.stepUpConfirmedAt &&
      Date.now() - context.stepUpConfirmedAt < STEP_UP_FRESHNESS_WINDOW_MS;

    if (!isStepUpFresh) {
      requiresStepUp = true;
      reasons.push('STEP_UP_AUTHENTICATION_REQUIRED');
    }
  }

  const isGranted = riskScore < 60 && !isCompromised && !requiresStepUp;

  return {
    isGranted,
    requiresStepUp,
    isCompromised,
    riskScore,
    reasons,
  };
}
