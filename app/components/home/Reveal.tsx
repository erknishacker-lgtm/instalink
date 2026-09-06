'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// As cartas não caem todas do mesmo jeito na mesa. Cada seção tem o gesto que
// combina com o que ela é: o cardápio sobe, a fita assenta com peso, o selo
// chega girando, a vitrine desliza de lado.
export type RevealGesture = 'rise' | 'settle' | 'drift' | 'turn';

const ease = [0.16, 1, 0.3, 1] as const;

const gestures: Record<RevealGesture, Variants> = {
  // Sobe e entra em foco: o gesto padrão de uma linha de texto assentando.
  rise: {
    hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
    shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
  },
  // Cai com peso e quica de leve: para a fita rosa, o objeto mais pesado da página.
  settle: {
    hidden: { opacity: 0, y: -14, scaleX: 0.94 },
    shown: {
      opacity: 1,
      y: 0,
      scaleX: 1,
      transition: { type: 'spring', stiffness: 380, damping: 26, mass: 0.9 },
    },
  },
  // Entra deslizando da direita: a vitrine é horizontal, então o gesto também é.
  drift: {
    hidden: { opacity: 0, x: 28 },
    shown: { opacity: 1, x: 0, transition: { duration: 0.75, ease } },
  },
  // Chega girando e assentando, como um selo carimbado no papel.
  turn: {
    hidden: { opacity: 0, scale: 0.9, rotate: -7 },
    shown: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.8, ease } },
  },
};

export default function Reveal({
  children,
  gesture = 'rise',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  gesture?: RevealGesture;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={gestures[gesture]}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
