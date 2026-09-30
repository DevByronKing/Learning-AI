import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

/**
 * Middleware de Segurança, Monetização e Bloqueio de Acesso do Learning AI.
 * Aplica a diretriz de "Não usar Freemium no começo":
 * - Exige assinatura ativa ('ativa') ou período de trial validado com cartão ('trial_ativo').
 * - Protege rotas de infraestrutura e consumo de LLMs contra curiosos sem compromisso financeiro.
 * - Suporta a Feature Flag de Trava de Escala ('freemium_vs_paid_experiment') no Edge.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que nunca devem ser bloqueadas pelo middleware
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/design-system') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/api/checkout') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.startsWith('/api/welcome-email') ||
    pathname.startsWith('/api/copilot') ||
    pathname.startsWith('/api/diagnosis') ||
    pathname.startsWith('/edital') ||
    pathname.startsWith('/privacidade') ||
    pathname.startsWith('/termos') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/manifest');

  // 1. Atribuição e Leitura de Experimentos A/B no Edge (Zero-flicker & Sem Deploy)
  const abCookie = request.cookies.get('learning_ai_ab_flags');
  const hasAbCookie = Boolean(abCookie?.value);

  let experimentFlags: Record<string, string> = {
    landing_headline_copy: 'variant_a',
    auth_placement: 'variant_a',
    paywall_mode: 'variant_b',
    freemium_vs_paid_experiment: 'variant_a', // Padrão: 100% Linear Pago / Trial Obrigatório
  };

  if (abCookie?.value) {
    try {
      let raw = abCookie.value;
      try { raw = decodeURIComponent(raw); } catch {}
      try { raw = decodeURIComponent(raw); } catch {}
      experimentFlags = { ...experimentFlags, ...JSON.parse(raw) };
    } catch {}
  }

  // Helper para preparar response com cookies e security headers
  const finalizeResponse = (res: NextResponse) => {
    if (!hasAbCookie) {
      res.cookies.set({
        name: 'learning_ai_ab_flags',
        value: JSON.stringify(experimentFlags),
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        sameSite: 'lax',
      });
    }
    return applySecurityHeaders(res);
  };

  if (isPublicRoute) {
    return finalizeResponse(NextResponse.next());
  }

  // 2. Verificação de Tokens de Autenticação / Sessão
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('learning-ai-session')?.value || 
                        request.cookies.get('sb-access-token')?.value;

  const hasToken = Boolean(
    (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 15) ||
    (sessionCookie && sessionCookie.length > 10)
  );

  // 3. Verificação de Acesso Pago ou Trial com Cartão Obrigatório
  const userAccessCookie = request.cookies.get('learning_ai_user_access')?.value;
  let hasValidPaidOrTrialAccess = false;

  if (userAccessCookie) {
    try {
      let rawAccess = userAccessCookie;
      try { rawAccess = decodeURIComponent(rawAccess); } catch {}
      const parsedAccess = JSON.parse(rawAccess);
      
      const isValidStatus = parsedAccess.status === 'ativa' || parsedAccess.status === 'trial_ativo';
      const isCommitted = parsedAccess.isPayingOrCommitted === true || parsedAccess.is_paying_or_committed === true;
      
      // Se for trial, valida data de expiração caso exista
      const notExpired = !parsedAccess.trialEndsAt || new Date(parsedAccess.trialEndsAt).getTime() > Date.now();

      if (isValidStatus && isCommitted && notExpired) {
        hasValidPaidOrTrialAccess = true;
      }
    } catch {}
  }

  // Trava de escala: Se a flag for 'variant_b' (Freemium liberado para escala), flexibiliza
  const isFreemiumBypassAllowed = experimentFlags.freemium_vs_paid_experiment === 'variant_b';

  // 4. Proteção de rotas da API Admin
  if (pathname.startsWith('/api/admin')) {
    if (!hasToken) {
      const unauthorizedResponse = NextResponse.json(
        { 
          success: false, 
          error: 'Acesso negado: Token JWT ausente ou expirado.',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
      return applySecurityHeaders(unauthorizedResponse);
    }
  }

  // 5. Proteção de rotas de API protegidas (simulados, geração de IA, discursivas)
  if (pathname.startsWith('/api/protected') || pathname.startsWith('/api/simulado') || pathname.startsWith('/api/ai-correction')) {
    if (!hasValidPaidOrTrialAccess && !isFreemiumBypassAllowed) {
      const paymentRequiredResponse = NextResponse.json(
        {
          success: false,
          error: 'Acesso restrito. É necessário possuir uma assinatura ativa ou trial validado com cartão de crédito.',
          code: 'PAYMENT_OR_TRIAL_REQUIRED',
        },
        { status: 402 }
      );
      return applySecurityHeaders(paymentRequiredResponse);
    }
  }

  // 6. Proteção de rotas privadas e cockpits no frontend (/dashboard, /app, /study, /admin)
  const isProtectedAppRoute = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/app') || 
    pathname.startsWith('/study') ||
    pathname.startsWith('/simulado');

  if (isProtectedAppRoute) {
    if (pathname.startsWith('/admin') && !hasToken) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'required');
      loginUrl.searchParams.set('redirect', pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    if (!hasValidPaidOrTrialAccess && !isFreemiumBypassAllowed) {
      // Redireciona diretamente para o Paywall Linear sem rota gratuita
      const paywallUrl = new URL('/', request.url);
      paywallUrl.searchParams.set('paywall', 'required');
      paywallUrl.searchParams.set('reason', 'subscription_or_trial_required');
      paywallUrl.searchParams.set('redirect', pathname);
      return applySecurityHeaders(NextResponse.redirect(paywallUrl));
    }
  }

  const response = NextResponse.next();
  return finalizeResponse(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|fonts|images).*)',
  ],
};

