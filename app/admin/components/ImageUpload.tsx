'use client';

import { useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no upload');
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#4A1942] mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-pink-50/50"
          placeholder="https://... ou envie uma imagem"
          required
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
        >
          <FaUpload className="text-sm" /> {uploading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {value && (
        <img src={value} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border border-pink-100" onError={(e) => (e.currentTarget.style.display = 'none')} />
      )}
    </div>
  );
}
