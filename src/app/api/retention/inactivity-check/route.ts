import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inactiveThresholdHours = parseInt(searchParams.get('threshold') || '48', 10);
  const candidateEmail = searchParams.get('email') || 'candidato@argus.app.br';
  const warName = searchParams.get('warName') || 'Guerreiro(a)';

  // Simulação do payload de disparo de resgate anti-churn
  const simulatedPayload = {
    status: 'success',
    checkedAt: new Date().toISOString(),
    inactiveThresholdHours,
    targetCandidate: {
      email: candidateEmail,
      warName,
      status: 'rescue_triggered',
      lastSeenHoursAgo: 52
    },
    recoveryTrigger: {
      type: 'modo_pilula_rescue',
      recommendedCardsCount: 3,
      estimatedTimeMinutes: 2,
      pushTitle: `⚡ ${warName}, salve sua ofensiva no Argus!`,
      pushBody: 'A banca não descansa. Ative o Modo Pílula: só 3 flashcards rápidos hoje para manter o hábito e blindar seus 80%.',
      deepLink: 'https://argus.app.br/?modo_pilula=true'
    },
    retentionInsight: 'O envio do Modo Pílula após 48h sem estudo reverte até 41% dos cancelamentos precoces (D0-D7).'
  };

  return NextResponse.json(simulatedPayload);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, lastActiveTimestamp, streakDays = 1 } = body;

    const now = Date.now();
    const lastActive = lastActiveTimestamp ? parseInt(lastActiveTimestamp, 10) : now;
    const diffHours = Math.floor((now - lastActive) / (1000 * 60 * 60));

    const needsRescue = diffHours >= 48;

    return NextResponse.json({
      status: 'processed',
      userId: userId || 'anonymous',
      diffHours,
      needsRescue,
      action: needsRescue ? 'DISPATCH_MODO_PILULA' : 'STANDBY',
      suggestedNotification: needsRescue ? {
        title: '🔥 Sua ofensiva está sob ameaça!',
        message: 'Faça 3 flashcards ultrarrápidos agora para não perder o ritmo.'
      } : null
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao processar verificação de inatividade' },
      { status: 500 }
    );
  }
}
