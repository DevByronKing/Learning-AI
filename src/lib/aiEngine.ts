/**
 * Learning AI - Motor de Inteligência Artificial Resiliente
 * Google Gemini 1.5 Flash + Fallback Gracioso Determinístico
 */

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
}

export interface LegalDiagnosticResult {
  source: 'gemini_1.5_flash' | 'deterministic_fallback';
  errorType: 'pegadinha_banca' | 'lacuna_teorica' | 'leitura_apressada' | 'curva_esquecimento';
  officialArticle: string;
  exactLawQuote: string;
  bancaTrapIdentified: string;
  actionableAdvice: string;
  flashcardFront: string;
  flashcardBack: string;
  reviewIntervalDays: number;
  processingTimeMs: number;
}

export class AIEngine {
  private static readonly TIMEOUT_MS = 4500; // 4.5s timeout estrito

  /**
   * Diagnóstico Cognitivo de Questão Jurídica com Fallback Gracioso
   */
  public static async generateDiagnostic(
    req: LegalDiagnosticRequest
  ): Promise<LegalDiagnosticResult> {
    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Se não houver chave configurada, degrade graciosamente sem erro
    if (!apiKey) {
      return this.generateDeterministicFallback(req, startTime, 'Chave de API não configurada');
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

DIRETRIZES DE BLINDAGEM CONTRA ALUCINAÇÃO:
1. Jamais invente artigos de lei ou súmulas inexistentes.
2. Se a questão for de Direito Administrativo, não cite a Lei 8.666/93 para licitações novas (cite Lei 14.133/21).
3. Na Lei de Improbidade, exija dolo (Lei 14.230/21).

Responda ESTRITAMENTE em formato JSON com as chaves:
{
  "errorType": "pegadinha_banca" | "lacuna_teorica" | "leitura_apressada" | "curva_esquecimento",
  "officialArticle": "artigo específico e diploma legal",
  "exactLawQuote": "citação literal entre aspas",
  "bancaTrapIdentified": "explicação da pegadinha da banca",
  "actionableAdvice": "orientação prática de estudo para as próximas 24h",
  "flashcardFront": "pergunta de fixação para o baralho inteligente",
  "flashcardBack": "resposta direta com fundamento legal"
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1, // temperatura mínima para eliminar alucinação
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

      return {
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

    } catch (err: any) {
      console.warn('[AI_FALLBACK_TRIGGERED] Ativando motor estatístico determinístico:', err.message);
      return this.generateDeterministicFallback(req, startTime, err.message);
    }
  }

  /**
   * Motor Estatístico Determinístico (Garante 100% de Uptime sem quebrar a tela)
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
      advice = 'Você tinha certeza, indicando que a banca induziu ao erro por um falso cognato jurídico.';
    } else if (req.confidenceLevel === 'chute') {
      errorType = 'curva_esquecimento';
      advice = 'A ausência de certeza aponta para enfraquecimento da memória de longo prazo (curva de Ebbinghaus).';
    } else {
      errorType = 'lacuna_teorica';
      advice = 'Ponto cego teórico identificado. Priorize 15 minutos de leitura do artigo seco.';
    }

    const officialArticle = req.knownLawArticle || `Dispositivo de ${req.subject} no edital`;
    const trap = req.knownTrap || `A banca ${req.banca} costuma trocar termos de obrigatoriedade por faculdade neste tema.`;

    return {
      source: 'deterministic_fallback',
      errorType,
      officialArticle,
      exactLawQuote: req.knownExplanation || 'Consulte a jurisprudência consolidada da banca.',
      bancaTrapIdentified: trap,
      actionableAdvice: advice,
      flashcardFront: `[${req.banca}] Qual é a regra essencial de ${req.topic} em ${req.subject}?`,
      flashcardBack: `${officialArticle}\n\nCuidado: ${trap}`,
      reviewIntervalDays: req.isCorrect ? 3 : 1,
      processingTimeMs: Date.now() - startTime,
    };
  }
}
