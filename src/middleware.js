import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get('h2h_user_role')?.value;

  // Protect Admin Portal (/admin) — Redirect non-admins instantly at Edge (0ms)
  if (pathname.startsWith('/admin')) {
    if (userRole && userRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Optimize Static Assets & Cookie Pass-through
  const response = NextResponse.next();

  // Set Security & Speed Cache Headers for static assets
  if (pathname.startsWith('/_next/') || pathname.includes('/favicon.ico')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
};
