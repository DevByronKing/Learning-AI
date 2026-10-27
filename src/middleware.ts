import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getClientIp, checkRateLimitWithProfile, banIp, isIpBanned } from '@/lib/rateLimiter';
import { detectSqlInjection, detectXss, detectPathTraversal, validateCsrfProtection } from '@/lib/securitySanitizer';
import { siemEngine } from '@/lib/siemEngine';

// Rotas comuns de varredura automatizada (scanners de vulnerabilidades, WordPress, phpMyAdmin e painéis expostos)
const BOT_PROBE_PATHS = [
  '/wp-admin',
  '/wp-login',
  '/wp-login.php',
  '/wp-content',
  '/wp-includes',
  '/xmlrpc.php',
  '/wp-config.php',
  '/admin.php',
  '/phpmyadmin',
  '/pma',
  '/solr',
  '/actuator',
  '/.env',
  '/.git',
  '/.vscode',
  '/.svn',
  '/cgi-bin',
  '/setup.php',
  '/install.php',
];

// Extensões de arquivos sensíveis que nunca devem ser expostos publicamente na raiz ou subdiretórios
const SENSITIVE_EXTENSIONS = [
  '.env',
  '.sql',
  '.bak',
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.log',
  '.db',
  '.sqlite',
  '.yml',
  '.yaml',
  '.ini',
  '.sh',
  '.conf',
];

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.google.com https://*.gstatic.com https://connect.facebook.net https://*.facebook.net https://*.facebook.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; frame-ancestors 'none';"
  );
  return response;
}

/**
 * Middleware Central de WAF, Segurança Ativa, Anti-Scanners, Rate Limiting e Monetização do Argus.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const clientIp = getClientIp(request);

  // 1. Verificação de IP Banido no WAF IP Jail
  const banStatus = isIpBanned(clientIp);
  if (banStatus.banned) {
    const bannedResponse = NextResponse.json(
      {
        success: false,
        error: `Acesso temporariamente bloqueado pelo WAF por atividade suspeita (${banStatus.reason}).`,
        code: 'IP_JAILED',
        retryAfter: banStatus.retryAfterSeconds,
      },
      { status: 403 }
    );
    bannedResponse.headers.set('Retry-After', (banStatus.retryAfterSeconds || 60).toString());
    return applySecurityHeaders(bannedResponse);
  }

  // 2. Proteção contra Scanners e Bot Traps (Honeypot para WordPress / CMS / Scanners)
  const isBotProbe = BOT_PROBE_PATHS.some((probe) => 
    pathname === probe || pathname.startsWith(probe + '/') || pathname.includes(probe)
  );

  if (isBotProbe) {
    // Penaliza o IP malicioso no WAF Jail por tentar sondar caminhos de CMS/WordPress
    banIp(clientIp, 'Tentativa de scan em rota proibida (Honeypot Bot Trap)', 15 * 60 * 1000);
    siemEngine.logEvent({
      eventType: 'WAF_IP_BANNED',
      severity: 'HIGH',
      sourceIp: clientIp,
      details: { pathname, reason: 'Honeypot Bot Trap' },
    });

    const botTrapResponse = NextResponse.json(
      {
        success: false,
        error: 'Acesso Proibido: Varredura automatizada detectada e bloqueada pelo firewall do Argus.',
        code: 'SECURITY_TRAP_TRIGGERED',
      },
      { status: 403 }
    );
    botTrapResponse.headers.set('X-Security-Action', 'BOT_TRAP_TRIGGERED');
    return applySecurityHeaders(botTrapResponse);
  }

  // 3. Proteção contra Exposição de Arquivos Sensíveis na Raiz (.env, .sql, .bak, .zip, etc.)
  const hasSensitiveExtension = SENSITIVE_EXTENSIONS.some((ext) => pathname.toLowerCase().endsWith(ext));
  if (hasSensitiveExtension) {
    const fileBlockedResponse = NextResponse.json(
      {
        success: false,
        error: 'Arquivo inacessível.',
        code: 'FILE_ACCESS_DENIED',
      },
      { status: 404 }
    );
    return applySecurityHeaders(fileBlockedResponse);
  }

  // 4. Detecção Ativa de SQL Injection, XSS e Path Traversal em Query Parameters
  for (const [key, value] of searchParams.entries()) {
    if (detectSqlInjection(value) || detectSqlInjection(key)) {
      banIp(clientIp, 'Tentativa de SQL Injection detectada', 30 * 60 * 1000);
      siemEngine.logEvent({
        eventType: 'SQLI_ATTEMPT',
        severity: 'CRITICAL',
        sourceIp: clientIp,
        details: { key, value: String(value).substring(0, 100) },
      });
      const sqliResponse = NextResponse.json(
        {
          success: false,
          error: 'Requisição bloqueada pelo WAF: Assinatura de SQL Injection identificada nos parâmetros.',
          code: 'SQLI_DETECTED',
        },
        { status: 400 }
      );
      sqliResponse.headers.set('X-Threat-Blocked', 'SQL_INJECTION');
      return applySecurityHeaders(sqliResponse);
    }

    if (detectXss(value) || detectXss(key)) {
      siemEngine.logEvent({
        eventType: 'XSS_ATTEMPT',
        severity: 'HIGH',
        sourceIp: clientIp,
        details: { key, value: String(value).substring(0, 100) },
      });
      const xssResponse = NextResponse.json(
        {
          success: false,
          error: 'Requisição bloqueada pelo WAF: Código XSS malicioso detectado nos parâmetros.',
          code: 'XSS_DETECTED',
        },
        { status: 400 }
      );
      xssResponse.headers.set('X-Threat-Blocked', 'XSS');
      return applySecurityHeaders(xssResponse);
    }

    if (detectPathTraversal(value) || detectPathTraversal(key)) {
      const pathResponse = NextResponse.json(
        {
          success: false,
          error: 'Requisição bloqueada pelo WAF: Tentativa de manipulação de diretório (Path Traversal).',
          code: 'PATH_TRAVERSAL_DETECTED',
        },
        { status: 400 }
      );
      return applySecurityHeaders(pathResponse);
    }
  }

  // 5. Rate Limiting por Perfil nos Endpoints de API
  if (pathname.startsWith('/api/')) {
    let profile: 'auth' | 'admin' | 'ai' | 'general' = 'general';
    if (pathname.startsWith('/api/auth')) profile = 'auth';
    else if (pathname.startsWith('/api/admin')) profile = 'admin';
    else if (pathname.startsWith('/api/copilot') || pathname.startsWith('/api/discursive')) profile = 'ai';

    const rateResult = checkRateLimitWithProfile(clientIp, profile);
    if (!rateResult.allowed) {
      const rateLimitResponse = NextResponse.json(
        {
          success: false,
          error: 'Limite de requisições excedido. Aguarde antes de tentar novamente.',
          code: 'RATE_LIMIT_EXCEEDED',
          profile,
        },
        { status: 429 }
      );
      rateLimitResponse.headers.set('Retry-After', '60');
      return applySecurityHeaders(rateLimitResponse);
    }
  }

  // Rotas públicas que não necessitam de verificação de paywall
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/api/checkout') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.startsWith('/api/welcome-email') ||
    pathname.startsWith('/api/copilot') ||
    pathname.startsWith('/api/diagnosis') ||
    pathname.startsWith('/api/retention') ||
    pathname.startsWith('/edital') ||
    pathname.startsWith('/privacidade') ||
    pathname.startsWith('/termos') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/.well-known');

  // 6. Atribuição e Leitura de Experimentos A/B no Edge
  const abCookie = request.cookies.get('argus_ab_flags') || request.cookies.get('learning_ai_ab_flags');
  const hasAbCookie = Boolean(abCookie?.value);

  let experimentFlags: Record<string, string> = {
    landing_headline_copy: 'variant_a',
    auth_placement: 'variant_a',
    paywall_mode: 'variant_b',
    freemium_vs_paid_experiment: 'variant_a',
  };

  if (abCookie?.value) {
    try {
      let raw = abCookie.value;
      try { raw = decodeURIComponent(raw); } catch {}
      try { raw = decodeURIComponent(raw); } catch {}
      experimentFlags = { ...experimentFlags, ...JSON.parse(raw) };
    } catch {}
  }

  const finalizeResponse = (res: NextResponse) => {
    if (!hasAbCookie) {
      res.cookies.set({
        name: 'argus_ab_flags',
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

  // 7. Verificação de Tokens de Autenticação / Sessão
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('argus-session')?.value || 
                        request.cookies.get('learning-ai-session')?.value || 
                        request.cookies.get('sb-access-token')?.value;

  const hasToken = Boolean(
    (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 15) ||
    (sessionCookie && sessionCookie.length > 10)
  );

  // 8. Verificação de Acesso Pago ou Trial com Cartão Obrigatório
  const userAccessCookie = request.cookies.get('argus_user_access')?.value ||
                           request.cookies.get('learning_ai_user_access')?.value;
  let hasValidPaidOrTrialAccess = false;

  if (userAccessCookie) {
    try {
      let rawAccess = userAccessCookie;
      try { rawAccess = decodeURIComponent(rawAccess); } catch {}
      const parsedAccess = JSON.parse(rawAccess);
      
      const isValidStatus = parsedAccess.status === 'ativa' || parsedAccess.status === 'trial_ativo';
      const isCommitted = parsedAccess.isPayingOrCommitted === true || parsedAccess.is_paying_or_committed === true;
      const notExpired = !parsedAccess.trialEndsAt || new Date(parsedAccess.trialEndsAt).getTime() > Date.now();

      if (isValidStatus && isCommitted && notExpired) {
        hasValidPaidOrTrialAccess = true;
      }
    } catch {}
  }

  const isFreemiumBypassAllowed = experimentFlags.freemium_vs_paid_experiment === 'variant_b';

  // 9. Proteção de rotas da API Admin (AuthN/AuthZ & CSRF)
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

    // Validação estrita de CSRF em operações administrativas que alteram dados
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const origin = request.headers.get('origin');
      const referer = request.headers.get('referer');
      const csrfCheck = validateCsrfProtection({
        method: request.method,
        origin,
        referer,
        allowedOrigins: ['http://localhost:3000', 'https://argus.app.br', 'https://argus.ia'],
      });

      if (!csrfCheck.isValid) {
        siemEngine.logEvent({
          eventType: 'CSRF_VIOLATION',
          severity: 'HIGH',
          sourceIp: clientIp,
          details: { pathname, reason: csrfCheck.reason },
        });
        const csrfBlocked = NextResponse.json(
          {
            success: false,
            error: 'Requisição bloqueada por violação de política CSRF/Origin.',
            code: 'CSRF_VALIDATION_FAILED',
          },
          { status: 403 }
        );
        return applySecurityHeaders(csrfBlocked);
      }
    }
  }

  // 10. Proteção de rotas de API protegidas
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

  // 11. Proteção de rotas privadas no frontend
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
