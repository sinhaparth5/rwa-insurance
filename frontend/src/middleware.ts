import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  // Bot detection for better SEO handling
  const isBotRequest = /bot|crawler|spider|crawling/i.test(userAgent);
  
  // Handle dashboard routes - prevent indexing of authenticated areas
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/create-policy') || pathname.startsWith('/submit-claim')) {
    const response = NextResponse.next();
    
    // Add no-index headers for private pages
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  }

  // Handle API routes
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // SEO redirects for common misspellings and alternative URLs
  const seoRedirects: Record<string, string> = {
    '/insurance': '/',
    '/rwa-insurance': '/',
    '/tokenized-insurance': '/',
    '/blockchain-insurance': '/',
    '/ai-insurance': '/',
    '/smart-contract-insurance': '/',
    '/defi-insurance': '/',
    '/nft-insurance': '/',
  };

  if (seoRedirects[pathname]) {
    return NextResponse.redirect(new URL(seoRedirects[pathname], request.url), 301);
  }

  // Handle trailing slashes for SEO consistency
  if (pathname.endsWith('/') && pathname.length > 1) {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -1), request.url),
      301
    );
  }

  // Add SEO and security headers for public pages
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // SEO-friendly headers
  response.headers.set('Content-Language', 'en-US');
  
  // Cache control for better performance
  if (pathname.startsWith('/images/') || pathname.startsWith('/icons/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add structured data hint for bots
  if (isBotRequest) {
    response.headers.set('X-SEO-Optimized', 'true');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};