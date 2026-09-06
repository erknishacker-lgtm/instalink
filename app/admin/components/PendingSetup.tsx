'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ImageOff } from 'lucide-react';

export interface PendingItem { label: string; href: string; }

// A página nunca deve parecer pronta enquanto ainda está usando substitutos.
// Quem pode resolver isso é ela, então o aviso mora no painel, não no site.
export default function PendingSetup({ items }: { items: PendingItem[] }) {
  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          aria-labelledby="pendencias"
          className="mb-6 overflow-hidden rounded-3xl border border-dashed border-rose/40 bg-paper-lift/70 p-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-pale text-rose">
              <ImageOff className="h-4 w-4" aria-hidden />
            </span>
            <h2 id="pendencias" className="text-[14.5px] font-semibold text-ink">
              Sua página ainda está usando imagens provisórias
            </h2>
          </div>
          <ul className="mt-3 flex flex-col">
            {items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex h-12 items-center gap-2 rounded-xl px-2 text-[14.5px] text-ink-soft transition-colors hover:bg-paper-deep/60 hover:text-ink active:bg-paper-deep"
                >
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-rose" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
