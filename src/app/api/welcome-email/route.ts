import { NextResponse } from 'next/server';
import { triggerWelcomeEmail } from '@/lib/email/welcomeEmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, targetExam, guardianAnimal, preferredStudyHours } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'E-mail é obrigatório para envio da mensagem de boas-vindas' },
        { status: 400 }
      );
    }

    const result = await triggerWelcomeEmail({
      name: name || 'Aluno(a)',
      email,
      targetExam,
      guardianAnimal,
      preferredStudyHours,
    });

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    });
  } catch (err: any) {
    console.error('Erro na rota /api/welcome-email:', err);
    return NextResponse.json(
      { error: 'Falha interna ao processar disparo de e-mail' },
      { status: 500 }
    );
  }
}
