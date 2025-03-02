import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    console.log(`[Middleware] Processing request for: ${req.nextUrl.pathname}`);
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[Middleware] Session error:', sessionError);
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // If no session, redirect to login for protected routes
    if (!session) {
      console.log('[Middleware] No session detected');
      const isProtectedRoute = 
        req.nextUrl.pathname.startsWith('/super-admin') ||
        req.nextUrl.pathname.startsWith('/admin') ||
        req.nextUrl.pathname.startsWith('/dashboard');
        
      if (isProtectedRoute) {
        console.log('[Middleware] Protected route access without session, redirecting to login');
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      
      // Allow public routes to proceed
      console.log('[Middleware] Allowing public route access');
      return res;
    }
    
    console.log(`[Middleware] Session found for user: ${session.user.id}`);
    
    // For authenticated users, check role-based access
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, email')
      .eq('id', session.user.id)
      .single();
    
    if (userError) {
      console.error('[Middleware] User data fetch error:', userError);
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    
    const userRole = userData?.role;
    console.log(`[Middleware] User ${userData?.email} has role: ${userRole}, accessing: ${req.nextUrl.pathname}`);
    
    // Cache the role in a cookie for future requests
    res.cookies.set('user_role', userRole || 'user', { 
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    });
    
    // Handle role-based route protection
    if (req.nextUrl.pathname.startsWith('/super-admin')) {
      if (userRole !== 'super_admin') {
        console.log('[Middleware] Access denied to super-admin route - not a super_admin');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      console.log('[Middleware] Super admin access granted to super-admin route');
    } 
    else if (req.nextUrl.pathname.startsWith('/admin')) {
      if (userRole !== 'admin' && userRole !== 'super_admin') {
        console.log('[Middleware] Access denied to admin route - not an admin or super_admin');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      console.log('[Middleware] Admin access granted to admin route');
    }
    
    // If the user is on the login page but already authenticated, redirect them to their appropriate dashboard
    if (req.nextUrl.pathname === '/auth/login' && session) {
      console.log('[Middleware] User already authenticated, redirecting to appropriate dashboard');
      switch (userRole) {
        case 'super_admin':
          console.log('[Middleware] Redirecting to super admin dashboard');
          return NextResponse.redirect(new URL('/super-admin', req.url));
        case 'admin':
          console.log('[Middleware] Redirecting to admin dashboard');
          return NextResponse.redirect(new URL('/admin', req.url));
        default:
          console.log('[Middleware] Redirecting to user dashboard');
          return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    console.log('[Middleware] Proceeding with authenticated request');
    return res;
  } catch (error) {
    console.error('[Middleware] Critical error:', error);
    // Log additional context
    console.error(`[Middleware] URL: ${req.nextUrl.toString()}, Method: ${req.method}`);
    return NextResponse.redirect(new URL('/error', req.url));
  }
}

export const config = {
  matcher: [
    '/super-admin/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/login'
  ]
};