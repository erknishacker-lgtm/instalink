import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo obrigatório' }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Use uma imagem JPG, PNG, WEBP ou GIF' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Imagem muito grande (máx. 4MB)' }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
