'use client';

import { useEffect, useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { FaSave } from 'react-icons/fa';

interface SiteConfig {
  name: string;
  username: string;
  profilePictureUrl: string;
  announcementBadge: string;
  announcementText: string;
  whatsappPhone: string;
}

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/site').then(r => r.json()).then(setConfig);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    await fetch('/api/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!config) return <div className="text-pink-300">Carregando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#4A1942] mb-6">Configurações do Site</h1>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-pink-100 shadow-sm space-y-4 max-w-2xl">
        <h2 className="text-lg font-semibold text-[#4A1942]">Perfil</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#4A1942] mb-1">Nome</label>
            <input value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A1942] mb-1">Username</label>
            <input value={config.username} onChange={e => setConfig({ ...config, username: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" required />
          </div>
          <div className="md:col-span-2">
            <ImageUpload label="Foto de Perfil" value={config.profilePictureUrl} onChange={url => setConfig({ ...config, profilePictureUrl: url })} />
          </div>
        </div>

        <hr className="border-pink-100 my-4" />

        <h2 className="text-lg font-semibold text-[#4A1942]">Anúncio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#4A1942] mb-1">Badge</label>
            <input value={config.announcementBadge} onChange={e => setConfig({ ...config, announcementBadge: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A1942] mb-1">Texto</label>
            <input value={config.announcementText} onChange={e => setConfig({ ...config, announcementText: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" />
          </div>
        </div>

        <hr className="border-pink-100 my-4" />

        <h2 className="text-lg font-semibold text-[#4A1942]">WhatsApp</h2>
        <div>
          <label className="block text-sm font-medium text-[#4A1942] mb-1">Número (com código do país)</label>
          <input value={config.whatsappPhone} onChange={e => setConfig({ ...config, whatsappPhone: e.target.value })} className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50" placeholder="5511999999999" required />
          <p className="text-xs text-pink-400 mt-1">Formato: 55 + DDD + número, sem espaços ou traços</p>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#F9A8D4] to-[#EC4899] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
            <FaSave className="text-sm" /> Salvar Configurações
          </button>
          {saved && <span className="text-green-500 text-sm font-medium">✓ Salvo com sucesso!</span>}
        </div>
      </form>
    </div>
  );
}