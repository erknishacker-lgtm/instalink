'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { PublicData } from '@/lib/db';
import Backdrop from '@/app/components/home/Backdrop';
import { ProductThumb } from '@/app/components/home/AchadinhosPreview';

// O catálogo: a segunda folha do cartão. Mesma grade, mesmo papel, uma vitrine.
export default function CatalogView({ data }: { data: PublicData }) {
  const reduce = useReducedMotion();
  const { config, products, partners } = data;

  return (
    <main className="paper-grain relative min-h-screen">
      <Backdrop imageUrl={config.backgroundImageUrl} />

      <div className="relative z-10 mx-auto w-full max-w-[26.5rem] px-4 pb-16 md:my-10 md:max-w-[52rem] md:rounded-[2.25rem] md:border md:border-champagne md:bg-paper/70 md:px-10 md:shadow-lift md:backdrop-blur-sm">
        <nav className="flex items-center justify-between pt-6">
          <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-champagne bg-paper-lift/80 px-4 text-[14px] font-medium text-ink hover:bg-paper-lift transition-colors">
            <ArrowLeft className="h-4 w-4" /> voltar
          </Link>
          <p className="font-script text-[1.9rem] leading-none text-rose/85">{config.name}</p>
        </nav>

        <header className="mt-10 text-center">
          <h1 className="font-script text-[3.4rem] leading-[0.9] text-ink [text-wrap:balance] md:text-[4.4rem]">
            O que eu uso e indico
          </h1>
          {partners.length > 0 && (
            <p className="mt-4 text-[14.5px] text-ink-soft [text-wrap:balance]">
              {partners[0].role} {partners[0].name}. Os links levam direto pra loja.
            </p>
          )}
          <div className="rule-champagne mx-auto mt-6 w-40" aria-hidden />
        </header>

        {products.length === 0 ? (
          <p className="mt-16 text-center text-[15px] text-ink-soft">Ainda não tem produto por aqui. Volte logo.</p>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
            {products.map((p, i) => (
              <motion.li
                key={p.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <a href={p.affiliateLink} target="_blank" rel="noopener noreferrer" className="group block">
                  <ProductThumb p={p} className="shadow-card group-hover:shadow-lift transition-shadow duration-300" />
                  <h2 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">{p.name}</h2>
                  {p.description && <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-soft">{p.description}</p>}
                  <span className="mt-2.5 inline-flex h-9 items-center gap-1.5 rounded-full bg-hot-deep px-4 text-[13px] font-semibold text-white shadow-hot transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-95">
                    Ver na loja <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        )}

        <footer className="mt-16 flex flex-col items-center gap-2">
          <div className="rule-champagne w-full" aria-hidden />
          <p className="mt-4 text-2xs uppercase tracking-[0.16em] text-ink-mute">{config.username}</p>
        </footer>
      </div>
    </main>
  );
}
