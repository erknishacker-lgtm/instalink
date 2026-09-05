import { NextResponse } from 'next/server';
import { getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Sempre ler do banco: sem isso o Next congela o GET no build.
export const dynamic = 'force-dynamic';

export async function GET() {
  const links = await getSocialLinks();
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const link = await addSocialLink(body);
  return NextResponse.json(link, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const link = await updateSocialLink(id, updates);
  if (!link) return NextResponse.json({ error: 'Link não encontrado' }, { status: 404 });
  return NextResponse.json(link);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const deleted = await deleteSocialLink(id);
  if (!deleted) return NextResponse.json({ error: 'Link não encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true });
}