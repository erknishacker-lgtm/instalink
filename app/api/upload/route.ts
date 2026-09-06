import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 4 * 1024 * 1024;
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Mesma lógica do lib/db.ts: sem credenciais (dev local) grava em disco, em
// produção exige o serviço de verdade — o filesystem da Vercel é efêmero.
async function store(file: File, ext: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(file.name, file, { access: 'public', addRandomSuffix: true });
    return blob.url;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Upload não configurado. Defina BLOB_READ_WRITE_TOKEN nas variáveis de ambiente.');
  }
  // O nome vem do cliente, então nunca o usamos no caminho: só a extensão validada.
  const name = `${crypto.randomUUID()}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo obrigatório' }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'Use uma imagem JPG, PNG, WEBP ou GIF' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Imagem muito grande (máx. 4MB)' }, { status: 400 });
  }

  // Sem isto a rota estoura e o Next devolve HTML: o admin lê "Unexpected end of
  // JSON input" em vez do motivo real.
  try {
    return NextResponse.json({ url: await store(file, ext) });
  } catch (err) {
    console.error('upload falhou', err);
    const message = err instanceof Error ? err.message : 'Falha ao salvar a imagem';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
