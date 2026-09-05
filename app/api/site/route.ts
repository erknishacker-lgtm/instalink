import { NextResponse } from 'next/server';
import { getSiteConfig, updateSiteConfig } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Sempre ler do banco: sem isso o Next congela o GET no build.
export const dynamic = 'force-dynamic';

export async function GET() {
  const config = await getSiteConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const updated = await updateSiteConfig(body);
  return NextResponse.json(updated);
}