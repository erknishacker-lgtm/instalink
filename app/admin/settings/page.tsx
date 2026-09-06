'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { Button, Card, Field, Input, PageHeader, Skeleton, Textarea, Toggle } from '../components/ui';
import { iconMap } from '@/app/icons';
import { getSocialInputValue, normalizeSocialInput, SUPPORTED_SOCIALS } from '@/lib/socials';
import type { SiteConfig, SocialLink } from '@/lib/types';

type EditableSocial = SocialLink & { value: string };

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [socials, setSocials] = useState<EditableSocial[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetch('/api/site'), fetch('/api/social-links')])
      .then(async ([siteResponse, socialResponse]) => {
        if (!siteResponse.ok || !socialResponse.ok) throw new Error();
        const [siteConfig, socialLinks] = await Promise.all([
          siteResponse.json() as Promise<SiteConfig>,
          socialResponse.json() as Promise<SocialLink[]>,
        ]);
        setConfig(siteConfig);
        setSocials(
          SUPPORTED_SOCIALS.map((platform) => socialLinks.find((link) => link.icon === platform.icon))
            .filter((link): link is SocialLink => Boolean(link))
            .map((link) => ({ ...link, value: getSocialInputValue(link) })),
        );
      })
      .catch(() => toast.error('Não consegui carregar os ajustes.'));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!config || !socials) return;

    try {
      for (const social of socials) {
        if (social.isActive && !social.value.trim()) {
          throw new Error(`Preencha o @ ou link do ${social.title}.`);
        }
        if (social.value.trim()) normalizeSocialInput(social.icon, social.value);
      }
    } catch (error) {
      return toast.error(error instanceof Error ? error.message : 'Confira os dados das redes sociais.');
    }

    setSaving(true);
    try {
      const siteResponse = await fetch('/api/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!siteResponse.ok) {
        const body = await siteResponse.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error || 'Não consegui salvar. Tenta de novo.');
      }

      const socialResponse = await fetch('/api/social-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          links: socials.map((social) => ({
            id: social.id,
            isActive: social.isActive,
            value: social.value,
          })),
        }),
      });
      if (!socialResponse.ok) {
        const body = await socialResponse.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error || 'Não consegui salvar as redes sociais.');
      }

      const savedSocials = await socialResponse.json() as SocialLink[];
      setSocials(savedSocials.map((link, index) => ({ ...link, value: socials[index].value.trim() })));
      toast.success('Página atualizada');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não consegui salvar. Tenta de novo.');
    } finally {
      setSaving(false);
    }
  }

  if (!config || !socials) return <div className="flex flex-col gap-4"><Skeleton className="h-10 w-40" /><Skeleton className="h-64" /><Skeleton className="h-48" /></div>;
  const set = (patch: Partial<SiteConfig>) => setConfig({ ...config, ...patch });
  const setSocial = (id: string, patch: Partial<EditableSocial>) => {
    setSocials(socials.map((social) => social.id === id ? { ...social, ...patch } : social));
  };

  return (
    <form onSubmit={save}>
      <PageHeader title="Ajustes" subtitle="Sua foto, o fundo, as redes sociais e o WhatsApp." />

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

        <Card className="flex flex-col gap-5">
          <div>
            <p className="card-label">Redes sociais</p>
            <p className="mt-1 text-[13.5px] leading-snug text-ink-soft">
              Ative somente as redes que devem aparecer no fim da página.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {socials.map((social) => {
              const Icon = iconMap[social.icon] || iconMap.FaLink;
              return (
                <div key={social.id} className="rounded-3xl border border-champagne bg-white/55 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-deep text-rose">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Toggle
                      checked={social.isActive}
                      onChange={(isActive) => setSocial(social.id, { isActive })}
                      label={social.title}
                    />
                  </div>

                  {social.isActive && (
                    <div className="mt-3">
                      <Field label="@ ou link completo" htmlFor={`social-${social.id}`}>
                        <Input
                          id={`social-${social.id}`}
                          value={social.value}
                          onChange={(event) => setSocial(social.id, { value: event.target.value })}
                          placeholder="@usuario ou https://..."
                          autoCapitalize="none"
                          autoCorrect="off"
                          required
                        />
                      </Field>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="sticky bottom-24 z-30 flex justify-end md:static">
          <Button type="submit" loading={saving} icon={<Check className="h-4 w-4" />} className="shadow-lift">Salvar alterações</Button>
        </div>
      </div>
    </form>
  );
}
