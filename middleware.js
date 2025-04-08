import { NextResponse } from 'next/server';

export const config = {
    matcher: ['/admin/:path*'],
  };
  
export function middleware(request) {
  const isAuth = request.cookies.get('admin-auth')?.value;

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPath && !isAuth) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}
