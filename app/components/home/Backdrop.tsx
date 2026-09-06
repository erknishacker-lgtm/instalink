'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// A foto delicada por trás do cartão. Um véu de papel blush por cima, e ela
// se move mais devagar do que o conteúdo enquanto a página rola.
export default function Backdrop({ imageUrl }: { imageUrl?: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1200], [0, reduce ? 0 : -120]);
  const scale = useTransform(scrollY, [0, 1200], [1.04, reduce ? 1.04 : 1.12]);

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden">
      {imageUrl ? (
        <motion.div
          className="absolute -inset-[6%] bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url("${imageUrl}")`, y, scale }}
        />
      ) : (
        <div className="paper-default-bg absolute inset-0" />
      )}
      {/* Véu: mais denso no meio, onde o texto passa; leve nas bordas. */}
      <div
        className="absolute inset-0"
        style={{
          background: imageUrl
            ? 'linear-gradient(180deg, rgba(251,239,242,0.62) 0%, rgba(251,239,242,0.86) 30%, rgba(251,239,242,0.9) 70%, rgba(246,225,232,0.95) 100%)'
            : 'transparent',
        }}
      />
    </div>
  );
}
