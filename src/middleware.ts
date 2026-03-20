import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Since we rely on client-side Firebase Auth, we cannot strictly verify tokens in Edge runtime
  // easily without firebase-admin. However, we can check for a cookie or session if we had one.
  // Since the prompt asks for middleware to protect routes but standard Firebase Auth is client-side,
  // we can do a soft redirect based on a cookie, OR we'll let the client handle it if the middleware
  // approach is too complex for standard firebase without setting custom cookies.

  // Actually, the prompt states: "Create middleware.ts at root to protect /dashboard and /publish routes.
  // If not authenticated, redirect to /?login=required."

  // Since we use Firebase client auth, the auth token isn't automatically in cookies.
  // We'll write a simple middleware that redirects to /?login=required if there's no custom 'auth' cookie.
  // To make it fully work according to prompt, we should just assume the cookie `isLogged=true` is set on login.
  // Wait, I will just let the client side `useAuth` handle the actual redirection and use middleware to 
  // check a generic cookie. BUT, I didn't set a cookie in AuthContext.

  // To strictly follow the prompt, I will implement it.
  // And I'll update AuthContext to set/remove 'auth-session' cookie.

  const hasSession = request.cookies.has('auth-session');

  if (!hasSession && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/publish'))) {
    return NextResponse.redirect(new URL('/?login=required', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/publish/:path*'],
};
