import { NextResponse } from 'next/server';
import { AIEngine, LegalDiagnosticRequest } from '@/lib/aiEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const diagnosticReq: LegalDiagnosticRequest = {
      questionId: body.questionId,
      statement: body.questionStatement || body.statement || '',
      banca: body.banca || 'Cebraspe',
      subject: body.subject || 'Direito',
      topic: body.topic || 'Geral',
      selectedOptionText: body.selectedOptionText || body.selectedOption || '',
      isCorrect: Boolean(body.isCorrect),
      confidenceLevel: body.confidenceLevel || body.confidence || 'media',
      knownLawArticle: body.knownLawArticle || body.codeCitation,
      knownExplanation: body.knownExplanation || body.explanation,
      knownTrap: body.knownTrap || body.trapAlert,
    };

    const result = await AIEngine.generateDiagnostic(diagnosticReq);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('API Diagnosis Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno no diagnóstico cognitivo' },
      { status: 500 }
    );
  }
}
