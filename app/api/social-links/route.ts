import { NextResponse } from 'next/server';
import { getSocialLinks, addSocialLink, updateSocialLink, updateSocialLinks, deleteSocialLink } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getSocialInputValue, getSocialPlatform, normalizeSocialInput } from '@/lib/socials';

// Sempre ler do banco: sem isso o Next congela o GET no build.
export const dynamic = 'force-dynamic';

export async function GET() {
  const links = await getSocialLinks();
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  try {
    const body = await request.json();
    const platform = getSocialPlatform(String(body.icon || ''));
    const existing = await getSocialLinks();
    if (existing.some((link) => link.icon === platform.icon)) {
      return NextResponse.json({ error: 'Essa rede social já existe.' }, { status: 409 });
    }

    const value = String(body.value || '');
    const normalized = normalizeSocialInput(platform.icon, value);
    const isActive = body.isActive === true;
    if (isActive && !normalized.link) {
      return NextResponse.json({ error: 'Preencha o @ ou link antes de exibir a rede.' }, { status: 400 });
    }

    const link = await addSocialLink({
      title: platform.title,
      icon: platform.icon,
      ...normalized,
      color: { start: '#F9A8D4', end: '#DB2777' },
      order: existing.length + 1,
      isActive,
    });
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Dados inválidos.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  try {
    const body = await request.json();

    if (Array.isArray(body.links)) {
      const currentLinks = await getSocialLinks();
      const updates = body.links.map((item: unknown) => {
        if (!item || typeof item !== 'object') throw new Error('Dados inválidos.');
        const fields = item as { id?: unknown; isActive?: unknown; value?: unknown };
        const id = typeof fields.id === 'string' ? fields.id : '';
        const current = currentLinks.find((link) => link.id === id);
        if (!current) throw new Error('Link não encontrado.');

        const value = typeof fields.value === 'string' ? fields.value : getSocialInputValue(current);
        const normalized = normalizeSocialInput(current.icon, value);
        const isActive = fields.isActive === true;
        if (isActive && !normalized.link) {
          throw new Error(`Preencha o @ ou link do ${current.title}.`);
        }

        return { id, updates: { ...normalized, isActive } };
      });

      return NextResponse.json(await updateSocialLinks(updates));
    }

    const id = typeof body.id === 'string' ? body.id : '';
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    const current = (await getSocialLinks()).find((link) => link.id === id);
    if (!current) return NextResponse.json({ error: 'Link não encontrado' }, { status: 404 });

    const value = typeof body.value === 'string' ? body.value : getSocialInputValue(current);
    const normalized = normalizeSocialInput(current.icon, value);
    const isActive = body.isActive === true;
    if (isActive && !normalized.link) {
      return NextResponse.json({ error: 'Preencha o @ ou link antes de exibir a rede.' }, { status: 400 });
    }

    const link = await updateSocialLink(id, { ...normalized, isActive });
    return NextResponse.json(link);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Dados inválidos.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
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
