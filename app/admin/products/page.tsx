'use client';

import { useEffect, useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  affiliateLink: string;
  description?: string;
  isActive: boolean;
  order: number;
}

const emptyProduct = { name: '', imageUrl: '', affiliateLink: '', description: '', isActive: true, order: 0 };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch('/api/products');
    setProducts(await res.json());
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm(emptyProduct);
    setEditing(null);
    setShowForm(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing } : form;
    await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este produto?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    load();
  }

  function startEdit(product: Product) {
    setForm({
      name: product.name,
      imageUrl: product.imageUrl,
      affiliateLink: product.affiliateLink,
      description: product.description || '',
      isActive: product.isActive,
      order: product.order,
    });
    setEditing(product.id);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#4A1942]">Gerenciar Achadinhos</h1>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white rounded-lg hover:opacity-90 transition-opacity">
            <FaPlus className="text-sm" /> Novo Produto
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-pink-100 shadow-sm mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#4A1942]">{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Nome do Produto</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" required />
            </div>
            <ImageUpload label="Imagem do Produto" value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} />
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Link de Afiliado</label>
              <input value={form.affiliateLink} onChange={e => setForm({ ...form, affiliateLink: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" placeholder="https://shopee.com.br/..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A1942] mb-1">Descrição</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${product.isActive ? 'border-pink-100' : 'border-gray-200 opacity-60'}`}>
            <div className="h-40 bg-pink-50 flex items-center justify-center overflow-hidden">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem')} />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-[#4A1942]">{product.name}</h3>
                {!product.isActive && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Inativo</span>}
              </div>
              {product.description && <p className="text-xs text-pink-400 mb-3 line-clamp-2">{product.description}</p>}
              <div className="flex gap-2">
                <button onClick={() => startEdit(product)} className="flex-1 py-1.5 text-sm text-pink-500 border border-pink-200 rounded-lg hover:bg-pink-50 flex items-center justify-center gap-1"><FaEdit /> Editar</button>
                <button onClick={() => handleDelete(product.id)} className="py-1.5 px-3 text-sm text-red-400 border border-red-200 rounded-lg hover:bg-red-50"><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-center text-pink-300 py-8 col-span-full">Nenhum produto cadastrado ainda.</p>}
      </div>
    </div>
  );
}