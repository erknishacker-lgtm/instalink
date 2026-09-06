'use client';

import { ArrowUpRight } from 'lucide-react';
import { iconMap } from '@/app/icons';

interface UsefulLink {
  id: string;
  title: string;
  link: string;
  isNew?: boolean;
  icon?: string;
}

// Links úteis como linhas do mesmo cardápio: título, pontilhado, seta.
export default function LinkLines({ links }: { links: UsefulLink[] }) {
  if (links.length === 0) return null;
  return (
    <section aria-labelledby="links" className="w-full">
      <h2 id="links" className="card-label px-1">Links</h2>
      <ul className="mt-3 divide-y divide-champagne/70">
        {links.map((l) => {
          const Icon = l.icon ? iconMap[l.icon] : undefined;
          return (
            <li key={l.id}>
              <a
                href={l.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-end px-1 py-4 rounded-lg transition-colors duration-200 hover:bg-paper-lift/70 active:bg-paper-deep/70"
              >
                <span className="flex items-center gap-2.5 text-[17px] font-medium leading-tight text-ink group-hover:text-rose transition-colors">
                  {Icon && <Icon className="h-4 w-4 text-rose/80" />}
                  {l.title}
                  {l.isNew && (
                    <span className="rounded-full border border-rose/40 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.12em] text-rose">
                      novo
                    </span>
                  )}
                </span>
                <span aria-hidden className="leader text-rose" />
                <ArrowUpRight className="mb-[2px] h-[18px] w-[18px] shrink-0 text-rose transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
