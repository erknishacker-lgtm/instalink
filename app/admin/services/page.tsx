'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface Service {
  id: string;
  name: string;
  whatsappMessageTemplate: string;
  isActive: boolean;
  order: number;
}

const emptyService = { name: '', whatsappMessageTemplate: '', isActive: true, order: 0 };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyService);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch('/api/services');
    setServices(await res.json());
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm(emptyService);
    setEditing(null);
    setShowForm(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing } : form;
    await fetch('/api/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este serviço?')) return;
    await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    load();
  }

  function startEdit(service: Service) {
    setForm({
      name: service.name,
      whatsappMessageTemplate: service.whatsappMessageTemplate,
      isActive: service.isActive,
      order: service.order,
    });
    setEditing(service.id);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#4A1942]">Gerenciar Serviços</h1>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white rounded-lg hover:opacity-90 transition-opacity">
            <FaPlus className="text-sm" /> Novo Serviço
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-pink-100 shadow-sm mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#4A1942]">{editing ? 'Editar Serviço' : 'Novo Serviço'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Nome do Serviço</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" placeholder="Ex: Massagem Relaxante" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Mensagem WhatsApp</label>
              <textarea value={form.whatsappMessageTemplate} onChange={e => setForm({ ...form, whatsappMessageTemplate: e.target.value })} rows={3} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" placeholder="Oi, tudo bem? Gostaria de agendar..." required />
              <p className="text-xs text-pink-400 mt-1">Esta mensagem será enviada automaticamente via WhatsApp</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A1942] mb-1">Ordem</label>
                <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded border-pink-300 text-pink-500 focus:ring-pink-400" />
                  <span className="text-sm text-[#4A1942]">Ativo</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white rounded-lg hover:opacity-90"><FaSave className="text-sm" /> Salvar</button>
            <button type="button" onClick={resetForm} className="flex items-center gap-2 px-4 py-2 border border-pink-200 text-[#4A1942] rounded-lg hover:bg-pink-50"><FaTimes className="text-sm" /> Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className={`bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between ${service.isActive ? 'border-pink-100' : 'border-gray-200 opacity-60'}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-300 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                {service.order}
              </div>
              <div>
                <p className="font-medium text-[#4A1942]">{service.name}</p>
                <p className="text-xs text-pink-400 truncate max-w-xs">{service.whatsappMessageTemplate}</p>
              </div>
              {!service.isActive && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">Inativo</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(service)} className="p-2 text-pink-400 hover:bg-pink-50 rounded-lg"><FaEdit /></button>
              <button onClick={() => handleDelete(service.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FaTrash /></button>
            </div>
          </div>
        ))}
        {services.length === 0 && <p className="text-center text-pink-300 py-8">Nenhum serviço cadastrado ainda.</p>}
      </div>
    </div>
  );
}