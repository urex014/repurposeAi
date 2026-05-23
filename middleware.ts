// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  
  // Protect dashboard frontend routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect sensitive API routes (e.g., AI and Credits)
  if (isApiRoute) {
    const protectedApiPaths = ['/api/ai', '/api/credits', '/api/paystack/initialize'];
    const isProtected = protectedApiPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (isProtected && !token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Specify exactly which routes the middleware should run on to optimize performance
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};