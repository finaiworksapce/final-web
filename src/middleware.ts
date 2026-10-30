import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_HOST = 'www.finai.net.tr';
const APEX_HOST = 'finai.net.tr';

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  if (hostname !== APEX_HOST) return NextResponse.next();

  const canonicalUrl = request.nextUrl.clone();
  canonicalUrl.protocol = 'https:';
  canonicalUrl.host = CANONICAL_HOST;
  return NextResponse.redirect(canonicalUrl, 308);
}

export const config = {
  matcher: '/:path*',
};
