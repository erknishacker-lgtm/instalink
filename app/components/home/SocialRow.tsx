'use client';

import { motion } from 'framer-motion';
import { iconMap } from '@/app/icons';
import type { SocialLink } from '@/lib/types';

export default function SocialRow({ links }: { links: SocialLink[] }) {
  const activeLinks = links.filter((link) => link.isActive && link.link);
  if (activeLinks.length === 0) return null;
  return (
    <section aria-labelledby="redes" className="w-full">
      <h2 id="redes" className="card-label px-1">Me acompanhe</h2>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-5">
        {activeLinks.map((l) => {
          const Icon = iconMap[l.icon] || iconMap.FaLink;
          const handle = l.username ? (l.username.startsWith('@') ? l.username : `@${l.username}`) : l.title;
          return (
            <li key={l.id}>
              <motion.a
                href={l.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l.title} ${handle}`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="group flex w-[76px] flex-col items-center gap-2"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-champagne bg-paper-lift text-rose shadow-card transition-colors duration-200 group-hover:bg-rose group-hover:text-white group-hover:border-rose">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="max-w-full truncate text-[12px] text-ink-soft">{handle}</span>
              </motion.a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
