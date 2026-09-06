import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Lê as meta tags Open Graph de um link de afiliado para preencher imagem,
// nome e descrição do produto sem a dona precisar copiar nada à mão.
function pickMeta(html: string, names: string[]): string | undefined {
  for (const name of names) {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${name}["']`,
      'i'
    );
    const m = html.match(re);
    const v = m?.[1] || m?.[2];
    if (v) return v.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
  }
  return undefined;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const raw = new URL(request.url).searchParams.get('url') || '';
  let target: URL;
  try {
    target = new URL(raw);
    if (!['http:', 'https:'].includes(target.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: 'Link inválido' }, { status: 400 });
  }
  // Nunca buscar endereços internos.
  if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.0\.0\.0|\[::1\])/.test(target.hostname)) {
    return NextResponse.json({ error: 'Link inválido' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(target, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        accept: 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timer);
    const html = (await res.text()).slice(0, 400_000);

    const image = pickMeta(html, ['og:image:secure_url', 'og:image', 'twitter:image']);
    const title = pickMeta(html, ['og:title', 'twitter:title']) || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
    const description = pickMeta(html, ['og:description', 'description', 'twitter:description']);

    // Marketplaces como Shopee e Amazon devolvem uma casca sem produto nenhum:
    // vem o título genérico da loja e nenhuma imagem. Preencher com isso deixava
    // achadinhos chamados "Shopee Brasil | Ofertas incríveis". Sem og:image não é
    // página de produto de verdade, então preferimos falhar e dizer o porquê.
    if (!image) {
      return NextResponse.json(
        { error: `${target.hostname.replace(/^www\./, '')} não deixa ler o link. Envie a foto e escreva o nome à mão.` },
        { status: 422 }
      );
    }

    return NextResponse.json({
      image: new URL(image, res.url).toString(),
      title: title || '',
      description: description || '',
    });
  } catch {
    return NextResponse.json({ error: 'Não consegui ler esse link. Você pode preencher à mão.' }, { status: 422 });
  }
}
