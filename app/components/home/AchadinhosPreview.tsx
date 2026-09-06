'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import SafeImg from '../SafeImg';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  affiliateLink: string;
}

export function ProductThumb({ p, className = '' }: { p: { name: string; imageUrl: string }; className?: string }) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl bg-paper-deep ${className}`}>
      <SafeImg
        src={p.imageUrl}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-script text-[2.6rem] text-rose/60 translate-y-1">{p.name.trim()[0] || '·'}</span>
          </div>
        }
      />
    </div>
  );
}

// Uma prévia horizontal dos achadinhos; o catálogo completo tem página própria.
export default function AchadinhosPreview({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const shown = products.slice(0, 6);
  return (
    <section aria-labelledby="achadinhos" className="w-full">
      <div className="flex items-baseline justify-between px-1">
        <h2 id="achadinhos" className="card-label">Achadinhos</h2>
        <Link href="/catalogo" className="inline-flex items-center gap-0.5 text-[13px] font-medium text-rose underline decoration-rose/40 underline-offset-4 hover:decoration-rose">
          ver todos <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ul className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shown.map((p) => (
          <li key={p.id} className="w-[38%] min-w-[128px] shrink-0 snap-start">
            <motion.a
              href={p.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              className="group block"
            >
              <ProductThumb p={p} className="shadow-card" />
              <p className="mt-2 line-clamp-2 px-0.5 text-[13.5px] font-medium leading-snug text-ink">{p.name}</p>
            </motion.a>
          </li>
        ))}
      </ul>
    </section>
  );
}
