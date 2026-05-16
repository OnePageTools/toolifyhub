
import { NextRequest } from 'next/server';

const requests = new Map();

/**
 * Basic memory-based rate limiting for API routes.
 * @param request The incoming NextRequest
 * @param limit Maximum number of requests allowed in the window
 * @param window Time window in milliseconds
 */
export function rateLimit(
  request: NextRequest, 
  limit: number = 20,
  window: number = 60000
) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
    || request.headers.get('x-real-ip') 
    || 'anonymous';
  
  const now = Date.now();
  const windowStart = now - window;
  
  const requestTimes = requests.get(ip) || [];
  const recentRequests = requestTimes.filter(
    (time: number) => time > windowStart
  );
  
  if (recentRequests.length >= limit) {
    return false;
  }
  
  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return true;
}
