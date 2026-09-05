import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/adminSession';

export const config = {
  matcher: ['/admin/:path*'],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the login page through — otherwise it loops forever
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Presence of the cookie is no longer enough: the token must carry a valid
  // signature and a future expiry.
  const isAuth = await verifySessionToken(request.cookies.get('admin-auth')?.value);

  if (!isAuth) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}
