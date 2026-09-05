import { NextResponse } from 'next/server';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Sempre ler do banco: sem isso o Next congela o GET no build.
export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const product = await addProduct(body);
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const product = await updateProduct(id, updates);
  if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const deleted = await deleteProduct(id);
  if (!deleted) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true });
}