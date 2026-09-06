'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Link2, CalendarDays, ShoppingBag, Handshake, Settings, LogOut, Eye, MoreHorizontal, X } from 'lucide-react';

const primary = [
  { href: '/admin', label: 'Início', icon: Home },
  { href: '/admin/links', label: 'Links', icon: Link2 },
  { href: '/admin/services', label: 'Agenda', icon: CalendarDays },
  { href: '/admin/products', label: 'Achadinhos', icon: ShoppingBag },
];
const more = [
  { href: '/admin/partners', label: 'Parcerias', icon: Handshake },
  { href: '/admin/settings', label: 'Ajustes', icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
}

export default function AdminNav({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin-login');
    router.refresh();
  }

  const moreActive = more.some((m) => isActive(pathname, m.href));

  return (
    <>
      {/* Desktop: sidebar. */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-champagne bg-paper-deep/60 px-4 py-6 md:flex">
        <div className="px-3">
          <p className="font-script text-[2.1rem] leading-none text-rose">{siteName}</p>
          <p className="mt-1.5 text-2xs uppercase tracking-[0.16em] text-ink-mute">painel da página</p>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {[...primary, ...more].map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-11 items-center gap-3 rounded-full px-4 text-[14.5px] font-medium transition-colors duration-200
                  ${active ? 'text-white' : 'text-ink-soft hover:bg-paper-lift hover:text-ink'}`}
              >
                {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-hot-deep shadow-hot" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <item.icon className="relative h-[18px] w-[18px]" strokeWidth={2} />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-1 border-t border-champagne pt-4">
          <a href="/" target="_blank" rel="noopener" className="flex h-11 items-center gap-3 rounded-full px-4 text-[14.5px] font-medium text-rose hover:bg-paper-lift transition-colors">
            <Eye className="h-[18px] w-[18px]" /> Ver minha página
          </a>
          <button onClick={logout} className="flex h-11 items-center gap-3 rounded-full px-4 text-left text-[14.5px] font-medium text-ink-soft hover:bg-paper-lift hover:text-ink transition-colors">
            <LogOut className="h-[18px] w-[18px]" /> Sair
          </button>
        </div>
      </aside>

      {/* Celular: barra de abas fixa embaixo, na altura do dedão. */}
      <nav
        aria-label="Seções do painel"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-champagne bg-paper-lift/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <ul className="grid grid-cols-5">
          {primary.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold" aria-current={active ? 'page' : undefined}>
                  <span className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors duration-200 ${active ? 'bg-hot-deep text-white shadow-hot' : 'text-ink-soft'}`}>
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className={active ? 'text-ink' : 'text-ink-mute'}>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button onClick={() => setOpen(true)} className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold" aria-expanded={open} aria-haspopup="dialog">
              <span className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${moreActive ? 'bg-hot-deep text-white shadow-hot' : 'text-ink-soft'}`}>
                <MoreHorizontal className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className={moreActive ? 'text-ink' : 'text-ink-mute'}>Mais</span>
            </button>
          </li>
        </ul>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Mais opções"
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button aria-label="Fechar" className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute inset-x-3 bottom-3 rounded-[2rem] border border-champagne bg-paper-lift p-3 shadow-lift"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-3 pt-1 pb-2">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-mute">Mais</p>
                <button onClick={() => setOpen(false)} aria-label="Fechar" className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-paper-deep"><X className="h-5 w-5" /></button>
              </div>
              <ul className="flex flex-col">
                {more.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setOpen(false)} className="flex h-14 items-center gap-3 rounded-2xl px-3 text-[16px] font-medium text-ink active:bg-paper-deep">
                      <item.icon className="h-5 w-5 text-rose" /> {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href="/" target="_blank" rel="noopener" className="flex h-14 items-center gap-3 rounded-2xl px-3 text-[16px] font-medium text-ink active:bg-paper-deep">
                    <Eye className="h-5 w-5 text-rose" /> Ver minha página
                  </a>
                </li>
                <li>
                  <button onClick={logout} className="flex h-14 w-full items-center gap-3 rounded-2xl px-3 text-left text-[16px] font-medium text-ink-soft active:bg-paper-deep">
                    <LogOut className="h-5 w-5" /> Sair
                  </button>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
