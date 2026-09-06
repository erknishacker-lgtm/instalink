'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button, Card, EmptyState, Field, IconButton, Input, PageHeader, Row, Skeleton, Tag, Textarea, Toggle } from '../components/ui';
import { MoveButtons, ReorderToggle, useReorder } from '../components/reorder';

interface Service { id: string; name: string; whatsappMessageTemplate: string; isActive: boolean; order: number; }
const empty = { name: '', whatsappMessageTemplate: '', isActive: true, order: 0 };

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() { setItems(await fetch('/api/services').then(r => r.json())); }
  useEffect(() => { load(); }, []);
  const reorder = useReorder('/api/services', items, setItems, load);
  function reset() { setForm(empty); setEditing(null); setShowForm(false); }

  function suggestMessage(name: string) {
    return name ? `Oi, tudo bem? Gostaria de agendar ${name.toLowerCase()}.` : '';
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, whatsappMessageTemplate: form.whatsappMessageTemplate || suggestMessage(form.name), order: form.order || (items?.length || 0) + 1, ...(editing ? { id: editing } : {}) };
    const res = await fetch('/api/services', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    if (!res.ok) return toast.error('Não consegui salvar. Tenta de novo.');
    toast.success(editing ? 'Tratamento atualizado' : 'Tratamento adicionado');
    reset(); load();
  }

  async function remove(s: Service) {
    if (!confirm(`Remover "${s.name}" da agenda?`)) return;
    await fetch(`/api/services?id=${s.id}`, { method: 'DELETE' });
    toast.success('Removido'); load();
  }

  async function toggleActive(s: Service) {
    await fetch('/api/services', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, isActive: !s.isActive }) });
    load();
  }

  function edit(s: Service) {
    setForm({ name: s.name, whatsappMessageTemplate: s.whatsappMessageTemplate, isActive: s.isActive, order: s.order });
    setEditing(s.id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <PageHeader title="Agenda" subtitle="Cada tratamento vira uma linha do cardápio. Um toque abre seu WhatsApp com a mensagem pronta."
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
              <p className="text-[15px] font-semibold text-ink">{editing ? 'Editar tratamento' : 'Novo tratamento'}</p>
              <Field label="Nome do tratamento" htmlFor="name"><Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Limpeza de pele" required autoFocus /></Field>
              <Field label="Mensagem que chega no seu WhatsApp" htmlFor="msg" hint="Se deixar vazio, eu monto uma a partir do nome.">
                <Textarea id="msg" rows={3} value={form.whatsappMessageTemplate} onChange={e => setForm({ ...form, whatsappMessageTemplate: e.target.value })} placeholder={suggestMessage(form.name) || 'Oi, tudo bem? Gostaria de agendar…'} />
              </Field>
              <Toggle checked={form.isActive} onChange={v => setForm({ ...form, isActive: v })} label="Visível na página" />
              <div className="flex gap-2 pt-1">
                <Button type="submit" loading={saving} icon={<Check className="h-4 w-4" />}>Salvar</Button>
                <Button type="button" variant="ghost" icon={<X className="h-4 w-4" />} onClick={reset}>Cancelar</Button>
              </div>
            </Card>
          </motion.form>
        )}
      </AnimatePresence>

      {!items ? <div className="flex flex-col gap-3"><Skeleton className="h-[72px]" /><Skeleton className="h-[72px]" /><Skeleton className="h-[72px]" /></div>
      : items.length === 0 ? <EmptyState title="A agenda está vazia" body="Cadastre os tratamentos que você oferece. Eles aparecem logo abaixo da sua foto." action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>Adicionar o primeiro</Button>} />
      : (
        <ul className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {items.map((s, i) => (
              <Row key={s.id} muted={!s.isActive}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hot-deep text-white"><FaWhatsapp className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2"><span className="truncate text-[15.5px] font-semibold text-ink">{s.name}</span>{!s.isActive && <Tag tone="mute">oculto</Tag>}</span>
                  <span className="block truncate text-[13px] text-ink-mute">{s.whatsappMessageTemplate}</span>
                </span>
                {reorder.active ? <MoveButtons index={i} total={items.length} onMove={reorder.move} /> : (
                  <>
                    <IconButton label={s.isActive ? 'Ocultar' : 'Mostrar'} onClick={() => toggleActive(s)}>
                      <span className={`relative h-5 w-9 rounded-full transition-colors ${s.isActive ? 'bg-hot-deep' : 'bg-champagne-deep'}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${s.isActive ? 'left-[18px]' : 'left-0.5'}`} /></span>
                    </IconButton>
                    <IconButton label="Editar" onClick={() => edit(s)}><Pencil className="h-[18px] w-[18px]" /></IconButton>
                    <IconButton label="Remover" onClick={() => remove(s)} className="hover:text-rose"><Trash2 className="h-[18px] w-[18px]" /></IconButton>
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
