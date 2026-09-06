'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

// O único botão rosa-quente da página fora do cardápio: leva ao catálogo de afiliados.
export default function CatalogRibbon({ count }: { count: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div whileHover={reduce ? undefined : { y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
      <Link
        href="/catalogo"
        className="group relative flex w-full items-center justify-between overflow-hidden rounded-full bg-hot-deep px-6 py-4 text-white shadow-hot"
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <span className="flex items-center gap-3">
          <ShoppingBag className="h-5 w-5" strokeWidth={2} />
          <span className="text-[16px] font-semibold tracking-tight">Ver meu catálogo de achadinhos</span>
        </span>
        <span className="flex items-center gap-2">
          {count > 0 && <span className="tabular text-[12px] font-semibold text-white">{count}</span>}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" strokeWidth={2} />
        </span>
      </Link>
    </motion.div>
  );
}
