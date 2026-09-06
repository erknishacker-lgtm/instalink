'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button, Card, EmptyState, Field, IconButton, Input, PageHeader, Row, Skeleton, Tag, Toggle } from '../components/ui';
import { MoveButtons, ReorderToggle, useReorder } from '../components/reorder';
import { iconLabels } from '@/app/icons';

interface UsefulLink { id: string; title: string; link: string; isNew?: boolean; color: string | { start: string; end: string }; icon?: string; order: number; }
const empty = { title: '', link: '', isNew: false, icon: '', order: 0 };

export default function AdminLinksPage() {
  const [links, setLinks] = useState<UsefulLink[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() { setLinks(await fetch('/api/useful-links').then(r => r.json())); }
  useEffect(() => { load(); }, []);
  const reorder = useReorder('/api/useful-links', links, setLinks, load);

  function reset() { setForm(empty); setEditing(null); setShowForm(false); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, color: { start: '#F0CBD8', end: '#B3446C' }, order: form.order || (links?.length || 0) + 1, ...(editing ? { id: editing } : {}) };
    const res = await fetch('/api/useful-links', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    if (!res.ok) return toast.error('Não consegui salvar. Tenta de novo.');
    toast.success(editing ? 'Link atualizado' : 'Link adicionado');
    reset(); load();
  }

  async function remove(l: UsefulLink) {
    if (!confirm(`Remover "${l.title}" da página?`)) return;
    await fetch(`/api/useful-links?id=${l.id}`, { method: 'DELETE' });
    toast.success('Link removido'); load();
  }

  function edit(l: UsefulLink) {
    setForm({ title: l.title, link: l.link, isNew: !!l.isNew, icon: l.icon || '', order: l.order });
    setEditing(l.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <PageHeader title="Links" subtitle="Aparecem como linhas do cartão, abaixo dos achadinhos."
        action={!showForm && (
          <div className="flex gap-2">
            {!!links?.length && <ReorderToggle active={reorder.active} onClick={() => reorder.setActive(!reorder.active)} />}
            {!reorder.active && <Button icon={<Plus className="h-4 w-4" />} onClick={() => { reset(); setShowForm(true); }}>Novo</Button>}
          </div>
        )} />

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.form key="form" onSubmit={save} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <Card className="mb-6 flex flex-col gap-4">
              <p className="text-[15px] font-semibold text-ink">{editing ? 'Editar link' : 'Novo link'}</p>
              <Field label="Título" htmlFor="title"><Input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Meu portfólio" required autoFocus /></Field>
              <Field label="Endereço" htmlFor="url"><Input id="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." inputMode="url" required /></Field>
              <div className="grid grid-cols-1 gap-4">
                <Field label="Ícone" htmlFor="icon" hint="opcional">
                  <select id="icon" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="h-12 w-full rounded-2xl border border-champagne bg-white/80 px-4 text-[16px] text-ink focus:border-hot focus:outline-none focus:ring-4 focus:ring-hot/15">
                    <option value="">nenhum</option>
                    {Object.entries(iconLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
              </div>
              <Toggle checked={form.isNew} onChange={v => setForm({ ...form, isNew: v })} label='Mostrar etiqueta "novo"' />
              <div className="flex gap-2 pt-1">
                <Button type="submit" loading={saving} icon={<Check className="h-4 w-4" />}>Salvar</Button>
                <Button type="button" variant="ghost" icon={<X className="h-4 w-4" />} onClick={reset}>Cancelar</Button>
              </div>
            </Card>
          </motion.form>
        )}
      </AnimatePresence>

      {!links ? <div className="flex flex-col gap-3"><Skeleton className="h-[72px]" /><Skeleton className="h-[72px]" /></div>
      : links.length === 0 ? <EmptyState title="Nenhum link ainda" body="Portfólio, curso, formulário… qualquer endereço que você queira mostrar." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>Adicionar o primeiro</Button>} />
      : (
        <ul className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {links.map((l, i) => (
              <Row key={l.id}>
                <span className="tabular flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-pale text-[13px] font-bold text-rose">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2"><span className="truncate text-[15.5px] font-semibold text-ink">{l.title}</span>{l.isNew && <Tag>novo</Tag>}</span>
                  <span className="block truncate text-[13px] text-ink-mute">{l.link}</span>
                </span>
                {reorder.active ? <MoveButtons index={i} total={links.length} onMove={reorder.move} /> : (
                  <>
                    <IconButton label="Editar" onClick={() => edit(l)}><Pencil className="h-[18px] w-[18px]" /></IconButton>
                    <IconButton label="Remover" onClick={() => remove(l)} className="hover:text-rose"><Trash2 className="h-[18px] w-[18px]" /></IconButton>
                  </>
                )}
              </Row>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
