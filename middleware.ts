import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');
    const isProfilePage = req.nextUrl.pathname.startsWith('/profile');
    const isCRMPage = req.nextUrl.pathname.startsWith('/crm');
    const isFormsPage = req.nextUrl.pathname.startsWith('/forms');
    const isAnalyticsPage = req.nextUrl.pathname.startsWith('/analytics');
    const isWorkflowsPage = req.nextUrl.pathname.startsWith('/workflows');
    const isLandingPagesPage = req.nextUrl.pathname.startsWith('/landing-pages');

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Protect admin pages - require admin role
    if (isAdminPage && (!isAuth || token?.role !== 'admin')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Protect dashboard, profile, CRM, Forms, Analytics, Workflows, and Landing Pages - require any authenticated user
    if ((isDashboardPage || isProfilePage || isCRMPage || isFormsPage || isAnalyticsPage || isWorkflowsPage || isLandingPagesPage) && !isAuth) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // We handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*', '/crm/:path*', '/forms/:path*', '/analytics/:path*', '/workflows/:path*', '/landing-pages/:path*', '/auth/:path*'],
};
