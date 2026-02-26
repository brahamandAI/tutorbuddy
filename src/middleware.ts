import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Block crypto-miner / scanner probes (security + Hostinger-friendly)
function isMinerOrScannerProbe(req: NextRequest): boolean {
  const path = req.nextUrl.pathname.toLowerCase();
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  const minerPaths = ['/stratum', '/.well-known/stratum', '/miner', '/mine', '/xmr', '/monero', '/coinhive', '/cryptonight', '/minero', '/jsecoin', '/crypto-loot', '/webmine', '/2miners', '/nanopool', '/xmrig', '/worker.min.js', '/miner.js', '/lib/cryptonight'];
  const minerUas = ['xmrig', 'ccminer', 'cgminer', 'bfgminer', 'cpuminer', 'minerd', 'nicehash', 'multipool', 'stratum'];
  if (minerPaths.some((p) => path.includes(p))) return true;
  if (minerUas.some((m) => ua.includes(m))) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  if (isMinerOrScannerProbe(request)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }
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
    // Run for API, dashboard, and all non-static routes (so miner probe block runs)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(ico|png|jpg|jpeg|gif|webp|svg|css|js)$).*)',
  ],
}; 