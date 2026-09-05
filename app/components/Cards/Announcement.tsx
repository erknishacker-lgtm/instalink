'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AnnouncementProps {
  badgeName: string;
  text: string;
}

export default function Announcement({ badgeName, text }: AnnouncementProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto mb-2"
        >
          <div className="glass-card rounded-3xl px-6 py-4 flex items-start gap-4 shadow-soft">
            {badgeName && (
              <span className="shrink-0 bg-gradient-to-br from-accent-rose to-accent-warm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-2xl shadow-inner">
                {badgeName}
              </span>
            )}
            <p className="text-sm font-medium text-text-primary flex-1 leading-snug tracking-tight">
              {text}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="shrink-0 p-1 rounded-full hover:bg-accent-rose/10 text-text-secondary transition-colors"
              aria-label="Fechar anúncio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}