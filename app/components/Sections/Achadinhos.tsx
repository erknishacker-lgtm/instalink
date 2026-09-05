'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  affiliateLink: string;
  description?: string;
}

interface AchadinhosProps {
  products: Product[];
}

export default function Achadinhos({ products }: AchadinhosProps) {
  if (products.length === 0) return null;

  return (
    <section className="w-full max-w-2xl mx-auto mt-10">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-rose to-accent-warm flex items-center justify-center text-white shadow-sm">
          <ShoppingBag className="w-4.5 h-4.5" />
        </div>
        <h2 className="font-serif text-xl font-bold text-text-primary tracking-tight">
          Meus Achadinhos
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-2">
        {products.map((product, index) => (
          <motion.a
            key={product.id}
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.38 }}
            whileHover={{ y: -4 }}
            className="glass-card group rounded-3xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 block"
          >
            <div className="aspect-square bg-accent-soft/50 overflow-hidden relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="%23f0f0f0"%3E%3Crect width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ccc" font-family="sans-serif" font-size="14"%3EProduto%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 transition-colors duration-300" />
              <div className="absolute top-3 right-3 w-8 h-8 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-accent-rose shadow-sm opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
                <ExternalLink className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-text-primary text-sm leading-snug line-clamp-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}