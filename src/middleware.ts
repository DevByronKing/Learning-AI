import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
    pathname.startsWith('/edital') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/manifest');

  if (isPublicRoute) {
    return NextResponse.next();
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
      return NextResponse.json(
        { 
          success: false, 
          error: 'Acesso negado: Token JWT ausente ou expirado.',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }
  }

  // Proteção de rotas privadas de dashboard/admin no frontend
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!hasToken) {
      // Redirecionar para home com modal de autenticação ou parâmetro
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'required');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  // Anexar cabeçalhos de segurança básicos (CSP, X-Frame, X-Content-Type)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/admin/:path*',
  ],
};
