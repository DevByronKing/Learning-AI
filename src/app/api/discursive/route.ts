import { NextResponse } from 'next/server';
import { DiscursiveEvaluation } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      essayText = '',
      promptTitle = 'Redação Discursiva',
      banca = 'Cebraspe',
      motivatingText = '',
      mandatoryTopics = [],
      minLines = 20,
      maxLines = 30,
      totalLinesUsed = 25,
    } = body;

    if (!essayText.trim() || essayText.trim().length < 30) {
      return NextResponse.json(
        { success: false, error: 'O texto da redação é muito curto para ser avaliado.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY não configurada no servidor.' },
        { status: 503 }
      );
    }

    const prompt = `
Você é a Banca Examinadora Oficial de Concursos Públicos (${banca}), atuando como corretor sênior de provas discursivas jurídicas e de alto nível.
Avalie a redação do candidato com máximo rigor técnico, pedagógico e fidelidade à jurisprudência e legislação.

DADOS DA QUESTÃO DISCURSIVA:
- Tema: "${promptTitle}"
- Texto Motivador do Enunciado: "${motivatingText}"
- Parâmetros: Mínimo ${minLines} linhas | Máximo ${maxLines} linhas | Linhas ocupadas pelo candidato: ${totalLinesUsed}
- Quesitos Obrigatórios da Banca (Espelho Oficial):
${mandatoryTopics.map((t: any, i: number) => `  ${i + 1}. [Max: ${t.maxPoints || 30} pts] ${t.description}`).join('\n')}

TEXTO DO CANDIDATO PARA AVALIAÇÃO:
"""
${essayText}
"""

DIRETRIZES DE AVALIAÇÃO DA BANCA ${banca}:
1. Calcule a pontuação de 0 a 100 baseada na fidelidade aos quesitos, clareza e citação de diplomas legais pertinentes.
2. Identifique 2 a 3 desvios reais gramaticais ou de pontuação (com o número estimado da linha onde ocorreu no texto, o trecho original, a correção sugerida e a explicação).
3. Avalie 4 critérios:
   - Domínio do Conhecimento Específico (Tema & Quesitos) [Max: 35.0]
   - Estrutura Argumentativa & Coesão [Max: 30.0]
   - Linguagem Técnica & Vocabulário Jurídico [Max: 20.0]
   - Correção Gramatical & Ortográfica [Max: 15.0]
4. Forneça parecer geral, pontos fortes, pontos de melhoria com exemplos e uma versão modelo reescrita nota 100%.

Responda ESTRITAMENTE em formato JSON com esta estrutura precisa:
{
  "finalScore": number, // Nota de 0 a 100 (ex: 88.5)
  "passed": boolean, // true se finalScore >= 60.0
  "cutOffScore": 60.0,
  "criteriaGrades": [
    {
      "name": "Domínio do Conhecimento Específico (Tema & Quesitos)",
      "description": "Desenvolvimento fundamentado de todos os tópicos obrigatórios exigidos no edital da banca.",
      "score": number,
      "maxScore": 35.0,
      "status": "excelente" | "adequado" | "insuficiente",
      "feedback": "parecer sobre os tópicos jurídicos"
    },
    {
      "name": "Estrutura Argumentativa & Coesão",
      "description": "Clareza na progressão das teses, conectivos adequados e separação lógica em parágrafos temáticos.",
      "score": number,
      "maxScore": 30.0,
      "status": "excelente" | "adequado" | "insuficiente",
      "feedback": "parecer sobre organização em parágrafos"
    },
    {
      "name": "Linguagem Técnica & Vocabulário Jurídico",
      "description": "Emprego correto de termos técnicos, concisão e impessoalidade na redação oficial.",
      "score": number,
      "maxScore": 20.0,
      "status": "excelente" | "adequado" | "insuficiente",
      "feedback": "parecer sobre formalidade e termos jurídicos"
    },
    {
      "name": "Correção Gramatical & Ortográfica",
      "description": "Aplicação da norma culta com descontos proporcionais por linha escrita.",
      "score": number,
      "maxScore": 15.0,
      "status": "excelente" | "adequado" | "insuficiente",
      "feedback": "parecer sobre desvios gramaticais"
    }
  ],
  "grammaticalDiscounts": number, // ex: 1.5 ou 2.0
  "totalLinesUsed": ${totalLinesUsed},
  "lineErrors": [
    {
      "lineNumber": number,
      "originalText": "trecho com desvio",
      "suggestedCorrection": "como deveria ser escrito",
      "errorType": "gramatical" | "regência/crase" | "clareza" | "vocabulário_jurídico",
      "explanation": "regra gramatical violada"
    }
  ],
  "overallFeedback": "Parecer executivo da banca examinadora.",
  "strengths": ["ponto forte 1", "ponto forte 2", "ponto forte 3"],
  "improvements": ["melhoria 1 com exemplo", "melhoria 2"],
  "improvedVersion": "Texto completo reescrito no padrão nota máxima da banca."
}
`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.15,
            maxOutputTokens: 2500,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Discursive Error:', response.status, errorText);
      throw new Error(`Gemini API retornou status HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Resposta vazia da API do Gemini para discursiva');
    }

    const parsed: DiscursiveEvaluation = JSON.parse(rawText);
    parsed.evaluatedAt = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return NextResponse.json({
      success: true,
      data: parsed,
      source: 'gemini_3.6_flash',
    });
  } catch (error: any) {
    console.error('Erro na rota /api/discursive:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar correção com IA' },
      { status: 500 }
    );
  }
}
