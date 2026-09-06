'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

interface Service {
  id: string;
  name: string;
  whatsappMessageTemplate: string;
}

interface ServiceMenuProps {
  services: Service[];
  whatsappPhone: string;
}

// O cardápio. Cada linha é um toque: a mensagem "se escreve" na linha e o WhatsApp abre.
export default function ServiceMenu({ services, whatsappPhone }: ServiceMenuProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  function waUrl(s: Service) {
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(s.whatsappMessageTemplate)}`;
  }

  function choose(s: Service) {
    const url = waUrl(s);
    if (reduce || active) {
      window.open(url, '_blank', 'noopener');
      return;
    }
    setActive(s.id);
    setTyped('');
    const text = s.whatsappMessageTemplate;
    const perChar = Math.min(28, Math.max(12, 900 / Math.max(text.length, 1)));
    let i = 0;
    const tick = () => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i < text.length) {
        timer.current = window.setTimeout(tick, perChar);
      } else {
        timer.current = window.setTimeout(() => {
          window.open(url, '_blank', 'noopener');
          setActive(null);
          setTyped('');
        }, 420);
      }
    };
    timer.current = window.setTimeout(tick, 80);
  }

  if (services.length === 0) return null;

  return (
    <section aria-labelledby="agende" className="w-full">
      <div className="flex items-baseline justify-between px-1">
        <h2 id="agende" className="card-label">Agende pelo WhatsApp</h2>
        <span className="text-2xs tracking-[0.14em] uppercase text-ink-mute">toque no tratamento</span>
      </div>

      <ul className="mt-3 divide-y divide-champagne/70">
        {services.map((s, i) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => choose(s)}
                aria-label={`Agendar ${s.name} pelo WhatsApp`}
                className={`group flex w-full items-end gap-0 px-1 py-4 text-left transition-colors duration-300 ease-out rounded-lg
                  ${isActive ? 'bg-paper-deep/70' : 'hover:bg-paper-lift/70 active:bg-paper-deep/70'}`}
              >
                <span className="text-[17px] font-medium leading-tight text-ink group-hover:text-rose transition-colors duration-200">
                  {s.name}
                </span>
                <span aria-hidden className="leader text-rose" />
                <motion.span
                  aria-hidden
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-hot
                    ${isActive ? 'bg-hot-press' : 'bg-hot-deep'}`}
                  whileTap={reduce ? undefined : { scale: 0.9 }}
                  animate={isActive && !reduce ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <FaWhatsapp className="h-[18px] w-[18px]" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key="typing"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-2 pb-4 text-[14px] leading-relaxed text-ink-soft" aria-live="polite">
                      <span aria-hidden className="mr-1.5 inline-block h-[7px] w-[7px] rounded-full bg-wa align-[1px]" />
                      {typed}
                      <span className="ml-0.5 inline-block w-[1px] h-[1em] align-[-2px] bg-hot animate-caret" />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {i === services.length - 1 && <div className="rule-champagne mt-1" aria-hidden />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
