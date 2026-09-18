import { NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        await client.auth.signOut();
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Sessão encerrada com sucesso.',
    });

    // Limpar cookie de sessão
    response.cookies.set('learning-ai-session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Erro ao encerrar sessão.' },
      { status: 500 }
    );
  }
}
