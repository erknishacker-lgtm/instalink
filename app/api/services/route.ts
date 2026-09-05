import { NextResponse } from 'next/server';
import { getAllServices, addService, updateService, deleteService } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Sempre ler do banco: sem isso o Next congela o GET no build.
export const dynamic = 'force-dynamic';

export async function GET() {
  const services = await getAllServices();
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const service = await addService(body);
  return NextResponse.json(service, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const service = await updateService(id, updates);
  if (!service) return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
  return NextResponse.json(service);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const deleted = await deleteService(id);
  if (!deleted) return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true });
}