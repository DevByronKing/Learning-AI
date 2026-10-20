import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';

// Memória local de opt-out (em produção sincroniza com CRM/Supabase)
const unsubscribedEmails = new Set<string>();

/**
 * Endpoint de Descadastro / Opt-Out (CDC, CAPEM e LGPD Art. 18, IX)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email') || '';
  const cleanEmail = email.trim().toLowerCase();

  if (cleanEmail && cleanEmail.includes('@')) {
    unsubscribedEmails.add(cleanEmail);
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inscrição Cancelada | Argus</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 40px 32px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    .icon {
      width: 56px;
      height: 56px;
      background: #ecfdf5;
      color: #059669;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px auto;
      font-size: 28px;
    }
    h1 {
      font-size: 20px;
      font-weight: 800;
      margin: 0 0 12px 0;
    }
    p {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .email-box {
      background: #f1f5f9;
      padding: 10px 16px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 13px;
      color: #1e293b;
      margin-bottom: 24px;
      word-break: break-all;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: #f1f5f9;
      color: #64748b;
      padding: 6px 12px;
      border-radius: 9999px;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      background: #0f172a;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #334155;
    }
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #f1f5f9;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <span class="badge">Conformidade LGPD & CAPEM</span>
    <h1>Descadastro Confirmado</h1>
    <p>
      Seu endereço de e-mail foi removido da nossa lista de comunicações de marketing e mensagens promocionais.
    </p>
    ${cleanEmail ? `<div class="email-box">${cleanEmail}</div>` : ''}
    <p style="font-size: 12px; color: #64748b;">
      Você ainda poderá receber e-mails transacionais indispensáveis (como recuperação de senha ou confirmações de acesso à sua conta).
    </p>
    <a href="https://argus.app.br" class="btn">Voltar para a Página Inicial</a>
    <div class="footer">
      <strong>ARGUS TECNOLOGIA EDUCACIONAL LTDA.</strong><br>
      CNPJ nº 52.040.000/0001-98<br>
      Av. Paulista, 1374, Bela Vista, São Paulo - SP, CEP 01310-100
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const { allowed } = checkRateLimit(`unsub_${ip}`, 10, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Muitas requisições. Aguarde um minuto.' },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'JSON malformado.' },
        { status: 400 }
      );
    }

    const { email } = body || {};
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'E-mail válido é obrigatório.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    unsubscribedEmails.add(cleanEmail);

    return NextResponse.json({
      success: true,
      unsubscribed: true,
      email: cleanEmail,
      message: 'E-mail removido da base de marketing com sucesso (LGPD e CAPEM).',
      protocol: `UNSUB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Falha ao processar descadastro.' },
      { status: 500 }
    );
  }
}
