import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /dashboard and all sub-routes
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('il_access_token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === '/login') {
    const token = req.cookies.get('il_access_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
