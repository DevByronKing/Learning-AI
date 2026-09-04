import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionStatement, selectedOption, correctOption, confidence } = body;

    // AI Cognitive Classification Logic
    let errorType = 'pegadinha_banca';
    let feedback = 'A banca explorou um distrator semântico sutil.';

    if (confidence === 'alta') {
      errorType = 'pegadinha_banca';
      feedback = 'Você tinha certeza, indicando que o distrator da banca funcionou com precisão cirúrgica.';
    } else if (confidence === 'chute') {
      errorType = 'curva_esquecimento';
      feedback = 'A ausência de confiança aponta para enfraquecimento na memória de trabalho de longo prazo.';
    } else {
      errorType = 'lacuna_teorica';
      feedback = 'Necessidade de aprofundamento na base teórica e nos artigos de lei correlatos.';
    }

    return NextResponse.json({
      success: true,
      data: {
        errorType,
        feedback,
        actionableAdvice: 'Revise o artigo específico nas próximas 24 horas usando o flashcard gerado.',
        reviewIntervalDays: 1
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
