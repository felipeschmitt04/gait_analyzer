import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!token;

  //REGRAS PARA O ADMINISTRADOR
  if (pathname.startsWith('/admin')) {
    // Se tentar acessar qualquer rota de /admin sem ser admin, chuta para o login-admin
    if (!isAuthenticated || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login-admin', request.url));
    }
  }

  //  REGRAS PARA PÁGINAS GERAIS DO DASHBOARD (/pacientes, /configuracoes, etc)
  // Protege contra usuários não logados
  const rotasDashboard = ['/pacientes', '/configuracoes', '/visualizacao', '/nova-analise', '/historico'];
  const acessandoDashboard = rotasDashboard.some(rota => pathname.startsWith(rota));

  if (!isAuthenticated && acessandoDashboard) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  //EVITAR LOGIN DUPLICADO E REDIRECIONAMENTO INTELIGENTE
  if (isAuthenticated && (pathname === '/login' || pathname === '/login-admin')) {
    // Se o admin tentar entrar na tela de login, manda para profissionais
    // Se o usuário comum tentar, manda para pacientes
    const homeDestino = userRole === 'admin' ? '/admin/profissionais' : '/pacientes';
    return NextResponse.redirect(new URL(homeDestino, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Mantém a proteção em tudo, exceto arquivos internos e estáticos
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}