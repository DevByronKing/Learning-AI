import { NextResponse } from 'next/server';
import {
  parseAnswerKeyText,
  extractQuestionsWithRegex,
  crossReferenceWithAnswerKey,
  generatePostgresSql,
} from '@/lib/questionExtractor';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { ExamIngestionMetadata, ParsedExamQuestion } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action || 'preview'; // 'preview' | 'commit'
    const metadata: ExamIngestionMetadata = body.metadata || {
      title: 'Prova Oficial Concurso Público',
      banca: 'Cebraspe',
      institution: 'Polícia Federal',
      role: 'Agente de Polícia Federal',
      year: 2021,
      careerCategory: 'policial',
      sourceUrl: 'https://cebraspe.org.br',
    };

    const examText: string = body.examText || '';
    const answerKeyText: string = body.answerKeyText || '';
    const examPdfBase64: string | undefined = body.examPdfBase64;
    const answerKeyPdfBase64: string | undefined = body.answerKeyPdfBase64;

    if (action === 'preview') {
      // 1. Parser do Gabarito Oficial Definitivo (se fornecido em texto)
      const parsedKey = parseAnswerKeyText(answerKeyText);

      // 2. Extração via Gemini 1.5 Flash (com suporte a PDF Multimodal e texto)
      let rawQuestions: Omit<ParsedExamQuestion, 'officialAnswerKey' | 'isAnnulledByBanca'>[] = [];
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && (examPdfBase64 || examText.length > 50)) {
        try {
          const parts: any[] = [];

          // Adiciona o PDF do Caderno de Prova como parte inline multimodal
          if (examPdfBase64) {
            const cleanExamPdf = examPdfBase64.replace(/^data:application\/pdf;base64,/, '');
            parts.push({
              inline_data: {
                mime_type: 'application/pdf',
                data: cleanExamPdf,
              },
            });
          }

          // Adiciona o PDF do Gabarito Definitivo como parte inline se fornecido
          if (answerKeyPdfBase64) {
            const cleanKeyPdf = answerKeyPdfBase64.replace(/^data:application\/pdf;base64,/, '');
            parts.push({
              inline_data: {
                mime_type: 'application/pdf',
                data: cleanKeyPdf,
              },
            });
          }

          const geminiPrompt = `
Você é um perito em extração de cadernos de provas oficiais de concursos públicos da banca ${metadata.banca}.
Analise o documento oficial fornecido (PDF ou texto) da prova de ${metadata.institution} (${metadata.year}), cargo ${metadata.role}.
${answerKeyText ? `Gabarito Oficial Definitivo em texto:\n${answerKeyText}` : ''}
${examText && !examPdfBase64 ? `Texto da Prova:\n${examText.slice(0, 8000)}` : ''}

Extraia as questões da prova com máxima fidelidade.
Retorne ESTRITAMENTE um JSON Array válido com os itens:
[
  {
    "questionNumber": 1,
    "statement": "texto completo do enunciado",
    "subjectName": "Direito Penal",
    "topicName": "Crimes Contra o Patrimônio",
    "options": [
      { "id": "opt-1-c", "text": "CERTO" },
      { "id": "opt-1-e", "text": "ERRADO" }
    ],
    "officialAnswer": "CERTO", // ou A, B, C, D, E, ou ANULADA
    "lawArticles": ["Art. 155, CP"],
    "codeCitation": "Art. 155 do Código Penal",
    "explanation": "fundamento conciso do item",
    "cognitiveAnalysis": {
      "commonTrap": "distrator da banca",
      "keyConcept": "conceito central",
      "bancaTendency": "estilo da banca"
    }
  }
]
`;
          parts.push({ text: geminiPrompt });

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                  temperature: 0.1,
                  maxOutputTokens: 3500,
                  responseMimeType: 'application/json',
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResult) {
              const aiItems = JSON.parse(textResult);
              if (Array.isArray(aiItems) && aiItems.length > 0) {
                rawQuestions = aiItems.map((item: any, idx: number) => ({
                  id: `q-gemini-${metadata.year}-${item.questionNumber || idx + 1}`,
                  questionNumber: item.questionNumber || idx + 1,
                  subjectId: `sub-${(item.subjectName || 'geral').toLowerCase().replace(/\s+/g, '-')}`,
                  subjectName: item.subjectName || 'Conhecimentos Específicos',
                  topicId: `top-${idx + 1}`,
                  topicName: item.topicName || 'Tópico Geral',
                  banca: metadata.banca,
                  year: metadata.year,
                  institution: metadata.institution,
                  statement: item.statement,
                  options: (item.options || []).map((o: any) => ({
                    id: o.id || `opt-${idx + 1}-${o.text}`,
                    text: o.text,
                    isCorrect: false,
                  })),
                  explanation: item.explanation || 'Item extraído e homologado pela banca.',
                  lawArticles: item.lawArticles || [],
                  codeCitation: item.codeCitation,
                  cognitiveAnalysis: item.cognitiveAnalysis || {
                    commonTrap: 'Análise de literalidade e jurisprudência consolidada.',
                    keyConcept: item.topicName || 'Fundamento Geral',
                    bancaTendency: 'Cobrança pontual e recorrente da banca.',
                  },
                  isOfficialAudited: true,
                  auditSource: `${metadata.banca} - ${metadata.institution} (${metadata.year}) - ${metadata.role}`,
                  legalStatus: 'atualizada',
                  auditDetails: {
                    bancaOfficialDocument: metadata.sourceUrl || 'Caderno de Prova Oficial',
                    verifiedAt: new Date().toISOString(),
                    humanAudited: false,
                  },
                }));
              }
            }
          }
        } catch (geminiErr) {
          console.warn('Fallback para motor regex:', geminiErr);
        }
      }

      // Se Gemini não retornou ou não estava disponível, usa o motor regex ultra-resiliente
      if (rawQuestions.length === 0) {
        rawQuestions = extractQuestionsWithRegex(examText, metadata);
      }

      // 3. Cruzamento obrigatório com o gabarito definitivo
      const result = crossReferenceWithAnswerKey(rawQuestions, parsedKey, metadata);

      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    if (action === 'commit') {
      const questionsToSave: ParsedExamQuestion[] = body.questions || [];

      if (!questionsToSave || questionsToSave.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Nenhuma questão fornecida para gravação.' },
          { status: 400 }
        );
      }

      let insertedCount = 0;
      let usedSupabase = false;

      // Gravação no Supabase se as credenciais estiverem ativas
      if (isSupabaseConfigured()) {
        const client = getSupabase();
        if (client) {
          const records = questionsToSave.map((q) => ({
            subject_name: q.subjectName,
            topic_name: q.topicName,
            banca: metadata.banca,
            year: metadata.year,
            institution: metadata.institution,
            statement: q.statement,
            code_citation: q.codeCitation || null,
            options: q.options,
            explanation: q.explanation,
            law_articles: q.lawArticles || [],
            cognitive_analysis: q.cognitiveAnalysis,
            created_at: new Date().toISOString(),
          }));

          const { data, error } = await client.from('questions').insert(records).select('id');

          if (error) {
            console.error('Erro ao gravar no Supabase:', error);
            throw error;
          }

          insertedCount = data?.length || records.length;
          usedSupabase = true;
        }
      }

      // Script SQL gerado como recibo / backup
      const sqlScript = generatePostgresSql(metadata, questionsToSave);

      return NextResponse.json({
        success: true,
        insertedCount: usedSupabase ? insertedCount : questionsToSave.length,
        usedSupabase,
        sqlScript,
        message: usedSupabase
          ? `${insertedCount} questões auditadas foram gravadas com sucesso no PostgreSQL do Supabase!`
          : `${questionsToSave.length} questões auditadas prontas! O script SQL correspondente foi gerado.`,
      });
    }

    return NextResponse.json({ success: false, error: 'Ação não reconhecida' }, { status: 400 });
  } catch (err: any) {
    console.error('Erro no pipeline de ingestão:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Erro interno ao processar ingestão da prova' },
      { status: 500 }
    );
  }
}
