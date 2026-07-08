import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the login page through — otherwise it loops forever
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const isAuth = request.cookies.get('admin-auth')?.value;

  if (!isAuth) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}
