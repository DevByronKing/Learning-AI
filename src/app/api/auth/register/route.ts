import { NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, password, fullName, targetExam } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || email.split('@')[0],
              target_exam: targetExam || 'Geral',
            },
          },
        });

        if (error) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          user: data.user,
          session: data.session,
          message: 'Conta criada com sucesso no Supabase!',
          mode: 'supabase',
        });
      }
    }

    // Modo Local
    const mockId = `usr_${Buffer.from(email).toString('base64').slice(0, 12)}`;
    const mockToken = `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const response = NextResponse.json({
      success: true,
      user: {
        id: mockId,
        email,
        name: fullName || email.split('@')[0],
        targetExam: targetExam || 'Concurso Público',
      },
      session: {
        accessToken: mockToken,
        expiresAt: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
      },
      message: 'Usuário registrado com sucesso!',
      mode: 'local_dev',
    });

    response.cookies.set('learning-ai-session', mockToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Erro ao registrar usuário.' },
      { status: 500 }
    );
  }
}
