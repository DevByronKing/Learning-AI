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
 * Middleware de Segurança e Autenticação do Learning AI.
 * Protege rotas sensíveis e APIs de administração.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que nunca devem ser bloqueadas pelo middleware
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/leads') ||
    pathname.startsWith('/api/copilot') ||
    pathname.startsWith('/api/diagnosis') ||
    pathname.startsWith('/edital') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/manifest');

  if (isPublicRoute) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Obter token dos cabeçalhos ou cookies
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('learning-ai-session')?.value || 
                        request.cookies.get('sb-access-token')?.value;

  const hasToken = Boolean(
    (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 15) ||
    (sessionCookie && sessionCookie.length > 10)
  );

  // Proteção de rotas da API Admin
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

  // Proteção de rotas privadas de dashboard/admin no frontend
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!hasToken) {
      // Redirecionar para home com modal de autenticação ou parâmetro
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'required');
      loginUrl.searchParams.set('redirect', pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|fonts|images).*)',
  ],
};

