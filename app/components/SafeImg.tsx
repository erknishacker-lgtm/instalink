'use client';

import { useEffect, useState, type ImgHTMLAttributes, type ReactNode } from 'react';

// Uma imagem que, se não carregar, mostra o que vier em `fallback` em vez do ícone quebrado.
export default function SafeImg({ src, fallback, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { fallback: ReactNode }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => { setFailed(!src); }, [src]);
  if (failed) return <>{fallback}</>;
  return <img src={src} onError={() => setFailed(true)} {...rest} />;
}
