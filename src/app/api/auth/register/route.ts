import { NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';

export async function POST(req: Request) {
  try {
    // Proteção contra criação em massa de contas / spam (máx 5 por minuto por IP)
    const ip = getClientIp(req);
    const { allowed, resetTime } = checkRateLimit(`register_${ip}`, 5, 60000);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Muitos registros a partir deste IP. Aguarde 1 minuto para cadastrar outra conta.',
          retryAfterSeconds: Math.ceil((resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Formato de requisição inválido (JSON malformado).' },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      fullName,
      targetExam,
      birthDate,
      parentalConsent,
      guardianName,
      guardianContact,
    } = body || {};

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

    // Validação de Idade (ECA Digital - Lei 14.811/2024, Código Civil Arts. 3º e 4º e LGPD Art. 14)
    if (!birthDate) {
      return NextResponse.json(
        {
          success: false,
          code: 'BIRTHDATE_REQUIRED',
          error: 'Data de nascimento é obrigatória para verificação etária em conformidade com o ECA Digital (Lei 14.811/2024) e a LGPD (Art. 14).',
        },
        { status: 400 }
      );
    }

    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Data de nascimento inválida.' },
        { status: 400 }
      );
    }

    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }

    if (calculatedAge < 0 || calculatedAge > 125) {
      return NextResponse.json(
        { success: false, error: 'Data de nascimento incoerente.' },
        { status: 400 }
      );
    }

    // Menores de 16 anos: Absolutamente Incapazes (Bloqueio estrito de contratação digital direta)
    if (calculatedAge < 16) {
      return NextResponse.json(
        {
          success: false,
          code: 'ECA_UNDER_16_RESTRICTED',
          error: 'O cadastro autônomo é restrito a maiores de 16 anos conforme o ECA Digital (Lei 14.811/2024), Código Civil (Art. 3º) e LGPD (Art. 14). Menores de 16 anos necessitam de representação legal e contratação presencial/assistida.',
        },
        { status: 403 }
      );
    }

    // Jovens de 16 e 17 anos: Relativamente Incapazes (Exigência de assistência legal e dados do responsável)
    if (calculatedAge >= 16 && calculatedAge < 18) {
      if (!parentalConsent || !guardianName || guardianName.trim().length < 3 || !guardianContact) {
        return NextResponse.json(
          {
            success: false,
            code: 'PARENTAL_CONSENT_REQUIRED',
            error: 'Para usuários entre 16 e 17 anos, é obrigatório registrar a autorização, nome e contato (CPF ou e-mail) do responsável legal conforme o ECA e a LGPD.',
          },
          { status: 400 }
        );
      }
    }

    const complianceAudit = {
      birthDate,
      calculatedAge,
      ageVerified: true,
      legalCapacity: calculatedAge >= 18 ? 'plena_maioridade' : 'relativamente_incapaz_assistido',
      parentalConsent: calculatedAge >= 18 ? null : true,
      guardianName: calculatedAge >= 18 ? null : guardianName,
      guardianContact: calculatedAge >= 18 ? null : guardianContact,
      verifiedAt: new Date().toISOString(),
    };

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
              ...complianceAudit,
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
        ...complianceAudit,
      },
      session: {
        accessToken: mockToken,
        expiresAt: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
      },
      message: 'Usuário registrado com sucesso!',
      mode: 'local_dev',
    });

    response.cookies.set('argus-session', mockToken, {
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
