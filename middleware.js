import { NextResponse } from 'next/server';
import { verifySessionToken, isOwnerOnlyPage } from '@/lib/adminSession';

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
  const session = await verifySessionToken(request.cookies.get('admin-auth')?.value);

  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // A seller opening an owner-only page (money, pay, team) lands on Today.
  // The APIs behind those pages refuse sellers on their own as well.
  if (session.role !== 'admin' && isOwnerOnlyPage(pathname)) {
    return NextResponse.redirect(new URL('/admin/today', request.url));
  }

  return NextResponse.next();
}
