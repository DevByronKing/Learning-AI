import { NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'Nenhuma sessão ativa encontrada.' },
        { status: 200 }
      );
    }

    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        const { data: { user }, error } = await client.auth.getUser(token);
        if (error || !user) {
          return NextResponse.json(
            { authenticated: false, error: error?.message || 'Token inválido' },
            { status: 401 }
          );
        }

        // Buscar perfil complementar
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        return NextResponse.json({
          authenticated: true,
          user: {
            id: user.id,
            email: user.email,
            profile,
          },
          mode: 'supabase',
        });
      }
    }

    // Modo local: se possuir token jwt_mock_
    if (token.startsWith('jwt_mock_') || token.length > 10) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: 'usr_local_active',
          email: 'aluno@learningai.com.br',
          name: 'Concurseiro Alta Performance',
          role: 'student',
        },
        mode: 'local_dev',
      });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, error: err?.message },
      { status: 500 }
    );
  }
}
