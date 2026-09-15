/**
 * Learning AI - Motor de Inteligência Artificial Resiliente & Otimizado
 * Google Gemini 1.5 Flash + Cache Inteligente L1/L2 + Fallback Gracioso Determinístico
 */

import { getSupabase, isSupabaseConfigured } from './supabase';
import { SubscriptionPlan } from './types';

export interface LegalDiagnosticRequest {
  questionId?: string;
  statement: string;
  banca: string;
  subject: string;
  topic: string;
  selectedOptionText: string;
  isCorrect: boolean;
  confidenceLevel: 'alta' | 'media' | 'chute';
  knownLawArticle?: string;
  knownExplanation?: string;
  knownTrap?: string;
  userPlan?: SubscriptionPlan;
  userDailyAiCount?: number;
}

export interface LegalDiagnosticResult {
  source: 'gemini_1.5_flash' | 'deterministic_fallback' | 'ai_cache';
  errorType: 'pegadinha_banca' | 'lacuna_teorica' | 'leitura_apressada' | 'curva_esquecimento';
  officialArticle: string;
  exactLawQuote: string;
  bancaTrapIdentified: string;
  actionableAdvice: string;
  flashcardFront: string;
  flashcardBack: string;
  reviewIntervalDays: number;
  processingTimeMs: number;
  quotaExceeded?: boolean;
  quotaMessage?: string;
}

// Matriz de Cotas e Limites por Plano (Freemium / Pro / Elite)
export const PLAN_LIMITS = {
  aspirante: {
    name: 'Aspirante (Gratuito)',
    maxDailyAiRequests: 5,
    canAccessDiscursivas: false,
    maxFlashcards: 30,
    maxActiveEditais: 1,
    hasSpeechSynthesis: true,
  },
  pro: {
    name: 'Pro (Copiloto Cognitivo)',
    maxDailyAiRequests: 100,
    canAccessDiscursivas: true,
    maxMonthlyDiscursivas: 3,
    maxFlashcards: 999999,
    maxActiveEditais: 3,
    hasSpeechSynthesis: true,
  },
  elite: {
    name: 'Elite (Carreiras Jurídicas)',
    maxDailyAiRequests: 999999,
    canAccessDiscursivas: true,
    maxDailyDiscursivas: 3,
    maxMonthlyDiscursivas: 999999,
    maxFlashcards: 999999,
    maxActiveEditais: 999999,
    hasSpeechSynthesis: true,
  },
} as const;

// Cache L1 em memória RAM (reduz latência para ~1ms e 0 tokens em repetições)
const diagnosticMemoryCache = new Map<string, LegalDiagnosticResult>();

export class AIEngine {
  private static readonly TIMEOUT_MS = 4000; // 4.0s timeout estrito

  /**
   * Gera a chave única determinística para o cache de diagnósticos
   */
  private static generateCacheKey(req: LegalDiagnosticRequest): string {
    const qId = req.questionId || req.statement.slice(0, 40).replace(/\s+/g, '_');
    const optSnippet = req.selectedOptionText.slice(0, 30).replace(/\s+/g, '_');
    return `diag_${qId}_${optSnippet}`.toLowerCase();
  }

  /**
   * Diagnóstico Cognitivo de Questão Jurídica com Camada de Cache e Gestão de Cotas
   */
  public static async generateDiagnostic(
    req: LegalDiagnosticRequest
  ): Promise<LegalDiagnosticResult> {
    const startTime = Date.now();
    const plan = req.userPlan || 'aspirante';
    const currentCount = req.userDailyAiCount || 0;
    const planLimit = PLAN_LIMITS[plan] || PLAN_LIMITS.aspirante;

    // 1. Verificação de Cota do Plano (Opção A acordada: Fallback determinístico após atingir limite)
    if (currentCount >= planLimit.maxDailyAiRequests) {
      const fallback = this.generateDeterministicFallback(
        req, 
        startTime, 
        'Cota diária de inteligência artificial atingida'
      );
      fallback.quotaExceeded = true;
      fallback.quotaMessage = `Você utilizou seus ${planLimit.maxDailyAiRequests} diagnósticos com IA de hoje. Assine o Plano Pro para diagnósticos neurais ilimitados!`;
      return fallback;
    }

    // 2. Verificação de Cache L1 (Memória)
    const cacheKey = this.generateCacheKey(req);
    if (diagnosticMemoryCache.has(cacheKey)) {
      const cached = diagnosticMemoryCache.get(cacheKey)!;
      return {
        ...cached,
        source: 'ai_cache',
        processingTimeMs: Date.now() - startTime,
      };
    }

    // 3. Verificação de Cache L2 (Supabase PostgreSQL)
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabase();
        if (client) {
          const { data, error } = await client
            .from('ai_diagnostic_cache')
            .select('ai_diagnostic')
            .eq('cache_key', cacheKey)
            .maybeSingle();

          if (!error && data?.ai_diagnostic) {
            const cachedResult: LegalDiagnosticResult = {
              ...data.ai_diagnostic,
              source: 'ai_cache',
              processingTimeMs: Date.now() - startTime,
            };
            diagnosticMemoryCache.set(cacheKey, cachedResult);
            return cachedResult;
          }
        }
      } catch {
        // Silencioso em caso de falha de leitura no cache
      }
    }

    // 4. Invocação do Google Gemini (Estritamente Backend - sem chaves públicas expostas)
    const apiKey = process.env.GEMINI_API_KEY;

    // Se não houver chave configurada no servidor, degrade com segurança
    if (!apiKey) {
      return this.generateDeterministicFallback(req, startTime, 'Chave de API GEMINI_API_KEY não configurada no servidor');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const prompt = `
Você é o Copiloto Jurídico do Learning AI especializado na banca ${req.banca}.
Analise a resolução do aluno:
- Disciplina: ${req.subject}
- Tópico: ${req.topic}
- Enunciado da Questão: "${req.statement}"
- Resposta Selecionada pelo Aluno: "${req.selectedOptionText}"
- O Aluno Acertou? ${req.isCorrect ? 'SIM' : 'NÃO'}
- Nível de Confiança Declarado: ${req.confidenceLevel.toUpperCase()}
- Artigo de Lei Cadastrado: "${req.knownLawArticle || 'Não informado'}"
- Pegadinha Cadastrada: "${req.knownTrap || 'Não informada'}"

DIRETRIZES DE BLINDAGEM E ECONOMIA DE TOKENS:
1. Jamais invente artigos de lei ou súmulas inexistentes.
2. Em Direito Administrativo, não cite Lei 8.666/93 para licitações novas (cite Lei 14.133/21).
3. Na Lei de Improbidade, exija dolo específico (Lei 14.230/21).
4. Seja conciso e direto ao ponto (máximo 2 linhas por campo).

Responda ESTRITAMENTE em formato JSON com as chaves:
{
  "errorType": "pegadinha_banca" | "lacuna_teorica" | "leitura_apressada" | "curva_esquecimento",
  "officialArticle": "artigo específico e diploma legal",
  "exactLawQuote": "citação literal entre aspas",
  "bancaTrapIdentified": "explicação concisa da pegadinha da banca",
  "actionableAdvice": "orientação prática de estudo para as próximas 24h",
  "flashcardFront": "pergunta de fixação para o baralho inteligente",
  "flashcardBack": "resposta direta com fundamento legal"
}
`;

      const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1, // temperatura mínima para eliminar alucinação
              maxOutputTokens: 350, // Cota de saída estrita para controle de custos
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Gemini API retornou status HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Resposta vazia da API do Gemini');
      }

      const parsed = JSON.parse(rawText);

      const generatedResult: LegalDiagnosticResult = {
        source: 'gemini_1.5_flash',
        errorType: parsed.errorType || 'pegadinha_banca',
        officialArticle: parsed.officialArticle || req.knownLawArticle || 'Artigo fundamental do edital',
        exactLawQuote: parsed.exactLawQuote || 'Consulte a literalidade da lei seca correspondente.',
        bancaTrapIdentified: parsed.bancaTrapIdentified || req.knownTrap || 'A banca explorou um distrator clássico.',
        actionableAdvice: parsed.actionableAdvice || 'Revise o dispositivo nas próximas 24 horas.',
        flashcardFront: parsed.flashcardFront || `Qual o fundamento de ${req.topic}?`,
        flashcardBack: parsed.flashcardBack || parsed.officialArticle || 'Fundamento previsto no edital.',
        reviewIntervalDays: req.isCorrect ? 3 : 1,
        processingTimeMs: Date.now() - startTime,
      };

      // 5. Salva no Cache L1 e L2 para reuso futuro por outros estudantes
      diagnosticMemoryCache.set(cacheKey, generatedResult);

      if (isSupabaseConfigured()) {
        try {
          const client = getSupabase();
          if (client) {
            Promise.resolve(
              client
                .from('ai_diagnostic_cache')
                .upsert({
                  cache_key: cacheKey,
                  selected_option_id: req.selectedOptionText.slice(0, 50),
                  error_type: generatedResult.errorType,
                  ai_diagnostic: generatedResult,
                  created_at: new Date().toISOString(),
                })
            ).catch(() => {});
          }
        } catch {}
      }

      return generatedResult;

    } catch (err: any) {
      console.warn('[AI_FALLBACK_TRIGGERED] Ativando motor estatístico determinístico:', err.message);
      return this.generateDeterministicFallback(req, startTime, err.message);
    }
  }

  /**
   * Motor Estatístico Determinístico (Custo Zero de Tokens & 100% de Uptime)
   */
  private static generateDeterministicFallback(
    req: LegalDiagnosticRequest,
    startTime: number,
    reason: string
  ): LegalDiagnosticResult {
    let errorType: 'pegadinha_banca' | 'lacuna_teorica' | 'leitura_apressada' | 'curva_esquecimento' = 'pegadinha_banca';
    let advice = 'Revise o artigo específico nas próximas 24 horas usando o flashcard gerado.';

    if (req.isCorrect) {
      errorType = 'pegadinha_banca';
      advice = 'Excelente! Você superou o distrator da banca com precisão cirúrgica.';
    } else if (req.confidenceLevel === 'alta') {
      errorType = 'pegadinha_banca';
      advice = 'Você tinha certeza, indicando que a banca induziu ao erro por um falso cognato jurídico ou palavra extrema.';
    } else if (req.confidenceLevel === 'chute') {
      errorType = 'lacuna_teorica';
      advice = 'Chute identificado: tópico com lacuna de fundamentação. Adicione à rota de revisão de hoje.';
    } else {
      errorType = 'leitura_apressada';
      advice = 'Dúvida intermediária: atente-se às palavras de fechamento da assertiva antes de assinalar.';
    }

    const officialArticle = req.knownLawArticle || 'Artigo fundamental do tópico';
    const explanation = req.knownExplanation || 'A fundamentação oficial baseia-se na literalidade do dispositivo legal.';
    const trap = req.knownTrap || `A banca ${req.banca} costuma alterar termos restritivos para induzir o candidato ao erro.`;

    return {
      source: 'deterministic_fallback',
      errorType,
      officialArticle,
      exactLawQuote: explanation,
      bancaTrapIdentified: trap,
      actionableAdvice: advice,
      flashcardFront: `[${req.banca}] Qual o fundamento aplicável em ${req.topic}?`,
      flashcardBack: `${officialArticle}\n\n⚠️ Pegadinha: ${trap}`,
      reviewIntervalDays: req.isCorrect ? 3 : 1,
      processingTimeMs: Date.now() - startTime,
    };
  }
}
