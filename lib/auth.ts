import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_token';

// O fallback fixo que existia aqui vazava no repositório: quem lesse o código
// conseguiria assinar um cookie de admin válido em produção. Em dev ele ainda
// serve, em produção falta de segredo é erro — e erro aqui tranca a porta.
function secret(): Uint8Array {
  const value = process.env.JWT_SECRET;
  if (!value) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET não configurado.');
    }
    return new TextEncoder().encode('segredo-so-de-desenvolvimento');
  }
  return new TextEncoder().encode(value);
}

export async function signToken(payload: { user: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret());
}

export async function verifyToken(token: string): Promise<{ user: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { user: string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ user: string } | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  };
}