import { NextResponse } from 'next/server';
import { signToken, getCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const { user, pass } = await request.json();

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    const token = await signToken({ user });
    const cookieOpts = getCookieOptions();

    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieOpts.name, token, cookieOpts);
    return response;
  }

  return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
}