'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, MessageCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  whatsappMessageTemplate: string;
}

interface SchedulingButtonProps {
  services: Service[];
  whatsappPhone: string;
}

export default function SchedulingButton({ services, whatsappPhone }: SchedulingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleServiceClick(service: Service) {
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(service.whatsappMessageTemplate)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  }

  if (services.length === 0) return null;

  return (
    <div className="relative w-full max-w-md" ref={ref}>
      <motion.button
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full glass-card rounded-3xl px-6 py-5 flex items-center justify-between shadow-card hover:shadow-soft transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-rose to-accent-warm flex items-center justify-center text-white shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="font-semibold text-text-primary">Agendar Serviço</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="absolute top-full left-0 right-0 mt-3 glass-card rounded-3xl shadow-soft border border-border-subtle overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border-subtle bg-accent-soft/30">
              <p className="text-xs font-medium text-text-secondary text-center uppercase tracking-wider">
                Escolha um serviço
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="w-full px-4 py-3 flex items-center gap-3 rounded-xl hover:bg-accent-soft/50 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-rose/10 flex items-center justify-center text-accent-rose shrink-0 group-hover:bg-accent-rose group-hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-text-primary group-hover:text-accent-rose transition-colors">
                    {service.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}