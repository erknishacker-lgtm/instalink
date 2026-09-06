'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button, Field, Input } from '../admin/components/ui';

export default function AdminLoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const router = useRouter();
  const reduce = useReducedMotion();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user, pass }) });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
        return;
      }
      setError('Usuário ou senha não conferem.');
      setShake((n) => n + 1);
    } catch {
      setError('Sem conexão. Tenta de novo em instantes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="paper-grain relative flex min-h-screen items-center justify-center px-4 py-10">
      <div aria-hidden className="paper-default-bg fixed inset-0 z-0" />

      <motion.div
        key={shake}
        animate={shake && !reduce ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[24rem]"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2.25rem] border border-champagne bg-paper-lift/85 p-7 shadow-lift backdrop-blur-sm"
        >
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne bg-paper-deep text-rose">
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="mt-5 font-script text-[3rem] leading-none text-ink">Bem-vinda</h1>
            <p className="mt-2 text-[14px] text-ink-soft">Entre pra editar sua página.</p>
          </div>

          <form onSubmit={submit} className="mt-7 flex flex-col gap-4" noValidate>
            <Field label="Usuário" htmlFor="user">
              <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" autoCapitalize="none" required autoFocus />
            </Field>
            <Field label="Senha" htmlFor="pass">
              <div className="relative">
                <Input id="pass" type={show ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" required className="pr-12" />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-mute hover:bg-paper-deep hover:text-ink"
                >
                  {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </Field>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="flex items-center gap-2 rounded-2xl bg-rose/10 px-3.5 py-2.5 text-[13.5px] font-medium text-rose">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </motion.p>
            )}

            <Button type="submit" loading={loading} className="mt-1 w-full" icon={<ArrowRight className="h-4 w-4" />}>
              {loading ? 'Entrando' : 'Entrar'}
            </Button>
          </form>
        </motion.div>

        <p className="mt-6 text-center text-2xs uppercase tracking-[0.16em] text-ink-mute">só você tem essa senha</p>
      </motion.div>
    </main>
  );
}
