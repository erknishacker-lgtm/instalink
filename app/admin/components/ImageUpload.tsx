'use client';

import { useRef, useState } from 'react';
import { Camera, Link as LinkIcon, Loader2, X } from 'lucide-react';
import SafeImg from '@/app/components/SafeImg';
import { Button, Input } from './ui';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
  shape?: 'round' | 'square' | 'wide';
  required?: boolean;
}

const shapes = {
  round: 'h-28 w-28 rounded-full',
  square: 'h-28 w-28 rounded-2xl',
  wide: 'h-32 w-full rounded-2xl',
};

// Pensado pro celular: um toque abre a câmera/galeria. Colar link é o caminho secundário.
export default function ImageUpload({ value, onChange, label, hint, shape = 'square', required }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [pasting, setPasting] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      // Se o servidor cair antes de responder JSON, a resposta vem vazia ou em HTML.
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Falha no upload (${res.status})`);
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13.5px] font-semibold text-ink">{label}</span>
      <div className={`flex gap-4 ${shape === 'wide' ? 'flex-col' : 'items-center'}`}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label={value ? 'Trocar imagem' : 'Enviar imagem'}
          className={`group relative shrink-0 overflow-hidden border border-champagne bg-paper-deep ${shapes[shape]} focus:outline-none focus-visible:ring-4 focus-visible:ring-hot/20`}
        >
          <SafeImg
            src={value}
            alt=""
            className="h-full w-full object-cover"
            fallback={
              <span className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-ink-mute">
                <Camera className="h-6 w-6" />
                <span className="text-[11px] font-medium leading-tight">{value ? 'não carregou' : 'enviar'}</span>
              </span>
            }
          />
          <span className={`absolute inset-0 flex items-center justify-center bg-ink/45 text-white transition-opacity duration-200 ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
          </span>
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" icon={<Camera className="h-4 w-4" />} loading={uploading} onClick={() => inputRef.current?.click()}>
              {value ? 'Trocar foto' : 'Enviar foto'}
            </Button>
            <Button type="button" variant="ghost" size="sm" icon={pasting ? <X className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />} onClick={() => setPasting((v) => !v)}>
              {pasting ? 'fechar' : 'colar link'}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" icon={<X className="h-4 w-4" />} onClick={() => onChange('')}>
                remover
              </Button>
            )}
          </div>
          {pasting && (
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." inputMode="url" autoFocus required={required && !value} />
          )}
          {hint && !error && <p className="text-[12.5px] leading-snug text-ink-mute">{hint}</p>}
          {error && <p className="text-[13px] font-medium text-rose">{error}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
