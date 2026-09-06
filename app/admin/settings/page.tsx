'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { Button, Card, Field, Input, PageHeader, Skeleton, Textarea } from '../components/ui';
import type { SiteConfig } from '@/lib/types';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/site').then(r => r.json()).then(setConfig); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    const res = await fetch('/api/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    setSaving(false);
    if (!res.ok) return toast.error('Não consegui salvar. Tenta de novo.');
    toast.success('Página atualizada');
  }

  if (!config) return <div className="flex flex-col gap-4"><Skeleton className="h-10 w-40" /><Skeleton className="h-64" /><Skeleton className="h-48" /></div>;
  const set = (patch: Partial<SiteConfig>) => setConfig({ ...config, ...patch });

  return (
    <form onSubmit={save}>
      <PageHeader title="Ajustes" subtitle="Sua foto, o fundo da página, o aviso e o WhatsApp." />

      <div className="flex flex-col gap-5">
        <Card className="flex flex-col gap-5">
          <p className="card-label">Você</p>
          <ImageUpload label="Sua foto" value={config.profilePictureUrl} onChange={url => set({ profilePictureUrl: url })} shape="round" hint="Aparece grande, num oval, no topo da página. Vertical fica melhor." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome" htmlFor="name"><Input id="name" value={config.name} onChange={e => set({ name: e.target.value })} required /></Field>
            <Field label="@ do Instagram" htmlFor="user"><Input id="user" value={config.username} onChange={e => set({ username: e.target.value })} required /></Field>
          </div>
          <Field label="Uma linha sobre você" htmlFor="bio" hint="Ex.: Esteticista · Embaixadora Kyeomi">
            <Input id="bio" value={config.bio || ''} onChange={e => set({ bio: e.target.value })} maxLength={80} />
          </Field>
        </Card>

        <Card className="flex flex-col gap-5">
          <p className="card-label">Fundo da página</p>
          <ImageUpload label="Foto de fundo" value={config.backgroundImageUrl || ''} onChange={url => set({ backgroundImageUrl: url })} shape="wide" hint="Algo delicado: flores, seda, luz suave. Ela fica atrás de um véu rosa, então não precisa ser clara. Sem foto, uso a aquarela padrão." />
        </Card>

        <Card className="flex flex-col gap-5">
          <p className="card-label">Aviso no topo</p>
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <Field label="Etiqueta" htmlFor="badge"><Input id="badge" value={config.announcementBadge} onChange={e => set({ announcementBadge: e.target.value })} placeholder="Novidade" /></Field>
            <Field label="Texto" htmlFor="ann" hint="Deixe vazio pra esconder o aviso."><Textarea id="ann" rows={2} value={config.announcementText} onChange={e => set({ announcementText: e.target.value })} /></Field>
          </div>
        </Card>

        <Card className="flex flex-col gap-5">
          <p className="card-label">WhatsApp</p>
          <Field label="Número com DDD" htmlFor="wa" hint="Só números: 55 + DDD + número. Ex.: 5511999999999">
            <Input id="wa" value={config.whatsappPhone} onChange={e => set({ whatsappPhone: e.target.value.replace(/\D/g, '') })} inputMode="numeric" required />
          </Field>
        </Card>

        <div className="sticky bottom-24 z-30 flex justify-end md:static">
          <Button type="submit" loading={saving} icon={<Check className="h-4 w-4" />} className="shadow-lift">Salvar alterações</Button>
        </div>
      </div>
    </form>
  );
}
