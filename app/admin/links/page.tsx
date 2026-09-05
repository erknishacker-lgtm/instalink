'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface UsefulLink {
  id: string;
  title: string;
  link: string;
  isNew?: boolean;
  color: string | { start: string; end: string };
  icon?: string;
  order: number;
}

const emptyLink = { title: '', link: '', isNew: false, color: { start: '#F9A8D4', end: '#EC4899' }, order: 0 };

export default function AdminLinksPage() {
  const [links, setLinks] = useState<UsefulLink[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLink);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch('/api/useful-links');
    setLinks(await res.json());
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm(emptyLink);
    setEditing(null);
    setShowForm(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing } : form;
    await fetch('/api/useful-links', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este link?')) return;
    await fetch(`/api/useful-links?id=${id}`, { method: 'DELETE' });
    load();
  }

  function startEdit(link: UsefulLink) {
    setForm({
      title: link.title,
      link: link.link,
      isNew: link.isNew || false,
      color: typeof link.color === 'string' ? { start: link.color, end: link.color } : link.color,
      order: link.order,
    });
    setEditing(link.id);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#4A1942]">Gerenciar Links</h1>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white rounded-lg hover:opacity-90 transition-opacity">
            <FaPlus className="text-sm" /> Novo Link
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-pink-100 shadow-sm mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#4A1942]">{editing ? 'Editar Link' : 'Novo Link'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Título</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">URL</label>
              <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Cor Início</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={typeof form.color === 'string' ? form.color : form.color.start} onChange={e => setForm({ ...form, color: { start: e.target.value, end: typeof form.color === 'string' ? e.target.value : form.color.end } })} className="h-10 w-14 rounded cursor-pointer" />
                <span className="text-xs text-pink-400">{typeof form.color === 'string' ? form.color : form.color.start}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Cor Fim</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={typeof form.color === 'string' ? form.color : form.color.end} onChange={e => setForm({ ...form, color: { start: typeof form.color === 'string' ? form.color : form.color.start, end: e.target.value } })} className="h-10 w-14 rounded cursor-pointer" />
                <span className="text-xs text-pink-400">{typeof form.color === 'string' ? form.color : form.color.end}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Ordem</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isNew || false} onChange={e => setForm({ ...form, isNew: e.target.checked })} className="rounded border-pink-300 text-pink-500 focus:ring-pink-400" />
                <span className="text-sm text-[#4A1942]">Marcar como "Novo"</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white rounded-lg hover:opacity-90"><FaSave className="text-sm" /> Salvar</button>
            <button type="button" onClick={resetForm} className="flex items-center gap-2 px-4 py-2 border border-pink-200 text-[#4A1942] rounded-lg hover:bg-pink-50"><FaTimes className="text-sm" /> Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {links.map(link => (
          <div key={link.id} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(to right, ${typeof link.color === 'string' ? link.color : link.color.start}, ${typeof link.color === 'string' ? link.color : link.color.end})` }}>
                {link.order}
              </div>
              <div>
                <p className="font-medium text-[#4A1942]">{link.title}</p>
                <p className="text-xs text-pink-400 truncate max-w-xs">{link.link}</p>
              </div>
              {link.isNew && <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full font-medium">Novo</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(link)} className="p-2 text-pink-400 hover:bg-pink-50 rounded-lg"><FaEdit /></button>
              <button onClick={() => handleDelete(link.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FaTrash /></button>
            </div>
          </div>
        ))}
        {links.length === 0 && <p className="text-center text-pink-300 py-8">Nenhum link cadastrado ainda.</p>}
      </div>
    </div>
  );
}