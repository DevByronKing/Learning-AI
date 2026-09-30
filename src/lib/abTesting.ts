/**
 * Learning AI - Edge & Client A/B Testing & Feature Flag Engine
 * Permite alternância de variantes sem novo deploy com consistência determinística (Hash)
 */

import { analytics } from './analytics';

export type ExperimentKey = 
  | 'landing_headline_copy'      // a) Variação A vs. B de copy e layout na Landing Page
  | 'auth_placement'             // b) Posição da tela de cadastro (antes vs. depois do onboarding)
  | 'paywall_mode'              // c) Paywall Hard (bloqueio total) vs Paywall Soft (degustação)
  | 'freemium_vs_paid_experiment'; // 4. Trava de Escala: Freemium vs. Pago/Trial com Cartão Obrigatório

export type VariantValue = 'variant_a' | 'variant_b';

export interface ExperimentConfig {
  key: ExperimentKey;
  name: string;
  description: string;
  variants: {
    variant_a: {
      label: string;
      description: string;
    };
    variant_b: {
      label: string;
      description: string;
    };
  };
}

export const EXPERIMENTS_REGISTRY: Record<ExperimentKey, ExperimentConfig> = {
  landing_headline_copy: {
    key: 'landing_headline_copy',
    name: 'Copy & Layout da Landing Page',
    description: 'Teste entre apelo de dor/engenharia reversa vs. velocidade de aprovação',
    variants: {
      variant_a: {
        label: 'Engenharia Reversa (Desarmamos a Banca)',
        description: 'Headline focada em desarmar pegadinhas e pontos cegos antes da prova',
      },
      variant_b: {
        label: 'Aceleração Cognitiva (Rumo aos 85%+)',
        description: 'Headline focada em método 80/20, produtividade e quebra do teto de pontos',
      },
    },
  },
  auth_placement: {
    key: 'auth_placement',
    name: 'Posicionamento do Cadastro',
    description: 'Avaliar atrito de conversão: cadastro antes vs. após o diagnóstico',
    variants: {
      variant_a: {
        label: 'Depois do Onboarding (Frictionless)',
        description: 'Aluno personaliza todo o plano antes de ser solicitado o e-mail/senha',
      },
      variant_b: {
        label: 'Antes do Onboarding (Lead Gating)',
        description: 'Aluno cria conta no primeiro passo para salvar seu progresso na nuvem',
      },
    },
  },
  paywall_mode: {
    key: 'paywall_mode',
    name: 'Modo do Paywall (Monetização)',
    description: 'Comparativo entre bloqueio rígido e degustação guiada de 1 módulo',
    variants: {
      variant_a: {
        label: 'Paywall Hard (Bloqueio Estrito)',
        description: 'Bloqueio total imediato ao atingir cota gratuita de 5 questões/dia',
      },
      variant_b: {
        label: 'Paywall Soft (Degustação de 1 Módulo)',
        description: 'Permite experimentar 1 simulado completo ou 1 redação antes de exigir o plano',
      },
    },
  },
  /**
   * TRAVA DE ESCALA PARA TESTE A/B FUTURO (Pilar 4):
   * Diretriz de Monetização Inicial: "Não usar Freemium no começo".
   * Evita subsidiar custos elevados de inferência de LLMs e infraestrutura para curiosos sem intenção de compra.
   * VARIANTES:
   * - variant_a (Padrão Ativo): 100% Funil Linear Pago / Trial Obrigatório com Cartão (Freemium desligado).
   * - variant_b (Inativa): Freemium liberado com cota diária (Freemium vs. Paid).
   * CRITÉRIO DE DESTRAVAMENTO:
   * Esta Feature Flag DEVE permanecer estritamente em 'variant_a' e SÓ deve ser ativada ('variant_b')
   * quando o banco de dados atingir a marca de milhares de assinantes pagantes ativos (> 5.000 clientes pagos),
   * momento em que haverá margem e volume estatístico para avaliar a canibalização de receita.
   */
  freemium_vs_paid_experiment: {
    key: 'freemium_vs_paid_experiment',
    name: 'Trava de Escala: Freemium vs. Pago/Trial Obrigatório',
    description: 'Controle de escala. Padrão: 100% linear pago/trial com cartão para não subsidiar curiosos. Só ativar com >5.000 pagantes ativos.',
    variants: {
      variant_a: {
        label: '100% Linear Pago / Trial Obrigatório (Padrão)',
        description: 'Zero freemium. Acesso restrito a clientes com assinatura ativa ou trial validado com cartão de crédito.',
      },
      variant_b: {
        label: 'Freemium Liberado (Trava de Escala Destravada)',
        description: 'Permite rota gratuita de degustação limitada a 10 questões/dia (apenas para escala com milhares de pagantes).',
      },
    },
  },
};

export const AB_COOKIE_NAME = 'learning_ai_ab_flags';

/**
 * Hash determinístico simples (FNV-1a 32-bit) para distribuição consistente 50/50
 */
export function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0);
}

/**
 * Atribui uma variante determinística baseada no identificador único do visitante
 */
export function assignVariant(visitorId: string, experimentKey: ExperimentKey): VariantValue {
  // A trava de escala freemium_vs_paid_experiment é blindada por padrão para variant_a
  if (experimentKey === 'freemium_vs_paid_experiment') {
    return 'variant_a';
  }

  const combined = `${visitorId}:${experimentKey}`;
  const score = hashString(combined) % 100;
  return score < 50 ? 'variant_a' : 'variant_b';
}

/**
 * Helper para validar se o acesso Freemium está permitido na plataforma.
 * Retorna sempre false enquanto a trava de escala estiver bloqueada no início da monetização.
 */
export function isFreemiumAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const flags = parseExperimentCookie(document.cookie);
    return flags.freemium_vs_paid_experiment === 'variant_b';
  } catch {
    return false;
  }
}

/**
 * Decodifica o cookie de flags
 */
export function parseExperimentCookie(cookieHeader: string | null | undefined): Record<ExperimentKey, VariantValue> {
  const defaults: Record<ExperimentKey, VariantValue> = {
    landing_headline_copy: 'variant_a',
    auth_placement: 'variant_a',
    paywall_mode: 'variant_b', // Padrão soft paywall para melhor conversão inicial
    freemium_vs_paid_experiment: 'variant_a', // Padrão: Pago / Trial Cartão Obrigatório
  };

  if (!cookieHeader) return defaults;

  try {
    const pairs = cookieHeader.split(';');
    for (const pair of pairs) {
      const [k, v] = pair.trim().split('=');
      if (k === AB_COOKIE_NAME && v) {
        let raw = v;
        try { raw = decodeURIComponent(raw); } catch {}
        try { raw = decodeURIComponent(raw); } catch {}
        const parsed = JSON.parse(raw);
        return { ...defaults, ...parsed };
      }
    }
  } catch {
    // Fallback gracioso
  }

  return defaults;
}

/**
 * Serializa os flags para cookie com validade de 30 dias
 */
export function serializeExperimentCookie(flags: Record<ExperimentKey, VariantValue>): string {
  const value = encodeURIComponent(JSON.stringify(flags));
  const maxAge = 60 * 60 * 24 * 30; // 30 dias
  return `${AB_COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

/**
 * Recupera o ID persistente do visitante
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server_visitor';
  try {
    let vid = localStorage.getItem('learning_ai_visitor_id');
    if (!vid) {
      vid = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('learning_ai_visitor_id', vid);
    }
    return vid;
  } catch {
    return 'fallback_visitor';
  }
}

/**
 * Lê uma variante no ambiente do navegador (Client Component)
 */
export function getClientVariant(key: ExperimentKey): VariantValue {
  if (typeof document === 'undefined') {
    return 'variant_a';
  }

  const flags = parseExperimentCookie(document.cookie);
  const currentVariant = flags[key];

  // Se ainda não houver atribuição para esta chave, atribuir deterministicamente e salvar
  if (!currentVariant) {
    const visitorId = getOrCreateVisitorId();
    const newVariant = assignVariant(visitorId, key);
    const updated = { ...flags, [key]: newVariant };
    document.cookie = serializeExperimentCookie(updated);
    
    analytics.track('experiment_assigned', {
      experimentKey: key,
      variant: newVariant,
      visitorId,
    });
    return newVariant;
  }

  return currentVariant;
}

/**
 * Hook React para consumo direto em componentes
 */
export function useExperiment(key: ExperimentKey): {
  variant: VariantValue;
  isVariantA: boolean;
  isVariantB: boolean;
} {
  // Leitura inicial segura
  const variant = typeof window !== 'undefined' ? getClientVariant(key) : 'variant_a';
  return {
    variant,
    isVariantA: variant === 'variant_a',
    isVariantB: variant === 'variant_b',
  };
}
