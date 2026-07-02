import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    
    const pathname = req.nextUrl.pathname;
    
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isAdminLogin = pathname === '/admin/login';
    const isAdminPage = pathname.startsWith('/admin') && !isAdminLogin;
    const isDashboardPage = pathname.startsWith('/dashboard');
    const isBookPage = pathname.startsWith('/book');

    // If trying to access an auth page (login/register/admin-login) while authenticated
    if (isAuthPage || isAdminLogin) {
      if (isAuth) {
        if (token.role === "ADMIN") {
          return NextResponse.redirect(new URL('/admin', req.url));
        }
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    // If trying to access protected routes while unauthenticated
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      
      if (isAdminPage) {
        return NextResponse.redirect(new URL(`/admin/login`, req.url));
      }
      
      if (isDashboardPage || isBookPage) {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
        );
      }
    }

    // Role-based access control for authenticated users
    if (isAuth) {
      if (isAdminPage && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      
      if (isDashboardPage && token.role === "ADMIN") {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true, // We handle redirects in the middleware function above
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register', '/book/:path*'],
};
