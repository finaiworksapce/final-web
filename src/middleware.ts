import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_HOST = 'www.finai.net.tr';
const APEX_HOST = 'finai.net.tr';

// 1. In-Memory Security Stores for Vercel Edge Middleware
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const heavyRateLimitMap = new Map<string, { count: number; lastReset: number }>();
const bannedIpsMap = new Map<string, number>(); // clientIP -> banExpirationTimestamp

const MAX_GENERAL_API_REQ_PER_MIN = 60; // Max 60 requests/minute for standard APIs
const MAX_HEAVY_API_REQ_PER_MIN = 12;   // Max 12 requests/minute for AI/Analysis endpoints (/api/chat, /api/analyze, /api/ai-portfolio)
const BAN_DURATION_MS = 60 * 60 * 1000; // 1 Hour Automatic Ban

// Known hostile automated vulnerability scanners and attack tool signatures
const BLOCKED_USER_AGENTS = [
  'sqlmap', 'nikto', 'acunetix', 'nmap', 'masscan', 'gobuster', 'dirbuster', 'wpscan', 'zgrab'
];

// Honeypot Trap Targets - Normal users never request these, only automated attack bots probe them
const HONEYPOT_PATTERNS = [
  '/.env', '/.git', '/wp-login.php', '/wp-admin', '/phpmyadmin',
  '/admin.php', '/actuator', '/xmlrpc.php', '/config.json', '/.aws',
  '/server-status', '/backup.sql', '/dump.sql', '/phpinfo.php'
];

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const path = request.nextUrl.pathname.toLowerCase();
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
    || request.headers.get('x-real-ip') 
    || '127.0.0.1';
  const now = Date.now();

  // --- LAYER 1: Check Active IP Ban List ---
  const banExpiration = bannedIpsMap.get(clientIp);
  if (banExpiration) {
    if (now < banExpiration) {
      const remainingSeconds = Math.ceil((banExpiration - now) / 1000);
      return new NextResponse('Access Denied: Hostile reconnaissance activity detected. IP temporarily blacklisted.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'Retry-After': String(remainingSeconds)
        }
      });
    } else {
      bannedIpsMap.delete(clientIp); // Ban expired
    }
  }

  // --- LAYER 2: Honeypot Canary Trap (Instant Auto-Ban) ---
  if (HONEYPOT_PATTERNS.some(hp => path === hp || path.startsWith(hp + '/') || path.endsWith(hp))) {
    bannedIpsMap.set(clientIp, now + BAN_DURATION_MS);
    return new NextResponse('Access Denied: Security honeypot triggered.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // --- LAYER 3: Block Hostile Scanner Signatures ---
  if (BLOCKED_USER_AGENTS.some(scanner => userAgent.includes(scanner))) {
    bannedIpsMap.set(clientIp, now + BAN_DURATION_MS); // Auto-ban scanners as well
    return new NextResponse('Access Denied: Hostile scanner signature detected.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // --- LAYER 4: Apex -> Canonical Domain Redirection ---
  if (hostname === APEX_HOST) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = 'https:';
    canonicalUrl.host = CANONICAL_HOST;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // --- LAYER 5: Edge Rate Limiting on API Routes ---
  if (path.startsWith('/api/')) {
    // Cron endpoints are authenticated separately by Vercel/CRON_SECRET
    if (path.startsWith('/api/cron/')) {
      return NextResponse.next();
    }

    // A. Strict Tier: Heavy AI & Resource Intensive APIs (/api/chat, /api/analyze, /api/ai-portfolio)
    const isHeavyEndpoint = path === '/api/chat' || path === '/api/analyze' || path === '/api/ai-portfolio';
    if (isHeavyEndpoint) {
      const heavyData = heavyRateLimitMap.get(clientIp) || { count: 0, lastReset: now };
      if (now - heavyData.lastReset > 60000) {
        heavyData.count = 0;
        heavyData.lastReset = now;
      }
      heavyData.count += 1;
      heavyRateLimitMap.set(clientIp, heavyData);

      if (heavyData.count > MAX_HEAVY_API_REQ_PER_MIN) {
        return new NextResponse(
          JSON.stringify({
            error: 'Bu işlem için istek sınırı aşıldı. Lütfen bir dakika bekleyin.'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60'
            }
          }
        );
      }
    }

    // B. General Tier: Standard APIs
    const apiData = rateLimitMap.get(clientIp) || { count: 0, lastReset: now };
    if (now - apiData.lastReset > 60000) {
      apiData.count = 0;
      apiData.lastReset = now;
    }
    apiData.count += 1;
    rateLimitMap.set(clientIp, apiData);

    if (apiData.count > MAX_GENERAL_API_REQ_PER_MIN) {
      return new NextResponse(
        JSON.stringify({
          error: 'Çok fazla istek gönderildi. Lütfen bir süre sonra tekrar deneyin.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
