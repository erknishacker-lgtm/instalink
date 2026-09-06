'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Eye, Link2, CalendarDays, ShoppingBag, Handshake, Settings } from 'lucide-react';
import { Button, Card, PageHeader, Skeleton } from './components/ui';
import PendingSetup, { type PendingItem } from './components/PendingSetup';

interface Stats { name: string; links: number; services: number; products: number; partners: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<PendingItem[]>([]);

  useEffect(() => {
    (async () => {
      const [site, links, services, products, partners] = await Promise.all([
        fetch('/api/site').then(r => r.json()),
        fetch('/api/useful-links').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/partners').then(r => r.json()),
      ]);
      setStats({ name: site.name, links: links.length, services: services.length, products: products.length, partners: partners.length });

      // O que a página está mostrando como substituto. Uma URL preenchida mas
      // quebrada falha igual a uma vazia, então testamos o carregamento de verdade.
      const loads = (url: string) =>
        new Promise<boolean>(resolve => {
          if (!url) return resolve(false);
          const img = new Image();
          img.onload = () => resolve(img.naturalWidth > 0);
          img.onerror = () => resolve(false);
          img.src = url;
        });

      const [temFoto, temFundo, ...fotosProduto] = await Promise.all([
        loads(site.profilePictureUrl),
        loads(site.backgroundImageUrl),
        ...(products as { imageUrl: string }[]).map(p => loads(p.imageUrl)),
      ]);

      const todo: PendingItem[] = [];
      if (!temFoto) todo.push({ label: 'Sua foto de perfil', href: '/admin/settings' });
      if (!temFundo) todo.push({ label: 'A foto de fundo da página', href: '/admin/settings' });
      const semFoto = fotosProduto.filter(ok => !ok).length;
      if (semFoto > 0) todo.push({ label: `${semFoto} achadinho${semFoto > 1 ? 's' : ''} sem foto`, href: '/admin/products' });
      const semLogo = (partners as { logoUrl?: string }[]).filter(p => !p.logoUrl).length;
      if (semLogo > 0) todo.push({ label: `${semLogo} parceria${semLogo > 1 ? 's' : ''} sem logo`, href: '/admin/partners' });
      setPending(todo);
    })();
  }, []);

  const rows = stats ? [
    { href: '/admin/services', icon: CalendarDays, label: 'Tratamentos na agenda', value: stats.services, hint: 'aparecem no cardápio de agendar' },
    { href: '/admin/partners', icon: Handshake, label: 'Parcerias', value: stats.partners, hint: 'selo de embaixadora na página' },
    { href: '/admin/products', icon: ShoppingBag, label: 'Achadinhos', value: stats.products, hint: 'no catálogo de afiliados' },
    { href: '/admin/links', icon: Link2, label: 'Links', value: stats.links, hint: 'portfólio, cursos, o que quiser' },
  ] : [];

  return (
    <div>
      <PageHeader
        title={stats ? `Oi, ${stats.name.split(' ')[0]}` : 'Oi'}
        subtitle="Tudo que aparece na sua página você troca por aqui."
        action={<a href="/" target="_blank" rel="noopener"><Button variant="primary" icon={<Eye className="h-4 w-4" />} className="shrink-0 whitespace-nowrap">Ver página</Button></a>}
      />

      <PendingSetup items={pending} />

      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <Card className="p-2">
          {!stats ? (
            <div className="flex flex-col gap-2 p-2">
              <Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" />
            </div>
          ) : (
            <ul className="divide-y divide-champagne/70">
              {rows.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="flex h-[72px] items-center gap-4 rounded-2xl px-3 transition-colors hover:bg-paper-deep/60 active:bg-paper-deep">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-pale text-rose"><r.icon className="h-5 w-5" aria-hidden /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold text-ink">{r.label}</span>
                      <span className="block truncate text-[13px] text-ink-mute">{r.hint}</span>
                    </span>
                    <span className="tabular text-[20px] font-bold text-ink">{r.value}</span>
                    <ChevronRight className="h-5 w-5 text-ink-mute" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin/settings" className="flex h-[64px] items-center gap-4 rounded-2xl px-3 transition-colors hover:bg-paper-deep/60 active:bg-paper-deep">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-pale text-rose"><Settings className="h-5 w-5" /></span>
                  <span className="flex-1 text-[15.5px] font-semibold text-ink">Foto, fundo, nome e WhatsApp</span>
                  <ChevronRight className="h-5 w-5 text-ink-mute" />
                </Link>
              </li>
            </ul>
          )}
        </Card>

        {/* Prévia ao vivo da página, no desktop. */}
        <div className="hidden md:block">
          <p className="mb-2 text-2xs uppercase tracking-[0.16em] text-ink-mute">Prévia</p>
          <div className="overflow-hidden rounded-[2rem] border-[6px] border-ink/90 bg-ink shadow-lift">
            <iframe title="Prévia da página" src="/" className="block h-[520px] w-full bg-paper" />
          </div>
        </div>
      </div>
    </div>
  );
}
