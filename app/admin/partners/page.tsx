'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import SafeImg from '@/app/components/SafeImg';
import { Button, Card, EmptyState, Field, IconButton, Input, PageHeader, Row, Skeleton, Tag, Toggle } from '../components/ui';
import { MoveButtons, ReorderToggle, useReorder } from '../components/reorder';

interface Partner { id: string; name: string; role: string; link: string; logoUrl?: string; isActive: boolean; order: number; }
const empty = { name: '', role: 'Embaixadora oficial', link: '', logoUrl: '', isActive: true, order: 0 };

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() { setItems(await fetch('/api/partners').then(r => r.json())); }
  useEffect(() => { load(); }, []);
  const reorder = useReorder('/api/partners', items, setItems, load);
  function reset() { setForm(empty); setEditing(null); setShowForm(false); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, order: form.order || (items?.length || 0) + 1, ...(editing ? { id: editing } : {}) };
    const res = await fetch('/api/partners', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    if (!res.ok) return toast.error('Não consegui salvar. Tenta de novo.');
    toast.success(editing ? 'Parceria atualizada' : 'Parceria adicionada');
    reset(); load();
  }

  async function remove(p: Partner) {
    if (!confirm(`Remover "${p.name}" da página?`)) return;
    await fetch(`/api/partners?id=${p.id}`, { method: 'DELETE' });
    toast.success('Removida'); load();
  }

  function edit(p: Partner) {
    setForm({ name: p.name, role: p.role, link: p.link, logoUrl: p.logoUrl || '', isActive: p.isActive, order: p.order });
    setEditing(p.id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <PageHeader title="Parcerias" subtitle="As marcas que você representa. Viram um selo girando na página."
        action={!showForm && (
          <div className="flex gap-2">
            {!!items?.length && <ReorderToggle active={reorder.active} onClick={() => reorder.setActive(!reorder.active)} />}
            {!reorder.active && <Button icon={<Plus className="h-4 w-4" />} onClick={() => { reset(); setShowForm(true); }}>Nova</Button>}
          </div>
        )} />

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.form key="form" onSubmit={save} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <Card className="mb-6 flex flex-col gap-4">
              <p className="text-[15px] font-semibold text-ink">{editing ? 'Editar parceria' : 'Nova parceria'}</p>
              <Field label="Marca" htmlFor="name"><Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Kyeomi" required autoFocus /></Field>
              <Field label="Seu papel" htmlFor="role" hint="É o texto que gira em volta do selo."><Input id="role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Embaixadora oficial" required /></Field>
              <Field label="Link da loja" htmlFor="link"><Input id="link" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://kyeomi.com.br" inputMode="url" required /></Field>
              <ImageUpload label="Logo" value={form.logoUrl} onChange={url => setForm({ ...form, logoUrl: url })} shape="round" hint="Opcional. Sem logo, uso a inicial da marca." />
              <Toggle checked={form.isActive} onChange={v => setForm({ ...form, isActive: v })} label="Visível na página" />
              <div className="flex gap-2 pt-1">
                <Button type="submit" loading={saving} icon={<Check className="h-4 w-4" />}>Salvar</Button>
                <Button type="button" variant="ghost" icon={<X className="h-4 w-4" />} onClick={reset}>Cancelar</Button>
              </div>
            </Card>
          </motion.form>
        )}
      </AnimatePresence>

      {!items ? <div className="flex flex-col gap-3"><Skeleton className="h-[72px]" /></div>
      : items.length === 0 ? <EmptyState title="Nenhuma parceria ainda" body="Adicione a marca da qual você é embaixadora. Ela ganha um selo na sua página." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>Adicionar</Button>} />
      : (
        <ul className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {items.map((p, i) => (
              <Row key={p.id} muted={!p.isActive}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-champagne bg-paper-deep">
                  <SafeImg
                    src={p.logoUrl}
                    alt=""
                    className="h-full w-full object-contain p-1.5"
                    fallback={<span className="font-script text-[1.5rem] leading-none text-rose translate-y-0.5">{p.name[0]}</span>}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2"><span className="truncate text-[15.5px] font-semibold text-ink">{p.name}</span>{!p.isActive && <Tag tone="mute">oculta</Tag>}</span>
                  <span className="block truncate text-[13px] text-ink-mute">{p.role} · {p.link}</span>
                </span>
                {reorder.active ? <MoveButtons index={i} total={items.length} onMove={reorder.move} /> : (
                  <>
                    <IconButton label="Editar" onClick={() => edit(p)}><Pencil className="h-[18px] w-[18px]" /></IconButton>
                    <IconButton label="Remover" onClick={() => remove(p)} className="hover:text-rose"><Trash2 className="h-[18px] w-[18px]" /></IconButton>
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
