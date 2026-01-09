import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Handle Socket.IO upgrade requests
  if (request.headers.get('upgrade') === 'websocket') {
    // For now, allow all WebSocket connections
    // TODO: Implement proper WebSocket authentication
    return NextResponse.next();
  }

  // Protected API routes - let them handle their own authentication
  // Exclude public API routes from authentication
  const publicApiRoutes = ['/api/auth', '/api/ncert', '/api/learning', '/api/pdf'];
  const isPublicApi = publicApiRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (request.nextUrl.pathname.startsWith('/api') && !isPublicApi) {
    // Check if Authorization header is present (basic validation)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // Let the API route handle the actual token verification
    return NextResponse.next();
  }

  // Protected pages - redirect to login if no token in cookies
  const protectedPaths = ['/dashboard', '/messages', '/bookings', '/settings', '/student', '/tutor'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Let the page handle its own authentication
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/messages/:path*',
    '/bookings/:path*',
    '/settings/:path*',
  ],
}; 