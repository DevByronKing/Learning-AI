import { NextResponse } from 'next/server';
import { AIEngine, LegalDiagnosticRequest } from '@/lib/aiEngine';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const { allowed, resetTime } = checkRateLimit(ip, 30, 60000);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Muitas requisições de diagnóstico consecutivas. Aguarde 1 minuto.',
          retryAfterSeconds: Math.ceil((resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000))
          }
        }
      );
    }

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
      userPlan: body.userPlan || 'aspirante',
      userDailyAiCount: Number(body.userDailyAiCount) || 0,
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
