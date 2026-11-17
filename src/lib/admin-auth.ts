import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getAdminConfig() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!email || !password || !secret) {
    throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET must be configured');
  }

  return { email: email.trim().toLowerCase(), password, secret };
}

function matchesSecret(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

export function verifyAdminCredentials(email: string, password: string) {
  const config = getAdminConfig();
  return (
    matchesSecret(email.trim().toLowerCase(), config.email) &&
    matchesSecret(password, config.password)
  );
}

export function createAdminSession() {
  const config = getAdminConfig();
  const payload = Buffer.from(JSON.stringify({
    email: config.email,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  })).toString('base64url');
  const signature = createHmac('sha256', config.secret).update(payload).digest('base64url');

  return { token: `${payload}.${signature}`, maxAge: SESSION_DURATION_SECONDS };
}

export function isValidAdminSession(token?: string) {
  if (!token) return false;

  const config = getAdminConfig();
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;

  const expectedSignature = createHmac('sha256', config.secret).update(payload).digest();
  let actualSignature: Buffer;
  try {
    actualSignature = Buffer.from(signature, 'base64url');
  } catch {
    return false;
  }
  if (actualSignature.length !== expectedSignature.length || !timingSafeEqual(actualSignature, expectedSignature)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email?: unknown;
      expiresAt?: unknown;
    };
    return session.email === config.email && typeof session.expiresAt === 'number' && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin(request: NextRequest) {
  if (isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return null;
  }

  return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
}
