'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Check, X, Wand2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import SafeImg from '@/app/components/SafeImg';
import { Button, Card, EmptyState, Field, IconButton, Input, PageHeader, Skeleton, Tag, Textarea, Toggle } from '../components/ui';
import { MoveButtons, ReorderToggle, useReorder } from '../components/reorder';

interface Product { id: string; name: string; imageUrl: string; affiliateLink: string; description?: string; isActive: boolean; order: number; }
const empty = { name: '', imageUrl: '', affiliateLink: '', description: '', isActive: true, order: 0 };

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [lastFetched, setLastFetched] = useState('');
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  async function load() { setItems(await fetch('/api/products').then(r => r.json())); }
  useEffect(() => { load(); }, []);
  const reorder = useReorder('/api/products', items, setItems, load);
  function reset() { setForm(empty); setEditing(null); setShowForm(false); setLastFetched(''); }

  // Cola o link e a imagem, o nome e a descrição vêm sozinhos da loja. A rota só
  // responde quando achou a foto do produto, então nada de lixo entra no form.
  async function fetchFromLink(link: string, force = false) {
    const url = link.trim();
    if (!url || (!force && url === lastFetched)) return;
    if (!/^https?:\/\/\S+\.\S/i.test(url)) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Não consegui ler esse link');
      setLastFetched(url);
      setForm(f => ({
        ...f,
        imageUrl: force || !f.imageUrl ? data.image : f.imageUrl,
        name: f.name || data.title || '',
        description: f.description || data.description || '',
      }));
      toast.success('Peguei a foto do produto');
    } catch (err) {
      setLastFetched(url);
      toast.error(err instanceof Error ? err.message : 'Não consegui ler esse link');
    } finally {
      setFetching(false);
    }
  }

  // Ela cola o link e não faz mais nada: a busca dispara sozinha assim que a
  // digitação para. O botão e o blur continuam como saída manual.
  function onLinkChange(link: string) {
    setForm(f => ({ ...f, affiliateLink: link }));
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetchFromLink(link), 700);
  }

  useEffect(() => () => clearTimeout(debounce.current), []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, order: form.order || (items?.length || 0) + 1, ...(editing ? { id: editing } : {}) };
    const res = await fetch('/api/products', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    if (!res.ok) return toast.error('Não consegui salvar. Tenta de novo.');
    toast.success(editing ? 'Achadinho atualizado' : 'Achadinho adicionado');
    reset(); load();
  }

  async function remove(p: Product) {
    if (!confirm(`Remover "${p.name}" do catálogo?`)) return;
    await fetch(`/api/products?id=${p.id}`, { method: 'DELETE' });
    toast.success('Removido'); load();
  }

  function edit(p: Product) {
    setForm({ name: p.name, imageUrl: p.imageUrl, affiliateLink: p.affiliateLink, description: p.description || '', isActive: p.isActive, order: p.order });
    setLastFetched(p.affiliateLink);
    setEditing(p.id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <PageHeader title="Achadinhos" subtitle="Cole o link de afiliado: a foto e o nome vêm sozinhos quando a loja deixa."
        action={!showForm && (
          <div className="flex gap-2">
            {!!items?.length && <ReorderToggle active={reorder.active} onClick={() => reorder.setActive(!reorder.active)} />}
            {!reorder.active && <Button icon={<Plus className="h-4 w-4" />} onClick={() => { reset(); setShowForm(true); }}>Novo</Button>}
          </div>
        )} />

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.form key="form" onSubmit={save} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <Card className="mb-6 flex flex-col gap-4">
              <p className="text-[15px] font-semibold text-ink">{editing ? 'Editar achadinho' : 'Novo achadinho'}</p>
              <Field label="Link de afiliado" htmlFor="aff" hint="Cole e solte: eu busco a foto sozinha. Algumas lojas grandes bloqueiam a leitura — aí é só enviar a foto.">
                <div className="flex gap-2">
                  <Input id="aff" value={form.affiliateLink} onChange={e => onLinkChange(e.target.value)} onBlur={() => fetchFromLink(form.affiliateLink)} placeholder="https://shopee.com.br/..." inputMode="url" required autoFocus />
                  <Button type="button" variant="secondary" loading={fetching} icon={<Wand2 className="h-4 w-4" />} onClick={() => fetchFromLink(form.affiliateLink, true)} className="shrink-0 px-4" aria-label="Buscar dados do link">
                    <span className="hidden sm:inline">Buscar</span>
                  </Button>
                </div>
              </Field>
              <ImageUpload label="Foto do produto" value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} shape="square" hint={fetching ? 'Buscando a foto na loja…' : 'Veio do link, ou envie a sua.'} />
              <Field label="Nome" htmlFor="name"><Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Sérum de vitamina C" required /></Field>
              <Field label="Por que você indica" htmlFor="desc" hint="opcional, uma frase">
                <Textarea id="desc" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Toggle checked={form.isActive} onChange={v => setForm({ ...form, isActive: v })} label="Visível no catálogo" />
              <div className="flex gap-2 pt-1">
                <Button type="submit" loading={saving} icon={<Check className="h-4 w-4" />}>Salvar</Button>
                <Button type="button" variant="ghost" icon={<X className="h-4 w-4" />} onClick={reset}>Cancelar</Button>
              </div>
            </Card>
          </motion.form>
        )}
      </AnimatePresence>

      {!items ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3"><Skeleton className="aspect-[4/5]" /><Skeleton className="aspect-[4/5]" /><Skeleton className="aspect-[4/5]" /></div>
      : items.length === 0 ? <EmptyState title="Catálogo vazio" body="Cole o primeiro link de afiliado. A foto e o nome do produto vêm da loja." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>Adicionar o primeiro</Button>} />
      : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <AnimatePresence initial={false}>
            {items.map((p, i) => (
              <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}
                className={`overflow-hidden rounded-3xl border border-champagne bg-paper-lift/90 shadow-card ${p.isActive ? '' : 'opacity-60'}`}>
                <div className="relative aspect-square bg-paper-deep">
                  <SafeImg
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    fallback={<div className="flex h-full items-center justify-center text-[12px] font-medium text-ink-mute">sem foto</div>}
                  />
                  {!p.isActive && <span className="absolute left-2 top-2"><Tag tone="mute">oculto</Tag></span>}
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink">{p.name}</p>
                  <div className="mt-2 flex gap-1">
                    {reorder.active ? <MoveButtons index={i} total={items.length} onMove={reorder.move} axis="horizontal" /> : (
                      <>
                        <Button type="button" variant="secondary" size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => edit(p)} className="flex-1">Editar</Button>
                        <IconButton label="Remover" onClick={() => remove(p)} className="h-10 w-10 hover:text-rose"><Trash2 className="h-4 w-4" /></IconButton>
                      </>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
