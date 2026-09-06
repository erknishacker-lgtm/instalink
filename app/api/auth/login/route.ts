import { NextResponse } from 'next/server';
import { signToken, getCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const { user, pass } = await request.json();

  // Sem isto, ADMIN_USER/ADMIN_PASS ausentes deixavam a comparação virar
  // `undefined === undefined`: um POST com corpo vazio entrava como admin.
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (!adminUser || !adminPass) {
    return NextResponse.json(
      { error: 'Login ainda não configurado. Defina ADMIN_USER e ADMIN_PASS.' },
      { status: 503 }
    );
  }

  if (user === adminUser && pass === adminPass) {
    const token = await signToken({ user });
    const cookieOpts = getCookieOptions();

    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieOpts.name, token, cookieOpts);
    return response;
  }

  return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
}