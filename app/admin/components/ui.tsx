'use client';

import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Vocabulário único do painel. Se o "Salvar" parecer diferente em duas telas, uma está errada.

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-hot-deep text-white shadow-hot hover:bg-hot-press disabled:hover:bg-hot-deep',
  secondary: 'bg-paper-lift text-ink border border-champagne hover:border-rose-soft hover:text-rose',
  ghost: 'bg-transparent text-ink-soft hover:bg-paper-deep hover:text-ink',
  danger: 'bg-transparent text-rose border border-rose/30 hover:bg-rose/10',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
  size?: 'md' | 'sm';
}

export function Button({ variant = 'primary', loading, icon, size = 'md', className = '', children, disabled, ...rest }: ButtonProps) {
  const h = size === 'sm' ? 'h-10 px-3.5 text-[13.5px]' : 'h-12 px-5 text-[15px]';
  return (
    <motion.button
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none ${h} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...(rest as any)}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </motion.button>
  );
}

export function IconButton({ label, className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.15 }}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-paper-deep hover:text-ink ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}

const fieldBase =
  'w-full rounded-2xl border border-champagne bg-white/80 px-4 text-[16px] text-ink placeholder:text-ink-mute transition-[border-color,box-shadow] duration-200 focus:border-hot focus:outline-none focus:ring-4 focus:ring-hot/15 disabled:opacity-60';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className = '', ...rest }, ref) {
  return <input ref={ref} className={`${fieldBase} h-12 ${className}`} {...rest} />;
});

export function Textarea({ className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldBase} py-3 leading-relaxed ${className}`} {...rest} />;
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13.5px] font-semibold text-ink">{label}</label>
      {children}
      {hint && <p className="text-[12.5px] leading-snug text-ink-mute">{hint}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex h-12 items-center gap-3 rounded-2xl px-1 text-left"
    >
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-hot-deep' : 'bg-champagne-deep'}`}>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${checked ? 'left-6' : 'left-1'}`}
        />
      </span>
      <span className="text-[15px] text-ink">{label}</span>
    </button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-champagne bg-paper-lift/90 p-5 shadow-card ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-rose/30 px-6 py-12 text-center">
      <p className="text-[16px] font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[34ch] text-[14px] leading-snug text-ink-soft">{body}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`shimmer-block rounded-2xl bg-paper-deep ${className}`} />;
}

export function Row({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-3 rounded-3xl border border-champagne bg-paper-lift/90 p-3 pl-4 shadow-card ${muted ? 'opacity-60' : ''}`}
    >
      {children}
    </motion.li>
  );
}

export function Tag({ children, tone = 'rose' }: { children: ReactNode; tone?: 'rose' | 'mute' }) {
  const c = tone === 'rose' ? 'border-rose/40 text-rose' : 'border-champagne-deep text-ink-mute';
  return <span className={`rounded-full border px-2 py-[2px] text-[10.5px] font-semibold uppercase tracking-[0.12em] ${c}`}>{children}</span>;
}
