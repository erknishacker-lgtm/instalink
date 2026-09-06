import { NextResponse } from 'next/server';
import { getAllPartners, addPartner, updatePartner, deletePartner } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getAllPartners());
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const body = await request.json();
  return NextResponse.json(await addPartner(body), { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
  const partner = await updatePartner(id, updates);
  if (!partner) return NextResponse.json({ error: 'Parceria não encontrada' }, { status: 404 });
  return NextResponse.json(partner);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
  const ok = await deletePartner(id);
  if (!ok) return NextResponse.json({ error: 'Parceria não encontrada' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
